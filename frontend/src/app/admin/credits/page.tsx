import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, Sparkles, Plus, ArrowDownCircle, ArrowUpCircle, Clock, TrendingUp, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { ROUTES } from "@/lib/constants";
import { api } from "@/lib/api";
import BuyCreditsModal from "@/components/BuyCreditsModal";

interface Purchase {
    id: number;
    credit_type: string;
    quantity: number;
    unit_price: string;
    total_amount: string;
    status: string;
    payment_reference: string | null;
    created_at: string;
}

interface Usage {
    id: number;
    check_type: string;
    credit_type: string;
    client_id: number;
    created_at: string;
}

export default function CreditsPage() {
    const navigate = useNavigate();
    const [regularBalance, setRegularBalance] = useState(0);
    const [purchases, setPurchases] = useState<Purchase[]>([]);
    const [usage, setUsage] = useState<Usage[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showBuyModal, setShowBuyModal] = useState(false);
    const [activeTab, setActiveTab] = useState<"purchases" | "usage">("purchases");

    const fetchData = async () => {
        const token = localStorage.getItem("admin_token") || localStorage.getItem("token");
        if (!token) {
            navigate(ROUTES.ADMIN.LOGIN);
            return;
        }

        setLoading(true);
        setError("");

        try {
            const [balanceRes, historyRes] = await Promise.all([
                api.get("/admin/credits/balance"),
                api.get("/admin/credits/history", { params: { type: "all", per_page: "50" } }),
            ]);

            const balanceData = await balanceRes.json();
            const historyData = await historyRes.json();

            setRegularBalance(balanceData.balance ?? 0);
            setPurchases(historyData.purchases ?? []);
            setUsage(historyData.usage ?? []);
        } catch (err: any) {
            console.error("Failed to fetch credit data:", err);
            setError(err.message || "Failed to load credit data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handlePurchaseSuccess = () => {
        fetchData();
    };

    const totalCredits = regularBalance;
    const totalSpent = purchases
        .filter((p) => p.status === "completed")
        .reduce((sum, p) => sum + parseFloat(p.total_amount), 0);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
                <AlertCircle className="text-red-400" size={48} />
                <p className="text-red-500 font-semibold">{error}</p>
                <button onClick={fetchData} className="px-4 py-2 bg-amber-500 text-white rounded-xl text-sm font-bold">
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight">Credit Dashboard</h1>
                    <p className="text-slate-400 text-sm mt-1">Manage your analysis credits</p>
                </div>
                <button
                    onClick={() => setShowBuyModal(true)}
                    className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-[#4B2E83] to-[#6d44bd] hover:from-[#5D3AB0] hover:to-[#4B2E83] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-purple-900/10 transition-all active:scale-95"
                >
                    <Plus size={18} className="text-[#C9A227]" />
                    Buy Credits
                </button>
            </div>

            {/* Balance Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Unified Credits */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-[#4B2E83] rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl shadow-purple-900/20"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12"><CreditCard size={120} /></div>
                    <div className="relative z-10 space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-white/10 rounded-xl">
                                <Sparkles className="text-[#C9A227]" size={20} />
                            </div>
                            <div>
                                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-200/50">Available Credits</div>
                                <div className="text-[9px] text-purple-300 font-bold uppercase mt-0.5 tracking-wider">Premium Analysis Power</div>
                            </div>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-7xl font-black tracking-tighter">{regularBalance}</span>
                            <span className="text-xl font-bold text-purple-200/40 uppercase tracking-widest">CR</span>
                        </div>
                    </div>
                </motion.div>

                {/* Summary */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-3xl p-8 border border-slate-100 flex flex-col justify-between"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2.5 bg-slate-100 rounded-xl">
                            <TrendingUp className="text-slate-400" size={20} />
                        </div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Account Summary</div>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-50">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Invested</span>
                            <span className="text-2xl font-black text-slate-900">₹{totalSpent.toLocaleString("en-IN")}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Analyses</span>
                            <span className="text-2xl font-black text-slate-900">{usage.length}</span>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Tabs */}
            <div>
                <div className="flex gap-2 mb-5">
                    <button
                        onClick={() => setActiveTab("purchases")}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === "purchases"
                            ? "bg-[#4B2E83] text-white shadow-lg shadow-purple-900/10"
                            : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                            }`}
                    >
                        <ArrowDownCircle size={14} />
                        Purchase History
                    </button>
                    <button
                        onClick={() => setActiveTab("usage")}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === "usage"
                            ? "bg-violet-500 text-white shadow-lg shadow-violet-500/25"
                            : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                            }`}
                    >
                        <ArrowUpCircle size={14} />
                        Usage History
                    </button>
                </div>

                {/* Purchase History Table */}
                {activeTab === "purchases" && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm"
                    >
                        {purchases.length === 0 ? (
                            <div className="p-12 text-center">
                                <CreditCard className="mx-auto text-slate-200 mb-3" size={40} />
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">No transactions recorded</p>
                                <button
                                    onClick={() => setShowBuyModal(true)}
                                    className="mt-4 px-6 py-3 bg-[#4B2E83] text-white rounded-xl text-[10px] font-black uppercase tracking-widest"
                                >
                                    Initialize Credit Acquisition
                                </button>
                            </div>
                        ) : (
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-slate-50/50">
                                        <th className="px-8 py-4 text-left text-[9px] font-black uppercase tracking-widest text-slate-400">Date</th>
                                        <th className="px-8 py-4 text-left text-[9px] font-black uppercase tracking-widest text-slate-400">Quantity</th>
                                        <th className="px-8 py-4 text-left text-[9px] font-black uppercase tracking-widest text-slate-400">Amount</th>
                                        <th className="px-8 py-4 text-right text-[9px] font-black uppercase tracking-widest text-slate-400">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {purchases.map((p) => (
                                        <tr key={p.id} className="hover:bg-slate-50/30 transition-colors group">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                                                    <Clock size={12} className="text-slate-300" />
                                                    {new Date(p.created_at).toLocaleDateString("en-IN", {
                                                        day: "numeric", month: "short", year: "numeric",
                                                    })}
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className="text-sm font-black text-slate-900">{p.quantity} <span className="text-[10px] text-slate-300 uppercase">CR</span></span>
                                            </td>
                                            <td className="px-8 py-5 text-sm font-black text-slate-900 font-mono">₹{parseFloat(p.total_amount).toLocaleString("en-IN")}</td>
                                            <td className="px-8 py-5 text-right">
                                                <span className={`px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${p.status === "completed"
                                                    ? "bg-emerald-50 text-emerald-600"
                                                    : p.status === "pending"
                                                        ? "bg-yellow-50 text-yellow-600"
                                                        : "bg-red-50 text-red-600"
                                                    }`}>
                                                    {p.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </motion.div>
                )}

                {/* Usage History Table */}
                {activeTab === "usage" && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm"
                    >
                        {usage.length === 0 ? (
                            <div className="p-12 text-center">
                                <ArrowUpCircle className="mx-auto text-slate-200 mb-3" size={40} />
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">No activity detected</p>
                            </div>
                        ) : (
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-slate-50/50">
                                        <th className="px-8 py-4 text-left text-[9px] font-black uppercase tracking-widest text-slate-400">Date</th>
                                        <th className="px-8 py-4 text-left text-[9px] font-black uppercase tracking-widest text-slate-400">Analysis Payload</th>
                                        <th className="px-8 py-4 text-right text-[9px] font-black uppercase tracking-widest text-slate-400">Resource Drain</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {usage.map((u) => (
                                        <tr key={u.id} className="hover:bg-slate-50/30 transition-colors">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                                                    <Clock size={12} className="text-slate-300" />
                                                    {new Date(u.created_at).toLocaleDateString("en-IN", {
                                                        day: "numeric", month: "short", year: "numeric",
                                                    })}
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className="px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest bg-slate-100 text-[#4B2E83]">
                                                    {u.check_type.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 text-right font-black text-rose-500 text-xs">-1 CR</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </motion.div>
                )}
            </div>

            <BuyCreditsModal
                isOpen={showBuyModal}
                onClose={() => setShowBuyModal(false)}
                onSuccess={handlePurchaseSuccess}
            />
        </div>
    );
}
