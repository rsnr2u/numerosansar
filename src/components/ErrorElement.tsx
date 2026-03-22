import React from 'react';
import { useRouteError, Link } from 'react-router-dom';
import { AlertTriangle, Home, RefreshCcw } from 'lucide-react';

export default function ErrorElement() {
    const error: any = useRouteError();
    console.error(error);

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
            <div className="max-w-md w-full bg-white rounded-[2rem] border border-slate-200 shadow-2xl p-8 text-center space-y-6">
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-red-500/10">
                    <AlertTriangle size={32} />
                </div>

                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Application Error</h1>
                    <p className="text-sm text-slate-500 mt-2">
                        {error?.statusText || error?.message || "An unexpected error occurred while rendering this page."}
                    </p>
                </div>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={() => window.location.reload()}
                        className="w-full py-3 bg-primary text-white font-black uppercase text-[10px] tracking-widest rounded-xl hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                    >
                        <RefreshCcw size={14} /> Retry Synthesis
                    </button>
                    <Link to="/admin/dashboard" className="w-full py-3 bg-slate-100 text-slate-600 font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-slate-200 transition-all flex items-center justify-center gap-2">
                        <Home size={14} /> Back to Dashboard
                    </Link>
                </div>

                <p className="text-[10px] text-slate-400 font-medium">
                    Error Code: {error?.status || "Unknown"}
                </p>
            </div>
        </div>
    );
}
