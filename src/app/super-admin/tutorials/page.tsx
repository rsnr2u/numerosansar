import { useState } from "react";
import { motion } from "framer-motion";
import {
    Video,
    Plus,
    Search,
    Play,
    Edit2,
    Trash2,
    Globe,
    Clock,
    Eye,
    Star,
    Monitor,
    Smartphone,
    MoreVertical
} from "lucide-react";

export default function TutorialManagement() {
    const [searchTerm, setSearchTerm] = useState("");

    const tutorials = [
        { id: 1, title: "Mastering Name Numerology", category: "Core Training", views: "12.4k", duration: "18:24", status: "Published", platform: "Web", premium: true },
        { id: 2, title: "Advanced Pythagorean Matrix", category: "Technical", views: "8.1k", duration: "24:10", status: "Published", platform: "All", premium: true },
        { id: 3, title: "Setting up your Vendor Dashboard", category: "Onboarding", views: "3.2k", duration: "05:45", status: "Draft", platform: "Web", premium: false },
        { id: 4, title: "Client Consultation Best Practices", category: "Soft Skills", views: "5.7k", duration: "12:15", status: "Published", platform: "Mobile", premium: false },
        { id: 5, title: "The 81 Lo-Shu Grid Secrets", category: "Advanced", views: "15.9k", duration: "42:00", status: "Published", platform: "All", premium: true },
    ];

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-slate-900">Tutorial Mastery</h1>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mt-1">Knowledge Base & Educational Asset Registry</p>
                </div>
                <button className="flex items-center gap-3 px-8 py-4 bg-[#4B2E83] text-white rounded-[2rem] font-black uppercase text-[10px] tracking-[0.2em] shadow-2xl shadow-purple-900/30 hover:bg-[#5D3AB0] hover:scale-105 active:scale-95 transition-all">
                    <Plus size={18} className="text-[#C9A227]" /> Create Masterclass
                </button>
            </div>

            {/* Content Control Bar */}
            <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex items-center justify-between gap-8">
                <div className="flex items-center gap-4 flex-1 group">
                    <div className="p-3 bg-slate-50 text-slate-300 group-focus-within:text-[#4B2E83] group-focus-within:bg-[#4B2E83]/5 rounded-2xl transition-all">
                        <Search size={20} />
                    </div>
                    <input
                        type="text"
                        placeholder="Search educational assets by title, category, or platform..."
                        className="bg-transparent w-full text-sm font-bold outline-none placeholder:text-slate-300"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-3">
                    <div className="h-10 w-[1px] bg-slate-100 mx-2"></div>
                    <button className="px-6 py-2.5 bg-slate-50 text-slate-400 rounded-xl text-[9px] font-black uppercase tracking-widest hover:text-[#4B2E83] hover:bg-[#4B2E83]/5 transition-all">All Assets</button>
                    <button className="px-6 py-2.5 bg-slate-50 text-slate-400 rounded-xl text-[9px] font-black uppercase tracking-widest hover:text-[#4B2E83] hover:bg-[#4B2E83]/5 transition-all">Drafts</button>
                    <button className="px-6 py-2.5 bg-slate-50 text-slate-400 rounded-xl text-[9px] font-black uppercase tracking-widest hover:text-[#4B2E83] hover:bg-[#4B2E83]/5 transition-all">Video Only</button>
                </div>
            </div>

            {/* Tutorials Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {tutorials.map((t) => (
                    <motion.div
                        key={t.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: t.id * 0.1 }}
                        className="group bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden hover:shadow-2xl hover:shadow-[#4B2E83]/5 transition-all"
                    >
                        {/* Thumbnail Placeholder */}
                        <div className="aspect-video bg-slate-900 relative flex items-center justify-center overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60"></div>
                            <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white scale-90 group-hover:scale-100 transition-all cursor-pointer border border-white/20 shadow-2xl relative z-10">
                                <Play size={24} fill="currentColor" />
                            </div>
                            <div className="absolute top-6 left-6 flex gap-2 z-10">
                                {t.premium && (
                                    <div className="px-3 py-1 bg-[#C9A227] text-[#4B2E83] rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1 shadow-lg">
                                        <Star size={10} fill="currentColor" /> Premium
                                    </div>
                                )}
                                <div className="px-3 py-1 bg-black/40 backdrop-blur-md text-white/80 rounded-full text-[8px] font-black uppercase tracking-widest border border-white/10">
                                    {t.category}
                                </div>
                            </div>
                            <div className="absolute bottom-6 right-6 px-3 py-1 bg-black/60 backdrop-blur-md text-white text-[9px] font-black rounded-lg z-10">
                                {t.duration}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-8">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-xl font-black text-slate-900 tracking-tight leading-tight group-hover:text-[#4B2E83] transition-colors">{t.title}</h3>
                                <button className="p-2 text-slate-300 hover:text-slate-900 transition-colors"><MoreVertical size={20} /></button>
                            </div>

                            <div className="flex items-center gap-6 mb-8">
                                <div className="flex items-center gap-2">
                                    <Eye size={14} className="text-slate-300" />
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.views} views</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Globe size={14} className="text-slate-300" />
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.platform} access</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                                <div className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-[0.2em] ${t.status === 'Published' ? 'bg-emerald-50 text-emerald-500 border border-emerald-100' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}>
                                    {t.status}
                                </div>
                                <div className="flex gap-2">
                                    <button className="p-3 bg-slate-50 text-slate-400 hover:text-[#4B2E83] hover:bg-[#4B2E83]/5 rounded-xl transition-all"><Edit2 size={16} /></button>
                                    <button className="p-3 bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={16} /></button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}

                {/* Create New Card */}
                <button className="aspect-[4/5] rounded-[2.5rem] border-4 border-dashed border-slate-100 flex flex-col items-center justify-center gap-4 text-slate-200 hover:border-[#4B2E83]/20 hover:text-[#4B2E83] transition-all group">
                    <div className="w-20 h-20 rounded-full border-4 border-slate-100 flex items-center justify-center group-hover:bg-[#4B2E83]/5 group-hover:border-[#4B2E83]/10 transition-all">
                        <Plus size={32} />
                    </div>
                    <span className="text-xs font-black uppercase tracking-[0.3em]">Build New Asset</span>
                </button>
            </div>
        </div>
    );
}
