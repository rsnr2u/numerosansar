import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Shield, Target, Award, Star } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="bg-[#F8FAFC] text-[#1E293B]">
            <Header />

            <main className="pt-24 pb-16">
                {/* --- Hero Section --- */}
                <section className="px-6 py-16 bg-white border-b border-slate-100 relative overflow-hidden">
                    {/* Subtle mandala watermark */}
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] -z-0 opacity-[0.03]">
                        <div className="absolute inset-0 rounded-full border-[2px] border-[#D4940A]" />
                        <div className="absolute inset-8 rounded-full border-[1px] border-[#D4940A]" />
                        <div className="absolute inset-16 rounded-full border-[1px] border-[#D4940A]" />
                    </div>
                    <div className="max-w-6xl mx-auto space-y-6 relative z-10">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-200/60 text-amber-700 text-[9px] font-bold uppercase tracking-wider">
                            <span className="text-base leading-none">🙏</span> Rooted in Vedic Tradition
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-[#1E293B]">
                            Tradition. <span className="text-gradient-gold">Precision.</span> Divine Guidance.
                        </h1>
                        <p className="text-lg text-slate-500 max-w-3xl font-medium leading-relaxed">
                            AstroSansar was founded with a sacred vision: to honor the ancient science of astrology with enterprise-grade precision, bringing divine guidance to every seeker and professional consultant.
                        </p>
                    </div>
                </section>

                {/* --- Core Mission --- */}
                <section className="px-6 py-20">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D4940A]">🙏 Our Sacred Mission</span>
                            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Empowering consultants with the divine wisdom of the stars.</h2>
                            <p className="text-sm text-slate-500 font-medium leading-relaxed">
                                We believe astrology is a sacred science — a bridge between the divine and the practical. Our platform honors this ancient tradition by combining the spiritual depth of Vedic wisdom with the precision of modern technology, empowering practitioners to guide lives with confidence and integrity.
                            </p>
                            <div className="grid grid-cols-2 gap-8 pt-4">
                                <div className="space-y-1">
                                    <div className="text-2xl font-bold text-[#1E293B]">10,000+</div>
                                    <div className="text-[10px] font-black text-[#D4940A] uppercase tracking-widest">Blessed Consultations</div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-2xl font-bold text-[#1E293B]">100%</div>
                                    <div className="text-[10px] font-black text-[#D4940A] uppercase tracking-widest">Vedic Accuracy</div>
                                </div>
                            </div>
                        </div>
                        <Link to="/services" className="bg-gradient-to-br from-amber-50 to-white border border-amber-200/40 rounded-xl p-8 relative overflow-hidden aspect-video flex items-center justify-center shadow-lg shadow-amber-100/30 group cursor-pointer hover:border-[#D4940A]/30 transition-all">
                            <div className="text-7xl select-none text-[#D4940A] opacity-20 group-hover:opacity-30 transition-opacity">ॐ</div>
                            <div className="absolute inset-0 border-[20px] border-amber-50/40" />
                        </Link>
                    </div>
                </section>

                {/* --- Methodology --- */}
                <section className="px-6 py-20 bg-white border-y border-slate-100">
                    <div className="max-w-7xl mx-auto">
                        <div className="mb-12 space-y-4">
                            <h2 className="text-2xl font-bold tracking-tight text-[#1E293B]">Sacred Analytical Systems</h2>
                            <p className="text-sm text-slate-500 font-medium">We honor the most respected astrological traditions for true vibrational insight.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <Link to="/services" className="p-8 rounded-xl bg-gradient-to-br from-amber-50/50 to-slate-50 border border-amber-100/60 transition-all hover:bg-white hover:shadow-xl group cursor-pointer">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="p-2.5 bg-white border border-amber-200/60 rounded-lg text-[#D4940A] transition-colors group-hover:bg-[#1E293B] group-hover:text-[#F09819]">
                                        <Award size={20} />
                                    </div>
                                    <h3 className="text-xl font-bold tracking-tight">Chaldean System</h3>
                                </div>
                                <p className="text-sm text-slate-500 leading-relaxed font-medium">
                                    The ancient Babylonian system, revered for its deep vibrational connection between numbers and cosmic energies. Widely regarded as the most spiritually accurate for business and personal alignment.
                                </p>
                            </Link>
                            <Link to="/services" className="p-8 rounded-xl bg-gradient-to-br from-amber-50/50 to-slate-50 border border-amber-100/60 transition-all hover:bg-white hover:shadow-xl group cursor-pointer">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="p-2.5 bg-white border border-amber-200/60 rounded-lg text-[#D4940A] transition-colors group-hover:bg-[#1E293B] group-hover:text-[#F09819]">
                                        <Star size={20} />
                                    </div>
                                    <h3 className="text-xl font-bold tracking-tight">Pythagorean System</h3>
                                </div>
                                <p className="text-sm text-slate-500 leading-relaxed font-medium">
                                    The Western numerological tradition offering deep insights into personality, soul purpose, and life path. Essential for comprehensive understanding of one's divine blueprint.
                                </p>
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
