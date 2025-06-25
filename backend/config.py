"""
Configuration settings for the Movies API
"""
import os


class Settings:
    """Application settings"""
    
    # Database
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "sqlite:///database/local/database.sqlite"
    )
    
    # Server
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))
    DEBUG: bool = os.getenv("DEBUG", "False").lower() == "true"
    
    # Pagination (static configuration)
    DEFAULT_PAGE_SIZE: int = 50
    MAX_PAGE_SIZE: int = 100


# Global settings instance
settings = Settings()
