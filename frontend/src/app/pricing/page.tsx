import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
    CheckCircle2,
    Zap,
    ChevronDown,
    ArrowRight,
    PlusCircle,
    Search,
    Briefcase,
    Smartphone,
    Car,
    Grid3X3,
    Calculator,
    Database,
    LineChart,
    PieChart,
    LayoutDashboard,
    Gift
} from "lucide-react";

export default function PricingPage() {
    const [mounted, setMounted] = useState(false);
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const creditPacks = [
        {
            name: "Starter Pack",
            price: "₹2,700",
            credits: "10 Credits",
            perAnalysis: "₹270 per analysis",
            buttonText: "Buy Starter Pack",
            popular: false,
            features: [
                "Name Astrology Analysis",
                "Business Name Numerology",
                "Mobile Number Analysis",
                "Vehicle Number Analysis",
                "Lo Shu Grid Analysis",
                "Yearly Prediction Insights",
                "Client Dashboard Access"
            ]
        },
        {
            name: "Professional Pack",
            price: "₹7,500",
            credits: "30 Credits",
            perAnalysis: "₹250 per analysis",
            buttonText: "Buy Professional Pack",
            popular: true,
            features: [
                "All numerology analysis tools",
                "Client profile management",
                "Saved analysis history",
                "Professional consultation workflow",
                "Generate numerology insights",
                "Priority Email Support",
                "Access to new features"
            ]
        },
        {
            name: "Master Pack",
            price: "₹22,000",
            credits: "100 Credits",
            perAnalysis: "₹220 per analysis",
            buttonText: "Buy Master Pack",
            popular: false,
            features: [
                "All analysis tools",
                "Unlimited client management",
                "Advanced consultation workflow",
                "Best value for active numerologists",
                "Personal account manager",
                "Early access to beta tools"
            ]
        }
    ];

    const inclusions = [
        { title: "Name Astrology Analysis", icon: <Search size={24} /> },
        { title: "Business Name Numerology", icon: <Briefcase size={24} /> },
        { title: "Mobile Number Analysis", icon: <Smartphone size={24} /> },
        { title: "Vehicle Number Analysis", icon: <Car size={24} /> },
        { title: "Lo Shu Grid Analysis", icon: <Grid3X3 size={24} /> },
        { title: "Driver & Conductor Number Calculations", icon: <Calculator size={24} /> },
        { title: "Composite Number Analysis", icon: <PieChart size={24} /> },
        { title: "Numerology Insight Generation", icon: <LineChart size={24} /> },
        { title: "Client Consultation Dashboard", icon: <LayoutDashboard size={24} /> }
    ];

    const faqs = [
        {
            q: "What is a credit?",
            a: "A credit allows one client numerology analysis in the system. Each time you perform a full analysis for a client (Name, Business, Mobile, etc.), one credit is consumed."
        },
        {
            q: "Do credits expire?",
            a: "No, credits purchased on NUMERO SANSAR do not have an expiration date. They remain available for use in your account until they are consumed."
        },
        {
            q: "Can I upgrade my pack later?",
            a: "Yes, you can purchase additional credit packs at any time. The credits will simply be added to your current balance."
        },
        {
            q: "Is the free trial available?",
            a: "Yes, all new users receive 3 free credits upon registration to explore the software's capabilities and consultation workflow."
        }
    ];

    return (
        <div className="min-h-screen bg-white text-slate-900 selection:bg-[#4B2E83] selection:text-white">
            <Header />

            <main>
                {/* --- SECTION 1: Page Header --- */}
                <section className="pt-32 pb-16 px-6 bg-gradient-to-b from-[#4B2E83]/10 to-white overflow-hidden text-center">
                    <div className="max-w-4xl mx-auto space-y-6 relative">
                        {/* Abstract background elements */}
                        <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#C9A227]/10 rounded-full blur-3xl animate-pulse" />
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#4B2E83]/10 rounded-full blur-3xl" />

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="space-y-4"
                        >
                            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-[#4B2E83] leading-tight">
                                Simple <span className="text-[#C9A227]">Credit-Based</span> Pricing
                            </h1>
                            <p className="text-xl text-slate-600 max-w-2xl mx-auto font-medium">
                                Choose the credit pack that fits your consultation volume. Each credit allows you to perform one client numerology analysis using NUMERO SANSAR.
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* --- SECTION 2: Free Trial --- */}
                <section className="pb-12 px-6">
                    <div className="max-w-5xl mx-auto relative group">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-[#4B2E83] rounded-[2.5rem] p-1 shadow-2xl overflow-hidden"
                        >
                            <div className="bg-white rounded-[2.3rem] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-12 border border-purple-100">
                                <div className="space-y-6 flex-1 text-center md:text-left">
                                    <div className="flex flex-col items-center md:items-start gap-3">
                                        <div className="w-12 h-12 bg-[#4B2E83]/5 rounded-2xl flex items-center justify-center text-[#4B2E83]">
                                            <Gift size={32} />
                                        </div>
                                        <h2 className="text-3xl font-black text-[#4B2E83]">Free Trial</h2>
                                    </div>
                                    <p className="text-lg text-slate-600 font-bold tracking-tight">Try NUMERO SANSAR before purchasing credits.</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                                        {[
                                            "3 Free Client Analyses",
                                            "Access to all numerology tools",
                                            "Test name analysis & Lo Shu grid",
                                            "Explore consultation workflow"
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-center gap-3 text-sm text-slate-700 font-bold">
                                                <div className="w-5 h-5 bg-[#C9A227]/20 rounded-full flex items-center justify-center">
                                                    <CheckCircle2 size={14} className="text-[#C9A227]" />
                                                </div>
                                                {item}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex-shrink-0">
                                    <Link to="/register" className="group px-10 py-5 bg-[#4B2E83] text-white rounded-2xl font-black text-xl hover:bg-[#5D3AB0] transition-all flex items-center justify-center gap-2 shadow-2xl shadow-purple-900/40 active:scale-95">
                                        Start Free Trial <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* --- SECTION 3: Credit Packs --- */}
                <section className="py-24 px-6 bg-slate-50 border-y border-slate-100">
                    <div className="max-w-7xl mx-auto space-y-16">
                        <div className="text-center space-y-4">
                            <h2 className="text-3xl md:text-4xl font-extrabold text-[#4B2E83]">Flexible Credit Packs</h2>
                            <div className="h-1 w-20 bg-[#C9A227] mx-auto rounded-full" />
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {creditPacks.map((pack, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className={`relative bg-white rounded-[2.5rem] p-1 ${pack.popular ? 'shadow-2xl ring-2 ring-[#4B2E83] scale-105' : 'shadow-xl border border-slate-100'} group hover:-translate-y-2 transition-all duration-500`}
                                >
                                    {pack.popular && (
                                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-1.5 bg-[#C9A227] text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-full shadow-xl">
                                            Most Popular
                                        </div>
                                    )}

                                    <div className="bg-white rounded-[2.3rem] p-8 space-y-10 flex flex-col h-full">
                                        <div className="space-y-4 text-center border-b border-slate-50 pb-8">
                                            <h3 className="text-xl font-black text-slate-400 uppercase tracking-widest leading-none">{pack.name}</h3>
                                            <div className="space-y-1 pt-2">
                                                <div className="text-5xl font-black text-[#4B2E83] tracking-tighter">{pack.price}</div>
                                                <div className="text-2xl font-black text-[#C9A227] tracking-tight">{pack.credits}</div>
                                                <div className="text-xs font-black text-slate-400 uppercase tracking-widest">{pack.perAnalysis}</div>
                                            </div>
                                        </div>

                                        <div className="flex-1 space-y-4 pt-4">
                                            {pack.features.map((feature, fIdx) => (
                                                <div key={fIdx} className="flex items-start gap-4 text-sm text-slate-600 font-bold leading-relaxed">
                                                    <CheckCircle2 size={16} className={`mt-0.5 shrink-0 ${pack.popular ? 'text-[#C9A227]' : 'text-slate-300'}`} />
                                                    {feature}
                                                </div>
                                            ))}
                                        </div>

                                        <div className="pt-8">
                                            <Link
                                                to="/register"
                                                className={`w-full py-5 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-2 group/btn active:scale-95 ${pack.popular ? 'bg-[#4B2E83] text-white shadow-xl hover:bg-[#5D3AB0]' : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'}`}
                                            >
                                                {pack.buttonText}
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* --- SECTION 4: What Each Credit Includes --- */}
                <section className="py-24 px-6 bg-white overflow-hidden">
                    <div className="max-w-7xl mx-auto space-y-20">
                        <div className="text-center space-y-4">
                            <h2 className="text-3xl md:text-4xl font-extrabold text-[#4B2E83]">What You Get with Each Credit</h2>
                            <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium">Unlock the full power of NUMERO SANSAR with every consultation.</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {inclusions.map((item, idx) => (
                                <motion.div
                                    key={idx}
                                    whileHover={{ y: -5 }}
                                    className="p-8 rounded-[2rem] bg-slate-50 border border-slate-100 shadow-sm transition-all hover:bg-white hover:shadow-xl group"
                                >
                                    <div className="flex items-center gap-6">
                                        <div className="w-14 h-14 bg-white text-[#4B2E83] rounded-2xl flex items-center justify-center shadow-md group-hover:bg-[#4B2E83] group-hover:text-white transition-all scale-110 group-hover:scale-100 group-hover:rotate-6">
                                            {item.icon}
                                        </div>
                                        <h4 className="font-bold text-slate-800 leading-snug">{item.title}</h4>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* --- SECTION 5: Why Credit-Based Pricing --- */}
                <section className="py-24 px-6 bg-[#4B2E83] relative overflow-hidden">
                    {/* Background decorations */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#C9A227]/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

                    <div className="max-w-4xl mx-auto text-center space-y-10 relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="space-y-6"
                        >
                            <h2 className="text-3xl md:text-5xl font-black text-white leading-tight underline decoration-[#C9A227] decoration-4 underline-offset-8">
                                Flexible Pricing for <br /> Professional Numerologists
                            </h2>
                            <div className="space-y-8 text-lg md:text-xl text-purple-100/80 font-medium leading-relaxed max-w-3xl mx-auto">
                                <p>
                                    NUMERO SANSAR uses a credit-based model so numerologists only pay for the consultations they perform.
                                </p>
                                <p className="text-white font-bold">
                                    This flexible pricing allows practitioners to scale their usage based on their client volume without monthly commitments.
                                </p>
                                <p>
                                    Credits are used whenever a client numerology analysis is performed, ensuring you get maximum value from your investment.
                                </p>
                            </div>
                        </motion.div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-10 border-t border-white/10">
                            {[
                                { val: "Flexible Scale", label: "No Monthly Fees" },
                                { val: "Transparent", label: "Pay Per Client" },
                                { val: "No Expiry", label: "Use Anytime" }
                            ].map((stat, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="text-[#C9A227] text-2xl font-black">{stat.val}</div>
                                    <div className="text-purple-200 text-xs font-bold uppercase tracking-widest">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* --- SECTION 7: FAQ Section --- */}
                <section className="py-24 px-6 bg-slate-50 border-y border-slate-100">
                    <div className="max-w-3xl mx-auto space-y-16">
                        <div className="text-center space-y-4">
                            <h2 className="text-3xl md:text-4xl font-extrabold text-[#4B2E83]">Frequently Asked Questions</h2>
                            <div className="h-1 w-20 bg-[#C9A227] mx-auto rounded-full" />
                        </div>

                        <div className="space-y-4">
                            {faqs.map((faq, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={false}
                                    className="border border-slate-200 rounded-3xl bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <button
                                        onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                        className="w-full flex items-center justify-between p-7 text-left group"
                                    >
                                        <span className="text-lg font-bold text-slate-800 transition-colors group-hover:text-[#4B2E83]">
                                            {faq.q}
                                        </span>
                                        <div className={`p-2 rounded-xl transition-all ${openFaq === idx ? 'bg-[#4B2E83] text-white rotate-180' : 'bg-slate-50 text-slate-400 group-hover:bg-slate-100 group-hover:text-slate-600'}`}>
                                            <ChevronDown size={20} />
                                        </div>
                                    </button>
                                    <AnimatePresence initial={false}>
                                        {openFaq === idx && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <div className="p-7 pt-0 text-slate-600 font-medium leading-relaxed border-t border-slate-50">
                                                    {faq.a}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* --- SECTION 6: Call to Action --- */}
                <section className="py-24 px-6 bg-white overflow-hidden relative">
                    <div className="max-w-5xl mx-auto relative z-10 group">
                        <motion.div
                            whileHover={{ scale: 1.01 }}
                            className="bg-[#4B2E83] rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl transition-all duration-500"
                        >
                            {/* Accent background glows */}
                            <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 animate-pulse" />
                            <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#C9A227]/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />

                            <div className="relative z-10 space-y-10">
                                <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">
                                    Start Using <span className="text-[#C9A227]">NUMERO SANSAR</span> Today
                                </h2>
                                <p className="text-lg md:text-xl text-purple-100 max-w-2xl mx-auto font-medium">
                                    Perform accurate numerology analysis and simplify your consultation workflow with our divine software engine.
                                </p>
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                                    <Link to="/register" className="w-full sm:w-auto px-10 py-5 bg-[#C9A227] hover:bg-[#D9B43A] text-[#4B2E83] rounded-2xl font-black text-lg transition-all hover:scale-105 shadow-xl shadow-black/10 flex items-center justify-center gap-2">
                                        Start Free Trial <ArrowRight />
                                    </Link>
                                    <Link to="/contact" className="w-full sm:w-auto px-10 py-5 border-2 border-white/30 text-white rounded-2xl font-black text-lg transition-all hover:bg-white/10 flex items-center justify-center gap-2">
                                        Contact Support
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>
            </main>

            {/* --- SECTION 8: Footer --- */}
            <Footer />
        </div>
    );
}
