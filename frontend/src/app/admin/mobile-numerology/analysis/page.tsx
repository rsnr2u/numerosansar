import { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Smartphone, Sparkles, AlertCircle, ArrowLeft, History, CheckCircle, Save, Users, Star, Calendar, EyeOff, PlusCircle, CreditCard } from "lucide-react";
import { API_BASE_URL } from "@/lib/constants";
import { motion, AnimatePresence } from "framer-motion";

interface Client {
    id: number;
    full_name: string;
    calling_name?: string;
    dob: string;
}
interface Planet {
    id: number;
    number: number;
    planet_name: string;
}
interface PlanetRelation {
    id: number;
    planet_number: number;
    planet_name: string;
    friend_numbers: string;
    enemy_numbers: string;
    neutral_numbers: string;
}

export default function NewAnalysisPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [mobile, setMobile] = useState("");
    const [dob, setDob] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState("");

    // Edit Mode State
    const editIdParam = searchParams.get('edit_id');
    const [editingId, setEditingId] = useState<number | null>(editIdParam ? Number(editIdParam) : null);

    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [clientSearch, setClientSearch] = useState("");
    const [clientResults, setClientResults] = useState<Client[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [history, setHistory] = useState<any[]>([]);
    const [showHistory, setShowHistory] = useState(false);
    const [availableCredits, setAvailableCredits] = useState<number>(0);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    // Data for Auspicious Numbers
    const [planets, setPlanets] = useState<Planet[]>([]);
    const [planetRelations, setPlanetRelations] = useState<PlanetRelation[]>([]);
    const [luckyNumbers, setLuckyNumbers] = useState<number[]>([]);
    const [loadingData, setLoadingData] = useState(true);

    const currentClientId = selectedClient?.id || searchParams.get('client_id');

    useEffect(() => {
        const init = async () => {
            const token = localStorage.getItem("admin_token");
            if (!token) return;
            try {
                const [pRes, prRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/admin/planets`, { headers: { Authorization: `Bearer ${token}` } }),
                    fetch(`${API_BASE_URL}/admin/planet-relations`, { headers: { Authorization: `Bearer ${token}` } }),
                ]);
                if (pRes.ok) setPlanets(await pRes.json());
                if (prRes.ok) setPlanetRelations(await prRes.json());
            } catch (e) {
                console.error("Failed to load planets", e);
            } finally {
                setLoadingData(false);
            }
        };
        init();
        fetchAvailableCredits();

        const phoneParam = searchParams.get('number');
        const dobParam = searchParams.get('dob');
        if (dobParam) setDob(dobParam);
        if (phoneParam) setMobile(phoneParam);

        const clientId = searchParams.get('client_id');
        if (clientId) fetchClient(clientId);

        // If editing, fetch existing record logic could go here or assumes metadata passed via params for now, 
        // but robustly we might want to fetch the record if only ID is known.
        // For simplicity, we'll rely on user filling or URL params for now, or check/fetch if editId exists.
        if (editIdParam) {
            setEditingId(Number(editIdParam));
        }

    }, []);

    useEffect(() => {
        if (currentClientId) {
            fetchHistory(String(currentClientId));
        }
    }, [currentClientId]);

    // --- Helpers ---
    const classifyStatus = (statusFromMeaning: string | undefined, total: number) => {
        if (!dob || planetRelations.length === 0) return statusFromMeaning;

        const age = calculateAge(dob);
        const bData = birthDataSync(dob, planets);
        const root = reduceNumber(total);
        const driver = bData?.driver;
        const conductor = bData?.conductor;

        if (!driver || !conductor) return statusFromMeaning;

        const dRel = planetRelations.find(r => Number(r.planet_number) === driver);
        const cRel = planetRelations.find(r => Number(r.planet_number) === conductor);

        const dFriends = parseNumberList(dRel?.friend_numbers);
        const cFriends = parseNumberList(cRel?.friend_numbers);
        const dNeutrals = parseNumberList(dRel?.neutral_numbers);
        const cNeutrals = parseNumberList(cRel?.neutral_numbers);

        const isDFriend = dFriends.includes(root) || root === driver;
        const isCFriend = cFriends.includes(root) || root === conductor;
        const isDNeutral = dNeutrals.includes(root);
        const isCNeutral = cNeutrals.includes(root);

        if (age < 45) {
            if (isDFriend && isCFriend) return "Excellent";
            if (isDFriend || isCFriend) return "Good";
            if (isDNeutral || isCNeutral) return "Neutral";
            return "Not Suitable";
        } else {
            if (isCFriend) return "Excellent";
            if (isCNeutral) return "Neutral";
            return "Not Suitable";
        }
    };

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

    const birthData = useMemo(() => birthDataSync(dob, planets), [dob, planets]);

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

    const searchClients = async (query: string) => {
        if (!query) {
            setClientResults([]);
            return;
        }
        try {
            const token = localStorage.getItem("admin_token");
            const res = await fetch(`${API_BASE_URL}/admin/clients/search?query=${encodeURIComponent(query)}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                setClientResults(await res.json());
            }
        } catch (e) {
            console.error("Search failed", e);
        }
    };

    const fetchClient = async (id: string) => {
        try {
            const token = localStorage.getItem("admin_token");
            const res = await fetch(`${API_BASE_URL}/admin/clients/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setSelectedClient(data);
                if (data.dob) setDob(data.dob);
            }
        } catch (e) {
            console.error("Failed to fetch client", e);
        }
    };

    const fetchHistory = async (id: string) => {
        try {
            const token = localStorage.getItem("admin_token");
            const res = await fetch(`${API_BASE_URL}/admin/clients/${id}/history`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setHistory(data.filter((h: any) => h.type === 'Mobile'));
            }
        } catch (e) { console.error(e); }
    };

    const fetchAvailableCredits = async () => {
        try {
            const token = localStorage.getItem("admin_token");
            const res = await fetch(`${API_BASE_URL}/admin/dashboard/stats`, {
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

    const resetAnalysis = () => {
        setMobile("");
        setDob("");
        setResult(null);
        setEditingId(null);
        setError("");
    };

    const checkMobile = async (number: string, save: boolean = true) => {
        if (!number) return;
        setLoading(true);
        setError("");
        const token = localStorage.getItem("admin_token");
        try {
            const res = await fetch(`${API_BASE_URL}/admin/mobile-astrology/check`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    mobile_number: number,
                    dob: dob,
                    client_id: currentClientId,
                    save_record: save,
                    id: editingId // Pass ID if editing
                })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Analysis failed");

            let newCheckId = editingId;
            if (data.check_id) {
                newCheckId = data.check_id;
                setEditingId(newCheckId);
                if (currentClientId) fetchHistory(String(currentClientId));
            }

            // Automatic Confirm if Client Selected
            if (currentClientId && newCheckId && save) {
                await fetch(`${API_BASE_URL}/admin/astrology/confirm`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({ check_id: newCheckId, type: 'Mobile' })
                });
            }

            // --- Enhanced Calculations for Last 4 Digits ---
            const clean = number.replace(/[^0-9]/g, '');
            const last4 = clean.slice(-4);
            let l4Compound = 0;
            last4.split('').forEach(d => l4Compound += Number(d));
            const l4Root = reduceNumber(l4Compound);

            setResult({
                ...data,
                last4: {
                    compound: l4Compound,
                    root: l4Root
                },
                personalizedResult: classifyStatus(data.meaning?.result, data.compound)
            });

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
            setShowConfirmModal(false);
            fetchAvailableCredits();
        }
    };

    const handleSaveRequest = (e: React.FormEvent) => {
        e.preventDefault();
        if (!mobile || !currentClientId) {
            handleSubmit(e);
            return;
        }
        setShowConfirmModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        checkMobile(mobile);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-4">
                    <button onClick={() => {
                        const params = new URLSearchParams();
                        if (currentClientId) params.set('client_id', String(currentClientId));
                        navigate(`/admin/mobile-astrology?${params.toString()}`);
                    }} className="p-2.5 rounded-xl bg-card border border-border hover:border-primary/50 transition-all text-muted-foreground hover:text-primary shadow-sm">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <div className="flex items-center gap-4">
                            <h1 className="text-3xl font-black flex items-center gap-3 text-foreground tracking-tight">
                                <span className="p-2.5 bg-primary/10 rounded-xl text-primary">
                                    {editingId ? <Users size={24} /> : <Sparkles size={24} />}
                                </span>
                                {editingId ? 'Edit Analysis' : 'New Analysis'}
                            </h1>
                            <div className="px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100 flex items-center gap-2">
                                <CreditCard size={14} />
                                <span className="text-[10px] font-black uppercase tracking-widest leading-none">Available: {availableCredits}</span>
                            </div>
                        </div>
                        <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-widest mt-1 ml-1 opacity-60">
                            {editingId ? 'Update existing record' : 'Create a new vibrational reading'}
                        </p>
                    </div>
                </div>
                <div className="flex gap-3 items-center">
                    {/* New Analysis Button */}
                    <button
                        onClick={resetAnalysis}
                        className="px-4 py-2.5 font-bold rounded-xl bg-card border border-border hover:border-primary/50 transition-all flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
                    >
                        <PlusCircle size={18} /> New Analysis
                    </button>

                    <div className="w-px h-6 bg-border mx-1" />
                </div>
            </div>

            {/* Client Search */}
            <div className="relative z-50">
                {selectedClient ? (
                    <div className="p-4 rounded-xl border border-[#D4AF37]/20 bg-[#FAF7F2] flex items-center justify-between shadow-lg">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-[#B91C1C] rounded-xl text-white shadow-lg shadow-red-500/20">
                                <Users size={20} />
                            </div>
                            <div className="flex flex-col">
                                <h2 className="text-xl font-black text-[#2D2926] flex items-center gap-3 tracking-tight">
                                    {selectedClient.full_name}
                                </h2>
                                <div className="flex items-center gap-4 text-xs font-bold text-[#2D2926]/40 uppercase tracking-widest mt-1">
                                    <span className="flex items-center gap-1.5 p-1 px-2 bg-[#F3EFE9] rounded-lg">
                                        <Calendar size={12} className="text-[#D4AF37]" />
                                        {new Date(selectedClient.dob).toLocaleDateString('en-GB')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white p-1.5 rounded-2xl border border-black/5 flex items-center shadow-xl group focus-within:border-[#D4AF37]/50 transition-all">
                        <div className="p-2.5 bg-[#D4AF37]/10 rounded-xl text-[#D4AF37] group-focus-within:bg-[#D4AF37] group-focus-within:text-white transition-colors ml-1">
                            <Users size={18} />
                        </div>
                        <input
                            className="bg-transparent px-4 py-2 text-[#2D2926] w-full outline-none placeholder:text-[#2D2926]/30 font-medium"
                            placeholder="Search existing client..."
                            value={clientSearch}
                            onChange={(e) => { setClientSearch(e.target.value); searchClients(e.target.value); }}
                            onFocus={() => setShowDropdown(true)}
                        />
                    </div>
                )}
                {
                    showDropdown && clientResults.length > 0 && !selectedClient && (
                        <div className="absolute top-full left-0 w-full mt-3 bg-card border border-border rounded-2xl max-h-72 overflow-y-auto shadow-2xl z-50 backdrop-blur-xl divide-y divide-border/50">
                            {clientResults.map(c => (
                                <button key={c.id} onClick={() => {
                                    setDob(c.dob);
                                    setSelectedClient(c);
                                    setClientSearch("");
                                    setShowDropdown(false);
                                }} className="w-full text-left p-4 hover:bg-primary/5 flex justify-between items-center group transition-colors">
                                    <span className="font-bold text-foreground group-hover:text-primary transition-colors">{c.full_name}</span>
                                    <span className="text-xs font-mono text-muted-foreground">{new Date(c.dob).toLocaleDateString()}</span>
                                </button>
                            ))}
                        </div>
                    )
                }
            </div>

            {/* Analysis Form */}
            <div className={`p-6 rounded-3xl border ${editingId ? 'border-[#D4AF37]/30 bg-[#FAF7F2]' : 'border-black/5 bg-white shadow-xl'} relative overflow-hidden`} >
                <div className="absolute top-0 right-0 p-4 opacity-5">
                    <Smartphone size={120} />
                </div>
                <form onSubmit={handleSaveRequest} className="space-y-6 relative z-10">
                    <div className="space-y-2">
                        <label className="text-xs font-black text-[#D4AF37] uppercase tracking-widest flex items-center gap-2 pl-1">
                            <Smartphone size={16} />
                            Mobile Number
                        </label>
                        <input
                            type="text"
                            value={mobile}
                            onChange={(e) => setMobile(e.target.value)}
                            required
                            placeholder="Enter 10 digit mobile number"
                            className="w-full bg-[#F3EFE9] border border-black/5 rounded-2xl px-5 py-4 text-[#2D2926] focus:outline-none focus:border-[#D4AF37]/50 transition-all font-mono text-xl shadow-inner"
                        />
                    </div>
                    <div className="flex justify-end pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`px-10 py-4 rounded-2xl font-black uppercase tracking-widest transition-all flex items-center gap-3 shadow-xl active:scale-95 text-xs ${loading
                                ? "bg-muted text-[#2D2926]/40 cursor-wait"
                                : "bg-gradient-to-r from-[#D4AF37] to-[#B91C1C] text-white hover:shadow-2xl hover:shadow-red-500/20"
                                }`}
                        >
                            {loading ? (
                                <>Analyzing...</>
                            ) : (
                                editingId ? (
                                    <><Save size={18} /> Update Analysis</>
                                ) : (
                                    <><Smartphone size={18} /> Analyze Now</>
                                )
                            )}
                        </button>
                    </div>
                </form>

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
                                        onClick={() => checkMobile(mobile)}
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
            </div>

            {/* History Section */}
            {currentClientId && (
                <div className="space-y-6">
                    {/* Toggle History Button */}
                    <button
                        onClick={() => setShowHistory(!showHistory)}
                        className={`w-full py-4 rounded-2xl border-2 border-dashed flex items-center justify-center gap-3 font-black text-xs uppercase tracking-widest transition-all ${showHistory ? 'bg-primary/5 border-primary/30 text-primary' : 'bg-muted/10 border-border hover:border-primary/30 text-muted-foreground hover:text-primary'}`}
                    >
                        {showHistory ? <><EyeOff size={16} /> Hide Saved Records</> : <><History size={16} /> Show Saved Records ({history.length})</>}
                    </button>

                    {/* Saved History */}
                    {showHistory && history.length > 0 && (
                        <div className="bg-white p-6 rounded-3xl border border-black/5 shadow-xl">
                            <h2 className="text-xl font-black text-[#2D2926] mb-6 flex items-center gap-3 tracking-tight">
                                <span className="p-2 bg-blue-500/10 rounded-xl text-blue-500"><History size={20} /></span>
                                Saved Records
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin">
                                {history.map((record: any) => (
                                    <button
                                        key={record.id}
                                        onClick={() => {
                                            setMobile(record.mobile_number);
                                            setEditingId(record.id);
                                            checkMobile(record.mobile_number, false);
                                        }}
                                        className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between group hover:border-[#D4AF37]/50 hover:shadow-lg ${editingId === record.id ? 'bg-[#D4AF37]/10 border-[#D4AF37]/30' : 'bg-[#FAF7F2] border-black/5'}`}
                                    >
                                        <div className="flex flex-col">
                                            <span className="font-black text-[#2D2926] group-hover:text-[#D4AF37] transition-colors uppercase tracking-tight text-sm">{record.mobile_number}</span>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[9px] font-black text-[#D4AF37]/60 uppercase tracking-widest">{record.Compound_number} / {record.total_number}</span>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Results */}
            {
                result && (
                    <div className="space-y-6 animate-fade-in-up">
                        {/* Analyzed Number Header */}
                        <div className="flex justify-center mb-8">
                            <div className="bg-card border border-primary/20 shadow-lg shadow-primary/5 rounded-[2rem] px-10 py-4 flex flex-col items-center">
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-1">Analyzed Number</span>
                                <span className="text-4xl font-black font-mono tracking-widest text-foreground">{result.mobile_number}</span>
                            </div>
                        </div>

                        {/* Birth Data Section (Driver/Conductor/Auspicious) */}
                        {birthData && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="premium-card p-6 rounded-[2rem] border border-border text-center bg-card/60 backdrop-blur-sm group hover:border-[#D4AF37]/30 transition-all">
                                    <p className="text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.2em] mb-4">Driver (Mulank)</p>
                                    <div className="text-5xl font-black text-foreground mb-2">{birthData.driver}</div>
                                    <div className="flex items-center justify-center gap-2 text-[#D4AF37] font-bold">
                                        <Star size={14} className="fill-[#D4AF37]" />
                                        <span className="text-xs uppercase tracking-widest">{birthData.driverPlanet}</span>
                                    </div>
                                </div>
                                <div className="premium-card p-6 rounded-[2rem] border border-border text-center bg-card/60 backdrop-blur-sm group hover:border-[#6366f1]/30 transition-all">
                                    <p className="text-[10px] font-black text-[#6366f1] uppercase tracking-[0.2em] mb-4">Conductor (Bhagyank)</p>
                                    <div className="text-5xl font-black text-foreground mb-2">{birthData.conductor}</div>
                                    <div className="flex items-center justify-center gap-2 text-[#6366f1] font-bold">
                                        <Star size={14} className="fill-[#6366f1]" />
                                        <span className="text-xs uppercase tracking-widest">{birthData.conductorPlanet}</span>
                                    </div>
                                </div>
                                <div className="premium-card p-6 rounded-[2rem] border border-border bg-card/60 backdrop-blur-sm flex flex-col items-center justify-center group hover:border-green-500/30 transition-all">
                                    <p className="text-[10px] font-black text-green-500 uppercase tracking-[0.2em] mb-4">Auspicious Numbers</p>
                                    <div className="flex flex-wrap gap-2 justify-center">
                                        {luckyNumbers.map(num => (
                                            <div key={num} className="w-10 h-10 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-500 font-black text-lg">
                                                {num}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="glass-card p-6 rounded-2xl border border-border text-center bg-card shadow-lg hover:border-primary/20 transition-all">
                                <p className="text-muted-foreground text-[10px] mb-2 font-black uppercase tracking-[0.2em]">Total Compound</p>
                                <p className="text-5xl font-black text-primary">{result.compound}</p>
                                <div className="mt-2 text-[10px] text-muted-foreground font-bold uppercase opacity-50">Sum of digits</div>
                            </div>
                            <div className="glass-card p-6 rounded-2xl border border-border text-center bg-card shadow-lg hover:border-primary/20 transition-all">
                                <p className="text-muted-foreground text-[10px] mb-2 font-black uppercase tracking-[0.2em]">Root Number (Total)</p>
                                <p className="text-5xl font-black text-foreground">{result.root}</p>
                                <div className="mt-2 text-[10px] text-muted-foreground font-bold uppercase opacity-50">Single digit</div>
                            </div>
                            <div className="glass-card p-6 rounded-2xl border border-border text-center bg-card shadow-lg border-primary/20 bg-primary/5 transition-all">
                                <p className="text-primary text-[10px] mb-2 font-black uppercase tracking-[0.2em]">Last 4 Digits</p>
                                <p className="text-5xl font-black text-primary">
                                    {result.last4?.root}
                                    <span className="text-xs text-primary/50 font-bold ml-1">({result.last4?.compound})</span>
                                </p>
                                <div className="mt-2 text-[10px] text-muted-foreground font-bold uppercase opacity-50 tabular-nums">Vibrational End</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Total Meaning */}
                            {result.meaning && (
                                <div className="glass-card p-8 rounded-[2rem] border border-border bg-card/40 backdrop-blur-sm relative overflow-hidden group hover:border-primary/30 transition-all">
                                    <div className="flex flex-col gap-6 relative z-10">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-primary/10 rounded-xl text-primary">
                                                <Sparkles size={24} />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-black tracking-tight text-foreground">Total Number Analysis</h3>
                                                <div className="flex gap-2 mt-1">
                                                    {/* Personalized Tag */}
                                                    {result.personalizedResult && (
                                                        <span className={`px-2 py-0.5 text-[10px] rounded-md border font-black uppercase tracking-widest ${result.personalizedResult === 'Excellent' || result.personalizedResult === 'Super'
                                                            ? 'bg-green-500/10 text-green-500 border-green-500/20'
                                                            : result.personalizedResult === 'Good'
                                                                ? 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                                                                : result.personalizedResult === 'Neutral'
                                                                    ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                                                                    : 'bg-red-500/10 text-red-500 border-red-500/20'
                                                            }`}>
                                                            {result.personalizedResult}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-bold text-foreground mb-2">{result.meaning.title}</h4>
                                            <p className="text-muted-foreground leading-relaxed italic text-sm">"{result.meaning.description}"</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {/* Last 4 Meaning */}
                            {result.last4?.meaning && (
                                <div className="glass-card p-8 rounded-[2rem] border border-border bg-card/40 backdrop-blur-sm relative overflow-hidden group hover:border-primary/30 transition-all">
                                    <div className="flex flex-col gap-6 relative z-10">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-primary/10 rounded-xl text-primary">
                                                <History size={24} />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-black tracking-tight text-foreground">Vibrational End Analysis</h3>
                                                <div className="flex gap-2 mt-1">
                                                    <span className="px-2 py-0.5 text-[10px] rounded-md border border-border bg-muted/50 text-muted-foreground font-bold uppercase tracking-widest">
                                                        Last 4 Digits
                                                    </span>
                                                    <span className={`px-2 py-0.5 text-[10px] rounded-md border font-black uppercase tracking-widest ${['Excellent', 'Good', 'Best'].includes(result.last4.meaning.result)
                                                        ? 'bg-green-500/10 text-green-500 border-green-500/20'
                                                        : result.last4.meaning.result === 'Average'
                                                            ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                                                            : 'bg-red-500/10 text-red-500 border-red-500/20'
                                                        }`}>
                                                        {result.last4.meaning.result}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-bold text-foreground mb-2">{result.last4.meaning.title}</h4>
                                            <p className="text-muted-foreground leading-relaxed italic text-sm">"{result.last4.meaning.description}"</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )
            }
        </div >
    );
}
