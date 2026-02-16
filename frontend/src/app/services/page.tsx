"use client";

import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { User, Briefcase, Car, Smartphone, ArrowRight, CheckCircle2 } from "lucide-react";

export default function ServicesPage() {
    const services = [
        {
            title: "Name Numerology",
            icon: <User size={32} />,
            desc: "Align your personal vibrational frequency with your destiny using Chaldean and Pythagorean analysis.",
            features: ["Vowel/Consonant Analysis", "Life Path Calculation", "Compound Number Meanings"],
            color: "blue"
        },
        {
            title: "Business Numerology",
            icon: <Briefcase size={32} />,
            desc: "Strategic brand alignment to ensure your corporate identity vibrates with growth and prosperity.",
            features: ["Brand Name Optimization", "Sector Compatibility", "Lucky Incorporation Dates"],
            color: "amber"
        },
        {
            title: "Vehicle Analysis",
            icon: <Car size={32} />,
            desc: "Ensure your mobile assets are in harmony with your driver and conductor numbers for safety and success.",
            features: ["Plate Number Evaluation", "Color Compatibility", "Auspicious Selection"],
            color: "emerald"
        },
        {
            title: "Mobile Numerology",
            icon: <Smartphone size={32} />,
            desc: "Optimize your digital connectivity by choosing a mobile number that enhances your professional impact.",
            features: ["Frequency Alignment", "Connectivity Analysis", "Professional Suitability"],
            color: "purple"
        }
    ];

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B]">
            <Header />

            <main className="pt-32 pb-24">
                {/* --- Header --- */}
                <section className="px-6 mb-20">
                    <div className="max-w-6xl mx-auto text-center space-y-6">
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-[#1E293B]">Our Core <span className="text-[#64748B]">Specializations</span></h1>
                        <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">Precision-calculated solutions for every aspect of your life and business.</p>
                    </div>
                </section>

                {/* --- Services Grid --- */}
                <section className="px-6 mb-24">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                        {services.map((s, idx) => (
                            <motion.div
                                key={s.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="p-10 rounded-[3rem] bg-white border border-slate-200 shadow-xl shadow-slate-200/50 hover:border-[#D4AF37]/30 transition-all group"
                            >
                                <div className={`p-5 rounded-3xl mb-8 w-fit bg-slate-50 text-[#1E293B] group-hover:bg-[#1E293B] group-hover:text-white transition-all`}>
                                    {s.icon}
                                </div>
                                <h2 className="text-3xl font-bold mb-4 tracking-tight text-[#1E293B]">{s.title}</h2>
                                <p className="text-slate-500 font-medium leading-relaxed mb-8">{s.desc}</p>
                                <div className="space-y-4 mb-10">
                                    {s.features.map(f => (
                                        <div key={f} className="flex items-center gap-3 text-sm font-semibold text-slate-600">
                                            <CheckCircle2 size={16} className="text-[#D4AF37]" />
                                            {f}
                                        </div>
                                    ))}
                                </div>
                                <button className="flex items-center gap-2 text-sm font-bold text-[#1E293B] hover:text-[#D4AF37] transition-all">
                                    Learn More <ArrowRight size={16} />
                                </button>
                            </motion.div>
                        ))}
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
