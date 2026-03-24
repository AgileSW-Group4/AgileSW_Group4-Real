"use client";

import { Marker, Popup } from "react-leaflet";
import L from "leaflet";

// ── Type — mirrors the Incident interface in marineContext.tsx ─────────────────
export type Incident = {
  id: string;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  risk_level: number;          // 1–5
  status: "กำลังดำเนินการ" | "รอดำเนินการ" | "เสร็จสิ้น";
  responsible_unit: string;
  vdo_url: string;
  created_at: string;
  updated_at: string;
};

// ── Map risk_level (1–5) → severity label + colour ────────────────────────────
function riskColor(risk: number): { bg: string; ring: string; label: string } {
  if (risk <= 1) return { bg: "#16a34a", ring: "#bbf7d0", label: "ต่ำ" };       // LOW
  if (risk === 2) return { bg: "#84cc16", ring: "#d9f99d", label: "ต่ำปานกลาง" }; // LOW-MED
  if (risk === 3) return { bg: "#f59e0b", ring: "#fde68a", label: "ปานกลาง" };  // MEDIUM
  if (risk === 4) return { bg: "#ea580c", ring: "#fed7aa", label: "สูง" };      // HIGH
  return { bg: "#dc2626", ring: "#fecaca", label: "วิกฤต" };        // CRITICAL
}

// ── Status badge colour ────────────────────────────────────────────────────────
function statusStyle(status: string): string {
  switch (status) {
    case "กำลังดำเนินการ": return "#2563eb";
    case "รอดำเนินการ": return "#f59e0b";
    case "เสร็จสิ้น": return "#16a34a";
    default: return "#6b7280";
  }
}

// ── Custom warning/triangle SVG icon ──────────────────────────────────────────
function createIncidentIcon(risk: number): L.DivIcon {
  const { bg, ring } = riskColor(risk);
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="40" height="40">
      <circle cx="20" cy="20" r="19" fill="${ring}" stroke="${bg}" stroke-width="1.5" opacity="0.6"/>
      <circle cx="20" cy="20" r="13" fill="${bg}"/>
      <g transform="translate(20,20)" fill="white">
        <path d="M0,-8 L8,7 L-8,7 Z" stroke="white" stroke-width="1" fill="${bg}"/>
        <path d="M0,-6 L6.5,6 L-6.5,6 Z" fill="none" stroke="white" stroke-width="1.5"/>
        <rect x="-1" y="-2" width="2" height="4" rx="0.5" fill="white"/>
        <circle cx="0" cy="4" r="1" fill="white"/>
      </g>
    </svg>`;
  return L.divIcon({
    html: svg,
    className: "",
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -22],
  });
}

// ── Popup card ─────────────────────────────────────────────────────────────────
function IncidentPopup({ incident }: { incident: Incident }) {
  const { bg, label } = riskColor(incident.risk_level);
  const statColor = statusStyle(incident.status);

  const fmt = (iso: string) => {
    try { return new Date(iso).toLocaleString("th-TH"); }
    catch { return iso; }
  };

  const Badge = ({ color, text }: { color: string; text: string }) => (
    <span
      style={{
        background: color, color: "white",
        borderRadius: 4, padding: "2px 8px",
        fontSize: 11, fontWeight: 700, letterSpacing: 0.5,
      }}
    >
      {text}
    </span>
  );

  const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div
      style={{
        display: "flex", justifyContent: "space-between",
        alignItems: "center", padding: "5px 0",
        borderBottom: "1px solid #f1f5f9",
      }}
    >
      <span style={{ color: "#64748b", fontSize: 12, flexShrink: 0, marginRight: 8 }}>{label}:</span>
      <span style={{ fontWeight: 600, fontSize: 12, color: "#1e293b", textAlign: "right" }}>
        {value}
      </span>
    </div>
  );

  return (
    <div style={{ fontFamily: "Inter, sans-serif", width: 280 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <div
          style={{
            width: 36, height: 36, borderRadius: "50%",
            background: bg, display: "flex", alignItems: "center",
            justifyContent: "center", flexShrink: 0,
          }}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="white">
            <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
          </svg>
        </div>
        <span style={{ fontWeight: 700, fontSize: 14, color: "#1e293b", lineHeight: 1.3 }}>
          {incident.title}
        </span>
      </div>

      {/* Rows */}
      <Row label="Incident ID" value={incident.id} />
      <Row label="สถานะ" value={<Badge color={statColor} text={incident.status} />} />
      <Row label="ระดับความเสี่ยง" value={<Badge color={bg} text={`${incident.risk_level} – ${label}`} />} />
      <Row label="หน่วยรับผิดชอบ" value={incident.responsible_unit} />
      <Row label="พิกัด" value={`${incident.latitude.toFixed(4)}°, ${incident.longitude.toFixed(4)}°`} />
      <Row label="แจ้งเหตุ" value={fmt(incident.created_at)} />
      <Row label="อัปเดต" value={fmt(incident.updated_at)} />

      {/* Description */}
      {incident.description && (
        <div
          style={{
            marginTop: 10, background: "#f8fafc", borderRadius: 6,
            padding: "8px 10px", fontSize: 12, color: "#475569",
            borderLeft: `3px solid ${bg}`,
          }}
        >
          {incident.description}
        </div>
      )}

      {/* VDO link */}
      {incident.vdo_url && (
        <a
          href={incident.vdo_url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-block", marginTop: 10,
            fontSize: 12, color: "#2563eb", textDecoration: "underline",
          }}
        >
          🎥 ดูวิดีโอ
        </a>
      )}
    </div>
  );
}

// ── Main export ────────────────────────────────────────────────────────────────
export default function IncidentMarker({ incident }: { incident: Incident }) {
  return (
    <Marker
      position={[incident.latitude, incident.longitude]}
      icon={createIncidentIcon(incident.risk_level)}
    >
      <Popup minWidth={290}>
        <IncidentPopup incident={incident} />
      </Popup>
    </Marker>
  );
}
