'use client';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Target, Plus, Trophy, Lock } from 'lucide-react';
import { AppLayout } from '@/components/layout/app-layout';
import { TopBar } from '@/components/layout/topbar';
import { useFinanceStore, useAppStore } from '@/lib/stores';
import { formatCurrency, formatCompact } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';

export default function GoalsPage() {
  const { goals } = useFinanceStore();
  const { achievements } = useAppStore();
  const [activeTab, setActiveTab] = useState<'financial' | 'achievements'>('financial');

  return (
    <AppLayout>
      <TopBar title="Metas & Conquistas" subtitle="Acompanhe seu progresso" />

      <div className="p-6 space-y-6">
        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-xl w-fit" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
          {[
            { id: 'financial', label: '🎯 Metas Financeiras' },
            { id: 'achievements', label: '🏆 Conquistas' },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                background: activeTab === tab.id ? 'var(--accent-primary)' : 'transparent',
                color: activeTab === tab.id ? 'white' : 'var(--text-secondary)',
              }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Financial Goals */}
        {activeTab === 'financial' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                {goals.filter(g => g.isCompleted).length} de {goals.length} metas atingidas
              </p>
              <button className="btn btn-primary text-xs" style={{ padding: '8px 14px' }}
                onClick={() => toast.info('Criação de metas disponível na versão completa!')}>
                <Plus size={14} /> Nova Meta
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {goals.map((goal, i) => {
                const pct = (goal.currentAmount / goal.targetAmount) * 100;
                const remaining = goal.targetAmount - goal.currentAmount;
                return (
                  <motion.div
                    key={goal.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="card p-5 cursor-pointer"
                    style={{
                      borderTop: `3px solid ${goal.color}`,
                      boxShadow: `0 0 30px ${goal.color}10`,
                    }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{goal.icon}</span>
                        <div>
                          <h3 className="font-bold text-white">{goal.title}</h3>
                          {goal.deadline && (
                            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                              até {format(new Date(goal.deadline), "d MMM yyyy", { locale: ptBR })}
                            </p>
                          )}
                        </div>
                      </div>
                      <span className="text-2xl font-black text-mono" style={{ color: goal.color }}>
                        {pct.toFixed(0)}%
                      </span>
                    </div>

                    {/* Large progress bar */}
                    <div className="progress-bar mb-3" style={{ height: '10px', borderRadius: '99px' }}>
                      <motion.div
                        className="progress-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(pct, 100)}%` }}
                        transition={{ duration: 1, delay: i * 0.06 + 0.3, ease: [0.4, 0, 0.2, 1] }}
                        style={{ background: goal.color, borderRadius: '99px' }}
                      />
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Acumulado</p>
                        <p className="font-bold text-mono text-white">{formatCompact(goal.currentAmount)}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Faltam</p>
                        <p className="font-bold text-mono" style={{ color: 'var(--text-secondary)' }}>
                          {formatCompact(remaining)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Meta</p>
                        <p className="font-bold text-mono text-white">{formatCompact(goal.targetAmount)}</p>
                      </div>
                    </div>

                    <button
                      className="btn btn-secondary w-full mt-4 text-xs"
                      style={{ padding: '8px', borderColor: `${goal.color}30` }}
                      onClick={(e) => {
                        e.stopPropagation();
                        toast.success(`+R$ 500 adicionado à meta "${goal.title}"!`);
                      }}
                    >
                      + Adicionar Aporte
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Achievements */}
        {activeTab === 'achievements' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              {achievements.filter(a => a.earned).length} de {achievements.length} conquistas desbloqueadas
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.map((ach, i) => (
                <motion.div
                  key={ach.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="card p-5 relative overflow-hidden"
                  style={{
                    opacity: ach.earned ? 1 : 0.6,
                    background: ach.earned ? 'rgba(18,18,26,0.9)' : 'var(--bg-secondary)',
                  }}
                >
                  {ach.earned && (
                    <div className="absolute top-0 right-0 w-16 h-16 opacity-10"
                      style={{ background: 'var(--gradient-gold)', borderBottomLeftRadius: '100%' }} />
                  )}

                  <div className="flex items-start gap-3">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                      style={{
                        background: ach.earned ? 'rgba(245,158,11,0.2)' : 'var(--bg-tertiary)',
                        border: `2px solid ${ach.earned ? '#F59E0B' : 'var(--border)'}`,
                        filter: ach.earned ? 'none' : 'grayscale(1)',
                      }}
                    >
                      {ach.earned ? ach.icon : <Lock size={18} style={{ color: 'var(--text-muted)' }} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm text-white">{ach.title}</h3>
                        {ach.earned && (
                          <Trophy size={12} className="text-yellow-400 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs mt-0.5 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                        {ach.description}
                      </p>
                    </div>
                  </div>

                  {ach.earned ? (
                    <div className="mt-3 flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-yellow-400" />
                      <p className="text-xs" style={{ color: '#FCD34D' }}>
                        Conquistado em {format(new Date(ach.earnedAt!), "d MMM yyyy", { locale: ptBR })}
                      </p>
                    </div>
                  ) : (
                    <div className="mt-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span style={{ color: 'var(--text-muted)' }}>Progresso</span>
                        <span style={{ color: 'var(--text-secondary)' }}>{ach.progress}%</span>
                      </div>
                      <div className="progress-bar" style={{ height: '4px' }}>
                        <motion.div
                          className="progress-fill"
                          initial={{ width: 0 }}
                          animate={{ width: `${ach.progress}%` }}
                          transition={{ duration: 0.8, delay: i * 0.05 }}
                          style={{ background: 'var(--gradient-main)' }}
                        />
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </AppLayout>
  );
}
