"use client";

import { useState, useEffect } from "react"; // เพิ่ม useEffect สำหรับเช็คเน็ต
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { 
  ArrowLeft, MapPin, Clock, ShieldAlert, 
  FileText, Camera, Send, Anchor, WifiOff // เพิ่ม WifiOff สำหรับแสดงสถานะ
} from "lucide-react";

export default function CreateReportPage() {
    const router = useRouter();

    const [formData, setFormData] = useState({
     id: "",
     title: "",
     risk_level: "",
     latitude: "",
     longitude: "",
     created_at: "",
     description: "",
     responsible_unit: "",
     status: "รอดำเนินการ",
    });


  
    // priority state: toggle for visual feedback
    const [priority, setPriority] = useState('normal'); 
    const [loading, setLoading] = useState(false);
    
    // --- ส่วนที่เพิ่ม: State สำหรับเช็คสัญญาณอินเทอร์เน็ต ---
    const [isOnline, setIsOnline] = useState(true);

    useEffect(() => {
        // อัปเดตสถานะออนไลน์ปัจจุบัน
        setIsOnline(navigator.onLine);
        const goOnline = () => setIsOnline(true);
        const goOffline = () => setIsOnline(false);

        window.addEventListener('online', goOnline);
        window.addEventListener('offline', goOffline);

        return () => {
            window.removeEventListener('online', goOnline);
            window.removeEventListener('offline', goOffline);
        };
    }, []);

    // handles form submission with mock delay
    const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  const payload = {
  id: `INC${String(Math.floor(Math.random() * 9000) + 1000)}`,
  title: formData.title,
  description: formData.description,
  latitude: formData.latitude ? parseFloat(formData.latitude) : 0,
  longitude: formData.longitude ? parseFloat(formData.longitude) : 0,
  risk_level: priority === "normal" ? 1 : priority === "urgent" ? 2 : 3,
  status: formData.status,
  responsible_unit: formData.responsible_unit || "ไม่ระบุ", // ← เพิ่ม
  created_at: formData.created_at
    ? new Date(formData.created_at).toISOString()
    : new Date().toISOString(),
};

  if (!navigator.onLine) {
    // เดิม — เก็บ offline ไว้ก่อน
    const offlineReports = JSON.parse(localStorage.getItem("offline_reports") || "[]");
    offlineReports.push(payload);
    localStorage.setItem("offline_reports", JSON.stringify(offlineReports));
    alert("ไม่มีสัญญาณ บันทึกลงเครื่องแล้ว");
  } else {

    console.log("payload:", payload);
    // ✅ เปลี่ยนจาก simulation → POST จริง
    const res = await fetch("/api/incidents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      alert("เกิดข้อผิดพลาด ไม่สามารถบันทึกได้");
      setLoading(false);
      return;
    }

    const result = await res.json();
    console.log("POST result:", result);
    alert("บันทึกสำเร็จ!");
  }

  setLoading(false);
  router.push("/reports");
};

    return (
        /* FIX: overflow-hidden on root and overflow-y-auto on main fixes scroll issues */
        <div className="flex flex-col h-screen bg-slate-50 text-slate-900 overflow-hidden">
            <Navbar />

            {/* Scrollable content area */}
            <main className="flex-1 overflow-y-auto p-4 md:p-8">
                <div className="max-w-3xl mx-auto pb-10">
                    
                    {/* --- ส่วนที่เพิ่ม: แสดงแถบแจ้งเตือนเมื่อไม่มีอินเทอร์เน็ต (จะไม่รบกวน UI เดิม) --- */}
                    {!isOnline && (
                        <div className="mb-4 p-3 bg-amber-100 border border-amber-200 text-amber-800 rounded-xl flex items-center gap-2 text-sm font-medium animate-pulse">
                            <WifiOff className="w-4 h-4" />
                            ขณะนี้ไม่มีอินเทอร์เน็ต ข้อมูลจะถูกบันทึกลงในเครื่อง (Local Database)
                        </div>
                    )}

                    {/* Header: navigation and page title */}
                    <div className="flex items-center justify-between mb-8">
                        <button 
                            type="button"
                            onClick={() => router.back()}
                            className="flex items-center gap-2 text-slate-500 hover:text-[#1e40af] transition-colors font-semibold"
                        >
                            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                        </button>
                        <div className="text-right">
                            <h2 className="text-2xl font-bold text-[#1e40af] flex items-center gap-2 justify-end">
                                <FileText className="w-6 h-6" /> Incident Report
                            </h2>
                            <p className="text-xs text-slate-400 font-medium">Marine Police Operations Center</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        
                        {/* Priority selection: changes color and scale on active */}
                        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                            <h3 className="text-slate-700 font-bold mb-4 flex items-center gap-2 text-sm uppercase font-mono">
                                <ShieldAlert className="w-4 h-4 text-[#1e40af]" /> Priority Level
                            </h3>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setPriority('normal')}
                                    className={`flex-1 py-3 rounded-xl font-bold border transition-all ${
                                        priority === 'normal' 
                                        ? 'bg-green-600 text-white border-green-700 shadow-md scale-[1.02]' 
                                        : 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                                    }`}
                                >
                                    Normal
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setPriority('urgent')}
                                    className={`flex-1 py-3 rounded-xl font-bold border transition-all ${
                                        priority === 'urgent' 
                                        ? 'bg-yellow-500 text-white border-yellow-600 shadow-md scale-[1.02]' 
                                        : 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100'
                                    }`}
                                >
                                    Urgent
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setPriority('critical')}
                                    className={`flex-1 py-3 rounded-xl font-bold border transition-all ${
                                        priority === 'critical' 
                                        ? 'bg-red-600 text-white border-red-700 shadow-md scale-[1.02]' 
                                        : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                                    }`}
                                >
                                    Critical
                                </button>
                            </div>
                        </section>

                        {/* Incident Type selection */}
                        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
  <h3 className="text-slate-700 font-bold mb-4 flex items-center gap-2 text-sm uppercase font-mono">
    <Anchor className="w-4 h-4 text-[#1e40af]" /> Incident Title
  </h3>
  <input
    type="text"
    placeholder="Enter incident title..."
    value={formData.title}
    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
  />
</section>

                        {/* Geographic and Temporal data */}
                        {/* Geographic and Temporal data */}
<section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
  <h3 className="text-slate-700 font-bold mb-4 flex items-center gap-2 text-sm uppercase font-mono">
    <MapPin className="w-4 h-4 text-[#1e40af]" /> Location & Time
  </h3>
  <div className="space-y-4">
    
    {/* แยก Lat / Lng */}
    <div className="flex gap-3">
      <div className="relative group flex-1">
        <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-slate-400 group-focus-within:text-[#1e40af]" />
        <input
          type="number"
          placeholder="Latitude"
          value={formData.latitude}
          onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
          className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
        />
      </div>
      <div className="relative group flex-1">
        <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-slate-400 group-focus-within:text-[#1e40af]" />
        <input
          type="number"
          placeholder="Longitude"
          value={formData.longitude}
          onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
          className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
        />
      </div>
    </div>

    {/* Datetime */}
    <div className="relative group">
      <Clock className="absolute left-3 top-3.5 w-4 h-4 text-slate-400 group-focus-within:text-[#1e40af]" />
      <input
        type="datetime-local"
        value={formData.created_at}
        onChange={(e) => setFormData({ ...formData, created_at: e.target.value })}
        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
      />
    </div>

  </div>
</section>

                        {/* Detailed Description and File Upload */}
                        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
  <h3 className="text-slate-700 font-bold mb-4 flex items-center gap-2 text-sm uppercase font-mono">
    <FileText className="w-4 h-4 text-[#1e40af]" /> Detailed Information
  </h3>
  <textarea
    rows={4}
    placeholder="Describe the situation, vessel names, number of casualties, etc..."
    value={formData.description}
    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all mb-4"
  />

  <label className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center bg-slate-50 hover:bg-blue-50 hover:border-[#1e40af] transition-all cursor-pointer group">
    <Camera className="w-10 h-10 text-slate-300 group-hover:text-[#1e40af] mb-2" />
    <span className="text-sm text-slate-400 group-hover:text-slate-600 font-medium">Upload Scene Photo / Evidence</span>
    <input type="file" className="hidden" accept="image/*" />
  </label>
</section>

{/* responsible_unit */}
<section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
  <h3 className="text-slate-700 font-bold mb-4 flex items-center gap-2 text-sm uppercase font-mono">
    <Anchor className="w-4 h-4 text-[#1e40af]" /> Responsible Unit
  </h3>
  <input
    type="text"
    placeholder="Enter responsible unit..."
    value={formData.responsible_unit}
    onChange={(e) => setFormData({ ...formData, responsible_unit: e.target.value })}
    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
  />
</section>

{/* Status */}
<section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
  <h3 className="text-slate-700 font-bold mb-4 flex items-center gap-2 text-sm uppercase font-mono">
    <ShieldAlert className="w-4 h-4 text-[#1e40af]" /> Status
  </h3>
  <select
    value={formData.status}
    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all cursor-pointer"
  >
    <option value="รอดำเนินการ">รอดำเนินการ</option>
    <option value="กำลังดำเนินการ">กำลังดำเนินการ</option>
    <option value="เสร็จสิ้น">เสร็จสิ้น</option>
  </select>
</section>
                        {/* Submit Button */}
                        <button 
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-[#1e40af] hover:bg-[#1e3a8a] text-white rounded-2xl font-bold shadow-lg shadow-blue-200 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                        >
                            <Send className="w-5 h-5" />
                            {loading 
                              ? "Submitting Report..." 
                              : isOnline 
                                ? "Submit Incident Report" 
                                : "Save Offline Report"}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
}