"use client";

import { useState, useEffect } from "react";
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
    LayoutDashboard
} from "lucide-react";
import { api } from "@/lib/api";

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
    const [siteTitle, setSiteTitle] = useState("ADMIN");

    useEffect(() => {
        setDomLoaded(true);
        const token = localStorage.getItem('admin_token') || localStorage.getItem('token');
        if (!token && !pathname?.includes('/login')) {
            router.push('/admin/login');
        }

        // Fetch Site Settings
        if (token) {
            api.get('/admin/settings')
                .then(res => res.json())
                .then(data => {
                    if (data.site_title) {
                        setSiteTitle(data.site_title);
                    }
                })
                .catch(err => {
                    console.error("Failed to fetch settings", err);
                });
        }
    }, [router, pathname]);

    const handleLogout = () => {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('token');
        router.push('/admin/login');
    };

    const navItems = [
        { name: "Dashboard", icon: <LayoutDashboard size={18} />, path: "/admin/dashboard" },
        { name: "Clients", icon: <Users size={18} />, path: "/admin/clients" },
        { name: "Compounds", icon: <Database size={18} />, path: "/admin/compounds" },
        { name: "Settings", icon: <Settings size={18} />, path: "/admin/settings" },
        { name: "Profile", icon: <User size={18} />, path: "/admin/profile" },
    ];

    if (!domLoaded) return null;

    if (pathname?.startsWith('/admin/login')) {
        return <>{children}</>;
    }

    return (
        <div className="min-h-screen bg-background text-foreground font-sans flex flex-col transition-colors duration-300">

            {/* --- Fixed Topbar --- */}
            <header
                className="fixed top-0 left-0 w-full z-50 border-b border-white/20 h-16 transition-all duration-300 shadow-lg"
                style={{ background: "linear-gradient(75deg, #F7D700 13%, #E61111 81%)" }}
            >
                <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">

                    {/* Logo Area */}
                    <Link href="/admin/dashboard" className="flex items-center gap-2">
                        <Sparkles className="text-black/80 animate-pulse-slow" size={24} />
                        <span className="text-xl font-bold tracking-wider text-black/80">{siteTitle}</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-6">
                        {navItems.map((item) => {
                            const isActive = pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    href={item.path}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${isActive
                                        ? "bg-white/20 text-white shadow-sm border border-white/30"
                                        : "text-white/80 hover:text-white hover:bg-white/10"
                                        }`}
                                >
                                    {item.icon}
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}

                        <div className="w-px h-6 bg-white/20 mx-2"></div>

                        {/* Theme Toggle */}
                        <button
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            className="p-2 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                            aria-label="Toggle Theme"
                        >
                            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                        </button>

                        <div className="w-px h-6 bg-white/20 mx-2"></div>

                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 text-white/90 hover:text-white hover:bg-white/10 px-3 py-1.5 rounded-lg transition-colors text-sm font-bold"
                        >
                            <LogOut size={18} />
                            <span>Logout</span>
                        </button>
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden text-white/90 hover:text-white"
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Dropdown */}
                {isMobileMenuOpen && (
                    <div className="md:hidden absolute top-16 left-0 w-full bg-card border-b border-border p-4 shadow-2xl flex flex-col gap-2">
                        {navItems.map((item) => {
                            const isActive = pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    href={item.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                        ? "bg-accent/10 text-accent font-bold"
                                        : "text-muted-foreground hover:bg-accent/5 hover:text-foreground"
                                        }`}
                                >
                                    {item.icon}
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                        <div className="h-px bg-border my-2"></div>
                        <button
                            onClick={() => { setTheme(theme === "dark" ? "light" : "dark"); setIsMobileMenuOpen(false); }}
                            className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-accent/5 rounded-xl transition-all w-full text-left"
                        >
                            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                            <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-4 py-3 text-destructive hover:bg-destructive/5 rounded-xl transition-all w-full text-left"
                        >
                            <LogOut size={20} />
                            <span>Logout</span>
                        </button>
                    </div>
                )}
            </header>

            {/* --- Main Content (Padded for Header) --- */}
            <main className="flex-1 pt-24 px-4 pb-12 w-full max-w-7xl mx-auto">
                {children}
            </main>
        </div>
    );
}
