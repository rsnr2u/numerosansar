"use client";

import { useEffect, useState } from "react";
import { Sparkles, PenTool, Plus, Trash2, Save, Download, Search, FileText, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { motion, AnimatePresence } from "framer-motion";

interface LuckyNameNumber {
    id: number;
    number: string;
    vibe: string;
    great_for: string;
}

export default function LuckyNameNumbersPage() {
    const [data, setData] = useState<LuckyNameNumber[]>([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState<Partial<LuckyNameNumber>>({});
    const [searchTerm, setSearchTerm] = useState("");
    const [userRole, setUserRole] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        setUserRole(localStorage.getItem('user_role'));
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await api.get("/admin/lucky-name-numbers");
            const result = await response.json();
            setData(result);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const exportCSV = () => {
        const header = ["Number", "Vibe", "Great For"];
        const rows = data.map(d => [d.number, d.vibe, d.great_for]);
        const csvContent = [
            header.join(","),
            ...rows.map(r => r.join(","))
        ].join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        saveAs(blob, "lucky_name_numbers.csv");
    };

    const exportExcel = () => {
        const ws = XLSX.utils.json_to_sheet(data.map(d => ({
            "Number": d.number,
            "Vibe": d.vibe,
            "Great For": d.great_for
        })));
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Lucky Names");
        XLSX.writeFile(wb, "lucky_name_numbers.xlsx");
    };

    const exportPDF = () => {
        const doc = new jsPDF();
        doc.text("Lucky Name Numbers (Quick Guide)", 14, 15);
        autoTable(doc, {
            head: [["Number", "Vibe", "Great For"]],
            body: data.map(d => [d.number, d.vibe, d.great_for]),
            startY: 20,
        });
        doc.save("lucky_name_numbers.pdf");
    };

    const filteredData = data.filter(d => {
        return d.number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            d.vibe?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            d.great_for?.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const handleSave = async () => {
        try {
            await api.post("/admin/lucky-name-numbers", {
                id: selected.id?.toString() || "",
                number: selected.number || "",
                vibe: selected.vibe || "",
                great_for: selected.great_for || ""
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
            await api.delete(`/admin/lucky-name-numbers/${id}`);
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
                        <span className="p-2.5 bg-gradient-to-br from-[#F7D700] to-[#E61111] rounded-xl shadow-lg text-white">
                            <Sparkles size={24} fill="currentColor" />
                        </span>
                        <span className="bg-clip-text text-black">Lucky Name Numbers</span>
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1 ml-1">Quick guide for brand and personal names</p>
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    <div className="relative group flex-grow md:flex-grow-0">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={16} />
                        <input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search numbers, vibe..."
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
                                    {selected.id ? "Edit Entry" : "Add Entry"}
                                </h2>
                                {selected.id && (
                                    <button onClick={() => setSelected({})} className="p-2 hover:bg-white/5 rounded-full text-muted-foreground transition-colors">
                                        <X size={18} />
                                    </button>
                                )}
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] uppercase tracking-widest text-muted-foreground block mb-1.5 font-black">Number(s)</label>
                                    <input
                                        type="text"
                                        value={selected.number || ""}
                                        onChange={(e) => setSelected({ ...selected, number: e.target.value })}
                                        className="w-full bg-input/20 border border-border/50 rounded-xl p-2.5 outline-none text-foreground focus:border-primary font-bold"
                                        placeholder="e.g., 1, 11/22/33"
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] uppercase tracking-widest text-muted-foreground block mb-1.5 font-black">Vibe</label>
                                    <textarea
                                        value={selected.vibe || ""}
                                        onChange={(e) => setSelected({ ...selected, vibe: e.target.value })}
                                        className="w-full bg-input/20 border border-border/50 rounded-xl p-2.5 outline-none text-foreground focus:border-primary min-h-[80px]"
                                        placeholder="Enter vibe description..."
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] uppercase tracking-widest text-muted-foreground block mb-1.5 font-black">Great For</label>
                                    <textarea
                                        value={selected.great_for || ""}
                                        onChange={(e) => setSelected({ ...selected, great_for: e.target.value })}
                                        className="w-full bg-input/20 border border-border/50 rounded-xl p-2.5 outline-none text-foreground focus:border-primary min-h-[80px]"
                                        placeholder="Enter what it is great for..."
                                    />
                                </div>

                                <button
                                    onClick={handleSave}
                                    disabled={!selected.number || !selected.vibe}
                                    className="w-full py-3.5 bg-gradient-to-r from-[#F7D700] to-[#E61111] text-white font-black rounded-2xl hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-3 shadow-xl mt-4"
                                >
                                    <Save size={18} /> {selected.id ? "Update Entry" : "Save Entry"}
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
                                    <th className="px-6 py-4">Number</th>
                                    <th className="px-6 py-4">Vibe</th>
                                    <th className="px-6 py-4">Great For</th>
                                    {userRole === 'super_admin' && <th className="px-6 py-4 text-right">Actions</th>}
                                </tr>
                            </thead>
                            <tbody>
                                <AnimatePresence mode="popLayout">
                                    {filteredData.map((item) => (
                                        <motion.tr
                                            key={item.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="border-b border-border/30 hover:bg-white/5 transition-colors group"
                                        >
                                            <td className="px-6 py-4 font-black text-[#10B981] text-lg">{item.number}</td>
                                            <td className="px-6 py-4 text-sm">{item.vibe}</td>
                                            <td className="px-6 py-4 text-sm font-medium text-slate-600">{item.great_for}</td>
                                            {userRole === 'super_admin' && (
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button onClick={() => setSelected(item)} className="p-1.5 hover:bg-amber-500/10 text-amber-500 rounded-lg">
                                                            <PenTool size={14} />
                                                        </button>
                                                        <button onClick={() => handleDelete(item.id)} className="p-1.5 hover:bg-red-500/10 text-red-500 rounded-lg">
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                </td>
                                            )}
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>

                        {filteredData.length === 0 && (
                            <div className="text-center py-20">
                                <Search size={40} className="mx-auto text-muted-foreground/20 mb-3" />
                                <p className="text-muted-foreground font-medium">No records found.</p>
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
