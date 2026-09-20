import React, { useState } from 'react';
import { 
  Layers, 
  Box, 
  Truck, 
  CheckCircle2, 
  Thermometer, 
  Sparkles, 
  Activity,
  ArrowRight
} from 'lucide-react';

export const WarehouseTwin: React.FC = () => {
  const [selectedZone, setSelectedZone] = useState('Zone A');

  const zones = [
    { id: 'Zone A', name: 'High Cube 40ft Stacks', count: 340, congestion: 'Medium', temp: '22°C', color: 'border-orange-300 bg-orange-50/40' },
    { id: 'Zone B', name: 'Chemical / Hazmat Secure', count: 120, congestion: 'Low', temp: '18°C', color: 'border-blue-300 bg-blue-50/40' },
    { id: 'Zone C', name: 'Cold-Chain Reefer Banks', count: 210, congestion: 'Low', temp: '4°C Active', color: 'border-cyan-300 bg-cyan-50/40' },
    { id: 'Zone D', name: 'Intermodal Rail Transfer', count: 480, congestion: 'High', temp: 'Ambient', color: 'border-red-300 bg-red-50/40' },
  ];

  return (
    <div className="w-full bg-white rounded-3xl border border-[#EAEFF4] shadow-card p-6 flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-orange-50 text-[#FF5C00] flex items-center justify-center font-bold">
            <Layers size={20} />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
              <span>Northpoint Intermodal Yard — 2D Digital Twin</span>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                Live Heatmap
              </span>
            </h3>
            <p className="text-xs text-gray-500">
              Autonomous Guided Vehicles (AGVs), rubber-tyred gantry crane stacks, and bay congestion telemetry.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold">
          <span className="text-gray-400">Total Yard Capacity:</span>
          <span className="text-[#FF5C00] font-mono">1,150 / 1,500 TEU (76%)</span>
        </div>
      </div>

      {/* Interactive 2D Yard Isometric Canvas */}
      <div className="relative w-full h-80 sm:h-96 bg-gradient-to-tr from-slate-100 via-gray-50 to-slate-200 rounded-3xl border border-gray-200 overflow-hidden p-6 flex flex-col justify-between shadow-inner">
        {/* Yard Crane Gantry Overhead Rail Graphic */}
        <div className="w-full h-4 bg-gray-400/80 rounded-sm shadow flex justify-between px-6 items-center">
          <div className="w-12 h-6 bg-yellow-400 border border-yellow-600 rounded -mb-3 shadow-md flex items-center justify-center text-[8px] font-black">
            CR-01
          </div>
          <div className="w-12 h-6 bg-yellow-400 border border-yellow-600 rounded -mb-3 shadow-md flex items-center justify-center text-[8px] font-black">
            CR-02
          </div>
          <div className="w-12 h-6 bg-yellow-400 border border-yellow-600 rounded -mb-3 shadow-md flex items-center justify-center text-[8px] font-black">
            CR-03
          </div>
        </div>

        {/* 4 Yard Storage Zones Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-auto">
          {zones.map((z) => (
            <div
              key={z.id}
              onClick={() => setSelectedZone(z.id)}
              className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer ${z.color} ${
                selectedZone === z.id ? 'ring-2 ring-[#FF5C00] shadow-md scale-105' : 'hover:shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black text-[#0F172A]">{z.id}</span>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                  z.congestion === 'High' ? 'bg-red-200 text-red-800' : 'bg-emerald-200 text-emerald-800'
                }`}>
                  {z.congestion}
                </span>
              </div>

              {/* 3D Stack of Mini Containers */}
              <div className="space-y-1 my-2">
                <div className="w-full h-4 bg-[#FF5C00] rounded-xs shadow-xs text-[7px] text-white font-mono flex items-center justify-center font-bold">
                  YMLU 890123
                </div>
                <div className="w-full h-4 bg-gray-300 rounded-xs shadow-xs text-[7px] text-gray-700 font-mono flex items-center justify-center">
                  TRHU 559871
                </div>
                <div className="w-full h-4 bg-gray-400 rounded-xs shadow-xs text-[7px] text-white font-mono flex items-center justify-center">
                  MSKU 123456
                </div>
              </div>

              <div className="text-[10px] text-gray-600 mt-2 font-medium">
                <p className="font-bold text-[#0F172A]">{z.count} Containers</p>
                <p>{z.temp}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Moving Forklifts & AGVs on Ground Tracks */}
        <div className="w-full h-10 bg-gray-200/90 rounded-2xl border border-gray-300 flex items-center justify-between px-6 relative overflow-hidden">
          {/* Moving AGV 1 */}
          <div className="flex items-center gap-1 text-xs font-bold text-gray-700 animate-pulse">
            <Truck size={16} className="text-[#FF5C00]" />
            <span className="text-[10px]">AGV-12 [En Route Zone A]</span>
          </div>

          {/* Moving AGV 2 */}
          <div className="flex items-center gap-1 text-xs font-bold text-gray-700">
            <Truck size={16} className="text-blue-600" />
            <span className="text-[10px]">AGV-08 [Railhead Transfer]</span>
          </div>
        </div>
      </div>

      {/* Selected Zone Operational Specs */}
      <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-gray-200/80 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-orange-100 text-[#FF5C00] flex items-center justify-center font-bold">
            <Box size={16} />
          </div>
          <div>
            <h4 className="font-bold text-[#0F172A]">Active Bay: {selectedZone}</h4>
            <p className="text-gray-500">Autonomous straddle carriers operating under automated dispatch logic.</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div>
            <span className="text-gray-400">Dwell Index:</span>
            <span className="font-bold text-[#0F172A] ml-1">1.8 Days</span>
          </div>
          <div>
            <span className="text-gray-400">Gate Productivity:</span>
            <span className="font-bold text-emerald-600 ml-1">34 Moves/Hour</span>
          </div>
        </div>
      </div>
    </div>
  );
};
