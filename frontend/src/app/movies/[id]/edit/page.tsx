'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Movie, MovieCreate } from '@/types/movie';
import { MoviesAPI } from '@/services/api';
import Layout from '@/components/layout/Layout';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorMessage from '@/components/ui/ErrorMessage';

export default function EditMovie() {
  const params = useParams();
  const router = useRouter();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<MovieCreate>({
    title: '',
    year: undefined,
    duration: undefined,
    genres: [],
    rating: undefined,
  });

  const [genreInput, setGenreInput] = useState('');
  const [ratingInput, setRatingInput] = useState('');
  const [voteCountInput, setVoteCountInput] = useState('');
  const [availableGenres, setAvailableGenres] = useState<string[]>([]);

  const movieId = parseInt(params.id as string);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Load available genres and movie data in parallel
        const [genresData, movieData] = await Promise.all([
          MoviesAPI.getUniqueGenres(),
          MoviesAPI.getMovie(movieId)
        ]);
        
        setAvailableGenres(genresData);
        setMovie(movieData);
        
        // Populate form data
        setFormData({
          title: movieData.title,
          year: movieData.year,
          duration: movieData.duration,
          genres: movieData.genres?.map(g => g.genre) || [],
          rating: movieData.rating ? {
            rating: movieData.rating.rating,
            vote_count: movieData.rating.vote_count
          } : undefined,
        });

        // Set rating inputs
        if (movieData.rating) {
          setRatingInput(movieData.rating.rating.toString());
          setVoteCountInput(movieData.rating.vote_count.toString());
        }
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value === '' ? undefined : (name === 'year' || name === 'duration' ? parseInt(value) : value)
    }));
  };

  const handleAddGenre = () => {
    if (genreInput && !formData.genres?.includes(genreInput)) {
      setFormData(prev => ({
        ...prev,
        genres: [...(prev.genres || []), genreInput]
      }));
      setGenreInput('');
    }
  };

  const handleRemoveGenre = (genre: string) => {
    setFormData(prev => ({
      ...prev,
      genres: prev.genres?.filter(g => g !== genre) || []
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const movieData: MovieCreate = {
        ...formData,
        title: formData.title.trim(),
      };

      // Add rating if provided
      if (ratingInput && voteCountInput) {
        movieData.rating = {
          rating: parseFloat(ratingInput),
          vote_count: parseInt(voteCountInput)
        };
      }

      await MoviesAPI.updateMovie(movieId, movieData);
      router.push(`/movies/${movieId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update movie');
      setSaving(false);
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

  if (error && !movie) {
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
      <div className="max-w-2xl mx-auto">
        {/* Navigation */}
        <div className="mb-6">
          <Link
            href={`/movies/${movieId}`}
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Movie
          </Link>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Edit Movie</h1>
            <p className="text-gray-600 mt-1">Update the details for &ldquo;{movie.title}&rdquo;</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Error */}
            {error && <ErrorMessage message={error} />}

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-600"
                placeholder="Enter movie title"
              />
            </div>

            {/* Year and Duration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
                  Year
                </label>
                <input
                  type="number"
                  id="year"
                  name="year"
                  value={formData.year || ''}
                  onChange={handleInputChange}
                  min="1800"
                  max="2100"
                  className="w-full px-3 py-2 border border-gray-300 text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-600"
                  placeholder="e.g., 2023"
                />
              </div>
              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  id="duration"
                  name="duration"
                  value={formData.duration || ''}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-600"
                  placeholder="e.g., 120"
                />
              </div>
            </div>

            {/* Genres */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Genres
              </label>
              <div className="flex gap-2 mb-2">
                <select
                  value={genreInput}
                  onChange={(e) => setGenreInput(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a genre</option>
                  {availableGenres
                    .filter(genre => !formData.genres?.includes(genre))
                    .map((genre) => (
                      <option key={genre} value={genre}>{genre}</option>
                    ))
                  }
                </select>
                <button
                  type="button"
                  onClick={handleAddGenre}
                  disabled={!genreInput}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add
                </button>
              </div>
              {formData.genres && formData.genres.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.genres.map((genre, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                    >
                      {genre}
                      <button
                        type="button"
                        onClick={() => handleRemoveGenre(genre)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating (Optional)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input
                    type="number"
                    value={ratingInput}
                    onChange={(e) => setRatingInput(e.target.value)}
                    min="0"
                    max="10"
                    step="0.1"
                    className="w-full px-3 py-2 border border-gray-300 text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-600"
                    placeholder="Rating (0-10)"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    value={voteCountInput}
                    onChange={(e) => setVoteCountInput(e.target.value)}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-600"
                    placeholder="Vote count"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-4 pt-6">
              <Link
                href={`/movies/${movieId}`}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {saving && <LoadingSpinner size="sm" className="mr-2" />}
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
