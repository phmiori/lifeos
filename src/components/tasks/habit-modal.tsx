'use client';
import { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { useTasksStore } from '@/lib/stores';
import { toast } from 'sonner';

interface HabitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HabitModal({ isOpen, onClose }: HabitModalProps) {
  const addHabit = useTasksStore((state) => state.addHabit);
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('💧');
  const [color, setColor] = useState('#3B82F6');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      toast.error('O nome do hábito é obrigatório!');
      return;
    }

    addHabit({
      id: crypto.randomUUID(),
      name,
      icon,
      color,
      streak: 0,
      completedToday: false,
    });

    toast.success('Hábito criado com sucesso!');
    onClose();
    
    // Reset form
    setName('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Novo Hábito">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1 text-[var(--text-secondary)]">Nome do Hábito</label>
          <input
            type="text"
            className="input"
            placeholder="Ex: Beber água, Ler 10 páginas..."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
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
          Salvar Hábito
        </button>
      </form>
    </Modal>
  );
}
