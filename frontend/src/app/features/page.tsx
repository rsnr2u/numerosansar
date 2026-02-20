"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
    Calculator,
    Zap,
    Globe,
    LayoutDashboard,
    Briefcase,
    Smartphone,
    Car,
    Users,
    Shield
} from "lucide-react";

export default function FeaturesPage() {
    const featureGroups = [
        {
            category: "Sacred Analytics",
            features: [
                { icon: <Calculator size={20} />, name: "Vedic Analysis", desc: "Proprietary algorithms rooted in ancient Vedic mathematics for comprehensive personal and professional decoding." },
                { icon: <Zap size={20} />, name: "Divine Engine", desc: "Instant high-fidelity results powered by sacred vibrational logic and precision calculations." },
                { icon: <Globe size={20} />, name: "Global Traditions", desc: "Full support for Chaldean, Pythagorean, and Lo Shu Grid — honoring every sacred tradition." }
            ]
        },
        {
            category: "Strategic Insights",
            features: [
                { icon: <Briefcase size={20} />, name: "Business Alignment", desc: "Strategic brand alignment ensuring your corporate identity vibrates with prosperity and divine harmony." },
                { icon: <Smartphone size={20} />, name: "Digital Harmony", desc: "Optimize your digital presence by aligning mobile vibrations with your sacred numerological profile." },
                { icon: <Car size={20} />, name: "Asset Blessing", desc: "Ensure operational assets are divinely aligned with your driver and conductor numbers." }
            ]
        },
        {
            category: "Platform Blessings",
            features: [
                { icon: <Users size={20} />, name: "Practice Management", desc: "Secure enterprise-grade CRM to manage and nurture your growing community of seekers." },
                { icon: <LayoutDashboard size={20} />, name: "Consultant Sanctum", desc: "A professional sacred workspace for rapid data entry, analysis, and divine result visualization." },
                { icon: <Shield size={20} />, name: "Sacred Security", desc: "Enterprise-grade encryption protecting all client data and sacred analytical records." }
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B]">
            <Header />

            <main className="pt-24 pb-16">
                {/* --- Header --- */}
                <section className="px-6 py-16 border-b border-slate-200 bg-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-[300px] h-[300px] opacity-[0.03]">
                        <div className="absolute inset-0 rounded-full border-[2px] border-[#D4940A]" />
                        <div className="absolute inset-6 rounded-full border-[1px] border-[#D4940A]" />
                    </div>
                    <div className="max-w-6xl mx-auto space-y-4 relative z-10">
                        <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-[#D4940A]">
                            <span className="text-base">🙏</span> Divine Toolkit
                        </span>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#1E293B]">Sacred Analytical <span className="text-gradient-gold">Suites</span></h1>
                        <p className="text-lg text-slate-500 max-w-2xl font-medium">A comprehensive divine toolkit designed to scale your sacred practice with accuracy and spiritual integrity.</p>
                    </div>
                </section>

                {/* --- Features Grid --- */}
                <section className="px-6 py-16">
                    <div className="max-w-7xl mx-auto space-y-24">
                        {featureGroups.map((group) => (
                            <div key={group.category} className="space-y-12">
                                <div className="flex items-center gap-4">
                                    <h2 className="text-sm font-black uppercase tracking-[0.2em] text-[#D4940A]">{group.category}</h2>
                                    <div className="h-px bg-gradient-to-r from-[#D4940A]/30 to-transparent flex-1" />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    {group.features.map((feat, idx) => (
                                        <motion.div
                                            key={feat.name}
                                            initial={{ opacity: 0, y: 10 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: idx * 0.1 }}
                                            className="p-8 bg-white border border-slate-200 rounded-xl hover:shadow-xl hover:border-[#D4940A]/20 transition-all group cursor-pointer"
                                        >
                                            <div className="p-3 rounded-lg bg-amber-50 border border-amber-200/40 text-[#D4940A] w-fit mb-6 group-hover:bg-[#1E293B] group-hover:text-[#F09819] transition-all">
                                                {feat.icon}
                                            </div>
                                            <h3 className="text-lg font-bold mb-3 tracking-tight text-[#1E293B] group-hover:text-[#D4940A] transition-colors">{feat.name}</h3>
                                            <p className="text-sm text-slate-500 font-medium leading-relaxed">{feat.desc}</p>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* --- Call to Action --- */}
                <section className="px-6 py-16">
                    <div className="max-w-4xl mx-auto p-12 bg-[#1E293B] rounded-2xl text-center space-y-8 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#D4940A] via-[#F09819] to-[#D4940A]" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-9xl text-white/[0.03] select-none">ॐ</div>
                        <h2 className="text-3xl font-bold text-white tracking-tight relative z-10">Begin your sacred journey today 🙏</h2>
                        <p className="text-slate-400 font-medium relative z-10">Experience the full power of our divine analytical ecosystem with a 14-day free trial.</p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 relative z-10">
                            <Link href="/register" className="w-full sm:w-auto px-8 py-4 btn-saffron rounded-xl text-sm text-center cursor-pointer">Start Free Trial 🙏</Link>
                            <Link href="/contact" className="w-full sm:w-auto px-8 py-4 bg-white/10 text-white rounded-xl font-bold text-sm hover:bg-white/20 transition-all text-center cursor-pointer">Schedule Consultation</Link>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
