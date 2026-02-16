"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
    Search,
    Star,
    Save,
    Database,
    Users,
    History,
    ArrowLeft,
    CheckCircle,
    Briefcase,
    Printer,
    Sparkles,
    PlusCircle,
    Download,
} from "lucide-react";
import SystemCard from "@/components/SystemCard";

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
    single: number;
    planet?: string;
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

    // Sectors
    const [sectors, setSectors] = useState<any[]>([]);
    const [selectedSectorId, setSelectedSectorId] = useState<number | null>(null);

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
                    fetch(`${BASE_URL}/admin/business-lucky-numbers`, { headers: { Authorization: `Bearer ${token}` } }),
                ]);

                // Check for Auth failure
                const unauthorized = responses.some(r => r.status === 401);
                if (unauthorized) {
                    localStorage.removeItem("admin_token");
                    router.push("/admin/login");
                    return;
                }

                const [lRes, cRes, pRes, prRes, sRes] = responses;

                if (lRes.ok && cRes.ok && pRes.ok && prRes.ok && sRes.ok) {
                    setLettersMap(await lRes.json());
                    setCompounds(await cRes.json());
                    setPlanets(await pRes.json());
                    setPlanetRelations(await prRes.json());
                    setSectors(await sRes.json());
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
    const { chMap, pyMap, harmonicBridges } = useMemo(() => {
        const c: Record<string, number> = {};
        const p: Record<string, number> = {};
        const bridges: Record<number, string[]> = {};

        lettersMap.forEach(l => {
            const chNum = Number(l.chaldean_number);
            const pyNum = Number(l.pythagorean_number);
            c[l.letter] = chNum;
            p[l.letter] = pyNum;

            if (chNum === pyNum && chNum > 0) {
                if (!bridges[chNum]) bridges[chNum] = [];
                bridges[chNum].push(l.letter);
            }
        });

        const sortedBridges = Object.entries(bridges)
            .sort(([a], [b]) => Number(a) - Number(b))
            .map(([num, letters]) => ({ num: Number(num), letters }));

        return { chMap: c, pyMap: p, harmonicBridges: sortedBridges };
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
                    client_id: clientId,
                    business_sector_id: selectedSectorId
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

    const downloadPDF = async () => {
        const { default: jsPDF } = await import("jspdf");
        const { default: autoTable } = await import("jspdf-autotable");

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

    const resetAnalysis = (keepClient = false) => {
        setBusinessName("");
        if (!keepClient) {
            setOriginalName("");
            setSelectedClient(null);
        }
        setCheckId(null);
        setConfirmed(false);
        setBreakdown([]);
        setChaldeanRes(null);
        setPythagoreanRes(null);
        setShowListing(false);

        // Clear URL parameters
        const params = new URLSearchParams(searchParams.toString());
        params.delete('check_id');
        params.delete('business');
        if (!keepClient) params.delete('client_id');
        router.replace(`?${params.toString()}`);
    };

    if (showListing && selectedClient) {
        return (
            <div className="container mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
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
                        onClick={() => resetAnalysis(true)}
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
                                setSelectedSectorId(record.business_sector_id || null);
                                setCheckId(record.id);
                                setShowListing(false);
                            }}
                            className="w-full text-left p-4 rounded-2xl border bg-white border-black/5 hover:border-[#D4AF37]/50 transition-all flex items-center justify-between group shadow-sm hover:shadow-md"
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
        <div className="container mx-auto space-y-8 pb-20">
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
                    {businessName && (
                        <button onClick={saveToBackend} disabled={isSaving} className={`px-6 py-2.5 font-black rounded-xl transition-all flex items-center gap-2 shadow-xl hover:shadow-2xl active:scale-95 ${isSaving ? "bg-muted text-muted-foreground cursor-wait" : "bg-blue-600 text-white hover:bg-blue-700"}`}>
                            <Save size={18} /> {isSaving ? 'Saving...' : (checkId ? 'Update Record' : 'Save to Records')}
                        </button>
                    )}
                </div>
            </div>

            <div className="flex gap-3 items-center">
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
                    <div className="">
                        {selectedClient ? (
                            <div className="p-4 rounded-xl border border-[#10B981]/20 bg-[#FAF7F2] flex items-center justify-between shadow-lg animate-in fade-in slide-in-from-top-4 duration-500">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-astro-gradient rounded-xl text-white shadow-lg shadow-primary/20">
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

                    <div className="bg-white p-6 rounded-3xl border border-black/5 shadow-xl relative overflow-hidden">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                            {/* Business Sector Dropdown */}
                            <div className="space-y-2 group">
                                <label className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground font-black flex items-center gap-2 mb-1 pl-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-muted group-focus-within:bg-muted-foreground transition-colors" />
                                    Business Type / Sector
                                </label>
                                <select
                                    value={selectedSectorId || ""}
                                    onChange={(e) => setSelectedSectorId(e.target.value ? Number(e.target.value) : null)}
                                    className="w-full bg-input/20 border border-border p-3 rounded-xl text-foreground outline-none text-sm focus:border-primary/30 focus:bg-input/40 transition-all font-medium"
                                >
                                    <option value="">Select Sector...</option>
                                    {sectors.map(s => (
                                        <option key={s.id} value={s.id}>{s.sector_name}</option>
                                    ))}
                                </select>
                            </div>

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
                                        placeholder="ENTER NAME..."
                                    />
                                    <div className="absolute right-3 bottom-1/2 translate-y-1/2 flex items-center gap-2">
                                        <div className="text-[8px] text-muted-foreground font-black uppercase tracking-widest opacity-40">
                                            {businessName.length}
                                        </div>
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
                                <div className={`grid grid-cols-1 md:grid-cols-2 ${selectedSectorId ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-6`}>
                                    <div className="bg-white p-5 rounded-2xl border border-black/5 text-center shadow-lg group hover:border-[#10B981]/30 transition-all">
                                        <p className="text-[10px] font-black text-[#10B981] uppercase tracking-[0.2em] mb-4 text-center">Driver (Reference)</p>
                                        <div className="text-6xl font-black text-foreground mb-2 group-hover:scale-110 transition-transform duration-500">{birthDataRef.driver}</div>
                                        <div className="flex items-center justify-center gap-2 text-[#10B981] font-bold">
                                            <Star size={14} className="fill-[#10B981]" />
                                            <span className="text-xs uppercase tracking-widest">{birthDataRef.driverPlanet}</span>
                                        </div>
                                    </div>

                                    <div className="bg-white p-5 rounded-2xl border border-black/5 text-center shadow-lg group hover:border-[#6366f1]/30 transition-all">
                                        <p className="text-[10px] font-black text-[#6366f1] uppercase tracking-[0.2em] mb-4 text-center">Conductor (Reference)</p>
                                        <div className="text-6xl font-black text-foreground mb-2 group-hover:scale-110 transition-transform duration-500">{birthDataRef.conductor}</div>
                                        <div className="flex items-center justify-center gap-2 text-[#6366f1] font-bold">
                                            <Star size={14} className="fill-[#6366f1]" />
                                            <span className="text-xs uppercase tracking-widest">{birthDataRef.conductorPlanet}</span>
                                        </div>
                                    </div>

                                    <div className="bg-white p-5 rounded-2xl border border-black/5 shadow-lg flex flex-col items-center justify-center group hover:border-green-500/30 transition-all">
                                        <p className="text-[10px] font-black text-green-500 uppercase tracking-[0.2em] mb-4 text-center">Personal Auspicious</p>
                                        <div className="flex flex-wrap gap-2 justify-center">
                                            {luckyNumbers.map(num => (
                                                <div key={num} className="w-10 h-10 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-500 font-black text-lg hover:bg-green-500 hover:text-black transition-all cursor-default shadow-sm shadow-green-500/10">
                                                    {num}
                                                </div>
                                            ))}
                                            {luckyNumbers.length === 0 && (
                                                <div className="text-muted-foreground text-[10px] italic">Set Client info</div>
                                            )}
                                        </div>
                                    </div>

                                    {selectedSectorId && sectors.find(s => s.id === selectedSectorId) && (
                                        <>
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="bg-white p-5 rounded-2xl border border-black/5 shadow-lg flex flex-col items-center justify-center group hover:border-[#10B981]/50 transition-all"
                                            >
                                                <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4 text-center">Sector Chaldean</p>
                                                <div className="flex flex-wrap gap-2 justify-center">
                                                    {(sectors.find(s => s.id === selectedSectorId).chaldean_targets || sectors.find(s => s.id === selectedSectorId).lucky_numbers).split(',').map((num: string, i: number) => (
                                                        <div key={i} className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black text-lg hover:bg-primary hover:text-black transition-all cursor-default shadow-sm shadow-primary/10">
                                                            {num.trim()}
                                                        </div>
                                                    ))}
                                                </div>
                                            </motion.div>

                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="bg-white p-5 rounded-2xl border border-black/5 shadow-lg flex flex-col items-center justify-center group hover:border-black/50 transition-all"
                                            >
                                                <p className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] mb-4 text-center">Sector Pythagorean</p>
                                                <div className="flex flex-wrap gap-2 justify-center">
                                                    {sectors.find(s => s.id === selectedSectorId).pythagorean_targets?.split(',').map((num: string, i: number) => (
                                                        <div key={i} className="w-10 h-10 rounded-full bg-black/10 border border-black/20 flex items-center justify-center text-black font-black text-lg hover:bg-black hover:text-white transition-all cursor-default shadow-sm shadow-black/10">
                                                            {num.trim()}
                                                        </div>
                                                    )) || <div className="text-muted-foreground text-[10px] italic">No targets set</div>}
                                                </div>
                                            </motion.div>

                                            <div className="bg-white p-5 rounded-2xl border border-black/5 text-center shadow-lg group hover:border-amber-500/30 transition-all">
                                                <p className="text-[10px] font-black text-amber-600 uppercase tracking-[0.2em] mb-4 text-center">Sector Planet</p>
                                                <div className="text-4xl font-black text-slate-900 mb-2 truncate px-2">{sectors.find(s => s.id === selectedSectorId).primary_planet || "N/A"}</div>
                                                <div className="flex items-center justify-center gap-2 text-amber-600 font-bold">
                                                    <Star size={14} className="fill-amber-600" />
                                                    <span className="text-[9px] uppercase tracking-widest">{sectors.find(s => s.id === selectedSectorId).sector_name}</span>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <SystemCard result={chaldeanRes} />
                                <SystemCard result={pythagoreanRes} />
                            </div>

                            {/* Breakdown Table */}
                            <div className="bg-white border border-black/5 shadow-xl rounded-3xl p-6 overflow-hidden">
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
                    <div className="bg-white p-6 rounded-3xl border border-black/5 sticky top-20 shadow-xl no-print">
                        <h2 className="text-xl font-black text-foreground mb-8 flex items-center gap-3 tracking-tight">
                            <span className="p-2 bg-muted rounded-xl text-foreground"><Database size={20} /></span>
                            Universal Keys
                        </h2>
                        <div className="space-y-10">
                            {selectedSectorId && sectors.find(s => s.id === selectedSectorId) && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="p-5 rounded-2xl bg-primary/5 border border-primary/20 relative overflow-hidden group"
                                >
                                    <div className="absolute -right-4 -bottom-4 opacity-[0.03] rotate-12 group-hover:rotate-0 transition-transform duration-700">
                                        <Briefcase size={80} />
                                    </div>
                                    <h3 className="text-[10px] font-black text-primary mb-4 uppercase tracking-[0.2em] flex items-center gap-2">
                                        <Sparkles size={12} />
                                        Sector Lucky Numbers
                                    </h3>
                                    <div className="flex flex-wrap gap-2 relative z-10">
                                        {sectors.find(s => s.id === selectedSectorId).lucky_numbers.split(',').map((num: string, i: number) => (
                                            <div
                                                key={i}
                                                className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black text-lg shadow-sm hover:scale-110 transition-transform cursor-pointer"
                                                title={`Vibrational Harmony: ${num.trim()}`}
                                            >
                                                {num.trim()}
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-[9px] text-muted-foreground font-bold mt-4 uppercase tracking-widest opacity-60">
                                        Optimized for: {sectors.find(s => s.id === selectedSectorId).sector_name}
                                    </p>
                                </motion.div>
                            )}

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

                            {harmonicBridges.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="pt-6 border-t border-border/50"
                                >
                                    <h3 className="text-[10px] font-black text-primary mb-4 uppercase tracking-[0.2em] flex items-center gap-2">
                                        <CheckCircle size={12} className="text-green-500" />
                                        System Harmonic Bridges
                                    </h3>
                                    <div className="grid grid-cols-3 gap-3 text-center">
                                        {harmonicBridges.map((bridge) => (
                                            <div key={bridge.num} className="bg-green-500/5 rounded-xl p-3 border border-green-500/10 group hover:border-green-500/30 transition-all">
                                                <span className="text-xl font-black text-green-600 block mb-1">{bridge.num}</span>
                                                <span className="text-[9px] text-green-700 font-black tracking-widest block">{bridge.letters.join(' ')}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-[8px] text-muted-foreground font-bold mt-3 uppercase tracking-widest opacity-60 text-center">
                                        Letters common to both systems
                                    </p>
                                </motion.div>
                            )}

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
    );
}
