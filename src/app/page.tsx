import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Users,
  Clock,
  LayoutDashboard,
  Shield,
  Zap,
  Smartphone,
  Car,
  Grid3X3,
  TrendingUp,
  FileText,
  Search,
  Briefcase
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { usePlatform } from "@/contexts/PlatformContext";

export default function Home() {
  const { config } = usePlatform();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-[#4B2E83] selection:text-white">
      <Header />

      {/* --- SECTION 2: Hero Section --- */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden bg-gradient-to-br from-[#4B2E83]/5 via-white to-[#C9A227]/5">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-50 border border-purple-100 text-[#4B2E83] text-xs font-bold uppercase tracking-wider">
              Trusted by 500+ Professional Numerologists
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold leading-[1.1] text-slate-900">
              Professional Numerology Software for <span className="text-[#4B2E83]">Modern Numerologists</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 max-w-xl leading-relaxed">
              Perform accurate numerology analysis, manage client consultations, and generate professional insights using Chaldean and Pythagorean numerology systems.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link to="/register"
                className="w-full sm:w-auto px-8 py-4 bg-[#4B2E83] hover:bg-[#5D3AB0] text-white rounded-xl font-bold text-base shadow-lg shadow-purple-900/20 transition-all hover:scale-105"
              >
                Start Free Trial
              </Link>
              <Link to="/features"
                className="w-full sm:w-auto px-8 py-4 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-base hover:bg-slate-50 transition-all flex items-center justify-center gap-2 border-b-4 border-b-slate-100 active:border-b-0 active:translate-y-1"
              >
                View Features
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-tr from-[#4B2E83]/10 to-[#C9A227]/10 blur-3xl rounded-full" />
            <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-2xl relative overflow-hidden group">
              <div className="bg-slate-50 rounded-xl aspect-[4/3] flex flex-col items-center justify-center overflow-hidden border border-slate-100">
                {/* Visual Mockup of Dashboard */}
                <div className="w-full h-full p-6 space-y-6">
                  <div className="flex justify-between items-center">
                    <div className="h-4 w-32 bg-slate-200 rounded-full" />
                    <div className="h-8 w-8 bg-[#4B2E83]/10 rounded-lg" />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-1 space-y-3">
                      {[1, 2, 3, 4].map(i => <div key={i} className="h-3 w-full bg-slate-200 rounded-full" />)}
                    </div>
                    <div className="col-span-2 bg-[#4B2E83]/5 rounded-xl border border-[#4B2E83]/10 p-4 flex items-center justify-center">
                      <div className="grid grid-cols-3 gap-2 w-32 h-32">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
                          <div key={i} className="bg-white border border-slate-200 rounded flex items-center justify-center text-[10px] font-bold text-[#4B2E83]">
                            {i === 5 ? "8" : i === 1 ? "4" : i === 9 ? "2" : ""}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="h-32 w-full bg-white rounded-xl border border-slate-200 p-4 space-y-3">
                    <div className="h-3 w-1/2 bg-[#C9A227]/20 rounded-full" />
                    <div className="h-3 w-full bg-slate-100 rounded-full" />
                    <div className="h-3 w-full bg-slate-100 rounded-full" />
                    <div className="h-3 w-3/4 bg-slate-100 rounded-full" />
                  </div>
                </div>
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#4B2E83] text-white px-4 py-2 rounded-lg font-bold shadow-xl opacity-0 group-hover:opacity-100 transition-opacity">
                Preview Insights
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- SECTION 3: Why Choose {config?.platform_name || 'NUMERO SANSAR'} --- */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto text-center space-y-16">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#4B2E83]">Why Choose NUMERO SANSAR</h2>
            <div className="h-1.5 w-24 bg-[#C9A227] mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="text-[#C9A227]" size={32} />,
                title: "Accurate Numerology Calculations",
                desc: "Automated calculations based on Chaldean and Pythagorean systems for 100% precision."
              },
              {
                icon: <Users className="text-[#C9A227]" size={32} />,
                title: "Professional Client Management",
                desc: "Manage client profiles, consultation history, and reports in one unified dashboard."
              },
              {
                icon: <Clock className="text-[#C9A227]" size={32} />,
                title: "Save Time in Consultations",
                desc: "Generate numerology insights instantly instead of spending hours on manual calculations."
              }
            ].map((card, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -10 }}
                className="p-8 bg-slate-50 rounded-2xl border border-slate-100 text-left space-y-6 transition-all shadow-sm"
              >
                <div className="w-14 h-14 bg-white rounded-xl shadow-md flex items-center justify-center">
                  {card.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900">{card.title}</h3>
                <p className="text-slate-600 leading-relaxed">{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- SECTION 4: Core Software Features --- */}
      <section className="py-24 px-6 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#4B2E83]">Powerful Numerology Analysis Tools</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Everything you need to provide professional consultations to your clients.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <Search />, name: "Name Astrology Analysis", desc: "Analyze vibration of names vs birth dates." },
              { icon: <Briefcase />, name: "Business Name Numerology", desc: "Ensure business names align with financial success." },
              { icon: <Smartphone />, name: "Mobile Number Analysis", desc: "Find the most auspicious digits for communication." },
              { icon: <Car />, name: "Vehicle Number Analysis", desc: "Safety and energy alignment for transport." },
              { icon: <Grid3X3 />, name: "Lo Shu Grid Analysis", desc: "3x3 square grid deep destiny patterns." },
              { icon: <TrendingUp />, name: "Yearly Prediction Insights", desc: "Plan ahead with personalized yearly energy cycles." }
            ].map((feature, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#4B2E83]/5 text-[#4B2E83] rounded-lg flex items-center justify-center group-hover:bg-[#4B2E83] group-hover:text-white transition-colors shrink-0">
                    {feature.icon}
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-bold text-slate-900 group-hover:text-[#4B2E83] transition-colors">{feature.name}</h4>
                    <p className="text-sm text-slate-500">{feature.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- SECTION 5: How It Works --- */}
      <section id="how-it-works" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#4B2E83]">How {config?.platform_name || 'NUMERO SANSAR'} Works</h2>
            <div className="h-1.5 w-24 bg-[#C9A227] mx-auto rounded-full" />
          </div>

          <div className="relative pt-10">
            {/* Connecting line for desktop */}
            <div className="hidden lg:block absolute top-[90px] left-20 right-20 h-0.5 bg-slate-200 -z-10" />

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
              {[
                { step: "1", title: "Create Client Profile", desc: "Input basic birth details and name." },
                { step: "2", title: "Run Numerology Analysis", desc: "Instant calculation across all modules." },
                { step: "3", title: "View Insights & Interpretations", desc: "Read detailed analysis and remedies." },
                { step: "4", title: "Generate Professional Reports", desc: "One-click PDF download for branding." }
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center text-center space-y-6">
                  <div className="w-16 h-16 bg-[#4B2E83] text-white rounded-full flex items-center justify-center text-xl font-black shadow-lg shadow-purple-900/20 border-4 border-white">
                    {item.step}
                  </div>
                  <div className="space-y-2 px-4">
                    <h4 className="font-extrabold text-slate-900">{item.title}</h4>
                    <p className="text-sm text-slate-600 font-medium">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- SECTION 6: Pricing Preview --- */}
      <section className="py-24 px-6 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#4B2E83]">Simple Credit-Based Pricing</h2>
            <p className="text-slate-500 max-w-xl mx-auto">Pay for what you use. No monthly subscriptions, no hidden fees.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { name: "Starter Pack", credits: "10 Credits", price: "₹2,700", popular: false },
              { name: "Professional Pack", credits: "30 Credits", price: "₹7,500", popular: true },
              { name: "Master Pack", credits: "100 Credits", price: "₹22,000", popular: false }
            ].map((plan, idx) => (
              <div
                key={idx}
                className={`flex flex-col p-8 rounded-3xl border-2 transition-all relative ${plan.popular ? "bg-white border-[#4B2E83] shadow-2xl scale-105 z-10" : "bg-white/50 border-slate-200 shadow-sm hover:border-[#4B2E83]/30"}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#C9A227] text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full">
                    Most Popular
                  </div>
                )}
                <div className="mb-8 text-center space-y-2">
                  <h4 className="font-bold text-slate-500 uppercase text-xs tracking-wider">{plan.name}</h4>
                  <div className="text-4xl font-black text-[#4B2E83]">{plan.credits}</div>
                </div>

                <div className="text-center mb-8">
                  <div className="text-3xl font-extrabold text-slate-900">{plan.price}</div>
                  <div className="text-xs text-slate-400 font-bold mt-1 uppercase">One-time purchase</div>
                </div>

                <ul className="mb-10 space-y-4">
                  {[1, 2, 3].map(i => (
                    <li key={i} className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                      <CheckCircle2 size={16} className="text-[#C9A227]" />
                      <span>Full access to all tools</span>
                    </li>
                  ))}
                </ul>

                <button className={`w-full py-4 rounded-xl font-extrabold transition-all ${plan.popular ? "bg-[#4B2E83] text-white shadow-lg shadow-purple-900/20 hover:bg-[#5D3AB0]" : "bg-white border-2 border-[#4B2E83] text-[#4B2E83] hover:bg-slate-50"}`}>
                  Buy Credits
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- SECTION 7: Free Trial Section --- */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-r from-[#4B2E83] to-[#5D3AB0] rounded-[2.5rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-96 h-96 bg-[#C9A227]/10 rounded-full blur-3xl" />

            <div className="relative z-10 space-y-10">
              <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
                Try {config?.platform_name || 'NUMERO SANSAR'} with <span className="text-[#C9A227]">3 Free</span> Client Analyses
              </h2>
              <p className="text-purple-100 text-lg md:text-xl max-w-2xl mx-auto font-medium">
                No credit card required. Experience the power of professional numerology software today.
              </p>
              <div className="pt-4">
                <Link to="/register"
                  className="inline-flex items-center gap-3 px-10 py-5 bg-[#C9A227] hover:bg-[#D9B43A] text-[#4B2E83] rounded-2xl font-black text-lg transition-all hover:scale-105 shadow-xl shadow-black/10"
                >
                  Start Free Trial <ArrowRight size={20} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
