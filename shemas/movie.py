from pydantic import BaseModel, Field
from typing import Optional, List


class MovieBase(BaseModel):
    """Base schema for Movie"""
    title: str


class MovieCreate(MovieBase):
    """Schema for creating a new movie"""
    pass


class MovieUpdate(BaseModel):
    """Schema for updating an existing movie"""
    title: Optional[str] = None


class MovieResponse(MovieBase):
    """Schema for movie response"""
    id: int 
    title: str
    
    class Config:
        from_attributes = True


class MovieList(BaseModel):
    """Schema for listing movies"""
    movies: List[MovieResponse]
    total: int
