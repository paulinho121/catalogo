
import React, { useState } from 'react';

import { azureService } from '../services/azureService';

export const RegisterView: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        manufacturer: '',
        sku: '',
        category: '',
        description: '',
        ragContext: '',
        imageUrl: ''
    });

    const [dragActive, setDragActive] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        if (!formData.name || !formData.sku) {
            alert('Por favor, preencha pelo menos Nome e SKU.');
            return;
        }

        setIsSaving(true);
        try {
            await azureService.saveProduct(formData);
            alert('Produto salvo com sucesso no Azure!');
            setFormData({
                name: '',
                manufacturer: '',
                sku: '',
                category: '',
                description: '',
                ragContext: ''
            });
        } catch (error) {
            alert('Erro ao salvar produto. Verifique o console.');
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleAutoSearch = async () => {
        if (!formData.name) return;

        setIsSearching(true);
        // Simulating an AI search process
        await new Promise(resolve => setTimeout(resolve, 2000));

        const mockEnrichedData = `
[AUTO-GENERATED CONTEXT FROM WEB SEARCH]
Produto: ${formData.name}
Fabricante: ${formData.manufacturer || 'Não identificado'}

Especificações Técnicas Encontradas:
- Tensão Nominal: 220/380V (Estimado)
- Frequência: 60Hz
- Grau de Proteção: IP55
- Material da Carcaça: Ferro Fundido
- Aplicações Típicas: Indústria geral, bombeamento, ventilação.

Manuais Referenciados:
1. Manual Técnico Geral - ${formData.manufacturer || 'General'} Series
2. Guia de Instalação e Manutenção

Nota: Estes dados foram agregados automaticamente da web e devem ser validados.
`;

        setFormData(prev => ({
            ...prev,
            ragContext: prev.ragContext ? prev.ragContext + '\n' + mockEnrichedData : mockEnrichedData
        }));
        setIsSearching(false);
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            await handleImageUpload(e.dataTransfer.files[0]);
        }
    };

    const handleImageUpload = async (file: File) => {
        try {
            // Optimistic update or loading state could be added here
            const imageUrl = await azureService.uploadFile(file, 'image');
            console.log("Image uploaded:", imageUrl);
            // We'll store the URL (or mock URL) in the description for now, 
            // but ideally we should add an 'imageUrl' field to the formData state.
            // For this prototype, let's append it to description or just log it.
            // A better approach is to extend formData.
            setFormData(prev => ({ ...prev, imageUrl: imageUrl }));
        } catch (error) {
            console.error("Upload failed", error);
            alert("Erro ao enviar imagem.");
        }
    };

    // Extend formData type implicitly by initializing it correctly or using 'any' for quick prototype
    // For TypeScript correctness in a strict env, we should update the interface, but here we can just add the property dynamically or update initial state.


    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8 animate-fade-in-up pb-24">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Cadastro de Novo Ativo</h2>
                    <p className="text-slate-500 mt-1">Registre produtos e alimente a base de conhecimento da IA.</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-all">
                        Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className={`px-5 py-2.5 rounded-xl bg-blue-600 text-white font-medium shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-blue-300 transition-all transform hover:-translate-y-0.5 flex items-center gap-2 ${isSaving ? 'opacity-70 cursor-wait' : ''}`}
                    >
                        {isSaving ? 'Salvando...' : 'Salvar Produto'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Image & Basic Identifiers */}
                <div className="space-y-6">
                    {/* Image Upload Card */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                        <h3 className="text-lg font-semibold text-slate-800 mb-4">Imagem do Produto</h3>
                        <div
                            className={`border-2 border-dashed rounded-xl h-64 flex flex-col items-center justify-center p-4 transition-all relative overflow-hidden ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'}`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                        >
                            {formData.imageUrl ? (
                                <img src={formData.imageUrl} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                            ) : (
                                <>
                                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    </div>
                                    <p className="text-sm text-slate-500 text-center font-medium">Arraste e solte ou clique para upload</p>
                                    <p className="text-xs text-slate-400 mt-2 text-center">PNG, JPG até 5MB</p>
                                    <input
                                        type="file"
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        accept="image/*"
                                        onChange={(e) => e.target.files && e.target.files[0] && handleImageUpload(e.target.files[0])}
                                    />
                                </>
                            )}
                        </div>
                    </div>

                    {/* SKU & Status */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">SKU / Código</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="text-slate-400">#</span>
                                </div>
                                <input
                                    type="text"
                                    name="sku"
                                    placeholder="EX: MTR-2024-X"
                                    className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
                                    value={formData.sku}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Visibilidade</label>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <div className="w-5 h-5 rounded-full border border-slate-300 flex items-center justify-center peer-checked:border-blue-500 peer-checked:bg-blue-500">
                                        <div className="w-2.5 h-2.5 bg-blue-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    </div>
                                    <span className="text-sm text-slate-600">Público</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Main Info & RAG */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Main Info Card */}
                    <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
                        <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            Informações Principais
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Nome do Produto</label>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Ex: Motor de Indução Trifásico Serve-X"
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Fabricante</label>
                                <input
                                    type="text"
                                    name="manufacturer"
                                    placeholder="Ex: Siemens, WEG..."
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    value={formData.manufacturer}
                                    onChange={handleChange}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Categoria</label>
                                <select
                                    name="category"
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-600"
                                    value={formData.category}
                                    onChange={handleChange}
                                >
                                    <option value="">Selecione...</option>
                                    <option value="motores">Motores Elétricos</option>
                                    <option value="bombas">Bombas Hidráulicas</option>
                                    <option value="valvulas">Válvulas Industriais</option>
                                    <option value="sensores">Sensores e Automação</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Descrição Comercial</label>
                            <textarea
                                name="description"
                                rows={4}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                                placeholder="Descreva as principais características para exibição no catálogo..."
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* RAG Context Section - The "Brain" */}
                    <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 shadow-lg text-white">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-32 h-32" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                        </div>

                        <div className="relative z-10">
                            <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.5)]"></span>
                                RAG Data & Contexto Técnico
                            </h3>
                            <p className="text-slate-300 text-sm mb-6 max-w-lg">
                                Este conteúdo será indexado vetorialmente. A IA usará estas informações para responder perguntas técnicas profundas sobre o produto.
                            </p>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Dados Técnicos Brutos (Manuais, Specs)</label>
                                    <textarea
                                        name="ragContext"
                                        rows={6}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-200 placeholder:text-slate-500 font-mono text-sm leading-relaxed"
                                        placeholder="Cole aqui especificações técnicas, trechos de manuais ou tabelas de dados..."
                                        value={formData.ragContext}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="flex items-center gap-4 pt-2 flex-wrap">
                                    <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors border border-white/5">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                                        Anexar PDF Técnico
                                    </button>

                                    <button
                                        onClick={handleAutoSearch}
                                        disabled={!formData.name || isSearching}
                                        className={`flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 rounded-lg text-sm font-medium transition-all border border-blue-500/20 ${(!formData.name || isSearching) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        {isSearching ? (
                                            <>
                                                <svg className="animate-spin h-4 w-4 text-blue-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Buscando na Web...
                                            </>
                                        ) : (
                                            <>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                                                Auto-Completar com IA
                                            </>
                                        )}
                                    </button>

                                    <span className="text-xs text-slate-500 ml-auto hidden sm:block">A IA processa PDFs e Links automaticamente.</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};
