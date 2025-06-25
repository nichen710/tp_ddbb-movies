'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              🎬 MovieDB
            </Link>
          </div>
          
          <nav className="flex items-center space-x-6">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors duration-200 ${
                pathname === '/'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Movies
            </Link>
            
            <Link
              href="/genres"
              className={`text-sm font-medium transition-colors duration-200 ${
                pathname === '/genres'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Genres
            </Link>
            
            <Link
              href="/ratings"
              className={`text-sm font-medium transition-colors duration-200 ${
                pathname === '/ratings'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Ratings
            </Link>
            
            <Link
              href="/movies/create"
              className={`inline-flex items-center px-5 py-2 rounded-md font-semibold text-sm shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 border border-transparent
                ${
                  pathname === '/movies/create'
                    ? 'bg-blue-700 text-white shadow-lg'
                    : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-xl'
                }`}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Movie
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
