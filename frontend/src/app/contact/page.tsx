"use client";

import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Mail, Phone, MapPin, Send, Globe } from "lucide-react";

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B]">
            <Header />

            <main className="pt-32 pb-24">
                <section className="px-6 mb-24">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">
                        {/* --- Left Column: Info --- */}
                        <div className="space-y-12">
                            <div className="space-y-6">
                                <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-[#1E293B]">Get in <span className="text-[#64748B]">Touch</span></h1>
                                <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-md">
                                    Have questions about our analytical suites or corporate solutions? Our team of experts is ready to assist you.
                                </p>
                            </div>

                            <div className="space-y-8">
                                <div className="flex gap-6 items-start">
                                    <div className="p-4 bg-white border border-slate-200 rounded-2xl text-[#1E293B] shadow-sm">
                                        <Mail size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-1">Email Us</h3>
                                        <p className="text-lg font-bold text-[#1E293B]">support@numerosansar.com</p>
                                    </div>
                                </div>

                                <div className="flex gap-6 items-start">
                                    <div className="p-4 bg-white border border-slate-200 rounded-2xl text-[#1E293B] shadow-sm">
                                        <Phone size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-1">Call Us</h3>
                                        <p className="text-lg font-bold text-[#1E293B]">+91 98765 43210</p>
                                    </div>
                                </div>

                                <div className="flex gap-6 items-start">
                                    <div className="p-4 bg-white border border-slate-200 rounded-2xl text-[#1E293B] shadow-sm">
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-1">Headquarters</h3>
                                        <p className="text-lg font-bold text-[#1E293B]">AstroTech Plaza, Sector 44,<br />Gurugram, HR 122003</p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-slate-200">
                                <div className="flex items-center gap-4 text-slate-400">
                                    <Globe size={20} className="hover:text-[#D4AF37] cursor-pointer transition-colors" />
                                    <span className="text-xs font-bold uppercase tracking-widest">Global Operations</span>
                                </div>
                            </div>
                        </div>

                        {/* --- Right Column: Form --- */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white p-10 md:p-12 rounded-[3.5rem] border border-slate-200 shadow-2xl shadow-slate-200/50"
                        >
                            <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                                        <input type="text" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-[#D4AF37] transition-all font-medium" placeholder="John Doe" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                                        <input type="email" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-[#D4AF37] transition-all font-medium" placeholder="john@example.com" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Inquiry Type</label>
                                    <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-[#D4AF37] transition-all font-medium appearance-none">
                                        <option>General Inquiry</option>
                                        <option>Corporate Partnership</option>
                                        <option>Technical Support</option>
                                        <option>Billing Question</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Message</label>
                                    <textarea rows={5} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-[#D4AF37] transition-all font-medium resize-none" placeholder="How can we help you?" />
                                </div>

                                <button className="w-full bg-[#1E293B] text-white py-5 rounded-[2rem] font-bold text-base hover:bg-[#334155] shadow-xl shadow-slate-900/10 transition-all flex items-center justify-center gap-3 active:scale-95">
                                    <Send size={18} /> Send Message
                                </button>
                            </form>
                        </motion.div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
