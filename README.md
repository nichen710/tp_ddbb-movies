# Movie Database Application

A full-stack web application for managing and browsing a movie database, built with FastAPI (Backend) and Next.js (Frontend).

## 🎬 Features

### Core Functionality
- **Complete CRUD Operations** for movies (Create, Read, Update, Delete)
- **Advanced Search & Filtering** by title, year, genre, and rating with real-time results
- **Genre Management** - Browse all genres with movie counts and statistics
- **Rating Analytics** - View top-rated movies and rating statistics
- **Responsive Design** optimized for all devices

### User Experience
- **Modern UI/UX** with Tailwind CSS and smooth animations
- **Intelligent Genre Selection** - Dropdown selectors with validation
- **One-Click Navigation** - Click genres to filter movies instantly
- **Advanced Filters** - Collapsible filter panel with multiple criteria
- **Pagination** - Efficient browsing of large movie collections
- **Search Results Summary** - Clear feedback on search results

### Technical Features
- **Modern Tech Stack**: FastAPI + Next.js + TypeScript + Tailwind CSS
- **SQLite Database** with SQLAlchemy ORM
- **API Documentation** with interactive Swagger/OpenAPI docs
- **Docker Support** for easy deployment and development
- **Production Ready** with comprehensive logging and error handling
- **SEO Optimized** with proper metadata and URL handling

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (Next.js)     │◄──►│   (FastAPI)     │◄──►│   (SQLite)      │
│   Port: 3000    │    │   Port: 8000    │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Frontend Routes
- `/` - Home page with movie search and filtering
- `/movies/create` - Create new movie
- `/movies/[id]` - Movie details page
- `/movies/[id]/edit` - Edit movie
- `/genres` - Browse all genres with statistics
- `/ratings` - Top-rated movies and rating analytics

### API Endpoints
- `GET /movies` - List movies with filtering and pagination
- `POST /movies` - Create new movie
- `GET /movies/{id}` - Get movie details
- `PUT /movies/{id}` - Update movie
- `DELETE /movies/{id}` - Delete movie
- `GET /genres` - Get all genres with movie counts
- `GET /ratings/top-rated` - Get top-rated movies
- `GET /ratings/statistics` - Get rating statistics

## 🚀 Quick Start with Docker

### Prerequisites
- Docker and Docker Compose installed
- Git (to clone the repository)

### Run the Application

1. **Clone and navigate to the project:**
```bash
git clone <repository-url>
cd tp_ddbb-movies
```

2. **Start all services:**
```bash
docker-compose up --build
```

3. **Access the application:**
   - **Frontend**: http://localhost:3000
   - **Backend API**: http://localhost:8000
   - **API Documentation**: http://localhost:8000/docs
   - **Alternative API Docs**: http://localhost:8000/redoc

## 🎯 Usage Guide

### Browsing Movies
1. **Home Page**: View all movies with search and filter options
2. **Search**: Use the search bar to find movies by title
3. **Filter**: Use advanced filters for year, genre, and rating
4. **Pagination**: Navigate through large collections of movies

### Managing Movies
1. **Create**: Click "Add Movie" to create a new movie entry
2. **View Details**: Click on any movie card to see full details
3. **Edit**: Use the edit button on movie details page
4. **Delete**: Remove movies from the details page

### Exploring Genres
1. **Genre Page**: View all genres with movie counts and statistics
2. **Quick Filter**: Click any genre to instantly filter movies by that genre
3. **Visual Stats**: See relative popularity with progress bars

### Rating Analytics
1. **Top Rated**: Browse highest-rated movies with customizable filters
2. **Statistics**: View overall rating statistics and trends
3. **Vote Filters**: Filter by minimum vote count for reliability

## 📁 Project Structure

```
tp_ddbb-movies/
├── backend/                # FastAPI backend application
│   ├── database/          # Database configuration and connection
│   ├── models/            # SQLAlchemy database models
│   ├── routes/            # API route handlers
│   ├── schemas/           # Pydantic data validation schemas
│   ├── utils/             # Utility functions and error handling
│   └── main.py            # FastAPI application entry point
├── frontend/              # Next.js frontend application
│   ├── src/
│   │   ├── app/           # Next.js 13+ app directory
│   │   ├── components/    # Reusable React components
│   │   ├── services/      # API service layer
│   │   └── types/         # TypeScript type definitions
│   └── public/            # Static assets
├── docker-compose.yml     # Service orchestration
└── README.md              # This file
```

## 🛠️ Technology Stack

### Backend
- **FastAPI** - Modern, fast web framework for building APIs
- **SQLAlchemy** - SQL toolkit and ORM
- **SQLite** - Lightweight database for development
- **Pydantic** - Data validation using Python type hints
- **Uvicorn** - ASGI server implementation

### Frontend
- **Next.js 13+** - React framework with App Router
- **TypeScript** - Typed superset of JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **React Hooks** - Modern React state management
- **Fetch API** - HTTP client for API communication

## 🐳 Basic Docker Commands

```bash
# Start the application
docker-compose up --build

# Run in background
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f
```

## 🆘 Troubleshooting

**Port already in use:**
```bash
# Check what's using the ports
sudo lsof -i :3000
sudo lsof -i :8000
```

**Docker issues:**
```bash
# Clean up and rebuild
docker-compose down
docker system prune -a
docker-compose up --build
```

**Still having issues?**
- Check that Docker is running
- Ensure ports 3000 and 8000 are available
- View logs with `docker-compose logs -f`
