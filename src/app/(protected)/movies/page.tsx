'use client';
import { useEffect, useState } from 'react';
import { moviesApi } from '@/lib/api-client';
import { MovieCard } from '@/components/movies/MovieCard';
import { Film } from 'lucide-react';

export default function MoviesPage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    moviesApi.getMovies()
      .then((data: any) => setMovies(data.movies || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
             style={{ background: 'var(--gradient-main)' }}>
          <Film size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Filmes</h1>
          <p className="text-sm text-gray-400">Seu catálogo pessoal</p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="skeleton aspect-[2/3] rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {movies.map((movie: any) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
}
