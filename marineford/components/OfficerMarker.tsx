"use client";

import { Marker, Popup } from "react-leaflet";
import L from "leaflet";

// ── Types ──────────────────────────────────────────────────────────────────────
export type Officer = {
  officer_id: string;
  name: string;
  status: "Active" | "Inactive" | string;
  rank: "Captain" | "Lieutenant" | "Sergeant" | string;
  last_update: string;
  latitude: number;
  longitude: number;
};

// ── Helper: pick icon colour by rank ──────────────────────────────────────────
function rankColor(rank: string): { bg: string; ring: string; text: string } {
  switch (rank) {
    case "Captain":    return { bg: "#7c3aed", ring: "#ede9fe", text: "#6d28d9" };
    case "Lieutenant": return { bg: "#0369a1", ring: "#e0f2fe", text: "#0284c7" };
    case "Sergeant":   return { bg: "#0f766e", ring: "#ccfbf1", text: "#0d9488" };
    default:           return { bg: "#f59e0b", ring: "#fde68a", text: "#b45309" };
  }
}

// ── Custom officer SVG icon ────────────────────────────────────────────────────
function createOfficerIcon(rank: string, status: string): L.DivIcon {
  const { bg, ring } = rankColor(rank);
  const isOffline = status.toLowerCase() !== "active";
  const finalBg = isOffline ? "#6b7280" : bg;
  const finalRing = isOffline ? "#e5e7eb" : ring;

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="40" height="40">
      <!-- outer ring -->
      <circle cx="20" cy="20" r="19" fill="${finalRing}" stroke="${finalBg}" stroke-width="1.5" opacity="0.6"/>
      <!-- inner circle -->
      <circle cx="20" cy="20" r="13" fill="${finalBg}"/>
      <!-- person icon -->
      <g fill="white">
        <!-- head -->
        <circle cx="20" cy="14" r="4"/>
        <!-- body -->
        <path d="M12,28 Q12,21 20,21 Q28,21 28,28 Z"/>
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
function OfficerPopup({ officer }: { officer: Officer }) {
  const { bg } = rankColor(officer.rank);
  const isOffline = officer.status.toLowerCase() !== "active";
  const statusBg = isOffline ? "#6b7280" : "#16a34a";

  const formattedDate = (() => {
    try { return new Date(officer.last_update).toLocaleString("th-TH"); }
    catch { return officer.last_update; }
  })();

  return (
    <div style={{ fontFamily: "Inter, sans-serif", width: 260 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <div
          style={{
            width: 36, height: 36, borderRadius: "50%",
            background: isOffline ? "#6b7280" : bg,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          {/* person icon */}
          <svg viewBox="0 0 24 24" width="20" height="20" fill="white" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
          </svg>
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 15, color: "#1e293b" }}>{officer.name}</div>
          <div style={{ fontSize: 12, color: isOffline ? "#6b7280" : bg, fontWeight: 600 }}>{officer.rank}</div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ borderTop: "1px solid #e2e8f0", marginBottom: 10 }} />

      {/* Details */}
      {[
        { label: "Officer ID", value: officer.officer_id },
        {
          label: "Status",
          value: (
            <span style={{
              background: statusBg, color: "white",
              borderRadius: 4, padding: "2px 8px",
              fontSize: 12, fontWeight: 700, letterSpacing: 1,
            }}>
              {officer.status.toUpperCase()}
            </span>
          ),
        },
        { label: "Position", value: `${officer.latitude.toFixed(4)}°, ${officer.longitude.toFixed(4)}°` },
        { label: "Last Update", value: formattedDate },
      ].map(({ label, value }) => (
        <div
          key={label}
          style={{
            display: "flex", justifyContent: "space-between",
            alignItems: "center", padding: "5px 0",
          }}
        >
          <span style={{ color: "#64748b", fontSize: 13 }}>{label}:</span>
          <span style={{ fontWeight: 600, fontSize: 13, color: "#1e293b" }}>{value as React.ReactNode}</span>
        </div>
      ))}
    </div>
  );
}

// ── Main export ────────────────────────────────────────────────────────────────
export default function OfficerMarker({ officer }: { officer: Officer }) {
  return (
    <Marker
      position={[officer.latitude, officer.longitude]}
      icon={createOfficerIcon(officer.rank, officer.status)}
    >
      <Popup minWidth={270}>
        <OfficerPopup officer={officer} />
      </Popup>
    </Marker>
  );
}