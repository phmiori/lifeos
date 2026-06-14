'use client';
import { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { useFinanceStore } from '@/lib/stores';
import { toast } from 'sonner';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TransactionModal({ isOpen, onClose }: TransactionModalProps) {
  const { addTransaction, accounts, categories } = useFinanceStore();
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'INCOME' | 'EXPENSE'>('EXPENSE');
  const [accountId, setAccountId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || !accountId) {
      toast.error('Preencha descrição, valor e conta!');
      return;
    }

    addTransaction({
      id: crypto.randomUUID(),
      accountId,
      categoryId: categoryId || 'general',
      amount: Number(amount),
      type,
      description,
      date: new Date(date).toISOString(),
      emoji: type === 'INCOME' ? '💰' : '💸',
    });

    toast.success('Transação registrada!');
    onClose();
    
    // Reset form
    setDescription('');
    setAmount('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nova Transação">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-2 p-1 rounded-xl" style={{ background: 'var(--bg-tertiary)' }}>
          <button
            type="button"
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${type === 'EXPENSE' ? 'bg-red-500/20 text-red-500' : 'text-[var(--text-secondary)]'}`}
            onClick={() => setType('EXPENSE')}
          >
            Despesa
          </button>
          <button
            type="button"
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${type === 'INCOME' ? 'bg-emerald-500/20 text-emerald-500' : 'text-[var(--text-secondary)]'}`}
            onClick={() => setType('INCOME')}
          >
            Receita
          </button>
        </div>

        <div>
          <label className="block text-sm mb-1 text-[var(--text-secondary)]">Descrição</label>
          <input
            type="text"
            className="input"
            placeholder="Ex: Mercado, Salário..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1 text-[var(--text-secondary)]">Valor (R$)</label>
            <input
              type="number"
              step="0.01"
              className="input"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm mb-1 text-[var(--text-secondary)]">Data</label>
            <input
              type="date"
              className="input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1 text-[var(--text-secondary)]">Conta</label>
            <select className="input" value={accountId} onChange={(e) => setAccountId(e.target.value)}>
              <option value="" disabled>Selecione...</option>
              {accounts.map(acc => (
                <option key={acc.id} value={acc.id}>{acc.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1 text-[var(--text-secondary)]">Categoria</label>
            <select className="input" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
              <option value="">Sem categoria</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        <button type="submit" className={`btn w-full mt-2 text-white ${type === 'INCOME' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'}`}>
          Registrar {type === 'INCOME' ? 'Receita' : 'Despesa'}
        </button>
      </form>
    </Modal>
  );
}
