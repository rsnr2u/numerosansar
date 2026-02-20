"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Settings, Save, Zap, Database, Globe, Sliders, Code, CreditCard, Wallet, Eye, EyeOff } from "lucide-react";
import { api } from "@/lib/api";

export default function SystemConfigPage() {
    const [config, setConfig] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [visibleFields, setVisibleFields] = useState<string[]>([]);

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
        setConfig(prev => {
            const exists = prev.some(c => c.config_key === key);
            if (exists) {
                return prev.map(c => c.config_key === key ? { ...c, config_value: val } : c);
            }
            return [...prev, { config_key: key, config_value: val }];
        });
    };

    const toggleVisibility = (key: string) => {
        setVisibleFields(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
    };

    if (loading) return <div className="p-20 text-center animate-pulse font-black uppercase text-black/20">Loading System Core...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter uppercase italic">System Configuration</h1>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-black/20 mt-1">Global Governance & Mapping Protocol</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-xl font-black uppercase text-[10px] tracking-widest hover:shadow-2xl transition-all disabled:opacity-50"
                >
                    {saving ? "Deploying..." : <><Save size={16} /> Save Changes</>}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Feature Toggles */}
                <div className="bg-white border border-black/5 p-6 rounded-2xl shadow-xl space-y-6">
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
                            <div key={feature.key} className="flex items-center justify-between p-3 bg-[#FAF7F2] rounded-xl">
                                <div>
                                    <p className="text-sm font-black uppercase tracking-tight">{feature.label}</p>
                                    <p className="text-[9px] font-bold text-black/30 uppercase">{feature.desc}</p>
                                </div>
                                <button
                                    onClick={() => {
                                        const current = config.find(c => c.config_key === feature.key)?.config_value;
                                        updateValue(feature.key, current === 'true' ? 'false' : 'true');
                                    }}
                                    className={`w-12 h-6 rounded-full p-1 transition-colors ${config.find(c => c.config_key === feature.key)?.config_value === 'true' ? 'bg-[#10B981]' : 'bg-black/10'}`}
                                >
                                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${config.find(c => c.config_key === feature.key)?.config_value === 'true' ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Calculation Rules */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center shadow-lg"><Code size={18} /></div>
                            <h3 className="text-xl font-black uppercase tracking-tight italic">Calculation Rules</h3>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <p className="text-xs font-black uppercase tracking-tighter mb-2">Chaldean Mappings (JSON)</p>
                            <textarea
                                value={config.find(c => c.config_key === 'chaldean_map')?.config_value || ''}
                                onChange={(e) => updateValue('chaldean_map', e.target.value)}
                                className="w-full h-32 bg-[#FAF7F2] border border-black/5 rounded-xl p-4 text-[10px] font-bold font-mono outline-none focus:border-[#10B981]"
                            />
                        </div>
                        <div>
                            <p className="text-xs font-black uppercase tracking-tighter mb-2">Pythagorean Mappings (JSON)</p>
                            <textarea
                                value={config.find(c => c.config_key === 'pythagorean_map')?.config_value || ''}
                                onChange={(e) => updateValue('pythagorean_map', e.target.value)}
                                className="w-full h-32 bg-[#FAF7F2] border border-black/5 rounded-xl p-4 text-[10px] font-bold font-mono outline-none focus:border-[#10B981]"
                            />
                        </div>
                    </div>
                </div>

                {/* Trial & Limits */}
                <div className="bg-white border border-black/5 p-8 rounded-2xl shadow-xl space-y-6">
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

                {/* Financial Gateways */}
                <div className="bg-white border border-black/5 p-6 rounded-2xl shadow-xl space-y-6">
                    <h3 className="text-xs font-black uppercase tracking-widest border-b border-black/5 pb-4 flex items-center gap-2">
                        <CreditCard size={16} /> Financial Gateways
                    </h3>

                    <div className="space-y-8">
                        {/* Razorpay */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center font-black text-[10px]">RZ</div>
                                    <span className="text-sm font-black uppercase tracking-tight">Razorpay</span>
                                </div>
                                <button
                                    onClick={() => updateValue('enable_razorpay', config.find(c => c.config_key === 'enable_razorpay')?.config_value === 'true' ? 'false' : 'true')}
                                    className={`w-10 h-5 rounded-full p-1 transition-colors ${config.find(c => c.config_key === 'enable_razorpay')?.config_value === 'true' ? 'bg-[#10B981]' : 'bg-black/10'}`}
                                >
                                    <div className={`w-3 h-3 bg-white rounded-full transition-transform ${config.find(c => c.config_key === 'enable_razorpay')?.config_value === 'true' ? 'translate-x-5' : 'translate-x-0'}`}></div>
                                </button>
                            </div>
                            <div className="grid grid-cols-1 gap-3 pl-10">
                                <input
                                    type="text"
                                    placeholder="Key ID"
                                    value={config.find(c => c.config_key === 'razorpay_key_id')?.config_value || ''}
                                    onChange={(e) => updateValue('razorpay_key_id', e.target.value)}
                                    className="w-full bg-[#FAF7F2] border border-black/5 rounded-xl px-4 py-2.5 text-xs font-bold"
                                />
                                <div className="relative">
                                    <input
                                        type={visibleFields.includes('razorpay_key_secret') ? "text" : "password"}
                                        placeholder="Key Secret"
                                        value={config.find(c => c.config_key === 'razorpay_key_secret')?.config_value || ''}
                                        onChange={(e) => updateValue('razorpay_key_secret', e.target.value)}
                                        className="w-full bg-[#FAF7F2] border border-black/5 rounded-xl px-4 py-2.5 text-xs font-bold pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => toggleVisibility('razorpay_key_secret')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-black/20 hover:text-black transition-colors"
                                    >
                                        {visibleFields.includes('razorpay_key_secret') ? <EyeOff size={14} /> : <Eye size={14} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* PhonePe */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center font-black text-[10px]">PP</div>
                                    <span className="text-sm font-black uppercase tracking-tight">PhonePe</span>
                                </div>
                                <button
                                    onClick={() => updateValue('enable_phonepe', config.find(c => c.config_key === 'enable_phonepe')?.config_value === 'true' ? 'false' : 'true')}
                                    className={`w-10 h-5 rounded-full p-1 transition-colors ${config.find(c => c.config_key === 'enable_phonepe')?.config_value === 'true' ? 'bg-[#10B981]' : 'bg-black/10'}`}
                                >
                                    <div className={`w-3 h-3 bg-white rounded-full transition-transform ${config.find(c => c.config_key === 'enable_phonepe')?.config_value === 'true' ? 'translate-x-5' : 'translate-x-0'}`}></div>
                                </button>
                            </div>
                            <div className="grid grid-cols-1 gap-3 pl-10">
                                <input
                                    type="text"
                                    placeholder="Merchant ID"
                                    value={config.find(c => c.config_key === 'phonepe_merchant_id')?.config_value || ''}
                                    onChange={(e) => updateValue('phonepe_merchant_id', e.target.value)}
                                    className="w-full bg-[#FAF7F2] border border-black/5 rounded-xl px-4 py-2.5 text-xs font-bold"
                                />
                                <div className="relative">
                                    <input
                                        type={visibleFields.includes('phonepe_salt_key') ? "text" : "password"}
                                        placeholder="Salt Key"
                                        value={config.find(c => c.config_key === 'phonepe_salt_key')?.config_value || ''}
                                        onChange={(e) => updateValue('phonepe_salt_key', e.target.value)}
                                        className="w-full bg-[#FAF7F2] border border-black/5 rounded-xl px-4 py-2.5 text-xs font-bold pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => toggleVisibility('phonepe_salt_key')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-black/20 hover:text-black transition-colors"
                                    >
                                        {visibleFields.includes('phonepe_salt_key') ? <EyeOff size={14} /> : <Eye size={14} />}
                                    </button>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Salt Index"
                                    value={config.find(c => c.config_key === 'phonepe_salt_index')?.config_value || ''}
                                    onChange={(e) => updateValue('phonepe_salt_index', e.target.value)}
                                    className="w-full bg-[#FAF7F2] border border-black/5 rounded-xl px-4 py-2.5 text-xs font-bold"
                                />
                            </div>
                        </div>

                        {/* Paytm */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-blue-400/10 text-blue-400 flex items-center justify-center font-black text-[10px]">PY</div>
                                    <span className="text-sm font-black uppercase tracking-tight">Paytm</span>
                                </div>
                                <button
                                    onClick={() => updateValue('enable_paytm', config.find(c => c.config_key === 'enable_paytm')?.config_value === 'true' ? 'false' : 'true')}
                                    className={`w-10 h-5 rounded-full p-1 transition-colors ${config.find(c => c.config_key === 'enable_paytm')?.config_value === 'true' ? 'bg-[#10B981]' : 'bg-black/10'}`}
                                >
                                    <div className={`w-3 h-3 bg-white rounded-full transition-transform ${config.find(c => c.config_key === 'enable_paytm')?.config_value === 'true' ? 'translate-x-5' : 'translate-x-0'}`}></div>
                                </button>
                            </div>
                            <div className="grid grid-cols-1 gap-3 pl-10">
                                <input
                                    type="text"
                                    placeholder="Merchant ID (MID)"
                                    value={config.find(c => c.config_key === 'paytm_mid')?.config_value || ''}
                                    onChange={(e) => updateValue('paytm_mid', e.target.value)}
                                    className="w-full bg-[#FAF7F2] border border-black/5 rounded-xl px-4 py-2.5 text-xs font-bold"
                                />
                                <div className="relative">
                                    <input
                                        type={visibleFields.includes('paytm_merchant_key') ? "text" : "password"}
                                        placeholder="Merchant Key"
                                        value={config.find(c => c.config_key === 'paytm_merchant_key')?.config_value || ''}
                                        onChange={(e) => updateValue('paytm_merchant_key', e.target.value)}
                                        className="w-full bg-[#FAF7F2] border border-black/5 rounded-xl px-4 py-2.5 text-xs font-bold pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => toggleVisibility('paytm_merchant_key')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-black/20 hover:text-black transition-colors"
                                    >
                                        {visibleFields.includes('paytm_merchant_key') ? <EyeOff size={14} /> : <Eye size={14} />}
                                    </button>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Website (e.g. WEBSTAGING)"
                                    value={config.find(c => c.config_key === 'paytm_website')?.config_value || ''}
                                    onChange={(e) => updateValue('paytm_website', e.target.value)}
                                    className="w-full bg-[#FAF7F2] border border-black/5 rounded-xl px-4 py-2.5 text-xs font-bold"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
