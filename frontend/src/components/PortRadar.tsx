import React, { useState } from 'react';
import { 
  Anchor, 
  Search, 
  AlertTriangle, 
  Clock, 
  CloudSun, 
  Layers, 
  ArrowUpRight,
  TrendingUp
} from 'lucide-react';
import type { PortDetail } from '../types';

interface PortRadarProps {
  ports: PortDetail[];
}

export const PortRadar: React.FC<PortRadarProps> = ({ ports }) => {
  const [filter, setFilter] = useState('');
  const [riskFilter, setRiskFilter] = useState<string>('ALL');

  const filteredPorts = ports.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(filter.toLowerCase()) || 
                          p.code.toLowerCase().includes(filter.toLowerCase()) ||
                          p.country.toLowerCase().includes(filter.toLowerCase());
    const matchesRisk = riskFilter === 'ALL' || p.risk === riskFilter;
    return matchesSearch && matchesRisk;
  });

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
              Live berth queue telemetry, meteorological alerts, and vessel dwell times across global container terminals.
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

      {/* Grid of Port Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPorts.slice(0, 18).map((p) => {
          const isHigh = p.risk === 'High';
          const isMed = p.risk === 'Medium';

          return (
            <div
              key={p.code}
              className="bg-[#F8FAFC] border border-gray-200/80 hover:border-orange-300 rounded-2xl p-4.5 transition-all hover:shadow-md hover:bg-white flex flex-col justify-between group"
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
                      className={`h-full rounded-full ${
                        p.congestion > 75 ? 'bg-red-500' : p.congestion > 60 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${p.congestion}%` }}
                    />
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-gray-100 text-[11px]">
                  <div>
                    <span className="text-gray-400">Avg Wait Time</span>
                    <p className="font-bold text-[#0F172A]">{p.wait_hours} Hours</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Queue & Berth</span>
                    <p className="font-bold text-[#0F172A]">{p.queue} Ships ({p.berth_pct}%)</p>
                  </div>
                </div>
              </div>

              {/* Weather info */}
              <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-500">
                <span className="truncate max-w-[200px]">🌤️ {p.weather}</span>
                <ArrowUpRight size={14} className="text-gray-400 group-hover:text-[#FF5C00] transition-colors" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
