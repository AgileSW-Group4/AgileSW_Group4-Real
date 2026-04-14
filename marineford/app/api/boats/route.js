
// import { fetchFromSupabase } from "@/lib/supabaseClient";
// import { NextResponse } from "next/server";

// export async function GET() {
//   try {
//     const data = await fetchFromSupabase("boats");
//     return NextResponse.json({ success: true, data });
//   } catch (error) {
//     return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//   }
// }

// export async function POST(request) {
//   try {
//     const body = await request.json();
//     const data = await fetchFromSupabase("boats", {
//       method: "POST",
//       body,
//     });
//     return NextResponse.json({ success: true, data });
//   } catch (error) {
//     return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//   }
// }

import { NextResponse } from "next/server";

// ✅ Mock data — ปิด Supabase ชั่วคราวเพื่อดู UI
const MOCK_BOATS = [
  { id: 1, name: "Marine Sentinel 01", status_info: "กำลังลาดตระเวน", speed: 12, latitude: 7.8, longitude: 98.3, updated_at: new Date().toISOString() },
  { id: 2, name: "Coastal Guard 02",   status_info: "พร้อมปฏิบัติการ", speed: 0,  latitude: 8.1, longitude: 98.9, updated_at: new Date().toISOString() },
  { id: 3, name: "Rescue One",          status_info: "จอดซ่อมบำรุง",    speed: 0,  latitude: 7.5, longitude: 99.1, updated_at: new Date().toISOString() },
  { id: 4, name: "Andaman Patrol 04",  status_info: "กำลังลาดตระเวน", speed: 8,  latitude: 8.5, longitude: 97.8, updated_at: new Date().toISOString() },
];

export async function GET() {
  return NextResponse.json({ success: true, data: MOCK_BOATS });
}

export async function POST(request) {
  const body = await request.json();
  return NextResponse.json({ success: true, data: { ...body, id: Date.now() } });
}