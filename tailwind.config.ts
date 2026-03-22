import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: 'class',
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                border: "hsl(var(--border) / <alpha-value>)",
                input: "hsl(var(--input) / <alpha-value>)",
                ring: "hsl(var(--ring) / <alpha-value>)",
                background: "hsl(var(--background) / <alpha-value>)",
                foreground: "hsl(var(--foreground) / <alpha-value>)",
                primary: {
                    DEFAULT: "hsl(var(--primary) / <alpha-value>)",
                    foreground: "hsl(var(--primary-foreground) / <alpha-value>)",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary) / <alpha-value>)",
                    foreground: "hsl(var(--secondary-foreground) / <alpha-value>)",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent) / <alpha-value>)",
                    foreground: "hsl(var(--accent-foreground) / <alpha-value>)",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted) / <alpha-value>)",
                    foreground: "hsl(var(--muted-foreground) / <alpha-value>)",
                },
                card: {
                    DEFAULT: "hsl(var(--card) / <alpha-value>)",
                    foreground: "hsl(var(--card-foreground) / <alpha-value>)",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover) / <alpha-value>)",
                    foreground: "hsl(var(--popover-foreground) / <alpha-value>)",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
                    foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
                },
                // Legacy / Specific Colors (Transitioning to Corporate)
                'corporate-navy': '#1E293B',
                'corporate-slate': '#64748B',
                'corporate-indigo': '#6366F1',
                'corporate-gold': '#D4AF37',
                'mystic-gold': '#D4AF37',
                'mystic-purple': '#0F172A',
                'astro-gold': '#D4AF37',
                'astro-red': '#B91C1C',
                'astro-dark': '#0F172A',
                'astro-cream': '#F8FAFC',
                'astro-card': '#FFFFFF',
            },
            fontFamily: {
                sans: ['Inter', 'var(--font-inter)', 'sans-serif'],
                poppins: ['Poppins', 'var(--font-poppins)', 'sans-serif'],
                mono: ['var(--font-geist-mono)'],
            },
            backgroundImage: {
                'corporate-gradient': 'linear-gradient(135deg, #1E293B 0%, #334155 100%)',
                'astro-gradient': 'linear-gradient(135deg, #1E293B 0%, #B91C1C 100%)',
            },
        },
    },
    plugins: [],
};
export default config;
