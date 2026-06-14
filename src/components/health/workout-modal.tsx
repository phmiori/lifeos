'use client';
import { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { useHealthStore } from '@/lib/stores';
import { toast } from 'sonner';
import { Plus, Trash2 } from 'lucide-react';

interface WorkoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WorkoutModal({ isOpen, onClose }: WorkoutModalProps) {
  const { addWorkout } = useHealthStore();
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('');
  const [caloriesBurned, setCaloriesBurned] = useState('');
  const [exercises, setExercises] = useState([{ name: '', sets: 3, reps: 10, weight: 0 }]);

  const handleAddExercise = () => {
    setExercises([...exercises, { name: '', sets: 3, reps: 10, weight: 0 }]);
  };

  const handleRemoveExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const updateExercise = (index: number, field: string, value: string | number) => {
    const newExercises = [...exercises];
    newExercises[index] = { ...newExercises[index], [field]: value };
    setExercises(newExercises);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !duration || !caloriesBurned) {
      toast.error('Preencha os dados básicos do treino!');
      return;
    }

    const validExercises = exercises.filter(ex => ex.name.trim() !== '');

    addWorkout({
      id: crypto.randomUUID(),
      name,
      date: new Date(),
      duration: parseInt(duration),
      caloriesBurned: parseInt(caloriesBurned),
      exercises: validExercises,
    });

    toast.success('Treino registrado com sucesso!');
    onClose();
    setName('');
    setDuration('');
    setCaloriesBurned('');
    setExercises([{ name: '', sets: 3, reps: 10, weight: 0 }]);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Registrar Treino">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1 text-[var(--text-secondary)]">Nome do Treino</label>
          <input
            type="text"
            className="input"
            placeholder="Ex: Treino de Peito A"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1 text-[var(--text-secondary)]">Duração (min)</label>
            <input
              type="number"
              className="input"
              placeholder="60"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm mb-1 text-[var(--text-secondary)]">Calorias Queimadas</label>
            <input
              type="number"
              className="input"
              placeholder="350"
              value={caloriesBurned}
              onChange={(e) => setCaloriesBurned(e.target.value)}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm text-[var(--text-secondary)]">Exercícios</label>
            <button type="button" onClick={handleAddExercise} className="text-xs text-[var(--accent-primary)] hover:underline flex items-center gap-1">
              <Plus size={12} /> Adicionar
            </button>
          </div>
          
          <div className="space-y-2 max-h-[30vh] overflow-y-auto pr-1 no-scrollbar">
            {exercises.map((ex, i) => (
              <div key={i} className="flex gap-2 items-center p-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)]">
                <input
                  type="text"
                  placeholder="Nome do ex."
                  className="input text-xs w-1/3"
                  value={ex.name}
                  onChange={(e) => updateExercise(i, 'name', e.target.value)}
                  style={{ padding: '6px 8px' }}
                />
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    title="Séries"
                    className="input text-xs w-12 text-center"
                    value={ex.sets}
                    onChange={(e) => updateExercise(i, 'sets', parseInt(e.target.value) || 0)}
                    style={{ padding: '6px 4px' }}
                  />
                  <span className="text-[var(--text-muted)] text-xs">x</span>
                  <input
                    type="number"
                    title="Repetições"
                    className="input text-xs w-12 text-center"
                    value={ex.reps}
                    onChange={(e) => updateExercise(i, 'reps', parseInt(e.target.value) || 0)}
                    style={{ padding: '6px 4px' }}
                  />
                  <span className="text-[var(--text-muted)] text-xs">@</span>
                  <input
                    type="number"
                    title="Peso (kg)"
                    className="input text-xs w-14 text-center"
                    value={ex.weight}
                    onChange={(e) => updateExercise(i, 'weight', parseInt(e.target.value) || 0)}
                    style={{ padding: '6px 4px' }}
                  />
                  <span className="text-[var(--text-muted)] text-xs mr-1">kg</span>
                </div>
                {exercises.length > 1 && (
                  <button type="button" onClick={() => handleRemoveExercise(i)} className="text-red-400 hover:text-red-300 p-1 ml-auto">
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <button type="submit" className="btn btn-primary w-full mt-2">
          Salvar Treino
        </button>
      </form>
    </Modal>
  );
}
