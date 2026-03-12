
import { Link } from "react-router-dom";
import { Mail, Phone, MessageSquare } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-slate-50 border-t border-slate-200 pt-16 pb-8 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Column 1: Logo and Description */}
                    <div className="space-y-6">
                        <Link to="/" className="flex items-center gap-2 group cursor-pointer">
                            <div className="w-8 h-8 bg-[#4B2E83] rounded flex items-center justify-center">
                                <span className="text-[#C9A227] font-bold text-sm leading-none select-none">NS</span>
                            </div>
                            <span className="text-lg font-extrabold tracking-tight text-[#4B2E83] uppercase">
                                NUMERO <span className="text-[#C9A227]">SANSAR</span>
                            </span>
                        </Link>
                        <p className="text-sm text-slate-500 leading-relaxed">
                            Premier numerology software designed for professional practitioners. Accurate calculations, comprehensive reports, and client management in one secure platform.
                        </p>
                    </div>

                    {/* Column 2: Product Links */}
                    <div className="space-y-6">
                        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Product</h4>
                        <ul className="space-y-4">
                            <li><Link to="/features" className="text-sm text-slate-600 hover:text-[#4B2E83] transition-colors">Features</Link></li>
                            <li><Link to="/pricing" className="text-sm text-slate-600 hover:text-[#4B2E83] transition-colors">Pricing</Link></li>
                            <li><Link to="/how-it-works" className="text-sm text-slate-600 hover:text-[#4B2E83] transition-colors">How It Works</Link></li>
                            <li><Link to="/screenshots" className="text-sm text-slate-600 hover:text-[#4B2E83] transition-colors">Screenshots</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Resources */}
                    <div className="space-y-6">
                        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Resources</h4>
                        <ul className="space-y-4">
                            <li><Link to="/about-numerology" className="text-sm text-slate-600 hover:text-[#4B2E83] transition-colors">About Numerology</Link></li>
                            <li><Link to="/contact" className="text-sm text-slate-600 hover:text-[#4B2E83] transition-colors">Support</Link></li>
                        </ul>
                    </div>

                    {/* Column 4: Contact */}
                    <div className="space-y-6">
                        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Contact</h4>
                        <ul className="space-y-4">
                            <li className="flex items-center gap-3 text-sm text-slate-600">
                                <Mail size={16} className="text-[#C9A227]" />
                                <span>support@numerosansar.com</span>
                            </li>
                            <li className="flex items-center gap-3 text-sm text-slate-600">
                                <Phone size={16} className="text-[#C9A227]" />
                                <span>+91 98765 43210</span>
                            </li>
                            <li className="flex items-center gap-3 text-sm text-slate-600">
                                <MessageSquare size={16} className="text-[#C9A227]" />
                                <span>WhatsApp Support</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-slate-500">© 2026 NUMERO SANSAR. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link to="/privacy" className="text-xs text-slate-500 hover:text-slate-900">Privacy Policy</Link>
                        <Link to="/terms" className="text-xs text-slate-500 hover:text-slate-900">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
