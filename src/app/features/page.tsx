import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
    Calculator,
    Zap,
    LayoutDashboard,
    Briefcase,
    Smartphone,
    Car,
    Grid3X3,
    TrendingUp,
    FileText,
    Search,
    Users,
    Shield,
    CheckCircle2,
    ArrowRight,
    Star,
    Layers,
    FileCheck,
    ArrowUpRight
} from "lucide-react";

export default function FeaturesPage() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-[#4B2E83] selection:text-white">
            <Header />

            <main>
                {/* --- SECTION 1: Page Hero --- */}
                <section className="relative pt-32 pb-20 px-6 overflow-hidden bg-gradient-to-br from-[#4B2E83]/10 via-white to-[#C9A227]/5">
                    <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="space-y-6"
                        >
                            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-[#4B2E83]">
                                Powerful Numerology <br />
                                <span className="text-[#C9A227]">Software Features</span>
                            </h1>
                            <p className="text-lg md:text-xl text-slate-600 max-w-xl leading-relaxed font-medium">
                                NUMERO SANSAR provides professional tools that help numerologists perform accurate analysis, manage client consultations, and generate meaningful numerology insights quickly.
                            </p>
                            <div className="pt-4">
                                <Link to="/register" className="inline-flex items-center gap-2 px-8 py-4 bg-[#4B2E83] text-white rounded-xl font-bold hover:bg-[#5D3AB0] transition-all shadow-lg shadow-purple-900/10">
                                    Get Started Free <ArrowRight size={18} />
                                </Link>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative hidden lg:block"
                        >
                            <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 overflow-hidden">
                                <div className="bg-slate-50 rounded-xl aspect-[16/10] border border-slate-200 overflow-hidden relative">
                                    {/* Mockup Dashboard Sidebar */}
                                    <div className="absolute left-0 top-0 bottom-0 w-16 bg-[#4B2E83] flex flex-col items-center py-6 gap-6">
                                        <div className="w-8 h-8 bg-white/20 rounded-lg" />
                                        <div className="w-8 h-8 bg-white/10 rounded-lg" />
                                        <div className="w-8 h-8 bg-[#C9A227] rounded-lg" />
                                        <div className="w-8 h-8 bg-white/10 rounded-lg" />
                                    </div>
                                    {/* Mockup Content */}
                                    <div className="ml-16 p-6 space-y-6">
                                        <div className="flex justify-between">
                                            <div className="h-6 w-32 bg-slate-200 rounded-lg" />
                                            <div className="h-6 w-24 bg-[#4B2E83]/10 rounded-lg" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="h-24 bg-white rounded-xl border border-slate-200 p-4 space-y-3">
                                                <div className="h-3 w-1/2 bg-slate-100 rounded" />
                                                <div className="h-8 w-full bg-[#4B2E83]/5 rounded" />
                                            </div>
                                            <div className="h-24 bg-white rounded-xl border border-slate-200 p-4 space-y-3">
                                                <div className="h-3 w-1/2 bg-slate-100 rounded" />
                                                <div className="h-8 w-full bg-[#C9A227]/10 rounded" />
                                            </div>
                                        </div>
                                        <div className="h-32 bg-white rounded-xl border border-slate-200" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* --- SECTION 2: Core Numerology Analysis Tools --- */}
                <section className="py-24 px-6 bg-white">
                    <div className="max-w-7xl mx-auto space-y-16">
                        <div className="text-center space-y-4">
                            <h2 className="text-3xl md:text-4xl font-extrabold text-[#4B2E83]">Advanced Numerology Analysis Tools</h2>
                            <div className="h-1 w-20 bg-[#C9A227] mx-auto rounded-full" />
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                            {[
                                {
                                    title: "Name Astrology Analysis",
                                    desc: "Analyze personal names using Chaldean and Pythagorean numerology systems to determine vibrational compatibility and influence.",
                                    icon: <Search className="text-[#4B2E83]" />
                                },
                                {
                                    title: "Business Name Numerology",
                                    desc: "Evaluate business or brand names for success potential, financial growth, and positive number vibrations.",
                                    icon: <Briefcase className="text-[#4B2E83]" />
                                },
                                {
                                    title: "Mobile Number Numerology",
                                    desc: "Analyze mobile numbers to check compatibility with birth numbers and personal vibrations.",
                                    icon: <Smartphone className="text-[#4B2E83]" />
                                },
                                {
                                    title: "Vehicle Number Analysis",
                                    desc: "Evaluate vehicle registration numbers based on numerological influence and energy compatibility.",
                                    icon: <Car className="text-[#4B2E83]" />
                                }
                            ].map((item, idx) => (
                                <motion.div
                                    key={idx}
                                    whileHover={{ y: -5 }}
                                    className="flex items-start gap-6 p-8 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm transition-all hover:bg-white hover:shadow-md active:translate-y-0"
                                >
                                    <div className="w-14 h-14 shrink-0 bg-white shadow-sm rounded-xl flex items-center justify-center">
                                        {item.icon}
                                    </div>
                                    <div className="space-y-3">
                                        <h3 className="text-xl font-bold text-slate-900">{item.title}</h3>
                                        <p className="text-slate-600 leading-relaxed font-medium">{item.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* --- SECTION 3: Lo Shu Grid & Life Insights --- */}
                <section className="py-24 px-6 bg-slate-50 border-y border-slate-100">
                    <div className="max-w-7xl mx-auto space-y-16">
                        <div className="text-center space-y-4">
                            <h2 className="text-3xl md:text-4xl font-extrabold text-[#4B2E83]">Deep Numerology Insights</h2>
                            <p className="text-slate-500 max-w-xl mx-auto">Go beyond basic numbers with deep architectural patterns of life.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                {
                                    title: "Lo Shu Grid Analysis",
                                    desc: "Generate Lo Shu grid charts uses birth dates to identify strengths and missing numbers.",
                                    icon: <Grid3X3 />
                                },
                                {
                                    title: "Driver & Conductor Numbers",
                                    desc: "Automatically calculate core numbers that define a person's life journey.",
                                    icon: <Layers />
                                },
                                {
                                    title: "Numerology Yoga Insights",
                                    desc: "Identify special combinations that influence success and opportunities.",
                                    icon: <Star />
                                },
                                {
                                    title: "Yearly Prediction Insights",
                                    desc: "Generate predictions based on numerological cycles for upcoming years.",
                                    icon: <TrendingUp />
                                }
                            ].map((item, idx) => (
                                <div key={idx} className="p-8 bg-white border border-slate-200 rounded-3xl shadow-sm hover:shadow-xl transition-all group">
                                    <div className="w-12 h-12 bg-[#4B2E83]/10 text-[#4B2E83] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#4B2E83] group-hover:text-white transition-colors">
                                        {item.icon}
                                    </div>
                                    <h4 className="font-bold text-lg text-slate-900 mb-3 group-hover:text-[#4B2E83] transition-colors">{item.title}</h4>
                                    <p className="text-sm text-slate-600 leading-relaxed font-medium">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* --- SECTION 4: Client Consultation Management --- */}
                <section className="py-24 px-6 bg-white overflow-hidden">
                    <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-10 order-2 lg:order-1">
                            <h2 className="text-3xl md:text-4xl font-extrabold text-[#4B2E83]">Professional Client Management</h2>
                            <div className="space-y-8">
                                {[
                                    { title: "Client Profile Management", desc: "Store client details, date of birth, and consultation records in a secure database." },
                                    { title: "Saved Analysis History", desc: "Keep records of all numerology analyses performed for each client effortlessly." },
                                    { title: "Consultation Workflow", desc: "Perform multiple numerology analyses for each client from a single intelligent dashboard." }
                                ].map((feature, idx) => (
                                    <div key={idx} className="flex gap-4">
                                        <div className="mt-1">
                                            <CheckCircle2 size={24} className="text-[#C9A227]" />
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="font-bold text-slate-900">{feature.title}</h4>
                                            <p className="text-slate-600 font-medium">{feature.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="order-1 lg:order-2">
                            <div className="relative">
                                <div className="absolute -inset-10 bg-[#4B2E83]/5 blur-[100px] rounded-full -z-10" />
                                <div className="bg-slate-900 rounded-3xl p-2 shadow-2xl border border-slate-800">
                                    <div className="bg-slate-800 rounded-2xl aspect-[1.4/1] flex flex-col items-center justify-center text-slate-500 gap-4">
                                        <LayoutDashboard size={48} className="opacity-20" />
                                        <span className="text-xs uppercase tracking-[0.3em] font-black opacity-30 italic">Dashboard Preview</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- SECTION 5: Automated Numerology Calculations --- */}
                <section className="py-24 px-6 bg-slate-50 border-y border-slate-100">
                    <div className="max-w-7xl mx-auto space-y-16">
                        <div className="text-center space-y-4">
                            <h2 className="text-3xl md:text-4xl font-extrabold text-[#4B2E83]">Instant & Accurate Calculations</h2>
                            <p className="text-slate-500 max-w-xl mx-auto">Eliminate human error with a divine engine that handles complex calculations instantly.</p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                            {[
                                "Driver Number",
                                "Conductor Number",
                                "Composite Numbers",
                                "Root Numbers",
                                "Letter Vibrations",
                                "Planetary Associations"
                            ].map((calc, idx) => (
                                <div key={idx} className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-slate-200 shadow-sm transition-all hover:border-[#C9A227]/50 active:scale-95">
                                    <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center shrink-0">
                                        <Calculator size={18} className="text-[#4B2E83]" />
                                    </div>
                                    <span className="font-bold text-slate-800 text-sm">{calc}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* --- SECTION 6: Professional Insight Generation --- */}
                <section className="py-24 px-6 bg-white">
                    <div className="max-w-7xl mx-auto space-y-16">
                        <div className="text-center space-y-4">
                            <h2 className="text-3xl md:text-4xl font-extrabold text-[#4B2E83]">Detailed Interpretation & Insights</h2>
                            <p className="text-slate-500 max-w-xl mx-auto">Ready-to-use professional interpretations based on traditional numerology wisdom.</p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[
                                "Name vibration interpretations",
                                "Number compatibility explanations",
                                "Business name evaluation insights",
                                "Lo Shu grid analysis insights",
                                "Yearly prediction guidance"
                            ].map((insight, idx) => (
                                <div key={idx} className="p-8 pb-12 bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg transition-all border-b-8 border-b-purple-50 group hover:border-b-[#4B2E83]">
                                    <h4 className="font-black text-xl text-slate-900 mb-6 group-hover:text-[#4B2E83] transition-colors">{insight}</h4>
                                    <div className="h-2 w-full bg-slate-100 rounded-full mb-3" />
                                    <div className="h-2 w-3/4 bg-slate-100 rounded-full mb-3" />
                                    <div className="h-2 w-1/2 bg-slate-100 rounded-full" />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* --- SECTION 7: Consultation Report Generation --- */}
                <section className="py-24 px-6 bg-slate-50 border-y border-slate-100">
                    <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <h2 className="text-3xl md:text-4xl font-extrabold text-[#4B2E83]">Generate Professional Reports</h2>
                            <p className="text-lg text-slate-600 leading-relaxed font-medium">Create structured numerology reports that can be shared with clients instantly after consultations.</p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {[
                                    "Name analysis",
                                    "Numerology numbers",
                                    "Lo Shu grid insights",
                                    "Prediction summaries",
                                    "Recommended changes"
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-3 text-slate-700 font-bold">
                                        <div className="w-2 h-2 rounded-full bg-[#C9A227]" />
                                        <span>{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white rounded-[2rem] p-8 shadow-2xl border border-slate-200 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4">
                                <div className="w-12 h-12 bg-[#4B2E83] rounded-xl flex items-center justify-center text-white">
                                    <FileText />
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div className="h-8 w-48 bg-slate-100 rounded-lg" />
                                <div className="h-px w-full bg-slate-100" />
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="h-20 bg-slate-50 rounded-xl" />
                                    <div className="h-20 bg-slate-50 rounded-xl" />
                                    <div className="h-20 bg-slate-50 rounded-xl" />
                                </div>
                                <div className="space-y-4">
                                    <div className="h-4 w-full bg-slate-50 rounded" />
                                    <div className="h-4 w-5/6 bg-slate-50 rounded" />
                                    <div className="h-4 w-4/6 bg-slate-50 rounded" />
                                </div>
                                <button className="w-full py-4 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 font-bold group-hover:bg-[#4B2E83]/5 group-hover:border-[#4B2E83]/30 transition-all flex items-center justify-center gap-3 uppercase text-xs tracking-widest">
                                    <FileCheck size={18} /> Download Sample PDF
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- SECTION 8: Call to Action --- */}
                <section className="py-24 px-6 bg-white">
                    <div className="max-w-5xl mx-auto">
                        <div className="bg-[#4B2E83] rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
                            <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
                            <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#C9A227]/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />

                            <div className="relative z-10 space-y-10">
                                <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
                                    Start Using <span className="text-[#C9A227]">NUMERO SANSAR</span> Today
                                </h2>
                                <p className="text-lg md:text-xl text-purple-100 max-w-2xl mx-auto font-medium">
                                    Perform professional numerology analysis and simplify your consultation process with our advanced tools.
                                </p>
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                                    <Link to="/register" className="w-full sm:w-auto px-10 py-5 bg-[#C9A227] hover:bg-[#D9B43A] text-[#4B2E83] rounded-2xl font-black text-lg transition-all hover:scale-105 shadow-xl shadow-black/10 flex items-center justify-center gap-2">
                                        Start Free Trial <ArrowRight />
                                    </Link>
                                    <Link to="/pricing" className="w-full sm:w-auto px-10 py-5 border-2 border-white/30 text-white rounded-2xl font-black text-lg transition-all hover:bg-white/10 flex items-center justify-center gap-2">
                                        View Pricing <ArrowUpRight />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* --- SECTION 9: Footer --- */}
            <Footer />
        </div>
    );
}
