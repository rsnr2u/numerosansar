"use client";

import { useState, useEffect } from "react";
import { Plus, Search, User, Phone, Mail, MapPin, Trash2, Edit, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function ClientsPage() {
    const router = useRouter();
    const [clients, setClients] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    useEffect(() => {
        fetchClients();
    }, [debouncedSearch]);

    const fetchClients = async () => {
        setLoading(true);
        try {
            const res = await api.get("/admin/clients", {
                params: debouncedSearch ? { search: debouncedSearch } : undefined
            });
            const data = await res.json();
            if (res.ok) {
                setClients(Array.isArray(data) ? data : []);
            }
        } catch (err) {
            console.error("Failed to fetch clients", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this client?")) return;

        try {
            const res = await api.delete(`/admin/clients/${id}`);
            if (res.ok) {
                fetchClients();
            }
        } catch (err) {
            console.error("Delete failed", err);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-primary">
                        Client Management
                    </h1>
                    <p className="text-sm text-muted-foreground font-medium">Manage your profiles and perform numerology checks.</p>
                </div>
                <Link href="/admin/clients/add">
                    <button className="flex items-center gap-2 bg-[hsl(var(--primary))] text-white px-4 py-2 rounded-lg font-bold hover:opacity-90 transition-all shadow-md text-sm">
                        <Plus size={18} />
                        Add New Client
                    </button>
                </Link>
            </div>

            {/* Search Bar */}
            <div className="glass-card p-3 rounded-xl border border-border flex items-center gap-3 bg-card shadow-inner">
                <Search className="text-muted-foreground" size={18} />
                <input
                    type="text"
                    placeholder="Search by name, mobile, email..."
                    className="bg-transparent text-foreground w-full focus:outline-none placeholder:text-muted-foreground text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Client List */}
            {loading ? (
                <div className="text-center py-20 text-muted-foreground animate-pulse">Loading clients...</div>
            ) : clients.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground">
                    No clients found. Add one to get started.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {clients.map((client) => (
                        <div key={client.id} className="glass-card p-4 rounded-xl border border-border hover:border-accent/30 transition-all group relative bg-card h-full">
                            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                <button onClick={(e) => { e.preventDefault(); handleDelete(client.id); }} className="p-1.5 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20 transition-colors">
                                    <Trash2 size={14} />
                                </button>
                            </div>

                            <Link href={`/admin/clients/${client.id}`} className="block">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 flex-shrink-0 rounded-full border border-[hsl(var(--primary))] bg-[hsl(var(--primary))]/10 flex items-center justify-center text-[hsl(var(--primary))] font-bold text-lg">
                                        {client.full_name?.charAt(0)}
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="text-base font-bold group-hover:text-accent transition-colors truncate">
                                            {client.full_name}
                                        </h3>
                                        <p className="text-[10px] text-muted-foreground truncate uppercase tracking-widest font-black opacity-60">{client.calling_name}</p>
                                    </div>
                                </div>

                                <div className="space-y-2 text-sm text-muted-foreground">
                                    {client.mobile_number && (
                                        <div className="flex items-center gap-2">
                                            <Phone size={14} className="text-muted-foreground" />
                                            {client.mobile_number}
                                        </div>
                                    )}
                                    {client.email_id && (
                                        <div className="flex items-center gap-2">
                                            <Mail size={14} className="text-muted-foreground" />
                                            {client.email_id}
                                        </div>
                                    )}
                                    {client.city && (
                                        <div className="flex items-center gap-2">
                                            <MapPin size={14} className="text-muted-foreground" />
                                            {client.city}, {client.state}
                                        </div>
                                    )}
                                </div>

                                <div className="mt-4 pt-4 border-t border-border flex justify-end text-accent text-sm font-medium items-center gap-1">
                                    View Dashboard <ChevronRight size={16} />
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
