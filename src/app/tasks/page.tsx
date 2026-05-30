'use client';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Plus, CheckSquare, Kanban, Flame, GripVertical, ChevronDown, Tag } from 'lucide-react';
import { AppLayout } from '@/components/layout/app-layout';
import { TopBar } from '@/components/layout/topbar';
import { useTasksStore } from '@/lib/stores';
import { mockProjects } from '@/lib/mock-data';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const PRIORITY_CONFIG = {
  LOW: { label: 'Baixa', color: '#475569', bg: 'rgba(71,85,105,0.2)' },
  MEDIUM: { label: 'Média', color: '#F59E0B', bg: 'rgba(245,158,11,0.15)' },
  HIGH: { label: 'Alta', color: '#F97316', bg: 'rgba(249,115,22,0.15)' },
  URGENT: { label: 'Urgente', color: '#EF4444', bg: 'rgba(239,68,68,0.15)' },
};

const STATUS_CONFIG = {
  TODO: { label: 'A Fazer', color: '#475569' },
  IN_PROGRESS: { label: 'Em Progresso', color: '#3B82F6' },
  DONE: { label: 'Concluído', color: '#10B981' },
  CANCELLED: { label: 'Cancelado', color: '#EF4444' },
};

export default function TasksPage() {
  const { tasks, habits, updateTask, toggleHabit } = useTasksStore();
  const [view, setView] = useState<'list' | 'kanban' | 'habits'>('list');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const filteredTasks = filterStatus === 'ALL'
    ? tasks
    : tasks.filter(t => t.status === filterStatus);

  const kanbanCols = [
    { id: 'TODO', label: 'A Fazer', color: '#475569' },
    { id: 'IN_PROGRESS', label: 'Em Progresso', color: '#3B82F6' },
    { id: 'DONE', label: 'Concluído', color: '#10B981' },
  ];

  return (
    <AppLayout>
      <TopBar
        title="Tarefas"
        subtitle="Gerencie sua produtividade"
        actions={
          <button className="btn btn-primary text-sm" style={{ padding: '8px 14px' }}
            onClick={() => toast.info('Modal de criação disponível na versão completa!')}>
            <Plus size={15} /> Nova Tarefa
          </button>
        }
      />

      <div className="p-6 space-y-5">

        {/* View Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
            {[
              { id: 'list', label: 'Lista', Icon: CheckSquare },
              { id: 'kanban', label: 'Kanban', Icon: Kanban },
              { id: 'habits', label: 'Hábitos', Icon: Flame },
            ].map(({ id, label, Icon }) => (
              <button
                key={id}
                onClick={() => setView(id as any)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={{
                  background: view === id ? 'var(--accent-primary)' : 'transparent',
                  color: view === id ? 'white' : 'var(--text-secondary)',
                }}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
          </div>

          {/* Filter */}
          {view === 'list' && (
            <div className="flex gap-2">
              {['ALL', 'TODO', 'IN_PROGRESS', 'DONE'].map(s => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                  style={{
                    background: filterStatus === s ? 'rgba(99,102,241,0.2)' : 'var(--bg-secondary)',
                    color: filterStatus === s ? '#818CF8' : 'var(--text-muted)',
                    border: `1px solid ${filterStatus === s ? 'rgba(99,102,241,0.3)' : 'var(--border)'}`,
                  }}
                >
                  {s === 'ALL' ? 'Todos' : STATUS_CONFIG[s as keyof typeof STATUS_CONFIG]?.label || s}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* LIST VIEW */}
        {view === 'list' && (
          <div className="space-y-2">
            {filteredTasks.map((task, i) => {
              const pCfg = PRIORITY_CONFIG[task.priority as keyof typeof PRIORITY_CONFIG];
              const project = mockProjects.find(p => p.id === task.projectId);
              return (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="card p-4 flex items-start gap-3 cursor-pointer group"
                  onClick={() => updateTask(task.id, {
                    status: task.status === 'DONE' ? 'TODO' : 'DONE'
                  })}
                >
                  {/* Checkbox */}
                  <div className={cn(
                    'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all',
                    task.status === 'DONE'
                      ? 'border-emerald-500 bg-emerald-500'
                      : 'border-slate-600 group-hover:border-indigo-400'
                  )}>
                    {task.status === 'DONE' && <span className="text-white text-xs">✓</span>}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <p className={cn('font-medium text-sm', task.status === 'DONE' && 'line-through opacity-40')}
                        style={{ color: task.status !== 'DONE' ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                        {task.title}
                      </p>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {/* Priority badge */}
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold"
                          style={{ background: pCfg.bg, color: pCfg.color }}>
                          {pCfg.label}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                      {project && (
                        <span className="flex items-center gap-1 text-xs" style={{ color: project.color }}>
                          <span>{project.icon}</span> {project.name}
                        </span>
                      )}
                      {task.dueDate && (
                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                          📅 {format(task.dueDate, "d MMM", { locale: ptBR })}
                        </span>
                      )}
                      {task.labels.map(l => (
                        <span key={l} className="badge badge-muted">{l}</span>
                      ))}
                      {task.subtasks.length > 0 && (
                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                          {task.subtasks.filter((s: any) => s.completed).length}/{task.subtasks.length} subtarefas
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* KANBAN VIEW */}
        {view === 'kanban' && (
          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
            {kanbanCols.map(col => {
              const colTasks = tasks.filter(t => t.status === col.id);
              return (
                <div key={col.id} className="kanban-column flex-shrink-0">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: col.color }} />
                      <span className="font-semibold text-sm text-white">{col.label}</span>
                      <span className="badge badge-muted">{colTasks.length}</span>
                    </div>
                    <button className="btn-icon" style={{ padding: '4px' }}>
                      <Plus size={14} />
                    </button>
                  </div>

                  <div className="space-y-2">
                    {colTasks.map((task, i) => {
                      const pCfg = PRIORITY_CONFIG[task.priority as keyof typeof PRIORITY_CONFIG];
                      return (
                        <motion.div
                          key={task.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.04 }}
                          className="kanban-card"
                        >
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <p className="font-medium text-sm text-white leading-snug">{task.title}</p>
                            <GripVertical size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                          </div>

                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="px-2 py-0.5 rounded-full text-xs font-semibold"
                              style={{ background: pCfg.bg, color: pCfg.color }}>
                              {pCfg.label}
                            </span>
                            {task.dueDate && (
                              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                                {format(task.dueDate, "d MMM", { locale: ptBR })}
                              </span>
                            )}
                          </div>

                          {task.subtasks.length > 0 && (
                            <div className="mt-2">
                              <div className="progress-bar" style={{ height: '3px' }}>
                                <div className="progress-fill" style={{
                                  width: `${(task.subtasks.filter((s: any) => s.completed).length / task.subtasks.length) * 100}%`
                                }} />
                              </div>
                              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                                {task.subtasks.filter((s: any) => s.completed).length}/{task.subtasks.length}
                              </p>
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* HABITS VIEW */}
        {view === 'habits' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {habits.map((habit, i) => (
                <motion.div
                  key={habit.id}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="card p-5 cursor-pointer"
                  onClick={() => {
                    toggleHabit(habit.id);
                    toast.success(habit.completedToday
                      ? `${habit.name} desmarcado`
                      : `${habit.name} concluído! 🎉`
                    );
                  }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                      style={{
                        background: habit.completedToday ? `${habit.color}25` : 'var(--bg-tertiary)',
                        border: `2px solid ${habit.completedToday ? habit.color : 'var(--border)'}`,
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {habit.icon}
                    </div>
                    <div
                      className={cn(
                        'w-8 h-8 rounded-full flex items-center justify-center transition-all',
                        habit.completedToday ? 'bg-emerald-500' : 'border-2 border-slate-600'
                      )}
                    >
                      {habit.completedToday && <span className="text-white text-sm">✓</span>}
                    </div>
                  </div>

                  <h3 className="font-semibold text-white mb-1">{habit.name}</h3>

                  <div className="flex items-center gap-1.5">
                    <Flame size={13} className="text-orange-400" />
                    <span className="text-sm font-bold" style={{ color: 'var(--accent-warning)' }}>
                      {habit.streak} dias
                    </span>
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>de sequência</span>
                  </div>

                  {/* Streak visualization */}
                  <div className="flex gap-1 mt-3">
                    {Array.from({ length: 7 }, (_, d) => (
                      <div
                        key={d}
                        className="flex-1 h-1.5 rounded-full"
                        style={{
                          background: d < (habit.completedToday ? 7 : habit.streak % 7)
                            ? habit.color
                            : 'var(--bg-tertiary)',
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              ))}

              {/* Add Habit */}
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: habits.length * 0.05 }}
                className="card p-5 flex flex-col items-center justify-center gap-3 cursor-pointer border-dashed opacity-60 hover:opacity-100"
                onClick={() => toast.info('Criação de hábitos disponível na versão completa!')}
              >
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{ background: 'var(--bg-glass)', border: '2px dashed var(--border)' }}>
                  <Plus size={20} style={{ color: 'var(--text-muted)' }} />
                </div>
                <p className="text-sm text-center" style={{ color: 'var(--text-muted)' }}>Adicionar novo hábito</p>
              </motion.div>
            </div>
          </div>
        )}

      </div>
    </AppLayout>
  );
}
