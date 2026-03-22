import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { usePlatform } from "@/contexts/PlatformContext";
import {
    LayoutDashboard,
    Search,
    Briefcase,
    Smartphone,
    Car,
    Grid3X3,
    LineChart,
    ArrowRight,
    Zap,
    CheckCircle2,
    Monitor,
    MousePointer2
} from "lucide-react";

export default function ScreenshotsPage() {
    const { config } = usePlatform();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const sections = [
        {
            id: "dashboard",
            title: "Client Management Dashboard",
            description: `The ${config?.platform_name || "NUMERO SANSAR"} dashboard allows numerologists to manage client profiles, track consultations, and perform numerology analysis from a single workspace.`,
            icon: <LayoutDashboard size={24} />,
            imageTitle: "Dashboard Interface"
        },
        {
            id: "name-analysis",
            title: "Name Astrology Analysis",
            description: "Analyze personal names using Chaldean and Pythagorean numerology systems. The software calculates composite numbers, root numbers, and provides interpretation insights instantly.",
            icon: <Search size={24} />,
            imageTitle: "Name Analysis Engine"
        },
        {
            id: "business-analysis",
            title: "Business Name Numerology",
            description: "Evaluate business or brand names to determine their numerological vibration and compatibility with birth numbers.",
            icon: <Briefcase size={24} />,
            imageTitle: "Business Strategy Module"
        },
        {
            id: "mobile-analysis",
            title: "Mobile Number Numerology",
            description: "Analyze mobile numbers to determine their compatibility with personal numerology and identify favorable number combinations.",
            icon: <Smartphone size={24} />,
            imageTitle: "Digital Vibration Analysis"
        },
        {
            id: "vehicle-analysis",
            title: "Vehicle Number Numerology",
            description: "Evaluate vehicle registration numbers based on numerology principles and number vibrations.",
            icon: <Car size={24} />,
            imageTitle: "Vehicle Numerology View"
        },
        {
            id: "lo-shu",
            title: "Lo Shu Grid Analysis",
            description: "Generate Lo Shu grid charts using date of birth to identify strengths, missing numbers, and personality patterns.",
            icon: <Grid3X3 size={24} />,
            imageTitle: "Infinite Lo Shu Grid"
        },
        {
            id: "insights",
            title: "Detailed Numerology Insights",
            description: "NUMERO SANSAR provides ready-to-use interpretations that help numerologists understand number vibrations quickly and provide accurate consultation guidance.",
            icon: <LineChart size={24} />,
            imageTitle: "Interpretation Engine"
        }
    ];

    return (
        <div className="min-h-screen bg-white text-slate-900 selection:bg-[#4B2E83] selection:text-white">
            <Header />

            <main>
                {/* --- SECTION 1: Page Header --- */}
                <section className="pt-32 pb-20 px-6 bg-gradient-to-br from-[#4B2E83]/10 via-white to-[#C9A227]/5 flex justify-center text-center overflow-hidden">
                    <div className="max-w-4xl mx-auto space-y-6 relative">
                        {/* Decorative elements */}
                        <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#C9A227]/10 rounded-full blur-[100px] animate-pulse" />
                        <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#4B2E83]/10 rounded-full blur-[100px]" />

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="space-y-4"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-slate-200 rounded-full shadow-sm">
                                <Monitor size={14} className="text-[#4B2E83]" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Product Showcase</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-[#4B2E83] leading-tight">
                                See <span className="text-[#C9A227]">{config?.platform_name || "NUMERO SANSAR"}</span> in Action
                            </h1>
                            <p className="text-xl text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed">
                                Explore the interface and powerful tools designed to help numerologists perform accurate analysis and manage client consultations efficiently.
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* --- SECTION 2: Dashboard Overview --- */}
                <section className="py-24 px-6">
                    <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-8"
                        >
                            <div className="space-y-4">
                                <div className="w-14 h-14 bg-[#4B2E83] text-[#C9A227] rounded-2xl flex items-center justify-center shadow-lg transform -rotate-3 group-hover:rotate-0 transition-transform">
                                    <LayoutDashboard size={28} />
                                </div>
                                <h2 className="text-3xl md:text-4xl font-black text-[#4B2E83]">Client Management Dashboard</h2>
                                <p className="text-lg text-slate-600 leading-relaxed font-medium">
                                    The {config?.platform_name || "NUMERO SANSAR"} dashboard allows numerologists to manage client profiles, track consultations, and perform numerology analysis from a single workspace.
                                </p>
                            </div>
                            <div className="space-y-4 pt-4 text-slate-700 font-bold">
                                {[
                                    "Centralized Client Records",
                                    "One-click Analysis Shortcuts",
                                    "Consultation History Tracking",
                                    "Performance Analytics Overview"
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="w-6 h-6 bg-[#C9A227]/20 rounded-full flex items-center justify-center">
                                            <CheckCircle2 size={16} className="text-[#C9A227]" />
                                        </div>
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="relative group cursor-zoom-in"
                        >
                            <div className="bg-slate-50 rounded-[2.5rem] p-4 shadow-2xl border border-slate-100 overflow-hidden relative">
                                <div className="aspect-[16/10] bg-white rounded-[1.5rem] border border-slate-200 flex items-center justify-center overflow-hidden relative group">
                                    {/* Mock UI Elements */}
                                    <div className="absolute top-0 left-0 w-full h-12 bg-slate-50 border-b border-slate-200 flex items-center px-4 gap-2">
                                        <div className="flex gap-1.5">
                                            <div className="w-3 h-3 rounded-full bg-red-400/20" />
                                            <div className="w-3 h-3 rounded-full bg-amber-400/20" />
                                            <div className="w-3 h-3 rounded-full bg-emerald-400/20" />
                                        </div>
                                        <div className="mx-auto w-1/3 h-6 bg-white border border-slate-200 rounded-md shadow-sm flex items-center justify-center">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">dashboard.{config?.platform_name?.toLowerCase().replace(/\s+/g, '') || "numerosansar"}.com</span>
                                        </div>
                                    </div>
                                    <div className="pt-16 px-8 w-full h-full flex flex-col gap-6">
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="h-24 bg-purple-50 rounded-2xl border border-purple-100" />
                                            <div className="h-24 bg-amber-50 rounded-2xl border border-amber-50" />
                                            <div className="h-24 bg-slate-50 rounded-2xl border border-slate-100" />
                                        </div>
                                        <div className="flex-1 bg-slate-50/50 rounded-t-2xl border-t border-x border-slate-200" />
                                    </div>
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center">
                                        <div className="w-12 h-12 bg-white rounded-full shadow-2xl flex items-center justify-center text-[#4B2E83] opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100">
                                            <MousePointer2 size={24} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#C9A227]/10 rounded-full blur-3xl animate-pulse" />
                        </motion.div>
                    </div>
                </section>

                {/* --- SECTIONS 3-8: Feature Screenshots --- */}
                {sections.slice(1).map((section, idx) => (
                    <section key={section.id} className={`py-24 px-6 ${idx % 2 === 1 ? 'bg-slate-50 border-y border-slate-100' : 'bg-white'}`}>
                        <div className="max-w-7xl mx-auto space-y-16">
                            <div className="max-w-3xl mx-auto text-center space-y-6">
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="flex flex-col items-center gap-4"
                                >
                                    <div className="w-12 h-12 bg-white text-[#4B2E83] rounded-2xl flex items-center justify-center shadow-md border border-slate-100 group">
                                        {section.icon}
                                    </div>
                                    <h2 className="text-3xl md:text-4xl font-black text-[#4B2E83]">{section.title}</h2>
                                    <p className="text-lg text-slate-600 font-medium leading-relaxed">
                                        {section.description}
                                    </p>
                                </motion.div>
                            </div>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.7 }}
                                className="group"
                            >
                                <div className="bg-white rounded-[3rem] p-3 shadow-2xl border border-slate-100 overflow-hidden relative">
                                    <div className="bg-slate-50 rounded-[2.5rem] aspect-[16/9] border border-slate-200 flex flex-col overflow-hidden group-hover:bg-white transition-colors duration-500">
                                        <div className="h-10 bg-slate-100/50 flex items-center px-6 gap-2 border-b border-slate-200">
                                            <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                                            <div className="ml-4 px-4 py-1 bg-white rounded-full text-[8px] font-black tracking-widest text-slate-400 uppercase">
                                                {section.imageTitle} Mode
                                            </div>
                                        </div>
                                        <div className="flex-1 flex items-center justify-center p-12">
                                            <div className="w-full h-full relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-700">
                                                <div className="absolute inset-0 bg-gradient-to-br from-[#4B2E83]/10 to-white flex items-center justify-center">
                                                    <div className="text-center space-y-4 opacity-40">
                                                        {section.icon}
                                                        <div className="text-[10px] font-black uppercase tracking-widest text-[#4B2E83]">{section.title} Mockup Preview</div>
                                                    </div>
                                                </div>
                                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-[#4B2E83]/5 flex items-end justify-between p-8">
                                                    <div className="px-6 py-2 bg-white rounded-full shadow-xl border border-slate-100 flex items-center gap-3">
                                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#4B2E83]">Interactive View</span>
                                                    </div>
                                                    <div className="p-3 bg-[#C9A227] text-white rounded-2xl shadow-xl shadow-amber-500/20">
                                                        <MousePointer2 size={16} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </section>
                ))}

                {/* --- SECTION 9: Call to Action --- */}
                <section className="py-24 px-6 bg-[#4B2E83] relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#C9A227]/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

                    <div className="max-w-4xl mx-auto text-center space-y-10 relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="space-y-6"
                        >
                            <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">
                                Start Using <span className="text-[#C9A227]">{config?.platform_name || "NUMERO SANSAR"}</span> Today
                            </h2>
                            <p className="text-xl text-purple-100/90 font-medium max-w-2xl mx-auto">
                                Perform accurate numerology analysis and manage client consultations with ease using our state-of-the-art platform.
                            </p>
                        </motion.div>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
                            <Link to="/register" className="w-full sm:w-auto px-10 py-5 bg-[#C9A227] hover:bg-[#D9B43A] text-[#4B2E83] rounded-2xl font-black text-lg transition-all hover:scale-105 shadow-xl shadow-black/10 flex items-center justify-center gap-3 active:scale-95">
                                Start Free Trial <ArrowRight size={20} />
                            </Link>
                            <Link to="/pricing" className="w-full sm:w-auto px-10 py-5 border-2 border-white/30 text-white rounded-2xl font-black text-lg transition-all hover:bg-white/10 flex items-center justify-center gap-2">
                                View Pricing
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            {/* --- SECTION 10: Footer --- */}
            <Footer />
        </div>
    );
}
