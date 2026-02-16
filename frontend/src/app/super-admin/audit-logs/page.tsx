"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, Clock, User, Info, Search, Filter, ShieldCheck, Zap, Activity } from "lucide-react";
import { api } from "@/lib/api";

export default function AuditLogPage() {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        api.get("/admin/audit-logs")
            .then(res => res.json())
            .then(data => setLogs(data))
            .finally(() => setLoading(false));
    }, []);

    const filteredLogs = logs.filter(log =>
        log.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.performer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            {/* Header Area */}
            <div className="flex items-center justify-between px-2">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900">Security Audit</h1>
                    <p className="text-sm font-medium text-slate-500">Immutable platform governance and historical activity ledger.</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm">
                        <Filter size={14} /> Filter Logic
                    </button>
                    <button className="px-5 py-2.5 bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#E61111] transition-all flex items-center gap-2 shadow-lg">
                        <Activity size={14} /> Live Monitor
                    </button>
                </div>
            </div>

            {/* Matrix Filter */}
            <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex items-center justify-between">
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
            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden min-h-[500px]">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-10 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Governance Action</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Actor Entity</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Activity Details</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">IP Node</th>
                                <th className="px-10 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Sequence Time</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan={5} className="p-20 text-center text-[10px] font-black uppercase text-slate-300 tracking-[0.4em] animate-pulse">De-encrypting Historical Ledger Flow...</td></tr>
                            ) : filteredLogs.length === 0 ? (
                                <tr><td colSpan={5} className="p-20 text-center text-[10px] font-black uppercase text-slate-300 tracking-[0.4em]">Historical Void: No Activity Detected</td></tr>
                            ) : filteredLogs.map((log) => (
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
        </div>
    );
}
