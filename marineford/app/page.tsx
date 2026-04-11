"use client";

import dynamic from "next/dynamic";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { Filters } from "@/components/Filters";
import { useEffect, useState } from "react";
import type { Ship } from "@/components/ShipMarker";
import { useRouter } from "next/navigation";

// โหลด MarineMap แบบ Dynamic (ไม่รันบน Server)
const MarineMap = dynamic<{ officers: any[]; ships: Ship[] }>(() => import("@/components/MarineMap"), {
  ssr: false,
  loading: () => (
    <div className="flex-1 flex items-center justify-center bg-slate-50 text-slate-400">
      กำลังโหลดแผนที่...
    </div>
  )
});

// map status_info ภาษาไทย → Ship status


const mapStatus = (info: string): Ship["status"] => {
  if (info === "กำลังลาดตระเวน" || info === "พร้อมปฏิบัติการ") return "ACTIVE";
  if (info === "จอดซ่อมบำรุง") return "OFFLINE";
  return "IDLE";
};

export default function Home() {
  // database
  const [officers, setOfficers] = useState([]);
  const [ships, setShips] = useState<Ship[]>([]);
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    // Auth guard — redirect to login if not authenticated
    const user = sessionStorage.getItem("marineford_user");
    if (!user) {
      router.replace("/login");
    } else {
      setAuthChecked(true);
    }
  }, [router]);

  useEffect(() => {
    fetch("/api/data")
      .then((res) => res.json())
      .then((json) => setOfficers(json.data));

    fetch("/api/boats")
      .then((res) => res.json())
      .then((json) => {
        const mapped: Ship[] = (json.data ?? []).map((b: any) => ({
          id: String(b.id),
          name: b.name,
          status: mapStatus(b.status_info),
          speed: b.speed ?? 0,
          latitude: b.latitude,
          longitude: b.longitude,
          lastUpdate: b.updated_at ?? new Date().toISOString(),
        }));
        setShips(mapped);
      });

  }, []);


  if (!authChecked) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50 text-slate-400">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full">
      <Navbar />
      <Filters />

      {/* Main Content: พื้นที่ที่เหลือจาก Navbar จะถูกเติมเต็มด้วยแผนที่ */}
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar />
        <MarineMap officers={officers} ships={ships} />

      </div>
    </div>
  );
}



