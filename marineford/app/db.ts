// lib/db.ts
export const LocalDB = {
    // บันทึกรายงานใหม่
    saveReport: (data: any) => {
        const reports = JSON.parse(localStorage.getItem("offline_reports") || "[]");
        reports.push({
            ...data,
            id: `RPT-OFF-${Date.now()}`,
            status: "Pending Sync",
            isOffline: true,
            createdAt: new Date().toISOString()
        });
        localStorage.setItem("offline_reports", JSON.stringify(reports));
    },

    // ดึงรายงานทั้งหมดจากเครื่อง
    getAllReports: () => {
        return JSON.parse(localStorage.getItem("offline_reports") || "[]");
    }
};