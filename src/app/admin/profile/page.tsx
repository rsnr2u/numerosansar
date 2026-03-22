import { useState, useEffect, useRef } from "react";
import {
    User, Lock, Save, Camera, Building2, Briefcase, Phone,
    Globe, MapPin, Settings2, FileText, Shield, Mail,
    Instagram, Youtube, Facebook, Trash2, CheckCircle2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL, ROUTES } from "@/lib/constants";
import { api } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { STATES, INDIA_STATES_CITIES } from "@/lib/india-data";

const Section = ({ title, icon: Icon, children, subtext }: any) => (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex flex-col">
            <div className="flex items-center gap-2 mb-1">
                <div className="p-1.5 bg-[#4B2E83]/10 rounded-lg text-[#4B2E83]">
                    <Icon size={18} />
                </div>
                <h2 className="text-lg font-bold text-slate-800">{title}</h2>
            </div>
            {subtext && <p className="text-xs text-slate-500">{subtext}</p>}
        </div>
        <div className="p-6">{children}</div>
    </div>
);

const InputGroup = ({ label, name, type = "text", placeholder, options, readOnly, disabled, value, onChange }: any) => (
    <div className="space-y-1.5">
        <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 block ml-1">{label}</label>
        {options ? (
            <select
                name={name}
                value={value ?? ''}
                onChange={onChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#4B2E83] focus:ring-1 focus:ring-[#4B2E83] transition-all"
            >
                {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
            </select>
        ) : (
            <input
                type={type}
                name={name}
                value={value ?? ''}
                onChange={onChange}
                readOnly={readOnly}
                disabled={disabled}
                placeholder={placeholder}
                className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#4B2E83] focus:ring-1 focus:ring-[#4B2E83] transition-all ${readOnly || disabled ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'text-slate-700'}`}
            />
        )}
    </div>
);

export default function RedesignedProfile() {
    const [profile, setProfile] = useState<any>({
        username: '',
        full_name: '',
        email: '',
        mobile: '',
        professional_name: '',
        brand_name: '',
        professional_title: '',
        experience_years: '',
        business_type: 'Individual',
        gst_number: '',
        alt_mobile: '',
        whatsapp: '',
        website: '',
        instagram: '',
        youtube: '',
        facebook: '',
        country: 'India',
        state: '',
        city: '',
        pincode: '',
        full_address: '',
        primary_system: 'Chaldean',
        analysis_system: 'Chaldean',
        report_header: '',
        report_footer: '',
        signature_name: '',
    });

    const [passwords, setPasswords] = useState({ new_password: '', confirm_password: '' });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [previews, setPreviews] = useState<any>({
        profile_photo: null,
        brand_logo: null,
        signature_img: null
    });
    const navigate = useNavigate();

    const fileInputs = {
        profile_photo: useRef<HTMLInputElement>(null),
        brand_logo: useRef<HTMLInputElement>(null),
        signature_img: useRef<HTMLInputElement>(null)
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await api.get('/admin/profile');
            const data = await res.json();
            if (res.ok) {
                // Sanitize data — replace null values with empty strings
                const sanitizedData = { ...data };
                Object.keys(sanitizedData).forEach(key => {
                    if (sanitizedData[key] === null) sanitizedData[key] = '';
                });

                setProfile((prev: any) => ({ ...prev, ...sanitizedData }));
                setPreviews({
                    profile_photo: data.profile_photo ? `${API_BASE_URL.replace('/api', '')}/${data.profile_photo}` : null,
                    brand_logo: data.brand_logo ? `${API_BASE_URL.replace('/api', '')}/${data.brand_logo}` : null,
                    signature_img: data.signature_img ? `${API_BASE_URL.replace('/api', '')}/${data.signature_img}` : null
                });
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
        const file = e.target.files?.[0];
        if (file) {
            setProfile({ ...profile, [field]: file });
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviews({ ...previews, [field]: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleInputChange = (e: any) => {
        const { name, value } = e.target;

        if (name === 'state') {
            setProfile((prev: any) => ({
                ...prev,
                state: value,
                city: '' // Clear city when state changes
            }));
        } else {
            setProfile((prev: any) => ({ ...prev, [name]: value ?? '' }));
        }
    };

    const handleSave = async () => {
        setSaving(true);
        const token = localStorage.getItem("admin_token") || localStorage.getItem("token");
        const formData = new FormData();

        // Append all text fields
        Object.keys(profile).forEach(key => {
            if (typeof profile[key] !== 'object' || profile[key] === null) {
                formData.append(key, profile[key]);
            } else if (profile[key] instanceof File) {
                formData.append(key, profile[key]);
            }
        });

        try {
            const res = await fetch(`${API_BASE_URL}/admin/profile`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData
            });
            if (res.ok) {
                alert("Profile and Branding updated successfully!");
                // Refresh layout by reloading or using a shared state if available
                window.location.reload();
            } else {
                const err = await res.json();
                alert(err.messages?.error || "Save failed");
            }
        } catch (e) {
            console.error(e);
            alert("Error saving profile");
        } finally {
            setSaving(false);
        }
    };

    const handleChangePassword = async () => {
        if (passwords.new_password !== passwords.confirm_password) return alert("Passwords do not match");
        if (passwords.new_password.length < 6) return alert("Password must be at least 6 characters");

        try {
            const res = await api.post('/admin/change-password', passwords);
            if (res.ok) {
                alert("Password changed successfully");
                setPasswords({ new_password: '', confirm_password: '' });
            }
        } catch (e) { console.error(e); }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4B2E83]"></div>
        </div>
    );


    return (
        <div className="max-w-6xl mx-auto py-8 px-4 pb-32">
            {/* Header */}
            <header className="mb-10 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-[#4B2E83] tracking-tighter mb-2">My Profile</h1>
                    <p className="text-slate-500 text-sm max-w-xl">
                        Manage your professional details, branding information, and consultation preferences in your personalized workspace.
                    </p>
                </div>
                <div className="text-xs font-bold text-[#C9A227] bg-[#C9A227]/10 px-4 py-2 rounded-lg border border-[#C9A227]/20 flex items-center gap-2 self-center md:self-auto">
                    <CheckCircle2 size={14} /> Professional Verified Account
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column - Main Details */}
                <div className="lg:col-span-8">

                    {/* SECTION 1 — Basic Account Info */}
                    <Section title="Basic Account Information" icon={User} subtext="Your core identification and contact points.">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 group hover:bg-white hover:border-[#4B2E83]/30 transition-all cursor-pointer relative overflow-hidden"
                                onClick={() => fileInputs.profile_photo.current?.click()}>
                                {previews.profile_photo ? (
                                    <img src={previews.profile_photo} className="w-32 h-32 rounded-xl object-cover shadow-md" alt="Profile" />
                                ) : (
                                    <div className="w-32 h-32 rounded-xl bg-[#4B2E83]/5 flex items-center justify-center text-[#4B2E83]/40">
                                        <Camera size={40} />
                                    </div>
                                )}
                                <input type="file" ref={fileInputs.profile_photo} className="hidden" onChange={(e) => handleFileChange(e, 'profile_photo')} accept="image/*" />
                                <div className="mt-4 text-[10px] font-black uppercase tracking-widest text-[#4B2E83]">Change Photo</div>
                                <div className="absolute top-2 right-2 p-1.5 bg-white rounded-lg shadow-sm text-[#4B2E83] opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Camera size={14} />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <InputGroup label="Full Name" name="full_name" placeholder="Enter your full name" value={profile.full_name} onChange={handleInputChange} />
                                <InputGroup label="Email Address" name="email" type="email" readOnly value={profile.email} onChange={handleInputChange} />
                                <InputGroup label="Mobile Number" name="mobile" readOnly value={profile.mobile} onChange={handleInputChange} />
                            </div>
                        </div>
                    </Section>

                    {/* SECTION 2 — Professional Identity */}
                    <Section title="Professional Identity" icon={Briefcase} subtext="How clients recognize your brand.">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputGroup label="Professional Name" name="professional_name" placeholder="e.g. Dr. Aris Numerologist" value={profile.professional_name} onChange={handleInputChange} />
                            <InputGroup label="Entity / Brand Name" name="brand_name" placeholder="e.g. Astro Insight Numerology" value={profile.brand_name} onChange={handleInputChange} />
                            <InputGroup label="Professional Title" name="professional_title" placeholder="e.g. Numerologist / Spiritual Consultant" value={profile.professional_title} onChange={handleInputChange} />
                            <InputGroup label="Years of Experience" name="experience_years" type="number" placeholder="Enter years" value={profile.experience_years} onChange={handleInputChange} />
                        </div>
                    </Section>

                    {/* SECTION 3 — Business Details */}
                    <Section title="Business Information" icon={Building2} subtext="Official details for billing and reports.">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputGroup label="Business Name" name="business_name" placeholder="Legal business name" value={profile.business_name} onChange={handleInputChange} />
                            <InputGroup label="Business Type" name="business_type" options={['Individual', 'Proprietorship', 'LLP', 'Private Limited']} value={profile.business_type} onChange={handleInputChange} />
                            <div className="md:col-span-2">
                                <InputGroup label="GST Number (Optional)" name="gst_number" placeholder="Enter your GSTIN" value={profile.gst_number} onChange={handleInputChange} />
                            </div>
                        </div>
                    </Section>

                    {/* SECTION 4 — Contact Information */}
                    <Section title="Contact Details" icon={Phone} subtext="Extended contact for your profile.">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputGroup label="Primary Mobile" name="mobile" disabled value={profile.mobile} onChange={handleInputChange} />
                            <InputGroup label="Alternate Phone" name="alt_mobile" placeholder="Secondary contact" value={profile.alt_mobile} onChange={handleInputChange} />
                            <InputGroup label="WhatsApp Number" name="whatsapp" placeholder="WhatsApp contact" value={profile.whatsapp} onChange={handleInputChange} />
                            <InputGroup label="Public Email" name="email" disabled value={profile.email} onChange={handleInputChange} />
                            <div className="md:col-span-2">
                                <InputGroup label="Website URL" name="website" placeholder="https://yourwebsite.com" value={profile.website} onChange={handleInputChange} />
                            </div>
                            <div className="space-y-4 md:col-span-2 mt-2">
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 block ml-1">Social Media Links</label>
                                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                                        <Instagram size={18} className="text-pink-600" />
                                        <input name="instagram" value={profile.instagram || ''} onChange={handleInputChange} placeholder="Instagram Handle" className="bg-transparent text-sm w-full outline-none" />
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                                    <Youtube size={18} className="text-red-600" />
                                    <input name="youtube" value={profile.youtube || ''} onChange={handleInputChange} placeholder="YouTube Channel Link" className="bg-transparent text-sm w-full outline-none" />
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                                    <Facebook size={18} className="text-blue-600" />
                                    <input name="facebook" value={profile.facebook || ''} onChange={handleInputChange} placeholder="Facebook Page Link" className="bg-transparent text-sm w-full outline-none" />
                                </div>
                            </div>
                        </div>
                    </Section>

                    {/* SECTION 5 — Address Information */}
                    <Section title="Location Details" icon={MapPin} subtext="Your base of operations.">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputGroup label="Country" name="country" placeholder="India" value={profile.country} onChange={handleInputChange} disabled />
                            <InputGroup label="State" name="state" options={['Select State', ...STATES]} value={profile.state} onChange={handleInputChange} />
                            <InputGroup
                                label="City"
                                name="city"
                                options={['Select City', ...(profile.state ? (INDIA_STATES_CITIES[profile.state] || []) : [])]}
                                value={profile.city}
                                onChange={handleInputChange}
                                disabled={!profile.state}
                            />
                            <InputGroup label="Pincode" name="pincode" placeholder="6-digit pincode" value={profile.pincode} onChange={handleInputChange} />
                            <div className="md:col-span-2">
                                <InputGroup label="Full Address" name="full_address" placeholder="Room/Flat No, Building, Area" value={profile.full_address} onChange={handleInputChange} />
                            </div>
                        </div>
                    </Section>
                </div>

                {/* Right Column - Preferences & Security */}
                <div className="lg:col-span-4">

                    {/* SECTION 6 — Consultation Preferences */}
                    <Section title="Numerology Settings" icon={Settings2}>
                        <div className="space-y-6">
                            <InputGroup label="Primary System" name="primary_system" options={['Chaldean', 'Pythagorean', 'Both']} value={profile.primary_system} onChange={handleInputChange} />
                            <InputGroup label="Default Analysis" name="analysis_system" options={['Chaldean', 'Pythagorean', 'Auto Compare']} value={profile.analysis_system} onChange={handleInputChange} />
                        </div>
                    </Section>

                    {/* SECTION 7 — Report Branding */}
                    <Section title="Report Settings" icon={FileText} subtext="Customize your generated PDF reports.">
                        <div className="space-y-6">
                            <InputGroup label="Report Header Name" name="report_header" placeholder="Brand name on header" value={profile.report_header} onChange={handleInputChange} />
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 block ml-1">Report Footer Note</label>
                                <textarea
                                    name="report_footer"
                                    value={profile.report_footer || ''}
                                    onChange={handleInputChange}
                                    placeholder="Enter footer tagline or disclaimer"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#4B2E83] focus:ring-1 focus:ring-[#4B2E83] transition-all h-24 text-slate-700"
                                />
                            </div>
                            <InputGroup label="Signature Name" name="signature_name" placeholder="Name for signature" value={profile.signature_name} onChange={handleInputChange} />

                            {/* Brand Logo Upload */}
                            <div className="p-4 bg-[#C9A227]/5 rounded-xl border border-[#C9A227]/20">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#C9A227] block mb-3">Brand Logo</label>
                                <div className="flex flex-col items-center gap-3">
                                    <div className="w-full h-24 bg-white rounded-lg border border-slate-100 flex items-center justify-center p-2">
                                        {previews.brand_logo ? (
                                            <img src={previews.brand_logo} className="max-h-full object-contain" alt="Logo" />
                                        ) : (
                                            <Globe size={24} className="text-slate-200" />
                                        )}
                                    </div>
                                    <button onClick={() => fileInputs.brand_logo.current?.click()} className="text-[9px] font-black uppercase tracking-widest text-[#4B2E83] hover:underline underline-offset-4">
                                        Upload Logo
                                    </button>
                                    <input type="file" ref={fileInputs.brand_logo} className="hidden" onChange={(e) => handleFileChange(e, 'brand_logo')} accept="image/*" />
                                </div>
                            </div>

                            {/* Signature Upload */}
                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-3">Signature Image</label>
                                <div className="flex flex-col items-center gap-3">
                                    <div className="w-full h-20 bg-white rounded-lg border border-slate-100 flex items-center justify-center p-2">
                                        {previews.signature_img ? (
                                            <img src={previews.signature_img} className="max-h-full object-contain" alt="Signature" />
                                        ) : (
                                            <FileText size={20} className="text-slate-100" />
                                        )}
                                    </div>
                                    <button onClick={() => fileInputs.signature_img.current?.click()} className="text-[9px] font-black uppercase tracking-widest text-[#4B2E83] hover:underline underline-offset-4">
                                        Upload Signature
                                    </button>
                                    <input type="file" ref={fileInputs.signature_img} className="hidden" onChange={(e) => handleFileChange(e, 'signature_img')} accept="image/*" />
                                </div>
                            </div>
                        </div>
                    </Section>

                    {/* SECTION 8 — Security Settings */}
                    <Section title="Security" icon={Shield}>
                        <div className="space-y-4">
                            <InputGroup label="New Password" name="new_password" type="password" value={passwords.new_password} onChange={(e: any) => setPasswords({ ...passwords, new_password: e.target.value })} />
                            <InputGroup label="Confirm Password" name="confirm_password" type="password" value={passwords.confirm_password} onChange={(e: any) => setPasswords({ ...passwords, confirm_password: e.target.value })} />
                            <button onClick={handleChangePassword} className="w-full py-2.5 bg-slate-800 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-2 mt-2 shadow-lg">
                                <Lock size={14} /> Update Password
                            </button>
                        </div>
                    </Section>

                </div>
            </div>

            {/* Sticky Save Button */}
            <div className="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-md border-t border-slate-200 p-6 z-40">
                <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
                    <div className="hidden md:block">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Changes not yet saved</p>
                        <p className="text-[10px] text-slate-500">Pressing save will immediately update your dashboard and report branding.</p>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full md:w-auto px-10 py-4 bg-[#4B2E83] text-white rounded-xl text-sm font-black uppercase tracking-widest hover:shadow-2xl hover:translate-y-[-2px] transition-all flex items-center justify-center gap-3 shadow-[0_10px_30px_-10px_rgba(75,46,131,0.5)] active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {saving ? (
                            <> <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-b-white"></div> Working... </>
                        ) : (
                            <> <Save size={18} /> Save Final Profile </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
