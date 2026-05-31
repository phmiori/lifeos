'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  mockUser, mockAccounts, mockTransactions, mockInvestments, mockGoals,
  mockTasks, mockHabits, mockEvents, mockShoppingLists, mockAIMessages,
  mockInsights, mockWorkouts, mockBodyMetrics, mockNutrition, mockAchievements,
} from '@/lib/mock-data';

// ─── FINANCE STORE ────────────────────────────────────────────────────────────
interface FinanceStore {
  accounts: typeof mockAccounts;
  transactions: typeof mockTransactions;
  investments: typeof mockInvestments;
  goals: typeof mockGoals;
  addTransaction: (t: (typeof mockTransactions)[0]) => void;
  toggleGoalProgress: (id: string, amount: number) => void;
}
export const useFinanceStore = create<FinanceStore>()(
  persist(
    (set) => ({
      accounts: mockAccounts,
      transactions: mockTransactions,
      investments: mockInvestments,
      goals: mockGoals,
      addTransaction: (t) => set((s) => ({ transactions: [t, ...s.transactions] })),
      toggleGoalProgress: (id, amount) =>
        set((s) => ({
          goals: s.goals.map((g) => g.id === id ? { ...g, currentAmount: Math.min(g.currentAmount + amount, g.targetAmount) } : g),
        })),
    }),
    { name: 'lifeos-finance' }
  )
);

// ─── TASKS STORE ──────────────────────────────────────────────────────────────
interface TasksStore {
  tasks: typeof mockTasks;
  habits: typeof mockHabits;
  addTask: (t: (typeof mockTasks)[0]) => void;
  updateTask: (id: string, updates: Partial<(typeof mockTasks)[0]>) => void;
  toggleHabit: (id: string) => void;
}
export const useTasksStore = create<TasksStore>()(
  persist(
    (set) => ({
      tasks: mockTasks,
      habits: mockHabits,
      addTask: (t) => set((s) => ({ tasks: [t, ...s.tasks] })),
      updateTask: (id, updates) =>
        set((s) => ({ tasks: s.tasks.map((t) => t.id === id ? { ...t, ...updates } : t) })),
      toggleHabit: (id) =>
        set((s) => ({
          habits: s.habits.map((h) =>
            h.id === id ? { ...h, completedToday: !h.completedToday, streak: !h.completedToday ? h.streak + 1 : h.streak - 1 } : h
          ),
        })),
    }),
    { name: 'lifeos-tasks' }
  )
);

// ─── HEALTH STORE ─────────────────────────────────────────────────────────────
interface HealthStore {
  workouts: typeof mockWorkouts;
  bodyMetrics: typeof mockBodyMetrics;
  nutrition: typeof mockNutrition;
}
export const useHealthStore = create<HealthStore>()(() => ({
  workouts: mockWorkouts,
  bodyMetrics: mockBodyMetrics,
  nutrition: mockNutrition,
}));

// ─── CALENDAR STORE ───────────────────────────────────────────────────────────
interface CalendarStore {
  events: typeof mockEvents;
  addEvent: (e: (typeof mockEvents)[0]) => void;
}
export const useCalendarStore = create<CalendarStore>()(
  persist(
    (set) => ({
      events: mockEvents,
      addEvent: (e) => set((s) => ({ events: [...s.events, e] })),
    }),
    { name: 'lifeos-calendar' }
  )
);

// ─── SHOPPING STORE ───────────────────────────────────────────────────────────
interface ShoppingStore {
  lists: typeof mockShoppingLists;
  toggleItem: (listId: string, itemId: string) => void;
}
export const useShoppingStore = create<ShoppingStore>()(
  persist(
    (set) => ({
      lists: mockShoppingLists,
      toggleItem: (listId, itemId) =>
        set((s) => ({
          lists: s.lists.map((l) =>
            l.id === listId
              ? { ...l, items: l.items.map((i) => i.id === itemId ? { ...i, isChecked: !i.isChecked } : i) }
              : l
          ),
        })),
    }),
    { name: 'lifeos-shopping' }
  )
);

// ─── AI STORE ─────────────────────────────────────────────────────────────────
interface AIStore {
  messages: typeof mockAIMessages;
  isTyping: boolean;
  addMessage: (m: (typeof mockAIMessages)[0]) => void;
  setTyping: (v: boolean) => void;
}
export const useAIStore = create<AIStore>()((set) => ({
  messages: mockAIMessages,
  isTyping: false,
  addMessage: (m) => set((s) => ({ messages: [...s.messages, m] })),
  setTyping: (v) => set({ isTyping: v }),
}));

// ─── APP STORE ────────────────────────────────────────────────────────────────
interface AppStore {
  user: typeof mockUser;
  theme: 'dark' | 'light';
  sidebarCollapsed: boolean;
  insights: typeof mockInsights;
  achievements: typeof mockAchievements;
  toggleTheme: () => void;
  toggleSidebar: () => void;
}
export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      user: mockUser,
      theme: 'dark',
      sidebarCollapsed: false,
      insights: mockInsights,
      achievements: mockAchievements,
      toggleTheme: () => set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
    }),
    { name: 'lifeos-app' }
  )
);

// ─── PLAYER STORE ────────────────────────────────────────────────────────────
export interface Song {
  id: string;
  title: string;
  artist: string;
  album?: string;
  cover_url?: string;
  duration_secs: number;
}

interface PlayerStore {
  currentSong: Song | null;
  queue: Song[];
  queueIndex: number;
  isPlaying: boolean;
  progress: number;
  volume: number;
  playSong: (song: Song, queue?: Song[]) => void;
  setPlaying: (v: boolean) => void;
  setProgress: (v: number) => void;
  setVolume: (v: number) => void;
  playNext: () => void;
  playPrev: () => void;
}

export const usePlayerStore = create<PlayerStore>()((set, get) => ({
  currentSong: null,
  queue: [],
  queueIndex: 0,
  isPlaying: false,
  progress: 0,
  volume: 0.8,

  playSong: (song, queue = []) => {
    const idx = queue.findIndex(s => s.id === song.id)
    set({
      currentSong: song,
      queue: queue.length > 0 ? queue : [song],
      queueIndex: idx >= 0 ? idx : 0,
      isPlaying: true,
      progress: 0,
    })
  },

  setPlaying: (v) => set({ isPlaying: v }),
  setProgress: (v) => set({ progress: v }),
  setVolume: (v) => set({ volume: v }),

  playNext: () => {
    const { queue, queueIndex, playSong } = get()
    const next = queueIndex + 1
    if (next < queue.length) {
      set({ queueIndex: next })
      playSong(queue[next], queue)
    }
  },

  playPrev: () => {
    const { queue, queueIndex, playSong, progress } = get()
    if (progress > 5) { set({ progress: 0 }); return }
    const prev = queueIndex - 1
    if (prev >= 0) {
      set({ queueIndex: prev })
      playSong(queue[prev], queue)
    }
  },
}));
