from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import and_
from typing import List, Optional
from database.db import get_db
from models import Movie, Genre, Rating
from schemas import (
    MovieCreate, MovieUpdate, MovieResponse, MovieList, MovieSummary,
    GenreResponse, RatingResponse, RatingCreate, RatingUpdate
)
from utils.logging import logger

router = APIRouter(
    prefix="/movies",
    tags=["movies"]
)


@router.get("/", response_model=MovieList)
async def get_movies(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(50, ge=1, le=100, description="Items per page"),
    title: Optional[str] = Query(None, description="Filter by title (partial match)"),
    year: Optional[int] = Query(None, description="Filter by year"),
    genre: Optional[str] = Query(None, description="Filter by genre"),
    min_rating: Optional[float] = Query(None, ge=0, le=10, description="Minimum rating"),
    max_rating: Optional[float] = Query(None, ge=0, le=10, description="Maximum rating"),
    db: Session = Depends(get_db)
):
    """Get all movies with pagination and filtering"""
    query = db.query(Movie).options(
        joinedload(Movie.genres),
        joinedload(Movie.rating)
    )
    
    # Apply filters
    if title:
        query = query.filter(Movie.title.ilike(f"%{title}%"))
    if year:
        query = query.filter(Movie.year == year)
    if genre:
        query = query.join(Genre).filter(Genre.genre.ilike(f"%{genre}%"))
    if min_rating is not None or max_rating is not None:
        query = query.join(Rating)
        if min_rating is not None:
            query = query.filter(Rating.rating >= min_rating)
        if max_rating is not None:
            query = query.filter(Rating.rating <= max_rating)

    # Get total count
    total = query.count()
    
    # Apply pagination
    offset = (page - 1) * page_size
    movies = query.offset(offset).limit(page_size).all()
    
    # Convert to MovieSummary format
    movie_summaries = []
    for movie in movies:
        summary = MovieSummary(
            id=movie.id,
            title=movie.title,
            year=movie.year,
            duration=movie.duration,
            average_rating=movie.rating.rating if movie.rating else None,
            vote_count=movie.rating.vote_count if movie.rating else None,
            genres=[g.genre for g in movie.genres]
        )
        movie_summaries.append(summary)
    
    return MovieList(
        movies=movie_summaries,
        total=total,
        page=page,
        page_size=page_size
    )


@router.get("/{movie_id}", response_model=MovieResponse)
async def get_movie(movie_id: int, db: Session = Depends(get_db)):
    """Get a movie by ID with full details"""
    movie = db.query(Movie).options(
        joinedload(Movie.genres),
        joinedload(Movie.rating)
    ).filter(Movie.id == movie_id).first()
    
    if movie is None:
        raise HTTPException(status_code=404, detail="Movie not found")
    return movie


@router.post("/", response_model=MovieResponse, status_code=201)
async def create_movie(movie_data: MovieCreate, db: Session = Depends(get_db)):
    """Create a new movie with optional genres and rating"""
    # Create the movie
    db_movie = Movie(
        title=movie_data.title,
        year=movie_data.year,
        duration=movie_data.duration
    )
    db.add(db_movie)
    db.flush()  # Flush to get the ID
    
    # Add genres
    if movie_data.genres:
        for genre_name in movie_data.genres:
            genre = Genre(movie_id=db_movie.id, genre=genre_name)
            db.add(genre)
    
    # Add rating
    if movie_data.rating:
        rating = Rating(
            movie_id=db_movie.id,
            rating=movie_data.rating.rating,
            vote_count=movie_data.rating.vote_count
        )
        db.add(rating)
    
    db.commit()
    db.refresh(db_movie)
    
    # Return the movie with all relationships
    return db.query(Movie).options(
        joinedload(Movie.genres),
        joinedload(Movie.rating)
    ).filter(Movie.id == db_movie.id).first()


@router.put("/{movie_id}", response_model=MovieResponse)
async def update_movie(
    movie_id: int, 
    movie_update: MovieUpdate, 
    db: Session = Depends(get_db)
):
    """Update an existing movie"""
    movie = db.query(Movie).filter(Movie.id == movie_id).first()
    if movie is None:
        raise HTTPException(status_code=404, detail="Movie not found")
    
    # Update basic fields
    if movie_update.title is not None:
        movie.title = movie_update.title
    if movie_update.year is not None:
        movie.year = movie_update.year
    if movie_update.duration is not None:
        movie.duration = movie_update.duration
    
    # Update genres if provided
    if movie_update.genres is not None:
        # Get existing genres
        existing_genres = db.query(Genre).filter(Genre.movie_id == movie_id).all()
        existing_genre_names = {genre.genre for genre in existing_genres}
        new_genre_names = set(movie_update.genres)
        
        # Remove genres that are no longer in the new list
        genres_to_remove = existing_genre_names - new_genre_names
        if genres_to_remove:
            db.query(Genre).filter(
                and_(Genre.movie_id == movie_id, Genre.genre.in_(genres_to_remove))
            ).delete(synchronize_session=False)
        
        # Add new genres that don't exist yet
        genres_to_add = new_genre_names - existing_genre_names
        for genre_name in genres_to_add:
            genre = Genre(movie_id=movie_id, genre=genre_name)
            db.add(genre)
    
    # Update rating if provided
    if movie_update.rating is not None:
        existing_rating = db.query(Rating).filter(Rating.movie_id == movie_id).first()
        if existing_rating:
            # Update existing rating
            existing_rating.rating = movie_update.rating.rating
            existing_rating.vote_count = movie_update.rating.vote_count
        else:
            # Create new rating
            rating = Rating(
                movie_id=movie_id,
                rating=movie_update.rating.rating,
                vote_count=movie_update.rating.vote_count
            )
            db.add(rating)
    
    db.commit()
    db.refresh(movie)
    
    # Return the movie with all relationships
    return db.query(Movie).options(
        joinedload(Movie.genres),
        joinedload(Movie.rating)
    ).filter(Movie.id == movie_id).first()


@router.delete("/{movie_id}")
async def delete_movie(movie_id: int, db: Session = Depends(get_db)):
    """Delete a movie"""
    movie = db.query(Movie).filter(Movie.id == movie_id).first()
    if movie is None:
        raise HTTPException(status_code=404, detail="Movie not found")
    
    movie_title = movie.title
    db.delete(movie)
    db.commit()
    return {"message": f"Movie '{movie_title}' deleted successfully"}


# Genre endpoints
@router.get("/{movie_id}/genres", response_model=List[GenreResponse])
async def get_movie_genres(movie_id: int, db: Session = Depends(get_db)):
    """Get all genres for a specific movie"""
    movie = db.query(Movie).filter(Movie.id == movie_id).first()
    if movie is None:
        raise HTTPException(status_code=404, detail="Movie not found")
    
    genres = db.query(Genre).filter(Genre.movie_id == movie_id).all()
    return genres


@router.post("/{movie_id}/genres", response_model=GenreResponse, status_code=201)
async def add_genre_to_movie(
    movie_id: int, 
    genre_name: str, 
    db: Session = Depends(get_db)
):
    """Add a genre to a movie"""
    movie = db.query(Movie).filter(Movie.id == movie_id).first()
    if movie is None:
        raise HTTPException(status_code=404, detail="Movie not found")
    
    # Check if genre already exists for this movie
    existing_genre = db.query(Genre).filter(
        and_(Genre.movie_id == movie_id, Genre.genre == genre_name)
    ).first()
    
    if existing_genre:
        raise HTTPException(status_code=400, detail="Genre already exists for this movie")
    
    genre = Genre(movie_id=movie_id, genre=genre_name)
    db.add(genre)
    db.commit()
    db.refresh(genre)
    return genre


@router.delete("/{movie_id}/genres/{genre_id}")
async def remove_genre_from_movie(
    movie_id: int, 
    genre_id: int, 
    db: Session = Depends(get_db)
):
    """Remove a genre from a movie"""
    genre = db.query(Genre).filter(
        and_(Genre.id == genre_id, Genre.movie_id == movie_id)
    ).first()
    
    if genre is None:
        raise HTTPException(status_code=404, detail="Genre not found for this movie")
    
    genre_name = genre.genre
    db.delete(genre)
    db.commit()
    return {"message": f"Genre '{genre_name}' removed from movie"}


# Rating endpoints
@router.get("/{movie_id}/rating", response_model=RatingResponse)
async def get_movie_rating(movie_id: int, db: Session = Depends(get_db)):
    """Get rating for a specific movie"""
    movie = db.query(Movie).filter(Movie.id == movie_id).first()
    if movie is None:
        raise HTTPException(status_code=404, detail="Movie not found")
    
    rating = db.query(Rating).filter(Rating.movie_id == movie_id).first()
    if rating is None:
        raise HTTPException(status_code=404, detail="Rating not found for this movie")
    
    return rating


@router.post("/{movie_id}/rating", response_model=RatingResponse, status_code=201)
async def add_rating_to_movie(
    movie_id: int, 
    rating_data: RatingCreate, 
    db: Session = Depends(get_db)
):
    """Add or update rating for a movie"""
    movie = db.query(Movie).filter(Movie.id == movie_id).first()
    if movie is None:
        raise HTTPException(status_code=404, detail="Movie not found")
    
    # Check if rating already exists
    existing_rating = db.query(Rating).filter(Rating.movie_id == movie_id).first()
    
    if existing_rating:
        # Update existing rating
        existing_rating.rating = rating_data.rating
        existing_rating.vote_count = rating_data.vote_count
        db.commit()
        db.refresh(existing_rating)
        return existing_rating
    else:
        # Create new rating
        rating = Rating(
            movie_id=movie_id,
            rating=rating_data.rating,
            vote_count=rating_data.vote_count
        )
        db.add(rating)
        db.commit()
        db.refresh(rating)
        return rating


@router.put("/{movie_id}/rating", response_model=RatingResponse)
async def update_movie_rating(
    movie_id: int, 
    rating_update: RatingUpdate, 
    db: Session = Depends(get_db)
):
    """Update rating for a movie"""
    rating = db.query(Rating).filter(Rating.movie_id == movie_id).first()
    if rating is None:
        raise HTTPException(status_code=404, detail="Rating not found for this movie")
    
    if rating_update.rating is not None:
        rating.rating = rating_update.rating
    if rating_update.vote_count is not None:
        rating.vote_count = rating_update.vote_count
    
    db.commit()
    db.refresh(rating)
    return rating


@router.delete("/{movie_id}/rating")
async def remove_movie_rating(movie_id: int, db: Session = Depends(get_db)):
    """Remove rating from a movie"""
    rating = db.query(Rating).filter(Rating.movie_id == movie_id).first()
    if rating is None:
        raise HTTPException(status_code=404, detail="Rating not found for this movie")
    
    db.delete(rating)
    db.commit()
    return {"message": "Rating removed from movie"}