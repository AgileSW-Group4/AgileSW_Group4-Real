import { Ship, AlertTriangle, CloudRain, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function Sidebar() {
    return (
        <aside className="w-80 bg-slate-50 border-r border-slate-200 overflow-y-auto p-4 flex flex-col gap-4 shadow-sm z-10">

            {/* Summary Row */}
            <div className="flex gap-4">
                <div className="flex-1 bg-blue-500 rounded-lg p-3 text-white shadow-sm flex flex-col relative overflow-hidden">
                    <div className="flex justify-between items-start z-10 mb-2">
                        <Ship className="w-5 h-5 opacity-90" />
                        <span className="text-2xl font-bold leading-none">9</span>
                    </div>
                    <span className="text-xs font-medium z-10">Active Ships</span>
                    <div className="absolute -bottom-4 -right-2 text-white/20">
                        <Ship className="w-16 h-16" strokeWidth={1.5} />
                    </div>
                </div>

                <div className="flex-1 bg-red-500 rounded-lg p-3 text-white shadow-sm flex flex-col relative overflow-hidden">
                    <div className="flex justify-between items-start z-10 mb-2">
                        <AlertTriangle className="w-5 h-5 opacity-90" />
                        <span className="text-2xl font-bold leading-none">4</span>
                    </div>
                    <span className="text-xs font-medium z-10">Active<br />Incidents</span>
                    <div className="absolute -bottom-4 -right-2 text-white/20">
                        <AlertTriangle className="w-16 h-16" strokeWidth={1.5} />
                    </div>
                </div>
            </div>

            {/* Weather Conditions */}
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

            {/* Recent Alerts List */}
            <div className="flex flex-col mt-2">
                <div className="flex items-center gap-2 mb-3 text-slate-700">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <h3 className="text-sm font-semibold tracking-wide">Recent Alerts</h3>
                </div>

                <div className="flex flex-col gap-3">
                    {/* Alert Item 1 */}
                    <div className="bg-white border-l-4 border-l-red-500 rounded-r-md rounded-l-sm p-3 shadow-sm border-t border-r border-b border-slate-200">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"></div>
                            <h4 className="text-xs font-bold text-slate-800 line-clamp-1">Medical Emergency</h4>
                        </div>
                        <p className="text-[10px] text-slate-500 leading-snug mb-2 line-clamp-2">Crew member aboard HMS Red Sea Navigator requires immediate medical...</p>
                        <div className="flex items-center justify-between mt-1">
                            <span className="text-[9px] text-slate-400 font-medium">7:53:38 PM</span>
                            <Badge variant="destructive" className="px-1.5 py-0 text-[9px]">critical</Badge>
                        </div>
                    </div>

                    {/* Alert Item 2 */}
                    <div className="bg-white border-l-4 border-l-orange-500 rounded-r-md rounded-l-sm p-3 shadow-sm border-t border-r border-b border-slate-200">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0"></div>
                            <h4 className="text-xs font-bold text-slate-800 line-clamp-1">Engine Failure Alert</h4>
                        </div>
                        <p className="text-[10px] text-slate-500 leading-snug mb-2 line-clamp-2">MV Baltic Trader reported engine malfunction. Assistance required.</p>
                        <div className="flex items-center justify-between mt-1">
                            <span className="text-[9px] text-slate-400 font-medium">7:50:38 PM</span>
                            <Badge variant="warning" className="px-1.5 py-0 text-[9px] bg-orange-500">high</Badge>
                        </div>
                    </div>

                    {/* Alert Item 3 */}
                    <div className="bg-white border-l-4 border-l-orange-500 rounded-r-md rounded-l-sm p-3 shadow-sm border-t border-r border-b border-slate-200">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0"></div>
                            <h4 className="text-xs font-bold text-slate-800 line-clamp-1">Weather Advisory</h4>
                        </div>
                        <p className="text-[10px] text-slate-500 leading-snug mb-2 line-clamp-2">Severe storm warning issued for North Atlantic region. Ships advised to seek...</p>
                        <div className="flex items-center justify-between mt-1">
                            <span className="text-[9px] text-slate-400 font-medium">7:45:38 PM</span>
                            <Badge variant="warning" className="px-1.5 py-0 text-[9px] bg-orange-500">high</Badge>
                        </div>
                    </div>

                    {/* Alert Item 4 */}
                    <div className="bg-white border-l-4 border-l-amber-400 rounded-r-md rounded-l-sm p-3 shadow-sm border-t border-r border-b border-slate-200">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0"></div>
                            <h4 className="text-xs font-bold text-slate-800 line-clamp-1">Navigation System Error</h4>
                        </div>
                        <p className="text-[10px] text-slate-500 leading-snug mb-2 line-clamp-2">GPS malfunction reported by SS Indian Ocean. Using backup systems.</p>
                        <div className="flex items-center justify-between mt-1">
                            <span className="text-[9px] text-slate-400 font-medium">7:13:38 PM</span>
                            <Badge variant="warning" className="px-1.5 py-0 text-[9px]">medium</Badge>
                        </div>
                    </div>

                    {/* Alert Item 5 */}
                    <div className="bg-white border-l-4 border-l-green-600 rounded-r-md rounded-l-sm p-3 shadow-sm border-t border-r border-b border-slate-200">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0"></div>
                            <h4 className="text-xs font-bold text-slate-800 line-clamp-1">Navigation System Error</h4>
                        </div>
                        <p className="text-[10px] text-slate-500 leading-snug mb-2 line-clamp-2">GPS malfunction reported by SS Indian Ocean. Using backup systems.</p>
                        <div className="flex items-center justify-between mt-1">
                            <span className="text-[9px] text-slate-400 font-medium">7:13:38 PM</span>
                            <Badge variant="success" className="px-1.5 py-0 text-[9px]"> normal </Badge>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
}
