import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Grid, Globe, User, UserCheck, Shield, Zap, ArrowLeft, Sparkles, BrainCircuit, RefreshCw } from "lucide-react";
import { api } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { Link } from "react-router-dom";

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

const translations: Record<string, any> = {
    English: {
        title: "Lo Shu Grid Result",
        basedOn: "Analysis based on birth date",
        calcOptions: "Calculator Options",
        male: "Male",
        female: "Female",
        targetDate: "Target Date",
        dobSummary: "D.O.B Summary",
        driver: "Driver (Psychic)",
        conductor: "Conductor (Destiny)",
        kuaNumber: "Kua Number",
        success: "Success",
        health: "Health",
        relations: "Relations",
        growth: "Growth",
        avoid: "Avoid Directions",
        addonTitle: "Deep AI Insight",
        addonDesc: "Utilizes Gemini 1.5 Flash to synthesize personality, career paths, and remedies.",
        generateBtn: "Generate Deep Intel",
        regenerateBtn: "Regenerate in",
        synthesizing: "Synthesizing...",
        strengths: "Natural Strengths",
        remedies: "Missing Paths & Remedies",
        kuaAnalysis: "Kua Directions Analysis",
        kuaDesc: "Detailed lucky and unlucky directions for Master Kua Number",
        forNumber: "For Number"
    },
    Telugu: {
        title: "లో షు గ్రిడ్ ఫలితం",
        basedOn: "పుట్టిన తేదీ ఆధారంగా విశ్లేషణ",
        calcOptions: "క్యాలిక్యులేటర్ ఎంపికలు",
        male: "పురుషుడు",
        female: "స్త్రీ",
        targetDate: "లక్ష్య తేదీ",
        dobSummary: "పుట్టిన తేదీ సారాంశం",
        driver: "డ్రైవర్ (సైకిక్)",
        conductor: "కండక్టర్ (డెస్టినీ)",
        kuaNumber: "కువా సంఖ్య",
        success: "విజయం",
        health: "ఆరోగ్యం",
        relations: "సంబంధాలు",
        growth: "వృద్ధి",
        avoid: "నివారించవలసిన దిశలు",
        addonTitle: "లోతైన AI అంతర్దృష్టి",
        addonDesc: "వ్యక్తిత్వం, వృత్తి మార్గాలు మరియు నివారణలను సంశ్లేషణ చేయడానికి జెమిని 1.5 ఫ్లాష్‌ను ఉపయోగిస్తుంది.",
        generateBtn: "లోతైన మేధస్సును రూపొందించండి",
        regenerateBtn: "మళ్ళీ రూపొండి",
        synthesizing: "సంశ్లేషణ చేస్తోంది...",
        strengths: "సహజ బలాలు",
        remedies: "తప్పిపోయిన మార్గాలు & నివారణలు",
        kuaAnalysis: "కువా దిశల విశ్లేషణ",
        kuaDesc: "మాస్టర్ కువా సంఖ్య కోసం వివరణాత్మక అదృష్ట మరియు దురదృష్టకర దిశలు",
        forNumber: "సంఖ్య కోసం",
        sqDesc: "శ్రేయస్సు, ఆరోగ్యం మరియు శక్తి కోసం ఉత్తమం. ఆఫీస్ డెస్క్ లేదా ప్రధాన ద్వారం కోసం అనువైనది.",
        tyDesc: "నయం మరియు కోలుకోవడాన్ని ప్రోత్సహిస్తుంది. వంటగది మరియు పడకగది దిశకు అనువైనది.",
        ynDesc: "కుటుంబం మరియు భాగస్వామ్యాల్లో సామరస్యం మరియు దీర్ఘకాలిక స్థిరత్వాన్ని పెంచుతుంది.",
        fwDesc: "వ్యక్తిగత ఎదుగుదల మరియు మనశ్శాంతి కోసం. ధ్యానం లేదా అధ్యయనం కోసం అనువైనది.",
        labels: {
            1: "కృషి",
            2: "సంబంధాలు",
            3: "కుటుంబం",
            4: "సంపద",
            5: "సంతులనం",
            6: "సహాయకులు",
            7: "సృజనాత్మకత",
            8: "జ్ఞానం",
            9: "కీర్తి"
        },
        desc: {
            1: "తర్కం, నాయకత్వ బీజం, కెరీర్, విజయం, ఉద్యోగం, వ్యాపారం, కమ్యూనికేషన్, వ్యక్తిత్వం",
            2: "సంబంధాలు, సహకారం, వివాహం, ప్రేమ, సున్నితత్వం, అంతర్ దృష్టి",
            3: "సృజనాత్మకత, వ్యక్తీకరణ, ఆరోగ్యం, ప్రణాళిక, ఊహ, కుటుంబం, వివేకం, గతం",
            4: "క్రమశిక్షణ, కష్టపడి పనిచేయడం, ఆచరణాత్మకత, అదృష్టం, డబ్బు, ఆత్మగౌరవం, శక్తి",
            5: "అనుకూలత, సంతులనం, స్థిరత్వం, అదృష్టం, మానసిక ఆరోగ్యం, స్వేచ్ఛ",
            6: "సేవ, బాధ్యత, స్నేహితులు, ప్రయాణం, కొత్త ప్రారంభాలు, ఆధ్యాత్మికత, తండ్రి",
            7: "అంతర్ దృష్టి, ఆధ్యాత్మికత, పిల్లలు, సృజనాత్మకత, నిరాశలు, వినోదం, భవిష్యత్తు",
            8: "క్రమశిక్షణ, ఆశయం, జ్ఞానం, ప్రేరణ, అంతర్ దృష్టి, వ్యవస్థీకృత, ఆధ్యాత్మికత, అధ్యయనం",
            9: "ఆదర్శవాదం, ప్రేరణ, శ్రేయస్సు, మానవత్వం, సామాజిక జీవితం, కీర్తి"
        }
    },
    Hindi: {
        title: "लो शु ग्रिड परिणाम",
        basedOn: "जन्म तिथि पर आधारित विश्लेषण",
        calcOptions: "कैलकुलेटर विकल्प",
        male: "पुरुष",
        female: "महिला",
        targetDate: "लक्ष्य तिथि",
        dobSummary: "जन्म तिथि सारांश",
        driver: "ड्राइवर (साइకిక్)",
        conductor: "कंडक्टर (डेस्टिनी)",
        kuaNumber: "कुआ नंबर",
        success: "सफलता",
        health: "स्वास्थ्य",
        relations: "संबंध",
        growth: "विकास",
        avoid: "बचने योग्य दिशाएं",
        addonTitle: "गहन AI अंतर्दृष्टि",
        addonDesc: "व्यक्तित्व, करियर पथ और उपचारों को संश्लेषित करने के लिए जेमिनी 1.5 फ्लैश का उपयोग करता है।",
        generateBtn: "गहन बुद्धिमत्ता उत्पन्न करें",
        regenerateBtn: "फिर से उत्पन्न करें",
        synthesizing: "संश्लेषण हो रहा है...",
        strengths: "प्राकृतिक ताकत",
        remedies: "लापता रास्ते और उपचार",
        kuaAnalysis: "कुआ दिशा विश्लेषण",
        kuaDesc: "मास्टर कुआ नंबर के लिए विस्तृत भाग्यशाली और दुर्भाग्यपूर्ण दिशाएं",
        forNumber: "नंबर के लिए",
        sqDesc: "समृद्धि, स्वास्थ्य और जीवन शक्ति के लिए सबसे अच्छा। ऑफिस डेस्क या मुख्य द्वार के लिए आदर्श।",
        tyDesc: "उपचार और रिकवरी को बढ़ावा देता है। रसोई और शयनकक्ष के लिए अनुकूल।",
        ynDesc: "परिवार और साझेदारी में सद्भाव और दीर्घकालिक स्थिरता को बढ़ावा देता है।",
        fwDesc: "व्यक्तिगत विकास और मानसिक शांति के लिए। ध्यान या अध्ययन के लिए उपयुक्त।",
        labels: {
            1: "कैरियर",
            2: "रिश्ते",
            3: "परिवार",
            4: "धन",
            5: "संतुलन",
            6: "सहायक",
            7: "रचनात्मकता",
            8: "ज्ञान",
            9: "प्रसिद्धि"
        },
        desc: {
            1: "तर्क, नेतृत्व का बीज, करियर, सफलता, नौकरी, व्यवसाय, संचार, व्यक्तित्व",
            2: "रिश्ते, सहयोग, विवाह, प्यार, संवेदनशीलता, अंतर्ज्ञान",
            3: "रचनात्मकता, अभिव्यक्ति, स्वास्थ्य, योजना, कल्पना, परिवार, बुद्धि, अतीत",
            4: "व्यवस्था, कड़ी मेहनत, व्यावहारिकता, भाग्य, पैसा, अनुशासन, आत्म-मूल्य, शक्ति",
            5: "अनुकूलन क्षमता, संतुलन, स्थिरता, भाग्य, मानसिक स्वास्थ्य, स्वतंत्रता",
            6: "सेवा, जिम्मेदारी, दोस्त, यात्रा, नई शुरुआत, आध्यात्मिकता, पिता",
            7: "अंतर्ज्ञान, आध्यात्मिकता, बच्चे, रचनात्मकता, निराशा, मनोरंजन, भविष्य",
            8: "अनुशासन, महत्वाकांक्षा, ज्ञान, प्रेरणा, अंतर्ज्ञान, संगठित, आध्यात्मिकता, अध्ययन",
            9: "आदर्शवाद, प्रेरणा, समृद्धि, मानवता, सामाजिक जीवन, प्रसिद्धि"
        }
    }
};

export default function ClientLoShuGridPage() {
    const params = useParams();
    const navigate = useNavigate();
    const [client, setClient] = useState<any>(null);
    const [gender, setGender] = useState<"male" | "female">("male");
    const [gridCounts, setGridCounts] = useState<Record<number, number>>({});
    const [gridStructure, setGridStructure] = useState<GridMapping[]>([]);
    const [driverNumber, setDriverNumber] = useState<number | null>(null);
    const [conductorNumber, setConductorNumber] = useState<number | null>(null);
    const [kuaNumber, setKuaNumber] = useState<number | null>(null);
    const [meanings, setMeanings] = useState<LoShuMeaning[]>([]);
    const [kuaDetails, setKuaDetails] = useState<KuaDetail[]>([]);
    const { language } = useLanguage();
    const [loading, setLoading] = useState(true);
    const [analyzing, setAnalyzing] = useState(false);
    const [aiAnalysis, setAiAnalysis] = useState<any>(null);

    const t = translations[language] || translations.English;

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
                const clientData = await clientRes.ok ? await clientRes.json() : null;
                if (clientData) {
                    setClient(clientData);
                    performCalculation(clientData.dob, "male");
                    if (clientData.loshu_ai_report) {
                        try {
                            setAiAnalysis(JSON.parse(clientData.loshu_ai_report));
                        } catch (e) {
                            console.error("Failed to parse AI report", e);
                        }
                    }
                }
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

    const generateAIAnalysis = async () => {
        if (!client) return;
        setAnalyzing(true);
        try {
            // 1. Get Chaldean Sum for the name
            const calcRes = await api.post("/admin/calculate", {
                name: client.full_name,
                dob: client.dob
            });
            const calcData = await calcRes.json();
            const chaldeanSum = calcData.chaldean?.total || "?";

            // 2. Identify Missing Numbers
            const missing = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(n => !gridCounts[n]);

            // 3. Request Deep Analysis
            const aiRes = await api.post("/admin/ai/analyze-loshu", {
                client_id: client.id,
                name: client.full_name,
                chaldeanSum: chaldeanSum,
                missingNumbers: missing,
                language: language
            });

            const aiData = await aiRes.json();
            if (aiData.success) {
                setAiAnalysis(aiData.analysis);
            }
        } catch (err) {
            console.error("AI Analysis Failed:", err);
        } finally {
            setAnalyzing(false);
        }
    };

    if (loading) return <div className="p-20 text-center animate-pulse text-slate-400">Loading Analysis...</div>;
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
                        <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
                            <span className="text-primary"><Grid size={24} /></span>
                            {t.title}: <span className="text-slate-600 font-bold">{client.full_name}</span>
                        </h1>
                        <p className="text-xs text-muted-foreground">{t.basedOn}: {new Date(client.dob).toLocaleDateString()}</p>
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
                        <h2 className="text-[10px] uppercase font-black text-slate-400 mb-4 tracking-[0.2em]">{t.calcOptions}</h2>
                        <div className="space-y-4">
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleGenderChange("male")}
                                    className={`flex-1 py-3 rounded-xl border flex items-center justify-center gap-2 font-bold transition-all ${gender === "male" ? "bg-blue-50 border-blue-200 text-blue-600 shadow-inner" : "bg-white border-slate-200 text-slate-400"
                                        }`}
                                >
                                    <User size={16} /> {t.male}
                                </button>
                                <button
                                    onClick={() => handleGenderChange("female")}
                                    className={`flex-1 py-3 rounded-xl border flex items-center justify-center gap-2 font-bold transition-all ${gender === "female" ? "bg-pink-50 border-pink-200 text-pink-600 shadow-inner" : "bg-white border-slate-200 text-slate-400"
                                        }`}
                                >
                                    <UserCheck size={16} /> {t.female}
                                </button>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">{t.targetDate}</div>
                                <div className="text-sm font-black text-slate-800">{new Date(client.dob).toLocaleDateString(language === 'English' ? 'en-US' : 'en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card p-6 bg-white rounded-3xl border border-slate-200 shadow-xl">
                        <h2 className="text-[10px] uppercase font-black text-slate-400 mb-4 tracking-[0.2em]">{t.dobSummary}</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-gradient-to-br from-indigo-50 to-white rounded-2xl border border-indigo-100 relative overflow-hidden group">
                                <div className="text-[8px] text-indigo-400 font-bold uppercase mb-1">{t.driver}</div>
                                <div className="text-3xl font-black text-indigo-900 leading-none">{driverNumber}</div>
                                <div className="absolute -bottom-2 -right-1 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <User size={40} className="text-indigo-900" />
                                </div>
                            </div>
                            <div className="p-4 bg-gradient-to-br from-violet-50 to-white rounded-2xl border border-violet-100 relative overflow-hidden group">
                                <div className="text-[8px] text-violet-400 font-bold uppercase mb-1">{t.conductor}</div>
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
                                <h3 className="text-[10px] uppercase font-black text-slate-400 mb-1 tracking-[0.2em]">{t.kuaNumber}</h3>
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
                                        <div className="text-[8px] uppercase font-black text-emerald-600">{t.success}</div>
                                        <div className="text-sm font-black text-emerald-900">{kuaResult.sheng_qi}</div>
                                    </div>
                                    <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                                        <div className="text-[8px] uppercase font-black text-blue-600">{t.health}</div>
                                        <div className="text-sm font-black text-blue-900">{kuaResult.tian_yi}</div>
                                    </div>
                                    <div className="p-3 bg-orange-50 rounded-xl border border-orange-100">
                                        <div className="text-[8px] uppercase font-black text-orange-600">{t.relations}</div>
                                        <div className="text-sm font-black text-orange-900">{kuaResult.yan_nian}</div>
                                    </div>
                                    <div className="p-3 bg-purple-50 rounded-xl border border-purple-100">
                                        <div className="text-[8px] uppercase font-black text-purple-600">{t.growth}</div>
                                        <div className="text-sm font-black text-purple-900">{kuaResult.fu_wei}</div>
                                    </div>
                                </div>
                                <div className="p-3 bg-red-50 rounded-xl border border-red-100">
                                    <div className="text-[8px] uppercase font-black text-red-500">{t.avoid}</div>
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

                    {/* AI Addon Trigger */}
                    <div className="glass-card p-6 bg-black text-white rounded-3xl shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
                            <BrainCircuit size={48} />
                        </div>
                        <h2 className="text-[10px] uppercase font-black text-slate-500 mb-1 tracking-[0.2em]">Addon Module</h2>
                        <h3 className="text-xl font-black italic mb-4 flex items-center gap-2">
                            Deep AI Insight
                        </h3>
                        <p className="text-[10px] text-slate-400 leading-relaxed mb-6">
                            {t.addonDesc} ({language})
                        </p>

                        <button
                            onClick={generateAIAnalysis}
                            disabled={analyzing}
                            className={`w-full py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 transition-all ${analyzing
                                ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                                : "bg-blue-500 text-white hover:shadow-[0_0_30px_rgba(230,17,17,0.4)]"
                                }`}
                        >
                            {analyzing ? <RefreshCw className="animate-spin" size={16} /> : <Sparkles size={16} />}
                            {analyzing ? t.synthesizing : aiAnalysis ? `${t.regenerateBtn} ${language}` : t.generateBtn}
                        </button>
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
                                        {t.desc?.[Number(cell.number)] || cell.quality}
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
                                <Shield size={14} /> {t.strengths}
                            </h4>
                            <div className="space-y-5">
                                {gridStructure.map(cell => gridCounts[cell.number] && (
                                    <div key={cell.id} className="flex items-start gap-4">
                                        <div className="w-8 h-8 bg-emerald-500 rounded-xl flex-shrink-0 flex items-center justify-center text-white font-black text-xs shadow-lg shadow-emerald-500/20">
                                            {cell.number}
                                        </div>
                                        <div>
                                            <div className="text-sm font-black text-slate-800">{t.forNumber} {cell.number}</div>
                                            <div className="text-xs text-slate-500 leading-relaxed mt-0.5">{t.desc?.[Number(cell.number)] || meanings.find(m => m.number === cell.number)?.quality || cell.quality}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Remedies */}
                        <div className="p-6 bg-amber-50/40 rounded-3xl border border-amber-100/50">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-amber-600 mb-6 flex items-center gap-2">
                                <Zap size={14} /> {t.remedies}
                            </h4>
                            <div className="space-y-6">
                                {gridStructure.map(cell => !gridCounts[cell.number] && (
                                    <div key={cell.id} className="flex items-start gap-4">
                                        <div className="w-8 h-8 bg-amber-200 border border-amber-300 rounded-xl flex-shrink-0 flex items-center justify-center text-amber-700 font-black text-xs">
                                            ?
                                        </div>
                                        <div>
                                            <div className="text-sm font-black text-slate-800">{t.forNumber} {cell.number}</div>
                                            <div className="text-xs text-amber-800/70 italic mt-1 bg-amber-100/50 p-2 rounded-lg border border-amber-200/20">
                                                {meanings.find(m => m.number === cell.number)?.remedy || (language === 'Telugu' ? "ఈ అంశంపై దృష్టి పెట్టండి మరియు పట్టుదలను పెంపొందించుకోండి." : "Focus on building structure and persistence in this area.")}
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
                                    {t.kuaAnalysis}
                                </h3>
                                <p className="text-xs text-slate-500 mt-1">{t.kuaDesc} {kuaNumber}</p>
                            </div>
                        </div>
                        <div className="p-8">
                            {kuaNumber && kuaResult ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <div className="p-6 rounded-3xl bg-emerald-50 border border-emerald-100 shadow-sm transition-all hover:shadow-md">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center font-black">SQ</div>
                                            <div>
                                                <div className="text-[10px] font-black uppercase text-emerald-600 tracking-widest">{t.success}</div>
                                                <div className="text-lg font-black text-emerald-900">{kuaResult.sheng_qi}</div>
                                            </div>
                                        </div>
                                        <p className="text-[11px] text-emerald-700 leading-relaxed font-medium">{t.sqDesc || "Best for prosperity, health, and vitality. Ideal for office desk or front door facing."}</p>
                                    </div>

                                    <div className="p-6 rounded-3xl bg-blue-50 border border-blue-100 shadow-sm transition-all hover:shadow-md">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 bg-blue-500 text-white rounded-xl flex items-center justify-center font-black">TY</div>
                                            <div>
                                                <div className="text-[10px] font-black uppercase text-blue-600 tracking-widest">{t.health}</div>
                                                <div className="text-lg font-black text-blue-900">{kuaResult.tian_yi}</div>
                                            </div>
                                        </div>
                                        <p className="text-[11px] text-blue-700 leading-relaxed font-medium">{t.tyDesc || "Promotes healing and recovery. Optimal for kitchen and bedroom orientation."}</p>
                                    </div>

                                    <div className="p-6 rounded-3xl bg-orange-50 border border-orange-100 shadow-sm transition-all hover:shadow-md">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 bg-orange-500 text-white rounded-xl flex items-center justify-center font-black">YN</div>
                                            <div>
                                                <div className="text-[10px] font-black uppercase text-orange-600 tracking-widest">{t.relations}</div>
                                                <div className="text-lg font-black text-orange-900">{kuaResult.yan_nian}</div>
                                            </div>
                                        </div>
                                        <p className="text-[11px] text-orange-700 leading-relaxed font-medium">{t.ynDesc || "Fosters harmony and long-term stability in family and partnerships."}</p>
                                    </div>

                                    <div className="p-6 rounded-3xl bg-purple-50 border border-purple-100 shadow-sm transition-all hover:shadow-md">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 bg-purple-500 text-white rounded-xl flex items-center justify-center font-black">FW</div>
                                            <div>
                                                <div className="text-[10px] font-black uppercase text-purple-600 tracking-widest">{t.growth}</div>
                                                <div className="text-lg font-black text-purple-900">{kuaResult.fu_wei}</div>
                                            </div>
                                        </div>
                                        <p className="text-[11px] text-purple-700 leading-relaxed font-medium">{t.fwDesc || "For personal growth and peace of mind. Suitable for meditation or study."}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-10 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                                    <p className="text-slate-400 italic">Direction analysis data unavailable for this Kua number.</p>
                                </div>
                            )}

                            <div className="mt-8 p-6 bg-red-50/50 rounded-3xl border border-red-100">
                                <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-red-600 mb-4">
                                    <Zap size={14} /> {t.avoid}
                                </h4>
                                <div className="flex flex-wrap gap-3">
                                    {kuaNumber && kuaResult?.bad_directions?.split(',').map((dir, idx) => (
                                        <div key={idx} className="px-5 py-3 bg-white border border-red-100 rounded-2xl shadow-sm">
                                            <div className="text-[8px] font-black text-red-300 uppercase leading-none mb-1">
                                                {language === 'Telugu' ? 'దురదృష్టకరం' : language === 'Hindi' ? 'दुर्भाग्यपूर्ण' : 'Unlucky'}
                                            </div>
                                            <div className="text-xl font-black text-red-600">{dir.trim()}</div>
                                        </div>
                                    ))}
                                </div>
                                <p className="text-[10px] text-red-500/70 mt-4 leading-relaxed font-medium">
                                    {language === 'Telugu' ? (
                                        'గమనిక: ప్రతికూల శక్తి జోక్యాన్ని తగ్గించడానికి నిద్రపోతున్నప్పుడు, పని చేస్తున్నప్పుడు లేదా ఎక్కువసేపు కూర్చున్నప్పుడు ఈ దిశలను ఎదుర్కోవడం మానుకోండి.'
                                    ) : language === 'Hindi' ? (
                                        'नोट: नकारात्मक ऊर्जा के हस्तक्षेप को कम करने के लिए सोते, काम करते या लंबे समय तक बैठते समय इन दिशाओं का सामना करने से बचें।'
                                    ) : (
                                        'Note: Avoid facing these directions when sleeping, working, or sitting for long periods to minimize negative energy interference.'
                                    )}
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* AI Analysis Result Section */}
                    <AnimatePresence>
                        {aiAnalysis && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="space-y-8"
                            >
                                <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl p-8 md:p-12 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-8 text-slate-50">
                                        <BrainCircuit size={120} />
                                    </div>
                                    <div className="relative z-10 flex items-center gap-4 mb-8">
                                        <div className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center">
                                            <Sparkles size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black italic tracking-tighter uppercase">AI Synthetic Report</h3>
                                            <div className="flex gap-2 items-center">
                                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Confirme Intel • Gemini 1.5 Flash</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                        <div className="space-y-8">
                                            <div>
                                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Personality Architecture</h4>
                                                <p className="text-slate-600 leading-relaxed text-sm italic font-medium">
                                                    {aiAnalysis.personality_insight}
                                                </p>
                                            </div>
                                            <div>
                                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Strategic Career Alpha</h4>
                                                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                                    <p className="text-slate-900 font-bold leading-relaxed text-sm">
                                                        {aiAnalysis.career_advice}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">Remedial Protocols</h4>
                                            <div className="space-y-4">
                                                {aiAnalysis.remedies.map((remedy: string, idx: number) => (
                                                    <div key={idx} className="flex gap-4 p-5 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-md transition-all group">
                                                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black text-xs shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                                                            {idx + 1}
                                                        </div>
                                                        <p className="text-xs font-bold text-slate-700 leading-relaxed">{remedy}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div >
        </div >
    );
}
