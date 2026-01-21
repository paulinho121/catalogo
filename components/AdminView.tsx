
import React, { useState } from 'react';
import { MOCK_DOCUMENTS } from '../constants';

export const AdminView: React.FC = () => {
  const [docs, setDocs] = useState(MOCK_DOCUMENTS);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newDoc = {
        id: Math.random().toString(),
        name: file.name,
        type: file.name.split('.').pop()?.toUpperCase() || 'FILE',
        size: (file.size / 1024 / 1024).toFixed(1) + ' MB',
        uploadDate: new Date(),
        status: 'processing' as const
      };
      setDocs([newDoc, ...docs]);

      // Simulate indexing completion
      setTimeout(() => {
        setDocs(prev => prev.map(d => d.id === newDoc.id ? { ...d, status: 'indexed' } : d));
      }, 3000);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Base de Conhecimento</h2>
          <p className="text-slate-400 text-sm">Gerencie os arquivos que alimentam a IA do seu catálogo.</p>
        </div>
        <label className="bg-brand-gradient text-brand-dark px-6 py-2.5 rounded-xl font-bold cursor-pointer hover:scale-105 transition-all flex items-center gap-2 shadow-lg shadow-brand-primary/20">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Upload de Catálogo
          <input type="file" className="hidden" onChange={handleFileUpload} accept=".pdf,.xlsx,.csv,.txt" />
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-brand-dark/40 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-white/5">
          <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total indexado</span>
          <p className="text-3xl font-bold text-slate-100 mt-1">128 MB</p>
          <div className="mt-4 h-1.5 w-full bg-brand-dark rounded-full overflow-hidden">
            <div className="h-full bg-brand-gradient w-3/4"></div>
          </div>
        </div>
        <div className="bg-brand-dark/40 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-white/5">
          <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Consultas (30d)</span>
          <p className="text-3xl font-bold text-slate-100 mt-1">2.4k</p>
          <p className="text-brand-secondary text-xs font-medium mt-2 flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" /></svg>
            +14% vs mês anterior
          </p>
        </div>
        <div className="bg-brand-dark/40 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-white/5">
          <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Taxa de Acerto RAG</span>
          <p className="text-3xl font-bold text-slate-100 mt-1">98.2%</p>
          <p className="text-slate-500 text-xs mt-2 italic">Baseado em feedback do usuário</p>
        </div>
      </div>

      <div className="bg-brand-dark/40 backdrop-blur-md rounded-2xl shadow-sm border border-white/5 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5 border-b border-white/10">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Arquivo</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Tamanho</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Data</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {docs.map((doc) => (
              <tr key={doc.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-brand-primary/10 text-brand-primary rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1.001.293l5.414 5.414a1 1.001.293.707V19a2 2 0 01-2 2z" /></svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-200">{doc.name}</p>
                      <p className="text-[10px] text-slate-500">{doc.type}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-400">{doc.size}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${doc.status === 'indexed' ? 'bg-brand-secondary/20 text-brand-secondary' : 'bg-brand-primary/20 text-brand-primary animate-pulse'
                    }`}>
                    {doc.status === 'indexed' ? 'Indexado' : 'Processando'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">{doc.uploadDate.toLocaleDateString()}</td>
                <td className="px-6 py-4 text-right">
                  <button className="text-slate-400 hover:text-red-500 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
