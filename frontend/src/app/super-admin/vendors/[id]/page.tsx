"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    User, Mail, Phone, MapPin, Building2, Calendar,
    Zap, Users, FileText, Smartphone, Car, ShieldCheck,
    ShieldAlert, ArrowLeft, RefreshCw, XCircle, CheckCircle,
    Eye, Search, History, Sparkles, BrainCircuit, CreditCard,
    Lock, Activity, Shield, X, Save, Code, Plus
} from "lucide-react";
import { api } from "@/lib/api";

export default function VendorDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [data, setData] = useState<any>(null);
    const [clients, setClients] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "registry");
    const [loading, setLoading] = useState(true);
    const [clientLoading, setClientLoading] = useState(false);
    const [selectedClient, setSelectedClient] = useState<any>(null);
    const [history, setHistory] = useState<any[]>([]);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
    const [allPlans, setAllPlans] = useState<any[]>([]);
    const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
    const [billingCycle, setBillingCycle] = useState("monthly");

    useEffect(() => {
        fetchData();
        fetchClients();
    }, [id]);

    useEffect(() => {
        const tab = searchParams.get("tab");
        if (tab) setActiveTab(tab);
    }, [searchParams]);

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

    const fetchPlans = async () => {
        try {
            const resp = await api.get("/plans");
            if (resp.ok) setAllPlans(await resp.json());
        } catch (err) {
            console.error("Failed to fetch plans", err);
        }
    };

    const handlePlanUpdate = async () => {
        if (!selectedPlanId) return;
        try {
            const resp = await api.post(`/admin/vendors/${id}/subscription`, {
                plan_id: selectedPlanId,
                billing_cycle: billingCycle
            });
            if (resp.ok) {
                fetchData();
                setIsPlanModalOpen(false);
            }
        } catch (err) {
            console.error("Plan update failed", err);
        }
    };

    const handleExtend = async () => {
        if (!data?.subscription) return;
        const currentEnd = new Date(data.subscription.ends_at);
        currentEnd.setDate(currentEnd.getDate() + 30);

        try {
            const resp = await api.post(`/admin/vendors/${id}/subscription`, {
                plan_id: data.subscription.plan_id,
                billing_cycle: data.subscription.billing_cycle,
                ends_at: currentEnd.toISOString().slice(0, 19).replace('T', ' ')
            });
            if (resp.ok) fetchData();
        } catch (err) {
            console.error("Extension failed", err);
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

    if (loading) return <div className="p-20 text-center animate-pulse font-black uppercase text-black/20">Scanning Entity Matrix...</div>;
    if (!data || !data.profile || data._error) return (
        <div className="p-20 text-center space-y-6">
            <div className="font-black uppercase text-black/20 text-2xl">Entity Not Found or Access Denied</div>
            <button onClick={() => router.back()} className="text-[10px] font-black uppercase tracking-widest text-black/40 hover:text-black transition-colors">Return to Ecosystem</button>
        </div>
    );

    return (
        <div className="space-y-6">
            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-black/40 hover:text-black transition-colors"
            >
                <ArrowLeft size={16} /> Return to Ecosystem
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Section */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white border-2 border-black p-6 rounded-2xl shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-6">
                            <div className={`w-3 h-3 rounded-full ${data.profile?.account_status === 'Active' ? 'bg-[#10B981] animate-pulse' : 'bg-red-500'}`}></div>
                        </div>
                        <div className="flex flex-col items-center text-center space-y-4 mb-8">
                            <div className="w-24 h-24 rounded-2xl bg-black flex items-center justify-center text-white text-4xl font-black italic shadow-xl">
                                {data.profile.full_name?.charAt(0) || data.profile.username?.charAt(0)}
                            </div>
                            <div>
                                <h1 className="text-2xl font-black tracking-tighter uppercase">{data.profile.full_name || data.profile.username}</h1>
                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-black/20">{data.profile.role}</p>
                            </div>
                        </div>

                        <div className="space-y-4 pt-6 border-t border-black/5">
                            <div className="grid grid-cols-1 gap-4">
                                <div className="space-y-1">
                                    <p className="text-[8px] font-black uppercase tracking-widest text-black/20">Email Protocol</p>
                                    <p className="text-xs font-bold">{data.profile.email}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[8px] font-black uppercase tracking-widest text-black/20">Mobile Link</p>
                                    <p className="text-xs font-bold">{data.profile.mobile || 'N/A'}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[8px] font-black uppercase tracking-widest text-black/20">Entity Name</p>
                                    <p className="text-xs font-bold">{data.profile.business_name || 'Individual'}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[8px] font-black uppercase tracking-widest text-black/20">Base Address</p>
                                    <p className="text-xs font-bold">{data.profile.address || data.profile.city || 'Universal'}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-black/5">
                                    <div className="space-y-1">
                                        <p className="text-[8px] font-black uppercase tracking-widest text-black/20">Registration</p>
                                        <p className="text-[10px] font-bold">{new Date(data.profile.created_at).toLocaleDateString()}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[8px] font-black uppercase tracking-widest text-black/20">Last Pulse</p>
                                        <p className="text-[10px] font-bold">{data.profile.last_login ? new Date(data.profile.last_login).toLocaleDateString() : 'Never'}</p>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[8px] font-black uppercase tracking-widest text-black/20">Origin Trace (IP)</p>
                                    <p className="text-[10px] font-bold text-black/40">{data.profile.last_ip || '0.0.0.0'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-black/5 p-6 rounded-2xl shadow-xl space-y-6">
                        <h3 className="text-xs font-black uppercase tracking-widest border-b border-black/5 pb-4">Status Controls</h3>
                        <div className="grid grid-cols-1 gap-3">
                            {data.profile.account_status !== 'Active' && (
                                <button
                                    onClick={() => handleStatusUpdate('Active')}
                                    className="flex items-center justify-center gap-2 py-4 bg-[#10B981] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:shadow-lg transition-all"
                                >
                                    <CheckCircle size={16} /> Reactivate Vendor
                                </button>
                            )}
                            {data.profile.account_status === 'Active' && (
                                <button
                                    onClick={() => handleStatusUpdate('Suspended')}
                                    className="flex items-center justify-center gap-2 py-4 bg-orange-500 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:shadow-lg transition-all"
                                >
                                    <XCircle size={16} /> Suspend (Temp)
                                </button>
                            )}
                            <button
                                onClick={() => handleStatusUpdate('Blocked')}
                                className="flex items-center justify-center gap-2 py-4 bg-red-500 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:shadow-lg transition-all"
                            >
                                <Zap size={16} /> Block (Permanent)
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Subscription & Usage */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        <div className="bg-white border border-black/5 p-6 rounded-2xl shadow-2xl relative overflow-hidden flex flex-col">
                            <div className="absolute top-0 right-0 p-6">
                                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${data.subscription?.status === 'active' ? 'bg-[#10B981]/10 text-[#10B981]' : 'bg-red-500/10 text-red-500'}`}>
                                    {data.subscription?.status || 'Inactive'}
                                </div>
                            </div>
                            <h3 className="text-[10px] font-black uppercase tracking-widest mb-6 opacity-20">Subscription Matrix</h3>
                            <div className="space-y-4 flex-1">
                                <div className="space-y-1">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-black/20">Current Tier</p>
                                    <h4 className="text-2xl font-black uppercase italic">{data.subscription?.plan_name || 'Free Tier'}</h4>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <p className="text-[8px] font-black tracking-widest uppercase text-black/20">Cycle</p>
                                        <p className="text-[10px] font-black uppercase border border-black/5 rounded px-2 py-0.5 w-fit bg-slate-50">{data.subscription?.billing_cycle || 'N/A'}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[8px] font-black tracking-widest uppercase text-black/20">Auto-Renew</p>
                                        <p className={`text-[10px] font-black uppercase ${data.subscription?.auto_renew == 1 ? 'text-[#10B981]' : 'text-red-500'}`}>{data.subscription?.auto_renew == 1 ? 'YES' : 'NO'}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-6 pt-2">
                                    <div className="space-y-1">
                                        <p className="text-[8px] font-black tracking-widest uppercase text-black/20">Start Date</p>
                                        <p className="text-[10px] font-bold">{data.subscription?.starts_at ? new Date(data.subscription.starts_at).toLocaleDateString() : 'N/A'}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[8px] font-black tracking-widest uppercase text-black/20">Expiry Date</p>
                                        <p className="text-[10px] font-bold text-[#E61111]">{data.subscription?.ends_at ? new Date(data.subscription.ends_at).toLocaleDateString() : 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-8 flex flex-wrap gap-2">
                                <button
                                    onClick={() => {
                                        fetchPlans();
                                        setIsPlanModalOpen(true);
                                    }}
                                    className="px-4 py-2 bg-black text-white rounded-xl font-black uppercase text-[8px] tracking-widest hover:bg-[#E61111] transition-all"
                                >
                                    Change Plan
                                </button>
                                <button
                                    onClick={handleExtend}
                                    className="px-4 py-2 border border-black/10 rounded-xl font-black uppercase text-[8px] tracking-widest hover:bg-slate-50 transition-all"
                                >
                                    Extend
                                </button>
                                <button className="px-4 py-2 bg-red-50 text-red-500 rounded-xl font-black uppercase text-[8px] tracking-widest hover:bg-red-100 transition-all ml-auto">Cancel</button>
                            </div>
                        </div>

                        <div className="bg-white border border-black/5 p-6 rounded-2xl shadow-2xl flex flex-col">
                            <h3 className="text-[10px] font-black uppercase tracking-widest mb-6 opacity-20">Usage Infrastructure</h3>
                            <div className="grid grid-cols-2 gap-4 flex-1">
                                {[
                                    { label: "Total Clients", val: data.metrics?.total_clients ?? 0, icon: <Users size={14} /> },
                                    { label: "Name Checks", val: data.metrics?.name_checks ?? 0, icon: <User size={14} /> },
                                    { label: "Business Units", val: data.metrics?.business_checks ?? 0, icon: <Building2 size={14} /> },
                                    { label: "Mobile Syncs", val: data.metrics?.mobile_checks ?? 0, icon: <Smartphone size={14} /> },
                                    { label: "Vehicle Tags", val: data.metrics?.vehicle_checks ?? 0, icon: <Car size={14} /> },
                                    { label: "Confirmed", val: data.metrics?.confirmed_results ?? 0, icon: <CheckCircle size={14} />, accent: true },
                                ].map((m, i) => (
                                    <div key={i} className={`p-4 rounded-2xl border ${m.accent ? 'bg-orange-50/30 border-orange-100' : 'bg-slate-50/30 border-black/5'} flex items-center gap-4`}>
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${m.accent ? 'bg-orange-100 text-orange-500' : 'bg-white text-slate-300 shadow-sm'}`}>{m.icon}</div>
                                        <div>
                                            <p className="text-[7px] font-black uppercase tracking-widest opacity-30">{m.label}</p>
                                            <h3 className="text-sm font-black italic">{m.val}</h3>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Tab Navigation */}
                    <div className="flex gap-2 p-1 bg-slate-100 rounded-xl w-fit">
                        {[
                            { id: "registry", label: "Client Registry", icon: <Users size={14} /> },
                            { id: "ledger", label: "Financial Ledger", icon: <CreditCard size={14} /> },
                            { id: "audit", label: "Security Audit", icon: <Shield size={14} /> }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-black text-white shadow-lg' : 'text-slate-400 hover:text-black hover:bg-white'}`}
                            >
                                {tab.icon} {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* All Clients Registry */}
                    {activeTab === 'registry' && (
                        <div className="bg-white border border-black/5 rounded-2xl shadow-2xl overflow-hidden min-h-[500px] flex flex-col">
                            <div className="px-6 py-5 border-b border-black/5 flex justify-between items-center bg-slate-50/50">
                                <div>
                                    <h3 className="text-sm font-black uppercase tracking-[0.3em]">Client Registry</h3>
                                    <p className="text-[9px] font-bold text-black/20 uppercase tracking-widest mt-1">Full Entity Oversight for {data.profile.full_name || data.profile.username}</p>
                                </div>
                                <div className="flex gap-4">
                                    <div className="relative">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20" size={14} />
                                        <input
                                            type="text"
                                            placeholder="SEARCH MATRIX..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10 pr-6 py-2 bg-white border border-black/5 rounded-full text-[9px] font-black uppercase tracking-widest focus:outline-none focus:border-black/20 transition-all w-64"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-black/5">
                                            <th className="pl-6 pr-6 py-5 text-[9px] font-black uppercase tracking-[0.25em] text-black/30">Entity Profile</th>
                                            <th className="px-6 py-5 text-[9px] font-black uppercase tracking-[0.25em] text-black/30">Intensity (Checks)</th>
                                            <th className="px-6 py-5 text-[9px] font-black uppercase tracking-[0.25em] text-black/30">Registration</th>
                                            <th className="px-6 py-5 text-[9px] font-black uppercase tracking-[0.25em] text-black/30 text-right">Oversight</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-black/5">
                                        {filteredClients.map((client: any) => (
                                            <tr key={client.id} className="hover:bg-[#FAF7F2] transition-colors group">
                                                <td className="pl-6 pr-6 py-5">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-black group-hover:text-white transition-all text-xs font-black italic">
                                                            {client.full_name?.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="text-[11px] font-black uppercase tracking-tight italic">{client.full_name}</p>
                                                            <p className="text-[9px] font-bold text-black/20 uppercase tracking-widest">{client.email_id}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-black text-white rounded-lg text-[9px] font-black italic">
                                                        {client.check_count || 0} SEQS
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <span className="px-3 py-1 bg-white border border-black/5 rounded-lg text-[10px] font-black">
                                                        {new Date(client.created_at).toLocaleDateString('en-GB')}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5 text-right">
                                                    <button
                                                        onClick={() => fetchClientHistory(client)}
                                                        className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-black hover:text-white rounded-lg text-[9px] font-black uppercase tracking-widest transition-all shadow-sm"
                                                    >
                                                        <BrainCircuit size={12} /> View Intelligence
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {clients.length === 0 && !clientLoading && (
                                            <tr><td colSpan={4} className="py-20 text-center text-[10px] font-black uppercase text-black/20 tracking-[0.4em] italic">No entities detected in this sector</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Financial Ledger */}
                    {activeTab === 'ledger' && (
                        <div className="bg-white border border-black/5 rounded-2xl shadow-2xl overflow-hidden min-h-[500px] flex flex-col">
                            <div className="px-6 py-5 border-b border-black/5 bg-slate-50/50 flex justify-between items-center">
                                <div>
                                    <h3 className="text-sm font-black uppercase tracking-[0.3em]">Financial Ledger</h3>
                                    <p className="text-[9px] font-bold text-black/20 uppercase tracking-widest mt-1">Transaction History & Invoice Archive</p>
                                </div>
                            </div>
                            <div className="flex-1 overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-black/5">
                                            <th className="pl-6 pr-6 py-5 text-[9px] font-black uppercase tracking-[0.25em] text-black/30">Invoice ID</th>
                                            <th className="px-6 py-5 text-[9px] font-black uppercase tracking-[0.25em] text-black/30">Plan</th>
                                            <th className="px-6 py-5 text-[9px] font-black uppercase tracking-[0.25em] text-black/30 text-center">Amount</th>
                                            <th className="px-6 py-5 text-[9px] font-black uppercase tracking-[0.25em] text-black/30 text-right">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-black/5">
                                        {(data.payments || []).map((p: any) => (
                                            <tr key={p.id} className="hover:bg-[#FAF7F2] transition-colors">
                                                <td className="pl-6 pr-6 py-5">
                                                    <p className="text-[11px] font-black uppercase tracking-tight italic">#{p.invoice_id}</p>
                                                    <p className="text-[9px] font-bold text-black/20 uppercase tracking-widest">{new Date(p.created_at).toLocaleDateString()}</p>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <span className="text-[10px] font-black uppercase">{p.plan_name}</span>
                                                </td>
                                                <td className="px-6 py-5 text-center font-black">₹{p.amount}</td>
                                                <td className="px-6 py-5 text-right">
                                                    <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${p.status === 'paid' ? 'bg-[#10B981]/10 text-[#10B981]' : 'bg-red-500/10 text-red-500'}`}>
                                                        {p.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                        {(!data.payments || data.payments.length === 0) && (
                                            <tr><td colSpan={4} className="py-20 text-center text-[10px] font-black uppercase text-black/20 tracking-[0.4em] italic">No transaction records found</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Security Audit Flux */}
                    {activeTab === 'audit' && (
                        <div className="bg-white border border-black/5 rounded-2xl shadow-2xl overflow-hidden min-h-[500px] flex flex-col">
                            <div className="px-6 py-5 border-b border-black/5 bg-slate-50/50 flex justify-between items-center">
                                <div>
                                    <h3 className="text-sm font-black uppercase tracking-[0.3em]">Security Audit</h3>
                                    <p className="text-[9px] font-bold text-black/20 uppercase tracking-widest mt-1">System interactions & Access Logs</p>
                                </div>
                            </div>
                            <div className="p-6 space-y-4">
                                {(data.audit_logs || []).map((l: any, i: number) => (
                                    <div key={i} className="flex gap-6 p-6 bg-slate-50/50 rounded-3xl border border-black/5 items-center">
                                        <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center text-white shadow-lg">
                                            <Activity size={20} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-[#E61111] mb-1">{l.action.replace(/_/g, ' ')}</p>
                                                    <p className="text-xs font-bold leading-relaxed">{l.details || 'System interaction recorded'}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[9px] font-black uppercase text-slate-400">{new Date(l.created_at).toLocaleDateString()}</p>
                                                    <p className="text-[9px] font-black uppercase text-slate-400">{new Date(l.created_at).toLocaleTimeString()}</p>
                                                </div>
                                            </div>
                                            <div className="mt-3 text-[8px] font-black uppercase tracking-[0.2em] text-slate-300">
                                                Origin ID: {l.ip_address} • Performed By: {l.performed_by === data.profile.id ? 'Vendor Self' : 'Super Admin'}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {(!data.audit_logs || data.audit_logs.length === 0) && (
                                    <div className="py-20 text-center text-[10px] font-black uppercase text-black/20 tracking-[0.4em] italic">No security anomalies detected</div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Intelligence Modal */}
            <AnimatePresence>
                {selectedClient && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            <div className="p-6 border-b border-black/5 flex justify-between items-center bg-[#FAF7F2]">
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 rounded-2xl bg-black flex items-center justify-center text-white text-2xl font-black italic shadow-xl">
                                        {selectedClient.full_name?.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black uppercase italic tracking-tighter">{selectedClient.full_name}</h3>
                                        <div className="flex gap-4 mt-2">
                                            <span className="text-[9px] font-black uppercase tracking-widest text-[#E61111] bg-white px-3 py-1 rounded-full border border-red-50 shadow-sm">Audit Mode</span>
                                            <span className="text-[9px] font-black uppercase tracking-widest text-black/20">Archive Indexed: {new Date(selectedClient.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedClient(null)}
                                    className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center hover:bg-black hover:text-white transition-all shadow-lg"
                                >
                                    <ArrowLeft size={20} className="rotate-90" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="p-6 bg-slate-50/50 rounded-3xl border border-black/5">
                                        <p className="text-[8px] font-black uppercase tracking-widest text-black/20 mb-2">Primary DOB</p>
                                        <p className="text-xl font-black italic">{new Date(selectedClient.date_of_birth).toLocaleDateString()}</p>
                                    </div>
                                    <div className="p-6 bg-slate-50/50 rounded-3xl border border-black/5">
                                        <p className="text-[8px] font-black uppercase tracking-widest text-black/20 mb-2">Gender Class</p>
                                        <p className="text-xl font-black italic uppercase">{selectedClient.gender}</p>
                                    </div>
                                    <div className="p-6 bg-slate-50/50 rounded-3xl border border-black/5">
                                        <p className="text-[8px] font-black uppercase tracking-widest text-black/20 mb-2">Contact Protocol</p>
                                        <p className="text-xs font-black italic">{selectedClient.email_id || 'COMM-OFF'}</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-black/20 flex items-center gap-4">
                                        <History size={14} /> Chronological Check History
                                    </h4>

                                    <div className="space-y-4">
                                        {historyLoading ? (
                                            <div className="py-20 text-center animate-pulse text-[10px] font-black uppercase tracking-widest">Querying History Matrix...</div>
                                        ) : history.map((item: any, i: number) => (
                                            <div key={i} className="flex gap-6 p-6 bg-white border border-black/5 rounded-2xl hover:shadow-xl transition-all group relative overflow-hidden">
                                                {item.is_confirmed === "1" && (
                                                    <div className="absolute top-0 right-0 p-4">
                                                        <div className="px-3 py-1 bg-[#10B981] text-white text-[8px] font-black uppercase tracking-widest rounded-full shadow-lg">Current Validated</div>
                                                    </div>
                                                )}
                                                <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-black group-hover:text-white transition-all">
                                                    {item.type === 'Name' && <User size={24} />}
                                                    {item.type === 'Business' && <Building2 size={24} />}
                                                    {item.type === 'Mobile' && <Smartphone size={24} />}
                                                    {item.type === 'Vehicle' && <Car size={24} />}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 bg-black text-white rounded">{item.type}</span>
                                                        <span className="text-[9px] font-bold text-black/20 uppercase tracking-widest">{new Date(item.created_at).toLocaleTimeString()} • {new Date(item.created_at).toLocaleDateString()}</span>
                                                    </div>
                                                    <p className="text-lg font-black italic tracking-tight">{item.name_value}</p>
                                                    <div className="mt-4 flex gap-6">
                                                        <div className="text-center bg-slate-50 px-4 py-2 rounded-xl">
                                                            <p className="text-[7px] font-black uppercase opacity-20">Score</p>
                                                            <p className="text-sm font-black text-[#E61111]">{item.total_score}</p>
                                                        </div>
                                                        <div className="text-center bg-slate-50 px-4 py-2 rounded-xl">
                                                            <p className="text-[7px] font-black uppercase opacity-20">Destiny</p>
                                                            <p className="text-sm font-black">{item.destiny_number}</p>
                                                        </div>
                                                        <div className="text-center bg-slate-50 px-4 py-2 rounded-xl">
                                                            <p className="text-[7px] font-black uppercase opacity-20">Status</p>
                                                            <p className="text-sm font-black uppercase italic">{item.status}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {history.length === 0 && !historyLoading && (
                                            <div className="py-20 text-center text-[10px] font-black uppercase text-black/10 tracking-widest italic border-2 border-dashed border-black/5 rounded-3xl">No historical check data available for this entity</div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 border-t border-black/5 bg-[#FAF7F2]/50 flex justify-between items-center">
                                <p className="text-[9px] font-black uppercase tracking-widest text-black/20">Read-Only Supervisory Protocol Enabled</p>
                                <button onClick={() => setSelectedClient(null)} className="px-8 py-4 bg-black text-white rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-[#E61111] transition-all shadow-xl">Exit Intel Mode</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Change Plan Modal */}
            <AnimatePresence>
                {isPlanModalOpen && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                            onClick={() => setIsPlanModalOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
                        >
                            <div className="p-6 border-b border-black/5 flex justify-between items-center bg-slate-50/50">
                                <h2 className="text-xl font-black uppercase tracking-tight italic">Override Subscription</h2>
                                <button onClick={() => setIsPlanModalOpen(false)} className="p-2 hover:bg-black/5 rounded-full"><X size={20} /></button>
                            </div>

                            <div className="p-6 space-y-6">
                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-black/30 ml-1">Target Tier</label>
                                        <div className="grid grid-cols-1 gap-2">
                                            {allPlans.map(p => (
                                                <button
                                                    key={p.id}
                                                    onClick={() => setSelectedPlanId(p.id)}
                                                    className={`px-6 py-4 rounded-2xl border text-left transition-all ${selectedPlanId === p.id ? 'bg-black text-white border-black shadow-xl ring-4 ring-black/5' : 'bg-slate-50 border-black/5 hover:border-black/10'}`}
                                                >
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm font-black uppercase italic">{p.name}</span>
                                                        <span className={`text-[10px] font-bold ${selectedPlanId === p.id ? 'text-white/40' : 'text-black/20'}`}>₹{p.price_monthly}/mo</span>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-black/30 ml-1">Billing Protocol</label>
                                        <div className="flex gap-2">
                                            {['monthly', 'yearly'].map(cycle => (
                                                <button
                                                    key={cycle}
                                                    onClick={() => setBillingCycle(cycle)}
                                                    className={`flex-1 py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${billingCycle === cycle ? 'bg-black text-white border-black' : 'bg-white border-black/5 text-black/20 hover:border-black/10'}`}
                                                >
                                                    {cycle}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 flex gap-4">
                                    <button
                                        onClick={() => setIsPlanModalOpen(false)}
                                        className="flex-1 py-4 bg-slate-100 text-slate-400 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-200 transition-all"
                                    >
                                        Abort
                                    </button>
                                    <button
                                        onClick={handlePlanUpdate}
                                        className="flex-2 px-10 py-4 bg-black text-white rounded-xl font-black uppercase tracking-widest text-[10px] hover:shadow-2xl transition-all flex items-center justify-center gap-2"
                                    >
                                        <Save size={16} /> Finalize Protocol
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
