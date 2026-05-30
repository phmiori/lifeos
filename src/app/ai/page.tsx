'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Dumbbell, Utensils, ShoppingBag, TrendingUp, Calendar, Zap } from 'lucide-react';
import { AppLayout } from '@/components/layout/app-layout';
import { useAIStore } from '@/lib/stores';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

const QUICK_PROMPTS = [
  { icon: Dumbbell, label: 'Criar treino de hoje', color: '#EF4444' },
  { icon: Utensils, label: 'Sugerir dieta', color: '#10B981' },
  { icon: ShoppingBag, label: 'Gerar lista de compras', color: '#F59E0B' },
  { icon: TrendingUp, label: 'Análise financeira', color: '#6366F1' },
  { icon: Calendar, label: 'Organizar minha semana', color: '#8B5CF6' },
  { icon: Zap, label: 'Dicas de produtividade', color: '#3B82F6' },
];

const AI_RESPONSES: Record<string, string> = {
  'Criar treino de hoje': `**Treino de Hoje — Pernas 🦵**\n\nBaseado na sua divisão ABC e no histórico de treinos:\n\n**Aquecimento (10min)**\n• Esteira: 8min velocidade 8km/h\n• Agachamento livre: 2x15 sem carga\n\n**Bloco Principal**\n• **Agachamento**: 4x8-10 @ 80kg\n• **Leg Press**: 4x12 @ 120kg\n• **Cadeira Extensora**: 3x15 @ 50kg\n• **Mesa Flexora**: 3x12 @ 40kg\n• **Panturrilha em pé**: 4x20\n\n**Cardio final (15min)**\n• Caminhada inclinada: 10% @ 5km/h\n\n💡 **Dica**: Você está com 5 dias de sequência de treinos. Continue assim! Descanse bem hoje à noite para maximizar os resultados. 🔥`,
  'Sugerir dieta': `**Plano Alimentar — Hipertrofia 💪**\n\nBaseado no seu objetivo (82kg → ganho muscular), **meta diária: 2.600kcal / 180g proteína**\n\n**☀️ Café da Manhã (07:30)**\n• Ovos mexidos (4 ovos): 280kcal, 28g prot.\n• Aveia (80g) com mel: 300kcal, 10g prot.\n• Banana (1 média): 90kcal\n\n**🥗 Almoço (12:30)**\n• Frango grelhado (200g): 330kcal, 62g prot.\n• Arroz integral (150g cozido): 180kcal\n• Brócolis + Cenoura: 60kcal\n• Azeite (1 colher): 130kcal\n\n**🏋️ Pré-Treino (17:00)**\n• Whey Protein (40g): 160kcal, 32g prot.\n• Banana: 90kcal\n• Creatina: 5g\n\n**🌙 Jantar (20:00)**\n• Salmão (180g): 350kcal, 40g prot.\n• Batata doce (200g): 180kcal\n• Salada verde à vontade\n\n**Total**: ~2.580kcal | 172g prot. | 280g carb. | 72g gordura`,
  'Análise financeira': `**📊 Análise Financeira — Maio 2026**\n\n**✅ Pontos Positivos:**\n• Você economizou **R$ 2.300** este mês (27% da renda)\n• Seu patrimônio cresceu **6.3%** nos últimos 30 dias\n• Pagamento do aluguel em dia ✅\n\n**⚠️ Pontos de Atenção:**\n• Gastos com **alimentação** 28% acima do orçamento (R$620 vs R$485)\n• 3 assinaturas que talvez não use: **R$ 89,70/mês**\n• Cartão de crédito em **24,8% do limite** — OK por agora\n\n**💡 Recomendações da IA:**\n1. **Reduzir iFood**: Preparar 3 refeições/semana em casa economiza ~R$200/mês\n2. **Revisar assinaturas**: Cancele serviços não usados → economia R$90/mês\n3. **Aumentar aporte**: Com esses R$290/mês extras investidos a 12% a.a., em 5 anos você terá **R$ 23.800** adicionais\n\n**🎯 Meta recomendada**: Atingir 30% de taxa de poupança até Agosto.`,
};

function formatMessage(text: string) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br />');
}

export default function AIPage() {
  const { messages, isTyping, addMessage, setTyping } = useAIStore();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg = {
      id: `msg-${Date.now()}`,
      role: 'user' as const,
      content: text,
      createdAt: new Date(),
    };
    addMessage(userMsg);
    setInput('');
    setTyping(true);

    // Simulate AI response delay
    await new Promise(r => setTimeout(r, 1200 + Math.random() * 800));

    const responseText = AI_RESPONSES[text] ||
      `Entendido! Estou processando sua solicitação sobre **"${text}"**.\n\nCom base no seu perfil e histórico, posso te ajudar com análises personalizadas, planos de treino, dietas, estratégias financeiras e muito mais.\n\nEsta é uma demonstração local. Na versão completa com a API OpenAI, você teria respostas em tempo real com streaming e personalização total baseada nos seus dados! 🚀`;

    setTyping(false);
    addMessage({
      id: `msg-${Date.now() + 1}`,
      role: 'assistant',
      content: responseText,
      createdAt: new Date(),
    });
  };

  return (
    <AppLayout>
      <div className="flex flex-col h-screen">
        {/* Header */}
        <div className="px-6 py-4 flex items-center gap-3"
          style={{ borderBottom: '1px solid var(--border)', background: 'rgba(10,10,15,0.85)', backdropFilter: 'blur(20px)' }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'var(--gradient-main)' }}>
            <Bot size={20} className="text-white" />
          </div>
          <div>
            <h1 className="font-bold text-white">LifeOS AI</h1>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Online · Powered by GPT-4o</span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, i) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02 }}
              className={cn('flex items-start gap-3', msg.role === 'user' && 'flex-row-reverse')}
            >
              {/* Avatar */}
              <div className={cn(
                'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5',
                msg.role === 'assistant'
                  ? 'text-white'
                  : 'text-white'
              )}
                style={{
                  background: msg.role === 'assistant' ? 'var(--gradient-main)' : 'rgba(99,102,241,0.3)',
                  border: msg.role === 'user' ? '1px solid rgba(99,102,241,0.3)' : 'none',
                }}>
                {msg.role === 'assistant' ? <Bot size={15} /> : <User size={15} />}
              </div>

              {/* Bubble */}
              <div className={cn(
                'max-w-[75%] rounded-2xl px-4 py-3',
                msg.role === 'assistant'
                  ? 'rounded-tl-sm'
                  : 'rounded-tr-sm'
              )}
                style={{
                  background: msg.role === 'assistant' ? 'var(--bg-secondary)' : 'var(--gradient-main)',
                  border: msg.role === 'assistant' ? '1px solid var(--border)' : 'none',
                }}>
                <div
                  className="text-sm leading-relaxed text-white"
                  dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
                />
                <p className="text-xs mt-2 opacity-50">
                  {format(new Date(msg.createdAt), 'HH:mm')}
                </p>
              </div>
            </motion.div>
          ))}

          {/* Typing indicator */}
          <AnimatePresence>
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: 'var(--gradient-main)' }}>
                  <Bot size={15} className="text-white" />
                </div>
                <div className="px-4 py-3 rounded-2xl rounded-tl-sm"
                  style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                  <div className="flex gap-1 items-center">
                    {[0, 1, 2].map(i => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 rounded-full"
                        style={{ background: 'var(--accent-primary)' }}
                        animate={{ y: [-3, 0, -3] }}
                        transition={{ duration: 0.7, delay: i * 0.15, repeat: Infinity }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts */}
        <div className="px-6 py-3" style={{ borderTop: '1px solid var(--border)' }}>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {QUICK_PROMPTS.map(({ icon: Icon, label, color }) => (
              <button
                key={label}
                onClick={() => sendMessage(label)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium flex-shrink-0 transition-all hover:scale-[1.02]"
                style={{
                  background: `${color}15`,
                  border: `1px solid ${color}30`,
                  color,
                }}
              >
                <Icon size={12} />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="px-6 pb-6 pt-3">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <input
                className="input pr-4"
                placeholder="Pergunte qualquer coisa ao LifeOS AI..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage(input)}
                style={{ paddingRight: '16px' }}
              />
            </div>
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isTyping}
              className="btn btn-primary"
              style={{ padding: '10px 16px', opacity: !input.trim() || isTyping ? 0.5 : 1 }}
            >
              <Send size={16} />
            </button>
          </div>
          <p className="text-xs mt-2 text-center" style={{ color: 'var(--text-muted)' }}>
            <Sparkles size={10} className="inline mr-1" />
            LifeOS AI · Conecte sua chave OpenAI para respostas personalizadas em tempo real
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
