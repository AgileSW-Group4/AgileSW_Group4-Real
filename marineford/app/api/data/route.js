// // app/api/data/route.js
// import { fetchFromSupabase } from "@/lib/supabaseClient";
// import { NextResponse } from "next/server";

// export async function GET() {
//   try {
//     const data = await fetchFromSupabase("officers");
//     return NextResponse.json({ success: true, data });
//   } catch (error) {
//     return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//   }
// }

// export async function POST(request) {
//   try {
//     const body = await request.json();
//     const data = await fetchFromSupabase("officers", {
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
const MOCK_OFFICERS = [
  { id: 1, name: "Cpt. Arisara Manee",   rank: "Captain",  unit: "Andaman-01",    status: "Active"   },
  { id: 2, name: "Lt. Somchai Rek-dee",  rank: "Officer",  unit: "Coastal Guard", status: "Standby"  },
  { id: 3, name: "Sgt. Wichai Bun-mi",   rank: "Engineer", unit: "Maintenance",   status: "On Leave" },
  { id: 4, name: "Lt. Jariya Sook-jai",  rank: "Medic",    unit: "Rescue Team",   status: "Active"   },
];

export async function GET() {
  return NextResponse.json({ success: true, data: MOCK_OFFICERS });
}

export async function POST(request) {
  const body = await request.json();
  return NextResponse.json({ success: true, data: { ...body, id: Date.now() } });
}