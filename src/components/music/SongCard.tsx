import { Play } from 'lucide-react';
import { usePlayerStore } from '@/lib/stores';

export function SongCard({ song, index, onPlay }: { song: any, index: number, onPlay: () => void }) {
  const { currentSong, isPlaying } = usePlayerStore();
  const isActive = currentSong?.id === song.id;

  const formatTime = (secs: number) => {
    const m = Math.floor((secs || 0) / 60);
    const s = Math.floor((secs || 0) % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div 
      onClick={onPlay}
      className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-colors group ${
        isActive ? 'bg-white/10' : 'hover:bg-white/5'
      }`}
    >
      <div className="w-8 text-center text-sm text-gray-400 group-hover:hidden">
        {isActive && isPlaying ? (
          <div className="w-3 h-3 bg-green-500 rounded-full mx-auto animate-pulse" />
        ) : index}
      </div>
      <div className="w-8 text-center hidden group-hover:block">
        <Play size={16} className={isActive ? 'text-green-400' : 'text-white'} />
      </div>

      <div className="w-10 h-10 bg-gray-800 rounded overflow-hidden flex-shrink-0">
        {song.cover_url ? (
          <img src={song.cover_url} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">♪</div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h4 className={`text-sm font-medium truncate ${isActive ? 'text-green-400' : 'text-white'}`}>
          {song.title}
        </h4>
        <p className="text-xs text-gray-400 truncate">{song.artist}</p>
      </div>

      <div className="text-sm text-gray-400 hidden md:block w-32 truncate">
        {song.album}
      </div>

      <div className="text-sm text-gray-400 w-12 text-right">
        {formatTime(song.duration_secs)}
      </div>
    </div>
  );
}
