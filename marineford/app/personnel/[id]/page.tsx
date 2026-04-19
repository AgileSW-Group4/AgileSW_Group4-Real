"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import {
  ArrowLeft, MapPin, Phone, Mail, Home,
  CheckCircle2, Clock3, Circle, User
} from "lucide-react";

export default function PersonnelDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [person, setPerson] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/personnel")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          const found = json.data.find((p: any) => p.officer_id === id);
          setPerson(found);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching personnel details:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col h-screen bg-slate-50">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-slate-400">
          <p className="text-lg font-bold">กำลังโหลดข้อมูลเจ้าหน้าที่...</p>
        </div>
      </div>
    );
  }

  if (!person) {
    return (
      <div className="flex flex-col h-screen bg-slate-50">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-slate-400">
          <User className="w-16 h-16 opacity-30" />
          <p className="text-lg font-bold">ไม่พบข้อมูลเจ้าหน้าที่</p>
          <button
            onClick={() => router.push("/personnel")}
            className="flex items-center gap-2 text-sm text-[#1e40af] font-semibold hover:underline"
          >
            <ArrowLeft className="w-4 h-4" /> กลับหน้ารายชื่อ
          </button>
        </div>
      </div>
    );
  }

  const statusStyle: Record<string, string> = {
    "Active": "bg-green-50 text-green-700 border-green-200",
    "Standby": "bg-amber-50 text-amber-700 border-amber-200",
    "On Leave": "bg-slate-100 text-slate-500 border-slate-200",
  };

  const taskStatusIcon = (s: string) => {
    if (s === "เสร็จสิ้น") return <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />;
    if (s === "กำลังดำเนินการ") return <Clock3 className="w-4 h-4 text-amber-500 shrink-0" />;
    return <Circle className="w-4 h-4 text-slate-300 shrink-0" />;
  };

  const taskStatusBadge: Record<string, string> = {
    "เสร็จสิ้น": "bg-green-50 text-green-700 border-green-200",
    "กำลังดำเนินการ": "bg-amber-50 text-amber-700 border-amber-200",
    "รอดำเนินการ": "bg-slate-50 text-slate-500 border-slate-200",
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans">
      <Navbar />

      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-3xl mx-auto pb-10">

          {/* Back button */}
          <button
            onClick={() => router.push("/personnel")}
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-[#1e40af] font-semibold mb-6 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            กลับหน้ารายชื่อ
          </button>

          {/* Profile Card */}
          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-8 mb-6">
            <div className="flex items-center gap-6">
              {/* Avatar */}
              <div className="w-20 h-20 rounded-full bg-slate-100 border-2 border-slate-200 flex items-center justify-center text-3xl font-black text-[#1e40af] shrink-0">
                {person.name.charAt(0)}
              </div>

              {/* Name & Meta */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-3 mb-1">
                  <h1 className="text-2xl font-black text-slate-800 truncate">{person.name}</h1>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-tight ${statusStyle[person.status]}`}>
                    {person.status}
                  </span>
                </div>
                <p className="text-slate-400 text-sm font-medium mb-1">{person.nameTh || ""}</p>
                <p className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                  {person.officer_id} &nbsp;•&nbsp; {person.rank || "-"} &nbsp;•&nbsp; {person.unit || "-"}
                </p>
              </div>
            </div>
          </div>

          {/* Contact Card */}
          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-8 mb-6">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-5">Contact</h2>
            <div className="flex flex-col gap-4">
              <ContactRow icon={<Home className="w-4 h-4 text-blue-400" />} label="ที่อยู่" value={person.address || "-"} />
              <ContactRow icon={<Phone className="w-4 h-4 text-blue-400" />} label="เบอร์โทรศัพท์" value={person.phone || "-"} />
              <ContactRow icon={<Mail className="w-4 h-4 text-blue-400" />} label="Email" value={person.email || "-"} />
              <ContactRow icon={<MapPin className="w-4 h-4 text-blue-400" />} label="ตำแหน่งปัจจุบัน" value={(person.latitude && person.longitude) ? `${person.latitude}, ${person.longitude}` : "-"} />
            </div>
          </div>

          {/* Tasks Card */}
          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-8">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-5">หน้าที่ที่กำลังปฏิบัติงาน</h2>
            {(!person.tasks || person.tasks.length === 0) ? (
              <p className="text-slate-400 text-sm font-medium">ไม่มีงานที่ได้รับมอบหมาย</p>
            ) : (
              <div className="flex flex-col gap-3">
                {person.tasks.map((task: any, i: number) => (
                  <div key={i} className="flex items-center justify-between gap-4 py-3 border-b border-slate-50 last:border-0">
                    <div className="flex items-center gap-3">
                      {taskStatusIcon(task.status)}
                      <p className="text-sm font-semibold text-slate-700">{task.title}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-tight shrink-0 ${taskStatusBadge[task.status] ?? "bg-slate-50 text-slate-400 border-slate-200"}`}>
                      {task.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}

function ContactRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 shrink-0">{icon}</div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</p>
        <p className="text-sm font-semibold text-slate-700">{value}</p>
      </div>
    </div>
  );
}

// "use client";

// import { useState, useEffect } from "react";
// import { useParams, useRouter } from "next/navigation";
// import { Navbar } from "@/components/Navbar";
// // import { MOCK_PERSONNEL } from "@/data/mockPersonnel";
// import {
//   ArrowLeft, MapPin, Phone, Mail, Home,
//   CheckCircle2, Clock3, Circle, User
// } from "lucide-react";

// export default function PersonnelDetailPage() {
//   const { id } = useParams<{ id: string }>();
//   const router = useRouter();

//   const person = MOCK_PERSONNEL.find(p => p.id === id);

//   if (!person) {
//     return (
//       <div className="flex flex-col h-screen bg-slate-50">
//         <Navbar />
//         <div className="flex-1 flex flex-col items-center justify-center gap-4 text-slate-400">
//           <User className="w-16 h-16 opacity-30" />
//           <p className="text-lg font-bold">ไม่พบข้อมูลเจ้าหน้าที่</p>
//           <button
//             onClick={() => router.push("/personnel")}
//             className="flex items-center gap-2 text-sm text-[#1e40af] font-semibold hover:underline"
//           >
//             <ArrowLeft className="w-4 h-4" /> กลับหน้ารายชื่อ
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const statusStyle: Record<string, string> = {
//     "Active":   "bg-green-50 text-green-700 border-green-200",
//     "Standby":  "bg-amber-50 text-amber-700 border-amber-200",
//     "On Leave": "bg-slate-100 text-slate-500 border-slate-200",
//   };

//   const taskStatusIcon = (s: string) => {
//     if (s === "เสร็จสิ้น")        return <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />;
//     if (s === "กำลังดำเนินการ")  return <Clock3 className="w-4 h-4 text-amber-500 shrink-0" />;
//     return <Circle className="w-4 h-4 text-slate-300 shrink-0" />;
//   };

//   const taskStatusBadge: Record<string, string> = {
//     "เสร็จสิ้น":       "bg-green-50 text-green-700 border-green-200",
//     "กำลังดำเนินการ": "bg-amber-50 text-amber-700 border-amber-200",
//     "รอดำเนินการ":    "bg-slate-50 text-slate-500 border-slate-200",
//   };

//   return (
//     <div className="flex flex-col h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans">
//       <Navbar />

//       <main className="flex-1 overflow-y-auto p-4 md:p-8">
//         <div className="max-w-3xl mx-auto pb-10">

//           {/* Back button */}
//           <button
//             onClick={() => router.push("/personnel")}
//             className="flex items-center gap-2 text-sm text-slate-500 hover:text-[#1e40af] font-semibold mb-6 transition-colors group"
//           >
//             <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
//             กลับหน้ารายชื่อ
//           </button>

//           {/* Profile Card */}
//           <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-8 mb-6">
//             <div className="flex items-center gap-6">
//               {/* Avatar */}
//               <div className="w-20 h-20 rounded-full bg-slate-100 border-2 border-slate-200 flex items-center justify-center text-3xl font-black text-[#1e40af] shrink-0">
//                 {person.name.charAt(0)}
//               </div>

//               {/* Name & Meta */}
//               <div className="flex-1 min-w-0">
//                 <div className="flex flex-wrap items-center gap-3 mb-1">
//                   <h1 className="text-2xl font-black text-slate-800 truncate">{person.name}</h1>
//                   <span className={`px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-tight ${statusStyle[person.status]}`}>
//                     {person.status}
//                   </span>
//                 </div>
//                 <p className="text-slate-400 text-sm font-medium mb-1">{person.nameTh}</p>
//                 <p className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
//                   {person.id} &nbsp;•&nbsp; {person.rank} &nbsp;•&nbsp; {person.unit}
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Contact Card */}
//           <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-8 mb-6">
//             <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-5">Contact</h2>
//             <div className="flex flex-col gap-4">
//               <ContactRow icon={<Home className="w-4 h-4 text-blue-400" />}   label="ที่อยู่"        value={person.address || "-"} />
//               <ContactRow icon={<Phone className="w-4 h-4 text-blue-400" />}  label="เบอร์โทรศัพท์" value={person.phone   || "-"} />
//               <ContactRow icon={<Mail className="w-4 h-4 text-blue-400" />}   label="Email"         value={person.email   || "-"} />
//               <ContactRow icon={<MapPin className="w-4 h-4 text-blue-400" />} label="ตำแหน่งปัจจุบัน" value={person.location || "-"} />
//             </div>
//           </div>

//           {/* Tasks Card */}
//           <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-8">
//             <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-5">หน้าที่ที่กำลังปฏิบัติงาน</h2>
//             {person.tasks.length === 0 ? (
//               <p className="text-slate-400 text-sm font-medium">ไม่มีงานที่ได้รับมอบหมาย</p>
//             ) : (
//               <div className="flex flex-col gap-3">
//                 {person.tasks.map((task, i) => (
//                   <div key={i} className="flex items-center justify-between gap-4 py-3 border-b border-slate-50 last:border-0">
//                     <div className="flex items-center gap-3">
//                       {taskStatusIcon(task.status)}
//                       <p className="text-sm font-semibold text-slate-700">{task.title}</p>
//                     </div>
//                     <span className={`px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-tight shrink-0 ${taskStatusBadge[task.status] ?? "bg-slate-50 text-slate-400 border-slate-200"}`}>
//                       {task.status}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//         </div>
//       </main>
//     </div>
//   );
// }

// function ContactRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
//   return (
//     <div className="flex items-start gap-3">
//       <div className="mt-0.5 shrink-0">{icon}</div>
//       <div>
//         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</p>
//         <p className="text-sm font-semibold text-slate-700">{value}</p>
//       </div>
//     </div>
//   );
// }