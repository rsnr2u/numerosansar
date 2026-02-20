"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    ShieldCheck,
    Users,
    Settings,
    CreditCard,
    LogOut,
    LayoutDashboard,
    Sparkles,
    Zap,
    Search,
    Briefcase,
    BrainCircuit
} from "lucide-react";
import { motion } from "framer-motion";

export default function SuperAdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [domLoaded, setDomLoaded] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        setDomLoaded(true);
        const token = localStorage.getItem('admin_token') || localStorage.getItem('token');
        const role = localStorage.getItem('user_role');

        if (!token) {
            router.push('/super-admin/login');
            return;
        }

        if (role !== 'super_admin') {
            router.push('/admin/dashboard');
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('token');
        localStorage.removeItem('user_role');
        localStorage.removeItem('username');
        router.push('/super-admin/login');
    };

    const navGroups = [
        {
            label: "DASHBOARD",
            items: [
                { name: "Overview", icon: <LayoutDashboard size={18} />, path: "/super-admin/dashboard" },
                { name: "Revenue Flow", icon: <CreditCard size={18} />, path: "/super-admin/payments" },
            ]
        },
        {
            label: "ECOSYSTEM",
            items: [
                { name: "Numerologists", icon: <Users size={18} />, path: "/super-admin/vendors" },
                { name: "Plan Architecture", icon: <Zap size={18} />, path: "/super-admin/plans" },
                { name: "AI Intelligence", icon: <BrainCircuit size={18} />, path: "/super-admin/ai" },
            ]
        },
        {
            label: "SECURITY",
            items: [
                { name: "Security Audit", icon: <ShieldCheck size={18} />, path: "/super-admin/audit-logs" },
            ]
        }
    ];

    if (!domLoaded) return null;

    const isLoginPage = pathname === "/super-admin/login";
    if (isLoginPage) return <div className="min-h-screen bg-[#F8F9FB]">{children}</div>;

    return (
        <div className="min-h-screen bg-[#F8F9FB] text-[#2D2926] flex font-sans">
            {/* Sidebar */}
            <aside className="w-[280px] bg-white border-r border-slate-200 flex flex-col fixed h-full z-30 shadow-sm">
                <div className="p-6 pb-2">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center shadow-lg">
                            <ShieldCheck className="text-[#E61111]" size={24} />
                        </div>
                        <span className="text-2xl font-black tracking-tight italic">Master<span className="text-[#E61111]">OS</span></span>
                    </div>
                </div>

                <nav className="flex-1 px-4 py-6 overflow-y-auto space-y-6">
                    {navGroups.map((group, gIdx) => (
                        <div key={gIdx} className="space-y-2">
                            <p className="px-4 text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">{group.label}</p>
                            <div className="space-y-1">
                                {group.items.map((item) => {
                                    const isActive = pathname === item.path;
                                    return (
                                        <Link
                                            key={item.path}
                                            href={item.path}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all group ${isActive
                                                ? "bg-slate-100 text-black shadow-inner"
                                                : "text-slate-500 hover:text-black hover:bg-slate-50"
                                                }`}
                                        >
                                            <span className={`${isActive ? "text-[#E61111]" : "text-slate-400 group-hover:text-black transition-colors"}`}>{item.icon}</span>
                                            <span>{item.name}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>

                <div className="p-6 border-t border-slate-100 space-y-4">
                    <div className="px-2">
                        <p className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase mb-4">UI COMPONENTS</p>
                        <Link href="/super-admin/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-500 hover:text-black hover:bg-slate-50 transition-all">
                            <Settings size={18} className="text-slate-400" />
                            <span>System Config</span>
                        </Link>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 hover:text-red-600 transition-all"
                    >
                        <LogOut size={18} />
                        <span>Terminate Session</span>
                    </button>

                    <Link
                        href="/super-admin/profile"
                        className="p-4 bg-slate-50 rounded-xl flex items-center gap-3 hover:bg-slate-100 transition-all group"
                    >
                        <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white text-[10px] font-black uppercase shadow-sm group-hover:scale-110 transition-transform">SA</div>
                        <div>
                            <p className="text-xs font-black truncate">Super Admin</p>
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Master Root</p>
                        </div>
                    </Link>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 ml-[280px] flex flex-col">
                {/* Topbar */}
                <header className="h-[64px] bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-20 flex items-center justify-between px-6 shadow-sm">
                    <div className="flex items-center gap-4 w-full max-w-xl">
                        <div className="p-2 text-slate-400">
                            <Search size={18} />
                        </div>
                        <input
                            type="text"
                            placeholder="Universal Search (Vendors, Payments, Logs)..."
                            className="bg-transparent w-full text-sm font-medium outline-none placeholder:text-slate-300"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && searchQuery.trim()) {
                                    router.push(`/super-admin/vendors?search=${encodeURIComponent(searchQuery)}`);
                                }
                            }}
                        />
                    </div>

                    <div className="flex items-center gap-6">
                        <Link
                            href="/admin/dashboard"
                            className="hidden md:flex px-4 py-2 bg-black hover:bg-slate-800 text-white rounded-lg text-[10px] font-black uppercase tracking-widest shadow-md items-center gap-2 transition-all"
                        >
                            <Sparkles size={14} className="text-[#D4AF37]" />
                            Switch to Admin Panel
                        </Link>
                        <div className="flex items-center gap-2">
                            <button className="p-2.5 rounded-xl text-slate-400 hover:bg-slate-50 hover:text-black transition-all relative">
                                <Sparkles size={20} />
                                <span className="absolute top-2 right-2 w-2 h-2 bg-[#E61111] rounded-full border-2 border-white"></span>
                            </button>
                            <button className="p-2.5 rounded-xl text-slate-400 hover:bg-slate-50 hover:text-black transition-all">
                                <Settings size={20} />
                            </button>
                        </div>
                        <div className="h-8 w-[1px] bg-slate-200"></div>
                        <div className="flex items-center gap-3 pl-2">
                            <div className="text-right hidden sm:block">
                                <p className="text-xs font-black uppercase tracking-tight">System Status</p>
                                <p className="text-[10px] text-green-500 font-black uppercase flex items-center justify-end gap-1">
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Optimal
                                </p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-black font-black shadow-sm overflow-hidden">
                                <img src={`https://ui-avatars.com/api/?name=Admin&background=000&color=fff`} alt="Admin" />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 bg-slate-50 p-6 lg:p-10 overflow-x-hidden">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
