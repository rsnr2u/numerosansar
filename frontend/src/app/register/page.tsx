"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Check, ArrowRight, User, Lock, Mail, ShieldCheck, Star } from "lucide-react";

interface Plan {
    id: number;
    name: string;
    price_monthly: string;
    price_yearly: string;
    modules: string[];
    description: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export default function Register() {
    const router = useRouter();
    const [plans, setPlans] = useState<Plan[]>([]);
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
    const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
    const [step, setStep] = useState(1);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        fetch(`${BASE_URL}/plans`)
            .then(res => res.json())
            .then(data => {
                setPlans(data);
                if (data.length > 0) setSelectedPlan(data[1] ? data[1].id : data[0].id);
            });
    }, []);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const res = await fetch(`${BASE_URL}/register`, {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({
                    username,
                    password,
                    plan_id: selectedPlan?.toString() || "",
                    billing_cycle: billingCycle
                })
            });

            const data = await res.json();
            if (res.ok) {
                router.push("/admin/login?registered=true");
            } else {
                setError(data.message || "Registration failed");
            }
        } catch (err) {
            setError("Connection error. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#FEF9F2] text-[#2D2926] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-4xl bg-white border border-black/5 rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row shadow-2xl"
            >
                {/* Information Panel */}
                <div className="md:w-1/3 p-8 bg-[#F5EFE6] flex flex-col justify-between border-r border-black/5">
                    <div>
                        <div className="p-2 bg-gradient-to-r from-[#10B981] via-[#E61111] to-[#E61111] rounded-xl w-fit mb-6 shadow-lg">
                            <Sparkles className="text-white w-6 h-6" />
                        </div>
                        <h2 className="text-3xl font-black mb-4 tracking-tighter italic">Join the <br />Collective</h2>
                        <p className="text-xs font-bold text-black/40 leading-relaxed uppercase tracking-widest">
                            Professional numerology automation for the modern era.
                        </p>
                    </div>

                    <div className="space-y-4 pt-10">
                        {["Master Calculations", "AI Propagations", "Secure Archive"].map(s => (
                            <div key={s} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-black/60">
                                <div className="h-1.5 w-1.5 rounded-full bg-[#E61111]" /> {s}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Form Panel */}
                <div className="flex-1 p-6 md:p-10">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex gap-2">
                            <div className={`h-1 w-10 rounded-full transition-all ${step === 1 ? 'bg-[#10B981]' : 'bg-black/5'}`} />
                            <div className={`h-1 w-10 rounded-full transition-all ${step === 2 ? 'bg-[#10B981]' : 'bg-black/5'}`} />
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-widest text-black/20">Protocol Step {step}</span>
                    </div>

                    <AnimatePresence mode="wait">
                        {step === 1 ? (
                            <motion.div key="1" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-8">
                                <h3 className="text-xl font-black uppercase tracking-tight">Access Tiers</h3>

                                <div className="flex p-1 bg-black/5 rounded-xl border border-black/5 w-fit">
                                    <button onClick={() => setBillingCycle('monthly')} className={`px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${billingCycle === 'monthly' ? 'bg-white shadow-sm' : 'text-black/30 hover:text-black'}`}>Monthly</button>
                                    <button onClick={() => setBillingCycle('yearly')} className={`px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${billingCycle === 'yearly' ? 'bg-white shadow-sm' : 'text-black/30 hover:text-black'}`}>Yearly</button>
                                </div>

                                <div className="grid gap-4">
                                    {plans.map(p => (
                                        <button
                                            key={p.id}
                                            onClick={() => setSelectedPlan(p.id)}
                                            className={`p-5 rounded-2xl border-2 text-left transition-all ${selectedPlan === p.id ? 'border-[#10B981] bg-[#10B981]/5' : 'border-black/5 hover:border-black/20'}`}
                                        >
                                            <div className="flex justify-between items-center mb-1">
                                                <h4 className="font-black text-sm uppercase italic tracking-tight">{p.name}</h4>
                                                {selectedPlan === p.id && <Star size={14} className="fill-[#10B981] text-[#10B981]" />}
                                            </div>
                                            <div className="text-2xl font-black tracking-tighter">₹{billingCycle === 'monthly' ? parseInt(p.price_monthly).toLocaleString() : parseInt(p.price_yearly).toLocaleString()}</div>
                                        </button>
                                    ))}
                                </div>

                                <button onClick={() => setStep(2)} className="w-full bg-gradient-to-r from-[#10B981] via-[#E61111] to-[#E61111] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg active:scale-95 transition-all">Proceed to Account</button>
                            </motion.div>
                        ) : (
                            <motion.div key="2" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
                                <h3 className="text-xl font-black uppercase tracking-tight">Credentials</h3>
                                <form onSubmit={handleRegister} className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-black/30 ml-1">Username</label>
                                        <input
                                            type="text"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            className="w-full bg-black/5 border border-black/5 rounded-xl py-3 px-4 font-bold text-sm focus:border-[#10B981] outline-none"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-black/30 ml-1">Password</label>
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full bg-black/5 border border-black/5 rounded-xl py-3 px-4 font-bold text-sm focus:border-[#E61111] outline-none"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-black/30 ml-1">Verify</label>
                                        <input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="w-full bg-black/5 border border-black/5 rounded-xl py-3 px-4 font-bold text-sm focus:border-[#E61111] outline-none"
                                            required
                                        />
                                    </div>
                                    {error && <p className="text-xs font-bold text-red-500 text-center">{error}</p>}
                                    <div className="pt-4 flex gap-4">
                                        <button type="button" onClick={() => setStep(1)} className="flex-1 py-4 font-bold text-[10px] uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity">Back</button>
                                        <button type="submit" disabled={loading} className="flex-[2] bg-gradient-to-r from-[#10B981] via-[#E61111] to-[#E61111] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg transform active:scale-95 disabled:opacity-50">Initiate Profile</button>
                                    </div>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </main>
    );
}

