import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
    Mail,
    Phone,
    MessageSquare,
    Clock,
    Send,
    Video,
    BookOpen,
    HelpCircle,
    Search,
    LayoutDashboard,
    ChevronDown,
    ArrowRight,
    PlayCircle,
    Zap,
    ShieldCheck,
    Globe
} from "lucide-react";

export default function SupportPage() {
    const [mounted, setMounted] = useState(false);
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        message: ""
    });

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const helpTopics = [
        {
            title: "Getting Started",
            description: "Learn how to create your first client profile and run numerology analysis.",
            icon: <PlayCircle size={24} />,
            color: "text-[#4B2E83]",
            bg: "bg-[#4B2E83]/5"
        },
        {
            title: "Using Credits",
            description: "Understand how credits work for performing client analyses.",
            icon: <Zap size={24} />,
            color: "text-[#C9A227]",
            bg: "bg-[#C9A227]/5"
        },
        {
            title: "Running Name Analysis",
            description: "Step-by-step guidance on performing name astrology analysis.",
            icon: <Search size={24} />,
            color: "text-[#4B2E83]",
            bg: "bg-[#4B2E83]/5"
        },
        {
            title: "Consultation Insights",
            description: "How to view and interpret numerology insights in the system.",
            icon: <LayoutDashboard size={24} />,
            color: "text-[#C9A227]",
            bg: "bg-[#C9A227]/5"
        }
    ];

    const faqs = [
        {
            q: "How does the credit system work?",
            a: "Each credit allows you to perform one client numerology analysis using the software. This includes a full suite of analyses including Name, Business, Mobile, and Vehicle numerology for that specific client record."
        },
        {
            q: "Do credits expire?",
            a: "Credits purchased on NUMERO SANSAR remain available in your account until they are used. There is no time limit or expiration date for consumed credits."
        },
        {
            q: "Can I purchase additional credits later?",
            a: "Yes, you can purchase credit packs anytime from your account dashboard. The new credits will be added to your existing balance immediately."
        },
        {
            q: "Is training available for using the software?",
            a: "Yes, we offer guided demo sessions and tutorial resources to help numerologists understand how to use the platform effectively and integrate it into their professional workflow."
        }
    ];

    return (
        <div className="min-h-screen bg-white text-slate-900 selection:bg-[#4B2E83] selection:text-white font-['Inter',_sans-serif]">
            <Header />

            <main>
                {/* --- SECTION 1: Page Header (Refined 2-column) --- */}
                <section className="relative pt-32 pb-24 px-6 overflow-hidden bg-gradient-to-br from-[#4B2E83]/10 via-white to-[#C9A227]/5">
                    {/* Background Patterns */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#4B2E83]/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#C9A227]/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />

                    <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="space-y-8"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#4B2E83]/5 rounded-full border border-[#4B2E83]/10">
                                <HelpCircle size={14} className="text-[#4B2E83]" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#4B2E83]">Support Center</span>
                            </div>
                            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-[#4B2E83] leading-[1.1]">
                                Support & <br />
                                <span className="text-[#C9A227]">Assistance</span>
                            </h1>
                            <p className="text-xl text-slate-600 max-w-xl font-medium leading-relaxed">
                                Need help using <span className="font-bold text-[#4B2E83]">NUMERO SANSAR</span>? Our support team is here to assist you with setup, usage, and consultation workflow guidance.
                            </p>
                            <div className="flex flex-wrap gap-4 pt-4">
                                <div className="flex items-center gap-2 font-bold text-[#4B2E83] text-sm">
                                    <ShieldCheck size={18} className="text-[#C9A227]" /> 24/7 Monitoring
                                </div>
                                <div className="flex items-center gap-2 font-bold text-[#4B2E83] text-sm">
                                    <Globe size={18} className="text-[#C9A227]" /> Multilingual Help
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1 }}
                            className="relative lg:block hidden"
                        >
                            <div className="relative group">
                                <div className="absolute -inset-4 bg-gradient-to-tr from-[#4B2E83]/20 to-[#C9A227]/20 rounded-[3rem] blur-2xl group-hover:blur-3xl transition-all duration-700 opacity-50" />
                                <div className="relative bg-white/40 backdrop-blur-xl rounded-[2.5rem] border border-white/40 shadow-2xl p-4 overflow-hidden">
                                    <div className="aspect-[4/3] bg-slate-50/50 rounded-[1.8rem] border border-slate-100 flex flex-col p-6 space-y-4">
                                        <div className="h-10 w-full bg-white rounded-xl shadow-sm border border-slate-100 flex items-center px-4 gap-3">
                                            <Search size={14} className="text-slate-400" />
                                            <div className="h-2 w-1/3 bg-slate-100 rounded-full" />
                                        </div>
                                        <div className="flex-1 grid grid-cols-2 gap-4">
                                            <div className="bg-white rounded-2xl shadow-sm border border-slate-100" />
                                            <div className="bg-[#4B2E83]/5 rounded-2xl shadow-sm border border-[#4B2E83]/10" />
                                        </div>
                                        <div className="h-20 w-full bg-white rounded-2xl shadow-sm border border-slate-100" />
                                    </div>
                                </div>
                                {/* Floating gold element */}
                                <motion.div
                                    animate={{ y: [0, -20, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute -top-10 -right-10 w-24 h-24 bg-[#C9A227] rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-amber-500/40"
                                >
                                    <Zap size={32} />
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* --- SECTION 2: Contact Support (Refined with Glassmorphism) --- */}
                <section className="py-32 px-6">
                    <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-stretch">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="space-y-12 flex flex-col justify-center"
                        >
                            <div className="space-y-6">
                                <h2 className="text-4xl md:text-5xl font-black text-[#4B2E83] leading-tight">
                                    Get in Touch with our <br />
                                    <span className="text-[#C9A227]">Support Team</span>
                                </h2>
                                <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-lg">
                                    If you need assistance with the software, account setup, or credit purchases, we're here to help.
                                </p>
                            </div>

                            <div className="grid sm:grid-cols-1 gap-6">
                                {[
                                    { icon: <Mail />, label: "Email Support", val: "support@numerosansar.com", href: "mailto:support@numerosansar.com", color: "purple" },
                                    { icon: <MessageSquare />, label: "WhatsApp Support", val: "+91 XXXXX XXXXX", href: "https://wa.me/910000000000", color: "gold" },
                                    { icon: <Clock />, label: "Working Hours", val: "Mon – Sat, 10 AM – 6 PM IST", color: "slate" }
                                ].map((item, i) => (
                                    <motion.div
                                        key={i}
                                        whileHover={{ x: 10 }}
                                        className="flex items-center gap-6 p-6 rounded-[2rem] bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-xl hover:border-[#4B2E83]/10 transition-all duration-300"
                                    >
                                        <div className={`w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center ${item.color === 'purple' ? 'bg-[#4B2E83]/10 text-[#4B2E83]' :
                                                item.color === 'gold' ? 'bg-[#C9A227]/10 text-[#C9A227]' :
                                                    'bg-slate-200 text-slate-500'
                                            }`}>
                                            {item.icon}
                                        </div>
                                        <div className="space-y-1">
                                            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{item.label}</div>
                                            {item.href ? (
                                                <a href={item.href} className="text-lg font-bold text-slate-800 hover:text-[#4B2E83] transition-colors">{item.val}</a>
                                            ) : (
                                                <div className="text-lg font-bold text-slate-800">{item.val}</div>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <div className="absolute -inset-6 bg-gradient-to-br from-[#4B2E83]/10 to-[#C9A227]/10 blur-3xl opacity-50" />
                            <div className="relative bg-white rounded-[3rem] p-10 md:p-14 shadow-[0_32px_64px_-16px_rgba(75,46,131,0.15)] border border-slate-100">
                                <div className="space-y-8">
                                    <div className="text-center space-y-2">
                                        <h3 className="text-2xl font-black text-[#4B2E83]">Drop us a Message</h3>
                                        <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">We respond within 24 hours</p>
                                    </div>
                                    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                                        <div className="grid sm:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <input
                                                    type="text"
                                                    placeholder="Full Name"
                                                    className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#4B2E83]/5 focus:bg-white focus:border-[#4B2E83]/20 transition-all font-bold"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <input
                                                    type="email"
                                                    placeholder="Email Address"
                                                    className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#4B2E83]/5 focus:bg-white focus:border-[#4B2E83]/20 transition-all font-bold"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <input
                                                type="tel"
                                                placeholder="Phone Number"
                                                className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#4B2E83]/5 focus:bg-white focus:border-[#4B2E83]/20 transition-all font-bold"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <textarea
                                                rows={4}
                                                placeholder="Describe your issue or request..."
                                                className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#4B2E83]/5 focus:bg-white focus:border-[#4B2E83]/20 transition-all font-bold resize-none"
                                            ></textarea>
                                        </div>
                                        <button className="w-full py-5 bg-[#4B2E83] text-white rounded-2xl font-black text-lg hover:bg-[#5D3AB0] transition-all flex items-center justify-center gap-4 shadow-xl shadow-purple-900/40 relative overflow-hidden group">
                                            <span className="relative z-10 flex items-center gap-3">
                                                Send Message <Send size={20} />
                                            </span>
                                            <div className="absolute inset-0 bg-[#C9A227] translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* --- SECTION 3: Request Software Demo (Premium Accent) --- */}
                <section className="py-12 px-6">
                    <div className="max-w-7xl mx-auto">
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="bg-[#4B2E83] rounded-[3.5rem] p-16 md:p-24 text-center relative overflow-hidden shadow-2xl"
                        >
                            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white opacity-[0.03] rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#C9A227] opacity-[0.08] rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

                            <div className="relative z-10 space-y-10 max-w-4xl mx-auto">
                                <motion.div
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                    className="w-24 h-24 bg-white/10 rounded-[2rem] flex items-center justify-center text-[#C9A227] mx-auto border border-white/10 backdrop-blur-sm"
                                >
                                    <Video size={48} />
                                </motion.div>
                                <div className="space-y-6">
                                    <h2 className="text-4xl md:text-6xl font-black text-white leading-tight">Request a Guided Demo</h2>
                                    <p className="text-xl text-purple-100/80 font-medium max-w-2xl mx-auto leading-relaxed">
                                        Explore how NUMERO SANSAR can revolutionize your consultation practice with a personal walkthrough from our product experts.
                                    </p>
                                </div>
                                <div className="pt-4">
                                    <button className="px-14 py-6 bg-[#C9A227] hover:bg-white text-[#4B2E83] rounded-2xl font-black text-2xl transition-all shadow-2xl hover:scale-105 active:scale-95">
                                        Schedule Demo Session
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* --- SECTION 4: Quick Help Topics (Premium Cards) --- */}
                <section className="py-32 px-6 bg-slate-50/50">
                    <div className="max-w-7xl mx-auto space-y-20">
                        <div className="text-center space-y-4">
                            <div className="inline-block px-4 py-1.5 bg-[#4B2E83]/5 text-[#4B2E83] text-[10px] font-black uppercase tracking-[0.3em] rounded-full mb-4">
                                Knowledge Base
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black text-[#4B2E83]">Help Topics</h2>
                            <div className="h-2 w-20 bg-[#C9A227] mx-auto rounded-full" />
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {helpTopics.map((topic, idx) => (
                                <motion.div
                                    key={idx}
                                    whileHover={{ y: -8 }}
                                    className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl shadow-slate-200/40 group relative overflow-hidden flex flex-col items-start text-left cursor-pointer"
                                >
                                    <div className="space-y-8 relative z-10">
                                        <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center ${topic.bg} ${topic.color} group-hover:bg-[#4B2E83] group-hover:text-white transition-all duration-500`}>
                                            {topic.icon}
                                        </div>
                                        <div className="space-y-4">
                                            <h3 className="text-xl font-black text-slate-800 leading-tight group-hover:text-[#4B2E83] transition-colors">
                                                {topic.title}
                                            </h3>
                                            <p className="text-sm text-slate-500 font-bold leading-relaxed">
                                                {topic.description}
                                            </p>
                                        </div>
                                        <div className={`flex items-center gap-2 font-black text-[10px] uppercase tracking-widest ${topic.color} group-hover:gap-4 transition-all opacity-0 group-hover:opacity-100`}>
                                            Explore Guide <ArrowRight size={14} />
                                        </div>
                                    </div>
                                    {/* Gold accent at corner hover */}
                                    <div className="absolute top-0 right-0 w-2 h-0 group-hover:h-full bg-[#C9A227] transition-all duration-500 opacity-0 group-hover:opacity-100" />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* --- SECTION 5: Frequently Asked Questions --- */}
                <section className="py-32 px-6 bg-white">
                    <div className="max-w-4xl mx-auto space-y-20">
                        <div className="text-center space-y-6">
                            <h2 className="text-4xl md:text-5xl font-black text-[#4B2E83]">Common Questions</h2>
                            <p className="text-xl text-slate-400 font-medium">Everything you need to know about our platform logic.</p>
                        </div>

                        <div className="space-y-6">
                            {faqs.map((faq, idx) => (
                                <motion.div
                                    key={idx}
                                    className="border border-[#4B2E83]/10 rounded-[2rem] bg-white overflow-hidden shadow-sm hover:shadow-2xl hover:border-[#4B2E83]/20 transition-all duration-300"
                                >
                                    <button
                                        onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                        className="w-full flex items-center justify-between p-8 md:p-10 text-left group"
                                    >
                                        <span className="text-xl font-black text-slate-800 group-hover:text-[#4B2E83] transition-colors">
                                            {faq.q}
                                        </span>
                                        <div className={`p-3 rounded-2xl transition-all duration-500 ${openFaq === idx ? 'rotate-180 bg-[#4B2E83] text-white' : 'bg-[#C9A227]/10 text-[#C9A227] group-hover:bg-[#C9A227] group-hover:text-white'}`}>
                                            <ChevronDown size={24} />
                                        </div>
                                    </button>
                                    <AnimatePresence>
                                        {openFaq === idx && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.5 }}
                                            >
                                                <div className="px-10 pb-10 text-lg text-slate-500 font-medium leading-relaxed border-t border-slate-50 pt-8">
                                                    {faq.a}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* --- SECTION 6: Tutorials & Learning (Refined) --- */}
                <section className="py-32 px-6 relative overflow-hidden bg-white">
                    <div className="max-w-7xl mx-auto">
                        <div className="bg-slate-50 rounded-[4rem] p-16 md:p-24 flex flex-col lg:flex-row items-center justify-between gap-16 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-32 h-32 bg-[#4B2E83]/5 rounded-br-full" />
                            <div className="space-y-8 max-w-2xl text-center lg:text-left">
                                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-[#4B2E83] shadow-xl mx-auto lg:mx-0">
                                    <BookOpen size={40} />
                                </div>
                                <h2 className="text-4xl md:text-6xl font-black text-[#4B2E83] leading-tight">Master the <br /> <span className="text-[#C9A227]">Consultation Workflow</span></h2>
                                <p className="text-xl text-slate-500 font-medium leading-relaxed">
                                    Deepen your expertise with our library of tutorial guides and live training sessions designed specifically for modern numerologists.
                                </p>
                                <div className="pt-4 flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
                                    <button className="px-10 py-5 bg-[#4B2E83] text-white rounded-2xl font-black text-lg hover:bg-[#5D3AB0] transition-all shadow-xl shadow-purple-900/20 active:scale-95">
                                        Browse Library
                                    </button>
                                    <button className="px-10 py-5 bg-white text-[#4B2E83] border-2 border-slate-200 rounded-2xl font-black text-lg hover:border-[#4B2E83] transition-all active:scale-95">
                                        Watch Tutorials
                                    </button>
                                </div>
                            </div>
                            <div className="lg:w-1/3 aspect-square bg-[#C9A227]/10 rounded-[3rem] border border-[#C9A227]/20 flex items-center justify-center relative group">
                                <div className="absolute -inset-4 bg-[#C9A227]/10 rounded-[3.5rem] blur-xl" />
                                <div className="relative w-32 h-32 bg-white rounded-full shadow-2xl flex items-center justify-center text-[#C9A227] animate-pulse">
                                    <PlayCircle size={64} fill="currentColor" className="text-white" />
                                    <PlayCircle size={64} className="absolute text-[#C9A227]" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- SECTION 7: Call to Action (Centered Premium) --- */}
                <section className="py-32 px-6 flex justify-center">
                    <div className="max-w-4xl mx-auto text-center space-y-12">
                        <div className="space-y-4">
                            <span className="text-[12px] font-black uppercase tracking-[0.4em] text-[#C9A227]">Get Started</span>
                            <h2 className="text-4xl md:text-7xl font-black text-slate-900 leading-tight">
                                Transform Your <br />
                                <span className="text-[#4B2E83]">Practice</span> Today.
                            </h2>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <Link to="/register" className="w-full sm:w-auto px-12 py-6 bg-[#4B2E83] text-white rounded-[1.5rem] font-black text-xl hover:bg-[#5D3AB0] transition-all shadow-2xl shadow-purple-900/40 hover:scale-105 active:scale-95 flex items-center gap-3">
                                Start Free Trial <ArrowRight size={22} />
                            </Link>
                            <Link to="/pricing" className="w-full sm:w-auto px-12 py-6 border-2 border-slate-200 text-slate-800 rounded-[1.5rem] font-black text-xl hover:border-[#4B2E83] hover:text-[#4B2E83] transition-all active:scale-95">
                                View Pricing
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            {/* --- SECTION 8: Footer --- */}
            <Footer />
        </div>
    );
}
