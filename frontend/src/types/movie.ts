// types/movie.ts
export interface Movie {
  id: number;
  title: string;
  year?: number;
  duration?: number;
  genres: Genre[];
  rating?: Rating;
}

export interface MovieSummary {
  id: number;
  title: string;
  year?: number;
  duration?: number;
  average_rating?: number;
  vote_count?: number;
  genres: string[];
}

export interface Genre {
  id: number;
  movie_id: number;
  genre: string;
}

export interface Rating {
  id: number;
  movie_id: number;
  rating: number;
  vote_count: number;
}

export interface MovieResponse {
  movies: MovieSummary[];
  total: number;
  page: number;
  page_size: number;
}

export interface MovieCreate {
  title: string;
  year?: number;
  duration?: number;
  genres?: string[];
  rating?: {
    rating: number;
    vote_count: number;
  };
}
