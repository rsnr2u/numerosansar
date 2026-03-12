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
    ChevronDown,
    MoreHorizontal,
    X,
    Save,
    User,
    Lock,
    Plus,
    Calendar,
    Wallet,
    DollarSign,
    TrendingUp,
    Clock,
    Download,
    CheckSquare,
    Square,
    ChevronRight,
    AlertCircle,
    UserPlus,
    CreditCard,
    LayoutGrid,
    Users as UsersIcon,
    ArrowDownToLine,
    ChevronLeft
} from "lucide-react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { api } from "@/lib/api";

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(amount);
};

const formatTimeAgo = (dateString: string | null) => {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
};

export default function VendorsPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [vendors, setVendors] = useState<any[]>([]);
    const [stats, setStats] = useState<any>({
        total_numerologists: 0,
        active_users: 0,
        low_credit_users: 0,
        monthly_revenue: 0
    });
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
    const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
    const [filterStatus, setFilterStatus] = useState("all");
    const [filterPackage, setFilterPackage] = useState("all");
    const [filterCredits, setFilterCredits] = useState("all"); // all, low, high
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(25);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
    const [allPlans, setAllPlans] = useState<any[]>([]);

    const [newVendor, setNewVendor] = useState({
        username: "",
        full_name: "",
        email: "",
        mobile: "",
        business_name: "",
        city: "",
        password: "Password123",
        role: "numerologist",
        plan_id: "",
        billing_cycle: "monthly",
        initial_bonus_credits: 0
    });

    const [filters, setFilters] = useState({
        city: "",
        month: "",
        year: "",
        start_date: "",
        end_date: ""
    });
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setCurrentPage(1);
        }, 500);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    useEffect(() => {
        fetchVendors();
        fetchPlans();
    }, [filterStatus, filterPackage, filterCredits, filters, debouncedSearch, currentPage, itemsPerPage]);

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
        const params = new URLSearchParams();
        if (filters.city) params.append('city', filters.city);
        if (filters.month) params.append('month', filters.month);
        if (filters.year) params.append('year', filters.year);
        if (filters.start_date) params.append('start_date', filters.start_date);
        if (filters.end_date) params.append('end_date', filters.end_date);
        if (filterStatus !== 'all') params.append('status', filterStatus);
        if (filterPackage !== 'all') params.append('package', filterPackage);
        if (filterCredits !== 'all') params.append('credits_level', filterCredits);
        if (debouncedSearch) params.append('search', debouncedSearch);
        params.append('page', currentPage.toString());
        params.append('limit', itemsPerPage.toString());

        api.get(`/admin/vendors?${params.toString()}`)
            .then(res => res.json())
            .then(resData => {
                if (resData && resData.data) {
                    setVendors(resData.data);
                    setStats(resData.stats || stats);
                    setTotalPages(resData.pagination.total_pages || 1);
                }
            })
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
                    billing_cycle: "monthly",
                    initial_bonus_credits: 0
                });
            }
        } catch (err) {
            console.error("Failed to add vendor", err);
        } finally {
            setIsSaving(false);
        }
    };

    const handleBulkStatus = async (status: string) => {
        if (selectedUsers.length === 0) return;
        if (!confirm(`Are you sure you want to set status to ${status} for ${selectedUsers.length} users?`)) return;

        try {
            const resp = await api.post("/admin/vendors/bulk-status", {
                user_ids: selectedUsers,
                status: status
            });
            if (resp.ok) {
                fetchVendors();
                setSelectedUsers([]);
            }
        } catch (err) {
            console.error("Bulk status update failed", err);
        }
    };

    const handleBulkAddCredits = () => {
        // Placeholder for future credit management integration
        alert("Credit management module will open for " + selectedUsers.length + " users.");
    };

    const toggleSelectAll = () => {
        if (selectedUsers.length === vendors.length) {
            setSelectedUsers([]);
        } else {
            setSelectedUsers(vendors.map(v => v.id));
        }
    };

    const toggleSelectUser = (id: number) => {
        if (selectedUsers.includes(id)) {
            setSelectedUsers(selectedUsers.filter(uid => uid !== id));
        } else {
            setSelectedUsers([...selectedUsers, id]);
        }
    };

    const exportToCSV = () => {
        const headers = ["ID", "Name", "Email", "Business", "Package", "Credits Remaining", "Clients", "Credits Used", "Revenue", "Status", "Activity"];
        const rows = vendors.map(v => [
            v.id,
            v.full_name || v.username,
            v.email,
            v.business_name || "Individual",
            v.plan_name || "N/A",
            v.credits_remaining || 0,
            v.client_count || 0,
            v.credits_used || 0,
            v.total_revenue || 0,
            v.account_status,
            v.last_activity
        ]);

        const csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `numerologists_registry_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const overviewStats = [
        { label: "Total Numerologists", val: stats.total_numerologists, icon: <UsersIcon size={20} />, color: "bg-blue-500/10 text-blue-600" },
        { label: "Active Nodes", val: stats.active_users, icon: <ShieldCheck size={20} />, color: "bg-emerald-500/10 text-emerald-600" },
        { label: "Low Credit Alerts", val: stats.low_credit_users, icon: <AlertCircle size={20} />, color: "bg-red-500/10 text-red-600" },
        { label: "Revenue (Month)", val: formatCurrency(stats.monthly_revenue), icon: <TrendingUp size={20} />, color: "bg-[#C9A227]/10 text-[#C9A227]" },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 leading-none uppercase">Numerologist Registry</h1>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mt-2">Centralized Command & Identity Ledger</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={exportToCSV}
                        className="flex items-center gap-3 px-6 py-4 bg-white border border-slate-200 text-slate-600 rounded-xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-slate-50 transition-all shadow-sm"
                    >
                        <ArrowDownToLine size={16} /> Export CSV
                    </button>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center gap-3 px-8 py-4 bg-[#4B2E83] text-white rounded-xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-[#5D3AB0] shadow-xl shadow-purple-900/20 active:scale-95 transition-all"
                    >
                        <UserPlus size={16} className="text-[#C9A227]" /> Architect New Entity
                    </button>
                </div>
            </div>

            {/* Quick Stats Summary */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {overviewStats.map((s, i) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={i}
                        className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-all group"
                    >
                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${s.color}`}>
                            {s.icon}
                        </div>
                        <div>
                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5">{s.label}</p>
                            <h3 className="text-2xl font-black text-slate-900 leading-none">{s.val}</h3>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Controls Bar */}
            <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xl shadow-slate-200/40 space-y-4">
                <div className="flex flex-col xl:flex-row items-center justify-between gap-5">
                    {/* Search Expansion */}
                    <div className="relative group w-full xl:max-w-xl">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#4B2E83] transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Search by name, email, business, or phone link..."
                            className="w-full bg-slate-50/50 border border-slate-100 pl-14 pr-6 py-4 rounded-xl text-sm font-bold outline-none focus:bg-white focus:border-[#4B2E83]/30 focus:ring-8 focus:ring-[#4B2E83]/5 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="bg-slate-50 border border-slate-100 px-5 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 outline-none hover:bg-slate-100 transition-all cursor-pointer"
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active Nodes</option>
                            <option value="suspended">Suspended</option>
                            <option value="blocked">Blocked</option>
                        </select>

                        <select
                            value={filterPackage}
                            onChange={(e) => setFilterPackage(e.target.value)}
                            className="bg-slate-50 border border-slate-100 px-5 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 outline-none hover:bg-slate-100 transition-all cursor-pointer"
                        >
                            <option value="all">All Packages</option>
                            {allPlans.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>

                        <select
                            value={filterCredits}
                            onChange={(e) => setFilterCredits(e.target.value)}
                            className="bg-slate-50 border border-slate-100 px-5 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 outline-none hover:bg-slate-100 transition-all cursor-pointer"
                        >
                            <option value="all">Credit levels</option>
                            <option value="low">Low Credits (&lt;5)</option>
                            <option value="out">Out of Credits</option>
                        </select>

                        <div className="h-8 w-[1px] bg-slate-100 mx-1 hidden lg:block"></div>

                        <button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className={`flex items-center gap-3 px-6 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isFilterOpen ? 'bg-[#4B2E83] text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                        >
                            <Filter size={14} /> Advanced
                        </button>
                    </div>
                </div>

                <AnimatePresence>
                    {isFilterOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="bg-slate-50/50 rounded-xl border border-slate-100 overflow-hidden"
                        >
                            <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2"><MapPin size={10} /> Base City</label>
                                    <input
                                        type="text"
                                        placeholder="Mumbai, Bengaluru..."
                                        className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 font-bold text-xs outline-none focus:border-[#4B2E83]/30 transition-all"
                                        value={filters.city}
                                        onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2"><Calendar size={10} /> Date Range Start</label>
                                    <input
                                        type="date"
                                        className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 font-bold text-xs outline-none focus:border-[#4B2E83]/30 transition-all"
                                        value={filters.start_date}
                                        onChange={(e) => setFilters({ ...filters, start_date: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2"><Calendar size={10} /> Date Range End</label>
                                    <input
                                        type="date"
                                        className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 font-bold text-xs outline-none focus:border-[#4B2E83]/30 transition-all"
                                        value={filters.end_date}
                                        onChange={(e) => setFilters({ ...filters, end_date: e.target.value })}
                                    />
                                </div>
                                <div className="flex items-end">
                                    <button
                                        onClick={() => setFilters({ city: "", month: "", year: "", start_date: "", end_date: "" })}
                                        className="w-full py-3.5 bg-slate-200 text-slate-600 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-red-50 hover:text-red-500 transition-all"
                                    >
                                        Clear Parameters
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Bulk Action Bar */}
            <AnimatePresence>
                {selectedUsers.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="bg-[#4B2E83] text-white p-4 px-8 rounded-xl flex items-center justify-between shadow-2xl shadow-purple-900/40 relative z-10 mx-4"
                    >
                        <div className="flex items-center gap-4">
                            <span className="w-8 h-8 rounded-lg bg-[#C9A227] text-[#4B2E83] flex items-center justify-center font-black text-xs">{selectedUsers.length}</span>
                            <span className="text-[10px] font-black uppercase tracking-widest">Entities Selected for Bulk Migration</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <button onClick={handleBulkAddCredits} className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all">Add Credits</button>
                            <button onClick={() => handleBulkStatus('suspended')} className="px-4 py-2 bg-red-500/20 hover:bg-red-500 text-red-100 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all">Suspend Accounts</button>
                            <button onClick={() => setSelectedUsers([])} className="p-2 text-white/40 hover:text-white transition-all"><X size={16} /></button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Registry Table */}
            <div className={`bg-white rounded-xl border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden transition-all ${selectedUsers.length > 0 ? '-mt-6' : ''}`}>
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-6 py-5 w-[40px]">
                                    <button onClick={toggleSelectAll} className="text-slate-300 hover:text-[#4B2E83] transition-all">
                                        {selectedUsers.length === vendors.length && vendors.length > 0 ? <CheckSquare size={20} className="text-[#4B2E83]" /> : <Square size={20} />}
                                    </button>
                                </th>
                                <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400">Professional Identity</th>
                                <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400">Business Entity</th>
                                <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400">Package Tier</th>
                                <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400 text-center">Remaining CR</th>
                                <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400 text-center">Clients</th>
                                <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400 text-center">Revenue</th>
                                <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400">Recent Activity</th>
                                <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400">Status</th>
                                <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr><td colSpan={10} className="py-24 text-center text-[10px] font-black uppercase text-slate-300 tracking-[0.4em] animate-pulse">Scanning Platform Matrix...</td></tr>
                            ) : vendors.length === 0 ? (
                                <tr><td colSpan={10} className="py-24 text-center flex flex-col items-center gap-4">
                                    <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-200"><Search size={32} /></div>
                                    <div className="text-[10px] font-black uppercase text-slate-300 tracking-[0.2em]">Zero Records found in this flux sector</div>
                                </td></tr>
                            ) : vendors.map((vendor) => {
                                const isLowCredit = (vendor.credits_remaining || 0) < 5;
                                const isSelected = selectedUsers.includes(vendor.id);
                                return (
                                    <tr key={vendor.id} className={`hover:bg-slate-50 transition-all group ${isSelected ? 'bg-[#4B2E83]/5' : ''}`}>
                                        <td className="px-6 py-5">
                                            <button onClick={() => toggleSelectUser(vendor.id)} className={`${isSelected ? 'text-[#4B2E83]' : 'text-slate-200 group-hover:text-slate-400'} transition-all`}>
                                                {isSelected ? <CheckSquare size={18} /> : <Square size={18} />}
                                            </button>
                                        </td>
                                        <td className="px-6 py-5">
                                            <Link to={`/super-admin/vendors/${vendor.id}`} className="flex items-center gap-4 group/p">
                                                <div className="w-11 h-11 rounded-lg bg-[#4B2E83]/5 text-[#4B2E83] flex items-center justify-center font-black uppercase text-sm group-hover/p:bg-[#4B2E83] group-hover/p:text-white transition-all shadow-sm">
                                                    {vendor.full_name?.charAt(0) || vendor.username?.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-black tracking-tight text-slate-900 group-hover/p:text-[#4B2E83] transition-colors">{vendor.full_name || vendor.username}</div>
                                                    <div className="text-[10px] font-bold text-slate-400 lowercase truncate max-w-[150px]">{vendor.email}</div>
                                                </div>
                                            </Link>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="text-[11px] font-black uppercase tracking-tight text-slate-700">{vendor.business_name || 'Individual'}</div>
                                            <div className="text-[9px] font-bold text-slate-400 flex items-center gap-1.5 mt-0.5"><MapPin size={10} className="opacity-40" /> {vendor.city || 'Universal'}</div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[10px] font-black text-slate-900 uppercase">{vendor.plan_name || 'Free Trial'}</span>
                                                <div className="flex items-center gap-4">
                                                    <div className="flex-1 h-1 bg-slate-100 rounded-full w-20 overflow-hidden">
                                                        <div className="h-full bg-[#4B2E83]" style={{ width: `${Math.min(100, (vendor.credits_used / ((vendor.credits_remaining || 0) + (vendor.credits_used || 0))) * 100)}%` }} />
                                                    </div>
                                                    <span className="text-[8px] font-black text-slate-300 uppercase">{vendor.credits_used || 0} Used</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <span className={`px-4 py-1.5 rounded-xl text-[11px] font-black tracking-tighter shadow-sm border ${isLowCredit ? 'bg-red-50 text-red-600 border-red-100 animate-pulse' : 'bg-slate-50 text-slate-600 border-slate-100'}`}>
                                                {vendor.credits_remaining || 0}
                                                {isLowCredit && <span className="ml-2 text-[8px] font-black text-red-400">CRITICAL</span>}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <div className="text-sm font-black text-slate-700">{vendor.client_count || 0}</div>
                                            <div className="text-[8px] font-black text-slate-300 uppercase tracking-widest mt-0.5">Profiles</div>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <div className="text-sm font-black text-slate-900 uppercase">₹{parseInt(vendor.total_revenue || 0).toLocaleString()}</div>
                                            <div className="text-[8px] font-black text-[#C9A227] uppercase tracking-widest mt-0.5">Value</div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2 text-slate-600">
                                                <Clock size={12} className="opacity-30" />
                                                <span className="text-[10px] font-black uppercase tracking-tight">{formatTimeAgo(vendor.last_activity)}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest border ${vendor.account_status === 'active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${vendor.account_status === 'active' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-red-500'}`} />
                                                {vendor.account_status}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button title="Rapid Profile" onClick={() => navigate(`/super-admin/vendors/${vendor.id}`)} className="p-2.5 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-[#4B2E83] hover:border-[#4B2E83]/30 hover:shadow-lg transition-all"><ExternalLink size={16} /></button>
                                                <button title="Quick Credits" onClick={() => navigate(`/super-admin/credits?user=${vendor.id}`)} className="p-2.5 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-amber-500 hover:border-amber-200 hover:shadow-lg transition-all"><Wallet size={16} /></button>
                                                <button title="Account Status" onClick={() => handleStatusToggle(vendor.id, vendor.account_status)} className="p-2.5 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-red-500 hover:border-red-200 hover:shadow-lg transition-all"><ShieldAlert size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Footer Controls */}
                <div className="bg-slate-50/50 p-6 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-slate-100">
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-3">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Show per page:</span>
                            <select
                                value={itemsPerPage}
                                onChange={(e) => { setItemsPerPage(parseInt(e.target.value)); setCurrentPage(1); }}
                                className="bg-white border border-slate-200 rounded-xl px-4 py-2 font-black text-[10px] outline-none hover:border-[#4B2E83]/30 cursor-pointer shadow-sm transition-all"
                            >
                                <option value="10">10 Nodes</option>
                                <option value="25">25 Nodes</option>
                                <option value="50">50 Nodes</option>
                                <option value="100">100 Nodes</option>
                            </select>
                        </div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Catalog Intensity: {vendors.length} of {stats.total_numerologists} Professional Entities</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            className="p-4 bg-white border border-slate-200 rounded-xl text-[#4B2E83] disabled:opacity-30 hover:shadow-lg transition-all disabled:hover:shadow-none"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <div className="flex gap-2">
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`w-11 h-11 rounded-xl font-black text-xs transition-all ${currentPage === i + 1 ? 'bg-[#4B2E83] text-white shadow-xl shadow-purple-900/20' : 'bg-white border border-slate-100 text-slate-400 hover:bg-slate-50'}`}
                                >
                                    {i + 1}
                                </button>
                            )).slice(Math.max(0, currentPage - 2), Math.min(totalPages, currentPage + 1))}
                        </div>
                        <button
                            disabled={currentPage === totalPages || totalPages === 0}
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            className="p-4 bg-white border border-slate-200 rounded-xl text-[#4B2E83] disabled:opacity-30 hover:shadow-lg transition-all disabled:hover:shadow-none"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Registration Modal - Maintaining for basic functionality, refined for density */}
            <AnimatePresence>
                {isAddModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsAddModalOpen(false)} />
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                                <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 rounded-xl bg-[#4B2E83] flex items-center justify-center text-[#C9A227] shadow-xl shadow-purple-900/20"><UserPlus size={28} /></div>
                                    <div>
                                        <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900 leading-none">Architect New Entity</h2>
                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mt-2">Professional Identity Registration Flux</p>
                                    </div>
                                </div>
                                <button onClick={() => setIsAddModalOpen(false)} className="p-3 hover:bg-slate-100 rounded-full transition-all text-slate-300 hover:text-slate-900"><X size={28} /></button>
                            </div>

                            <form onSubmit={handleAddVendor} className="overflow-y-auto custom-scrollbar p-8 space-y-8">
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Username (Primary Key)</label>
                                        <input type="text" required value={newVendor.username} onChange={e => setNewVendor({ ...newVendor, username: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl py-4 px-6 font-bold text-sm outline-none focus:bg-white focus:ring-8 focus:ring-[#4B2E83]/5 transition-all" placeholder="professional_node" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Access Protocol (Password)</label>
                                        <input type="password" required value={newVendor.password} onChange={e => setNewVendor({ ...newVendor, password: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl py-4 px-6 font-bold text-sm outline-none focus:bg-white focus:ring-8 focus:ring-[#4B2E83]/5 transition-all" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Legal Name</label>
                                    <input type="text" required value={newVendor.full_name} onChange={e => setNewVendor({ ...newVendor, full_name: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl py-4 px-6 font-bold text-sm outline-none focus:bg-white focus:ring-8 focus:ring-[#4B2E83]/5 transition-all" />
                                </div>

                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Communication Channel (Email)</label>
                                        <input type="email" required value={newVendor.email} onChange={e => setNewVendor({ ...newVendor, email: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl py-4 px-6 font-bold text-sm outline-none focus:bg-white focus:ring-8 focus:ring-[#4B2E83]/5 transition-all" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Relay Link (Mobile)</label>
                                        <input type="text" value={newVendor.mobile} onChange={e => setNewVendor({ ...newVendor, mobile: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl py-4 px-6 font-bold text-sm outline-none focus:bg-white focus:ring-8 focus:ring-[#4B2E83]/5 transition-all" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Business Entity</label>
                                        <input type="text" value={newVendor.business_name} onChange={e => setNewVendor({ ...newVendor, business_name: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl py-4 px-6 font-bold text-sm outline-none focus:bg-white transition-all" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Geographic Origin (City)</label>
                                        <input type="text" value={newVendor.city} onChange={e => setNewVendor({ ...newVendor, city: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl py-4 px-6 font-bold text-sm outline-none focus:bg-white transition-all" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Subscription Matrix</label>
                                            <select value={newVendor.plan_id} onChange={e => setNewVendor({ ...newVendor, plan_id: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl py-4 px-6 font-bold text-sm outline-none cursor-pointer appearance-none">
                                                <option value="">Select Tier</option>
                                                {allPlans.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                            </select>
                                        </div>
                                        {newVendor.plan_id && (
                                            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-between">
                                                <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600">Credits Included</span>
                                                <span className="text-sm font-black text-emerald-700">{allPlans.find(p => p.id.toString() === newVendor.plan_id.toString())?.credits || 0} CR</span>
                                            </motion.div>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Initial Bonus Credits (Adjustment)</label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                value={newVendor.initial_bonus_credits}
                                                onChange={e => setNewVendor({ ...newVendor, initial_bonus_credits: parseInt(e.target.value) || 0 })}
                                                className="w-full bg-slate-50 border border-slate-100 rounded-xl py-4 px-6 font-bold text-sm outline-none focus:bg-white transition-all pr-12"
                                                placeholder="0"
                                            />
                                            <Plus size={16} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300" />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 flex gap-6">
                                    <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 py-5 bg-slate-50 text-slate-400 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-slate-100 transition-all">Abort Protocol</button>
                                    <button type="submit" disabled={isSaving} className="flex-2 px-12 py-5 bg-[#4B2E83] text-white rounded-xl font-black uppercase tracking-[0.25em] text-[10px] shadow-2xl shadow-purple-900/30 hover:bg-[#5D3AB0] transition-all flex items-center justify-center gap-3 disabled:opacity-50">
                                        <Save size={18} className="text-[#C9A227]" /> {isSaving ? 'Synchronizing...' : 'Finalize Identity Architect'}
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

