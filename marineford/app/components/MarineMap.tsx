"use client";

import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// --- ส่วนที่ 1: Component แสดงพิกัดตามเมาส์ ---
function MouseCoordinates() {
  const [position, setPosition] = useState({ lat: 13.550, lng: 100.580 });

  useMapEvents({
    mousemove(e) {
      setPosition(e.latlng);
    },
  });

  const toDDM = (deg: number, type: 'lat' | 'lng') => {
    const absolute = Math.abs(deg);
    const d = Math.floor(absolute);
    const m = ((absolute - d) * 60).toFixed(3);
    const dir = type === 'lat' ? (deg >= 0 ? 'N' : 'S') : (deg >= 0 ? 'E' : 'W');
    return `${dir}${d}°${m}'`;
  };

  return (
    <div className="absolute bottom-6 right-6 z-[1000] pointer-events-none">
      <div className="bg-white/90 backdrop-blur-md border border-blue-200 px-4 py-2 rounded-lg shadow-xl font-mono text-[13px] text-blue-900 flex flex-col items-end border-l-4 border-l-blue-600">
        <div className="text-[10px] text-blue-500 font-bold uppercase tracking-wider mb-1">Cursor Location</div>
        <div className="font-bold">{toDDM(position.lat, 'lat')}</div>
        <div className="font-bold">{toDDM(position.lng, 'lng')}</div>
      </div>
    </div>
  );
}

// --- ส่วนที่ 2: ตัว Component แผนที่หลัก ---
export default function MarineMap() {
  // ตั้งค่า Icon สำหรับ Marker
  const customIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41]
  });

  return (
    <div className="w-full h-full relative">
      <MapContainer 
        center={[13.550, 100.580]} 
        zoom={12} 
        className="w-full h-full z-10"
      >
        <TileLayer
          attribution='&copy; OpenStreetMap & OpenSeaMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* เลเยอร์ข้อมูลเดินเรือจาก OpenSeaMap */}
        <TileLayer url="https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png" />

        {/* เรียกใช้พิกัดตามเมาส์ที่นี่ */}
        <MouseCoordinates />

        {/* Mock Data: จุดเกิดเหตุ */}
        <Marker position={[13.565, 100.595]} icon={customIcon}>
          <Popup>🚨 แจ้งเหตุ: เรือประมงเครื่องยนต์ขัดข้อง</Popup>
        </Marker>

        {/* Mock Data: พื้นที่สถานี */}
        <Circle  
          center={[13.590, 100.590]} 
          pathOptions={{ color: 'blue', fillColor: '#304ffe', fillOpacity: 0.2 }}
          radius={1000}
        />
      </MapContainer>
    </div>
  );
}