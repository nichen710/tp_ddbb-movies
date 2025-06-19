from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
from database.db import get_db
from models.movie import Movie
from shemas.movie import MovieCreate, MovieUpdate, MovieResponse, MovieList

router = APIRouter(
    prefix="/movies",
    tags=["movies"]
)


@router.get("/", response_model=List[MovieResponse])
async def get_movies(db: Session = Depends(get_db)):
    """Get all movies"""
    movies = db.query(Movie).all()
    return movies


@router.get("/{movie_id}", response_model=MovieResponse)
async def get_movie(movie_id: int, db: Session = Depends(get_db)):
    """Get a movie by ID"""
    movie = db.query(Movie).filter(Movie.id == movie_id).first()
    if movie is None:
        raise HTTPException(status_code=404, detail="Movie not found")
    return movie


@router.post("/", response_model=MovieResponse, status_code=201)
async def create_movie(movie: MovieCreate, db: Session = Depends(get_db)):
    """Create a new movie"""
    db_movie = Movie(title=movie.title)
    db.add(db_movie)
    db.commit()
    db.refresh(db_movie)
    return db_movie


@router.put("/{movie_id}", response_model=MovieResponse)
async def update_movie(movie_id: int, movie_update: MovieUpdate, db: Session = Depends(get_db)):
    """Update an existing movie"""
    movie = db.query(Movie).filter(Movie.id == movie_id).first()
    if movie is None:
        raise HTTPException(status_code=404, detail="Movie not found")
    
    if movie_update.title is not None:
        movie.title = movie_update.title
    
    db.commit()
    db.refresh(movie)
    return movie


@router.delete("/{movie_id}")
async def delete_movie(movie_id: int, db: Session = Depends(get_db)):
    """Delete a movie"""
    movie = db.query(Movie).filter(Movie.id == movie_id).first()
    if movie is None:
        raise HTTPException(status_code=404, detail="Movie not found")
    
    db.delete(movie)
    db.commit()
    return {"message": f"Movie '{movie.title}' deleted successfully"}