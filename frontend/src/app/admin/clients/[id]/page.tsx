"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { User, Phone, Briefcase, Car, ArrowLeft, Star, Edit, MapPin, Mail, Smartphone, Save, X, Calendar, UserCheck, Grid } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";

export default function ClientDashboardPage() {
    const params = useParams();
    const router = useRouter();
    const [client, setClient] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [history, setHistory] = useState<any[]>([]);

    useEffect(() => {
        if (params.id) {
            fetchClientDetails(params.id as string);
        }
    }, [params.id]);

    const fetchClientDetails = async (id: string) => {
        try {
            const res = await api.get(`/admin/clients/${id}`);
            const data = await res.json();
            if (res.ok) {
                setClient(data);
                fetchHistory(id);
            }
        } catch (err) {
            console.error("Error", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchHistory = async (id: string) => {
        try {
            const res = await api.get(`/admin/clients/${id}/history`);
            if (res.ok) {
                const data = await res.json();
                setHistory(data);
            }
        } catch (e) {
            console.error("Failed to fetch history", e);
        }
    };

    if (loading) return <div className="text-center py-20 text-gray-400 animate-pulse">Loading profile...</div>;
    if (!client) return <div className="text-center py-20 text-red-400">Client not found</div>;

    const confirmedName = history.find(h => h.type === 'Name' && h.is_confirmed == 1)?.name_value;
    const confirmedBiz = history.find(h => h.type === 'Business' && h.is_confirmed == 1)?.name_value;
    const confirmedMobile = history.find(h => h.type === 'Mobile' && h.is_confirmed == 1)?.name_value;
    const confirmedVehicle = history.find(h => h.type === 'Vehicle' && h.is_confirmed == 1)?.name_value;

    const services = [
        {
            title: "Name Numerology",
            desc: "Analyze full name and calling name compatibility.",
            icon: <User size={24} className="text-blue-500" />,
            path: `/admin/check?dob=${client.dob}&client_id=${client.id}`,
            color: "bg-blue-500/10 border-blue-500/20 hover:border-blue-500/50"
        },
        {
            title: "Business Name",
            desc: "Check business name suitability for this client.",
            icon: <Briefcase size={24} className="text-accent" />,
            path: `/admin/business-numerology?dob=${client.dob}&business_name=${encodeURIComponent(confirmedBiz || '')}&client_id=${client.id}`,
            color: "bg-accent/10 border-accent/20 hover:border-accent/50"
        },
        {
            title: "Mobile Numerology",
            desc: "Analyze mobile number vibrations.",
            icon: <Smartphone size={24} className="text-green-500" />,
            path: `/admin/mobile-numerology?number=${confirmedMobile || client.mobile_number}&client_id=${client.id}`,
            color: "bg-green-500/10 border-green-500/20 hover:border-green-500/50"
        },
        {
            title: "Vehicle Numerology",
            desc: "Check lucky vehicle numbers.",
            icon: <Car size={24} className="text-purple-500" />,
            path: `/admin/vehicle-numerology?dob=${client.dob}&vehicle=${encodeURIComponent(confirmedVehicle || '')}&client_id=${client.id}`,
            color: "bg-purple-500/10 border-purple-500/20 hover:border-purple-500/50"
        },
        {
            title: "Lo Shu Grid",
            desc: "Ancient Chinese magic square analysis.",
            icon: <Grid size={24} className="text-slate-700" />,
            path: `/admin/clients/${client.id}/lo-shu-grid`,
            color: "bg-slate-700/5 border-slate-700/10 hover:border-slate-700/30"
        }
    ];

    return (
        <div className="container mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/clients">
                        <button className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors text-foreground">
                            <ArrowLeft size={20} />
                        </button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-primary">
                            {client.full_name}
                        </h1>
                        <p className="text-muted-foreground flex items-center gap-2">
                            <span className="bg-accent/20 text-accent px-2 py-0.5 rounded text-xs font-medium">
                                {confirmedName || "Client"}
                            </span>
                            <span>• {new Date(client.dob).toLocaleDateString()}</span>
                        </p>
                    </div>
                </div>

                <div className="flex gap-2">
                    {typeof window !== 'undefined' && localStorage.getItem('user_role') === 'super_admin' && (
                        <Link
                            href={`/admin/clients/${client.id}/edit`}
                            className="flex items-center gap-2 bg-primary/10 text-primary hover:bg-primary/20 px-4 py-2 rounded-xl transition-all font-bold border border-primary/20"
                        >
                            <Edit size={18} /> Edit Profile
                        </Link>
                    )}
                </div>
            </div>

            {/* Profile & Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Contact Info */}
                <div className="bg-white p-6 rounded-3xl border border-black/5 space-y-4 shadow-xl relative overflow-hidden">
                    <h3 className="text-xs font-black text-black uppercase tracking-widest pl-1">Contact Details</h3>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-white border border-black/5 flex items-center justify-center text-black shadow-sm">
                                <Phone size={16} />
                            </div>
                            <span className="text-[#2D2926] text-sm font-medium">{client.mobile_number || "N/A"}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-white border border-black/5 flex items-center justify-center text-black shadow-sm">
                                <Mail size={16} />
                            </div>
                            <span className="text-[#2D2926] text-sm font-medium">{client.email_id || "N/A"}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-white border border-black/5 flex items-center justify-center text-black shadow-sm">
                                <MapPin size={16} />
                            </div>
                            <span className="text-[#2D2926] text-sm font-medium truncate">{client.city || "N/A"}, {client.state}</span>
                        </div>
                    </div>
                </div>

                {/* Final Selections */}
                <div className="md:col-span-2 bg-white p-6 rounded-3xl border border-black/5 shadow-xl relative overflow-hidden">
                    <h3 className="text-xs font-black text-black uppercase tracking-widest mb-4 pl-1">Confirmed Selections</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
                            <p className="text-[10px] uppercase font-black text-blue-500 mb-1">Calling Name</p>
                            <p className="font-bold text-lg text-[#2D2926]">{confirmedName || "Not Confirmed"}</p>
                        </div>
                        <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10">
                            <p className="text-[10px] uppercase font-black text-amber-500 mb-1">Business Name</p>
                            <p className="font-bold text-lg text-[#2D2926]">{confirmedBiz || "Not Confirmed"}</p>
                        </div>
                        <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/10">
                            <p className="text-[10px] uppercase font-black text-green-500 mb-1">Mobile Number</p>
                            <p className="font-bold text-lg text-[#2D2926]">{confirmedMobile || "Not Confirmed"}</p>
                        </div>
                        <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/10">
                            <p className="text-[10px] uppercase font-black text-purple-500 mb-1">Vehicle Number</p>
                            <p className="font-bold text-lg text-[#2D2926]">{confirmedVehicle || "Not Confirmed"}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {services.map((service, idx) => (
                    <Link href={service.path} key={idx} className={`bg-white p-6 rounded-3xl border border-black/5 shadow-lg transition-all group hover:shadow-2xl hover:-translate-y-1 ${service.color}`}>
                        <div className="mb-4">{service.icon}</div>
                        <h3 className="text-lg font-black text-[#2D2926] mb-2 tracking-tight">
                            {service.title}
                        </h3>
                        <p className="text-xs text-[#2D2926]/60 font-medium group-hover:text-[#2D2926]/80">
                            {service.desc}
                        </p>
                    </Link>
                ))}
            </div>

            {/* History Section */}
            <ClientHistorySection clientId={client.id} clientDob={client.dob} initialHistory={history} onRefresh={() => fetchHistory(client.id)} />
        </div>
    );
}

// Sub-component for History to keep main clean
function ClientHistorySection({ clientId, clientDob, initialHistory, onRefresh }: { clientId: number, clientDob: string, initialHistory: any[], onRefresh: () => void }) {
    const [history, setHistory] = useState<any[]>(initialHistory);
    const [activeTab, setActiveTab] = useState<"Name" | "Business" | "Mobile" | "Vehicle" | "Confirmed">("Name");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setHistory(initialHistory);
    }, [initialHistory]);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            await onRefresh();
        } finally {
            setLoading(false);
        }
    };

    // Derived Data
    const nameChecks = history.filter(h => h.type === 'Name');
    const bizChecks = history.filter(h => h.type === 'Business');
    const mobileChecks = history.filter(h => h.type === 'Mobile');
    const vehicleChecks = history.filter(h => h.type === 'Vehicle');
    const confirmedChecks = history.filter(h => h.is_confirmed == 1);

    const filtered = activeTab === 'Confirmed' ? confirmedChecks :
        activeTab === 'Name' ? nameChecks :
            activeTab === 'Business' ? bizChecks :
                activeTab === 'Mobile' ? mobileChecks : vehicleChecks;

    return (
        <div className="space-y-6 pt-8 border-t border-border">
            <h2 className="text-2xl font-bold">Numerology History</h2>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-black/5 shadow-md">
                    <p className="text-[10px] uppercase text-black font-black tracking-widest">Names</p>
                    <p className="text-2xl font-black mt-1 text-blue-500">{nameChecks.length}</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-black/5 shadow-md">
                    <p className="text-[10px] uppercase text-black font-black tracking-widest">Business</p>
                    <p className="text-2xl font-black mt-1 text-[#B91C1C]">{bizChecks.length}</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-black/5 shadow-md">
                    <p className="text-[10px] uppercase text-black font-black tracking-widest">Mobile</p>
                    <p className="text-2xl font-black mt-1 text-green-500">{mobileChecks.length}</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-black/5 shadow-md">
                    <p className="text-[10px] uppercase text-black font-black tracking-widest">Vehicle</p>
                    <p className="text-2xl font-black mt-1 text-purple-500">{vehicleChecks.length}</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-black/5 shadow-md">
                    <p className="text-[10px] uppercase text-black font-black tracking-widest">Confirmed</p>
                    <p className="text-2xl font-black mt-1 text-[#2D2926]">{confirmedChecks.length}</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap bg-[#F3EFE9] p-1 rounded-xl w-fit gap-1">
                {(['Name', 'Business', 'Mobile', 'Vehicle', 'Confirmed'] as const).map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-2 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === tab
                            ? 'bg-white text-black shadow-sm'
                            : 'text-[#2D2926]/40 hover:text-[#2D2926]'}`}
                    >
                        {tab === 'Confirmed' ? 'Final Choices' : `${tab}`}
                    </button>
                ))}
            </div>

            {/* Table */}
            <div className="bg-white border border-black/5 rounded-3xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted text-xs uppercase text-muted-foreground font-bold">
                            <tr>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4">Name Checked</th>
                                <th className="px-6 py-4 text-center">Chaldean</th>
                                <th className="px-6 py-4 text-center">Pythagorean</th>
                                <th className="px-6 py-4">Result</th>
                                <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">
                                        No records found.
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((item) => (
                                    <tr key={item.id} className="hover:bg-muted/50 transition-colors">
                                        <td className="px-6 py-4 text-muted-foreground font-mono text-xs">
                                            {new Date(item.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${item.type === 'Name' ? 'bg-blue-500/10 text-blue-500' :
                                                item.type === 'Business' ? 'bg-orange-500/10 text-orange-500' :
                                                    item.type === 'Mobile' ? 'bg-green-500/10 text-green-500' :
                                                        'bg-purple-500/10 text-purple-500'
                                                }`}>
                                                {item.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-foreground">
                                            {item.name_value}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="font-bold text-lg text-accent">{item.chaldean_compound}</span>
                                            <span className="text-xs text-muted-foreground ml-1">({item.chaldean_root})</span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="font-bold text-lg text-blue-500">{item.pythagorean_compound}</span>
                                            <span className="text-xs text-muted-foreground ml-1">({item.pythagorean_root})</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                {(item.chaldean_result || item.result) && (
                                                    <span className={`px-2 py-1 rounded text-[10px] font-bold text-center w-full ${(item.chaldean_result || item.result || '').includes('Excellent') || (item.chaldean_result || item.result || '').includes('Super') ? 'bg-green-500/10 text-green-500' :
                                                        (item.chaldean_result || item.result || '').includes('Good') ? 'bg-yellow-500/10 text-yellow-500' :
                                                            'bg-red-500/10 text-red-500'
                                                        }`}>
                                                        {item.chaldean_result || item.result}
                                                    </span>
                                                )}
                                                {item.pythagorean_result && (
                                                    <span className={`px-2 py-1 rounded text-[10px] font-bold text-center w-full ${item.pythagorean_result.includes('Excellent') || item.pythagorean_result.includes('Super') ? 'bg-green-500/10 text-green-500' :
                                                        item.pythagorean_result.includes('Good') ? 'bg-yellow-500/10 text-yellow-500' :
                                                            'bg-red-500/10 text-red-500'
                                                        }`}>
                                                        {item.pythagorean_result}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right flex justify-end gap-2 items-center">
                                            {typeof window !== 'undefined' && localStorage.getItem('user_role') === 'super_admin' && (
                                                <a
                                                    href={item.type === 'Name'
                                                        ? `/admin/check?name=${encodeURIComponent(item.name_value)}&dob=${clientDob}&client_id=${clientId}&check_id=${item.id}`
                                                        : item.type === 'Business'
                                                            ? `/admin/business-numerology?business_name=${encodeURIComponent(item.name_value)}&dob=${clientDob}&client_id=${clientId}&check_id=${item.id}`
                                                            : item.type === 'Mobile'
                                                                ? `/admin/mobile-numerology/analysis?number=${encodeURIComponent(item.name_value)}&dob=${clientDob}&client_id=${clientId}&edit_id=${item.id}`
                                                                : `/admin/vehicle-numerology?vehicle=${encodeURIComponent(item.name_value)}&dob=${clientDob}&client_id=${clientId}&check_id=${item.id}`
                                                    }
                                                    target="_blank"
                                                    className="px-3 py-1 bg-muted hover:bg-muted/80 rounded text-[10px] font-bold uppercase tracking-wider text-foreground transition-colors"
                                                >
                                                    Edit
                                                </a>
                                            )}
                                            {item.is_confirmed == 1 ? (
                                                <span className="flex items-center gap-1 text-green-500 font-bold text-xs uppercase">
                                                    <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center text-black">✓</div>
                                                </span>
                                            ) : null}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

