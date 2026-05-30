import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number, currency = 'BRL'): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(value);
}

export function formatPercent(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

export function formatCompact(value: number): string {
  if (Math.abs(value) >= 1_000_000) return `R$ ${(value / 1_000_000).toFixed(1)}M`;
  if (Math.abs(value) >= 1_000) return `R$ ${(value / 1_000).toFixed(1)}K`;
  return formatCurrency(value);
}

export function getInitials(name: string): string {
  return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
}

export function getPriorityColor(priority: string) {
  const map: Record<string, string> = {
    LOW: 'text-slate-400',
    MEDIUM: 'text-yellow-400',
    HIGH: 'text-orange-400',
    URGENT: 'text-red-400',
  };
  return map[priority] || 'text-slate-400';
}

export function getStatusColor(status: string) {
  const map: Record<string, string> = {
    TODO: 'bg-slate-500/20 text-slate-400',
    IN_PROGRESS: 'bg-blue-500/20 text-blue-400',
    DONE: 'bg-green-500/20 text-green-400',
    CANCELLED: 'bg-red-500/20 text-red-400',
  };
  return map[status] || '';
}

export function xpToLevel(xp: number): { level: number; progress: number; xpInLevel: number; xpForLevel: number } {
  const baseXP = 500;
  let level = 1;
  let totalXP = 0;
  while (totalXP + baseXP * level <= xp) {
    totalXP += baseXP * level;
    level++;
  }
  const xpInLevel = xp - totalXP;
  const xpForLevel = baseXP * level;
  return { level, progress: (xpInLevel / xpForLevel) * 100, xpInLevel, xpForLevel };
}
