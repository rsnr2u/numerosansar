import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    CreditCard, ArrowUpRight, ArrowDownRight, DollarSign,
    Download, Filter, Search, ChevronRight, MoreHorizontal,
    Wallet, Calendar, Package, Clock, Eye, X, RefreshCw,
    TrendingUp, ArrowLeft, Receipt, CheckCircle, AlertCircle
} from "lucide-react";
import { api } from "@/lib/api";

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [statsLoading, setStatsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [packageFilter, setPackageFilter] = useState("all");
    const [selectedTx, setSelectedTx] = useState<any>(null);
    const [detailLoading, setDetailLoading] = useState(false);

    useEffect(() => {
        fetchStats();
    }, []);

    useEffect(() => {
        fetchTransactions();
    }, [currentPage, statusFilter, packageFilter]);

    const fetchStats = async () => {
        setStatsLoading(true);
        try {
            const res = await api.get('/admin/transactions/stats');
            const data = await res.json();
            setStats(data.summary);
        } catch (err) {
            console.error("Stats fetch failed", err);
        } finally {
            setStatsLoading(false);
        }
    };

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const query = new URLSearchParams({
                page: currentPage.toString(),
                status: statusFilter,
                package: packageFilter,
                search: searchTerm
            });
            const res = await api.get(`/admin/transactions?${query.toString()}`);
            const data = await res.json();
            setTransactions(data.data || []);
            setTotalPages(data.pagination?.total_pages || 1);
        } catch (err) {
            console.error("Transactions fetch failed", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchDetail = async (id: number) => {
        setDetailLoading(true);
        try {
            const res = await api.get(`/admin/transactions/${id}`);
            const data = await res.json();
            setSelectedTx(data);
        } catch (err) {
            console.error("Detail fetch failed", err);
        } finally {
            setDetailLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentPage(1);
        fetchTransactions();
    };

    const statCards = [
        { label: "Total Revenue", val: `₹${stats?.total_revenue?.toLocaleString() || '0'}`, icon: <DollarSign size={20} />, color: "text-emerald-500", bg: "bg-emerald-50" },
        { label: "Today's Intake", val: `₹${stats?.today_revenue?.toLocaleString() || '0'}`, icon: <TrendingUp size={20} />, color: "text-[#4B2E83]", bg: "bg-[#4B2E83]/5" },
        { label: "This Month", val: `₹${stats?.month_revenue?.toLocaleString() || '0'}`, icon: <Calendar size={20} />, color: "text-[#C9A227]", bg: "bg-[#C9A227]/10" },
        { label: "Tx Count", val: stats?.total_transactions || '0', icon: <ArrowUpRight size={20} />, color: "text-blue-500", bg: "bg-blue-50" },
    ];

    return (
        <div className="space-y-6">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 leading-none mb-2">Transactions Ledger</h1>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Financial Command & Revenue Integrity System</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => { fetchStats(); fetchTransactions(); }}
                        className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-[#4B2E83] transition-all shadow-sm"
                    >
                        <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
                    </button>
                    <button className="flex items-center gap-2 px-6 py-3 bg-[#4B2E83] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:shadow-xl hover:shadow-purple-900/20 active:scale-95 transition-all">
                        <Download size={16} /> Export Financial Intel
                    </button>
                </div>
            </div>

            {/* Stats Ribbon */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((s, i) => (
                    <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-10 h-10 ${s.bg} ${s.color} rounded-xl flex items-center justify-center`}>
                                {s.icon}
                            </div>
                            <div className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Real-time flux</div>
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{s.label}</p>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">{s.val}</h2>
                        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-slate-50 to-transparent opacity-50 -mr-8 -mt-8 rounded-full"></div>
                    </div>
                ))}
            </div>

            {/* Filter Hub */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col lg:flex-row gap-4">
                <form onSubmit={handleSearch} className="flex-1 relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#4B2E83] transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="SEARCH TXN ID OR NUMEROLOGIST..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-50 rounded-xl text-xs font-black uppercase tracking-widest focus:outline-none focus:bg-white focus:border-[#4B2E83]/10 transition-all shadow-inner"
                    />
                </form>
                <div className="flex gap-3">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-3 bg-slate-50 border border-slate-50 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 focus:outline-none focus:border-[#4B2E83]/10"
                    >
                        <option value="all">Status: All Status</option>
                        <option value="completed">Success</option>
                        <option value="pending">Pending</option>
                        <option value="failed">Failed</option>
                    </select>
                    <select
                        value={packageFilter}
                        onChange={(e) => setPackageFilter(e.target.value)}
                        className="px-4 py-3 bg-slate-50 border border-slate-50 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 focus:outline-none focus:border-[#4B2E83]/10"
                    >
                        <option value="all">Package: All Packs</option>
                        <option value="Starter">Starter Pack</option>
                        <option value="Professional">Professional</option>
                        <option value="Master">Master Pack</option>
                    </select>
                </div>
            </div>

            {/* Main Ledger Table */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400">TXN Identity</th>
                                <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400">Numerologist</th>
                                <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400">Intelligence Pack</th>
                                <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400">Volume</th>
                                <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400 text-center">Protocol State</th>
                                <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400">Epoch</th>
                                <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400 text-right">Ops</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr><td colSpan={7} className="py-20 text-center text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 animate-pulse">Syncing Financial Matrix with Core Ledger...</td></tr>
                            ) : transactions.length === 0 ? (
                                <tr><td colSpan={7} className="py-20 text-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">No Transaction Flux Detected</td></tr>
                            ) : transactions.map((tx) => (
                                <tr key={tx.id} className="hover:bg-slate-50/30 transition-colors group">
                                    <td className="px-8 py-4">
                                        <div className="text-[10px] font-black text-slate-400 font-mono tracking-widest uppercase">#{tx.display_id}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 bg-[#4B2E83]/5 text-[#4B2E83] rounded-xl flex items-center justify-center text-[10px] font-black font-mono">
                                                {tx.vendor_name?.charAt(0) || 'U'}
                                            </div>
                                            <div>
                                                <p className="text-[11px] font-black text-slate-900 group-hover:text-[#4B2E83] transition-colors">{tx.vendor_name || 'Generic Node'}</p>
                                                <p className="text-[8px] font-bold text-slate-300 uppercase tracking-widest truncate max-w-[120px]">{tx.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-white border border-slate-100 rounded-lg shadow-sm">
                                            <Package size={12} className="text-[#C9A227]" />
                                            <span className="text-[9px] font-black uppercase tracking-tight text-slate-600">{tx.package_name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-black text-slate-900 leading-none mb-0.5">₹{parseFloat(tx.total_amount).toLocaleString()}</span>
                                            <span className="text-[8px] font-bold text-slate-300 uppercase tracking-widest">{tx.quantity} Credits</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-[0.1em] border ${tx.status === 'completed' ? 'bg-emerald-50 text-emerald-500 border-emerald-100' :
                                                tx.status === 'pending' ? 'bg-amber-50 text-amber-500 border-amber-100' :
                                                    'bg-red-50 text-red-500 border-red-100'
                                            }`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${tx.status === 'completed' ? 'bg-emerald-500 animate-pulse' : tx.status === 'pending' ? 'bg-amber-500 shadow-sm' : 'bg-red-500'}`}></div>
                                            {tx.status}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-black text-slate-900">{new Date(tx.created_at).toLocaleDateString('en-GB')}</span>
                                            <span className="text-[8px] font-bold text-slate-300 uppercase tracking-widest">{new Date(tx.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-4 text-right">
                                        <button
                                            onClick={() => fetchDetail(tx.id)}
                                            className="p-2.5 bg-slate-50 text-slate-300 hover:text-[#4B2E83] hover:bg-[#4B2E83]/5 rounded-xl transition-all shadow-sm"
                                        >
                                            <Eye size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Suite */}
                <div className="p-6 border-t border-slate-50 flex items-center justify-between">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-300">Displaying Matrix Nodes: Page {currentPage} / {totalPages}</p>
                    <div className="flex gap-2">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            className="px-6 py-2.5 bg-slate-50 text-[9px] font-black uppercase tracking-widest text-slate-400 rounded-xl hover:bg-[#4B2E83] hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-slate-50 disabled:hover:text-slate-400 shadow-sm"
                        >
                            Retreat
                        </button>
                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            className="px-6 py-2.5 bg-[#4B2E83] text-white text-[9px] font-black uppercase tracking-widest rounded-xl hover:shadow-lg hover:shadow-purple-900/20 active:scale-95 transition-all disabled:opacity-30 shadow-md shadow-purple-900/10"
                        >
                            Advance
                        </button>
                    </div>
                </div>
            </div>

            {/* Transaction Intelligence Modal */}
            <AnimatePresence>
                {selectedTx && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#4B2E83]/60 backdrop-blur-md"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }}
                            className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col"
                        >
                            {/* Modal Header */}
                            <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center relative overflow-hidden">
                                <div className="relative z-10 flex items-center gap-6">
                                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${selectedTx.status === 'completed' ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-amber-500 text-white shadow-amber-500/20'}`}>
                                        <Wallet size={28} />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black tracking-tighter text-slate-900 leading-none uppercase mb-2">TXN Intelligence</h3>
                                        <div className="flex gap-3">
                                            <span className={`px-2.5 py-1 text-[8px] font-black uppercase tracking-widest rounded-md border ${selectedTx.status === 'completed' ? 'bg-emerald-50 text-emerald-500 border-emerald-100' : 'bg-amber-50 text-amber-500 border-amber-100'}`}>
                                                State: {selectedTx.status}
                                            </span>
                                            <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest pt-1 px-1 flex items-center gap-2">
                                                <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                                                Ref: {selectedTx.payment_reference || 'N/A'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedTx(null)} className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-300 hover:text-[#4B2E83] transition-all shadow-md relative z-10 hover:scale-105 active:scale-95">
                                    <X size={20} />
                                </button>
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/50 blur-3xl opacity-50 -mr-16 -mt-16"></div>
                            </div>

                            {/* Modal Body */}
                            <div className="p-8 space-y-8">
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <div className="group">
                                            <p className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 font-mono">Entity Trace</p>
                                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 group-hover:bg-white group-hover:shadow-md transition-all">
                                                <p className="text-xs font-black text-slate-900 leading-none mb-1">{selectedTx.vendor_name || 'Generic Admin'}</p>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{selectedTx.email}</p>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">{selectedTx.mobile || 'No Mobile Link'}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 font-mono">Resource Flux</p>
                                            <div className="p-4 bg-[#4B2E83]/5 rounded-xl border border-[#4B2E83]/10">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <Package size={14} className="text-[#C9A227]" />
                                                    <p className="text-[10px] font-black uppercase text-[#4B2E83] tracking-widest">{selectedTx.package_name}</p>
                                                </div>
                                                <p className="text-xl font-black text-[#4B2E83] leading-none mb-1">{selectedTx.quantity} Credits</p>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Added to {selectedTx.credit_type} balance</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <p className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 font-mono">Financial Extraction</p>
                                            <div className="p-6 bg-slate-900 rounded-xl shadow-lg relative overflow-hidden">
                                                <p className="text-[8px] font-black uppercase tracking-[0.3em] text-white/30 mb-2">Net Amount Paid</p>
                                                <p className="text-3xl font-black text-white tracking-tighter mb-4 leading-none">₹{parseFloat(selectedTx.total_amount).toLocaleString()}</p>
                                                <div className="flex justify-between items-center pt-4 border-t border-white/10">
                                                    <div className="text-[8px] font-black text-white/40 uppercase tracking-widest">Razorpay Matrix</div>
                                                    <Receipt size={16} className="text-[#C9A227]" />
                                                </div>
                                                <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 rounded-full blur-2xl"></div>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 font-mono">Temporal Signature</p>
                                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <Clock size={16} className="text-slate-300" />
                                                    <p className="text-xs font-black text-slate-900 uppercase">{new Date(selectedTx.created_at).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                                                </div>
                                                <p className="text-[10px] font-black text-[#4B2E83]">{new Date(selectedTx.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {selectedTx.notes && (
                                    <div className="p-4 bg-amber-50/50 border border-amber-100 rounded-xl">
                                        <div className="flex items-center gap-2 mb-2">
                                            <AlertCircle size={14} className="text-amber-500" />
                                            <p className="text-[8px] font-black uppercase tracking-widest text-amber-600">Admin Intelligence Notes</p>
                                        </div>
                                        <p className="text-[10px] font-bold text-amber-800 leading-relaxed italic">"{selectedTx.notes}"</p>
                                    </div>
                                )}
                            </div>

                            {/* Modal Footer */}
                            <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                                <button className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-[#4B2E83] transition-all shadow-sm">
                                    <Download size={14} /> Download Ledger Proof
                                </button>
                                <button
                                    onClick={() => setSelectedTx(null)}
                                    className="px-8 py-2.5 bg-[#4B2E83] text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-xl shadow-purple-900/10 hover:scale-105 active:scale-95 transition-all"
                                >
                                    Dismiss Intelligence
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
