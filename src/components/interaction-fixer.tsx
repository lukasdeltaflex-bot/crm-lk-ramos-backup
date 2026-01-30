'use client';

import { useEffect } from 'react';

/**
 * Componente de estabilização de interface.
 * Monitora o fechamento de modais e garante que a interatividade da tela seja restaurada.
 */
export function InteractionFixer() {
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const forceCleanup = () => {
      // Verifica se existem modais ou menus abertos no portal do Radix
      const activeOverlays = document.querySelectorAll('[data-radix-portal], [role="dialog"], [role="menu"], .fixed.inset-0');
      
      // Se não houver nada aberto, limpamos as travas do body e html
      if (activeOverlays.length === 0) {
        const rootElements = [document.body, document.documentElement];
        rootElements.forEach(el => {
          el.style.pointerEvents = 'auto';
          el.style.overflow = 'auto';
          el.style.setProperty('pointer-events', 'auto', 'important');
          el.style.setProperty('overflow', 'auto', 'important');
        });
        document.body.classList.remove('pointer-events-none');
      }
    };

    // Observer para capturar mudanças dinâmicas no DOM (abertura/fechamento de modais)
    const observer = new MutationObserver(forceCleanup);
    observer.observe(document.body, { childList: true, subtree: false });

    // Eventos de clique e teclado para garantir destravamento manual imediato
    const handleEvents = () => setTimeout(forceCleanup, 50);
    window.addEventListener('mousedown', handleEvents);
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') handleEvents();
    });

    // Intervalo de segurança para casos raros onde o Observer não dispara
    const interval = setInterval(forceCleanup, 1000);

    return () => {
      observer.disconnect();
      clearInterval(interval);
      window.removeEventListener('mousedown', handleEvents);
    };
  }, []);

  return null;
}
