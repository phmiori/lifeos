'use client';
import { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { useHealthStore } from '@/lib/stores';
import { toast } from 'sonner';

interface MealModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MealModal({ isOpen, onClose }: MealModalProps) {
  const { addMeal } = useHealthStore();
  const [name, setName] = useState('');
  const [calories, setCalories] = useState('');
  const [time, setTime] = useState('12:00');
  const [foods, setFoods] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !calories || !foods) {
      toast.error('Preencha o nome, calorias e os alimentos!');
      return;
    }

    addMeal({
      name,
      time,
      calories: parseInt(calories) || 0,
      foods: foods.split(',').map(f => f.trim()).filter(Boolean),
      protein: parseInt(protein) || 0,
      carbs: parseInt(carbs) || 0,
      fat: parseInt(fat) || 0,
    });

    toast.success('Refeição adicionada!');
    onClose();
    setName('');
    setCalories('');
    setTime('12:00');
    setFoods('');
    setProtein('');
    setCarbs('');
    setFat('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Adicionar Refeição">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1 text-[var(--text-secondary)]">Nome da Refeição</label>
            <input
              type="text"
              className="input"
              placeholder="Ex: Almoço"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm mb-1 text-[var(--text-secondary)]">Horário</label>
            <input
              type="time"
              className="input"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1 text-[var(--text-secondary)]">Alimentos (separados por vírgula)</label>
          <input
            type="text"
            className="input"
            placeholder="Ex: Arroz, Feijão, Frango"
            value={foods}
            onChange={(e) => setFoods(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-4 gap-2">
          <div>
            <label className="block text-xs mb-1 text-[var(--text-secondary)]">Calorias</label>
            <input
              type="number"
              className="input text-center"
              placeholder="0"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs mb-1 text-[var(--text-secondary)]">Prot. (g)</label>
            <input
              type="number"
              className="input text-center"
              placeholder="0"
              value={protein}
              onChange={(e) => setProtein(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs mb-1 text-[var(--text-secondary)]">Carb. (g)</label>
            <input
              type="number"
              className="input text-center"
              placeholder="0"
              value={carbs}
              onChange={(e) => setCarbs(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs mb-1 text-[var(--text-secondary)]">Gord. (g)</label>
            <input
              type="number"
              className="input text-center"
              placeholder="0"
              value={fat}
              onChange={(e) => setFat(e.target.value)}
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary w-full mt-2">
          Salvar Refeição
        </button>
      </form>
    </Modal>
  );
}
