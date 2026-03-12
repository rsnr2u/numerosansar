import { useState, useEffect } from "react";
import { Save, Settings as SettingsIcon, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";

export default function AdminSettings() {
    const [settings, setSettings] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await api.get("/admin/settings");
            const data = await res.json();
            setSettings(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            const res = await api.post("/admin/settings", settings);
            if (res.ok) {
                alert("Settings saved successfully!");
            } else {
                alert("Failed to save settings");
            }
        } catch (e) {
            console.error(e);
            alert("Error saving settings");
        }
    };

    const handleChange = (key: string, value: string) => {
        setSettings({ ...settings, [key]: value });
    };

    if (loading) return <div className="text-foreground">Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
                <SettingsIcon size={24} /> Website Settings
            </h1>

            <div className="glass-card p-8 rounded-3xl space-y-6">
                <h2 className="text-xl font-bold border-b border-border pb-4">General Configuration</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="text-xs uppercase tracking-widest text-muted-foreground block mb-2 font-bold">Site Title</label>
                        <input
                            value={settings.site_title || ''}
                            onChange={(e) => handleChange('site_title', e.target.value)}
                            className="w-full bg-input/50 border border-border rounded-xl p-2 outline-none text-foreground focus:border-accent transition-colors"
                        />
                    </div>
                    <div>
                        <label className="text-xs uppercase tracking-widest text-muted-foreground block mb-2 font-bold">Contact Email</label>
                        <input
                            value={settings.contact_email || ''}
                            onChange={(e) => handleChange('contact_email', e.target.value)}
                            className="w-full bg-input/50 border border-border rounded-xl p-2 outline-none text-foreground focus:border-accent transition-colors"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="text-xs uppercase tracking-widest text-muted-foreground block mb-2 font-bold">Logo URL</label>
                        <input
                            value={settings.site_logo || ''}
                            onChange={(e) => handleChange('site_logo', e.target.value)}
                            className="w-full bg-input/50 border border-border rounded-xl p-2 outline-none text-foreground focus:border-accent transition-colors"
                        />
                    </div>
                </div>

                <h2 className="text-xl font-bold border-b border-border pb-4 pt-4">SEO Settings</h2>

                <div className="space-y-4">
                    <div>
                        <label className="text-xs uppercase tracking-widest text-muted-foreground block mb-2 font-bold">Meta Description</label>
                        <textarea
                            rows={3}
                            value={settings.meta_description || ''}
                            onChange={(e) => handleChange('meta_description', e.target.value)}
                            className="w-full bg-input/50 border border-border rounded-xl p-2 outline-none text-foreground focus:border-accent transition-colors"
                        />
                    </div>
                    <div>
                        <label className="text-xs uppercase tracking-widest text-muted-foreground block mb-2 font-bold">Meta Keywords</label>
                        <input
                            value={settings.meta_keywords || ''}
                            onChange={(e) => handleChange('meta_keywords', e.target.value)}
                            className="w-full bg-input/50 border border-border rounded-xl p-2 outline-none text-foreground focus:border-accent transition-colors"
                            placeholder="comma, separated, keywords"
                        />
                    </div>
                </div>

                <div className="pt-6">
                    <button onClick={handleSave} className="bg-primary text-primary-foreground font-bold px-8 py-3 rounded-xl hover:bg-primary/90 transition-all flex items-center gap-2 shadow-md hover:shadow-lg">
                        <Save size={20} /> Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}
