'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ─── AUTH STORE ───────────────────────────────────────────────────────────────
export interface AuthUser {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
}

interface StoredAccount {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  role: 'admin' | 'user';
}

interface AuthStore {
  user: AuthUser | null;
  isAuthenticated: boolean;
  accounts: StoredAccount[];
  register: (username: string, email: string, password: string) => { success: boolean; error?: string };
  login: (usernameOrEmail: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
}

function hashPassword(password: string): string {
  // Simple deterministic hash suitable for local-only storage
  return btoa(unescape(encodeURIComponent(`lifeos:${password}`)));
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      accounts: [],

      register: (username, email, password) => {
        const { accounts } = get();
        const usernameLower = username.trim().toLowerCase();
        const emailLower = email.trim().toLowerCase();

        if (!username.trim() || !email.trim() || !password) {
          return { success: false, error: 'Preencha todos os campos.' };
        }
        if (password.length < 6) {
          return { success: false, error: 'A senha deve ter pelo menos 6 caracteres.' };
        }
        if (accounts.some((a) => a.username.toLowerCase() === usernameLower)) {
          return { success: false, error: 'Nome de usuário já está em uso.' };
        }
        if (accounts.some((a) => a.email.toLowerCase() === emailLower)) {
          return { success: false, error: 'E-mail já cadastrado.' };
        }

        const newAccount: StoredAccount = {
          id: crypto.randomUUID(),
          username: username.trim(),
          email: email.trim(),
          passwordHash: hashPassword(password),
          role: accounts.length === 0 ? 'admin' : 'user', // primeiro usuário é admin
        };

        const authUser: AuthUser = {
          id: newAccount.id,
          username: newAccount.username,
          email: newAccount.email,
          role: newAccount.role,
        };

        set((s) => ({
          accounts: [...s.accounts, newAccount],
          user: authUser,
          isAuthenticated: true,
        }));

        return { success: true };
      },

      login: (usernameOrEmail, password) => {
        const { accounts } = get();
        const query = usernameOrEmail.trim().toLowerCase();
        const hash = hashPassword(password);

        const account = accounts.find(
          (a) =>
            (a.username.toLowerCase() === query || a.email.toLowerCase() === query) &&
            a.passwordHash === hash
        );

        if (!account) {
          return { success: false, error: 'Usuário ou senha incorretos.' };
        }

        set({
          user: { id: account.id, username: account.username, email: account.email, role: account.role },
          isAuthenticated: true,
        });

        return { success: true };
      },

      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    { name: 'lifeos-auth' }
  )
);
// ─── TYPES ────────────────────────────────────────────────────────────────────
export interface Account { id: string; name: string; type: string; balance: number; color: string; icon: string; lastUpdate: Date; limit?: number; dueDay?: number; }
export interface Category { id: string; name: string; icon: string; color: string; type: 'INCOME' | 'EXPENSE'; }
export interface MonthlyData { month: string; receitas: number; despesas: number; investimentos: number; }
export interface Transaction { id: string; accountId: string; type: 'INCOME' | 'EXPENSE'; amount: number; description: string; categoryId: string; date: Date; emoji: string; }
export interface Investment { id: string; name: string; ticker: string | null; type: string; quantity: number; avgPrice: number; currentPrice: number; change: number; }
export interface Goal { id: string; title: string; targetAmount: number; currentAmount: number; deadline: Date; icon: string; color: string; isCompleted: boolean; }

export interface Project { id: string; name: string; color: string; icon: string; }
export interface Subtask { id: string; title: string; completed: boolean; }
export interface Task { id: string; title: string; status: string; priority: string; dueDate: Date; labels: string[]; projectId: string | null; subtasks: Subtask[]; }
export interface Habit { id: string; name: string; icon: string; color: string; streak: number; completedToday: boolean; frequency: string; }

export interface CalendarEvent { id: string; title: string; startDate: Date; endDate: Date; allDay: boolean; color: string; location: string | null; }

export interface ShoppingItem { id: string; name: string; quantity: number; unit: string; estimatedPrice: number; isChecked: boolean; category: string; }
export interface ShoppingList { id: string; name: string; category: string; totalEstimate: number; items: ShoppingItem[]; }

export interface AIMessage { id: string; role: 'user' | 'assistant'; content: string; createdAt: Date; }

export interface Insight { id: string; type: 'info' | 'warning' | 'success'; title: string; description: string; action: string; icon: string; }
export interface Achievement { id: string; title: string; description: string; icon: string; earned: boolean; earnedAt?: Date; progress?: number; }

export interface BodyMetric { date: string; weight: number; bodyFat: number; }
export interface WorkoutExercise { name: string; sets: number; reps: number; weight: number; }
export interface Workout { id: string; name: string; date: Date; duration: number; caloriesBurned: number; exercises: WorkoutExercise[]; }
export interface Nutrition { calories: { target: number; consumed: number; burned: number; }; protein: { target: number; consumed: number; }; carbs: { target: number; consumed: number; }; fat: { target: number; consumed: number; }; meals: { name: string; calories: number; time: string; foods: string[]; }[]; }

export interface AppUser {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  level: number;
  xp: number;
  xpToNextLevel: number;
  streak: number;
  theme: 'dark' | 'light';
}

// ─── FINANCE STORE ────────────────────────────────────────────────────────────
interface FinanceStore {
  accounts: Account[];
  categories: Category[];
  transactions: Transaction[];
  monthlyData: MonthlyData[];
  investments: Investment[];
  goals: Goal[];
  addTransaction: (t: Transaction) => void;
  addAccount: (a: Account) => void;
  toggleGoalProgress: (id: string, amount: number) => void;
}
export const useFinanceStore = create<FinanceStore>()(
  persist(
    (set) => ({
      accounts: [],
      categories: [],
      transactions: [],
      monthlyData: [],
      investments: [],
      goals: [],
      addAccount: (a) => set((s) => ({ accounts: [...s.accounts, a] })),
      addTransaction: (t) => set((s) => {
        const newTransactions = [t, ...s.transactions];
        const newAccounts = s.accounts.map(acc => {
          if (acc.id === t.accountId) {
            const diff = t.type === 'INCOME' ? t.amount : -t.amount;
            return { ...acc, balance: acc.balance + diff };
          }
          return acc;
        });
        return { transactions: newTransactions, accounts: newAccounts };
      }),
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
  projects: Project[];
  tasks: Task[];
  habits: Habit[];
  addTask: (t: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  addHabit: (h: Habit) => void;
  toggleHabit: (id: string) => void;
  addProject: (p: Project) => void;
}
export const useTasksStore = create<TasksStore>()(
  persist(
    (set) => ({
      projects: [],
      tasks: [],
      habits: [],
      addTask: (t) => set((s) => ({ tasks: [t, ...s.tasks] })),
      updateTask: (id, updates) =>
        set((s) => ({ tasks: s.tasks.map((t) => t.id === id ? { ...t, ...updates } : t) })),
      toggleHabit: (id) =>
        set((s) => ({
          habits: s.habits.map((h) =>
            h.id === id ? { ...h, completedToday: !h.completedToday, streak: !h.completedToday ? h.streak + 1 : Math.max(0, h.streak - 1) } : h
          ),
        })),
      addHabit: (h) => set((s) => ({ habits: [...s.habits, h] })),
      addProject: (p) => set((s) => ({ projects: [...s.projects, p] })),
    }),
    { name: 'lifeos-tasks' }
  )
);

// ─── HEALTH STORE ─────────────────────────────────────────────────────────────
interface HealthStore {
  workouts: Workout[];
  bodyMetrics: BodyMetric[];
  nutrition: Nutrition;
  addWorkout: (w: Workout) => void;
  addBodyMetric: (m: BodyMetric) => void;
  addMeal: (m: { name: string; calories: number; time: string; foods: string[]; protein: number; carbs: number; fat: number }) => void;
}
export const useHealthStore = create<HealthStore>()(
  persist(
    (set) => ({
      workouts: [] as Workout[],
      bodyMetrics: [] as BodyMetric[],
      nutrition: {
        calories: { target: 2000, consumed: 0, burned: 0 },
        protein: { target: 150, consumed: 0 },
        carbs: { target: 200, consumed: 0 },
        fat: { target: 60, consumed: 0 },
        meals: [],
      } as Nutrition,
      addWorkout: (w) => set((s) => ({ workouts: [w, ...s.workouts] })),
      addBodyMetric: (m) => set((s) => ({ bodyMetrics: [...s.bodyMetrics, m] })),
      addMeal: (m) => set((s) => {
        const n = s.nutrition;
        return {
          nutrition: {
            ...n,
            calories: { ...n.calories, consumed: n.calories.consumed + m.calories },
            protein: { ...n.protein, consumed: n.protein.consumed + m.protein },
            carbs: { ...n.carbs, consumed: n.carbs.consumed + m.carbs },
            fat: { ...n.fat, consumed: n.fat.consumed + m.fat },
            meals: [...n.meals, { name: m.name, calories: m.calories, time: m.time, foods: m.foods }]
          }
        };
      }),
    }),
    { name: 'lifeos-health' }
  )
);

// ─── CALENDAR STORE ───────────────────────────────────────────────────────────
interface CalendarStore {
  events: CalendarEvent[];
  addEvent: (e: CalendarEvent) => void;
}
export const useCalendarStore = create<CalendarStore>()(
  persist(
    (set) => ({
      events: [],
      addEvent: (e) => set((s) => ({ events: [...s.events, e] })),
    }),
    { name: 'lifeos-calendar' }
  )
);

// ─── SHOPPING STORE ───────────────────────────────────────────────────────────
interface ShoppingStore {
  lists: ShoppingList[];
  toggleItem: (listId: string, itemId: string) => void;
}
export const useShoppingStore = create<ShoppingStore>()(
  persist(
    (set) => ({
      lists: [],
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
  messages: AIMessage[];
  isTyping: boolean;
  addMessage: (m: AIMessage) => void;
  setTyping: (v: boolean) => void;
}
export const useAIStore = create<AIStore>()(
  persist(
    (set) => ({
      messages: [],
      isTyping: false,
      addMessage: (m) => set((s) => ({ messages: [...s.messages, m] })),
      setTyping: (v) => set({ isTyping: v }),
    }),
    { name: 'lifeos-ai' }
  )
);

// ─── APP STORE ────────────────────────────────────────────────────────────────
interface AppStore {
  user: AppUser;
  theme: 'dark' | 'light';
  sidebarCollapsed: boolean;
  insights: Insight[];
  achievements: Achievement[];
  toggleTheme: () => void;
  toggleSidebar: () => void;
  updateUser: (updates: Partial<AppUser>) => void;
}
export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      user: {
        id: '1',
        name: 'Usuário',
        email: '',
        avatar: null,
        level: 1,
        xp: 0,
        xpToNextLevel: 1000,
        streak: 0,
        theme: 'dark',
      },
      theme: 'dark',
      sidebarCollapsed: false,
      insights: [],
      achievements: [],
      toggleTheme: () => set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      updateUser: (updates) => set((s) => ({ user: { ...s.user, ...updates } })),
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

export const usePlayerStore = create<PlayerStore>()(
  persist(
    (set, get) => ({
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
    }),
    { name: 'lifeos-player' }
  )
);
