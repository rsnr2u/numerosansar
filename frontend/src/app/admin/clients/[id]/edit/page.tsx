"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { User, Phone, ArrowLeft, Save, X, Calendar, UserCheck, Mail, MapPin } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";

export default function EditClientPage() {
    const params = useParams();
    const router = useRouter();
    const [client, setClient] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [formData, setFormData] = useState<any>(null);

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
                setFormData(data);
            }
        } catch (err) {
            console.error("Error", err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setUpdating(true);
        try {
            const res = await api.put(`/admin/clients/${client.id}`, formData);
            if (res.ok) {
                router.push(`/admin/clients/${client.id}`);
            } else {
                const data = await res.json();
                alert(data.message || "Failed to update profile");
            }
        } catch (err) {
            console.error(err);
            alert("Error updating profile");
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return <div className="text-center py-20 text-gray-400 animate-pulse">Loading profile...</div>;
    if (!client) return <div className="text-center py-20 text-red-400">Client not found</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href={`/admin/clients/${client.id}`}>
                    <button className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors text-foreground">
                        <ArrowLeft size={20} />
                    </button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-primary">
                        Edit Profile
                    </h1>
                    <p className="text-muted-foreground">Modify details for {client.full_name}</p>
                </div>
            </div>

            <div className="glass-card p-8 rounded-3xl border border-border bg-card shadow-xl">
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Basic Info */}
                        <div className="space-y-2">
                            <label className="text-xs uppercase font-bold text-muted-foreground ml-1">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                                <input
                                    type="text"
                                    value={formData?.full_name || ""}
                                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                    className="w-full bg-input/50 border border-border rounded-xl py-2.5 pl-10 pr-4 outline-none focus:border-accent transition-all text-foreground"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs uppercase font-bold text-muted-foreground ml-1">Calling Name</label>
                            <div className="relative">
                                <UserCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                                <input
                                    type="text"
                                    value={formData?.calling_name || ""}
                                    onChange={(e) => setFormData({ ...formData, calling_name: e.target.value })}
                                    className="w-full bg-input/50 border border-border rounded-xl py-2.5 pl-10 pr-4 outline-none focus:border-accent transition-all text-foreground"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs uppercase font-bold text-muted-foreground ml-1">Date of Birth</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                                <input
                                    type="date"
                                    value={formData?.dob || ""}
                                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                                    className="w-full bg-input/50 border border-border rounded-xl py-2.5 pl-10 pr-4 outline-none focus:border-accent transition-all text-foreground"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs uppercase font-bold text-muted-foreground ml-1">Gender</label>
                            <select
                                value={formData?.gender || ""}
                                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                className="w-full bg-input/50 border border-border rounded-xl py-2.5 px-4 outline-none focus:border-accent transition-all text-foreground"
                            >
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-2">
                            <label className="text-xs uppercase font-bold text-muted-foreground ml-1">Mobile Number</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                                <input
                                    type="text"
                                    value={formData?.mobile_number || ""}
                                    onChange={(e) => setFormData({ ...formData, mobile_number: e.target.value })}
                                    className="w-full bg-input/50 border border-border rounded-xl py-2.5 pl-10 pr-4 outline-none focus:border-accent transition-all text-foreground"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs uppercase font-bold text-muted-foreground ml-1">Email ID</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                                <input
                                    type="email"
                                    value={formData?.email_id || ""}
                                    onChange={(e) => setFormData({ ...formData, email_id: e.target.value })}
                                    className="w-full bg-input/50 border border-border rounded-xl py-2.5 pl-10 pr-4 outline-none focus:border-accent transition-all text-foreground"
                                />
                            </div>
                        </div>

                        {/* Location */}
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-xs uppercase font-bold text-muted-foreground ml-1">Address</label>
                            <textarea
                                value={formData?.address || ""}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                className="w-full bg-input/50 border border-border rounded-xl py-2.5 px-4 outline-none focus:border-accent transition-all h-24 text-foreground"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs uppercase font-bold text-muted-foreground ml-1">City</label>
                            <input
                                type="text"
                                value={formData?.city || ""}
                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                className="w-full bg-input/50 border border-border rounded-xl py-2.5 px-4 outline-none focus:border-accent transition-all text-foreground"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs uppercase font-bold text-muted-foreground ml-1">State</label>
                            <input
                                type="text"
                                value={formData?.state || ""}
                                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                className="w-full bg-input/50 border border-border rounded-xl py-2.5 px-4 outline-none focus:border-accent transition-all text-foreground"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs uppercase font-bold text-muted-foreground ml-1">Pincode</label>
                            <input
                                type="text"
                                value={formData?.pincode || ""}
                                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                                className="w-full bg-input/50 border border-border rounded-xl py-2.5 px-4 outline-none focus:border-accent transition-all text-foreground"
                            />
                        </div>
                    </div>

                    <div className="pt-8 border-t border-border flex justify-end gap-3">
                        <Link href={`/admin/clients/${client.id}`}>
                            <button
                                type="button"
                                className="px-8 py-2.5 rounded-xl text-muted-foreground font-bold hover:bg-muted transition-colors"
                            >
                                Cancel
                            </button>
                        </Link>
                        <button
                            type="submit"
                            disabled={updating}
                            className="px-10 py-2.5 bg-primary text-primary-foreground rounded-xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-all shadow-lg active:scale-95 disabled:opacity-50"
                        >
                            {updating ? "Saving..." : <><Save size={18} /> Save Changes</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
