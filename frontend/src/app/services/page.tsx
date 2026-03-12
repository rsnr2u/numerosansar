import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { User, Briefcase, Car, Smartphone, ArrowRight, CheckCircle2 } from "lucide-react";

export default function ServicesPage() {
    const services = [
        {
            title: "Name Astrology",
            icon: <User size={24} />,
            desc: "Discover the vibrational power of your name through sacred Chaldean and Pythagorean analysis. Align your identity with your divine destiny.",
            features: ["Vowel/Consonant Analysis", "Life Path Calculation", "Compound Number Meanings"],
        },
        {
            title: "Business Astrology",
            icon: <Briefcase size={24} />,
            desc: "Ensure your business name resonates with prosperity and growth. Sacred brand alignment for auspicious corporate success.",
            features: ["Brand Name Optimization", "Sector Compatibility", "Auspicious Incorporation Dates"],
        },
        {
            title: "Vehicle Analysis",
            icon: <Car size={24} />,
            desc: "Harmonize your vehicle's number with your personal vibrations for safety, protection, and auspicious journeys.",
            features: ["Plate Number Evaluation", "Color Compatibility", "Auspicious Selection"],
        },
        {
            title: "Mobile Astrology",
            icon: <Smartphone size={24} />,
            desc: "Choose a mobile number that enhances your spiritual and professional energy. Align your digital presence with divine celestial vibrations.",
            features: ["Frequency Alignment", "Connectivity Analysis", "Professional Suitability"],
        }
    ];

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B]">
            <Header />

            <main className="pt-24 pb-16">
                {/* --- Header --- */}
                <section className="px-6 py-16 bg-white border-b border-slate-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-[300px] h-[300px] opacity-[0.03]">
                        <div className="absolute inset-0 rounded-full border-[2px] border-[#D4940A]" />
                        <div className="absolute inset-6 rounded-full border-[1px] border-[#D4940A]" />
                    </div>
                    <div className="max-w-6xl mx-auto space-y-4 relative z-10">
                        <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-[#D4940A]">
                            <span className="text-base">🙏</span> Sacred Services
                        </span>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#1E293B]">Divine Analytical <span className="text-gradient-gold">Services</span></h1>
                        <p className="text-lg text-slate-500 max-w-2xl font-medium leading-relaxed">Sacred astrological solutions for every aspect of your life and business, guided by ancient wisdom.</p>
                    </div>
                </section>

                {/* --- Services Grid --- */}
                <section className="px-6 py-20">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                        {services.map((s, idx) => (
                            <motion.div
                                key={s.title}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="p-8 rounded-xl bg-white border border-slate-200 transition-all hover:shadow-xl hover:border-[#D4940A]/20 group cursor-pointer"
                            >
                                <div className="flex items-start justify-between mb-8">
                                    <div className="p-3.5 rounded-lg bg-amber-50 border border-amber-200/40 text-[#D4940A] group-hover:bg-[#1E293B] group-hover:text-[#F09819] transition-all">
                                        {s.icon}
                                    </div>
                                    <Link to="/contact" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-[#D4940A] transition-colors flex items-center gap-2 cursor-pointer">
                                        Details <ArrowRight size={12} />
                                    </Link>
                                </div>
                                <h2 className="text-2xl font-bold mb-4 tracking-tight">{s.title}</h2>
                                <p className="text-sm text-slate-500 font-medium leading-relaxed mb-8">{s.desc}</p>
                                <div className="grid grid-cols-1 gap-3 mb-4">
                                    {s.features.map(f => (
                                        <div key={f} className="flex items-center gap-2 text-xs font-bold text-slate-600">
                                            <CheckCircle2 size={14} className="text-[#D4940A]" />
                                            {f}
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
