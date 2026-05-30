import { addDays, subDays, format, startOfMonth, subMonths } from 'date-fns';

// ─── USER ───────────────────────────────────────────────────────────────────
export const mockUser = {
  id: 'user-1',
  name: 'Pedro Miori',
  email: 'pedro@lifeos.app',
  avatar: null,
  level: 12,
  xp: 2480,
  xpToNextLevel: 3000,
  streak: 14,
  theme: 'dark' as const,
};

// ─── FINANCE ─────────────────────────────────────────────────────────────────
export const mockAccounts = [
  { id: 'acc-1', name: 'Nubank', type: 'CHECKING', balance: 8420.50, color: '#8B5CF6', icon: '💜', lastUpdate: new Date() },
  { id: 'acc-2', name: 'Poupança Itaú', type: 'SAVINGS', balance: 15000.00, color: '#10B981', icon: '💚', lastUpdate: new Date() },
  { id: 'acc-3', name: 'Carteira', type: 'WALLET', balance: 350.00, color: '#F59E0B', icon: '💛', lastUpdate: new Date() },
  { id: 'acc-4', name: 'Nubank Crédito', type: 'CREDIT_CARD', balance: -1240.80, color: '#6366F1', icon: '💜', limit: 5000, dueDay: 15, lastUpdate: new Date() },
  { id: 'acc-5', name: 'XP Investimentos', type: 'INVESTMENT', balance: 42800.00, color: '#3B82F6', icon: '📈', lastUpdate: new Date() },
];

export const mockCategories = [
  { id: 'cat-1', name: 'Alimentação', icon: '🍔', color: '#EF4444', type: 'EXPENSE' },
  { id: 'cat-2', name: 'Transporte', icon: '🚗', color: '#F59E0B', type: 'EXPENSE' },
  { id: 'cat-3', name: 'Moradia', icon: '🏠', color: '#8B5CF6', type: 'EXPENSE' },
  { id: 'cat-4', name: 'Lazer', icon: '🎮', color: '#EC4899', type: 'EXPENSE' },
  { id: 'cat-5', name: 'Saúde', icon: '💊', color: '#10B981', type: 'EXPENSE' },
  { id: 'cat-6', name: 'Educação', icon: '📚', color: '#3B82F6', type: 'EXPENSE' },
  { id: 'cat-7', name: 'Salário', icon: '💰', color: '#10B981', type: 'INCOME' },
  { id: 'cat-8', name: 'Freelance', icon: '💻', color: '#6366F1', type: 'INCOME' },
  { id: 'cat-9', name: 'Investimentos', icon: '📈', color: '#3B82F6', type: 'INCOME' },
  { id: 'cat-10', name: 'Assinaturas', icon: '📱', color: '#EC4899', type: 'EXPENSE' },
];

export const mockTransactions = [
  { id: 't-1', accountId: 'acc-1', type: 'EXPENSE', amount: 89.90, description: 'iFood - Japonês', categoryId: 'cat-1', date: new Date(), emoji: '🍣' },
  { id: 't-2', accountId: 'acc-1', type: 'EXPENSE', amount: 45.00, description: 'Uber', categoryId: 'cat-2', date: subDays(new Date(), 1), emoji: '🚗' },
  { id: 't-3', accountId: 'acc-1', type: 'INCOME', amount: 8500.00, description: 'Salário - Empresa XYZ', categoryId: 'cat-7', date: subDays(new Date(), 2), emoji: '💰' },
  { id: 't-4', accountId: 'acc-4', type: 'EXPENSE', amount: 199.90, description: 'Nike - Tênis', categoryId: 'cat-4', date: subDays(new Date(), 2), emoji: '👟' },
  { id: 't-5', accountId: 'acc-1', type: 'EXPENSE', amount: 45.90, description: 'Netflix + Spotify', categoryId: 'cat-10', date: subDays(new Date(), 3), emoji: '📺' },
  { id: 't-6', accountId: 'acc-1', type: 'EXPENSE', amount: 1200.00, description: 'Aluguel', categoryId: 'cat-3', date: subDays(new Date(), 5), emoji: '🏠' },
  { id: 't-7', accountId: 'acc-1', type: 'INCOME', amount: 1500.00, description: 'Freelance - App Design', categoryId: 'cat-8', date: subDays(new Date(), 6), emoji: '💻' },
  { id: 't-8', accountId: 'acc-4', type: 'EXPENSE', amount: 67.50, description: 'Farmácia', categoryId: 'cat-5', date: subDays(new Date(), 7), emoji: '💊' },
  { id: 't-9', accountId: 'acc-1', type: 'EXPENSE', amount: 320.00, description: 'Academia - Mensalidade', categoryId: 'cat-5', date: subDays(new Date(), 8), emoji: '💪' },
  { id: 't-10', accountId: 'acc-1', type: 'EXPENSE', amount: 150.00, description: 'Curso React', categoryId: 'cat-6', date: subDays(new Date(), 10), emoji: '📚' },
  { id: 't-11', accountId: 'acc-2', type: 'INCOME', amount: 180.00, description: 'Rendimento Poupança', categoryId: 'cat-9', date: subDays(new Date(), 12), emoji: '📈' },
  { id: 't-12', accountId: 'acc-1', type: 'EXPENSE', amount: 55.00, description: 'Supermercado Extra', categoryId: 'cat-1', date: subDays(new Date(), 13), emoji: '🛒' },
];

export const mockMonthlyData = Array.from({ length: 6 }, (_, i) => {
  const month = subMonths(new Date(), 5 - i);
  return {
    month: format(month, 'MMM'),
    receitas: 8500 + Math.random() * 2000,
    despesas: 3200 + Math.random() * 1500,
    investimentos: 1000 + Math.random() * 500,
  };
});

export const mockInvestments = [
  { id: 'inv-1', name: 'PETR4', ticker: 'PETR4', type: 'STOCK', quantity: 200, avgPrice: 32.50, currentPrice: 38.20, change: 17.54 },
  { id: 'inv-2', name: 'MXRF11', ticker: 'MXRF11', type: 'FII', quantity: 150, avgPrice: 9.80, currentPrice: 10.45, change: 6.63 },
  { id: 'inv-3', name: 'Bitcoin', ticker: 'BTC', type: 'CRYPTO', quantity: 0.15, avgPrice: 280000, currentPrice: 320000, change: 14.29 },
  { id: 'inv-4', name: 'Tesouro IPCA+', ticker: null, type: 'FIXED_INCOME', quantity: 1, avgPrice: 15000, currentPrice: 16200, change: 8.00 },
  { id: 'inv-5', name: 'ITUB4', ticker: 'ITUB4', type: 'STOCK', quantity: 100, avgPrice: 25.10, currentPrice: 23.80, change: -5.18 },
];

export const mockGoals = [
  { id: 'g-1', title: 'Reserva de Emergência', targetAmount: 30000, currentAmount: 15000, deadline: addDays(new Date(), 180), icon: '🛡️', color: '#10B981', isCompleted: false },
  { id: 'g-2', title: 'Viagem para Europa', targetAmount: 15000, currentAmount: 6500, deadline: addDays(new Date(), 365), icon: '✈️', color: '#6366F1', isCompleted: false },
  { id: 'g-3', title: 'Notebook Novo', targetAmount: 8000, currentAmount: 7200, deadline: addDays(new Date(), 45), icon: '💻', color: '#F59E0B', isCompleted: false },
  { id: 'g-4', title: 'Entrada Apartamento', targetAmount: 60000, currentAmount: 18000, deadline: addDays(new Date(), 730), icon: '🏠', color: '#8B5CF6', isCompleted: false },
];

// ─── TASKS ────────────────────────────────────────────────────────────────────
export type Subtask = { id: string; title: string; completed: boolean };
export type Task = { id: string; title: string; status: string; priority: string; dueDate: Date; labels: string[]; projectId: string | null; subtasks: Subtask[] };

export const mockTasks: Task[] = [
  { id: 'task-1', title: 'Revisar relatório financeiro do mês', status: 'TODO', priority: 'HIGH', dueDate: new Date(), labels: ['trabalho', 'finanças'], projectId: 'proj-1', subtasks: [] },
  { id: 'task-2', title: 'Treinar peito e tríceps', status: 'DONE', priority: 'MEDIUM', dueDate: new Date(), labels: ['saúde'], projectId: null, subtasks: [] },
  { id: 'task-3', title: 'Comprar ingredientes para a semana', status: 'TODO', priority: 'MEDIUM', dueDate: addDays(new Date(), 1), labels: ['casa'], projectId: null, subtasks: [] },
  { id: 'task-4', title: 'Estudar React Advanced Patterns', status: 'IN_PROGRESS', priority: 'HIGH', dueDate: addDays(new Date(), 3), labels: ['estudo'], projectId: 'proj-2', subtasks: [
    { id: 'sub-1', title: 'Assistir módulo de Context API', completed: true },
    { id: 'sub-2', title: 'Praticar com projeto', completed: false },
    { id: 'sub-3', title: 'Fazer exercícios', completed: false },
  ]},
  { id: 'task-5', title: 'Pagar fatura do cartão de crédito', status: 'TODO', priority: 'URGENT', dueDate: addDays(new Date(), 2), labels: ['finanças'], projectId: null, subtasks: [] },
  { id: 'task-6', title: 'Agendar consulta médica', status: 'TODO', priority: 'LOW', dueDate: addDays(new Date(), 7), labels: ['saúde'], projectId: null, subtasks: [] },
  { id: 'task-7', title: 'Atualizar LinkedIn', status: 'TODO', priority: 'LOW', dueDate: addDays(new Date(), 14), labels: ['carreira'], projectId: null, subtasks: [] },
  { id: 'task-8', title: 'Criar apresentação para cliente', status: 'IN_PROGRESS', priority: 'HIGH', dueDate: addDays(new Date(), 1), labels: ['trabalho'], projectId: 'proj-1', subtasks: [] },
];

export const mockProjects = [
  { id: 'proj-1', name: 'Trabalho', color: '#6366F1', icon: '💼' },
  { id: 'proj-2', name: 'Estudos', color: '#10B981', icon: '📚' },
  { id: 'proj-3', name: 'Pessoal', color: '#F59E0B', icon: '⭐' },
];

// ─── HABITS ───────────────────────────────────────────────────────────────────
export const mockHabits = [
  { id: 'h-1', name: 'Beber 2L de água', icon: '💧', color: '#3B82F6', streak: 14, completedToday: true, frequency: 'DAILY' },
  { id: 'h-2', name: 'Meditar 10min', icon: '🧘', color: '#8B5CF6', streak: 7, completedToday: false, frequency: 'DAILY' },
  { id: 'h-3', name: 'Ler 30 minutos', icon: '📖', color: '#10B981', streak: 21, completedToday: true, frequency: 'DAILY' },
  { id: 'h-4', name: 'Treinar', icon: '💪', color: '#EF4444', streak: 5, completedToday: false, frequency: 'DAILY' },
  { id: 'h-5', name: 'Sem redes sociais de manhã', icon: '📵', color: '#F59E0B', streak: 3, completedToday: true, frequency: 'DAILY' },
];

// ─── CALENDAR ─────────────────────────────────────────────────────────────────
export const mockEvents = [
  { id: 'ev-1', title: 'Reunião com cliente', startDate: new Date(), endDate: new Date(), allDay: false, color: '#6366F1', location: 'Google Meet' },
  { id: 'ev-2', title: 'Consulta médica', startDate: addDays(new Date(), 2), endDate: addDays(new Date(), 2), allDay: false, color: '#10B981', location: 'Clínica São Paulo' },
  { id: 'ev-3', title: 'Aniversário - Maria', startDate: addDays(new Date(), 5), endDate: addDays(new Date(), 5), allDay: true, color: '#EC4899', location: null },
  { id: 'ev-4', title: 'Vencimento fatura Nubank', startDate: addDays(new Date(), 2), endDate: addDays(new Date(), 2), allDay: true, color: '#8B5CF6', location: null },
  { id: 'ev-5', title: 'Workshop - Design Systems', startDate: addDays(new Date(), 8), endDate: addDays(new Date(), 8), allDay: false, color: '#F59E0B', location: 'Online' },
];

// ─── HEALTH ───────────────────────────────────────────────────────────────────
export const mockBodyMetrics = Array.from({ length: 30 }, (_, i) => ({
  date: format(subDays(new Date(), 29 - i), 'yyyy-MM-dd'),
  weight: 82 - (i * 0.05) + (Math.random() - 0.5) * 0.5,
  bodyFat: 18 - (i * 0.03),
}));

export const mockWorkouts = [
  {
    id: 'wo-1', name: 'Treino A - Peito e Tríceps', date: new Date(), duration: 65, caloriesBurned: 420,
    exercises: [
      { name: 'Supino Reto', sets: 4, reps: 10, weight: 80 },
      { name: 'Crucifixo', sets: 3, reps: 12, weight: 16 },
      { name: 'Tríceps Corda', sets: 4, reps: 15, weight: 35 },
    ]
  },
  {
    id: 'wo-2', name: 'Treino B - Costas e Bíceps', date: subDays(new Date(), 2), duration: 70, caloriesBurned: 450,
    exercises: [
      { name: 'Puxada Frontal', sets: 4, reps: 10, weight: 70 },
      { name: 'Remada Curvada', sets: 4, reps: 10, weight: 60 },
      { name: 'Rosca Direta', sets: 3, reps: 12, weight: 25 },
    ]
  },
];

export const mockNutrition = {
  calories: { target: 2400, consumed: 1820, burned: 420 },
  protein: { target: 180, consumed: 142 },
  carbs: { target: 280, consumed: 210 },
  fat: { target: 70, consumed: 55 },
  meals: [
    { name: 'Café da manhã', calories: 420, time: '07:30', foods: ['Ovos mexidos', 'Aveia', 'Banana'] },
    { name: 'Almoço', calories: 780, time: '12:30', foods: ['Frango grelhado', 'Arroz integral', 'Brócolis'] },
    { name: 'Pré-treino', calories: 180, time: '17:00', foods: ['Whey Protein', 'Banana'] },
    { name: 'Jantar', calories: 440, time: '20:00', foods: ['Salmão', 'Batata doce', 'Salada'] },
  ]
};

// ─── SHOPPING ─────────────────────────────────────────────────────────────────
export const mockShoppingLists = [
  {
    id: 'sl-1',
    name: 'Mercado da Semana',
    category: 'GROCERY',
    totalEstimate: 285.50,
    items: [
      { id: 'si-1', name: 'Frango (1kg)', quantity: 2, unit: 'kg', estimatedPrice: 24.90, isChecked: true, category: 'Proteínas' },
      { id: 'si-2', name: 'Ovos', quantity: 30, unit: 'un', estimatedPrice: 18.90, isChecked: true, category: 'Proteínas' },
      { id: 'si-3', name: 'Arroz integral', quantity: 1, unit: 'kg', estimatedPrice: 8.50, isChecked: false, category: 'Carboidratos' },
      { id: 'si-4', name: 'Aveia', quantity: 500, unit: 'g', estimatedPrice: 12.90, isChecked: false, category: 'Carboidratos' },
      { id: 'si-5', name: 'Banana', quantity: 1, unit: 'cacho', estimatedPrice: 7.50, isChecked: false, category: 'Frutas' },
      { id: 'si-6', name: 'Brócolis', quantity: 2, unit: 'un', estimatedPrice: 6.90, isChecked: false, category: 'Vegetais' },
      { id: 'si-7', name: 'Azeite extra virgem', quantity: 1, unit: 'un', estimatedPrice: 32.90, isChecked: false, category: 'Condimentos' },
      { id: 'si-8', name: 'Whey Protein', quantity: 1, unit: 'un', estimatedPrice: 149.90, isChecked: false, category: 'Suplementos' },
    ]
  },
];

// ─── AI MESSAGES ──────────────────────────────────────────────────────────────
export const mockAIMessages = [
  {
    id: 'msg-1', role: 'assistant',
    content: 'Olá, Pedro! 👋 Sou o LifeOS AI, seu assistente pessoal. Estou aqui para ajudar você com finanças, treinos, dietas, produtividade e muito mais. Como posso te ajudar hoje?',
    createdAt: subDays(new Date(), 1),
  },
  {
    id: 'msg-2', role: 'user',
    content: 'Crie um treino de musculação para mim. Quero focar em hipertrofia.',
    createdAt: subDays(new Date(), 1),
  },
  {
    id: 'msg-3', role: 'assistant',
    content: `**Treino de Hipertrofia — Divisão ABC** 💪\n\nBaseado no seu perfil (82kg, objetivo de ganho de massa muscular), criei uma divisão ideal:\n\n**Segunda — Peito + Tríceps**\n• Supino Reto: 4x8-10 (carga pesada)\n• Supino Inclinado: 3x10-12\n• Crucifixo: 3x12-15\n• Tríceps Corda: 4x12-15\n• Tríceps Francês: 3x12\n\n**Quarta — Costas + Bíceps**\n• Puxada Frontal: 4x8-10\n• Remada Curvada: 4x8-10\n• Remada Unilateral: 3x10-12\n• Rosca Direta: 4x10-12\n• Rosca Martelo: 3x12\n\n**Sexta — Pernas + Ombros**\n• Agachamento: 4x8-10\n• Leg Press: 4x12-15\n• Cadeira Extensora: 3x15\n• Desenvolvimento: 4x10-12\n• Elevação Lateral: 3x15\n\n🎯 **Meta**: Progressão de carga a cada 2 semanas`,
    createdAt: subDays(new Date(), 1),
  },
];

// ─── INSIGHTS ─────────────────────────────────────────────────────────────────
export const mockInsights = [
  { id: 'ins-1', type: 'warning', title: 'Gastos com alimentação 28% acima', description: 'Você gastou R$ 620 em alimentação este mês. Seu limite é R$ 485.', action: 'Ver transações', icon: '⚠️' },
  { id: 'ins-2', type: 'success', title: 'Ótima semana de treinos!', description: '5 de 5 treinos realizados. Você atingiu sua meta semanal.', action: 'Ver evolução', icon: '🏆' },
  { id: 'ins-3', type: 'info', title: 'Investir R$ 500 agora pode gerar R$ 2.800 em 5 anos', description: 'Com a Selic atual e seu perfil, o Tesouro IPCA+ 2029 é uma ótima opção.', action: 'Ver investimentos', icon: '💡' },
  { id: 'ins-4', type: 'info', title: '14 dias de streak! Continue assim', description: 'Você está no seu melhor período de hábitos. Não perca o ritmo!', action: 'Ver hábitos', icon: '🔥' },
];

// ─── ACHIEVEMENTS ─────────────────────────────────────────────────────────────
export const mockAchievements = [
  { id: 'ach-1', title: 'Primeiro Aporte', description: 'Registrou seu primeiro investimento', icon: '📈', earned: true, earnedAt: subDays(new Date(), 30) },
  { id: 'ach-2', title: 'Semana Perfeita', description: '7 dias de hábitos consecutivos', icon: '🔥', earned: true, earnedAt: subDays(new Date(), 7) },
  { id: 'ach-3', title: 'Poupador', description: 'Economizou 10% da renda por 3 meses', icon: '💰', earned: false, progress: 67 },
  { id: 'ach-4', title: 'Atleta', description: '30 treinos em 1 mês', icon: '💪', earned: false, progress: 40 },
  { id: 'ach-5', title: 'Mestre das Tarefas', description: '100 tarefas concluídas', icon: '✅', earned: false, progress: 72 },
  { id: 'ach-6', title: 'Organizado', description: 'Usou o calendário por 30 dias seguidos', icon: '📅', earned: true, earnedAt: subDays(new Date(), 2) },
];
