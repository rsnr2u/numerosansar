import { useState, useEffect } from "react";
import {
    Plus, Search, User, Phone, Mail, MapPin,
    Trash2, Edit, ChevronRight, Users, UserPlus,
    Filter, MoreVertical, ExternalLink, ChevronLeft,
    ChevronsLeft, ChevronsRight, ArrowUpDown
} from "lucide-react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";

export default function ClientsPage() {
    const navigate = useNavigate();
    const [clients, setClients] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
    const [serverStats, setServerStats] = useState({ active_today: 0, success_rate: "0%" });

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setCurrentPage(1); // Reset to first page on new search
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    useEffect(() => {
        fetchClients();
    }, [debouncedSearch, currentPage, perPage]);

    const fetchClients = async () => {
        setLoading(true);
        try {
            const res = await api.get("/admin/clients", {
                params: {
                    search: debouncedSearch || "",
                    page: String(currentPage),
                    per_page: String(perPage),
                    paginate: "true"
                }
            });
            const result = await res.json();
            if (res.ok) {
                // Backend returns { data: [], total: 0, ... }
                setClients(Array.isArray(result.data) ? result.data : []);
                setTotalRecords(result.total || 0);
                setServerStats(result.stats || { active_today: 0, success_rate: "0%" });
            }
        } catch (err) {
            console.error("Failed to fetch clients", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this client?")) return;

        try {
            const res = await api.delete(`/admin/clients/${id}`);
            if (res.ok) {
                fetchClients();
            }
        } catch (err) {
            console.error("Delete failed", err);
        }
    };

    const totalPages = Math.ceil(totalRecords / perPage);

    const stats = [
        { label: "Total Clients", value: totalRecords, icon: <Users size={20} className="text-white" />, color: "bg-blue-600" },
        { label: "Active Today", value: serverStats.active_today, icon: <UserPlus size={20} className="text-white" />, color: "bg-emerald-600" },
        { label: "Success Rate", value: serverStats.success_rate, icon: <ExternalLink size={20} className="text-white" />, color: "bg-amber-500" },
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-4xl font-black text-[#3F1000] tracking-tight mb-2">
                        Client Management
                    </h1>
                    <p className="text-sm text-[#64748b] font-medium max-w-md leading-relaxed">
                        Access and manage your client base
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <Link to="/admin/clients/add">
                        <button className="relative group overflow-hidden bg-[#fd8c01] text-[#3F1000] px-8 py-4 rounded-2xl font-black transition-all shadow-2xl shadow-[#fd8c01]/30 hover:shadow-[#fd8c01]/50 active:scale-95 flex items-center gap-3">
                            <Plus size={20} className="relative z-10" />
                            <span className="relative z-10 uppercase tracking-[0.15em] text-[11px]">Add New Client</span>
                            <div className="absolute inset-0 bg-[#3F1000] opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                        </button>
                    </Link>
                </motion.div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {stats.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                        className="bg-white p-4 rounded-2xl border border-black/5 shadow-xl shadow-black/[0.02] flex items-center gap-4 group hover:border-[#fd8c01]/20 transition-all cursor-default"
                    >
                        <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                            {stat.icon}
                        </div>
                        <div>
                            <p className="text-[9px] font-black uppercase tracking-widest text-[#94a3b8] mb-0.5">{stat.label}</p>
                            <p className="text-xl font-black text-[#3F1000]">{stat.value}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Search & Filters & Pagination Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="flex flex-col md:flex-row gap-4 items-center"
            >
                <div className="flex-1 w-full bg-white p-1.5 rounded-2xl border border-black/50 flex items-center gap-2 focus-within:ring-2 focus-within:ring-[#fd8c01]/20 transition-all">
                    <div className="w-10 h-10 flex items-center justify-center text-[#94a3b8]">
                        <Search size={20} strokeWidth={2.5} />
                    </div>
                    <input
                        type="text"
                        placeholder="Search for clients by name, mobile, or email..."
                        className="bg-transparent text-[#3F1000] w-full focus:outline-none placeholder:text-[#94a3b8] text-sm font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-black/5 shadow-sm">
                        <span className="text-[10px] font-black uppercase text-[#94a3b8]">Show</span>
                        <select
                            value={perPage}
                            onChange={(e) => {
                                setPerPage(Number(e.target.value));
                                setCurrentPage(1);
                            }}
                            className="text-xs font-black text-[#3F1000] bg-transparent outline-none cursor-pointer"
                        >
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                    </div>

                    <button className="bg-white px-5 py-2.5 rounded-2xl border border-black/5 text-[#64748b] hover:text-[#3F1000] transition-all flex items-center gap-2 font-bold text-[10px] uppercase tracking-widest shadow-xl">
                        <Filter size={16} />
                        Filters
                    </button>
                </div>
            </motion.div>

            {/* Client Table */}
            <div className="bg-white rounded-2xl border border-black/5 shadow-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#f8fafc] border-b border-black/5">
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-[#94a3b8]">
                                    <div className="flex items-center gap-2">
                                        Client Info <ArrowUpDown size={12} />
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-[#94a3b8]">Contact Details</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-[#94a3b8]">Location</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-[#94a3b8]">Added By</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-[#94a3b8]">Member Status</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-[#94a3b8] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-black/5">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={6} className="px-6 py-6">
                                            <div className="h-4 bg-[#f1f5f9] rounded-full w-full"></div>
                                        </td>
                                    </tr>
                                ))
                            ) : clients.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-20 text-center">
                                        <div className="max-w-xs mx-auto">
                                            <p className="text-sm font-black text-[#3F1000] uppercase mb-1">No Records Found</p>
                                            <p className="text-xs text-[#94a3b8]">Try adjusting your search or filters.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                clients.map((client) => (
                                    <tr key={client.id} className="group hover:bg-[#f8fafc] transition-colors cursor-pointer" onClick={() => navigate(`/admin/clients/${client.id}`)}>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div>
                                                    <p className="text-sm font-bold text-black leading-none mb-1 group-hover:text-[#fd8c01] transition-colors">{client.full_name}</p>
                                                    <p className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-wider">{client.calling_name || "Private Profile"}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-xs text-[#64748b]">
                                                    <Phone size={12} className="text-[#94a3b8]" />
                                                    <span className="font-bold">{client.mobile_number || "—"}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-[#64748b]">
                                                    <Mail size={12} className="text-[#94a3b8]" />
                                                    <span className="font-bold truncate max-w-[150px]">{client.email_id || "—"}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-xs text-[#64748b] font-bold">
                                                <MapPin size={12} className="text-[#94a3b8]" />
                                                {client.city ? `${client.city}, ${client.state}` : "—"}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-xs text-[#64748b] font-bold">
                                                <User size={12} className="text-[#94a3b8]" />
                                                {client.added_by_name || "—"}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-wider rounded-lg border border-emerald-100">
                                                Active
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                                                <button
                                                    onClick={() => navigate(`/admin/clients/${client.id}`)}
                                                    className="p-2 text-[#94a3b8] hover:text-[#fd8c01] hover:bg-white rounded-lg transition-all shadow-sm"
                                                >
                                                    <ChevronRight size={18} strokeWidth={3} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(client.id)}
                                                    className="p-2 text-[#94a3b8] hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                <div className="bg-[#f8fafc] px-6 py-4 border-t border-black/5 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-[10px] font-black uppercase text-[#94a3b8] tracking-widest">
                        Showing {clients.length} of {totalRecords} records
                    </p>

                    <div className="flex items-center gap-1">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(1)}
                            className="p-2 rounded-xl bg-white border border-black/5 text-[#3F1000] disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-lg transition-all"
                        >
                            <ChevronsLeft size={16} strokeWidth={3} />
                        </button>
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => prev - 1)}
                            className="p-2 rounded-xl bg-white border border-black/5 text-[#3F1000] disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-lg transition-all"
                        >
                            <ChevronLeft size={16} strokeWidth={3} />
                        </button>

                        <div className="flex items-center gap-1 px-4">
                            <span className="text-xs font-black text-[#3F1000]">{currentPage}</span>
                            <span className="text-xs font-black text-[#94a3b8]">/</span>
                            <span className="text-xs font-black text-[#94a3b8]">{totalPages || 1}</span>
                        </div>

                        <button
                            disabled={currentPage === totalPages || totalPages === 0}
                            onClick={() => setCurrentPage(prev => prev + 1)}
                            className="p-2 rounded-xl bg-white border border-black/5 text-[#3F1000] disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-lg transition-all"
                        >
                            <ChevronRight size={16} strokeWidth={3} />
                        </button>
                        <button
                            disabled={currentPage === totalPages || totalPages === 0}
                            onClick={() => setCurrentPage(totalPages)}
                            className="p-2 rounded-xl bg-white border border-black/5 text-[#3F1000] disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-lg transition-all"
                        >
                            <ChevronsRight size={16} strokeWidth={3} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
