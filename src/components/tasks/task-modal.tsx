'use client';
import { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { useTasksStore } from '@/lib/stores';
import { toast } from 'sonner';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TaskModal({ isOpen, onClose }: TaskModalProps) {
  const { addTask, projects } = useTasksStore();
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'>('MEDIUM');
  const [dueDate, setDueDate] = useState('');
  const [projectId, setProjectId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      toast.error('O título da tarefa é obrigatório!');
      return;
    }

    addTask({
      id: crypto.randomUUID(),
      title,
      status: 'TODO',
      priority,
      projectId: projectId || undefined,
      dueDate: dueDate || undefined,
      tags: [],
    });

    toast.success('Tarefa adicionada!');
    onClose();
    
    setTitle('');
    setDueDate('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nova Tarefa">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1 text-[var(--text-secondary)]">Título da Tarefa</label>
          <input
            type="text"
            className="input"
            placeholder="Ex: Pagar a conta de luz..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1 text-[var(--text-secondary)]">Prioridade</label>
            <select className="input" value={priority} onChange={(e) => setPriority(e.target.value as any)}>
              <option value="LOW">Baixa</option>
              <option value="MEDIUM">Média</option>
              <option value="HIGH">Alta</option>
              <option value="URGENT">Urgente</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1 text-[var(--text-secondary)]">Data de Vencimento</label>
            <input
              type="date"
              className="input"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1 text-[var(--text-secondary)]">Projeto Associado</label>
          <select className="input" value={projectId} onChange={(e) => setProjectId(e.target.value)}>
            <option value="">Nenhum</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn btn-primary w-full mt-2">
          Salvar Tarefa
        </button>
      </form>
    </Modal>
  );
}
