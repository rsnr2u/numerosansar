import { useState, useEffect } from "react";
import {
    Users,
    CreditCard,
    ShieldCheck,
    Zap,
    ArrowUpRight,
    TrendingUp,
    Calendar,
    Clock,
    CheckCircle2,
    AlertCircle,
    ChevronRight,
    Filter,
    Sparkles,
    Activity,
    Download,
    Search,
    Eye,
    Edit3,
    Trash2,
    Plus,
    Minus,
    MessageSquare,
    BookOpen,
    PieChart,
    BarChart3
} from "lucide-react";
import { api } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";

export default function SuperAdminDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [vendors, setVendors] = useState<any[]>([]);
    const [regStats, setRegStats] = useState<any[]>([]);
    const [trends, setTrends] = useState<any[]>([]);
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [statsRes, vendorsRes, regRes, trendRes, logRes] = await Promise.all([
                api.get('/admin/payments/stats'),
                api.get('/admin/vendors?limit=10'),
                api.get('/admin/registration-stats'),
                api.get('/admin/payments/trends'),
                api.get('/admin/audit-logs?limit=10')
            ]);

            if (statsRes.ok) setStats(await statsRes.json());
            if (vendorsRes.ok) {
                const vendorData = await vendorsRes.json();
                setVendors(vendorData.data || []);
            }
            if (regRes.ok) setRegStats(await regRes.json());
            if (trendRes.ok) setTrends(await trendRes.json());
            if (logRes.ok) {
                const logData = await logRes.json();
                setLogs(Array.isArray(logData) ? logData : (logData.data || []));
            }
        } catch (err) {
            console.error("Dashboard Fetch Error:", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-4 border-[#4B2E83]/10 border-t-[#4B2E83] rounded-full"
            />
        </div>
    );

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

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-10"
        >
            {/* --- HEADER --- */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-2">Platform Control</h1>
                    <p className="text-slate-400 font-bold text-sm uppercase tracking-widest flex items-center gap-2">
                        <Activity size={14} className="text-[#C9A227]" />
                        Live System Telemetry & Governance
                    </p>
                </div>
                <div className="flex gap-3">
                    <button onClick={fetchData} className="px-6 py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-[#4B2E83] hover:border-[#4B2E83]/30 hover:shadow-xl hover:shadow-purple-900/5 transition-all">
                        Refresh Matrix
                    </button>
                    <button className="px-6 py-3 bg-[#4B2E83] text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#5D3AB0] transition-all flex items-center gap-2 shadow-xl shadow-purple-900/20 active:scale-95">
                        <Download size={14} /> Export Intel
                    </button>
                </div>
            </div>

            {/* --- STAT CARDS --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Numerologists"
                    value={stats?.active_numerologists || 0}
                    icon={<Users size={24} />}
                    color="bg-blue-500"
                    trend="+12%"
                />
                <StatCard
                    title="Client Analyses"
                    value={(stats?.total_credits_sold || 0).toLocaleString()}
                    icon={<Zap size={24} />}
                    color="bg-amber-500"
                    trend="+8.5%"
                />
                <StatCard
                    title="Revenue Generated"
                    value={`₹${(stats?.total_revenue || 0).toLocaleString()}`}
                    icon={<CreditCard size={24} />}
                    color="bg-emerald-500"
                    trend="+24%"
                />
                <StatCard
                    title="Active Users"
                    value={stats?.active_sessions || "1.2k"}
                    icon={<Activity size={24} />}
                    color="bg-purple-500"
                    trend="+4%"
                />
            </div>

            {/* --- GRAPHS SECTION --- */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Registration & Usage Plot */}
                <motion.div variants={itemVariants} className="lg:col-span-8 bg-white rounded-2xl p-8 border border-slate-100 shadow-2xl shadow-slate-200/50 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h3 className="text-xl font-black text-slate-900 tracking-tight">Analysis Activity Pulse</h3>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">7 Day System Usage Cycle</p>
                        </div>
                        <div className="flex gap-2">
                            <button className="px-4 py-1.5 rounded-xl bg-slate-50 text-[9px] font-black uppercase text-slate-400 hover:bg-[#4B2E83] hover:text-white transition-all">Daily</button>
                            <button className="px-4 py-1.5 rounded-xl bg-slate-50 text-[9px] font-black uppercase text-slate-400 hover:bg-[#4B2E83] hover:text-white transition-all">Weekly</button>
                        </div>
                    </div>

                    <div className="flex-1 flex items-end justify-between gap-3 px-4 pb-2">
                        {last7Days.map((d, i) => {
                            const max = Math.max(...last7Days.map(x => x.count)) || 1;
                            const h = (d.count / max) * 100;
                            return (
                                <div key={i} className="flex-1 flex flex-col items-center gap-4 group h-full justify-end">
                                    <div className="w-full relative flex justify-center group/bar" style={{ height: '240px' }}>
                                        {/* Activity Line Background */}
                                        <div className="absolute inset-x-0 bottom-0 top-0 border-x border-slate-50/50"></div>

                                        {/* Bar */}
                                        <motion.div
                                            initial={{ height: 0 }}
                                            animate={{ height: `${Math.max(h, 4)}%` }}
                                            className="w-full max-w-[40px] bg-gradient-to-t from-[#4B2E83] to-[#C9A227] rounded-full relative z-10 shadow-lg shadow-purple-900/10 group-hover/bar:brightness-110 transition-all cursor-crosshair"
                                        >
                                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white px-3 py-1 rounded-lg text-[10px] font-black opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap z-20">
                                                {d.count} Analyzes
                                            </div>
                                        </motion.div>
                                    </div>
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest group-hover:text-[#4B2E83] transition-colors">{d.day}</span>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Revenue Breakdown */}
                <motion.div variants={itemVariants} className="lg:col-span-4 bg-[#4B2E83] rounded-2xl p-8 shadow-2xl shadow-purple-900/40 text-white relative overflow-hidden flex flex-col">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />

                    <div className="relative z-10 h-full flex flex-col">
                        <div className="mb-8">
                            <h3 className="text-xl font-black text-[#C9A227] tracking-tight">Monthly Revenue</h3>
                            <p className="text-[10px] font-black text-purple-200/40 uppercase tracking-widest">Global Credit Purchase Flow</p>
                        </div>

                        <div className="flex-1 flex flex-col justify-center text-center py-10">
                            <h4 className="text-[10px] font-black text-purple-200/60 uppercase tracking-[0.4em] mb-2 text-center">Current Month Total</h4>
                            <div className="text-6xl font-black tracking-tighter mb-4">₹{(stats?.monthly_revenue || 0).toLocaleString()}</div>
                            <div className="inline-flex items-center gap-2 mx-auto px-4 py-1.5 bg-white/10 rounded-full border border-white/5">
                                <TrendingUp size={14} className="text-[#C9A227]" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-[#C9A227]">+32% VS LAST MONTH</span>
                            </div>
                        </div>

                        <div className="mt-auto space-y-4 pt-8 border-t border-white/10">
                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                <span className="text-purple-200/50">Projected Growth</span>
                                <span className="text-[#C9A227]">84% Efficiency</span>
                            </div>
                            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: "84%" }}
                                    className="h-full bg-gradient-to-r from-[#C9A227] to-white"
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* --- TABLES SECTION --- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Numerologists */}
                <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden flex flex-col">
                    <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-black text-slate-900 tracking-tight">Recent Numerologists</h3>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Latest User Onboarding</p>
                        </div>
                        <button className="p-2 text-slate-300 hover:text-[#4B2E83] transition-colors"><ChevronRight size={20} /></button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/50">
                                <tr>
                                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Name/Info</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Credits</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {vendors.slice(0, 5).map((v, i) => (
                                    <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-[10px] font-black uppercase text-slate-400">{(v.full_name || v.username)[0]}</div>
                                                <div>
                                                    <p className="text-sm font-black text-slate-900 leading-none mb-1">{v.full_name || v.username}</p>
                                                    <p className="text-[10px] font-bold text-slate-400">{v.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <span className="text-xs font-black text-[#4B2E83] bg-[#4B2E83]/5 px-3 py-1 rounded-full">{v.credits || 0}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-1.5 h-1.5 rounded-full ${v.account_status === 'Active' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                                                <span className="text-[10px] font-black uppercase text-slate-500">{v.account_status}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="p-2 bg-white border border-slate-100 text-slate-400 hover:text-[#4B2E83] rounded-lg transition-all"><Eye size={14} /></button>
                                                <button className="p-2 bg-white border border-slate-100 text-slate-400 hover:text-[#4B2E83] rounded-lg transition-all"><Edit3 size={14} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>

                {/* Recent Transactions */}
                <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden flex flex-col">
                    <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-black text-slate-900 tracking-tight">Recent Transactions</h3>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Latest Credit Purchases</p>
                        </div>
                        <button className="p-2 text-slate-300 hover:text-[#4B2E83] transition-colors"><ChevronRight size={20} /></button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/50">
                                <tr>
                                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tx ID</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">User</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Amount</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {logs.slice(0, 5).map((l, i) => (
                                    <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-8 py-5">
                                            <span className="text-[10px] font-black text-slate-400 uppercase mono">#TXN{i + 1024}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <p className="text-sm font-black text-slate-900 leading-none">{l.performer_name || "Nexus System"}</p>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <p className="text-sm font-black text-[#C9A227]">₹2,700</p>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <span className="text-[9px] font-black uppercase text-emerald-500 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-lg">Success</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </div>

            {/* --- ADDITIONAL SECTIONS (CREDIT MGMT & LOGS) --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12">
                {/* Instant Credit Management */}
                <motion.div variants={itemVariants} className="bg-white rounded-2xl p-8 border border-slate-100 shadow-xl">
                    <div className="mb-6 flex items-center gap-3">
                        <div className="w-10 h-10 bg-black text-[#C9A227] rounded-lg flex items-center justify-center"><Sparkles size={20} /></div>
                        <h3 className="text-lg font-black text-slate-900">Credit Control</h3>
                    </div>
                    <div className="space-y-4">
                        <input type="text" placeholder="User Email/ID" className="w-full px-5 py-3.5 bg-slate-50 rounded-xl border border-slate-100 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-[#4B2E83]/5" />
                        <div className="flex gap-3">
                            <button className="flex-1 py-3.5 bg-emerald-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20"><Plus size={14} /> Add Units</button>
                            <button className="flex-1 py-3.5 bg-red-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-red-600 transition-all shadow-lg shadow-red-500/20"><Minus size={14} /> Deduct</button>
                        </div>
                    </div>
                </motion.div>

                {/* Analysis Type Distribution */}
                <motion.div variants={itemVariants} className="bg-white rounded-2xl p-8 border border-slate-100 shadow-xl flex flex-col">
                    <div className="mb-6 flex items-center justify-between">
                        <h3 className="text-lg font-black text-slate-900">Analysis Logs</h3>
                        <Activity size={18} className="text-slate-300" />
                    </div>
                    <div className="space-y-5 flex-1">
                        {[
                            { type: "Name Analysis", count: 423, color: "bg-[#4B2E83]" },
                            { type: "Business Name", count: 128, color: "bg-[#C9A227]" },
                            { type: "Mobile Number", count: 86, color: "bg-slate-400" },
                        ].map((item, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-600">
                                    <span>{item.type}</span>
                                    <span>{item.count}</span>
                                </div>
                                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                    <div className={`h-full ${item.color}`} style={{ width: `${(item.count / 500) * 100}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Support Matrix */}
                <motion.div variants={itemVariants} className="bg-white rounded-2xl p-8 border border-slate-100 shadow-xl flex flex-col">
                    <div className="mb-6 flex items-center justify-between">
                        <h3 className="text-lg font-black text-slate-900">Support Requests</h3>
                        <div className="px-3 py-1 bg-red-50 text-red-500 text-[10px] font-black rounded-full border border-red-100">4 New</div>
                    </div>
                    <div className="space-y-4">
                        {[
                            { user: "Sarah S.", sub: "Credit Sync Issue", time: "2m ago" },
                            { user: "Rajesh K.", sub: "Plan Upgrade Request", time: "1h ago" },
                        ].map((t, i) => (
                            <div key={i} className="flex items-center gap-4 p-3 bg-slate-50/50 rounded-xl border border-slate-100 hover:bg-slate-50 transition-all cursor-pointer">
                                <div className="w-10 h-10 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-slate-400 font-black text-xs">{t.user[0]}</div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-black text-slate-800 truncate">{t.sub}</p>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{t.user} • {t.time}</p>
                                </div>
                                <ChevronRight size={14} className="text-slate-300" />
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}

function StatCard({ title, value, icon, color, trend }: any) {
    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, scale: 0.95 },
                visible: { opacity: 1, scale: 1 }
            }}
            className="bg-white p-8 rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50 group hover:shadow-2xl hover:shadow-purple-900/10 transition-all relative overflow-hidden"
        >
            <div className={`absolute top-0 right-0 w-32 h-32 ${color}/5 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700`} />

            <div className="flex flex-col gap-6 relative z-10">
                <div className="flex items-center justify-between">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-white shadow-xl shadow-slate-900/5 ${color}`}>
                        {icon}
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
                        <TrendingUp size={12} />
                        <span className="text-[9px] font-black font-mono tracking-tighter">{trend}</span>
                    </div>
                </div>
                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mb-1">{title}</p>
                    <h2 className="text-4xl font-black tracking-tighter text-slate-900 leading-none">{value}</h2>
                </div>
            </div>
        </motion.div>
    );
}
