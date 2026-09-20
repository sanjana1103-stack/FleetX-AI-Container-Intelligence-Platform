import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Leaf, 
  Clock, 
  AlertTriangle, 
  Download, 
  CheckCircle2,
  Box
} from 'lucide-react';
import type { AnalyticsData } from '../types';

interface AnalyticsChartsProps {
  analytics: AnalyticsData;
  onExportCsv: () => void;
}

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ analytics, onExportCsv }) => {
  const kpis = analytics.kpis;

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Top Animated KPI Cards matching prompt */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Active Containers */}
        <div className="bg-white rounded-3xl border border-[#EAEFF4] shadow-card p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Active Containers</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Box size={16} />
            </div>
          </div>
          <p className="text-3xl font-black text-[#0F172A] tracking-tight font-mono">
            {kpis.active_containers}
          </p>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 mt-2">
            <TrendingUp size={13} />
            <span>+12.4% vs last month</span>
          </div>
        </div>

        {/* KPI 2: Delayed Shipments */}
        <div className="bg-white rounded-3xl border border-[#EAEFF4] shadow-card p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Delayed Shipments</span>
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#FF5C00] flex items-center justify-center font-bold">
              <AlertTriangle size={16} />
            </div>
          </div>
          <p className="text-3xl font-black text-[#0F172A] tracking-tight font-mono">
            {kpis.delayed_shipments}
          </p>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-600 mt-2">
            <span>Critical monitoring threshold</span>
          </div>
        </div>

        {/* KPI 3: Average ETA Accuracy */}
        <div className="bg-white rounded-3xl border border-[#EAEFF4] shadow-card p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Avg ETA Accuracy</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <p className="text-3xl font-black text-[#0F172A] tracking-tight font-mono">
            {kpis.avg_eta_accuracy_pct}%
          </p>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 mt-2">
            <span>XGBoost ML model calibration</span>
          </div>
        </div>

        {/* KPI 4: CO2 Saved */}
        <div className="bg-white rounded-3xl border border-[#EAEFF4] shadow-card p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">CO₂ Saved</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Leaf size={16} />
            </div>
          </div>
          <p className="text-3xl font-black text-[#0F172A] tracking-tight font-mono">
            {kpis.co2_saved_tons.toLocaleString()} <span className="text-base font-bold text-gray-400">MT</span>
          </p>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 mt-2">
            <span>Slow-steaming & weather routing</span>
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
              <p className="text-xs text-gray-400">Monthly container dispatch performance</p>
            </div>
            <button
              onClick={onExportCsv}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F4F6F8] hover:bg-gray-200 text-xs font-bold text-gray-700 transition-colors"
            >
              <Download size={13} />
              <span>Export CSV</span>
            </button>
          </div>

          {/* Bar Chart Visualization */}
          <div className="h-60 flex items-end justify-between gap-3 pt-6 pb-2 px-4 bg-gray-50/60 rounded-2xl border border-gray-100">
            {analytics.shipments_trend_monthly.map((d) => {
              const maxVal = 700;
              const onTimeHeight = (d.on_time / maxVal) * 100;
              const delayHeight = (d.delayed / maxVal) * 100;

              return (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <div className="w-full flex items-end justify-center gap-1 h-44">
                    {/* On-Time Bar */}
                    <div 
                      className="w-5 sm:w-7 bg-[#FF5C00] rounded-t-md hover:opacity-90 transition-all relative group"
                      style={{ height: `${onTimeHeight}%` }}
                    >
                      <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-black text-white text-[9px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        {d.on_time}
                      </span>
                    </div>
                    {/* Delayed Bar */}
                    <div 
                      className="w-2.5 sm:w-3.5 bg-gray-300 rounded-t-sm hover:bg-red-400 transition-all relative group"
                      style={{ height: `${delayHeight}%` }}
                    >
                      <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        {d.delayed}
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
              <span className="w-3 h-3 rounded-xs bg-gray-300"></span>
              <span>Delayed Shipments</span>
            </div>
          </div>
        </div>

        {/* Delay Drivers Breakdown */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-[#EAEFF4] shadow-card p-6 flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold text-[#0F172A]">Root Cause Delay Distribution</h4>
            <p className="text-xs text-gray-400 mb-4">Historical categorization of supply chain bottlenecks</p>

            <div className="space-y-3.5">
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
          </div>

          <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200/80 mt-6 text-xs text-gray-700">
            <span className="font-bold text-[#FF5C00]">AI Operational Recommendation: </span>
            Dynamic rerouting around tropical monsoons reduces weather-related transit variances by 34%.
          </div>
        </div>
      </div>
    </div>
  );
};
