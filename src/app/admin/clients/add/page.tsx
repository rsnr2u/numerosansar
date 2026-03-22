import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Phone, Mail, MapPin, Calendar, Save, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { API_BASE_URL, ROUTES } from "@/lib/constants";

export default function AddClientPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        full_name: "",
        calling_name: "",
        profession: "",
        dob: "",
        time_of_birth: "",
        gender: "Male",
        mobile_number: "",
        email_id: "",
        address: "",
        city: "",
        state: "",
        pincode: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch(`${API_BASE_URL}/admin/clients`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('admin_token')}`
                },
                body: JSON.stringify(formData)
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to create client");

            navigate(ROUTES.ADMIN.CLIENTS);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div className="flex items-center gap-4">
                <Link to={ROUTES.ADMIN.CLIENTS}>
                    <button className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors text-foreground">
                        <ArrowLeft size={20} />
                    </button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Add New Client</h1>
                    <p className="text-muted-foreground">Enter client details to create a new profile.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="glass-card p-8 rounded-2xl border border-border space-y-6 bg-card">
                {error && (
                    <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Full Name */}
                    <div className="space-y-2">
                        <label className="text-sm text-muted-foreground flex items-center gap-2">
                            <User size={14} className="text-accent" /> Full Name *
                        </label>
                        <input
                            type="text"
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleChange}
                            required
                            className="w-full bg-input border border-border rounded-xl px-4 py-2 text-foreground focus:outline-none focus:border-accent"
                            placeholder="e.g. Rahul Kumar User"
                        />
                    </div>

                    {/* Calling Name */}
                    <div className="space-y-2">
                        <label className="text-sm text-muted-foreground">Calling Name / Nickname</label>
                        <input
                            type="text"
                            name="calling_name"
                            value={formData.calling_name}
                            onChange={handleChange}
                            className="w-full bg-input border border-border rounded-xl px-4 py-2 text-foreground focus:outline-none focus:border-accent"
                            placeholder="e.g. Rahul"
                        />
                    </div>

                    {/* Profession */}
                    <div className="space-y-2">
                        <label className="text-sm text-muted-foreground flex items-center gap-2">
                            <User size={14} className="text-accent" /> Profession
                        </label>
                        <input
                            type="text"
                            name="profession"
                            value={formData.profession}
                            onChange={handleChange}
                            className="w-full bg-input border border-border rounded-xl px-4 py-2 text-foreground focus:outline-none focus:border-accent"
                            placeholder="e.g. Software Engineer"
                        />
                    </div>

                    {/* DOB */}
                    <div className="space-y-2">
                        <label className="text-sm text-muted-foreground flex items-center gap-2">
                            <Calendar size={14} className="text-accent" /> Date of Birth *
                        </label>
                        <input
                            type="date"
                            name="dob"
                            value={formData.dob}
                            onChange={handleChange}
                            required
                            className="w-full bg-input border border-border rounded-xl px-4 py-2 text-foreground focus:outline-none focus:border-accent"
                        />
                    </div>

                    {/* Time of Birth */}
                    <div className="space-y-2">
                        <label className="text-sm text-muted-foreground flex items-center gap-2">
                            <Calendar size={14} className="text-accent" /> Time of Birth
                        </label>
                        <input
                            type="time"
                            name="time_of_birth"
                            value={formData.time_of_birth}
                            onChange={handleChange}
                            className="w-full bg-input border border-border rounded-xl px-4 py-2 text-foreground focus:outline-none focus:border-accent"
                        />
                    </div>

                    {/* Gender */}
                    <div className="space-y-2">
                        <label className="text-sm text-muted-foreground">Gender</label>
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className="w-full bg-input border border-border rounded-xl px-4 py-2 text-foreground focus:outline-none focus:border-accent"
                        >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    {/* Mobile */}
                    <div className="space-y-2">
                        <label className="text-sm text-muted-foreground flex items-center gap-2">
                            <Phone size={14} className="text-accent" /> Mobile Number
                        </label>
                        <input
                            type="text"
                            name="mobile_number"
                            value={formData.mobile_number}
                            onChange={handleChange}
                            className="w-full bg-input border border-border rounded-xl px-4 py-2 text-foreground focus:outline-none focus:border-accent"
                            placeholder="+91 9876543210"
                        />
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                        <label className="text-sm text-muted-foreground flex items-center gap-2">
                            <Mail size={14} className="text-accent" /> Email Address
                        </label>
                        <input
                            type="email"
                            name="email_id"
                            value={formData.email_id}
                            onChange={handleChange}
                            className="w-full bg-input border border-border rounded-xl px-4 py-2 text-foreground focus:outline-none focus:border-accent"
                            placeholder="rahul@example.com"
                        />
                    </div>
                </div>

                {/* Address Section */}
                <div className="pt-4 border-t border-border space-y-4">
                    <h3 className="text-lg font-bold text-accent flex items-center gap-2">
                        <MapPin size={18} /> Address Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-sm text-muted-foreground">Street Address</label>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                rows={2}
                                className="w-full bg-input border border-border rounded-xl px-4 py-2 text-foreground focus:outline-none focus:border-accent resize-none"
                                placeholder="#123, Main Street, Some Locality"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-muted-foreground">City</label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                className="w-full bg-input border border-border rounded-xl px-4 py-2 text-foreground focus:outline-none focus:border-accent"
                                placeholder="Bangalore"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-muted-foreground">State / Province</label>
                            <input
                                type="text"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                className="w-full bg-input border border-border rounded-xl px-4 py-2 text-foreground focus:outline-none focus:border-accent"
                                placeholder="Karnataka"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-muted-foreground">Pincode / Zip</label>
                            <input
                                type="text"
                                name="pincode"
                                value={formData.pincode}
                                onChange={handleChange}
                                className="w-full bg-input border border-border rounded-xl px-4 py-2 text-foreground focus:outline-none focus:border-accent"
                                placeholder="560001"
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-6 border-t border-border flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 bg-accent text-accent-foreground px-8 py-3 rounded-xl font-bold hover:bg-accent/90 transition-all disabled:opacity-50"
                    >
                        {loading ? "Saving..." : <><Save size={20} /> Save Client</>}
                    </button>
                </div>
            </form>
        </div>
    );
}
