"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Lock, CheckCircle2, ArrowRight, Loader2, Shield } from "lucide-react";
import { api } from "@/lib/api";

export default function RegisterPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [mounted, setMounted] = useState(false);

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        role: "admin",
        plan_id: "",
    });

    const [plans, setPlans] = useState<any[]>([]);

    useEffect(() => {
        setMounted(true);
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        try {
            const res = await api.get("/plans");
            if (res.ok) {
                const data = await res.json();
                setPlans(data);
                if (data.length > 0) setFormData(prev => ({ ...prev, plan_id: data[0].id }));
            }
        } catch (err) {
            console.error("Failed to fetch plans");
        }
    };

    if (!mounted) return null;

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await api.post("/register", formData);
            const data = await res.json();
            if (res.ok) {
                router.push("/login?registered=true");
            } else {
                setError(data.message || "Registration failed");
            }
        } catch (err) {
            setError("Connection failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#F8FAFC] text-[#1E293B] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-4xl bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col md:flex-row shadow-2xl"
            >
                {/* Left Panel */}
                <div className="md:w-1/3 p-8 bg-[#1E293B] text-white flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10rem] text-white/[0.03] select-none">ॐ</div>
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#D4940A] via-[#F09819] to-[#D4940A]" />
                    <div className="relative z-10">
                        <div className="p-2 bg-gradient-to-br from-[#D4940A] to-[#F09819] rounded-lg w-fit mb-6 shadow-lg">
                            <span className="text-white font-bold text-lg leading-none select-none">ॐ</span>
                        </div>
                        <h2 className="text-3xl font-bold mb-4 tracking-tight leading-tight">Begin Your <br />Sacred Journey.</h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                            Join the community of professional numerology consultants guided by divine wisdom.
                        </p>
                    </div>

                    <div className="space-y-4 pt-10 border-t border-white/5 relative z-10">
                        <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-[#D4940A]">
                            Step {step} of 2
                        </div>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-gradient-to-r from-[#D4940A] to-[#F09819]"
                                initial={{ width: "50%" }}
                                animate={{ width: step === 1 ? "50%" : "100%" }}
                            />
                        </div>
                    </div>
                </div>

                {/* Right Panel - Form */}
                <div className="flex-1 p-8 md:p-12 relative overflow-hidden">
                    <div className="flex items-center justify-between mb-12">
                        <div className="flex items-center gap-2 group cursor-pointer" onClick={() => router.push('/')}>
                            <span className="text-[#D4940A] text-base">🙏</span>
                            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-400">NumeroSansar</span>
                        </div>
                        <button
                            onClick={() => router.push('/login')}
                            className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-[#D4940A] transition-colors"
                        >
                            Sign In Instead
                        </button>
                    </div>

                    <AnimatePresence mode="wait">
                        {step === 1 ? (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="space-y-8"
                            >
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-bold tracking-tight">Choose Your Path</h3>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Select the plan that resonates with your practice.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {plans.map((plan) => (
                                        <button
                                            key={plan.id}
                                            onClick={() => {
                                                setFormData({ ...formData, plan_id: plan.id });
                                                setStep(2);
                                            }}
                                            className={`p-6 text-left border rounded-xl transition-all group ${formData.plan_id === plan.id ? 'border-[#D4940A] bg-amber-50/50' : 'border-slate-100 bg-white hover:border-[#D4940A]/30'}`}
                                        >
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="p-2 rounded-lg bg-amber-50 border border-amber-200/40 text-[#D4940A] group-hover:bg-[#1E293B] group-hover:text-[#F09819] transition-all">
                                                    <Shield size={16} />
                                                </div>
                                                <div className="text-xs font-black text-[#D4940A]">₹{plan.price}/mo</div>
                                            </div>
                                            <h4 className="font-bold text-sm tracking-tight mb-1">{plan.name}</h4>
                                            <p className="text-[10px] text-slate-500 font-medium line-clamp-2">{plan.description}</p>
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        ) : (
                            <motion.form
                                key="step2"
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                onSubmit={handleRegister}
                                className="space-y-6"
                            >
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-bold tracking-tight">Create Your Account</h3>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Set up your credentials to begin.</p>
                                </div>

                                <div className="grid grid-cols-1 gap-5">
                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Username</label>
                                        <div className="relative group">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#D4940A] transition-colors" size={14} />
                                            <input
                                                type="text"
                                                value={formData.username}
                                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3.5 pl-11 pr-4 font-medium text-sm focus:border-[#D4940A] outline-none transition-all"
                                                required
                                                placeholder="your_username"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                                        <div className="relative group">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#D4940A] transition-colors" size={14} />
                                            <input
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3.5 pl-11 pr-4 font-medium text-sm focus:border-[#D4940A] outline-none transition-all"
                                                required
                                                placeholder="your@email.com"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Password</label>
                                        <div className="relative group">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#D4940A] transition-colors" size={14} />
                                            <input
                                                type="password"
                                                value={formData.password}
                                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3.5 pl-11 pr-4 font-medium text-sm focus:border-[#D4940A] outline-none transition-all"
                                                required
                                                placeholder="••••••••"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {error && (
                                    <div className="p-3 bg-red-50 border border-red-100 rounded-lg">
                                        <p className="text-[9px] font-bold text-red-500 text-center uppercase tracking-widest">{error}</p>
                                    </div>
                                )}

                                <div className="pt-4 flex items-center gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="px-6 py-4 bg-slate-50 text-slate-500 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-slate-100 transition-all active:scale-95"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 btn-saffron py-4 rounded-lg text-xs uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                                    >
                                        {loading ? <Loader2 className="animate-spin" size={14} /> : (
                                            <>
                                                Begin Journey 🙏 <CheckCircle2 size={14} />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </main>
    );
}
