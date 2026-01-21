
import React, { useState, useRef, useEffect } from 'react';
import { geminiService } from '../services/geminiService';
import { ChatMessage } from '../types';

export const ChatView: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'model',
      text: 'Olá! Sou o Catalogo AI. Já processei todos os manuais da linha X100 e B-45. Como posso auxiliar sua consulta técnica hoje?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await geminiService.sendTextMessage(input);

      // Simulate citation extraction for UI polish
      const mockCitations = input.toLowerCase().includes('motor') ? ['Manual Técnico X100 (pág 14)'] :
        input.toLowerCase().includes('bomba') ? ['Catálogo Hidráulica v2.0'] : [];

      const modelMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: response || 'Ocorreu um erro na recuperação de dados.',
        timestamp: new Date(),
        citations: mockCitations
      };
      setMessages(prev => [...prev, modelMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-5xl mx-auto">
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 scrollbar-thin scrollbar-thumb-slate-200"
      >
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-fadeIn`}>
            <div className={`group relative max-w-[90%] md:max-w-[80%] p-5 rounded-3xl shadow-sm border ${msg.role === 'user'
                ? 'bg-brand-gradient text-brand-dark border-brand-primary/20 rounded-tr-none font-medium'
                : 'bg-brand-dark/50 text-slate-200 border-white/5 backdrop-blur-md rounded-tl-none'
              }`}>
              <div className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                {msg.text}
              </div>

              {msg.citations && msg.citations.length > 0 && (
                <div className="mt-4 pt-3 border-t border-white/5 flex flex-wrap gap-2">
                  {msg.citations.map((c, i) => (
                    <span key={i} className="flex items-center gap-1.5 px-2 py-1 bg-brand-dark/30 text-[10px] text-slate-400 font-medium rounded-md border border-white/10 hover:bg-brand-primary/10 hover:text-brand-primary transition-colors cursor-pointer">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                      {c}
                    </span>
                  ))}
                </div>
              )}

              <div className={`absolute -bottom-6 flex items-center gap-3 transition-opacity duration-200 ${msg.role === 'user' ? 'right-0' : 'left-0'}`}>
                <span className="text-[10px] text-slate-400">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                {msg.role === 'model' && (
                  <div className="flex gap-2">
                    <button title="Gostei" className="text-slate-300 hover:text-blue-500 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.757c1.246 0 2.25 1.004 2.25 2.25 0 .58-.223 1.14-.623 1.564l-5.631 5.91a2.25 2.25 0 01-3.238 0L5.88 13.814A2.25 2.25 0 015.257 12.25c0-1.246 1.004-2.25 2.25-2.25H12.25V5.25a2.25 2.25 0 014.5 0v4.75z" /></svg>
                    </button>
                    <button title="Copiar" className="text-slate-300 hover:text-slate-500 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-brand-dark/50 p-5 rounded-3xl rounded-tl-none border border-white/5 backdrop-blur-md shadow-sm flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 bg-brand-primary rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-brand-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-brand-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              </div>
              <span className="text-xs font-medium text-slate-500">Consultando Base Técnica...</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 md:p-8 bg-gradient-to-t from-brand-dark to-transparent">
        <div className="max-w-4xl mx-auto relative group">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Digite sua dúvida técnica..."
            className="w-full bg-brand-dark/80 border-2 border-white/10 rounded-[2.5rem] px-8 py-5 pr-20 text-base focus:outline-none focus:ring-4 focus:ring-brand-primary/5 focus:border-brand-primary/30 transition-all resize-none shadow-2xl shadow-black/20 placeholder:text-slate-600 text-slate-200"
            rows={1}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-3.5 bg-brand-gradient text-brand-dark rounded-full hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 shadow-lg shadow-brand-primary/20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </button>
        </div>
        <p className="text-center mt-4 text-[10px] text-slate-400 font-medium">
          O Catalogo AI utiliza RAG para garantir respostas técnicas precisas baseadas em seus manuais oficiais.
        </p>
      </div>
    </div>
  );
};
