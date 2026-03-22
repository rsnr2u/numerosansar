import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { usePlatform } from "@/contexts/PlatformContext";

export default function Header() {
    const { config } = usePlatform();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Home", href: "/", type: 'page' },
        { name: "Features", href: "/features", type: 'page' },
        { name: "How It Works", href: "/how-it-works", type: 'page' },
        { name: "Pricing", href: "/pricing", type: 'page' },
        { name: "Screenshots", href: "/screenshots", type: 'page' },
        { name: "Support", href: "/contact", type: 'page' },
    ];

    return (
        <header className={`fixed top-0 left-0 w-full z-[100] transition-all duration-300 ${isScrolled ? "bg-white/95 backdrop-blur-md shadow-sm py-3" : "bg-transparent py-5"}`}>
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 group cursor-pointer">
                    <div className="w-10 h-10 bg-[#4B2E83] rounded-lg flex items-center justify-center shadow-lg shadow-purple-900/20 group-hover:bg-[#5D3AB0] transition-colors">
                        <span className="text-[#C9A227] font-bold text-xl leading-none select-none">
                            {config?.platform_name ? config.platform_name.substring(0, 2).toUpperCase() : 'NS'}
                        </span>
                    </div>
                    <span className="text-xl font-extrabold tracking-tight text-[#4B2E83] uppercase">
                        {config?.platform_name ? config.platform_name.split(' ')[0] : 'NUMERO'} 
                        <span className="text-[#C9A227] ml-1">
                            {config?.platform_name ? config.platform_name.substring(config.platform_name.indexOf(' ') + 1) : 'SANSAR'}
                        </span>
                    </span>
                </Link>

                <nav className="hidden md:flex items-center gap-8">
                    {navLinks.map(link => (
                        <Link
                            key={link.name}
                            to={link.href}
                            className="text-sm font-semibold text-slate-600 hover:text-[#4B2E83] transition-colors cursor-pointer"
                        >
                            {link.name}
                        </Link>
                    ))}
                </nav>

                <div className="hidden md:flex items-center gap-4">
                    <Link to="/login" className="text-sm font-bold text-slate-700 hover:text-[#4B2E83] transition-colors cursor-pointer px-4 py-2">Login</Link>
                    <Link to="/register"
                        className="bg-[#4B2E83] hover:bg-[#5D3AB0] text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-md shadow-purple-900/10 transition-all hover:scale-105"
                    >
                        Start Free Trial
                    </Link>
                </div>

                <button className="md:hidden text-[#4B2E83]" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-b border-slate-100 overflow-hidden"
                    >
                        <div className="flex flex-col p-6 gap-4">
                            {navLinks.map(link => (
                                <Link
                                    key={link.name}
                                    to={link.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="text-base font-bold text-slate-900 hover:text-[#4B2E83] transition-colors"
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="flex flex-col gap-3 pt-4 border-t border-slate-100">
                                <Link to="/login" onClick={() => setIsMenuOpen(false)} className="w-full py-3 rounded-xl border border-slate-200 font-bold text-slate-900 text-center">Login</Link>
                                <Link to="/register" onClick={() => setIsMenuOpen(false)} className="w-full py-3 rounded-xl bg-[#4B2E83] text-white font-bold text-center">Start Free Trial</Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
