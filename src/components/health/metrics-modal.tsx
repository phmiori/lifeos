'use client';
import { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { useHealthStore } from '@/lib/stores';
import { toast } from 'sonner';

interface MetricsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MetricsModal({ isOpen, onClose }: MetricsModalProps) {
  const { addBodyMetric } = useHealthStore();
  const [weight, setWeight] = useState('');
  const [bodyFat, setBodyFat] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!weight) {
      toast.error('Informe o peso!');
      return;
    }

    addBodyMetric({
      date: new Date().toISOString().slice(0, 10),
      weight: parseFloat(weight),
      bodyFat: parseFloat(bodyFat) || 0,
    });

    toast.success('Medidas atualizadas!');
    onClose();
    setWeight('');
    setBodyFat('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Registrar Medidas">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1 text-[var(--text-secondary)]">Peso Atual (kg)</label>
          <input
            type="number"
            step="0.1"
            className="input"
            placeholder="Ex: 82.5"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            autoFocus
          />
        </div>

        <div>
          <label className="block text-sm mb-1 text-[var(--text-secondary)]">Gordura Corporal (%)</label>
          <input
            type="number"
            step="0.1"
            className="input"
            placeholder="Ex: 15.5"
            value={bodyFat}
            onChange={(e) => setBodyFat(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary w-full mt-2">
          Salvar Medidas
        </button>
      </form>
    </Modal>
  );
}
