"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Calculator,
  Zap,
  Globe,
  CheckCircle2,
  ArrowRight,
  LayoutDashboard,
  PieChart,
  Briefcase,
  Menu,
  X,
  Star,
  Shield,
  Smartphone,
  Car,
  Users
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Home() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [billingCycle, setBillingCycle] = useState('monthly');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const pricing = [
    {
      name: "Starter Pack",
      monthly: 999,
      yearly: 9999,
      description: "Essential tools for growing numerologists",
      features: [
        "Name Numerology Analysis",
        "Mobile Number Compatibility",
        "Up to 100 Client Records",
        "Basic PDF Reports",
        "Email Support"
      ],
      border: "border-astro-gold/20"
    },
    {
      name: "Professional Pack",
      monthly: 1999,
      yearly: 19999,
      description: "Advanced solutions for pro consultants",
      popular: true,
      features: [
        "Everything in Starter",
        "Business Numerology",
        "Vehicle Number Analysis",
        "AI-Powered Name Suggestions",
        "Unlimited Client Records",
        "Premium PDF Reports",
        "Priority Support (24/7)"
      ],
      border: "border-astro-red/20"
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] selection:bg-[#6366F1] selection:text-white font-sans">
      <Header />

      {/* --- Hero Section --- */}
      <section className="relative pt-48 pb-24 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-[0.03]">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,#1E293B_0%,transparent_50%)]" />
        </div>

        <div className="max-w-6xl mx-auto text-center space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-bold uppercase tracking-wider mb-8">
              <Shield size={12} className="text-[#D4AF37]" /> Enterprise-Grade Numerology Solutions
            </div>
            <h1 className="text-5xl md:text-8xl font-bold leading-[1.05] tracking-tight text-[#1E293B]">
              Professional Insights for <span className="text-[#64748B]">Strategic Success</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-500 max-w-3xl mx-auto font-normal mt-8 leading-relaxed">
              Empower your practice with advanced analytical tools. Combining ancient wisdom with modern precision for professional consultants.
            </p>
          </motion.div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-10">
            <button
              onClick={() => router.push('/admin/register')}
              className="w-full sm:w-auto px-10 py-5 bg-[#1E293B] text-white rounded-xl font-bold text-base hover:bg-[#334155] shadow-2xl shadow-slate-900/20 transform transition-all hover:-translate-y-1"
            >
              Start Free Trial
            </button>
            <button className="w-full sm:w-auto px-10 py-5 bg-white border border-slate-200 text-slate-900 rounded-xl font-bold text-base hover:bg-slate-50 transition-all">
              Request Demo
            </button>
          </div>

          {/* Preview Area */}
          <div className="mt-24 relative max-w-5xl mx-auto">
            <div className="absolute inset-0 bg-[#1E293B] opacity-[0.02] blur-[100px] rounded-full -z-10" />
            <div className="bg-white rounded-[2.5rem] border border-slate-200 p-4 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] relative">
              <div className="bg-slate-50 rounded-[1.50rem] aspect-[16/9] flex flex-col items-center justify-center gap-6 text-slate-200 border border-slate-100/50">
                <LayoutDashboard size={80} strokeWidth={0.5} />
                <span className="text-xs font-semibold uppercase tracking-[0.5em] text-slate-400">Advanced Consultant Dashboard</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Features Grid --- */}
      <section id="features" className="py-32 px-6 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto space-y-20">
          <div className="max-w-3xl">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#D4AF37]">Solution Ecosystem</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-4 tracking-tight text-[#1E293B]">Integrated Analytical Suites</h2>
            <p className="text-lg text-slate-500 mt-6">A comprehensive toolkit designed to scale your professional practice with accuracy and efficiency.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <Calculator size={24} />, name: "Advanced Analysis", desc: "Proprietary algorithms for comprehensive personal and professional decoding." },
              { icon: <Briefcase size={24} />, name: "Business Strategy", desc: "Strategic alignment for brands and corporations seeking numerical harmony." },
              { icon: <Smartphone size={24} />, name: "Digital Footprint", desc: "Optimize digital connectivity and mobile vibrations for professional impact." },
              { icon: <Car size={24} />, name: "Asset Suitability", desc: "Ensure operational assets are perfectly aligned with corporate objectives." },
              { icon: <Zap size={24} />, name: "Precise Engine", desc: "Instant high-fidelity results powered by our core vibrational logic." },
              { icon: <Users size={24} />, name: "Practice Management", desc: "Secure enterprise-grade CRM to manage extensive client portfolios." }
            ].map((feat) => (
              <div key={feat.name} className="p-8 rounded-[2rem] bg-slate-50/50 border border-slate-100 hover:border-[#D4AF37]/30 hover:bg-white transition-all group hover:shadow-2xl hover:shadow-slate-200/50">
                <div className="p-4 rounded-2xl bg-white border border-slate-100 text-[#1E293B] w-fit mb-6 shadow-sm group-hover:scale-110 group-hover:bg-[#1E293B] group-hover:text-white transition-all">
                  {feat.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 tracking-tight text-[#1E293B]">{feat.name}</h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Pricing --- */}
      <section id="pricing" className="py-32 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 space-y-6">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-[#1E293B]">Enterprise Pricing</h2>
            <p className="text-lg text-slate-500">Transparent solutions for independent consultants and agencies.</p>
            <div className="inline-flex p-1.5 bg-white border border-slate-200 rounded-2xl shadow-sm mt-8">
              <button onClick={() => setBillingCycle('monthly')} className={`px-8 py-3 rounded-xl text-xs font-bold transition-all ${billingCycle === 'monthly' ? 'bg-[#1E293B] text-white shadow-lg' : 'text-slate-500 hover:text-slate-900'}`}>Monthly</button>
              <button onClick={() => setBillingCycle('yearly')} className={`px-8 py-3 rounded-xl text-xs font-bold transition-all ${billingCycle === 'yearly' ? 'bg-[#1E293B] text-white shadow-lg' : 'text-slate-500 hover:text-slate-900'}`}>Yearly (Save 20%)</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
            {pricing.map((plan) => (
              <div key={plan.name} className={`bg-white p-10 rounded-[3rem] border ${plan.popular ? 'border-[#D4AF37] shadow-[0_32px_64px_-16px_rgba(212,175,55,0.15)] relative scale-105 z-10' : 'border-slate-200 shadow-xl'} flex flex-col`}>
                {plan.popular && <span className="absolute -top-5 left-1/2 -translate-x-1/2 px-6 py-2 bg-[#D4AF37] text-[#1E293B] text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">Professional Choice</span>}
                <div className="mb-10">
                  <h3 className="text-2xl font-bold tracking-tight text-[#1E293B]">{plan.name}</h3>
                  <p className="text-sm text-slate-500 mt-2">{plan.description}</p>
                </div>
                <div className="mb-10 flex items-baseline gap-2">
                  <span className="text-6xl font-bold tracking-tighter text-[#1E293B]">₹{billingCycle === 'monthly' ? plan.monthly : plan.yearly}</span>
                  <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                </div>
                <div className="space-y-4 mb-10 flex-1">
                  {plan.features.map(f => (
                    <div key={f} className="flex items-center gap-4 text-sm font-medium text-slate-600">
                      <div className="w-5 h-5 rounded-full bg-slate-50 flex items-center justify-center">
                        <CheckCircle2 size={14} className="text-[#D4AF37]" />
                      </div>
                      {f}
                    </div>
                  ))}
                </div>
                <button onClick={() => router.push('/admin/register')} className={`w-full py-5 rounded-2xl font-bold text-sm transition-all transform active:scale-95 ${plan.popular ? 'bg-[#1E293B] text-white shadow-xl hover:bg-[#334155]' : 'bg-slate-100 text-slate-900 hover:bg-slate-200'}`}>Select Plan</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

