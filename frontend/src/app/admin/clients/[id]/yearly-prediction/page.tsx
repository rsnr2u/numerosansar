import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Sparkles, BrainCircuit, RefreshCw, Trophy, Heart, Briefcase, Zap, Palette, Calendar } from "lucide-react";
import { api } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

export default function YearlyPredictionPage() {
    const params = useParams();
    const { language } = useLanguage();
    const [client, setClient] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [analyzing, setAnalyzing] = useState(false);
    const [aiAnalysis, setAiAnalysis] = useState<any>(null);
    const [clientData, setClientData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (params.id) {
            fetchClientDetails(params.id as string);
        }
    }, [params.id]);

    const fetchClientDetails = async (id: string) => {
        try {
            const res = await api.get(`/admin/clients/${id}`);
            if (res.ok) {
                const data = await res.json();
                setClient(data);

                // Calculate Driver, Conductor, Missing Numbers for the AI
                const calculated = performCalculations(data);
                setClientData(calculated);

                if (data.yearly_ai_report) {
                    try {
                        setAiAnalysis(JSON.parse(data.yearly_ai_report));
                    } catch (e) {
                        console.error("Failed to parse yearly AI report", e);
                    }
                }
            }
        } catch (err) {
            console.error("Error fetching client", err);
        } finally {
            setLoading(false);
        }
    };

    const performCalculations = (client: any) => {
        const dob = client.dob;
        // Driver
        const day = parseInt(dob.split("-")[2]);
        const driver = (day % 9) || 9;

        // Conductor
        const fullDigits = dob.replace(/[^0-9]/g, "").split("").map(Number);
        const totalSum = fullDigits.reduce((a, b) => a + b, 0);
        let conductor = totalSum;
        while (conductor > 9) {
            conductor = conductor.toString().split("").map(Number).reduce((a, b) => a + b, 0);
        }

        // Missing Numbers
        const digits = dob.replace(/[^1-9]/g, "").split("").map(Number);
        const counts: Record<number, boolean> = {};
        digits.forEach(d => counts[d] = true);
        const missing = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(n => !counts[n]);

        // Personal Year for 2026
        // Rule: Day + Month + Current Year (2026)
        const birthDay = parseInt(dob.split("-")[2]);
        const birthMonth = parseInt(dob.split("-")[1]);
        const targetYear = 2026;
        let pySum = birthDay + birthMonth + targetYear;
        // Correct reduction (sum of all digits)
        const pyDigits = pySum.toString().split("").map(Number);
        let py = pyDigits.reduce((a, b) => a + b, 0);
        while (py > 9) {
            py = py.toString().split("").map(Number).reduce((a, b) => a + b, 0);
        }

        return { driver, conductor, missing, personalYear: py };
    };

    const generateYearlyPrediction = async () => {
        if (!client || !clientData) return;
        setAnalyzing(true);
        setError(null);
        try {
            const res = await api.post("/admin/ai/yearly-prediction", {
                client_id: client.id,
                name: client.full_name,
                dob: client.dob,
                chaldeanNumber: client.chaldean_compound || "?",
                driver: clientData.driver,
                conductor: clientData.conductor,
                missingNumbers: clientData.missing,
                personalYear: clientData.personalYear,
                language: language
            });

            const data = await res.json();
            if (data.success) {
                setAiAnalysis(data.analysis);
            } else {
                setError(data.message || "Failed to generate report. Please check AI settings.");
            }
        } catch (err: any) {
            console.error("AI Generation Failed", err);
            setError("Connection error. Please check your internet or server status.");
        } finally {
            setAnalyzing(false);
        }
    };

    if (loading) return <div className="p-20 text-center animate-pulse text-slate-400">Loading Client Data...</div>;
    if (!client) return <div className="p-20 text-center text-red-500 font-bold">Client not found.</div>;

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-20 px-4 md:px-0">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-4">
                    <Link to={`/admin/clients/${client.id}`}>
                        <button className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all">
                            <ArrowLeft size={20} />
                        </button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-black tracking-tight flex items-center gap-2 text-[#2D2926]">
                            <Sparkles size={24} className="text-amber-500" />
                            Yearly Prediction 2026: <span className="text-slate-500 font-bold">{client.full_name}</span>
                        </h1>
                        <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Personal Year {clientData?.personalYear} Analysis</p>
                    </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                    <button
                        onClick={generateYearlyPrediction}
                        disabled={analyzing}
                        className={`px-8 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2 transition-all shadow-xl ${analyzing
                                ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                                : "bg-black text-white hover:bg-slate-800 hover:-translate-y-0.5"
                            }`}
                    >
                        {analyzing ? <RefreshCw className="animate-spin" size={16} /> : <BrainCircuit size={16} />}
                        {analyzing ? "Synthesizing Forecast..." : aiAnalysis ? "Regenerate 2026 Report" : "Generate 2026 Prediction"}
                    </button>
                    {error && <span className="text-[10px] font-bold text-red-500 animate-pulse">{error}</span>}
                </div>
            </div>

            <AnimatePresence mode="wait">
                {aiAnalysis ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="grid grid-cols-1 lg:grid-cols-12 gap-8"
                    >
                        {/* Main Analysis */}
                        <div className="lg:col-span-8 space-y-8">
                            {/* Overall Summary */}
                            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl p-8 md:p-12 relative overflow-hidden group">
                                <div className="absolute -top-10 -right-10 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
                                    <Sparkles size={300} />
                                </div>
                                <div className="relative z-10">
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">Yearly Architecture</h3>
                                    <p className="text-xl md:text-2xl font-bold text-[#2D2926] leading-relaxed italic">
                                        "{aiAnalysis.year_summary}"
                                    </p>
                                </div>
                            </div>

                            {/* Core Pillars */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-emerald-50/50 border border-emerald-100 rounded-[2rem] p-8 shadow-lg">
                                    <div className="w-12 h-12 bg-emerald-500 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/20">
                                        <Briefcase size={24} />
                                    </div>
                                    <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-4">Career & Wealth</h4>
                                    <p className="text-sm font-medium text-emerald-900 leading-relaxed">
                                        {aiAnalysis.career_and_wealth}
                                    </p>
                                </div>

                                <div className="bg-rose-50/50 border border-rose-100 rounded-[2rem] p-8 shadow-lg">
                                    <div className="w-12 h-12 bg-rose-500 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-rose-500/20">
                                        <Heart size={24} />
                                    </div>
                                    <h4 className="text-[10px] font-black text-rose-600 uppercase tracking-widest mb-4">Health & Family</h4>
                                    <p className="text-sm font-medium text-rose-900 leading-relaxed">
                                        {aiAnalysis.health_and_family}
                                    </p>
                                </div>
                            </div>

                            {/* Monthly Highlights */}
                            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl overflow-hidden">
                                <div className="p-8 border-b border-slate-100 bg-slate-50/50">
                                    <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                                        <Calendar size={20} className="text-primary" />
                                        Monthly Strategic Highlights
                                    </h3>
                                </div>
                                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {aiAnalysis.monthly_highlights?.map((m: any, idx: number) => (
                                        <div key={idx} className="p-5 bg-slate-50 border border-slate-100 rounded-2xl hover:border-primary/20 transition-all group">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-[10px] font-black text-primary uppercase tracking-tighter">{m.month}</span>
                                                <div className="w-1.5 h-1.5 rounded-full bg-primary/20 group-hover:bg-primary transition-colors"></div>
                                            </div>
                                            <p className="text-xs font-bold text-slate-700 leading-relaxed">{m.prediction}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar Stats & Remedies */}
                        <div className="lg:col-span-4 space-y-6">
                            {/* Directional Protocol */}
                            <div className="bg-indigo-600 text-white rounded-[2rem] p-8 shadow-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Zap size={64} />
                                </div>
                                <h4 className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-6">Directional Remedy</h4>
                                <div className="mb-6">
                                    <div className="text-4xl font-black mb-1">{aiAnalysis.directional_remedy?.direction}</div>
                                    <div className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest">Optimized Orientation</div>
                                </div>
                                <p className="text-xs font-bold leading-relaxed text-indigo-50">
                                    {aiAnalysis.directional_remedy?.action}
                                </p>
                            </div>

                            {/* Lucky Colors */}
                            <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-xl">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <Palette size={14} /> Vibrational Colors
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {aiAnalysis.lucky_colors?.map((color: string, idx: number) => (
                                        <span key={idx} className="px-4 py-2 rounded-full bg-slate-100 border border-slate-200 text-xs font-black text-slate-700 uppercase tracking-wider">
                                            {color}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* DOB Summary Redux */}
                            <div className="bg-slate-900 text-white rounded-[2.rem] p-8 shadow-xl">
                                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 italic">Archetype Data</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                                        <div className="text-[8px] text-slate-400 font-bold uppercase mb-1">Driver</div>
                                        <div className="text-2xl font-black">{clientData?.driver}</div>
                                    </div>
                                    <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                                        <div className="text-[8px] text-slate-400 font-bold uppercase mb-1">Conductor</div>
                                        <div className="text-2xl font-black">{clientData?.conductor}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="py-32 text-center space-y-6"
                    >
                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-300">
                            <Sparkles size={40} />
                        </div>
                        <div className="max-w-md mx-auto">
                            <h2 className="text-xl font-black text-[#2D2926]">No Forecast Generated</h2>
                            <p className="text-sm text-slate-500 mt-2">Initialize the yearly algorithmic analysis for 2026 to unlock deep strategic insights for this client.</p>
                        </div>
                        <button
                            onClick={generateYearlyPrediction}
                            className="px-10 py-4 bg-black text-white font-black uppercase text-[10px] tracking-widest rounded-2xl shadow-xl hover:shadow-black/20 hover:-translate-y-1 transition-all"
                        >
                            Begin Synthesis
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
