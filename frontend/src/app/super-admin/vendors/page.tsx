"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    MoreVertical,
    ExternalLink,
    ShieldCheck,
    ShieldAlert,
    Mail,
    Smartphone,
    MapPin,
    Building2,
    Users,
    Filter,
    ArrowUpRight,
    ChevronRight,
    MoreHorizontal,
    X,
    Save,
    User,
    Lock
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api";

export default function VendorsPage() {
    const searchParams = useSearchParams();
    const [vendors, setVendors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
    const [filterStatus, setFilterStatus] = useState("all"); // all, active, suspended
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [newVendor, setNewVendor] = useState({
        username: "",
        full_name: "",
        email: "",
        mobile: "",
        business_name: "",
        city: "",
        password: "Password123", // Default password
        role: "numerologist",
        plan_id: "",
        billing_cycle: "monthly"
    });
    const [allPlans, setAllPlans] = useState<any[]>([]);

    useEffect(() => {
        fetchVendors();
        fetchPlans();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filterStatus]);

    const fetchPlans = async () => {
        try {
            const resp = await api.get("/plans");
            if (resp.ok) setAllPlans(await resp.json());
        } catch (err) {
            console.error("Failed to fetch plans", err);
        }
    };

    const fetchVendors = () => {
        setLoading(true);
        api.get("/admin/vendors")
            .then(res => res.json())
            .then(data => setVendors(data))
            .finally(() => setLoading(false));
    };

    const handleStatusToggle = async (userId: number, currentStatus: string) => {
        const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
        try {
            const resp = await api.post(`/admin/vendors/${userId}/status`, { status: newStatus });
            if (resp.ok) fetchVendors();
        } catch (err) {
            console.error("Status update failed", err);
        }
    };

    const handleAddVendor = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const resp = await api.post("/admin/users", newVendor);
            if (resp.ok) {
                fetchVendors();
                setIsAddModalOpen(false);
                setNewVendor({
                    username: "",
                    full_name: "",
                    email: "",
                    mobile: "",
                    business_name: "",
                    city: "",
                    password: "Password123",
                    role: "numerologist",
                    plan_id: "",
                    billing_cycle: "monthly"
                });
            }
        } catch (err) {
            console.error("Failed to add vendor", err);
        } finally {
            setIsSaving(false);
        }
    };

    const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);

    const filteredVendors = Array.isArray(vendors) ? vendors.filter(v => {
        const matchesSearch = v.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            v.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            v.business_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            v.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            v.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            v.mobile?.includes(searchTerm);

        const matchesFilter = filterStatus === "all" ||
            (filterStatus === "active" && v.sub_status === "active") ||
            (filterStatus === "suspended" && v.sub_status !== "active");

        return matchesSearch && matchesFilter;
    }) : [];

    const handleSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedVendors = [...filteredVendors].sort((a, b) => {
        if (!sortConfig) return 0;
        const { key, direction } = sortConfig;

        let valA = a[key] || '';
        let valB = b[key] || '';

        if (key === 'client_count') {
            valA = parseInt(valA) || 0;
            valB = parseInt(valB) || 0;
        }

        if (valA < valB) return direction === 'asc' ? -1 : 1;
        if (valA > valB) return direction === 'asc' ? 1 : -1;
        return 0;
    });

    // Pagination logic (client-side for now)
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;
    const totalPages = Math.ceil(sortedVendors.length / pageSize);
    const paginatedVendors = sortedVendors.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    return (
        <div className="space-y-8">
            {/* Header Area */}
            <div className="flex items-center justify-between px-2">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900">Numerologists</h1>
                    <p className="text-sm font-medium text-slate-500">Manage Numerologists and platform membership access.</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm">
                        <Filter size={14} /> Refine Matrix
                    </button>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="px-5 py-2.5 bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#E61111] transition-all flex items-center gap-2 shadow-lg"
                    >
                        Add New Numerologist
                    </button>
                </div>
            </div>

            {/* Registry Search & Filters */}
            <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1 max-w-xl">
                    <div className="p-2 text-slate-400"><Search size={18} /></div>
                    <input
                        type="text"
                        placeholder="Search by name, professional entity, or email..."
                        className="bg-transparent w-full text-sm font-medium outline-none placeholder:text-slate-300"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex gap-4 text-[10px] font-black uppercase tracking-widest text-slate-300">
                        <span
                            onClick={() => setFilterStatus("all")}
                            className={`${filterStatus === 'all' ? 'text-black' : 'hover:text-black'} cursor-pointer transition-colors`}
                        >All Vendors</span>
                        <span
                            onClick={() => setFilterStatus("active")}
                            className={`${filterStatus === 'active' ? 'text-black' : 'hover:text-black'} cursor-pointer transition-colors`}
                        >Active Only</span>
                        <span
                            onClick={() => setFilterStatus("suspended")}
                            className={`${filterStatus === 'suspended' ? 'text-black' : 'hover:text-black'} cursor-pointer transition-colors`}
                        >Suspended</span>
                    </div>
                </div>
            </div>

            {/* Table Registry */}
            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden min-h-[500px]">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th onClick={() => handleSort('full_name')} className="px-10 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 cursor-pointer hover:text-black transition-colors">Numerologist</th>
                                <th onClick={() => handleSort('business_name')} className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 cursor-pointer hover:text-black transition-colors">Business Entity</th>
                                <th onClick={() => handleSort('plan_name')} className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 cursor-pointer hover:text-black transition-colors">Package Details</th>
                                <th onClick={() => handleSort('ends_at')} className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 cursor-pointer hover:text-black transition-colors">Date of Expiry</th>
                                <th onClick={() => handleSort('client_count')} className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center cursor-pointer hover:text-black transition-colors">Clients</th>
                                <th className="px-10 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Action Controls</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan={6} className="p-20 text-center text-[10px] font-black uppercase text-slate-300 tracking-[0.4em] animate-pulse">Initializing Ecosystem Scanner...</td></tr>
                            ) : paginatedVendors.length === 0 ? (
                                <tr><td colSpan={6} className="p-20 text-center text-[10px] font-black uppercase text-slate-300 tracking-[0.4em]">No Entities Detected in Search Flux</td></tr>
                            ) : paginatedVendors.map((vendor) => (
                                <tr key={vendor.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-10 py-6">
                                        <div className="flex items-center gap-4 group cursor-pointer" onClick={() => window.location.href = `/super-admin/vendors/${vendor.id}`}>
                                            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 font-black uppercase text-sm group-hover:bg-black group-hover:text-white transition-all shadow-sm">
                                                {vendor.full_name?.charAt(0) || vendor.username?.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="text-sm font-black italic tracking-tight flex items-center gap-2">
                                                    {vendor.full_name || vendor.username}
                                                </div>
                                                <div className="flex gap-3 mt-1.5 flex-wrap">
                                                    <div className="text-[10px] font-bold text-slate-400 lowercase flex items-center gap-1.5">
                                                        <Mail size={12} className="opacity-30" /> {vendor.email || 'N/A'}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <div className="space-y-1">
                                            <div className="text-[11px] font-black uppercase tracking-tight flex items-center gap-2 italic">
                                                <Building2 size={13} className="text-slate-300" /> {vendor.business_name || 'Individual'}
                                            </div>
                                            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                <MapPin size={10} className="text-slate-200" /> {vendor.city || 'Universal Space'}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <div className="flex flex-col gap-1">
                                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm w-fit ${vendor.sub_status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                                {vendor.plan_name || 'Starter Plan'}
                                            </div>
                                            <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest ml-1">{vendor.sub_status || 'Active'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 font-bold text-[11px] text-slate-900">
                                        {vendor.ends_at ? (
                                            <div className="flex flex-col gap-0.5">
                                                <span>{new Date(vendor.ends_at).toLocaleDateString()}</span>
                                                <span className="text-[8px] font-black uppercase tracking-widest text-slate-300 italic">Renewal Matrix</span>
                                            </div>
                                        ) : (
                                            <span className="text-slate-300">N/A</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-6 text-center">
                                        <div className="inline-flex flex-col items-center group cursor-pointer" onClick={() => window.location.href = `/super-admin/vendors/${vendor.id}`}>
                                            <div className="text-lg font-black tracking-tighter text-slate-600 group-hover:text-black">{vendor.client_count || 0}</div>
                                            <div className="text-[8px] font-black uppercase text-slate-300 tracking-[0.2em] group-hover:text-[#E61111]">Profiles</div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => window.location.href = `/super-admin/vendors/${vendor.id}?tab=registry`}
                                                className="px-4 py-2 bg-slate-50 border border-slate-100 text-slate-400 hover:text-black hover:border-black/20 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
                                            >
                                                Full Profile
                                            </button>
                                            <button
                                                onClick={() => window.location.href = `/super-admin/vendors/${vendor.id}?tab=registry`}
                                                className="px-4 py-2 bg-black text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-[#E61111] transition-all shadow-lg"
                                            >
                                                View Clients
                                            </button>
                                            <button
                                                onClick={() => handleStatusToggle(vendor.id, vendor.sub_status)}
                                                className={`p-2.5 rounded-xl transition-all border ${vendor.sub_status === 'active' ? 'border-red-50 text-red-200 hover:text-red-500 hover:bg-red-50' : 'border-green-50 text-green-200 hover:text-green-500 hover:bg-green-50'}`}
                                                title={vendor.sub_status === 'active' ? 'Suspend' : 'Restore'}
                                            >
                                                {vendor.sub_status === 'active' ? <X size={18} /> : <ShieldCheck size={18} />}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="px-4 py-2 flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
                <span>Showing {paginatedVendors.length} of {filteredVendors.length} active nodes in current viewport</span>
                <div className="flex gap-4">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        className="hover:text-black cursor-pointer disabled:opacity-20"
                    >
                        Previous Matrix
                    </button>
                    <span className="text-black">Page {currentPage} of {totalPages || 1}</span>
                    <button
                        disabled={currentPage === totalPages || totalPages === 0}
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        className="hover:text-black cursor-pointer disabled:opacity-20"
                    >
                        Next Matrix
                    </button>
                </div>
            </div>

            {/* Add Vendor Modal */}
            <AnimatePresence>
                {isAddModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                            onClick={() => setIsAddModalOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
                        >
                            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                <h2 className="text-xl font-black uppercase tracking-tight italic">Blueprint: Architect New Entity</h2>
                                <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-black/5 rounded-full"><X size={20} /></button>
                            </div>

                            <form onSubmit={handleAddVendor} className="p-8 space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Username (Key)</label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                                            <input
                                                type="text"
                                                required
                                                value={newVendor.username}
                                                onChange={e => setNewVendor({ ...newVendor, username: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 pl-10 pr-4 font-bold text-sm outline-none focus:border-black transition-all"
                                                placeholder="vendor_id"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Access Protocol (Password)</label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                                            <input
                                                type="password"
                                                required
                                                value={newVendor.password}
                                                onChange={e => setNewVendor({ ...newVendor, password: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 pl-10 pr-4 font-bold text-sm outline-none focus:border-black transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Legal Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={newVendor.full_name}
                                        onChange={e => setNewVendor({ ...newVendor, full_name: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 px-4 font-bold text-sm outline-none focus:border-black transition-all"
                                        placeholder="John Doe"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Communication Channel (Email)</label>
                                        <input
                                            type="email"
                                            required
                                            value={newVendor.email}
                                            onChange={e => setNewVendor({ ...newVendor, email: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 px-4 font-bold text-sm outline-none focus:border-black transition-all"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Mobile Link</label>
                                        <input
                                            type="text"
                                            value={newVendor.mobile}
                                            onChange={e => setNewVendor({ ...newVendor, mobile: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 px-4 font-bold text-sm outline-none focus:border-black transition-all"
                                            placeholder="+91 ..."
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Professional Entity</label>
                                        <input
                                            type="text"
                                            value={newVendor.business_name}
                                            onChange={e => setNewVendor({ ...newVendor, business_name: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 px-4 font-bold text-sm outline-none focus:border-black transition-all"
                                            placeholder="Business Name"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Base City</label>
                                        <input
                                            type="text"
                                            value={newVendor.city}
                                            onChange={e => setNewVendor({ ...newVendor, city: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 px-4 font-bold text-sm outline-none focus:border-black transition-all"
                                            placeholder="City"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Subscription Tier</label>
                                        <select
                                            value={newVendor.plan_id}
                                            onChange={e => setNewVendor({ ...newVendor, plan_id: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 px-4 font-bold text-sm outline-none focus:border-black transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="">Select Tier (Optional)</option>
                                            {allPlans.map(p => (
                                                <option key={p.id} value={p.id}>{p.name} - ₹{p.price_monthly}/mo</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Billing Protocol</label>
                                        <select
                                            value={newVendor.billing_cycle}
                                            onChange={e => setNewVendor({ ...newVendor, billing_cycle: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 px-4 font-bold text-sm outline-none focus:border-black transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="monthly">Monthly Cycle</option>
                                            <option value="yearly">Yearly Protocol</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="pt-4 flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsAddModalOpen(false)}
                                        className="flex-1 py-4 bg-slate-100 text-slate-400 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-200 transition-all"
                                    >
                                        Abort
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className="flex-2 px-10 py-4 bg-black text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:shadow-2xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        <Save size={16} /> {isSaving ? 'Synchronizing...' : 'Finalize Architect'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
