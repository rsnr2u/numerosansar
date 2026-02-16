"use client";

import { useEffect, useState } from "react";
import { Star, PenTool, Plus, Trash2, Save, Download, Search, FileText, X, Sparkles, Shield, Radiation, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { motion, AnimatePresence } from "framer-motion";

interface AuspiciousNumber {
    id: number;
    planet_number: number;
    planet_name: string;
    friend_numbers: string;
    enemy_numbers: string;
    neutral_numbers: string;
}

export default function AuspiciousNumbersPage() {
    const [data, setData] = useState<AuspiciousNumber[]>([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState<Partial<AuspiciousNumber>>({});
    const [searchTerm, setSearchTerm] = useState("");
    const [userRole, setUserRole] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        setUserRole(localStorage.getItem('user_role'));
    }, []);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await api.get("/admin/planet-relations");
            const result = await response.json();
            // Sort by root number
            result.sort((a: any, b: any) => a.planet_number - b.planet_number);
            setData(result);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const exportCSV = () => {
        const header = ["Root No", "Planet", "Friend Numbers", "Enemy Numbers", "Neutral Numbers"];
        const rows = data.map(d => [d.planet_number, d.planet_name, d.friend_numbers, d.enemy_numbers, d.neutral_numbers]);
        const csvContent = [
            header.join(","),
            ...rows.map(r => r.join(","))
        ].join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        saveAs(blob, "auspicious_numbers_matrix.csv");
    };

    const exportExcel = () => {
        const ws = XLSX.utils.json_to_sheet(data.map(d => ({
            "Planet Number": d.planet_number,
            "Planet": d.planet_name,
            "Friend Numbers": d.friend_numbers,
            "Enemy Numbers": d.enemy_numbers,
            "Neutral Numbers": d.neutral_numbers
        })));
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Matrix");
        XLSX.writeFile(wb, "auspicious_numbers_matrix.xlsx");
    };

    const exportPDF = () => {
        const doc = new jsPDF();
        doc.text("Auspicious Numbers (Planetary Compatibility Matrix)", 14, 15);
        autoTable(doc, {
            head: [["Planet No.", "Planet", "Friends", "Enemies", "Neutrals"]],
            body: data.map(d => [d.planet_number, d.planet_name, d.friend_numbers, d.enemy_numbers, d.neutral_numbers]),
            startY: 20,
        });
        doc.save("auspicious_numbers_matrix.pdf");
    };

    const filteredData = data.filter(d => {
        return d.planet_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            d.planet_number?.toString().includes(searchTerm) ||
            d.friend_numbers?.includes(searchTerm) ||
            d.enemy_numbers?.includes(searchTerm) ||
            d.neutral_numbers?.includes(searchTerm);
    });

    const handleSave = async () => {
        try {
            await api.post("/admin/planet-relations", {
                id: selected.id?.toString() || "",
                planet_number: selected.planet_number?.toString() || "",
                planet_name: selected.planet_name || "",
                friend_numbers: selected.friend_numbers || "",
                enemy_numbers: selected.enemy_numbers || "",
                neutral_numbers: selected.neutral_numbers || ""
            });
            setSelected({});
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Delete this entry?")) return;
        try {
            await api.delete(`/admin/planet-relations/${id}`);
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-20 px-4 md:px-0">
            {/* Header Section */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
            >
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
                        <span className="p-2.5 bg-astro-gradient rounded-xl shadow-lg shadow-mystic-gold/20 text-white">
                            <Star size={24} fill="currentColor" />
                        </span>
                        <span className="bg-clip-text text-black">Auspicious Matrix</span>
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1 ml-1">Planetary compatibility for root numbers 1-9</p>
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    <div className="relative group flex-grow md:flex-grow-0">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={16} />
                        <input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search root, planet or number..."
                            className="bg-card/50 backdrop-blur-md border border-border rounded-xl pl-10 pr-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all w-full md:w-64 shadow-inner"
                        />
                    </div>
                    {userRole === 'super_admin' && (
                        <div className="flex items-center gap-2 p-1 bg-card/30 backdrop-blur-sm rounded-2xl border border-border shadow-sm">
                            <button onClick={exportCSV} className="p-2.5 hover:bg-white/5 rounded-xl text-muted-foreground hover:text-foreground transition-all" title="Export CSV">
                                <FileText size={20} />
                            </button>
                            <button onClick={exportExcel} className="p-2.5 hover:bg-green-500/10 text-green-500 rounded-xl transition-all" title="Export Excel">
                                <XlIcon size={20} />
                            </button>
                            <button onClick={exportPDF} className="p-2.5 hover:bg-red-500/10 text-red-500 rounded-xl transition-all" title="Export PDF">
                                <Download size={20} />
                            </button>
                        </div>
                    )}
                </div>
            </motion.div>

            <div className={`grid grid-cols-1 ${userRole === 'super_admin' ? 'lg:grid-cols-12' : 'lg:grid-cols-1'} gap-10`}>
                {/* Editor Section */}
                {userRole === 'super_admin' && (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-4"
                    >
                        <div className="glass-card p-6 bg-card/60 rounded-3xl border border-border/50 sticky top-28 shadow-2xl backdrop-blur-xl">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-black flex items-center gap-3">
                                    {selected.id ? (
                                        <span className="p-1.5 bg-amber-500/10 rounded-lg"><PenTool size={18} className="text-amber-500" /></span>
                                    ) : (
                                        <span className="p-1.5 bg-green-500/10 rounded-lg"><Plus size={18} className="text-green-500" /></span>
                                    )}
                                    {selected.id ? "Edit Matrix Row" : "Add Matrix Row"}
                                </h2>
                                {selected.id && (
                                    <button onClick={() => setSelected({})} className="p-2 hover:bg-white/5 rounded-full text-muted-foreground transition-colors">
                                        <X size={18} />
                                    </button>
                                )}
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] uppercase tracking-widest text-muted-foreground block mb-1.5 font-black">Planet No</label>
                                        <input
                                            type="number"
                                            value={selected.planet_number || ""}
                                            onChange={(e) => setSelected({ ...selected, planet_number: parseInt(e.target.value) })}
                                            className="w-full bg-input/20 border border-border/50 rounded-xl p-2.5 outline-none text-foreground focus:border-amber-500 font-bold"
                                            placeholder="1-9"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] uppercase tracking-widest text-muted-foreground block mb-1.5 font-black">Planet Name</label>
                                        <input
                                            type="text"
                                            value={selected.planet_name || ""}
                                            onChange={(e) => setSelected({ ...selected, planet_name: e.target.value })}
                                            className="w-full bg-input/20 border border-border/50 rounded-xl p-2.5 outline-none text-foreground focus:border-amber-500 font-bold"
                                            placeholder="SUN..."
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] uppercase tracking-widest text-muted-foreground block mb-1.5 font-black flex items-center gap-2">
                                        <Shield size={10} className="text-green-500" /> Friend Numbers
                                    </label>
                                    <input
                                        type="text"
                                        value={selected.friend_numbers || ""}
                                        onChange={(e) => setSelected({ ...selected, friend_numbers: e.target.value })}
                                        className="w-full bg-input/20 border border-border/50 rounded-xl p-2.5 outline-none text-foreground focus:border-green-500"
                                        placeholder="2, 3, 7, 9"
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] uppercase tracking-widest text-muted-foreground block mb-1.5 font-black flex items-center gap-2">
                                        <Radiation size={10} className="text-red-500" /> Enemy Numbers
                                    </label>
                                    <input
                                        type="text"
                                        value={selected.enemy_numbers || ""}
                                        onChange={(e) => setSelected({ ...selected, enemy_numbers: e.target.value })}
                                        className="w-full bg-input/20 border border-border/50 rounded-xl p-2.5 outline-none text-foreground focus:border-red-500"
                                        placeholder="6, 8"
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] uppercase tracking-widest text-muted-foreground block mb-1.5 font-black flex items-center gap-2">
                                        <Zap size={10} className="text-blue-500" /> Neutral Numbers
                                    </label>
                                    <input
                                        type="text"
                                        value={selected.neutral_numbers || ""}
                                        onChange={(e) => setSelected({ ...selected, neutral_numbers: e.target.value })}
                                        className="w-full bg-input/20 border border-border/50 rounded-xl p-2.5 outline-none text-foreground focus:border-blue-500"
                                        placeholder="4, 5"
                                    />
                                </div>

                                <button
                                    onClick={handleSave}
                                    disabled={!selected.planet_number || !selected.planet_name}
                                    className="w-full py-3.5 bg-astro-gradient text-white font-black rounded-2xl hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-3 shadow-xl shadow-primary/20 mt-4"
                                >
                                    <Save size={18} /> {selected.id ? "Update Matrix" : "Add to Matrix"}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Table Section */}
                <div className={`${userRole === 'super_admin' ? 'lg:col-span-8' : 'lg:col-span-1'} overflow-x-auto`}>
                    <div className="glass-card bg-card/40 rounded-3xl border border-border/50 overflow-hidden shadow-xl">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-muted/50 text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground border-b border-border">
                                    <th className="px-6 py-4">Root</th>
                                    <th className="px-6 py-4">Planet</th>
                                    <th className="px-6 py-4">Friends</th>
                                    <th className="px-6 py-4">Enemies</th>
                                    <th className="px-6 py-4">Neutrals</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <AnimatePresence mode="popLayout">
                                    {filteredData.map((item, idx) => (
                                        <motion.tr
                                            key={item.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="border-b border-border/30 hover:bg-white/5 transition-colors group"
                                        >
                                            <td className="px-6 py-4 font-black text-[#10B981] text-lg">{item.planet_number}</td>
                                            <td className="px-6 py-4 font-bold">{item.planet_name}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-1">
                                                    {(item.friend_numbers || "").split(",").map((n, i) => (
                                                        n.trim() && <span key={i} className="px-1.5 py-0.5 bg-green-500/10 text-green-500 rounded text-xs font-bold">{n.trim()}</span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-1">
                                                    {(item.enemy_numbers || "").split(",").map((n, i) => (
                                                        n.trim() && <span key={i} className="px-1.5 py-0.5 bg-red-500/10 text-red-500 rounded text-xs font-bold">{n.trim()}</span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-1">
                                                    {(item.neutral_numbers || "").split(",").map((n, i) => (
                                                        n.trim() && <span key={i} className="px-1.5 py-0.5 bg-blue-500/10 text-blue-500 rounded text-xs font-bold">{n.trim()}</span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {userRole === 'super_admin' && (
                                                        <>
                                                            <button onClick={() => setSelected(item)} className="p-1.5 hover:bg-amber-500/10 text-amber-500 rounded-lg">
                                                                <PenTool size={14} />
                                                            </button>
                                                            <button onClick={() => handleDelete(item.id)} className="p-1.5 hover:bg-red-500/10 text-red-500 rounded-lg">
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>

                        {filteredData.length === 0 && (
                            <div className="text-center py-20">
                                <Search size={40} className="mx-auto text-muted-foreground/20 mb-3" />
                                <p className="text-muted-foreground font-medium">No records match your search.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function XlIcon({ size }: { size: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
            <path d="M8 13l4 4" />
            <path d="M12 13l-4 4" />
        </svg>
    )
}
