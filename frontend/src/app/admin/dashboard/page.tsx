"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    Users,
    Database,
    ChevronRight,
    Search,
    Sparkles,
    ArrowUpRight,
    Calendar,
    Zap,
    Briefcase,
    Smartphone,
    Car
} from "lucide-react";

interface Stats {
    total_clients: number;
    total_checks: number;
    total_compounds: number;
    recent_clients: any[];
    recent_checks: any[];
}

const StatCard = ({ title, value, icon: Icon, color, delay = 0 }: any) => (
    <div
        className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
        <div className="flex items-start justify-between relative z-10">
            <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{title}</span>
                <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-[#1E293B] tracking-tight">{value.toLocaleString()}</span>
                </div>
            </div>
            <div className={`p-4 rounded-xl ${color} bg-opacity-10 flex items-center justify-center shadow-sm`}>
                <Icon size={24} className={color.replace('bg-', 'text-')} />
            </div>
        </div>

        <div className="flex items-end gap-1.5 h-12 mt-8 opacity-20 relative z-10">
            {[30, 60, 40, 80, 50, 70, 45, 90].map((h, i) => (
                <div
                    key={i}
                    className={`flex-1 rounded-t-md ${color} transition-all duration-1000 group-hover:opacity-100`}
                    style={{ height: `${h}%` }}
                />
            ))}
        </div>

        <Icon size={120} className="absolute -bottom-10 -right-10 opacity-[0.03] rotate-12 group-hover:rotate-0 transition-transform duration-700 pointer-events-none" />
    </div>
);

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchStats = async () => {
            const token = localStorage.getItem("admin_token") || localStorage.getItem("token");
            if (!token) return router.push('/admin/login');
            try {
                const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
                const res = await fetch(`${baseUrl}/admin/dashboard/stats`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (res.status === 401) {
                    localStorage.removeItem("admin_token");
                    router.push('/admin/login');
                    return;
                }

                if (!res.ok) throw new Error("Failed to fetch stats");

                const data = await res.json();
                setStats(data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [router]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
                <div className="w-16 h-16 border-4 border-slate-100 border-t-[#1E293B] rounded-full animate-spin" />
                <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">Loading Intelligence...</span>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-12">
            {/* --- Corporate Header --- */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                <div className="opacity-100">
                    <div className="flex items-center gap-4 mb-3">
                        <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider rounded-full border border-slate-200">System v2.5</span>
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Encrypted Connection</span>
                        </div>
                    </div>
                    <h1 className="text-5xl font-bold tracking-tight text-[#1E293B] flex items-center gap-4">
                        <Sparkles size={40} className="text-[#D4AF37]" />
                        Executive <span className="text-slate-400 font-light">Overview</span>
                    </h1>
                </div>

                <div className="flex bg-white border border-slate-200 rounded-2xl p-4 px-6 items-center gap-6 shadow-sm">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37]">Operational Cycle</span>
                        <span className="text-sm font-bold text-[#1E293B]">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                </div>
            </div>

            {/* --- Stats --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <StatCard
                    title="Total Portfolios"
                    value={stats?.total_clients || 0}
                    icon={Users}
                    color="bg-indigo-600"
                    delay={0.1}
                />
                <StatCard
                    title="Analysis Volume"
                    value={stats?.total_checks || 0}
                    icon={Zap}
                    color="bg-slate-800"
                    delay={0.2}
                />
                <StatCard
                    title="Data Archive"
                    value={stats?.total_compounds || 0}
                    icon={Database}
                    color="bg-emerald-600"
                    delay={0.3}
                />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-12 items-start">
                <div className="xl:col-span-2 space-y-12">
                    {/* Activity Feed */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400">Real-time Activity Feed</h2>
                            <button onClick={() => router.push('/admin/dashboard')} className="text-xs font-bold text-[#1E293B] hover:text-[#D4AF37] transition-colors">View All Logs</button>
                        </div>

                        <div className="grid gap-4">
                            {stats?.recent_checks.map((check, idx) => (
                                <div
                                    key={check.id}
                                    className="p-5 flex items-center justify-between bg-white border border-slate-100 rounded-2xl hover:border-slate-300 hover:shadow-lg transition-all group"
                                >
                                    <div className="flex items-center gap-5">
                                        <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-900 font-bold group-hover:bg-[#1E293B] group-hover:text-white transition-all text-xl shadow-inner">
                                            {check.name_value.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-base tracking-tight text-[#1E293B] group-hover:text-[#D4AF37] transition-colors">{check.name_value}</h4>
                                            <div className="flex items-center gap-3 mt-1.5">
                                                <span className="px-2 py-0.5 rounded bg-slate-100 text-[10px] font-bold uppercase text-slate-500 tracking-wider border border-slate-200">{check.type}</span>
                                                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">{new Date(check.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button onClick={() => router.push(`/admin/check?name=${encodeURIComponent(check.name_value)}`)} className="p-3 rounded-xl bg-slate-50 text-slate-400 hover:bg-[#1E293B] hover:text-white transition-all">
                                        <ArrowUpRight size={20} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-10">
                    <div className="p-8 rounded-[2.5rem] bg-white border border-slate-200 shadow-sm relative overflow-hidden">
                        <div className="flex items-center justify-between mb-10">
                            <h3 className="font-bold text-xs uppercase tracking-[0.2em] text-[#D4AF37] flex items-center gap-2">
                                <Users size={16} /> New Portfolios
                            </h3>
                            <button onClick={() => router.push('/admin/clients')} className="p-2 rounded-lg bg-slate-50 text-slate-400 hover:text-[#1E293B] transition-colors">
                                <PlusIcon className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-6">
                            {stats?.recent_clients.map((client) => (
                                <div key={client.id} className="flex items-center gap-4 group cursor-pointer" onClick={() => router.push(`/admin/clients/${client.id}`)}>
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-xs font-bold text-slate-400 group-hover:border-[#D4AF37]/50 group-hover:text-[#1E293B] transition-all">
                                        {client.full_name.charAt(0)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h5 className="text-sm font-bold truncate text-slate-600 group-hover:text-[#1E293B] transition-colors uppercase tracking-tight">{client.full_name}</h5>
                                        <div className="flex items-center gap-1.5 mt-1 opacity-40">
                                            <Calendar size={10} />
                                            <span className="text-[10px] font-bold uppercase tracking-wider">{new Date(client.dob).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl relative group">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]" />
                            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">System Integrity</h3>
                        </div>
                        <p className="text-sm font-normal text-slate-300 leading-relaxed">
                            Vibrational synchronization and data reconciliation scheduled for <span className="text-[#D4AF37] font-bold">02:00 UTC</span>. All systems are operating within nominal parameters.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function PlusIcon(props: any) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" /><path d="M12 5v14" />
        </svg>
    )
}

