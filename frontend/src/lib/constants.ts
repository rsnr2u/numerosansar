// ─── API Base URL ────────────────────────────────────────────
export const API_BASE_URL =
    import.meta.env.VITE_API_URL || "http://localhost:8080/api";

// ─── App Config ──────────────────────────────────────────────
export const APP_NAME = import.meta.env.VITE_APP_NAME || "AstroSansar";
export const APP_URL = import.meta.env.VITE_APP_URL || "http://localhost:3000";

// ─── Route Paths ─────────────────────────────────────────────
export const ROUTES = {
    // Public
    HOME: "/",
    ABOUT: "/about",
    SERVICES: "/services",
    FEATURES: "/features",
    PRICING: "/pricing",
    CONTACT: "/contact",
    LOGIN: "/login",
    REGISTER: "/register",

    // Admin
    ADMIN: {
        ROOT: "/admin",
        DASHBOARD: "/admin/dashboard",
        LOGIN: "/admin/login",
        REGISTER: "/admin/register",
        PROFILE: "/admin/profile",
        CLIENTS: "/admin/clients",
        CLIENTS_ADD: "/admin/clients/add",
        CLIENT_DETAIL: (id: string | number) => `/admin/clients/${id}`,
        CLIENT_EDIT: (id: string | number) => `/admin/clients/${id}/edit`,
        CLIENT_LO_SHU: (id: string | number) => `/admin/clients/${id}/lo-shu-grid`,
        CHECK: "/admin/check",
        COMPOUNDS: "/admin/compounds",
        AUSPICIOUS: "/admin/auspicious",
        VOWEL_CONSONANT: "/admin/vowel-consonant",
        BUSINESS_SECTORS: "/admin/business-sectors",
        LUCKY_NAME_NUMBERS: "/admin/lucky-name-numbers",
        LO_SHU_MEANINGS: "/admin/lo-shu-meanings",
        KUA_DETAILS: "/admin/kua-details",
        LO_SHU_GRID_MASTER: "/admin/lo-shu-grid-master",
        LO_SHU_GRID: "/admin/lo-shu-grid",
        BUSINESS_ASTROLOGY: "/admin/business-astrology",
        MOBILE_ASTROLOGY: "/admin/mobile-astrology",
        MOBILE_ANALYSIS: "/admin/mobile-astrology/analysis",
        VEHICLE_ASTROLOGY: "/admin/vehicle-astrology",
        SETTINGS: "/admin/settings",
        AI_SETTINGS: "/admin/ai-settings",
        USERS: "/admin/users",
        CREDITS: "/admin/credits",
    },

    // Super Admin
    SUPER_ADMIN: {
        ROOT: "/super-admin",
        DASHBOARD: "/super-admin/dashboard",
        LOGIN: "/super-admin/login",
        PROFILE: "/super-admin/profile",
        VENDORS: "/super-admin/vendors",
        VENDOR_DETAIL: (id: string | number) => `/super-admin/vendors/${id}`,
        PAYMENTS: "/super-admin/payments",
        PLANS: "/super-admin/plans",
        AI: "/super-admin/ai",
        AUDIT_LOGS: "/super-admin/audit-logs",
        SETTINGS: "/super-admin/settings",
        SECTORS: "/super-admin/sectors",
    },
} as const;
