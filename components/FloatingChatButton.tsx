'use client';
import { useState, useEffect } from 'react';

interface FloatingChatButtonProps {
  onClick: () => void;
}

export default function FloatingChatButton({ onClick }: FloatingChatButtonProps) {
  const [isVisible, setIsVisible] = useState(false);

  // Efeito de entrada suave ao carregar a página
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div 
      className={`fixed bottom-6 right-6 md:bottom-10 md:right-10 z-40 transition-all duration-700 transform ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      }`}
    >
      {/* Container do Botão com Efeito de "Respiração" (Glow) */}
      <div className="relative group">
        
        {/* Camada de Glow/Pulse atrás do botão */}
        <div className="absolute -inset-1 bg-gradient-to-r from-gray-200 to-gray-400 dark:from-gray-700 dark:to-gray-900 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
        
        <button
          onClick={onClick}
          className="relative flex items-center gap-4 bg-black dark:bg-white text-white dark:text-black pl-5 pr-6 py-4 rounded-full shadow-[0_10px_30px_-10px_rgba(0,0,0,0.3)] dark:shadow-[0_10px_30px_-10px_rgba(255,255,255,0.15)] hover:shadow-2xl hover:-translate-y-1 active:scale-95 transition-all duration-300 border border-gray-800 dark:border-gray-200"
        >
          {/* Ícone da Balança Animado */}
          <div className="relative">
             <div className="absolute inset-0 bg-white/20 dark:bg-black/10 rounded-full animate-ping opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
             <svg className="w-6 h-6 transform group-hover:rotate-12 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
             </svg>
             {/* Ponto de Status "Online" */}
             <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 border-2 border-black dark:border-white"></span>
              </span>
          </div>

          {/* Texto com Separador */}
          <div className="flex flex-col items-start">
           
          </div>

          {/* Seta indicativa (sutil) */}
          <svg className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>

        </button>
      </div>
    </div>
  );
}