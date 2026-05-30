'use client';
import { Sidebar } from './sidebar';
import { useAppStore } from '@/lib/stores';
import { cn } from '@/lib/utils';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { sidebarCollapsed } = useAppStore();

  return (
    <div className="app-layout">
      <Sidebar />
      <main className={cn('app-main', sidebarCollapsed && 'sidebar-collapsed')}>
        {children}
      </main>
    </div>
  );
}
