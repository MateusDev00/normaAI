// components/FloatingChatButton.tsx
'use client';
import { useState } from 'react';

export default function FloatingChatButton({ onClick }: { onClick: () => void }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="fixed bottom-6 right-6 md:bottom-10 md:right-10 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white p-5 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-110 z-30 group animate-float"
    >
      <div className="relative">
        {/* Ícone principal com animação */}
        <div className="text-2xl md:text-3xl transition-transform duration-500 group-hover:rotate-12">
          ⚡
        </div>
        
        {/* Partículas flutuantes */}
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-ping" />
        <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
        
        {/* Efeito de brilho */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
      </div>

      {/* Tooltip aprimorado */}
      {isHovered && (
        <div className="absolute -top-16 right-0 bg-black dark:bg-white text-white dark:text-black text-sm px-3 py-2 rounded-xl shadow-2xl transform transition-all duration-300">
          <div className="font-bold">CONSULTA NORMAI</div>
          <div className="text-xs opacity-80">Onisciência Jurídica</div>
          <div className="absolute bottom-0 right-4 transform translate-y-1 rotate-45 w-3 h-3 bg-black dark:bg-white" />
        </div>
      )}

      {/* Indicador de pulso */}
      <div className="absolute inset-0 rounded-2xl border-2 border-white/30 animate-pulse" />
    </button>
  );
}