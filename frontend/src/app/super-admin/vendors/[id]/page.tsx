import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    User, Mail, Phone, MapPin, Building2, Calendar,
    Zap, Users, FileText, Smartphone, Car, ShieldCheck,
    ShieldAlert, ArrowLeft, RefreshCw, XCircle, CheckCircle,
    Eye, Search, History, Sparkles, BrainCircuit, CreditCard,
    Lock, Activity, Shield, X, Save, Plus, Edit2, Key,
    TrendingUp, ArrowUpRight, ArrowDownRight, MoreVertical,
    Wallet, ClipboardList, Info, AlertTriangle, Globe
} from "lucide-react";
import { api } from "@/lib/api";

export default function VendorDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [data, setData] = useState<any>(null);
    const [clients, setClients] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "registry");
    const [loading, setLoading] = useState(true);
    const [clientLoading, setClientLoading] = useState(false);
    const [selectedClient, setSelectedClient] = useState<any>(null);
    const [history, setHistory] = useState<any[]>([]);
    const [historyLoading, setHistoryLoading] = useState(false);

    useEffect(() => {
        fetchData();
        fetchClients();
    }, [id]);

    const fetchData = () => {
        setLoading(true);
        api.get(`/admin/vendors/${id}`)
            .then(res => res.json())
            .then(data => setData(data))
            .finally(() => setLoading(false));
    };

    const fetchClients = () => {
        setClientLoading(true);
        api.get(`/admin/clients?vendor_id=${id}`)
            .then(res => res.json())
            .then(data => setClients(Array.isArray(data) ? data : []))
            .finally(() => setClientLoading(false));
    };

    const fetchClientHistory = async (client: any) => {
        setSelectedClient(client);
        setHistoryLoading(true);
        try {
            const resp = await api.get(`/admin/clients/${client.id}/history`);
            if (resp.ok) setHistory(await resp.json());
        } catch (err) {
            console.error("Failed to fetch history", err);
        } finally {
            setHistoryLoading(false);
        }
    };

    const handleStatusUpdate = async (status: string) => {
        try {
            const resp = await api.post(`/admin/vendors/${id}/status`, { status });
            if (resp.ok) fetchData();
        } catch (err) {
            console.error("Status update failed", err);
        }
    };

    const filteredClients = clients.filter(c =>
        c.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.id?.toString().includes(searchTerm)
    );

    if (loading) return (
        <div className="flex flex-col items-center justify-center p-20 space-y-4">
            <div className="w-12 h-12 border-4 border-[#C9A227] border-t-[#4B2E83] rounded-full animate-spin"></div>
            <p className="font-black uppercase text-[#4B2E83]/40 tracking-[0.3em] text-[10px]">Synching Neural Matrix...</p>
        </div>
    );

    if (!data || !data.profile || data._error) return (
        <div className="p-20 text-center space-y-6">
            <div className="font-black uppercase text-slate-300 text-2xl">Entity Not Found</div>
            <button onClick={() => navigate(-1)} className="px-8 py-3 bg-[#4B2E83] text-white rounded-full font-black uppercase text-[10px] tracking-widest shadow-xl">Return to Dashboard</button>
        </div>
    );

    // Derived Metrics & Placeholders for UX Requirements
    const creditStats = {
        total: data.credits?.total || 150,
        used: data.credits?.used || 86,
        remaining: data.credits?.remaining || 64,
        last_purchase: data.credits?.last_purchase || "12 Feb 2026",
        usage_percent: Math.round(((data.credits?.used || 86) / (data.credits?.total || 150)) * 100)
    };

    const consultationStats = [
        { label: "Name Analysis", val: data.metrics?.name_checks || 85, icon: <User size={14} /> },
        { label: "Business Name", val: data.metrics?.business_checks || 20, icon: <Building2 size={14} /> },
        { label: "Mobile Number", val: data.metrics?.mobile_checks || 10, icon: <Smartphone size={14} /> },
        { label: "Vehicle Analysis", val: data.metrics?.vehicle_checks || 5, icon: <Car size={14} /> },
    ];

    const revenueStats = {
        total: "₹18,500",
        purchases: 5,
        last_amount: "₹7,500"
    };

    const recentAnalyses = [
        { client: "Rahul Sharma", type: "Name Analysis", date: "20 Feb", credits: 1 },
        { client: "Priya", type: "Business Name", date: "19 Feb", credits: 1 },
        { client: "Rakesh", type: "Mobile Number", date: "18 Feb", credits: 1 },
    ];

    return (
        <div className="space-y-5 pb-20">
            {/* Top Toolbar */}
            <div className="flex justify-between items-center px-1">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-[#4B2E83] hover:shadow-md transition-all active:scale-95"
                >
                    <ArrowLeft size={16} /> Back to Archive
                </button>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-white border border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400 rounded-xl hover:text-[#4B2E83] hover:border-[#4B2E83]/20 transition-all">Edit Profile</button>
                    <button className="px-4 py-2 bg-white border border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400 rounded-xl hover:text-[#4B2E83] hover:border-[#4B2E83]/20 transition-all">Reset Password</button>
                    <button className="px-6 py-2.5 bg-[#4B2E83] text-white rounded-xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-purple-900/10 hover:scale-105 active:scale-95 transition-all">
                        <Plus size={16} className="inline mr-1 text-[#C9A227]" /> Add Credits
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

                {/* 1. Left Section: Profile & Login Activity */}
                <div className="lg:col-span-4 space-y-5">
                    {/* Compact Profile Card */}
                    <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm relative overflow-hidden group">
                        <div className="flex items-center gap-5 mb-6">
                            <div className="w-16 h-16 rounded-2xl bg-[#4B2E83] flex items-center justify-center text-[#C9A227] text-2xl font-black shadow-lg shadow-purple-900/30 relative overflow-hidden group-hover:scale-105 transition-transform">
                                {data.profile.full_name?.charAt(0) || data.profile.username?.charAt(0)}
                                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent"></div>
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-0.5">
                                    <h1 className="text-xl font-black tracking-tight text-slate-900 leading-none">{data.profile.full_name || data.profile.username}</h1>
                                    {creditStats.remaining < 10 && (
                                        <div className="px-1.5 py-0.5 bg-red-100 text-red-600 rounded-md text-[7px] font-black uppercase tracking-widest animate-pulse border border-red-200">Alert</div>
                                    )}
                                </div>
                                <p className="text-[9px] font-black uppercase tracking-[0.1em] text-[#C9A227]">{data.profile.role}</p>
                            </div>
                        </div>

                        <div className="space-y-3 pt-5 border-t border-slate-50">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-[#4B2E83]/5 text-[#4B2E83] rounded-lg"><Mail size={14} /></div>
                                <p className="text-xs font-bold text-slate-600 truncate">{data.profile.email}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-[#4B2E83]/5 text-[#4B2E83] rounded-lg"><Phone size={14} /></div>
                                <p className="text-xs font-bold text-slate-600">{data.profile.mobile || '---'}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-[#4B2E83]/5 text-[#4B2E83] rounded-lg"><Globe size={14} /></div>
                                <p className="text-xs font-bold text-slate-600">{data.profile.city || 'Universal'}</p>
                            </div>
                        </div>

                        {/* Status Governance in Profile Card */}
                        <div className="mt-6 pt-6 border-t border-slate-50">
                            <p className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 ml-1">Access Protocol</p>
                            <div className="grid grid-cols-3 gap-1.5">
                                {[
                                    { id: 'Active', color: 'bg-emerald-500' },
                                    { id: 'Suspended', color: 'bg-orange-500' },
                                    { id: 'Blocked', color: 'bg-red-500' }
                                ].map((s) => (
                                    <button
                                        key={s.id}
                                        onClick={() => handleStatusUpdate(s.id)}
                                        className={`py-2 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all ${data.profile.account_status === s.id ? `${s.color} text-white shadow-md` : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                                    >
                                        {s.id}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Login Activity Card */}
                    <div className="bg-slate-900 p-6 rounded-2xl shadow-lg relative overflow-hidden">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="p-2 bg-white/10 text-[#C9A227] rounded-xl"><Activity size={18} /></div>
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Security Pulse</h3>
                        </div>
                        <div className="space-y-4 relative z-10 px-1">
                            <div>
                                <p className="text-[7px] font-black uppercase tracking-widest text-white/30 mb-1">Last System Entry</p>
                                <p className="text-xs font-black text-white">{data.profile.last_login ? new Date(data.profile.last_login).toLocaleString() : 'Never'}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-[7px] font-black uppercase tracking-widest text-white/30 mb-0.5">IP Trace</p>
                                    <p className="text-[10px] font-black text-white/80">{data.profile.last_ip || '103.45.21.XX'}</p>
                                </div>
                                <div>
                                    <p className="text-[7px] font-black uppercase tracking-widest text-white/30 mb-0.5">Environment</p>
                                    <p className="text-[10px] font-black text-white/80 text-nowrap">Windows / Chrome</p>
                                </div>
                            </div>
                        </div>
                        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
                    </div>
                </div>

                {/* 2. Right Section: Analytics Complex */}
                <div className="lg:col-span-8 space-y-5">

                    {/* Top Stats: Credits & Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Credits Overview Card */}
                        <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm">
                            <div className="flex justify-between items-start mb-5">
                                <div>
                                    <h3 className="text-lg font-black text-slate-900 tracking-tight">Credit Inventory</h3>
                                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Total analytical resource flux</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-[10px] font-black text-[#4B2E83]">{creditStats.remaining} / {creditStats.total}</span>
                                </div>
                            </div>

                            <div className="space-y-5">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100/50 text-center">
                                        <p className="text-[8px] font-black uppercase text-slate-400 mb-0.5">Used</p>
                                        <p className="text-xl font-black">{creditStats.used}</p>
                                    </div>
                                    <div className="p-3 bg-[#4B2E83]/5 rounded-xl border border-[#4B2E83]/10 text-center">
                                        <p className="text-[8px] font-black uppercase text-[#4B2E83]/50 mb-0.5">Remaining</p>
                                        <p className="text-xl font-black text-[#C9A227]">{creditStats.remaining}</p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between items-center text-[7px] font-black uppercase tracking-widest text-slate-400 px-1">
                                        <span>Exhaustion Level</span>
                                        <span>{creditStats.usage_percent}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100/50 p-0.5">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${creditStats.usage_percent}%` }}
                                            className="h-full bg-gradient-to-r from-[#4B2E83] to-[#C9A227] shadow-sm rounded-full"
                                        />
                                    </div>
                                </div>
                                <p className="text-[9px] font-bold text-slate-400 text-center">Last credit purchase detected on {creditStats.last_purchase}</p>
                            </div>
                        </div>

                        {/* Revenue Performance Card */}
                        <div className="bg-[#4B2E83] p-6 rounded-2xl shadow-lg relative overflow-hidden flex flex-col justify-between group">
                            <div className="relative z-10">
                                <div className="flex justify-between items-center mb-5">
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Revenue Integrity</h3>
                                    <ArrowUpRight className="text-[#C9A227]" size={20} />
                                </div>
                                <h2 className="text-4xl font-black text-white tracking-tighter mb-4 leading-none">{revenueStats.total}</h2>
                            </div>
                            <div className="grid grid-cols-2 gap-4 relative z-10 border-t border-white/10 pt-4 mt-2">
                                <div>
                                    <p className="text-[8px] font-black uppercase tracking-widest text-white/30 mb-0.5">Injections</p>
                                    <p className="text-sm font-black text-white">{revenueStats.purchases}</p>
                                </div>
                                <div>
                                    <p className="text-[8px] font-black uppercase tracking-widest text-white/30 mb-0.5">Last Delta</p>
                                    <p className="text-sm font-black text-[#C9A227]">{revenueStats.last_amount}</p>
                                </div>
                            </div>
                            <div className="absolute right-0 top-0 w-32 h-32 bg-white/5 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-1000"></div>
                        </div>
                    </div>

                    {/* Consultation Statistics Fingerprint */}
                    <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-black text-slate-900 tracking-tight uppercase leading-none">Consumption Fingerprint</h3>
                            <div className="px-3 py-1 bg-slate-50 text-slate-400 rounded-lg text-[8px] font-black border border-slate-100 uppercase tracking-widest">Clients: {data.metrics?.total_clients || 120}</div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {consultationStats.map((s, idx) => (
                                <div key={idx} className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 hover:bg-white hover:shadow-md transition-all cursor-default group text-center">
                                    <div className="w-9 h-9 mx-auto bg-white shadow-sm flex items-center justify-center rounded-lg mb-3 text-[#4B2E83] group-hover:bg-[#4B2E83] group-hover:text-white transition-all">
                                        {s.icon}
                                    </div>
                                    <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-1">{s.label}</p>
                                    <h4 className="text-xl font-black text-slate-900">{s.val}</h4>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Client Analyses Flux */}
                    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden flex flex-col">
                        <div className="px-8 py-5 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">Recent Analysis Stream</h3>
                            <button className="px-3 py-1.5 bg-white text-[8px] font-black uppercase tracking-widest text-[#4B2E83] hover:shadow-sm transition-all rounded-lg border border-slate-100">Live View</button>
                        </div>
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-slate-50 bg-slate-50/10">
                                    <th className="px-8 py-3.5 text-[8px] font-black uppercase tracking-widest text-slate-400">Client Signature</th>
                                    <th className="px-4 py-3.5 text-[8px] font-black uppercase tracking-widest text-slate-400">Analysis Type</th>
                                    <th className="px-4 py-3.5 text-[8px] font-black uppercase tracking-widest text-slate-400">Timestamp</th>
                                    <th className="px-8 py-3.5 text-[8px] font-black uppercase tracking-widest text-slate-400 text-right">Flux</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {recentAnalyses.map((item, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-8 py-3.5">
                                            <p className="text-xs font-black text-slate-900 tracking-tight group-hover:text-[#4B2E83] transition-colors">{item.client}</p>
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <span className="px-2.5 py-0.5 bg-white border border-slate-100 rounded text-[7px] font-black text-slate-500 uppercase tracking-widest">{item.type}</span>
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <span className="text-[9px] font-bold text-slate-400">{item.date} Feb</span>
                                        </td>
                                        <td className="px-8 py-3.5 text-right font-black text-[#4B2E83] text-[9px]">
                                            -{item.credits} CR
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Entity Tabulation Suite */}
            <div className="space-y-6">
                <div className="flex gap-2 p-1.5 bg-slate-100/50 backdrop-blur-md rounded-2xl border border-slate-100 w-fit">
                    {[
                        { id: "registry", label: "Client Registry", icon: <Users size={14} /> },
                        { id: "ledger", label: "Purchase History", icon: <CreditCard size={14} /> },
                        { id: "audit", label: "Access Logs", icon: <Shield size={14} /> }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-8 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-[#4B2E83] text-white shadow-xl shadow-purple-900/20' : 'text-slate-400 hover:text-[#4B2E83] hover:bg-white'}`}
                        >
                            {tab.icon} {tab.label}
                        </button>
                    ))}
                </div>

                <div className="bg-white border border-slate-100 rounded-2xl shadow-sm min-h-[500px] overflow-hidden">
                    {activeTab === 'registry' && (
                        <div className="flex flex-col h-full">
                            <div className="px-8 py-5 border-b border-slate-50 flex justify-between items-center bg-slate-50/20">
                                <h3 className="text-lg font-black text-slate-900 tracking-tight uppercase">Associated Entities</h3>
                                <div className="relative group">
                                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#4B2E83] transition-colors" size={14} />
                                    <input
                                        type="text"
                                        placeholder="FILTER..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 pr-4 py-2 bg-white border border-slate-100 rounded-xl text-[9px] font-black uppercase tracking-widest focus:outline-none focus:bg-white focus:border-[#4B2E83]/20 transition-all w-64 shadow-sm"
                                    />
                                </div>
                            </div>
                            <div className="flex-1 overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-slate-50 bg-slate-50/10">
                                            <th className="pl-8 pr-6 py-4 text-[8px] font-black uppercase tracking-[0.2em] text-slate-400">Intelligence Identity</th>
                                            <th className="px-6 py-4 text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Density</th>
                                            <th className="px-6 py-4 text-[8px] font-black uppercase tracking-[0.2em] text-slate-400">Epoch</th>
                                            <th className="px-8 py-4 text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {filteredClients.map((client: any) => (
                                            <tr key={client.id} className="hover:bg-slate-50/30 transition-colors group">
                                                <td className="pl-8 pr-6 py-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-xl bg-[#4B2E83]/5 text-[#4B2E83] flex items-center justify-center text-xs font-black shadow-sm group-hover:bg-[#4B2E83] group-hover:text-white transition-all">
                                                            {client.full_name?.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-black uppercase tracking-tight text-slate-900 group-hover:translate-x-0.5 transition-transform leading-none mb-1">{client.full_name}</p>
                                                            <p className="text-[8px] font-bold text-slate-300 uppercase truncate max-w-[180px]">{client.email_id || 'CONTACT_OFF'}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className="px-3 py-1.5 bg-[#4B2E83]/5 text-[#4B2E83] rounded-lg text-[9px] font-black">{client.check_count || 0} SEQS</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-[9px] font-black text-slate-400">{new Date(client.created_at).toLocaleDateString('en-GB')}</span>
                                                </td>
                                                <td className="px-8 py-4 text-right">
                                                    <button
                                                        onClick={() => fetchClientHistory(client)}
                                                        className="px-4 py-2 bg-slate-50 text-slate-300 hover:text-[#4B2E83] hover:bg-[#4B2E83]/5 rounded-xl transition-all shadow-sm text-[8px] font-black uppercase tracking-widest"
                                                    >
                                                        Inspect
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                    {/* Purchase History Tab */}
                    {activeTab === 'ledger' && (
                        <div className="p-10">
                            <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase mb-8">Purchase Stream</h3>
                            <div className="space-y-4">
                                {(data.payments || []).map((p: any) => (
                                    <div key={p.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between group hover:bg-white hover:shadow-xl transition-all">
                                        <div className="flex items-center gap-6">
                                            <div className="w-12 h-12 rounded-2xl bg-[#4B2E83] flex items-center justify-center text-[#C9A227] shadow-lg">
                                                <Wallet size={20} />
                                            </div>
                                            <div>
                                                <p className="text-xs font-black uppercase">#{p.invoice_id}</p>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{p.plan_name} • {new Date(p.created_at).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-black text-slate-900">₹{p.amount}</p>
                                            <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${p.status === 'paid' ? 'bg-emerald-50 text-emerald-500' : 'bg-red-50 text-red-500'}`}>{p.status}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Intelligence Modal */}
            <AnimatePresence>
                {selectedClient && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#4B2E83]/60 backdrop-blur-md"
                    >
                        <motion.div
                            initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                            className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 rounded-2xl bg-[#4B2E83] flex items-center justify-center text-[#C9A227] text-2xl font-black shadow-lg">
                                        {selectedClient.full_name?.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-900 leading-none">{selectedClient.full_name}</h3>
                                        <div className="flex gap-3 mt-1.5">
                                            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-[#C9A227] bg-[#4B2E83] px-3 py-1 rounded-md shadow-md">Audit Signature</span>
                                            <span className="text-[8px] font-black uppercase tracking-[0.1em] text-slate-300">Sync: {new Date(selectedClient.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedClient(null)} className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all shadow-md">
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-6 space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                    <div className="p-6 bg-slate-50/50 rounded-2xl border border-slate-100 relative overflow-hidden group">
                                        <div className="relative z-10">
                                            <p className="text-[7px] font-black uppercase tracking-widest text-[#4B2E83]/40 mb-1">Matrix Origin (DOB)</p>
                                            <p className="text-xl font-black text-slate-900 leading-none">{new Date(selectedClient.date_of_birth).toLocaleDateString('en-GB')}</p>
                                        </div>
                                    </div>
                                    <div className="p-6 bg-slate-50/50 rounded-2xl border border-slate-100">
                                        <p className="text-[7px] font-black uppercase tracking-widest text-[#4B2E83]/40 mb-1">Gender Class</p>
                                        <p className="text-xl font-black text-slate-900 uppercase leading-none">{selectedClient.gender}</p>
                                    </div>
                                    <div className="p-6 bg-[#4B2E83] rounded-2xl shadow-lg border border-white/10">
                                        <p className="text-[7px] font-black uppercase tracking-widest text-white/40 mb-1">Comm Protocol</p>
                                        <p className="text-xs font-black text-[#C9A227] truncate leading-none">{selectedClient.email_id || 'PROTOCOL_OFF'}</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-300 flex items-center gap-3">
                                        <History size={16} /> Sequential Trace History
                                    </h4>
                                    <div className="space-y-3">
                                        {historyLoading ? (
                                            <div className="py-20 text-center text-[9px] font-black uppercase tracking-widest text-slate-300 animate-pulse">Querying History Archive...</div>
                                        ) : history.map((item: any, i: number) => (
                                            <div key={i} className="flex gap-6 p-6 bg-white border border-slate-100 rounded-2xl hover:shadow-md transition-all group relative overflow-hidden">
                                                <div className="w-14 h-14 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-[#4B2E83] group-hover:text-white transition-all shadow-sm">
                                                    {item.type === 'Name' && <User size={24} />}
                                                    {item.type === 'Business' && <Building2 size={24} />}
                                                    {item.type === 'Mobile' && <Smartphone size={24} />}
                                                    {item.type === 'Vehicle' && <Car size={24} />}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <span className="px-2 py-0.5 bg-[#4B2E83] text-[#C9A227] text-[8px] font-black uppercase rounded shadow-sm tracking-[0.1em]">{item.type} Analysis</span>
                                                        <span className="text-[8px] font-bold text-slate-300 uppercase tracking-widest">{new Date(item.created_at).toLocaleString()}</span>
                                                    </div>
                                                    <p className="text-xl font-black text-slate-900 tracking-tight leading-none mb-4">{item.name_value}</p>
                                                    <div className="grid grid-cols-3 gap-6 pt-4 border-t border-slate-50">
                                                        <div>
                                                            <p className="text-[7px] font-black uppercase text-slate-300 mb-0.5">Score Flux</p>
                                                            <p className="text-base font-black text-[#4B2E83] leading-none">{item.total_score}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-[7px] font-black uppercase text-slate-300 mb-0.5">Pin ID</p>
                                                            <p className="text-base font-black text-slate-900 leading-none">{item.destiny_number}</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-[7px] font-black uppercase text-slate-300 mb-0.5">Epoch Status</p>
                                                            <p className="text-[9px] font-black uppercase text-emerald-500 leading-none">{item.status}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center">
                                <p className="text-[9px] font-black uppercase tracking-widest text-[#4B2E83]/30">Supervisory Access Protocol Active</p>
                                <button onClick={() => setSelectedClient(null)} className="px-6 py-2.5 bg-[#4B2E83] text-white rounded-xl font-black uppercase text-[9px] tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all">TERMINATE SESSION</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

