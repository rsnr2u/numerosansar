import { useEffect, useState } from "react";
import { Database, PenTool, Plus, Trash2, Save, Download, Search, FileText, X, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { motion, AnimatePresence } from "framer-motion";

interface CompoundNumber {
    id: number;
    title: string;
    description: string;
    number: number;
    result: string;
    description_telugu?: string;
    description_hindi?: string;
    description_bengali?: string;
    description_devanagari?: string;
    description_kannada?: string;
    description_tamil?: string;
    description_malayalam?: string;
    description_gujarati?: string;
}

export default function AdminCompounds() {
    const [compounds, setCompounds] = useState<CompoundNumber[]>([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState<Partial<CompoundNumber>>({});
    const [searchTerm, setSearchTerm] = useState("");
    const [resultFilter, setResultFilter] = useState("All");
    const [userRole, setUserRole] = useState<string | null>(null);
    const [editLang, setEditLang] = useState<string>("en");
    const navigate = useNavigate();

    const LANGUAGES = [
        { code: 'en', label: 'English' },
        { code: 'telugu', label: 'Telugu' },
        { code: 'hindi', label: 'Hindi' },
        { code: 'bengali', label: 'Bengali' },
        { code: 'devanagari', label: 'Devanagari' },
        { code: 'kannada', label: 'Kannada' },
        { code: 'tamil', label: 'Tamil' },
        { code: 'malayalam', label: 'Malayalam' },
        { code: 'gujarati', label: 'Gujarati' }
    ];

    useEffect(() => {
        setUserRole(localStorage.getItem('user_role'));
    }, []);

    useEffect(() => {
        fetchCompounds();
    }, []);

    const fetchCompounds = async () => {
        try {
            const response = await api.get("/admin/meanings");
            const data = await response.json();
            // Sort by number
            data.sort((a: any, b: any) => a.number - b.number);
            setCompounds(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const exportCSV = () => {
        const header = ["Number", "Name", "Description", "Result"];
        const rows = filteredCompounds.map(c => [c.number, c.title, `"${c.description.replace(/"/g, '""')}"`, c.result]);
        const csvContent = [
            header.join(","),
            ...rows.map(r => r.join(","))
        ].join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        saveAs(blob, "compound_numbers.csv");
    };

    const exportExcel = () => {
        const ws = XLSX.utils.json_to_sheet(filteredCompounds.map(c => ({
            Number: c.number,
            Name: c.title,
            Description: c.description,
            Result: c.result
        })));
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Compounds");
        XLSX.writeFile(wb, "compound_numbers.xlsx");
    };

    const exportPDF = () => {
        const doc = new jsPDF();
        doc.text("Compound Numbers Report", 14, 15);
        autoTable(doc, {
            head: [["No.", "Name", "Result", "Description"]],
            body: filteredCompounds.map(c => [c.number, c.title, c.result, c.description]),
            startY: 20,
        });
        doc.save("compound_numbers.pdf");
    };

    const filteredCompounds = compounds.filter(c => {
        const matchesSearch = c.number.toString().includes(searchTerm) ||
            c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.description.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesResult = resultFilter === "All" || c.result === resultFilter;

        return matchesSearch && matchesResult;
    });

    const handleSave = async () => {
        try {
            const payload = {
                id: selected.id?.toString() || "",
                number: selected.number?.toString() || "",
                title: selected.title || "",
                description: selected.description || "",
                result: selected.result || "Good",
                description_telugu: selected.description_telugu || "",
                description_hindi: selected.description_hindi || "",
                description_bengali: selected.description_bengali || "",
                description_devanagari: selected.description_devanagari || "",
                description_kannada: selected.description_kannada || "",
                description_tamil: selected.description_tamil || "",
                description_malayalam: selected.description_malayalam || "",
                description_gujarati: selected.description_gujarati || ""
            };
            await api.post("/admin/meanings", payload);
            setSelected({});
            fetchCompounds();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Delete this entry?")) return;
        try {
            await api.delete(`/admin/meanings/${id}`);
            fetchCompounds();
        } catch (err) {
            console.error(err);
        }
    };

    const getResultClass = (result: string) => {
        const res = result?.toLowerCase().replace(" ", "") || "good";
        return `result-${res}`;
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
                        <span className="p-2.5 bg-astro-gradient rounded-xl shadow-lg shadow-mystic-gold/20">
                            <Database size={24} className="text-white" />
                        </span>
                        <span className="bg-clip-text text-black">Compound Numbers</span>
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1 ml-1">Manage esoteric meanings and number vibrations</p>
                </div>

                {/* Search & Export Controls */}
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    {/* Result Filter */}
                    <select
                        value={resultFilter}
                        onChange={(e) => setResultFilter(e.target.value)}
                        className="bg-card/50 backdrop-blur-md border border-border rounded-xl px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-inner font-semibold"
                    >
                        <option value="All">All Results</option>
                        <option value="Excellent">Excellent</option>
                        <option value="Super">Super</option>
                        <option value="Good">Good</option>
                        <option value="Average">Average</option>
                        <option value="Not Good">Not Good</option>
                        <option value="Bad">Bad</option>
                    </select>

                    <div className="relative group flex-grow md:flex-grow-0">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={16} />
                        <input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search numbers or titles..."
                            className="bg-card/50 backdrop-blur-md border border-border rounded-xl pl-10 pr-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all w-full md:w-64 shadow-inner"
                        />
                    </div>
                    {userRole === 'super_admin' && (
                        <div className="flex items-center gap-2 p-1 bg-card/30 backdrop-blur-sm rounded-2xl border border-border shadow-sm">
                            <button onClick={exportCSV} className="p-2.5 hover:bg-white/5 rounded-xl text-muted-foreground hover:text-foreground transition-all" title="Export CSV">
                                <FileText size={20} />
                            </button>
                            <button onClick={exportExcel} className="p-2.5 hover:bg-green-500/10 text-green-500 rounded-xl transition-all" title="Export Excel">
                                <Database size={20} />
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
                        <div className="premium-card p-6 sticky top-30 bg-card/60">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold flex items-center gap-3">
                                    {selected.id ? (
                                        <span className="p-1.5 bg-primary/10 rounded-lg"><PenTool size={18} className="text-primary" /></span>
                                    ) : (
                                        <span className="p-1.5 bg-primary/10 rounded-lg"><Plus size={18} className="text-primary" /></span>
                                    )}
                                    {selected.id ? "Edit vibration" : "New vibration"}
                                </h2>
                                {selected.id && (
                                    <button onClick={() => setSelected({})} className="p-2 hover:bg-white/5 rounded-full text-muted-foreground transition-colors">
                                        <X size={18} />
                                    </button>
                                )}
                            </div>

                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-5">
                                    <div>
                                        <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground block mb-2 font-black">Number</label>
                                        <input
                                            type="number"
                                            value={selected.number || ""}
                                            onChange={(e) => setSelected({ ...selected, number: parseInt(e.target.value) })}
                                            className="w-full bg-input/20 border border-border/50 rounded-xl p-3 outline-none text-foreground focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-lg font-bold"
                                            placeholder="00"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground block mb-2 font-black">Vibration</label>
                                        <select
                                            value={selected.result || "Good"}
                                            onChange={(e) => setSelected({ ...selected, result: e.target.value })}
                                            className="w-full bg-input/20 border border-border/50 rounded-xl p-3 outline-none text-foreground focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-semibold"
                                        >
                                            <option value="Excellent">Excellent</option>
                                            <option value="Super">Super</option>
                                            <option value="Good">Good</option>
                                            <option value="Average">Average</option>
                                            <option value="Not Good">Not Good</option>
                                            <option value="Bad">Bad</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground block mb-2 font-black">Title (Key Signature)</label>
                                    <input
                                        value={selected.title || ""}
                                        onChange={(e) => setSelected({ ...selected, title: e.target.value })}
                                        className="w-full bg-input/20 border border-border/50 rounded-xl p-3 outline-none text-foreground focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-medium"
                                        placeholder="e.g. The Royal Star of the Lion"
                                    />
                                </div>
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-black">Detailed Meaning</label>
                                        <select
                                            value={editLang}
                                            onChange={(e) => setEditLang(e.target.value)}
                                            className="bg-card/50 border border-border rounded-lg px-2 py-1 text-[10px] font-bold outline-none focus:border-primary transition-all"
                                        >
                                            {LANGUAGES.map(lang => (
                                                <option key={lang.code} value={lang.code}>{lang.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <textarea
                                        rows={5}
                                        value={editLang === 'en' ? (selected.description || "") : (selected[`description_${editLang}` as keyof CompoundNumber] as string || "")}
                                        onChange={(e) => {
                                            if (editLang === 'en') {
                                                setSelected({ ...selected, description: e.target.value });
                                            } else {
                                                setSelected({ ...selected, [`description_${editLang}`]: e.target.value });
                                            }
                                        }}
                                        className="w-full bg-input/20 border border-border/50 rounded-xl p-3 outline-none text-foreground focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all leading-relaxed text-sm"
                                        placeholder={`Unveil the esoteric essence in ${LANGUAGES.find(l => l.code === editLang)?.label}...`}
                                    />
                                </div>

                                <button
                                    onClick={handleSave}
                                    className="w-full py-3.5 bg-gradient-primary text-white font-black text-base rounded-xl hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-3 shadow-xl shadow-primary/20 glow-on-hover"
                                >
                                    <Save size={18} /> {selected.id ? "Update Essence" : "Create Essence"}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* List Section */}
                <div className={userRole === 'super_admin' ? 'lg:col-span-8' : 'lg:col-span-1'}>
                    <div className="space-y-6">
                        <AnimatePresence mode="popLayout">
                            {filteredCompounds.map((m, index) => (
                                <motion.div
                                    key={m.id}
                                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: -20 }}
                                    transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.5) }}
                                    className="premium-card p-6 group hover:border-primary/20 bg-card/40 relative overflow-hidden"
                                >
                                    <div className="flex flex-col md:flex-row gap-6 relative z-10">
                                        <div className="flex-shrink-0 flex items-start justify-center">
                                            <span className={`w-12 h-12 flex items-center justify-center rounded-xl text-xl font-black shadow-lg shadow-mystic-gold/10 transition-transform group-hover:scale-110 group-hover:rotate-3 ${m.result === 'Not Good' || m.result === 'Bad' ? 'bg-red-500 text-white' :
                                                m.result === 'Average' ? 'bg-slate-400 text-white' :
                                                    'bg-gradient-gold text-white'
                                                }`}>
                                                {m.number}
                                            </span>
                                        </div>

                                        <div className="flex-grow">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                                <div>
                                                    <h3 className="text-xl font-black text-foreground group-hover:text-primary transition-colors leading-tight">
                                                        {m.title}
                                                    </h3>
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <span className={`result-badge ${getResultClass(m.result)}`}>
                                                            {m.result}
                                                        </span>
                                                        <span className="w-1 h-1 rounded-full bg-border"></span>
                                                        <span className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase italic">Vibrational Essence</span>
                                                    </div>
                                                </div>

                                                {userRole === 'super_admin' && (
                                                    <div className="flex gap-2 transition-all">
                                                        <button onClick={() => setSelected(m)} className="p-2 bg-card hover:bg-primary/10 hover:text-primary rounded-lg transition-all border border-border shadow-sm">
                                                            <PenTool size={16} />
                                                        </button>
                                                        <button onClick={() => handleDelete(m.id)} className="p-2 bg-card hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-all border border-border shadow-sm">
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                            <p className="text-muted-foreground text-base leading-relaxed font-medium line-clamp-3 group-hover:line-clamp-none transition-all duration-500">
                                                {m.description}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {filteredCompounds.length === 0 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-20 bg-card/20 rounded-3xl border border-dashed border-border"
                            >
                                <Search size={48} className="mx-auto text-muted-foreground/30 mb-4" />
                                <p className="text-muted-foreground font-medium">No mystical vibrations found for your search.</p>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
