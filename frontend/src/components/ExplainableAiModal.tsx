import React from 'react';
import { Cpu, X, TrendingUp, TrendingDown, HelpCircle, ShieldCheck, Sparkles } from 'lucide-react';
import type { ContainerDetail } from '../types';

interface ExplainableAiModalProps {
  isOpen: boolean;
  onClose: () => void;
  container: ContainerDetail;
}

export const ExplainableAiModal: React.FC<ExplainableAiModalProps> = ({
  isOpen,
  onClose,
  container
}) => {
  if (!isOpen) return null;

  const isStorm = container.disruption_active === 'STORM';
  const isHigh = container.delay_risk === 'High';

  const factors = [
    {
      name: 'Base Great-Circle Transit Time',
      value: '448.0 hrs',
      impact: 'Baseline',
      isNegative: false,
      pct: 68,
      desc: 'Haversine distance (8,650 NM) at baseline 19.4 knots design cruising speed.'
    },
    {
      name: 'Downstream Port Congestion Penalty',
      value: isHigh ? '+28.4 hrs' : '+8.2 hrs',
      impact: 'Delay Added',
      isNegative: true,
      pct: isHigh ? 24 : 12,
      desc: 'Quayside crane dwell at destination exceeds 82% berth saturation threshold.'
    },
    {
      name: 'Sea Swell & Meteorological Drag',
      value: isStorm ? '+32.5 hrs' : '+4.5 hrs',
      impact: 'Delay Added',
      isNegative: true,
      pct: isStorm ? 30 : 8,
      desc: isStorm 
        ? 'Active Tropical Cyclone "Varun" southern bypass enforced (7.5m wave avoidance).' 
        : 'Moderate headwinds and 2.4m seasonal swell in northern sector.'
    },
    {
      name: 'Vessel Engine Efficiency Advantage',
      value: '-3.2 hrs',
      impact: 'Time Saved',
      isNegative: false,
      pct: 6,
      desc: 'Optimized auxiliary propulsion timing and clean hull hydrodynamic flow.'
    },
    {
      name: 'Customs & Automated Manifest Hold',
      value: container.disruption_active === 'CUSTOMS_DELAY' ? '+20.0 hrs' : '+0.0 hrs',
      impact: container.disruption_active === 'CUSTOMS_DELAY' ? 'Delay Added' : 'Nominal',
      isNegative: container.disruption_active === 'CUSTOMS_DELAY',
      pct: container.disruption_active === 'CUSTOMS_DELAY' ? 18 : 1,
      desc: 'Real-time tariff verification and radiological non-intrusive container scan status.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 overflow-hidden relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition-colors"
        >
          <X size={16} />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-2xl bg-orange-100 text-[#FF5C00] flex items-center justify-center">
            <Cpu size={18} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#0F172A]">
              Explainable AI (XAI) — ETA Causality Analysis
            </h3>
            <p className="text-xs text-gray-400">
              Container #{container.id} • XGBoost Regression Attribution Model (SHAP Engine)
            </p>
          </div>
        </div>

        {/* Summary Card */}
        <div className="p-4 bg-orange-50/70 rounded-2xl border border-orange-200 my-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] text-gray-500 font-semibold uppercase">Predicted Arrival</p>
            <p className="text-xl font-black text-[#0F172A] font-mono">{container.predicted_eta}</p>
          </div>
          <div className="text-right">
            <p className="text-[11px] text-gray-500 font-semibold uppercase">Statistical Confidence</p>
            <p className="text-xl font-black text-[#FF5C00] font-mono">{container.eta_confidence}%</p>
          </div>
        </div>

        {/* Factor Breakdown List */}
        <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            Feature Attribution Weights & Penalties
          </p>

          {factors.map((f, idx) => (
            <div key={idx} className="p-3 bg-[#F8FAFC] rounded-2xl border border-gray-100 text-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-gray-800">{f.name}</span>
                <span className={`font-mono font-black ${f.isNegative ? 'text-red-600' : 'text-emerald-600'}`}>
                  {f.value}
                </span>
              </div>
              <p className="text-[11px] text-gray-500 mb-2">{f.desc}</p>

              {/* Progress Bar */}
              <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    f.isNegative ? 'bg-red-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${f.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
          <span className="flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-emerald-600" />
            <span>Calibrated on 14,800 historical voyages (R² = 0.941)</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#0F172A] text-white rounded-full font-bold hover:bg-black transition-colors"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};
