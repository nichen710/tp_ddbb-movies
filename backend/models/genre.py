from database.db import Base
from sqlalchemy import Column, event, ForeignKey, Integer, String, Index
from sqlalchemy.orm import relationship
from utils.logging import logger
import csv
import os


class Genre(Base):
    __tablename__ = "genres"
    """Data model for movie genres"""
    id = Column(Integer, primary_key=True, index=True)
    movie_id = Column(Integer, ForeignKey("movies.id"), nullable=False, index=True)
    genre = Column(String(100), nullable=False, index=True)  # Add index for search
    
    # Relationships
    movie = relationship("Movie", back_populates="genres")
    
    # Composite index for better query performance
    __table_args__ = (
        Index('idx_genre_movie_genre', 'movie_id', 'genre'),
    )


@event.listens_for(Genre.__table__, 'after_create')
def load_genres_data(target, connection, **kw):
    """Load genres data from CSV"""
    csv_path = "database/generos_10000.csv"
    logger.info(f"Loading genres data from {csv_path}")
    
    if os.path.exists(csv_path):
        try:
            with open(csv_path, 'r', encoding="utf-8") as file:
                csv_reader = csv.DictReader(file)
                data = []
                
                for row in csv_reader:
                    try:
                        data.append({
                            'id': int(row['id']),
                            'movie_id': int(row['id_pelicula']),
                            'genre': row['genero']
                        })
                    except (ValueError, KeyError) as e:
                        logger.warning(f"Skipping invalid row in genres CSV: {e}")
                        continue
                
                if data:
                    connection.execute(target.insert(), data)
                    logger.info(f"Loaded {len(data)} genres")
                else:
                    logger.warning("No valid genre data found in CSV")
                    
        except Exception as e:
            logger.error(f"Error loading genres data: {e}")
    else:
        logger.warning(f"Genres CSV file not found: {csv_path}")
