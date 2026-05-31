'use client';
import { useEffect, useState } from 'react';
import { moviesApi } from '@/lib/api-client';
import { VideoPlayer } from '@/components/movies/VideoPlayer';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function MovieDetailPage({ params }: { params: { id: string } }) {
  const [movie, setMovie] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    moviesApi.getMovie(params.id)
      .then(setMovie)
      .catch(console.error);
  }, [params.id]);

  if (!movie) return <div className="p-6">Carregando...</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <button onClick={() => router.back()} className="flex items-center text-sm text-gray-400 hover:text-white mb-6">
        <ArrowLeft size={16} className="mr-2" /> Voltar
      </button>

      <div className="mb-8">
        <VideoPlayer movieId={movie.id} />
      </div>

      <div>
        <h1 className="text-3xl font-bold text-white mb-2">{movie.title}</h1>
        <div className="flex items-center gap-4 text-sm text-gray-400 mb-6">
          <span>{movie.year}</span>
          {movie.duration_secs && (
            <span>{Math.floor(movie.duration_secs / 60)} min</span>
          )}
        </div>
        <p className="text-gray-300 leading-relaxed max-w-3xl">
          {movie.description || 'Nenhuma descrição disponível.'}
        </p>
      </div>
    </div>
  );
}
