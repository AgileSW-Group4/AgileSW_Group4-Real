import { Filter, RefreshCw } from "lucide-react";

export function Filters() {
    return (
        <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shadow-sm z-10 relative">
            <div className="flex items-center gap-8 flex-1">
                <div className="flex items-center gap-2 text-blue-600 font-semibold mr-4">
                    <Filter className="w-4 h-4" />
                    <span className="text-sm">Filters</span>
                </div>

                <div className="flex gap-4 flex-1 max-w-4xl">
                    <div className="flex-1 space-y-1">
                        <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Ship Status</label>
                        <div className="relative">
                            <select className="w-full text-sm border border-slate-300 rounded-md pl-3 pr-8 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none">
                                <option>All Status</option>
                                <option>Active</option>
                                <option>Docked</option>
                                <option>Maintenance</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                                <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 space-y-1">
                        <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Incident Severity</label>
                        <div className="relative">
                            <select className="w-full text-sm border border-slate-300 rounded-md pl-3 pr-8 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none">
                                <option>All Severity</option>
                                <option>Critical</option>
                                <option>High</option>
                                <option>Medium</option>
                                <option>Low</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                                <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 space-y-1">
                        <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Date Range</label>
                        <div className="relative">
                            <select className="w-full text-sm border border-slate-300 rounded-md pl-3 pr-8 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none">
                                <option>All Time</option>
                                <option>Today</option>
                                <option>Last 7 Days</option>
                                <option>Last 30 Days</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                                <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <button className="flex items-center gap-2 bg-[#1e40af] hover:bg-blue-800 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors ml-4 shadow-sm">
                <RefreshCw className="w-4 h-4" />
                Refresh Data
            </button>
        </div>
    );
}
