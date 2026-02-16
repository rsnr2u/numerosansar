"use client";

import { useState, useEffect } from "react";
import { Save, Sparkles, Key, AlertCircle, Cpu, CheckCircle2, Circle } from "lucide-react";
import { api } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";

export default function AISettings() {
    const [settings, setSettings] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<'gemini' | 'openai'>('gemini');
    const [showKey, setShowKey] = useState<Record<string, boolean>>({});

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await api.get("/admin/ai/settings");
            const data = await res.json();

            // Transform array to object { gemini: {...}, openai: {...} }
            const settingsObj: any = {};
            if (Array.isArray(data)) {
                data.forEach((item: any) => {
                    settingsObj[item.provider_name] = item;
                });
            }

            setSettings(settingsObj);

            // Set active tab based on which one is active in DB
            if (settingsObj.openai?.is_active) {
                setActiveTab('openai');
            } else if (settingsObj.gemini?.is_active) {
                setActiveTab('gemini');
            }
        } catch (e) {
            console.error("Failed to fetch AI settings", e);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // Transform object back to array for backend
            const payload = Object.values(settings);
            const res = await api.post("/admin/ai/settings", payload);
            if (res.ok) {
                alert("AI Configuration updated successfully!");
                fetchSettings(); // Refresh to ensure state consistency
            } else {
                alert("Failed to save settings");
            }
        } catch (e) {
            console.error(e);
            alert("Error saving settings");
        } finally {
            setIsSaving(false);
        }
    };

    const handleChange = (provider: string, key: string, value: any) => {
        setSettings({
            ...settings,
            [provider]: {
                ...settings[provider],
                [key]: value
            }
        });
    };

    const toggleActive = (provider: string) => {
        const newSettings = { ...settings };
        Object.keys(newSettings).forEach(p => {
            if (newSettings[p]) {
                newSettings[p] = {
                    ...newSettings[p],
                    is_active: (p === provider)
                };
            }
        });
        setSettings(newSettings);
    };

    const toggleKeyVisibility = (provider: string) => {
        setShowKey(prev => ({ ...prev, [provider]: !prev[provider] }));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    const currentProvider = settings[activeTab] || { api_key: '', is_active: false, model_name: '' };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto space-y-8"
        >
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
                        <Sparkles size={24} className="text-accent" /> AI Configuration
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm">Manage your AI providers and choosing the active engine.</p>
                </div>
            </div>

            {/* Provider Tabs */}
            <div className="flex p-1 bg-muted/30 backdrop-blur-md border border-border rounded-2xl w-fit">
                <button
                    onClick={() => setActiveTab('gemini')}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl transition-all font-bold text-sm ${activeTab === 'gemini'
                        ? "bg-card text-primary shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        }`}
                >
                    <Sparkles size={16} />
                    Google Gemini
                    {settings.gemini?.is_active && <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse ml-1" />}
                </button>
                <button
                    onClick={() => setActiveTab('openai')}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl transition-all font-bold text-sm ${activeTab === 'openai'
                        ? "bg-card text-secondary shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        }`}
                >
                    <Cpu size={16} />
                    OpenAI
                    {(settings.openai?.is_active && !settings.gemini?.is_active) && <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse ml-1" />}
                </button>
            </div>

            <div className="bg-card/50 backdrop-blur-xl border border-border p-8 rounded-[2.5rem] shadow-2xl space-y-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    {activeTab === 'gemini' ? <Sparkles size={120} /> : <Cpu size={120} />}
                </div>

                <div className="space-y-6 relative z-10">
                    <div className="flex items-start justify-between">
                        <div>
                            <h2 className="text-xl font-bold flex items-center gap-2 capitalize">
                                <Key size={20} className="text-primary" /> {activeTab} Settings
                            </h2>
                            <p className="text-sm text-muted-foreground mt-1">
                                Configure your {activeTab === 'gemini' ? 'Google Gemini' : 'OpenAI'} credentials.
                            </p>
                        </div>

                        <button
                            onClick={() => toggleActive(activeTab)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all text-xs font-black uppercase tracking-tighter ${currentProvider.is_active
                                ? "bg-green-500/10 border-green-500/20 text-green-500"
                                : "bg-muted/50 border-border text-muted-foreground hover:border-primary hover:text-primary"
                                }`}
                        >
                            {currentProvider.is_active ? <CheckCircle2 size={14} /> : <Circle size={14} />}
                            {currentProvider.is_active ? "Active" : "Set as Active"}
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-accent/5 border border-accent/10 rounded-2xl p-4 flex gap-3 text-sm text-accent leading-relaxed">
                            <AlertCircle className="shrink-0 mt-0.5" size={18} />
                            <p>
                                {activeTab === 'gemini'
                                    ? "Your Gemini key is used for creative suggestions. Ensure you have the 'Gemini-1.5-Flash' or similar model access."
                                    : "OpenAI provides high-quality insights. GPT-3.5 or GPT-4 models are supported."
                                }
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest text-muted-foreground font-black ml-1">
                                    API Key
                                </label>
                                <div className="relative group">
                                    <input
                                        type={showKey[activeTab] ? "text" : "password"}
                                        value={currentProvider.api_key || ''}
                                        onChange={(e) => handleChange(activeTab, 'api_key', e.target.value)}
                                        placeholder={`Enter ${activeTab} key...`}
                                        className="w-full bg-background/50 border border-border rounded-2xl p-4 pl-12 pr-12 outline-none text-foreground focus:border-primary transition-all font-mono text-sm"
                                    />
                                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                    <button
                                        onClick={() => toggleKeyVisibility(activeTab)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                                        type="button"
                                    >
                                        {showKey[activeTab] ? "Hide" : "Show"}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest text-muted-foreground font-black ml-1">
                                    Model ID
                                </label>
                                <div className="relative group">
                                    <input
                                        type="text"
                                        value={currentProvider.model_name || ''}
                                        onChange={(e) => handleChange(activeTab, 'model_name', e.target.value)}
                                        placeholder="e.g. gpt-4 or gemini-1.5-flash"
                                        className="w-full bg-background/50 border border-border rounded-2xl p-4 pl-12 outline-none text-foreground focus:border-primary transition-all text-sm"
                                    />
                                    <Cpu className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex items-center justify-between border-t border-border mt-8">
                        <div className="text-xs text-muted-foreground italic">
                            {currentProvider.is_active
                                ? "This provider will be used for all AI tasks."
                                : "Save changes to store credentials for this provider."}
                        </div>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className={`
                                bg-primary text-primary-foreground font-black px-10 py-4 rounded-2xl 
                                hover:bg-primary/90 transition-all flex items-center gap-3 shadow-lg hover:-translate-y-0.5
                                disabled:opacity-50 disabled:cursor-not-allowed
                            `}
                        >
                            {isSaving ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                            ) : (
                                <Save size={20} />
                            )}
                            {isSaving ? "Saving..." : "Save AI Configuration"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-card/30 border border-border p-6 rounded-3xl space-y-3">
                    <h3 className="font-bold flex items-center gap-2">
                        {activeTab === 'gemini' ? "Google AI Studio" : "OpenAI Platform"}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        {activeTab === 'gemini'
                            ? "Get your FREE key from the Google AI Studio to unlock immediate suggestions."
                            : "Configure your billing and billing limits in OpenAI Dashboard for consistent service."}
                    </p>
                    <a
                        href={activeTab === 'gemini' ? "https://aistudio.google.com/app/apikey" : "https://platform.openai.com/api-keys"}
                        target="_blank"
                        className="text-primary hover:underline font-bold text-xs inline-flex items-center gap-1"
                    >
                        Visit Dashboard <Key size={12} />
                    </a>
                </div>
                <div className="bg-card/30 border border-border p-6 rounded-3xl space-y-3 flex flex-col justify-center">
                    <h3 className="font-bold">Status Check</h3>
                    <div className="flex items-center gap-4 mt-2">
                        <div className="flex flex-col">
                            <span className="text-[10px] uppercase font-black text-muted-foreground">Active Hub</span>
                            <span className="text-primary font-black uppercase text-sm tracking-widest">
                                {Object.keys(settings).find(p => settings[p].is_active) || 'None'}
                            </span>
                        </div>
                        <div className="w-px h-8 bg-border" />
                        <div className="flex flex-col">
                            <span className="text-[10px] uppercase font-black text-muted-foreground">Encryption</span>
                            <span className="text-green-500 font-black uppercase text-sm tracking-widest">AES-256</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
