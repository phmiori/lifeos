'use client';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glass?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
  delay?: number;
}

export function Card({ children, className, glass, onClick, style, delay = 0 }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay, ease: [0.4, 0, 0.2, 1] }}
      className={cn(glass ? 'glass-card' : 'card', onClick && 'cursor-pointer', className)}
      onClick={onClick}
      style={style}
    >
      {children}
    </motion.div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  changePositive?: boolean;
  icon?: React.ReactNode;
  color?: string;
  delay?: number;
  subtitle?: string;
}

export function StatCard({ title, value, change, changePositive, icon, color, delay = 0, subtitle }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.4, 0, 0.2, 1] }}
      className="stat-card"
    >
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{title}</p>
        {icon && (
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: color ? `${color}20` : 'var(--bg-glass)', color: color || 'var(--text-secondary)' }}
          >
            {icon}
          </div>
        )}
      </div>
      <p className="text-2xl font-bold text-mono text-white mb-1">{value}</p>
      {subtitle && <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{subtitle}</p>}
      {change && (
        <span className={cn('text-xs font-semibold', changePositive ? 'money-positive' : 'money-negative')}>
          {changePositive ? '▲' : '▼'} {change}
        </span>
      )}
    </motion.div>
  );
}
