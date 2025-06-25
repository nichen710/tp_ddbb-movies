// components/ui/SearchFilters.tsx
'use client';

import { useState, useEffect } from 'react';
import { MoviesAPI } from '@/services/api';

interface SearchFiltersProps {
  onSearch: (filters: {
    title?: string;
    year?: number;
    genre?: string;
    min_rating?: number;
    max_rating?: number;
  }) => void;
  initialFilters?: {
    title?: string;
    year?: number;
    genre?: string;
    min_rating?: number;
    max_rating?: number;
  };
}

export default function SearchFilters({ onSearch, initialFilters }: SearchFiltersProps) {
  const [query, setQuery] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [year, setYear] = useState('');
  const [genre, setGenre] = useState('');
  const [rating, setRating] = useState('');
  const [availableGenres, setAvailableGenres] = useState<string[]>([]);

  // Aplicar filtros iniciales cuando se reciben
  useEffect(() => {
    if (initialFilters) {
      if (initialFilters.title) setQuery(initialFilters.title);
      if (initialFilters.year) setYear(initialFilters.year.toString());
      if (initialFilters.genre) {
        setGenre(initialFilters.genre);
        setShowAdvanced(true); // Mostrar filtros avanzados si hay género
      }
      if (initialFilters.min_rating) setRating(initialFilters.min_rating.toString());
    }
  }, [initialFilters]);

  // Cargar géneros únicos al montar el componente
  useEffect(() => {
    const loadGenres = async () => {
      try {
        const genres = await MoviesAPI.getUniqueGenres();
        setAvailableGenres(genres);
      } catch (error) {
        console.error('Error loading genres:', error);
      }
    };
    loadGenres();
  }, []);

  // Búsqueda en tiempo real con debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const filters: Record<string, string | number> = {};
      if (query.trim()) filters.title = query.trim();
      if (year) filters.year = parseInt(year);
      if (genre) filters.genre = genre;
      if (rating) filters.min_rating = parseFloat(rating);
      onSearch(filters);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, year, genre, rating, onSearch]);

  const handleReset = () => {
    setQuery('');
    setYear('');
    setGenre('');
    setRating('');
    setShowAdvanced(false);
    onSearch({});
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      {/* Barra de búsqueda principal */}
      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search movies by title..."
          className="w-full pl-10 pr-12 py-3 text-lg text-gray-900 placeholder-gray-600 border border-gray-300 rounded-full bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Toggle para filtros avanzados */}
      <div className="flex justify-center mb-4">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200 flex items-center gap-1"
        >
          {showAdvanced ? 'Hide' : 'Show'} advanced filters
          <svg 
            className={`h-4 w-4 transition-transform duration-200 ${showAdvanced ? 'rotate-180' : ''}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Filtros avanzados */}
      {showAdvanced && (
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Year */}
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">Year</label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="e.g., 2020"
                min="1800"
                max="2030"
                step="1"
                inputMode="numeric"
                className="w-full px-3 py-2 text-gray-900 placeholder-gray-600 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Genre */}
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">Genre</label>
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All genres</option>
                {availableGenres.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">Min Rating</label>
              <select
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Any rating</option>
                <option value="1.0">1+</option>
                <option value="2.0">2+</option>
                <option value="3.0">3+</option>
                <option value="4.0">4+</option>
                <option value="5.0">5+</option>
                <option value="6.0">6+</option>
                <option value="7.0">7+</option>
                <option value="8.0">8+</option>
                <option value="9.0">9+</option>
              </select>
            </div>
          </div>

          {/* Reset button */}
          {(query || year || genre || rating) && (
            <div className="mt-4 flex justify-center">
              <button
                onClick={handleReset}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
