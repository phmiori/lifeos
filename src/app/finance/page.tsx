'use client';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Wallet, TrendingUp, TrendingDown, CreditCard, PiggyBank,
  Plus, Filter, Search, ArrowUpRight, ArrowDownRight, ChevronRight,
  BarChart3, Download
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, AreaChart, Area
} from 'recharts';
import { AppLayout } from '@/components/layout/app-layout';
import { TopBar } from '@/components/layout/topbar';
import { useFinanceStore } from '@/lib/stores';
import { formatCurrency, formatCompact, formatPercent } from '@/lib/utils';
import { mockMonthlyData, mockCategories } from '@/lib/mock-data';
import { toast } from 'sonner';

const ACCOUNT_TYPE_LABELS: Record<string, { label: string; icon: string }> = {
  CHECKING: { label: 'Conta Corrente', icon: '🏦' },
  SAVINGS: { label: 'Poupança', icon: '🐷' },
  WALLET: { label: 'Carteira', icon: '👛' },
  CREDIT_CARD: { label: 'Cartão de Crédito', icon: '💳' },
  INVESTMENT: { label: 'Investimentos', icon: '📈' },
};

const categorySpend = [
  { name: 'Alimentação', value: 620, limit: 485, color: '#EF4444' },
  { name: 'Transporte', value: 280, limit: 350, color: '#F59E0B' },
  { name: 'Moradia', value: 1200, limit: 1200, color: '#8B5CF6' },
  { name: 'Lazer', value: 340, limit: 400, color: '#EC4899' },
  { name: 'Saúde', value: 387, limit: 450, color: '#10B981' },
  { name: 'Assinaturas', value: 145, limit: 200, color: '#3B82F6' },
];

export default function FinancePage() {
  const { accounts, transactions, investments } = useFinanceStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'investments' | 'budget'>('overview');
  const [searchTerm, setSearchTerm] = useState('');

  const totalBalance = accounts.reduce((s, a) => s + a.balance, 0);
  const totalIncome = transactions.filter(t => t.type === 'INCOME').reduce((s, t) => s + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'EXPENSE').reduce((s, t) => s + t.amount, 0);
  const totalInvestments = accounts.find(a => a.type === 'INVESTMENT')?.balance || 0;

  const filteredTransactions = transactions.filter(t =>
    t.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tabs = [
    { id: 'overview', label: 'Visão Geral' },
    { id: 'transactions', label: 'Transações' },
    { id: 'investments', label: 'Investimentos' },
    { id: 'budget', label: 'Orçamento' },
  ] as const;

  return (
    <AppLayout>
      <TopBar title="Finanças" subtitle="Controle financeiro completo" />

      <div className="p-6 space-y-6">

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Saldo Total', value: formatCompact(totalBalance), icon: Wallet, color: '#6366F1', change: '+2.4%', up: true },
            { label: 'Receitas', value: formatCompact(totalIncome), icon: TrendingUp, color: '#10B981', change: '+12%', up: true },
            { label: 'Despesas', value: formatCompact(totalExpenses), icon: TrendingDown, color: '#EF4444', change: '+8%', up: false },
            { label: 'Investimentos', value: formatCompact(totalInvestments), icon: BarChart3, color: '#3B82F6', change: '+6.3%', up: true },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="stat-card"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{stat.label}</p>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${stat.color}20`, color: stat.color }}>
                  <stat.icon size={17} />
                </div>
              </div>
              <p className="text-2xl font-bold text-mono text-white mb-1">{stat.value}</p>
              <span className={`text-xs font-semibold flex items-center gap-0.5 ${stat.up ? 'money-positive' : 'money-negative'}`}>
                {stat.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {stat.change}
              </span>
            </motion.div>
          ))}
        </div>

        {/* TABS */}
        <div className="flex gap-1 p-1 rounded-xl w-fit" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                background: activeTab === tab.id ? 'var(--accent-primary)' : 'transparent',
                color: activeTab === tab.id ? 'white' : 'var(--text-secondary)',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            {/* Accounts */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white">Minhas Contas</h3>
                <button
                  onClick={() => toast.success('Funcionalidade disponível na versão completa!')}
                  className="btn btn-secondary text-xs"
                  style={{ padding: '6px 12px' }}
                >
                  <Plus size={14} /> Nova Conta
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {accounts.map((acc, i) => (
                  <motion.div
                    key={acc.id}
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="p-5 rounded-2xl cursor-pointer relative overflow-hidden group"
                    style={{
                      background: `linear-gradient(135deg, ${acc.color}15, ${acc.color}05)`,
                      border: `1px solid ${acc.color}30`,
                    }}
                  >
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ background: `${acc.color}08` }} />
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{acc.icon}</span>
                        <div>
                          <p className="font-semibold text-white text-sm">{acc.name}</p>
                          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                            {ACCOUNT_TYPE_LABELS[acc.type]?.label}
                          </p>
                        </div>
                      </div>
                      <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
                    </div>
                    <p className={`text-2xl font-bold text-mono ${acc.balance < 0 ? 'money-negative' : 'text-white'}`}>
                      {formatCurrency(acc.balance)}
                    </p>
                    {acc.type === 'CREDIT_CARD' && (
                      <div className="mt-2">
                        <div className="progress-bar" style={{ height: '3px' }}>
                          <div className="progress-fill" style={{
                            width: `${Math.abs(acc.balance) / (acc as any).limit * 100}%`,
                            background: '#EF4444',
                          }} />
                        </div>
                        <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                          Limite: {formatCurrency((acc as any).limit)}
                        </p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Monthly Chart */}
            <div className="card p-5">
              <h3 className="font-semibold text-white mb-4">Fluxo de Caixa Mensal</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={mockMonthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" tick={{ fill: '#475569', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `R$${(v/1000).toFixed(0)}k`} />
                  <Tooltip
                    contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 12 }}
                    labelStyle={{ color: 'var(--text-secondary)' }}
                  />
                  <Bar dataKey="receitas" name="Receitas" fill="#10B981" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="despesas" name="Despesas" fill="#EF4444" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}

        {/* TRANSACTIONS TAB */}
        {activeTab === 'transactions' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                <input
                  className="input pl-9"
                  placeholder="Buscar transações..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
              <button className="btn btn-secondary">
                <Filter size={15} /> Filtrar
              </button>
              <button className="btn btn-primary">
                <Plus size={15} /> Nova
              </button>
            </div>

            <div className="card overflow-hidden">
              <div className="p-4" style={{ borderBottom: '1px solid var(--border)' }}>
                <p className="text-sm font-medium text-white">
                  {filteredTransactions.length} transações encontradas
                </p>
              </div>
              <div className="divide-y" style={{ '--tw-divide-opacity': 1 } as any}>
                {filteredTransactions.map((tx, i) => (
                  <motion.div
                    key={tx.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.02 }}
                    className="flex items-center gap-4 p-4 hover:bg-white/[0.02] transition-colors cursor-pointer"
                  >
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                      style={{ background: 'var(--bg-tertiary)' }}>
                      {tx.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white text-sm truncate">{tx.description}</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        {format(tx.date, "d MMM yyyy", { locale: ptBR })}
                        {' · '}
                        {mockCategories.find(c => c.id === tx.categoryId)?.name || 'Sem categoria'}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className={`font-bold text-mono text-sm ${tx.type === 'INCOME' ? 'money-positive' : 'money-negative'}`}>
                        {tx.type === 'INCOME' ? '+' : '-'}{formatCurrency(tx.amount)}
                      </p>
                      <span className={`badge text-xs ${tx.type === 'INCOME' ? 'badge-success' : 'badge-danger'}`}>
                        {tx.type === 'INCOME' ? 'Receita' : 'Despesa'}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* INVESTMENTS TAB */}
        {activeTab === 'investments' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div className="card p-4">
                <p className="text-sm mb-1" style={{ color: 'var(--text-muted)' }}>Patrimônio Investido</p>
                <p className="text-2xl font-bold text-mono text-white">R$ 42.800</p>
                <span className="text-xs money-positive">▲ +6.3% este mês</span>
              </div>
              <div className="card p-4">
                <p className="text-sm mb-1" style={{ color: 'var(--text-muted)' }}>Lucro Total</p>
                <p className="text-2xl font-bold text-mono money-positive">R$ 4.280</p>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>+11.1% de rentabilidade</span>
              </div>
              <div className="card p-4">
                <p className="text-sm mb-1" style={{ color: 'var(--text-muted)' }}>Ativos</p>
                <p className="text-2xl font-bold text-mono text-white">{investments.length}</p>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>em 4 categorias</span>
              </div>
            </div>

            <div className="card overflow-hidden">
              <div className="p-4" style={{ borderBottom: '1px solid var(--border)' }}>
                <div className="grid grid-cols-5 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  <span className="col-span-2">Ativo</span>
                  <span className="text-right">Preço Atual</span>
                  <span className="text-right">P&L</span>
                  <span className="text-right">Variação</span>
                </div>
              </div>
              {investments.map((inv, i) => {
                const pl = (inv.currentPrice! - inv.avgPrice) * inv.quantity;
                return (
                  <motion.div
                    key={inv.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="grid grid-cols-5 items-center p-4 hover:bg-white/[0.02] cursor-pointer"
                    style={{ borderBottom: '1px solid var(--border)' }}
                  >
                    <div className="col-span-2 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs"
                        style={{
                          background: inv.type === 'STOCK' ? 'rgba(99,102,241,0.2)' :
                            inv.type === 'FII' ? 'rgba(16,185,129,0.2)' :
                              inv.type === 'CRYPTO' ? 'rgba(245,158,11,0.2)' : 'rgba(59,130,246,0.2)',
                          color: inv.type === 'STOCK' ? '#818CF8' :
                            inv.type === 'FII' ? '#34D399' :
                              inv.type === 'CRYPTO' ? '#FCD34D' : '#60A5FA',
                        }}
                      >
                        {inv.ticker?.slice(0, 3) || inv.name.slice(0, 3)}
                      </div>
                      <div>
                        <p className="font-semibold text-white text-sm">{inv.ticker || inv.name}</p>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                          {inv.quantity} × {inv.type}
                        </p>
                      </div>
                    </div>
                    <p className="text-right font-mono text-sm text-white">
                      {formatCurrency(inv.currentPrice!)}
                    </p>
                    <p className={`text-right font-mono text-sm font-semibold ${pl >= 0 ? 'money-positive' : 'money-negative'}`}>
                      {pl >= 0 ? '+' : ''}{formatCurrency(pl)}
                    </p>
                    <p className={`text-right font-mono text-sm font-bold ${inv.change >= 0 ? 'money-positive' : 'money-negative'}`}>
                      {formatPercent(inv.change)}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* BUDGET TAB */}
        {activeTab === 'budget' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="card p-5">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-semibold text-white">Orçamento por Categoria</h3>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    Maio 2026 · Total gasto: R$ 2.972 de R$ 3.085 orçados
                  </p>
                </div>
                <button className="btn btn-primary text-xs" style={{ padding: '8px 14px' }}>
                  <Plus size={14} /> Definir Orçamento
                </button>
              </div>
              <div className="space-y-4">
                {categorySpend.map((cat, i) => {
                  const pct = (cat.value / cat.limit) * 100;
                  const over = pct > 100;
                  return (
                    <motion.div
                      key={cat.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ background: cat.color }} />
                          <span className="text-sm font-medium text-white">{cat.name}</span>
                          {over && <span className="badge badge-danger text-xs">Excedido</span>}
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-mono font-semibold text-white">{formatCurrency(cat.value)}</span>
                          <span className="text-xs ml-1" style={{ color: 'var(--text-muted)' }}>/ {formatCurrency(cat.limit)}</span>
                        </div>
                      </div>
                      <div className="progress-bar">
                        <motion.div
                          className="progress-fill"
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(pct, 100)}%` }}
                          transition={{ duration: 0.8, delay: i * 0.05, ease: [0.4, 0, 0.2, 1] }}
                          style={{ background: over ? '#EF4444' : cat.color }}
                        />
                      </div>
                      <p className="text-xs mt-1 text-right" style={{ color: over ? '#EF4444' : 'var(--text-muted)' }}>
                        {pct.toFixed(0)}% utilizado
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

      </div>
    </AppLayout>
  );
}
