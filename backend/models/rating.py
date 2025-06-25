from database.db import Base
from sqlalchemy import Column, event, ForeignKey, Float, Integer, Index
from sqlalchemy.orm import relationship
from config import settings
from utils.logging import logger
import csv
import os


class Rating(Base):
    __tablename__ = "ratings"
    """Data model for movie ratings"""
    id = Column(Integer, primary_key=True, index=True)
    movie_id = Column(Integer, ForeignKey("movies.id"), nullable=False, unique=True, index=True)
    rating = Column(Float, nullable=False, index=True)  # Add index for filtering
    vote_count = Column(Integer, nullable=False, default=0)
    
    # Relationships
    movie = relationship("Movie", back_populates="rating")
    
    # Index for rating-based queries
    __table_args__ = (
        Index('idx_rating_vote_count', 'rating', 'vote_count'),
    )


@event.listens_for(Rating.__table__, 'after_create')
def load_ratings_data(target, connection, **kw):
    """Load ratings data from CSV"""
    csv_path = "database/rating_10000.csv"
    logger.info(f"Loading ratings data from {csv_path}")
    
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
                            'rating': float(row['rating']),
                            'vote_count': int(row['nro_votos'])
                        })
                    except (ValueError, KeyError) as e:
                        logger.warning(f"Skipping invalid row in ratings CSV: {e}")
                        continue
                
                if data:
                    connection.execute(target.insert(), data)
                    logger.info(f"Loaded {len(data)} ratings")
                else:
                    logger.warning("No valid rating data found in CSV")
                    
        except Exception as e:
            logger.error(f"Error loading ratings data: {e}")
    else:
        logger.warning(f"Ratings CSV file not found: {csv_path}")
