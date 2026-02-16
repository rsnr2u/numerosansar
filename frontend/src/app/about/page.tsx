"use client";

import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Shield, Target, Award, Star } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B]">
            <Header />

            <main className="pt-32 pb-24">
                {/* --- Hero Section --- */}
                <section className="px-6 mb-24">
                    <div className="max-w-6xl mx-auto text-center space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-bold uppercase tracking-wider mb-8">
                                <Shield size={12} className="text-[#D4AF37]" /> Excellence in Numerological Science
                            </div>
                            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-[#1E293B]">
                                Precision. <span className="text-[#64748B]">Integrity.</span> Destiny.
                            </h1>
                            <p className="text-xl text-slate-500 max-w-3xl mx-auto font-normal mt-8 leading-relaxed">
                                NumeroSansar was founded with a singular vision: to bring enterprise-grade analytical precision to the ancient science of numerology.
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* --- Core Mission --- */}
                <section className="px-6 py-24 bg-white border-y border-slate-100 mb-24">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
                        <div className="space-y-8">
                            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#D4AF37]">Our Philosophy</span>
                            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[#1E293B]">Empowering consultants with high-fidelity data.</h2>
                            <p className="text-lg text-slate-500 font-medium leading-relaxed">
                                We believe that numerology isn't just about predictions—it's about strategic alignment. Our platform bridges the gap between traditional wisdom and modern decision-making through rigorous calculation and proprietary algorithms.
                            </p>
                            <div className="grid grid-cols-2 gap-8 pt-4">
                                <div className="space-y-2">
                                    <div className="text-3xl font-bold text-[#1E293B]">100%</div>
                                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Accuracy Rate</div>
                                </div>
                                <div className="space-y-2">
                                    <div className="text-3xl font-bold text-[#1E293B]">10k+</div>
                                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Client Profiles</div>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="aspect-square bg-slate-50 rounded-[3rem] border border-slate-100 flex items-center justify-center relative overflow-hidden">
                                <div className="absolute inset-0 bg-astro-gradient opacity-10" />
                                <Target size={120} className="text-[#1E293B] opacity-20" />
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-10 border-2 border-dashed border-[#D4AF37]/20 rounded-full"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- Methodology --- */}
                <section className="px-6 mb-24">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16 space-y-4">
                            <h2 className="text-3xl font-black text-[#1E293B]">Dual-System Synthesis</h2>
                            <p className="text-slate-500">We utilize the most respected systems globally for true vibrational insight.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="p-10 rounded-[2.5rem] bg-white border border-slate-200 shadow-xl shadow-slate-200/50">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="p-3 bg-blue-500/10 rounded-xl text-blue-600">
                                        <Award size={24} />
                                    </div>
                                    <h3 className="text-2xl font-bold">Chaldean System</h3>
                                </div>
                                <p className="text-slate-500 leading-relaxed font-medium">
                                    The ancient Babylonian system focused on the vibrational relationship between numbers and alphabets. Widely considered the most accurate for business and brand alignment.
                                </p>
                            </div>
                            <div className="p-10 rounded-[2.5rem] bg-white border border-slate-200 shadow-xl shadow-slate-200/50">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="p-3 bg-amber-500/10 rounded-xl text-amber-600">
                                        <Star size={24} />
                                    </div>
                                    <h3 className="text-2xl font-bold">Pythagorean System</h3>
                                </div>
                                <p className="text-slate-500 leading-relaxed font-medium">
                                    The Western standard of numerology, providing deep insights into personality traits and soul desires. Essential for comprehensive human capital analysis.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
