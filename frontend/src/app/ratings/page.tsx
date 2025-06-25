'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MoviesAPI } from '@/services/api';
import { MovieSummary } from '@/types/movie';
import Layout from '@/components/layout/Layout';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorMessage from '@/components/ui/ErrorMessage';

interface RatingStatistics {
  average_rating: number;
  min_rating: number;
  max_rating: number;
  total_movies_with_ratings: number;
  total_votes: number;
}

export default function RatingsPage() {
  const [topRatedMovies, setTopRatedMovies] = useState<MovieSummary[]>([]);
  const [statistics, setStatistics] = useState<RatingStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [limit, setLimit] = useState(20);
  const [minVotes, setMinVotes] = useState(100);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [moviesData, statsData] = await Promise.all([
          MoviesAPI.getTopRatedMovies({ limit, min_votes: minVotes }),
          MoviesAPI.getRatingStatistics()
        ]);
        
        setTopRatedMovies(moviesData);
        setStatistics(statsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch ratings data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [limit, minVotes]);

  const handleRetry = () => {
    window.location.reload();
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <ErrorMessage message={error} onRetry={handleRetry} />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Ratings</h1>
          <p className="text-gray-600 mt-2">
            Explore movie ratings, statistics, and discover the highest-rated films.
          </p>
        </div>

        {/* Statistics Cards */}
        {statistics && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {statistics.average_rating.toFixed(1)}
                </div>
                <div className="text-sm text-gray-500 mt-1">Average Rating</div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {statistics.max_rating.toFixed(1)}
                </div>
                <div className="text-sm text-gray-500 mt-1">Highest Rating</div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {statistics.min_rating.toFixed(1)}
                </div>
                <div className="text-sm text-gray-500 mt-1">Lowest Rating</div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {statistics.total_movies_with_ratings.toLocaleString()}
                </div>
                <div className="text-sm text-gray-500 mt-1">Rated Movies</div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {statistics.total_votes.toLocaleString()}
                </div>
                <div className="text-sm text-gray-500 mt-1">Total Votes</div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Rated Movies</h2>
          <div className="flex flex-wrap gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Limit
              </label>
              <select
                value={limit}
                onChange={(e) => setLimit(parseInt(e.target.value))}
                className="px-3 py-2 border border-gray-300 text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={10}>Top 10</option>
                <option value={20}>Top 20</option>
                <option value={50}>Top 50</option>
                <option value={100}>Top 100</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Votes
              </label>
              <select
                value={minVotes}
                onChange={(e) => setMinVotes(parseInt(e.target.value))}
                className="px-3 py-2 border border-gray-300 text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={50}>50+ votes</option>
                <option value={100}>100+ votes</option>
                <option value={500}>500+ votes</option>
                <option value={1000}>1000+ votes</option>
                <option value={5000}>5000+ votes</option>
              </select>
            </div>
          </div>
        </div>

        {/* Top Rated Movies List */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200">
          <div className="p-6">
            <div className="space-y-4">
              {topRatedMovies.map((movie, index) => (
                <Link
                  key={movie.id}
                  href={`/movies/${movie.id}`}
                  className="block"
                >
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-all duration-200 cursor-pointer">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors duration-200">
                          {movie.title}
                        </h3>
                        <div className="text-sm text-gray-500">
                          {movie.year && `${movie.year} • `}
                          {movie.duration && `${movie.duration} min`}
                        </div>
                        {movie.genres && movie.genres.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {movie.genres.slice(0, 3).map((genre, genreIndex) => (
                              <span
                                key={genreIndex}
                                className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
                              >
                                {genre}
                              </span>
                            ))}
                            {movie.genres.length > 3 && (
                              <span className="text-xs text-gray-500">
                                +{movie.genres.length - 3} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-xl font-bold text-blue-600 flex items-center justify-end gap-1">
                        ⭐ {movie.average_rating?.toFixed(1)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {movie.vote_count?.toLocaleString()} votes
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {topRatedMovies.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">⭐</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Rated Movies Found</h2>
            <p className="text-gray-600">
              Try adjusting the filters to see more results.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}
