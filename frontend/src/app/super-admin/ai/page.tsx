"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BrainCircuit, Save, Zap, ExternalLink, ShieldCheck, ShieldAlert, Sparkles, RefreshCw, Key, Eye, EyeOff } from "lucide-react";
import { api } from "@/lib/api";

export default function AISettingsPage() {
    const [configs, setConfigs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [visibleKeys, setVisibleKeys] = useState<string[]>([]);

    useEffect(() => {
        fetchConfigs();
    }, []);

    const fetchConfigs = () => {
        setLoading(true);
        api.get("/admin/ai/settings")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    // Ensure we have both gemini and openai in state even if not in DB
                    const providers = ['gemini', 'openai'];
                    const existing = data.map(c => c.provider_name);
                    const missing = providers.filter(p => !existing.includes(p));

                    const fullConfigs = [
                        ...data,
                        ...missing.map(p => ({
                            provider_name: p,
                            api_key: '',
                            model_name: p === 'gemini' ? 'gemini-2.0-flash' : 'gpt-3.5-turbo',
                            is_active: 0
                        }))
                    ];
                    setConfigs(fullConfigs);
                }
            })
            .finally(() => setLoading(false));
    };

    const toggleKeyVisibility = (provider: string) => {
        setVisibleKeys(prev => prev.includes(provider) ? prev.filter(p => p !== provider) : [...prev, provider]);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.post("/admin/ai/settings", configs);
            fetchConfigs();
        } catch (err) {
            console.error("Failed to save AI config", err);
        } finally {
            setSaving(false);
        }
    };

    const updateConfig = (provider: string, field: string, value: any) => {
        setConfigs(prev => prev.map(c => {
            if (c.provider_name === provider) {
                return { ...c, [field]: value };
            }
            // If another provider is set to active, deactivate this one
            if (field === 'is_active' && (value === 1 || value === true)) {
                return { ...c, is_active: 0 };
            }
            return c;
        }));
    };

    if (loading) return <div className="p-20 text-center animate-pulse font-black uppercase text-black/20">Booting Neural Network...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter uppercase italic">AI Intelligence</h1>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-black/20 mt-1">Cognitive Processing & Suggestion Protocol</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-xl font-black uppercase text-[10px] tracking-widest hover:shadow-2xl transition-all disabled:opacity-50"
                >
                    {saving ? "Rewiring..." : <><Save size={16} /> Update Configurations</>}
                </button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {configs.map((config) => (
                    <div
                        key={config.provider_name}
                        className={`bg-white border-2 transition-all p-6 rounded-xl shadow-xl relative overflow-hidden flex flex-col ${config.is_active ? 'border-black ring-4 ring-black/5 bg-slate-50' : 'border-black/5 opacity-60 hover:opacity-100'}`}
                    >
                        {config.is_active && (
                            <div className="absolute top-0 right-0 p-4">
                                <div className="bg-green-500 text-white text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full shadow-lg">Active Provider</div>
                            </div>
                        )}

                        <div className="flex items-center gap-4 mb-8">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${config.provider_name === 'gemini' ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'}`}>
                                {config.provider_name === 'gemini' ? <Sparkles size={24} /> : <Zap size={24} />}
                            </div>
                            <div>
                                <h3 className="text-xl font-black uppercase tracking-tight italic capitalize">{config.provider_name}</h3>
                                <p className="text-[9px] font-bold text-black/30 uppercase tracking-widest">Provider Infrastructure</p>
                            </div>
                        </div>

                        <div className="space-y-6 flex-1">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1">API Endpoint Protocol</label>
                                <div className="flex items-center gap-2 px-4 py-3 bg-[#FAF7F2] rounded-xl border border-black/5">
                                    <Key className="text-black/20" size={16} />
                                    <input
                                        type={visibleKeys.includes(config.provider_name) ? "text" : "password"}
                                        placeholder="Enter secure API Key"
                                        value={config.api_key || ''}
                                        onChange={(e) => updateConfig(config.provider_name, 'api_key', e.target.value)}
                                        className="bg-transparent border-none outline-none w-full text-xs font-bold"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => toggleKeyVisibility(config.provider_name)}
                                        className="text-black/30 hover:text-black transition-colors"
                                    >
                                        {visibleKeys.includes(config.provider_name) ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1">Model Architecture</label>
                                <div className="flex items-center gap-2 px-4 py-3 bg-[#FAF7F2] rounded-xl border border-black/5">
                                    <RefreshCw className="text-black/20" size={16} />
                                    <input
                                        type="text"
                                        placeholder="e.g. gemini-2.0-flash"
                                        value={config.model_name || ''}
                                        onChange={(e) => updateConfig(config.provider_name, 'model_name', e.target.value)}
                                        className="bg-transparent border-none outline-none w-full text-xs font-bold"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-black/5 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${config.api_key ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                <span className="text-[9px] font-black uppercase tracking-widest text-black/40">
                                    {config.api_key ? 'Key Configured' : 'Missing Key'}
                                </span>
                            </div>
                            <button
                                onClick={() => updateConfig(config.provider_name, 'is_active', 1)}
                                disabled={config.is_active}
                                className={`px-5 py-2 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] transition-all ${config.is_active ? 'bg-black/5 text-black/20 cursor-not-allowed' : 'bg-[#FAF7F2] text-black hover:bg-black hover:text-white'}`}
                            >
                                {config.is_active ? 'Already Active' : 'Switch to Provider'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Access / Documentation */}
            <div className="bg-[#FAF7F2] border-2 border-black/5 p-6 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-black/40 shadow-sm border border-black/5">
                        <BrainCircuit size={20} />
                    </div>
                    <div>
                        <p className="text-xs font-black uppercase tracking-tight">Need a Gemini API Key?</p>
                        <p className="text-[9px] font-bold text-black/40 uppercase tracking-widest">Generative Language API is required for this module</p>
                    </div>
                </div>
                <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    className="flex items-center gap-2 px-4 py-2 text-[9px] font-black uppercase tracking-widest text-black/60 hover:text-black transition-colors"
                >
                    Get Key <ExternalLink size={14} />
                </a>
            </div>
        </div>
    );
}
