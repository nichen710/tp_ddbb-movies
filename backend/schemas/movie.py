from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List, TYPE_CHECKING

if TYPE_CHECKING:
    from .rating import RatingCreate, RatingResponse
    from .genre import GenreResponse


class MovieBase(BaseModel):
    """Base schema for Movie"""
    title: str = Field(..., min_length=1, max_length=500)
    year: Optional[int] = Field(None, ge=1800, le=2030)
    duration: Optional[int] = Field(None, ge=1, description="Duration in minutes")


class MovieCreate(MovieBase):
    """Schema for creating a new movie"""
    genres: Optional[List[str]] = Field(default=[], description="List of genres")
    rating: Optional['RatingCreate'] = None


class MovieUpdate(BaseModel):
    """Schema for updating an existing movie"""
    title: Optional[str] = Field(None, min_length=1, max_length=500)
    year: Optional[int] = Field(None, ge=1800, le=2030)
    duration: Optional[int] = Field(None, ge=1)
    genres: Optional[List[str]] = Field(None, description="List of genres")
    rating: Optional['RatingCreate'] = None


class MovieResponse(MovieBase):
    """Schema for movie response"""
    id: int
    genres: List['GenreResponse'] = []
    rating: Optional['RatingResponse'] = None
    
    model_config = ConfigDict(from_attributes=True)


class MovieSummary(BaseModel):
    """Schema for movie summary (without genres and rating details)"""
    id: int
    title: str
    year: Optional[int] = None
    duration: Optional[int] = None
    average_rating: Optional[float] = None
    vote_count: Optional[int] = None
    genres: List[str] = []
    
    model_config = ConfigDict(from_attributes=True)


class MovieList(BaseModel):
    """Schema for listing movies"""
    movies: List[MovieSummary]
    total: int
    page: int = 1
    page_size: int = 50


class MovieFilter(BaseModel):
    """Schema for filtering movies"""
    title: Optional[str] = None
    year: Optional[int] = None
    genre: Optional[str] = None
    min_rating: Optional[float] = Field(None, ge=0, le=10)
    max_rating: Optional[float] = Field(None, ge=0, le=10)
