import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
    UserPlus,
    Calculator,
    LineChart,
    FileCheck,
    ArrowRight,
    Search,
    Briefcase,
    Smartphone,
    Car,
    Grid3X3,
    CheckCircle2,
    Database,
    History,
    Users,
    MousePointer2,
    Sparkles,
    Zap
} from "lucide-react";

export default function HowItWorksPage() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-[#4B2E83] selection:text-white">
            <Header />

            <main>
                {/* --- SECTION 1: Page Header --- */}
                <section className="relative pt-32 pb-20 px-6 overflow-hidden bg-gradient-to-br from-[#4B2E83]/10 via-white to-[#C9A227]/5">
                    <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            className="space-y-8 text-left relative z-10"
                        >
                            <div className="space-y-4">
                                <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-[#4B2E83]">
                                    How <span className="text-[#C9A227]">NUMERO SANSAR</span> Works
                                </h1>
                                <p className="text-lg md:text-xl text-slate-600 leading-relaxed font-medium max-w-xl">
                                    NUMERO SANSAR simplifies the numerology consultation process by combining powerful analysis tools with an easy-to-use client management system.
                                </p>
                            </div>
                            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                                <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-[#4B2E83] text-white rounded-xl font-bold hover:bg-[#5D3AB0] transition-all shadow-lg shadow-purple-900/10 flex items-center justify-center gap-2">
                                    Start Free Trial <ArrowRight size={18} />
                                </Link>
                                <Link to="/pricing" className="w-full sm:w-auto px-8 py-4 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all flex items-center justify-center">
                                    View Pricing
                                </Link>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative z-10"
                        >
                            <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 p-2 overflow-hidden relative">
                                <div className="absolute -inset-2 bg-gradient-to-r from-[#4B2E83]/5 to-[#C9A227]/5 blur-xl -z-10" />
                                <div className="bg-slate-50 rounded-[2rem] aspect-video border border-slate-200 flex items-center justify-center relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-[#4B2E83]/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-700">
                                        <Calculator size={140} className="text-[#4B2E83]/10" />
                                    </div>
                                    <div className="relative z-10 flex flex-col items-center gap-4">
                                        <div className="w-16 h-16 bg-[#4B2E83] rounded-2xl flex items-center justify-center text-white shadow-xl shadow-purple-900/20 animate-bounce">
                                            <Zap size={32} />
                                        </div>
                                        <div className="px-4 py-1.5 bg-white border border-slate-200 rounded-full shadow-sm">
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Dashboard Insight</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#C9A227]/10 rounded-full blur-2xl animate-pulse" />
                            <div className="absolute -top-6 -left-6 w-32 h-32 bg-[#4B2E83]/10 rounded-full blur-2xl animate-pulse" />
                        </motion.div>
                    </div>
                </section>

                {/* --- SECTION 2: Step-by-Step Workflow --- */}
                <section className="py-24 px-6 bg-white">
                    <div className="max-w-7xl mx-auto space-y-16">
                        <div className="text-center space-y-4">
                            <h2 className="text-3xl md:text-4xl font-extrabold text-[#4B2E83]">Simple 4-Step Consultation Process</h2>
                            <div className="h-1 w-20 bg-[#C9A227] mx-auto rounded-full" />
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
                            {/* Desktop Connection Lines */}
                            <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 -z-10" />

                            {[
                                {
                                    step: "STEP 1",
                                    title: "Create Client Profile",
                                    desc: "Enter client information including name, date of birth, and other relevant details. The system stores all client data securely for future consultations.",
                                    icon: <UserPlus />
                                },
                                {
                                    step: "STEP 2",
                                    title: "Perform Numerology Analysis",
                                    desc: "Use built-in tools to analyze Name, Business, Mobile, Vehicle, and Lo Shu Grid compatibility instantly.",
                                    icon: <Search />
                                },
                                {
                                    step: "STEP 3",
                                    title: "View Numerology Insights",
                                    desc: "Automatically calculate driver, conductor, and composite values with interpretations based on Chaldean and Pythagorean systems.",
                                    icon: <LineChart />
                                },
                                {
                                    step: "STEP 4",
                                    title: "Generate Consultation Reports",
                                    desc: "Create professional numerology reports that can be shared with clients during or after consultation.",
                                    icon: <FileCheck />
                                }
                            ].map((item, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="p-8 bg-white border border-slate-200 rounded-[2rem] shadow-sm hover:shadow-xl transition-all group z-10"
                                >
                                    <div className="flex flex-col items-center text-center space-y-6">
                                        <div className="px-4 py-1 bg-[#4B2E83]/5 text-[#4B2E83] rounded-full text-[10px] font-black tracking-widest border border-[#4B2E83]/10">
                                            {item.step}
                                        </div>
                                        <div className="w-16 h-16 bg-[#4B2E83] text-white rounded-2xl flex items-center justify-center shadow-lg group-hover:bg-[#C9A227] transition-all duration-500 scale-110 group-hover:scale-100 group-hover:rotate-12">
                                            {item.icon}
                                        </div>
                                        <div className="space-y-3">
                                            <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#4B2E83] transition-colors">{item.title}</h3>
                                            <p className="text-sm text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* --- SECTION 3: Real Consultation Workflow --- */}
                <section className="py-24 px-6 bg-slate-50 border-y border-slate-100 overflow-hidden">
                    <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <h2 className="text-3xl md:text-4xl font-extrabold text-[#4B2E83]">Designed for Professional Numerology Consultations</h2>
                            <div className="space-y-6">
                                {[
                                    "A numerologist receives a new client request.",
                                    "The numerologist creates a client profile in the dashboard.",
                                    "The software analyzes the client's name and birth date.",
                                    "Additional checks are performed for business, mobile, or vehicle numbers.",
                                    "The numerologist reviews inputs and provides professional guidance."
                                ].map((step, idx) => (
                                    <div key={idx} className="flex gap-4 items-start pb-4 border-b border-slate-200/60 last:border-0 group">
                                        <div className="w-8 h-8 rounded-full bg-[#4B2E83]/5 text-[#4B2E83] border border-[#4B2E83]/10 flex items-center justify-center shrink-0 font-black text-sm group-hover:bg-[#C9A227] group-hover:text-white transition-all">
                                            {idx + 1}
                                        </div>
                                        <p className="text-slate-700 font-medium pt-1">{step}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute -inset-10 bg-[#4B2E83]/5 blur-[100px] rounded-full -z-10 animate-pulse" />
                            <div className="bg-slate-900 rounded-[2.5rem] p-3 shadow-2xl relative">
                                <div className="bg-slate-800 rounded-[2rem] aspect-[4/3] flex flex-col items-center justify-center text-slate-500 gap-4 group overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-tr from-[#4B2E83]/20 via-transparent to-[#C9A227]/10 opacity-50" />
                                    <MousePointer2 size={40} className="opacity-20 translate-x-12 translate-y-8" />
                                    <div className="w-2/3 h-2/3 bg-white/5 rounded-2xl border border-white/5 p-4 space-y-3">
                                        <div className="w-1/3 h-4 bg-white/10 rounded" />
                                        <div className="w-full h-px bg-white/5" />
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="h-20 bg-white/5 rounded-xl border border-white/5" />
                                            <div className="h-20 bg-white/5 rounded-xl border border-white/5" />
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.5em] opacity-40 italic">Software Mockup</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- SECTION 4: Automated Calculations --- */}
                <section className="py-24 px-6 bg-white">
                    <div className="max-w-7xl mx-auto space-y-16">
                        <div className="text-center space-y-4">
                            <h2 className="text-3xl md:text-4xl font-extrabold text-[#4B2E83]">Accurate Numerology Calculations in Seconds</h2>
                            <p className="text-slate-500 max-w-xl mx-auto">Focus on interpretation while our divine engine handles all complexity.</p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                            {[
                                { title: "Driver Number", icon: <Calculator /> },
                                { title: "Conductor Number", icon: <Users /> },
                                { title: "Composite Numbers", icon: <Sparkles /> },
                                { title: "Root Numbers", icon: <Database /> },
                                { title: "Letter Vibrations", icon: <Smartphone /> },
                                { title: "Planetary Associations", icon: <Zap /> }
                            ].map((item, idx) => (
                                <div key={idx} className="flex flex-col items-center gap-4 p-8 bg-slate-50 rounded-3xl border border-slate-100 shadow-sm transition-all hover:shadow-md hover:bg-white active:scale-95 group">
                                    <div className="w-12 h-12 bg-white text-[#4B2E83] rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                        {item.icon}
                                    </div>
                                    <span className="font-bold text-slate-800 text-center">{item.title}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* --- SECTION 5: Save and Reuse Client Data --- */}
                <section className="py-24 px-6 bg-slate-50 border-y border-slate-100 overflow-hidden">
                    <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
                        <div className="order-2 lg:order-1 relative">
                            <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200/60 space-y-6">
                                <div className="flex items-center justify-between border-b pb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-[#4B2E83]">
                                            <History size={20} />
                                        </div>
                                        <h4 className="font-bold text-slate-800">Recent Consultations</h4>
                                    </div>
                                    <div className="w-20 h-8 bg-slate-50 rounded-lg" />
                                </div>
                                <div className="space-y-4">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-purple-50" />
                                                <div className="space-y-1">
                                                    <div className="h-3 w-24 bg-slate-200 rounded" />
                                                    <div className="h-2 w-16 bg-slate-100 rounded" />
                                                </div>
                                            </div>
                                            <ArrowRight size={14} className="text-slate-300" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-8 order-1 lg:order-2">
                            <h2 className="text-3xl md:text-4xl font-extrabold text-[#4B2E83]">Maintain Client Consultation History</h2>
                            <p className="text-lg text-slate-600 leading-relaxed font-medium">Never lose track of your professional journey with integrated history management.</p>

                            <div className="grid gap-4">
                                {[
                                    { title: "Store client profiles", icon: <CheckCircle2 className="text-[#C9A227]" /> },
                                    { title: "Access previous analysis results", icon: <CheckCircle2 className="text-[#C9A227]" /> },
                                    { title: "Review past consultations", icon: <CheckCircle2 className="text-[#C9A227]" /> },
                                    { title: "Continue ongoing analysis", icon: <CheckCircle2 className="text-[#C9A227]" /> }
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-4 p-4 rounded-xl bg-white border border-slate-200/60 shadow-sm">
                                        {item.icon}
                                        <span className="font-bold text-slate-800">{item.title}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- SECTION 6: Start Using NUMERO SANSAR --- */}
                <section className="py-24 px-6 bg-white">
                    <div className="max-w-5xl mx-auto">
                        <motion.div
                            whileHover={{ scale: 1.01 }}
                            className="bg-[#4B2E83] rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl"
                        >
                            <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
                            <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#C9A227]/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />

                            <div className="relative z-10 space-y-10">
                                <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">
                                    Perform Accurate Numerology <br className="hidden md:block" /> Analysis with Ease
                                </h2>
                                <p className="text-lg md:text-xl text-purple-100 max-w-2xl mx-auto font-medium">
                                    NUMERO SANSAR helps numerologists save time, manage clients efficiently, and deliver professional numerology insights.
                                </p>
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                                    <Link to="/register" className="w-full sm:w-auto px-10 py-5 bg-[#C9A227] hover:bg-[#D9B43A] text-[#4B2E83] rounded-2xl font-black text-lg transition-all hover:scale-105 shadow-xl shadow-black/10 flex items-center justify-center gap-2">
                                        Start Free Trial <ArrowRight />
                                    </Link>
                                    <Link to="/pricing" className="w-full sm:w-auto px-10 py-5 border-2 border-white/30 text-white rounded-2xl font-black text-lg transition-all hover:bg-white/10 flex items-center justify-center gap-2">
                                        View Pricing
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>
            </main>

            {/* --- SECTION 7: Footer --- */}
            <Footer />
        </div>
    );
}
