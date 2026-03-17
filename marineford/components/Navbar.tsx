"use client";

import { Anchor, User, Plus, FileText, ClipboardList } from "lucide-react";
import { useRouter } from "next/navigation";

export function Navbar() {
    const router = useRouter();

    // Standard style for all action buttons
    const btnStyle = "flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border border-white/20 shadow-sm active:scale-95";

    return (
        <header className="h-14 bg-[#1e40af] text-white flex items-center px-6 shrink-0 justify-between shadow-md z-20 relative">
            {/* Left: Branding */}
            <div className="flex items-center gap-4">
                <div
                    className="flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => router.push("/")}
                >
                    <Anchor className="w-6 h-6" />
                </div>
                <h1
                    className="text-lg font-bold leading-tight tracking-wide cursor-pointer hidden sm:block"
                    onClick={() => router.push("/")}
                >
                    Marineford System
                </h1>
            </div>

            {/* Right: Triple Button Actions */}
            <div className="flex items-center gap-2">
                
                {/* 1. New Incident - Redirect to map for quick action */}
                <button
                    onClick={() => router.push("/")}
                    className={btnStyle}
                >
                    <Plus className="w-3.5 h-3.5" />
                    <span>New Incident</span>
                </button>

                {/* 2. Create Report - Redirect to the long form page */}
                <button
                    onClick={() => router.push("/create")}
                    className={btnStyle}
                >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Create Report</span>
                </button>

                {/* 3. View Logs - Redirect to report listing page */}
                <button
                    onClick={() => router.push("/reports")}
                    className={btnStyle}
                >
                    <ClipboardList className="w-3.5 h-3.5" />
                    <span>View Logs</span>
                </button>

                {/* Profile Avatar */}
                <div className="flex items-center gap-3 ml-2 border-l border-white/20 pl-4 hidden md:flex">
                    <div className="w-8 h-8 rounded-full bg-blue-800 border border-blue-600 flex items-center justify-center hover:bg-blue-700 transition-colors cursor-pointer">
                        <User className="w-4 h-4 text-blue-100" />
                    </div>
                </div>
            </div>
        </header>
    );
}