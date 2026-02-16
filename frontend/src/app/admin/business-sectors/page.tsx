"use client";

import { useState, useEffect } from "react";
import {
    Database,
    Search,
    Building2,
    Sparkles,
    BriefcaseBusiness,
    Plus,
    Edit3,
    Trash2,
    X as CloseIcon,
    Loader2,
    ArrowLeft,
    CheckCircle,
    Star
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

interface Sector {
    id: number;
    sector_name: string;
    sector_name_telugu: string;
    primary_planet: string;
    chaldean_targets: string;
    pythagorean_targets: string;
    lucky_numbers: string;
}

export default function BusinessSectorsPage() {
    const router = useRouter();
    const [sectors, setSectors] = useState<Sector[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [currentSector, setCurrentSector] = useState<Partial<Sector>>({
        sector_name: "",
        sector_name_telugu: "",
        primary_planet: "",
        chaldean_targets: "",
        pythagorean_targets: "",
        lucky_numbers: ""
    });

    useEffect(() => {
        setUserRole(localStorage.getItem('user_role'));
        fetchSectors();
    }, []);

    const fetchSectors = async () => {
        setLoading(true);
        try {
            const resp = await api.get("/admin/business-lucky-numbers");
            if (resp.ok) {
                const data = await resp.json();
                setSectors(Array.isArray(data) ? data : []);
            }
        } catch (error) {
            console.error("Failed to fetch sectors", error);
            setSectors([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        // Sync chaldean_targets to lucky_numbers for backward compatibility
        const finalData = {
            ...currentSector,
            lucky_numbers: currentSector.chaldean_targets || currentSector.lucky_numbers
        };

        try {
            const resp = await api.post("/admin/business-lucky-numbers", finalData);
            if (resp.ok) {
                setIsModalOpen(false);
                fetchSectors();
            }
        } catch (error) {
            console.error("Failed to save sector", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this sector?")) return;
        try {
            const resp = await api.delete(`/admin/business-lucky-numbers/${id}`);
            if (resp.ok) fetchSectors();
        } catch (error) {
            console.error("Failed to delete sector", error);
        }
    };

    const filteredSectors = sectors.filter(s =>
        s.sector_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.sector_name_telugu?.includes(searchTerm)
    );

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-20 px-4 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-5">
                    <button
                        onClick={() => router.back()}
                        className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-black/20 transition-all text-slate-400 hover:text-black shadow-sm"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-3xl font-black flex items-center gap-3 text-slate-900 tracking-tight">
                            <span className="p-2.5 bg-black/5 rounded-xl text-black">
                                <BriefcaseBusiness size={24} />
                            </span>
                            Business Sectors
                        </h1>
                        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-1 ml-1">Master Business Sector Matrix</p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                    <div className="relative group w-full sm:min-w-[300px]">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-black transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Search industry profiles..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-11 pr-6 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-black/30 transition-all font-bold text-sm shadow-sm"
                        />
                    </div>
                    {userRole === 'super_admin' && (
                        <button
                            onClick={() => {
                                setCurrentSector({ sector_name: "", sector_name_telugu: "", primary_planet: "", chaldean_targets: "", pythagorean_targets: "", lucky_numbers: "" });
                                setIsModalOpen(true);
                            }}
                            className="px-6 py-3 bg-slate-900 text-white font-black rounded-xl shadow-lg hover:shadow-slate-200 transition-all flex items-center gap-2 active:scale-95 whitespace-nowrap text-sm"
                        >
                            <Plus size={18} /> Add New Sector
                        </button>
                    )}
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="h-64 rounded-[2.5rem] bg-slate-50 animate-pulse border border-slate-100" />
                    ))}
                </div>
            ) : filteredSectors.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredSectors.map((sector, index) => (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            key={sector.id}
                            className="bg-white border border-slate-100 p-8 rounded-[2.5rem] relative overflow-hidden shadow-xl shadow-slate-200/50 group hover:border-black/10 transition-all"
                        >
                            <div className="relative space-y-6">
                                <div className="flex justify-between items-start gap-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Industrial Sector</span>
                                        </div>
                                        <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-tight uppercase">
                                            {sector.sector_name}
                                        </h3>
                                        <p className="text-sm text-slate-400 font-medium telugu-font mt-1">
                                            {sector.sector_name_telugu}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {userRole === 'super_admin' && (
                                            <>
                                                <button
                                                    onClick={() => {
                                                        setCurrentSector(sector);
                                                        setIsModalOpen(true);
                                                    }}
                                                    className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:text-black transition-all border border-slate-100"
                                                >
                                                    <Edit3 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(sector.id)}
                                                    className="p-2.5 rounded-xl bg-slate-50 text-slate-300 hover:text-red-500 transition-all border border-slate-100"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-4 pt-4 border-t border-slate-50">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                            <Star size={12} className="text-amber-500 fill-amber-500" />
                                            Primary Planet
                                        </div>
                                        <span className="text-xs font-black text-slate-900 border-b-2 border-amber-200">{sector.primary_planet || "---"}</span>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Chaldean Targets</div>
                                        <div className="flex flex-wrap gap-1.5">
                                            {(sector.chaldean_targets || sector.lucky_numbers || "---").split(",").map((num, i) => (
                                                <div key={i} className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-100 text-slate-900 font-bold text-sm min-w-[2.5rem] flex items-center justify-center">
                                                    {num.trim()}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Pythagorean Targets</div>
                                        <div className="flex flex-wrap gap-1.5">
                                            {(sector.pythagorean_targets || "---").split(",").map((num, i) => (
                                                <div key={i} className="px-3 py-1.5 rounded-lg bg-slate-950 text-white font-bold text-sm min-w-[2.5rem] flex items-center justify-center shadow-lg shadow-black/10">
                                                    {num.trim()}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-32 space-y-4 bg-slate-50 rounded-[3rem] border-4 border-dashed border-slate-100">
                    <Database size={64} className="text-slate-200 animate-bounce" />
                    <p className="text-2xl font-black text-slate-300">No industry profiles found</p>
                </div>
            )}

            {/* CRUD Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-slate-950/20 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-xl bg-white p-8 rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100"
                        >
                            <div className="space-y-8">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-slate-50 rounded-lg text-slate-900">
                                            <Building2 size={24} />
                                        </div>
                                        <h2 className="text-3xl font-black tracking-tight">{currentSector.id ? 'Edit' : 'Add'} Sector</h2>
                                    </div>
                                    <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
                                        <CloseIcon size={24} className="text-slate-400" />
                                    </button>
                                </div>

                                <form onSubmit={handleSave} className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Sector Name</label>
                                            <input
                                                required
                                                type="text"
                                                value={currentSector.sector_name}
                                                onChange={(e) => setCurrentSector({ ...currentSector, sector_name: e.target.value })}
                                                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-black/20 transition-all font-bold text-sm"
                                                placeholder="e.g. Technology"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Telugu Name</label>
                                            <input
                                                type="text"
                                                value={currentSector.sector_name_telugu}
                                                onChange={(e) => setCurrentSector({ ...currentSector, sector_name_telugu: e.target.value })}
                                                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-black/20 transition-all font-bold text-sm telugu-font"
                                                placeholder="టెక్నాలజీ"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Primary Planet</label>
                                        <input
                                            type="text"
                                            value={currentSector.primary_planet}
                                            onChange={(e) => setCurrentSector({ ...currentSector, primary_planet: e.target.value })}
                                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-black/20 transition-all font-bold text-sm"
                                            placeholder="e.g. Mercury"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Chaldean Targets</label>
                                            <input
                                                required
                                                type="text"
                                                value={currentSector.chaldean_targets}
                                                onChange={(e) => setCurrentSector({ ...currentSector, chaldean_targets: e.target.value })}
                                                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-black/20 transition-all font-bold text-sm"
                                                placeholder="5, 14, 23"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Pythagorean Targets</label>
                                            <input
                                                type="text"
                                                value={currentSector.pythagorean_targets}
                                                onChange={(e) => setCurrentSector({ ...currentSector, pythagorean_targets: e.target.value })}
                                                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-black/20 transition-all font-bold text-sm"
                                                placeholder="5, 1, 9"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        disabled={isSaving}
                                        type="submit"
                                        className="w-full py-5 bg-slate-900 text-white font-black text-lg rounded-2xl shadow-xl hover:shadow-slate-200 transition-all active:scale-95 flex items-center justify-center gap-3 mt-4"
                                    >
                                        {isSaving ? (
                                            <Loader2 size={24} className="animate-spin" />
                                        ) : (
                                            <>
                                                <CheckCircle size={24} /> {currentSector.id ? 'Sync Sector' : 'Finalize Profile'}
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
