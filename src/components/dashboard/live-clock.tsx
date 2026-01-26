'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Clock } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export function LiveClock() {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  useEffect(() => {
    // Seta a hora inicial assim que o componente é montado no cliente
    setCurrentTime(new Date());

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []); // O array vazio garante que isso rode apenas uma vez

  // Enquanto currentTime for null (no servidor ou na renderização inicial do cliente), mostra um placeholder.
  if (!currentTime) {
    return (
      <div className="flex items-center gap-2 text-base font-medium text-foreground/80">
        <Clock className="h-5 w-5 text-primary" />
        <Skeleton className="h-5 w-[300px]" />
      </div>
    );
  }

  const formattedDate = format(currentTime, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  const formattedTime = format(currentTime, "HH:mm:ss");

  return (
    <div className="flex items-center gap-2 text-base font-medium text-foreground/80">
        <Clock className="h-5 w-5 text-primary" />
        <span className="capitalize">{formattedDate}</span>
        <span className="text-foreground/50">|</span>
        <span>{formattedTime}</span>
    </div>
  );
}
