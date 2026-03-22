"use client";

import dynamic from "next/dynamic";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { Filters } from "@/components/Filters";
import { useEffect, useState } from "react";

// โหลด MarineMap แบบ Dynamic (ไม่รันบน Server)
const MarineMap = dynamic<{ officers:any[] }> (() => import("@/components/MarineMap"), { 
  ssr: false, 
  loading: () => (
    <div className="flex-1 flex items-center justify-center bg-slate-50 text-slate-400">
      กำลังโหลดแผนที่...
    </div>
  )
});

export default function Home() {
  // database
  const [officers, setOfficers] = useState([]);

  useEffect(() => {
    fetch("/api/data")
      .then((res) => res.json())
      .then((json) => setOfficers(json.data));
  }, []);

  return (
    <div className="flex flex-col h-full w-full">
      <Navbar />
      <Filters/>

      {/* Main Content: พื้นที่ที่เหลือจาก Navbar จะถูกเติมเต็มด้วยแผนที่ */}
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar />
        <MarineMap officers={officers} />
        
      </div>
    </div>
  );
 }
