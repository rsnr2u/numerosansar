import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    MessageSquare,
    Search,
    Filter,
    ChevronRight,
    Clock,
    User,
    CheckCircle2,
    AlertCircle,
    MoreVertical,
    Send,
    AtSign,
    Tag,
    Paperclip
} from "lucide-react";

export default function SupportRequests() {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [selectedTicket, setSelectedTicket] = useState<any>(null);

    const tickets = [
        { id: "TIC-8421", user: "Vikram Mehta", subject: "Credit Sync Latency", status: "open", priority: "high", time: "14m ago", category: "Billing" },
        { id: "TIC-8419", user: "Anjali Sharma", subject: "Pythagorean Chart Mismatch", status: "pending", priority: "medium", time: "2h ago", category: "Technical" },
        { id: "TIC-8415", user: "Rajesh Kannan", subject: "Whitelabel Logo Upload Error", status: "resolved", priority: "low", time: "5h ago", category: "Feature" },
        { id: "TIC-8410", user: "Sarah Joseph", subject: "Account Access Protocol", status: "open", priority: "medium", time: "Yesterday", category: "Security" },
    ];

    return (
        <div className="space-y-6 h-[calc(100vh-180px)]">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-slate-900">Support Command</h1>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mt-1">Global User Assistance & Ticket Matrix</p>
                </div>
                <div className="flex gap-4">
                    <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-2xl border border-slate-100 shadow-sm">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">System Live</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full pb-8">
                {/* Tickets List */}
                <div className="lg:col-span-4 bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col overflow-hidden">
                    <div className="p-6 border-b border-slate-50 space-y-4">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                            <input
                                type="text"
                                placeholder="Scan tickets..."
                                className="w-full bg-slate-50 border border-slate-50 rounded-xl py-2.5 pl-12 pr-4 text-xs font-bold focus:bg-white focus:border-[#4B2E83]/20 transition-all outline-none"
                            />
                        </div>
                        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                            {["All", "Open", "Pending", "Resolved"].map(s => (
                                <button
                                    key={s}
                                    onClick={() => setFilterStatus(s.toLowerCase())}
                                    className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${filterStatus === s.toLowerCase() ? 'bg-[#4B2E83] text-white' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        {tickets.map(t => (
                            <div
                                key={t.id}
                                onClick={() => setSelectedTicket(t)}
                                className={`p-6 border-b border-slate-50 cursor-pointer transition-all hover:bg-slate-50/80 group ${selectedTicket?.id === t.id ? 'bg-slate-50 border-l-4 border-l-[#4B2E83]' : ''}`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-[9px] font-black text-slate-300 font-mono tracking-widest">{t.id}</span>
                                    <div className={`w-1.5 h-1.5 rounded-full ${t.priority === 'high' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-slate-300'}`} />
                                </div>
                                <h4 className="text-sm font-black text-slate-900 leading-tight mb-1 group-hover:text-[#4B2E83] transition-colors">{t.subject}</h4>
                                <div className="flex items-center justify-between mt-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[8px] font-black text-slate-400">{t.user[0]}</div>
                                        <span className="text-[10px] font-bold text-slate-400">{t.user}</span>
                                    </div>
                                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-300">{t.time}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Ticket Details */}
                <div className="lg:col-span-8 bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col overflow-hidden relative">
                    {selectedTicket ? (
                        <>
                            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                                <div className="flex items-center gap-6">
                                    <div className="w-14 h-14 rounded-2xl bg-[#4B2E83]/5 text-[#4B2E83] flex items-center justify-center"><MessageSquare size={24} /></div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h2 className="text-xl font-black text-slate-900 tracking-tight">{selectedTicket.subject}</h2>
                                            <span className="px-2 py-0.5 bg-slate-100 rounded-md text-[8px] font-black uppercase tracking-widest text-slate-400">#{selectedTicket.id}</span>
                                        </div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                            <Tag size={12} className="text-[#C9A227]" /> {selectedTicket.category} • <Clock size={12} /> Received {selectedTicket.time}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[9px] font-black uppercase tracking-widest border border-emerald-100 hover:bg-emerald-100 transition-all">Resolve ticket</button>
                                    <button className="p-2 text-slate-300 hover:text-slate-600 transition-colors"><MoreVertical size={20} /></button>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar bg-slate-50/30">
                                {/* Message Thread */}
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-[#4B2E83] flex items-center justify-center text-white font-black text-xs shadow-lg">{selectedTicket.user[0]}</div>
                                    <div className="flex-1 space-y-2">
                                        <div className="bg-white p-5 rounded-3xl rounded-tl-none border border-slate-100 shadow-sm text-sm font-medium text-slate-700 leading-relaxed">
                                            Hello support Team, I am experiencing a significant delay in credit synchronization after processing a payment. The invoice is generated but the balance hasn't updated in my wallet matrix for over 15 minutes. Please investigate this latency immediately as it's affecting my client consultations.
                                        </div>
                                        <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest ml-1">{selectedTicket.user} • 10:42 AM</span>
                                    </div>
                                </div>

                                <div className="flex gap-4 flex-row-reverse">
                                    <div className="w-10 h-10 rounded-full bg-[#C9A227] flex items-center justify-center text-[#4B2E83] font-black text-xs shadow-lg">SA</div>
                                    <div className="flex-1 space-y-2 text-right">
                                        <div className="bg-[#4B2E83] p-5 rounded-3xl rounded-tr-none text-white text-sm font-medium leading-relaxed shadow-xl shadow-purple-900/10">
                                            Greetings Vikram. I have initiated a manual sync for your account node. Our telemetry shows a temporary bridge delay with the payment gateway. Your credits should be visible within the next 60 seconds. Apologies for the interference.
                                        </div>
                                        <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest mr-1">Super Admin • 10:45 AM</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 bg-white border-t border-slate-50">
                                <div className="bg-slate-50 rounded-[2rem] p-4 flex items-center gap-4 border border-slate-100 group focus-within:bg-white focus-within:border-[#4B2E83]/20 focus-within:ring-4 focus-within:ring-[#4B2E83]/5 transition-all">
                                    <button className="p-2 text-slate-300 hover:text-[#4B2E83] transition-colors"><Paperclip size={20} /></button>
                                    <input
                                        type="text"
                                        placeholder="Type your transmission..."
                                        className="flex-1 bg-transparent border-none outline-none text-sm font-bold placeholder:text-slate-300 px-2"
                                    />
                                    <button className="p-3 bg-[#4B2E83] text-white rounded-2xl shadow-lg shadow-purple-900/20 hover:scale-105 active:scale-95 transition-all"><Send size={18} /></button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-12 space-y-6">
                            <div className="w-32 h-32 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                                <MessageSquare size={64} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Select a Transmission</h3>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">Active communication channels will appear here</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
