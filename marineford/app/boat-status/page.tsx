"use client";

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
// 1. Import Navbar เข้ามาตรงๆ
import { Navbar } from "@/components/Navbar"; 

// --- ข้อมูลจำลอง (เหมือนเดิม) ---
const chartData = [
  { name: 'Ready', value: 55, color: '#22c55e' },
  { name: 'Critical', value: 15, color: '#ef4444' },
  { name: 'Warning', value: 20, color: '#facc15' },
  { name: 'N/A', value: 10, color: '#e5e7eb' },
];

const boatData = [
  { id: 'Boat 1', fuel: 'ready', equipment: 'ready', overall: 'ready' },
  { id: 'Boat 2', fuel: 'warning', equipment: 'critical', overall: 'critical' },
  { id: 'Boat 3', fuel: 'critical', equipment: 'warning', overall: 'critical' },
  { id: 'Boat 4', fuel: 'ready', equipment: 'ready', overall: 'none' },
];

const StatusDot = ({ status }: { status: string }) => {
  const colors: Record<string, string> = {
    ready: 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]',
    critical: 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]',
    warning: 'bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.6)]',
    none: 'bg-gray-300',
  };
  return <div className={`w-3.5 h-3.5 rounded-full mx-auto ${colors[status] || 'bg-gray-200'}`} />;
};

export default function BoatStatusPage() {
  const renderPie = (title: string) => (
    <div className="flex flex-col items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
      <div className="w-32 h-32">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={chartData} innerRadius={0} outerRadius={50} dataKey="value" startAngle={90} endAngle={450}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <p className="text-sm font-bold text-slate-700 mt-2">{title}</p>
    </div>
  );

  return (
    // 2. ใช้โครงสร้าง flex-col h-screen เพื่อให้ Navbar อยู่บนและคอนเทนต์เลื่อนได้
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden">
      {/* 3. วาง Navbar ตรงๆ เลย */}
      <Navbar />

      {/* 4. ส่วนเนื้อหาที่ Scroll ได้ */}
      <main className="flex-1 overflow-y-auto p-6 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800">Fleet Status Overview</h2>
            <p className="text-slate-500 text-sm">ตรวจสอบความพร้อมรายลำของกองเรือ</p>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {renderPie("น้ำมันเชื้อเพลิง")}
            {renderPie("อุปกรณ์")}
            {renderPie("ความพร้อมรวม")}
          </div>

          {/* Table Section */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden mb-10">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-slate-500 text-[11px] uppercase tracking-wider border-b border-slate-100">
                  <th className="px-8 py-6 font-bold">Boat ID</th>
                  <th className="px-6 py-6 text-center font-bold">น้ำมัน</th>
                  <th className="px-6 py-6 text-center font-bold">อุปกรณ์</th>
                  <th className="px-6 py-6 text-center font-bold">พร้อมปฏิบัติงาน</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {boatData.map((boat) => (
                  <tr key={boat.id} className="hover:bg-blue-50/20 transition-colors">
                    <td className="px-8 py-5 font-bold text-slate-700">{boat.id}</td>
                    <td className="px-6 py-5"><StatusDot status={boat.fuel} /></td>
                    <td className="px-6 py-5"><StatusDot status={boat.equipment} /></td>
                    <td className="px-6 py-5"><StatusDot status={boat.overall} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}