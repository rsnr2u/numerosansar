"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CheckCircle2, Shield, Info } from "lucide-react";

export default function PricingPage() {
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

    const pricing = [
        {
            name: "Starter Path",
            monthly: 999,
            yearly: 9999,
            description: "Essential sacred tools for growing numerologists and independent consultants.",
            features: [
                "Name Numerology Analysis",
                "Mobile Number Compatibility",
                "Up to 100 Client Records",
                "Standard PDF Reports",
                "Email Support",
                "Cloud Synchronization"
            ],
            popular: false
        },
        {
            name: "Professional Path",
            monthly: 1999,
            yearly: 19999,
            description: "Advanced divine solutions for established consultants and agencies.",
            features: [
                "Everything in Starter Path",
                "Business Numerology Suite",
                "Vehicle Number Analysis",
                "AI-Powered Name Suggestions",
                "Unlimited Client Records",
                "White-label PDF Reports",
                "Priority 24/7 Support",
                "Team Access Controls"
            ],
            popular: true
        }
    ];

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B]">
            <Header />

            <main className="pt-24 pb-16">
                {/* --- Header --- */}
                <section className="px-6 py-16 border-b border-slate-200 bg-white">
                    <div className="max-w-6xl mx-auto text-center space-y-6">
                        <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-[#D4940A]">
                            <span className="text-base">🙏</span> Auspicious Plans
                        </span>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#1E293B]">Choose Your <span className="text-gradient-gold">Sacred Path</span></h1>
                        <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">Select the plan that best supports your professional practice and spiritual growth.</p>

                        <div className="inline-flex p-1 bg-amber-50 border border-amber-200/50 rounded-xl mt-4">
                            <button
                                onClick={() => setBillingCycle('monthly')}
                                className={`px-6 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${billingCycle === 'monthly' ? 'bg-[#1E293B] text-white shadow-lg' : 'text-slate-500 hover:text-slate-900'}`}
                            >
                                Monthly
                            </button>
                            <button
                                onClick={() => setBillingCycle('yearly')}
                                className={`px-6 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${billingCycle === 'yearly' ? 'bg-[#1E293B] text-white shadow-lg' : 'text-slate-500 hover:text-slate-900'}`}
                            >
                                Yearly (Save 20%)
                            </button>
                        </div>
                    </div>
                </section>

                {/* --- Pricing Grid --- */}
                <section className="px-6 py-16">
                    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                        {pricing.map((plan) => (
                            <motion.div
                                key={plan.name}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className={`bg-white p-10 rounded-xl border-2 transition-all ${plan.popular ? 'border-[#D4940A] shadow-2xl shadow-amber-200/20 relative' : 'border-slate-100 shadow-xl'}`}
                            >
                                {plan.popular && (
                                    <span className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-gradient-to-r from-[#D4940A] to-[#F09819] text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-amber-500/20">
                                        🙏 Most Blessed
                                    </span>
                                )}

                                <div className="mb-8">
                                    <h3 className="text-xl font-bold tracking-tight text-[#1E293B]">{plan.name}</h3>
                                    <p className="text-sm text-slate-500 mt-2 font-medium">{plan.description}</p>
                                </div>

                                <div className="mb-8 flex items-baseline gap-2">
                                    <span className="text-5xl font-bold tracking-tighter text-[#1E293B]">
                                        ₹{billingCycle === 'monthly' ? plan.monthly.toLocaleString() : plan.yearly.toLocaleString()}
                                    </span>
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">
                                        /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                                    </span>
                                </div>

                                <div className="space-y-4 mb-10 min-h-[250px]">
                                    {plan.features.map(f => (
                                        <div key={f} className="flex items-start gap-3 text-sm font-medium text-slate-600 leading-relaxed">
                                            <div className="mt-1 flex-shrink-0">
                                                <CheckCircle2 size={16} className="text-[#D4940A]" />
                                            </div>
                                            {f}
                                        </div>
                                    ))}
                                </div>

                                <Link
                                    href="/register"
                                    className={`block w-full py-4 rounded-xl font-bold text-xs uppercase tracking-widest transition-all transform active:scale-95 text-center cursor-pointer ${plan.popular ? 'btn-saffron' : 'bg-slate-50 text-slate-900 border border-slate-200 hover:bg-slate-100'}`}
                                >
                                    Begin {plan.name} 🙏
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* --- FAQ Mini --- */}
                <section className="px-6 py-16 max-w-4xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-3">
                            <h4 className="flex items-center gap-2 text-sm font-bold text-[#1E293B]"><Shield size={16} className="text-[#D4940A]" /> Sacred Security</h4>
                            <p className="text-xs text-slate-500 font-medium leading-relaxed">All plans include 256-bit SSL encryption and daily off-site backups for maximum data integrity and spiritual trust.</p>
                        </div>
                        <div className="space-y-3">
                            <h4 className="flex items-center gap-2 text-sm font-bold text-[#1E293B]"><Info size={16} className="text-[#D4940A]" /> Flexible Upgrades</h4>
                            <p className="text-xs text-slate-500 font-medium leading-relaxed">Scale your sacred practice anytime. Prorated billing ensures transparent and fair transitions between plans.</p>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
