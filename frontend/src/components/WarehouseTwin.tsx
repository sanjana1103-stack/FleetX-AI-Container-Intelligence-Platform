import React, { useState, useEffect } from 'react';
import { 
  Layers, 
  Box, 
  Truck, 
  CheckCircle2, 
  Thermometer, 
  Sparkles, 
  Activity,
  ArrowRight,
  Clock,
  Zap
} from 'lucide-react';

interface AgvState {
  id: string;
  label: string;
  x: number;
  targetX: number;
  y: number;
  status: 'moving' | 'loading' | 'idle';
  zone: string;
  cargo: string;
  color: string;
}

const ZONE_X_POSITIONS = { 'Zone A': 5, 'Zone B': 30, 'Zone C': 55, 'Zone D': 80 };

export const WarehouseTwin: React.FC = () => {
  const [selectedZone, setSelectedZone] = useState('Zone A');
  const [agvs, setAgvs] = useState<AgvState[]>([
    { id: 'AGV-12', label: 'AGV-12', x: 10, targetX: 75, y: 0, status: 'moving', zone: 'Zone A', cargo: 'YMLU890123', color: '#FF5C00' },
    { id: 'AGV-08', label: 'AGV-08', x: 60, targetX: 15, y: 0, status: 'moving', zone: 'Zone D', cargo: 'TRHU559871', color: '#3B82F6' },
    { id: 'AGV-04', label: 'AGV-04', x: 35, targetX: 60, y: 0, status: 'loading', zone: 'Zone B', cargo: 'MSKU1234567', color: '#10B981' },
    { id: 'AGV-19', label: 'AGV-19', x: 80, targetX: 40, y: 0, status: 'moving', zone: 'Zone C', cargo: 'CMAU9876543', color: '#8B5CF6' },
  ]);
  const [forklifts, setForklifts] = useState([
    { id: 'FL-01', x: 20, direction: 1 },
    { id: 'FL-02', x: 70, direction: -1 },
  ]);
  const [tick, setTick] = useState(0);

  // Animate AGVs
  useEffect(() => {
    const interval = setInterval(() => {
      setTick(t => t + 1);
      setAgvs(prev => prev.map(agv => {
        const speed = agv.status === 'loading' ? 0 : 0.6;
        const diff = agv.targetX - agv.x;
        if (Math.abs(diff) < 1.5) {
          // Reached target — pick new target
          const zoneKeys = Object.keys(ZONE_X_POSITIONS) as (keyof typeof ZONE_X_POSITIONS)[];
          const nextZone = zoneKeys[Math.floor(Math.random() * zoneKeys.length)];
          return { 
            ...agv, 
            x: agv.targetX, 
            targetX: ZONE_X_POSITIONS[nextZone] + Math.random() * 18,
            zone: nextZone,
            status: Math.random() > 0.7 ? 'loading' : 'moving'
          };
        }
        return { ...agv, x: agv.x + (diff > 0 ? speed : -speed), status: Math.abs(diff) < 5 ? 'loading' : 'moving' };
      }));
      // Animate forklifts
      setForklifts(prev => prev.map(fl => {
        let newX = fl.x + fl.direction * 0.8;
        let dir = fl.direction;
        if (newX >= 90) { newX = 90; dir = -1; }
        if (newX <= 5) { newX = 5; dir = 1; }
        return { ...fl, x: newX, direction: dir };
      }));
    }, 80);
    return () => clearInterval(interval);
  }, []);

  const zones = [
    { id: 'Zone A', name: 'High Cube 40ft Stacks', count: 340, congestion: 'Medium', temp: '22°C', color: 'border-orange-300 bg-orange-50/40', utilPct: 68 },
    { id: 'Zone B', name: 'Chemical / Hazmat Secure', count: 120, congestion: 'Low', temp: '18°C', color: 'border-blue-300 bg-blue-50/40', utilPct: 42 },
    { id: 'Zone C', name: 'Cold-Chain Reefer Banks', count: 210, congestion: 'Low', temp: '4°C Active', color: 'border-cyan-300 bg-cyan-50/40', utilPct: 56 },
    { id: 'Zone D', name: 'Intermodal Rail Transfer', count: 480, congestion: 'High', temp: 'Ambient', color: 'border-red-300 bg-red-50/40', utilPct: 91 },
  ];

  const selectedZoneData = zones.find(z => z.id === selectedZone);

  const loadingQueue = ['MSKU1234567', 'YMLU890123', 'HLCU4567890'];
  const unloadingQueue = ['TRHU559871', 'CMAU9876543'];

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
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block"></span>
                Live Heatmap
              </span>
            </h3>
            <p className="text-xs text-gray-500">
              Autonomous Guided Vehicles (AGVs), rubber-tyred gantry cranes, and bay congestion telemetry — animated in real time.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-bold">
          <div>
            <span className="text-gray-400">Capacity:</span>
            <span className="text-[#FF5C00] font-mono ml-1">1,150 / 1,500 TEU (76%)</span>
          </div>
          <div>
            <span className="text-gray-400">AGVs Active:</span>
            <span className="text-emerald-600 font-mono ml-1">{agvs.filter(a => a.status === 'moving').length}/{agvs.length}</span>
          </div>
        </div>
      </div>

      {/* Interactive 2D Yard Canvas */}
      <div className="relative w-full bg-gradient-to-tr from-slate-100 via-gray-50 to-slate-200 rounded-3xl border border-gray-200 overflow-hidden shadow-inner" style={{ height: '380px' }}>
        {/* Overhead Gantry Rail */}
        <div className="absolute top-0 left-0 right-0 h-5 bg-gray-400/80 flex justify-between px-6 items-center z-10 shadow-md">
          {['CR-01', 'CR-02', 'CR-03', 'CR-04'].map(cr => (
            <div key={cr} className="w-10 h-7 bg-yellow-400 border border-yellow-600 rounded shadow-md flex items-center justify-center text-[7px] font-black mt-2">
              {cr}
            </div>
          ))}
        </div>

        {/* 4 Yard Storage Zones Grid */}
        <div className="absolute left-4 right-4 grid grid-cols-4 gap-3" style={{ top: '52px', height: '220px' }}>
          {zones.map((z) => (
            <div
              key={z.id}
              onClick={() => setSelectedZone(z.id)}
              className={`p-3 rounded-2xl border-2 transition-all cursor-pointer ${z.color} ${
                selectedZone === z.id ? 'ring-2 ring-[#FF5C00] shadow-md scale-[1.02]' : 'hover:shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-black text-[#0F172A]">{z.id}</span>
                <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ${
                  z.congestion === 'High' ? 'bg-red-200 text-red-800' : 
                  z.congestion === 'Medium' ? 'bg-amber-200 text-amber-800' :
                  'bg-emerald-200 text-emerald-800'
                }`}>
                  {z.congestion}
                </span>
              </div>

              {/* Utilization bar */}
              <div className="w-full h-1.5 bg-white/60 rounded-full mb-2">
                <div
                  className={`h-full rounded-full transition-all ${z.utilPct > 80 ? 'bg-red-500' : z.utilPct > 55 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                  style={{ width: `${z.utilPct}%` }}
                />
              </div>

              {/* Mini container stack */}
              <div className="space-y-0.5">
                <div className="w-full h-3.5 bg-[#FF5C00] rounded-sm text-[6px] text-white font-mono flex items-center justify-center font-bold">YMLU 890123</div>
                <div className="w-full h-3.5 bg-gray-400 rounded-sm text-[6px] text-white font-mono flex items-center justify-center">TRHU 559871</div>
                <div className="w-full h-3.5 bg-gray-300 rounded-sm text-[6px] text-gray-700 font-mono flex items-center justify-center">MSKU 12345</div>
              </div>

              <div className="text-[9px] text-gray-600 mt-2">
                <p className="font-bold text-[#0F172A]">{z.count} TEU</p>
                <p>{z.temp}</p>
              </div>
            </div>
          ))}
        </div>

        {/* AGV Track Lane */}
        <div className="absolute left-4 right-4 bg-gray-300/70 rounded-xl border border-gray-300" style={{ bottom: '64px', height: '44px' }}>
          <div className="absolute inset-x-2 top-1 text-[9px] font-bold text-gray-500 z-10">AGV TRACK LANE — AUTONOMOUS GUIDED VEHICLE CORRIDOR</div>
          {/* Animated AGVs */}
          {agvs.map((agv) => (
            <div
              key={agv.id}
              className="absolute top-4 flex items-center gap-1 transition-none"
              style={{ left: `${agv.x}%`, transform: 'translateX(-50%)' }}
            >
              <div
                className="w-7 h-5 rounded border flex items-center justify-center text-white text-[6px] font-black shadow-md"
                style={{ backgroundColor: agv.color }}
              >
                {agv.id.slice(-2)}
              </div>
              {agv.status === 'loading' && (
                <span className="text-[7px] font-bold text-amber-600 animate-pulse">↑LD</span>
              )}
            </div>
          ))}
        </div>

        {/* Forklift Lane */}
        <div className="absolute left-4 right-4 bg-gray-200/80 rounded-xl border border-gray-300" style={{ bottom: '12px', height: '44px' }}>
          <div className="absolute inset-x-2 top-1 text-[9px] font-bold text-gray-500">FORKLIFT LANE — RUBBER-TYRED GANTRY OPERATIONS</div>
          {forklifts.map((fl) => (
            <div
              key={fl.id}
              className="absolute top-4 flex items-center gap-1"
              style={{ left: `${fl.x}%`, transform: 'translateX(-50%)' }}
            >
              <Truck size={16} className="text-[#FF5C00]" style={{ transform: fl.direction < 0 ? 'scaleX(-1)' : 'none' }} />
              <span className="text-[7px] font-bold text-gray-600">{fl.id}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Loading / Unloading Queues */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 bg-orange-50 rounded-2xl border border-orange-200/80">
          <div className="flex items-center gap-2 mb-3">
            <ArrowRight size={14} className="text-[#FF5C00]" />
            <span className="text-xs font-bold text-[#0F172A]">Loading Queue ({loadingQueue.length})</span>
          </div>
          <div className="space-y-1.5">
            {loadingQueue.map((id, i) => (
              <div key={id} className="flex items-center justify-between bg-white rounded-xl px-3 py-1.5 border border-orange-100">
                <span className="text-[10px] font-mono font-bold text-[#FF5C00]">{id}</span>
                <span className="text-[9px] text-gray-400">{i === 0 ? 'NEXT' : `+${i * 18}min`}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200/80">
          <div className="flex items-center gap-2 mb-3">
            <ArrowRight size={14} className="text-emerald-600 rotate-180" />
            <span className="text-xs font-bold text-[#0F172A]">Unloading Queue ({unloadingQueue.length})</span>
          </div>
          <div className="space-y-1.5">
            {unloadingQueue.map((id, i) => (
              <div key={id} className="flex items-center justify-between bg-white rounded-xl px-3 py-1.5 border border-emerald-100">
                <span className="text-[10px] font-mono font-bold text-emerald-700">{id}</span>
                <span className="text-[9px] text-gray-400">{i === 0 ? 'NOW' : `+${i * 24}min`}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Zone Operational Specs */}
      <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-gray-200/80 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-orange-100 text-[#FF5C00] flex items-center justify-center">
            <Box size={16} />
          </div>
          <div>
            <h4 className="font-bold text-[#0F172A]">Active Bay: {selectedZone} — {selectedZoneData?.name}</h4>
            <p className="text-gray-500">Autonomous straddle carriers operating under AI dispatch. Congestion: <strong className={selectedZoneData?.congestion === 'High' ? 'text-red-600' : selectedZoneData?.congestion === 'Medium' ? 'text-amber-600' : 'text-emerald-600'}>{selectedZoneData?.congestion}</strong></p>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <div>
            <span className="text-gray-400">Dwell Index:</span>
            <span className="font-bold text-[#0F172A] ml-1">1.8 Days</span>
          </div>
          <div>
            <span className="text-gray-400">Gate Productivity:</span>
            <span className="font-bold text-emerald-600 ml-1">34 Moves/Hour</span>
          </div>
          <div>
            <span className="text-gray-400">Bay Util:</span>
            <span className="font-bold text-[#FF5C00] ml-1">{selectedZoneData?.utilPct}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
