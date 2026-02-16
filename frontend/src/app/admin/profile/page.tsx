"use client";

import { useState, useEffect } from "react";
import { User, Lock, Save } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminProfile() {
    const [user, setUser] = useState<any>({});
    const [passwords, setPasswords] = useState({ new_password: '', confirm_password: '' });
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        const token = localStorage.getItem("admin_token");
        if (!token) return router.push("/admin/login");

        try {
            const res = await fetch("http://localhost:8080/api/admin/profile", {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.status === 401) return router.push("/admin/login");
            const data = await res.json();
            setUser(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async () => {
        const token = localStorage.getItem("admin_token");
        try {
            const res = await fetch("http://localhost:8080/api/admin/profile", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ username: user.username })
            });
            if (res.ok) alert("Profile updated!");
        } catch (e) {
            console.error(e);
        }
    };

    const handleChangePassword = async () => {
        if (passwords.new_password !== passwords.confirm_password) {
            alert("Passwords do not match");
            return;
        }
        if (passwords.new_password.length < 6) {
            alert("Password too short");
            return;
        }

        const token = localStorage.getItem("admin_token");
        try {
            const res = await fetch("http://localhost:8080/api/admin/change-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(passwords)
            });
            const data = await res.json();
            if (res.ok) {
                alert("Password changed successfully");
                setPasswords({ new_password: '', confirm_password: '' });
            } else {
                alert(data.messages?.error || "Failed to change password");
            }
        } catch (e) {
            console.error(e);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
                <User size={24} /> Admin Profile
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Profile Details */}
                <div className="glass-card p-8 rounded-3xl space-y-6">
                    <h2 className="text-xl font-bold border-b border-border pb-4">Personal Details</h2>
                    <div>
                        <label className="text-xs uppercase tracking-widest text-muted-foreground block mb-2 font-bold">Username</label>
                        <input
                            value={user.username || ''}
                            readOnly
                            className="w-full bg-input/50 border border-border rounded-xl p-2 outline-none text-muted-foreground cursor-not-allowed"
                        />
                    </div>
                    <div>
                        <label className="text-xs uppercase tracking-widest text-muted-foreground block mb-2 font-bold">Role</label>
                        <input
                            value="Administrator"
                            disabled
                            className="w-full bg-input/50 border border-border rounded-xl p-2 outline-none text-muted-foreground cursor-not-allowed"
                        />
                    </div>
                    <button onClick={handleUpdateProfile} className="bg-astro-gradient text-white font-bold px-6 py-2 rounded-xl hover:opacity-90 transition-all flex items-center gap-2 shadow-md">
                        <Save size={16} /> Update Profile
                    </button>
                </div>

                {/* Change Password */}
                <div className="glass-card p-8 rounded-3xl space-y-6">
                    <h2 className="text-xl font-bold border-b border-border pb-4 flex items-center gap-2">
                        <Lock size={20} /> Change Password
                    </h2>
                    <div>
                        <label className="text-xs uppercase tracking-widest text-muted-foreground block mb-2 font-bold">New Password</label>
                        <input
                            type="password"
                            value={passwords.new_password}
                            onChange={(e) => setPasswords({ ...passwords, new_password: e.target.value })}
                            className="w-full bg-input/50 border border-border rounded-xl p-2 outline-none text-foreground focus:border-accent transition-colors"
                        />
                    </div>
                    <div>
                        <label className="text-xs uppercase tracking-widest text-muted-foreground block mb-2 font-bold">Confirm Password</label>
                        <input
                            type="password"
                            value={passwords.confirm_password}
                            onChange={(e) => setPasswords({ ...passwords, confirm_password: e.target.value })}
                            className="w-full bg-input/50 border border-border rounded-xl p-2 outline-none text-foreground focus:border-accent transition-colors"
                        />
                    </div>
                    <button onClick={handleChangePassword} className="bg-astro-gradient text-white font-bold px-6 py-2 rounded-xl hover:opacity-90 transition-all flex items-center gap-2 shadow-md">
                        <Lock size={16} /> Update Password
                    </button>
                </div>
            </div>
        </div>
    );
}
