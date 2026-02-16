"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Settings, Save, Zap, Database, Globe, Sliders } from "lucide-react";
import { api } from "@/lib/api";

export default function SystemConfigPage() {
    const [config, setConfig] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchConfig();
    }, []);

    const fetchConfig = () => {
        setLoading(true);
        api.get("/admin/system-config")
            .then(res => res.json())
            .then(data => setConfig(data))
            .finally(() => setLoading(false));
    };

    const handleSave = async () => {
        setSaving(true);
        const payload = config.reduce((acc, curr) => ({ ...acc, [curr.config_key]: curr.config_value }), {});
        try {
            await api.post("/admin/system-config", payload);
            fetchConfig();
        } catch (err) {
            console.error("Failed to save config", err);
        } finally {
            setSaving(false);
        }
    };

    const updateValue = (key: string, val: string) => {
        setConfig(prev => prev.map(c => c.config_key === key ? { ...c, config_value: val } : c));
    };

    if (loading) return <div className="p-20 text-center animate-pulse font-black uppercase text-black/20">Loading System Core...</div>;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter uppercase italic">System Configuration</h1>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-black/20 mt-1">Global Platform Governance</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-8 py-4 bg-black text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:shadow-2xl transition-all disabled:opacity-50"
                >
                    {saving ? "Deploying..." : <><Save size={16} /> Save Changes</>}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Feature Toggles */}
                <div className="bg-white border border-black/5 p-8 rounded-[2.5rem] shadow-xl space-y-6">
                    <h3 className="text-xs font-black uppercase tracking-widest border-b border-black/5 pb-4 flex items-center gap-2">
                        <Zap size={16} /> Feature Intelligence
                    </h3>
                    <div className="space-y-6">
                        {[
                            { key: 'enable_vehicle', label: "Vehicle Numerology", desc: "Enable/Disable across entire platform" },
                            { key: 'enable_business', label: "Business Numerology", desc: "Enable/Disable across entire platform" },
                            { key: 'enable_ai', label: "AI Suggestions", desc: "Enable Gemini-powered name suggestions" },
                            { key: 'enable_pdf', label: "PDF Reports", desc: "Allow vendors to export results" },
                        ].map(feature => (
                            <div key={feature.key} className="flex items-center justify-between p-4 bg-[#FAF7F2] rounded-2xl">
                                <div>
                                    <p className="text-sm font-black uppercase tracking-tight">{feature.label}</p>
                                    <p className="text-[9px] font-bold text-black/30 uppercase">{feature.desc}</p>
                                </div>
                                <button
                                    onClick={() => updateValue(feature.key, config.find(c => c.config_key === feature.key)?.config_value === 'true' ? 'false' : 'true')}
                                    className={`w-12 h-6 rounded-full p-1 transition-colors ${config.find(c => c.config_key === feature.key)?.config_value === 'true' ? 'bg-[#10B981]' : 'bg-black/10'}`}
                                >
                                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${config.find(c => c.config_key === feature.key)?.config_value === 'true' ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Calculation Rules */}
                <div className="bg-white border border-black/5 p-8 rounded-[2.5rem] shadow-xl space-y-6">
                    <h3 className="text-xs font-black uppercase tracking-widest border-b border-black/5 pb-4 flex items-center gap-2">
                        <Database size={16} /> Mappings & Formulas
                    </h3>
                    <div className="space-y-6">
                        <div>
                            <p className="text-xs font-black uppercase tracking-tighter mb-2">Chaldean Mappings (JSON)</p>
                            <textarea
                                value={config.find(c => c.config_key === 'chaldean_map')?.config_value || ''}
                                onChange={(e) => updateValue('chaldean_map', e.target.value)}
                                className="w-full h-32 bg-[#FAF7F2] border border-black/5 rounded-2xl p-4 text-[10px] font-bold font-mono outline-none focus:border-[#10B981]"
                            />
                        </div>
                        <div>
                            <p className="text-xs font-black uppercase tracking-tighter mb-2">Pythagorean Mappings (JSON)</p>
                            <textarea
                                value={config.find(c => c.config_key === 'pythagorean_map')?.config_value || ''}
                                onChange={(e) => updateValue('pythagorean_map', e.target.value)}
                                className="w-full h-32 bg-[#FAF7F2] border border-black/5 rounded-2xl p-4 text-[10px] font-bold font-mono outline-none focus:border-[#10B981]"
                            />
                        </div>
                    </div>
                </div>

                {/* Trial & Limits */}
                <div className="bg-white border border-black/5 p-8 rounded-[2.5rem] shadow-xl space-y-6">
                    <h3 className="text-xs font-black uppercase tracking-widest border-b border-black/5 pb-4 flex items-center gap-2">
                        <Sliders size={16} /> Platform Constraints
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-[9px] font-black uppercase tracking-widest text-black/30 mb-1">Trial Days</p>
                            <input
                                type="number"
                                value={config.find(c => c.config_key === 'trial_days')?.config_value || 7}
                                onChange={(e) => updateValue('trial_days', e.target.value)}
                                className="w-full bg-[#FAF7F2] border border-black/5 rounded-xl px-4 py-3 font-bold"
                            />
                        </div>
                        <div>
                            <p className="text-[9px] font-black uppercase tracking-widest text-black/30 mb-1">Trial Client Limit</p>
                            <input
                                type="number"
                                value={config.find(c => c.config_key === 'trial_limit')?.config_value || 5}
                                onChange={(e) => updateValue('trial_limit', e.target.value)}
                                className="w-full bg-[#FAF7F2] border border-black/5 rounded-xl px-4 py-3 font-bold"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
