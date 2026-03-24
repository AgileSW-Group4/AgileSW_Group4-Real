"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { FileText, Search, ArrowLeft, Clock, MapPin, AlertCircle, ChevronRight, Trash2, ChevronDown } from "lucide-react";

type Incident = {
  id: string;
  title: string;
  status: string;
  risk_level: number;
  latitude: number;
  longitude: number;
  created_at: string;
  responsible_unit: string;
  description: string;
};

const riskMap: Record<number, { label: string; style: string }> = {
  1: { label: "Normal",   style: "bg-green-100 text-green-700 border-green-200" },
  2: { label: "Urgent",   style: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  3: { label: "Critical", style: "bg-red-100 text-red-700 border-red-200" },
};

export default function ReportsPage() {
  const router = useRouter();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);       // ← expand description
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null); // ← confirm delete

  useEffect(() => {
    fetch("/api/incidents")
      .then((res) => res.json())
      .then((json) => setIncidents(json.data || []));
  }, []);

  const filtered = incidents.filter((inc) =>
    inc.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inc.responsible_unit.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ลบ incident
  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/incidents?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      setIncidents((prev) => prev.filter((inc) => inc.id !== id));
    }
    setDeleteTargetId(null);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 text-slate-900 overflow-hidden">
      <Navbar />
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-5xl mx-auto">

          {/* Header & Search */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <button onClick={() => router.push("/")} className="flex items-center gap-2 text-slate-500 hover:text-[#1e40af] mb-2 font-medium transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Map
              </button>
              <h2 className="text-3xl font-extrabold text-slate-800 flex items-center gap-3">
                <FileText className="text-[#1e40af] w-8 h-8" /> Incident Logs
              </h2>
            </div>
            <div className="relative group">
              <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400 group-focus-within:text-[#1e40af]" />
              <input
                type="text"
                placeholder="Search by ID or Unit..."
                className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl w-full md:w-80 shadow-sm outline-none focus:ring-2 focus:ring-[#1e40af] transition-all"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Incident List */}
          <div className="space-y-4 pb-10">
            {filtered.map((inc) => {
              const risk = riskMap[inc.risk_level] || riskMap[1];
              const isExpanded = expandedId === inc.id;

              return (
                <div key={inc.id} className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-200 transition-all">
                  
                  {/* Main Row */}
                  <div className="flex flex-col md:flex-row justify-between gap-4 p-5">
                    <div className="flex gap-4">
                      <div className={`mt-1 h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${risk.style}`}>
                        <AlertCircle className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-mono text-xs font-bold text-slate-400">{inc.id}</span>
                          <h3 className="font-bold text-lg text-slate-800">{inc.title}</h3>
                          <span className={`text-[10px] uppercase px-2 py-0.5 rounded-full font-bold border ${risk.style}`}>
                            {risk.label}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-slate-500 font-medium">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4 text-slate-400" />
                            {inc.responsible_unit}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4 text-slate-400" />
                            {new Date(inc.created_at).toLocaleString("th-TH")}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 pt-3 md:pt-0">
                      <div className="text-right px-4">
                        <p className="text-[10px] uppercase text-slate-400 font-bold">Status</p>
                        <p className="text-sm font-bold text-slate-700">{inc.status}</p>
                      </div>

                      {/* ปุ่ม expand description */}
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : inc.id)}
                        className="p-2 rounded-xl hover:bg-slate-100 transition-all"
                      >
                        <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                      </button>

                      {/* ปุ่มลบ */}
                      <button
                        onClick={() => setDeleteTargetId(inc.id)}
                        className="p-2 rounded-xl hover:bg-red-50 text-slate-300 hover:text-red-500 transition-all"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Description Expand */}
                  {isExpanded && (
                    <div className="px-5 pb-5 border-t border-slate-100 pt-4">
                      <p className="text-sm text-slate-500 font-medium">
                        {inc.description || "ไม่มีรายละเอียดเพิ่มเติม"}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </main>

      {/* Confirm Delete Modal */}
      {deleteTargetId && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full mx-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="font-bold text-lg text-slate-800">ยืนยันการลบ</h3>
            </div>
            <p className="text-sm text-slate-500 mb-6">
              ต้องการลบ <span className="font-bold text-slate-700">{deleteTargetId}</span> ใช่หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTargetId(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-all"
              >
                ยกเลิก
              </button>
              <button
                onClick={() => handleDelete(deleteTargetId)}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold transition-all"
              >
                ลบ
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}