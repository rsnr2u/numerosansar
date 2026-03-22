import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    CreditCard,
    ArrowLeftRight,
    PieChart,
    BarChart3,
    MessageSquare,
    BookOpen,
    Settings,
    LogOut,
    Search,
    Bell,
    ChevronDown,
    Menu,
    X,
    Sparkles,
    ShieldCheck,
    Zap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePlatform } from "@/contexts/PlatformContext";

export default function SuperAdminLayout() {
    const { config } = usePlatform();
    const location = useLocation();
    const pathname = location.pathname;
    const navigate = useNavigate();
    const [domLoaded, setDomLoaded] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        setDomLoaded(true);
        const token = localStorage.getItem('admin_token') || localStorage.getItem('token');
        const role = localStorage.getItem('user_role');

        if (!token) {
            navigate('/super-admin/login');
            return;
        }

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            if (payload.exp && payload.exp * 1000 < Date.now()) {
                handleLogout();
                return;
            }
        } catch (e) {
            handleLogout();
            return;
        }

        if (role !== 'super_admin') {
            navigate('/admin/dashboard');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('token');
        localStorage.removeItem('user_role');
        localStorage.removeItem('username');
        navigate('/super-admin/login');
    };

    const navItems = [
        { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/super-admin/dashboard" },
        { name: "Numerologists", icon: <Users size={20} />, path: "/super-admin/vendors" },
        { name: "Admin Panel", icon: <LayoutDashboard size={20} />, path: "/admin/dashboard" },
        { name: "Credit Management", icon: <Sparkles size={20} />, path: "/super-admin/credits" },
        { name: "Transactions", icon: <ArrowLeftRight size={20} />, path: "/super-admin/transactions" },
        { name: "Client Analyses", icon: <PieChart size={20} />, path: "/super-admin/audit-logs" },
        { name: "Revenue Reports", icon: <BarChart3 size={20} />, path: "/super-admin/revenue" },
        { name: "Support Requests", icon: <MessageSquare size={20} />, path: "/super-admin/support" },
        { name: "Tutorial Management", icon: <BookOpen size={20} />, path: "/super-admin/tutorials" },
        { name: "Package Management", icon: <CreditCard size={20} />, path: "/super-admin/plans" },
        { name: "AI Configuration", icon: <Sparkles size={20} />, path: "/super-admin/ai-settings" },
        { name: "Settings", icon: <Settings size={20} />, path: "/super-admin/settings" },
    ];

    if (!domLoaded) return null;

    const isLoginPage = pathname === "/super-admin/login";
    if (isLoginPage) return <div className="min-h-screen bg-slate-50"><Outlet /></div>;

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex font-['Inter',_sans-serif]">
            {/* --- SIDEBAR --- */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 bg-[#4B2E83] text-white transition-all duration-300 ease-in-out border-r border-white/5 shadow-2xl ${isSidebarOpen ? "w-[280px]" : "w-0 lg:w-[80px]"
                    } overflow-hidden flex flex-col`}
            >
                {/* Logo Section */}
                <div className="p-4 h-[70px] flex items-center justify-between border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#C9A227] rounded-lg flex items-center justify-center shadow-lg shadow-black/20">
                            <ShieldCheck className="text-[#4B2E83]" size={24} />
                        </div>
                        {isSidebarOpen && (
                            <div className="flex flex-col">
                                <span className="text-xl font-black tracking-tight leading-none uppercase">{config?.platform_name || 'NUMERO SANSAR'}</span>
                                <span className="text-[10px] font-black tracking-[0.3em] text-[#C9A227] uppercase opacity-80">Super Admin</span>
                            </div>
                        )}
                    </div>
                    <button className="lg:hidden text-white/60 hover:text-white" onClick={() => setIsSidebarOpen(false)}>
                        <X size={24} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-1 custom-scrollbar">
                    {navItems.map((item) => {
                        const isActive = pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-bold transition-all relative group ${isActive
                                    ? "bg-white/10 text-[#C9A227] shadow-inner"
                                    : "text-purple-100/60 hover:text-white hover:bg-white/5"
                                    }`}
                            >
                                <span className={`${isActive ? "text-[#C9A227]" : "group-hover:text-white transition-colors"}`}>
                                    {item.icon}
                                </span>
                                {isSidebarOpen && <span className="truncate">{item.name}</span>}
                                {isActive && (
                                    <motion.div
                                        layoutId="sidebar-active"
                                        className="absolute left-0 w-1 h-6 bg-[#C9A227] rounded-full"
                                    />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer Section */}
                <div className="p-3 border-t border-white/5 space-y-2">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-bold text-red-300 hover:bg-red-500/10 hover:text-red-400 transition-all group"
                    >
                        <LogOut size={20} />
                        {isSidebarOpen && <span>Terminate Session</span>}
                    </button>

                    {isSidebarOpen && (
                        <div className="bg-white/5 rounded-xl p-4 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-[10px] font-black uppercase tracking-tighter shadow-xl">SA</div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-black truncate">Main.Admin</p>
                                <p className="text-[9px] text-purple-200/40 font-black uppercase tracking-widest">Master Control</p>
                            </div>
                        </div>
                    )}
                </div>
            </aside>

            {/* --- MAIN CONTENT --- */}
            <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${isSidebarOpen ? "lg:ml-[280px]" : "lg:ml-[80px]"}`}>
                {/* Header */}
                <header className="h-[80px] bg-white/80 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-40 flex items-center justify-between px-6 lg:px-10">
                    <div className="flex items-center gap-6">
                        <button className="p-2 -ml-2 text-slate-400 hover:text-[#4B2E83] hover:bg-slate-50 rounded-lg transition-all" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                            <Menu size={24} />
                        </button>
                        <h2 className="text-lg font-black tracking-tight text-slate-900 hidden sm:block">
                            {navItems.find(n => n.path === pathname)?.name || "Dashboard"}
                        </h2>
                    </div>

                    <div className="flex items-center gap-4 lg:gap-8">
                        {/* Search */}
                        <div className="hidden md:flex relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#4B2E83] transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Search Intel..."
                                className="bg-slate-50 pl-12 pr-6 py-2.5 rounded-xl text-sm font-bold border border-slate-100 focus:outline-none focus:ring-4 focus:ring-[#4B2E83]/5 focus:bg-white focus:border-[#4B2E83]/20 transition-all w-[300px]"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3">
                            <button className="p-3 text-slate-400 hover:text-[#4B2E83] hover:bg-[#4B2E83]/5 rounded-xl transition-all relative">
                                <Bell size={20} />
                                <span className="absolute top-3 right-3 w-2 h-2 bg-[#C9A227] rounded-full border-2 border-white animate-pulse"></span>
                            </button>

                            <div className="h-6 w-[1px] bg-slate-200 hidden sm:block mx-1"></div>

                            {/* Profile Dropdown */}
                            <div className="relative">
                                <button
                                    className={`flex items-center gap-3 p-1.5 rounded-xl transition-all ${isProfileOpen ? "bg-[#4B2E83]/5 ring-1 ring-[#4B2E83]/10" : "hover:bg-slate-50"}`}
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                >
                                    <div className="w-10 h-10 rounded-lg bg-[#4B2E83] flex items-center justify-center text-white font-black overflow-hidden shadow-xl shadow-purple-900/10">
                                        <img src={`https://ui-avatars.com/api/?name=Admin&background=4B2E83&color=fff`} alt="SA" />
                                    </div>
                                    <div className="hidden lg:block text-left">
                                        <p className="text-xs font-black text-slate-900 leading-none mb-0.5">Admin</p>
                                        <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Super Root</p>
                                    </div>
                                    <ChevronDown size={14} className={`text-slate-400 transition-transform hidden sm:block ${isProfileOpen ? "rotate-180" : ""}`} />
                                </button>

                                <AnimatePresence>
                                    {isProfileOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute right-0 mt-3 w-[220px] bg-white rounded-2xl shadow-[0_32px_64px_-16px_rgba(75,46,131,0.2)] border border-slate-100 p-3 overflow-hidden"
                                        >
                                            <div className="space-y-1">
                                                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
                                                    My Profile
                                                </button>
                                                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
                                                    Change Password
                                                </button>
                                                <div className="h-[1px] bg-slate-50 my-2 mx-2"></div>
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all"
                                                >
                                                    Logout
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </header>

                {/* --- PAGE CONTENT --- */}
                <main className="flex-1 overflow-x-hidden relative">
                    <div className="p-6 lg:p-10 max-w-[1600px] mx-auto min-h-full pb-20">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
