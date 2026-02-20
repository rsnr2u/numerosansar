"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, Clock, User, Info, Search, Filter, ShieldCheck, Zap, Activity } from "lucide-react";
import { api } from "@/lib/api";

export default function AuditLogPage() {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);

    // Search Debouncing
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setCurrentPage(1);
        }, 500);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    useEffect(() => {
        fetchLogs();
    }, [debouncedSearch, currentPage, itemsPerPage]);

    const fetchLogs = () => {
        setLoading(true);
        const params = new URLSearchParams();
        if (debouncedSearch) params.append('search', debouncedSearch);
        params.append('page', currentPage.toString());
        params.append('limit', itemsPerPage.toString());

        api.get(`/admin/audit-logs?${params.toString()}`)
            .then(res => res.json())
            .then(resData => {
                if (resData && resData.data && Array.isArray(resData.data)) {
                    setLogs(resData.data);
                    setTotalPages(resData.pagination.total_pages || 1);
                } else {
                    setLogs(Array.isArray(resData) ? resData : []);
                    setTotalPages(1);
                }
            })
            .catch(err => {
                console.error("Fetch logs failed:", err);
                setLogs([]);
            })
            .finally(() => setLoading(false));
    };



    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-4xl font-black tracking-tighter uppercase italic">Security Audit Logs</h1>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-black/20 mt-1">Global Transaction & Access Registry</p>
            </div>

            {/* Matrix Filter */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1 max-w-xl">
                    <div className="p-2 text-slate-400"><Search size={18} /></div>
                    <input
                        type="text"
                        placeholder="Scan historical logs by action, actor, or metadata..."
                        className="bg-transparent w-full text-sm font-medium outline-none placeholder:text-slate-300"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-6 text-[10px] font-black uppercase tracking-widest text-slate-300">
                    <span className="text-black cursor-pointer">Global Feed</span>
                    <span className="hover:text-black cursor-pointer">Admin Actions</span>
                    <span className="hover:text-black cursor-pointer">Login Flux</span>
                </div>
            </div>

            {/* Audit Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-[500px]">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-100">
                                <th className="pl-6 pr-4 py-5 text-[9px] font-black uppercase tracking-[0.25em] text-slate-400">Action Matrix</th>
                                <th className="px-4 py-5 text-[9px] font-black uppercase tracking-[0.25em] text-slate-400">Security Principal</th>
                                <th className="px-4 py-5 text-[9px] font-black uppercase tracking-[0.25em] text-slate-400">Sequence Origin</th>
                                <th className="px-6 py-5 text-[9px] font-black uppercase tracking-[0.25em] text-slate-400 text-right">Chronology</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan={5} className="py-12 text-center text-[10px] font-black uppercase text-slate-300 tracking-[0.4em] animate-pulse">De-encrypting Historical Ledger Flow...</td></tr>
                            ) : logs.length === 0 ? (
                                <tr><td colSpan={5} className="py-12 text-center text-[10px] font-black uppercase text-slate-300 tracking-[0.4em]">Historical Void: No Activity Detected</td></tr>
                            ) : logs.map((log) => (
                                <tr key={log.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-10 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center text-[#E61111] shadow-sm">
                                                <Zap size={14} />
                                            </div>
                                            <span className="text-xs font-black italic uppercase tracking-tight">{log.action.replace(/_/g, ' ')}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400 group-hover:bg-[#E61111] group-hover:text-white transition-all">
                                                {(log.performer_name || 'S')[0].toUpperCase()}
                                            </div>
                                            <span className="text-sm font-black italic tracking-tight">{log.performer_name || 'System Root'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 font-medium text-slate-500 text-[11px] max-w-xs truncate italic">
                                        {log.details}
                                    </td>
                                    <td className="px-6 py-6 font-black font-mono text-[9px] text-slate-300 uppercase tracking-widest">
                                        {log.ip_address || '0.0.0.0'}
                                    </td>
                                    <td className="px-10 py-6 text-right">
                                        <div className="flex flex-col items-end gap-0.5">
                                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                                <Clock size={10} className="text-slate-200" /> {new Date(log.created_at).toLocaleDateString()}
                                            </div>
                                            <div className="text-[8px] font-bold text-slate-300 uppercase tracking-[0.2em]">
                                                {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                            </div>
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
                        <option value="100">100 nodes</option>
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
