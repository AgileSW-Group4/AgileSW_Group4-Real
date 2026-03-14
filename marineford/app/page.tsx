"use client";

import dynamic from "next/dynamic";
import { Navbar } from "@/components/Navbar";

// โหลด MarineMap แบบ Dynamic (ไม่รันบน Server)
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

      {/* Main Content: พื้นที่ที่เหลือจาก Navbar จะถูกเติมเต็มด้วยแผนที่ */}
      <div className="flex flex-1 overflow-hidden relative">
        <MarineMap />
      </div>
    </div>
  );
}