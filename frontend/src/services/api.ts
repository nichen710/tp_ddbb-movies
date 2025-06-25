// services/api.ts
import { Movie, MovieResponse, MovieCreate, MovieSummary } from '@/types/movie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export class MoviesAPI {
  private static async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`API Error: ${response.status} - ${errorData}`);
    }

    return response.json();
  }

  // Movies endpoints
  static async getMovies(params: {
    page?: number;
    page_size?: number;
    title?: string;
    year?: number;
    genre?: string;
    min_rating?: number;
    max_rating?: number;
  } = {}): Promise<MovieResponse> {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString());
      }
    });

    const queryString = searchParams.toString();
    const endpoint = `/movies${queryString ? `?${queryString}` : ''}`;
    
    return this.request<MovieResponse>(endpoint);
  }

  static async getMovie(id: number): Promise<Movie> {
    return this.request<Movie>(`/movies/${id}`);
  }

  static async createMovie(movie: MovieCreate): Promise<Movie> {
    return this.request<Movie>('/movies', {
      method: 'POST',
      body: JSON.stringify(movie),
    });
  }

  static async updateMovie(id: number, movie: Partial<MovieCreate>): Promise<Movie> {
    return this.request<Movie>(`/movies/${id}`, {
      method: 'PUT',
      body: JSON.stringify(movie),
    });
  }

  static async deleteMovie(id: number): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/movies/${id}`, {
      method: 'DELETE',
    });
  }

  // Genres endpoints
  static async getGenres(): Promise<Array<{ genre: string; movie_count: number }>> {
    return this.request<Array<{ genre: string; movie_count: number }>>('/genres');
  }

  static async getUniqueGenres(): Promise<string[]> {
    // Lista estática de géneros únicos extraída del CSV
    return [
      'Action',
      'Adventure', 
      'Animation',
      'Biography',
      'Comedy',
      'Crime',
      'Documentary',
      'Drama',
      'Family',
      'Fantasy',
      'Film-Noir',
      'History',
      'Horror',
      'Music',
      'Musical',
      'Mystery',
      'News',
      'Romance',
      'Sci-Fi',
      'Sport',
      'Thriller',
      'War',
      'Western'
    ];
  }

  // Ratings endpoints
  static async getTopRatedMovies(params: {
    limit?: number;
    min_votes?: number;
  } = {}): Promise<MovieSummary[]> {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString());
      }
    });

    const queryString = searchParams.toString();
    const endpoint = `/ratings/top-rated${queryString ? `?${queryString}` : ''}`;
    
    return this.request<MovieSummary[]>(endpoint);
  }

  static async getRatingStatistics(): Promise<{
    average_rating: number;
    min_rating: number;
    max_rating: number;
    total_movies_with_ratings: number;
    total_votes: number;
  }> {
    return this.request('/ratings/statistics');
  }
}
