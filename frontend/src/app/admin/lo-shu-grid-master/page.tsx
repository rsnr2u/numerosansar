"use client";

import { useEffect, useState } from "react";
import { Database, PenTool, Trash2, ShieldCheck } from "lucide-react";
import { api } from "@/lib/api";

interface GridSetting {
    id: number;
    cell: string;
    number: number;
    quality: string;
}

export default function LoShuGridMaster() {
    const [settings, setSettings] = useState<GridSetting[]>([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState<Partial<GridSetting>>({});

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await api.get("/admin/lo-shu/grid");
            setSettings(await res.json());
            setLoading(false);
        } catch (err) { console.error(err); setLoading(false); }
    };

    const handleSave = async () => {
        try {
            await api.post("/admin/lo-shu/grid", selected);
            setSelected({});
            fetchSettings();
        } catch (err) { console.error(err); }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Delete this grid setting?")) return;
        try {
            await api.delete(`/admin/lo-shu/grid/${id}`);
            fetchSettings();
        } catch (err) { console.error(err); }
    };

    if (loading) return <div className="p-20 text-center animate-pulse text-slate-400">Loading Grid Master...</div>;

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-20 px-4 md:px-0">
            <div>
                <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
                    <span className="p-2.5 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-lg text-white">
                        <Database size={24} />
                    </span>
                    <span>Lo Shu Grid Master</span>
                </h1>
                <p className="text-sm text-slate-500 mt-1">Configure the base structure of the 3x3 Magic Square</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-4 h-fit sticky top-28">
                    <div className="bg-white p-6 rounded-3xl border shadow-xl">
                        <h3 className="text-lg font-black mb-6">{selected.id ? "Edit Cell" : "Add Cell Mapping"}</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] uppercase font-black text-slate-400 mb-1 block">Cell Position</label>
                                <input
                                    value={selected.cell || ""}
                                    onChange={e => setSelected({ ...selected, cell: e.target.value })}
                                    className="w-full bg-slate-50 border p-3 rounded-xl font-bold"
                                    placeholder="e.g. Top-Left"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] uppercase font-black text-slate-400 mb-1 block">Assigned Number</label>
                                <input
                                    type="number"
                                    value={selected.number || ""}
                                    onChange={e => setSelected({ ...selected, number: parseInt(e.target.value) })}
                                    className="w-full bg-slate-50 border p-3 rounded-xl font-bold"
                                    placeholder="e.g. 4"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] uppercase font-black text-slate-400 mb-1 block">Core Quality</label>
                                <textarea
                                    value={selected.quality || ""}
                                    onChange={e => setSelected({ ...selected, quality: e.target.value })}
                                    className="w-full bg-slate-50 border p-3 rounded-xl"
                                    rows={3}
                                    placeholder="e.g. Order, hard work..."
                                />
                            </div>
                            <button onClick={handleSave} className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl shadow-xl hover:bg-black transition-colors">
                                {selected.id ? "Update Mapping" : "Create Mapping"}
                            </button>
                            {selected.id && (
                                <button onClick={() => setSelected({})} className="w-full py-2 text-xs font-bold text-slate-400">Cancel</button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-8">
                    <div className="bg-white rounded-3xl border border-border overflow-hidden shadow-2xl">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 text-[10px] uppercase font-black text-slate-400 border-b">
                                <tr>
                                    <th className="px-6 py-4">CELL</th>
                                    <th className="px-6 py-4">NUMBER</th>
                                    <th className="px-6 py-4">QUALITY</th>
                                    <th className="px-6 py-4 text-right">ACTION</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {settings.map(s => (
                                    <tr key={s.id} className="hover:bg-slate-50 group transition-colors">
                                        <td className="px-6 py-4 font-bold text-slate-700">{s.cell}</td>
                                        <td className="px-6 py-4 font-black text-primary text-xl">{s.number}</td>
                                        <td className="px-6 py-4 text-xs text-slate-500">{s.quality}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100">
                                                <button onClick={() => setSelected(s)} className="p-2 hover:bg-slate-100 text-amber-600 rounded-lg"><PenTool size={14} /></button>
                                                <button onClick={() => handleDelete(s.id)} className="p-2 hover:bg-red-50 text-red-600 rounded-lg"><Trash2 size={14} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
