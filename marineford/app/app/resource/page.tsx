"use client";

import { useState } from "react";
// import "./globals.css";

type Ship = {
  id: number;
  name: string;
  fuel: number;
  equipmentOk: boolean;
};

export default function ResourcePage() {
  const [ships, setShips] = useState<Ship[]>([
    { id: 1, name: "Marine 01", fuel: 80, equipmentOk: true },
    { id: 2, name: "Marine 02", fuel: 40, equipmentOk: false },
  ]);

  const updateShip = (id: number, field: keyof Ship, value: any) => {
    setShips((prev) =>
      prev.map((ship) =>
        ship.id === id ? { ...ship, [field]: value } : ship
      )
    );
  };

  const checkReady = (ship: Ship) => {
    return ship.fuel >= 60 && ship.equipmentOk;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-blue-900">
          🚢 Ship Resource Dashboard
        </h1>
        <p className="text-gray-600">
          ตรวจสอบความพร้อมของเรือและจัดการทรัพยากร
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl shadow p-4">
          <p className="text-gray-500">Total Ships</p>
          <h2 className="text-2xl font-bold">{ships.length}</h2>
        </div>

        <div className="bg-green-100 rounded-2xl shadow p-4">
          <p className="text-green-700">Ready</p>
          <h2 className="text-2xl font-bold">
            {ships.filter(checkReady).length}
          </h2>
        </div>

        <div className="bg-red-100 rounded-2xl shadow p-4">
          <p className="text-red-700">Not Ready</p>
          <h2 className="text-2xl font-bold">
            {ships.filter((s) => !checkReady(s)).length}
          </h2>
        </div>
      </div>

      {/* Ship List */}
      <div className="grid md:grid-cols-2 gap-6">
        {ships.map((ship) => {
          const ready = checkReady(ship);

          return (
            <div
              key={ship.id}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition"
            >
              {/* Title */}
              <h2 className="text-xl font-semibold text-blue-800 mb-4">
                {ship.name}
              </h2>

              {/* Fuel */}
              <div className="mb-4">
                <label className="block text-sm text-gray-600 mb-1">
                  Fuel Level (%)
                </label>
                <input
                  type="number"
                  value={ship.fuel}
                  onChange={(e) =>
                    updateShip(ship.id, "fuel", Number(e.target.value))
                  }
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                />
              </div>

              {/* Equipment */}
              <div className="mb-4 flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={ship.equipmentOk}
                  onChange={(e) =>
                    updateShip(ship.id, "equipmentOk", e.target.checked)
                  }
                  className="w-4 h-4"
                />
                <span className="text-gray-700">
                  Equipment in good condition
                </span>
              </div>

              {/* Status */}
              <div
                className={`mt-4 p-3 rounded-lg text-center font-semibold ${
                  ready
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {ready ? "✅ Ready for Operation" : "❌ Not Ready"}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}