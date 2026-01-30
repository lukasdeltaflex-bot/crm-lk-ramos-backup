'use client';

import { useEffect } from 'react';

/**
 * Componente de estabilização de interface ULTRA.
 * Garante que a interatividade da tela (cliques e rolagem) seja sempre restaurada
 * após o fechamento de modais ou menus, prevenindo o "congelamento" da tela.
 */
export function InteractionFixer() {
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const cleanup = () => {
      // Verifica se existem elementos de overlay ativos do Radix/ShadCN
      const hasOverlays = document.querySelectorAll('[data-radix-portal], [role="dialog"], [role="menu"], .fixed.inset-0').length > 0;
      
      // Se não houver modais abertos, forçamos a liberação do body e html
      if (!hasOverlays) {
        const rootElements = [document.body, document.documentElement];
        rootElements.forEach(el => {
          if (el) {
            el.style.pointerEvents = 'auto';
            el.style.overflow = 'auto';
            el.style.setProperty('pointer-events', 'auto', 'important');
            el.style.setProperty('overflow', 'auto', 'important');
          }
        });
        document.body.classList.remove('pointer-events-none');
        document.body.removeAttribute('data-scroll-locked');
      }
    };

    // Executa a limpeza periodicamente para garantir fluidez
    const interval = setInterval(cleanup, 500);
    
    // Também executa ao clicar na tela ou pressionar teclas (caso um modal tenha acabado de fechar)
    const handleEvents = () => setTimeout(cleanup, 50);
    window.addEventListener('mousedown', handleEvents);
    window.addEventListener('keydown', handleEvents);

    return () => {
      clearInterval(interval);
      window.removeEventListener('mousedown', handleEvents);
      window.removeEventListener('keydown', handleEvents);
    };
  }, []);

  return null;
}
