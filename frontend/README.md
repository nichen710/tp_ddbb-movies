# Movie Database Frontend

A modern web application built with Next.js, TypeScript, and Tailwind CSS for managing and browsing a movie database.

## Features

- **Browse Movies**: View a paginated list of movies with search and filtering
- **Movie Details**: View detailed information about individual movies
- **Add Movies**: Create new movie entries with genres and ratings
- **Edit Movies**: Update existing movie information
- **Delete Movies**: Remove movies from the database
- **Search & Filter**: Find movies by title, year, genre, and rating
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Tech Stack

- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **React**: Component-based UI library

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- The backend API running on `http://localhost:8000`

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment configuration:
```bash
cp .env.example .env.local
```

3. Update `.env.local` with your backend API URL:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── movies/
│   │   ├── [id]/          # Movie detail and edit pages
│   │   └── create/        # Create movie page
│   └── page.tsx           # Home page (movie list)
├── components/
│   ├── layout/            # Layout components
│   └── ui/                # Reusable UI components
├── services/              # API service layer
├── types/                 # TypeScript type definitions
└── styles/                # Global styles
```

## API Integration

The frontend communicates with the FastAPI backend through a service layer (`src/services/api.ts`) that handles:

- Fetching movies with pagination and filtering
- Creating, updating, and deleting movies
- Error handling and response formatting

## Features in Detail

### Movie List
- Grid layout with responsive design
- Search by title, year, genre, and rating
- Pagination for large datasets
- Loading states and error handling

### Movie Details
- Complete movie information display
- Rating visualization with stars
- Genre tags
- Edit and delete actions

### Movie Forms
- Create and edit movies
- Dynamic genre management
- Form validation
- Rating input with vote counts

### User Interface
- Modern, clean design
- Consistent navigation
- Loading spinners and error messages
- Mobile-responsive layout

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:8000` |
| `NODE_ENV` | Environment | `development` |

## Contributing

1. Follow the existing code style and patterns
2. Use TypeScript for all new components
3. Include proper error handling
4. Test your changes across different screen sizes
5. Update documentation as needed

## License

This project is part of a movie database application.
