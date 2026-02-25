'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * 🔄 REDIRECIONAMENTO ESTRATÉGICO
 * A funcionalidade de Aniversários foi migrada para a aba interna de Clientes
 * para centralizar a gestão da base em um único local.
 */
export default function BirthdaysRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace('/customers?tab=birthdays');
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center space-y-4">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto opacity-20" />
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest animate-pulse">
              Redirecionando para a Central de Clientes...
          </p>
      </div>
    </div>
  );
}
