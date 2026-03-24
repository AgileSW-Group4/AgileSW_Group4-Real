import { Ship, AlertTriangle, CloudRain, Clock } from "lucide-react";
import { useMarineContext } from "@/app/context/marineContext";

interface Incident {
    id: string;
    title: string;
    description: string;
    latitude: number;
    longitude: number;
    risk_level: number;
    status: 'กำลังดำเนินการ' | 'รอดำเนินการ' | 'เสร็จสิ้น';
    responsible_unit: string;
    vdo_url: string;
    created_at: string;
    updated_at: string;
}

// Map risk_level (1–5) to border color, dot color, badge style, and label
function getRiskStyle(risk_level: number) {
    if (risk_level >= 4) {
        return { border: "border-l-red-500", dot: "bg-red-500", badge: "bg-red-600 text-white", label: "critical" };
    } else if (risk_level === 3) {
        return { border: "border-l-orange-500", dot: "bg-orange-500", badge: "bg-orange-500 text-white", label: "high" };
    } else if (risk_level === 2) {
        return { border: "border-l-amber-400", dot: "bg-amber-400", badge: "bg-amber-400 text-white", label: "medium" };
    } else {
        return { border: "border-l-green-500", dot: "bg-green-500", badge: "bg-green-600 text-white", label: "normal" };
    }
}

function formatTime(iso: string): string {
    try {
        return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    } catch {
        return iso;
    }
}

export function Sidebar() {
    const { useIncident } = useMarineContext();

    return (
        <aside className="w-80 bg-slate-50 border-r border-slate-200 overflow-y-auto p-4 flex flex-col gap-4 shadow-sm z-10">

            {/* Summary Row */}
            <div className="flex gap-4">
                <div className="flex-1 bg-blue-500 rounded-lg p-3 text-white shadow-sm flex flex-col relative overflow-hidden">
                    <div className="flex justify-between items-start z-10 mb-2">
                        <Ship className="w-5 h-5 opacity-90" />
                        <span className="text-2xl font-bold leading-none">–</span>
                    </div>
                    <span className="text-xs font-medium z-10">Active Ships</span>
                    <div className="absolute -bottom-4 -right-2 text-white/20">
                        <Ship className="w-16 h-16" strokeWidth={1.5} />
                    </div>
                </div>

                <div className="flex-1 bg-red-500 rounded-lg p-3 text-white shadow-sm flex flex-col relative overflow-hidden">
                    <div className="flex justify-between items-start z-10 mb-2">
                        <AlertTriangle className="w-5 h-5 opacity-90" />
                        <span className="text-2xl font-bold leading-none">{useIncident.length}</span>
                    </div>
                    <span className="text-xs font-medium z-10">Active<br />Incidents</span>
                    <div className="absolute -bottom-4 -right-2 text-white/20">
                        <AlertTriangle className="w-16 h-16" strokeWidth={1.5} />
                    </div>
                </div>
            </div>

            {/* Weather Conditions (static – no weather API yet) */}
            <div className="bg-[#38bdf8] rounded-lg p-4 text-white shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                    <CloudRain className="w-5 h-5" />
                    <h3 className="font-semibold text-sm">Weather Conditions</h3>
                </div>
                <div className="flex flex-col gap-1.5 text-xs">
                    <div className="flex justify-between border-b border-white/20 border-dotted pb-1">
                        <span className="text-blue-50">Temperature:</span>
                        <span className="font-medium">22°C</span>
                    </div>
                    <div className="flex justify-between border-b border-white/20 border-dotted pb-1">
                        <span className="text-blue-50">Wind Speed:</span>
                        <span className="font-medium">15 knots</span>
                    </div>
                    <div className="flex justify-between border-b border-white/20 border-dotted pb-1">
                        <span className="text-blue-50">Wave Height:</span>
                        <span className="font-medium">2.5m</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-blue-50">Visibility:</span>
                        <span className="font-medium">Good</span>
                    </div>
                </div>
            </div>

            {/* Recent Alerts – dynamic from useIncident */}
            <div className="flex flex-col mt-2">
                <div className="flex items-center gap-2 mb-3 text-slate-700">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <h3 className="text-sm font-semibold tracking-wide">Recent Alerts</h3>
                </div>

                <div className="flex flex-col gap-3">
                    {useIncident.length === 0 ? (
                        <p className="text-xs text-slate-400 text-center py-4">No incidents reported</p>
                    ) : (
                        useIncident.map((incident) => {
                            const style = getRiskStyle(incident.risk_level);
                            return (
                                <div
                                    key={incident.id}
                                    className={`bg-white border-l-4 ${style.border} rounded-r-md rounded-l-sm p-3 shadow-sm border-t border-r border-b border-slate-200`}
                                >
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className={`w-1.5 h-1.5 rounded-full ${style.dot} shrink-0`} />
                                        <h4 className="text-xs font-bold text-slate-800 line-clamp-1">
                                            {incident.title}
                                        </h4>
                                    </div>
                                    <p className="text-[10px] text-slate-500 leading-snug mb-2 line-clamp-2">
                                        {incident.description}
                                    </p>
                                    <div className="flex items-center justify-between mt-1">
                                        <span className="text-[9px] text-slate-400 font-medium">
                                            {formatTime(incident.created_at)}
                                        </span>
                                        <span className={`inline-flex items-center rounded px-1.5 py-0 text-[9px] font-semibold ${style.badge}`}>
                                            {style.label}
                                        </span>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </aside>
    );
}
