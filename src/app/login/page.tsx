'use client';

import { signIn } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function LoginPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex items-center justify-center"
         style={{ background: 'var(--bg-primary)' }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-10 flex flex-col items-center gap-6 w-full max-w-sm"
      >
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
             style={{ background: 'var(--gradient-main)' }}>
          <Zap size={32} className="text-white" />
        </div>

        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-1">LifeOS</h1>
          <p style={{ color: 'var(--text-muted)' }} className="text-sm">
            Seu sistema de vida completo
          </p>
        </div>

        <button
          onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
          className="btn btn-secondary w-full gap-3 justify-center"
          style={{ padding: '12px 24px' }}
        >
          {/* Pode adicionar um icone svg do Google aqui depois */}
          <span>G</span>
          Entrar com Google
        </button>

        <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
          Acesso restrito — somente contas autorizadas
        </p>
      </motion.div>
    </div>
  );
}
