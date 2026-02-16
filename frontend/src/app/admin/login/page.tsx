"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, User, Sparkles, ArrowLeft, Loader2 } from "lucide-react";
import { api } from "@/lib/api";

export default function AdminLogin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        setMounted(true);
        if (searchParams.get('registered')) {
            setSuccess("Registration confirmed. Access your hub.");
        }
        if (searchParams.get('expired')) {
            const reason = searchParams.get('reason');
            setError(reason || "Session expired. Please login again.");
        }
    }, [searchParams]);

    if (!mounted) return null;

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            // Using the api utility for consistent behavior and safe JSON parsing
            const res = await api.post("/login", { username, password });

            const data = await res.json();

            if (res.ok) {
                // api utility handles 401 redirect if necessary, but here we expect successful login
                localStorage.setItem("admin_token", data.token);
                localStorage.setItem("user_role", data.user.role);
                localStorage.setItem("username", data.user.username);
                router.push("/admin/dashboard");
            } else {
                // Handle non-OK responses
                if (data._error) {
                    setError("Server returned an invalid response. Please contact support.");
                } else {
                    const errorMsg = data.message || data.error || JSON.stringify(data);
                    setError(errorMsg === "{}" ? "Invalid credentials." : errorMsg);
                }
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
        <main className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 selection:bg-[#6366F1] selection:text-white">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-sm bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-2xl relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Sparkles size={100} className="text-[#1E293B]" />
                </div>

                <div className="text-center mb-10 relative z-10">
                    <div
                        className="p-4 bg-[#1E293B] rounded-2xl inline-block mb-6 shadow-xl cursor-pointer hover:scale-105 transition-transform"
                        onClick={() => router.push('/')}
                    >
                        <Lock className="text-[#D4AF37] w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-black uppercase tracking-tight italic text-[#1E293B]">Hub Access</h2>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mt-2">Professional Protocol Only</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6 relative z-10">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Username</label>
                        <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#1E293B] transition-colors" size={18} />
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-6 font-bold text-sm outline-none focus:border-[#1E293B] focus:ring-4 focus:ring-slate-100 transition-all"
                                required
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Secure Key</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#1E293B] transition-colors" size={18} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-6 font-bold text-sm outline-none focus:border-[#1E293B] focus:ring-4 focus:ring-slate-100 transition-all"
                                required
                            />
                        </div>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-4 bg-red-50 border border-red-100 rounded-2xl"
                        >
                            <p className="text-[10px] font-black text-red-500 text-center uppercase tracking-widest">{error}</p>
                        </motion.div>
                    )}
                    {success && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl"
                        >
                            <p className="text-[10px] font-black text-emerald-600 text-center uppercase tracking-widest">{success}</p>
                        </motion.div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-[#1E293B] text-white font-black uppercase tracking-[0.2em] text-xs rounded-2xl shadow-xl shadow-slate-200 transform active:scale-[0.98] disabled:opacity-50 mt-4 transition-all hover:bg-[#334155] flex items-center justify-center gap-3"
                    >
                        {loading ? <Loader2 className="animate-spin" size={18} /> : "Enter Hub"}
                    </button>
                </form>

                <div className="mt-10 border-t border-slate-100 pt-8 text-center relative z-10">
                    <button
                        onClick={() => router.push("/")}
                        className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-[#1E293B] transition-colors inline-flex items-center gap-2 group"
                    >
                        <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" /> Universal Exit
                    </button>
                </div>
            </motion.div>
        </main>
    );
}

