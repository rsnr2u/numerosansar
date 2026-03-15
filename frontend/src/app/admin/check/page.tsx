import { useEffect, useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    Star,
    Save,
    Sparkles,
    Database,
    CheckCircle,
    PlusCircle,
    EyeOff,
    ArrowLeft,
    History,
    Users,
    Download,
    CreditCard
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { API_BASE_URL, ROUTES } from "@/lib/constants";

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
    numerology_number: number;
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
    numerology: number;
}
const DANGEROUS_NUMBERS = [10, 12, 13, 16, 18];

interface SystemResult {
    system: "Chaldean" | "Pythagorean" | "Numerology";
    compound: number;
    single: number;
    planet?: string;
    meaning?: string;
    description?: string;
    resultType?: string; // For coloring
    soulUrge?: { compound: number; isDangerous: boolean };
    personality?: { compound: number; isDangerous: boolean };
}
interface PlanetRelation {
    id: number;
    planet_number: number;
    planet_name: string;
    friend_numbers: string; // "1,2,3"
    enemy_numbers: string;
    neutral_numbers: string;
}

const BASE_URL = API_BASE_URL;

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

const formatDateForInput = (dateString: string): string => {
    if (!dateString) return "";
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "";
        return date.toISOString().split('T')[0];
    } catch (e) {
        return "";
    }
};

const parseNumberList = (str: string | undefined): number[] => {
    if (!str) return [];
    return str.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
};

const isVowel = (char: string) => ['A', 'E', 'I', 'O', 'U'].includes(char);

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
    const isPythagorean = result.system === "Pythagorean";
    const bgClass = isChaldean
        ? "bg-[#EEF2FF] border-[#E0E7FF] dark:bg-blue-900/20 dark:border-blue-800"
        : "bg-[#FFFBEB] border-[#FEF3C7] dark:bg-amber-900/20 dark:border-amber-800";

    const baseColorClass = isChaldean ? "text-astro-gold" : (isPythagorean ? "text-astro-red" : "text-[#6366f1]");
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
                    <span className="text-6xl font-black tracking-tighter drop-shadow-2xl no-print-shadow">{result.compound}</span>
                </div>

                <div className="grid grid-cols-2 gap-8 w-full border-t border-current/10 pt-5 mb-6">
                    <div className="flex flex-col items-center">
                        <span className="opacity-30 text-[9px] uppercase font-bold tracking-widest px-2">Root Value</span>
                        <span className="text-3xl font-black mt-1">{result.single}</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="opacity-30 text-[9px] uppercase font-bold tracking-widest px-2">Ruler</span>
                        <span className={`text-2xl font-black mt-1 flex items-center gap-2 ${baseColorClass}`}>
                            <Star size={18} className="fill-current animate-pulse-slow" />
                            <span className="text-foreground">{result.planet || "-"}</span>
                        </span>
                    </div>
                </div>

                {/* Core Metrics */}
                {(result.soulUrge && result.personality) && (
                    <div className="w-full grid grid-cols-2 gap-4 pt-5 border-t border-current/10">
                        <div className="flex flex-col items-center p-3 rounded-2xl bg-white/5 border border-white/5 group/metric">
                            <span className="text-[9px] font-black uppercase tracking-widest opacity-30 group-hover/metric:opacity-60 transition-opacity">Soul Urge</span>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="text-xl font-black">{result.soulUrge.compound}</span>
                                <span className={`text-[8px] px-2.5 py-1 rounded-full font-black uppercase tracking-wider ${result.soulUrge.isDangerous ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500'}`}
                                >
                                    {result.soulUrge.isDangerous ? "Avoid" : "Safe"}
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-col items-center p-3 rounded-2xl bg-white/5 border border-white/5 group/metric">
                            <span className="text-[9px] font-black uppercase tracking-widest opacity-30 group-hover/metric:opacity-60 transition-opacity">Personality</span>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="text-xl font-black">{result.personality.compound}</span>
                                <span className={`text-[8px] px-2.5 py-1 rounded-full font-black uppercase tracking-wider ${result.personality.isDangerous ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500'}`}
                                >
                                    {result.personality.isDangerous ? "Avoid" : "Safe"}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {result.resultType && (
                    <div className="mt-8 w-full">
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

export default function AdminCheck() {
    // --- State ---
    const [originalName, setOriginalName] = useState("");
    const [callingName, setCallingName] = useState("");
    const [dob, setDob] = useState(""); // YYYY-MM-DD

    // Data
    // Data
    const [lettersMap, setLettersMap] = useState<LetterMap[]>([]);
    const [compounds, setCompounds] = useState<Compound[]>([]);
    const [planets, setPlanets] = useState<Planet[]>([]);
    const [planetRelations, setPlanetRelations] = useState<PlanetRelation[]>([]);
    const [loadingData, setLoadingData] = useState(true);

    // Results
    const [breakdown, setBreakdown] = useState<CharBreakdown[]>([]);
    const [chaldeanRes, setChaldeanRes] = useState<SystemResult | null>(null);
    const [pythagoreanRes, setPythagoreanRes] = useState<SystemResult | null>(null);
    const [numerologyRes, setNumerologyRes] = useState<SystemResult | null>(null);
    const [luckyNumbers, setLuckyNumbers] = useState<number[]>([]);

    // Search
    const [clientSearch, setClientSearch] = useState("");
    const [clientResults, setClientResults] = useState<Client[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);

    // History
    const [nameHistory, setNameHistory] = useState<any[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [showListing, setShowListing] = useState(false); // New State for toggling list vs form
    const [isUpdatingClient, setIsUpdatingClient] = useState(false);
    const [availableCredits, setAvailableCredits] = useState<number>(0);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // --- Init ---
    useEffect(() => {
        const init = async () => {
            const token = localStorage.getItem("admin_token");
            if (!token) return navigate(ROUTES.ADMIN.LOGIN);

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
                    console.error("Session expired or invalid token.");
                    localStorage.removeItem("admin_token");
                    navigate(ROUTES.ADMIN.LOGIN);
                    return;
                }

                const [lRes, cRes, pRes, prRes] = responses;

                if (lRes.ok && cRes.ok && pRes.ok && prRes.ok) {
                    setLettersMap(await lRes.json());
                    setCompounds(await cRes.json());
                    setPlanets(await pRes.json());
                    setPlanetRelations(await prRes.json());
                } else {
                    console.error("API Error statuses:", lRes.status, cRes.status, pRes.status, prRes.status);
                }
            } catch (e) {
                console.error("Failed to load data", e);
            } finally {
                setLoadingData(false);
            }
        };
        init();

        const urlName = searchParams.get('name');
        if (urlName) {
            setOriginalName(urlName);
            setCallingName(urlName);
        }
        const urlDob = searchParams.get('dob');
        if (urlDob) setDob(formatDateForInput(urlDob));

        const clientId = searchParams.get('client_id');
        if (clientId) {
            fetchClient(clientId);
            fetchHistory(clientId);
        }
        fetchAvailableCredits();
    }, [searchParams]); // Re-run if client_id changes

    useEffect(() => {
        const checkIdParam = searchParams.get('check_id');
        const nameParam = searchParams.get('name');

        if (checkIdParam) {
            setCheckId(Number(checkIdParam));
            setShowListing(false);
        } else if (nameParam) {
            setShowListing(false);
        } else {
            // If no specific check requested, we wait for history to load
            // Logic moved to fetchHistory or separate effect
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
                if (data.dob) setDob(formatDateForInput(data.dob));
                if (data.calling_name) setCallingName(data.calling_name);
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
                const names = data.filter((h: any) => h.type === 'Name');
                setNameHistory(names);
            }
        } catch (e) {
            console.error("Failed to fetch history", e);
        }
    };

    const fetchAvailableCredits = async () => {
        try {
            const token = localStorage.getItem("admin_token");
            const res = await fetch(`${BASE_URL}/admin/dashboard/stats`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setAvailableCredits(data.credits_remaining);
            }
        } catch (e) {
            console.error("Failed to fetch credits", e);
        }
    };

    // Lookup Maps (Memoized for perf)
    const { chMap, pyMap, nuMap } = useMemo(() => {
        const c: Record<string, number> = {};
        const p: Record<string, number> = {};
        const n: Record<string, number> = {};
        lettersMap.forEach(l => {
            c[l.letter] = Number(l.chaldean_number);
            p[l.letter] = Number(l.pythagorean_number);
            n[l.letter] = Number(l.numerology_number || 0);
        });
        return { chMap: c, pyMap: p, nuMap: n };
    }, [lettersMap]);

    // --- Core Logic: Real-time Calc ---
    useEffect(() => {
        if (loadingData) return;

        const cleanForCalc = callingName.toUpperCase().replace(/[^A-Z]/g, '');

        if (!cleanForCalc) {
            setBreakdown([]);
            setChaldeanRes(null);
            setPythagoreanRes(null);
            setNumerologyRes(null);
            return;
        }

        const chars = cleanForCalc.split('');
        const newBreakdown: CharBreakdown[] = [];
        let chTotal = 0, pyTotal = 0, nuTotal = 0;
        let chSoul = 0, chPers = 0;
        let pySoul = 0, pyPers = 0;
        let nuSoul = 0, nuPers = 0;

        chars.forEach(char => {
            const cv = chMap[char] || 0;
            const pv = pyMap[char] || 0;
            const nv = nuMap[char] || 0;
            newBreakdown.push({ char, chaldean: cv, pythagorean: pv, numerology: nv });

            chTotal += cv;
            pyTotal += pv;
            nuTotal += nv;

            if (isVowel(char)) {
                chSoul += cv;
                pySoul += pv;
                nuSoul += nv;
            } else {
                chPers += cv;
                pyPers += pv;
                nuPers += nv;
            }
        });

        setBreakdown(newBreakdown);

        // Helper to find data
        const getPlanet = (num: number) => planets.find(p => Number(p.number) === num)?.planet_name;
        const getMeaning = (num: number) => compounds.find(c => Number(c.number) === num);
        const isDangerous = (n: number) => DANGEROUS_NUMBERS.includes(n);

        // Chaldean
        const chSingle = reduceNumber(chTotal);
        const chM = getMeaning(chTotal);
        setChaldeanRes({
            system: "Chaldean",
            compound: chTotal,
            single: chSingle,
            planet: getPlanet(chSingle),
            meaning: chM?.title,
            description: chM?.description,
            resultType: chM?.result || 'Analyzed',
            soulUrge: { compound: chSoul, isDangerous: isDangerous(chSoul) },
            personality: { compound: chPers, isDangerous: isDangerous(chPers) }
        });

        // Pythagorean
        const pySingle = reduceNumber(pyTotal);
        const pyM = getMeaning(pyTotal);
        setPythagoreanRes({
            system: "Pythagorean",
            compound: pyTotal,
            single: pySingle,
            planet: getPlanet(pySingle),
            meaning: pyM?.title,
            description: pyM?.description,
            resultType: pyM?.result || 'Analyzed',
            soulUrge: { compound: pySoul, isDangerous: isDangerous(pySoul) },
            personality: { compound: pyPers, isDangerous: isDangerous(pyPers) }
        });

        // Numerology
        const nuSingle = reduceNumber(nuTotal);
        const nuM = getMeaning(nuTotal);
        setNumerologyRes({
            system: "Numerology",
            compound: nuTotal,
            single: nuSingle,
            planet: getPlanet(nuSingle),
            meaning: nuM?.title,
            description: nuM?.description,
            resultType: nuM?.result || 'Analyzed',
            soulUrge: { compound: nuSoul, isDangerous: isDangerous(nuSoul) },
            personality: { compound: nuPers, isDangerous: isDangerous(nuPers) }
        });

    }, [callingName, loadingData, chMap, pyMap, nuMap, compounds, planets, dob, planetRelations]);

    // Lucky Numbers Logic
    useEffect(() => {
        if (!dob || planetRelations.length === 0) {
            setLuckyNumbers([]);
            return;
        }

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
    }, [dob, planetRelations, planets, loadingData]);

    // Sync BData Helper
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

    // Calculate Birth Data (Memoized)
    const birthData = useMemo(() => birthDataSync(dob, planets), [dob, planets]);

    const searchClients = async (query: string) => {
        if (!query) { setClientResults([]); return; }
        try {
            const res = await fetch(`${BASE_URL}/admin/clients?search=${query}`, {
                headers: { "Authorization": `Bearer ${localStorage.getItem("admin_token")}` }
            });
            if (res.ok) setClientResults(await res.json());
        } catch (e) { console.error(e); }
    };

    // --- Input Handlers ---
    const handleCallingNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.slice(0, 25);
        // Allow typing spaces, validate format for input
        if (/^[A-Za-z\s]*$/.test(val)) {
            setCallingName(val.toUpperCase());
        }
    };

    // Confirm Flow
    const [checkId, setCheckId] = useState<number | null>(null);
    const [confirmed, setConfirmed] = useState(false);
    // Unified Save Logic
    const handleSaveRequest = () => {
        if (!callingName || !dob) return;
        setShowConfirmModal(true);
    };

    const saveToBackend = async () => {
        if (!callingName || !dob) return;

        const token = localStorage.getItem("admin_token");
        const clientId = searchParams.get('client_id');
        setIsSaving(true);

        try {
            // 1. Save Analysis Record
            const res = await fetch(`${BASE_URL}/admin/calculate`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    id: checkId,
                    name: callingName,
                    original_name: originalName,
                    dob: dob,
                    client_id: clientId
                })
            });
            const data = await res.json();
            let newCheckId = checkId;

            if (data.check_id) {
                newCheckId = data.check_id;
                setCheckId(newCheckId);
                setConfirmed(false);
                if (clientId) fetchHistory(clientId);
            }

            // 2. Automatic: Update Client Profile & Confirm (Perfect UX)
            if (selectedClient && newCheckId) {
                // Update Client Profile
                setIsUpdatingClient(true);
                await fetch(`${BASE_URL}/admin/clients/${selectedClient.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({ calling_name: callingName })
                });
                setSelectedClient({ ...selectedClient, calling_name: callingName });
                setIsUpdatingClient(false);

                // Confirm Analysis
                await fetch(`${BASE_URL}/admin/astrology/confirm`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({ check_id: newCheckId, type: 'Name' })
                });
                setConfirmed(true);
            }

        } catch (e) {
            console.error("Submit failed", e);
        } finally {
            setIsSaving(false);
            setShowConfirmModal(false);
            fetchAvailableCredits(); // Update balance
        }
    };



    const resetAnalysis = (keepClient = false) => {
        setCallingName("");
        if (!keepClient) {
            setOriginalName("");
            setDob("");
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
        params.delete('name');
        params.delete('dob');
        if (!keepClient) params.delete('client_id');
        navigate(`?${params.toString()}`);
    };

    const downloadPDF = () => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.width;

        // --- Header ---
        doc.setFontSize(22);
        doc.setFont("helvetica", "bold");
        doc.text("Name Astrology Report", pageWidth / 2, 20, { align: "center" });

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

        // --- Analyzed Name ---
        yPos += 15;
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0, 0, 0);
        doc.text("Name Details", 15, yPos);

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
        doc.text("Changed Name:", 15, yPos);
        doc.setFontSize(16);
        doc.setTextColor(40, 40, 150); // Navy Blue
        doc.text(callingName.toUpperCase(), 55, yPos);

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
            doc.roundedRect(x, y, 80, 75, 3, 3, "FD");

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

            // Soul Urge / Personality
            if (res.soulUrge && res.personality) {
                y += 45;
                doc.setFontSize(8);
                doc.setTextColor(50);
                doc.text(`Soul Urge: ${res.soulUrge.compound} (${res.soulUrge.isDangerous ? 'Avoid' : 'Safe'})`, x + 40, y, { align: "center" });
                doc.text(`Personality: ${res.personality.compound} (${res.personality.isDangerous ? 'Avoid' : 'Safe'})`, x + 40, y + 5, { align: "center" });
                y -= 45; // Reset y for meaning
            }

            // Meaning
            doc.setFontSize(8);
            doc.setFont("helvetica", "normal"); // Reset bold
            doc.setTextColor(50);

            // Split meaning text to fit
            const lines = doc.splitTextToSize(res.meaning || "", 70);
            doc.text(lines, x + 40, y + 60, { align: "center" });
        };

        if (chaldeanRes) drawSystemResult("Chaldean System", chaldeanRes, 25, yPos);
        if (pythagoreanRes) drawSystemResult("Pythagorean System", pythagoreanRes, 110, yPos);

        yPos += 85;

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
        doc.text("JC Astro Astrology Services", pageWidth / 2, 280, { align: "center" });

        doc.save(`${selectedClient?.full_name}_Name_Analysis.pdf`);
    };


    // ...

    // --- Render Helpers ---

    if (showListing && selectedClient) {
        return (
            <div className="container mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex items-center gap-5">
                        <button onClick={() => navigate(-1)} className="p-2.5 rounded-xl bg-card border border-border hover:border-primary/50 transition-all text-muted-foreground hover:text-primary shadow-sm">
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-3xl font-black flex items-center gap-3 text-foreground tracking-tight">
                                <span className="p-2.5 bg-primary/10 rounded-xl text-primary">
                                    <Users size={24} />
                                </span>
                                {selectedClient.full_name}
                            </h1>
                            <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-widest mt-1 ml-1 opacity-60">Saved Name Analysis Records</p>
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
                    {nameHistory.map((record: any) => (
                        <button
                            key={record.id}
                            onClick={() => {
                                setOriginalName(record.original_name || ""); // Load original name
                                setCallingName(record.name_value);
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
                                    <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-black uppercase tracking-wider">
                                        Compound: {record.Compound_number}
                                    </span>
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
            <div className="container mx-auto space-y-8 pb-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex items-center gap-5">
                        <button onClick={() => navigate(-1)} className="p-2.5 rounded-xl bg-card border border-border hover:border-primary/50 transition-all text-muted-foreground hover:text-primary shadow-sm">
                            <ArrowLeft size={20} />
                        </button>
                        <div className="flex flex-col md:flex-row md:items-center gap-4">
                            <div>
                                    <div className="flex items-center gap-4">
                                        <h1 className="text-3xl font-black flex items-center gap-3 text-foreground tracking-tight">
                                            <span className="p-2.5 bg-primary/10 rounded-xl text-primary">
                                                <Sparkles size={24} />
                                            </span>
                                            {checkId ? 'Edit Analysis' : 'Name Astrology'}
                                        </h1>
                                        <div className="px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100 flex items-center gap-2">
                                            <CreditCard size={14} />
                                            <span className="text-[10px] font-black uppercase tracking-widest leading-none">Available: {availableCredits}</span>
                                        </div>
                                    </div>
                                <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-widest mt-1 ml-1 opacity-60">Analyze Name Vibrations</p>
                            </div>

                            {chaldeanRes && (
                                <div className="flex items-center gap-2 md:ml-4">
                                    <button
                                        onClick={downloadPDF}
                                        className="px-4 py-2 font-bold rounded-xl bg-card border border-border hover:border-primary/50 transition-all flex items-center gap-2 text-xs text-primary shadow-sm hover:shadow-md active:scale-95"
                                    >
                                        <Download size={16} /> Download PDF
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>



            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">

                {/* --- Left Column: Input & Live Results --- */}
                <div className="xl:col-span-2 space-y-8">

                    {/* Search Overlay / Client Display */}
                    <div className="relative">
                        {selectedClient ? (
                            <div className="p-4 rounded-xl border border-[#10B981]/20 bg-[#FAF7F2] flex items-center justify-between animate-in fade-in slide-in-from-top-4 duration-500">
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
                                    placeholder="Search existing client to pre-fill metadata..."
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
                                        setOriginalName(c.full_name);
                                        setCallingName(c.calling_name || c.full_name);
                                        setDob(formatDateForInput(c.dob));
                                        setSelectedClient(c);
                                        setClientSearch("");
                                        setShowDropdown(false);
                                        const params = new URLSearchParams(searchParams.toString());
                                        params.set('client_id', String(c.id));
                                        navigate(`?${params.toString()}`);
                                        fetchHistory(String(c.id));
                                    }} className="w-full text-left p-4 hover:bg-primary/5 flex justify-between items-center group transition-colors">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-foreground group-hover:text-primary transition-colors">{c.full_name}</span>
                                            <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">{c.calling_name || 'No calling name'}</span>
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

                    {/* Main Input Area */}
                    <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-xl relative overflow-hidden">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                            {/* Static Ref */}
                            <div className="space-y-2 group">
                                <label className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground font-black flex items-center gap-2 mb-1 pl-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-muted group-focus-within:bg-muted-foreground transition-colors" />
                                    Original calling Name
                                </label>
                                <input
                                    value={originalName}
                                    onChange={(e) => setOriginalName(e.target.value)}
                                    className="w-full bg-input/20 border border-border p-3 rounded-xl text-foreground outline-none text-sm focus:border-primary/30 focus:bg-input/40 transition-all font-medium"
                                    placeholder="Official Full Name"
                                />
                            </div>

                            {/* Date of Birth Input */}
                            <div className="space-y-2 group">
                                <label className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground font-black flex items-center gap-2 mb-1 pl-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-muted group-focus-within:bg-muted-foreground transition-colors" />
                                    DOB
                                </label>
                                <input
                                    type="date"
                                    value={dob}
                                    onChange={(e) => setDob(e.target.value)}
                                    className="w-full bg-input/20 border border-border p-3 rounded-xl text-foreground outline-none text-sm focus:border-primary/30 focus:bg-input/40 transition-all font-medium"
                                />
                            </div>

                            {/* Live Input */}
                            <div className="space-y-2 group">
                                <label className="text-[9px] uppercase tracking-[0.2em] text-primary font-black flex items-center gap-2 mb-1 pl-1">
                                    <Sparkles size={10} className="text-primary animate-pulse" />
                                    Changing Name to
                                </label>
                                <div className="relative">
                                    <input
                                        value={callingName}
                                        onChange={handleCallingNameChange}
                                        className="w-full bg-primary/5 border-2 border-primary/30 p-2.5 rounded-xl text-xl font-black text-foreground outline-none shadow-inner focus:border-primary focus:shadow-[0_0_15px_rgba(var(--primary-rgb),0.2)] transition-all placeholder:text-muted-foreground/30"
                                        placeholder="SEARCH VIBRATION..."
                                        autoFocus
                                    />
                                    <div className="absolute right-3 bottom-1/2 translate-y-1/2 flex items-center gap-2">
                                        <div className="text-[8px] text-muted-foreground font-black uppercase tracking-widest opacity-40">
                                            {callingName.length} / 25
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons Row */}
                        {callingName && (
                            <div className="flex items-center justify-end mt-4 pt-4 border-t border-border/50">
                                <button
                                    onClick={handleSaveRequest}
                                    disabled={isSaving}
                                    className={`px-6 py-2 font-black rounded-xl transition-all flex items-center gap-3 shadow-xl hover:shadow-2xl active:scale-95 min-w-[300px] justify-center text-lg ${isSaving ? "bg-muted text-muted-foreground cursor-wait" : "bg-astro-gradient text-white"}`}
                                >
                                    {isSaving ? (
                                        <>Finalising...</>
                                    ) : (
                                        <>
                                            <Save size={24} />
                                            {selectedClient ? 'FINALISE & UPDATE PROFILE' : (checkId ? 'UPDATE RECORD' : 'SUBMIT & SAVE ANALYSIS')}
                                        </>
                                    )}
                                </button>
                            </div>
                        )}

                        {/* Visual Ornament */}
                        <div className="absolute top-0 right-0 p-3 opacity-5">
                            <Database size={100} />
                        </div>
                    </div>

                    {/* LIVE CALCULATION AREA */}
                    {(birthData || (chaldeanRes && pythagoreanRes)) && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">

                            {/* Birth Data & Lucky Numbers */}
                            {birthData && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="bg-white p-5 rounded-2xl border border-black/5 text-center shadow-lg group hover:border-[#10B981]/30 transition-all">
                                        <p className="text-[10px] font-black text-[#10B981] uppercase tracking-[0.2em] mb-4">Driver (Mulank)</p>
                                        <div className="text-6xl font-black text-foreground mb-2 group-hover:scale-110 transition-transform duration-500">{birthData.driver}</div>
                                        <div className="flex items-center justify-center gap-2 text-[#10B981] font-bold">
                                            <Star size={14} className="fill-[#10B981]" />
                                            <span className="text-xs uppercase tracking-widest">{birthData.driverPlanet}</span>
                                        </div>
                                    </div>

                                    <div className="bg-white p-5 rounded-2xl border border-black/5 text-center shadow-lg group hover:border-[#6366f1]/30 transition-all">
                                        <p className="text-[10px] font-black text-[#6366f1] uppercase tracking-[0.2em] mb-4">Conductor (Bhagyank)</p>
                                        <div className="text-6xl font-black text-foreground mb-2 group-hover:scale-110 transition-transform duration-500">{birthData.conductor}</div>
                                        <div className="flex items-center justify-center gap-2 text-[#6366f1] font-bold">
                                            <Star size={14} className="fill-[#6366f1]" />
                                            <span className="text-xs uppercase tracking-widest">{birthData.conductorPlanet}</span>
                                        </div>
                                    </div>

                                    <div className="bg-white p-5 rounded-2xl border border-black/5 shadow-lg flex flex-col items-center justify-center group hover:border-green-500/30 transition-all">
                                        <p className="text-[10px] font-black text-green-500 uppercase tracking-[0.2em] mb-4">Auspicious Numbers</p>
                                        <div className="flex flex-wrap gap-2 justify-center">
                                            {luckyNumbers.map(num => (
                                                <div key={num} className="w-10 h-10 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-500 font-black text-lg hover:bg-green-500 hover:text-black transition-all cursor-default shadow-sm shadow-green-500/10">
                                                    {num}
                                                </div>
                                            ))}
                                            {luckyNumbers.length === 0 && (
                                                <div className="text-muted-foreground text-[10px] italic">Set Date of Birth</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* 1. Result Cards */}
                            {chaldeanRes && pythagoreanRes && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <SystemCard result={chaldeanRes} />
                                    <SystemCard result={pythagoreanRes} />
                                </div>
                            )}




                            {/* 2. Live Breakdown Table */}
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
                                                {breakdown.map((b, i) => {
                                                    const vowel = isVowel(b.char);
                                                    return (
                                                        <motion.div
                                                            key={i}
                                                            initial={{ opacity: 0, y: 10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ delay: i * 0.05 }}
                                                            className="w-12 flex flex-col items-center gap-3"
                                                        >
                                                            <div className={`
                                                                w-10 h-10 flex items-center justify-center rounded-xl border-2 font-black text-xl shadow-sm transition-all
                                                                ${vowel ? 'border-primary bg-primary/10 text-primary scale-110 shadow-primary/20' : 'border-border bg-muted/20 text-muted-foreground/80'}
                                                            `}>
                                                                {b.char}
                                                            </div>
                                                        </motion.div>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* Chaldean Row */}
                                        <div className="flex items-center py-4 border-b border-border/30 group hover:bg-mystic-gold/5 transition-colors rounded-xl">
                                            <div className="w-32 text-[10px] font-black text-mystic-gold uppercase px-4 tracking-widest flex items-center gap-2">
                                                <div className="w-1 h-1 rounded-full bg-mystic-gold" />
                                                Chaldean
                                            </div>
                                            <div className="flex gap-2">
                                                {breakdown.map((b, i) => (
                                                    <div key={i} className="w-12 text-center text-sm font-black text-foreground">{b.chaldean}</div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Pythagorean Row */}
                                        <div className="flex items-center py-4 border-b border-border/30 group hover:bg-primary/5 transition-colors rounded-xl mt-2">
                                            <div className="w-32 text-[10px] font-black text-primary uppercase px-4 tracking-widest flex items-center gap-2">
                                                <div className="w-1 h-1 rounded-full bg-primary" />
                                                Pythagorean
                                            </div>
                                            <div className="flex gap-2">
                                                {breakdown.map((b, i) => (
                                                    <div key={i} className="w-12 text-center text-sm font-black text-foreground/70">{b.pythagorean}</div>
                                                ))}
                                            </div>
                                        </div>


                                    </div>
                                </div>
                            </div>

                            {/* 3. Meaning Descriptions */}
                            <div className="grid grid-cols-1 gap-6">
                                {chaldeanRes?.description && (
                                    <div className="p-6 rounded-2xl border border-black/5 relative overflow-hidden bg-white shadow-lg group">
                                        <div className="absolute top-0 left-0 w-1.5 h-full bg-mystic-gold" />
                                        <h3 className="text-mystic-gold font-black mb-3 flex items-center gap-3 text-[10px] uppercase tracking-[0.2em]">
                                            <span className="p-1.5 bg-mystic-gold/10 rounded-lg"><Sparkles size={14} /></span>
                                            Chaldean Esoteric Insights ({chaldeanRes.compound})
                                        </h3>
                                        <p className="text-foreground/80 leading-relaxed text-sm font-medium">
                                            {chaldeanRes.description}
                                        </p>
                                    </div>
                                )}
                                {pythagoreanRes?.description && (
                                    <div className="p-6 rounded-2xl border border-black/5 relative overflow-hidden bg-white shadow-lg group">
                                        <div className="absolute top-0 left-0 w-1.5 h-full bg-primary" />
                                        <h3 className="text-primary font-black mb-3 flex items-center gap-3 text-[10px] uppercase tracking-[0.2em]">
                                            <span className="p-1.5 bg-primary/10 rounded-lg"><Sparkles size={14} /></span>
                                            Pythagorean Vibrational Wisdom ({pythagoreanRes.compound})
                                        </h3>
                                        <p className="text-foreground/80 leading-relaxed text-sm font-medium">
                                            {pythagoreanRes.description}
                                        </p>
                                    </div>
                                )}

                            </div>

                        </motion.div>
                    )}

                </div>

                {/* --- Right Column: History & Reference --- */}
                <div className="xl:col-span-1 space-y-6">
                    {/* Toggle History Button */}


                    {/* Saved History */}


                    <div className="bg-white p-6 rounded-3xl border border-black/5 sticky top-20 shadow-xl no-print">
                        <h2 className="text-xl font-black text-foreground mb-8 flex items-center gap-3 tracking-tight">
                            <span className="p-2 bg-muted rounded-xl text-foreground"><Database size={20} /></span>
                            Universal Keys
                        </h2>

                        <div className="space-y-10">
                            {/* Chaldean Key */}
                            <div>
                                <h3 className="text-[10px] font-black text-muted-foreground mb-4 uppercase tracking-[0.2em] flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-mystic-gold" />
                                    Chaldean Values
                                </h3>
                                <div className="grid grid-cols-4 gap-3 text-center">
                                    {lettersMap.filter(l => l.chaldean_number > 0).sort((a, b) => a.chaldean_number - b.chaldean_number).reduce((acc: any[], curr) => {
                                        const found = acc.find(g => g.num === curr.chaldean_number);
                                        if (found) found.letters.push(curr.letter);
                                        else acc.push({ num: curr.chaldean_number, letters: [curr.letter] });
                                        return acc;
                                    }, []).map((g) => (
                                        <div key={g.num} className="bg-input/20 rounded-xl p-3 border border-border hover:border-mystic-gold/20 transition-all group">
                                            <span className="text-xl font-black text-mystic-gold block mb-1 group-hover:scale-110 transition-transform">{g.num}</span>
                                            <span className="text-[9px] text-muted-foreground font-black tracking-widest leading-none block">{g.letters.join(' ')}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Pythagorean Key */}
                            <div>
                                <h3 className="text-[10px] font-black text-muted-foreground mb-4 uppercase tracking-[0.2em] flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                    Pythagorean System
                                </h3>
                                <div className="grid grid-cols-3 gap-3 text-center">
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                                        <div key={num} className="bg-input/20 rounded-xl p-3 border border-border hover:border-primary/20 transition-all group">
                                            <span className="text-xl font-black text-primary block mb-1 group-hover:scale-110 transition-transform">{num}</span>
                                            <span className="text-[9px] text-muted-foreground font-black tracking-widest leading-none block">
                                                {lettersMap.filter(l => Number(l.pythagorean_number) === num).map(l => l.letter).join(' ')}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>


                        </div>

                        {/* Visual Help */}
                        <div className="mt-10 p-4 rounded-2xl bg-primary/5 border border-primary/10">
                            <p className="text-[10px] text-muted-foreground font-medium italic leading-relaxed">
                                Tip: Use these keys to manually verify letter vibrations across different numerological methodologies.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <style dangerouslySetInnerHTML={{
                __html: `
                    @media print {
                        @page { margin: 1cm; size: auto; }
                        
                        /* Hide UI & Universal Keys */
                        nav, aside, footer, .no-print, button, input, select, .xl\\:col-span-1 {
                            display: none !important;
                        }

                        /* Global Settings */
                        body { 
                            background: white !important; 
                            color: #1a1a1a !important; 
                            -webkit-print-color-adjust: exact !important;
                            print-color-adjust: exact !important;
                            margin: 0 !important;
                        }

                        /* Layout Overrides */
                        .max-w-7xl { 
                            max-width: 100% !important; 
                            padding: 0 !important; 
                            margin: 0 !important;
                        }
                        .xl\\:col-span-2 {
                            width: 100% !important;
                            display: block !important;
                        }

                        /* Card Styling */
                        .premium-card {
                            border: 1px solid #e5e7eb !important;
                            box-shadow: none !important;
                            background: #fff !important;
                            break-inside: avoid;
                            margin-bottom: 1.5rem !important;
                        }

                        /* Maintain Grid for Results */
                        .grid-cols-2 {
                            display: grid !important;
                            grid-template-columns: 1fr 1fr 1fr !important;
                            gap: 1rem !important;
                        }
                        
                        /* Typography & Colors */
                        h1 { font-size: 24px !important; color: #000 !important; margin-bottom: 0.5rem !important; }
                        h2 { font-size: 18px !important; color: #374151 !important; }
                        p, span { color: #4b5563 !important; }
                        
                        /* Specific Element Fixes */
                        .text-6xl { font-size: 3.5rem !important; }
                        .rounded-\\[2\\.5rem\\] { border-radius: 1.5rem !important; padding: 2rem !important; }
                        
                        /* Ensure Backgrounds Print */
                        .bg-\\[\\#EEF2FF\\] { background-color: #EEF2FF !important; border-color: #E0E7FF !important; }
                        .bg-\\[\\#FFFBEB\\] { background-color: #FFFBEB !important; border-color: #FEF3C7 !important; }
                    }
                `
            }} />

            {/* Credit Confirmation Modal */}
            <AnimatePresence>
                {showConfirmModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl space-y-6 text-center"
                        >
                            <div className="w-20 h-20 bg-purple-50 text-[#4B2E83] rounded-full flex items-center justify-center mx-auto">
                                <CreditCard size={40} />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-black text-slate-900 tracking-tight">Confirm Consumption</h3>
                                <p className="text-slate-500 text-sm font-medium">This analysis will consume <span className="text-[#4B2E83] font-bold">1 credit</span> from your balance.</p>
                            </div>
                            <div className="flex flex-col gap-2 pt-2">
                                <button 
                                    onClick={saveToBackend}
                                    className="w-full py-4 bg-[#4B2E83] text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg"
                                >
                                    Confirm & Continue
                                </button>
                                <button 
                                    onClick={() => setShowConfirmModal(false)}
                                    className="w-full py-4 bg-white text-slate-400 border border-slate-100 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
