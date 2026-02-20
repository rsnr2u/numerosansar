"use client";

import Link from "next/link";

export default function Footer() {
    return (
        <footer className="py-16 px-6 bg-[#1E293B] text-white border-t-4 border-[#D4940A]">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-12 pb-12 border-b border-white/10">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-1.5 bg-gradient-to-br from-[#D4940A] to-[#F09819] rounded-lg">
                                <span className="text-white font-bold text-lg leading-none select-none">ॐ</span>
                            </div>
                            <span className="text-xl font-bold tracking-tight">NUMEROSANSAR</span>
                        </div>
                        <p className="text-sm text-slate-400 max-w-sm leading-relaxed font-medium">
                            Ancient Wisdom, Modern Precision — Guided by the Divine Science of Numbers. 🙏
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-16 text-[10px] font-black uppercase tracking-widest text-slate-400">
                        <div className="space-y-4 flex flex-col">
                            <span className="text-[#F09819]">Platform</span>
                            <Link href="/features" className="hover:text-[#F09819] transition-colors">Features</Link>
                            <Link href="/pricing" className="hover:text-[#F09819] transition-colors">Pricing</Link>
                            <Link href="/services" className="hover:text-[#F09819] transition-colors">Services</Link>
                        </div>
                        <div className="space-y-4 flex flex-col">
                            <span className="text-[#F09819]">Company</span>
                            <Link href="/about" className="hover:text-[#F09819] transition-colors">About Us</Link>
                            <Link href="/contact" className="hover:text-[#F09819] transition-colors">Contact</Link>
                            <Link href="/register" className="hover:text-[#F09819] transition-colors">Partnerships</Link>
                        </div>
                    </div>
                </div>
                <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">© 2026 NumeroSansar Technologies. All rights reserved.</p>
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#F09819]">
                        🙏 Jai NumeroSansar
                    </div>
                </div>
            </div>
        </footer>
    );
}
