const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

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

            if (response.status === 401) {
                // Clear tokens and redirect
                localStorage.removeItem("admin_token");
                localStorage.removeItem("token");
                if (typeof window !== "undefined" && !window.location.pathname.includes("/admin/login")) {
                    window.location.href = "/admin/login";
                }
                throw new Error("Session expired. Please login again.");
            }

            return response;
        } catch (error) {
            console.error(`API Request Error [${endpoint}]:`, error);
            throw error;
        }
    },

    get(endpoint: string, options: FetchOptions = {}) {
        return this.request(endpoint, { ...options, method: "GET" });
    },

    post(endpoint: string, body: any, options: FetchOptions = {}) {
        return this.request(endpoint, {
            ...options,
            method: "POST",
            body: body instanceof FormData ? body : JSON.stringify(body)
        });
    },

    put(endpoint: string, body: any, options: FetchOptions = {}) {
        return this.request(endpoint, {
            ...options,
            method: "PUT",
            body: body instanceof FormData ? body : JSON.stringify(body)
        });
    },

    delete(endpoint: string, options: FetchOptions = {}) {
        return this.request(endpoint, { ...options, method: "DELETE" });
    }
};
