"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  LayoutDashboard,
  Shield,
  Zap,
  Globe,
  Calculator
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] selection:bg-[#D4940A] selection:text-white font-sans">
      <Header />

      {/* --- Hero Section --- */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Sacred geometry watermark */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] -z-10 opacity-[0.04]">
          <div className="absolute inset-0 rounded-full border-[2px] border-[#D4940A]" />
          <div className="absolute inset-8 rounded-full border-[1px] border-[#D4940A]" />
          <div className="absolute inset-16 rounded-full border-[1px] border-[#D4940A]" />
          <div className="absolute inset-24 rounded-full border-[1px] border-[#D4940A]" />
          <div className="absolute top-1/2 left-0 right-0 h-px bg-[#D4940A]" />
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[#D4940A]" />
          <div className="absolute inset-0 rotate-45">
            <div className="absolute top-1/2 left-0 right-0 h-px bg-[#D4940A]" />
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[#D4940A]" />
          </div>
        </div>

        <div className="max-w-6xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-200/60 text-amber-700 text-[9px] font-bold uppercase tracking-wider mb-6">
              <span className="text-base leading-none">🙏</span> Sacred Numerology Platform
            </div>
            <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight text-[#1E293B]">
              Unlock the Divine Power <br className="hidden md:block" /><span className="text-gradient-gold">of Numbers</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-500 max-w-3xl mx-auto font-medium mt-6 leading-relaxed">
              Build your own Numerology brand without hiring a developer. Use our engine, show your logo.
            </p>
          </motion.div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-4 btn-saffron rounded-xl text-sm text-center cursor-pointer"
            >
              Begin Your Sacred Journey 🙏
            </Link>
            <Link
              href="/features"
              className="w-full sm:w-auto px-8 py-4 bg-white border border-slate-200 text-slate-900 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              Explore Features <ArrowRight size={16} />
            </Link>
          </div>

          {/* Preview Area with devotional framing */}
          <div className="mt-20 relative max-w-5xl mx-auto">
            <div className="absolute inset-0 bg-[#D4940A] opacity-[0.03] blur-[80px] rounded-full -z-10" />
            <div className="bg-white rounded-xl border border-slate-200 p-2 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#D4940A] via-[#F09819] to-[#D4940A]" />
              <div className="bg-gradient-to-br from-amber-50/50 to-slate-50 rounded-lg aspect-[16/9] flex flex-col items-center justify-center gap-4 text-[#D4940A]/40 border border-amber-100/40">
                <div className="text-6xl select-none opacity-30">ॐ</div>
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-400">Sacred Consultant Dashboard</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Value Proposition --- */}
      <section className="py-20 px-6 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { icon: <Calculator size={24} />, title: "Vedic Precision", desc: "Rigorous algorithms rooted in ancient Vedic mathematics for absolute accuracy.", href: "/features" },
            { icon: <Zap size={24} />, title: "Divine Speed", desc: "Lightning-fast sacred computations for real-time life-guidance decisions.", href: "/features" },
            { icon: <Globe size={24} />, title: "Global Traditions", desc: "Unified support for Chaldean, Pythagorean, and Lo Shu Grid analysis.", href: "/features" }
          ].map((item) => (
            <Link key={item.title} href={item.href} className="space-y-4 group cursor-pointer">
              <div className="text-[#1E293B] group-hover:text-[#D4940A] transition-colors">{item.icon}</div>
              <h3 className="text-lg font-bold tracking-tight group-hover:text-[#D4940A] transition-colors">{item.title}</h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">{item.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* --- Trust Signals --- */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto text-center space-y-12">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">Trusted by Professional Practitioners Worldwide</span>
          <div className="flex flex-wrap items-center justify-center gap-12 md:gap-20 opacity-50">
            <div className="flex items-center gap-2 text-xl font-black tracking-tight text-slate-600">
              <span className="text-[#D4940A]">🕉</span> VedicSoft
            </div>
            <div className="flex items-center gap-2 text-xl font-black tracking-tight text-slate-600">
              <span className="text-[#D4940A]">✨</span> JyotishPro
            </div>
            <div className="flex items-center gap-2 text-xl font-black tracking-tight text-slate-600">
              <span className="text-[#D4940A]">🔱</span> ShubhAnk
            </div>
            <div className="flex items-center gap-2 text-xl font-black tracking-tight text-slate-600">
              <span className="text-[#D4940A]">🪷</span> DivinePath
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
