"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
// import { MOCK_PERSONNEL } from "@/data/mockPersonnel";
//import { MOCK_PERSONNEL } from "@api/officers/route.js";
import {
  Users, UserCheck, Clock, UserX,
  Search, ChevronRight, MapPin
} from "lucide-react";

export default function PersonnelOverviewPage() {
  const router = useRouter();
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [personnelList, setPersonnelList] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/officers")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setPersonnelList(json.data);
        }
      })
      .catch((err) => console.error("Error fetching personnel:", err));
  }, []);  //ดึงข้อมูล

  const stats = {
    total:   personnelList.length,
    active:  personnelList.filter(p => p.status === "Active").length,
    standby: personnelList.filter(p => p.status === "Standby").length,
    leave:   personnelList.filter(p => p.status === "On Leave").length,
  };

  const filteredStaff = personnelList.filter(p => {
    const matchesSearch =
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.officer_id?.includes(searchTerm);
    const matchesStatus = filterStatus === "All" || p.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex flex-col h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans">
      <Navbar />

      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-7xl mx-auto pb-10">

          {/* Header */}
          <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-black text-slate-800 flex items-center gap-3 tracking-tight">
                <Users className="text-[#1e40af] w-8 h-8" /> Personnel Overview
              </h2>
              <p className="text-slate-500 font-medium">ระบบบริหารจัดการและติดตามสถานะเจ้าหน้าที่ปฏิบัติการ</p>
            </div>

            {/* Search & Filter */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by name or ID..."
                  className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm w-64 outline-none focus:ring-2 focus:ring-[#1e40af] shadow-sm transition-all"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold text-slate-600 outline-none focus:ring-2 focus:ring-[#1e40af] shadow-sm cursor-pointer"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="Active">Active Duty</option>
                <option value="Standby">Standby</option>
                <option value="On Leave">On Leave</option>
              </select>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <StatCard label="Total Personnel"  value={stats.total}   icon={<Users />}     color="blue"  />
            <StatCard label="Active Duty"       value={stats.active}  icon={<UserCheck />} color="green" />
            <StatCard label="Ready / Standby"   value={stats.standby} icon={<Clock />}     color="yellow"/>
            <StatCard label="On Leave"          value={stats.leave}   icon={<UserX />}     color="slate" />
          </div>

          {/* Table */}
          <div className="bg-white border border-slate-200 rounded-[2rem] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 border-b border-slate-100">
                  <tr className="text-[11px] uppercase font-black text-slate-400 tracking-widest">
                    <th className="px-8 py-5">Officer Information</th>
                    <th className="px-6 py-5">Unit / Assignment</th>
                    <th className="px-6 py-5">Current Location</th>
                    <th className="px-6 py-5">Status</th>
                    <th className="px-6 py-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredStaff.map((person) => (
                    <tr
                      key={person.officer_id}
                      onClick={() => router.push(`/personnel/${person.officer_id}`)}
                      className="hover:bg-blue-50/40 transition-all cursor-pointer group"
                    >
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-[#1e40af] border border-slate-200 group-hover:border-blue-300">
                            {person.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 text-sm group-hover:text-[#1e40af] transition-colors">{person.name}</p>
                            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-tighter">{person.officer_id} • {person.rank}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <p className="text-sm font-semibold text-slate-600">{person.status}</p>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-blue-400" />
                          {person.status}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <StatusBadge status={person.status} />
                      </td>
                      <td className="px-6 py-5 text-right">
                        <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-[#1e40af] inline transition-all group-hover:translate-x-1" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredStaff.length === 0 && (
              <div className="py-20 text-center text-slate-400 font-medium">
                No personnel found matching your criteria.
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles = ({
    "Active":   "bg-green-50 text-green-700 border-green-200",
    "Standby":  "bg-amber-50 text-amber-700 border-amber-200",
    "On Leave": "bg-slate-50 text-slate-500 border-slate-200",
  } as Record<string, string>)[status] ?? "bg-slate-50";

  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-tight ${styles}`}>
      {status}
    </span>
  );
}

function StatCard({ label, value, icon, color }: { label: string; value: number; icon: React.ReactNode; color: string }) {
  const colorMap: Record<string, string> = {
    blue:   "text-blue-600 bg-blue-50 border-blue-100",
    green:  "text-green-600 bg-green-50 border-green-100",
    yellow: "text-amber-600 bg-amber-50 border-amber-100",
    slate:  "text-slate-500 bg-slate-50 border-slate-200",
  };
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-5 transition-transform hover:scale-[1.02]">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 ${colorMap[color]}`}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</p>
        <p className="text-3xl font-black text-slate-800 leading-none">{value}</p>
      </div>
    </div>
  );
}