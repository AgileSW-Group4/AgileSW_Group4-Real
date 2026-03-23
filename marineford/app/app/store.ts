// src/lib/store.ts

export type Report = {
  id: string;
  type: string;
  location: string;
  time: string;
  priority: 'normal' | 'urgent' | 'critical';
  status: string;
  description?: string; // เพิ่มไว้รองรับคำอธิบายเพิ่มเติม
};

// ใช้ชื่อ mockReports ตามที่คุณต้องการ (เป็นตัวแปรกลางที่ทั้งสองหน้าจะมาดึงไปใช้)
export const mockReports: Report[] = [
  { id: "RPT-001", type: "Boat Accident", location: "Ao Nang, Krabi", time: "2024-03-20 14:30", priority: "critical", status: "Active" },
  { id: "RPT-002", type: "Illegal Fishing", location: "Similan Islands", time: "2024-03-20 12:15", priority: "urgent", status: "Investigating" },
  { id: "RPT-003", type: "Oil Spill", location: "Phuket East Coast", time: "2024-03-19 09:00", priority: "normal", status: "Resolved" },
  { id: "RPT-004", type: "Search & Rescue", location: "Ko Lipe", time: "2024-03-19 18:45", priority: "critical", status: "Active" },
];

// ฟังก์ชันสำหรับเพิ่มข้อมูลใหม่เข้าไปในรายการ
export const addReport = (report: Report) => {
  mockReports.unshift(report); // นำข้อมูลใหม่ไปแทรกไว้หน้าสุดของ Array
};