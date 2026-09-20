import React, { useState } from 'react';
import { 
  Zap, 
  DollarSign, 
  Leaf, 
  Clock, 
  Fuel, 
  Check, 
  ArrowRight,
  TrendingDown,
  Sparkles
} from 'lucide-react';
import type { RouteOption } from '../types';

interface RouteOptimizerProps {
  containerId: string;
  onApplyRoute?: (mode: string) => void;
}

export const RouteOptimizer: React.FC<RouteOptimizerProps> = ({ containerId, onApplyRoute }) => {
  const [selectedMode, setSelectedMode] = useState<'FASTEST' | 'CHEAPEST' | 'ECO'>('ECO');

  const routeOptions: Record<'FASTEST' | 'CHEAPEST' | 'ECO', RouteOption> = {
    FASTEST: {
      mode: 'FASTEST',
      title: 'Fastest Route (Direct Suez Corridor)',
      distance_nm: 8450,
      transit_days: 21.5,
      fuel_cost_usd: 142500,
      co2_tons: 312.4,
      vessel_speed_knots: 21.5,
      savings_text: 'Saves 4.2 days vs Eco; +28% fuel burn',
      description: 'Maximum cruising speed (21.5 kts) via primary shipping canals with priority lock scheduling.'
    },
    CHEAPEST: {
      mode: 'CHEAPEST',
      title: 'Cheapest Route (Toll Avoidance)',
      distance_nm: 9820,
      transit_days: 26.0,
      fuel_cost_usd: 98400,
      co2_tons: 245.0,
      vessel_speed_knots: 17.8,
      savings_text: 'Saves $44,100 in canal transit tariffs',
      description: 'Bypasses congested canal surcharges; operates at economic speed equilibrium (17.8 kts).'
    },
    ECO: {
      mode: 'ECO',
      title: 'Eco Green Route (Slow Steaming)',
      distance_nm: 8600,
      transit_days: 24.8,
      fuel_cost_usd: 86200,
      co2_tons: 184.2,
      vessel_speed_knots: 15.2,
      savings_text: 'Saves 41% CO₂ (-128.2 MT) & $56,300 fuel',
      description: 'Optimized slow-steaming trajectory matching tidal currents with lowest carbon index per TEU-km.'
    }
  };

  const current = routeOptions[selectedMode];

  return (
    <div className="w-full bg-white rounded-3xl border border-[#EAEFF4] shadow-card p-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-5 pb-4 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FF5C00]"></span>
            <h3 className="text-base font-bold text-[#0F172A]">
              Multi-Objective Route Optimization
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
              AI Powered
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Compare tactical trade-offs across voyage speed, bunker consumption, carbon taxation, and contractual transit deadlines.
          </p>
        </div>

        {/* 3-Way Mode Toggle Tabs */}
        <div className="bg-[#F4F6F8] p-1.5 rounded-2xl flex items-center gap-1 border border-gray-100">
          <button
            onClick={() => setSelectedMode('FASTEST')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              selectedMode === 'FASTEST' 
                ? 'bg-white text-[#FF5C00] shadow-sm' 
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <Zap size={14} />
            <span>Fastest Route</span>
          </button>
          <button
            onClick={() => setSelectedMode('CHEAPEST')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              selectedMode === 'CHEAPEST' 
                ? 'bg-white text-emerald-600 shadow-sm' 
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <DollarSign size={14} />
            <span>Cheapest Route</span>
          </button>
          <button
            onClick={() => setSelectedMode('ECO')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              selectedMode === 'ECO' 
                ? 'bg-white text-emerald-700 shadow-sm ring-1 ring-emerald-500/20' 
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <Leaf size={14} className="text-emerald-500" />
            <span>Eco Route</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Comparison Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        {/* Transit Time */}
        <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-gray-100 flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-[11px] font-medium">Transit Duration</span>
            <Clock size={16} className="text-blue-500" />
          </div>
          <p className="text-2xl font-black text-[#0F172A] tracking-tight font-mono">
            {current.transit_days} <span className="text-sm font-bold text-gray-500">Days</span>
          </p>
          <p className="text-[10px] font-semibold text-gray-400 mt-1">
            Cruising at {current.vessel_speed_knots} kts
          </p>
        </div>

        {/* Distance */}
        <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-gray-100 flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-[11px] font-medium">Nautical Distance</span>
            <Zap size={16} className="text-orange-500" />
          </div>
          <p className="text-2xl font-black text-[#0F172A] tracking-tight font-mono">
            {current.distance_nm.toLocaleString()} <span className="text-sm font-bold text-gray-500">NM</span>
          </p>
          <p className="text-[10px] font-semibold text-gray-400 mt-1">
            Great-Circle Sea Lane
          </p>
        </div>

        {/* Fuel Cost */}
        <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-gray-100 flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-[11px] font-medium">Fuel & Canal Cost</span>
            <DollarSign size={16} className="text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-[#0F172A] tracking-tight font-mono">
            ${current.fuel_cost_usd.toLocaleString()}
          </p>
          <p className="text-[10px] font-semibold text-emerald-600 mt-1">
            {selectedMode === 'CHEAPEST' ? 'Minimum Tariff Profile' : 'Standard VLSFO'}
          </p>
        </div>

        {/* CO2 Emissions */}
        <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-gray-100 flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-[11px] font-medium">CO₂ Emissions</span>
            <Leaf size={16} className="text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-[#0F172A] tracking-tight font-mono">
            {current.co2_tons} <span className="text-sm font-bold text-gray-500">MT</span>
          </p>
          <p className="text-[10px] font-semibold text-emerald-600 mt-1 flex items-center gap-1">
            <TrendingDown size={12} />
            <span>{selectedMode === 'ECO' ? '-41% Carbon Index' : 'Baseline'}</span>
          </p>
        </div>
      </div>

      {/* Selected Route Narrative & Deployment */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-50 via-white to-emerald-50 border border-orange-200/70 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-start gap-3 max-w-xl">
          <div className="w-8 h-8 rounded-xl bg-[#FF5C00] text-white flex items-center justify-center shrink-0 font-bold shadow-sm">
            <Sparkles size={16} />
          </div>
          <div className="text-xs">
            <h4 className="font-bold text-[#0F172A] text-sm mb-0.5">{current.title}</h4>
            <p className="text-gray-600">{current.description}</p>
            <p className="text-[11px] font-bold text-[#FF5C00] mt-1">{current.savings_text}</p>
          </div>
        </div>

        <button
          onClick={() => onApplyRoute && onApplyRoute(selectedMode)}
          className="px-5 py-2.5 rounded-full text-xs font-bold bg-[#0F172A] hover:bg-black text-white shadow-md transition-all flex items-center gap-2 transform hover:scale-105"
        >
          <span>Deploy {selectedMode} Route</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};
