import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Zap,
    Plus,
    Trash2,
    Edit3,
    CheckCircle2,
    X,
    CreditCard,
    TrendingUp,
    Users,
    Activity,
    Search,
    Filter,
    ArrowUpRight,
    Save,
    MoreVertical,
    Layers,
    Eye,
    EyeOff,
    Tag,
    Clock,
    Settings as SettingsIcon,
    AlertCircle
} from "lucide-react";
import { api } from "@/lib/api";

interface Plan {
    id?: number;
    name: string;
    credits: number;
    price_monthly: number;
    type: 'trial' | 'paid';
    status: 'active' | 'inactive';
    visibility: 'show' | 'hide';
    badge?: string;
    discount_price?: number;
    description: string;
}

interface TrialConfig {
    free_trial_credits: number;
    trial_validity: number;
    trial_activation: string;
    allow_trial_once: boolean;
}

export default function PlansPage() {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // Trial Config State
    const [trialConfig, setTrialConfig] = useState<TrialConfig>({
        free_trial_credits: 3,
        trial_validity: 7,
        trial_activation: "automatic",
        allow_trial_once: true
    });
    const [isSavingConfig, setIsSavingConfig] = useState(false);

    useEffect(() => {
        fetchPlans();
        fetchTrialConfig();
    }, []);

    const fetchPlans = () => {
        setLoading(true);
        api.get("/plans")
            .then(res => res.json())
            .then(data => {
                const standardized = data.map((p: any) => ({
                    ...p,
                    credits: parseInt(p.credits) || 0,
                    price_monthly: parseFloat(p.price_monthly) || 0,
                    discount_price: p.discount_price ? parseFloat(p.discount_price) : undefined
                }));
                setPlans(standardized);
            })
            .finally(() => setLoading(false));
    };

    const fetchTrialConfig = () => {
        api.get("/admin/settings")
            .then(res => res.json())
            .then(data => {
                if (data.free_trial_credits) {
                    setTrialConfig({
                        free_trial_credits: parseInt(data.free_trial_credits),
                        trial_validity: parseInt(data.trial_validity || "7"),
                        trial_activation: data.trial_activation || "automatic",
                        allow_trial_once: data.allow_trial_once === "1" || data.allow_trial_once === true
                    });
                }
            });
    };

    const handleSavePlan = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingPlan) return;

        try {
            const resp = await api.post("/admin/plans", editingPlan);
            if (resp.ok) {
                fetchPlans();
                setIsModalOpen(false);
                setEditingPlan(null);
            }
        } catch (err) {
            console.error("Save failed", err);
        }
    };

    const handleUpdateConfig = async () => {
        setIsSavingConfig(true);
        try {
            const resp = await api.post("/admin/settings", {
                free_trial_credits: trialConfig.free_trial_credits,
                trial_validity: trialConfig.trial_validity,
                trial_activation: trialConfig.trial_activation,
                allow_trial_once: trialConfig.allow_trial_once ? "1" : "0"
            });
            if (resp.ok) {
                // Success feedback?
            }
        } catch (err) {
            console.error("Config update failed", err);
        } finally {
            setIsSavingConfig(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure? This will remove the package from the system.")) return;
        try {
            const resp = await api.delete(`/admin/plans/${id}`);
            if (resp.ok) fetchPlans();
        } catch (err) {
            console.error("Delete failed", err);
        }
    };

    const openModal = (plan?: Plan) => {
        setEditingPlan(plan || {
            name: "",
            credits: 10,
            price_monthly: 0,
            type: 'paid',
            status: 'active',
            visibility: 'show',
            description: ""
        });
        setIsModalOpen(true);
    };

    const stats = [
        { label: "Total Packages", val: plans.length, icon: <Layers className="text-purple-500" /> },
        { label: "Active Offers", val: plans.filter(p => p.status === 'active').length, icon: <CheckCircle2 className="text-emerald-500" /> },
        { label: "Trial Tiers", val: plans.filter(p => p.type === 'trial').length, icon: <Activity className="text-blue-500" /> },
        { label: "Visibility", val: `${plans.filter(p => p.visibility === 'show').length} Live`, icon: <Eye className="text-amber-500" /> },
    ];

    const filteredPlans = plans.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.type.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 uppercase">Package Management</h1>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mt-1">Pricing Architecture & Credit Quota Governance</p>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => openModal()}
                        className="flex items-center gap-3 px-8 py-4 bg-[#4B2E83] text-white rounded-xl font-black uppercase text-[10px] tracking-[0.2em] shadow-xl shadow-purple-900/20 hover:bg-[#5D3AB0] transition-all active:scale-95"
                    >
                        <Plus size={18} className="text-[#C9A227]" /> Create New Package
                    </button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((s, idx) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        key={idx}
                        className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-center gap-5 group hover:shadow-md transition-all"
                    >
                        <div className="p-3.5 bg-slate-50 rounded-xl group-hover:scale-110 transition-transform">{s.icon}</div>
                        <div>
                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5">{s.label}</p>
                            <h3 className="text-2xl font-black text-slate-900 leading-none">{s.val}</h3>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                {/* Main Table Section */}
                <div className="xl:col-span-3 space-y-6">
                    <div className="bg-white rounded-xl border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
                        {/* Table Controls */}
                        <div className="p-5 border-b border-slate-50 flex flex-wrap items-center justify-between gap-4 bg-slate-50/30">
                            <div className="relative group min-w-[300px]">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#4B2E83] transition-colors" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search packages..."
                                    className="w-full bg-white border border-slate-100 pl-11 pr-4 py-2.5 rounded-xl text-xs font-bold focus:outline-none focus:ring-4 focus:ring-[#4B2E83]/5 focus:border-[#4B2E83]/20 transition-all"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="p-2.5 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-[#4B2E83] transition-all shadow-sm"><Filter size={16} /></button>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-slate-50/50">
                                        <th className="px-6 py-4 text-left text-[9px] font-black uppercase tracking-widest text-slate-400">Package Details</th>
                                        <th className="px-6 py-4 text-center text-[9px] font-black uppercase tracking-widest text-slate-400">Credits</th>
                                        <th className="px-6 py-4 text-center text-[9px] font-black uppercase tracking-widest text-slate-400">Price (₹)</th>
                                        <th className="px-6 py-4 text-center text-[9px] font-black uppercase tracking-widest text-slate-400">Per Credit</th>
                                        <th className="px-6 py-4 text-center text-[9px] font-black uppercase tracking-widest text-slate-400">Type</th>
                                        <th className="px-6 py-4 text-center text-[9px] font-black uppercase tracking-widest text-slate-400">Status</th>
                                        <th className="px-6 py-4 text-right text-[9px] font-black uppercase tracking-widest text-slate-400">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={7} className="py-20 text-center font-black uppercase text-slate-300 animate-pulse text-[10px] tracking-widest">Compiling Package Data...</td>
                                        </tr>
                                    ) : filteredPlans.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="py-20 text-center">
                                                <div className="flex flex-col items-center gap-2 text-slate-300">
                                                    <AlertCircle size={40} />
                                                    <p className="font-black uppercase text-[10px] tracking-widest">No matching packages identified</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : filteredPlans.map((plan) => (
                                        <tr key={plan.id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-[#4B2E83]/5 flex items-center justify-center text-[#4B2E83] group-hover:bg-[#4B2E83] group-hover:text-white transition-all">
                                                        <Tag size={18} />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-black text-slate-900 flex items-center gap-2">
                                                            {plan.name}
                                                            {plan.badge && <span className="px-2 py-0.5 bg-[#C9A227] text-white text-[7px] font-black uppercase rounded shadow-sm">{plan.badge}</span>}
                                                        </div>
                                                        <div className="text-[9px] font-bold text-slate-400 truncate max-w-[200px]">{plan.description}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-black text-slate-600">{plan.credits} CR</span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {plan.discount_price ? (
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-black text-slate-900">₹{plan.discount_price}</span>
                                                        <span className="text-[8px] font-bold text-slate-300 line-through leading-none">₹{plan.price_monthly}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-sm font-black text-slate-900">₹{plan.price_monthly}</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="text-[10px] font-bold text-slate-400">
                                                    {plan.price_monthly && plan.credits ? `₹${(plan.price_monthly / plan.credits).toFixed(1)}` : '-'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center text-[10px] font-black uppercase">
                                                <span className={plan.type === 'trial' ? 'text-blue-500' : 'text-[#4B2E83]'}>{plan.type}</span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className={`px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-widest inline-flex items-center gap-1.5 ${plan.status === 'active' ? 'bg-emerald-50 text-emerald-500' : 'bg-slate-100 text-slate-400'}`}>
                                                    <div className={`w-1 h-1 rounded-full ${plan.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></div>
                                                    {plan.status}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button onClick={() => openModal(plan)} className="p-2 text-slate-300 hover:text-[#4B2E83] hover:bg-[#4B2E83]/5 rounded-lg transition-all"><Edit3 size={16} /></button>
                                                    <button onClick={() => handleDelete(plan.id!)} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={16} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Sidebar Configuration Section */}
                <div className="space-y-6">
                    <div className="bg-[#4B2E83] rounded-xl p-8 text-white relative overflow-hidden shadow-xl shadow-purple-900/30">
                        <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12"><Zap size={100} /></div>
                        <div className="relative z-10">
                            <h3 className="text-xl font-black uppercase tracking-tight mb-6 flex items-center gap-3">
                                <SettingsIcon size={20} className="text-[#C9A227]" />
                                Trial Configuration
                            </h3>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[8px] font-black uppercase tracking-widest text-purple-200/50">Free Trial Credits</label>
                                    <input
                                        type="number"
                                        className="w-full bg-white/10 border border-white/10 rounded-xl py-2.5 px-4 font-black text-sm outline-none focus:bg-white/20 transition-all text-white"
                                        value={trialConfig.free_trial_credits}
                                        onChange={(e) => setTrialConfig({ ...trialConfig, free_trial_credits: parseInt(e.target.value) })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[8px] font-black uppercase tracking-widest text-purple-200/50">Trial Validity (Days)</label>
                                    <input
                                        type="number"
                                        className="w-full bg-white/10 border border-white/10 rounded-xl py-2.5 px-4 font-black text-sm outline-none focus:bg-white/20 transition-all text-white"
                                        value={trialConfig.trial_validity}
                                        onChange={(e) => setTrialConfig({ ...trialConfig, trial_validity: parseInt(e.target.value) })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[8px] font-black uppercase tracking-widest text-purple-200/50">Activation Mode</label>
                                    <select
                                        className="w-full bg-white/10 border border-white/10 rounded-xl py-2.5 px-4 font-black text-xs outline-none focus:bg-white/20 transition-all text-white appearance-none"
                                        value={trialConfig.trial_activation}
                                        onChange={(e) => setTrialConfig({ ...trialConfig, trial_activation: e.target.value })}
                                    >
                                        <option value="automatic" className="text-slate-900">Automatic (On Signup)</option>
                                        <option value="manual" className="text-slate-900">Manual (Request)</option>
                                    </select>
                                </div>

                                <div className="pt-4 flex items-center justify-between">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-purple-200/50">Limit: 1 Per User</span>
                                    <button
                                        onClick={() => setTrialConfig({ ...trialConfig, allow_trial_once: !trialConfig.allow_trial_once })}
                                        className={`w-10 h-5 rounded-full transition-all relative ${trialConfig.allow_trial_once ? 'bg-[#C9A227]' : 'bg-white/10'}`}
                                    >
                                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${trialConfig.allow_trial_once ? 'left-6' : 'left-1'}`} />
                                    </button>
                                </div>

                                <button
                                    onClick={handleUpdateConfig}
                                    disabled={isSavingConfig}
                                    className="w-full mt-4 py-4 bg-[#C9A227] text-[#4B2E83] rounded-xl font-black uppercase tracking-[0.2em] text-[10px] shadow-lg shadow-black/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                                >
                                    {isSavingConfig ? 'Syncing...' : 'Update Trial Matrix'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Revenue Card Summary */}
                    <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4"><TrendingUp size={24} className="text-emerald-500 opacity-20" /></div>
                        <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-1">Package Ecosystem Health</p>
                        <h4 className="text-lg font-black text-slate-900 mb-4">Market Performance</h4>
                        <div className="space-y-3">
                            <div className="flex justify-between items-end">
                                <span className="text-[9px] font-bold text-slate-400 uppercase">Paid Adoption</span>
                                <span className="text-sm font-black text-slate-900">76.4%</span>
                            </div>
                            <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-[#4B2E83]" style={{ width: '76.4%' }} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal for Create/Edit */}
            <AnimatePresence>
                {isModalOpen && editingPlan && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                            onClick={() => setIsModalOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-[#4B2E83] flex items-center justify-center text-[#C9A227] shadow-xl shadow-purple-900/20">
                                        <Plus size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900 leading-none">{editingPlan.id ? 'Refine Package' : 'Architect Package'}</h2>
                                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-1">Resource Allocation Blueprint</p>
                                    </div>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-slate-100 rounded-full transition-all text-slate-400 hover:text-slate-900"><X size={24} /></button>
                            </div>

                            <form onSubmit={handleSavePlan} className="overflow-y-auto custom-scrollbar p-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Left Side */}
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Package Name</label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="e.g. Master Pack"
                                                value={editingPlan.name}
                                                onChange={e => setEditingPlan({ ...editingPlan, name: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-100 rounded-xl py-4 px-5 font-bold text-sm outline-none focus:bg-white focus:border-[#4B2E83]/40 focus:ring-4 focus:ring-[#4B2E83]/5 transition-all"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Credits Quota</label>
                                                <input
                                                    type="number"
                                                    required
                                                    value={editingPlan.credits}
                                                    onChange={e => setEditingPlan({ ...editingPlan, credits: parseInt(e.target.value) })}
                                                    className="w-full bg-slate-50 border border-slate-100 rounded-xl py-4 px-5 font-bold text-sm outline-none focus:bg-white focus:border-[#4B2E83]/40 transition-all"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Price (₹)</label>
                                                <input
                                                    type="number"
                                                    required
                                                    value={editingPlan.price_monthly}
                                                    onChange={e => setEditingPlan({ ...editingPlan, price_monthly: parseFloat(e.target.value) })}
                                                    className="w-full bg-slate-50 border border-slate-100 rounded-xl py-4 px-5 font-bold text-sm outline-none focus:bg-white focus:border-[#4B2E83]/40 transition-all"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Description</label>
                                            <textarea
                                                required
                                                placeholder="Key features or target audience..."
                                                value={editingPlan.description}
                                                onChange={e => setEditingPlan({ ...editingPlan, description: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-100 rounded-xl py-4 px-5 font-bold text-sm outline-none focus:bg-white focus:border-[#4B2E83]/40 transition-all min-h-[100px]"
                                            />
                                        </div>
                                    </div>

                                    {/* Right Side */}
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Package Type</label>
                                                <select
                                                    className="w-full bg-slate-50 border border-slate-100 rounded-xl py-4 px-5 font-bold text-xs outline-none focus:bg-white transition-all appearance-none"
                                                    value={editingPlan.type}
                                                    onChange={e => setEditingPlan({ ...editingPlan, type: e.target.value as any })}
                                                >
                                                    <option value="paid">Paid Package</option>
                                                    <option value="trial">Free Trial</option>
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Current Status</label>
                                                <select
                                                    className="w-full bg-slate-50 border border-slate-100 rounded-xl py-4 px-5 font-bold text-xs outline-none focus:bg-white transition-all appearance-none"
                                                    value={editingPlan.status}
                                                    onChange={e => setEditingPlan({ ...editingPlan, status: e.target.value as any })}
                                                >
                                                    <option value="active">Active (Selling)</option>
                                                    <option value="inactive">Inactive (Paused)</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Visibility (Storefront)</label>
                                            <div className="flex gap-4 p-1 bg-slate-50 rounded-xl border border-slate-100">
                                                <button
                                                    type="button"
                                                    onClick={() => setEditingPlan({ ...editingPlan, visibility: 'show' })}
                                                    className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${editingPlan.visibility === 'show' ? 'bg-[#4B2E83] text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                                                >
                                                    <Eye size={14} /> Public
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setEditingPlan({ ...editingPlan, visibility: 'hide' })}
                                                    className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${editingPlan.visibility === 'hide' ? 'bg-[#4B2E83] text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                                                >
                                                    <EyeOff size={14} /> Internal
                                                </button>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Feature Badge</label>
                                            <input
                                                type="text"
                                                placeholder="Most Popular, Best Value, etc."
                                                value={editingPlan.badge || ""}
                                                onChange={e => setEditingPlan({ ...editingPlan, badge: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-100 rounded-xl py-4 px-5 font-bold text-sm outline-none focus:bg-white focus:border-[#4B2E83]/40 transition-all"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Discount Price (Optional)</label>
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    placeholder="Offer Price..."
                                                    value={editingPlan.discount_price || ""}
                                                    onChange={e => setEditingPlan({ ...editingPlan, discount_price: e.target.value ? parseFloat(e.target.value) : undefined })}
                                                    className="w-full bg-emerald-50/30 border border-emerald-100 rounded-xl py-4 px-5 font-bold text-sm outline-none focus:bg-white focus:border-emerald-500/40 transition-all text-emerald-600"
                                                />
                                                <ArrowUpRight className="absolute right-5 top-1/2 -translate-y-1/2 text-emerald-400" size={18} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-12 flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 py-5 bg-slate-50 text-slate-400 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-slate-100 transition-all"
                                    >
                                        Abort
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-[2] py-5 bg-[#4B2E83] text-white rounded-xl font-black uppercase tracking-[0.26em] text-[11px] shadow-2xl shadow-purple-900/40 hover:bg-[#5D3AB0] transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                                    >
                                        <Save size={20} className="text-[#C9A227]" />
                                        {editingPlan.id ? 'Authorize Modifications' : 'Initialize Package Blueprint'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
