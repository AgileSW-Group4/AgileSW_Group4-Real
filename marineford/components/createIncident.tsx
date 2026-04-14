
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    AlertTriangle,
    Calendar,
    Clock,
    FileText,
    Ship,
    MapPin,
    Upload,
    X,
    ChevronDown,
    Send,
    ArrowLeft,
    Sparkles,
    Shield,
    Zap,
    Info,
    Video,
    Users,
    Flame,
} from "lucide-react";

// Risk level config (1–5 mapped from API risk_level)
const RISK_LEVELS = [
    { value: 1, label: "1", desc: "Very Low", color: "bg-emerald-500", ring: "ring-emerald-200", icon: Info },
    { value: 2, label: "2", desc: "Low", color: "bg-lime-500", ring: "ring-lime-200", icon: Shield },
    { value: 3, label: "3", desc: "Medium", color: "bg-amber-500", ring: "ring-amber-200", icon: AlertTriangle },
    { value: 4, label: "4", desc: "High", color: "bg-orange-500", ring: "ring-orange-200", icon: Flame },
    { value: 5, label: "5", desc: "Critical", color: "bg-red-500", ring: "ring-red-200", icon: Zap },
] as const;

const CATEGORIES = [
    "Medical Emergency",
    "Engine Failure",
    "Weather Advisory",
    "Piracy Alert",
    "Collision Risk",
    "Oil Spill",
    "Navigation Error",
    "Communication Loss",
    "Fire",
    "Other",
];

const STATUS_OPTIONS = [
    "รอดำเนินการ",
    "กำลังดำเนินการ",
    "เสร็จสิ้น",
    "ยกเลิก",
];

export function CreateIncident() {
    const router = useRouter();

    // Form state — aligned to API schema
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [riskLevel, setRiskLevel] = useState<number>(3);
    const [status, setStatus] = useState("รอดำเนินการ");
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [time, setTime] = useState(
        new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
    );
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [responsibleUnit, setResponsibleUnit] = useState("");
    const [vdoUrl, setVdoUrl] = useState("");
    const [files, setFiles] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const incidentId = `INC-${Math.floor(200 + Math.random() * 800)}`;

    const handleFileAdd = () => {
        const name = `report_${files.length + 1}.pdf`;
        setFiles([...files, name]);
    };
    const handleRemoveFile = (idx: number) => setFiles(files.filter((_, i) => i !== idx));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Build payload matching API schema
        const payload = {
            id: incidentId,
            title,
            description,
            latitude: parseFloat(latitude) || null,
            longitude: parseFloat(longitude) || null,
            risk_level: riskLevel,
            status,
            responsible_unit: responsibleUnit,
            vdo_url: vdoUrl || null,
        };

        try {
            const res = await fetch("/api/getIncident", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                console.log("Incident created successfully");
            } else {
                console.error("Failed to create incident");
            }
        } catch (error) {
            console.error("Error creating incident:", error);
        }

        console.log("Submitting payload:", payload);

        setTimeout(() => {
            setIsSubmitting(false);
            setShowSuccess(true);
            setTimeout(() => router.push("/"), 2000);
        }, 1500);
    };

    if (showSuccess) {
        return (
            <div className="flex-1 flex items-center justify-center p-8 form-enter">
                <div className="bg-white rounded-2xl shadow-xl border border-emerald-100 p-10 text-center max-w-md">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                        <Sparkles className="w-8 h-8 text-emerald-500" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-800 mb-2">Incident Created!</h2>
                    <p className="text-sm text-slate-500 mb-1">
                        Incident <span className="font-mono font-bold text-emerald-600">{incidentId}</span> has been logged successfully.
                    </p>
                    <p className="text-xs text-slate-400">Redirecting to dashboard…</p>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
            <div className="max-w-4xl mx-auto p-6 pb-12 space-y-6 form-enter">

                {/* Page Header */}
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => router.push("/")}
                        className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-blue-600 hover:border-blue-300 transition-all shadow-sm hover:shadow"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-slate-800 tracking-tight">Create New Incident</h1>
                        <p className="text-xs text-slate-400 mt-0.5">Fill in the details below to log a new maritime event</p>
                    </div>
                </div>

                {/* ── Section 1: Basic Info ── */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                    <div className="px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-700 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-white/90" />
                        <h2 className="text-sm font-semibold text-white">Basic Information</h2>
                    </div>
                    <div className="p-5 space-y-4">
                        {/* Title */}
                        <div>
                            <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">
                                Incident Title <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g. เรือประมงไฟไหม้กลางอ่าว"
                                className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg bg-white text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                        </div>

                        {/* Category & Status Row */}
                        <div className="grid grid-cols-2 gap-4">
                            {/* Category */}
                            <div>
                                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">
                                    Category <span className="text-red-400">*</span>
                                </label>
                                <div className="relative">
                                    <select
                                        required
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="w-full pl-4 pr-10 py-2.5 text-sm border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none transition-all"
                                    >
                                        <option value="">Select category…</option>
                                        {CATEGORIES.map((c) => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                </div>
                            </div>

                            {/* Status */}
                            <div>
                                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">
                                    Status <span className="text-red-400">*</span>
                                </label>
                                <div className="relative">
                                    <select
                                        required
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                        className="w-full pl-4 pr-10 py-2.5 text-sm border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none transition-all"
                                    >
                                        {STATUS_OPTIONS.map((s) => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        {/* Risk Level */}
                        <div>
                            <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">
                                Risk Level <span className="text-red-400">*</span>
                            </label>
                            <div className="flex gap-2">
                                {RISK_LEVELS.map((opt) => {
                                    const Icon = opt.icon;
                                    const selected = riskLevel === opt.value;
                                    return (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            onClick={() => setRiskLevel(opt.value)}
                                            className={`flex-1 flex flex-col items-center justify-center gap-1 py-2.5 rounded-lg text-xs font-bold transition-all border-2 ${selected
                                                ? `${opt.color} text-white border-transparent ring-2 ${opt.ring} shadow-md scale-[1.02]`
                                                : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
                                                }`}
                                        >
                                            <Icon className="w-3.5 h-3.5" />
                                            <span className="text-base font-extrabold leading-none">{opt.label}</span>
                                            <span className={`text-[9px] uppercase tracking-wider ${selected ? "text-white/80" : "text-slate-400"}`}>{opt.desc}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Section 2: Date & Time ── */}
                {/* <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                    <div className="px-5 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-white/90" />
                        <h2 className="text-sm font-semibold text-white">Date & Time</h2>
                    </div>
                    <div className="p-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">
                                    Date <span className="text-red-400">*</span>
                                </label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400 pointer-events-none" />
                                    <input
                                        type="date"
                                        required
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">
                                    Time <span className="text-red-400">*</span>
                                </label>
                                <div className="relative">
                                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400 pointer-events-none" />
                                    <input
                                        type="time"
                                        required
                                        value={time}
                                        onChange={(e) => setTime(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div> */}

                {/* ── Section 3: Description ── */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                    <div className="px-5 py-3 bg-gradient-to-r from-violet-600 to-violet-700 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-white/90" />
                        <h2 className="text-sm font-semibold text-white">Description</h2>
                    </div>
                    <div className="p-5">
                        <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">
                            Detailed Account <span className="text-red-400">*</span>
                        </label>
                        <textarea
                            required
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={5}
                            placeholder="เรือประมงเกิดไฟไหม้บริเวณห้องเครื่อง ลูกเรือ 3 คนติดอยู่บนเรือ…"
                            className="w-full px-4 py-3 text-sm border border-slate-200 rounded-lg bg-white text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all resize-none leading-relaxed"
                        />
                        <p className="text-[10px] text-slate-400 mt-1.5">{description.length} characters</p>
                    </div>
                </div>

                {/* ── Section 4: Location (latitude / longitude) ── */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                    <div className="px-5 py-3 bg-gradient-to-r from-cyan-600 to-cyan-700 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-white/90" />
                        <h2 className="text-sm font-semibold text-white">Location</h2>
                    </div>
                    <div className="p-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">
                                    Latitude
                                </label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400 pointer-events-none" />
                                    <input
                                        type="number"
                                        step="any"
                                        value={latitude}
                                        onChange={(e) => setLatitude(e.target.value)}
                                        placeholder="e.g. 13.762000"
                                        className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-lg bg-white text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">
                                    Longitude
                                </label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400 pointer-events-none" />
                                    <input
                                        type="number"
                                        step="any"
                                        value={longitude}
                                        onChange={(e) => setLongitude(e.target.value)}
                                        placeholder="e.g. 100.498000"
                                        className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-lg bg-white text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Section 5: Responsible Unit ── */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                    <div className="px-5 py-3 bg-gradient-to-r from-teal-600 to-teal-700 flex items-center gap-2">
                        <Users className="w-4 h-4 text-white/90" />
                        <h2 className="text-sm font-semibold text-white">Responsible Unit</h2>
                    </div>
                    <div className="p-5">
                        <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">
                            Responsible Unit <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                            <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-teal-400 pointer-events-none" />
                            <input
                                type="text"
                                required
                                value={responsibleUnit}
                                onChange={(e) => setResponsibleUnit(e.target.value)}
                                placeholder="e.g. หน่วยกู้ภัยทางน้ำใต้"
                                className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-lg bg-white text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* ── Section 6: Video URL ── */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                    <div className="px-5 py-3 bg-gradient-to-r from-purple-600 to-purple-700 flex items-center gap-2">
                        <Video className="w-4 h-4 text-white/90" />
                        <h2 className="text-sm font-semibold text-white">Video Evidence</h2>
                    </div>
                    <div className="p-5">
                        <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">
                            Video URL (vdo_url)
                        </label>
                        <div className="relative">
                            <Video className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400 pointer-events-none" />
                            <input
                                type="url"
                                value={vdoUrl}
                                onChange={(e) => setVdoUrl(e.target.value)}
                                placeholder="https://example.com/vdo/fire_rescue.mp4"
                                className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-lg bg-white text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* ── Section 7: Attachments ── */}
                {/* <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                    <div className="px-5 py-3 bg-gradient-to-r from-rose-600 to-rose-700 flex items-center gap-2">
                        <Upload className="w-4 h-4 text-white/90" />
                        <h2 className="text-sm font-semibold text-white">Attachments</h2>
                    </div>
                    <div className="p-5 space-y-3">
                        <button
                            type="button"
                            onClick={handleFileAdd}
                            className="w-full border-2 border-dashed border-slate-200 rounded-lg py-8 flex flex-col items-center gap-2 text-slate-400 hover:border-blue-300 hover:text-blue-500 hover:bg-blue-50/30 transition-all group"
                        >
                            <div className="w-10 h-10 rounded-full bg-slate-100 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
                                <Upload className="w-5 h-5" />
                            </div>
                            <span className="text-xs font-medium">Click to add files or drag & drop</span>
                            <span className="text-[10px] text-slate-300">PDF, JPG, PNG (max 25 MB)</span>
                        </button>
                        {files.length > 0 && (
                            <div className="space-y-2">
                                {files.map((f, i) => (
                                    <div key={i} className="flex items-center justify-between bg-slate-50 rounded-lg px-3 py-2 border border-slate-100">
                                        <div className="flex items-center gap-2">
                                            <FileText className="w-4 h-4 text-rose-400" />
                                            <span className="text-xs text-slate-600 font-medium">{f}</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveFile(i)}
                                            className="p-1 rounded hover:bg-red-100 text-slate-400 hover:text-red-500 transition-colors"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div> */}

                {/* ── Action Buttons ── */}
                <div className="flex items-center justify-between pt-2">
                    <button
                        type="button"
                        onClick={() => router.push("/")}
                        className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Submitting…
                            </>
                        ) : (
                            <>
                                <Send className="w-4 h-4" />
                                Submit Incident
                            </>
                        )}
                    </button>
                </div>
            </div>
        </form>
    );
}