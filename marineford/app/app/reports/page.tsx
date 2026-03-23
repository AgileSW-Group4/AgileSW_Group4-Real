"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { 
  FileText, Search, Filter, ArrowLeft, 
  Clock, MapPin, AlertCircle, ChevronRight 
} from "lucide-react";

// mock data for dev testing
const MOCK_REPORTS = [
  { id: "RPT-001", type: "Boat Accident", location: "Ao Nang, Krabi", time: "2024-03-20 14:30", priority: "critical", status: "Active" },
  { id: "RPT-002", type: "Illegal Fishing", location: "Similan Islands", time: "2024-03-20 12:15", priority: "urgent", status: "Investigating" },
  { id: "RPT-003", type: "Oil Spill", location: "Phuket East Coast", time: "2024-03-19 09:00", priority: "normal", status: "Resolved" },
  { id: "RPT-004", type: "Search & Rescue", location: "Ko Lipe", time: "2024-03-19 18:45", priority: "critical", status: "Active" },
];

export default function ReportsPage() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");

    // priority color mapping
    const getPriorityStyle = (p: string) => {
        switch(p) {
            case 'critical': return 'bg-red-100 text-red-700 border-red-200';
            case 'urgent': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            default: return 'bg-green-100 text-green-700 border-green-200';
        }
    };

    return (
        <div className="flex flex-col h-screen bg-slate-50 text-slate-900 overflow-hidden">
            <Navbar />

            <main className="flex-1 overflow-y-auto p-4 md:p-8">
                <div className="max-w-5xl mx-auto">
                    
                    {/* Page Header & Search */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div>
                            <button 
                                onClick={() => router.push("/")}
                                className="flex items-center gap-2 text-slate-500 hover:text-[#1e40af] mb-2 font-medium transition-colors"
                            >
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
                                placeholder="Search by ID or Location..."
                                className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl w-full md:w-80 shadow-sm outline-none focus:ring-2 focus:ring-[#1e40af] transition-all"
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Report List Layout */}
                    <div className="space-y-4 pb-10">
                        {MOCK_REPORTS.map((report) => (
                            <div 
                                key={report.id}
                                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group"
                            >
                                <div className="flex flex-col md:flex-row justify-between gap-4">
                                    <div className="flex gap-4">
                                        {/* Status Icon */}
                                        <div className={`mt-1 h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${getPriorityStyle(report.priority)}`}>
                                            <AlertCircle className="w-6 h-6" />
                                        </div>

                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <span className="font-mono text-xs font-bold text-slate-400">{report.id}</span>
                                                <h3 className="font-bold text-lg text-slate-800">{report.type}</h3>
                                                <span className={`text-[10px] uppercase px-2 py-0.5 rounded-full font-bold border ${getPriorityStyle(report.priority)}`}>
                                                    {report.priority}
                                                </span>
                                            </div>
                                            
                                            <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-slate-500 font-medium">
                                                <div className="flex items-center gap-1.5">
                                                    <MapPin className="w-4 h-4 text-slate-400" />
                                                    {report.location}
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <Clock className="w-4 h-4 text-slate-400" />
                                                    {report.time}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 pt-3 md:pt-0">
                                        <div className="text-right px-4">
                                            <p className="text-[10px] uppercase text-slate-400 font-bold">Status</p>
                                            <p className="text-sm font-bold text-slate-700">{report.status}</p>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-[#1e40af] group-hover:translate-x-1 transition-all" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}