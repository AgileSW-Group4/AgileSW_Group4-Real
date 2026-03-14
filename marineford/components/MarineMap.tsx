"use client";

import { MapContainer, TileLayer, Marker, Popup, Circle, LayersControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// ตั้งค่า Icon ให้แสดงผลถูกต้องใน Next.js
const markerIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function MarineMap() {
  const centerPos: [number, number] = [13.550, 100.580];

  return (
    <div className="w-full h-[calc(100vh-3.5rem)]">
      <MapContainer 
        center={centerPos} 
        zoom={12} 
        className="w-full h-full z-10" // ให้ z-index น้อยกว่า Navbar
      >
        <LayersControl position="topright">
          {/* Base Layer - ถนนทั่วไป */}
          <LayersControl.BaseLayer checked name="แผนที่ถนน (OSM)">
            <TileLayer
              attribution='&copy; OpenStreetMap'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>

          {/* Overlay Layer - ข้อมูลทางน้ำ */}
          <LayersControl.Overlay checked name="ข้อมูลเดินเรือ (Seamarks)">
            <TileLayer
              attribution='Map data: &copy; OpenSeaMap'
              url="https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png"
            />
          </LayersControl.Overlay>

          {/* จุดแจ้งเหตุ (Incident) */}
          <Marker position={[13.565, 100.595]} icon={markerIcon}>
            <Popup>
              <div className="p-1">
                <h3 className="font-bold text-red-600">🚨 เรือเครื่องยนต์ขัดข้อง</h3>
                <p className="text-xs text-slate-600 mt-1">
                  สถานะ: กำลังส่งเรือตรวจการณ์เข้าช่วยเหลือ
                </p>
              </div>
            </Popup>
          </Marker>

          {/* ฐานปฏิบัติการ */}
          <Circle 
            center={[13.590, 100.590]} 
            pathOptions={{ color: '#1e40af', fillColor: '#1e40af', fillOpacity: 0.4 }}
            radius={800}
          >
            <Popup>สถานีตำรวจทางน้ำ (ฐานปฏิบัติการ)</Popup>
          </Circle>
        </LayersControl>
      </MapContainer>
    </div>
  );
}