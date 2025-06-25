'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MoviesAPI } from '@/services/api';
import Layout from '@/components/layout/Layout';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorMessage from '@/components/ui/ErrorMessage';

interface Genre {
  genre: string;
  movie_count: number;
}

export default function GenresPage() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await MoviesAPI.getGenres();
        setGenres(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch genres');
      } finally {
        setLoading(false);
      }
    };

    fetchGenres();
  }, []);

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
          <h1 className="text-3xl font-bold text-gray-900">Genres</h1>
          <p className="text-gray-600 mt-2">
            Browse all movie genres and see how many movies are available in each category.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {genres.map((genre, index) => (
            <Link
              key={`${genre.genre}-${index}`}
              href={`/?genre=${encodeURIComponent(genre.genre)}`}
              className="block"
            >
              <div className="bg-white rounded-lg shadow-md hover:shadow-lg hover:border-blue-300 transition-all duration-200 p-6 border border-gray-200 cursor-pointer">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors duration-200">
                    {genre.genre}
                  </h3>
                  <div className="text-sm text-gray-500">
                    #{index + 1}
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  <span className="text-2xl font-bold text-blue-600">
                    {genre.movie_count}
                  </span>
                  <span className="text-sm text-gray-500">
                    {genre.movie_count === 1 ? 'movie' : 'movies'}
                  </span>
                </div>
                
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min((genre.movie_count / Math.max(...genres.map(g => g.movie_count))) * 100, 100)}%`
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {genres.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎭</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Genres Found</h2>
            <p className="text-gray-600">There are no genres available at the moment.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
