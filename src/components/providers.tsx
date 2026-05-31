'use client';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';
import { useEffect, useState } from 'react';
import { SessionProvider } from 'next-auth/react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Evita erros de hidratação do Zustand com localStorage
  }

  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        {children}
        <Toaster
          theme="dark"
          position="bottom-right"
          toastOptions={{
            style: {
              background: 'rgba(18, 18, 26, 0.95)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#F8FAFC',
              backdropFilter: 'blur(12px)',
            },
          }}
        />
      </ThemeProvider>
    </SessionProvider>
  );
}

