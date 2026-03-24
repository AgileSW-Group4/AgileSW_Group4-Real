"use client";

import { useState, useContext } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { useMarineContext } from "@/app/context/marineContext";
import ShipMarker, { Ship } from "./ShipMarker";
import IncidentMarker, { Incident } from "./IncidentMarker";

// ── Types ──────────────────────────────────────────────────────────────────────
type Officer = {
  id: string;
  name: string;
  rank: string;
  latitude: number;
  longitude: number;
  status: string;
};

type Props = {
  officers?: Officer[];
  ships?: Ship[];
  incidents?: Incident[];
};

// ── Mouse coordinate overlay ───────────────────────────────────────────────────
function MouseCoordinates() {
  const [position, setPosition] = useState({ lat: 13.55, lng: 100.58 });

  useMapEvents({
    mousemove(e) { setPosition(e.latlng); },
  });

  const toDDM = (deg: number, type: "lat" | "lng") => {
    const abs = Math.abs(deg);
    const d = Math.floor(abs);
    const m = ((abs - d) * 60).toFixed(3);
    const dir = type === "lat" ? (deg >= 0 ? "N" : "S") : (deg >= 0 ? "E" : "W");
    return `${dir}${d}°${m}'`;
  };

  return (
    <div className="absolute bottom-6 right-6 z-[1000] pointer-events-none">
      <div className="bg-white/90 backdrop-blur-md border border-blue-200 px-4 py-2 rounded-lg shadow-xl font-mono text-[13px] text-blue-900 flex flex-col items-end border-l-4 border-l-blue-600">
        <div className="text-[10px] text-blue-500 font-bold uppercase tracking-wider mb-1">Cursor Location</div>
        <div className="font-bold">{toDDM(position.lat, "lat")}</div>
        <div className="font-bold">{toDDM(position.lng, "lng")}</div>
      </div>
    </div>
  );
}

// ── Main map component ─────────────────────────────────────────────────────────
export default function MarineMap({
  officers = [],
  ships = [],
  incidents = [],
}: Props) {
  const legacyIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  const userIcon = L.icon({
    iconUrl: "/user.png",
    iconSize: [25, 25],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  const { useIncident } = useMarineContext();
  incidents = useIncident;

  return (
    <div className="w-full h-full relative">
      <MapContainer
        center={[13.55, 100.58]}
        zoom={12}
        className="w-full h-full z-10"
      >
        {/* Base map */}
        <TileLayer
          attribution="&copy; OpenStreetMap &amp; OpenSeaMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* Sea marks overlay */}
        <TileLayer url="https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png" />

        {/* Mouse coordinates */}
        <MouseCoordinates />

        {/* ── Officers ─────────────────────────────────────────── */}
        {officers.map((o) => (
          <Marker key={o.id} position={[o.latitude, o.longitude]} icon={userIcon}>
            <Popup>
              <div className="text-sm">
                <div className="font-bold">{o.name}</div>
                <div className="text-slate-500">{o.rank}</div>
                <div className="font-mono">{o.status}</div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* ── Ships ────────────────────────────────────────────── */}
        {ships.map((ship) => (
          <ShipMarker key={ship.id} ship={ship} />
        ))}

        {/* ── Incidents ────────────────────────────────────────── */}
        {incidents.map((incident) => (
          <IncidentMarker key={incident.id} incident={incident} />
        ))}


        {/* Legacy mock incident marker (keep until replaced by real data) */}
        <Marker position={[13.565, 100.595]} icon={legacyIcon}>
          <Popup>🚨 แจ้งเหตุ: เรือประมงเครื่องยนต์ขัดข้อง</Popup>
        </Marker>

        {/* Station area */}
        <Circle
          center={[13.59, 100.59]}
          pathOptions={{ color: "blue", fillColor: "#304ffe", fillOpacity: 0.2 }}
          radius={1000}
        />
      </MapContainer>
    </div>
  );
}