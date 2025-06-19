from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.movie import router as movie_router
from database.db import Base, engine
import uvicorn

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Movies API",
    description="REST API for managing movies",
    version="1.0.0"
)

# Include movie router
app.include_router(movie_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Welcome to the Movies API!"}

if __name__ == '__main__':
    uvicorn.run(app, host='0.0.0.0', port=8000)
