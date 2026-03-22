

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, Save, Zap, Database, Globe, Sliders, Code, CreditCard, Wallet, Eye, EyeOff, Sparkles, Search } from "lucide-react";
import { api } from "@/lib/api";
import { useNavigate } from "react-router-dom";

export default function SystemConfigPage() {
    const [config, setConfig] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [visibleFields, setVisibleFields] = useState<string[]>([]);
    const navigate = useNavigate();

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

    const [activeTab, setActiveTab] = useState("branding");

    const tabs = [
        { id: "general", label: "General", icon: <Sliders size={18} /> },
        { id: "branding", label: "Branding", icon: <Globe size={18} /> },
        { id: "trial", label: "Trial Settings", icon: <Zap size={18} /> },
        { id: "credits", label: "Credit System", icon: <CreditCard size={18} /> },
        { id: "analysis", label: "Analysis Rules", icon: <Code size={18} /> },
        { id: "payments", label: "Payment Gateways", icon: <Wallet size={18} /> },
        { id: "email", label: "Email Settings", icon: <Database size={18} /> },
        { id: "whatsapp", label: "WhatsApp Settings", icon: <Sparkles size={18} /> },
        { id: "security", label: "Security", icon: <Eye size={18} /> },
        { id: "seo", label: "SEO Settings", icon: <Search size={18} /> },
        { id: "maintenance", label: "Maintenance", icon: <Settings size={18} /> },
    ];

    if (loading) return <div className="p-20 text-center animate-pulse font-black uppercase text-black/20">Initialising Core Protocols...</div>;

    return (
        <div className="flex flex-col h-full bg-[#F8F9FA] -m-6 min-h-[calc(100vh-64px)]">
            {/* Header */}
            <div className="flex justify-between items-center px-8 py-6 bg-white border-b border-slate-200">
                <div>
                    <h1 className="text-2xl font-black tracking-tight text-slate-900">Platform Settings</h1>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mt-1">Global Config & Governance</p>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-[10px] font-black bg-slate-100 px-3 py-1.5 rounded-full text-slate-500 uppercase tracking-widest">Version 1.0.4</span>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-3 bg-[#4B2E83] text-white rounded-xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-[#5D3AB0] transition-all shadow-lg active:scale-95 disabled:opacity-50"
                    >
                        {saving ? "Deploying..." : <><Save size={14} /> Save Changes</>}
                    </button>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar Navigation */}
                <div className="w-72 bg-white border-r border-slate-200 overflow-y-auto pb-20">
                    <nav className="p-4 space-y-1">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-left transition-all duration-200 group ${activeTab === tab.id
                                        ? "bg-[#4B2E83] text-white shadow-lg shadow-purple-900/20"
                                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                    }`}
                            >
                                <div className={`${activeTab === tab.id ? "text-white" : "text-slate-400 group-hover:text-slate-900"}`}>
                                    {tab.icon}
                                </div>
                                <span className="text-xs font-black uppercase tracking-widest">{tab.label}</span>
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-8 bg-[#F8F9FA]">
                    <div className="max-w-4xl mx-auto">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-8"
                            >
                                {activeTab === "general" && (
                                    <div className="space-y-6">
                                        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
                                                <Sliders size={16} /> Basic System Info
                                            </h3>
                                            <div className="grid grid-cols-2 gap-6">
                                                <div>
                                                    <p className="text-[9px] font-black uppercase tracking-widest text-black/30 mb-2">System Version</p>
                                                    <input
                                                        type="text"
                                                        value={config.find(c => c.config_key === 'system_version')?.config_value || 'Numero Sansar v1.0'}
                                                        onChange={(e) => updateValue('system_version', e.target.value)}
                                                        className="w-full bg-[#FAF7F2] border border-black/5 rounded-xl px-4 py-3 font-bold text-sm"
                                                    />
                                                </div>
                                                <div>
                                                    <p className="text-[9px] font-black uppercase tracking-widest text-black/30 mb-2">Last Updated</p>
                                                    <input
                                                        type="text"
                                                        disabled
                                                        value={new Date().toLocaleDateString()}
                                                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 font-bold text-sm text-slate-400"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === "branding" && (
                                    <div className="space-y-6">
                                        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-8">
                                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
                                                <Globe size={16} /> Identity & Aesthetics
                                            </h3>
                                            <div className="grid grid-cols-2 gap-6">
                                                <div className="space-y-6">
                                                    <div>
                                                        <p className="text-[9px] font-black uppercase tracking-widest text-black/30 mb-2">Platform Name</p>
                                                        <input
                                                            type="text"
                                                            value={config.find(c => c.config_key === 'platform_name')?.config_value || ''}
                                                            onChange={(e) => updateValue('platform_name', e.target.value)}
                                                            className="w-full bg-[#FAF7F2] border border-black/5 rounded-xl px-4 py-3 font-bold text-sm"
                                                        />
                                                    </div>
                                                    <div>
                                                        <p className="text-[9px] font-black uppercase tracking-widest text-black/30 mb-2">Website URL</p>
                                                        <input
                                                            type="text"
                                                            value={config.find(c => c.config_key === 'platform_url')?.config_value || ''}
                                                            onChange={(e) => updateValue('platform_url', e.target.value)}
                                                            className="w-full bg-[#FAF7F2] border border-black/5 rounded-xl px-4 py-3 font-bold text-sm"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-6">
                                                    <div>
                                                        <p className="text-[9px] font-black uppercase tracking-widest text-black/30 mb-2">Primary Color</p>
                                                        <div className="flex gap-2">
                                                            <input
                                                                type="color"
                                                                value={config.find(c => c.config_key === 'primary_theme_color')?.config_value || '#4B2E83'}
                                                                onChange={(e) => updateValue('primary_theme_color', e.target.value)}
                                                                className="w-12 h-12 rounded-xl cursor-pointer border-none bg-transparent"
                                                            />
                                                            <input
                                                                type="text"
                                                                value={config.find(c => c.config_key === 'primary_theme_color')?.config_value || '#4B2E83'}
                                                                onChange={(e) => updateValue('primary_theme_color', e.target.value)}
                                                                className="flex-1 bg-[#FAF7F2] border border-black/5 rounded-xl px-4 py-3 font-bold text-sm"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <p className="text-[9px] font-black uppercase tracking-widest text-black/30 mb-2">CTA Button Color</p>
                                                        <div className="flex gap-2">
                                                            <input
                                                                type="color"
                                                                value={config.find(c => c.config_key === 'cta_button_color')?.config_value || '#C9A227'}
                                                                onChange={(e) => updateValue('cta_button_color', e.target.value)}
                                                                className="w-12 h-12 rounded-xl cursor-pointer border-none bg-transparent"
                                                            />
                                                            <input
                                                                type="text"
                                                                value={config.find(c => c.config_key === 'cta_button_color')?.config_value || '#C9A227'}
                                                                onChange={(e) => updateValue('cta_button_color', e.target.value)}
                                                                className="flex-1 bg-[#FAF7F2] border border-black/5 rounded-xl px-4 py-3 font-bold text-sm"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-black uppercase tracking-widest text-black/30 mb-2">Footer Copyright Text</p>
                                                <input
                                                    type="text"
                                                    value={config.find(c => c.config_key === 'footer_copyright_text')?.config_value || '© 2026 Numero Sansar. All rights reserved.'}
                                                    onChange={(e) => updateValue('footer_copyright_text', e.target.value)}
                                                    className="w-full bg-[#FAF7F2] border border-black/5 rounded-xl px-4 py-3 font-bold text-sm"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === "trial" && (
                                    <div className="space-y-6">
                                        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-8">
                                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
                                                <Zap size={16} /> Free Trial Configuration
                                            </h3>
                                            <div className="grid grid-cols-2 gap-8">
                                                <div className="space-y-6">
                                                    <div className="flex items-center justify-between p-4 bg-[#FAF7F2] rounded-2xl">
                                                        <div>
                                                            <p className="text-xs font-black uppercase">Enable Free Trial</p>
                                                            <p className="text-[9px] font-bold text-black/20 uppercase tracking-tighter">Allow new users to test</p>
                                                        </div>
                                                        <button
                                                            onClick={() => updateValue('enable_trial', config.find(c => c.config_key === 'enable_trial')?.config_value === 'true' ? 'false' : 'true')}
                                                            className={`w-12 h-6 rounded-full p-1 transition-colors ${config.find(c => c.config_key === 'enable_trial')?.config_value === 'true' ? 'bg-[#4B2E83]' : 'bg-slate-200'}`}
                                                        >
                                                            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${config.find(c => c.config_key === 'enable_trial')?.config_value === 'true' ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                                        </button>
                                                    </div>
                                                    <div>
                                                        <p className="text-[9px] font-black uppercase tracking-widest text-black/30 mb-2">Free Trial Credits</p>
                                                        <input
                                                            type="number"
                                                            value={config.find(c => c.config_key === 'trial_credits')?.config_value || '3'}
                                                            onChange={(e) => updateValue('trial_credits', e.target.value)}
                                                            className="w-full bg-[#FAF7F2] border border-black/5 rounded-xl px-4 py-3 font-bold text-sm"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-6">
                                                    <div>
                                                        <p className="text-[9px] font-black uppercase tracking-widest text-black/30 mb-2">Trial Validity (Days)</p>
                                                        <input
                                                            type="number"
                                                            value={config.find(c => c.config_key === 'trial_days')?.config_value || '7'}
                                                            onChange={(e) => updateValue('trial_days', e.target.value)}
                                                            className="w-full bg-[#FAF7F2] border border-black/5 rounded-xl px-4 py-3 font-bold text-sm"
                                                        />
                                                    </div>
                                                    <div>
                                                        <p className="text-[9px] font-black uppercase tracking-widest text-black/30 mb-2">Activation Mode</p>
                                                        <select
                                                            value={config.find(c => c.config_key === 'trial_activation')?.config_value || 'automatic'}
                                                            onChange={(e) => updateValue('trial_activation', e.target.value)}
                                                            className="w-full bg-[#FAF7F2] border border-black/5 rounded-xl px-4 py-3 font-bold text-sm"
                                                        >
                                                            <option value="automatic">Automatic on Signup</option>
                                                            <option value="manual">Manual Approval</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-black uppercase tracking-widest text-black/30 mb-2">Expiry Message</p>
                                                <textarea
                                                    value={config.find(c => c.config_key === 'trial_expiry_msg')?.config_value || 'Your free trial has expired. Purchase credits to continue using Numero Sansar.'}
                                                    onChange={(e) => updateValue('trial_expiry_msg', e.target.value)}
                                                    className="w-full bg-[#FAF7F2] border border-black/5 rounded-xl px-4 py-3 font-bold text-sm h-24 resize-none"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === "credits" && (
                                    <div className="space-y-6">
                                        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-8">
                                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
                                                <CreditCard size={16} /> Ecosystem Credits
                                            </h3>
                                            <div className="grid grid-cols-2 gap-8">
                                                <div>
                                                    <p className="text-[9px] font-black uppercase tracking-widest text-black/30 mb-2">Credit Display Name</p>
                                                    <input
                                                        type="text"
                                                        value={config.find(c => c.config_key === 'credit_name')?.config_value || 'Analysis Credits'}
                                                        onChange={(e) => updateValue('credit_name', e.target.value)}
                                                        className="w-full bg-[#FAF7F2] border border-black/5 rounded-xl px-4 py-3 font-bold text-sm"
                                                    />
                                                </div>
                                                <div>
                                                    <p className="text-[9px] font-black uppercase tracking-widest text-black/30 mb-2">Min Purchase Amount</p>
                                                    <input
                                                        type="number"
                                                        value={config.find(c => c.config_key === 'min_credit_purchase')?.config_value || '10'}
                                                        onChange={(e) => updateValue('min_credit_purchase', e.target.value)}
                                                        className="w-full bg-[#FAF7F2] border border-black/5 rounded-xl px-4 py-3 font-bold text-sm"
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-8">
                                                <div>
                                                    <p className="text-[9px] font-black uppercase tracking-widest text-black/30 mb-2">Low Credit Alert Threshold</p>
                                                    <input
                                                        type="number"
                                                        value={config.find(c => c.config_key === 'low_credit_threshold')?.config_value || '5'}
                                                        onChange={(e) => updateValue('low_credit_threshold', e.target.value)}
                                                        className="w-full bg-[#FAF7F2] border border-black/5 rounded-xl px-4 py-3 font-bold text-sm"
                                                    />
                                                </div>
                                                <div>
                                                    <p className="text-[9px] font-black uppercase tracking-widest text-black/30 mb-2">Credit Expiry (Days)</p>
                                                    <input
                                                        type="number"
                                                        placeholder="0 for Never"
                                                        value={config.find(c => c.config_key === 'credit_expiry_days')?.config_value || '0'}
                                                        onChange={(e) => updateValue('credit_expiry_days', e.target.value)}
                                                        className="w-full bg-[#FAF7F2] border border-black/5 rounded-xl px-4 py-3 font-bold text-sm"
                                                    />
                                                </div>
                                                <div>
                                                    <p className="text-[9px] font-black uppercase tracking-widest text-black/30 mb-2">Credit Expiry (Days)</p>
                                                    <input
                                                        type="number"
                                                        placeholder="0 for Never"
                                                        value={config.find(c => c.config_key === 'credit_expiry_days')?.config_value || '0'}
                                                        onChange={(e) => updateValue('credit_expiry_days', e.target.value)}
                                                        className="w-full bg-[#FAF7F2] border border-black/5 rounded-xl px-4 py-3 font-bold text-sm"
                                                    />
                                                </div>
                                                <div>
                                                    <p className="text-[9px] font-black uppercase tracking-widest text-black/30 mb-2">Allow Refunds</p>
                                                    <button
                                                        onClick={() => updateValue('allow_credit_refund', config.find(c => c.config_key === 'allow_credit_refund')?.config_value === 'true' ? 'false' : 'true')}
                                                        className={`w-full flex items-center justify-between p-3.5 rounded-xl transition-all ${config.find(c => c.config_key === 'allow_credit_refund')?.config_value === 'true' ? 'bg-[#4B2E83] text-white' : 'bg-[#FAF7F2] text-slate-400'}`}
                                                    >
                                                        <span className="text-[10px] font-black uppercase">Enable Refunds</span>
                                                        <div className={`w-3 h-3 rounded-full ${config.find(c => c.config_key === 'allow_credit_refund')?.config_value === 'true' ? 'bg-green-400' : 'bg-slate-300'}`}></div>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === "analysis" && (
                                    <div className="space-y-6">
                                        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-8">
                                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
                                                <Code size={16} /> Credit Consumption Rules
                                            </h3>
                                            <div className="overflow-hidden rounded-2xl border border-slate-100">
                                                <table className="w-full text-left">
                                                    <thead>
                                                        <tr className="bg-slate-50 border-b border-slate-100">
                                                            <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400">Analysis Feature</th>
                                                            <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400">Credits Used</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-slate-50">
                                                        {[
                                                            { key: 'cost_life_path', label: 'Life Path Analysis' },
                                                            { key: 'cost_name_analysis', label: 'Name Numerology' },
                                                            { key: 'cost_compatibility', label: 'Compatibility Analysis' },
                                                            { key: 'cost_business', label: 'Business Name Analysis' },
                                                            { key: 'cost_detailed_report', label: 'Detailed Report Generation' },
                                                        ].map(rule => (
                                                            <tr key={rule.key}>
                                                                <td className="px-6 py-4 font-bold text-sm">{rule.label}</td>
                                                                <td className="px-6 py-4">
                                                                    <input
                                                                        type="number"
                                                                        value={config.find(c => c.config_key === rule.key)?.config_value || '1'}
                                                                        onChange={(e) => updateValue(rule.key, e.target.value)}
                                                                        className="w-20 bg-[#FAF7F2] border border-black/5 rounded-lg px-3 py-1.5 font-black text-center"
                                                                    />
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === "payments" && (
                                    <div className="space-y-6">
                                        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-10">
                                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
                                                <Wallet size={16} /> Financial Gateways
                                            </h3>
                                            <div className="grid grid-cols-2 gap-8">
                                                <div className="space-y-6">
                                                    <div className="flex items-center justify-between p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
                                                        <span className="text-xs font-black uppercase text-blue-600">Razorpay</span>
                                                        <button
                                                            onClick={() => updateValue('enable_razorpay', config.find(c => c.config_key === 'enable_razorpay')?.config_value === 'true' ? 'false' : 'true')}
                                                            className={`w-10 h-5 rounded-full p-1 transition-colors ${config.find(c => c.config_key === 'enable_razorpay')?.config_value === 'true' ? 'bg-blue-500' : 'bg-slate-200'}`}
                                                        >
                                                            <div className={`w-3 h-3 bg-white rounded-full transition-transform ${config.find(c => c.config_key === 'enable_razorpay')?.config_value === 'true' ? 'translate-x-5' : 'translate-x-0'}`}></div>
                                                        </button>
                                                    </div>
                                                    <div className="space-y-4">
                                                        <input
                                                            type="text"
                                                            placeholder="Key ID"
                                                            value={config.find(c => c.config_key === 'razorpay_key_id')?.config_value || ''}
                                                            onChange={(e) => updateValue('razorpay_key_id', e.target.value)}
                                                            className="w-full bg-[#FAF7F2] border border-black/5 rounded-xl px-4 py-3 font-bold text-xs"
                                                        />
                                                        <input
                                                            type="password"
                                                            placeholder="Key Secret"
                                                            value={config.find(c => c.config_key === 'razorpay_key_secret')?.config_value || ''}
                                                            onChange={(e) => updateValue('razorpay_key_secret', e.target.value)}
                                                            className="w-full bg-[#FAF7F2] border border-black/5 rounded-xl px-4 py-3 font-bold text-xs"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-6">
                                                    <div className="flex items-center justify-between p-4 bg-purple-50/50 rounded-2xl border border-purple-100">
                                                        <span className="text-xs font-black uppercase text-purple-600">PhonePe</span>
                                                        <button
                                                            onClick={() => updateValue('enable_phonepe', config.find(c => c.config_key === 'enable_phonepe')?.config_value === 'true' ? 'false' : 'true')}
                                                            className={`w-10 h-5 rounded-full p-1 transition-colors ${config.find(c => c.config_key === 'enable_phonepe')?.config_value === 'true' ? 'bg-purple-500' : 'bg-slate-200'}`}
                                                        >
                                                            <div className={`w-3 h-3 bg-white rounded-full transition-transform ${config.find(c => c.config_key === 'enable_phonepe')?.config_value === 'true' ? 'translate-x-5' : 'translate-x-0'}`}></div>
                                                        </button>
                                                    </div>
                                                    <div className="space-y-4">
                                                        <input
                                                            type="text"
                                                            placeholder="Merchant ID"
                                                            value={config.find(c => c.config_key === 'phonepe_merchant_id')?.config_value || ''}
                                                            onChange={(e) => updateValue('phonepe_merchant_id', e.target.value)}
                                                            className="w-full bg-[#FAF7F2] border border-black/5 rounded-xl px-4 py-3 font-bold text-xs"
                                                        />
                                                        <input
                                                            type="password"
                                                            placeholder="Salt Key"
                                                            value={config.find(c => c.config_key === 'phonepe_salt_key')?.config_value || ''}
                                                            onChange={(e) => updateValue('phonepe_salt_key', e.target.value)}
                                                            className="w-full bg-[#FAF7F2] border border-black/5 rounded-xl px-4 py-3 font-bold text-xs"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-6">
                                                    <div className="flex items-center justify-between p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                                                        <span className="text-xs font-black uppercase text-indigo-600">Stripe</span>
                                                        <button
                                                            onClick={() => updateValue('enable_stripe', config.find(c => c.config_key === 'enable_stripe')?.config_value === 'true' ? 'false' : 'true')}
                                                            className={`w-10 h-5 rounded-full p-1 transition-colors ${config.find(c => c.config_key === 'enable_stripe')?.config_value === 'true' ? 'bg-indigo-500' : 'bg-slate-200'}`}
                                                        >
                                                            <div className={`w-3 h-3 bg-white rounded-full transition-transform ${config.find(c => c.config_key === 'enable_stripe')?.config_value === 'true' ? 'translate-x-5' : 'translate-x-0'}`}></div>
                                                        </button>
                                                    </div>
                                                    <div className="space-y-4">
                                                        <input
                                                            type="text"
                                                            placeholder="Publishable Key"
                                                            value={config.find(c => c.config_key === 'stripe_pub_key')?.config_value || ''}
                                                            onChange={(e) => updateValue('stripe_pub_key', e.target.value)}
                                                            className="w-full bg-[#FAF7F2] border border-black/5 rounded-xl px-4 py-3 font-bold text-xs"
                                                        />
                                                        <input
                                                            type="password"
                                                            placeholder="Secret Key"
                                                            value={config.find(c => c.config_key === 'stripe_secret_key')?.config_value || ''}
                                                            onChange={(e) => updateValue('stripe_secret_key', e.target.value)}
                                                            className="w-full bg-[#FAF7F2] border border-black/5 rounded-xl px-4 py-3 font-bold text-xs"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === "email" && (
                                    <div className="space-y-6">
                                        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-8">
                                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
                                                <Database size={16} /> SMTP Notification Hub
                                            </h3>
                                            <div className="grid grid-cols-2 gap-6">
                                                <div>
                                                    <p className="text-[9px] font-black uppercase tracking-widest text-black/30 mb-2">SMTP Host</p>
                                                    <input
                                                        type="text"
                                                        value={config.find(c => c.config_key === 'smtp_host')?.config_value || ''}
                                                        onChange={(e) => updateValue('smtp_host', e.target.value)}
                                                        className="w-full bg-[#FAF7F2] border border-black/5 rounded-xl px-4 py-3 font-bold text-sm"
                                                    />
                                                </div>
                                                <div>
                                                    <p className="text-[9px] font-black uppercase tracking-widest text-black/30 mb-2">SMTP Port</p>
                                                    <input
                                                        type="number"
                                                        value={config.find(c => c.config_key === 'smtp_port')?.config_value || '587'}
                                                        onChange={(e) => updateValue('smtp_port', e.target.value)}
                                                        className="w-full bg-[#FAF7F2] border border-black/5 rounded-xl px-4 py-3 font-bold text-sm"
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-6">
                                                <div>
                                                    <p className="text-[9px] font-black uppercase tracking-widest text-black/30 mb-2">SMTP Username</p>
                                                    <input
                                                        type="text"
                                                        value={config.find(c => c.config_key === 'smtp_user')?.config_value || ''}
                                                        onChange={(e) => updateValue('smtp_user', e.target.value)}
                                                        className="w-full bg-[#FAF7F2] border border-black/5 rounded-xl px-4 py-3 font-bold text-sm"
                                                    />
                                                </div>
                                                <div>
                                                    <p className="text-[9px] font-black uppercase tracking-widest text-black/30 mb-2">SMTP Password</p>
                                                    <input
                                                        type="password"
                                                        value={config.find(c => c.config_key === 'smtp_pass')?.config_value || ''}
                                                        onChange={(e) => updateValue('smtp_pass', e.target.value)}
                                                        className="w-full bg-[#FAF7F2] border border-black/5 rounded-xl px-4 py-3 font-bold text-sm"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === "whatsapp" && (
                                    <div className="space-y-6">
                                        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-8">
                                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
                                                <Sparkles size={16} /> WhatsApp Integration (Optional)
                                            </h3>
                                            <div className="space-y-6">
                                                <div>
                                                    <p className="text-[9px] font-black uppercase tracking-widest text-black/30 mb-2">API Key</p>
                                                    <input
                                                        type="password"
                                                        value={config.find(c => c.config_key === 'whatsapp_api_key')?.config_value || ''}
                                                        onChange={(e) => updateValue('whatsapp_api_key', e.target.value)}
                                                        className="w-full bg-[#FAF7F2] border border-black/5 rounded-xl px-4 py-3 font-bold text-sm"
                                                    />
                                                </div>
                                                <div>
                                                    <p className="text-[9px] font-black uppercase tracking-widest text-black/30 mb-2">Sender Number</p>
                                                    <input
                                                        type="text"
                                                        value={config.find(c => c.config_key === 'whatsapp_sender')?.config_value || ''}
                                                        onChange={(e) => updateValue('whatsapp_sender', e.target.value)}
                                                        className="w-full bg-[#FAF7F2] border border-black/5 rounded-xl px-4 py-3 font-bold text-sm"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === "security" && (
                                    <div className="space-y-6">
                                        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-8">
                                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
                                                <Eye size={16} /> Security & Hardening
                                            </h3>
                                            <div className="grid grid-cols-2 gap-6">
                                                <div className="flex items-center justify-between p-4 bg-[#FAF7F2] rounded-2xl">
                                                    <span className="text-xs font-black uppercase">OTP Login</span>
                                                    <button
                                                        onClick={() => updateValue('enable_otp', config.find(c => c.config_key === 'enable_otp')?.config_value === 'true' ? 'false' : 'true')}
                                                        className={`w-10 h-5 rounded-full p-1 transition-colors ${config.find(c => c.config_key === 'enable_otp')?.config_value === 'true' ? 'bg-[#4B2E83]' : 'bg-slate-200'}`}
                                                    >
                                                        <div className={`w-3 h-3 bg-white rounded-full transition-transform ${config.find(c => c.config_key === 'enable_otp')?.config_value === 'true' ? 'translate-x-5' : 'translate-x-0'}`}></div>
                                                    </button>
                                                </div>
                                                <div className="flex items-center justify-between p-4 bg-[#FAF7F2] rounded-2xl">
                                                    <span className="text-xs font-black uppercase">Two-Factor Auth</span>
                                                    <button
                                                        onClick={() => updateValue('enable_2fa', config.find(c => c.config_key === 'enable_2fa')?.config_value === 'true' ? 'false' : 'true')}
                                                        className={`w-10 h-5 rounded-full p-1 transition-colors ${config.find(c => c.config_key === 'enable_2fa')?.config_value === 'true' ? 'bg-[#4B2E83]' : 'bg-slate-200'}`}
                                                    >
                                                        <div className={`w-3 h-3 bg-white rounded-full transition-transform ${config.find(c => c.config_key === 'enable_2fa')?.config_value === 'true' ? 'translate-x-5' : 'translate-x-0'}`}></div>
                                                    </button>
                                                </div>
                                                <div className="flex items-center justify-between p-4 bg-[#FAF7F2] rounded-2xl">
                                                    <span className="text-xs font-black uppercase">IP Logging</span>
                                                    <button
                                                        onClick={() => updateValue('enable_ip_logging', config.find(c => c.config_key === 'enable_ip_logging')?.config_value === 'true' ? 'false' : 'true')}
                                                        className={`w-10 h-5 rounded-full p-1 transition-colors ${config.find(c => c.config_key === 'enable_ip_logging')?.config_value === 'true' ? 'bg-[#4B2E83]' : 'bg-slate-200'}`}
                                                    >
                                                        <div className={`w-3 h-3 bg-white rounded-full transition-transform ${config.find(c => c.config_key === 'enable_ip_logging')?.config_value === 'true' ? 'translate-x-5' : 'translate-x-0'}`}></div>
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-6">
                                                <div>
                                                    <p className="text-[9px] font-black uppercase tracking-widest text-black/30 mb-2">Session Timeout (Min)</p>
                                                    <input
                                                        type="number"
                                                        value={config.find(c => c.config_key === 'session_timeout')?.config_value || '60'}
                                                        onChange={(e) => updateValue('session_timeout', e.target.value)}
                                                        className="w-full bg-[#FAF7F2] border border-black/5 rounded-xl px-4 py-3 font-bold text-sm"
                                                    />
                                                </div>
                                                <div>
                                                    <p className="text-[9px] font-black uppercase tracking-widest text-black/30 mb-2">Max Login Attempts</p>
                                                    <input
                                                        type="number"
                                                        value={config.find(c => c.config_key === 'max_login_attempts')?.config_value || '5'}
                                                        onChange={(e) => updateValue('max_login_attempts', e.target.value)}
                                                        className="w-full bg-[#FAF7F2] border border-black/5 rounded-xl px-4 py-3 font-bold text-sm"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === "seo" && (
                                    <div className="space-y-6">
                                        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-8">
                                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
                                                <Search size={16} /> Global SEO Protocol
                                            </h3>
                                            <div className="space-y-6">
                                                <div>
                                                    <p className="text-[9px] font-black uppercase tracking-widest text-black/30 mb-2">Meta Title</p>
                                                    <input
                                                        type="text"
                                                        value={config.find(c => c.config_key === 'meta_title')?.config_value || 'Numero Sansar – Professional Numerology Platform'}
                                                        onChange={(e) => updateValue('meta_title', e.target.value)}
                                                        className="w-full bg-[#FAF7F2] border border-black/5 rounded-xl px-4 py-3 font-bold text-sm"
                                                    />
                                                </div>
                                                <div>
                                                    <p className="text-[9px] font-black uppercase tracking-widest text-black/30 mb-2">Meta Description</p>
                                                    <textarea
                                                        value={config.find(c => c.config_key === 'meta_description')?.config_value || 'Powerful numerology software for professional consultants.'}
                                                        onChange={(e) => updateValue('meta_description', e.target.value)}
                                                        className="w-full bg-[#FAF7F2] border border-black/5 rounded-xl px-4 py-3 font-bold text-sm h-32 resize-none"
                                                    />
                                                </div>
                                                <div>
                                                    <p className="text-[9px] font-black uppercase tracking-widest text-black/30 mb-2">Meta Keywords</p>
                                                    <input
                                                        type="text"
                                                        placeholder="comma, separated, keywords"
                                                        value={config.find(c => c.config_key === 'meta_keywords')?.config_value || ''}
                                                        onChange={(e) => updateValue('meta_keywords', e.target.value)}
                                                        className="w-full bg-[#FAF7F2] border border-black/5 rounded-xl px-4 py-3 font-bold text-sm"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === "maintenance" && (
                                    <div className="space-y-6">
                                        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-8 text-center max-w-2xl mx-auto">
                                            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                                <Settings size={40} />
                                            </div>
                                            <h3 className="text-xl font-black text-slate-900 tracking-tight">Maintenance Mode</h3>
                                            <p className="text-slate-500 font-bold text-sm leading-relaxed px-10">
                                                When enabled, the frontend will display a maintenance message and prevent any analyses or transactions.
                                            </p>
                                            <div className="py-8">
                                                <button
                                                    onClick={() => updateValue('maintenance_mode', config.find(c => c.config_key === 'maintenance_mode')?.config_value === 'true' ? 'false' : 'true')}
                                                    className={`px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all ${config.find(c => c.config_key === 'maintenance_mode')?.config_value === 'true'
                                                            ? "bg-red-500 text-white shadow-xl shadow-red-500/20"
                                                            : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                                                        }`}
                                                >
                                                    {config.find(c => c.config_key === 'maintenance_mode')?.config_value === 'true' ? "Disable Maintenance" : "Go Under Maintenance"}
                                                </button>
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="Maintenance Message"
                                                value={config.find(c => c.config_key === 'maintenance_msg')?.config_value || 'Numero Sansar is currently under maintenance. Please check back soon.'}
                                                onChange={(e) => updateValue('maintenance_msg', e.target.value)}
                                                className="w-full bg-[#FAF7F2] border border-black/5 rounded-xl px-4 py-3 font-bold text-sm text-center"
                                            />
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
