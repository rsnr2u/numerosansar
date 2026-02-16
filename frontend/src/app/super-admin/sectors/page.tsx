"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Briefcase,
    Search,
    Plus,
    X,
    Save,
    Trash2,
    Edit3,
    Star,
    Sparkles,
    Database,
    ArrowLeft
} from "lucide-react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

const SEED_DATA = [
    {
        sector_name: "Technology & IT Services",
        primary_planet: "Mercury",
        chaldean_targets: "5, 14, 23, 32, 41, 50",
        pythagorean_targets: "5"
    },
    {
        sector_name: "Real Estate & Construction",
        primary_planet: "Saturn/Mars",
        chaldean_targets: "8, 17, 26, 35, 44",
        pythagorean_targets: "4, 8, 9"
    },
    {
        sector_name: "Luxury, Fashion & Arts",
        primary_planet: "Venus",
        chaldean_targets: "6, 15, 24, 33, 42, 51",
        pythagorean_targets: "6, 33"
    },
    {
        sector_name: "Finance, Banking & Law",
        primary_planet: "Jupiter",
        chaldean_targets: "3, 12, 21, 30, 39, 48",
        pythagorean_targets: "3, 22"
    },
    {
        sector_name: "Media, PR & Creative",
        primary_planet: "Sun/Mercury",
        chaldean_targets: "1, 10, 19, 28, 37, 46",
        pythagorean_targets: "1, 5"
    },
    {
        sector_name: "Healthcare & Healing",
        primary_planet: "Moon/Jupiter",
        chaldean_targets: "2, 7, 11, 20, 25, 29",
        pythagorean_targets: "2, 7, 11"
    }
];

export default function SuperAdminSectorsPage() {
    const router = useRouter();
    const [sectors, setSectors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [editingSector, setEditingSector] = useState<any>(null);
    const [formData, setFormData] = useState({
        sector_name: "",
        primary_planet: "",
        chaldean_targets: "",
        pythagorean_targets: "",
        lucky_numbers: ""
    });

    useEffect(() => {
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
        } catch (err) {
            console.error("Failed to fetch sectors", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        const finalData = {
            ...formData,
            lucky_numbers: formData.chaldean_targets,
            id: editingSector?.id
        };
        try {
            const resp = await api.post("/admin/business-lucky-numbers", finalData);
            if (resp.ok) {
                fetchSectors();
                setIsModalOpen(false);
                setEditingSector(null);
                setFormData({
                    sector_name: "",
                    primary_planet: "",
                    chaldean_targets: "",
                    pythagorean_targets: "",
                    lucky_numbers: ""
                });
            }
        } catch (err) {
            console.error("Save failed", err);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this sector?")) return;
        try {
            const resp = await api.delete(`/admin/business-lucky-numbers/${id}`);
            if (resp.ok) fetchSectors();
        } catch (err) {
            console.error("Delete failed", err);
        }
    };

    const handleSeed = async () => {
        if (!confirm("Add initial industry sectors?")) return;
        setIsSaving(true);
        try {
            for (const sector of SEED_DATA) {
                await api.post("/admin/business-lucky-numbers", { ...sector, lucky_numbers: sector.chaldean_targets });
            }
            fetchSectors();
        } catch (err) {
            console.error("Seeding failed", err);
        } finally {
            setIsSaving(false);
        }
    };

    const filteredSectors = sectors.filter(s =>
        s.sector_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter flex items-center gap-3 text-slate-900">
                        <span className="p-3 bg-black text-white rounded-2xl shadow-xl shadow-black/10">
                            <Briefcase size={28} />
                        </span>
                        BUSINESS <span className="text-slate-400 font-normal ml-1">SECTORS</span>
                    </h1>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mt-3 ml-1">Industry Vibration Matrix</p>
                </div>
                <div className="flex gap-4">
                    {sectors.length === 0 && (
                        <button
                            onClick={handleSeed}
                            disabled={isSaving}
                            className="px-6 py-3 bg-slate-50 border border-slate-100 text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center gap-2"
                        >
                            <Database size={16} /> Seed Base Data
                        </button>
                    )}
                    <button
                        onClick={() => {
                            setEditingSector(null);
                            setFormData({ sector_name: "", primary_planet: "", chaldean_targets: "", pythagorean_targets: "", lucky_numbers: "" });
                            setIsModalOpen(true);
                        }}
                        className="px-8 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:shadow-xl transition-all flex items-center gap-2"
                    >
                        <Plus size={16} /> Architect New Sector
                    </button>
                </div>
            </div>

            {/* Content Search */}
            <div className="flex justify-end">
                <div className="relative w-full md:w-96 group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-black transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Scan Industry Profiles..."
                        className="w-full bg-white border border-slate-100 rounded-2xl py-4 pl-14 pr-6 text-sm font-bold text-slate-900 outline-none focus:border-black/20 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Content Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => <div key={i} className="h-64 bg-slate-50 rounded-[2.5rem] animate-pulse" />)}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredSectors.map(sector => (
                        <motion.div
                            key={sector.id}
                            className="bg-white border border-slate-100 p-8 rounded-[2.5rem] relative overflow-hidden shadow-xl shadow-slate-200/50 group"
                        >
                            <div className="flex justify-between items-start gap-4 mb-6">
                                <div>
                                    <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Industrial Sector</div>
                                    <h3 className="text-2xl font-black text-slate-900 leading-tight uppercase">{sector.sector_name}</h3>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            setEditingSector(sector);
                                            setFormData({
                                                sector_name: sector.sector_name,
                                                primary_planet: sector.primary_planet || "",
                                                chaldean_targets: sector.chaldean_targets || "",
                                                pythagorean_targets: sector.pythagorean_targets || "",
                                                lucky_numbers: sector.lucky_numbers || ""
                                            });
                                            setIsModalOpen(true);
                                        }}
                                        className="p-2 bg-slate-50 text-slate-400 hover:text-black rounded-lg transition-colors border border-slate-100"
                                    >
                                        <Edit3 size={14} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(sector.id)}
                                        className="p-2 bg-slate-50 text-slate-300 hover:text-red-500 rounded-lg transition-colors border border-slate-100"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-slate-50">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                                        <Star size={12} className="text-amber-500 fill-amber-500" />
                                        Planet
                                    </div>
                                    <span className="text-xs font-black text-slate-900 border-b-2 border-amber-200">{sector.primary_planet || "---"}</span>
                                </div>

                                <div className="space-y-1">
                                    <div className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Chaldean</div>
                                    <div className="flex flex-wrap gap-1">
                                        {(sector.chaldean_targets || sector.lucky_numbers || "---").split(',').map((n: string, i: number) => (
                                            <span key={i} className="px-2.5 py-1 bg-slate-50 border border-slate-100 rounded-md text-[11px] font-bold text-slate-600">{n.trim()}</span>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <div className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Pythagorean</div>
                                    <div className="flex flex-wrap gap-1">
                                        {(sector.pythagorean_targets || "---").split(',').map((n: string, i: number) => (
                                            <span key={i} className="px-2.5 py-1 bg-slate-950 text-white rounded-md text-[11px] font-bold shadow-lg shadow-black/10">{n.trim()}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-950/20 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative w-full max-w-xl bg-white border border-slate-100 rounded-[3rem] shadow-2xl p-10 overflow-hidden">
                            <div className="flex justify-between items-center mb-10">
                                <h2 className="text-2xl font-black italic uppercase tracking-tight text-slate-900">{editingSector ? 'RE-ARCHITECT' : 'ARCHITECT'} <span className="text-slate-400 font-normal">PROFILE</span></h2>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-black transition-colors"><X size={24} /></button>
                            </div>
                            <form onSubmit={handleSave} className="space-y-6">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Industry Sector Name</label>
                                    <input required value={formData.sector_name} onChange={e => setFormData({ ...formData, sector_name: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 font-bold text-sm text-slate-900 outline-none focus:border-black/20 transition-all" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Primary Planet Alignment</label>
                                    <input value={formData.primary_planet} onChange={e => setFormData({ ...formData, primary_planet: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 font-bold text-sm text-slate-900 outline-none focus:border-black/20 transition-all" />
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Chaldean (Compound)</label>
                                        <input value={formData.chaldean_targets} onChange={e => setFormData({ ...formData, chaldean_targets: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 font-bold text-sm text-slate-900 outline-none focus:border-black/20 transition-all" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Pythagorean (Master)</label>
                                        <input value={formData.pythagorean_targets} onChange={e => setFormData({ ...formData, pythagorean_targets: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 font-bold text-sm text-slate-900 outline-none focus:border-black/20 transition-all" />
                                    </div>
                                </div>
                                <div className="pt-6">
                                    <button type="submit" disabled={isSaving} className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-widest text-sm hover:shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-2">
                                        <Save size={18} /> {isSaving ? 'Synching...' : 'Finalize Profile'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
