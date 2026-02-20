"use client";

import { useEffect, useState } from "react";
import { Globe, PenTool, Trash2, ArrowLeft } from "lucide-react";
import { api } from "@/lib/api";

interface KuaDetail {
    id: number;
    kua_number: number;
    sheng_qi: string;
    tian_yi: string;
    yan_nian: string;
    fu_wei: string;
    bad_directions: string;
}

export default function KuaDetailsCMS() {
    const [kuaDetails, setKuaDetails] = useState<KuaDetail[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedKua, setSelectedKua] = useState<Partial<KuaDetail>>({});

    useEffect(() => {
        fetchKuaDetails();
    }, []);

    const fetchKuaDetails = async () => {
        try {
            const res = await api.get("/admin/lo-shu/kua");
            setKuaDetails(await res.json());
            setLoading(false);
        } catch (err) { console.error(err); setLoading(false); }
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

    if (loading) return <div className="p-20 text-center animate-pulse text-slate-400">Loading Kua Systems...</div>;

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-20 px-4 md:px-0">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
                        <span className="p-2.5 bg-gradient-to-br from-[#1E293B] to-[#334155] rounded-xl shadow-lg text-white">
                            <Globe size={24} />
                        </span>
                        <span className="text-black">Kua Directions Master</span>
                    </h1>
                    <p className="text-sm text-slate-500 mt-1 ml-1">Configure lucky and unlucky directions for each Kua number</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-4 h-fit sticky top-28">
                    <div className="bg-white p-6 rounded-3xl border border-border shadow-xl">
                        <h3 className="text-lg font-black mb-6">{selectedKua.id ? "Edit Directions" : "Add Kua Directions"}</h3>
                        <div className="space-y-5">
                            <div>
                                <label className="text-[10px] uppercase font-black text-slate-400 mb-1 block tracking-widest">Kua Number (1-9)</label>
                                <input
                                    type="number"
                                    value={selectedKua.kua_number || ""}
                                    onChange={e => setSelectedKua({ ...selectedKua, kua_number: parseInt(e.target.value) })}
                                    className="w-full bg-slate-50 border p-3 rounded-xl font-bold text-lg"
                                    placeholder="e.g. 1"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] uppercase font-black text-emerald-500 mb-1 block tracking-widest">Success (SQ)</label>
                                    <input
                                        type="text"
                                        value={selectedKua.sheng_qi || ""}
                                        onChange={e => setSelectedKua({ ...selectedKua, sheng_qi: e.target.value })}
                                        className="w-full bg-slate-50 border p-3 rounded-xl font-bold"
                                        placeholder="e.g. SE"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase font-black text-blue-500 mb-1 block tracking-widest">Health (TY)</label>
                                    <input
                                        type="text"
                                        value={selectedKua.tian_yi || ""}
                                        onChange={e => setSelectedKua({ ...selectedKua, tian_yi: e.target.value })}
                                        className="w-full bg-slate-50 border p-3 rounded-xl font-bold"
                                        placeholder="e.g. E"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] uppercase font-black text-orange-500 mb-1 block tracking-widest">Relations (YN)</label>
                                    <input
                                        type="text"
                                        value={selectedKua.yan_nian || ""}
                                        onChange={e => setSelectedKua({ ...selectedKua, yan_nian: e.target.value })}
                                        className="w-full bg-slate-50 border p-3 rounded-xl font-bold"
                                        placeholder="e.g. S"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase font-black text-purple-500 mb-1 block tracking-widest">Growth (FW)</label>
                                    <input
                                        type="text"
                                        value={selectedKua.fu_wei || ""}
                                        onChange={e => setSelectedKua({ ...selectedKua, fu_wei: e.target.value })}
                                        className="w-full bg-slate-50 border p-3 rounded-xl font-bold"
                                        placeholder="e.g. N"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] uppercase font-black text-red-500 mb-1 block tracking-widest">Bad Directions (Avoid)</label>
                                <textarea
                                    value={selectedKua.bad_directions || ""}
                                    onChange={e => setSelectedKua({ ...selectedKua, bad_directions: e.target.value })}
                                    className="w-full bg-slate-50 border p-3 rounded-xl font-medium"
                                    rows={3}
                                    placeholder="e.g. SW, NW, W, NE"
                                />
                            </div>
                            <button onClick={handleSaveKua} className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl shadow-xl hover:bg-black transition-colors">
                                {selectedKua.id ? "Update Master Directions" : "Save Master Directions"}
                            </button>
                            {selectedKua.id && (
                                <button onClick={() => setSelectedKua({})} className="w-full py-2 text-xs font-bold text-slate-400">Cancel Edit</button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-8">
                    <div className="bg-white rounded-3xl border border-border overflow-hidden shadow-2xl">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 text-[10px] uppercase font-black text-slate-400 border-b">
                                <tr>
                                    <th className="px-6 py-4">Kua</th>
                                    <th className="px-6 py-4">Good Directions (SQ/TY/YN/FW)</th>
                                    <th className="px-6 py-4">Avoid</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y relative">
                                {kuaDetails.sort((a, b) => a.kua_number - b.kua_number).map(k => (
                                    <tr key={k.id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="px-6 py-4 font-black text-primary text-xl">
                                            {k.kua_number}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-2">
                                                <span className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded text-[10px] font-black border border-emerald-100">{k.sheng_qi}</span>
                                                <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-[10px] font-black border border-blue-100">{k.tian_yi}</span>
                                                <span className="px-2 py-1 bg-orange-50 text-orange-700 rounded text-[10px] font-black border border-orange-100">{k.yan_nian}</span>
                                                <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded text-[10px] font-black border border-purple-100">{k.fu_wei}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-[10px] text-red-500 font-bold max-w-[150px]">
                                            {k.bad_directions}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => setSelectedKua(k)} className="p-2 hover:bg-slate-100 text-amber-600 rounded-lg"><PenTool size={14} /></button>
                                                <button onClick={() => handleDeleteKua(k.id)} className="p-2 hover:bg-red-50 text-red-600 rounded-lg"><Trash2 size={14} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {kuaDetails.length === 0 && (
                                    <tr><td colSpan={4} className="p-10 text-center text-slate-400 italic">No Kua data found. Add on the left.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
