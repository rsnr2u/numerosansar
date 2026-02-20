"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, ShieldCheck, Key, Save, Eye, EyeOff, ShieldAlert, BadgeCheck, LogOut } from "lucide-react";
import { api } from "@/lib/api";

export default function SuperAdminProfilePage() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [visibleFields, setVisibleFields] = useState<string[]>([]);

    const [username, setUsername] = useState("");
    const [passwordData, setPasswordData] = useState({
        new_password: "",
        confirm_password: ""
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const res = await api.get("/admin/profile");
            const data = await res.json();
            setUser(data);
            setUsername(data.username || "");
        } catch (err) {
            console.error("Failed to fetch profile", err);
        } finally {
            setLoading(false);
        }
    };

    const toggleVisibility = (field: string) => {
        setVisibleFields(prev => prev.includes(field) ? prev.filter(f => f !== field) : [...prev, field]);
    };

    const handleUpdateUsername = async () => {
        setSaving(true);
        try {
            await api.post("/admin/profile/update", { username });
            fetchProfile();
            // Signal layout to update if needed (could use context/event bus in real app)
        } catch (err) {
            console.error("Failed to update username", err);
        } finally {
            setSaving(false);
        }
    };

    const handleChangePassword = async () => {
        if (!passwordData.new_password || passwordData.new_password !== passwordData.confirm_password) {
            alert("Passwords must match and not be empty");
            return;
        }
        setSaving(true);
        try {
            await api.post("/admin/profile/change-password", passwordData);
            setPasswordData({ new_password: "", confirm_password: "" });
            alert("Password updated successfully!");
        } catch (err) {
            console.error("Failed to change password", err);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-20 text-center animate-pulse font-black uppercase text-black/20 italic tracking-widest">Authenticating Identity...</div>;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter uppercase italic">Master Profile</h1>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-black/20 mt-1">Root Authority & Security Protocol</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="px-4 py-2 bg-green-500/10 text-green-600 rounded-full flex items-center gap-2 border border-green-500/20 shadow-sm">
                        <BadgeCheck size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Identity Verified</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Left Column: Identity Overview */}
                <div className="xl:col-span-1 space-y-6">
                    <div className="bg-white border-2 border-black/5 p-8 rounded-2xl shadow-2xl flex flex-col items-center text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-black/5 to-transparent"></div>

                        <div className="relative mt-8">
                            <div className="w-32 h-32 rounded-2xl bg-black flex items-center justify-center text-white text-4xl font-black shadow-2xl transform hover:rotate-6 transition-transform">
                                SA
                            </div>
                            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 border-4 border-white rounded-full flex items-center justify-center text-white shadow-lg">
                                <ShieldCheck size={20} />
                            </div>
                        </div>

                        <div className="mt-8 space-y-2">
                            <h2 className="text-3xl font-black tracking-tighter uppercase italic">{user?.username || 'Super Admin'}</h2>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-black/30">System Administrator - Root</p>
                        </div>

                        <div className="mt-12 w-full space-y-3 pt-8 border-t border-black/5">
                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest group">
                                <span className="text-black/30">Module Access</span>
                                <span className="text-black group-hover:text-green-500 transition-colors">Global (Full)</span>
                            </div>
                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest group">
                                <span className="text-black/30">Encryption Level</span>
                                <span className="text-black group-hover:text-blue-500 transition-colors">AES-256 Protocol</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Forms */}
                <div className="xl:col-span-2 space-y-8">
                    {/* Username Update */}
                    <div className="bg-white border-2 border-black/5 p-8 rounded-2xl shadow-xl space-y-8 relative overflow-hidden group">
                        <div className="absolute -top-12 -right-12 w-48 h-48 bg-slate-50 rounded-full group-hover:scale-110 transition-transform -z-1"></div>

                        <div className="flex items-center gap-4 relative">
                            <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-white shadow-lg">
                                <User size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black uppercase tracking-tight italic">Master Credentials</h3>
                                <p className="text-[10px] font-black text-black/30 uppercase tracking-widest">Update platform identity name</p>
                            </div>
                        </div>

                        <div className="space-y-4 max-w-md relative">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1">Username Authority</label>
                                <div className="flex items-center gap-3 px-5 py-4 bg-[#FAF7F2] rounded-2xl border border-black/5 group-within:border-black transition-colors">
                                    <ShieldCheck className="text-black/20" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Enter new master username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="bg-transparent border-none outline-none w-full text-xs font-black tracking-widest uppercase"
                                    />
                                </div>
                            </div>
                            <button
                                onClick={handleUpdateUsername}
                                disabled={saving}
                                className="flex items-center gap-2 px-8 py-4 bg-black text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:shadow-2xl transition-all disabled:opacity-50"
                            >
                                <Save size={16} /> Update Identity
                            </button>
                        </div>
                    </div>

                    {/* Password Change */}
                    <div className="bg-white border-2 border-black/5 p-8 rounded-2xl shadow-xl space-y-8 relative overflow-hidden group">
                        <div className="absolute -top-12 -right-12 w-48 h-48 bg-red-50/30 rounded-full group-hover:scale-110 transition-transform -z-1"></div>

                        <div className="flex items-center gap-4 relative">
                            <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-white shadow-lg">
                                <Key size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black uppercase tracking-tight italic">Security Protocol</h3>
                                <p className="text-[10px] font-black text-black/30 uppercase tracking-widest">Update master access key</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1">New Access Key</label>
                                <div className="flex items-center gap-3 px-5 py-4 bg-[#FAF7F2] rounded-2xl border border-black/5 group-within:border-black transition-colors">
                                    <Key className="text-black/20" size={18} />
                                    <input
                                        type={visibleFields.includes('new_password') ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={passwordData.new_password}
                                        onChange={(e) => setPasswordData(prev => ({ ...prev, new_password: e.target.value }))}
                                        className="bg-transparent border-none outline-none w-full text-xs font-black tracking-widest"
                                    />
                                    <button onClick={() => toggleVisibility('new_password')} className="text-black/20 hover:text-black">
                                        {visibleFields.includes('new_password') ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1">Confirm Identity</label>
                                <div className="flex items-center gap-3 px-5 py-4 bg-[#FAF7F2] rounded-2xl border border-black/5 group-within:border-black transition-colors">
                                    <ShieldAlert className="text-black/20" size={18} />
                                    <input
                                        type={visibleFields.includes('confirm_password') ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={passwordData.confirm_password}
                                        onChange={(e) => setPasswordData(prev => ({ ...prev, confirm_password: e.target.value }))}
                                        className="bg-transparent border-none outline-none w-full text-xs font-black tracking-widest"
                                    />
                                    <button onClick={() => toggleVisibility('confirm_password')} className="text-black/20 hover:text-black">
                                        {visibleFields.includes('confirm_password') ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleChangePassword}
                            disabled={saving}
                            className="flex items-center gap-2 px-8 py-4 bg-black text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:shadow-2xl transition-all disabled:opacity-50 relative"
                        >
                            <ShieldCheck size={16} /> Rotate Security Keys
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
