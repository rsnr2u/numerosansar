"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CreditCard, ArrowUpRight, ArrowDownRight, DollarSign, Download, Filter, Search, ChevronRight, MoreHorizontal } from "lucide-react";
import { api } from "@/lib/api";

export default function PaymentsPage() {
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);

    useEffect(() => {
        fetchTransactions();
    }, [currentPage, itemsPerPage]);

    const fetchTransactions = () => {
        setLoading(true);
        api.get(`/admin/payments?page=${currentPage}&limit=${itemsPerPage}`)
            .then(res => res.json())
            .then(resData => {
                if (resData && resData.data && Array.isArray(resData.data)) {
                    setTransactions(resData.data);
                    setTotalPages(resData.pagination.total_pages || 1);
                } else {
                    setTransactions([]);
                    setTotalPages(1);
                }
            })
            .catch(err => {
                console.error("Fetch transactions failed:", err);
                setTransactions([]);
            })
            .finally(() => setLoading(false));
    };

    const stats = [
        { label: "Gross Volume", val: `₹${(Array.isArray(transactions) ? transactions : []).reduce((acc, tx) => acc + (tx.status === 'paid' ? parseFloat(tx.amount) : 0), 0).toLocaleString('en-IN')}`, icon: <DollarSign size={20} />, color: "text-blue-500", bg: "bg-blue-500/10" },
        { label: "Platform Net", val: `₹${(Array.isArray(transactions) ? transactions : []).reduce((acc, tx) => acc + (tx.status === 'paid' ? parseFloat(tx.amount) * 0.97 : 0), 0).toLocaleString('en-IN')}`, icon: <CreditCard size={20} />, color: "text-[#E61111]", bg: "bg-[#E61111]/10" },
        { label: "Failed Ledger", val: (Array.isArray(transactions) ? transactions : []).filter(tx => tx.status === 'failed').length, icon: <ArrowDownRight size={20} />, color: "text-orange-500", bg: "bg-orange-500/10" },
    ];

    return (
        <div className="space-y-6">
            {/* Header Area */}
            <div className="flex items-center justify-between px-2">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900">Revenue Flow</h1>
                    <p className="text-sm font-medium text-slate-500">Financial intelligence and global transaction ledger.</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm">
                        <Filter size={14} /> Refine Flux
                    </button>
                    <button className="px-5 py-2.5 bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#E61111] transition-all flex items-center gap-2 shadow-lg">
                        <Download size={14} /> Export Financials
                    </button>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-lg transition-all">
                        <div className="flex items-center justify-between mb-6">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                                {stat.icon}
                            </div>
                            <ArrowUpRight size={20} className="text-slate-200 group-hover:text-black transition-colors" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">{stat.label}</p>
                            <h2 className="text-4xl font-black tracking-tighter text-black italic">{stat.val}</h2>
                        </div>
                    </div>
                ))}
            </div>

            {/* Search Bar */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1 max-w-xl">
                    <div className="p-2 text-slate-400"><Search size={18} /></div>
                    <input
                        type="text"
                        placeholder="Scan ledger by Invoice ID, Vendor, or Status..."
                        className="bg-transparent w-full text-sm font-medium outline-none placeholder:text-slate-300"
                    />
                </div>
                <div className="flex gap-4 text-[10px] font-black uppercase tracking-widest text-slate-300">
                    <span className="text-black cursor-pointer">Live Stream</span>
                    <span className="hover:text-black cursor-pointer">Settled Only</span>
                    <span className="hover:text-black cursor-pointer">Reversals</span>
                </div>
            </div>

            {/* Transaction Ledger */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-[500px]">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-10 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Identifier</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Merchant Node</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Volume</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">State</th>
                                <th className="px-10 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Timestamp</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan={5} className="py-12 text-center text-[10px] font-black uppercase text-slate-300 tracking-[0.4em] animate-pulse">Synchronizing Ledger with Global Vault...</td></tr>
                            ) : transactions.length === 0 ? (
                                <tr><td colSpan={5} className="py-12 text-center text-[10px] font-black uppercase text-slate-300 tracking-[0.4em]">Zero Transaction Flux Detected</td></tr>
                            ) : transactions.map((tx) => (
                                <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-10 py-6">
                                        <div className="text-[10px] font-black font-mono text-slate-300 uppercase tracking-widest">#{tx.invoice_id}</div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400 group-hover:bg-black group-hover:text-white transition-all shadow-sm">
                                                {(tx.username || 'A')[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="text-sm font-black italic tracking-tight">{tx.full_name || tx.username}</div>
                                                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{tx.plan_name}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 font-black italic text-sm tracking-tight">₹{parseFloat(tx.amount).toLocaleString('en-IN')}</td>
                                    <td className="px-6 py-6">
                                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm ${tx.status === 'paid' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${tx.status === 'paid' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                                            {tx.status}
                                        </div>
                                    </td>
                                    <td className="px-10 py-6 text-right">
                                        <div className="flex flex-col items-end gap-1">
                                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{new Date(tx.created_at).toLocaleDateString()}</div>
                                            <div className="text-[8px] font-bold text-slate-300 uppercase tracking-[0.2em]">{new Date(tx.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination Controls */}
            <div className="px-4 py-2 flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
                <div className="flex items-center gap-6">
                    <span>Page {currentPage} of {totalPages || 1}</span>
                    <select
                        value={itemsPerPage}
                        onChange={(e) => {
                            setItemsPerPage(parseInt(e.target.value));
                            setCurrentPage(1);
                        }}
                        className="bg-transparent border-none outline-none cursor-pointer hover:text-black transition-colors bg-slate-50 px-2 py-1 rounded-lg"
                    >
                        <option value="10">10 nodes</option>
                        <option value="20">20 nodes</option>
                        <option value="50">50 nodes</option>
                    </select>
                </div>
                <div className="flex gap-6">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        className="hover:text-black cursor-pointer disabled:opacity-20 flex items-center gap-2"
                    >
                        Previous Sequence
                    </button>
                    <button
                        disabled={currentPage === totalPages || totalPages === 0}
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        className="hover:text-black cursor-pointer disabled:opacity-20 flex items-center gap-2"
                    >
                        Next Sequence
                    </button>
                </div>
            </div>
        </div>
    );
}
