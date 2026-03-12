import { useState } from "react";
import { motion } from "framer-motion";
import {
    BarChart3,
    TrendingUp,
    DollarSign,
    ArrowUpRight,
    Calendar,
    Filter,
    Download,
    PieChart,
    Target,
    Zap,
    Users
} from "lucide-react";

export default function RevenueReports() {
    const stats = [
        { label: "Total Gross Revenue", val: "₹14,82,920", growth: "+12.5%", icon: <DollarSign size={20} />, color: "text-[#C9A227]", bg: "bg-[#C9A227]/10" },
        { label: "Net Profit (Platform)", val: "₹12,41,500", growth: "+8.2%", icon: <Target size={20} />, color: "text-[#4B2E83]", bg: "bg-[#4B2E83]/10" },
        { label: "Active Subscriptions", val: "842", growth: "+15.3%", icon: <Users size={20} />, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    ];

    const revenueSources = [
        { name: "Credit Purchases", amount: "₹8,42,000", percentage: "57%", color: "bg-[#4B2E83]" },
        { name: "Premium Plans", amount: "₹4,20,000", percentage: "28%", color: "bg-[#C9A227]" },
        { name: "White Labeling", amount: "₹2,20,920", percentage: "15%", color: "bg-slate-300" },
    ];

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-slate-900">Revenue Intelligence</h1>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mt-1">Global Financial Analytics & Yield Mapping</p>
                </div>
                <div className="flex gap-4">
                    <button className="flex items-center gap-3 px-6 py-3 bg-white border border-slate-100 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] text-slate-500 hover:text-[#4B2E83] transition-all shadow-sm">
                        <Calendar size={16} /> Last 30 Days
                    </button>
                    <button className="flex items-center gap-3 px-8 py-3 bg-[#4B2E83] text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-xl shadow-purple-900/20 hover:bg-[#5D3AB0] transition-all active:scale-95">
                        <Download size={16} className="text-[#C9A227]" /> Export Ledger
                    </button>
                </div>
            </div>

            {/* Core Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {stats.map((s, idx) => (
                    <motion.div
                        key={idx}
                        whileHover={{ y: -5 }}
                        className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden group"
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className={`p-4 ${s.bg} ${s.color} rounded-2xl shadow-sm transition-all group-hover:scale-110`}>
                                {s.icon}
                            </div>
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-500 rounded-full text-[9px] font-black uppercase tracking-widest">
                                <TrendingUp size={10} /> {s.growth}
                            </div>
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2">{s.label}</p>
                            <h2 className="text-4xl font-black tracking-tighter text-slate-900 leading-none">{s.val}</h2>
                        </div>
                        <div className="absolute -bottom-4 -right-4 text-[#4B2E83]/[0.02] transform -rotate-12 group-hover:scale-110 transition-transform">
                            {s.icon}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Revenue Analytics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Main Graph Placeholder */}
                <div className="lg:col-span-8 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden">
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <h3 className="text-xl font-black text-slate-900 tracking-tight">Revenue Pulse</h3>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Daily transaction volume & settled amounts</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-[#4B2E83]"></div>
                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Net Vol</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-[#C9A227]"></div>
                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Gross Vol</span>
                            </div>
                        </div>
                    </div>

                    {/* Visual Placeholder for Chart */}
                    <div className="h-[300px] flex items-end justify-between gap-4 px-4">
                        {[40, 60, 45, 90, 65, 80, 55, 100, 75, 85, 50, 70].map((h, i) => (
                            <div key={i} className="flex-1 space-y-2 group cursor-pointer relative">
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${h}%` }}
                                    className={`w-full bg-slate-100 rounded-2xl group-hover:bg-[#4B2E83]/10 transition-all relative overflow-hidden`}
                                >
                                    <div className="absolute bottom-0 left-0 right-0 bg-[#4B2E83] h-1/2 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                </motion.div>
                                <div className="text-center text-[8px] font-black text-slate-300 group-hover:text-[#4B2E83] transition-colors">{['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][i]}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Distributions */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50">
                        <h3 className="text-lg font-black text-slate-900 tracking-tight mb-8">Yield Distribution</h3>
                        <div className="space-y-8">
                            {revenueSources.map((source, idx) => (
                                <div key={idx} className="space-y-3">
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                        <span className="text-slate-500">{source.name}</span>
                                        <span className="text-slate-900">{source.percentage}</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: source.percentage }}
                                            className={`h-full ${source.color} rounded-full shadow-sm`}
                                        ></motion.div>
                                    </div>
                                    <div className="text-[9px] font-bold text-slate-300 text-right">{source.amount}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-[#4B2E83] p-8 rounded-[3rem] shadow-2xl shadow-purple-900/40 relative overflow-hidden">
                        <div className="relative z-10">
                            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-white/50 mb-2">Quarterly Projection</h4>
                            <p className="text-3xl font-black text-white tracking-tighter">₹24,50,000</p>
                            <div className="mt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#C9A227]">
                                <Zap size={14} fill="currentColor" /> Efficiency Boost +18%
                            </div>
                        </div>
                        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
                        <div className="absolute -left-10 -top-10 w-32 h-32 bg-[#C9A227]/10 rounded-full blur-2xl"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
