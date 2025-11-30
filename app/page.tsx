// app/page.tsx
'use client';
import FloatingChatButton from '@/components/FloatingChatButton';

import { useState, useEffect, useRef } from 'react';

export default function NormAIInterface() {
  const [query, setQuery] = useState('');
  const [activeQuestion, setActiveQuestion] = useState(''); // Estado para guardar a pergunta enviada
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  // Ref para auto-scroll
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Auto-scroll para o fundo quando houver resposta
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [response, activeQuestion, loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    // 1. Move a query do input para a área de chat visual
    setActiveQuestion(query);
    setQuery(''); // Limpa o input
    setResponse(''); // Reseta resposta anterior
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query }),
      });

      if (!res.ok) throw new Error('Falha na conexão neural.');

      const data = await res.json();
      
      if (data.error) {
        setError(data.error);
      } else {
        setResponse(data.response);
      }
    } catch (err) {
      setError('Interrupção no fluxo de dados. Tente novamente.');
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  const openWhatsApp = () => {
    window.open(`https://wa.me/14155238886?text=${encodeURIComponent("Olá! Gostaria de acessar a inteligência do NormAI.")}`, '_blank');
  };

  const Icons = {
    Scale: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>,
    Bolt: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
    Eye: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>,
    Brain: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>,
    Shield: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
    Close: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>,
    User: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
  };

  const features = [
    { icon: <Icons.Bolt />, title: "Instantaneidade", description: "Respostas em milissegundos." },
    { icon: <Icons.Eye />, title: "Clarividência", description: "Visão profunda da lei." },
    { icon: <Icons.Brain />, title: "Cognição", description: "Análise superior à humana." },
    { icon: <Icons.Shield />, title: "Blindagem", description: "Segurança jurídica total." }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-700 font-sans selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
      
      {/* Header - ATUALIZADO */}
      <header className="fixed top-0 w-full z-40 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-900 transition-all duration-300">
        <div className="container mx-auto px-4 h-20 flex justify-between items-center">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.location.reload()}>
            <div className="bg-black dark:bg-white text-white dark:text-black p-2 rounded-lg transition-transform duration-500 group-hover:rotate-180">
              <Icons.Scale />
            </div>
            <span className="text-xl font-bold tracking-widest text-black dark:text-white">NORMAI</span>
          </div>
          
          <div className="flex items-center gap-4">                     
            <button onClick={openWhatsApp} className="hidden md:block bg-black dark:bg-white text-white dark:text-black px-5 py-2 rounded-lg font-medium text-sm hover:opacity-80 transition-opacity duration-300">
              WhatsApp
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section - Reduzida e Ajustada à Direita */}
      <main className="container mx-auto px-4 pt-32 pb-20 min-h-screen flex flex-col justify-center overflow-hidden">
        <div className="relative w-full max-w-[90%] mx-auto flex flex-col items-end">
          
          {/* Título com alinhamento progressivo à direita */}
          <h1 className="flex flex-col w-full font-black tracking-tighter leading-[0.9] select-none text-right">
            
            <span className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-black dark:text-white mr-[10%] md:mr-[15%] transform hover:translate-x-2 transition-transform duration-700">
              ONISCIÊNCIA
            </span>
            
            <span className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-black dark:from-gray-600 dark:to-white my-2 md:my-4 mr-[5%] md:mr-[8%]">
              JURÍDICA
            </span>
            
            <span className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-black dark:text-white">
              INSTANTÂNEA
            </span>
          </h1>

      

       <div className="mt-12 w-full flex flex-col items-start space-y-8">
          <p className="text-base md:text-xl text-gray-600 dark:text-gray-400 max-w-xl font-light leading-relaxed text-left">
            Abandone a incerteza. Acesse o oráculo definitivo da legislação angolana. 
            Onde a complexidade da lei encontra a simplicidade da resposta absoluta.
          </p>
 
  {/* Botão do WhatsApp */}
          <button
            onClick={() => window.open(`https://wa.me/14155238886?text=${encodeURIComponent("join science-trouble")}`, '_blank')}
            className="group relative overflow-hidden bg-white text-black px-8 py-4 rounded-lg font-bold text-base tracking-wider transition-all duration-300 hover:bg-white-700 hover:shadow-[0_0_20px_rgba(34,197,94,0.3)]"
          >
            <span className="relative z-10 flex items-center gap-3">
              💬 CONECTAR VIA WHATSAPP
            </span>
            <div className="absolute inset-0 h-full w-full scale-0 rounded-lg transition-all duration-300 group-hover:scale-100 group-hover:bg-green-800 opacity-20"></div>
          </button>
       </div>
      </div>
      </main>

      {/* Features - Minimal Grid */}
      <section className="border-t border-gray-100 dark:border-gray-900 py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {features.map((feature, index) => (
              <div key={index} className="group p-6 border-l border-gray-200 dark:border-gray-800 hover:border-black dark:hover:border-white transition-colors duration-500">
                <div className="mb-6 text-black dark:text-white transform transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-1">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-black dark:text-white mb-2 uppercase tracking-wide">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-500 group-hover:text-gray-800 dark:group-hover:text-gray-300 transition-colors">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal de Chat - Melhorado */}
      {isChatOpen && (
        <div className="fixed inset-0 bg-white/95 dark:bg-black/95 z-50 flex items-center justify-center p-0 md:p-4 backdrop-blur-xl transition-opacity duration-300">
          <div className="w-full h-full md:max-w-4xl md:h-[90vh] bg-white dark:bg-black md:border md:border-gray-200 md:dark:border-gray-800 md:rounded-3xl shadow-2xl flex flex-col relative overflow-hidden">
            
            {/* Botão Fechar */}
            <button
              onClick={() => setIsChatOpen(false)}
              className="absolute top-4 right-4 z-20 p-2 bg-gray-100 dark:bg-gray-900 rounded-full text-gray-500 hover:text-black dark:hover:text-white transition-colors"
            >
              <Icons.Close />
            </button>

            {/* Área de Conteúdo - Scroll Correto */}
            {/* Se não houver pergunta ativa, centraliza. Se houver, alinha ao topo (justify-start) */}
            <div 
              ref={chatContainerRef}
              className={`flex-1 overflow-y-auto p-6 md:p-10 flex flex-col gap-8 ${!activeQuestion ? 'justify-center items-center' : 'justify-start'}`}
            >
              
              {/* Estado Zero */}
              {!activeQuestion && !loading && (
                <div className="text-center space-y-4 animate-fade-in-up">
                  <div className="inline-block p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl mb-4">
                    <span className="text-4xl">⚖️</span>
                  </div>
                  <h2 className="text-2xl font-bold text-black dark:text-white">
                    NormAI
                  </h2>
                  <p className="text-gray-500 text-sm max-w-xs mx-auto">
                    A base legislativa está pronta. Faça sua pergunta.
                  </p>
                </div>
              )}

              {/* Mensagem do Usuário (Sobe para o histórico) */}
              {activeQuestion && (
                <div className="w-full flex justify-end animate-fade-in-up">
                  <div className="bg-gray-100 dark:bg-gray-900 text-black dark:text-white px-6 py-4 rounded-2xl rounded-tr-sm max-w-[85%] border border-gray-200 dark:border-gray-800">
                    <p className="text-base md:text-lg">{activeQuestion}</p>
                  </div>
                </div>
              )}

              {/* Loader */}
              {loading && (
                <div className="w-full flex justify-start animate-fade-in-up">
                   <div className="flex items-center space-x-3 text-gray-400">
                      <div className="w-2 h-2 bg-black dark:bg-white rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                      <div className="w-2 h-2 bg-black dark:bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-black dark:bg-white rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      <span className="text-xs uppercase tracking-widest ml-2">Analisando</span>
                   </div>
                </div>
              )}

              {/* Resposta do Agente (Card Melhorado) */}
              {response && (
                <div className="w-full flex justify-start animate-fade-in-up pb-6">
                  <div className="bg-white dark:bg-black text-black dark:text-white w-full">
                    {/* Header do Card de Resposta */}
                    <div className="flex items-center gap-2 mb-4 opacity-50">
                       <Icons.Scale />
                       <span className="text-xs font-bold uppercase tracking-widest">Resposta Oficial</span>
                    </div>
                    
                    {/* Conteúdo da Resposta */}
                    <div className="prose dark:prose-invert max-w-none">
                      <div className="pl-4 md:pl-6 border-l-2 border-black dark:border-white py-1">
                        <p className="text-base md:text-lg leading-7 text-gray-800 dark:text-gray-200 whitespace-pre-wrap font-light">
                          {response}
                        </p>
                      </div>
                    </div>
                    
                    {/* Feedback visual sutil no final */}
                    <div className="mt-6 flex items-center gap-2">
                       <div className="h-px bg-gray-200 dark:bg-gray-800 flex-1"></div>
                       <span className="text-[10px] text-gray-400 uppercase">Fim da Consulta</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-6 bg-white dark:bg-black border-t border-gray-100 dark:border-gray-900 z-10">
              <form onSubmit={handleSubmit} className="relative w-full">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={loading ? "Aguarde a resposta..." : "Digite sua questão jurídica..."}
                  className="w-full bg-transparent text-lg md:text-xl text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-600 border-b border-gray-200 dark:border-gray-800 focus:border-black dark:focus:border-white outline-none py-3 pr-12 transition-all duration-300"
                  disabled={loading}
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={loading || !query.trim()}
                  className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-black dark:text-white disabled:opacity-30 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-full transition-all"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </button>
              </form>
            </div>

          </div>
        </div>
      )}

      {/* FAB */}
       {!isChatOpen && (
        <FloatingChatButton onClick={() => setIsChatOpen(true)} />
      )}


    </div>
  );
}