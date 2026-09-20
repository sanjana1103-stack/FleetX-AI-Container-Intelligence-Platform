import React, { useState } from 'react';
import { 
  Anchor, 
  Search, 
  AlertTriangle, 
  Clock, 
  CloudSun, 
  Layers, 
  ArrowUpRight,
  TrendingUp,
  X,
  Truck,
  Wind,
  Users,
  Activity
} from 'lucide-react';
import type { PortDetail } from '../types';

interface PortRadarProps {
  ports: PortDetail[];
}

// Deterministic extras per port code to make each port feel unique
function getPortExtras(code: string) {
  const hash = code.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const craneUtil = 55 + (hash % 40);
  const berthOcc = 60 + (hash % 35);
  const truckQueue = 12 + (hash % 48);
  const laborStatus = ['Normal', 'Normal', 'Normal', 'Reduced Crew', 'Strike Risk'][hash % 5];
  const customsEff = 70 + (hash % 28);
  const predictedCongestion = ['Stable', 'Rising', 'Rising', 'Declining', 'Critical'][hash % 5];
  const windKnots = 6 + (hash % 28);
  const vessels24h = 8 + (hash % 24);
  const co2Score = ['A', 'A', 'B', 'B', 'C'][hash % 5];
  return { craneUtil, berthOcc, truckQueue, laborStatus, customsEff, predictedCongestion, windKnots, vessels24h, co2Score };
}

export const PortRadar: React.FC<PortRadarProps> = ({ ports }) => {
  const [filter, setFilter] = useState('');
  const [riskFilter, setRiskFilter] = useState<string>('ALL');
  const [selectedPort, setSelectedPort] = useState<PortDetail | null>(null);

  const filteredPorts = ports.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(filter.toLowerCase()) || 
                          p.code.toLowerCase().includes(filter.toLowerCase()) ||
                          p.country.toLowerCase().includes(filter.toLowerCase());
    const matchesRisk = riskFilter === 'ALL' || p.risk === riskFilter;
    return matchesSearch && matchesRisk;
  });

  const extras = selectedPort ? getPortExtras(selectedPort.code) : null;

  return (
    <div className="w-full bg-white rounded-3xl border border-[#EAEFF4] shadow-card p-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-orange-50 text-[#FF5C00] flex items-center justify-center font-bold">
            <Anchor size={20} />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
              <span>Global Port Congestion & Anchorage Radar</span>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-orange-100 text-[#FF5C00]">
                {ports.length} International Hubs
              </span>
            </h3>
            <p className="text-xs text-gray-500">
              Live berth queue telemetry, crane utilization, labor status, and vessel dwell times across global container terminals.
            </p>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search port or code..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="pl-9 pr-4 py-1.5 text-xs bg-[#F4F6F8] rounded-full border border-gray-200 focus:outline-none focus:border-[#FF5C00] text-[#0F172A]"
            />
          </div>

          <div className="flex items-center gap-1 bg-[#F4F6F8] p-1 rounded-full text-xs">
            {['ALL', 'High', 'Medium', 'Low'].map((r) => (
              <button
                key={r}
                onClick={() => setRiskFilter(r)}
                className={`px-3 py-1 rounded-full font-bold transition-all ${
                  riskFilter === r ? 'bg-white text-[#FF5C00] shadow-xs' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Expanded Port Intelligence Panel (inline, appears when a port is selected) */}
      {selectedPort && extras && (
        <div className="mb-5 p-5 rounded-3xl bg-gradient-to-r from-orange-50 via-white to-orange-50 border border-orange-200/80 shadow-sm">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#FF5C00] text-white flex items-center justify-center font-black text-sm">
                {selectedPort.code.slice(0, 2)}
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#0F172A]">{selectedPort.name} — Port Intelligence</h4>
                <p className="text-xs text-gray-400">{selectedPort.code} · {selectedPort.country}</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedPort(null)}
              className="w-7 h-7 rounded-lg hover:bg-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-800 transition-colors"
            >
              <X size={15} />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            {[
              { label: 'Congestion Index', value: `${selectedPort.congestion}%`, icon: Activity, color: selectedPort.congestion > 75 ? 'text-red-600' : 'text-amber-600' },
              { label: 'Crane Utilization', value: `${extras.craneUtil}%`, icon: Layers, color: 'text-blue-600' },
              { label: 'Berth Occupancy', value: `${extras.berthOcc}%`, icon: Anchor, color: 'text-[#FF5C00]' },
              { label: 'Truck Queue', value: `${extras.truckQueue} units`, icon: Truck, color: 'text-purple-600' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="bg-white rounded-2xl border border-gray-100 p-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Icon size={13} className={item.color} />
                    <span className="text-[10px] text-gray-400 font-medium">{item.label}</span>
                  </div>
                  <p className={`text-base font-black font-mono ${item.color}`}>{item.value}</p>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Labor Status', value: extras.laborStatus, color: extras.laborStatus === 'Normal' ? 'text-emerald-600' : extras.laborStatus === 'Strike Risk' ? 'text-red-600' : 'text-amber-600' },
              { label: 'Customs Efficiency', value: `${extras.customsEff}%`, color: 'text-[#0F172A]' },
              { label: 'Congestion Forecast', value: extras.predictedCongestion, color: extras.predictedCongestion === 'Critical' ? 'text-red-600' : extras.predictedCongestion === 'Rising' ? 'text-amber-600' : 'text-emerald-600' },
              { label: 'Vessels (24h)', value: `${extras.vessels24h} calls`, color: 'text-[#0F172A]' },
            ].map((item) => (
              <div key={item.label} className="bg-white rounded-2xl border border-gray-100 p-3">
                <p className="text-[10px] text-gray-400 font-medium mb-1">{item.label}</p>
                <p className={`text-xs font-bold ${item.color}`}>{item.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-3 flex items-center gap-2 text-[11px]">
            <Wind size={13} className="text-blue-400" />
            <span className="text-gray-500">Wind: {extras.windKnots} kts</span>
            <span className="text-gray-300">·</span>
            <span className="text-gray-500">🌤️ {selectedPort.weather}</span>
            <span className="text-gray-300">·</span>
            <span className="text-gray-500">Wait: <strong className="text-[#0F172A]">{selectedPort.wait_hours}h</strong></span>
            <span className="text-gray-300">·</span>
            <span className="text-gray-500">Green Score: <strong className={extras.co2Score === 'A' ? 'text-emerald-600' : extras.co2Score === 'B' ? 'text-amber-600' : 'text-red-600'}>{extras.co2Score}</strong></span>
          </div>
        </div>
      )}

      {/* Grid of Port Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPorts.slice(0, 18).map((p) => {
          const isHigh = p.risk === 'High';
          const isMed = p.risk === 'Medium';
          const isSelected = selectedPort?.code === p.code;

          return (
            <div
              key={p.code}
              onClick={() => setSelectedPort(isSelected ? null : p)}
              className={`bg-[#F8FAFC] border rounded-2xl p-4 transition-all cursor-pointer flex flex-col justify-between group ${
                isSelected
                  ? 'border-[#FF5C00] ring-1 ring-[#FF5C00]/20 bg-white shadow-md'
                  : 'border-gray-200/80 hover:border-orange-300 hover:bg-white hover:shadow-md'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold text-gray-400 bg-white px-2 py-0.5 rounded border border-gray-200">
                    {p.code}
                  </span>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                    isHigh 
                      ? 'bg-red-100 text-red-700' 
                      : isMed 
                      ? 'bg-amber-100 text-amber-700' 
                      : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {p.risk} Risk
                  </span>
                </div>

                <h4 className="text-sm font-bold text-[#0F172A] group-hover:text-[#FF5C00] transition-colors">
                  {p.name}
                </h4>
                <p className="text-[11px] text-gray-400">{p.country}</p>

                {/* Congestion Progress Bar */}
                <div className="mt-3">
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-gray-500 font-medium">Congestion Index</span>
                    <span className="font-bold text-[#0F172A]">{p.congestion}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        p.congestion > 75 ? 'bg-red-500' : p.congestion > 60 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${p.congestion}%` }}
                    />
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-gray-100 text-[11px]">
                  <div>
                    <span className="text-gray-400">Avg Wait</span>
                    <p className="font-bold text-[#0F172A]">{p.wait_hours}h</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Queue / Berth</span>
                    <p className="font-bold text-[#0F172A]">{p.queue} ({p.berth_pct}%)</p>
                  </div>
                </div>
              </div>

              {/* Weather + Expand hint */}
              <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-500">
                <span className="truncate max-w-[180px]">🌤️ {p.weather}</span>
                <span className={`font-bold transition-colors ${isSelected ? 'text-[#FF5C00]' : 'text-gray-400 group-hover:text-[#FF5C00]'}`}>
                  {isSelected ? 'Collapse ↑' : 'Intelligence →'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
