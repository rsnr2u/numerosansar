import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
    CheckCircle2,
    Mail,
    Lock,
    Eye,
    EyeOff,
    ArrowRight,
    Chrome,
    AlertCircle,
    Loader2
} from "lucide-react";
import { api } from "@/lib/api";

export default function LoginPage() {
    const navigate = useNavigate();
    const [mounted, setMounted] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await api.post("/login", { username: email, password });
            const data = await res.json();

            if (res.ok) {
                // Save tokens
                localStorage.setItem("token", data.token);
                localStorage.setItem("admin_token", data.token);
                localStorage.setItem("user_role", data.user.role);
                localStorage.setItem("username", data.user.username);

                // Role-based redirection
                if (data.user.role === 'super_admin') {
                    navigate("/super-admin/dashboard");
                } else {
                    navigate("/admin/dashboard");
                }
            } else {
                setError(data.message || "Invalid credentials. Please try again.");
            }
        } catch (err) {
            console.error("Login Error:", err);
            setError("Connection failed. Please ensure the server is running.");
        } finally {
            setLoading(false);
        }
    };

    const features = [
        "Name Astrology Analysis",
        "Business Name Numerology",
        "Lo Shu Grid Analysis",
        "Client Management Dashboard"
    ];

    return (
        <div className="min-h-screen flex items-stretch bg-white font-['Inter',_sans-serif]">
            {/* --- LEFT SECTION: Brand Panel (Desktop Only) --- */}
            <section className="hidden lg:flex w-1/2 relative bg-[#4B2E83] overflow-hidden flex-col justify-center px-20 text-white">
                {/* Background Patterns */}
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white opacity-[0.03] rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#C9A227] opacity-[0.05] rounded-full blur-[120px] translate-y-1/2 -translate-x-1/4" />

                {/* Numerology Themed Graphic (Subtle) */}
                <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
                    <div className="grid grid-cols-6 gap-8 p-12 h-fit">
                        {Array.from({ length: 24 }).map((_, i) => (
                            <div key={i} className="text-4xl font-black">{i + 1}</div>
                        ))}
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative z-10 space-y-12"
                >
                    <div className="space-y-4">
                        <Link to="/" className="text-2xl font-black tracking-tighter flex items-center gap-2">
                            <span className="text-[#C9A227]">NUMERO</span> SANSAR
                        </Link>
                        <h1 className="text-5xl md:text-6xl font-black leading-tight tracking-tight text-white">
                            Professional <br />
                            <span className="text-[#C9A227]">Numerology</span> Software
                        </h1>
                        <p className="text-xl text-purple-100/80 font-medium max-w-lg leading-relaxed">
                            Perform accurate numerology analysis, manage client consultations, and generate insights using Chaldean and Pythagorean systems.
                        </p>
                    </div>

                    <div className="grid gap-6">
                        {features.map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 + i * 0.1 }}
                                className="flex items-center gap-4 group"
                            >
                                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-[#C9A227] group-hover:bg-[#C9A227] group-hover:text-[#4B2E83] transition-all duration-300">
                                    <CheckCircle2 size={20} />
                                </div>
                                <span className="text-lg font-bold">{feature}</span>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Footer Text */}
                <div className="absolute bottom-12 left-20">
                    <p className="text-sm font-bold opacity-30 tracking-widest uppercase">© NUMERO SANSAR</p>
                </div>
            </section>

            {/* --- RIGHT SECTION: Login Card --- */}
            <section className="flex-1 flex flex-col justify-center items-center px-6 bg-slate-50 relative overflow-hidden">
                {/* Subtle Animated Gradient Background for Mobile */}
                <div className="lg:hidden absolute inset-0 bg-gradient-to-br from-[#4B2E83]/10 via-white to-[#C9A227]/5" />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-[420px] relative z-10"
                >
                    {/* Brand Icon for Mobile */}
                    <div className="lg:hidden mb-12 text-center space-y-2">
                        <div className="w-16 h-16 bg-[#4B2E83] text-[#C9A227] rounded-2xl flex items-center justify-center mx-auto shadow-xl shadow-purple-900/20 active:scale-95 transition-transform cursor-pointer">
                            <span className="text-2xl font-black">NS</span>
                        </div>
                        <h2 className="text-2xl font-black text-[#4B2E83]">NUMERO SANSAR</h2>
                    </div>

                    <div className="bg-white rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(75,46,131,0.12)] border border-slate-100 p-8 md:p-12 space-y-10">
                        <div className="space-y-2 text-center lg:text-left">
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Login to Your Account</h2>
                            <p className="text-slate-400 font-bold text-sm tracking-wide">Access your numerology consultation dashboard.</p>
                        </div>

                        <form className="space-y-6" onSubmit={handleLogin}>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3"
                                >
                                    <AlertCircle className="text-red-500 shrink-0" size={18} />
                                    <p className="text-[10px] font-black text-red-500 uppercase tracking-widest leading-relaxed">{error}</p>
                                </motion.div>
                            )}

                            <div className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Email or Username</label>
                                    <div className="relative group">
                                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#4B2E83] transition-colors">
                                            <Mail size={18} />
                                        </div>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="you@example.com"
                                            className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#4B2E83]/5 focus:bg-white focus:border-[#4B2E83]/20 transition-all font-bold"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between items-center ml-1">
                                        <label className="text-xs font-black uppercase tracking-widest text-slate-400">Password</label>
                                        <Link to="/forgot-password" className="text-xs font-black uppercase tracking-widest text-[#4B2E83] hover:text-[#C9A227] transition-colors">
                                            Forgot Password?
                                        </Link>
                                    </div>
                                    <div className="relative group">
                                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#4B2E83] transition-colors">
                                            <Lock size={18} />
                                        </div>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full pl-14 pr-14 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#4B2E83]/5 focus:bg-white focus:border-[#4B2E83]/20 transition-all font-bold"
                                        />
                                        <button
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-[#4B2E83] transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 ml-1">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative w-5 h-5 bg-slate-100 border border-slate-200 rounded-md group-hover:border-[#4B2E83]/30 transition-all">
                                        <input type="checkbox" className="peer absolute inset-0 opacity-0 cursor-pointer" />
                                        <div className="absolute inset-1 bg-[#4B2E83] rounded-[3px] scale-0 peer-checked:scale-100 transition-transform" />
                                    </div>
                                    <span className="text-sm font-bold text-slate-500">Remember Me</span>
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-5 bg-[#C9A227] text-[#4B2E83] rounded-2xl font-black text-lg hover:bg-[#D9B43A] transition-all flex items-center justify-center gap-3 shadow-xl shadow-amber-500/10 active:scale-[0.98] group disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : (
                                    <>
                                        Login <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>

                            <div className="relative flex items-center justify-center py-2">
                                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                                <span className="relative bg-white px-4 text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">OR</span>
                            </div>

                            <button className="w-full py-4 border-2 border-slate-50 text-slate-600 rounded-2xl font-black text-sm hover:bg-slate-50 hover:border-slate-100 transition-all flex items-center justify-center gap-3 active:scale-[0.98]">
                                <Chrome size={18} /> Login with Google
                            </button>
                        </form>
                    </div>

                    <div className="mt-10 text-center space-y-6">
                        <p className="text-slate-400 font-bold text-sm">
                            New to NUMERO SANSAR?
                        </p>
                        <Link to="/register" className="inline-flex px-10 py-5 bg-white border-2 border-[#4B2E83]/10 text-[#4B2E83] rounded-2xl font-black text-lg hover:bg-[#4B2E83] hover:text-white transition-all shadow-lg active:scale-95">
                            Create Free Account
                        </Link>
                    </div>

                    <div className="lg:hidden mt-20 text-center">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">© NUMERO SANSAR</p>
                    </div>
                </motion.div>
            </section>
        </div>
    );
}
