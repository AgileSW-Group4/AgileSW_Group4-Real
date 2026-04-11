"use client";

import { useState, useEffect } from "react";
import { 
  MapContainer, 
  TileLayer, 
  Polygon, 
  useMapEvents, 
  LayersControl,
  Marker 
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import ShipMarker, { type Ship } from "@/components/ShipMarker";

const WEATHER_API_KEY = "1726832e4269c6175ac3226ab85e71c3";

//  ระบบ Beaufort Scale มาตรฐานสากล
const getBeaufortData = (speedKmh: number) => {
  if (speedKmh < 1)  return { force: 0, desc: "ทะเลสงบ (Calm)", type: "safe" };
  if (speedKmh <= 5)  return { force: 1, desc: "ลมอ่อนมาก (Light air)", type: "safe" };
  if (speedKmh <= 11) return { force: 2, desc: "ลมอ่อน (Light breeze)", type: "safe" };
  if (speedKmh <= 19) return { force: 3, desc: "ลมโชย (Gentle breeze)", type: "safe" };
  if (speedKmh <= 28) return { force: 4, desc: "ลมปานกลาง (Moderate)", type: "safe" };
  if (speedKmh <= 38) return { force: 5, desc: "ลมค่อนข้างแรง (Fresh)", type: "warning" };
  if (speedKmh <= 49) return { force: 6, desc: "ลมพัดจัด (Strong)", type: "danger" };
  if (speedKmh <= 61) return { force: 7, desc: "พายุอ่อนๆ (Near Gale)", type: "danger" };
  if (speedKmh <= 74) return { force: 8, desc: "พายุ (Gale)", type: "danger" };
  if (speedKmh <= 88) return { force: 9, desc: "พายุรุนแรง (Severe Gale)", type: "danger" };
  if (speedKmh <= 102) return { force: 10, desc: "พายุใหญ่ (Storm)", type: "danger" };
  if (speedKmh <= 117) return { force: 11, desc: "พายุใหญ่มาก (Violent Storm)", type: "danger" };
  return { force: 12, desc: "เฮอร์ริเคน (Hurricane)", type: "danger" };
};

// โซนพื้นที่ทะเล
const THAI_MARINE_ZONES = [
  { id: "z-upper", name: "อ่าวไทยตอนบน", center: [12.9, 100.4], coords: [[13.5, 100.1], [13.4, 100.9], [12.8, 100.9], [12.5, 99.9], [13.0, 99.9]] },
  { id: "z-east", name: "อ่าวไทยตะวันออก", center: [12.2, 101.6], coords: [[12.8, 100.9], [12.6, 102.6], [11.5, 102.6], [11.5, 100.9]] },
  { id: "z-central", name: "อ่าวไทยตอนกลาง", center: [11.0, 100.2], coords: [[12.5, 99.9], [11.5, 100.9], [10.0, 100.9], [10.0, 99.2], [11.0, 99.4]] },
  { id: "z-lower", name: "อ่าวไทยตอนล่าง", center: [8.5, 101.0], coords: [[10.0, 99.2], [10.0, 101.5], [6.5, 102.5], [6.5, 100.0], [8.0, 100.0]] },
  { id: "z-andaman-up", name: "อันดามันตอนบน", center: [9.0, 97.8], coords: [[10.0, 98.2], [10.0, 98.6], [8.0, 98.3], [8.0, 97.0], [10.0, 97.0]] },
  { id: "z-andaman-low", name: "อันดามันตอนล่าง", center: [7.0, 98.5], coords: [[8.0, 98.3], [8.0, 99.3], [6.5, 99.6], [6.5, 97.5], [8.0, 97.0]] }
];

const getVisualRotation = (deg: number) => (deg + 180) % 360;

//  ฟังก์ชันสำหรับดักจับ Event บนแผนที่
function MapEvents({ 
  onLocationSelect, 
  onMouseMove 
}: { 
  onLocationSelect: (lat: number, lng: number) => void,
  onMouseMove: (lat: number, lng: number) => void 
}) {
  useMapEvents({ 
    click(e) { onLocationSelect(e.latlng.lat, e.latlng.lng); },
    mousemove(e) { onMouseMove(e.latlng.lat, e.latlng.lng); }
  });
  return null;
}

export default function MarineZoneMap({ ships = [] }: { ships: Ship[] }) {
  const [selectedCoords, setSelectedCoords] = useState({ lat: 12.9, lng: 100.4 });
  const [hoverCoords, setHoverCoords] = useState<{lat: number, lng: number} | null>(null);
  const [selectedData, setSelectedData] = useState<any>(null);
  const [selectedLoading, setSelectedLoading] = useState(false);
  const [allZonesData, setAllZonesData] = useState<any[]>([]);
  const [scanLoading, setScanLoading] = useState(false);
  
  //  State เก็บเวลานับถอยหลัง 10 นาที (600 วินาที)
  const [countdown, setCountdown] = useState(600);

  useEffect(() => {
    const fetchSelectedPoint = async () => {
      setSelectedLoading(true);
      try {
        const [mRes, wRes] = await Promise.all([
          fetch(`https://marine-api.open-meteo.com/v1/marine?latitude=${selectedCoords.lat}&longitude=${selectedCoords.lng}&current=wave_height&timezone=Asia%2FBangkok`),
          fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${selectedCoords.lat}&lon=${selectedCoords.lng}&appid=${WEATHER_API_KEY}&units=metric`)
        ]);
        const mData = await mRes.json();
        const wData = await wRes.json();
        const windSpdKmh = (wData.wind?.speed || 0) * 3.6;
        
        setSelectedData({
          zoneName: "CUSTOM POINT",
          wave: mData.current?.wave_height ?? null,
          windSpd: windSpdKmh,
          windDeg: wData.wind?.deg || 0,
          beaufort: getBeaufortData(windSpdKmh),
          lat: selectedCoords.lat,
          lng: selectedCoords.lng
        });
      } catch (e) { setSelectedData(null); }
      setSelectedLoading(false);
    };
    fetchSelectedPoint();
  }, [selectedCoords]);

  useEffect(() => {
    let isScanning = false;

    const scanZones = async () => {
      if (isScanning) return; 
      isScanning = true;
      setScanLoading(true);
      const scannedZones: any[] = [];
      
      for (const zone of THAI_MARINE_ZONES) {
        try {
          const [mr, wr] = await Promise.all([
            fetch(`https://marine-api.open-meteo.com/v1/marine?latitude=${zone.center[0]}&longitude=${zone.center[1]}&current=wave_height&timezone=Asia%2FBangkok`),
            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${zone.center[0]}&lon=${zone.center[1]}&appid=${WEATHER_API_KEY}&units=metric`)
          ]);
          const md = await mr.json();
          const wd = await wr.json();
          const wh = md.current?.wave_height || 0;
          const wsKmh = (wd.wind?.speed || 0) * 3.6;
          const bf = getBeaufortData(wsKmh);

          scannedZones.push({ 
            ...zone, 
            waveHeight: wh, 
            windSpeed: wsKmh, 
            windDeg: wd.wind?.deg || 0,
            beaufort: bf,
            isDanger: bf.type === 'danger' || bf.type === 'warning'
          });
        } catch (e) { console.error(`Scan failed at ${zone.name}`); }
      }
      setAllZonesData(scannedZones);
      setScanLoading(false);
      isScanning = false;
    };

    scanZones(); // ทำงานทันทีตอนโหลดครั้งแรก

    const timerInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          scanZones(); 
          return 600; // เซ็ตกลับไปที่ 10 นาที (600 วินาที)
        }
        return prev - 1;
      });
    }, 1000); 
    
    return () => clearInterval(timerInterval);
  }, []);

  const handleZoneClick = (zoneData: any) => {
    setSelectedData({
      zoneName: zoneData.name,
      wave: zoneData.waveHeight,
      windSpd: zoneData.windSpeed,
      windDeg: zoneData.windDeg,
      beaufort: zoneData.beaufort,
      lat: zoneData.center[0],
      lng: zoneData.center[1]
    });
  };

  const dangerZones = allZonesData.filter(z => z.isDanger);

  const getStatusStyle = (type: string) => {
    if (type === 'danger') return 'bg-red-500/20 text-red-400 border-red-500/50';
    if (type === 'warning') return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
    return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40';
  };

  //  ฟังก์ชันแปลงวินาทีเป็นรูปแบบ MM:SS
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="w-full h-full relative font-sans text-slate-900 bg-slate-900">
      <style jsx global>{`
        @keyframes zone-pulse { 0% { fill-opacity: 0.15; } 50% { fill-opacity: 0.4; } 100% { fill-opacity: 0.15; } }
        .danger-polygon { animation: zone-pulse 2s infinite; stroke-dasharray: 10, 10; cursor: pointer; }
        .safe-polygon { cursor: pointer; }
        .safe-polygon:hover { fill-opacity: 0.2; }
        .rain-layer { filter: saturate(1.8) brightness(1.1); }
      `}</style>

      <MapContainer center={[10.50, 100.50]} zoom={6} className="w-full h-full z-10" zoomControl={false}>
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name=" แผนที่มาตรฐาน">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          </LayersControl.BaseLayer>
          <LayersControl.Overlay checked name=" เรดาร์ฝน">
            <TileLayer url={`https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${WEATHER_API_KEY}`} opacity={0.7} className="rain-layer" />
          </LayersControl.Overlay>
          <LayersControl.Overlay name=" เรดาร์ลม">
            <TileLayer url={`https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${WEATHER_API_KEY}`} opacity={0.5} />
          </LayersControl.Overlay>
        </LayersControl>

        <MapEvents 
          onLocationSelect={(lat, lng) => setSelectedCoords({ lat, lng })} 
          onMouseMove={(lat, lng) => setHoverCoords({ lat, lng })}
        />

        {allZonesData.map((zone) => (
          <div key={`zone-${zone.id}`}>
            <Polygon 
              positions={zone.coords as any} 
              eventHandlers={{ click: () => handleZoneClick(zone) }}
              pathOptions={{ 
                color: zone.beaufort.type === 'danger' ? '#ef4444' : zone.beaufort.type === 'warning' ? '#f97316' : '#38bdf8', 
                weight: zone.isDanger ? 3 : 1, 
                fillOpacity: 0.05, 
                dashArray: zone.isDanger ? undefined : '4, 8',
                className: zone.isDanger ? 'danger-polygon' : 'safe-polygon'
              }} 
            />
            {zone.isDanger && (
              <Marker 
                position={zone.center as any} 
                icon={L.divIcon({
                  className: '',
                  html: `<div style="transform: rotate(${getVisualRotation(zone.windDeg)}deg); color: ${zone.beaufort.type === 'danger' ? '#b91c1c' : '#c2410c'}; text-shadow: 0 0 5px #fff; font-size: 32px; font-weight: 900; line-height: 1; pointer-events: none;">↑</div>
                         <div style="background: rgba(0,0,0,0.8); color: white; font-size: 10px; padding: 2px 6px; border-radius: 4px; margin-top: 4px; text-align: center; white-space: nowrap; margin-left: -30px; pointer-events: none;">
                             Force ${zone.beaufort.force}
                         </div>`,
                  iconSize: [40, 40],
                  iconAnchor: [20, 20]
                })}
              />
            )} 
          </div>
        ))}
        {ships.map((ship) => (
                  <ShipMarker key={ship.id} ship={ship} />
        ))}
      </MapContainer>

      {/* --- UI Overlays --- */}
      
      {/*  พิกัดเมาส์มุมขวาล่าง */}
      <div className="absolute bottom-6 right-6 z-[1000] pointer-events-none">
        <div className="bg-slate-900/80 border border-slate-700 px-3 py-1.5 rounded-lg shadow-lg backdrop-blur-sm text-[10px] font-mono text-slate-400 tracking-wider flex gap-3 items-center">
          {hoverCoords ? (
            <>
              <span>LAT <span className="text-white font-bold">{hoverCoords.lat.toFixed(4)}</span></span>
              <span className="w-px h-3 bg-slate-600"></span>
              <span>LNG <span className="text-white font-bold">{hoverCoords.lng.toFixed(4)}</span></span>
            </>
          ) : (
            <span>SCANNING AREA...</span>
          )}
        </div>
      </div>

      <div className="absolute top-6 left-6 z-[1000] space-y-4 pointer-events-none">
        
        {/* Status Badge พร้อม Countdown แบบ MM:SS */}
        <div className="bg-slate-900/90 border border-slate-700 px-4 py-2 rounded-full shadow-2xl flex items-center gap-3 backdrop-blur-sm pointer-events-auto">
          <div className={`w-2 h-2 rounded-full ${scanLoading ? 'bg-amber-500 animate-pulse' : (dangerZones.length > 0 ? 'bg-red-500 animate-ping' : 'bg-emerald-500')}`} />
          <span className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2">
            {scanLoading ? 'Zone Scanning...' : `Alert in ${dangerZones.length} Zones`}
            
            {!scanLoading && (
              <span className="bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded text-[9px] min-w-[30px] text-center font-mono">
                {formatTime(countdown)}
              </span>
            )}
          </span>
        </div>

        {/* Info Card สำหรับจุดหรือโซนที่คลิก */}
        <div className="pointer-events-auto">
          {!selectedData || selectedData.wave === null ? (
            <div className="bg-slate-950/95 border-2 border-slate-800 p-4 rounded-3xl text-white w-64 shadow-2xl backdrop-blur-sm">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 italic">Marine System</p>
                <div className="text-center py-4 bg-slate-900/50 rounded-2xl border border-slate-800">
                   <p className="text-[10px] font-bold text-slate-400 uppercase">Click on Sea or Zone</p>
                </div>
            </div>
          ) : (
            <div className="bg-slate-950/95 border-2 border-slate-800 p-5 rounded-3xl text-white w-64 shadow-2xl backdrop-blur-sm flex flex-col">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest truncate mr-2">{selectedData.zoneName}</span>
                <span className="text-[10px] font-bold bg-slate-800 px-2 py-0.5 rounded text-slate-300 shrink-0">
                  Force {selectedData.beaufort.force}
                </span>
              </div>
              
              <div className={`mb-4 py-2 px-3 rounded-xl text-center text-[10px] font-black uppercase tracking-tight border shadow-inner ${getStatusStyle(selectedData.beaufort.type)}`}>
                {selectedLoading ? 'Analyzing...' : selectedData.beaufort.desc}
              </div>

              <div className="space-y-5">
                <div>
                  <span className="text-[9px] text-slate-500 font-black uppercase block mb-1 tracking-widest">Wave Height</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black tracking-tighter text-white">
                      {selectedData.wave.toFixed(2)}
                    </span>
                    <span className="text-[10px] font-bold text-slate-600 uppercase">m</span>
                  </div>
                </div>
                
                <div>
                  <span className="text-[9px] text-slate-500 font-black uppercase block mb-1 tracking-widest">Wind Speed</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black tracking-tight text-white">
                      {selectedData.windSpd.toFixed(1)}
                    </span>
                    <span className="text-[10px] font-bold text-slate-600 uppercase">km/h</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800 flex justify-between items-center text-[9px] font-mono text-slate-500 tracking-wider">
                <span>LAT {selectedData.lat?.toFixed(4) ?? '-'}</span>
                <span>LNG {selectedData.lng?.toFixed(4) ?? '-'}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}