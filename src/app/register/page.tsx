import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    User,
    Mail,
    Lock,
    CheckCircle2,
    ArrowRight,
    Loader2,
    Shield,
    Smartphone,
    Chrome,
    ArrowLeft,
    Check,
    Zap,
    AlertCircle
} from "lucide-react";
import { api } from "@/lib/api";
import { usePlatform } from "@/contexts/PlatformContext";

export default function RegisterPage() {
    const { config } = usePlatform();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [mounted, setMounted] = useState(false);

    const [formData, setFormData] = useState({
        username: "",
        full_name: "", // Added for backend
        email: "",
        mobile: "",    // Changed from phone
        password: "",
        role: "admin",
        plan_id: "",
        business_name: "", // Added for backend
        city: ""           // Added for backend
    });

    const [plans, setPlans] = useState<any[]>([]);

    useEffect(() => {
        setMounted(true);
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        setLoading(true);
        try {
            const res = await api.get("/plans");
            if (res.ok) {
                const data = await res.json();
                setPlans(Array.isArray(data) ? data : []);
                if (Array.isArray(data) && data.length > 0) {
                    setFormData(prev => ({ ...prev, plan_id: data[0].id }));
                }
            } else {
                setError("Unable to load plans. Please check your connection.");
            }
        } catch (err) {
            console.error("Failed to fetch plans", err);
            setError("Database connection error. Please ensure the server is fully operational.");
        } finally {
            setLoading(false);
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
                navigate("/login?registered=true");
            } else {
                setError(data.message || "Registration failed");
            }
        } catch (err) {
            setError("Connection failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const registrationHighlights = [
        "Select your credit pack",
        "No monthly commitments",
        "Access to all 9+ analysis tools",
        "Generate professional reports"
    ];

    return (
        <div className="min-h-screen flex items-stretch bg-white font-['Inter',_sans-serif]">
            {/* --- LEFT SECTION: Brand Panel (Desktop) --- */}
            <section className="hidden lg:flex w-5/12 relative bg-[#4B2E83] overflow-hidden flex-col justify-center px-16 text-white border-r border-white/5">
                {/* Background Patterns */}
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white opacity-[0.03] rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#C9A227] opacity-[0.05] rounded-full blur-[120px] translate-y-1/2 -translate-x-1/4" />

                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[#C9A227]/30 to-transparent" />

                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative z-10 space-y-12"
                >
                    <div className="space-y-6">
                        <Link to="/" className="text-2xl font-black tracking-tighter flex items-center gap-2">
                            <span className="text-[#C9A227]">{config?.platform_name ? config.platform_name.split(' ')[0] : 'NUMERO'}</span> {config?.platform_name ? config.platform_name.substring(config.platform_name.indexOf(' ') + 1) : 'SANSAR'}
                        </Link>
                        <div className="space-y-4">
                            <h1 className="text-5xl font-black leading-tight tracking-tight text-white">
                                Join the Elite <br />
                                <span className="text-[#C9A227]">Community.</span>
                            </h1>
                            <p className="text-lg text-purple-100/70 font-medium max-w-sm leading-relaxed">
                                Start your professional numerology journey with the most advanced software toolkit in India.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="flex items-center gap-4">
                            <div className="h-0.5 w-12 bg-[#C9A227]" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#C9A227]">Registration Benefits</span>
                        </div>
                        <div className="grid gap-6">
                            {registrationHighlights.map((text, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 + i * 0.1 }}
                                    className="flex items-center gap-4 group"
                                >
                                    <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-[#C9A227] border border-white/10 group-hover:bg-[#C9A227] group-hover:text-[#4B2E83] transition-all duration-300">
                                        <Check size={18} />
                                    </div>
                                    <span className="text-md font-bold text-white/90">{text}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="pt-12 border-t border-white/5">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30">© {config?.platform_name?.toUpperCase() || 'NUMERO SANSAR'} 2026</p>
                    </div>
                </motion.div>
            </section>

            {/* --- RIGHT SECTION: Form Area --- */}
            <section className="flex-1 flex flex-col justify-center items-center px-6 bg-slate-50 relative overflow-hidden py-20">
                <div className="lg:hidden absolute inset-0 bg-gradient-to-br from-[#4B2E83]/10 via-white to-[#C9A227]/5" />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-[500px] relative z-10"
                >
                    {/* Header for Mobile */}
                    <div className="lg:hidden mb-12 text-center space-y-2">
                        <Link to="/" className="text-2xl font-black text-[#4B2E83] flex items-center justify-center gap-2">
                            <span className="text-[#C9A227]">{config?.platform_name ? config.platform_name.split(' ')[0] : 'NUMERO'}</span> {config?.platform_name ? config.platform_name.substring(config.platform_name.indexOf(' ') + 1) : 'SANSAR'}
                        </Link>
                    </div>

                    <div className="bg-white rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(75,46,131,0.12)] border border-slate-100 p-8 md:p-12 space-y-10">
                        {/* Step Indicator */}
                        <div className="flex items-center gap-4 pb-4">
                            <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-[#4B2E83]"
                                    initial={{ width: "50%" }}
                                    animate={{ width: step === 1 ? "50%" : "100%" }}
                                />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Step {step} of 2</span>
                        </div>

                        <AnimatePresence mode="wait">
                            {step === 1 ? (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-8"
                                >
                                    <div className="space-y-2 text-center lg:text-left">
                                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Select Your Plan</h2>
                                        <p className="text-slate-400 font-bold text-sm">Choose the credit pack that fits your consultation volume.</p>
                                    </div>

                                    <div className="grid gap-4 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
                                        {loading && plans.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center py-20 space-y-4 bg-slate-50/50 rounded-[2rem] border-2 border-dashed border-slate-200">
                                                <Loader2 className="animate-spin text-[#4B2E83]" size={32} />
                                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Negotiating with server...</p>
                                            </div>
                                        ) : plans.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center py-20 space-y-4 bg-red-50/30 rounded-[2rem] border-2 border-dashed border-red-100">
                                                <AlertCircle className="text-red-400" size={32} />
                                                <div className="text-center px-6">
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-red-500">Service Interrupted</p>
                                                    <p className="text-xs font-bold text-slate-400 mt-1">We couldn't retrieve the pricing packs. Please try refreshing or contact support.</p>
                                                </div>
                                                <button
                                                    onClick={fetchPlans}
                                                    className="px-6 py-2 bg-white border border-slate-200 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all text-slate-600"
                                                >
                                                    Retry Connection
                                                </button>
                                            </div>
                                        ) : (
                                            plans.map((plan) => (
                                                <button
                                                    key={plan.id}
                                                    onClick={() => {
                                                        setFormData({ ...formData, plan_id: plan.id });
                                                        setStep(2);
                                                    }}
                                                    className={`w-full p-6 text-left rounded-[2rem] border transition-all relative group flex flex-col md:flex-row md:items-center justify-between gap-6 ${formData.plan_id === plan.id ? 'border-[#4B2E83] bg-[#4B2E83]/5 ring-4 ring-[#4B2E83]/5' : 'border-slate-100 bg-white hover:border-[#4B2E83]/30 hover:shadow-lg'}`}
                                                >
                                                    {plan.name === "Professional Pack" && (
                                                        <div className="absolute -top-3 left-6 px-4 py-1 bg-[#C9A227] text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg">
                                                            Most Popular
                                                        </div>
                                                    )}

                                                    <div className="flex items-center gap-5">
                                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 scale-110 group-hover:scale-100 ${formData.plan_id === plan.id ? 'bg-[#4B2E83] text-white shadow-xl shadow-purple-900/20' : 'bg-slate-50 text-[#4B2E83] group-hover:bg-[#4B2E83]/10'}`}>
                                                            {plan.name.toLowerCase().includes("master") ? <Zap size={24} /> :
                                                                plan.name.toLowerCase().includes("professional") ? <Zap size={24} /> :
                                                                    <Shield size={24} />}
                                                        </div>
                                                        <div className="space-y-1">
                                                            <h4 className="font-black text-slate-400 uppercase tracking-widest text-[10px] items-center flex gap-2">
                                                                {plan.name}
                                                                {formData.plan_id === plan.id && <Check size={12} className="text-[#C9A227]" />}
                                                            </h4>
                                                            <div className="text-2xl font-black text-slate-800 leading-none">
                                                                {plan.credits} Credits
                                                            </div>
                                                            <p className="text-xs text-slate-400 font-bold max-w-[200px] leading-relaxed">
                                                                {plan.description}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="md:text-right border-t md:border-t-0 border-slate-50 pt-4 md:pt-0">
                                                        <div className="text-2xl font-black text-[#4B2E83] tracking-tight">₹{plan.price || plan.price_monthly}</div>
                                                        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#C9A227]">One-Time Pack</div>
                                                    </div>
                                                </button>
                                            ))
                                        )}
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.form
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    onSubmit={handleRegister}
                                    className="space-y-8"
                                >
                                    <div className="space-y-2 text-center lg:text-left">
                                        <div className="flex items-center gap-2 justify-center lg:justify-start">
                                            <button onClick={() => setStep(1)} className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-[#4B2E83] transition-colors">
                                                <ArrowLeft size={18} />
                                            </button>
                                            <h2 className="text-3xl font-black text-slate-900 tracking-tight">User Details</h2>
                                        </div>
                                        <p className="text-slate-400 font-bold text-sm tracking-wide">Set up your professional credentials to begin.</p>
                                    </div>

                                    <div className="space-y-5">
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Username</label>
                                                <div className="relative group">
                                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#4B2E83] transition-colors">
                                                        <User size={18} />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        value={formData.full_name}
                                                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value, username: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
                                                        required
                                                        placeholder="Full Name / Consultant Name"
                                                        className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#4B2E83]/5 focus:bg-white focus:border-[#4B2E83]/20 transition-all font-bold"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Email</label>
                                                    <div className="relative group">
                                                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#4B2E83] transition-colors">
                                                            <Mail size={18} />
                                                        </div>
                                                        <input
                                                            type="email"
                                                            value={formData.email}
                                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                            required
                                                            placeholder="you@email.com"
                                                            className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#4B2E83]/5 focus:bg-white focus:border-[#4B2E83]/20 transition-all font-bold"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Phone</label>
                                                    <div className="relative group">
                                                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#4B2E83] transition-colors">
                                                            <Smartphone size={18} />
                                                        </div>
                                                        <input
                                                            type="tel"
                                                            value={formData.mobile}
                                                            onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                                                            required
                                                            placeholder="+91 XXXXX XXXXX"
                                                            className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#4B2E83]/5 focus:bg-white focus:border-[#4B2E83]/20 transition-all font-bold"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Business Name</label>
                                                    <div className="relative group">
                                                        <input
                                                            type="text"
                                                            value={formData.business_name}
                                                            onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                                                            required
                                                            placeholder="Spiritual Center"
                                                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#4B2E83]/5 focus:bg-white focus:border-[#4B2E83]/20 transition-all font-bold"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">City</label>
                                                    <div className="relative group">
                                                        <input
                                                            type="text"
                                                            value={formData.city}
                                                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                                            required
                                                            placeholder="Bangalore"
                                                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#4B2E83]/5 focus:bg-white focus:border-[#4B2E83]/20 transition-all font-bold"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Password</label>
                                                <div className="relative group">
                                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#4B2E83] transition-colors">
                                                        <Lock size={18} />
                                                    </div>
                                                    <input
                                                        type="password"
                                                        value={formData.password}
                                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                        required
                                                        placeholder="••••••••"
                                                        className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#4B2E83]/5 focus:bg-white focus:border-[#4B2E83]/20 transition-all font-bold"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {error && (
                                        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl">
                                            <p className="text-[10px] font-black text-red-500 text-center uppercase tracking-widest leading-relaxed">{error}</p>
                                        </div>
                                    )}

                                    <div className="space-y-4">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full py-5 bg-[#C9A227] text-[#4B2E83] rounded-2xl font-black text-lg hover:bg-[#D9B43A] transition-all flex items-center justify-center gap-3 shadow-xl shadow-amber-500/10 active:scale-[0.98] group disabled:opacity-50"
                                        >
                                            {loading ? <Loader2 className="animate-spin" /> : (
                                                <>
                                                    Begin Journey 🙏 <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                                </>
                                            )}
                                        </button>
                                        <div className="flex items-center justify-center py-2 relative">
                                            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t border-slate-100"></div>
                                            <span className="relative z-10 bg-white px-4 text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">OR</span>
                                        </div>
                                        <button className="w-full py-4 border-2 border-slate-50 text-slate-600 rounded-2xl font-black text-sm hover:bg-slate-50 hover:border-slate-100 transition-all flex items-center justify-center gap-3 active:scale-[0.98]">
                                            <Chrome size={18} /> Register with Google
                                        </button>
                                    </div>
                                </motion.form>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="mt-10 text-center space-y-6">
                        <p className="text-slate-400 font-bold text-sm">
                            Already have an account?
                        </p>
                        <Link to="/login" className="inline-flex px-10 py-5 bg-white border-2 border-[#4B2E83]/10 text-[#4B2E83] rounded-2xl font-black text-lg hover:bg-[#4B2E83] hover:text-white transition-all shadow-lg active:scale-95">
                            Sign In Instead
                        </Link>
                    </div>
                </motion.div>
            </section>
        </div>
    );
}
