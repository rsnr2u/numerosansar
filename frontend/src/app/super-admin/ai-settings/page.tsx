import { useState, useEffect } from "react";
import { Save, Sparkles, Key, AlertCircle, Cpu, CheckCircle2, Circle, ArrowLeft } from "lucide-react";
import { api } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function SuperAdminAISettings() {
    const [settings, setSettings] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<'gemini' | 'openai'>('gemini');
    const [showKey, setShowKey] = useState<Record<string, boolean>>({});
    const navigate = useNavigate();

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
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4B2E83]"></div>
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
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-3 bg-white rounded-xl border border-slate-100 text-slate-400 hover:text-[#4B2E83] hover:shadow-lg transition-all">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-4xl font-black tracking-tight text-slate-900 flex items-center gap-4">
                            System AI Core
                        </h1>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mt-1">Intelligence Protocol Management</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Provider Selector Sidebar */}
                <div className="lg:col-span-1 space-y-4">
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50 space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 px-2">Select Provider</p>
                        <button
                            onClick={() => setActiveTab('gemini')}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all font-bold text-sm ${activeTab === 'gemini'
                                ? "bg-[#4B2E83] text-white shadow-xl shadow-purple-900/20"
                                : "text-slate-600 hover:bg-slate-50"
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <Sparkles size={18} />
                                <span>Google Gemini</span>
                            </div>
                            {settings.gemini?.is_active && <div className="w-2 h-2 bg-green-400 rounded-full shadow-[0_0_8px_rgba(74,222,128,0.5)]" />}
                        </button>
                        <button
                            onClick={() => setActiveTab('openai')}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all font-bold text-sm ${activeTab === 'openai'
                                ? "bg-[#4B2E83] text-white shadow-xl shadow-purple-900/20"
                                : "text-slate-600 hover:bg-slate-50"
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <Cpu size={18} />
                                <span>OpenAI Service</span>
                            </div>
                            {settings.openai?.is_active && <div className="w-2 h-2 bg-green-400 rounded-full shadow-[0_0_8px_rgba(74,222,128,0.5)]" />}
                        </button>
                    </div>

                    <div className="bg-[#FAF7F2] p-6 rounded-2xl border border-black/5 space-y-4">
                        <div className="flex items-center gap-2 text-primary font-black uppercase text-[10px] tracking-widest">
                            <AlertCircle size={14} /> Global Status
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-xs">
                                <span className="font-bold text-slate-400">Active Lab</span>
                                <span className="font-black text-slate-900 uppercase">{Object.keys(settings).find(p => settings[p].is_active) || 'Disconnected'}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="font-bold text-slate-400">Encryption</span>
                                <span className="font-black text-green-600 uppercase">AES-256 AES-RSA</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Configuration Area */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50 space-y-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
                            {activeTab === 'gemini' ? <Sparkles size={200} /> : <Cpu size={200} />}
                        </div>

                        <div className="flex items-center justify-between relative z-10">
                            <div className="space-y-1">
                                <h3 className="text-xl font-black text-slate-900 tracking-tight capitalize">{activeTab} Integration</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Provider Key & Logic Model</p>
                            </div>
                            <button
                                onClick={() => toggleActive(activeTab)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all text-[10px] font-black uppercase tracking-widest ${currentProvider.is_active
                                    ? "bg-green-500/10 border-green-500/20 text-green-600"
                                    : "bg-slate-50 border-slate-100 text-slate-400 hover:border-[#4B2E83] hover:text-[#4B2E83]"
                                    }`}
                            >
                                {currentProvider.is_active ? <CheckCircle2 size={14} /> : <Circle size={14} />}
                                {currentProvider.is_active ? "Main Engine" : "Set Main"}
                            </button>
                        </div>

                        <div className="space-y-6 relative z-10">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Authentication Key</label>
                                <div className="relative group">
                                    <input
                                        type={showKey[activeTab] ? "text" : "password"}
                                        value={currentProvider.api_key || ''}
                                        onChange={(e) => handleChange(activeTab, 'api_key', e.target.value)}
                                        placeholder={`Enter ${activeTab} Authorization Key...`}
                                        className="w-full bg-[#FAF7F2] border border-black/5 rounded-xl p-4 pl-12 pr-12 outline-none text-slate-900 focus:border-[#4B2E83] transition-all font-mono text-xs"
                                    />
                                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#4B2E83] transition-colors" size={18} />
                                    <button
                                        onClick={() => toggleKeyVisibility(activeTab)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-900 transition-colors p-1"
                                        type="button"
                                    >
                                        {showKey[activeTab] ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Deploy Model ID</label>
                                <div className="relative group">
                                    <input
                                        type="text"
                                        value={currentProvider.model_name || ''}
                                        onChange={(e) => handleChange(activeTab, 'model_name', e.target.value)}
                                        placeholder="e.g. gpt-4-turbo or gemini-1.5-flash-latest"
                                        className="w-full bg-[#FAF7F2] border border-black/5 rounded-xl p-4 pl-12 outline-none text-slate-900 focus:border-[#4B2E83] transition-all text-xs font-bold"
                                    />
                                    <Cpu className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#4B2E83] transition-colors" size={18} />
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-100 mt-10 flex items-center justify-between relative z-10">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{activeTab} Endpoint</span>
                                <span className="text-[9px] font-bold text-slate-300 truncate max-w-[200px]">
                                    {activeTab === 'gemini' ? 'generativelanguage.googleapis.com' : 'api.openai.com/v1'}
                                </span>
                            </div>
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className={`
                                    bg-[#4B2E83] text-white font-black px-10 py-4 rounded-xl 
                                    hover:bg-[#5D3AB0] hover:shadow-2xl hover:shadow-purple-900/20 transition-all 
                                    flex items-center gap-3 text-[10px] uppercase tracking-widest
                                    disabled:opacity-50 disabled:cursor-not-allowed active:scale-95
                                `}
                            >
                                {isSaving ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
                                ) : (
                                    <Save size={16} />
                                )}
                                {isSaving ? "Syncing..." : "Sync Configuration"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

// Sub-components as needed (icons already imported)
function Eye({ size }: { size: number }) { return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>; }
function EyeOff({ size }: { size: number }) { return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path><path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path><line x1="2" y1="2" x2="22" y2="22"></line></svg>; }
