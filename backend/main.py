from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.exc import SQLAlchemyError
from models import Movie, Genre, Rating  # Importa todos los modelos aquí
from routes.movie import router as movie_router
from routes.genre import router as genre_router
from routes.rating import router as rating_router
from database.db import Base, engine
from config import settings
from utils.logging import logger
from utils.exceptions import database_exception_handler, general_exception_handler
import uvicorn

# Create database tables
try:
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables created successfully")
except Exception as e:
    logger.error(f"Error creating database tables: {e}")
    raise

app = FastAPI(
    title="Movies API",
    description="REST API for managing movies, genres, and ratings",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint for monitoring and Docker"""
    from datetime import datetime
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "service": "movie-backend",
        "version": "2.0.0"
    }

# Add exception handlers
app.add_exception_handler(SQLAlchemyError, database_exception_handler)
app.add_exception_handler(Exception, general_exception_handler)

# Include routers
app.include_router(movie_router)
app.include_router(genre_router)
app.include_router(rating_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Mejor práctica: lista en vez de string
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    """API root endpoint"""
    return {
        "message": f"Welcome to the {settings.API_TITLE}!",
        "version": settings.API_VERSION,
        "features": [
            "Complete movie management",
            "Genre associations",
            "Rating system",
            "Advanced filtering and pagination",
            "Comprehensive error handling",
            "Logging system"
        ],
        "endpoints": {
            "movies": "/movies",
            "genres": "/genres", 
            "ratings": "/ratings",
            "docs": "/docs",
            "redoc": "/redoc"
        }
    }


if __name__ == '__main__':
    uvicorn.run(
        app, 
        host=settings.HOST, 
        port=settings.PORT,
        log_level="info" if not settings.DEBUG else "debug"
    )
