import { NextResponse } from "next/server";

// ✅ Mock data — ปิด Supabase ชั่วคราวเพื่อดู UI
const MOCK_INCIDENTS = [
  { id: "INC-001", title: "เรือประมงขัดข้อง", description: "เรือประมงขัดข้องกลางทะเล ต้องการความช่วยเหลือ", latitude: 7.9, longitude: 98.4, risk_level: 2, status: "กำลังดำเนินการ", responsible_unit: "Andaman-01", vdo_url: "", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "INC-002", title: "น้ำมันรั่วไหล",    description: "พบคราบน้ำมันบริเวณอ่าว",                        latitude: 8.2, longitude: 98.7, risk_level: 3, status: "รอดำเนินการ",   responsible_unit: "Coastal Guard", vdo_url: "", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "INC-003", title: "คนตกน้ำ",          description: "พบผู้ประสบภัยลอยน้ำ บริเวณเกาะพีพี",           latitude: 7.7, longitude: 98.8, risk_level: 1, status: "เสร็จสิ้น",      responsible_unit: "Rescue Team",   vdo_url: "", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

export async function GET() {
  return NextResponse.json({ success: true, data: MOCK_INCIDENTS });
}

export async function POST(request) {
  const body = await request.json();
  return NextResponse.json({ success: true, data: { ...body, id: `INC-${Date.now()}` } });
}

export async function DELETE(request) {
  return NextResponse.json({ success: true, data: {} });
}