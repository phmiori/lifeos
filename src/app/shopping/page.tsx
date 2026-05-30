'use client';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Plus, Check, Share2, ShoppingCart, Trash2 } from 'lucide-react';
import { AppLayout } from '@/components/layout/app-layout';
import { TopBar } from '@/components/layout/topbar';
import { useShoppingStore } from '@/lib/stores';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const CATEGORY_ICONS: Record<string, string> = {
  GROCERY: '🛒', PHARMACY: '💊', HOME: '🏠', TECH: '💻',
};

export default function ShoppingPage() {
  const { lists, toggleItem } = useShoppingStore();
  const [activeList, setActiveList] = useState(lists[0]?.id);

  const currentList = lists.find(l => l.id === activeList);
  const checkedCount = currentList?.items.filter(i => i.isChecked).length ?? 0;
  const totalItems = currentList?.items.length ?? 0;

  const groupedItems = currentList?.items.reduce((acc, item) => {
    const cat = item.category || 'Outros';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {} as Record<string, typeof currentList.items>) ?? {};

  const estimatedTotal = currentList?.items
    .filter(i => !i.isChecked)
    .reduce((s, i) => s + (i.estimatedPrice || 0), 0) ?? 0;

  return (
    <AppLayout>
      <TopBar
        title="Lista de Compras"
        subtitle="Organize suas compras"
        actions={
          <button className="btn btn-primary text-sm" style={{ padding: '8px 14px' }}
            onClick={() => toast.info('Criação de lista disponível na versão completa!')}>
            <Plus size={15} /> Nova Lista
          </button>
        }
      />

      <div className="p-6 flex gap-6">
        {/* Lists Sidebar */}
        <div className="w-56 flex-shrink-0">
          <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
            Minhas Listas
          </h3>
          <div className="space-y-2">
            {lists.map(list => (
              <button
                key={list.id}
                onClick={() => setActiveList(list.id)}
                className="w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all"
                style={{
                  background: activeList === list.id ? 'rgba(99,102,241,0.15)' : 'var(--bg-secondary)',
                  border: `1px solid ${activeList === list.id ? 'rgba(99,102,241,0.3)' : 'var(--border)'}`,
                  color: activeList === list.id ? '#818CF8' : 'var(--text-secondary)',
                }}
              >
                <span className="text-xl">{CATEGORY_ICONS[list.category || 'GROCERY']}</span>
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate text-white">{list.name}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{list.items.length} itens</p>
                </div>
              </button>
            ))}

            <button
              className="w-full flex items-center gap-3 p-3 rounded-xl border-dashed opacity-60 hover:opacity-100 transition-opacity"
              style={{ background: 'transparent', border: '1px dashed var(--border)', color: 'var(--text-muted)' }}
              onClick={() => toast.info('Nova lista disponível na versão completa!')}
            >
              <Plus size={16} />
              <span className="text-sm">Nova lista</span>
            </button>
          </div>
        </div>

        {/* List Content */}
        {currentList && (
          <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="flex-1 min-w-0">
            {/* List Header */}
            <div className="card p-4 mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-2xl">{CATEGORY_ICONS[currentList.category || 'GROCERY']}</div>
                <div>
                  <h2 className="font-bold text-white">{currentList.name}</h2>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {checkedCount} de {totalItems} itens comprados
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Faltam</p>
                  <p className="font-bold text-mono" style={{ color: 'var(--accent-primary)' }}>
                    {formatCurrency(estimatedTotal)}
                  </p>
                </div>
                <button className="btn btn-secondary text-xs" style={{ padding: '8px 12px' }}
                  onClick={() => toast.success('Link de compartilhamento copiado!')}>
                  <Share2 size={13} /> Compartilhar
                </button>
              </div>
            </div>

            {/* Progress */}
            <div className="mb-4">
              <div className="progress-bar">
                <motion.div
                  className="progress-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${(checkedCount / totalItems) * 100}%` }}
                  transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                />
              </div>
              <p className="text-xs mt-1 text-right" style={{ color: 'var(--text-muted)' }}>
                {Math.round((checkedCount / totalItems) * 100)}% concluído
              </p>
            </div>

            {/* Items by category */}
            <div className="space-y-4">
              {Object.entries(groupedItems).map(([category, items]) => (
                <div key={category}>
                  <h3 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
                    {category}
                  </h3>
                  <div className="card overflow-hidden">
                    {items.map((item, i) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.03 }}
                        className="flex items-center gap-3 p-3 hover:bg-white/[0.02] transition-colors cursor-pointer"
                        style={{ borderBottom: i < items.length - 1 ? '1px solid var(--border)' : 'none' }}
                        onClick={() => toggleItem(currentList.id, item.id)}
                      >
                        {/* Checkbox */}
                        <div
                          className={cn(
                            'w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 transition-all',
                            item.isChecked ? 'bg-emerald-500' : 'border-2 border-slate-600'
                          )}
                        >
                          {item.isChecked && <Check size={13} className="text-white" strokeWidth={3} />}
                        </div>

                        <div className={cn('flex-1 min-w-0', item.isChecked && 'opacity-50')}>
                          <p className={cn('text-sm font-medium text-white', item.isChecked && 'line-through')}>
                            {item.name}
                          </p>
                          {item.quantity && (
                            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                              {item.quantity} {item.unit}
                            </p>
                          )}
                        </div>

                        {item.estimatedPrice && (
                          <span className={cn('text-sm font-mono font-semibold flex-shrink-0', item.isChecked ? 'line-through opacity-40' : 'text-white')}>
                            {formatCurrency(item.estimatedPrice)}
                          </span>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}

              <button
                className="btn btn-secondary w-full"
                onClick={() => toast.info('Adição de itens disponível na versão completa!')}
              >
                <Plus size={15} /> Adicionar Item
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </AppLayout>
  );
}
