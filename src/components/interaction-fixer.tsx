'use client';

import { useEffect } from 'react';

/**
 * Componente utilitário robusto para resolver o bug de "tela travada" (pointer-events: none).
 * Ele monitora mudanças no DOM e interações para garantir que cliques sejam restaurados.
 */
export function InteractionFixer() {
  useEffect(() => {
    const forceCleanup = () => {
      // Verifica se existem elementos de sobreposição ativos (Modais do Radix, menus, etc)
      const overlays = document.querySelectorAll('[data-radix-portal], .fixed.inset-0, [role="dialog"], [role="menu"]');
      
      // Lista de propriedades a resetar
      const resetStyles = (el: HTMLElement) => {
        if (el.style.pointerEvents === 'none') el.style.pointerEvents = 'auto';
        if (el.style.overflow === 'hidden') el.style.overflow = 'auto';
        el.classList.remove('pointer-events-none');
        el.removeAttribute('data-radix-scroll-lock');
      };

      // Se não houver sobreposições visíveis, limpamos o corpo da página agressivamente
      if (overlays.length === 0) {
        resetStyles(document.body);
        resetStyles(document.documentElement);
      }
    };

    // Monitora mudanças na estrutura do DOM (abertura/fechamento de modais)
    const observer = new MutationObserver(() => {
      // Múltiplos delays para garantir que animações de saída terminem
      setTimeout(forceCleanup, 50);
      setTimeout(forceCleanup, 150);
      setTimeout(forceCleanup, 300);
      setTimeout(forceCleanup, 600);
    });

    observer.observe(document.body, {
      attributes: true,
      childList: true,
      subtree: false
    });

    // Eventos de redundância em interações comuns
    const handleRelease = () => {
      setTimeout(forceCleanup, 100);
    };

    window.addEventListener('mousedown', handleRelease);
    window.addEventListener('mouseup', handleRelease);
    window.addEventListener('click', handleRelease);
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') handleRelease();
    });

    // Check periódico de segurança contra travas "fantasmagóricas"
    const interval = setInterval(forceCleanup, 1000);

    return () => {
      observer.disconnect();
      clearInterval(interval);
      window.removeEventListener('mousedown', handleRelease);
      window.removeEventListener('mouseup', handleRelease);
      window.removeEventListener('click', handleRelease);
    };
  }, []);

  return null;
}
