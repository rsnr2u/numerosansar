"use client";

import { useEffect, useState } from "react";
import { ListMusic, PenTool, Plus, Trash2, Save, Download, Search, FileText, X, AlertOctagon } from "lucide-react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { motion, AnimatePresence } from "framer-motion";

interface Rule {
    id: number;
    type: "Vowel" | "Consonant";
    number: number;
    notes: string;
}

export default function VowelConsonantRulesPage() {
    const [rules, setRules] = useState<Rule[]>([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState<Partial<Rule>>({});
    const [searchTerm, setSearchTerm] = useState("");
    const [typeFilter, setTypeFilter] = useState("All");
    const [userRole, setUserRole] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        setUserRole(localStorage.getItem('user_role'));
    }, []);

    useEffect(() => {
        fetchRules();
    }, []);

    const fetchRules = async () => {
        try {
            const response = await api.get("/admin/vowel-consonant-rules");
            const data = await response.json();
            setRules(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const exportCSV = () => {
        const header = ["Type", "Number", "Notes"];
        const rows = filteredRules.map(r => [r.type, r.number, `"${r.notes.replace(/"/g, '""')}"`]);
        const csvContent = [
            header.join(","),
            ...rows.map(r => r.join(","))
        ].join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        saveAs(blob, "vowel_consonant_rules.csv");
    };

    const exportExcel = () => {
        const ws = XLSX.utils.json_to_sheet(filteredRules.map(r => ({
            Type: r.type,
            Number: r.number,
            Notes: r.notes
        })));
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Rules");
        XLSX.writeFile(wb, "vowel_consonant_rules.xlsx");
    };

    const exportPDF = () => {
        const doc = new jsPDF();
        doc.text("Bad Numbers for Vowels & Consonants", 14, 15);
        autoTable(doc, {
            head: [["Type", "Number", "Notes"]],
            body: filteredRules.map(r => [r.type, r.number, r.notes]),
            startY: 20,
        });
        doc.save("vowel_consonant_rules.pdf");
    };

    const filteredRules = rules.filter(r => {
        const matchesSearch = r.number.toString().includes(searchTerm) ||
            r.notes.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesType = typeFilter === "All" || r.type === typeFilter;

        return matchesSearch && matchesType;
    });

    const handleSave = async () => {
        try {
            await api.post("/admin/vowel-consonant-rules", {
                id: selected.id?.toString() || "",
                type: selected.type || "Vowel",
                number: selected.number?.toString() || "",
                notes: selected.notes || ""
            });
            setSelected({});
            fetchRules();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Delete this rule?")) return;
        try {
            await api.delete(`/admin/vowel-consonant-rules/${id}`);
            fetchRules();
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
                        <span className="p-2.5 bg-astro-gradient rounded-xl shadow-lg shadow-red-500/20 text-white">
                            <AlertOctagon size={24} />
                        </span>
                        <span className="bg-clip-text text-black">Vowel & Consonant Rules</span>
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1 ml-1">Define numbers that are not favorable for names</p>
                </div>

                {/* Search & Filter Controls */}
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="bg-card/50 backdrop-blur-md border border-border rounded-xl px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-inner font-semibold"
                    >
                        <option value="All">All Types</option>
                        <option value="Vowel">Vowels</option>
                        <option value="Consonant">Consonants</option>
                    </select>

                    <div className="relative group flex-grow md:flex-grow-0">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={16} />
                        <input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search numbers..."
                            className="bg-card/50 backdrop-blur-md border border-border rounded-xl pl-10 pr-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all w-full md:w-64 shadow-inner"
                        />
                    </div>
                    {userRole === 'super_admin' && (
                        <div className="flex items-center gap-2 p-1 bg-card/30 backdrop-blur-sm rounded-2xl border border-border shadow-sm">
                            <button onClick={exportCSV} className="p-2.5 hover:bg-white/5 rounded-xl text-muted-foreground hover:text-foreground transition-all">
                                <FileText size={20} />
                            </button>
                            <button onClick={exportExcel} className="p-2.5 hover:bg-green-500/10 text-green-500 rounded-xl transition-all">
                                <Plus size={20} className="rotate-45" />
                            </button>
                            <button onClick={exportPDF} className="p-2.5 hover:bg-red-500/10 text-red-500 rounded-xl transition-all">
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
                            <h2 className="text-xl font-black mb-6 flex items-center gap-3">
                                {selected.id ? (
                                    <span className="p-1.5 bg-amber-500/10 rounded-lg"><PenTool size={18} className="text-amber-500" /></span>
                                ) : (
                                    <span className="p-1.5 bg-green-500/10 rounded-lg"><Plus size={18} className="text-green-500" /></span>
                                )}
                                {selected.id ? "Edit Rule" : "New Rule"}
                            </h2>

                            <div className="space-y-6">
                                <div>
                                    <label className="text-[10px] uppercase tracking-widest text-muted-foreground block mb-2 font-black">Rule Type</label>
                                    <div className="flex gap-2">
                                        {["Vowel", "Consonant"].map((type) => (
                                            <button
                                                key={type}
                                                onClick={() => setSelected({ ...selected, type: type as any })}
                                                className={`flex-1 py-2 px-4 rounded-xl text-sm font-bold transition-all border ${selected.type === type
                                                    ? "bg-primary/10 border-primary text-primary shadow-lg shadow-primary/10"
                                                    : "bg-input/20 border-border/50 text-muted-foreground hover:border-border"
                                                    }`}
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] uppercase tracking-widest text-muted-foreground block mb-2 font-black">Bad Number</label>
                                    <input
                                        type="number"
                                        value={selected.number || ""}
                                        onChange={(e) => setSelected({ ...selected, number: parseInt(e.target.value) })}
                                        className="w-full bg-input/20 border border-border/50 rounded-xl p-3 outline-none text-foreground focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-lg font-bold"
                                        placeholder="e.g. 18"
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] uppercase tracking-widest text-muted-foreground block mb-2 font-black">Notes (Why it is bad)</label>
                                    <textarea
                                        rows={4}
                                        value={selected.notes || ""}
                                        onChange={(e) => setSelected({ ...selected, notes: e.target.value })}
                                        className="w-full bg-input/20 border border-border/50 rounded-xl p-3 outline-none text-foreground focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-sm leading-relaxed"
                                        placeholder="Enter reasoning..."
                                    />
                                </div>

                                <button
                                    onClick={handleSave}
                                    disabled={!selected.number || !selected.type}
                                    className="w-full py-4 bg-astro-gradient text-white font-black rounded-2xl hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-3 shadow-xl shadow-red-500/20 disabled:opacity-50 disabled:scale-100"
                                >
                                    <Save size={18} /> {selected.id ? "Update Rule" : "Save Rule"}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* List Section */}
                <div className={userRole === 'super_admin' ? 'lg:col-span-8' : 'lg:col-span-1'}>
                    <div className="space-y-4">
                        <AnimatePresence mode="popLayout">
                            {filteredRules.map((rule, idx) => (
                                <motion.div
                                    key={rule.id}
                                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: -20 }}
                                    transition={{ duration: 0.3, delay: Math.min(idx * 0.05, 0.5) }}
                                    className="glass-card p-6 bg-card/40 border border-border/50 rounded-3xl hover:border-red-500/30 transition-all group relative overflow-hidden"
                                >
                                    <div className="flex items-center gap-6 relative z-10">
                                        <div className="flex-shrink-0">
                                            <div className={`w-14 h-14 flex items-center justify-center rounded-2xl text-2xl font-black text-white shadow-lg transition-transform group-hover:scale-110 ${rule.type === 'Vowel' ? 'bg-indigo-500 shadow-indigo-500/20' : 'bg-rose-500 shadow-rose-500/20'}`}>
                                                {rule.number}
                                            </div>
                                        </div>

                                        <div className="flex-grow">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-3">
                                                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${rule.type === 'Vowel' ? 'bg-indigo-500/10 text-indigo-500' : 'bg-rose-500/10 text-rose-500'}`}>
                                                        {rule.type} Rule
                                                    </span>
                                                    <h3 className="text-lg font-black">{rule.number} is unfavorable</h3>
                                                </div>
                                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                                    {userRole === 'super_admin' && (
                                                        <>
                                                            <button onClick={() => setSelected(rule)} className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-lg border border-border shadow-sm">
                                                                <PenTool size={16} />
                                                            </button>
                                                            <button onClick={() => handleDelete(rule.id)} className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-lg border border-border shadow-sm">
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                            <p className="text-muted-foreground text-sm font-medium italic">
                                                {rule.notes || "No additional notes provided."}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-red-500/10 transition-colors"></div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {filteredRules.length === 0 && (
                            <div className="text-center py-24 bg-card/20 rounded-3xl border border-dashed border-border">
                                <AlertOctagon size={48} className="mx-auto text-muted-foreground/20 mb-4" />
                                <p className="text-muted-foreground font-medium">No rules found for this search.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
