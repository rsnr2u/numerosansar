import { createBrowserRouter } from 'react-router-dom';
import React, { lazy, Suspense } from 'react';

// Layouts
import AdminLayout from './app/admin/layout';
import SuperAdminLayout from './app/super-admin/layout';
import ErrorElement from './components/ErrorElement';

// Public pages
import HomePage from './app/page';
import AboutPage from './app/about/page';
import ServicesPage from './app/services/page';
import FeaturesPage from './app/features/page';
import PricingPage from './app/pricing/page';
import ContactPage from './app/contact/page';
import LoginPage from './app/login/page';
import RegisterPage from './app/register/page';
import HowItWorksPage from './app/how-it-works/page';
import ScreenshotsPage from './app/screenshots/page';

// Admin pages
import AdminDashboard from './app/admin/dashboard/page';
import AdminClients from './app/admin/clients/page';
import AdminClientAdd from './app/admin/clients/add/page';
import AdminClientDetail from './app/admin/clients/[id]/page';
import AdminClientEdit from './app/admin/clients/[id]/edit/page';
import AdminClientLoShuGrid from './app/admin/clients/[id]/lo-shu-grid/page';
import AdminClientYearlyPrediction from './app/admin/clients/[id]/yearly-prediction/page';
import AdminClientYogaReport from './app/admin/clients/[id]/yoga-report/page.tsx';
import AdminCheck from './app/admin/check/page';
import AdminCompounds from './app/admin/compounds/page';
import AdminAuspicious from './app/admin/auspicious/page';
import AdminVowelConsonant from './app/admin/vowel-consonant/page';
import AdminBusinessSectors from './app/admin/business-sectors/page';
import AdminLuckyNameNumbers from './app/admin/lucky-name-numbers/page';
import AdminLoShuMeanings from './app/admin/lo-shu-meanings/page';
import AdminKuaDetails from './app/admin/kua-details/page';
import AdminLoShuGridMaster from './app/admin/lo-shu-grid-master/page';
import AdminLoShuGrid from './app/admin/lo-shu-grid/page';
import AdminBusinessAstrology from './app/admin/business-astrology/page';
import AdminMobileAstrology from './app/admin/mobile-numerology/page';
import AdminMobileAnalysis from './app/admin/mobile-numerology/analysis/page';
import AdminVehicleAstrology from './app/admin/vehicle-astrology/page';
import AdminSettings from './app/admin/settings/page';
import AdminAiSettings from './app/admin/ai-settings/page';
import AdminProfile from './app/admin/profile/page';
import AdminLogin from './app/admin/login/page';
import AdminRegister from './app/admin/register/page';
import AdminUsers from './app/admin/users/page';
import AdminCredits from './app/admin/credits/page';
import SuperAdminCredits from './app/super-admin/credits/page';

// Super Admin pages
import SuperAdminDashboard from './app/super-admin/dashboard/page';
import SuperAdminVendors from './app/super-admin/vendors/page';
import SuperAdminVendorDetail from './app/super-admin/vendors/[id]/page';
import SuperAdminTransactions from './app/super-admin/transactions/page';
import SuperAdminPayments from './app/super-admin/payments/page';
import SuperAdminPlans from './app/super-admin/plans/page';
import SuperAdminAI from './app/super-admin/ai/page';
import SuperAdminAuditLogs from './app/super-admin/audit-logs/page';
import SuperAdminSettings from './app/super-admin/settings/page';
import SuperAdminSectors from './app/super-admin/sectors/page';
import SuperAdminProfile from './app/super-admin/profile/page';
import SuperAdminLogin from './app/super-admin/login/page';
import SuperAdminAISettings from './app/super-admin/ai-settings/page';

export const router = createBrowserRouter([
    { path: '*', errorElement: <ErrorElement /> },
    // Public pages
    { path: '/', element: <HomePage /> },
    { path: '/about', element: <AboutPage /> },
    { path: '/services', element: <ServicesPage /> },
    { path: '/features', element: <FeaturesPage /> },
    { path: '/how-it-works', element: <HowItWorksPage /> },
    { path: '/pricing', element: <PricingPage /> },
    { path: '/screenshots', element: <ScreenshotsPage /> },
    { path: '/contact', element: <ContactPage /> },
    { path: '/login', element: <LoginPage /> },
    { path: '/register', element: <RegisterPage /> },

    // Admin routes (wrapped in AdminLayout)
    {
        path: '/admin',
        element: <AdminLayout />,
        errorElement: <ErrorElement />,
        children: [
            { path: 'dashboard', element: <AdminDashboard /> },
            { path: 'clients', element: <AdminClients /> },
            { path: 'clients/add', element: <AdminClientAdd /> },
            { path: 'clients/:id', element: <AdminClientDetail /> },
            { path: 'clients/:id/edit', element: <AdminClientEdit /> },
            { path: 'clients/:id/lo-shu-grid', element: <AdminClientLoShuGrid /> },
            { path: 'clients/:id/yearly-prediction', element: <AdminClientYearlyPrediction /> },
            { path: 'clients/:id/yoga-report', element: <AdminClientYogaReport /> },
            { path: 'check', element: <AdminCheck /> },
            { path: 'compounds', element: <AdminCompounds /> },
            { path: 'auspicious', element: <AdminAuspicious /> },
            { path: 'vowel-consonant', element: <AdminVowelConsonant /> },
            { path: 'business-sectors', element: <AdminBusinessSectors /> },
            { path: 'lucky-name-numbers', element: <AdminLuckyNameNumbers /> },
            { path: 'lo-shu-meanings', element: <AdminLoShuMeanings /> },
            { path: 'kua-details', element: <AdminKuaDetails /> },
            { path: 'lo-shu-grid-master', element: <AdminLoShuGridMaster /> },
            { path: 'lo-shu-grid', element: <AdminLoShuGrid /> },
            { path: 'business-astrology', element: <AdminBusinessAstrology /> },
            { path: 'mobile-astrology', element: <AdminMobileAstrology /> },
            { path: 'mobile-astrology/analysis', element: <AdminMobileAnalysis /> },
            { path: 'vehicle-astrology', element: <AdminVehicleAstrology /> },
            { path: 'settings', element: <AdminSettings /> },
            { path: 'ai-settings', element: <AdminAiSettings /> },
            { path: 'profile', element: <AdminProfile /> },
            { path: 'login', element: <AdminLogin /> },
            { path: 'register', element: <AdminRegister /> },
            { path: 'users', element: <AdminUsers /> },
            { path: 'credits', element: <AdminCredits /> },
        ],
    },

    // Super Admin routes (wrapped in SuperAdminLayout)
    {
        path: '/super-admin',
        element: <SuperAdminLayout />,
        errorElement: <ErrorElement />,
        children: [
            { path: 'dashboard', element: <SuperAdminDashboard /> },
            { path: 'vendors', element: <SuperAdminVendors /> },
            { path: 'vendors/:id', element: <SuperAdminVendorDetail /> },
            { path: 'transactions', element: <SuperAdminTransactions /> },
            { path: 'payments', element: <SuperAdminPayments /> },
            { path: 'plans', element: <SuperAdminPlans /> },
            { path: 'ai', element: <SuperAdminAI /> },
            { path: 'audit-logs', element: <SuperAdminAuditLogs /> },
            { path: 'settings', element: <SuperAdminSettings /> },
            { path: 'sectors', element: <SuperAdminSectors /> },
            { path: 'profile', element: <SuperAdminProfile /> },
            { path: 'login', element: <SuperAdminLogin /> },
            { path: 'credits', element: <SuperAdminCredits /> },
            { path: 'ai-settings', element: <SuperAdminAISettings /> },
        ],
    },
]);
