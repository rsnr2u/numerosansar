import { useState, useEffect, useCallback, useMemo } from "react";
import {
    CreditCard,
    Sparkles,
    ArrowDownCircle,
    ArrowUpCircle,
    Users,
    TrendingUp,
    AlertCircle,
    Search,
    Plus,
    Minus,
    Clock,
    User,
    Zap,
    ArrowRight,
    BarChart3,
    Filter,
    ShieldCheck,
    Download
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";

interface VendorBalance {
    id: number;
    username: string;
    name: string;
    email: string;
    status: string;
    balance: number;
    plan_name: string | null;
    plan_credits: number;
    credits_used: number;
    last_wallet_update: string | null;
}

interface Purchase {
    id: number;
    user_id: number;
    vendor_name: string;
    username: string;
    credit_type: string;
    quantity: number;
    unit_price: string;
    total_amount: string;
    status: string;
    notes: string | null;
    created_at: string;
}

interface Usage {
    id: number;
    vendor_name: string;
    client_name: string;
    check_type: string;
    credit_type: string;
    created_at: string;
}

interface PlatformStats {
    summary: {
        total_purchased: number;
        total_used: number;
        total_remaining: number;
        low_credit_users_count: number;
    };
    daily_usage: { date: string; count: number }[];
    usage_by_type: { check_type: string; count: number }[];
    low_credit_alerts: { id: number; full_name: string; username: string; balance: number }[];
}

export default function SuperAdminCredits() {
    const [vendors, setVendors] = useState<VendorBalance[]>([]);
    const [purchases, setPurchases] = useState<Purchase[]>([]);
    const [usage, setUsage] = useState<Usage[]>([]);
    const [platformStats, setPlatformStats] = useState<PlatformStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState<"vendors" | "purchases" | "usage" | "insights">("vendors");
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
    const [selectedVendor, setSelectedVendor] = useState<VendorBalance | null>(null);
    const [adjustment, setAdjustment] = useState({
        action: "add" as "add" | "subtract",
        quantity: 10,
        notes: ""
    });
    const [isSavingAdjustment, setIsSavingAdjustment] = useState(false);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const [vendorRes, historyRes, statsRes] = await Promise.all([
                api.get("/admin/credits/vendor-balances"),
                api.get("/admin/credits/all-history"),
                api.get("/admin/credits/platform-stats")
            ]);

            if (!vendorRes.ok || !historyRes.ok || !statsRes.ok) {
                throw new Error("Failed to fetch data from server");
            }

            setVendors(await vendorRes.json());
            const historyData = await historyRes.json();
            setPurchases(historyData.purchases || []);
            setUsage(historyData.usage || []);
            setPlatformStats(await statsRes.json());
        } catch (err: any) {
            console.error(err);
            setError(err.message || "An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const filteredVendors = useMemo(() => {
        return vendors.filter(v => {
            const matchesSearch = v.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                v.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                v.email?.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesFilter = filterStatus === 'all' ||
                (filterStatus === 'low' && v.balance < 5) ||
                (filterStatus === 'active' && v.status === 'active');

            return matchesSearch && matchesFilter;
        });
    }, [vendors, searchTerm, filterStatus]);

    const handleAdjustBalance = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedVendor) return;

        setIsSavingAdjustment(true);
        try {
            const res = await api.post("/admin/credits/adjust-balance", {
                user_id: selectedVendor.id,
                ...adjustment
            });

            if (res.ok) {
                fetchData();
                setIsAdjustModalOpen(false);
                setSelectedVendor(null);
                setAdjustment({
                    action: "add",
                    quantity: 10,
                    notes: ""
                });
            } else {
                const data = await res.json();
                alert(data.message || "Adjustment failed");
            }
        } catch (err) {
            console.error(err);
            alert("Connection error");
        } finally {
            setIsSavingAdjustment(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="animate-spin w-10 h-10 border-4 border-[#4B2E83] border-t-[#C9A227] rounded-full" />
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-20">
            {/* Header Intelligence */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-slate-900">Credit Command Center</h1>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mt-2">Revenue Lifecycle & Resource Liquidity Protocol</p>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={fetchData} className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all text-slate-400">
                        <Clock size={18} />
                    </button>
                    <button onClick={() => { setSelectedVendor(vendors[0]); setIsAdjustModalOpen(true); }} className="flex items-center gap-3 px-6 py-3 bg-[#4B2E83] text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-purple-900/20 active:scale-95 transition-all">
                        <Plus size={16} /> Adjust Credits
                    </button>
                </div>
            </div>

            {/* Platform Health Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: "Credits Purchased", val: platformStats?.summary.total_purchased || 0, color: "emerald", icon: <TrendingUp size={20} /> },
                    { label: "Credits Consumed", val: platformStats?.summary.total_used || 0, color: "rose", icon: <Zap size={20} /> },
                    { label: "Net Liquidity", val: platformStats?.summary.total_remaining || 0, color: "blue", icon: <ShieldCheck size={20} /> },
                    { label: "Low Credit Alerts", val: platformStats?.summary.low_credit_users_count || 0, color: "amber", icon: <AlertCircle size={20} /> }
                ].map((stat, i) => (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group">
                        <div className={`absolute top-0 right-0 w-24 h-24 bg-${stat.color}-500/5 rounded-full -mr-8 -mt-8 transition-all group-hover:scale-110`} />
                        <div className="flex items-center gap-3 mb-4">
                            <div className={`p-2.5 bg-${stat.color}-50 text-${stat.color}-600 rounded-xl`}>{stat.icon}</div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</span>
                        </div>
                        <div className="text-3xl font-black tracking-tighter text-slate-900">{stat.val.toLocaleString()}</div>
                        <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mt-1">Platform-Wide Metrics</p>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Control Panel */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100">
                                    <BarChart3 size={20} className="text-[#4B2E83]" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-black uppercase tracking-widest">Resource Ledger</h3>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Professional Balances & Sync Status</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                        placeholder="Identify Entity..."
                                        className="bg-white border border-slate-100 rounded-xl py-2 px-10 text-[11px] font-bold outline-none focus:border-[#4B2E83] transition-all w-48"
                                    />
                                </div>
                                <select
                                    value={filterStatus}
                                    onChange={e => setFilterStatus(e.target.value)}
                                    className="bg-white border border-slate-100 rounded-xl px-4 py-2 text-[11px] font-bold outline-none cursor-pointer"
                                >
                                    <option value="all">Global Tier</option>
                                    <option value="low">Low Credits</option>
                                    <option value="active">Active Only</option>
                                </select>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50/50">
                                        <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400">Professional Entity</th>
                                        <th className="px-4 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400">Allocation Tier</th>
                                        <th className="px-4 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400">Resource Drain</th>
                                        <th className="px-4 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400">Current Balance</th>
                                        <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredVendors.map(vendor => (
                                        <tr key={vendor.id} className="hover:bg-slate-50/30 transition-all">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-[11px] font-black uppercase text-slate-500">
                                                        {vendor.name?.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="text-[13px] font-black tracking-tight text-slate-900">{vendor.name}</div>
                                                        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{vendor.username}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-6">
                                                <span className="px-3 py-1 bg-[#C9A227]/10 text-[#C9A227] rounded-lg text-[10px] font-black uppercase tracking-widest">
                                                    {vendor.plan_name || "Custom"}
                                                </span>
                                            </td>
                                            <td className="px-4 py-6 min-w-[140px]">
                                                <div className="flex flex-col gap-1.5 pt-1">
                                                    <div className="flex justify-between text-[9px] font-black uppercase tracking-widest">
                                                        <span className="text-slate-400">Used</span>
                                                        <span className="text-slate-900">{vendor.credits_used} / {vendor.plan_credits}</span>
                                                    </div>
                                                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${Math.min(100, (vendor.credits_used / (vendor.plan_credits || 1)) * 100)}%` }}
                                                            className={`h-full rounded-full ${vendor.balance < 5 ? 'bg-rose-500' : 'bg-[#4B2E83]'}`}
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-6">
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-lg font-black tracking-tighter ${vendor.balance < 5 ? 'text-rose-600' : 'text-slate-900'}`}>
                                                        {vendor.balance}
                                                    </span>
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">CR</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <button
                                                    onClick={() => { setSelectedVendor(vendor); setIsAdjustModalOpen(true); }}
                                                    className="p-2.5 bg-slate-50 hover:bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-[#4B2E83] transition-all hover:shadow-md active:scale-95"
                                                >
                                                    <Zap size={14} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Vertical Intelligence Sidebar */}
                <div className="space-y-8">
                    {/* Activity Watchlist */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Critical Watchlist</h3>
                            <div className="px-2 py-0.5 bg-rose-50 text-rose-600 rounded-md text-[9px] font-black">LOW CREDITS</div>
                        </div>
                        <div className="space-y-4">
                            {platformStats?.low_credit_alerts.length ? platformStats.low_credit_alerts.map((user, i) => (
                                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} key={user.id} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-xl border border-slate-100 group hover:bg-white transition-all hover:shadow-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center text-rose-600">
                                            <AlertCircle size={14} />
                                        </div>
                                        <div>
                                            <div className="text-[11px] font-black tracking-tight">{user.full_name}</div>
                                            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{user.balance} CR LEFT</div>
                                        </div>
                                    </div>
                                    <button onClick={() => { setSelectedVendor(vendors.find(v => v.id === user.id) || null); setIsAdjustModalOpen(true); }} className="p-2 text-slate-300 hover:text-rose-500 transition-all opacity-0 group-hover:opacity-100">
                                        <ArrowRight size={14} />
                                    </button>
                                </motion.div>
                            )) : (
                                <div className="py-8 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">System Liquidity Optimal</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Usage Insights */}
                    <div className="bg-[#4B2E83] rounded-xl p-8 text-white space-y-6 shadow-2xl shadow-purple-900/30 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16" />
                        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40">Usage Intelligence</h3>
                        <div className="space-y-5 relative">
                            {platformStats?.usage_by_type.map((u, i) => (
                                <div key={u.check_type} className="space-y-2">
                                    <div className="flex justify-between text-[11px] font-black uppercase tracking-[0.1em]">
                                        <span>{u.check_type.replace('_', ' ')}</span>
                                        <span className="text-[#C9A227]">{u.count}</span>
                                    </div>
                                    <div className="h-1 w-full bg-white/10 rounded-full">
                                        <div className="h-full bg-[#C9A227] rounded-full" style={{ width: `${Math.min(100, (u.count / (platformStats.summary.total_used || 1)) * 100)}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CSV Export Control */}
                    <button className="w-full py-5 bg-white border border-slate-200 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 hover:bg-slate-50 transition-all active:scale-95 shadow-sm">
                        <Download size={16} className="text-slate-400" /> Export Revenue Ledger
                    </button>
                </div>
            </div>

            {/* Credit Transaction Logs */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mt-12">
                <div className="p-8 border-b border-slate-100 bg-slate-50/30 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 text-amber-500">
                            <Clock size={20} />
                        </div>
                        <div>
                            <h3 className="text-sm font-black uppercase tracking-widest">Global Allocation Protocol</h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Synchronized Credit Lifecycle Trail</p>
                        </div>
                    </div>
                    <nav className="flex bg-slate-100 p-1 rounded-xl">
                        <button onClick={() => setActiveTab("purchases")} className={`px-6 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === 'purchases' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}>Purchases</button>
                        <button onClick={() => setActiveTab("usage")} className={`px-6 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === 'usage' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}>Usage</button>
                    </nav>
                </div>

                <div className="overflow-x-auto">
                    {activeTab === "purchases" ? (
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/50">
                                <tr>
                                    <th className="px-10 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400">Timestamp</th>
                                    <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400">Entity</th>
                                    <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400">Vector</th>
                                    <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400">Resource Unit</th>
                                    <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400">Flow</th>
                                    <th className="px-10 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400 text-right">Notes</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {purchases.slice(0, 15).map(p => (
                                    <tr key={p.id} className="hover:bg-slate-50/30 transition-all">
                                        <td className="px-10 py-5 text-[11px] font-bold text-slate-500">{new Date(p.created_at).toLocaleString()}</td>
                                        <td className="px-6 py-5 font-black text-xs text-slate-800">{p.vendor_name}</td>
                                        <td className="px-6 py-5 font-black text-xs">+{p.quantity}</td>
                                        <td className="px-6 py-5 font-black text-xs text-emerald-600">₹{parseFloat(p.total_amount).toLocaleString()}</td>
                                        <td className="px-10 py-5 text-[10px] text-slate-400 font-bold uppercase tracking-wider text-right">{p.notes || "Standard Protocol"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/50">
                                <tr>
                                    <th className="px-10 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400">Temporal Stamp</th>
                                    <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400">Professional Node</th>
                                    <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400">Analysis Payload</th>
                                    <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400">Resource Drain</th>
                                    <th className="px-10 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400 text-right">Client Hash</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {usage.slice(0, 15).map(u => (
                                    <tr key={u.id} className="hover:bg-slate-50/30 transition-all">
                                        <td className="px-10 py-5 text-[11px] font-bold text-slate-500">{new Date(u.created_at).toLocaleString()}</td>
                                        <td className="px-6 py-5 font-black text-xs text-slate-800">{u.vendor_name}</td>
                                        <td className="px-6 py-5 font-black text-[10px] uppercase tracking-widest text-[#E61111]">{u.check_type.replace('_', ' ')}</td>
                                        <td className="px-6 py-5 font-black text-xs text-rose-500">-1 CR</td>
                                        <td className="px-10 py-5 text-[11px] font-bold text-slate-900 text-right">{u.client_name}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Adjust Modal (Enhanced) */}
            <AnimatePresence>
                {isAdjustModalOpen && selectedVendor && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsAdjustModalOpen(false)} />
                        <motion.div initial={{ opacity: 0, scale: 0.9, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 30 }} className="relative w-full max-w-xl bg-white rounded-xl shadow-2xl overflow-hidden border border-slate-200">
                            <div className="p-10 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-1">Protocol: Quota Adjustment</p>
                                    <h2 className="text-3xl font-black tracking-tighter text-[#4B2E83] leading-none">Resource Injection</h2>
                                </div>
                                <button onClick={() => setIsAdjustModalOpen(false)} className="p-4 hover:bg-black/5 rounded-full transition-all group"><Plus className="rotate-45 group-hover:scale-110 transition-all" size={24} /></button>
                            </div>

                            <form onSubmit={handleAdjustBalance} className="p-12 space-y-8">
                                <div className="p-6 bg-[#4B2E83]/5 rounded-2xl border border-[#4B2E83]/10 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-[#4B2E83] flex items-center justify-center text-white font-black text-xl">{selectedVendor.name?.charAt(0)}</div>
                                        <div>
                                            <div className="text-[10px] font-black uppercase tracking-widest text-[#4B2E83]/60 mb-0.5">Target Entity</div>
                                            <div className="text-xl font-black tracking-tight text-[#4B2E83]">{selectedVendor.name}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Current Balance</div>
                                        <div className="text-2xl font-black tracking-tight text-slate-900">{selectedVendor.balance} <span className="text-xs text-slate-300">CR</span></div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2 italic">Action Vector</label>
                                        <div className="flex bg-slate-100 p-1.5 rounded-xl">
                                            <button type="button" onClick={() => setAdjustment({ ...adjustment, action: "add" })} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${adjustment.action === 'add' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400'}`}>ADD (+)</button>
                                            <button type="button" onClick={() => setAdjustment({ ...adjustment, action: "subtract" })} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${adjustment.action === 'subtract' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-400'}`}>DEDUCT (-)</button>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2 italic">Quantity Variable</label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                value={adjustment.quantity}
                                                onChange={e => setAdjustment({ ...adjustment, quantity: parseInt(e.target.value) || 0 })}
                                                className="w-full bg-slate-100 border-2 border-transparent focus:border-[#4B2E83] focus:bg-white rounded-xl py-3 px-6 text-xl font-black tracking-tighter outline-none transition-all"
                                            />
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300 tracking-widest uppercase">Units</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2 italic">Adjustment Logic (Mandatory Audit Note)</label>
                                    <textarea
                                        value={adjustment.notes}
                                        onChange={e => setAdjustment({ ...adjustment, notes: e.target.value })}
                                        placeholder="Reason for manual resource manipulation..."
                                        className="w-full bg-slate-100 border-2 border-transparent focus:border-[#4B2E83] focus:bg-white rounded-xl p-6 text-sm font-bold outline-none transition-all h-32 resize-none"
                                    />
                                </div>

                                <button
                                    className="w-full py-6 bg-[#4B2E83] text-white rounded-xl font-black uppercase tracking-[0.4em] text-[11px] shadow-2xl shadow-purple-900/40 hover:bg-[#5D3AB0] transition-all flex items-center justify-center gap-3 disabled:opacity-50 active:scale-95"
                                    disabled={isSavingAdjustment || !adjustment.notes}
                                >
                                    {isSavingAdjustment ? "INITIALIZING SECURE PROTOCOL..." : (<>FINALIZE QUOTA INJECTION <ArrowRight size={18} className="text-[#C9A227]" /></>)}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
