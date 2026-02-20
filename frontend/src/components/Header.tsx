"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navLinks = [
        { name: "About", href: "/about", type: 'page' },
        { name: "Services", href: "/services", type: 'page' },
        { name: "Features", href: "/features", type: 'page' },
        { name: "Pricing", href: "/pricing", type: 'page' },
        { name: "Contact", href: "/contact", type: 'page' },
    ];

    return (
        <header className="fixed top-0 left-0 w-full z-[100] saffron-accent-top bg-white/95 backdrop-blur-md border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3 group cursor-pointer">
                    <div className="p-1.5 bg-gradient-to-br from-[#D4940A] to-[#F09819] rounded-lg shadow-lg shadow-amber-900/10 group-hover:shadow-amber-500/20 transition-all">
                        <span className="text-white font-bold text-lg leading-none select-none">ॐ</span>
                    </div>
                    <span className="text-xl font-bold tracking-tight text-[#1E293B]">
                        NUMERO<span className="text-[#D4940A] font-light">SANSAR</span>
                    </span>
                </Link>

                <nav className="hidden md:flex items-center gap-10">
                    {navLinks.map(link => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-sm font-medium text-slate-600 hover:text-[#D4940A] transition-colors cursor-pointer"
                        >
                            {link.name}
                        </Link>
                    ))}
                </nav>

                <div className="hidden md:flex items-center gap-6">
                    <Link href="/login" className="text-sm font-semibold text-slate-600 hover:text-[#1E293B] transition-colors cursor-pointer">Sign In</Link>
                    <Link
                        href="/register"
                        className="btn-saffron px-6 py-2 rounded-lg text-sm cursor-pointer"
                    >
                        Get Started
                    </Link>
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
                        className="md:hidden fixed top-[calc(3px+4rem)] left-0 w-full bg-white border-b border-slate-200 z-[90] p-8 shadow-2xl"
                    >
                        <div className="flex flex-col gap-6">
                            {navLinks.map(link => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="text-lg font-medium text-slate-900 border-b border-slate-100 pb-4 text-left cursor-pointer hover:text-[#D4940A]"
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="pt-4 flex flex-col gap-4">
                                <Link href="/login" onClick={() => setIsMenuOpen(false)} className="w-full py-4 rounded-xl bg-slate-50 font-semibold text-slate-900 text-center cursor-pointer hover:bg-slate-100">Sign In</Link>
                                <Link href="/register" onClick={() => setIsMenuOpen(false)} className="w-full py-4 rounded-xl btn-saffron text-center cursor-pointer">Get Started</Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
