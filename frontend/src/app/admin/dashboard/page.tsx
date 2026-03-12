import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import {
    Users, ChevronRight, Search, Sparkles,
    TrendingUp, CreditCard, AlertTriangle, ArrowUpRight,
    Clock, ExternalLink, ArrowRight, UserPlus, FileText,
    Percent, History, ShoppingBag, Calendar
} from "lucide-react";

interface DashboardStats {
    total_clients: number;
    total_analyses: number;
    credits_remaining: number;
    credits_used_this_month: number;
    is_trial: boolean;
    plan_name: string;
    trial_days_remaining: number;
    trial_total_days: number;
    daily_usage_chart: { date: string, count: number }[];
    recent_clients: any[];
    usage_history: any[];
    purchase_history: any[];
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    const fetchDashboardStats = async () => {
        try {
            const res = await api.get('/admin/dashboard/stats');
            if (res.ok) {
                const data = await res.json();
                setStats(data);
            }
        } catch (e) {
            console.error("Dashboard Stats Error:", e);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/admin/clients?search=${encodeURIComponent(searchQuery)}`);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <div className="w-12 h-12 border-4 border-slate-100 border-t-[#4B2E83] rounded-full animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Initializing Workstation...</p>
        </div>
    );

    const credits = stats?.credits_remaining || 0;

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-20">
            {/* 8️⃣ Low Credit Warning */}
            <AnimatePresence>
                {credits < 5 && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl flex items-center justify-between mb-4 overflow-hidden"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                                <AlertTriangle size={20} />
                            </div>
                            <div>
                                <h4 className="text-sm font-black text-red-900 uppercase tracking-widest leading-none mb-1">Low Credit Alert</h4>
                                <p className="text-xs text-red-700 font-bold">You have only {credits} credits remaining. Buy credits to continue performing analysis.</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => navigate('/admin/credits')} className="px-4 py-2 bg-red-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg">Buy Credits</button>
                            <button onClick={() => navigate('/admin/credits')} className="px-4 py-2 bg-white text-red-600 border border-red-200 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-red-50 transition-all">View Packages</button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Welcome back, {localStorage.getItem('username')?.split(' ')[0] || 'Numerologist'}</h1>
                    <p className="text-slate-500 text-sm font-medium mt-1">Manage your clients and perform numerology analysis with ease.</p>
                </div>
                
                {stats?.is_trial && (
                    <div className="bg-amber-50 px-4 py-2 rounded-xl border border-amber-200 flex items-center gap-3">
                        <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                            <Clock size={16} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-amber-900 uppercase tracking-widest leading-none">Trial Ending Soon</p>
                            <p className="text-[10px] font-bold text-amber-600">{stats.trial_days_remaining} Days Left</p>
                        </div>
                    </div>
                )}
            </div>

            {/* 1️⃣ Trial Status Panel (Visible only if trial) */}
            {stats?.is_trial && (
                <div className="bg-gradient-to-br from-[#4B2E83] to-[#6d44bd] p-8 rounded-[2rem] text-white shadow-2xl shadow-purple-900/10 flex flex-col md:flex-row justify-between gap-8 animate-in fade-in slide-in-from-top-6 duration-700">
                    <div className="max-w-md space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/20">
                            <Sparkles size={12} className="text-[#C9A227]" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Free Trial Active</span>
                        </div>
                        <h2 className="text-3xl font-black tracking-tight leading-none">Level up your practice.</h2>
                        <p className="text-purple-100/70 text-sm font-medium">Your trial will expire soon. Purchase credits to continue using Numero Sansar and access all professional reports.</p>
                        
                        <div className="flex gap-3 pt-4">
                            <button onClick={() => navigate('/admin/credits')} className="px-8 py-4 bg-[#C9A227] text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white hover:text-[#4B2E83] transition-all shadow-lg">Buy Credits</button>
                            <button onClick={() => navigate('/admin/credits')} className="px-8 py-4 bg-white/10 text-white border border-white/20 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white/20 transition-all">View Packages</button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full md:w-auto">
                        <div className="p-8 bg-white/10 rounded-[2rem] border border-white/10 backdrop-blur-md flex flex-col justify-center min-w-[200px]">
                            <p className="text-[10px] font-black text-purple-200 uppercase tracking-[0.2em] mb-3">Trial Credits</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-5xl font-black">{stats.credits_remaining}</span>
                                <span className="text-sm font-bold text-purple-300 opacity-60">Available</span>
                            </div>
                        </div>
                        <div className="p-8 bg-white/10 rounded-[2rem] border border-white/10 backdrop-blur-md flex flex-col justify-center min-w-[200px]">
                            <p className="text-[10px] font-black text-purple-200 uppercase tracking-[0.2em] mb-3">Days Remaining</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-5xl font-black">{stats.trial_days_remaining}</span>
                                <span className="text-sm font-bold text-purple-300 opacity-60">of {stats.trial_total_days || 7} Days</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 2️⃣ Credit Status Cards (Updated) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 text-emerald-500 opacity-20 group-hover:scale-125 transition-transform">
                        <CreditCard size={48} />
                    </div>
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Available Credits</h3>
                    <div className="text-3xl font-black text-slate-800">{stats?.credits_remaining || 0}</div>
                    <p className="text-xs font-bold text-emerald-500 mt-1">Ready for analysis</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Credits Used (Month)</h3>
                    <div className="text-3xl font-black text-slate-800">{stats?.credits_used_this_month || 0}</div>
                    <p className="text-xs font-bold text-blue-500 mt-1">Efficiency Tracking</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Analyses</h3>
                    <div className="text-3xl font-black text-slate-800">{stats?.total_analyses || 0}</div>
                    <p className="text-xs font-bold text-[#C9A227] mt-1">Total Reports Generated</p>
                </div>
                <div className="bg-[#f8f9fc] p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all group flex flex-col justify-between">
                    <div>
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Current Package</h3>
                        <div className="text-sm font-black text-[#4B2E83] uppercase tracking-tighter">{stats?.plan_name || 'Free Trial'}</div>
                    </div>
                    <button onClick={() => navigate('/admin/credits')} className="w-full mt-4 py-2 bg-[#4B2E83] text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all">Buy Credits</button>
                </div>
            </div>

            {/* 3️⃣ Consultation Center (Main Feature) */}
            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 flex flex-col lg:flex-row items-center gap-12">
                <div className="flex-1 space-y-6">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Search Client</h2>
                        <p className="text-slate-400 text-sm font-medium">All numerology analysis is performed inside the client dashboard.</p>
                    </div>

                    <form onSubmit={handleSearch} className="relative group max-w-2xl">
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#4B2E83] transition-colors">
                            <Search size={22} />
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search client by name, phone number, or email"
                            className="w-full pl-16 pr-44 py-5 bg-slate-50 border border-slate-100 rounded-2xl text-slate-800 font-bold shadow-sm outline-none focus:bg-white focus:ring-4 focus:ring-[#4B2E83]/10 focus:border-[#4B2E83] transition-all text-lg"
                        />
                        <button
                            type="submit"
                            className="absolute right-3 top-1/2 -translate-y-1/2 px-8 py-3 bg-[#4B2E83] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg shadow-purple-900/20"
                        >
                            Find Client
                        </button>
                    </form>

                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/admin/clients?action=new')} className="flex items-center gap-2 px-6 py-3 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all">
                            <UserPlus size={16} /> Create New Client
                        </button>
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">or browse recent profiles below</p>
                    </div>
                </div>

                <div className="hidden lg:block w-px h-40 bg-slate-100" />

                <div className="w-full lg:w-64 flex flex-col items-center justify-center p-6 bg-slate-50 rounded-3xl border border-slate-100 text-center space-y-3">
                    <div className="w-16 h-16 rounded-2xl bg-white shadow-xl flex items-center justify-center text-[#C9A227]">
                        <TrendingUp size={32} />
                    </div>
                    <div>
                        <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest">SaaS Insight</h4>
                        <p className="text-[10px] font-bold text-slate-400 mt-1">Average 5 clients per week this month.</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* LEFT COLUMN: Activity & Usage */}
                <div className="lg:col-span-8 space-y-10">
                    {/* 4️⃣ Credit Usage Chart */}
                    <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-8">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                                <TrendingUp size={20} className="text-[#C9A227]" /> Credit Usage (Last 30 Days)
                            </h2>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Daily Consumption</span>
                        </div>

                        {/* Custom CSS Bar Chart */}
                        <div className="h-48 flex items-end gap-1.5 md:gap-2 px-2">
                            {stats?.daily_usage_chart.map((day, i) => (
                                <div key={i} className="flex-1 group relative">
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${Math.min(100, (day.count / (Math.max(...stats.daily_usage_chart.map(d=>d.count)) || 1)) * 100)}%` }}
                                        className="w-full bg-[#4B2E83]/10 group-hover:bg-[#4B2E83] rounded-t-md transition-all relative"
                                    >
                                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-slate-800 text-white text-[8px] font-black px-1.5 py-0.5 rounded transition-opacity whitespace-nowrap">
                                            {day.count} CR
                                        </div>
                                    </motion.div>
                                    {/* Tooltip or Label every 5 days or so for readability */}
                                    {i % 5 === 0 && (
                                        <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 text-[8px] font-black text-slate-300 uppercase transform -rotate-45 md:rotate-0">
                                            {day.date.split(' ')[0]}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 5️⃣ Recent Clients Table */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-black text-slate-900">Recent Clients</h2>
                        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 border-b border-slate-100">
                                    <tr>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Client Name</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">DOB</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Last Analysis</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Credits Used</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {stats?.recent_clients.map((client) => (
                                        <tr key={client.id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="text-xs font-black text-slate-800">{client.full_name}</div>
                                            </td>
                                            <td className="px-6 py-4 text-center text-[10px] font-medium text-slate-500">{client.dob || '—'}</td>
                                            <td className="px-6 py-4 text-center text-[10px] font-medium text-slate-500">{new Date(client.created_at).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="px-2 py-1 bg-purple-50 text-[#4B2E83] rounded-lg text-[10px] font-black">{client.credits_used || 0}</span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button onClick={() => navigate(`/admin/clients/${client.id}`)} className="text-[10px] font-black text-[#4B2E83] uppercase tracking-widest hover:underline flex items-center justify-end gap-1">
                                                    Open Dashboard <ArrowUpRight size={12} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Usage & Purchase History */}
                <div className="lg:col-span-4 space-y-10">
                    {/* 6️⃣ Credit Usage History */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                            <History size={20} className="text-emerald-500" /> Usage History
                        </h2>
                        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 border-b border-slate-100">
                                    <tr>
                                        <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Date / Client</th>
                                        <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">CR</th>
                                        <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Rem</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {stats?.usage_history.map((use, i) => (
                                        <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-4 py-3">
                                                <div className="text-[10px] font-black text-slate-800 leading-none mb-1">{use.client}</div>
                                                <div className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{use.date} • {use.analysis}</div>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <span className="text-[10px] font-black text-red-500">-{use.credits_used}</span>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <span className="text-[10px] font-black text-slate-900">{use.remaining}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* 7️⃣ Purchase History */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                            <ShoppingBag size={20} className="text-[#4B2E83]" /> Purchase History
                        </h2>
                        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 border-b border-slate-100">
                                    <tr>
                                        <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Package / Date</th>
                                        <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {stats?.purchase_history.map((p, i) => (
                                        <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-4 py-3">
                                                <div className="text-[10px] font-black text-[#4B2E83] leading-none mb-1">{p.package}</div>
                                                <div className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{p.date} • {p.credits} CR</div>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="text-[10px] font-black text-slate-900">{p.amount}</div>
                                                <div className="text-[8px] font-bold capitalize text-emerald-500">{p.status}</div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
