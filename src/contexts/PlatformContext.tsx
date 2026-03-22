import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/lib/api';

interface PlatformConfig {
    platform_name: string;
    website_url: string;
    copyright_text: string;
    theme_color: string;
    cta_color: string;
    [key: string]: any;
}

interface PlatformContextType {
    config: PlatformConfig | null;
    loading: boolean;
    refreshConfig: () => Promise<void>;
}

const defaultContext: PlatformContextType = {
    config: null,
    loading: true,
    refreshConfig: async () => {},
};

export const PlatformContext = createContext<PlatformContextType>(defaultContext);

export function PlatformProvider({ children }: { children: React.ReactNode }) {
    const [config, setConfig] = useState<PlatformConfig | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchConfig = async () => {
        try {
            // We need an endpoint that doesn't require admin auth for the public pages
            // If the current endpoint requires auth, we should handle that gracefully
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'}/public/system-config`);
            if (response.ok) {
                const data = await response.json();
                
                // Convert array of {config_key, config_value} to an object map
                const configMap = data.reduce((acc: any, curr: any) => {
                    acc[curr.config_key] = curr.config_value;
                    return acc;
                }, {});
                
                setConfig({
                    platform_name: configMap.platform_name || 'Numero Sansar',
                    website_url: configMap.website_url || 'https://www.numersansar.com',
                    copyright_text: configMap.copyright_text || '© 2026 Numero Sansar. All rights reserved.',
                    theme_color: configMap.theme_color || '#4B2E83',
                    cta_color: configMap.cta_color || '#F97316',
                    ...configMap
                });
            } else {
                // Fallback to defaults
                setConfig({
                    platform_name: 'Numero Sansar',
                    website_url: 'https://www.numersansar.com',
                    copyright_text: '© 2026 Numero Sansar. All rights reserved.',
                    theme_color: '#4B2E83',
                    cta_color: '#F97316',
                });
            }
        } catch (error) {
            console.error('Failed to load platform config', error);
            setConfig({
                platform_name: 'Numero Sansar',
                website_url: 'https://www.numersansar.com',
                copyright_text: '© 2026 Numero Sansar. All rights reserved.',
                theme_color: '#4B2E83',
                cta_color: '#F97316',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchConfig();
    }, []);

    return (
        <PlatformContext.Provider value={{ config, loading, refreshConfig: fetchConfig }}>
            {children}
        </PlatformContext.Provider>
    );
}

export const usePlatform = () => useContext(PlatformContext);
