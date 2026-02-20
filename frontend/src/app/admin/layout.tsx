"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
    Database,
    Settings,
    User,
    Users,
    LogOut,
    Menu,
    X,
    Sparkles,
    Sun,
    Moon,
    Star,
    AlertOctagon,
    ChevronDown,
    LayoutDashboard,
    BriefcaseBusiness,
    ShieldCheck,
    Grid,
    Globe
} from "lucide-react";
import { api } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";

function NavDropdown({
    name,
    icon,
    items,
    type,
    activeDropdown,
    setActiveDropdown,
    pathname,
    handleLogout
}: {
    name: string,
    icon: React.ReactNode,
    items: any[],
    type: string,
    activeDropdown: string | null,
    setActiveDropdown: (type: string | null) => void,
    pathname: string,
    handleLogout: () => void
}) {
    const isOpen = activeDropdown === type;
    const isActive = items.some(s => pathname === s.path);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setActiveDropdown(null);
            }
        };
        if (isOpen) document.addEventListener("mousedown", handleClickOutside);
        else document.removeEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen, setActiveDropdown]);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setActiveDropdown(isOpen ? null : type)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all ${isOpen || isActive
                    ? "bg-white/20 text-white shadow-sm border border-white/30"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                    }`}
            >
                {icon}
                <span>{name}</span>
                <ChevronDown size={12} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div
                    className="absolute right-0 mt-2 w-48 bg-white border border-black/5 rounded-2xl shadow-2xl z-50 overflow-hidden py-1"
                >
                    <div className="px-3 py-2 text-[8px] font-black uppercase tracking-widest text-black/20">{name}</div>
                    {items.map((item) => (
                        <Link
                            key={item.path}
                            href={item.path}
                            onClick={() => setActiveDropdown(null)}
                            className={`flex items-center gap-3 px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors ${pathname === item.path
                                ? "bg-[#10B981]/10 text-[#10B981]"
                                : "text-[#2D2926]/60 hover:bg-black/5 hover:text-[#2D2926]"
                                }`}
                        >
                            <span className={pathname === item.path ? "text-[#10B981]" : "text-black/10"}>{item.icon}</span>
                            {item.name}
                        </Link>
                    ))}
                    {type === 'settings' && (
                        <>
                            <div className="h-px bg-black/5 my-1 mx-2"></div>
                            <button
                                onClick={() => { handleLogout(); setActiveDropdown(null); }}
                                className="w-full flex items-center gap-3 px-4 py-2 text-[10px] text-red-500 hover:bg-red-500/5 transition-colors font-black uppercase tracking-widest text-left"
                            >
                                <LogOut size={14} />
                                <span>Logout</span>
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const [domLoaded, setDomLoaded] = useState(false);
    const { theme, setTheme } = useTheme();
    const [siteTitle, setSiteTitle] = useState("HUB");
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [userModules, setUserModules] = useState<string[]>([]);

    useEffect(() => {
        setDomLoaded(true);

        // Global Click Debugger
        const handleGlobalClick = (e: MouseEvent) => {
            console.log("Global Click Detected:", {
                element: (e.target as HTMLElement).tagName,
                classes: (e.target as HTMLElement).className,
                id: (e.target as HTMLElement).id
            });
            // Visual feedback
            const dot = document.createElement("div");
            dot.style.position = "fixed";
            dot.style.left = `${e.clientX - 5}px`;
            dot.style.top = `${e.clientY - 5}px`;
            dot.style.width = "10px";
            dot.style.height = "10px";
            dot.style.background = "red";
            dot.style.borderRadius = "50%";
            dot.style.zIndex = "99999";
            dot.style.pointerEvents = "none";
            document.body.appendChild(dot);
            setTimeout(() => dot.remove(), 500);
        };
        window.addEventListener("click", handleGlobalClick);

        const token = localStorage.getItem('admin_token') || localStorage.getItem('token');
        const role = localStorage.getItem('user_role');
        setUserRole(role);

        if (!token && !pathname?.includes('/login')) {
            router.push('/admin/login');
        }

        setActiveDropdown(null);

        if (token) {
            api.get('/admin/settings')
                .then(res => res.json())
                .then(data => {
                    if (data.site_title) setSiteTitle(data.site_title);
                })
                .catch(err => {
                    console.error("Layout Settings Fetch Error:", err);
                });

            api.get('/admin/subscription')
                .then(res => res.json())
                .then(data => {
                    if (data.modules) {
                        try {
                            const modules = typeof data.modules === 'string' ? JSON.parse(data.modules) : data.modules;
                            setUserModules(modules);
                            localStorage.setItem('user_modules', JSON.stringify(modules));
                        } catch (e) {
                            console.error("Failed to parse modules", e);
                        }
                    }
                })
                .catch(err => {
                    console.error("Layout Subscription Fetch Error:", err);
                });
        }

        return () => window.removeEventListener("click", handleGlobalClick);
    }, [router, pathname]);

    const handleLogout = () => {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('token');
        localStorage.removeItem('user_role');
        localStorage.removeItem('username');
        localStorage.removeItem('user_modules');
        router.push('/admin/login');
    };

    const mainNav = [
        { name: "Dash", icon: <LayoutDashboard size={14} />, path: "/admin/dashboard" },
        { name: "Clients", icon: <Users size={14} />, path: "/admin/clients" },
    ];

    const numerologyMenu = [
        { name: "Compounds", icon: <Database size={14} />, path: "/admin/compounds" },
        { name: "Auspicious", icon: <Star size={14} />, path: "/admin/auspicious" },
        { name: "Vowels", icon: <AlertOctagon size={14} />, path: "/admin/vowel-consonant" },
        { name: "Sectors", icon: <BriefcaseBusiness size={14} />, path: "/admin/business-sectors" },
        { name: "Lucky Names", icon: <Sparkles size={14} />, path: "/admin/lucky-name-numbers" },
        { name: "Lo Shu Meanings", icon: <Grid size={14} />, path: "/admin/lo-shu-meanings" },
        { name: "Kua Details", icon: <Globe size={14} />, path: "/admin/kua-details" },
        { name: "Grid Master", icon: <Database size={14} />, path: "/admin/lo-shu-grid-master" },
    ];

    const settingsMenu = [
        ...(userRole === 'super_admin' ? [{ name: "General", icon: <Settings size={14} />, path: "/admin/settings" }] : []),
        ...(userRole === 'super_admin' ? [{ name: "AI Tech", icon: <Sparkles size={14} />, path: "/admin/ai-settings" }] : []),
        { name: "My Profile", icon: <User size={14} />, path: "/admin/profile" },
    ];

    if (!domLoaded) return null;

    if (pathname?.startsWith('/admin/login')) {
        return <>{children}</>;
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] font-sans flex flex-col">
            {/* --- Corporate Topbar --- */}
            <header
                className="fixed top-0 left-0 w-full z-50 h-16 shadow-lg flex items-center border-b border-white/10"
                style={{ background: 'linear-gradient(75deg, #F7D700 13%, #E61111 81%)' }}
            >
                <div className="max-w-7xl mx-auto px-6 w-full flex items-center justify-between">
                    <Link href="/admin/dashboard" className="flex items-center gap-3">
                        <div className="p-1.5 bg-white/10 rounded-lg backdrop-blur-sm">
                            <Sparkles className="text-[#D4AF37]" size={20} />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-white uppercase">{siteTitle} <span className="text-white/40 font-light">Admin</span></span>
                    </Link>

                    <nav className="hidden md:flex items-center gap-2">
                        {mainNav.map((item) => {
                            const isActive = pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    href={item.path}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${isActive
                                        ? "bg-white/10 text-white shadow-inner"
                                        : "text-white/60 hover:text-white hover:bg-white/5"
                                        }`}
                                >
                                    {item.icon}
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}

                        <NavDropdown
                            name="Archive"
                            icon={<Database size={14} />}
                            items={numerologyMenu}
                            type="numerology"
                            activeDropdown={activeDropdown}
                            setActiveDropdown={setActiveDropdown}
                            pathname={pathname || ''}
                            handleLogout={handleLogout}
                        />
                        <NavDropdown
                            name="Settings"
                            icon={<Settings size={14} />}
                            items={settingsMenu}
                            type="settings"
                            activeDropdown={activeDropdown}
                            setActiveDropdown={setActiveDropdown}
                            pathname={pathname || ''}
                            handleLogout={handleLogout}
                        />
                        {/* Super Admin Switcher - DIRECT ACCESS */}
                        {userRole === 'super_admin' && (
                            <Link
                                href="/super-admin/dashboard"
                                className="ml-4 px-4 py-2 bg-[#E61111] hover:bg-[#CC0000] text-white rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-2 transition-all"
                            >
                                <ShieldCheck size={14} />
                                Super Admin Panel
                            </Link>
                        )}
                    </nav>

                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </header>

            {/* Content Area */}
            <main className="flex-1 pt-24 px-6 pb-12 w-full max-w-7xl mx-auto" data-hydrated={domLoaded}>
                {children}
            </main>

            {/* Diagnostic Button */}
            <button
                onClick={() => alert("Diagnostic Button Clicked!")}
                className="fixed bottom-4 right-4 bg-red-600 text-white p-4 rounded-full z-[99999] shadow-2xl font-black text-xs uppercase"
            >
                Test Interactivity
            </button>
        </div>
    );
}

