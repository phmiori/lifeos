'use client';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { TrendingDown, Activity, Flame, Dumbbell, Apple, Plus, ChevronRight } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar,
} from 'recharts';
import { AppLayout } from '@/components/layout/app-layout';
import { TopBar } from '@/components/layout/topbar';
import { useHealthStore } from '@/lib/stores';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';
import { MetricsModal } from '@/components/health/metrics-modal';
import { WorkoutModal } from '@/components/health/workout-modal';
import { MealModal } from '@/components/health/meal-modal';

const weeklyWorkouts = [
  { day: 'Seg', done: true, name: 'Peito' },
  { day: 'Ter', done: false, name: 'Descanso' },
  { day: 'Qua', done: true, name: 'Costas' },
  { day: 'Qui', done: false, name: 'Pernas' },
  { day: 'Sex', done: true, name: 'Ombro' },
  { day: 'Sáb', done: false, name: 'Cardio' },
  { day: 'Dom', done: false, name: 'Descanso' },
];

export default function HealthPage() {
  const { bodyMetrics, workouts, nutrition } = useHealthStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'fitness' | 'nutrition'>('overview');
  const [isMetricsModalOpen, setMetricsModalOpen] = useState(false);
  const [isWorkoutModalOpen, setWorkoutModalOpen] = useState(false);
  const [isMealModalOpen, setMealModalOpen] = useState(false);

  const weightData = bodyMetrics.slice(-14).map(m => ({
    date: m.date,
    peso: Number(m.weight.toFixed(1)),
  }));

  const calsNet = nutrition.calories.consumed - nutrition.calories.burned;
  const calsBalance = nutrition.calories.target - calsNet;

  return (
    <AppLayout>
      <MetricsModal isOpen={isMetricsModalOpen} onClose={() => setMetricsModalOpen(false)} />
      <WorkoutModal isOpen={isWorkoutModalOpen} onClose={() => setWorkoutModalOpen(false)} />
      <MealModal isOpen={isMealModalOpen} onClose={() => setMealModalOpen(false)} />
      <TopBar title="Saúde & Fitness" subtitle="Acompanhe seu progresso físico" />

      <div className="p-6 space-y-6">

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Peso Atual', value: '82.0 kg', change: '-0.5kg semana', up: false, positive: true, icon: TrendingDown, color: '#10B981' },
            { label: 'Treinos no Mês', value: '12', change: '80% da meta', up: true, positive: true, icon: Dumbbell, color: '#6366F1' },
            { label: 'Calorias Hoje', value: `${nutrition.calories.consumed}`, change: `/${nutrition.calories.target} kcal`, up: true, positive: true, icon: Flame, color: '#F59E0B' },
            { label: 'Proteína', value: `${nutrition.protein.consumed}g`, change: `/${nutrition.protein.target}g meta`, up: true, positive: true, icon: Activity, color: '#EF4444' },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="stat-card">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{s.label}</p>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${s.color}20`, color: s.color }}>
                  <s.icon size={17} />
                </div>
              </div>
              <p className="text-2xl font-bold text-mono text-white mb-1">{s.value}</p>
              <span className="text-xs" style={{ color: s.positive ? '#34D399' : 'var(--text-muted)' }}>{s.change}</span>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-xl w-fit" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
          {(['overview', 'fitness', 'nutrition'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{ background: activeTab === tab ? 'var(--accent-primary)' : 'transparent', color: activeTab === tab ? 'white' : 'var(--text-secondary)' }}>
              {tab === 'overview' ? 'Visão Geral' : tab === 'fitness' ? 'Treinos' : 'Nutrição'}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Weight Chart */}
              <div className="card p-5">
                <h3 className="font-semibold text-white mb-1">Evolução do Peso</h3>
                <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>Últimas 2 semanas</p>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={weightData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="date" tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false}
                      tickFormatter={v => v.slice(8)} />
                    <YAxis tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false}
                      domain={['auto', 'auto']} tickFormatter={v => `${v}kg`} />
                    <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 10 }} />
                    <Line type="monotone" dataKey="peso" stroke="#10B981" strokeWidth={2.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Weekly Schedule */}
              <div className="card p-5">
                <h3 className="font-semibold text-white mb-4">Semana de Treinos</h3>
                <div className="grid grid-cols-7 gap-1.5">
                  {weeklyWorkouts.map((day, i) => (
                    <div key={i} className="flex flex-col items-center gap-1.5">
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{day.day}</span>
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold"
                        style={{
                          background: day.done ? 'rgba(16,185,129,0.2)' : 'var(--bg-tertiary)',
                          border: `1px solid ${day.done ? '#10B981' : 'var(--border)'}`,
                          color: day.done ? '#34D399' : 'var(--text-muted)',
                        }}
                      >
                        {day.done ? '✓' : '·'}
                      </div>
                      <span className="text-xs text-center leading-tight" style={{ color: 'var(--text-muted)', fontSize: 10 }}>
                        {day.name}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Body metrics */}
                <div className="mt-5 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
                  <h4 className="text-sm font-semibold text-white mb-3">Medidas Corporais</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Peso', value: '82.0 kg' },
                      { label: 'Gordura Corporal', value: '17.5%' },
                      { label: 'Cintura', value: '84 cm' },
                      { label: 'Peito', value: '102 cm' },
                    ].map(m => (
                      <div key={m.label} className="p-2 rounded-lg" style={{ background: 'var(--bg-tertiary)' }}>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{m.label}</p>
                        <p className="font-bold text-sm text-mono text-white">{m.value}</p>
                      </div>
                    ))}
                  </div>
                  <button className="btn btn-secondary w-full mt-3 text-xs" style={{ padding: '8px' }}
                    onClick={() => setMetricsModalOpen(true)}>
                    <Plus size={13} /> Registrar Medidas
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'fitness' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-white">Histórico de Treinos</h3>
              <button className="btn btn-primary text-xs" style={{ padding: '8px 14px' }}
                onClick={() => setWorkoutModalOpen(true)}>
                <Plus size={14} /> Registrar Treino
              </button>
            </div>
            {workouts.map((wo, i) => (
              <motion.div key={wo.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-white">{wo.name}</h4>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      {format(new Date(wo.date), "d 'de' MMMM", { locale: ptBR })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-center">
                      <p className="text-sm font-bold text-white">{wo.duration}</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>min</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-white">{wo.caloriesBurned}</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>kcal</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {wo.exercises.map((ex, j) => (
                    <span key={j} className="px-2.5 py-1 rounded-lg text-xs" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
                      {ex.name} · {ex.sets}x{ex.reps} @ {ex.weight}kg
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {activeTab === 'nutrition' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            {/* Macros */}
            <div className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white">Macros de Hoje</h3>
                <span className="badge badge-success">{calsBalance > 0 ? `${calsBalance} kcal disponíveis` : 'Meta atingida!'}</span>
              </div>

              <div className="grid grid-cols-4 gap-4 mb-5">
                {[
                  { label: 'Calorias', val: nutrition.calories.consumed, target: nutrition.calories.target, unit: 'kcal', color: '#F59E0B' },
                  { label: 'Proteína', val: nutrition.protein.consumed, target: nutrition.protein.target, unit: 'g', color: '#EF4444' },
                  { label: 'Carboidratos', val: nutrition.carbs.consumed, target: nutrition.carbs.target, unit: 'g', color: '#6366F1' },
                  { label: 'Gordura', val: nutrition.fat.consumed, target: nutrition.fat.target, unit: 'g', color: '#10B981' },
                ].map(m => (
                  <div key={m.label} className="text-center">
                    <div className="relative w-16 h-16 mx-auto mb-2">
                      <svg className="w-16 h-16 -rotate-90" viewBox="0 0 56 56">
                        <circle cx="28" cy="28" r="22" fill="none" stroke="var(--bg-tertiary)" strokeWidth="6" />
                        <circle cx="28" cy="28" r="22" fill="none" stroke={m.color} strokeWidth="6"
                          strokeDasharray={`${(m.val / m.target) * 138} 138`}
                          strokeLinecap="round"
                          style={{ transition: 'stroke-dasharray 0.8s ease' }}
                        />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-xs font-bold" style={{ color: m.color }}>
                        {Math.round(m.val / m.target * 100)}%
                      </span>
                    </div>
                    <p className="text-xs font-medium text-white">{m.val}{m.unit}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>/{m.target}{m.unit}</p>
                    <p className="text-xs font-medium mt-0.5" style={{ color: m.color }}>{m.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Meals */}
            <div className="space-y-3">
              <h3 className="font-semibold text-white">Refeições do Dia</h3>
              {nutrition.meals.map((meal, i) => (
                <motion.div key={meal.name} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }} className="card p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                    style={{ background: 'var(--bg-tertiary)' }}>
                    {i === 0 ? '☀️' : i === 1 ? '🥗' : i === 2 ? '⚡' : '🌙'}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-white text-sm">{meal.name}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      {meal.foods.join(' · ')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-mono text-white text-sm">{meal.calories}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>kcal · {meal.time}</p>
                  </div>
                </motion.div>
              ))}
              <button className="btn btn-secondary w-full"
                onClick={() => setMealModalOpen(true)}>
                <Plus size={15} /> Adicionar Refeição
              </button>
            </div>
          </motion.div>
        )}

      </div>
    </AppLayout>
  );
}
