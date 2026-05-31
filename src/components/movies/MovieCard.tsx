import Link from 'next/link';

export function MovieCard({ movie }: { movie: any }) {
  return (
    <Link href={`/movies/${movie.id}`}>
      <div className="group relative aspect-[2/3] rounded-xl overflow-hidden cursor-pointer">
        {movie.thumbnail_path ? (
          <img 
            src={`/api/movies/storage/${movie.thumbnail_path}`} 
            alt={movie.title} 
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gray-800 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
            <span className="text-gray-500">Sem Capa</span>
          </div>
        )}
        
        {/* Overlay com gradiente */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
        
        {/* Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-white font-medium text-sm line-clamp-2">{movie.title}</h3>
          <div className="flex items-center gap-2 mt-1 text-xs text-gray-300">
            <span>{movie.year}</span>
            {movie.duration_secs && (
              <>
                <span>•</span>
                <span>{Math.floor(movie.duration_secs / 60)}m</span>
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
