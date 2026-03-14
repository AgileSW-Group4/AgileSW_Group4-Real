"use client"; // แนะนำให้ใส่ไว้ถ้ามีการใช้ Client features ในอนาคต

import dynamic from "next/dynamic";
import { Navbar } from "@/components/Navbar";

// 1. Import แบบ Dynamic และปิด SSR
const MarineMap = dynamic(() => import("@/components/MarineMap"), { 
  ssr: false, 
  loading: () => (
    <div className="flex-1 flex items-center justify-center bg-slate-50 text-slate-400">
      กำลังโหลดแผนที่...
    </div>
  )
});

export default function Home() {
  return (
    <div className="flex flex-col h-screen w-full overflow-hidden">
      <Navbar />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* 2. นำ Component แผนที่มาวางตรงนี้ */}
        <MarineMap />
      </div>
    </div>
  );
}