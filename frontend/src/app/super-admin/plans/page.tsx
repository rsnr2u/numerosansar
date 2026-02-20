"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Zap,
    Plus,
    Trash2,
    Save,
    CheckCircle2,
    X,
    CreditCard,
    Layers
} from "lucide-react";
import { api } from "@/lib/api";

interface Plan {
    id?: number;
    name: string;
    price_monthly: string | number;
    price_yearly: string | number;
    modules: string[];
    description: string;
}

const AVAILABLE_MODULES = [
    { id: 'name', name: 'Name Numerology' },
    { id: 'business', name: 'Business Numerology' },
    { id: 'mobile', name: 'Mobile Numerology' },
    { id: 'vehicle', name: 'Vehicle Numerology' },
    { id: 'ai', name: 'AI Suggestions' },
];

export default function PlansPage() {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = () => {
        setLoading(true);
        api.get("/plans")
            .then(res => res.json())
            .then(data => setPlans(data))
            .finally(() => setLoading(false));
    };

    const handleSave = async (e: React.FormEvent) => {
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

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure? This will affect all current subscribers of this plan.")) return;
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
            price_monthly: 0,
            price_yearly: 0,
            modules: [],
            description: ""
        });
        setIsModalOpen(true);
    };

    const toggleModule = (moduleId: string) => {
        if (!editingPlan) return;
        const modules = editingPlan.modules.includes(moduleId)
            ? editingPlan.modules.filter(m => m !== moduleId)
            : [...editingPlan.modules, moduleId];
        setEditingPlan({ ...editingPlan, modules });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter uppercase italic">Subscription Protocols</h1>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-black/20 mt-1">Membership Tiers & Access Logic Blueprint</p>
                </div>

                <button
                    onClick={() => openModal()}
                    className="flex items-center gap-2 px-8 py-4 bg-black text-white rounded-xl font-black uppercase text-[10px] tracking-widest hover:shadow-2xl transition-all active:scale-95"
                >
                    <Plus size={16} /> Architect New Plan
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full py-20 text-center text-xs font-black uppercase text-black/20 tracking-[0.3em] animate-pulse">Analyzing Tiers...</div>
                ) : plans.map((plan) => (
                    <motion.div
                        key={plan.id}
                        layoutId={plan.id?.toString()}
                        className="bg-white border border-black/5 rounded-2xl p-6 shadow-xl flex flex-col group relative"
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className="p-3 bg-black/5 rounded-xl text-black">
                                <Zap size={20} />
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => openModal(plan)} className="p-2 hover:bg-black/5 rounded-lg text-black/20 hover:text-black transition-colors"><Layers size={16} /></button>
                                <button onClick={() => handleDelete(plan.id!)} className="p-2 hover:bg-red-500/5 rounded-lg text-red-500/20 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                            </div>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-xl font-black uppercase tracking-tight italic mb-1">{plan.name}</h3>
                            <p className="text-[10px] font-bold text-black/30 uppercase tracking-widest line-clamp-2">{plan.description}</p>
                        </div>

                        <div className="mb-8 space-y-2">
                            <div className="flex justify-between items-end">
                                <span className="text-[9px] font-black uppercase tracking-widest text-black/20">Monthly</span>
                                <span className="text-2xl font-black tracking-tighter">₹{plan.price_monthly}</span>
                            </div>
                            <div className="flex justify-between items-end">
                                <span className="text-[9px] font-black uppercase tracking-widest text-black/20">Yearly</span>
                                <span className="text-2xl font-black tracking-tighter">₹{plan.price_yearly}</span>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2 pt-6 border-t border-black/5">
                            {AVAILABLE_MODULES.map(m => (
                                <div key={m.id} className={`px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-widest ${plan.modules.includes(m.id) ? 'bg-[#10B981]/10 text-[#10B981]' : 'bg-black/5 text-black/20'}`}>
                                    {m.name}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && editingPlan && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                            onClick={() => setIsModalOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden"
                        >
                            <div className="p-6 border-b border-black/5 flex justify-between items-center">
                                <h2 className="text-xl font-black uppercase tracking-tight italic">Blueprint: {editingPlan.id ? 'Refine Plan' : 'New Plan'}</h2>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-black/5 rounded-full"><X size={20} /></button>
                            </div>

                            <form onSubmit={handleSave} className="p-6 space-y-5">
                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-black/30 ml-1">Plan Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={editingPlan.name}
                                            onChange={e => setEditingPlan({ ...editingPlan, name: e.target.value })}
                                            className="w-full bg-[#FAF7F2] border border-black/5 rounded-xl py-3 px-4 font-bold text-sm outline-none focus:border-black transition-all"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[9px] font-black uppercase tracking-widest text-black/30 ml-1">Monthly Price (₹)</label>
                                            <input
                                                type="number"
                                                required
                                                value={editingPlan.price_monthly}
                                                onChange={e => setEditingPlan({ ...editingPlan, price_monthly: e.target.value })}
                                                className="w-full bg-[#FAF7F2] border border-black/5 rounded-2xl py-3 px-4 font-bold text-sm outline-none focus:border-black transition-all"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[9px] font-black uppercase tracking-widest text-black/30 ml-1">Yearly Price (₹)</label>
                                            <input
                                                type="number"
                                                required
                                                value={editingPlan.price_yearly}
                                                onChange={e => setEditingPlan({ ...editingPlan, price_yearly: e.target.value })}
                                                className="w-full bg-[#FAF7F2] border border-black/5 rounded-2xl py-3 px-4 font-bold text-sm outline-none focus:border-black transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-black/30 ml-1">Description</label>
                                        <textarea
                                            value={editingPlan.description}
                                            onChange={e => setEditingPlan({ ...editingPlan, description: e.target.value })}
                                            className="w-full bg-[#FAF7F2] border border-black/5 rounded-2xl py-3 px-4 font-bold text-sm outline-none focus:border-black transition-all min-h-[80px]"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-black/30 ml-1">Module Access</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {AVAILABLE_MODULES.map(m => (
                                                <button
                                                    key={m.id}
                                                    type="button"
                                                    onClick={() => toggleModule(m.id)}
                                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${editingPlan.modules.includes(m.id) ? 'bg-black text-white border-black ring-2 ring-black/10' : 'bg-white border-black/5 text-black/40 hover:border-black/20'}`}
                                                >
                                                    <div className={`w-3 h-3 rounded-full border ${editingPlan.modules.includes(m.id) ? 'bg-white border-white' : 'border-black/20'}`} />
                                                    {m.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 py-4 bg-black/5 text-black/40 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-black/10 transition-all"
                                    >
                                        Abort
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-2 px-10 py-4 bg-black text-white rounded-xl font-black uppercase tracking-widest text-[10px] hover:shadow-2xl transition-all flex items-center justify-center gap-2"
                                    >
                                        <Save size={16} /> Finalize Blueprint
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
