'use client';

import { useEffect } from 'react';

/**
 * Componente ultra-estável para resolver travamentos de interface.
 * Monitora o fechamento de modais e restaura a interatividade global.
 */
export function InteractionFixer() {
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const forceCleanup = () => {
      // Verifica se existem modais ou menus abertos
      const activeOverlays = document.querySelectorAll('[data-radix-portal], [role="dialog"], [role="menu"], .fixed.inset-0');
      
      // Se não houver sobreposições, limpamos travas de estilo
      if (activeOverlays.length === 0) {
        document.body.style.pointerEvents = 'auto';
        document.body.style.overflow = 'auto';
        document.documentElement.style.pointerEvents = 'auto';
        document.documentElement.style.overflow = 'auto';
        document.body.classList.remove('pointer-events-none');
      }
    };

    // Observer para capturar mudanças no DOM (fechamento de modais)
    const observer = new MutationObserver(forceCleanup);
    observer.observe(document.body, { childList: true, subtree: false });

    // Eventos de clique para garantir destravamento manual
    const handleEvents = () => setTimeout(forceCleanup, 100);
    window.addEventListener('mousedown', handleEvents);
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') handleEvents();
    });

    const interval = setInterval(forceCleanup, 2000);

    return () => {
      observer.disconnect();
      clearInterval(interval);
      window.removeEventListener('mousedown', handleEvents);
    };
  }, []);

  return null;
}
