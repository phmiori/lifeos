'use client';
import { motion } from 'framer-motion';
import { Sun, Moon, Search, Plus } from 'lucide-react';
import { useAppStore } from '@/lib/stores';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useState } from 'react';

interface TopBarProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function TopBar({ title, subtitle, actions }: TopBarProps) {
  const { theme, toggleTheme, user } = useAppStore();
  const [searchFocused, setSearchFocused] = useState(false);

  const today = format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR });

  return (
    <header
      className="sticky top-0 z-30 px-6 py-4 flex items-center justify-between gap-4"
      style={{
        background: 'rgba(10,10,15,0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      {/* Title */}
      <div>
        <motion.h1
          key={title}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl font-bold text-white"
        >
          {title}
        </motion.h1>
        {subtitle && (
          <p className="text-sm capitalize" style={{ color: 'var(--text-muted)' }}>
            {subtitle || today}
          </p>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3 ml-auto">
        {/* Search */}
        <motion.div
          animate={{ width: searchFocused ? 240 : 160 }}
          className="relative hidden sm:block"
          style={{ transition: 'width 0.3s ease' }}
        >
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: 'var(--text-muted)' }}
          />
          <input
            className="input pl-9 py-2 text-sm"
            placeholder="Buscar..."
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
        </motion.div>

        {/* Theme Toggle */}
        <button onClick={toggleTheme} className="btn-icon" title="Alternar tema">
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* Custom actions */}
        {actions}

        {/* Quick Add */}
        <button className="btn btn-primary hidden sm:flex" style={{ padding: '8px 14px', fontSize: '13px' }}>
          <Plus size={15} />
          Adicionar
        </button>
      </div>
    </header>
  );
}
