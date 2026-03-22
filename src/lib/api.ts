import { API_BASE_URL } from "./constants";

type FetchOptions = RequestInit & {
    params?: Record<string, string>;
};

export const api = {
    async request(endpoint: string, options: FetchOptions = {}) {
        const token = localStorage.getItem("admin_token") || localStorage.getItem("token");
        const url = new URL(`${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`);

        if (options.params) {
            Object.keys(options.params).forEach(key =>
                url.searchParams.append(key, options.params![key])
            );
        }

        const headers = new Headers(options.headers);
        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }
        if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
            headers.set("Content-Type", "application/json");
        }

        const config = {
            ...options,
            headers
        };

        try {
            const response = await fetch(url.toString(), config);

            // Robust JSON parsing with fallback
            const safeJson = async (res: Response) => {
                const text = await res.text();
                try {
                    return text.length > 0 ? JSON.parse(text) : {};
                } catch (e) {
                    console.error("JSON Parse Error. Content was:", text.substring(0, 100));
                    return { _error: "Invalid JSON response", _raw: text };
                }
            };

            if (response.status === 401) {
                const errorData = await safeJson(response);
                console.warn(`Unauthorized [401] at ${endpoint}:`, errorData);

                // Clear tokens
                localStorage.removeItem("admin_token");
                localStorage.removeItem("token");
                localStorage.removeItem("user_role");
                localStorage.removeItem("username");

                if (typeof window !== "undefined") {
                    const isSuperAdminRoute = window.location.pathname.startsWith('/super-admin');
                    const loginPath = isSuperAdminRoute ? '/super-admin/login' : '/admin/login';

                    if (!window.location.pathname.includes(loginPath)) {
                        const now = Date.now();
                        const lastRedirect = (window as any)._lastRedirectTime || 0;
                        if (now - lastRedirect > 2000) {
                            (window as any)._lastRedirectTime = now;
                            window.location.href = `${loginPath}?expired=true`;
                        }
                    }
                }
                throw new Error(errorData.error || errorData.message || "Session expired");
            }

            // Return an object that mimics standard response but has a safer json method
            return {
                ok: response.ok,
                status: response.status,
                json: () => safeJson(response),
                headers: response.headers,
                raw: response
            };
        } catch (error) {
            console.error(`API Request Error [${endpoint}]:`, error);
            throw error;
        }
    },

    async get(endpoint: string, options: FetchOptions = {}) {
        return this.request(endpoint, { ...options, method: "GET" });
    },

    async post(endpoint: string, body: any, options: FetchOptions = {}) {
        return this.request(endpoint, {
            ...options,
            method: "POST",
            body: body instanceof FormData ? body : JSON.stringify(body)
        });
    },

    async put(endpoint: string, body: any, options: FetchOptions = {}) {
        return this.request(endpoint, {
            ...options,
            method: "PUT",
            body: body instanceof FormData ? body : JSON.stringify(body)
        });
    },

    async delete(endpoint: string, options: FetchOptions = {}) {
        return this.request(endpoint, { ...options, method: "DELETE" });
    }
};
