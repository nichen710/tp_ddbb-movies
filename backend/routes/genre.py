from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from database.db import get_db
from models import Genre, Movie

router = APIRouter(
    prefix="/genres",
    tags=["genres"]
)


@router.get("/", response_model=List[dict])
async def get_all_genres(
    limit: Optional[int] = Query(None, ge=1, description="Limit the number of genres"),
    db: Session = Depends(get_db)
):
    """Get all unique genres with movie count"""
    query = db.query(
        Genre.genre,
        func.count(Genre.id).label('movie_count')
    ).group_by(Genre.genre).order_by(Genre.genre)
    
    if limit:
        query = query.limit(limit)
    
    results = query.all()
    
    return [
        {
            "genre": result.genre,
            "movie_count": result.movie_count
        }
        for result in results
    ]


@router.get("/{genre_name}/movies")
async def get_movies_by_genre(
    genre_name: str,
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Get all movies for a specific genre"""
    # Check if genre exists
    genre_exists = db.query(Genre).filter(Genre.genre.ilike(genre_name)).first()
    if not genre_exists:
        raise HTTPException(status_code=404, detail="Genre not found")
    
    # Get movies with pagination
    offset = (page - 1) * page_size
    movies_query = db.query(Movie).join(Genre).filter(
        Genre.genre.ilike(genre_name)
    )
    
    total = movies_query.count()
    movies = movies_query.offset(offset).limit(page_size).all()
    
    return {
        "genre": genre_name,
        "movies": [
            {
                "id": movie.id,
                "title": movie.title,
                "year": movie.year,
                "duration": movie.duration
            }
            for movie in movies
        ],
        "total": total,
        "page": page,
        "page_size": page_size
    }
