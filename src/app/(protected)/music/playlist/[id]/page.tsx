'use client';
import { useEffect, useState } from 'react';
import { musicApi } from '@/lib/api-client';
import { SongCard } from '@/components/music/SongCard';
import { usePlayerStore } from '@/lib/stores';
import { ArrowLeft, Play } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PlaylistPage({ params }: { params: { id: string } }) {
  const [playlist, setPlaylist] = useState<any>(null);
  const router = useRouter();
  const { playSong } = usePlayerStore();

  useEffect(() => {
    musicApi.getPlaylist(params.id)
      .then(setPlaylist)
      .catch(console.error);
  }, [params.id]);

  if (!playlist) return <div className="p-6">Carregando...</div>;

  const handlePlayAll = () => {
    if (playlist.songs && playlist.songs.length > 0) {
      playSong(playlist.songs[0], playlist.songs);
    }
  };

  return (
    <div className="p-6">
      <button onClick={() => router.back()} className="flex items-center text-sm text-gray-400 hover:text-white mb-6">
        <ArrowLeft size={16} className="mr-2" /> Voltar
      </button>

      <div className="flex items-end gap-6 mb-10">
        <div className="w-48 h-48 bg-gray-800 shadow-2xl rounded-xl flex-shrink-0">
           {playlist.cover_url && <img src={playlist.cover_url} className="w-full h-full object-cover rounded-xl" />}
        </div>
        <div>
          <p className="text-sm uppercase font-bold text-gray-400">Playlist</p>
          <h1 className="text-5xl font-bold text-white mb-4">{playlist.name}</h1>
          <p className="text-gray-400 text-sm">
            {playlist.description} • {playlist.songs?.length || 0} músicas
          </p>
        </div>
      </div>

      <div className="mb-6">
        <button 
          onClick={handlePlayAll}
          className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center hover:scale-105 transition-transform text-black"
        >
          <Play fill="currentColor" size={24} className="ml-1" />
        </button>
      </div>

      <div className="flex flex-col gap-1 border-t border-white/10 pt-4">
        {playlist.songs?.map((song: any, idx: number) => (
          <SongCard 
            key={song.id} 
            song={song} 
            index={idx + 1} 
            onPlay={() => playSong(song, playlist.songs)} 
          />
        ))}
      </div>
    </div>
  );
}
