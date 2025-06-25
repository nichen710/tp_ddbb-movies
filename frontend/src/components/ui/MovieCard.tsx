import Link from 'next/link';
import { MovieSummary } from '@/types/movie';

interface MovieCardProps {
  movie: MovieSummary;
  onClick?: () => void;
}

export default function MovieCard({ movie, onClick }: MovieCardProps) {
  const CardContent = () => (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden h-full flex flex-col">
      <div className="p-4 h-full flex flex-col">
        <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 flex-shrink-0 min-h-[3.5rem]">{movie.title}</h3>
        
        <div className="space-y-2 text-sm text-gray-700 flex-1 flex flex-col justify-between">
          <div className="space-y-2">
            {movie.year && (
              <p>
                <span className="font-medium text-gray-800">Year:</span> {movie.year}
              </p>
            )}
            
            {movie.duration && (
              <p>
                <span className="font-medium text-gray-800">Duration:</span> {movie.duration} min
              </p>
            )}
            
            {movie.genres && movie.genres.length > 0 && (
              <div>
                <span className="font-medium text-gray-800">Genres:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {movie.genres.slice(0, 2).map((genre, index) => (
                    <span
                      key={index}
                      className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium"
                    >
                      {genre}
                    </span>
                  ))}
                  {movie.genres.length > 2 && (
                    <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full font-medium">
                      +{movie.genres.length - 2}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {movie.average_rating && (
            <div className="flex items-center mt-3 pt-3 border-t border-gray-100">
              <span className="font-medium text-gray-800 text-sm">Rating:</span>
              <div className="ml-2 flex items-center">
                <span className="text-yellow-500">★</span>
                <span className="ml-1 font-semibold text-gray-900 text-sm">
                  {movie.average_rating.toFixed(1)} 
                  {movie.vote_count && (
                    <span className="text-gray-600 font-normal text-xs"> ({movie.vote_count})</span>
                  )}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (onClick) {
    return (
      <div onClick={onClick} className="cursor-pointer">
        <CardContent />
      </div>
    );
  }

  return (
    <Link href={`/movies/${movie.id}`} className="block hover:no-underline">
      <CardContent />
    </Link>
  );
}
