"use client";

// เพิ่ม Ship เข้ามาในรายการ import
import { Anchor, User, Plus, FileText, ClipboardList, Ship, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMarineContext } from "@/app/context/marineContext";
export function Navbar() {
    const router = useRouter();
    const { userData, setUserData } = useMarineContext();

    // Standard button style
    const btnStyle = "flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border border-white/20 shadow-sm active:scale-95";

    const handleLogout = () => {
        sessionStorage.removeItem("marineford_user");
        router.replace("/login");
    };
    return (
        <header className="h-14 bg-[#1e40af] text-white flex items-center px-6 shrink-0 justify-between shadow-md z-20 relative">
            {/* Left Section: Logo & System Name */}
            <div className="flex items-center gap-4">
                <div
                    className="flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => router.push("/")}
                >
                    <Anchor className="w-6 h-6" />
                </div>
                <h1
                    className="text-lg font-bold leading-tight tracking-wide cursor-pointer"
                    onClick={() => router.push("/")}
                >
                    Marineford System
                </h1>
            </div>

            {/* Middle/Right Section: Navigation Buttons */}
            <div className="flex items-center gap-2">
                <button onClick={() => router.push("/newIncident")} className={btnStyle}>
                    <Plus className="w-3.5 h-3.5" />
                    <span>New Incident</span>
                </button>

                {/* เพิ่มปุ่ม Boat Status ตรงนี้ */}
                <button onClick={() => router.push("/boat-status")} className={btnStyle}>
                    <Ship className="w-3.5 h-3.5" />
                    <span>Boat Status</span>
                </button>

                <button onClick={() => router.push("/create")} className={btnStyle}>
                    <FileText className="w-3.5 h-3.5" />
                    <span>Create Report</span>
                </button>

                <button onClick={() => router.push("/reports")} className={btnStyle}>
                    <ClipboardList className="w-3.5 h-3.5" />
                    <span>View Logs</span>
                </button>

                {/* Profile Section */}
                <div className="flex items-center gap-3 ml-2 border-l border-white/20 pl-4">
                    <div className="text-right flex flex-col justify-center">
                        <p className="text-[11px] font-bold leading-tight uppercase tracking-wider">Commander</p>
                        <p className="text-[9px] text-blue-200 uppercase font-medium leading-none mt-0.5">{userData?.user?.user_metadata?.username}</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-blue-800 border border-blue-600 flex items-center justify-center hover:bg-blue-700 transition-colors cursor-pointer">
                        <User className="w-4 h-4 text-blue-100" />
                    </div>
                </div>

                {/* Logout Button */}
                <button
                    onClick={handleLogout}
                    className="ml-2 p-2 text-blue-200 hover:text-white hover:bg-red-500/20 rounded-md transition-all group"
                    title="Logout"
                >
                    <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
                </button>
            </div>
        </header>
    );
}