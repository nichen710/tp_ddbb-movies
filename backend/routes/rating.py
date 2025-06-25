from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from database.db import get_db
from models import Rating, Movie

router = APIRouter(
    prefix="/ratings",
    tags=["ratings"]
)


@router.get("/top-rated")
async def get_top_rated_movies(
    limit: int = Query(10, ge=1, le=100, description="Number of top rated movies"),
    min_votes: int = Query(50, ge=1, description="Minimum number of votes required"),
    db: Session = Depends(get_db)
):
    """Get top rated movies with minimum vote threshold"""
    top_movies = db.query(
        Movie.id,
        Movie.title,
        Movie.year,
        Movie.duration,
        Rating.rating,
        Rating.vote_count
    ).join(Rating).filter(
        Rating.vote_count >= min_votes
    ).order_by(
        desc(Rating.rating)
    ).limit(limit).all()
    
    return [
        {
            "id": movie.id,
            "title": movie.title,
            "year": movie.year,
            "duration": movie.duration,
            "average_rating": movie.rating,
            "vote_count": movie.vote_count
        }
        for movie in top_movies
    ]


@router.get("/statistics")
async def get_rating_statistics(db: Session = Depends(get_db)):
    """Get overall rating statistics"""
    stats = db.query(
        func.avg(Rating.rating).label('average_rating'),
        func.min(Rating.rating).label('min_rating'),
        func.max(Rating.rating).label('max_rating'),
        func.count(Rating.id).label('total_ratings'),
        func.sum(Rating.vote_count).label('total_votes')
    ).first()
    
    return {
        "average_rating": round(float(stats.average_rating), 2) if stats.average_rating else 0,
        "min_rating": float(stats.min_rating) if stats.min_rating else 0,
        "max_rating": float(stats.max_rating) if stats.max_rating else 0,
        "total_movies_with_ratings": stats.total_ratings,
        "total_votes": stats.total_votes
    }


@router.get("/distribution")
async def get_rating_distribution(db: Session = Depends(get_db)):
    """Get rating distribution (how many movies in each rating range)"""
    distribution = db.query(
        func.floor(Rating.rating).label('rating_floor'),
        func.count(Rating.id).label('count')
    ).group_by(
        func.floor(Rating.rating)
    ).order_by('rating_floor').all()
    
    return [
        {
            "rating_range": f"{int(item.rating_floor)}-{int(item.rating_floor) + 1}",
            "count": item.count
        }
        for item in distribution
    ]
