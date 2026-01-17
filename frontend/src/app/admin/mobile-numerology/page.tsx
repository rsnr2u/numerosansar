"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Smartphone, Sparkles, ArrowLeft, History, Users, Trash2, Pencil, Calendar, PlusCircle, EyeOff, CheckCircle, Save } from "lucide-react";
import Link from "next/link";

interface Client {
    id: number;
    full_name: string;
    calling_name?: string;
    dob: string;
}

export default function MobileNumerologyPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [history, setHistory] = useState<any[]>([]);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [clientSearch, setClientSearch] = useState("");
    const [clientResults, setClientResults] = useState<Client[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [checkId, setCheckId] = useState<number | null>(null);
    const [showHistory, setShowHistory] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Derived clientId from either URL or selected state
    const currentClientId = selectedClient?.id || searchParams.get('client_id');

    useEffect(() => {
        const clientId = searchParams.get('client_id');
        if (clientId) {
            fetchClient(clientId);
            fetchHistory(clientId);
        }
    }, [searchParams]); // Re-run if URL params change

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
            const token = localStorage.getItem("admin_token");
            const res = await fetch(`http://localhost:8080/api/admin/clients/${id}`, {
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

    const searchClients = async (query: string) => {
        if (!query) { setClientResults([]); return; }
        try {
            const res = await fetch(`http://localhost:8080/api/admin/clients?search=${query}`, {
                headers: { "Authorization": `Bearer ${localStorage.getItem("admin_token")}` }
            });
            if (res.ok) setClientResults(await res.json());
        } catch (e) { console.error(e); }
    };

    const fetchHistory = async (id: string) => {
        try {
            const token = localStorage.getItem("admin_token");
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/admin/clients/${id}/history`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                const mobileHistory = data.filter((h: any) => h.type === 'Mobile').map((h: any) => ({
                    ...h,
                    chaldean_compound: h.Compound_number,
                    chaldean_root: h.total_number,
                    result: h.t_result,
                    last4_numbers: h.last_4_numbers,
                    l_result: h.l_result
                }));
                setHistory(mobileHistory);
            }
        } catch (e) {
            console.error("Failed to fetch history", e);
        }
    };

    const deleteRecord = async (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm('Are you sure you want to delete this record?')) return;

        try {
            const token = localStorage.getItem("admin_token");
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/admin/mobile-numerology/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.ok) {
                setHistory(prev => prev.filter(item => item.id !== id));
            } else {
                alert('Failed to delete record');
            }
        } catch (error) {
            console.error(error);
            alert('Error deleting record');
        }
    };

    const navigateToEdit = (item: any, e: React.MouseEvent) => {
        e.stopPropagation();
        const params = new URLSearchParams();
        if (currentClientId) params.set('client_id', String(currentClientId));
        params.set('number', item.name_value);
        params.set('edit_id', String(item.id));
        if (selectedClient?.dob) params.set('dob', selectedClient.dob);
        router.push(`/admin/mobile-numerology/analysis?${params.toString()}`);
    };

    const navigateToNew = () => {
        const params = new URLSearchParams();
        if (currentClientId) params.set('client_id', String(currentClientId));
        if (selectedClient?.dob) params.set('dob', selectedClient.dob);
        router.push(`/admin/mobile-numerology/analysis?${params.toString()}`);
    };


    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
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
                                <Smartphone size={24} />
                            </span>
                            Mobile Numerology
                        </h1>
                        <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-widest mt-1 ml-1 opacity-60">Client Analysis Records</p>
                    </div>
                </div>
                <div className="flex gap-3 items-center">
                    {/* New Analysis Button */}
                    <button
                        onClick={navigateToNew} // Changed to navigateToNew as resetAnalysis is not defined here
                        className="px-4 py-2.5 font-bold rounded-xl bg-card border border-border hover:border-primary/50 transition-all flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
                    >
                        <PlusCircle size={18} /> New Analysis
                    </button>

                    <div className="w-px h-6 bg-border mx-1" />

                    {/* The saveToBackend and related logic seems to belong to the analysis page, not this history page.
                        Keeping it commented out to avoid undefined variables and maintain current page's functionality.
                    <button
                        onClick={saveToBackend}
                        disabled={isSaving || !mobile}
                        className="px-6 py-2.5 font-black rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-all flex items-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50 text-sm uppercase tracking-wider"
                    >
                        {isSaving ? <Sparkles className="animate-spin" size={18} /> : <Save size={18} />}
                        {checkId ? 'Update' : 'Save'}
                    </button>
                    */}
                </div>
            </div>

            {/* Search Overlay / Client Display */}
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
                            placeholder="Select a client to view records..."
                            value={clientSearch}
                            onChange={(e) => { setClientSearch(e.target.value); searchClients(e.target.value); }}
                            onFocus={() => setShowDropdown(true)}
                        />
                    </div>
                )}
                {
                    showDropdown && clientResults.length > 0 && !selectedClient && (
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
                    )
                }
            </div >

            {/* History Section - Only shown if client selected */}
            {selectedClient && (
                <div className="space-y-6 pt-8 border-t border-border mt-12">
                    {/* Toggle History Button */}
                    <button
                        onClick={() => setShowHistory(!showHistory)}
                        className={`w-full py-4 rounded-2xl border-2 border-dashed flex items-center justify-center gap-3 font-black text-xs uppercase tracking-widest transition-all ${showHistory ? 'bg-primary/5 border-primary/30 text-primary' : 'bg-muted/10 border-border hover:border-primary/30 text-muted-foreground hover:text-primary'}`}
                    >
                        {showHistory ? <><EyeOff size={16} /> Hide Saved Records</> : <><History size={16} /> Show Saved Records ({history.length})</>}
                    </button>

                    {showHistory && history.length > 0 ? (
                        <div className="premium-card p-6 rounded-[2rem] border border-border bg-card/60 backdrop-blur-md">
                            <h2 className="text-xl font-black text-foreground mb-6 flex items-center gap-3 tracking-tight">
                                <span className="p-2 bg-blue-500/10 rounded-xl text-blue-500"><History size={20} /></span>
                                Saved Records
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin">
                                {history.map((record: any) => (
                                    <button
                                        key={record.id}
                                        onClick={(e) => navigateToEdit(record, e)}
                                        className="w-full text-left p-4 rounded-2xl border bg-muted/30 border-border/50 transition-all flex items-center justify-between group hover:border-blue-500/50"
                                    >
                                        <div className="flex flex-col">
                                            <span className="font-bold text-foreground group-hover:text-blue-500 transition-colors uppercase tracking-tight">{record.mobile_number}</span>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">{record.chaldean_compound} / {record.chaldean_root}</span>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        showHistory && selectedClient && (
                            <div className="text-center py-20 bg-card/20 rounded-3xl border border-dashed border-border opacity-50">
                                <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">No mobile records for this client</p>
                            </div>
                        )
                    )}
                </div>
            )}
        </div>
    );
}
