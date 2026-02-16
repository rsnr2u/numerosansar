"use client";

import { useState, useEffect } from "react";
import { Users, CreditCard, ShieldCheck, Zap, ArrowUpRight, TrendingUp, Calendar, Clock, CheckCircle2, AlertCircle, ChevronRight, Filter, Sparkles, Activity, Download } from "lucide-react";
import { api } from "@/lib/api";
import { motion } from "framer-motion";

export default function SuperAdminDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [vendors, setVendors] = useState<any[]>([]);
    const [regStats, setRegStats] = useState<any[]>([]);
    const [trends, setTrends] = useState<any[]>([]);
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [statsRes, vendorsRes, regRes, trendRes, logRes] = await Promise.all([
                api.get('/admin/payments/stats'),
                api.get('/admin/vendors'),
                api.get('/admin/registration-stats'),
                api.get('/admin/payments/trends'),
                api.get('/admin/audit-logs')
            ]);

            if (statsRes.ok) setStats(await statsRes.json());
            if (vendorsRes.ok) setVendors(await vendorsRes.json());
            if (regRes.ok) setRegStats(await regRes.json());
            if (trendRes.ok) setTrends(await trendRes.json());
            if (logRes.ok) setLogs(await logRes.json());
        } catch (err) {
            console.error("Dashboard Fetch Error:", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="w-12 h-12 border-4 border-slate-200 border-t-black rounded-full animate-spin"></div>
        </div>
    );

    const totalClients = Array.isArray(vendors) ? vendors.reduce((acc, v) => acc + (v.client_count || 0), 0) : 0;

    // Map regStats to 7 slots (last 7 days)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        const iso = d.toISOString().split('T')[0];
        const stat = regStats.find(s => s.date === iso);
        return {
            date: iso,
            day: d.toLocaleDateString('en-US', { weekday: 'short' }),
            count: stat ? parseInt(stat.count) : 0
        };
    });

    return (
        <div className="space-y-10 pb-20">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-1">Overview</h1>
                    <p className="text-sm font-medium text-slate-500 italic">Live platform oversight and ecosystem telemetry.</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={fetchData} className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm">
                        Refresh Matrix
                    </button>
                    <button
                        onClick={() => window.print()}
                        className="px-5 py-2.5 bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#E61111] transition-all flex items-center gap-2 shadow-lg shadow-black/10"
                    >
                        <Download size={14} /> Generate Intel
                    </button>
                </div>
            </div>

            {/* Top Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <StatCard
                    title="Active Vendors"
                    value={stats?.total_vendors || 0}
                    icon={<Users className="text-blue-500" size={24} />}
                    color="bg-blue-500/10"
                    actionIcon={<div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center text-white"><ArrowUpRight size={14} /></div>}
                />
                <StatCard
                    title="Global Client Base"
                    value={totalClients}
                    icon={<CheckCircle2 className="text-[#10B981]" size={24} />}
                    color="bg-[#10B981]/10"
                    actionIcon={<div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 group-hover:text-black transition-colors"><TrendingUp size={14} /></div>}
                />
                <StatCard
                    title="Monthly Revenue"
                    value={`₹${(stats?.monthly_revenue || 0).toLocaleString()}`}
                    icon={<CreditCard className="text-[#E61111]" size={24} />}
                    color="bg-[#E61111]/10"
                    actionIcon={<div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 group-hover:text-black transition-colors"><Zap size={14} /></div>}
                />
            </div>

            {/* Middle Section: Schedule & Calendar */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Timeline Visualization: Real Registration Flow */}
                <div className="lg:col-span-9 bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
                    <div className="flex items-center justify-between mb-8 px-2">
                        <div className="flex items-center gap-6">
                            <h3 className="text-xl font-black tracking-tighter italic">Registration Pulse</h3>
                            <div className="flex gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">
                                <span className="text-black">7 Day Cycle</span>
                                <span className="hover:text-black cursor-pointer">Matrix View</span>
                            </div>
                        </div>
                        <div className="p-2 border border-slate-100 rounded-lg hover:bg-slate-50 transition-all text-slate-300"><Filter size={14} /></div>
                    </div>

                    <div className="relative h-[400px] border border-slate-100 rounded-3xl overflow-hidden bg-slate-50/30">
                        <div className="absolute inset-0 grid grid-cols-7 divide-x divide-slate-100/50">
                            {last7Days.map((d, i) => (
                                <div key={i} className="h-full flex flex-col items-center justify-center group relative">
                                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-12 bg-slate-100 rounded-full transition-all group-hover:bg-black/5" style={{ height: '70%', maxHeight: '250px' }}></div>
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${Math.min((d.count / (Math.max(...last7Days.map(x => x.count)) || 1)) * 100, 100)}%` }}
                                        className="absolute bottom-10 left-1/2 -translate-x-1/2 w-12 bg-black rounded-full flex items-end justify-center pb-4 shadow-lg"
                                        style={{ maxHeight: '250px' }}
                                    >
                                        {d.count > 0 && <span className="text-[10px] font-black text-white">{d.count}</span>}
                                    </motion.div>
                                    <div className="absolute bottom-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">{d.day}</div>
                                </div>
                            ))}
                        </div>
                        <div className="absolute top-0 inset-x-0 h-10 border-b border-slate-100 flex items-center px-6 text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">
                            Global Deployment Chronology
                        </div>
                    </div>
                </div>

                {/* Right Side: Subscription Intel */}
                <div className="lg:col-span-3">
                    <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm h-full flex flex-col">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-sm font-black uppercase tracking-widest italic">Subscription State</h3>
                            <div className="text-slate-300"><Activity size={16} /></div>
                        </div>

                        <div className="mb-10 text-center py-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">Active Pipelines</p>
                            <h4 className="text-5xl font-black tracking-tighter italic">{stats?.active_subs || 0}</h4>
                        </div>

                        <div className="space-y-6 flex-1">
                            <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest px-2 mb-2">Upcoming Renewals</div>
                            {vendors.slice(0, 4).map((v, i) => (
                                <div key={i} className="flex items-center gap-4 group">
                                    <div className="w-1.5 h-6 rounded-full bg-slate-100 transition-all group-hover:bg-black"></div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-black italic truncate">{v.full_name || v.username}</p>
                                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{v.plan_name || 'Trial'}</p>
                                    </div>
                                    <div className={`w-2 h-2 rounded-full ${v.sub_status === 'active' ? 'bg-[#10B981]' : 'bg-red-500'}`}></div>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => window.location.href = '/super-admin/vendors'}
                            className="w-full mt-8 py-4 bg-slate-100 text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-[0.25em] hover:bg-black hover:text-white transition-all shadow-sm"
                        >
                            Manage Ecosystem
                        </button>
                    </div>
                </div>
            </div>

            {/* Bottom Section: Flux Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* 1. Real System Alerts (Based on failed logs/subs) */}
                <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-lg font-black tracking-tight italic">System Alerts</h3>
                        <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest">Live Pulse</span>
                    </div>
                    <div className="space-y-4">
                        {vendors.filter(v => v.sub_status !== 'active').slice(0, 3).map((v, i) => (
                            <TaskAlert key={i} title={`Entity ${v.username} access ${v.sub_status || 'invalid'}`} status="Warning" time="0m ago" />
                        ))}
                        {vendors.length === 0 && <p className="text-[10px] font-black text-slate-300 uppercase text-center py-4">No critical flux detected</p>}
                    </div>
                </div>

                {/* 2. Real Revenue Flow (Ecosystem Trends) */}
                <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-lg font-black tracking-tight italic">Revenue Flux</h3>
                        <div className="flex gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            <div className="w-2 h-2 rounded-full bg-slate-200"></div>
                        </div>
                    </div>
                    <div className="h-40 flex items-end justify-between gap-1 px-2">
                        {Array.from({ length: 10 }, (_, i) => {
                            const d = new Date();
                            d.setDate(d.getDate() - (9 - i));
                            const iso = d.toISOString().split('T')[0];
                            const t = trends.find(x => x.date === iso);
                            const val = t ? parseFloat(t.total) : 0;
                            const max = Math.max(...trends.map(x => parseFloat(x.total))) || 1;
                            const h = (val / max) * 100;
                            return (
                                <div key={i} className="w-full bg-slate-100 rounded-t-lg transition-all h-full relative group">
                                    <div
                                        className={`absolute bottom-0 inset-x-0 ${val > 0 ? 'bg-blue-500' : 'bg-slate-200'} rounded-t-lg hover:brightness-110 transition-all`}
                                        style={{ height: `${Math.max(h, val > 0 ? 5 : 0)}%` }}
                                    ></div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="mt-6 flex justify-between text-[8px] font-black text-slate-400 uppercase tracking-widest px-2">
                        <span>10 Days Ago</span>
                        <span>Now</span>
                    </div>
                </div>

                {/* 3. Real Global Activity Feed (Audit Logs) */}
                <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-lg font-black tracking-tight italic">Audit Flux</h3>
                        <button onClick={() => window.location.href = '/super-admin/audit-logs'} className="text-[9px] font-black uppercase text-[#E61111]">Deep Seq</button>
                    </div>
                    <div className="space-y-6">
                        {logs.slice(0, 4).map((l, i) => (
                            <div key={i} className="flex gap-4 group">
                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black uppercase text-slate-400 group-hover:bg-black group-hover:text-white transition-all shadow-sm">
                                    {(l.performer_name || 'S')[0]}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-black leading-tight italic truncate">
                                        {l.performer_name || 'System'} <span className="text-slate-400 font-medium tracking-normal not-italic">{l.action.replace(/_/g, ' ')}</span>
                                    </p>
                                    <p className="text-[9px] text-[#E61111] font-black uppercase tracking-widest mt-1">Confirmed • {new Date(l.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, color, actionIcon }: any) {
    return (
        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm group hover:shadow-lg transition-all relative overflow-hidden">
            <div className="flex items-center justify-between mb-6">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
                    {icon}
                </div>
                {actionIcon}
            </div>
            <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">{title}</p>
                <h2 className="text-4xl font-black tracking-tighter text-black italic">{value}</h2>
            </div>
        </div>
    );
}

function TaskAlert({ title, status, time }: any) {
    return (
        <div className="flex items-center gap-4 p-2 relative">
            <div className={`w-2 h-2 rounded-full ${status === 'Critical' ? 'bg-[#E61111]' : status === 'High' ? 'bg-orange-500' : 'bg-slate-300'}`}></div>
            <div className="flex-1 min-w-0">
                <p className="text-xs font-black tracking-tight truncate">{title}</p>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{time}</p>
            </div>
            <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded shadow-sm ${status === 'Critical' ? 'bg-red-50 text-red-500 border border-red-100' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}>
                {status}
            </span>
        </div>
    );
}
