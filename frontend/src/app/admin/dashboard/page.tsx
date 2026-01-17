"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    Users,
    Activity,
    Database,
    ChevronRight,
    Search,
    UserPlus,
    BookOpen,
    Clock,
    Sparkles,
    ArrowUpRight,
    Calendar,
    MousePointer2
} from "lucide-react";

interface Stats {
    total_clients: number;
    total_checks: number;
    total_compounds: number;
    recent_clients: any[];
    recent_checks: any[];
}

const StatCard = ({ title, value, icon: Icon, colorClass, delay = 0 }: any) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        className="premium-card p-6 border border-white/10 relative overflow-hidden group bg-card/60 backdrop-blur-md"
    >
        <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-2xl ${colorClass} bg-opacity-10 text-opacity-100 flex items-center justify-center shadow-lg`}>
                <Icon size={24} className={colorClass.replace('bg-', 'text-')} />
            </div>
            <div className="flex flex-col items-end">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">{title}</span>
                <span className="text-3xl font-black text-foreground tracking-tighter mt-1">{value.toLocaleString()}</span>
            </div>
        </div>

        {/* Progress Sparkline Simulation */}
        <div className="flex items-end gap-1 h-8 mt-4">
            {[40, 70, 45, 90, 65, 80, 50, 95].map((h, i) => (
                <div key={i} className={`flex-1 rounded-t-sm transition-all duration-1000 ${colorClass} opacity-20 group-hover:opacity-40`} style={{ height: `${h}%` }} />
            ))}
        </div>

        <div className="absolute -bottom-10 -right-10 opacity-[0.03] rotate-12 group-hover:rotate-0 transition-transform duration-700">
            <Icon size={120} />
        </div>
    </motion.div>
);

const QuickAction = ({ title, desc, icon: Icon, onClick, colorClass }: any) => (
    <button
        onClick={onClick}
        className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-card/40 hover:bg-card hover:border-primary/30 transition-all text-left group w-full"
    >
        <div className={`p-3 rounded-xl ${colorClass} bg-opacity-10 transition-colors group-hover:bg-opacity-20`}>
            <Icon size={20} className={colorClass.replace('bg-', 'text-')} />
        </div>
        <div className="flex-1 min-w-0">
            <h3 className="font-bold text-sm truncate">{title}</h3>
            <p className="text-[10px] text-muted-foreground truncate">{desc}</p>
        </div>
        <ChevronRight size={16} className="text-muted-foreground/30 group-hover:text-primary transition-all group-hover:translate-x-1" />
    </button>
);

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchStats = async () => {
            const token = localStorage.getItem("admin_token");
            if (!token) return router.push('/admin/login');
            try {
                const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
                const res = await fetch(`${baseUrl}/admin/dashboard/stats`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (res.status === 401) {
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
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                    <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary animate-pulse" size={24} />
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-4xl font-black tracking-tight text-foreground flex items-center gap-4">
                        <span className="p-3 bg-gradient-gold rounded-2xl shadow-2xl shadow-mystic-gold/20">
                            <Activity size={32} className="text-white" />
                        </span>
                        Admin <span className="text-gradient-gold">Insight</span>
                    </h1>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-[0.3em] mt-3 ml-1 opacity-60">System Analytics & Management Portal</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex bg-card/60 backdrop-blur-md border border-white/10 rounded-2xl p-2 px-4 items-center gap-3"
                >
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/80">System Live</span>
                    <div className="w-px h-4 bg-white/10 mx-1" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-foreground">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </motion.div>
            </div>

            {/* Statistics Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Total Clients"
                    value={stats?.total_clients || 0}
                    icon={Users}
                    colorClass="bg-[#6366f1]"
                    delay={0.1}
                />
                <StatCard
                    title="Vibrational Checks"
                    value={stats?.total_checks || 0}
                    icon={Activity}
                    colorClass="bg-[#0ea5e9]"
                    delay={0.2}
                />
                <StatCard
                    title="Known Compounds"
                    value={stats?.total_compounds || 0}
                    icon={Database}
                    colorClass="bg-[#f59e0b]"
                    delay={0.3}
                />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-10 items-start">

                {/* --- Main Area: Activities --- */}
                <div className="xl:col-span-2 space-y-10">

                    {/* Recent Calculations */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-black flex items-center gap-3">
                                <span className="p-1.5 bg-primary/10 rounded-lg text-primary"><Clock size={18} /></span>
                                Recent Analysis
                            </h2>
                            <button onClick={() => router.push('/admin/dashboard')} className="text-[10px] font-black uppercase tracking-widest text-primary hover:opacity-70 transition-opacity flex items-center gap-1 group">
                                View History <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>

                        <div className="grid gap-4">
                            {stats?.recent_checks.map((check, idx) => (
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 + (idx * 0.05) }}
                                    key={check.id}
                                    className="premium-card p-4 flex items-center justify-between bg-card/40 border border-border/50 hover:border-primary/30 transition-all group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary font-black group-hover:bg-primary group-hover:text-black transition-all">
                                            {check.name_value.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm tracking-tight">{check.name_value}</h4>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[9px] uppercase font-black text-muted-foreground/60 tracking-widest">{check.type}</span>
                                                <div className="w-1 h-1 rounded-full bg-border" />
                                                <span className="text-[9px] font-medium text-muted-foreground/40">{new Date(check.created_at).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <div className="hidden md:flex flex-col items-end">
                                            <span className="text-[8px] font-black uppercase text-muted-foreground/80 tracking-tighter">Vibrations</span>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className="text-xs font-black text-mystic-gold">{check.chaldean_compound}</span>
                                                <span className="text-[8px] opacity-20">|</span>
                                                <span className="text-xs font-black text-primary">{check.pythagorean_compound}</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => router.push(`/admin/check?name=${encodeURIComponent(check.name_value)}`)}
                                            className="p-2 rounded-lg bg-muted text-muted-foreground hover:bg-primary hover:text-black transition-all group/btn"
                                        >
                                            <MousePointer2 size={16} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Access Grid */}
                    <div className="space-y-6">
                        <h2 className="text-lg font-black flex items-center gap-3">
                            <span className="p-1.5 bg-secondary/10 rounded-lg text-secondary"><MousePointer2 size={18} /></span>
                            System Control
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <QuickAction
                                title="Analyze Signature"
                                desc="Run a live vibrational check"
                                icon={Search}
                                colorClass="bg-primary"
                                onClick={() => router.push('/admin/check')}
                            />
                            <QuickAction
                                title="Onboard Client"
                                desc="Register a new customer profile"
                                icon={UserPlus}
                                colorClass="bg-blue-500"
                                onClick={() => router.push('/admin/clients')}
                            />
                            <QuickAction
                                title="Compound Archive"
                                desc="Update vibrational meanings"
                                icon={BookOpen}
                                colorClass="bg-amber-500"
                                onClick={() => router.push('/admin/compounds')}
                            />
                            <QuickAction
                                title="Birth Relations"
                                desc="Configure planetary aspects"
                                icon={Sparkles}
                                colorClass="bg-emerald-500"
                                onClick={() => router.push('/admin/settings')}
                            />
                        </div>
                    </div>
                </div>

                {/* --- Sidebar: Secondary Info --- */}
                <div className="space-y-10">

                    {/* Recent Clients */}
                    <div className="premium-card p-6 bg-primary/5 border-primary/10 relative overflow-hidden">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-black text-sm uppercase tracking-widest text-primary flex items-center gap-2">
                                <Users size={16} />
                                New Souls
                            </h3>
                            <button onClick={() => router.push('/admin/clients')} className="p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-black transition-all">
                                <ArrowUpRight size={14} />
                            </button>
                        </div>

                        <div className="space-y-5">
                            {stats?.recent_clients.map((client, idx) => (
                                <div key={client.id} className="flex items-center gap-4 group">
                                    <div className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center text-[10px] font-black text-muted-foreground group-hover:border-primary/50 group-hover:text-primary transition-all">
                                        {client.full_name.charAt(0)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h5 className="text-xs font-bold truncate tracking-tight">{client.full_name}</h5>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <Calendar size={8} className="text-muted-foreground/40" />
                                            <span className="text-[8px] font-medium text-muted-foreground/60">{new Date(client.dob).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div className="text-[8px] font-black text-muted-foreground/20 group-hover:text-primary transition-colors">
                                        ID: {client.id}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Static Badge */}
                        <div className="mt-8 pt-6 border-t border-primary/10 flex items-center justify-between">
                            <div className="flex flex-col">
                                <span className="text-[8px] font-black uppercase text-muted-foreground tracking-widest">Growth</span>
                                <span className="text-sm font-black text-foreground">+12%</span>
                            </div>
                            <div className="px-3 py-1 bg-primary/10 rounded-full text-[8px] font-black uppercase tracking-widest text-primary">
                                Trending Up
                            </div>
                        </div>
                    </div>

                    {/* Pro-Tips / Alerts */}
                    <div className="premium-card p-6 bg-card/40 border-border/50">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary-rgb),0.5)]" />
                            <h3 className="text-[10px] font-black uppercase tracking-widest opacity-80">Maintenance Alert</h3>
                        </div>
                        <p className="text-[11px] font-medium text-muted-foreground leading-relaxed">
                            System database optimization is scheduled for <span className="text-foreground font-bold">Sunday at 02:00 AM</span>. Expect brief outages during this window.
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
}
