# Import all models to make them available when importing from models
from .movie import Movie
from .genre import Genre  
from .rating import Rating

# Make models available at the package level
__all__ = ['Movie', 'Genre', 'Rating']
