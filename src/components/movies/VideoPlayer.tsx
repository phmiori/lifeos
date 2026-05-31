'use client';
import { useEffect, useRef } from 'react';
import { moviesApi } from '@/lib/api-client';

export function VideoPlayer({ movieId, onProgress }: { movieId: string, onProgress?: (pct: number) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let interval: NodeJS.Timeout;
    
    const handlePlay = () => {
      interval = setInterval(() => {
        if (video.duration) {
          const pct = (video.currentTime / video.duration) * 100;
          if (onProgress) onProgress(pct);
          
          // Salva o progresso a cada 10s (aproximadamente, debounceado no backend ou aqui)
          if (Math.floor(video.currentTime) % 10 === 0) {
            moviesApi.saveProgress(movieId, Math.floor(video.currentTime), pct > 95).catch(() => {});
          }
        }
      }, 1000);
    };

    const handlePause = () => clearInterval(interval);

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      clearInterval(interval);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, [movieId, onProgress]);

  return (
    <div className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl">
      <video
        ref={videoRef}
        controls
        controlsList="nodownload"
        className="w-full h-full"
        src={moviesApi.streamUrl(movieId)}
      >
        Seu navegador não suporta a tag de vídeo.
      </video>
    </div>
  );
}
