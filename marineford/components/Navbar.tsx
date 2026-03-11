"use client";

import { Anchor, User, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export function Navbar() {
    const router = useRouter();

    return (
        <header className="h-14 bg-[#1e40af] text-white flex items-center px-6 shrink-0 justify-between shadow-md z-20 relative">
            <div className="flex items-center gap-4">
                <div
                    className="flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => router.push("/")}
                >
                    <Anchor className="w-6 h-6" />
                </div>
                <div>
                    <h1
                        className="text-lg font-bold leading-tight tracking-wide cursor-pointer hover:text-blue-100 transition-colors"
                        onClick={() => router.push("/")}
                    >
                        Marine Monitoring System
                    </h1>
                    <p className="text-[11px] text-blue-200 font-medium tracking-wide">Real-time Fleet &amp; Incident Tracking</p>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <button
                    onClick={() => router.push("/create")}
                    className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border border-white/20 hover:border-white/40 shadow-sm hover:shadow"
                >
                    <Plus className="w-3.5 h-3.5" />
                    New Incident
                </button>
                <div className="text-right hidden sm:block">
                    <p className="text-sm font-semibold leading-tight">Command Center</p>
                    <p className="text-[11px] text-blue-200">Administrator</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-blue-800 border border-blue-600 flex items-center justify-center hover:bg-blue-700 transition-colors cursor-pointer">
                    <User className="w-4 h-4 text-blue-100" />
                </div>
            </div>
        </header>
    );
}
