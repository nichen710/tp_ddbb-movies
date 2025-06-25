from pydantic import BaseModel, ConfigDict


class GenreBase(BaseModel):
    """Base schema for Genre"""
    genre: str


class GenreCreate(GenreBase):
    """Schema for creating a new genre"""
    pass


class GenreResponse(GenreBase):
    """Schema for genre response"""
    id: int
    movie_id: int
    genre: str
    
    model_config = ConfigDict(from_attributes=True)
