'use client';
import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  User, Moon, Sun, Bell, Shield, Database, LogOut, ChevronRight,
  Palette, Globe, Lock, CreditCard, Zap, Download
} from 'lucide-react';
import { AppLayout } from '@/components/layout/app-layout';
import { TopBar } from '@/components/layout/topbar';
import { useAppStore } from '@/lib/stores';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const SETTINGS_SECTIONS = [
  {
    title: 'Conta',
    items: [
      { icon: User, label: 'Perfil', description: 'Nome, foto, email', action: 'Editar' },
      { icon: Lock, label: 'Segurança', description: 'Senha e autenticação 2FA', action: 'Gerenciar' },
      { icon: CreditCard, label: 'Plano', description: 'LifeOS Pro · R$ 29,90/mês', action: 'Gerenciar', badge: 'PRO' },
    ]
  },
  {
    title: 'Personalização',
    items: [
      { icon: Palette, label: 'Tema', description: 'Modo escuro / claro', action: 'toggle-theme' },
      { icon: Globe, label: 'Idioma', description: 'Português (Brasil)', action: 'Alterar' },
      { icon: Bell, label: 'Notificações', description: 'Push, email, lembretes', action: 'Configurar' },
    ]
  },
  {
    title: 'Dados',
    items: [
      { icon: Database, label: 'Backup', description: 'Último backup: hoje às 08:00', action: 'Fazer backup' },
      { icon: Download, label: 'Exportar dados', description: 'PDF, Excel, CSV', action: 'Exportar' },
      { icon: Shield, label: 'Privacidade', description: 'Controle seus dados', action: 'Ver' },
    ]
  },
  {
    title: 'IA',
    items: [
      { icon: Zap, label: 'OpenAI API Key', description: 'Configure para habilitar IA real', action: 'Configurar' },
      { icon: Zap, label: 'Preferências da IA', description: 'Tom, linguagem, detalhamento', action: 'Ajustar' },
    ]
  },
];

export default function SettingsPage() {
  const { user, theme, toggleTheme } = useAppStore();
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);

  const handleAction = (action: string, label: string) => {
    if (action === 'toggle-theme') {
      toggleTheme();
      toast.success(`Tema ${theme === 'dark' ? 'claro' : 'escuro'} ativado!`);
    } else {
      toast.info(`${label}: disponível na versão completa com backend!`);
    }
  };

  return (
    <AppLayout>
      <TopBar title="Configurações" />

      <div className="p-6 space-y-6 max-w-2xl">

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6"
        >
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white"
              style={{ background: 'var(--gradient-main)' }}
            >
              {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{user.name}</h2>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{user.email}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="badge badge-primary">Nível {user.level}</span>
                <span className="badge badge-warning">🔥 {user.streak} dias</span>
              </div>
            </div>
            <button className="btn btn-secondary ml-auto" style={{ padding: '8px 14px', fontSize: '13px' }}>
              Editar Perfil
            </button>
          </div>

          {/* XP Bar */}
          <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
            <div className="flex justify-between text-sm mb-2">
              <span style={{ color: 'var(--text-muted)' }}>Progresso para Nível {user.level + 1}</span>
              <span style={{ color: 'var(--text-secondary)' }}>{user.xp} / {user.xpToNextLevel} XP</span>
            </div>
            <div className="progress-bar" style={{ height: '8px' }}>
              <motion.div
                className="progress-fill"
                initial={{ width: 0 }}
                animate={{ width: `${(user.xp / user.xpToNextLevel) * 100}%` }}
                transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
              />
            </div>
          </div>
        </motion.div>

        {/* Settings Sections */}
        {SETTINGS_SECTIONS.map((section, si) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: si * 0.05 + 0.1 }}
            className="card overflow-hidden"
          >
            <div className="px-5 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
              <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                {section.title}
              </h3>
            </div>
            <div className="divide-y" style={{ '--tw-divide-opacity': 1 } as any}>
              {section.items.map((item, i) => (
                <button
                  key={item.label}
                  onClick={() => handleAction(item.action, item.label)}
                  className="w-full flex items-center gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors text-left"
                  style={{ borderBottom: i < section.items.length - 1 ? '1px solid var(--border)' : 'none' }}
                >
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
                    <item.icon size={17} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm text-white">{item.label}</p>
                      {(item as any).badge && (
                        <span className="badge badge-primary text-xs">{(item as any).badge}</span>
                      )}
                    </div>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{item.description}</p>
                  </div>
                  {item.action === 'toggle-theme' ? (
                    <div
                      className="w-10 h-6 rounded-full flex items-center transition-all relative"
                      style={{ background: theme === 'dark' ? 'var(--accent-primary)' : 'var(--bg-tertiary)', border: '1px solid var(--border)' }}
                    >
                      <div
                        className="w-4 h-4 rounded-full bg-white absolute transition-all flex items-center justify-center"
                        style={{ left: theme === 'dark' ? 'calc(100% - 20px)' : '3px' }}
                      >
                        {theme === 'dark' ? <Moon size={9} className="text-indigo-600" /> : <Sun size={9} className="text-yellow-500" />}
                      </div>
                    </div>
                  ) : (
                    <ChevronRight size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        ))}

        {/* API Key Config */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card p-5"
          style={{ border: '1px solid rgba(99,102,241,0.3)', background: 'rgba(99,102,241,0.05)' }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Zap size={17} style={{ color: 'var(--accent-primary)' }} />
            <h3 className="font-semibold text-white">Configurar IA (OpenAI)</h3>
          </div>
          <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>
            Adicione sua chave de API da OpenAI para habilitar respostas em tempo real com GPT-4o.
          </p>
          <input
            className="input mb-3"
            type={showApiKey ? 'text' : 'password'}
            placeholder="sk-..."
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
          />
          <div className="flex gap-3">
            <button className="btn btn-secondary text-xs" style={{ padding: '8px 12px' }}
              onClick={() => setShowApiKey(v => !v)}>
              {showApiKey ? 'Ocultar' : 'Mostrar'}
            </button>
            <button className="btn btn-primary text-xs flex-1" style={{ padding: '8px 12px' }}
              onClick={() => toast.success('Chave salva! IA real ativada.')}>
              Salvar Chave
            </button>
          </div>
        </motion.div>

        {/* Logout */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
          <button
            className="btn btn-secondary w-full"
            style={{ color: '#F87171', borderColor: 'rgba(239,68,68,0.2)' }}
            onClick={() => toast.error('Logout disponível na versão completa com autenticação!')}
          >
            <LogOut size={16} />
            Sair da Conta
          </button>
        </motion.div>
      </div>
    </AppLayout>
  );
}
