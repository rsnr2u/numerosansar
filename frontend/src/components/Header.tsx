"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Menu, X } from "lucide-react";

export default function Header() {
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navLinks = [
        { name: "About", href: "/about", type: 'page' },
        { name: "Services", href: "/services", type: 'page' },
        { name: "Features", href: "/#features", type: 'scroll' },
        { name: "Pricing", href: "/#pricing", type: 'scroll' },
        { name: "Contact", href: "/contact", type: 'page' },
    ];

    return (
        <header className="fixed top-0 left-0 w-full z-[100] border-b border-slate-200 bg-white/90 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <div className="flex items-center gap-3 group cursor-pointer" onClick={() => router.push('/')}>
                    <div className="p-2 bg-[#1E293B] rounded-xl shadow-lg shadow-slate-900/10 group-hover:bg-[#334155] transition-all">
                        <Sparkles className="text-[#D4AF37] w-6 h-6" />
                    </div>
                    <span className="text-2xl font-bold tracking-tight text-[#1E293B]">
                        NUMERO<span className="text-[#64748B] font-light">SANSAR</span>
                    </span>
                </div>

                <nav className="hidden md:flex items-center gap-10">
                    {navLinks.map(link => (
                        <button
                            key={link.name}
                            onClick={() => router.push(link.href)}
                            className="text-sm font-medium text-slate-600 hover:text-[#1E293B] transition-colors"
                        >
                            {link.name}
                        </button>
                    ))}
                </nav>

                <div className="hidden md:flex items-center gap-6">
                    <button onClick={() => router.push('/admin/login')} className="text-sm font-semibold text-slate-600 hover:text-[#1E293B] transition-colors">Sign In</button>
                    <button
                        onClick={() => router.push('/admin/register')}
                        className="bg-[#1E293B] text-white px-8 py-3 rounded-lg text-sm font-semibold hover:bg-[#334155] hover:shadow-xl hover:shadow-slate-900/10 transition-all"
                    >
                        Get Started
                    </button>
                </div>

                <button className="md:hidden text-slate-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="md:hidden fixed top-20 left-0 w-full bg-white border-b border-slate-200 z-[90] p-8 shadow-2xl"
                    >
                        <div className="flex flex-col gap-6">
                            {navLinks.map(link => (
                                <button
                                    key={link.name}
                                    onClick={() => { router.push(link.href); setIsMenuOpen(false); }}
                                    className="text-lg font-medium text-slate-900 border-b border-slate-100 pb-4 text-left"
                                >
                                    {link.name}
                                </button>
                            ))}
                            <div className="pt-4 flex flex-col gap-4">
                                <button onClick={() => router.push('/admin/login')} className="w-full py-4 rounded-xl bg-slate-50 font-semibold text-slate-900">Sign In</button>
                                <button onClick={() => router.push('/admin/register')} className="w-full py-4 rounded-xl bg-[#1E293B] text-white font-semibold">Get Started</button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
