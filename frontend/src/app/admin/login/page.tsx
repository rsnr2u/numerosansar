"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, User, Sparkles } from "lucide-react";

export default function AdminLogin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await fetch("http://localhost:8080/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("admin_token", data.token);
                router.push("/admin/dashboard");
            } else {
                setError(data.messages?.error || data.message || "Invalid credentials");
            }
        } catch (err) {
            setError("Connection failed. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen relative flex items-center justify-center p-4">
            <div
                className="fixed inset-0 z-0 opacity-30 shadow-inner"
                style={{ backgroundImage: "url('/mystic-bg.png')", backgroundSize: 'cover' }}
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="z-10 w-full max-w-md glass-card rounded-3xl p-8 md:p-12 border border-border"
            >
                <div className="text-center mb-8">
                    <div className="inline-block p-4 bg-primary/10 rounded-full mb-4">
                        <Lock className="text-primary w-8 h-8" />
                    </div>
                    <h2 className="text-3xl font-bold">Sanctum Access</h2>
                    <p className="text-muted-foreground text-sm mt-2">Admin Portal Login</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-muted-foreground font-bold block ml-1">Username</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-input/50 border border-border rounded-xl py-3 pl-12 pr-4 focus:border-accent outline-none transition-all text-foreground"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-muted-foreground font-bold block ml-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-input/50 border border-border rounded-xl py-3 pl-12 pr-4 focus:border-accent outline-none transition-all text-foreground"
                                required
                            />
                        </div>
                    </div>

                    {error && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-destructive text-sm text-center bg-destructive/10 py-2 rounded-lg"
                        >
                            {error}
                        </motion.p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-all transform active:scale-95 disabled:opacity-50 shadow-lg"
                    >
                        {loading ? "Decrypting..." : "Enter Portal"}
                    </button>
                </form>

                <div className="mt-8 pt-8 border-t border-border text-center">
                    <button
                        onClick={() => router.push("/")}
                        className="text-muted-foreground hover:text-primary text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2 mx-auto"
                    >
                        <Sparkles size={12} /> Return to Universe
                    </button>
                </div>
            </motion.div>
        </main>
    );
}
