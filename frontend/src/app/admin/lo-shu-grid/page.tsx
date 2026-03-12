import { useEffect, useState } from "react";
import { Grid, Sparkles, PenTool, Plus, Trash2, Save, Search, FileText, X, Download, Calendar, User, UserCheck, Shield, Zap, Globe, Info } from "lucide-react";
import { api } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";

interface LoShuMeaning {
    id: number;
    number: number;
    quality: string;
    remedy: string;
}

interface KuaDetail {
    id: number;
    kua_number: number;
    sheng_qi: string;
    tian_yi: string;
    yan_nian: string;
    fu_wei: string;
    bad_directions: string;
}

const GRID_STRUCTURE = [
    { cell: "Top-Left", number: 4, quality: "Order, hard work, practicality", label: "Practicality" },
    { cell: "Top-Center", number: 9, quality: "Idealism, fame, inspiration", label: "Ideals" },
    { cell: "Top-Right", number: 2, quality: "Relationships, cooperation", label: "Relations" },
    { cell: "Mid-Left", number: 3, quality: "Creativity, expression", label: "Creativity" },
    { cell: "Center", number: 5, quality: "Balance, adaptability", label: "Center / Balance" },
    { cell: "Mid-Right", number: 7, quality: "Intuition, spirituality", label: "Spirituality" },
    { cell: "Bottom-Left", number: 8, quality: "Discipline, ambition", label: "Discipline" },
    { cell: "Bottom-Center", number: 1, quality: "Logic, leadership seed", label: "Logic" },
    { cell: "Bottom-Right", number: 6, quality: "Service, responsibility", label: "Responsibility" },
];

export default function LoShuGridPage() {
    const [activeTab, setActiveTab] = useState<"calculator" | "meanings" | "kua">("calculator");
    const [dob, setDob] = useState("");
    const [gender, setGender] = useState<"male" | "female">("male");
    const [gridCounts, setGridCounts] = useState<Record<number, number>>({});
    const [kuaNumber, setKuaNumber] = useState<number | null>(null);
    const [meanings, setMeanings] = useState<LoShuMeaning[]>([]);
    const [kuaDetails, setKuaDetails] = useState<KuaDetail[]>([]);
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState<string | null>(null);

    // Editing states
    const [selectedMeaning, setSelectedMeaning] = useState<Partial<LoShuMeaning>>({});
    const [selectedKua, setSelectedKua] = useState<Partial<KuaDetail>>({});

    useEffect(() => {
        setUserRole(localStorage.getItem('user_role'));
        fetchMeanings();
        fetchKuaDetails();
    }, []);

    const fetchMeanings = async () => {
        try {
            const res = await api.get("/admin/lo-shu/meanings");
            setMeanings(await res.json());
        } catch (err) { console.error(err); }
    };

    const fetchKuaDetails = async () => {
        try {
            const res = await api.get("/admin/lo-shu/kua");
            setKuaDetails(await res.json());
            setLoading(false);
        } catch (err) { console.error(err); }
    };

    const calculateGrid = () => {
        if (!dob) return;
        const digits = dob.replace(/[^1-9]/g, "").split("").map(Number);
        const counts: Record<number, number> = {};
        digits.forEach(d => {
            counts[d] = (counts[d] || 0) + 1;
        });
        setGridCounts(counts);

        // Kua Calculation
        const yearParts = dob.split("-");
        const year = parseInt(yearParts[0]);
        if (!isNaN(year)) {
            let lastTwo = year % 100;
            let reduced = (lastTwo % 9) || 9;
            if (lastTwo === 0) reduced = 9; // Handle 00 -> 9 (case for 2000 handled by logic below)

            // Better reduction: sum digits of last two until single digit
            let sum = Math.floor(lastTwo / 10) + (lastTwo % 10);
            let red = (sum % 9) || 9;

            let kn = 0;
            if (year < 2000) {
                if (gender === "male") kn = 10 - red;
                else {
                    kn = 5 + red;
                    if (kn > 9) kn = (kn % 9) || 9;
                }
            } else {
                if (gender === "male") kn = 9 - red;
                else {
                    kn = 6 + red;
                    if (kn > 9) kn = (kn % 9) || 9;
                }
            }

            if (kn <= 0) kn = (kn % 9) || 9;
            if (kn === 5) kn = gender === "male" ? 2 : 8;

            setKuaNumber(kn);
        }
    };

    const handleSaveMeaning = async () => {
        try {
            await api.post("/admin/lo-shu/meanings", selectedMeaning);
            setSelectedMeaning({});
            fetchMeanings();
        } catch (err) { console.error(err); }
    };

    const handleDeleteMeaning = async (id: number) => {
        if (!confirm("Delete this?")) return;
        try {
            await api.delete(`/admin/lo-shu/meanings/${id}`);
            fetchMeanings();
        } catch (err) { console.error(err); }
    };

    const handleSaveKua = async () => {
        try {
            await api.post("/admin/lo-shu/kua", selectedKua);
            setSelectedKua({});
            fetchKuaDetails();
        } catch (err) { console.error(err); }
    };

    const handleDeleteKua = async (id: number) => {
        if (!confirm("Delete this?")) return;
        try {
            await api.delete(`/admin/lo-shu/kua/${id}`);
            fetchKuaDetails();
        } catch (err) { console.error(err); }
    };

    if (loading) return <div className="p-20 text-center animate-pulse">Loading Lo Shu Systems...</div>;

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-20 px-4 md:px-0">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
                        <span className="p-2.5 bg-gradient-to-br from-[#1E293B] to-[#334155] rounded-xl shadow-lg text-white">
                            <Grid size={24} />
                        </span>
                        <span className="text-black">Lo Shu Magic Grid</span>
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1 ml-1">Ancient Chinese destiny and path analysis</p>
                </div>

                {userRole === 'super_admin' && (
                    <div className="flex p-1 bg-slate-100 rounded-2xl border border-slate-200 shadow-sm">
                        {(["calculator", "meanings", "kua"] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-800"
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <AnimatePresence mode="wait">
                {activeTab === "calculator" && (
                    <motion.div
                        key="calc"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="grid grid-cols-1 lg:grid-cols-12 gap-8"
                    >
                        {/* Input Section */}
                        <div className="lg:col-span-4 space-y-6">
                            <div className="glass-card p-6 bg-white/80 rounded-3xl border border-slate-200 shadow-xl backdrop-blur-md">
                                <h2 className="text-lg font-black mb-6 flex items-center gap-2">
                                    <Calendar size={18} className="text-primary" />
                                    Client Details
                                </h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[10px] uppercase font-black text-slate-400 block mb-2">Date of Birth</label>
                                        <input
                                            type="date"
                                            value={dob}
                                            onChange={(e) => setDob(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-primary font-bold"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] uppercase font-black text-slate-400 block mb-2">Gender</label>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setGender("male")}
                                                className={`flex-1 py-3 rounded-xl border flex items-center justify-center gap-2 font-bold transition-all ${gender === "male" ? "bg-blue-50 border-blue-200 text-blue-600 shadow-inner" : "bg-white border-slate-200 text-slate-400"
                                                    }`}
                                            >
                                                <User size={16} /> Male
                                            </button>
                                            <button
                                                onClick={() => setGender("female")}
                                                className={`flex-1 py-3 rounded-xl border flex items-center justify-center gap-2 font-bold transition-all ${gender === "female" ? "bg-pink-50 border-pink-200 text-pink-600 shadow-inner" : "bg-white border-slate-200 text-slate-400"
                                                    }`}
                                            >
                                                <UserCheck size={16} /> Female
                                            </button>
                                        </div>
                                    </div>
                                    <button
                                        onClick={calculateGrid}
                                        className="w-full py-4 bg-primary text-white font-black rounded-2xl hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary/20 mt-4 flex items-center justify-center gap-3"
                                    >
                                        <Sparkles size={20} /> Generate Analysis
                                    </button>
                                </div>
                            </div>

                            {kuaNumber && (
                                <div className="glass-card p-6 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl text-white shadow-2xl">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Kua Number</h3>
                                            <div className="text-5xl font-black mt-1">{kuaNumber}</div>
                                        </div>
                                        <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                                            <Globe size={32} className="text-primary" />
                                        </div>
                                    </div>

                                    {kuaDetails.find(k => k.kua_number === kuaNumber) && (
                                        <div className="space-y-3 mt-6">
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                                                    <div className="text-[8px] uppercase font-black text-slate-400">Success (SE)</div>
                                                    <div className="text-xs font-bold">{kuaDetails.find(k => k.kua_number === kuaNumber)?.sheng_qi}</div>
                                                </div>
                                                <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                                                    <div className="text-[8px] uppercase font-black text-slate-400">Health (TY)</div>
                                                    <div className="text-xs font-bold">{kuaDetails.find(k => k.kua_number === kuaNumber)?.tian_yi}</div>
                                                </div>
                                            </div>
                                            <div className="p-3 bg-red-500/10 rounded-xl border border-red-500/20">
                                                <div className="text-[8px] uppercase font-black text-red-300">Avoid Directions</div>
                                                <div className="text-xs font-medium text-red-100">{kuaDetails.find(k => k.kua_number === kuaNumber)?.bad_directions}</div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Grid & Analysis Section */}
                        <div className="lg:col-span-8 space-y-8">
                            <div className="grid grid-cols-3 gap-4 md:gap-6 bg-slate-200/50 p-6 rounded-[2.5rem] border border-slate-200/50 shadow-inner">
                                {GRID_STRUCTURE.map((cell) => {
                                    const count = gridCounts[cell.number] || 0;
                                    return (
                                        <motion.div
                                            key={cell.number}
                                            className={`relative aspect-square md:aspect-[4/3] bg-white rounded-3xl border shadow-lg flex flex-col items-center justify-center p-2 text-center transition-all ${count > 0 ? "border-primary/30 ring-4 ring-primary/5" : "border-slate-100 opacity-60"
                                                }`}
                                        >
                                            <div className={`text-3xl md:text-5xl font-black ${count > 0 ? "text-primary" : "text-slate-200"}`}>
                                                {cell.number}
                                            </div>
                                            <div className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1">
                                                {cell.label}
                                            </div>
                                            {count > 1 && (
                                                <div className="absolute top-3 right-3 w-6 h-6 bg-primary text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-lg">
                                                    {count}
                                                </div>
                                            )}
                                        </motion.div>
                                    );
                                })}
                            </div>

                            {Object.keys(gridCounts).length > 0 && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="glass-card p-6 bg-green-50/50 border border-green-100 rounded-3xl">
                                        <h4 className="text-xs font-black uppercase tracking-widest text-green-600 mb-4 flex items-center gap-2">
                                            <Shield size={14} /> Natural Strengths
                                        </h4>
                                        <div className="space-y-3">
                                            {GRID_STRUCTURE.map(cell => gridCounts[cell.number] && (
                                                <div key={cell.number} className="flex items-start gap-3">
                                                    <div className="w-6 h-6 bg-green-500 rounded-full flex-shrink-0 flex items-center justify-center text-white font-black text-[10px]">
                                                        {cell.number}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-bold text-slate-800">{cell.label}</div>
                                                        <div className="text-xs text-green-700/70">{meanings.find(m => m.number === cell.number)?.quality || cell.quality}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="glass-card p-6 bg-amber-50/50 border border-amber-100 rounded-3xl">
                                        <h4 className="text-xs font-black uppercase tracking-widest text-amber-600 mb-4 flex items-center gap-2">
                                            <Zap size={14} /> Growth Remedies
                                        </h4>
                                        <div className="space-y-4">
                                            {GRID_STRUCTURE.map(cell => !gridCounts[cell.number] && (
                                                <div key={cell.number} className="flex items-start gap-3">
                                                    <div className="w-6 h-6 bg-amber-200 rounded-full flex-shrink-0 flex items-center justify-center text-amber-700 font-black text-[10px]">
                                                        ?
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-bold text-slate-800">Remedy for {cell.number} ({cell.label})</div>
                                                        <div className="text-xs text-amber-700/70 italic">
                                                            {meanings.find(m => m.number === cell.number)?.remedy || "Missing description"}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}

                {activeTab === "meanings" && userRole === 'super_admin' && (
                    <motion.div
                        key="meanings"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="grid grid-cols-1 lg:grid-cols-12 gap-10"
                    >
                        <div className="lg:col-span-4">
                            <div className="glass-card p-6 bg-white rounded-3xl border border-border shadow-xl sticky top-28">
                                <h3 className="text-lg font-black mb-6">{selectedMeaning.id ? "Edit Meaning" : "Add Meaning"}</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[10px] uppercase font-black text-slate-400 mb-1 block">Cell Number (1-9)</label>
                                        <input
                                            type="number"
                                            value={selectedMeaning.number || ""}
                                            onChange={(e) => setSelectedMeaning({ ...selectedMeaning, number: parseInt(e.target.value) })}
                                            className="w-full bg-slate-50 border p-3 rounded-xl font-bold"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] uppercase font-black text-slate-400 mb-1 block">Description / Quality</label>
                                        <textarea
                                            value={selectedMeaning.quality || ""}
                                            onChange={(e) => setSelectedMeaning({ ...selectedMeaning, quality: e.target.value })}
                                            className="w-full bg-slate-50 border p-3 rounded-xl"
                                            rows={3}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] uppercase font-black text-slate-400 mb-1 block">Remedy</label>
                                        <textarea
                                            value={selectedMeaning.remedy || ""}
                                            onChange={(e) => setSelectedMeaning({ ...selectedMeaning, remedy: e.target.value })}
                                            className="w-full bg-slate-50 border p-3 rounded-xl"
                                            rows={4}
                                        />
                                    </div>
                                    <button onClick={handleSaveMeaning} className="w-full py-4 bg-primary text-white font-black rounded-2xl">
                                        Save Meaning
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-8">
                            <div className="bg-white rounded-3xl border border-border overflow-hidden shadow-xl">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-slate-50 text-[10px] uppercase font-black text-slate-400 border-b">
                                            <th className="px-6 py-4">No.</th>
                                            <th className="px-6 py-4">Quality</th>
                                            <th className="px-6 py-4">Remedy</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {meanings.map((m) => (
                                            <tr key={m.id} className="border-b hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-4 font-black text-primary">{m.number}</td>
                                                <td className="px-6 py-4 text-xs">{m.quality}</td>
                                                <td className="px-6 py-4 text-xs font-medium text-slate-500">{m.remedy}</td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <button onClick={() => setSelectedMeaning(m)} className="p-2 hover:bg-amber-100 text-amber-600 rounded-lg"><PenTool size={14} /></button>
                                                        <button onClick={() => handleDeleteMeaning(m.id)} className="p-2 hover:bg-red-100 text-red-600 rounded-lg"><Trash2 size={14} /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === "kua" && userRole === 'super_admin' && (
                    <motion.div
                        key="kua"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="grid grid-cols-1 lg:grid-cols-12 gap-10"
                    >
                        <div className="lg:col-span-4">
                            <div className="glass-card p-6 bg-white rounded-3xl border border-border shadow-xl sticky top-28">
                                <h3 className="text-lg font-black mb-6">{selectedKua.id ? "Edit Kua Details" : "Add Kua Details"}</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[10px] uppercase font-black text-slate-400 mb-1 block">Kua Number (1-9)</label>
                                        <input
                                            type="number"
                                            value={selectedKua.kua_number || ""}
                                            onChange={(e) => setSelectedKua({ ...selectedKua, kua_number: parseInt(e.target.value) })}
                                            className="w-full bg-slate-50 border p-3 rounded-xl font-bold"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[10px] uppercase font-black text-slate-400 mb-1 block">Success (SQ)</label>
                                            <input
                                                type="text"
                                                value={selectedKua.sheng_qi || ""}
                                                onChange={(e) => setSelectedKua({ ...selectedKua, sheng_qi: e.target.value })}
                                                className="w-full bg-slate-50 border p-3 rounded-xl font-bold"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] uppercase font-black text-slate-400 mb-1 block">Health (TY)</label>
                                            <input
                                                type="text"
                                                value={selectedKua.tian_yi || ""}
                                                onChange={(e) => setSelectedKua({ ...selectedKua, tian_yi: e.target.value })}
                                                className="w-full bg-slate-50 border p-3 rounded-xl font-bold"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[10px] uppercase font-black text-slate-400 mb-1 block">Relation (YN)</label>
                                            <input
                                                type="text"
                                                value={selectedKua.yan_nian || ""}
                                                onChange={(e) => setSelectedKua({ ...selectedKua, yan_nian: e.target.value })}
                                                className="w-full bg-slate-50 border p-3 rounded-xl font-bold"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] uppercase font-black text-slate-400 mb-1 block">Growth (FW)</label>
                                            <input
                                                type="text"
                                                value={selectedKua.fu_wei || ""}
                                                onChange={(e) => setSelectedKua({ ...selectedKua, fu_wei: e.target.value })}
                                                className="w-full bg-slate-50 border p-3 rounded-xl font-bold"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[10px] uppercase font-black text-slate-400 mb-1 block">Bad Directions (Avoid)</label>
                                        <textarea
                                            value={selectedKua.bad_directions || ""}
                                            onChange={(e) => setSelectedKua({ ...selectedKua, bad_directions: e.target.value })}
                                            className="w-full bg-slate-50 border p-3 rounded-xl"
                                            rows={3}
                                        />
                                    </div>
                                    <button onClick={handleSaveKua} className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl">
                                        Save Kua Detail
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-8">
                            <div className="bg-white rounded-3xl border border-border overflow-hidden shadow-xl">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-slate-50 text-[10px] uppercase font-black text-slate-400 border-b">
                                            <th className="px-6 py-4">Kua</th>
                                            <th className="px-6 py-4">SQ / TY</th>
                                            <th className="px-6 py-4">YN / FW</th>
                                            <th className="px-6 py-4">Avoid</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {kuaDetails.map((k) => (
                                            <tr key={k.id} className="border-b hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-4 font-black text-primary text-lg">{k.kua_number}</td>
                                                <td className="px-6 py-4">
                                                    <div className="font-bold">{k.sheng_qi}</div>
                                                    <div className="text-[10px] text-slate-400">{k.tian_yi}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="font-bold">{k.yan_nian}</div>
                                                    <div className="text-[10px] text-slate-400">{k.fu_wei}</div>
                                                </td>
                                                <td className="px-6 py-4 text-xs text-red-500 font-medium">{k.bad_directions}</td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <button onClick={() => setSelectedKua(k)} className="p-2 hover:bg-amber-100 text-amber-600 rounded-lg"><PenTool size={14} /></button>
                                                        <button onClick={() => handleDeleteKua(k.id)} className="p-2 hover:bg-red-100 text-red-600 rounded-lg"><Trash2 size={14} /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
