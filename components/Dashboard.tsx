
import React from 'react';
import { AppView } from '../types';
import { MOCK_PRODUCTS, MOCK_DOCUMENTS } from '../constants';

export const Dashboard: React.FC<{ setView: (v: AppView) => void }> = ({ setView }) => {
  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div className="animate-slideDown">
          <h2 className="text-4xl font-extrabold text-slate-100 tracking-tight">Painel de <span className="text-brand-primary">Conhecimento</span></h2>
          <p className="text-slate-400 mt-2 text-lg">Central de inteligência para o seu catálogo técnico.</p>
        </div>
        <div className="flex gap-3 bg-brand-dark/40 p-1.5 rounded-2xl shadow-sm border border-white/5 backdrop-blur-md">
          <div className="px-4 py-2 text-center border-r border-white/5">
            <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Manuais</span>
            <span className="text-lg font-bold text-slate-200">{MOCK_DOCUMENTS.length}</span>
          </div>
          <div className="px-4 py-2 text-center">
            <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">SKUs</span>
            <span className="text-lg font-bold text-slate-200">{MOCK_PRODUCTS.length}</span>
          </div>
        </div>
      </div>

      {/* Main Action Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        <button
          onClick={() => setView(AppView.CHAT)}
          className="group relative overflow-hidden bg-brand-gradient p-10 rounded-[2.5rem] text-left text-brand-dark shadow-2xl shadow-brand-primary/20 transition-all hover:-translate-y-2"
        >
          <div className="absolute top-0 right-0 p-8 opacity-10 scale-150 rotate-12 transition-transform group-hover:rotate-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-32 h-32" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" /></svg>
          </div>
          <div className="w-14 h-14 bg-brand-dark/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
          </div>
          <h3 className="text-2xl font-bold mb-3">Chat de Engenharia</h3>
          <p className="text-brand-dark/80 text-sm leading-relaxed font-medium">Consulte dados complexos, especificações técnicas e faça comparações entre produtos usando linguagem natural.</p>
          <div className="mt-8 flex items-center gap-2 text-xs font-bold text-brand-dark uppercase tracking-widest group-hover:translate-x-2 transition-transform">
            Abrir Consulta <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
          </div>
        </button>

        <button
          onClick={() => setView(AppView.VOICE)}
          className="group bg-brand-dark/40 p-10 rounded-[2.5rem] text-left shadow-xl shadow-brand-primary/5 border border-white/5 backdrop-blur-md transition-all hover:-translate-y-2"
        >
          <div className="w-14 h-14 bg-brand-primary/10 text-brand-primary rounded-2xl flex items-center justify-center mb-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
          </div>
          <h3 className="text-2xl font-bold text-slate-100 mb-3">Voz em Campo</h3>
          <p className="text-slate-400 text-sm leading-relaxed">Assistente de voz inteligente para consulta mãos-livres durante manutenções e inspeções técnicas no chão de fábrica.</p>
          <div className="mt-8 flex items-center gap-2 text-xs font-bold text-brand-primary uppercase tracking-widest group-hover:translate-x-2 transition-transform">
            Ativar Assistente <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
          </div>
        </button>

        <button
          onClick={() => setView(AppView.ADMIN)}
          className="group bg-brand-dark/40 p-10 rounded-[2.5rem] text-left shadow-xl shadow-brand-primary/5 border border-white/5 backdrop-blur-md transition-all hover:-translate-y-2"
        >
          <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
          </div>
          <h3 className="text-2xl font-bold text-slate-100 mb-3">Administração</h3>
          <p className="text-slate-400 text-sm leading-relaxed">Gerencie sua base de conhecimento, adicione novos manuais e monitore a saúde da indexação da sua inteligência artificial.</p>
          <div className="mt-8 flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-widest group-hover:translate-x-2 transition-transform">
            Gestão de Base <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
          </div>
        </button>
      </div>

      {/* Highlights / Recently Viewed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-8">
            <h4 className="text-2xl font-bold text-slate-100 tracking-tight">Destaques do Catálogo</h4>
            <button className="text-brand-primary font-semibold text-sm hover:underline">Ver catálogo completo</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MOCK_PRODUCTS.length === 0 ? (
              <div className="col-span-2 bg-brand-dark/20 border-2 border-dashed border-white/10 rounded-[2.5rem] p-12 text-center">
                <div className="w-16 h-16 bg-brand-dark/40 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-500 border border-white/5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                </div>
                <h3 className="text-lg font-bold text-slate-200 mb-2">Seu catálogo está vazio</h3>
                <p className="text-slate-400 max-w-md mx-auto mb-6">Comece cadastrando seus produtos e manuais para alimentar a inteligência artificial.</p>
                <button
                  onClick={() => setView(AppView.REGISTER)}
                  className="px-8 py-4 bg-brand-gradient text-brand-dark font-bold rounded-2xl shadow-lg shadow-brand-primary/20 hover:scale-105 transition-all"
                >
                  Cadastrar Primeiro Produto
                </button>
              </div>
            ) : (
              MOCK_PRODUCTS.map((prod) => (
                <div key={prod.id} className="group bg-brand-dark/40 border border-white/5 rounded-[2rem] p-6 shadow-sm flex gap-6 transition-all hover:shadow-xl hover:shadow-brand-primary/5 hover:-translate-y-1 backdrop-blur-md">
                  <div className="w-32 h-32 rounded-2xl overflow-hidden bg-brand-dark/50 shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                    <img src={prod.imageUrl} alt={prod.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-bold text-brand-primary bg-brand-primary/10 px-2 py-1 rounded-md uppercase tracking-wider">{prod.category}</span>
                      {prod.isFavorite && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                      )}
                    </div>
                    <h5 className="font-bold text-slate-100 text-lg mt-2 group-hover:text-brand-primary transition-colors">{prod.name}</h5>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">{prod.description}</p>
                    <div className="mt-auto pt-4 flex gap-2">
                      {Object.entries(prod.specs).slice(0, 2).map(([k, v]) => (
                        <div key={k} className="bg-slate-50 px-2 py-1.5 rounded-lg border border-slate-100">
                          <span className="block text-[8px] font-bold text-slate-400 uppercase">{k}</span>
                          <span className="text-[11px] font-bold text-slate-700">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Sidebar: Activity/Indexing */}
        <div>
          <div className="bg-brand-dark/40 rounded-[2.5rem] p-8 shadow-2xl border border-white/5 backdrop-blur-md h-full">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-brand-primary/10 rounded-xl flex items-center justify-center text-brand-primary">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              </div>
              <h4 className="text-xl font-bold text-slate-100 tracking-tight">Saúde do Sistema</h4>
            </div>

            <div className="space-y-10">
              <div>
                <div className="flex justify-between items-end mb-3">
                  <div className="space-y-1">
                    <span className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Indexação RAG</span>
                    <span className="block text-[10px] text-brand-primary font-medium">Status: Base de dados sincronizada</span>
                  </div>
                  <span className="text-sm font-black text-brand-primary">100%</span>
                </div>
                <div className="h-3 w-full bg-brand-dark rounded-full overflow-hidden border border-white/5 p-0.5">
                  <div className="h-full bg-brand-gradient rounded-full w-[100%] shadow-[0_0_10px_rgba(0,210,189,0.3)]"></div>
                </div>
              </div>

              <div className="pt-8 border-t border-white/5">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Atividade Recente</span>
                  <span className="w-2 h-2 bg-brand-secondary rounded-full animate-ping"></span>
                </div>

                <div className="space-y-6">
                  <div className="text-center py-4">
                    <p className="text-[10px] text-slate-500 font-medium italic">Nenhuma atividade registrada ainda.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
