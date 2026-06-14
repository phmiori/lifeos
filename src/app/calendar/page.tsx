'use client';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, addMonths, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Plus, Clock, MapPin } from 'lucide-react';
import { AppLayout } from '@/components/layout/app-layout';
import { TopBar } from '@/components/layout/topbar';
import { useCalendarStore } from '@/lib/stores';
import { EventModal } from '@/components/calendar/event-modal';
import { cn } from '@/lib/utils';

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export default function CalendarPage() {
  const { events } = useCalendarStore();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week'>('month');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Fill grid with leading/trailing days
  const startDay = monthStart.getDay();
  const gridDays = [
    ...Array.from({ length: startDay }, (_, i) => {
      const d = new Date(monthStart);
      d.setDate(d.getDate() - (startDay - i));
      return d;
    }),
    ...days,
  ];

  const getEventsForDay = (date: Date) =>
    events.filter(e => isSameDay(new Date(e.startDate), date));

  const selectedDayEvents = getEventsForDay(selectedDate);

  return (
    <AppLayout>
      <EventModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} selectedDate={selectedDate} />
      <TopBar
        title="Calendário"
        subtitle={format(currentMonth, "MMMM 'de' yyyy", { locale: ptBR })}
        actions={
          <button className="btn btn-primary text-sm" style={{ padding: '8px 14px' }} onClick={() => setIsModalOpen(true)}>
            <Plus size={15} /> Novo Evento
          </button>
        }
      />

      <div className="p-6 flex gap-6">
        {/* Calendar Grid */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-5 flex-1"
        >
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-white capitalize">
              {format(currentMonth, "MMMM yyyy", { locale: ptBR })}
            </h2>
            <div className="flex items-center gap-2">
              <div className="flex gap-1 p-1 rounded-lg" style={{ background: 'var(--bg-tertiary)' }}>
                {['month', 'week'].map(v => (
                  <button
                    key={v}
                    onClick={() => setView(v as any)}
                    className="px-3 py-1 rounded-md text-xs font-medium transition-all"
                    style={{
                      background: view === v ? 'var(--accent-primary)' : 'transparent',
                      color: view === v ? 'white' : 'var(--text-muted)',
                    }}
                  >
                    {v === 'month' ? 'Mês' : 'Semana'}
                  </button>
                ))}
              </div>
              <button className="btn-icon" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
                <ChevronLeft size={16} />
              </button>
              <button className="btn-icon" onClick={() => setCurrentMonth(new Date())}>
                <span className="text-xs font-semibold px-1">Hoje</span>
              </button>
              <button className="btn-icon" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 mb-2">
            {WEEKDAYS.map(day => (
              <div key={day} className="text-center text-xs font-semibold py-2 uppercase tracking-wide"
                style={{ color: 'var(--text-muted)' }}>
                {day}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7 gap-1">
            {gridDays.map((day, i) => {
              const isToday = isSameDay(day, new Date());
              const isSelected = isSameDay(day, selectedDate);
              const isCurrentMonth = isSameMonth(day, currentMonth);
              const dayEvents = getEventsForDay(day);

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.003 }}
                  onClick={() => setSelectedDate(day)}
                  className="aspect-square p-1.5 rounded-xl cursor-pointer transition-all flex flex-col"
                  style={{
                    background: isSelected
                      ? 'var(--accent-primary)'
                      : isToday
                        ? 'rgba(99,102,241,0.15)'
                        : 'transparent',
                    border: isToday && !isSelected ? '1px solid rgba(99,102,241,0.4)' : '1px solid transparent',
                    opacity: isCurrentMonth ? 1 : 0.3,
                  }}
                >
                  <span className={cn(
                    'text-xs font-semibold text-center w-full',
                    isSelected ? 'text-white' : isToday ? 'text-indigo-400' : 'text-white'
                  )} style={{ color: !isSelected && !isToday ? 'var(--text-primary)' : undefined }}>
                    {format(day, 'd')}
                  </span>
                  <div className="flex flex-wrap gap-0.5 mt-0.5 justify-center">
                    {dayEvents.slice(0, 3).map(ev => (
                      <div
                        key={ev.id}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: isSelected ? 'rgba(255,255,255,0.7)' : ev.color }}
                      />
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Sidebar — Selected Day Events */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          className="card p-5 w-72 flex-shrink-0 self-start"
        >
          <div className="mb-4">
            <h3 className="font-bold text-white text-base">
              {format(selectedDate, "d 'de' MMMM", { locale: ptBR })}
            </h3>
            <p className="text-sm capitalize" style={{ color: 'var(--text-muted)' }}>
              {format(selectedDate, 'EEEE', { locale: ptBR })}
            </p>
          </div>

          {selectedDayEvents.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-3xl mb-2">📅</p>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Nenhum evento neste dia</p>
              <button className="btn btn-primary mt-4 text-xs" style={{ padding: '8px 14px' }} onClick={() => setIsModalOpen(true)}>
                <Plus size={13} /> Adicionar
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {selectedDayEvents.map((ev, i) => (
                <motion.div
                  key={ev.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="p-3 rounded-xl cursor-pointer hover:scale-[1.01] transition-all"
                  style={{
                    background: `${ev.color}15`,
                    borderLeft: `3px solid ${ev.color}`,
                  }}
                >
                  <p className="font-semibold text-sm text-white mb-1">{ev.title}</p>
                  {!ev.allDay && (
                    <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                      <Clock size={11} />
                      {format(new Date(ev.startDate), 'HH:mm')}
                    </div>
                  )}
                  {ev.location && (
                    <div className="flex items-center gap-1.5 text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      <MapPin size={11} />
                      {ev.location}
                    </div>
                  )}
                  {ev.allDay && (
                    <span className="badge badge-primary mt-1">Dia todo</span>
                  )}
                </motion.div>
              ))}
            </div>
          )}

          {/* Upcoming events */}
          <div className="mt-5 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
            <h4 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
              Próximos Eventos
            </h4>
            <div className="space-y-2">
              {events.slice(0, 4).map(ev => (
                <div key={ev.id} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: ev.color }} />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-white truncate">{ev.title}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      {format(new Date(ev.startDate), "d MMM", { locale: ptBR })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
}
