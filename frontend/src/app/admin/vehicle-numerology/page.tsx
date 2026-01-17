"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Car, Sparkles, AlertCircle, ArrowLeft, History, CheckCircle, Save, Star, Users, Calendar, Trash2, Pencil, MapPin, EyeOff, PlusCircle } from "lucide-react";
import { api } from "@/lib/api";
import Link from "next/link";

interface Client {
    id: number;
    full_name: string;
    calling_name?: string;
    dob: string;
}

export default function VehicleNumerologyPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
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

    const checkVehicle = async (number: string, vType: string) => {
        if (!number) return;
        setLoading(true);
        setError("");
        try {
            const res = await api.post(`/admin/vehicle-numerology/check`, {
                id: checkId, // Pass ID if editing
                vehicle_number: number,
                vehicle_type: vType,
                dob: dob,
                client_id: currentClientId
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Analysis failed");

            if (data.check_id) {
                setCheckId(data.check_id);
                if (currentClientId) fetchHistory(String(currentClientId));
            }
            setResult(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const deleteRecord = async (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm('Are you sure you want to delete this record?')) return;
        try {
            const res = await api.delete(`/admin/vehicle-numerology/${id}`);
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

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-4">
                    <button onClick={() => {
                        if (currentClientId) {
                            router.push(`/admin/clients/${currentClientId}`);
                        } else {
                            router.back();
                        }
                    }} className="p-2.5 rounded-xl bg-card border border-border hover:border-primary/50 transition-all text-muted-foreground hover:text-primary shadow-sm">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-3xl font-black flex items-center gap-3 text-foreground tracking-tight">
                            <span className="p-2.5 bg-primary/10 rounded-xl text-primary">
                                <Car size={24} />
                            </span>
                            Vehicle Numerology
                        </h1>
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
                    <div className="premium-card p-4 rounded-2xl border-2 border-primary/20 bg-primary/5 backdrop-blur-md flex items-center justify-between shadow-lg">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-primary rounded-xl text-black shadow-lg shadow-primary/20">
                                <Users size={20} />
                            </div>
                            <div className="flex flex-col">
                                <h2 className="text-xl font-black text-foreground flex items-center gap-3 tracking-tight">
                                    {selectedClient.full_name}
                                    {selectedClient.calling_name && (
                                        <span className="text-[10px] px-2 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded-full font-bold uppercase tracking-tighter">
                                            {selectedClient.calling_name}
                                        </span>
                                    )}
                                </h2>
                                <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">
                                    <span className="flex items-center gap-1.5 p-1 px-2 bg-muted/30 rounded-lg">
                                        <Calendar size={12} className="text-primary" />
                                        {new Date(selectedClient.dob).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                    </span>
                                </div>
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
                                router.replace(`?${params.toString()}`);
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
            <div className="glass-card p-8 rounded-[2rem] border border-border bg-card/60 backdrop-blur-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                    <Car size={150} />
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                        <div className="space-y-2">
                            <label className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground font-black pl-1">Vehicle Type</label>
                            <select
                                value={vehicleType}
                                onChange={(e) => setVehicleType(e.target.value)}
                                className="w-full bg-input/20 border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-accent/50 transition-all font-bold"
                            >
                                <option value="2 Wheeler">2 Wheeler (Bike/Scooter)</option>
                                <option value="4 Wheeler">4 Wheeler (Car/SUV)</option>
                                <option value="Commercial">Commercial Vehicle</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div className="md:col-span-1 space-y-2">
                            <label className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground font-black pl-1">Vehicle Number</label>
                            <input
                                type="text"
                                value={vehicle}
                                onChange={(e) => setVehicle(e.target.value.toUpperCase())}
                                required
                                placeholder="e.g. MH01AB1234"
                                className="w-full bg-input/20 border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-accent/50 transition-all font-mono text-lg uppercase tracking-wider"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !vehicle}
                            className="bg-gradient-primary text-white font-black py-2.5 px-8 rounded-xl hover:opacity-90 active:scale-95 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2 group h-[48px]"
                        >
                            {loading ? "Analyzing..." : <>{checkId ? 'Update Result' : 'Analyze Vehicle'} <Sparkles size={18} className="group-hover:animate-pulse" /></>}
                        </button>
                    </div>

                    {error && (
                        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center gap-2 text-xs font-bold font-mono uppercase tracking-widest">
                            <AlertCircle size={14} />
                            {error}
                        </div>
                    )}
                </form>
            </div>

            {/* Results Display */}
            {result && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Chaldean System */}
                        <div className="premium-card p-8 rounded-[2.5rem] border border-border bg-card/40 backdrop-blur-md relative group hover:border-primary/30 transition-all">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-black text-primary tracking-tighter uppercase">Chaldean System</h3>
                                <div className="p-2 bg-primary/10 rounded-lg text-primary"><Star size={16} /></div>
                            </div>
                            <div className="flex items-center gap-8">
                                <div className="text-center">
                                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">Compound</p>
                                    <p className="text-5xl font-black text-foreground">{result.chaldean.compound}</p>
                                </div>
                                <div className="w-px h-12 bg-border/50" />
                                <div className="text-center">
                                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">Root</p>
                                    <p className="text-5xl font-black text-primary">{result.chaldean.root}</p>
                                </div>
                            </div>
                            <div className="mt-8 pt-6 border-t border-border/50">
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2 mb-3">
                                    <History size={12} className="text-primary" /> Letter Breakdown
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {result.breakdown.map((item: any, idx: number) => (
                                        <div key={idx} className="flex flex-col items-center p-2 bg-primary/5 rounded-xl border border-primary/10 min-w-[2.5rem]">
                                            <span className="text-xs font-black text-foreground">{item.char}</span>
                                            <span className="text-[10px] text-primary/70 font-bold">{item.ch}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Pythagorean System */}
                        <div className="premium-card p-8 rounded-[2.5rem] border border-border bg-card/40 backdrop-blur-md relative group hover:border-accent/30 transition-all">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-black text-accent tracking-tighter uppercase">Pythagorean System</h3>
                                <div className="p-2 bg-accent/10 rounded-lg text-accent"><CheckCircle size={16} /></div>
                            </div>
                            <div className="flex items-center gap-8">
                                <div className="text-center">
                                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">Compound</p>
                                    <p className="text-5xl font-black text-foreground">{result.pythagorean.compound}</p>
                                </div>
                                <div className="w-px h-12 bg-border/50" />
                                <div className="text-center">
                                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">Root</p>
                                    <p className="text-5xl font-black text-accent">{result.pythagorean.root}</p>
                                </div>
                            </div>
                            <div className="mt-8 pt-6 border-t border-border/50">
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2 mb-3">
                                    <History size={12} className="text-accent" /> Letter Breakdown
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {result.breakdown.map((item: any, idx: number) => (
                                        <div key={idx} className="flex flex-col items-center p-2 bg-accent/5 rounded-xl border border-accent/10 min-w-[2.5rem]">
                                            <span className="text-xs font-black text-foreground">{item.char}</span>
                                            <span className="text-[10px] text-accent/70 font-bold">{item.py}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Last 4 Digits Analysis */}
                    <div className="premium-card p-8 rounded-[2.5rem] border border-border bg-card/60 backdrop-blur-sm relative overflow-hidden group">
                        <div className="flex flex-col md:flex-row gap-8 items-center">
                            <div className="flex-shrink-0 text-center md:text-left">
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-2">Last 4 Digits</p>
                                <p className="text-4xl font-black text-foreground tracking-widest font-mono bg-muted/30 px-6 py-2 rounded-2xl">{result.last4.number}</p>
                            </div>
                            <div className="flex-grow grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                                    <p className="text-[9px] font-black text-muted-foreground uppercase mb-1">Total Sum</p>
                                    <p className="text-2xl font-black text-foreground">{result.last4.compound}</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 text-center">
                                    <p className="text-[9px] font-black text-primary uppercase mb-1">Root Number</p>
                                    <p className="text-2xl font-black text-primary">{result.last4.root}</p>
                                </div>
                            </div>
                        </div>

                        {/* Last 4 Meaning */}
                        {result.last4.meaning && (
                            <div className="mt-8 p-6 rounded-2xl bg-primary/5 border border-primary/10">
                                <div className="flex items-center gap-3 mb-3">
                                    <h4 className="text-lg font-black text-primary">{result.last4.meaning.title}</h4>
                                    <span className={`px-2 py-0.5 text-[10px] font-black uppercase rounded-full border ${result.last4.meaning.result === 'Excellent' || result.last4.meaning.result === 'Good'
                                        ? 'bg-green-500/10 text-green-500 border-green-500/20'
                                        : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                                        }`}>
                                        {result.last4.meaning.result}
                                    </span>
                                </div>
                                <p className="text-sm text-muted-foreground leading-relaxed italic opacity-80">"{result.last4.meaning.description}"</p>
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
