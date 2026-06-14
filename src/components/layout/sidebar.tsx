'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Wallet, CheckSquare, Calendar, Bot,
  Heart, ShoppingCart, Target, Settings, ChevronLeft, Zap,
  TrendingUp, Bell, Music, Film, Car, LogOut
} from 'lucide-react';
import { useAppStore, useAuthStore } from '@/lib/stores';
import { cn, formatCompact } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/finance', label: 'Finanças', icon: Wallet },
  { href: '/tasks', label: 'Tarefas', icon: CheckSquare },
  { href: '/calendar', label: 'Calendário', icon: Calendar },
  { href: '/health', label: 'Saúde', icon: Heart },
  { href: '/music', label: 'Música', icon: Music },
  { href: '/movies', label: 'Filmes', icon: Film },
  { href: '/garage', label: 'Garagem', icon: Car },
  { href: '/shopping', label: 'Compras', icon: ShoppingCart },
  { href: '/goals', label: 'Metas', icon: Target },
  { href: '/ai', label: 'IA Assistente', icon: Bot },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { sidebarCollapsed, toggleSidebar } = useAppStore();
  const { user: authUser, logout } = useAuthStore();

  const displayName = authUser?.username ?? 'Usuário';
  const displayInitials = displayName.slice(0, 2).toUpperCase();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const totalBalance = 65570.50;

  return (
    <aside className={cn('app-sidebar', sidebarCollapsed && 'collapsed')}>
      {/* Logo */}
      <div className="flex items-center justify-between p-4 mb-2">
        <AnimatePresence>
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'var(--gradient-main)' }}>
                <Zap size={16} className="text-white" />
              </div>
              <span className="font-bold text-lg gradient-text">LifeOS</span>
            </motion.div>
          )}
        </AnimatePresence>
        {sidebarCollapsed && (
          <div className="w-8 h-8 rounded-lg flex items-center justify-center mx-auto"
            style={{ background: 'var(--gradient-main)' }}>
            <Zap size={16} className="text-white" />
          </div>
        )}
        {!sidebarCollapsed && (
          <button onClick={toggleSidebar} className="btn-icon" title="Recolher sidebar">
            <ChevronLeft size={16} />
          </button>
        )}
      </div>

      {/* User Profile */}
      <AnimatePresence>
        {!sidebarCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mx-3 mb-4 p-3 rounded-xl"
            style={{ background: 'var(--bg-glass)', border: '1px solid var(--border)' }}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                style={{ background: 'var(--gradient-main)' }}>
                {displayInitials}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate">{displayName}</p>
                <p className="text-xs flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                  <Zap size={10} className="text-yellow-400" />
                  {authUser?.role === 'admin' ? 'Admin' : 'Usuário'}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="btn-icon ml-auto flex-shrink-0"
                style={{ padding: '6px' }}
                title="Sair"
              >
                <LogOut size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collapsed toggle */}
      {sidebarCollapsed && (
        <button onClick={toggleSidebar} className="btn-icon mx-auto mb-2 block">
          <ChevronLeft size={16} className="rotate-180" />
        </button>
      )}

      {/* Net Worth (expanded) */}
      <AnimatePresence>
        {!sidebarCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mx-3 mb-4 p-3 rounded-xl"
            style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}
          >
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp size={14} style={{ color: 'var(--accent-primary)' }} />
              <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Patrimônio Total</span>
            </div>
            <p className="font-bold text-lg text-mono" style={{ color: 'var(--accent-primary)' }}>
              {formatCompact(totalBalance)}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nav Links */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto no-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn('nav-item', isActive && 'active')}
              title={sidebarCollapsed ? item.label : undefined}
            >
              <Icon size={18} className="nav-icon flex-shrink-0" />
              <AnimatePresence>
                {!sidebarCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.15 }}
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      {/* Divider */}
      <div className="divider mx-3" />

      {/* Settings */}
      <div className="px-3 pb-4">
        <Link
          href="/settings"
          className={cn('nav-item', pathname === '/settings' && 'active')}
          title={sidebarCollapsed ? 'Configurações' : undefined}
        >
          <Settings size={18} className="nav-icon flex-shrink-0" />
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                Configurações
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
      </div>
    </aside>
  );
}
