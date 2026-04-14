// app/data/mockPersonnel.ts
// ข้อมูลจำลองเจ้าหน้าที่ — ใช้ร่วมกันทั้ง overview และ detail page

export interface Personnel {
  id: string;
  name: string;
  nameTh: string;
  rank: string;
  status: "Active" | "Standby" | "On Leave";
  unit: string;
  location: string;
  address: string;
  phone: string;
  email: string;
  tasks: { title: string; status: string }[];
}

export const MOCK_PERSONNEL: Personnel[] = [
  {
    id: "OFF-001",
    name: "Cpt. Arisara Manee",
    nameTh: "ร.ต. อริสรา มณี",
    rank: "Captain",
    status: "Active",
    unit: "Andaman-01",
    location: "Marine Sentinel 01",
    address: "ฐานทัพเรือสัตหีบ อำเภอสัตหีบ จังหวัดชลบุรี",
    phone: "038-438-200",
    email: "arisara.m@marineford.th",
    tasks: [
      { title: "ตรวจสอบบริเวณน่านน้ำ", status: "เสร็จสิ้น" },
      { title: "ลาดตระเวนอ่าวอันดามัน", status: "กำลังดำเนินการ" },
    ],
  },
  {
    id: "OFF-002",
    name: "Lt. Somchai Rek-dee",
    nameTh: "ร.ต. สมชาย เรืองดี",
    rank: "Officer",
    status: "Standby",
    unit: "Coastal Guard",
    location: "Sattahip Base",
    address: "ฐานทัพเรือสัตหีบ อำเภอสัตหีบ จังหวัดชลบุรี",
    phone: "038-438-201",
    email: "somchai.r@marineford.th",
    tasks: [
      { title: "เฝ้าระวังชายฝั่ง", status: "รอดำเนินการ" },
    ],
  },
  {
    id: "OFF-003",
    name: "Sgt. Wichai Bun-mi",
    nameTh: "จ.อ. วิชัย บุญมี",
    rank: "Engineer",
    status: "On Leave",
    unit: "Maintenance",
    location: "-",
    address: "ฐานซ่อมบำรุง อำเภอเมือง จังหวัดภูเก็ต",
    phone: "076-212-300",
    email: "wichai.b@marineford.th",
    tasks: [],
  },
  {
    id: "OFF-004",
    name: "Lt. Jariya Sook-jai",
    nameTh: "ร.ต.หญิง จริยา สุขใจ",
    rank: "Medic",
    status: "Active",
    unit: "Rescue Team",
    location: "Rescue One",
    address: "หน่วยกู้ภัยทางทะเล ท่าเรือภูเก็ต",
    phone: "076-212-301",
    email: "jariya.s@marineford.th",
    tasks: [
      { title: "ตรวจสอบบริเวณน่านน้ำ", status: "เสร็จสิ้น" },
      { title: "ปฏิบัติการช่วยเหลือเรือประมง", status: "เสร็จสิ้น" },
    ],
  },
  {
    id: "OFF-005",
    name: "Cpl. Mana Wai-wai",
    nameTh: "พลฯ มานะ วายวาย",
    rank: "Pilot",
    status: "Standby",
    unit: "Air Support",
    location: "Phuket Pier",
    address: "ท่าเรือภูเก็ต อำเภอเมือง จังหวัดภูเก็ต",
    phone: "076-212-302",
    email: "mana.w@marineford.th",
    tasks: [
      { title: "เตรียมพร้อมอากาศยาน", status: "รอดำเนินการ" },
    ],
  },
];