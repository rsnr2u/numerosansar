"use client";

import { useState, useEffect } from "react";
import {
    Users,
    UserPlus,
    Shield,
    Trash2,
    Edit2,
    Search,
    User,
    X,
    Check
} from "lucide-react";
import { api } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";

interface UserData {
    id: number;
    username: string;
    role: string;
}

export default function UsersManagement() {
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState<Partial<UserData> | null>(null);
    const [password, setPassword] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await api.get("/admin/users");
            const data = await res.json();
            if (Array.isArray(data)) {
                setUsers(data);
            }
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const payload = {
                username: currentUser?.username,
                role: currentUser?.role,
                ...(password ? { password } : {})
            };

            const url = currentUser?.id
                ? `/admin/users/${currentUser.id}`
                : "/admin/users";
            const method = currentUser?.id ? "PUT" : "POST";

            const res = await (method === "PUT" ? api.put(url, payload) : api.post(url, payload));

            if (res.ok) {
                setIsModalOpen(false);
                setCurrentUser(null);
                setPassword("");
                fetchUsers();
            }
        } catch (error) {
            console.error("Failed to save user", error);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this user?")) return;
        try {
            const res = await api.delete(`/admin/users/${id}`);
            if (res.ok) {
                fetchUsers();
            }
        } catch (error) {
            console.error("Failed to delete user", error);
        }
    };

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                        User Management
                    </h1>
                    <p className="text-muted-foreground">Manage numerologists and system access</p>
                </div>
                <button
                    onClick={() => {
                        setCurrentUser({ role: 'numerologist' });
                        setIsModalOpen(true);
                    }}
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl font-bold hover:bg-primary/90 transition-all transform active:scale-95 shadow-lg w-fit"
                >
                    <UserPlus size={18} />
                    Add Numerologist
                </button>
            </div>

            <div className="glass-card rounded-3xl p-6 border border-border shadow-xl">
                <div className="relative mb-6">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-background/50 border border-border rounded-2xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                </div>

                <div className="overflow-x-auto rounded-xl">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-border text-muted-foreground uppercase text-xs tracking-widest font-bold">
                                <th className="px-4 py-4">User</th>
                                <th className="px-4 py-4">Role</th>
                                <th className="px-4 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {loading ? (
                                <tr><td colSpan={3} className="text-center py-10">Loading users...</td></tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr><td colSpan={3} className="text-center py-10 text-muted-foreground">No users found</td></tr>
                            ) : filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                                    <td className="px-4 py-4 font-medium">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                                <User size={20} />
                                            </div>
                                            {user.username}
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${user.role === 'super_admin'
                                            ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                                            : 'bg-green-500/10 text-green-500 border border-green-500/20'
                                            }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 text-right space-x-2">
                                        <button
                                            onClick={() => {
                                                setCurrentUser(user);
                                                setIsModalOpen(true);
                                            }}
                                            className="p-2 hover:bg-primary/10 rounded-lg text-primary transition-colors"
                                            title="Edit User"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(user.id)}
                                            className="p-2 hover:bg-destructive/10 rounded-lg text-destructive transition-colors"
                                            title="Delete User"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => setIsModalOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-card w-full max-w-md rounded-3xl p-8 border border-border shadow-2xl relative z-10"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold">
                                    {currentUser?.id ? "Edit User" : "Add Numerologist"}
                                </h2>
                                <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSave} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Username</label>
                                    <input
                                        type="text"
                                        value={currentUser?.username || ""}
                                        onChange={(e) => setCurrentUser({ ...currentUser, username: e.target.value })}
                                        className="w-full bg-background border border-border rounded-xl px-4 py-2 focus:border-primary outline-none"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Role</label>
                                    <select
                                        value={currentUser?.role || "numerologist"}
                                        onChange={(e) => setCurrentUser({ ...currentUser, role: e.target.value })}
                                        className="w-full bg-background border border-border rounded-xl px-4 py-2 focus:border-primary outline-none"
                                    >
                                        <option value="numerologist">Numerologist</option>
                                        <option value="super_admin">Super Admin</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs uppercase tracking-widest text-muted-foreground font-bold">
                                        Password {currentUser?.id && "(Leave blank to keep current)"}
                                    </label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-background border border-border rounded-xl px-4 py-2 focus:border-primary outline-none"
                                        required={!currentUser?.id}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 mt-6 shadow-lg shadow-primary/20"
                                >
                                    {saving ? "Saving..." : (
                                        <>
                                            <Check size={18} />
                                            {currentUser?.id ? "Update User" : "Create Account"}
                                        </>
                                    )}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
