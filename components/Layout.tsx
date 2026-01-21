
import React from 'react';
import { AppView } from '../types';

interface LayoutProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  children: React.ReactNode;
}

export const Header: React.FC<{ setView: (v: AppView) => void; currentView: AppView }> = ({ setView, currentView }) => (
  <header className="fixed top-0 left-0 right-0 h-16 glass-morphism z-50 flex items-center justify-between px-6 border-b border-slate-200">
    <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView(AppView.HOME)}>
      <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">C</div>
      <h1 className="text-xl font-bold text-slate-800 tracking-tight">Catalogo<span className="text-blue-600">AI</span></h1>
    </div>
    <nav className="hidden md:flex items-center gap-6">
      <button
        onClick={() => setView(AppView.HOME)}
        className={`text-sm font-medium transition-colors ${currentView === AppView.HOME ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
      >
        Dashboard
      </button>
      <button
        onClick={() => setView(AppView.CHAT)}
        className={`text-sm font-medium transition-colors ${currentView === AppView.CHAT ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
      >
        Consultar
      </button>
      <button
        onClick={() => setView(AppView.REGISTER)}
        className={`text-sm font-medium transition-colors ${currentView === AppView.REGISTER ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
      >
        Cadastrar
      </button>
      <button
        onClick={() => setView(AppView.ADMIN)}
        className={`text-sm font-medium transition-colors ${currentView === AppView.ADMIN ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
      >
        Gestão
      </button>
    </nav>
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden">
        <img src="https://picsum.photos/seed/user/100" alt="User" />
      </div>
    </div>
  </header>
);

export const Layout: React.FC<LayoutProps> = ({ currentView, setView, children }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header setView={setView} currentView={currentView} />
      <main className="flex-1 mt-16 overflow-y-auto">
        {children}
      </main>

      {/* Mobile Navigation */}
      <footer className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200 flex items-center justify-around px-4 z-50">
        <button onClick={() => setView(AppView.HOME)} className={`flex flex-col items-center gap-1 ${currentView === AppView.HOME ? 'text-blue-600' : 'text-slate-400'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
          <span className="text-[10px] font-medium">Home</span>
        </button>
        <button onClick={() => setView(AppView.CHAT)} className={`flex flex-col items-center gap-1 ${currentView === AppView.CHAT ? 'text-blue-600' : 'text-slate-400'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
          <span className="text-[10px] font-medium">Chat</span>
        </button>
        <button onClick={() => setView(AppView.VOICE)} className={`flex flex-col items-center gap-1 ${currentView === AppView.VOICE ? 'text-blue-600' : 'text-slate-400'}`}>
          <div className="w-10 h-10 bg-blue-600 -mt-8 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
          </div>
          <span className="text-[10px] font-medium">Voz</span>
        </button>
        <button onClick={() => setView(AppView.ADMIN)} className={`flex flex-col items-center gap-1 ${currentView === AppView.ADMIN ? 'text-blue-600' : 'text-slate-400'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
          <span className="text-[10px] font-medium">Arquivos</span>
        </button>
      </footer>
    </div>
  );
};
