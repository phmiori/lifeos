'use client';
import { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { useCalendarStore } from '@/lib/stores';
import { toast } from 'sonner';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate?: Date;
}

const COLORS = ['#EF4444', '#F97316', '#F59E0B', '#10B981', '#06B6D4', '#3B82F6', '#6366F1', '#8B5CF6', '#EC4899'];

export function EventModal({ isOpen, onClose, selectedDate = new Date() }: EventModalProps) {
  const { addEvent } = useCalendarStore();
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(selectedDate.toISOString().slice(0, 10));
  const [time, setTime] = useState('12:00');
  const [allDay, setAllDay] = useState(false);
  const [location, setLocation] = useState('');
  const [color, setColor] = useState(COLORS[5]); // Default blue

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      toast.error('Informe o título do evento!');
      return;
    }

    const start = new Date(`${date}T${time}:00`);
    const end = new Date(start.getTime() + 60 * 60 * 1000); // +1 hour default

    addEvent({
      id: crypto.randomUUID(),
      title,
      startDate: start,
      endDate: end,
      allDay,
      location: location || null,
      color,
    });

    toast.success('Evento criado!');
    onClose();
    setTitle('');
    setLocation('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Novo Evento">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1 text-[var(--text-secondary)]">Título do Evento</label>
          <input
            type="text"
            className="input"
            placeholder="Reunião, Aniversário..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />
        </div>

        <div className="flex items-center gap-2 py-1">
          <input
            type="checkbox"
            id="allday"
            className="rounded border-[var(--border)] bg-[var(--bg-tertiary)] text-[var(--accent-primary)] focus:ring-[var(--accent-primary)]"
            checked={allDay}
            onChange={(e) => setAllDay(e.target.checked)}
          />
          <label htmlFor="allday" className="text-sm text-[var(--text-secondary)] cursor-pointer">
            Evento de dia todo
          </label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1 text-[var(--text-secondary)]">Data</label>
            <input
              type="date"
              className="input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          {!allDay && (
            <div>
              <label className="block text-sm mb-1 text-[var(--text-secondary)]">Horário</label>
              <input
                type="time"
                className="input"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm mb-1 text-[var(--text-secondary)]">Localização (opcional)</label>
          <input
            type="text"
            className="input"
            placeholder="Link do meet, endereço..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm mb-2 text-[var(--text-secondary)]">Cor do Evento</label>
          <div className="flex flex-wrap gap-2">
            {COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={`w-6 h-6 rounded-full transition-transform ${color === c ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-[var(--bg-secondary)]' : 'hover:scale-110'}`}
                style={{ background: c }}
              />
            ))}
          </div>
        </div>

        <button type="submit" className="btn btn-primary w-full mt-2">
          Salvar Evento
        </button>
      </form>
    </Modal>
  );
}
