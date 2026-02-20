"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Mail, Phone, MapPin, Send, CheckCircle2, Loader2 } from "lucide-react";

export default function ContactPage() {
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setLoading(false);
        setSubmitted(true);
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B]">
            <Header />

            <main className="pt-24 pb-16">
                <section className="px-6 py-16">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
                        {/* --- Left Column: Info --- */}
                        <div className="space-y-12">
                            <div className="space-y-4">
                                <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-[#D4940A]">
                                    <span className="text-base">🙏</span> Connect with Us
                                </span>
                                <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-[#1E293B]">Get in <span className="text-gradient-gold">Touch</span></h1>
                                <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-md">
                                    Have questions about our sacred analytical tools? Our team is ready to guide you on your journey.
                                </p>
                            </div>

                            <div className="space-y-6">
                                {[
                                    { icon: <Mail size={20} />, label: "Support Email", text: "support@numerosansar.com" },
                                    { icon: <Phone size={20} />, label: "Direct Line", text: "+91 98765 43210" },
                                    { icon: <MapPin size={20} />, label: "Office", text: "AstroTech Plaza, Sector 44, Gurugram" }
                                ].map((item) => (
                                    <div key={item.label} className="flex gap-4 items-center p-4 bg-white border border-slate-100 rounded-xl shadow-sm hover:border-[#D4940A]/20 transition-all">
                                        <div className="p-2.5 bg-amber-50 border border-amber-200/40 rounded-lg text-[#D4940A]">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <h3 className="text-[9px] font-black uppercase tracking-widest text-slate-400">{item.label}</h3>
                                            <p className="text-sm font-bold text-[#1E293B]">{item.text}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-8 border-t border-slate-200">
                                <div className="flex items-center gap-3 text-[#D4940A]">
                                    <span className="text-lg">🙏</span>
                                    <span className="text-[10px] font-black uppercase tracking-widest">Serving Devotees Worldwide</span>
                                </div>
                            </div>
                        </div>

                        {/* --- Right Column: Form --- */}
                        <motion.div
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white p-8 md:p-10 rounded-xl border border-slate-200 shadow-xl shadow-slate-200/50 relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#D4940A] via-[#F09819] to-[#D4940A]" />
                            <AnimatePresence mode="wait">
                                {!submitted ? (
                                    <motion.form
                                        key="form"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0, scale: 0.98 }}
                                        className="space-y-6"
                                        onSubmit={handleSubmit}
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                                                <input required type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 outline-none focus:border-[#D4940A] transition-all font-medium text-sm" placeholder="Your name" />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                                                <input required type="email" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 outline-none focus:border-[#D4940A] transition-all font-medium text-sm" placeholder="your@email.com" />
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Inquiry Type</label>
                                            <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 outline-none focus:border-[#D4940A] transition-all font-medium text-sm appearance-none">
                                                <option>General Inquiry</option>
                                                <option>Consultation Request</option>
                                                <option>Technical Support</option>
                                            </select>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Message</label>
                                            <textarea required rows={4} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 outline-none focus:border-[#D4940A] transition-all font-medium text-sm resize-none" placeholder="How can we help you on your journey?" />
                                        </div>

                                        <button
                                            disabled={loading}
                                            className="w-full btn-saffron py-4 rounded-lg text-xs uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                                        >
                                            {loading ? <Loader2 className="animate-spin" size={16} /> : (
                                                <>
                                                    <Send size={16} /> Send Message 🙏
                                                </>
                                            )}
                                        </button>
                                    </motion.form>
                                ) : (
                                    <motion.div
                                        key="success"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="h-full flex flex-col items-center justify-center text-center space-y-6 py-12"
                                    >
                                        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center border border-emerald-100 shadow-inner">
                                            <CheckCircle2 size={32} />
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className="text-2xl font-bold tracking-tight">Message Sent! 🙏</h3>
                                            <p className="text-sm text-slate-500 font-medium">Thank you for reaching out. We'll get back to you soon.</p>
                                        </div>
                                        <button
                                            onClick={() => setSubmitted(false)}
                                            className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D4940A] hover:underline transition-all"
                                        >
                                            Send Another Message
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
