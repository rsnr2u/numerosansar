"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Lock, Mail, ArrowRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";

export default function SuperAdminLoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await api.post("/login", { username, password });
            const data = await res.json();

            if (res.ok) {
                if (!data.user || data.user.role !== 'super_admin') {
                    setError("Unauthorized: Access restricted to Master Administrators.");
                    setLoading(false);
                    return;
                }
                localStorage.setItem("token", data.token);
                localStorage.setItem("admin_token", data.token);
                localStorage.setItem("user_role", data.user.role);
                localStorage.setItem("username", data.user.username);
                router.push("/super-admin/dashboard");
            } else {
                const errorMsg = data.message || data.error || data._error || JSON.stringify(data);
                setError(errorMsg === "{}" ? "Authentication failed. Check credentials." : errorMsg);
            }
        } catch (err: any) {
            console.error("Login component catch:", err);
            const detail = err.message || JSON.stringify(err);
            setError(err.message === "Failed to fetch" || err.name === "TypeError"
                ? `Network failure. Connectivity lost. (${detail})`
                : `Universal connection failure. (${detail})`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FEF9F2] flex items-center justify-center p-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="bg-white border border-slate-200 p-12 rounded-[3rem] shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <ShieldCheck size={120} className="text-[#1E293B]" />
                    </div>

                    <div className="text-center mb-10 relative z-10">
                        <div className="inline-flex p-4 bg-[#1E293B] rounded-3xl mb-6 shadow-xl">
                            <ShieldCheck size={32} className="text-[#D4AF37]" />
                        </div>
                        <h1 className="text-3xl font-black uppercase italic tracking-tighter text-[#1E293B]">Master<span className="text-[#D4AF37]">OS</span></h1>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mt-2">Platform Administration Entry</p>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl"
                        >
                            <p className="text-[10px] font-black uppercase tracking-widest text-[#E61111] text-center">{error}</p>
                        </motion.div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6 relative z-10">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-4">Administrative Username</label>
                            <div className="relative group">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#1E293B] transition-colors" size={18} />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    className="w-full bg-slate-50 border border-slate-200 focus:border-[#1E293B] rounded-2xl py-4 pl-14 pr-6 font-bold text-sm outline-none transition-all focus:ring-4 focus:ring-slate-100"
                                    placeholder="admin"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-4">Security Protocol (Password)</label>
                            <div className="relative group">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#1E293B] transition-colors" size={18} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full bg-slate-50 border border-slate-200 focus:border-[#1E293B] rounded-2xl py-4 pl-14 pr-6 font-bold text-sm outline-none transition-all focus:ring-4 focus:ring-slate-100"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full group bg-[#1E293B] text-white rounded-2xl py-5 font-black uppercase text-xs tracking-[0.25em] flex items-center justify-center gap-2 hover:bg-[#334155] transition-all shadow-xl shadow-slate-200 active:scale-[0.98] disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : (
                                <>Access Core Entity <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>
                            )}
                        </button>
                    </form>

                    <div className="mt-10 text-center relative z-10">
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Authorized Personnel Only. Monitoring Active.</p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
