'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Movie } from '@/types/movie';
import { MoviesAPI } from '@/services/api';
import Layout from '@/components/layout/Layout';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorMessage from '@/components/ui/ErrorMessage';

export default function MovieDetail() {
  const params = useParams();
  const router = useRouter();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const movieId = parseInt(params.id as string);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true);
        setError(null);
        const movieData = await MoviesAPI.getMovie(movieId);
        setMovie(movieData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch movie');
      } finally {
        setLoading(false);
      }
    };

    if (movieId) {
      fetchMovie();
    }
  }, [movieId]);

  const handleDelete = async () => {
    if (!movie || !confirm('Are you sure you want to delete this movie?')) {
      return;
    }

    try {
      setDeleteLoading(true);
      await MoviesAPI.deleteMovie(movie.id);
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete movie');
      setDeleteLoading(false);
    }
  };

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

  if (!movie) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Movie Not Found</h1>
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Back to Movies
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        {/* Navigation */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Movies
          </Link>
        </div>

        {/* Movie Details */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-8">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{movie.title}</h1>
                <div className="flex items-center space-x-4 text-gray-600">
                  {movie.year && <span>Year: {movie.year}</span>}
                  {movie.duration && <span>Duration: {movie.duration} minutes</span>}
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Link
                  href={`/movies/${movie.id}/edit`}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Edit
                </Link>
                <button
                  onClick={handleDelete}
                  disabled={deleteLoading}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
                >
                  {deleteLoading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>

            {/* Genres */}
            {movie.genres && movie.genres.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Genres</h3>
                <div className="flex flex-wrap gap-2">
                  {movie.genres.map((genre, index) => (
                    <span
                      key={index}
                      className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                    >
                      {genre.genre}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Rating */}
            {movie.rating && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Rating</h3>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <span className="text-yellow-500 text-2xl">★</span>
                    <span className="ml-2 text-2xl font-bold text-gray-900">
                      {movie.rating.rating.toFixed(1)}
                    </span>
                    <span className="ml-1 text-gray-500">/ 10</span>
                  </div>
                  <div className="text-gray-600">
                    {movie.rating.vote_count} votes
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
