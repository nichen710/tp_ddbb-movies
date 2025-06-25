"""
Exception handlers and custom exceptions for the Movies API
"""
from fastapi import HTTPException, Request
from fastapi.responses import JSONResponse
from sqlalchemy.exc import SQLAlchemyError
from utils.logging import logger
import traceback


class MovieNotFoundError(HTTPException):
    """Custom exception for movie not found"""
    def __init__(self, movie_id: int):
        super().__init__(
            status_code=404,
            detail=f"Movie with ID {movie_id} not found"
        )


class GenreNotFoundError(HTTPException):
    """Custom exception for genre not found"""
    def __init__(self, genre_id: int = None, movie_id: int = None):
        if genre_id and movie_id:
            detail = f"Genre with ID {genre_id} not found for movie {movie_id}"
        elif genre_id:
            detail = f"Genre with ID {genre_id} not found"
        else:
            detail = "Genre not found"
        
        super().__init__(status_code=404, detail=detail)


class RatingNotFoundError(HTTPException):
    """Custom exception for rating not found"""
    def __init__(self, movie_id: int):
        super().__init__(
            status_code=404,
            detail=f"Rating not found for movie with ID {movie_id}"
        )


class DuplicateGenreError(HTTPException):
    """Custom exception for duplicate genre"""
    def __init__(self, genre_name: str, movie_id: int):
        super().__init__(
            status_code=400,
            detail=f"Genre '{genre_name}' already exists for movie {movie_id}"
        )


async def database_exception_handler(request: Request, exc: SQLAlchemyError):
    """Handle database exceptions"""
    logger.error(f"Database error: {str(exc)}")
    logger.error(f"Traceback: {traceback.format_exc()}")
    
    return JSONResponse(
        status_code=500,
        content={
            "detail": "Database error occurred",
            "type": "database_error"
        }
    )


async def general_exception_handler(request: Request, exc: Exception):
    """Handle general exceptions"""
    logger.error(f"Unexpected error: {str(exc)}")
    logger.error(f"Traceback: {traceback.format_exc()}")
    
    return JSONResponse(
        status_code=500,
        content={
            "detail": "Internal server error",
            "type": "internal_error"
        }
    )
