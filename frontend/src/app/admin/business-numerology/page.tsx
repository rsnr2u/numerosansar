"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
    Search,
    Star,
    Save,
    Sparkles,
    Database,
    Users,
    History,
    ArrowLeft,
    CheckCircle,
    Briefcase,
    Printer,
    PlusCircle,
    Download
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// --- Types ---
interface Planet {
    id: number;
    number: number;
    planet_name: string;
}
interface Compound {
    id: number;
    number: number;
    title: string;
    description: string;
    result: string; // "Good", "Excellent", etc.
}
interface LetterMap {
    id: number;
    letter: string;
    chaldean_number: number;
    pythagorean_number: number;
}
interface Client {
    id: number;
    full_name: string;
    calling_name?: string;
    dob: string;
}
interface CharBreakdown {
    char: string;
    chaldean: number;
    pythagorean: number;
}
const DANGEROUS_NUMBERS = [10, 12, 13, 16, 18];

interface SystemResult {
    system: "Chaldean" | "Pythagorean";
    compound: number;
    meaning?: string;
    description?: string;
    resultType?: string; // For coloring
}
interface PlanetRelation {
    id: number;
    planet_number: number;
    planet_name: string;
    friend_numbers: string; // "1,2,3"
    enemy_numbers: string;
    neutral_numbers: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

const reduceNumber = (num: number): number => {
    while (num > 9) {
        let sum = 0;
        String(num).split('').forEach(d => sum += parseInt(d));
        num = sum;
    }
    return num;
};

const calculateAge = (dob: string): number => {
    if (!dob) return 0;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};

const parseNumberList = (str: string | undefined): number[] => {
    if (!str) return [];
    return str.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
};

const isVowel = (char: string) => ['A', 'E', 'I', 'O', 'U'].includes(char.toUpperCase());

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

// --- Components ---
const SystemCard = ({ result }: { result: SystemResult }) => {
    const isChaldean = result.system === "Chaldean";
    const bgClass = isChaldean
        ? "bg-[#EEF2FF] border-[#E0E7FF] dark:bg-blue-900/20 dark:border-blue-800"
        : "bg-[#FFFBEB] border-[#FEF3C7] dark:bg-amber-900/20 dark:border-amber-800";

    const baseColorClass = isChaldean ? "text-blue-600" : "text-amber-600";
    const statusBorder = getResultColor(result.resultType);

    return (
        <motion.div
            whileHover={{ y: -5, scale: 1.01 }}
            className={`p-8 flex flex-col items-center text-center relative overflow-hidden group border-2 rounded-[2.5rem] ${bgClass} ${statusBorder} transition-all duration-500 shadow-sm hover:shadow-xl`}
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

export default function BusinessNumerology() {
    // --- State ---
    const [businessName, setBusinessName] = useState("");
    const [originalName, setOriginalName] = useState("");

    // Data
    const [lettersMap, setLettersMap] = useState<LetterMap[]>([]);
    const [compounds, setCompounds] = useState<Compound[]>([]);
    const [loadingData, setLoadingData] = useState(true);

    // Results
    const [breakdown, setBreakdown] = useState<CharBreakdown[]>([]);
    const [chaldeanRes, setChaldeanRes] = useState<SystemResult | null>(null);
    const [pythagoreanRes, setPythagoreanRes] = useState<SystemResult | null>(null);
    const [planets, setPlanets] = useState<Planet[]>([]);
    const [planetRelations, setPlanetRelations] = useState<PlanetRelation[]>([]);
    const [luckyNumbers, setLuckyNumbers] = useState<number[]>([]);
    const [birthData, setBirthData] = useState<any>(null);

    // Search
    const [clientSearch, setClientSearch] = useState("");
    const [clientResults, setClientResults] = useState<Client[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);

    // History
    const [history, setHistory] = useState<any[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [showListing, setShowListing] = useState(false);

    const router = useRouter();
    const searchParams = useSearchParams();

    // --- Init ---
    useEffect(() => {
        const init = async () => {
            const token = localStorage.getItem("admin_token");
            if (!token) return router.push("/admin/login");

            try {
                const responses = await Promise.all([
                    fetch(`${BASE_URL}/admin/letters`, { headers: { Authorization: `Bearer ${token}` } }),
                    fetch(`${BASE_URL}/admin/meanings`, { headers: { Authorization: `Bearer ${token}` } }),
                    fetch(`${BASE_URL}/admin/planets`, { headers: { Authorization: `Bearer ${token}` } }),
                    fetch(`${BASE_URL}/admin/planet-relations`, { headers: { Authorization: `Bearer ${token}` } }),
                ]);

                // Check for Auth failure
                const unauthorized = responses.some(r => r.status === 401);
                if (unauthorized) {
                    localStorage.removeItem("admin_token");
                    router.push("/admin/login");
                    return;
                }

                const [lRes, cRes, pRes, prRes] = responses;

                if (lRes.ok && cRes.ok && pRes.ok && prRes.ok) {
                    setLettersMap(await lRes.json());
                    setCompounds(await cRes.json());
                    setPlanets(await pRes.json());
                    setPlanetRelations(await prRes.json());
                }
            } catch (e) {
                console.error("Failed to load data", e);
            } finally {
                setLoadingData(false);
            }
        };
        init();

        const urlName = searchParams.get('business');
        if (urlName) {
            setBusinessName(urlName);
        }

        const clientId = searchParams.get('client_id');
        if (clientId) {
            fetchClient(clientId);
            fetchHistory(clientId);
        }

        const checkIdParam = searchParams.get('check_id');
        if (checkIdParam) {
            setCheckId(Number(checkIdParam));
        }
    }, [searchParams]);

    useEffect(() => {
        const checkIdParam = searchParams.get('check_id');
        const nameParam = searchParams.get('business');

        if (checkIdParam) {
            setCheckId(Number(checkIdParam));
            setShowListing(false);
        } else if (nameParam) {
            setShowListing(false);
        }
    }, [searchParams]);

    const fetchClient = async (id: string) => {
        try {
            const token = localStorage.getItem("admin_token");
            const res = await fetch(`${BASE_URL}/admin/clients/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setSelectedClient(data);
            }
        } catch (e) {
            console.error("Failed to fetch client", e);
        }
    };

    const fetchHistory = async (id: string) => {
        try {
            const token = localStorage.getItem("admin_token");
            const res = await fetch(`${BASE_URL}/admin/clients/${id}/history`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                const businessHistory = data.filter((h: any) => h.type === 'Business');
                setHistory(businessHistory);

                const hasUrlName = searchParams.get('business');
                const hasUrlId = searchParams.get('check_id');
                if (businessHistory.length > 0 && !hasUrlName && !hasUrlId) {
                    setShowListing(true);
                }
            }
        } catch (e) {
            console.error("Failed to fetch history", e);
        }
    };

    // Lookup Maps
    const { chMap, pyMap } = useMemo(() => {
        const c: Record<string, number> = {};
        const p: Record<string, number> = {};
        lettersMap.forEach(l => {
            c[l.letter] = Number(l.chaldean_number);
            p[l.letter] = Number(l.pythagorean_number);
        });
        return { chMap: c, pyMap: p };
    }, [lettersMap]);

    // --- Core Logic ---
    useEffect(() => {
        if (loadingData) return;

        const cleanForCalc = businessName.toUpperCase().replace(/[^A-Z]/g, '');

        if (!cleanForCalc) {
            setBreakdown([]);
            setChaldeanRes(null);
            setPythagoreanRes(null);
            return;
        }

        const chars = cleanForCalc.split('');
        const newBreakdown: CharBreakdown[] = [];
        let chTotal = 0, pyTotal = 0;

        chars.forEach(char => {
            const cv = chMap[char] || 0;
            const pv = pyMap[char] || 0;
            newBreakdown.push({ char, chaldean: cv, pythagorean: pv });

            chTotal += cv;
            pyTotal += pv;
        });

        setBreakdown(newBreakdown);

        const getMeaning = (num: number) => compounds.find(c => Number(c.number) === num);
        const getPlanet = (num: number) => planets.find(p => Number(p.number) === num)?.planet_name;

        const chSingle = reduceNumber(chTotal);
        const chM = getMeaning(chTotal);
        setChaldeanRes({
            system: "Chaldean",
            compound: chTotal,
            single: chSingle,
            planet: getPlanet(chSingle),
            meaning: chM?.title,
            description: chM?.description,
            resultType: chM?.result || 'Analyzed'
        });

        const pySingle = reduceNumber(pyTotal);
        const pyM = getMeaning(pyTotal);
        setPythagoreanRes({
            system: "Pythagorean",
            compound: pyTotal,
            single: pySingle,
            planet: getPlanet(pySingle),
            meaning: pyM?.title,
            description: pyM?.description,
            resultType: pyM?.result || 'Analyzed'
        });

    }, [businessName, loadingData, chMap, pyMap, compounds, planets]);

    // Lucky Numbers Logic
    useEffect(() => {
        if (!selectedClient?.dob || planetRelations.length === 0) {
            setLuckyNumbers([]);
            return;
        }

        const dob = selectedClient.dob;
        const age = calculateAge(dob);
        const bData = birthDataSync(dob, planets);
        if (!bData) return;

        const dRel = planetRelations.find(r => Number(r.planet_number) === bData.driver);
        const cRel = planetRelations.find(r => Number(r.planet_number) === bData.conductor);

        const dFriends = parseNumberList(dRel?.friend_numbers);
        const cFriends = parseNumberList(cRel?.friend_numbers);

        if (age < 45) {
            setLuckyNumbers(Array.from(new Set([...dFriends, ...cFriends])).sort((a, b) => a - b));
        } else {
            setLuckyNumbers([...cFriends].sort((a, b) => a - b));
        }
    }, [selectedClient, planetRelations, planets, loadingData]);

    const birthDataSync = (dStr: string, p: Planet[]) => {
        if (!dStr) return null;
        const [y, m, d] = dStr.split('-').map(Number);
        const getPlanet = (num: number) => p.find(pl => Number(pl.number) === num)?.planet_name;
        const driver = reduceNumber(d);
        let total = 0;
        dStr.replace(/-/g, '').split('').forEach(n => total += Number(n));
        const conductor = reduceNumber(total);
        return { driver, conductor, driverPlanet: getPlanet(driver), conductorPlanet: getPlanet(conductor) };
    };

    const birthDataRef = useMemo(() => birthDataSync(selectedClient?.dob || "", planets), [selectedClient, planets]);

    const searchClients = async (query: string) => {
        if (!query) { setClientResults([]); return; }
        try {
            const res = await fetch(`${BASE_URL}/admin/clients?search=${query}`, {
                headers: { "Authorization": `Bearer ${localStorage.getItem("admin_token")}` }
            });
            if (res.ok) setClientResults(await res.json());
        } catch (e) { console.error(e); }
    };

    // Savings Logic
    const [checkId, setCheckId] = useState<number | null>(null);
    const [confirmed, setConfirmed] = useState(false);

    const saveToBackend = async () => {
        if (!businessName) return;
        const token = localStorage.getItem("admin_token");
        const clientId = searchParams.get('client_id');
        setIsSaving(true);
        try {
            const res = await fetch(`${BASE_URL}/admin/business-numerology/check`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    id: checkId,
                    business_name: businessName,
                    original_name: originalName,
                    client_id: clientId
                })
            });
            const data = await res.json();
            if (data.check_id) {
                setCheckId(data.check_id);
                setConfirmed(false);
                if (clientId) fetchHistory(clientId);
            }
        } catch (e) {
            console.error("Save failed", e);
        } finally {
            setIsSaving(false);
        }
    };

    const confirmBusiness = async () => {
        if (!checkId) return;
        try {
            const res = await fetch(`${BASE_URL}/admin/numerology/confirm`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('admin_token')}`
                },
                body: JSON.stringify({ check_id: checkId, type: 'Business' })
            });
            if (res.ok) {
                setConfirmed(true);
                const clientId = searchParams.get('client_id');
                if (clientId) fetchHistory(clientId);
            }
        } catch (err) {
            console.error("Failed to confirm", err);
        }
    };

    const downloadPDF = () => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.width;

        // --- Header ---
        doc.setFontSize(22);
        doc.setFont("helvetica", "bold");
        doc.text("Business Numerology Report", pageWidth / 2, 20, { align: "center" });

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth / 2, 28, { align: "center" });

        doc.setLineWidth(0.5);
        doc.line(15, 32, pageWidth - 15, 32);

        // --- Client Info ---
        let yPos = 45;
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("Client Details", 15, yPos);

        yPos += 8;
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(`Name: ${selectedClient?.full_name || "N/A"}`, 15, yPos);
        doc.text(`DOB: ${selectedClient?.dob || "N/A"}`, 100, yPos);

        // --- Business Name ---
        yPos += 15;
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0, 0, 0);
        doc.text("Business Details", 15, yPos);

        yPos += 10;
        // Original
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text("Original Name:", 15, yPos);
        doc.setFontSize(12);
        doc.setTextColor(0);
        doc.text(originalName.toUpperCase() || "N/A", 55, yPos);

        yPos += 8;
        // Changed
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text("Proposed Name:", 15, yPos);
        doc.setFontSize(16);
        doc.setTextColor(40, 40, 150); // Navy Blue
        doc.text(businessName.toUpperCase(), 55, yPos);

        doc.setTextColor(0, 0, 0); // Reset

        // --- Breakdown Table ---
        yPos += 10;
        const tableHead = [["System", ...breakdown.map(b => b.char)]];
        const tableBody = [
            ["Chaldean", ...breakdown.map(b => b.chaldean)],
            ["Pythagorean", ...breakdown.map(b => b.pythagorean)]
        ];

        autoTable(doc, {
            startY: yPos,
            head: tableHead,
            body: tableBody,
            theme: 'grid',
            headStyles: { fillColor: [240, 240, 240], textColor: 0, fontStyle: 'bold' },
            styles: { fontSize: 8, cellPadding: 2, halign: 'center' },
            columnStyles: { 0: { halign: 'left', fontStyle: 'bold', cellWidth: 30 } }
        });

        // --- Results Section ---
        // @ts-ignore
        yPos = doc.lastAutoTable.finalY + 15;

        const drawSystemResult = (title: string, res: SystemResult | null, x: number, y: number) => {
            if (!res) return;

            // Box
            doc.setDrawColor(200);
            doc.setFillColor(252, 252, 252);
            doc.roundedRect(x, y, 80, 60, 3, 3, "FD");

            // Title
            doc.setFontSize(10);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(100);
            doc.text(title.toUpperCase(), x + 40, y + 8, { align: "center" });

            // Compound
            doc.setFontSize(32);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(0);
            doc.text(String(res.compound), x + 40, y + 25, { align: "center" });

            // Stats row
            doc.setFontSize(9);
            doc.setTextColor(80);
            doc.text(`Root: ${res.single}`, x + 20, y + 36, { align: "center" });
            doc.text(`Ruler: ${res.planet}`, x + 60, y + 36, { align: "center" });

            // Meaning
            doc.setFontSize(8);
            doc.setFont("helvetica", "normal"); // Reset bold
            doc.setTextColor(50);

            // Split meaning text to fit
            const lines = doc.splitTextToSize(res.meaning || "", 70);
            doc.text(lines, x + 40, y + 45, { align: "center" });
        };

        if (chaldeanRes) drawSystemResult("Chaldean System", chaldeanRes, 15, yPos);
        if (pythagoreanRes) drawSystemResult("Pythagorean System", pythagoreanRes, 110, yPos);

        yPos += 70;

        // --- Lucky Numbers ---
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0);
        doc.text("Lucky Number Compatibility", 15, yPos);

        yPos += 10;
        const luckyStr = luckyNumbers.length > 0 ? luckyNumbers.join(" - ") : "None";
        doc.setFontSize(14);
        doc.setTextColor(0, 100, 0);
        doc.text(luckyStr, 15, yPos);
        doc.setTextColor(0);

        // --- Footer ---
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text("JC Astro Numerology Services", pageWidth / 2, 280, { align: "center" });

        doc.save(`${selectedClient?.full_name}_Business_Analysis.pdf`);
    };

    const resetAnalysis = () => {
        setBusinessName("");
        setOriginalName("");
        setCheckId(null);
        setConfirmed(false);
        setBreakdown([]);
        setChaldeanRes(null);
        setPythagoreanRes(null);
        setShowListing(false);
    };

    if (showListing && selectedClient) {
        return (
            <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex items-center gap-5">
                        <button onClick={() => router.back()} className="p-2.5 rounded-xl bg-card border border-border hover:border-primary/50 transition-all text-muted-foreground hover:text-primary shadow-sm">
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-3xl font-black flex items-center gap-3 text-foreground tracking-tight">
                                <span className="p-2.5 bg-primary/10 rounded-xl text-primary">
                                    <Briefcase size={24} />
                                </span>
                                {selectedClient.full_name}
                            </h1>
                            <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-widest mt-1 ml-1 opacity-60">Saved Business Numerology Records</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowListing(false)}
                        className="px-6 py-2.5 font-bold rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-all flex items-center gap-2 shadow-lg shadow-primary/20"
                    >
                        <PlusCircle size={18} /> New Analysis
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {history.map((record: any) => (
                        <button
                            key={record.id}
                            onClick={() => {
                                setBusinessName(record.name_value || record.business_name);
                                setOriginalName(record.original_name || "");
                                setCheckId(record.id);
                                setShowListing(false);
                            }}
                            className="w-full text-left p-6 rounded-[2rem] border bg-card/60 backdrop-blur-md border-border/50 hover:border-primary/50 transition-all flex items-center justify-between group shadow-sm hover:shadow-md"
                        >
                            <div className="flex flex-col gap-1">
                                <span className="text-xl font-black text-foreground group-hover:text-primary transition-colors tracking-tight">
                                    {record.name_value}
                                    <span className="text-xs text-muted-foreground ml-2 font-normal">
                                        (was {record.original_name || 'N/A'})
                                    </span>
                                </span>
                                <div className="flex items-center gap-3 mt-1">
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{new Date(record.created_at).toLocaleDateString()}</span>
                                    <div className="flex gap-2">
                                        <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-500 text-[10px] font-black uppercase tracking-wider">
                                            CH: {record.chaldean_compound}
                                        </span>
                                        <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-500 text-[10px] font-black uppercase tracking-wider">
                                            PY: {record.pythagorean_compound}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="p-3 bg-muted/30 rounded-full group-hover:bg-primary/10 group-hover:text-primary transition-all">
                                <ArrowLeft size={20} className="rotate-180" />
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="max-w-7xl mx-auto space-y-8 pb-20">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex items-center gap-5">
                        <button onClick={() => {
                            if (showListing || (history.length > 0 && !showListing)) {
                                if (!showListing) setShowListing(true);
                                else router.back();
                            } else {
                                router.back();
                            }
                        }} className="p-2.5 rounded-xl bg-card border border-border hover:border-primary/50 transition-all text-muted-foreground hover:text-primary shadow-sm">
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-3xl font-black flex items-center gap-3 text-foreground tracking-tight">
                                <span className="p-2.5 bg-primary/10 rounded-xl text-primary">
                                    <Briefcase size={24} />
                                </span>
                                {checkId ? 'Edit Analysis' : 'Business Numerology'}
                            </h1>
                            <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-widest mt-1 ml-1 opacity-60">Evaluate business name vibrations</p>
                        </div>
                    </div>
                    <div className="flex gap-4 items-center">
                        {(history.length > 0 && !checkId) && (
                            <button
                                onClick={() => {
                                    setBusinessName("");
                                    setCheckId(null);
                                    setShowListing(true);
                                }}
                                className="px-4 py-2.5 font-bold rounded-xl bg-card border border-border hover:border-primary/50 transition-all flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
                            >
                                <History size={18} /> View Saved
                            </button>
                        )}

                    </div>
                </div>

                <div className="flex gap-3 items-center">
                    <button
                        onClick={resetAnalysis}
                        className="px-4 py-2.5 font-bold rounded-xl bg-card border border-border hover:border-primary/50 transition-all flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
                    >
                        <PlusCircle size={18} /> New Analysis
                    </button>
                    <div className="w-px h-6 bg-border mx-1" />

                    {businessName && (
                        <button onClick={saveToBackend} disabled={isSaving} className={`px-6 py-2.5 font-black rounded-xl transition-all flex items-center gap-2 shadow-xl hover:shadow-2xl active:scale-95 ${isSaving ? "bg-muted text-muted-foreground cursor-wait" : "bg-blue-600 text-white hover:bg-blue-700"}`}>
                            <Save size={18} /> {isSaving ? 'Saving...' : (checkId ? 'Update Record' : 'Save to Records')}
                        </button>
                    )}

                    {chaldeanRes && (
                        <button
                            onClick={downloadPDF}
                            className="px-4 py-2.5 font-bold rounded-xl bg-card border border-border hover:border-primary/50 transition-all flex items-center gap-2 text-sm text-primary shadow-sm hover:shadow-md active:scale-95"
                        >
                            <Download size={18} /> Download PDF
                        </button>
                    )}
                    {checkId && (
                        <button onClick={confirmBusiness} disabled={confirmed} className={`px-6 py-2.5 font-black rounded-xl transition-all flex items-center gap-2 shadow-xl hover:shadow-2xl active:scale-95 ${confirmed ? "bg-green-500/10 text-green-500 border border-green-500/20 cursor-default" : "bg-gradient-primary text-white glow-on-hover"}`}>
                            {confirmed ? "✓ Confirmed" : "✅ Confirm Business Name"}
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
                    <div className="xl:col-span-2 space-y-8">
                        {/* Search Overlay / Client Display */}
                        <div className="relative z-50">
                            {selectedClient ? (
                                <div className="premium-card p-4 rounded-2xl border-2 border-primary/20 bg-primary/5 backdrop-blur-md flex items-center justify-between shadow-lg animate-in fade-in slide-in-from-top-4 duration-500">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-primary rounded-xl text-black shadow-lg shadow-primary/20">
                                            <Users size={20} />
                                        </div>
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] text-primary font-black uppercase tracking-widest opacity-70">Selected Client</span>
                                                <div className="h-1 w-1 rounded-full bg-primary/30" />
                                                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{new Date(selectedClient.dob).toLocaleDateString()}</span>
                                            </div>
                                            <h2 className="text-xl font-black text-foreground tracking-tight leading-none mt-1">
                                                {selectedClient.full_name}
                                                {selectedClient.calling_name && (
                                                    <span className="text-primary ml-2 opacity-80 font-bold">({selectedClient.calling_name})</span>
                                                )}
                                            </h2>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="premium-card p-1.5 rounded-2xl border border-border bg-card/40 backdrop-blur-md flex items-center shadow-lg group focus-within:border-primary/50 transition-all">
                                    <div className="p-2.5 bg-primary/10 rounded-xl text-primary group-focus-within:bg-primary group-focus-within:text-black transition-colors ml-1">
                                        <Users size={18} />
                                    </div>
                                    <input
                                        className="bg-transparent px-4 py-2 text-foreground w-full outline-none placeholder:text-muted-foreground font-medium"
                                        placeholder="Search existing client..."
                                        value={clientSearch}
                                        onChange={(e) => { setClientSearch(e.target.value); searchClients(e.target.value); }}
                                        onFocus={() => setShowDropdown(true)}
                                    />
                                </div>
                            )}
                            {showDropdown && clientResults.length > 0 && !selectedClient && (
                                <div className="absolute top-full left-0 w-full mt-3 bg-card border border-border rounded-2xl max-h-72 overflow-y-auto shadow-2xl z-50 backdrop-blur-xl divide-y divide-border/50 animate-in fade-in slide-in-from-top-2">
                                    {clientResults.map(c => (
                                        <button key={c.id} onClick={() => {
                                            setSelectedClient(c);
                                            setClientSearch("");
                                            setShowDropdown(false);
                                            const params = new URLSearchParams(searchParams.toString());
                                            params.set('client_id', String(c.id));
                                            router.replace(`?${params.toString()}`);
                                            fetchHistory(String(c.id));
                                        }} className="w-full text-left p-4 hover:bg-primary/5 flex justify-between items-center group transition-colors">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-foreground group-hover:text-primary transition-colors">{c.full_name}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-xs font-mono text-muted-foreground">{new Date(c.dob).toLocaleDateString()}</span>
                                                <ArrowLeft size={14} className="rotate-180 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="premium-card p-6 rounded-[2rem] border border-border bg-card/60 backdrop-blur-sm relative overflow-hidden">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                                {/* Original Business Name */}
                                <div className="space-y-2 group">
                                    <label className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground font-black flex items-center gap-2 mb-1 pl-1">
                                        <div className="w-1.5 h-1.5 rounded-full bg-muted group-focus-within:bg-muted-foreground transition-colors" />
                                        Original Business Name
                                    </label>
                                    <input
                                        value={originalName}
                                        onChange={(e) => setOriginalName(e.target.value)}
                                        className="w-full bg-input/20 border border-border p-3 rounded-xl text-foreground outline-none text-sm focus:border-primary/30 focus:bg-input/40 transition-all font-medium"
                                        placeholder="Current registered name..."
                                    />
                                </div>

                                {/* Proposed Business Name */}
                                <div className="space-y-2 group">
                                    <label className="text-[9px] uppercase tracking-[0.2em] text-primary font-black flex items-center gap-2 mb-1 pl-1">
                                        <Sparkles size={10} className="text-primary animate-pulse" />
                                        Proposed Business Name
                                    </label>
                                    <div className="relative">
                                        <input
                                            value={businessName}
                                            onChange={(e) => setBusinessName(e.target.value.toUpperCase())}
                                            className="w-full bg-primary/5 border-2 border-primary/30 p-2.5 rounded-xl text-xl font-black text-foreground outline-none shadow-inner focus:border-primary focus:shadow-[0_0_15px_rgba(var(--primary-rgb),0.2)] transition-all placeholder:text-muted-foreground/30"
                                            placeholder="ENTER NAME TO ANALYZE..."
                                        />
                                        <div className="absolute right-3 bottom-3 text-[8px] text-muted-foreground font-black uppercase tracking-widest opacity-40">
                                            {businessName.length}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Results Area */}
                        {(chaldeanRes && pythagoreanRes) && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">

                                {/* Birth Data & Lucky Numbers (Reference) */}
                                {birthDataRef && (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="premium-card p-6 rounded-[2rem] border border-border text-center bg-card/60 backdrop-blur-sm group hover:border-[#D4AF37]/30 transition-all">
                                            <p className="text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.2em] mb-4 text-center">Driver (Reference)</p>
                                            <div className="text-6xl font-black text-foreground mb-2 group-hover:scale-110 transition-transform duration-500">{birthDataRef.driver}</div>
                                            <div className="flex items-center justify-center gap-2 text-[#D4AF37] font-bold">
                                                <Star size={14} className="fill-[#D4AF37]" />
                                                <span className="text-xs uppercase tracking-widest">{birthDataRef.driverPlanet}</span>
                                            </div>
                                        </div>

                                        <div className="premium-card p-6 rounded-[2rem] border border-border text-center bg-card/60 backdrop-blur-sm group hover:border-[#6366f1]/30 transition-all">
                                            <p className="text-[10px] font-black text-[#6366f1] uppercase tracking-[0.2em] mb-4 text-center">Conductor (Reference)</p>
                                            <div className="text-6xl font-black text-foreground mb-2 group-hover:scale-110 transition-transform duration-500">{birthDataRef.conductor}</div>
                                            <div className="flex items-center justify-center gap-2 text-[#6366f1] font-bold">
                                                <Star size={14} className="fill-[#6366f1]" />
                                                <span className="text-xs uppercase tracking-widest">{birthDataRef.conductorPlanet}</span>
                                            </div>
                                        </div>

                                        <div className="premium-card p-6 rounded-[2rem] border border-border bg-card/60 backdrop-blur-sm flex flex-col items-center justify-center group hover:border-green-500/30 transition-all">
                                            <p className="text-[10px] font-black text-green-500 uppercase tracking-[0.2em] mb-4 text-center">Auspicious Numbers</p>
                                            <div className="flex flex-wrap gap-2 justify-center">
                                                {luckyNumbers.map(num => (
                                                    <div key={num} className="w-10 h-10 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-500 font-black text-lg hover:bg-green-500 hover:text-black transition-all cursor-default shadow-sm shadow-green-500/10">
                                                        {num}
                                                    </div>
                                                ))}
                                                {luckyNumbers.length === 0 && (
                                                    <div className="text-muted-foreground text-[10px] italic">Set Client for Lucky Nos</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <SystemCard result={chaldeanRes} />
                                    <SystemCard result={pythagoreanRes} />
                                </div>

                                {/* Breakdown Table */}
                                <div className="premium-card bg-card/40 border border-border rounded-[2rem] p-8 overflow-hidden backdrop-blur-md">
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                                <Database size={16} />
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Vibrational Analysis Breakdown</span>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-primary" />
                                                <span className="text-[10px] font-bold text-muted-foreground uppercase">Vowels</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-muted" />
                                                <span className="text-[10px] font-bold text-muted-foreground uppercase">Consonants</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="overflow-x-auto custom-scrollbar pb-2">
                                        <div className="min-w-max">
                                            {/* Headers */}
                                            <div className="flex items-end border-b border-border/50 pb-4 mb-6">
                                                <div className="w-32 text-[10px] font-black text-muted-foreground uppercase px-2 mb-2">Archetype</div>
                                                <div className="flex gap-2">
                                                    {breakdown.map((b, i) => (
                                                        <div key={i} className="w-12 flex flex-col items-center gap-3">
                                                            <div className={`w-10 h-10 flex items-center justify-center rounded-xl border-2 font-black text-xl shadow-sm transition-all ${isVowel(b.char) ? 'border-primary bg-primary/10 text-primary scale-110 shadow-primary/20' : 'border-border bg-muted/20 text-muted-foreground/80'}`}>{b.char}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            {/* Rows */}
                                            <div className="flex items-center py-4 border-b border-border/30 group hover:bg-mystic-gold/10 transition-colors rounded-xl">
                                                <div className="w-32 text-[10px] font-black text-mystic-gold uppercase px-4 tracking-widest flex items-center gap-2">Chaldean</div>
                                                <div className="flex gap-2">
                                                    {breakdown.map((b, i) => (
                                                        <div key={i} className="w-12 text-center text-sm font-black text-foreground">{b.chaldean}</div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="flex items-center py-4 group hover:bg-primary/10 transition-colors rounded-xl mt-2">
                                                <div className="w-32 text-[10px] font-black text-primary uppercase px-4 tracking-widest flex items-center gap-2">Pythagorean</div>
                                                <div className="flex gap-2">
                                                    {breakdown.map((b, i) => (
                                                        <div key={i} className="w-12 text-center text-sm font-black text-foreground/70">{b.pythagorean}</div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Meaning Descriptions */}
                                <div className="grid grid-cols-1 gap-6">
                                    {chaldeanRes?.description && (
                                        <div className="premium-card p-6 rounded-2xl border border-border relative overflow-hidden bg-card/40 backdrop-blur-sm group">
                                            <div className="absolute top-0 left-0 w-1.5 h-full bg-mystic-gold" />
                                            <h3 className="text-mystic-gold font-black mb-3 flex items-center gap-3 text-[10px] uppercase tracking-[0.2em]">
                                                <Sparkles size={14} /> Chaldean Esoteric Insights ({chaldeanRes.compound})
                                            </h3>
                                            <p className="text-foreground/80 leading-relaxed text-sm font-medium">{chaldeanRes.description}</p>
                                        </div>
                                    )}
                                    {pythagoreanRes?.description && (
                                        <div className="premium-card p-6 rounded-2xl border border-border relative overflow-hidden bg-card/40 backdrop-blur-sm group">
                                            <div className="absolute top-0 left-0 w-1.5 h-full bg-primary" />
                                            <h3 className="text-primary font-black mb-3 flex items-center gap-3 text-[10px] uppercase tracking-[0.2em]">
                                                <Sparkles size={14} /> Pythagorean Vibrational Wisdom ({pythagoreanRes.compound})
                                            </h3>
                                            <p className="text-foreground/80 leading-relaxed text-sm font-medium">{pythagoreanRes.description}</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </div>



                    {/* Right Column: History & Reference */}
                    <div className="xl:col-span-1 space-y-6">

                        {/* Reference Tables (Universal Keys) */}
                        <div className="premium-card p-8 rounded-[2rem] border border-border sticky top-32 bg-card/60 backdrop-blur-md no-print">
                            <h2 className="text-xl font-black text-foreground mb-8 flex items-center gap-3 tracking-tight">
                                <span className="p-2 bg-muted rounded-xl text-foreground"><Database size={20} /></span>
                                Universal Keys
                            </h2>
                            <div className="space-y-10">
                                <div>
                                    <h3 className="text-[10px] font-black text-muted-foreground mb-4 uppercase tracking-[0.2em] flex items-center gap-2">Chaldean Values</h3>
                                    <div className="grid grid-cols-4 gap-3 text-center">
                                        {lettersMap.filter(l => l.chaldean_number > 0).sort((a, b) => a.chaldean_number - b.chaldean_number).reduce((acc: any[], curr) => {
                                            const found = acc.find(g => g.num === curr.chaldean_number);
                                            if (found) found.letters.push(curr.letter);
                                            else acc.push({ num: curr.chaldean_number, letters: [curr.letter] });
                                            return acc;
                                        }, []).map((g) => (
                                            <div key={g.num} className="bg-input/20 rounded-xl p-3 border border-border group hover:border-mystic-gold/20 transition-all">
                                                <span className="text-xl font-black text-mystic-gold block mb-1">{g.num}</span>
                                                <span className="text-[9px] text-muted-foreground font-black tracking-widest block">{g.letters.join(' ')}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-[10px] font-black text-muted-foreground mb-4 uppercase tracking-[0.2em] flex items-center gap-2">Pythagorean System</h3>
                                    <div className="grid grid-cols-3 gap-3 text-center">
                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                                            <div key={num} className="bg-input/20 rounded-xl p-3 border border-border group hover:border-primary/20 transition-all">
                                                <span className="text-xl font-black text-primary block mb-1">{num}</span>
                                                <span className="text-[9px] text-muted-foreground font-black tracking-widest block">
                                                    {lettersMap.filter(l => Number(l.pythagorean_number) === num).map(l => l.letter).join(' ')}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <style dangerouslySetInnerHTML={{
                    __html: `
                    @media print {
                        @page { margin: 1cm; size: auto; }
                        
                        /* Hide UI parts including Global Header */
                        nav, aside, footer, header, .no-print, button, input, select, .xl\\:col-span-1 {
                            display: none !important;
                        }

                        /* Global Reset used for Print */
                        body, html {
                            background: white !important;
                            color: black !important;
                            -webkit-print-color-adjust: exact !important;
                            print-color-adjust: exact !important;
                            padding-top: 0 !important; /* Remove body padding from layout */
                        }
                        
                        /* Fix Layout Padding caused by fixed header */
                        main {
                            padding-top: 0 !important;
                            margin-top: 0 !important;
                        }

                        /* Clear Badge/Number Backgrounds */
                        .bg-green-500\\/10, .bg-blue-500\\/10, .bg-red-500\\/10, .bg-amber-500\\/10, .bg-primary\\/10 {
                            background: transparent !important;
                            border: 1px solid #000 !important;
                        }

                        /* Container & Layout */
                        .max-w-7xl {
                            width: 100% !important;
                            max-width: none !important;
                            padding: 0 !important;
                            margin: 0 !important;
                        }
                        .xl\\:col-span-2 {
                            width: 100% !important;
                            display: block !important;
                        }

                        /* Typography Construction */
                        h1, h2, h3, h4, .text-xl, .text-3xl, .text-7xl {
                            color: black !important;
                            text-shadow: none !important;
                        }
                        p, span, div {
                            color: black !important;
                        }
                        .text-muted-foreground {
                            color: #333 !important;
                        }

                        /* Card Styling - Removing Colors & Shadows */
                        .premium-card, .bg-card, .bg-primary, .bg-muted, .border-primary {
                            background: white !important; /* Force white background */
                            border: 1px solid #ccc !important; /* Simple light grey border */
                            box-shadow: none !important;
                            color: black !important;
                            border-radius: 8px !important; /* Remove heavy rounded corners */
                        }

                        /* Remove Decorative Background elements */
                        .absolute {
                            display: none !important; /* Hides the big faint icons */
                        }

                        /* System Cards Specifics */
                        .border-green-500, .border-blue-500, .border-red-500, .border-amber-500 {
                            border-color: #ccc !important;
                        }
                        .bg-\\[\\#EEF2FF\\], .bg-\\[\\#FFFBEB\\] {
                            background-color: white !important;
                        }
                        
                        /* Breakdown Table */
                        .rounded-xl {
                            border-radius: 4px !important;
                        }
                        .bg-primary\\/10, .bg-muted\\/30 {
                            background: transparent !important;
                        }

                        /* Grid Maintenance */
                        .grid-cols-2 {
                            display: grid !important;
                            grid-template-columns: 1fr 1fr !important;
                            gap: 20px !important;
                        }
                        
                        /* Icon Hiding (if they are svg) */
                        svg {
                            fill: black !important;
                            stroke: black !important;
                        }
                        
                        
                        /* Ensure Text Visibility & Size Reduction */
                        .text-mystic-gold, .text-primary, .text-blue-500, .text-amber-500, .text-green-500 {
                            color: black !important;
                        }

                        /* COMPACT SIZES OVERRIDES */
                        .text-7xl { font-size: 2.5rem !important; }
                        .text-6xl { font-size: 2rem !important; }
                        .text-3xl { font-size: 1.5rem !important; }
                        .text-2xl { font-size: 1.25rem !important; }
                        .text-xl { font-size: 1.1rem !important; }
                        
                        /* Reduce Paddings */
                        .p-8, .p-6, .p-5 { padding: 1rem !important; }
                        .gap-8 { gap: 1rem !important; }
                        .gap-6 { gap: 0.75rem !important; }
                        .space-y-8 > * + * { margin-top: 1rem !important; }
                        .space-y-6 > * + * { margin-top: 0.75rem !important; }
                        
                        /* Compact Cards */
                        .premium-card {
                            margin-bottom: 0.75rem !important;
                            padding: 1rem !important;
                            border: 1px solid #ddd !important;
                        }

                        /* Force Page Breaks */
                        .menu-break { page-break-inside: avoid; }
                    }
                `
                }} />
            </div>
        </>
    );
}
