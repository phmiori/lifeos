import Link from 'next/link';
import { Music } from 'lucide-react';

export function PlaylistCard({ playlist }: { playlist: any }) {
  return (
    <Link href={`/music/playlist/${playlist.id}`} className="min-w-[160px] max-w-[160px]">
      <div className="glass-card p-4 hover:bg-white/5 transition-all cursor-pointer h-full">
        <div className="w-full aspect-square bg-gray-800 rounded-lg mb-3 flex items-center justify-center shadow-lg overflow-hidden">
          {playlist.cover_url ? (
            <img src={playlist.cover_url} alt="" className="w-full h-full object-cover" />
          ) : (
            <Music size={32} className="text-gray-500" />
          )}
        </div>
        <h3 className="font-medium text-white text-sm truncate">{playlist.name}</h3>
        <p className="text-xs text-gray-400 mt-1 truncate">
          {playlist.is_public ? 'Pública' : 'Privada'}
        </p>
      </div>
    </Link>
  );
}
