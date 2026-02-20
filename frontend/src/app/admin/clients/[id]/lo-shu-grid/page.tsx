"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Grid, Globe, User, UserCheck, Shield, Zap, ArrowLeft } from "lucide-react";
import { api } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

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

interface GridMapping {
    id: number;
    cell: string;
    number: number;
    quality: string;
}

export default function ClientLoShuGridPage() {
    const params = useParams();
    const router = useRouter();
    const [client, setClient] = useState<any>(null);
    const [gender, setGender] = useState<"male" | "female">("male");
    const [gridCounts, setGridCounts] = useState<Record<number, number>>({});
    const [gridStructure, setGridStructure] = useState<GridMapping[]>([]);
    const [driverNumber, setDriverNumber] = useState<number | null>(null);
    const [conductorNumber, setConductorNumber] = useState<number | null>(null);
    const [kuaNumber, setKuaNumber] = useState<number | null>(null);
    const [meanings, setMeanings] = useState<LoShuMeaning[]>([]);
    const [kuaDetails, setKuaDetails] = useState<KuaDetail[]>([]);
    const [loading, setLoading] = useState(true);

    const kuaResult = kuaNumber ? kuaDetails.find(k => Number(k.kua_number) === Number(kuaNumber)) : null;

    useEffect(() => {
        if (params.id) {
            fetchClientAndData(params.id as string);
        }
    }, [params.id]);

    const fetchClientAndData = async (id: string) => {
        try {
            const [clientRes, meaningsRes, kuaRes, gridRes] = await Promise.all([
                api.get(`/admin/clients/${id}`),
                api.get("/admin/lo-shu/meanings"),
                api.get("/admin/lo-shu/kua"),
                api.get("/admin/lo-shu/grid")
            ]);

            if (clientRes.ok) {
                const clientData = await clientRes.json();
                setClient(clientData);
                performCalculation(clientData.dob, "male");
            }

            setMeanings(await meaningsRes.json());
            setKuaDetails(await kuaRes.json());
            setGridStructure(await gridRes.json());
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const performCalculation = (dob: string, g: "male" | "female") => {
        if (!dob) return;

        // Driver (Psychic) Number: Day of birth reduced to single digit
        const day = parseInt(dob.split("-")[2]);
        setDriverNumber((day % 9) || 9);

        // Conductor (Destiny) Number: Full DOB reduced to single digit
        const fullDigits = dob.replace(/[^0-9]/g, "").split("").map(Number);
        const totalSum = fullDigits.reduce((a, b) => a + b, 0);
        let currentSum = totalSum;
        while (currentSum > 9) {
            currentSum = currentSum.toString().split("").map(Number).reduce((a, b) => a + b, 0);
        }
        setConductorNumber(currentSum);

        // Grid counts (Standard Lo Shu filters out 0 and uses all DOB digits)
        const digits = dob.replace(/[^1-9]/g, "").split("").map(Number);
        const counts: Record<number, number> = {};
        digits.forEach(d => {
            counts[d] = (counts[d] || 0) + 1;
        });
        setGridCounts(counts);

        // Kua Calculation Logic
        const year = parseInt(dob.split("-")[0]);
        if (!isNaN(year)) {
            let lastTwo = year % 100;
            let sum = Math.floor(lastTwo / 10) + (lastTwo % 10);
            let red = (sum % 9) || 9;

            let kn = 0;
            if (year < 2000) {
                if (g === "male") kn = 10 - red;
                else {
                    kn = 5 + red;
                    if (kn > 9) kn = (kn % 9) || 9;
                }
            } else {
                if (g === "male") kn = 9 - red;
                else {
                    kn = 6 + red;
                    if (kn > 9) kn = (kn % 9) || 9;
                }
            }

            if (kn <= 0) kn = (kn % 9) || 9;
            if (kn === 5) kn = g === "male" ? 2 : 8;

            setKuaNumber(kn);
        }
    };

    const handleGenderChange = (newGender: "male" | "female") => {
        setGender(newGender);
        if (client?.dob) {
            performCalculation(client.dob, newGender);
        }
    };

    if (loading) return <div className="p-20 text-center animate-pulse text-slate-400">Loading Analysis...</div>;
    if (!client) return <div className="p-20 text-center text-red-500 font-bold">Client not found.</div>;

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-20 px-4 md:px-0">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-4">
                    <Link href={`/admin/clients/${client.id}`}>
                        <button className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all">
                            <ArrowLeft size={20} />
                        </button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
                            <span className="text-primary"><Grid size={24} /></span>
                            Lo Shu Grid Result: <span className="text-slate-600 font-bold">{client.full_name}</span>
                        </h1>
                        <p className="text-xs text-muted-foreground">Analysis based on birth date: {new Date(client.dob).toLocaleDateString()}</p>
                    </div>
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
                {/* Sidebar */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="glass-card p-6 bg-white rounded-3xl border border-slate-200 shadow-xl">
                        <h2 className="text-[10px] uppercase font-black text-slate-400 mb-4 tracking-[0.2em]">Calculator Options</h2>
                        <div className="space-y-4">
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleGenderChange("male")}
                                    className={`flex-1 py-3 rounded-xl border flex items-center justify-center gap-2 font-bold transition-all ${gender === "male" ? "bg-blue-50 border-blue-200 text-blue-600 shadow-inner" : "bg-white border-slate-200 text-slate-400"
                                        }`}
                                >
                                    <User size={16} /> Male
                                </button>
                                <button
                                    onClick={() => handleGenderChange("female")}
                                    className={`flex-1 py-3 rounded-xl border flex items-center justify-center gap-2 font-bold transition-all ${gender === "female" ? "bg-pink-50 border-pink-200 text-pink-600 shadow-inner" : "bg-white border-slate-200 text-slate-400"
                                        }`}
                                >
                                    <UserCheck size={16} /> Female
                                </button>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">Target Date</div>
                                <div className="text-sm font-black text-slate-800">{new Date(client.dob).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card p-6 bg-white rounded-3xl border border-slate-200 shadow-xl">
                        <h2 className="text-[10px] uppercase font-black text-slate-400 mb-4 tracking-[0.2em]">D.O.B Summary</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-gradient-to-br from-indigo-50 to-white rounded-2xl border border-indigo-100 relative overflow-hidden group">
                                <div className="text-[8px] text-indigo-400 font-bold uppercase mb-1">Driver (Psychic)</div>
                                <div className="text-3xl font-black text-indigo-900 leading-none">{driverNumber}</div>
                                <div className="absolute -bottom-2 -right-1 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <User size={40} className="text-indigo-900" />
                                </div>
                            </div>
                            <div className="p-4 bg-gradient-to-br from-violet-50 to-white rounded-2xl border border-violet-100 relative overflow-hidden group">
                                <div className="text-[8px] text-violet-400 font-bold uppercase mb-1">Conductor (Destiny)</div>
                                <div className="text-3xl font-black text-violet-900 leading-none">{conductorNumber}</div>
                                <div className="absolute -bottom-2 -right-1 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Shield size={40} className="text-violet-900" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card p-6 bg-white rounded-3xl border border-slate-200 shadow-xl relative overflow-hidden group">
                        <div className="relative z-10 flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-[10px] uppercase font-black text-slate-400 mb-1 tracking-[0.2em]">Kua Number</h3>
                                <div className="text-5xl font-black text-slate-900">{kuaNumber || "--"}</div>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                                <Globe size={24} className="text-primary" />
                            </div>
                        </div>

                        {kuaNumber && kuaResult ? (
                            <div className="relative z-10 space-y-3 mt-6">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                                        <div className="text-[8px] uppercase font-black text-emerald-600">Success</div>
                                        <div className="text-sm font-black text-emerald-900">{kuaResult.sheng_qi}</div>
                                    </div>
                                    <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                                        <div className="text-[8px] uppercase font-black text-blue-600">Health</div>
                                        <div className="text-sm font-black text-blue-900">{kuaResult.tian_yi}</div>
                                    </div>
                                    <div className="p-3 bg-orange-50 rounded-xl border border-orange-100">
                                        <div className="text-[8px] uppercase font-black text-orange-600">Relations</div>
                                        <div className="text-sm font-black text-orange-900">{kuaResult.yan_nian}</div>
                                    </div>
                                    <div className="p-3 bg-purple-50 rounded-xl border border-purple-100">
                                        <div className="text-[8px] uppercase font-black text-purple-600">Growth</div>
                                        <div className="text-sm font-black text-purple-900">{kuaResult.fu_wei}</div>
                                    </div>
                                </div>
                                <div className="p-3 bg-red-50 rounded-xl border border-red-100">
                                    <div className="text-[8px] uppercase font-black text-red-500">Avoid Directions</div>
                                    <div className="text-xs font-black text-red-700 leading-tight">
                                        {kuaResult.bad_directions}
                                    </div>
                                </div>
                            </div>
                        ) : kuaNumber ? (
                            <p className="text-[10px] text-slate-400 mt-4 italic font-medium">Calculation complete. Waiting for direction settings...</p>
                        ) : (
                            <p className="text-[10px] text-slate-400 mt-4 italic font-medium">Enter birth details to see Kua results.</p>
                        )}
                    </div>
                </div>

                {/* Grid View */}
                <div className="lg:col-span-8 space-y-8">
                    <div className="grid grid-cols-3 gap-4 md:gap-6 bg-slate-100/30 p-6 rounded-[2.5rem] border border-slate-200/50 shadow-inner">
                        {gridStructure.sort((a, b) => {
                            // Logic to sort Top->Bottom, Left->Right if needed, 
                            // or keep insertion order. Default seed is already sorted.
                            return a.id - b.id;
                        }).map((cell) => {
                            const count = gridCounts[cell.number] || 0;
                            return (
                                <motion.div
                                    key={cell.id}
                                    className={`relative aspect-square md:aspect-[5/4] bg-white rounded-3xl border shadow-lg flex flex-col items-center justify-center p-2 text-center transition-all ${count > 0 ? "border-primary/20 ring-4 ring-primary/5 shadow-primary/5" : "border-slate-100 opacity-80 shadow-sm"
                                        }`}
                                >
                                    <div className={`text-4xl md:text-5xl font-black ${count > 0 ? "text-primary" : "text-slate-200"}`}>
                                        {cell.number}
                                    </div>
                                    <div className={`text-[10px] uppercase mt-1 px-2 ${count > 0 ? "text-slate-600" : "text-slate-400"}`}>
                                        {cell.quality}
                                    </div>
                                    {count > 1 && (
                                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-white text-xs font-black rounded-full flex items-center justify-center shadow-xl border-4 border-white">
                                            {count}
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Strengths */}
                        <div className="p-6 bg-emerald-50/40 rounded-3xl border border-emerald-100/50">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-6 flex items-center gap-2">
                                <Shield size={14} /> Natural Strengths
                            </h4>
                            <div className="space-y-5">
                                {gridStructure.map(cell => gridCounts[cell.number] && (
                                    <div key={cell.id} className="flex items-start gap-4">
                                        <div className="w-8 h-8 bg-emerald-500 rounded-xl flex-shrink-0 flex items-center justify-center text-white font-black text-xs shadow-lg shadow-emerald-500/20">
                                            {cell.number}
                                        </div>
                                        <div>
                                            <div className="text-sm font-black text-slate-800">For Number {cell.number}</div>
                                            <div className="text-xs text-slate-500 leading-relaxed mt-0.5">{meanings.find(m => m.number === cell.number)?.quality || cell.quality}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Remedies */}
                        <div className="p-6 bg-amber-50/40 rounded-3xl border border-amber-100/50">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-amber-600 mb-6 flex items-center gap-2">
                                <Zap size={14} /> Missing Paths & Remedies
                            </h4>
                            <div className="space-y-6">
                                {gridStructure.map(cell => !gridCounts[cell.number] && (
                                    <div key={cell.id} className="flex items-start gap-4">
                                        <div className="w-8 h-8 bg-amber-200 border border-amber-300 rounded-xl flex-shrink-0 flex items-center justify-center text-amber-700 font-black text-xs">
                                            ?
                                        </div>
                                        <div>
                                            <div className="text-sm font-black text-slate-800">For Number {cell.number}</div>
                                            <div className="text-xs text-amber-800/70 italic mt-1 bg-amber-100/50 p-2 rounded-lg border border-amber-200/20">
                                                {meanings.find(m => m.number === cell.number)?.remedy || "Focus on building structure and persistence in this area."}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    {/* Kua Directions Analysis */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl overflow-hidden mt-8"
                    >
                        <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                                    <Globe size={20} className="text-primary" />
                                    Kua Directions Analysis
                                </h3>
                                <p className="text-xs text-slate-500 mt-1">Detailed lucky and unlucky directions for Master Kua Number {kuaNumber}</p>
                            </div>
                        </div>
                        <div className="p-8">
                            {kuaNumber && kuaResult ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <div className="p-6 rounded-3xl bg-emerald-50 border border-emerald-100 shadow-sm transition-all hover:shadow-md">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center font-black">SQ</div>
                                            <div>
                                                <div className="text-[10px] font-black uppercase text-emerald-600 tracking-widest">Success</div>
                                                <div className="text-lg font-black text-emerald-900">{kuaResult.sheng_qi}</div>
                                            </div>
                                        </div>
                                        <p className="text-[11px] text-emerald-700 leading-relaxed font-medium">Best for prosperity, health, and vitality. Ideal for office desk or front door facing.</p>
                                    </div>

                                    <div className="p-6 rounded-3xl bg-blue-50 border border-blue-100 shadow-sm transition-all hover:shadow-md">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 bg-blue-500 text-white rounded-xl flex items-center justify-center font-black">TY</div>
                                            <div>
                                                <div className="text-[10px] font-black uppercase text-blue-600 tracking-widest">Health</div>
                                                <div className="text-lg font-black text-blue-900">{kuaResult.tian_yi}</div>
                                            </div>
                                        </div>
                                        <p className="text-[11px] text-blue-700 leading-relaxed font-medium">Promotes healing and recovery. Optimal for kitchen and bedroom orientation.</p>
                                    </div>

                                    <div className="p-6 rounded-3xl bg-orange-50 border border-orange-100 shadow-sm transition-all hover:shadow-md">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 bg-orange-500 text-white rounded-xl flex items-center justify-center font-black">YN</div>
                                            <div>
                                                <div className="text-[10px] font-black uppercase text-orange-600 tracking-widest">Relationships</div>
                                                <div className="text-lg font-black text-orange-900">{kuaResult.yan_nian}</div>
                                            </div>
                                        </div>
                                        <p className="text-[11px] text-orange-700 leading-relaxed font-medium">Fosters harmony and long-term stability in family and partnerships.</p>
                                    </div>

                                    <div className="p-6 rounded-3xl bg-purple-50 border border-purple-100 shadow-sm transition-all hover:shadow-md">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 bg-purple-500 text-white rounded-xl flex items-center justify-center font-black">FW</div>
                                            <div>
                                                <div className="text-[10px] font-black uppercase text-purple-600 tracking-widest">Stability</div>
                                                <div className="text-lg font-black text-purple-900">{kuaResult.fu_wei}</div>
                                            </div>
                                        </div>
                                        <p className="text-[11px] text-purple-700 leading-relaxed font-medium">Enhances personal growth and focus. Best for meditation or study area.</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-10 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                                    <p className="text-slate-400 italic">Direction analysis data unavailable for this Kua number.</p>
                                </div>
                            )}

                            <div className="mt-8 p-6 bg-red-50/50 rounded-3xl border border-red-100">
                                <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-red-600 mb-4">
                                    <Zap size={14} /> Directions to Avoid
                                </h4>
                                <div className="flex flex-wrap gap-3">
                                    {kuaNumber && kuaResult?.bad_directions?.split(',').map((dir, idx) => (
                                        <div key={idx} className="px-5 py-3 bg-white border border-red-100 rounded-2xl shadow-sm">
                                            <div className="text-[8px] font-black text-red-300 uppercase leading-none mb-1">Unlucky</div>
                                            <div className="text-xl font-black text-red-600">{dir.trim()}</div>
                                        </div>
                                    ))}
                                </div>
                                <p className="text-[10px] text-red-500/70 mt-4 leading-relaxed font-medium">
                                    Note: Avoid facing these directions when sleeping, working, or sitting for long periods to minimize negative energy interference.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}
