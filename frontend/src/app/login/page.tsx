"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { User, Lock, Loader2, ArrowLeft } from "lucide-react";
import { api } from "@/lib/api";

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (searchParams.get('registered')) {
            setSuccess("Account created successfully! Please sign in.");
        }
    }, [searchParams]);

    if (!mounted) return null;

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await api.post("/login", { username, password });
            const data = await res.json();

            if (res.ok) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("user_role", data.user.role);
                localStorage.setItem("username", data.user.username);

                if (data.user.role === 'super_admin') {
                    router.push("/super-admin/dashboard");
                } else {
                    router.push("/admin/dashboard");
                }
            } else {
                setError(data.message || "Invalid credentials.");
            }
        } catch (err: any) {
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
                {/* Information Panel */}
                <div className="md:w-1/3 p-8 bg-[#1E293B] flex flex-col justify-between text-white relative overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10rem] text-white/[0.03] select-none">ॐ</div>
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#D4940A] via-[#F09819] to-[#D4940A]" />
                    <div className="relative z-10">
                        <div className="p-2 bg-gradient-to-br from-[#D4940A] to-[#F09819] rounded-lg w-fit mb-6 shadow-lg">
                            <span className="text-white font-bold text-lg leading-none select-none">ॐ</span>
                        </div>
                        <h2 className="text-3xl font-bold mb-4 text-white tracking-tight">Welcome <br />Back, Seeker.</h2>
                        <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase leading-relaxed">
                            Continue your sacred journey with NumeroSansar.
                        </p>
                    </div>

                    <div className="space-y-4 pt-10 border-t border-white/5 relative z-10">
                        {["Sacred Analytics", "Divine Precision", "Blessed Guidance"].map(s => (
                            <div key={s} className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-slate-500">
                                <div className="h-1.5 w-1.5 rounded-full bg-[#D4940A]" /> {s}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Form Panel */}
                <div className="flex-1 p-8 md:p-12">
                    <div className="flex items-center justify-between mb-12">
                        <div className="flex items-center gap-2 group cursor-pointer" onClick={() => router.push('/')}>
                            <span className="text-[#D4940A] text-base">🙏</span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">NumeroSansar</span>
                        </div>
                        <button
                            onClick={() => router.push('/register')}
                            className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-[#D4940A] transition-colors"
                        >
                            Create Account
                        </button>
                    </div>

                    <div className="space-y-8">
                        <div className="space-y-2">
                            <h3 className="text-2xl font-bold tracking-tight text-[#1E293B]">Sign In</h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Enter your credentials to continue.</p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-5">
                            <div className="grid grid-cols-1 gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Username</label>
                                    <div className="relative group">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#D4940A] transition-colors" size={14} />
                                        <input
                                            type="text"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3.5 pl-11 pr-4 font-medium text-sm focus:border-[#D4940A] outline-none transition-all placeholder:text-slate-300"
                                            required
                                            placeholder="your_username"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Password</label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#D4940A] transition-colors" size={14} />
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3.5 pl-11 pr-4 font-medium text-sm focus:border-[#D4940A] outline-none transition-all placeholder:text-slate-300"
                                            required
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>
                            </div>

                            {error && (
                                <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="p-3 bg-red-50 border border-red-100 rounded-lg">
                                    <p className="text-[9px] font-bold text-red-500 text-center uppercase tracking-widest">{error}</p>
                                </motion.div>
                            )}

                            {success && (
                                <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="p-3 bg-emerald-50 border border-emerald-100 rounded-lg">
                                    <p className="text-[9px] font-bold text-emerald-600 text-center uppercase tracking-widest">{success}</p>
                                </motion.div>
                            )}

                            <div className="pt-4 space-y-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full btn-saffron py-4 rounded-lg text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                                >
                                    {loading ? <Loader2 className="animate-spin" size={14} /> : "Sign In 🙏"}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => router.push('/')}
                                    className="w-full py-2 flex items-center justify-center gap-2 text-[9px] font-bold uppercase tracking-widest text-slate-400 hover:text-[#D4940A] transition-colors"
                                >
                                    <ArrowLeft size={10} /> Back to Home
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </motion.div>
        </main>
    );
}
