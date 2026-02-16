"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star, Database } from "lucide-react";

interface SystemResult {
    system: string;
    compound: number;
    single: number;
    planet: string | undefined;
    meaning: string | undefined;
    description: string | undefined;
    resultType: string | undefined;
}

const getResultColor = (result: string | undefined) => {
    if (!result) return "border-border/50";
    const r = result.toLowerCase();
    if (r.includes("excellent")) return "border-green-500";
    if (r.includes("super")) return "border-blue-500";
    if (r.includes("very good") || r.includes("good")) return "border-primary";
    if (r.includes("not good") || r.includes("bad")) return "border-red-500";
    return "border-border/50";
};

const getBadgeColor = (result: string | undefined) => {
    if (!result) return "bg-muted text-muted-foreground";
    const r = result.toLowerCase();
    if (r.includes("excellent")) return "bg-green-500/10 text-green-500 border-green-500/30 font-bold";
    if (r.includes("super")) return "bg-blue-500/10 text-blue-500 border-blue-500/30 font-bold";
    if (r.includes("very good") || r.includes("good")) return "bg-primary/10 text-primary border-primary/30 font-bold";
    if (r.includes("not good") || r.includes("bad")) return "bg-red-500/10 text-red-500 border-red-500/30 font-bold";
    return "bg-muted text-muted-foreground";
};

const SystemCard = ({ result }: { result: SystemResult }) => {
    const isChaldean = result.system === "Chaldean";
    const baseColorClass = isChaldean ? "text-astro-gold" : "text-astro-red";
    const statusBorder = getResultColor(result.resultType);

    return (
        <motion.div
            whileHover={{ y: -5, scale: 1.01 }}
            className={`p-6 flex flex-col items-center text-center relative overflow-hidden group border-2 rounded-[2rem] bg-white ${statusBorder} transition-all duration-500 shadow-sm hover:shadow-xl`}
        >
            <div className="z-10 relative w-full flex flex-col items-center">
                <h3 className={`text-[10px] uppercase tracking-[0.3em] font-black mb-4 opacity-50 ${baseColorClass}`}>
                    {result.system} System
                </h3>

                <div className="mb-6 group-hover:scale-110 transition-transform duration-500">
                    <span className="text-[9px] opacity-30 uppercase tracking-[0.3em] font-bold block mb-1">Composite</span>
                    <span className="text-7xl font-black tracking-tighter drop-shadow-2xl no-print-shadow">{result.compound}</span>
                </div>

                <div className="grid grid-cols-2 gap-8 w-full border-t border-current/10 pt-5 mb-6">
                    <div className="flex flex-col items-center">
                        <span className="opacity-30 text-[9px] uppercase font-bold tracking-widest px-2">Root Value</span>
                        <span className="text-3xl font-black mt-1">{result.single}</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="opacity-30 text-[9px] uppercase font-bold tracking-widest px-2">Ruler</span>
                        <span className={`text-2xl font-black mt-1 flex items-center gap-2 ${baseColorClass}`}>
                            <Star size={18} className="fill-current animate-pulse opacity-70" />
                            <span className="text-foreground">{result.planet || "-"}</span>
                        </span>
                    </div>
                </div>

                <div className="w-full border-t border-current/10 pt-5 mb-6">
                    <p className="text-sm font-bold text-foreground/70 tracking-tight leading-relaxed italic">
                        {result.meaning}
                    </p>
                </div>

                {result.resultType && (
                    <div className="mt-4 w-full">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className={`py-3 rounded-[1.25rem] text-[11px] font-black uppercase tracking-[0.3em] border-2 shadow-2xl ${getBadgeColor(result.resultType)}`}
                        >
                            {result.resultType}
                        </motion.div>
                    </div>
                )}
            </div>

            {/* BG Decoration */}
            <div className={`absolute -bottom-10 -right-10 opacity-[0.06] rotate-12 transition-all duration-700 group-hover:rotate-0 group-hover:scale-125 ${baseColorClass}`}>
                <Database size={140} />
            </div>

            {/* Glossy Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />
        </motion.div>
    );
};

export default React.memo(SystemCard);
