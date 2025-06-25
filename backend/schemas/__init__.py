# Import all schemas to make them available when importing from schemas
from .genre import GenreBase, GenreCreate, GenreResponse
from .rating import RatingBase, RatingCreate, RatingUpdate, RatingResponse
from .movie import (
    MovieBase, MovieCreate, MovieUpdate, MovieResponse, 
    MovieSummary, MovieList, MovieFilter
)

# Rebuild models to resolve forward references after all imports
MovieCreate.model_rebuild()
MovieUpdate.model_rebuild()
MovieResponse.model_rebuild()

# Make schemas available at the package level
__all__ = [
    'MovieBase', 'MovieCreate', 'MovieUpdate', 'MovieResponse', 
    'MovieSummary', 'MovieList', 'MovieFilter',
    'GenreBase', 'GenreCreate', 'GenreResponse',
    'RatingBase', 'RatingCreate', 'RatingUpdate', 'RatingResponse'
]
