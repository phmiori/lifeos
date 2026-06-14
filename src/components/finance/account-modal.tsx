'use client';
import { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { useFinanceStore } from '@/lib/stores';
import { toast } from 'sonner';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AccountModal({ isOpen, onClose }: AccountModalProps) {
  const addAccount = useFinanceStore((state) => state.addAccount);
  const [name, setName] = useState('');
  const [type, setType] = useState('CHECKING');
  const [balance, setBalance] = useState('');
  const [color, setColor] = useState('#6366F1');
  const [icon, setIcon] = useState('🏦');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !balance) {
      toast.error('Preencha todos os campos obrigatórios!');
      return;
    }

    addAccount({
      id: crypto.randomUUID(),
      name,
      type: type as any,
      balance: Number(balance),
      color,
      icon,
    });

    toast.success('Conta criada com sucesso!');
    onClose();
    
    // Reset form
    setName('');
    setBalance('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nova Conta">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1 text-[var(--text-secondary)]">Nome da Conta</label>
          <input
            type="text"
            className="input"
            placeholder="Ex: Nubank, Banco do Brasil..."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1 text-[var(--text-secondary)]">Tipo</label>
            <select className="input" value={type} onChange={(e) => setType(e.target.value)}>
              <option value="CHECKING">Conta Corrente</option>
              <option value="SAVINGS">Poupança</option>
              <option value="WALLET">Carteira</option>
              <option value="CREDIT_CARD">Cartão de Crédito</option>
              <option value="INVESTMENT">Investimentos</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1 text-[var(--text-secondary)]">Saldo Inicial</label>
            <input
              type="number"
              step="0.01"
              className="input"
              placeholder="0.00"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1 text-[var(--text-secondary)]">Ícone (Emoji)</label>
            <input
              type="text"
              className="input text-center text-xl"
              maxLength={2}
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm mb-1 text-[var(--text-secondary)]">Cor de Fundo</label>
            <input
              type="color"
              className="w-full h-[42px] rounded-lg cursor-pointer bg-transparent"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary w-full mt-2">
          Salvar Conta
        </button>
      </form>
    </Modal>
  );
}
