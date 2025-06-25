from database.db import Base
from sqlalchemy import Column, event, Integer, String, Index
from sqlalchemy.orm import relationship
from config import settings
from utils.logging import logger
import csv
import os


class Movie(Base):
    __tablename__ = "movies"
    """Data model for a movie"""
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(500), nullable=False, index=True)  # Add index for search
    year = Column(Integer, nullable=True, index=True)  # Add index for filtering
    duration = Column(Integer, nullable=True)
    
    # Relationships
    genres = relationship("Genre", back_populates="movie", cascade="all, delete-orphan")
    rating = relationship("Rating", back_populates="movie", uselist=False, cascade="all, delete-orphan")
    
    # Composite indices for better query performance
    __table_args__ = (
        Index('idx_movie_title_year', 'title', 'year'),
        Index('idx_movie_year_duration', 'year', 'duration'),
    )


# Event to load data from CSV files after creating the tables
@event.listens_for(Movie.__table__, 'after_create')
def load_movies_data(target, connection, **kw):
    """Load movies data from CSV"""
    csv_path = "database/peliculas_10000.csv"
    logger.info(f"Loading movies data from {csv_path}")
    
    if os.path.exists(csv_path):
        try:
            with open(csv_path, 'r', encoding="utf-8") as file:
                csv_reader = csv.DictReader(file)
                data = []
                
                for row in csv_reader:
                    try:
                        # Handle empty values
                        year_val = None if not row['año'] else int(row['año'])
                        duration_val = None if not row['duracion'] else int(row['duracion'])
                        
                        data.append({
                            'id': int(row['id_pelicula']),
                            'title': row['titulo'],
                            'year': year_val,
                            'duration': duration_val
                        })
                    except (ValueError, KeyError) as e:
                        logger.warning(f"Skipping invalid row in movies CSV: {e}")
                        continue
                
                if data:
                    connection.execute(target.insert(), data)
                    logger.info(f"Loaded {len(data)} movies")
                else:
                    logger.warning("No valid movie data found in CSV")
                    
        except Exception as e:
            logger.error(f"Error loading movies data: {e}")
    else:
        logger.warning(f"Movies CSV file not found: {csv_path}")
