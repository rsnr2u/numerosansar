"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Moon, Sun, Calculator, Info, Search, Lock } from "lucide-react";

interface ResultData {
  input: string;
  pythagorean: {
    compound: number;
    root: number;
    meaning: string | null;
  };
  chaldean: {
    compound: number;
    root: number;
    meaning: string | null;
  };
}

export default function Home() {
  const [name, setName] = useState("");
  const [results, setResults] = useState<ResultData | null>(null);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const calculate = async () => {
    if (!name.trim()) return;
    setLoading(true);
    try {
      const response = await fetch("http://localhost/FULLSTACK/numerology/backend/public/index.php/api/calculate", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ name }),
      });
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Calculation failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center p-4 md:p-8">
      {/* Background with Image and Overlay */}
      <div
        className="fixed inset-0 z-0 opacity-40 bg-cover bg-center transition-all duration-1000"
        style={{ backgroundImage: "url('/mystic-bg.png')" }}
      />
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-mystic-dark/80 via-transparent to-mystic-dark/90" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="z-10 text-center mb-12 relative"
      >
        <button
          onClick={() => window.location.href = '/admin/login'}
          className="fixed top-6 right-6 p-3 glass-card rounded-full text-mystic-gold/40 hover:text-mystic-gold transition-all"
        >
          <Lock size={18} />
        </button>
        <div className="flex items-center justify-center mb-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="text-mystic-gold w-12 h-12" />
          </motion.div>
        </div>
        <h1 className="text-5xl md:text-7xl font-bold gold-glow mb-4 bg-clip-text text-transparent bg-gradient-to-r from-mystic-gold via-white to-mystic-gold">
          NUMEROLOGY
        </h1>
        <p className="text-mystic-gold/80 text-lg uppercase tracking-[0.2em]">
          Unlock Your Destiny through Symbols
        </p>
      </motion.div>

      {/* Input Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="z-10 w-full max-w-2xl glass-card rounded-2xl p-6 md:p-10 mb-12"
      >
        <div className="relative group">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && calculate()}
            placeholder="Enter your name..."
            className="w-full bg-mystic-purple/30 border-2 border-mystic-gold/20 rounded-xl px-6 py-5 text-2xl focus:outline-none focus:border-mystic-gold/50 transition-all placeholder:text-mystic-gold/30 text-white pl-14"
          />
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-mystic-gold/40 group-focus-within:text-mystic-gold transition-colors w-6 h-6" />
          <button
            onClick={calculate}
            disabled={loading}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-mystic-gold text-mystic-dark px-6 py-2 rounded-lg font-bold hover:bg-white transition-colors active:scale-95 disabled:opacity-50"
          >
            {loading ? "..." : "Calculate"}
          </button>
        </div>
      </motion.div>

      {/* Results Section */}
      <AnimatePresence mode="wait">
        {results && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="z-10 w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {/* Pythagorean System */}
            {results.pythagorean && (
              <motion.div
                whileHover={{ y: -10 }}
                className="glass-card rounded-3xl p-8 border-mystic-gold/30 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Calculator size={100} />
                </div>
                <h3 className="text-mystic-gold text-sm font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                  <Sun size={16} /> Pythagorean System
                </h3>
                <div className="flex items-end gap-4 mb-6">
                  <div className="text-6xl font-bold white-glow">{results.pythagorean.root}</div>
                  <div className="text-2xl text-mystic-gold/60 mb-1 font-light italic">({results.pythagorean.compound})</div>
                </div>
                <div className="space-y-4">
                  <p className="text-mystic-gold/90 leading-relaxed font-light text-lg">
                    {results.pythagorean.meaning || "The vibration of this number is yet to be fully revealed. Every number carries a unique cosmic signal."}
                  </p>
                  <div className="h-1 w-20 bg-mystic-gold/30 rounded-full" />
                </div>
              </motion.div>
            )}

            {/* Chaldean System */}
            {results.chaldean && (
              <motion.div
                whileHover={{ y: -10 }}
                className="glass-card rounded-3xl p-8 border-mystic-gold/30 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Moon size={100} />
                </div>
                <h3 className="text-mystic-gold text-sm font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                  <Moon size={16} /> Chaldean System
                </h3>
                <div className="flex items-end gap-4 mb-6">
                  <div className="text-6xl font-bold white-glow">{results.chaldean.root}</div>
                  <div className="text-2xl text-mystic-gold/60 mb-1 font-light italic">({results.chaldean.compound})</div>
                </div>
                <div className="space-y-4">
                  <p className="text-mystic-gold/90 leading-relaxed font-light text-lg">
                    {results.chaldean.meaning || "The Chaldean vibration is ancient and powerful. It reveals the hidden patterns of your energetic signature."}
                  </p>
                  <div className="h-1 w-20 bg-mystic-gold/30 rounded-full" />
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {!results && !loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="z-10 mt-12 text-mystic-gold/40 flex items-center gap-2 text-sm uppercase tracking-widest"
        >
          <Info size={14} /> Enter your full name to begin the journey
        </motion.div>
      )}

      {/* Footer Decoration */}
      <div className="fixed bottom-0 left-0 w-full h-32 bg-gradient-to-t from-mystic-dark to-transparent z-0 pointer-events-none" />
    </main>
  );
}
