import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
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
    Globe,
    CreditCard,
    UserCheck
} from "lucide-react";
import { api } from "@/lib/api";
import { API_BASE_URL } from "@/lib/constants";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

import { usePlatform } from "@/contexts/PlatformContext";

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
                {name && <span>{name}</span>}
                <ChevronDown size={12} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div
                    className="absolute right-0 mt-2 w-48 bg-white border border-black/5 rounded-xl shadow-2xl z-50 overflow-hidden py-1"
                >
                    <div className="px-3 py-2 text-[8px] font-black uppercase tracking-widest text-black/20">{name}</div>
                    {items.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
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
                    {(type === 'settings' || type === 'user') && (
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

export default function AdminLayout() {
    const { config } = usePlatform();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const pathname = location.pathname;
    const navigate = useNavigate();
    const [domLoaded, setDomLoaded] = useState(false);
    const [siteTitle, setSiteTitle] = useState("HUB");
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [userModules, setUserModules] = useState<string[]>([]);
    const [brandName, setBrandName] = useState<string | null>(null);
    const [businessName, setBusinessName] = useState<string | null>(null);
    const [brandLogo, setBrandLogo] = useState<string | null>(null);
    const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
    const [credits, setCredits] = useState<number>(0);
    const [isTrial, setIsTrial] = useState(false);

    useEffect(() => {
        setDomLoaded(true);

        const token = localStorage.getItem('admin_token') || localStorage.getItem('token');
        const role = localStorage.getItem('user_role');
        setUserRole(role);

        if (!token && !pathname?.includes('/login')) {
            navigate('/admin/login');
        }

        setActiveDropdown(null);

        if (token) {
            // Check JWT expiration
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                if (payload.exp && payload.exp * 1000 < Date.now()) {
                    console.warn("Session expired on client check");
                    handleLogout();
                    return;
                }
            } catch (e) {
                console.error("Failed to parse token", e);
                handleLogout();
                return;
            }

            api.get('/admin/settings')
                .then(res => res.json())
                .then(data => {
                    if (data.site_title) setSiteTitle(data.site_title);
                    if (data.credits_remaining !== undefined) setCredits(data.credits_remaining);
                    if (data.is_trial !== undefined) setIsTrial(data.is_trial);
                })
                .catch(err => {
                    console.error("Layout Settings Fetch Error:", err);
                });

            api.get('/admin/profile')
                .then(res => res.json())
                .then(data => {
                    if (data.brand_name) setBrandName(data.brand_name);
                    if (data.business_name) setBusinessName(data.business_name);
                    if (data.brand_logo) setBrandLogo(data.brand_logo);
                    if (data.profile_photo) setProfilePhoto(data.profile_photo);
                })
                .catch(err => {
                    console.error("Layout Profile Fetch Error:", err);
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
    }, [navigate, pathname]);

    const handleLogout = () => {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('token');
        localStorage.removeItem('user_role');
        localStorage.removeItem('username');
        localStorage.removeItem('user_modules');
        navigate('/admin/login');
    };

    const mainNav = [
        { name: "Dashboard", icon: <LayoutDashboard size={14} />, path: "/admin/dashboard" },
        { name: "Clients", icon: <Users size={14} />, path: "/admin/clients" },
    ];

    const astrologyMenu = [
        { name: "Compounds", icon: <Database size={14} />, path: "/admin/compounds" },
        { name: "Auspicious", icon: <Star size={14} />, path: "/admin/auspicious" },
        { name: "Vowels", icon: <AlertOctagon size={14} />, path: "/admin/vowel-consonant" },
        { name: "Sectors", icon: <BriefcaseBusiness size={14} />, path: "/admin/business-sectors" },
        { name: "Lucky Names", icon: <Sparkles size={14} />, path: "/admin/lucky-name-numbers" },
        { name: "Lo Shu Meanings", icon: <Grid size={14} />, path: "/admin/lo-shu-meanings" },
        { name: "Kua Details", icon: <Globe size={14} />, path: "/admin/kua-details" },
        { name: "Grid Master", icon: <Database size={14} />, path: "/admin/lo-shu-grid-master" },
    ];

    const userMenu = [
        { name: "My Credits", icon: <CreditCard size={14} />, path: "/admin/credits" },
        { name: "My Profile", icon: <User size={14} />, path: "/admin/profile" },
        ...(userRole === 'super_admin' ? [{ name: "General Settings", icon: <Settings size={14} />, path: "/admin/settings" }] : []),
    ];

    if (!domLoaded) return null;

    if (pathname?.startsWith('/admin/login')) {
        return <Outlet />;
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] font-sans flex flex-col">
            {/* --- Corporate Topbar --- */}
            <header
                className="fixed top-0 left-0 w-full z-50 h-16 shadow-2xl flex items-center border-b border-white/5 backdrop-blur-md"
                style={{ background: 'linear-gradient(135deg, #4B2E83 0%, #3a2366 100%)' }}
            >
                <div className="max-w-7xl mx-auto px-6 w-full flex items-center justify-between">
                    <Link to="/admin/dashboard" className="flex items-center gap-3 group">
                        <div className="p-1.5 bg-white/10 rounded-lg backdrop-blur-sm group-hover:bg-white/20 transition-all border border-white/10 flex items-center justify-center overflow-hidden w-10 h-10">
                            {brandLogo ? (
                                <img src={`${API_BASE_URL.replace('/api', '')}/${brandLogo}`} alt="Logo" className="w-full h-full object-contain" />
                            ) : (
                                <Sparkles className="text-[#D4AF37]" size={20} />
                            )}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-black tracking-tight text-white uppercase leading-none mb-0.5">
                                {businessName || config?.platform_name || "NUMERO SANSAR"}
                            </span>
                            <span className="text-[10px] text-white/60 font-black uppercase tracking-[0.2em] leading-none">
                                {brandName ? `${brandName} Hub` : "Elite Admin Profile"}
                            </span>
                        </div>
                    </Link>

                    <nav className="hidden md:flex items-center gap-2">
                        {mainNav.map((item) => {
                            const isActive = pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
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
                            items={astrologyMenu}
                            type="astrology"
                            activeDropdown={activeDropdown}
                            setActiveDropdown={setActiveDropdown}
                            pathname={pathname || ''}
                            handleLogout={handleLogout}
                        />

                        <div className="h-8 w-px bg-white/10 mx-2 hidden md:block"></div>

                        <div className="flex items-center gap-4 pl-2 relative">
                            {/* Navbar Credit Indicator */}
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-xl border border-white/20">
                                <span className="text-[10px] font-black text-white uppercase tracking-tighter">Credits: {credits}</span>
                                <button
                                    onClick={() => navigate('/admin/credits')}
                                    className="px-2 py-0.5 bg-[#C9A227] text-white rounded text-[8px] font-black uppercase tracking-widest hover:bg-white hover:text-[#4B2E83] transition-all"
                                >
                                    Buy
                                </button>
                            </div>

                            <div className="flex flex-col items-end hidden lg:flex">
                                <span className="text-[10px] font-black text-white uppercase tracking-tighter leading-none mb-1">
                                    {localStorage.getItem('username') || 'Elite Member'}
                                </span>
                                <span className="text-[8px] font-black text-[#C9A227] uppercase tracking-[0.2em] leading-none">Verified Master</span>
                            </div>
                            
                            <NavDropdown
                                name=""
                                icon={<div className="w-10 h-10 rounded-lg border border-white/10 bg-white/5 overflow-hidden group transition-all hover:border-[#C9A227]/50 flex items-center justify-center">
                                    {profilePhoto ? (
                                        <img src={`${API_BASE_URL.replace('/api', '')}/${profilePhoto}`} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-full h-full p-2 text-white/40" />
                                    )}
                                </div>}
                                items={userMenu}
                                type="user"
                                activeDropdown={activeDropdown}
                                setActiveDropdown={setActiveDropdown}
                                pathname={pathname || ''}
                                handleLogout={handleLogout}
                            />
                        </div>

                        {/* Super Admin Switcher - DIRECT ACCESS */}
                        {userRole === 'super_admin' && (
                            <Link
                                to="/super-admin/dashboard"
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

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="absolute top-16 left-0 w-full bg-[#E61111] border-b border-white/10 p-6 md:hidden shadow-2xl z-40 space-y-4"
                        >
                            <div className="grid grid-cols-2 gap-3">
                                {mainNav.map((item) => (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="flex items-center gap-3 p-4 bg-white/10 rounded-xl text-white font-bold text-xs uppercase tracking-wide"
                                    >
                                        {item.icon}
                                        {item.name}
                                    </Link>
                                ))}
                            </div>

                            <div className="p-4 bg-white/10 rounded-xl space-y-4">
                                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Global Language</p>
                                <div id="google_translate_element_mobile"></div>
                            </div>

                            <button
                                onClick={handleLogout}
                                className="w-full p-4 bg-white/5 text-white/60 font-bold text-xs uppercase tracking-wide rounded-xl flex items-center justify-center gap-2"
                            >
                                <LogOut size={16} /> Terminate Session
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            {/* Content Area */}
            <main className="flex-1 pt-24 px-6 pb-12 w-full max-w-7xl mx-auto" data-hydrated={domLoaded}>
                <Outlet />
            </main>
        </div>
    );
}
