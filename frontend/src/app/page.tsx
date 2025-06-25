'use client';

import { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { MovieSummary, MovieResponse } from '@/types/movie';
import { MoviesAPI } from '@/services/api';
import Layout from '@/components/layout/Layout';
import MovieCard from '@/components/ui/MovieCard';
import SearchFilters from '@/components/ui/SearchFilters';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorMessage from '@/components/ui/ErrorMessage';
import Pagination from '@/components/ui/Pagination';

interface SearchFiltersState {
  title?: string;
  year?: number;
  genre?: string;
  min_rating?: number;
  max_rating?: number;
}

function HomeContent() {
  const searchParams = useSearchParams();
  const [movies, setMovies] = useState<MovieSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalMovies, setTotalMovies] = useState(0);
  const [filters, setFilters] = useState<SearchFiltersState>({});
  const [initialFiltersSet, setInitialFiltersSet] = useState(false);
  
  const filtersRef = useRef<SearchFiltersState>({});
  const pageSize = 24;

  // Initialize filters from URL parameters
  useEffect(() => {
    const genreParam = searchParams.get('genre');
    if (genreParam && !initialFiltersSet) {
      const initialFilters = { genre: genreParam };
      setFilters(initialFilters);
      setInitialFiltersSet(true);
    } else if (!genreParam && !initialFiltersSet) {
      setInitialFiltersSet(true);
    }
  }, [searchParams, initialFiltersSet]);

  // Update ref whenever filters change
  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  const fetchMovies = useCallback(async (page: number = 1, searchFilters?: SearchFiltersState) => {
    // Use provided filters or current ref value
    const currentFilters = searchFilters !== undefined ? searchFilters : filtersRef.current;
    
    try {
      setLoading(true);
      setError(null);
      
      const response: MovieResponse = await MoviesAPI.getMovies({
        page,
        page_size: pageSize,
        ...currentFilters,
      });

      setMovies(response.movies);
      setTotalPages(Math.ceil(response.total / pageSize));
      setTotalMovies(response.total);
      setCurrentPage(page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch movies');
    } finally {
      setLoading(false);
    }
  }, [pageSize]);

  // Only trigger when filters actually change and initial filters are set
  useEffect(() => {
    if (initialFiltersSet) {
      fetchMovies(1);
    }
  }, [filters, initialFiltersSet, fetchMovies]);

  const handleSearch = useCallback((newFilters: SearchFiltersState) => {
    setFilters(newFilters);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    fetchMovies(page); // Uses current filters from ref
  }, [fetchMovies]);

  const handleRetry = useCallback(() => {
    fetchMovies(currentPage); // Uses current filters from ref
  }, [fetchMovies, currentPage]);

  return (
    <Layout>
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="text-center py-12 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Movie Database
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Discover, search, and explore thousands of movies
          </p>
        </div>

        {/* Search Section */}
        <SearchFilters onSearch={handleSearch} initialFilters={filters} />

        {/* Search Results Summary */}
        {!loading && !error && (Object.keys(filters).length > 0 && Object.values(filters).some(v => v !== undefined && v !== '')) && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-blue-900">
                  {totalMovies === 0 ? 'No results found' : `${totalMovies} ${totalMovies === 1 ? 'movie' : 'movies'} found`}
                </h3>
                <div className="text-sm text-blue-700 mt-1">
                  {filters.title && <span>Title: &quot;{filters.title}&quot; </span>}
                  {filters.year && <span>Year: {filters.year} </span>}
                  {filters.genre && <span>Genre: {filters.genre} </span>}
                  {filters.min_rating && <span>Min Rating: {filters.min_rating} </span>}
                  {filters.max_rating && <span>Max Rating: {filters.max_rating} </span>}
                </div>
              </div>
              <button
                onClick={() => handleSearch({})}
                className="text-blue-600 hover:text-blue-800 font-medium text-sm bg-white px-3 py-1 rounded border border-blue-200 hover:border-blue-300 transition-colors"
              >
                Clear filters
              </button>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <ErrorMessage message={error} onRetry={handleRetry} />
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        )}

        {/* Results */}
        {!loading && !error && (
          <>
            {movies.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🎬</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No movies found</h3>
                <p className="text-gray-600 max-w-md mx-auto font-medium">
                  Try adjusting your search terms or filters to discover more movies.
                </p>
              </div>
            ) : (
              <>
                {/* Results count */}
                <div className="flex justify-between items-center">
                  <p className="text-gray-700 font-medium">
                    Showing <span className="font-semibold text-gray-900">{movies.length}</span> of{' '}
                    <span className="font-semibold text-gray-900">{totalMovies}</span> movies
                    {currentPage > 1 && (
                      <span className="text-gray-500 ml-2">(Page {currentPage} of {totalPages})</span>
                    )}
                  </p>
                </div>

                {/* Movies Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {movies.map((movie) => (
                    <div key={movie.id} className="">
                      <MovieCard movie={movie} />
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    className="mt-8"
                  />
                )}
              </>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <Layout>
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    }>
      <HomeContent />
    </Suspense>
  );
}
