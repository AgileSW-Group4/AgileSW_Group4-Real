"use client";

import { Marker, Popup } from "react-leaflet";
import L from "leaflet";

// ── Types ──────────────────────────────────────────────────────────────────────
export type Ship = {
  id: string;
  name: string;
  status: "ACTIVE" | "IDLE" | "OFFLINE" | string;
         // knots
  latitude: number;
  longitude: number;
  lastUpdate: string;      // ISO string or display string
};

// ── Helper: pick icon colour by status ────────────────────────────────────────
function statusColor(status: string): { bg: string; ring: string; text: string } {
  switch (status.toUpperCase()) {
    case "ACTIVE":  return { bg: "#16a34a", ring: "#bbf7d0", text: "#15803d" };
    case "IDLE":    return { bg: "#2563eb", ring: "#bfdbfe", text: "#1d4ed8" };
    case "OFFLINE": return { bg: "#6b7280", ring: "#e5e7eb", text: "#4b5563" };
    default:        return { bg: "#f59e0b", ring: "#fde68a", text: "#b45309" };
  }
}

// ── Custom ship SVG icon ───────────────────────────────────────────────────────
function createShipIcon(status: string): L.DivIcon {
  const { bg, ring } = statusColor(status);
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="40" height="40">
      <!-- outer ring (pulse feel) -->
      <circle cx="20" cy="20" r="19" fill="${ring}" stroke="${bg}" stroke-width="1.5" opacity="0.6"/>
      <!-- inner circle -->
      <circle cx="20" cy="20" r="13" fill="${bg}"/>
      <!-- ship icon (anchor / vessel silhouette) -->
      <g transform="translate(20,20)" fill="white">
        <!-- hull -->
        <path d="M-7,2 Q0,9 7,2 L5,-2 L-5,-2 Z"/>
        <!-- mast -->
        <rect x="-1" y="-9" width="2" height="10" rx="1"/>
        <!-- sail / flag -->
        <path d="M1,-8 L7,-5 L1,-2 Z"/>
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
function ShipPopup({ ship }: { ship: Ship }) {
  const { bg, ring, text } = statusColor(ship.status);

  const formattedDate = (() => {
    try { return new Date(ship.lastUpdate).toLocaleString(); }
    catch { return ship.lastUpdate; }
  })();

  return (
    <div style={{ fontFamily: "Inter, sans-serif", width: 260 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <div
          style={{
            width: 36, height: 36, borderRadius: "50%",
            background: bg, display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          {/* mini ship icon */}
          <svg viewBox="0 0 24 24" width="20" height="20" fill="white"
            xmlns="http://www.w3.org/2000/svg">
            <path d="M3 17l1.5 3h15l1.5-3H3zm15.5-9H14V5h-4v3H5.5L4 17h16L18.5 8z"/>
          </svg>
        </div>
        <span style={{ fontWeight: 700, fontSize: 16, color: "#1e293b" }}>{ship.name}</span>
      </div>

      {/* Divider */}
      <div style={{ borderTop: "1px solid #e2e8f0", marginBottom: 10 }} />

      {/* Details */}
      {[
        { label: "Ship ID",     value: ship.id },
        {
          label: "Status",
          value: (
            <span
              style={{
                background: bg, color: "white",
                borderRadius: 4, padding: "2px 8px",
                fontSize: 12, fontWeight: 700, letterSpacing: 1,
              }}
            >
              {ship.status.toUpperCase()}
            </span>
          ),
        },
    
        { label: "Position",    value: `${ship.latitude.toFixed(4)}°, ${ship.longitude.toFixed(4)}°` },
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
export default function ShipMarker({ ship }: { ship: Ship }) {
  return (
    <Marker
      key={ship.id}
      position={[ship.latitude, ship.longitude]}
      icon={createShipIcon(ship.status)}
    >
      <Popup minWidth={270}>
        <ShipPopup ship={ship} />
      </Popup>
    </Marker>
  );
}
