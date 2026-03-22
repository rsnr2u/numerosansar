import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Sparkles, BrainCircuit, RefreshCw, Zap, Shield, Heart, Target, Lightbulb } from "lucide-react";
import { api } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

export default function YogaReportPage() {
    const params = useParams();
    const { language } = useLanguage();
    const [client, setClient] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [analyzing, setAnalyzing] = useState(false);
    const [aiAnalysis, setAiAnalysis] = useState<any>(null);
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

                if (data.yoga_ai_report) {
                    try {
                        setAiAnalysis(JSON.parse(data.yoga_ai_report));
                    } catch (e) {
                        console.error("Failed to parse yoga AI report", e);
                    }
                }
            }
        } catch (err) {
            console.error("Error fetching client", err);
        } finally {
            setLoading(false);
        }
    };

    const generateYogaReport = async () => {
        if (!client) return;
        setAnalyzing(true);
        setError(null);
        try {
            const res = await api.post("/admin/ai/yoga-report", {
                client_id: client.id,
                name: client.full_name,
                dob: client.dob,
                profession: client.profession,
                language: language === 'Telugu' ? 'Telugu' : 'English'
            });

            const data = await res.json();
            if (data.success) {
                setAiAnalysis(data.analysis);
            } else {
                setError(data.message || "Failed to generate yoga report. Please check AI settings.");
            }
        } catch (err: any) {
            console.error("Yoga Report Generation Failed", err);
            setError("Connection error. Please check your internet or server status.");
        } finally {
            setAnalyzing(false);
        }
    };

    if (loading) return <div className="p-20 text-center animate-pulse text-slate-400">Loading Client Data...</div>;
    if (!client) return <div className="p-20 text-center text-red-500 font-bold">Client not found.</div>;

    const yogaCards = [
        {
            title: "Yoga Analysis",
            content: aiAnalysis?.yoga_analysis,
            icon: <Zap size={24} />,
            color: "bg-indigo-500",
            light: "bg-indigo-50",
            border: "border-indigo-100",
            text: "text-indigo-900",
            accent: "text-indigo-600"
        },
        {
            title: "Business & Career Impact",
            content: aiAnalysis?.business_impact,
            icon: <Target size={24} />,
            color: "bg-pink-500",
            light: "bg-pink-50",
            border: "border-pink-100",
            text: "text-pink-900",
            accent: "text-pink-600"
        },
        {
            title: "Suggested Remedies",
            content: aiAnalysis?.remedies,
            icon: <Lightbulb size={24} />,
            color: "bg-amber-500",
            light: "bg-amber-50",
            border: "border-amber-100",
            text: "text-amber-900",
            accent: "text-amber-600"
        }
    ];

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-20 px-4 md:px-0">
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
                            <Sparkles size={24} className="text-pink-500" />
                            Yoga Report: <span className="text-slate-500 font-bold">{client.full_name}</span>
                        </h1>
                        <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Loshu Grid Plane Analysis</p>
                    </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                    <button
                        onClick={generateYogaReport}
                        disabled={analyzing}
                        className={`px-8 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2 transition-all shadow-xl ${analyzing
                            ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                            : "bg-black text-white hover:bg-slate-800 hover:-translate-y-0.5"
                            }`}
                    >
                        {analyzing ? <RefreshCw className="animate-spin" size={16} /> : <BrainCircuit size={16} />}
                        {analyzing ? "Generating Yoga Insights..." : aiAnalysis ? "Regenerate Yoga Report" : "Generate Yoga Report"}
                    </button>
                    {error && <span className="text-[10px] font-bold text-red-500 animate-pulse">{error}</span>}
                </div>
            </div>

            <AnimatePresence mode="wait">
                {aiAnalysis ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8"
                    >
                        {yogaCards.map((card, idx) => (
                            <div key={idx} className={`${card.light} border ${card.border} rounded-[2.5rem] p-8 md:p-12 shadow-lg relative overflow-hidden group`}>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className={`w-12 h-12 ${card.color} text-white rounded-2xl flex items-center justify-center shadow-lg`}>
                                            {card.icon}
                                        </div>
                                        <h3 className={`text-[10px] font-black uppercase tracking-[0.3em] ${card.accent}`}>{card.title}</h3>
                                    </div>
                                    <div className={`text-lg md:text-xl font-medium leading-relaxed whitespace-pre-wrap ${card.text}`}>
                                        {card.content}
                                    </div>
                                </div>
                            </div>
                        ))}
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
                            <h2 className="text-xl font-black text-[#2D2926]">No Yoga Report Found</h2>
                            <p className="text-sm text-slate-500 mt-2">Analyze the Loshu Grid planes to uncover special yogas and their impact on this client's life and career.</p>
                        </div>
                        <button
                            onClick={generateYogaReport}
                            className="px-10 py-4 bg-black text-white font-black uppercase text-[10px] tracking-widest rounded-2xl shadow-xl hover:shadow-black/20 hover:-translate-y-1 transition-all"
                        >
                            Generate Report
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
