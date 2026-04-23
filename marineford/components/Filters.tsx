"use client";

import { useEffect, useState } from "react";
import { Filter, RefreshCw } from "lucide-react";
import { useMarineContext } from "@/app/context/marineContext";

// ── risk_level → severity label mapping ──────────────────────────────────────
const SEVERITY_MAP: Record<string, number[]> = {
    "All Severity": [],
    "High": [3],       // create/page.tsx maps: normal=1, urgent=2, critical=3
    "Critical": [4, 5],    // createIncident.tsx uses 1–5 scale
    "Medium": [2],
    "Normal": [1],
};

const SHIP_STATUS_MAP: Record<string, string[]> = {
    "All Status": [],
    "Active": ["Active"],
    "Inactive": ["Inactive"],
};

// ── date helpers ───────────  ───────────────────────────────────────────────────
function startOfDay(d: Date) {
    const c = new Date(d);
    c.setHours(0, 0, 0, 0);
    return c;
}

function dateFilter(dateRange: string, created_at: string): boolean {
    if (dateRange === "All Time") return true;
    const created = new Date(created_at);
    const now = new Date();
    if (dateRange === "Today") return created >= startOfDay(now);
    if (dateRange === "Last 7 Days") {
        const cutoff = new Date(now);
        cutoff.setDate(now.getDate() - 7);
        return created >= cutoff;
    }
    if (dateRange === "Last 30 Days") {
        const cutoff = new Date(now);
        cutoff.setDate(now.getDate() - 30);
        return created >= cutoff;
    }
    return true;
}

export function Filters() {
    const { allIncidents, setIncident, allShips, setShip, } = useMarineContext();

    const [shipStatus, setShipStatus] = useState("All Status");
    const [severity, setSeverity] = useState("All Severity");
    const [dateRange, setDateRange] = useState("All Time");
    const [refreshKey, setRefreshKey] = useState(0);

    // Re‑apply filters whenever allIncidents, severity, or dateRange changes
    // ── กรอง Incident ──────────────────────────────────────────────────────────
    useEffect(() => {
        const levels = SEVERITY_MAP[severity] ?? [];

        const filtered = allIncidents.filter((inc) => {
            const matchSeverity = levels.length === 0 || levels.includes(inc.risk_level);
            const matchDate = dateFilter(dateRange, inc.created_at);
            return matchSeverity && matchDate;
        });


        setIncident(filtered);
    }, [allIncidents, severity, dateRange, refreshKey, setIncident]);

    // ── กรอง Ship ──────────────────────────────────────────────────────────────
    useEffect(() => {
        const status = SHIP_STATUS_MAP[shipStatus] ?? [];
        const filtered = allShips.filter((ship) => {
            if (status.length === 0) return true;
            return status.includes(ship.status);
        });

        setShip(filtered);
    }, [allShips, shipStatus, refreshKey, setShip]);


    const ChevronIcon = () => (
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
            <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
        </div>
    );

    return (
        <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shadow-sm z-10 relative">
            <div className="flex items-center gap-8 flex-1">
                <div className="flex items-center gap-2 text-blue-600 font-semibold mr-4">
                    <Filter className="w-4 h-4" />
                    <span className="text-sm">Filters</span>
                </div>

                <div className="flex gap-4 flex-1 max-w-4xl">

                    {/* Ship Status — placeholder (ships managed via props, not context) */}
                    <div className="flex-1 space-y-1">
                        <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                            Ship Status
                        </label>
                        <div className="relative">
                            <select
                                value={shipStatus}
                                onChange={(e) => setShipStatus(e.target.value)}
                                className="w-full text-sm border border-slate-300 rounded-md pl-3 pr-8 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                            >
                                <option>All Status</option>
                                <option>Active</option>
                                <option>Inactive</option>
                            </select>
                            <ChevronIcon />
                        </div>
                    </div>

                    {/* Incident Severity */}
                    <div className="flex-1 space-y-1">
                        <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                            Incident Severity
                        </label>
                        <div className="relative">
                            <select
                                value={severity}
                                onChange={(e) => setSeverity(e.target.value)}
                                className="w-full text-sm border border-slate-300 rounded-md pl-3 pr-8 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                            >
                                <option>All Severity</option>
                                <option>Critical</option>
                                <option>High</option>
                                <option>Medium</option>
                                <option>Normal</option>
                            </select>
                            <ChevronIcon />
                        </div>
                    </div>

                    {/* Date Range */}
                    <div className="flex-1 space-y-1">
                        <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                            Date Range
                        </label>
                        <div className="relative">
                            <select
                                value={dateRange}
                                onChange={(e) => setDateRange(e.target.value)}
                                className="w-full text-sm border border-slate-300 rounded-md pl-3 pr-8 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                            >
                                <option>All Time</option>
                                <option>Today</option>
                                <option>Last 7 Days</option>
                                <option>Last 30 Days</option>
                            </select>
                            <ChevronIcon />
                        </div>
                    </div>

                </div>
            </div>

            {/* Refresh — triggers re‑apply of current filters */}
            <button
                onClick={() => setRefreshKey((k) => k + 1)}
                className="flex items-center gap-2 bg-[#1e40af] hover:bg-blue-800 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors ml-4 shadow-sm"
            >
                <RefreshCw className="w-4 h-4" />
                Refresh Data
            </button>
        </div>
    );
}
