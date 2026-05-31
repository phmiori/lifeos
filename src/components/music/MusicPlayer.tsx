'use client';
import { useEffect, useRef } from 'react';
import { usePlayerStore } from '@/lib/stores';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';

export function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const {
    currentSong, isPlaying, progress, volume,
    setPlaying, setProgress, setVolume, playNext,
  } = usePlayerStore();

  useEffect(() => {
    if (!audioRef.current || !currentSong) return;
    audioRef.current.src = `/api/music/songs/${currentSong.id}/stream`;
    audioRef.current.volume = volume;
    if (isPlaying) audioRef.current.play().catch(() => {});
  }, [currentSong]);

  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.play().catch(() => {});
    else audioRef.current.pause();
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const pct = (audioRef.current.currentTime / audioRef.current.duration) * 100;
    setProgress(isNaN(pct) ? 0 : pct);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    const pct = Number(e.target.value);
    audioRef.current.currentTime = (pct / 100) * (audioRef.current.duration || 0);
    setProgress(pct);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const currentTime = audioRef.current
    ? (progress / 100) * (audioRef.current.duration || 0)
    : 0;

  if (!currentSong) return null;

  return (
    <>
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={playNext}
      />
      <div className="music-player-bar">
        {/* Capa e info */}
        <div className="player-info">
          <div className="player-cover" style={{ background: 'var(--gradient-main)' }}>
            {currentSong.cover_url
              ? <img src={currentSong.cover_url} alt="" />
              : <span className="text-xs text-white">♪</span>}
          </div>
          <div>
            <p className="text-sm font-medium text-white truncate max-w-[160px]">
              {currentSong.title}
            </p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {currentSong.artist}
            </p>
          </div>
        </div>

        {/* Controles */}
        <div className="player-controls">
          <button className="btn-icon" onClick={() => usePlayerStore.getState().playPrev()}>
            <SkipBack size={16} />
          </button>
          <button
            className="btn-icon"
            style={{ background: 'var(--gradient-main)', border: 'none' }}
            onClick={() => setPlaying(!isPlaying)}
          >
            {isPlaying ? <Pause size={18} className="text-white" /> : <Play size={18} className="text-white" />}
          </button>
          <button className="btn-icon" onClick={playNext}>
            <SkipForward size={16} />
          </button>
        </div>

        {/* Progresso */}
        <div className="player-progress">
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {formatTime(currentTime)}
          </span>
          <input
            type="range" min="0" max="100"
            value={progress || 0}
            onChange={handleSeek}
            className="player-seek"
          />
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {formatTime(currentSong.duration_secs)}
          </span>
        </div>

        {/* Volume */}
        <div className="player-volume">
          <Volume2 size={14} style={{ color: 'var(--text-muted)' }} />
          <input
            type="range" min="0" max="1" step="0.01"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="player-seek"
            style={{ width: '80px' }}
          />
        </div>
      </div>
    </>
  );
}
