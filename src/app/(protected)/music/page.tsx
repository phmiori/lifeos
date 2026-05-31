'use client';
import { useEffect, useState } from 'react';
import { musicApi } from '@/lib/api-client';
import { SongCard } from '@/components/music/SongCard';
import { PlaylistCard } from '@/components/music/PlaylistCard';
import { Music, Plus } from 'lucide-react';
import { usePlayerStore } from '@/lib/stores';

export default function MusicPage() {
  const [songs, setSongs] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const { playSong } = usePlayerStore();

  useEffect(() => {
    Promise.all([
      musicApi.getSongs(),
      musicApi.getPlaylists()
    ]).then(([songsData, playlistsData]: any) => {
      setSongs(songsData.songs || []);
      setPlaylists(playlistsData.playlists || []);
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handlePlay = (song: any) => {
    playSong(song, songs);
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
             style={{ background: 'var(--gradient-main)' }}>
          <Music size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Biblioteca Musical</h1>
          <p className="text-sm text-gray-400">Suas músicas e playlists</p>
        </div>
      </div>

      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Suas Playlists</h2>
          <button className="btn btn-secondary text-xs p-2">
            <Plus size={14} className="mr-1" /> Nova
          </button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {playlists.map((pl: any) => (
            <PlaylistCard key={pl.id} playlist={pl} />
          ))}
          {!loading && playlists.length === 0 && (
            <p className="text-sm text-gray-400">Nenhuma playlist encontrada.</p>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Todas as Músicas</h2>
        <div className="flex flex-col gap-2">
          {songs.map((song: any, idx) => (
            <SongCard key={song.id} song={song} index={idx + 1} onPlay={() => handlePlay(song)} />
          ))}
          {!loading && songs.length === 0 && (
            <p className="text-sm text-gray-400">Nenhuma música encontrada.</p>
          )}
        </div>
      </div>
    </div>
  );
}
