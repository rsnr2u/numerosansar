import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Zap, Clock, User, Info, Search, Filter,
    ShieldCheck, Activity, BarChart3, PieChart,
    Download, AlertTriangle, Eye, X, RefreshCw,
    TrendingUp, Users, Package, FileText, BrainCircuit,
    ChevronRight
} from "lucide-react";
import { api } from "@/lib/api";

export default function AnalysisDashboard() {
    const [analyses, setAnalyses] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [statsLoading, setStatsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(25);
    const [typeFilter, setTypeFilter] = useState("all");
    const [selectedDetail, setSelectedDetail] = useState<any>(null);
    const [detailLoading, setDetailLoading] = useState(false);

    useEffect(() => {
        fetchStats();
    }, []);

    useEffect(() => {
        fetchAnalyses();
    }, [currentPage, itemsPerPage, typeFilter, searchTerm]);

    const fetchStats = async () => {
        setStatsLoading(true);
        try {
            const res = await api.get('/admin/analyses/stats');
            const data = await res.json();
            setStats(data);
        } catch (err) {
            console.error("Stats fetch failed", err);
        } finally {
            setStatsLoading(false);
        }
    };

    const fetchAnalyses = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: currentPage.toString(),
                limit: itemsPerPage.toString(),
                type: typeFilter,
                search: searchTerm
            });
            const res = await api.get(`/admin/analyses?${params.toString()}`);
            const data = await res.json();
            setAnalyses(data.data || []);
            setTotalPages(data.pagination?.total_pages || 1);
        } catch (err) {
            console.error("Fetch analyses failed", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchDetail = async (id: number) => {
        setDetailLoading(true);
        try {
            const res = await api.get(`/admin/analyses/${id}`);
            const data = await res.json();
            setSelectedDetail(data);
        } catch (err) {
            console.error("Detail fetch failed", err);
        } finally {
            setDetailLoading(false);
        }
    };

    const typeBadges: any = {
        'Name': { color: 'bg-blue-50 text-blue-500 border-blue-100', icon: <User size={12} /> },
        'Business': { color: 'bg-purple-50 text-purple-500 border-purple-100', icon: <Package size={12} /> },
        'Mobile': { color: 'bg-orange-50 text-orange-500 border-orange-100', icon: <Activity size={12} /> },
        'Vehicle': { color: 'bg-emerald-50 text-emerald-500 border-emerald-100', icon: <Zap size={12} /> },
        'LoShu': { color: 'bg-amber-50 text-amber-500 border-amber-100', icon: <BrainCircuit size={12} /> }
    };

    return (
        <div className="space-y-6">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 leading-none mb-2">Client Analyses</h1>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Platform Usage Tracking & Credit Consumption Monitor</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => { fetchStats(); fetchAnalyses(); }}
                        className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-[#4B2E83] transition-all shadow-sm"
                    >
                        <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
                    </button>
                    <button className="flex items-center gap-2 px-6 py-3 bg-[#4B2E83] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:shadow-xl hover:shadow-purple-900/20 active:scale-95 transition-all">
                        <Download size={16} /> Export Usage Report
                    </button>
                </div>
            </div>

            {/* Platform activity Ribbon */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Total Analyses</p>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">{stats?.summary?.total_analyses?.toLocaleString() || '0'}</h2>
                    <div className="mt-2 flex items-center gap-1.5 text-[10px] font-black text-emerald-500">
                        <TrendingUp size={12} /> +12% vs last week
                    </div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Today's Activity</p>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">{stats?.summary?.today_analyses?.toLocaleString() || '0'}</h2>
                    <div className="mt-2 text-[10px] font-black text-slate-300 uppercase">Sequences Processed Today</div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Credits Consumed</p>
                    <h2 className="text-2xl font-black text-[#C9A227] tracking-tight">{stats?.summary?.today_credits?.toLocaleString() || '0'}</h2>
                    <div className="mt-2 text-[10px] font-black text-slate-300 uppercase">Calculated in 24h Window</div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Active Numerologists</p>
                    <h2 className="text-2xl font-black text-[#4B2E83] tracking-tight">{stats?.summary?.active_numerologists?.toLocaleString() || '0'}</h2>
                    <div className="mt-2 flex items-center gap-1.5 text-[10px] font-black text-[#C9A227]">
                        <Users size={12} /> Concurrent Processing
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Main Table Section */}
                <div className="lg:col-span-8 space-y-6">
                    {/* Filters */}
                    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#4B2E83] transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Search Client or Numerologist..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-50 rounded-xl text-xs font-black uppercase tracking-widest focus:outline-none focus:bg-white focus:border-[#4B2E83]/10 transition-all shadow-inner"
                            />
                        </div>
                        <select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            className="px-4 py-3 bg-slate-50 border border-slate-50 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 focus:outline-none"
                        >
                            <option value="all">Analysis Type: All</option>
                            <option value="Name">Name Analysis</option>
                            <option value="Business">Business Name</option>
                            <option value="Mobile">Mobile Number</option>
                            <option value="Vehicle">Vehicle Number</option>
                        </select>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden min-h-[600px]">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50/50 border-b border-slate-100">
                                        <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400">Date/Time</th>
                                        <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400">Numerologist</th>
                                        <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400">Client Entity</th>
                                        <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400">Analysis Type</th>
                                        <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400 text-center">Fuel</th>
                                        <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400 text-right">Inspect</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {loading ? (
                                        <tr><td colSpan={6} className="py-20 text-center text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 animate-pulse">Querying Platform Log Archive...</td></tr>
                                    ) : analyses.length === 0 ? (
                                        <tr><td colSpan={6} className="py-20 text-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">No Analysis Events Detected</td></tr>
                                    ) : analyses.map((item) => (
                                        <tr key={item.id} className="hover:bg-slate-50/30 transition-colors group">
                                            <td className="px-8 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-black text-slate-900">{new Date(item.created_at).toLocaleDateString('en-GB')}</span>
                                                    <span className="text-[8px] font-bold text-slate-300 uppercase tracking-widest">{new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-[11px] font-black text-slate-900 group-hover:text-[#4B2E83] transition-colors">{item.vendor_name || 'System'}</p>
                                                <p className="text-[8px] font-bold text-slate-300 uppercase tracking-widest">UID: {item.user_id}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-[11px] font-black text-slate-900 tracking-tight">{item.client_name || 'Unknown'}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-tight border ${typeBadges[item.check_type]?.color || 'bg-slate-50'}`}>
                                                    {typeBadges[item.check_type]?.icon}
                                                    {item.check_type} Analysis
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="text-[10px] font-black text-[#4B2E83]">-1 CR</span>
                                            </td>
                                            <td className="px-8 py-4 text-right">
                                                <button
                                                    onClick={() => fetchDetail(item.id)}
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

                        {/* Pagination */}
                        <div className="p-6 border-t border-slate-50 flex items-center justify-between">
                            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-300">Displaying Archive: {currentPage} / {totalPages}</p>
                            <div className="flex gap-2">
                                <button
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    className="px-6 py-2.5 bg-slate-50 text-[9px] font-black uppercase tracking-widest text-slate-400 rounded-xl hover:bg-[#4B2E83] hover:text-white transition-all disabled:opacity-30 shadow-sm"
                                >
                                    Previous
                                </button>
                                <button
                                    disabled={currentPage === totalPages}
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    className="px-6 py-2.5 bg-[#4B2E83] text-white text-[9px] font-black uppercase tracking-widest rounded-xl hover:shadow-lg transition-all disabled:opacity-30 shadow-md"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Section */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Insights Chart Placeholder Card */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-900 leading-none">Usage Distribution</h3>
                            <BarChart3 size={18} className="text-[#C9A227]" />
                        </div>
                        <div className="space-y-4">
                            {stats?.distribution?.map((d: any, i: number) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex justify-between text-[9px] font-black uppercase tracking-widest">
                                        <span className="text-slate-400">{d.type}</span>
                                        <span className="text-slate-900">{d.count}</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${Math.min(100, (d.count / (stats.summary.total_analyses || 1)) * 100 * 5)}%` }} // Scaled for visibility
                                            className="h-full bg-[#4B2E83] rounded-full"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-8 pt-6 border-t border-slate-50">
                            <p className="text-[8px] font-bold text-slate-400 leading-relaxed italic uppercase tracking-widest">The "Name Analysis" protocol remains the primary consumption vector across the matrix.</p>
                        </div>
                    </div>

                    {/* Suspicious Alert Hub */}
                    <div className="bg-slate-900 p-6 rounded-2xl shadow-xl relative overflow-hidden">
                        <div className="flex items-center gap-3 mb-6 relative z-10">
                            <div className="p-2 bg-red-500/20 text-red-500 rounded-lg">
                                <AlertTriangle size={18} />
                            </div>
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white">High Usage Watchlist</h3>
                        </div>
                        <div className="space-y-3 relative z-10">
                            {stats?.high_usage?.length > 0 ? stats.high_usage.map((u: any, i: number) => (
                                <div key={i} className="p-4 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between group hover:bg-white/10 transition-all cursor-default">
                                    <div>
                                        <p className="text-xs font-black text-white">{u.numerologist}</p>
                                        <p className="text-[8px] font-black uppercase tracking-widest text-[#C9A227] mt-0.5">{u.count} Analyses Today</p>
                                    </div>
                                    <ChevronRight size={14} className="text-white/20 group-hover:translate-x-1 transition-transform" />
                                </div>
                            )) : (
                                <div className="py-6 text-center text-[9px] font-black uppercase text-white/20 tracking-widest italic">All usage signatures within normal range.</div>
                            )}
                        </div>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                    </div>
                </div>
            </div>

            {/* Analysis Result Modal */}
            <AnimatePresence>
                {selectedDetail && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#4B2E83]/60 backdrop-blur-md"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }}
                            className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col"
                        >
                            <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center relative">
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 rounded-2xl bg-[#4B2E83] text-[#C9A227] flex items-center justify-center shadow-lg">
                                        <BrainCircuit size={28} />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black tracking-tighter text-slate-900 leading-none uppercase mb-2">Analysis Intelligence</h3>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-[#C9A227]">Protocol: {selectedDetail.usage.check_type} Verification</p>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedDetail(null)} className="p-2.5 bg-white border border-slate-100 rounded-xl text-slate-300 hover:text-red-500 transition-all shadow-md">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-8 grid grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div>
                                        <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-2">Subject Signature</p>
                                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                            <p className="text-sm font-black text-slate-900 leading-none mb-1">{selectedDetail.client.full_name}</p>
                                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 italic">Origin: {new Date(selectedDetail.client.date_of_birth).toLocaleDateString('en-IN')}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-2">Result Vectors</p>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="p-4 bg-[#4B2E83]/5 rounded-xl border border-[#4B2E83]/10 text-center">
                                                <p className="text-[7px] font-black uppercase text-[#4B2E83]/50 mb-1">Driver</p>
                                                <p className="text-xl font-black text-[#4B2E83]">{selectedDetail.result.driver_number || 'N/A'}</p>
                                            </div>
                                            <div className="p-4 bg-[#C9A227]/5 rounded-xl border border-[#C9A227]/10 text-center">
                                                <p className="text-[7px] font-black uppercase text-[#C9A227]/50 mb-1">Conductor</p>
                                                <p className="text-xl font-black text-[#C9A227]">{selectedDetail.result.conductor_number || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-2">Analytical Entity</p>
                                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                            <p className="text-[10px] font-black text-slate-700 uppercase tracking-tight mb-0.5">{selectedDetail.vendor.full_name}</p>
                                            <p className="text-[8px] font-bold text-[#4B2E83] uppercase tracking-widest">@{selectedDetail.vendor.username}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-2">Metadata Flux</p>
                                        <div className="p-4 bg-slate-900 rounded-xl space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-[7px] font-black text-white/30 uppercase tracking-widest">Target String</span>
                                                <span className="text-[10px] font-black text-white uppercase">{selectedDetail.result.name_value || selectedDetail.result.mobile_number || 'ENC_DATA'}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-[7px] font-black text-white/30 uppercase tracking-widest">Epoch Stamp</span>
                                                <span className="text-[10px] font-black text-white/70 uppercase">{new Date(selectedDetail.usage.created_at).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex justify-end">
                                <button
                                    onClick={() => setSelectedDetail(null)}
                                    className="px-8 py-2.5 bg-[#4B2E83] text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-xl shadow-purple-900/10 hover:scale-105 active:scale-95 transition-all"
                                >
                                    Close Intelligence
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
