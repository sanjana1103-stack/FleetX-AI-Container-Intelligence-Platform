import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Leaf, 
  Clock, 
  AlertTriangle, 
  Download, 
  CheckCircle2,
  Box,
  Activity,
  DollarSign,
  Globe
} from 'lucide-react';
import type { AnalyticsData } from '../types';

interface AnalyticsChartsProps {
  analytics: AnalyticsData;
  onExportCsv: () => void;
  fleetHealthScore?: number;
  disruptionActive?: string | null;
}

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ analytics, onExportCsv, fleetHealthScore = 94, disruptionActive }) => {
  const kpis = analytics.kpis;

  // Animated KPI counters
  const [displayKpis, setDisplayKpis] = useState({
    active: 0,
    delayed: 0,
    accuracy: 0,
    co2: 0
  });

  useEffect(() => {
    const targets = {
      active: kpis.active_containers,
      delayed: kpis.delayed_shipments,
      accuracy: kpis.avg_eta_accuracy_pct,
      co2: kpis.co2_saved_tons
    };
    let frame = 0;
    const totalFrames = 40;
    const timer = setInterval(() => {
      frame++;
      const pct = Math.min(frame / totalFrames, 1);
      const ease = 1 - Math.pow(1 - pct, 3);
      setDisplayKpis({
        active: Math.round(targets.active * ease),
        delayed: Math.round(targets.delayed * ease),
        accuracy: Math.round(targets.accuracy * ease * 10) / 10,
        co2: Math.round(targets.co2 * ease * 10) / 10
      });
      if (frame >= totalFrames) clearInterval(timer);
    }, 30);
    return () => clearInterval(timer);
  }, [kpis]);

  // Disruption cascade: when a simulation is active, shift the KPI deltas
  const disrupted = !!disruptionActive && disruptionActive !== 'RESET';
  const delayedDisplay = disrupted ? displayKpis.delayed + (disruptionActive === 'CANAL_BLOCKAGE' ? 8 : disruptionActive === 'STORM' ? 4 : 2) : displayKpis.delayed;
  const accuracyDisplay = disrupted ? Math.max(65, displayKpis.accuracy - (disruptionActive === 'VESSEL_BREAKDOWN' ? 12 : 6)) : displayKpis.accuracy;
  const co2Display = disruptionActive === 'FUEL_SPIKE' ? displayKpis.co2 + 180 : disruptionActive === 'STORM' ? displayKpis.co2 - 120 : displayKpis.co2;

  // Simulated cost savings from AI optimization
  const aiSavings = 2840000 + (disruptionActive === 'FUEL_SPIKE' ? 47500 : 0);

  // CO2 data derived from shipments trend
  const co2Trend = analytics.shipments_trend_monthly.map((d, i) => ({
    month: d.month,
    co2: Math.round(1800 + (d.on_time * 0.8) - (i * 120))
  }));

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Fleet Health Score Banner (visible when disruption active) */}
      {disrupted && (
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
              <AlertTriangle size={16} />
            </div>
            <div>
              <p className="text-xs font-bold text-red-700">Analytics Recalculated — {disruptionActive?.replace('_', ' ')} Active</p>
              <p className="text-[11px] text-gray-500">KPI cascade applied: ETA accuracy degraded, delayed shipments elevated</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Fleet Health</p>
            <p className="text-lg font-black text-red-600 font-mono">{Math.max(62, fleetHealthScore - 18)}/100</p>
          </div>
        </div>
      )}

      {/* Top Animated KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Active Containers */}
        <div className="bg-white rounded-3xl border border-[#EAEFF4] shadow-card p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Active Fleet</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Box size={16} />
            </div>
          </div>
          <p className="text-3xl font-black text-[#0F172A] tracking-tight font-mono">
            {displayKpis.active}
          </p>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 mt-2">
            <TrendingUp size={13} />
            <span>+12.4% vs last month</span>
          </div>
        </div>

        {/* KPI 2: Delayed Shipments (reacts to disruption) */}
        <div className={`bg-white rounded-3xl border shadow-card p-5 flex flex-col justify-between transition-all ${disrupted ? 'border-red-200' : 'border-[#EAEFF4]'}`}>
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Delayed</span>
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#FF5C00] flex items-center justify-center">
              <AlertTriangle size={16} />
            </div>
          </div>
          <p className={`text-3xl font-black tracking-tight font-mono ${disrupted ? 'text-red-600' : 'text-[#0F172A]'}`}>
            {delayedDisplay}
          </p>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-600 mt-2">
            {disrupted ? <span>↑ Disruption impact active</span> : <span>Critical monitoring threshold</span>}
          </div>
        </div>

        {/* KPI 3: ETA Accuracy (reacts to disruption) */}
        <div className={`bg-white rounded-3xl border shadow-card p-5 flex flex-col justify-between transition-all ${disrupted ? 'border-amber-200' : 'border-[#EAEFF4]'}`}>
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">ETA Accuracy</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <p className={`text-3xl font-black tracking-tight font-mono ${disrupted ? 'text-amber-600' : 'text-[#0F172A]'}`}>
            {accuracyDisplay}%
          </p>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 mt-2">
            <span>{disrupted ? '↓ Confidence degraded by disruption' : 'XGBoost ML model calibration'}</span>
          </div>
        </div>

        {/* KPI 4: CO2 Saved (reacts to FUEL_SPIKE / STORM) */}
        <div className={`bg-white rounded-3xl border shadow-card p-5 flex flex-col justify-between transition-all ${disruptionActive === 'FUEL_SPIKE' ? 'border-emerald-200' : 'border-[#EAEFF4]'}`}>
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">CO₂ Saved</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Leaf size={16} />
            </div>
          </div>
          <p className={`text-3xl font-black tracking-tight font-mono ${disruptionActive === 'FUEL_SPIKE' ? 'text-emerald-600' : 'text-[#0F172A]'}`}>
            {co2Display.toLocaleString()} <span className="text-base font-bold text-gray-400">MT</span>
          </p>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 mt-2">
            <span>{disruptionActive === 'FUEL_SPIKE' ? '↑ Eco slow-steam bonus applied' : 'Slow-steaming & weather routing'}</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Monthly Shipments & On-Time Performance */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-[#EAEFF4] shadow-card p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm font-bold text-[#0F172A]">Shipments Volume & Schedule Adherence</h4>
              <p className="text-xs text-gray-400">Monthly container dispatch performance — hover for values</p>
            </div>
            <button
              onClick={onExportCsv}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F4F6F8] hover:bg-gray-200 text-xs font-bold text-gray-700 transition-colors"
            >
              <Download size={13} />
              <span>Export CSV</span>
            </button>
          </div>

          {/* Bar Chart */}
          <div className="h-60 flex items-end justify-between gap-3 pt-6 pb-2 px-4 bg-gray-50/60 rounded-2xl border border-gray-100">
            {analytics.shipments_trend_monthly.map((d) => {
              const maxVal = 700;
              const onTimeHeight = (d.on_time / maxVal) * 100;
              const delayHeight = (d.delayed / maxVal) * 100;

              return (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <div className="w-full flex items-end justify-center gap-1 h-44">
                    <div 
                      className="w-5 sm:w-7 bg-[#FF5C00] rounded-t-md hover:opacity-90 transition-all relative group"
                      style={{ height: `${onTimeHeight}%` }}
                    >
                      <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-black text-white text-[9px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {d.on_time} on-time
                      </span>
                    </div>
                    <div 
                      className={`w-2.5 sm:w-3.5 rounded-t-sm hover:bg-red-400 transition-all relative group ${disrupted ? 'bg-red-400' : 'bg-gray-300'}`}
                      style={{ height: `${delayHeight}%` }}
                    >
                      <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {d.delayed} delayed
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-gray-600">{d.month}</span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-center gap-6 mt-4 text-xs font-semibold text-gray-500">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-xs bg-[#FF5C00]"></span>
              <span>On-Time Shipments</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-xs ${disrupted ? 'bg-red-400' : 'bg-gray-300'}`}></span>
              <span>Delayed Shipments {disrupted ? '(disruption elevated)' : ''}</span>
            </div>
          </div>
        </div>

        {/* Right Side: Delay Breakdown + Cost Impact */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          {/* Delay Drivers Breakdown */}
          <div className="bg-white rounded-3xl border border-[#EAEFF4] shadow-card p-6 flex-1">
            <h4 className="text-sm font-bold text-[#0F172A]">Root Cause Delay Distribution</h4>
            <p className="text-xs text-gray-400 mb-4">Historical bottleneck categorization</p>

            <div className="space-y-3">
              {Object.entries(analytics.delays_by_category).map(([cat, pct]) => (
                <div key={cat}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold text-gray-700">{cat}</span>
                    <span className="font-bold text-[#0F172A]">{pct}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        pct > 35 ? 'bg-[#FF5C00]' : pct > 20 ? 'bg-amber-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3.5 rounded-2xl bg-orange-50 border border-orange-200/80 mt-5 text-xs text-gray-700">
              <span className="font-bold text-[#FF5C00]">AI Recommendation: </span>
              Dynamic rerouting around tropical monsoons reduces weather transit variances by 34%.
            </div>
          </div>

          {/* AI Cost Savings */}
          <div className="bg-white rounded-3xl border border-[#EAEFF4] shadow-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <DollarSign size={16} className="text-emerald-600" />
              <h4 className="text-sm font-bold text-[#0F172A]">AI Optimization Savings</h4>
            </div>
            <div className="flex items-end gap-1 mb-1">
              <p className="text-2xl font-black text-emerald-600 font-mono">${(aiSavings / 1000000).toFixed(2)}M</p>
              <span className="text-xs text-gray-400 mb-1">YTD</span>
            </div>
            <p className="text-[11px] text-gray-500">Via route optimization, slow-steam scheduling, and predictive berth booking across 520 containers.</p>
            {disruptionActive === 'FUEL_SPIKE' && (
              <div className="mt-2 text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                <TrendingUp size={12} />
                +$47,500 additional savings from eco slow-steam
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
