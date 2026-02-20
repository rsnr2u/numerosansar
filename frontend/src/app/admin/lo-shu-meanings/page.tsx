"use client";

import { useEffect, useState } from "react";
import { Grid, PenTool, Trash2, Plus, ArrowLeft } from "lucide-react";
import { api } from "@/lib/api";
import { motion } from "framer-motion";

interface LoShuMeaning {
    id: number;
    number: number;
    quality: string;
    remedy: string;
}

export default function LoShuMeaningsCMS() {
    const [meanings, setMeanings] = useState<LoShuMeaning[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMeaning, setSelectedMeaning] = useState<Partial<LoShuMeaning>>({});

    useEffect(() => {
        fetchMeanings();
    }, []);

    const fetchMeanings = async () => {
        try {
            const res = await api.get("/admin/lo-shu/meanings");
            setMeanings(await res.json());
            setLoading(false);
        } catch (err) { console.error(err); setLoading(false); }
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

    if (loading) return <div className="p-20 text-center animate-pulse text-slate-400">Loading Meanings...</div>;

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-20 px-4 md:px-0">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
                        <span className="p-2.5 bg-gradient-to-br from-[#1E293B] to-[#334155] rounded-xl shadow-lg text-white">
                            <Grid size={24} />
                        </span>
                        <span className="text-black">Lo Shu Meanings</span>
                    </h1>
                    <p className="text-sm text-slate-500 mt-1 ml-1">Manage qualities and remedies for Lo Shu numbers</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-4 h-fit sticky top-28">
                    <div className="bg-white p-6 rounded-3xl border border-border shadow-xl">
                        <h3 className="text-lg font-black mb-6">{selectedMeaning.id ? "Edit Meaning" : "Add New Meaning"}</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] uppercase font-black text-slate-400 mb-1 block tracking-widest">Lo Shu Number (1-9)</label>
                                <input
                                    type="number"
                                    value={selectedMeaning.number || ""}
                                    onChange={e => setSelectedMeaning({ ...selectedMeaning, number: parseInt(e.target.value) })}
                                    className="w-full bg-slate-50 border p-3 rounded-xl font-bold"
                                    placeholder="e.g. 1"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] uppercase font-black text-slate-400 mb-1 block tracking-widest">Natural Strength / Quality</label>
                                <textarea
                                    value={selectedMeaning.quality || ""}
                                    onChange={e => setSelectedMeaning({ ...selectedMeaning, quality: e.target.value })}
                                    className="w-full bg-slate-50 border p-3 rounded-xl"
                                    rows={3}
                                    placeholder="What does this number represent?"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] uppercase font-black text-slate-400 mb-1 block tracking-widest">Growth Remedy (If Missing)</label>
                                <textarea
                                    value={selectedMeaning.remedy || ""}
                                    onChange={e => setSelectedMeaning({ ...selectedMeaning, remedy: e.target.value })}
                                    className="w-full bg-slate-50 border p-3 rounded-xl"
                                    rows={4}
                                    placeholder="Suggested remedies if this number is missing..."
                                />
                            </div>
                            <button onClick={handleSaveMeaning} className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl shadow-xl flex items-center justify-center gap-2 hover:bg-black transition-colors">
                                {selectedMeaning.id ? "Update Master Setting" : "Create Master Setting"}
                            </button>
                            {selectedMeaning.id && (
                                <button onClick={() => setSelectedMeaning({})} className="w-full py-2 text-xs font-bold text-slate-400">Cancel Edit</button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-8">
                    <div className="bg-white rounded-3xl border border-border overflow-hidden shadow-2xl">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 text-[10px] uppercase font-black text-slate-400 border-b">
                                <tr>
                                    <th className="px-6 py-4">No.</th>
                                    <th className="px-6 py-4">Strengths</th>
                                    <th className="px-6 py-4">Remedies</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {meanings.sort((a, b) => a.number - b.number).map(m => (
                                    <tr key={m.id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <span className="w-10 h-10 bg-primary text-black flex items-center justify-center rounded-xl font-black text-lg shadow-sm">
                                                {m.number}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-xs font-bold text-slate-700 max-w-[200px] leading-relaxed">
                                            {m.quality}
                                        </td>
                                        <td className="px-6 py-4 text-[11px] text-slate-500 italic max-w-[250px]">
                                            {m.remedy}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => setSelectedMeaning(m)} className="p-2 hover:bg-slate-100 text-amber-600 rounded-lg"><PenTool size={14} /></button>
                                                <button onClick={() => handleDeleteMeaning(m.id)} className="p-2 hover:bg-red-50 text-red-600 rounded-lg"><Trash2 size={14} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {meanings.length === 0 && (
                                    <tr><td colSpan={4} className="p-10 text-center text-slate-400 italic">No settings found. Add one on the left.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
