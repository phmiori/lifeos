'use client';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  TrendingUp, TrendingDown, DollarSign, Target, CheckSquare,
  Calendar, Zap, Trophy, Flame, ArrowUpRight, ArrowDownRight,
  ChevronRight, Lightbulb, AlertTriangle, Info,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import { AppLayout } from '@/components/layout/app-layout';
import { TopBar } from '@/components/layout/topbar';
import { StatCard } from '@/components/ui/card';
import { useFinanceStore, useTasksStore, useAppStore, useHealthStore, useAuthStore } from '@/lib/stores';
import { formatCurrency, formatCompact, formatPercent } from '@/lib/utils';
import Link from 'next/link';

const INSIGHT_COLORS = {
  warning: { bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.25)', icon: '#F59E0B', Icon: AlertTriangle },
  success: { bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.25)', icon: '#10B981', Icon: Trophy },
  info: { bg: 'rgba(99,102,241,0.1)', border: 'rgba(99,102,241,0.25)', icon: '#6366F1', Icon: Lightbulb },
  danger: { bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.25)', icon: '#EF4444', Icon: AlertTriangle },
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border)',
        borderRadius: 12,
        padding: '10px 14px',
        boxShadow: 'var(--shadow-card)',
      }}>
        <p className="text-xs mb-2 font-medium" style={{ color: 'var(--text-muted)' }}>{label}</p>
        {payload.map((p: any) => (
          <div key={p.name} className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span style={{ color: 'var(--text-secondary)' }}>{p.name}:</span>
            <span className="font-semibold text-white">{formatCompact(p.value)}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function DashboardPage() {
  const { accounts, transactions, goals, monthlyData } = useFinanceStore();
  const { tasks, habits } = useTasksStore();
  const { user: authUser } = useAuthStore();
  const { insights } = useAppStore();
  const { nutrition } = useHealthStore();

  const totalBalance = accounts.reduce((s, a) => s + a.balance, 0);
  const monthIncome = transactions.filter(t => t.type === 'INCOME').reduce((s, t) => s + t.amount, 0);
  const monthExpenses = transactions.filter(t => t.type === 'EXPENSE').reduce((s, t) => s + t.amount, 0);
  const pendingTasks = tasks.filter(t => t.status !== 'DONE').length;
  const completedHabits = habits.filter(h => h.completedToday).length;

  const today = format(new Date(), "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR });

  const totalInvestments = accounts.filter(a => a.type === 'INVESTMENT').reduce((s, a) => s + a.balance, 0);

  const investmentAlloc = accounts.filter(a => a.type === 'INVESTMENT').length > 0 ? accounts
    .filter(a => a.type === 'INVESTMENT')
    .map(a => ({ name: a.name, value: a.balance, color: a.color })) : [
      { name: 'Sem Investimentos', value: 100, color: 'var(--bg-tertiary)' }
    ];

  return (
    <AppLayout>
      <TopBar
        title="Dashboard"
        subtitle={today}
      />

      <div className="p-6 space-y-6">

        {/* GREETING */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h2 className="text-2xl font-bold text-white">
              Bom dia, {authUser?.username?.split(' ')[0] || 'Visitante'}! 👋
            </h2>
            <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
              {pendingTasks} tarefas pendentes · {completedHabits}/{habits.length} hábitos concluídos hoje
            </p>
          </div>

          {/* Streak */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl"
            style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}
          >
            <Flame size={18} className="text-yellow-400" />
            <span className="font-bold text-yellow-400">0</span>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>dias</span>
          </motion.div>
        </motion.div>

        {/* STAT CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Patrimônio Total"
            value={formatCompact(totalBalance)}
            change="12.4% este mês"
            changePositive
            icon={<DollarSign size={18} />}
            color="#6366F1"
            delay={0.05}
          />
          <StatCard
            title="Receitas"
            value={formatCompact(monthIncome)}
            subtitle="este mês"
            icon={<TrendingUp size={18} />}
            color="#10B981"
            delay={0.1}
          />
          <StatCard
            title="Despesas"
            value={formatCompact(monthExpenses)}
            change="8.2% vs. mês passado"
            changePositive={false}
            icon={<TrendingDown size={18} />}
            color="#EF4444"
            delay={0.15}
          />
          <StatCard
            title="Investimentos"
            value={formatCompact(totalInvestments)}
            change="6.3% este mês"
            changePositive
            icon={<TrendingUp size={18} />}
            color="#3B82F6"
            delay={0.2}
          />
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* CHART — left 2/3 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="lg:col-span-2 card p-5"
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-semibold text-white">Evolução Financeira</h3>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Últimos 6 meses</p>
              </div>
              <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full inline-block" style={{ background: '#10B981' }} />Receitas</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full inline-block" style={{ background: '#EF4444' }} />Despesas</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="colorReceitas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorDespesas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" tick={{ fill: '#475569', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `R$${(v/1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="receitas" name="Receitas" stroke="#10B981" strokeWidth={2.5} fill="url(#colorReceitas)" dot={false} />
                <Area type="monotone" dataKey="despesas" name="Despesas" stroke="#EF4444" strokeWidth={2.5} fill="url(#colorDespesas)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* INVESTMENT ALLOCATION — right 1/3 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card p-5"
          >
            <h3 className="font-semibold text-white mb-1">Alocação</h3>
            <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>Portfólio de investimentos</p>
            <div className="flex justify-center">
              <PieChart width={160} height={160}>
                <Pie data={investmentAlloc} cx={75} cy={75} innerRadius={52} outerRadius={72} paddingAngle={3} dataKey="value">
                  {investmentAlloc.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </div>
            <div className="space-y-2 mt-3">
              {investmentAlloc.map(a => (
                <div key={a.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: a.color }} />
                    <span style={{ color: 'var(--text-secondary)' }}>{a.name}</span>
                  </div>
                  <span className="font-semibold text-white">{a.value}%</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* BOTTOM GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* TASKS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="card p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CheckSquare size={17} style={{ color: 'var(--accent-primary)' }} />
                <h3 className="font-semibold text-white">Tarefas de Hoje</h3>
              </div>
              <Link href="/tasks" className="text-xs flex items-center gap-1" style={{ color: 'var(--accent-primary)' }}>
                Ver todas <ChevronRight size={12} />
              </Link>
            </div>
            <div className="space-y-2">
              {tasks.slice(0, 5).map((task) => (
                <div key={task.id} className="flex items-start gap-3 p-3 rounded-xl"
                  style={{ background: 'var(--bg-tertiary)' }}>
                  <div className={`w-4 h-4 rounded-full mt-0.5 flex-shrink-0 border-2 flex items-center justify-center ${
                    task.status === 'DONE' ? 'border-emerald-500 bg-emerald-500' : 'border-slate-500'
                  }`}>
                    {task.status === 'DONE' && <span className="text-white text-xs">✓</span>}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm font-medium ${task.status === 'DONE' ? 'line-through opacity-50' : 'text-white'}`}>
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`badge text-xs ${
                        task.priority === 'URGENT' ? 'badge-danger' :
                        task.priority === 'HIGH' ? 'badge-warning' : 'badge-muted'
                      }`}>{task.priority}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* HABITS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Flame size={17} className="text-yellow-400" />
                <h3 className="font-semibold text-white">Hábitos de Hoje</h3>
              </div>
              <span className="badge badge-warning">{completedHabits}/{habits.length}</span>
            </div>
            <div className="space-y-3">
              {habits.map((habit) => (
                <div key={habit.id} className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                    style={{
                      background: habit.completedToday ? `${habit.color}25` : 'var(--bg-tertiary)',
                      border: `1px solid ${habit.completedToday ? `${habit.color}50` : 'var(--border)'}`,
                    }}
                  >
                    {habit.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white">{habit.name}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Flame size={11} className="text-orange-400" />
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{habit.streak} dias</span>
                    </div>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center ${
                      habit.completedToday ? 'bg-emerald-500' : ''
                    }`}
                    style={!habit.completedToday ? { border: '2px solid var(--border)' } : {}}
                  >
                    {habit.completedToday && <span className="text-white text-xs">✓</span>}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* AI INSIGHTS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="card p-5"
          >
            <div className="flex items-center gap-2 mb-4">
              <Zap size={17} style={{ color: 'var(--accent-primary)' }} />
              <h3 className="font-semibold text-white">Insights da IA</h3>
            </div>
            <div className="space-y-3">
              {insights.map((ins) => {
                const config = INSIGHT_COLORS[ins.type as keyof typeof INSIGHT_COLORS] || INSIGHT_COLORS.info;
                const Icon = config.Icon;
                return (
                  <div
                    key={ins.id}
                    className="p-3 rounded-xl cursor-pointer transition-all hover:scale-[1.01]"
                    style={{ background: config.bg, border: `1px solid ${config.border}` }}
                  >
                    <div className="flex items-start gap-2.5">
                      <Icon size={15} style={{ color: config.icon, flexShrink: 0, marginTop: 1 }} />
                      <div>
                        <p className="text-sm font-medium text-white leading-snug">{ins.title}</p>
                        <p className="text-xs mt-0.5 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                          {ins.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* FINANCIAL GOALS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card p-5"
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Target size={17} style={{ color: 'var(--accent-primary)' }} />
              <h3 className="font-semibold text-white">Metas Financeiras</h3>
            </div>
            <Link href="/goals" className="text-xs flex items-center gap-1" style={{ color: 'var(--accent-primary)' }}>
              Gerenciar <ChevronRight size={12} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {useFinanceStore.getState().goals.map((goal, i) => {
              const pct = (goal.currentAmount / goal.targetAmount) * 100;
              return (
                <div key={goal.id} className="p-4 rounded-xl" style={{ background: 'var(--bg-tertiary)' }}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">{goal.icon}</span>
                    <p className="text-sm font-medium text-white leading-tight">{goal.title}</p>
                  </div>
                  <div className="progress-bar mb-2">
                    <div className="progress-fill" style={{ width: `${pct}%`, background: goal.color }} />
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-mono" style={{ color: goal.color }}>
                      {formatCompact(goal.currentAmount)}
                    </span>
                    <span style={{ color: 'var(--text-muted)' }}>{formatCompact(goal.targetAmount)}</span>
                  </div>
                  <p className="text-xs mt-1 font-semibold" style={{ color: goal.color }}>{pct.toFixed(0)}%</p>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* RECENT TRANSACTIONS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="card p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">Transações Recentes</h3>
            <Link href="/finance" className="text-xs flex items-center gap-1" style={{ color: 'var(--accent-primary)' }}>
              Ver todas <ChevronRight size={12} />
            </Link>
          </div>
          <div className="space-y-2">
            {transactions.slice(0, 6).map((tx) => (
              <div key={tx.id} className="flex items-center gap-3 p-3 rounded-xl transition-colors hover:bg-white/[0.02]">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                  style={{ background: 'var(--bg-tertiary)' }}>
                  {tx.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{tx.description}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {format(tx.date, "d 'de' MMM", { locale: ptBR })}
                  </p>
                </div>
                <span className={`font-bold text-sm text-mono flex-shrink-0 ${
                  tx.type === 'INCOME' ? 'money-positive' : 'money-negative'
                }`}>
                  {tx.type === 'INCOME' ? '+' : '-'}{formatCurrency(tx.amount)}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </AppLayout>
  );
}
