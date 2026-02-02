'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AgendaRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/follow-ups');
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center">
      <p className="text-muted-foreground">Redirecionando para o novo Mecanismo de Retornos...</p>
    </div>
  );
}
