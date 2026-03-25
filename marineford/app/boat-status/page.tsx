"use client";

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
// สมมติว่าไฟล์ Navbar อยู่ที่นี่ หากยังไม่มีสามารถสร้างคอมโพเนนต์ง่ายๆ รอไว้ได้
import { Navbar } from "@/components/Navbar"; 

// --- ข้อมูลจำลองสำหรับกราฟ ---
const chartData = [
  { name: 'Ready (พร้อมใช้งาน)', value: 55, color: '#22c55e' },
  { name: 'Critical (วิกฤต)', value: 15, color: '#ef4444' },
  { name: 'Warning (เฝ้าระวัง)', value: 20, color: '#facc15' },
  { name: 'N/A (ไม่มีข้อมูล)', value: 10, color: '#e5e7eb' },
];

// --- ข้อมูลจำลองสำหรับตารางเรือ ---
const boatData = [
  { id: 'Boat 001', fuel: 'ready', equipment: 'ready', overall: 'ready' },
  { id: 'Boat 002', fuel: 'warning', equipment: 'critical', overall: 'critical' },
  { id: 'Boat 003', fuel: 'critical', equipment: 'warning', overall: 'critical' },
  { id: 'Boat 004', fuel: 'ready', equipment: 'ready', overall: 'ready' },
  { id: 'Boat 005', fuel: 'ready', equipment: 'ready', overall: 'none' },
];

// --- คอมโพเนนต์จุดแสดงสถานะ ---
const StatusDot = ({ status }: { status: string }) => {
  const colors: Record<string, string> = {
    ready: 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]',
    critical: 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]',
    warning: 'bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.6)]',
    none: 'bg-gray-300',
  };
  return (
    <div className="flex justify-center">
      <div className={`w-3.5 h-3.5 rounded-full ${colors[status] || 'bg-gray-200'}`} />
    </div>
  );
};

// --- คอมโพเนนต์อธิบายความหมายสี (Legend) ---
const StatusLegend = () => (
  <div className="flex flex-wrap gap-x-6 gap-y-2 mb-6 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
    <div className="flex items-center gap-2">
      <div className="w-3 h-3 rounded-full bg-green-500"></div>
      <span className="text-xs font-medium text-slate-600">Ready: พร้อมปฏิบัติงาน</span>
    </div>
    <div className="flex items-center gap-2">
      <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
      <span className="text-xs font-medium text-slate-600">Warning: เฝ้าระวัง/ทรัพยากรต่ำ</span>
    </div>
    <div className="flex items-center gap-2">
      <div className="w-3 h-3 rounded-full bg-red-500"></div>
      <span className="text-xs font-medium text-slate-600">Critical: วิกฤต/งดออกเรือ</span>
    </div>
    <div className="flex items-center gap-2">
      <div className="w-3 h-3 rounded-full bg-gray-300"></div>
      <span className="text-xs font-medium text-slate-600">N/A: ไม่มีข้อมูล</span>
    </div>
  </div>
);

export default function BoatStatusPage() {
  
  // ฟังก์ชันวาดกราฟวงกลม
  const renderPie = (title: string) => (
    <div className="flex flex-col items-center bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="w-32 h-32">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie 
              data={chartData} 
              innerRadius={30} // ปรับเป็น Donut Chart เพื่อความทันสมัย
              outerRadius={50} 
              dataKey="value" 
              startAngle={90} 
              endAngle={450}
              paddingAngle={2}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <p className="text-sm font-bold text-slate-700 mt-3">{title}</p>
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden">
      {/* 1. Top Navbar */}
      <Navbar />

      {/* 2. Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Fleet Status Overview</h1>
            <p className="text-slate-500 text-sm mt-1">ระบบติดตามความพร้อมของกองเรือแบบเรียลไทม์</p>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
            {renderPie("ความพร้อมน้ำมัน")}
            {renderPie("ความพร้อมอุปกรณ์")}
            {renderPie("ความพร้อมรวมกองเรือ")}
          </div>

          {/* Legend (คำอธิบายสี) */}
          <StatusLegend />

          {/* Table Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden mb-10">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 text-slate-500 text-[11px] uppercase tracking-widest border-b border-slate-100">
                    <th className="px-8 py-6 font-bold">Boat ID / ชื่อลำเรือ</th>
                    <th className="px-6 py-6 text-center font-bold">น้ำมันเชื้อเพลิง</th>
                    <th className="px-6 py-6 text-center font-bold">สถานะอุปกรณ์</th>
                    <th className="px-6 py-6 text-center font-bold">ความพร้อมปฏิบัติงาน</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {boatData.map((boat) => (
                    <tr key={boat.id} className="hover:bg-blue-50/30 transition-colors group">
                      <td className="px-8 py-5">
                        <span className="font-bold text-slate-700 group-hover:text-blue-600 transition-colors">
                          {boat.id}
                        </span>
                      </td>
                      <td className="px-6 py-5"><StatusDot status={boat.fuel} /></td>
                      <td className="px-6 py-5"><StatusDot status={boat.equipment} /></td>
                      <td className="px-6 py-5"><StatusDot status={boat.overall} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Table Footer / Pagination Placeholder */}
            <div className="bg-slate-50/50 px-8 py-4 border-t border-slate-100">
              <p className="text-[10px] text-slate-400 text-right uppercase tracking-tighter">
                Last updated: {new Date().toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}