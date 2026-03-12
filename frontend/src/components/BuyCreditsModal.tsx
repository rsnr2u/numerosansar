import { useState, useEffect } from "react";
import { X, CreditCard, Sparkles, Tag, CheckCircle2, ChevronRight, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";

interface BuyCreditsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (data: any) => void;
}

interface Plan {
    id: number;
    name: string;
    credits: number;
    price_monthly: number;
    discount_price?: number;
    badge?: string;
    description: string;
    type: 'trial' | 'paid';
    status: 'active' | 'inactive';
    visibility: 'show' | 'hide';
}

export default function BuyCreditsModal({ isOpen, onClose, onSuccess }: BuyCreditsModalProps) {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(false);
    const [purchasing, setPurchasing] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (isOpen) {
            fetchPlans();
        }
    }, [isOpen]);

    const fetchPlans = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await api.get("/plans");
            const data = await res.json();
            // Filter: Only Paid, Active, and Visible packages
            const paidPlans = data.filter((p: Plan) => 
                p.type === 'paid' && 
                p.status === 'active' && 
                p.visibility === 'show'
            );
            setPlans(paidPlans);
        } catch (err: any) {
            setError("Failed to fetch packages");
        } finally {
            setLoading(false);
        }
    };

    const handlePurchase = async (planId: number) => {
        setPurchasing(true);
        setError("");
        try {
            const res = await api.post("/admin/credits/purchase", {
                plan_id: planId,
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.messages?.error || data.message || "Purchase failed");
            onSuccess(data);
            onClose();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setPurchasing(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="bg-[#4B2E83] px-8 py-6 flex items-center justify-between relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12">
                                <CreditCard size={120} className="text-white" />
                            </div>
                            <div className="relative z-10 flex items-center gap-4">
                                <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/10">
                                    <Sparkles className="text-[#C9A227]" size={24} />
                                </div>
                                <div>
                                    <h2 className="text-white font-black text-2xl uppercase tracking-tight">Acquire Credits</h2>
                                    <p className="text-purple-200/60 text-[10px] font-black uppercase tracking-[0.3em] mt-1">Select your analysis power package</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="relative z-10 p-3 hover:bg-white/10 rounded-2xl transition-all text-white/50 hover:text-white">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-8 overflow-y-auto custom-scrollbar">
                            {error && (
                                <div className="mb-6 flex items-center gap-3 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600">
                                    <AlertCircle size={20} />
                                    <p className="text-[10px] font-black uppercase tracking-widest">{error}</p>
                                </div>
                            )}

                            {loading ? (
                                <div className="py-20 text-center">
                                    <div className="animate-spin w-10 h-10 border-4 border-[#4B2E83] border-t-transparent rounded-full mx-auto mb-4" />
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Synchronizing Package Matrix...</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {plans.map((plan) => (
                                        <motion.div
                                            key={plan.id}
                                            whileHover={{ y: -5 }}
                                            className="group relative bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:border-[#4B2E83]/20 transition-all flex flex-col"
                                        >
                                            {plan.badge && (
                                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-[#C9A227] text-white text-[8px] font-black uppercase tracking-widest rounded-full shadow-lg z-10">
                                                    {plan.badge}
                                                </div>
                                            )}

                                            <div className="mb-6">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{plan.name}</span>
                                                    <Tag size={16} className="text-[#4B2E83]/20 group-hover:text-[#4B2E83] transition-colors" />
                                                </div>
                                                <div className="flex items-baseline gap-1">
                                                    <h3 className="text-4xl font-black text-slate-900 tracking-tighter">{plan.credits}</h3>
                                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Credits</span>
                                                </div>
                                            </div>

                                            <div className="space-y-4 mb-8 flex-1">
                                                <p className="text-[10px] text-slate-500 font-bold leading-relaxed">{plan.description}</p>
                                                <div className="pt-4 border-t border-slate-50">
                                                    <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-400">
                                                        <CheckCircle2 size={12} className="text-emerald-500" />
                                                        Per Credit: ₹{( (plan.discount_price ?? plan.price_monthly) / plan.credits).toFixed(1)}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-auto space-y-4">
                                                <div className="text-center">
                                                    {plan.discount_price ? (
                                                        <div className="flex flex-col items-center">
                                                            <span className="text-2xl font-black text-[#4B2E83]">₹{plan.discount_price.toLocaleString("en-IN")}</span>
                                                            <span className="text-[10px] font-bold text-slate-300 line-through leading-none">₹{plan.price_monthly.toLocaleString("en-IN")}</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-2xl font-black text-[#4B2E83]">₹{plan.price_monthly.toLocaleString("en-IN")}</span>
                                                    )}
                                                </div>

                                                <button
                                                    onClick={() => handlePurchase(plan.id)}
                                                    disabled={purchasing}
                                                    className="w-full py-4 bg-slate-50 group-hover:bg-[#4B2E83] text-slate-400 group-hover:text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                                                >
                                                    {purchasing ? "Processing..." : (
                                                        <>
                                                            Select Package <ChevronRight size={14} />
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-6 bg-slate-50/50 border-t border-slate-100 text-center">
                            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
                                Secure Encrypted Transaction | Credits Inductive Value
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
