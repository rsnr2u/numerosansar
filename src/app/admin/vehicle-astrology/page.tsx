import { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Car, Sparkles, AlertCircle, ArrowLeft, History, CheckCircle, Save, Star, Users, Calendar, Trash2, Pencil, MapPin, EyeOff, PlusCircle, CreditCard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";
import { Link } from "react-router-dom";

interface Client {
    id: number;
    full_name: string;
    calling_name?: string;
    dob: string;
}

export default function VehicleAstrologyPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [vehicle, setVehicle] = useState("");
    const [vehicleType, setVehicleType] = useState("4 Wheeler");
    const [dob, setDob] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState("");
    const [history, setHistory] = useState<any[]>([]);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [clientSearch, setClientSearch] = useState("");
    const [clientResults, setClientResults] = useState<Client[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [checkId, setCheckId] = useState<number | null>(null);
    const [showHistory, setShowHistory] = useState(false);
    const [availableCredits, setAvailableCredits] = useState<number>(0);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    // Derived clientId from either URL or selected state
    const currentClientId = selectedClient?.id || searchParams.get('client_id');

    useEffect(() => {
        const dobParam = searchParams.get('dob');
        if (dobParam) setDob(dobParam);

        const clientId = searchParams.get('client_id');
        if (clientId) {
            fetchClient(clientId);
            fetchHistory(clientId);
        }

        const checkIdParam = searchParams.get('check_id');
        if (checkIdParam) setCheckId(Number(checkIdParam));

        fetchAvailableCredits();
    }, [searchParams]);

    // --- Helpers ---
    const reduceNumber = (num: number): number => {
        while (num > 9) {
            let sum = 0;
            String(num).split('').forEach(d => sum += parseInt(d));
            num = sum;
        }
        return num;
    };

    const fetchClient = async (id: string) => {
        try {
            const res = await api.get(`/admin/clients/${id}`);
            if (res.ok) {
                const data = await res.json();
                setSelectedClient(data);
                if (data.dob) setDob(data.dob);
            }
        } catch (e) {
            console.error("Failed to fetch client", e);
        }
    };

    const searchClients = async (query: string) => {
        if (!query) { setClientResults([]); return; }
        try {
            const res = await api.get(`/admin/clients`, { params: { search: query } });
            if (res.ok) setClientResults(await res.json());
        } catch (e) { console.error(e); }
    };

    const fetchHistory = async (id: string) => {
        try {
            const res = await api.get(`/admin/clients/${id}/history`);
            if (res.ok) {
                const data = await res.json();
                setHistory(data.filter((h: any) => h.type === 'Vehicle'));
            }
        } catch (e) {
            console.error("Failed to fetch history", e);
        }
    };

    const fetchAvailableCredits = async () => {
        try {
            const res = await api.get(`/admin/dashboard/stats`);
            if (res.ok) {
                const data = await res.json();
                setAvailableCredits(data.credits_remaining);
            }
        } catch (e) {
            console.error("Failed to fetch credits", e);
        }
    };

    const checkVehicle = async (number: string, vType: string) => {
        if (!number) return;
        setLoading(true);
        setError("");
        try {
            const res = await api.post(`/admin/vehicle-astrology/check`, {
                id: checkId, // Pass ID if editing
                vehicle_number: number,
                vehicle_type: vType,
                dob: dob,
                client_id: currentClientId
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Analysis failed");

            let newCheckId = checkId;
            if (data.check_id) {
                newCheckId = data.check_id;
                setCheckId(newCheckId);
                if (currentClientId) fetchHistory(String(currentClientId));
            }

            // Automatic Confirm if Client Selected
            if (currentClientId && newCheckId) {
                await api.post(`/admin/astrology/confirm`, { check_id: newCheckId, type: 'Vehicle' });
            }

            setResult(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
            setShowConfirmModal(false);
            fetchAvailableCredits();
        }
    };

    const deleteRecord = async (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm('Are you sure you want to delete this record?')) return;
        try {
            const res = await api.delete(`/admin/vehicle-astrology/${id}`);
            if (res.ok) {
                setHistory(prev => prev.filter(item => item.id !== id));
            }
        } catch (error) {
            console.error(error);
        }
    };

    const resetAnalysis = () => {
        setVehicle("");
        setCheckId(null);
        setResult(null);
        setError("");
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        checkVehicle(vehicle, vehicleType);
    };

    const handleSaveRequest = (e: React.FormEvent) => {
        e.preventDefault();
        if (!vehicle || !currentClientId) {
            handleSubmit(e);
            return;
        }
        setShowConfirmModal(true);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-4">
                    <button onClick={() => {
                        if (currentClientId) {
                            navigate(`/admin/clients/${currentClientId}`);
                        } else {
                            navigate(-1);
                        }
                    }} className="p-2.5 rounded-xl bg-card border border-border hover:border-primary/50 transition-all text-muted-foreground hover:text-primary shadow-sm">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <div className="flex items-center gap-4">
                            <h1 className="text-3xl font-black flex items-center gap-3 text-foreground tracking-tight">
                                <span className="p-2.5 bg-primary/10 rounded-xl text-primary">
                                    <Car size={24} />
                                </span>
                                Vehicle Astrology
                            </h1>
                            <div className="px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100 flex items-center gap-2">
                                <CreditCard size={14} />
                                <span className="text-[10px] font-black uppercase tracking-widest leading-none">Available: {availableCredits}</span>
                            </div>
                        </div>
                        <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-widest mt-1 ml-1 opacity-60">Vibrational analysis for vehicles</p>
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

            {/* Client Selection */}
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
                                    {selectedClient.calling_name && (
                                        <span className="text-[10px] px-2 py-0.5 bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 rounded-full font-bold uppercase tracking-tighter">
                                            {selectedClient.calling_name}
                                        </span>
                                    )}
                                </h2>
                                <div className="flex items-center gap-4 text-xs font-bold text-[#2D2926]/40 uppercase tracking-widest mt-1">
                                    <span className="flex items-center gap-1.5 p-1 px-2 bg-[#F3EFE9] rounded-lg">
                                        <Calendar size={12} className="text-[#10B981]" />
                                        {new Date(selectedClient.dob).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white p-1.5 rounded-2xl border border-black/5 flex items-center shadow-xl group focus-within:border-[#10B981]/50 transition-all">
                        <div className="p-2.5 bg-[#10B981]/10 rounded-xl text-[#10B981] group-focus-within:bg-[#10B981] group-focus-within:text-white transition-colors ml-1">
                            <Users size={18} />
                        </div>
                        <input
                            className="bg-transparent px-4 py-2 text-[#2D2926] w-full outline-none placeholder:text-[#2D2926]/30 font-medium"
                            placeholder="Select a client to start analysis..."
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
                                navigate(`?${params.toString()}`);
                                fetchHistory(String(c.id));
                            }} className="w-full text-left p-4 hover:bg-primary/5 flex justify-between items-center group transition-colors">
                                <div className="flex flex-col">
                                    <span className="font-bold text-foreground group-hover:text-primary transition-colors">{c.full_name}</span>
                                    <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">{c.calling_name || 'No calling name'}</span>
                                </div>
                                <span className="text-xs font-mono text-muted-foreground">{new Date(c.dob).toLocaleDateString()}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Input Section */}
            <div className="bg-white p-6 rounded-3xl border border-black/5 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                    <Car size={150} />
                </div>

                <form onSubmit={handleSaveRequest} className="space-y-6 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                        <div className="space-y-2">
                            <label className="text-[9px] uppercase tracking-[0.2em] text-[#2D2926]/40 font-black pl-1">Vehicle Type</label>
                            <select
                                value={vehicleType}
                                onChange={(e) => setVehicleType(e.target.value)}
                                className="w-full bg-[#FAF7F2] border border-black/5 rounded-xl px-4 py-2.5 text-[#2D2926] focus:outline-none focus:border-[#10B981]/50 transition-all font-bold"
                            >
                                <option value="2 Wheeler">2 Wheeler (Bike/Scooter)</option>
                                <option value="4 Wheeler">4 Wheeler (Car/SUV)</option>
                                <option value="Commercial">Commercial Vehicle</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div className="md:col-span-1 space-y-2">
                            <label className="text-[9px] uppercase tracking-[0.2em] text-[#2D2926]/40 font-black pl-1">Vehicle Number</label>
                            <input
                                type="text"
                                value={vehicle}
                                onChange={(e) => setVehicle(e.target.value.toUpperCase())}
                                required
                                placeholder="e.g. MH01AB1234"
                                className="w-full bg-[#FAF7F2] border border-black/5 rounded-xl px-4 py-2.5 text-[#2D2926] focus:outline-none focus:border-[#10B981]/50 transition-all font-mono text-lg uppercase tracking-wider"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !vehicle}
                            className="bg-astro-gradient text-white font-black py-2.5 px-8 rounded-xl hover:shadow-2xl active:scale-95 transition-all shadow-xl shadow-[#10B981]/20 flex items-center justify-center gap-2 group h-[48px] text-xs uppercase tracking-widest"
                        >
                            {loading ? "Analyzing..." : <>{checkId ? 'Update Result' : 'Analyze Vehicle'} <Sparkles size={18} className="group-hover:animate-pulse" /></>}
                        </button>
                    </div>

                    {error && (
                        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center gap-2 text-xs font-black uppercase tracking-widest">
                            <AlertCircle size={14} />
                            {error}
                        </div>
                    )}
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
                                        onClick={() => checkVehicle(vehicle, vehicleType)}
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

            {/* Results Display */}
            {result && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Chaldean System */}
                        <div className="bg-white p-6 rounded-3xl border border-black/5 shadow-xl relative group hover:border-[#D4AF37]/30 transition-all overflow-hidden">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-sm font-black text-[#D4AF37] tracking-widest uppercase">Chaldean System</h3>
                                <div className="p-2 bg-[#D4AF37]/10 rounded-lg text-[#D4AF37]"><Star size={16} /></div>
                            </div>
                            <div className="flex items-center gap-8">
                                <div className="text-center">
                                    <p className="text-[9px] font-black text-[#2D2926]/40 uppercase tracking-widest mb-1">Compound</p>
                                    <p className="text-5xl font-black text-[#2D2926]">{result.chaldean.compound}</p>
                                </div>
                                <div className="w-px h-12 bg-black/5" />
                                <div className="text-center">
                                    <p className="text-[9px] font-black text-[#2D2926]/40 uppercase tracking-widest mb-1">Root</p>
                                    <p className="text-5xl font-black text-[#D4AF37]">{result.chaldean.root}</p>
                                </div>
                            </div>
                            <div className="mt-8 pt-6 border-t border-black/5">
                                <p className="text-[10px] font-black text-[#2D2926]/40 uppercase tracking-widest flex items-center gap-2 mb-3">
                                    <History size={12} className="text-[#D4AF37]" /> Letter Breakdown
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {result.breakdown.map((item: any, idx: number) => (
                                        <div key={idx} className="flex flex-col items-center p-2 bg-[#FAF7F2] rounded-xl border border-black/5 min-w-[2.5rem] shadow-sm">
                                            <span className="text-xs font-black text-[#2D2926]">{item.char}</span>
                                            <span className="text-[10px] text-[#D4AF37] font-black">{item.ch}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Pythagorean System */}
                        <div className="bg-white p-6 rounded-3xl border border-black/5 shadow-xl relative group hover:border-[#6366f1]/30 transition-all overflow-hidden">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-sm font-black text-[#6366f1] tracking-widest uppercase">Pythagorean System</h3>
                                <div className="p-2 bg-[#6366f1]/10 rounded-lg text-[#6366f1]"><CheckCircle size={16} /></div>
                            </div>
                            <div className="flex items-center gap-8">
                                <div className="text-center">
                                    <p className="text-[9px] font-black text-[#2D2926]/40 uppercase tracking-widest mb-1">Compound</p>
                                    <p className="text-5xl font-black text-[#2D2926]">{result.pythagorean.compound}</p>
                                </div>
                                <div className="w-px h-12 bg-black/5" />
                                <div className="text-center">
                                    <p className="text-[9px] font-black text-[#2D2926]/40 uppercase tracking-widest mb-1">Root</p>
                                    <p className="text-5xl font-black text-[#6366f1]">{result.pythagorean.root}</p>
                                </div>
                            </div>
                            <div className="mt-8 pt-6 border-t border-black/5">
                                <p className="text-[10px] font-black text-[#2D2926]/40 uppercase tracking-widest flex items-center gap-2 mb-3">
                                    <History size={12} className="text-[#6366f1]" /> Letter Breakdown
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {result.breakdown.map((item: any, idx: number) => (
                                        <div key={idx} className="flex flex-col items-center p-2 bg-[#FAF7F2] rounded-xl border border-black/5 min-w-[2.5rem] shadow-sm">
                                            <span className="text-xs font-black text-[#2D2926]">{item.char}</span>
                                            <span className="text-[10px] text-[#6366f1] font-black">{item.py}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Numerology System */}
                        <div className="bg-white p-6 rounded-3xl border border-black/5 shadow-xl relative group hover:border-primary/30 transition-all overflow-hidden md:col-span-2 lg:col-span-1">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-sm font-black text-primary tracking-widest uppercase">Numerology System</h3>
                                <div className="p-2 bg-primary/10 rounded-lg text-primary"><Star size={16} /></div>
                            </div>
                            <div className="flex items-center gap-8">
                                <div className="text-center">
                                    <p className="text-[9px] font-black text-[#2D2926]/40 uppercase tracking-widest mb-1">Compound</p>
                                    <p className="text-5xl font-black text-[#2D2926]">{result.numerology.compound}</p>
                                </div>
                                <div className="w-px h-12 bg-black/5" />
                                <div className="text-center">
                                    <p className="text-[9px] font-black text-[#2D2926]/40 uppercase tracking-widest mb-1">Root</p>
                                    <p className="text-5xl font-black text-primary">{result.numerology.root}</p>
                                </div>
                            </div>
                            <div className="mt-8 pt-6 border-t border-black/5">
                                <p className="text-[10px] font-black text-[#2D2926]/40 uppercase tracking-widest flex items-center gap-2 mb-3">
                                    <History size={12} className="text-primary" /> Letter Breakdown
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {result.breakdown.map((item: any, idx: number) => (
                                        <div key={idx} className="flex flex-col items-center p-2 bg-[#FAF7F2] rounded-xl border border-black/5 min-w-[2.5rem] shadow-sm">
                                            <span className="text-xs font-black text-[#2D2926]">{item.char}</span>
                                            <span className="text-[10px] text-primary font-black">{item.nu || item.ch}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Last 4 Digits Analysis */}
                    <div className="bg-white p-6 rounded-3xl border border-black/5 shadow-xl relative overflow-hidden group">
                        <div className="flex flex-col md:flex-row gap-8 items-center">
                            <div className="flex-shrink-0 text-center md:text-left">
                                <p className="text-[10px] font-black text-[#2D2926]/40 uppercase tracking-widest mb-2 px-1">Last 4 Digits</p>
                                <p className="text-4xl font-black text-[#2D2926] tracking-widest font-mono bg-[#FAF7F2] px-6 py-2 rounded-2xl border border-black/5 shadow-inner">{result.last4.number}</p>
                            </div>
                            <div className="flex-grow grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-black/5 text-center shadow-sm">
                                    <p className="text-[9px] font-black text-[#2D2926]/40 uppercase mb-1">Total Sum</p>
                                    <p className="text-2xl font-black text-[#2D2926]">{result.last4.compound}</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-center shadow-sm">
                                    <p className="text-[9px] font-black text-[#D4AF37] uppercase mb-1">Root Number</p>
                                    <p className="text-2xl font-black text-[#D4AF37]">{result.last4.root}</p>
                                </div>
                            </div>
                        </div>

                        {/* Last 4 Meaning */}
                        {result.last4.meaning && (
                            <div className="mt-8 p-6 rounded-2xl bg-[#FAF7F2] border border-black/5 shadow-inner relative">
                                <div className="flex items-center gap-3 mb-3">
                                    <h4 className="text-lg font-black text-[#D4AF37] tracking-tight">{result.last4.meaning.title}</h4>
                                    <span className={`px-2 py-0.5 text-[9px] font-black uppercase rounded-full border ${result.last4.meaning.result === 'Excellent' || result.last4.meaning.result === 'Good'
                                        ? 'bg-green-500/10 text-green-500 border-green-500/20'
                                        : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                                        }`}>
                                        {result.last4.meaning.result}
                                    </span>
                                </div>
                                <p className="text-xs text-[#2D2926]/60 leading-relaxed italic font-medium">"{result.last4.meaning.description}"</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* History Section */}
            {selectedClient && (
                <div className="space-y-6 pt-12 border-t border-border mt-12">
                </div>
            )}
        </div>
    );
}
