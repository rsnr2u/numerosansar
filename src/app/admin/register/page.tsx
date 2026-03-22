import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    User,
    Mail,
    Lock,
    Smartphone,
    Building2,
    MapPin,
    CheckCircle2,
    Sparkles,
    ArrowLeft,
    ArrowRight,
    ShieldCheck
} from "lucide-react";
import { API_BASE_URL, ROUTES } from "@/lib/constants";

const BASE_URL = API_BASE_URL;

interface Plan {
    id: number;
    name: string;
    price_monthly: string;
    price_yearly: string;
    modules: string[];
    description: string;
}

export default function RegisterPage() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loadingPlans, setLoadingPlans] = useState(true);

    // Form State
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        full_name: "",
        email: "",
        mobile: "",
        business_name: "",
        city: "",
        plan_id: 1,
        billing_cycle: "monthly" as "monthly" | "yearly"
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        try {
            const resp = await fetch(`${BASE_URL}/plans`);
            const data = await resp.json();
            setPlans(data);
            if (data.length > 0) {
                setFormData(prev => ({ ...prev, plan_id: data[0].id }));
            }
        } catch (err) {
            console.error("Failed to fetch plans", err);
        } finally {
            setLoadingPlans(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await fetch(`${BASE_URL}/register`, {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams(formData as any),
            });

            const data = await response.json();

            if (response.ok) {
                navigate(`${ROUTES.ADMIN.LOGIN}?registered=true`);
            } else {
                setError(data.message || "Registration failed.");
            }
        } catch (err) {
            setError("Connection failure.");
        } finally {
            setLoading(false);
        }
    };

    const nextStep = () => setStep(s => s + 1);
    const prevStep = () => setStep(s => s - 1);

    return (
        <main className="min-h-screen bg-[#FEF9F2] py-12 px-4 flex flex-col items-center">
            <div className="max-w-4xl w-full">
                {/* Header */}
                <div className="text-center mb-10">
                    <div
                        className="p-3 bg-gradient-to-r from-[#10B981] via-[#E61111] to-[#E61111] rounded-2xl inline-block mb-4 shadow-lg cursor-pointer"
                        onClick={() => navigate(ROUTES.HOME)}
                    >
                        <Sparkles className="text-white w-6 h-6" />
                    </div>
                    <h2 className="text-3xl font-black uppercase tracking-tight italic text-[#2D2926]">Join the Hub</h2>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#2D2926]/30 mt-2">Professional Onboarding Protocol</p>
                </div>

                {/* Form Container */}
                <div className="bg-white rounded-[2.5rem] border border-black/5 shadow-2xl p-8 md:p-12 overflow-hidden relative">

                    {/* Progress Bar */}
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-black/5">
                        <motion.div
                            className="h-full bg-gradient-to-r from-[#10B981] to-[#E61111]"
                            initial={{ width: "33.33%" }}
                            animate={{ width: `${(step / 3) * 100}%` }}
                        />
                    </div>

                    <form onSubmit={handleRegister}>
                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-black/30 ml-1">Full Name</label>
                                            <div className="relative">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20" size={16} />
                                                <input
                                                    type="text"
                                                    required
                                                    value={formData.full_name}
                                                    onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                                                    className="w-full bg-[#FAF7F2] border border-black/5 rounded-2xl py-3.5 pl-12 pr-4 font-bold text-sm outline-none focus:border-[#10B981] transition-all"
                                                    placeholder="Ex: John Doe"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-black/30 ml-1">Email Address</label>
                                            <div className="relative">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20" size={16} />
                                                <input
                                                    type="email"
                                                    required
                                                    value={formData.email}
                                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                                    className="w-full bg-[#FAF7F2] border border-black/5 rounded-2xl py-3.5 pl-12 pr-4 font-bold text-sm outline-none focus:border-[#10B981] transition-all"
                                                    placeholder="john@example.com"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-black/30 ml-1">Mobile Access</label>
                                            <div className="relative">
                                                <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20" size={16} />
                                                <input
                                                    type="text"
                                                    required
                                                    value={formData.mobile}
                                                    onChange={e => setFormData({ ...formData, mobile: e.target.value })}
                                                    className="w-full bg-[#FAF7F2] border border-black/5 rounded-2xl py-3.5 pl-12 pr-4 font-bold text-sm outline-none focus:border-[#10B981] transition-all"
                                                    placeholder="+91 00000 00000"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-black/30 ml-1">Business Name (Optional)</label>
                                            <div className="relative">
                                                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20" size={16} />
                                                <input
                                                    type="text"
                                                    value={formData.business_name}
                                                    onChange={e => setFormData({ ...formData, business_name: e.target.value })}
                                                    className="w-full bg-[#FAF7F2] border border-black/5 rounded-2xl py-3.5 pl-12 pr-4 font-bold text-sm outline-none focus:border-[#10B981] transition-all"
                                                    placeholder="Ex: Astro Insights"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-1 md:col-span-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-black/30 ml-1">City of Operation</label>
                                            <div className="relative">
                                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20" size={16} />
                                                <input
                                                    type="text"
                                                    required
                                                    value={formData.city}
                                                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                                                    className="w-full bg-[#FAF7F2] border border-black/5 rounded-2xl py-3.5 pl-12 pr-4 font-bold text-sm outline-none focus:border-[#10B981] transition-all"
                                                    placeholder="Mumbai, IN"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="pt-4 flex justify-end">
                                        <button
                                            type="button"
                                            onClick={nextStep}
                                            className="px-8 py-4 bg-black text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-black/80 transition-all flex items-center gap-2"
                                        >
                                            Security Setup <ArrowRight size={14} />
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <div className="space-y-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-black/30 ml-1">Unique Username</label>
                                            <div className="relative">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20" size={16} />
                                                <input
                                                    type="text"
                                                    required
                                                    value={formData.username}
                                                    onChange={e => setFormData({ ...formData, username: e.target.value })}
                                                    className="w-full bg-[#FAF7F2] border border-black/5 rounded-2xl py-3.5 pl-12 pr-4 font-bold text-sm outline-none focus:border-[#10B981] transition-all"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-black/30 ml-1">Access Passcode</label>
                                            <div className="relative">
                                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20" size={16} />
                                                <input
                                                    type="password"
                                                    required
                                                    value={formData.password}
                                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                                    className="w-full bg-[#FAF7F2] border border-black/5 rounded-2xl py-3.5 pl-12 pr-4 font-bold text-sm outline-none focus:border-[#E61111] transition-all"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-4 flex justify-between items-center">
                                        <button onClick={prevStep} type="button" className="text-[10px] font-black uppercase tracking-widest text-black/20 hover:text-black transition-colors flex items-center gap-2">
                                            <ArrowLeft size={14} /> Profile
                                        </button>
                                        <button
                                            type="button"
                                            onClick={nextStep}
                                            className="px-8 py-4 bg-[#E61111] text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-[#E61111]/80 transition-all flex items-center gap-2"
                                        >
                                            Select Plan <ArrowRight size={14} />
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {step === 3 && (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-8"
                                >
                                    <div className="flex justify-center mb-6">
                                        <div className="inline-flex p-1 bg-[#FAF7F2] border border-black/5 rounded-2xl">
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, billing_cycle: 'monthly' })}
                                                className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${formData.billing_cycle === 'monthly' ? 'bg-[#10B981] text-white shadow-md' : 'text-black/40'}`}
                                            >
                                                Monthly
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, billing_cycle: 'yearly' })}
                                                className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${formData.billing_cycle === 'yearly' ? 'bg-[#10B981] text-white shadow-md' : 'text-black/40'}`}
                                            >
                                                Yearly (-20%)
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {plans.map(plan => (
                                            <div
                                                key={plan.id}
                                                onClick={() => setFormData({ ...formData, plan_id: plan.id })}
                                                className={`p-6 rounded-[2rem] border-2 cursor-pointer transition-all ${formData.plan_id === plan.id ? 'border-[#10B981] bg-[#10B981]/5 shadow-xl' : 'border-black/5 hover:border-black/10'}`}
                                            >
                                                <div className="flex justify-between items-start mb-4">
                                                    <h4 className="font-black uppercase tracking-tighter text-lg">{plan.name}</h4>
                                                    {formData.plan_id === plan.id && <CheckCircle2 className="text-[#10B981]" size={20} />}
                                                </div>
                                                <div className="mb-4">
                                                    <span className="text-3xl font-black">₹{formData.billing_cycle === 'monthly' ? plan.price_monthly : plan.price_yearly}</span>
                                                    <span className="text-[10px] uppercase font-black text-black/20 tracking-widest ml-1">/{formData.billing_cycle === 'monthly' ? 'mo' : 'yr'}</span>
                                                </div>
                                                <p className="text-[10px] font-bold text-black/40 leading-relaxed uppercase tracking-wide">{plan.description}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {error && <p className="text-[10px] font-bold text-red-500 text-center uppercase tracking-widest italic">{error}</p>}

                                    <div className="pt-4 flex justify-between items-center">
                                        <button onClick={prevStep} type="button" className="text-[10px] font-black uppercase tracking-widest text-black/20 hover:text-black transition-colors flex items-center gap-2">
                                            <ArrowLeft size={14} /> Security
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="px-10 py-5 bg-gradient-to-r from-[#10B981] to-[#E61111] text-white rounded-2xl font-black uppercase tracking-[0.3em] text-xs hover:shadow-2xl transition-all flex items-center gap-3 disabled:opacity-50"
                                        >
                                            {loading ? "Establishing..." : (
                                                <>Establish Membership <ShieldCheck size={18} /></>
                                            )}
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </form>
                </div>

                {/* Footer Link */}
                <div className="mt-8 text-center text-black/20 font-black uppercase tracking-widest text-[9px]">
                    Already established? <span onClick={() => navigate(ROUTES.ADMIN.LOGIN)} className="text-[#10B981] cursor-pointer hover:underline ml-1 uppercase">Enter Hub</span>
                </div>
            </div>
        </main>
    );
}
