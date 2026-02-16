"use client";

import { Sparkles, Globe } from "lucide-react";

export default function Footer() {
    return (
        <footer className="py-24 px-6 bg-white border-t border-slate-100">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-12 pb-16 border-b border-slate-100">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Sparkles className="text-[#D4AF37]" size={24} />
                            <span className="text-2xl font-bold tracking-tight text-[#1E293B]">NUMEROSANSAR</span>
                        </div>
                        <p className="text-sm text-slate-500 max-w-xs leading-relaxed">Defining the future of professional numerology through precision and integrity.</p>
                    </div>
                    <div className="flex flex-wrap gap-12 text-sm font-semibold text-slate-400">
                        <div className="space-y-3 flex flex-col">
                            <span className="text-slate-900">Platform</span>
                            <a href="#" className="hover:text-[#D4AF37]">Features</a>
                            <a href="#" className="hover:text-[#D4AF37]">Security</a>
                            <a href="#" className="hover:text-[#D4AF37]">Status</a>
                        </div>
                        <div className="space-y-3 flex flex-col">
                            <span className="text-slate-900">Legal</span>
                            <a href="#" className="hover:text-[#D4AF37]">Privacy</a>
                            <a href="#" className="hover:text-[#D4AF37]">Terms</a>
                            <a href="#" className="hover:text-[#D4AF37]">Corporate</a>
                        </div>
                    </div>
                </div>
                <div className="pt-12 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-xs font-medium text-slate-400">© 2026 NumeroSansar Technologies Private Limited. All rights reserved.</p>
                    <div className="flex gap-6 text-slate-400">
                        <Globe size={18} className="hover:text-[#D4AF37] cursor-pointer" />
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">English (US)</div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
