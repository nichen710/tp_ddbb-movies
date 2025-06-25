from pydantic import BaseModel, Field, ConfigDict
from typing import Optional


class RatingBase(BaseModel):
    """Base schema for Rating"""
    rating: float = Field(..., ge=0, le=10, description="Rating between 0 and 10")
    vote_count: int = Field(..., ge=0, description="Number of votes")


class RatingCreate(RatingBase):
    """Schema for creating a new rating"""
    pass


class RatingUpdate(BaseModel):
    """Schema for updating a rating"""
    rating: Optional[float] = Field(None, ge=0, le=10)
    vote_count: Optional[int] = Field(None, ge=0)


class RatingResponse(RatingBase):
    """Schema for rating response"""
    id: int
    movie_id: int
    
    model_config = ConfigDict(from_attributes=True)
