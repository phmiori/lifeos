'use client';
import { Sidebar } from './sidebar';
import { useAppStore } from '@/lib/stores';
import { cn } from '@/lib/utils';
import { MusicPlayer } from '@/components/music/MusicPlayer';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { sidebarCollapsed } = useAppStore();

  return (
    <div className="app-layout" style={{ paddingBottom: '80px' }}>
      <Sidebar />
      <main className={cn('app-main', sidebarCollapsed && 'sidebar-collapsed')}>
        {children}
      </main>
      <div className="player-footer">
        <MusicPlayer />
      </div>
    </div>
  );
}
