"use client";

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

// ... (chartData และ boatData ใช้ตัวเดิมได้เลย)

export default function BoatStatusPage() {
  const renderPie = (title: string) => (
    <div className="flex flex-col items-center">
        {/* กราฟวงกลม */}
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
      <p className="text-sm font-bold text-slate-600 mt-2">{title}</p>
    </div>
  );

  return (
    <div className="min-h-full bg-slate-50 p-8">
      <div className="max-w-5xl mx-auto">
        {/* หัวข้อหน้า */}
        <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800">Boat Readiness Overview</h2>
            <p className="text-slate-500 text-sm">สถานะความพร้อมของเรือในสังกัด Marineford</p>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          {renderPie("น้ำมัน (Fuel Level)")}
          {renderPie("อุปกรณ์ (Equipment)")}
          {renderPie("ความพร้อม (Operational)")}
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="px-8 py-5">Boat Name</th>
                <th className="px-6 py-5 text-center">น้ำมัน</th>
                <th className="px-6 py-5 text-center">อุปกรณ์</th>
                <th className="px-6 py-5 text-center">พร้อมปฏิบัติงาน</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {boatData.map((boat) => (
                <tr key={boat.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="px-8 py-4 font-bold text-slate-700">{boat.id}</td>
                  <td className="px-6 py-4"><StatusDot status={boat.fuel} /></td>
                  <td className="px-6 py-4"><StatusDot status={boat.equipment} /></td>
                  <td className="px-6 py-4"><StatusDot status={boat.overall} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ฟังก์ชัน StatusDot อย่าลืมก๊อปปี้มาจากอันเก่านะครับ