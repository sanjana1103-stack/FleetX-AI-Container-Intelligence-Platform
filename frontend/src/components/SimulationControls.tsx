import React from 'react';
import { 
  CloudLightning, 
  Anchor, 
  ShieldAlert, 
  Wrench, 
  Flame, 
  RotateCcw,
  Sparkles,
  Zap
} from 'lucide-react';
import type { ContainerDetail } from '../types';

interface SimulationControlsProps {
  container: ContainerDetail;
  onSimulate: (eventType: string) => void;
  isLoading: boolean;
}

export const SimulationControls: React.FC<SimulationControlsProps> = ({
  container,
  onSimulate,
  isLoading
}) => {
  const events = [
    {
      id: 'STORM',
      title: 'Tropical Cyclone',
      desc: 'Simulate 68 kt typhoon in Indian Ocean. Southern detour +32.5h',
      icon: CloudLightning,
      color: 'from-red-500 to-rose-600',
      activeBorder: 'border-red-500 bg-red-50/50'
    },
    {
      id: 'PORT_STRIKE',
      title: 'Port Labor Strike',
      desc: 'Dockworkers work stoppage at destination terminal. +48h dwell',
      icon: Anchor,
      color: 'from-amber-500 to-orange-600',
      activeBorder: 'border-amber-500 bg-amber-50/50'
    },
    {
      id: 'CUSTOMS_DELAY',
      title: 'Customs Hold',
      desc: 'Manifest re-evaluation & secondary radiation scan. +20h buffer',
      icon: ShieldAlert,
      color: 'from-purple-500 to-indigo-600',
      activeBorder: 'border-purple-500 bg-purple-50/50'
    },
    {
      id: 'VESSEL_BREAKDOWN',
      title: 'Propulsion Derating',
      desc: 'Turbocharger alarm triggers emergency 6.2 kts speed cap. +54h',
      icon: Wrench,
      color: 'from-pink-500 to-red-500',
      activeBorder: 'border-pink-500 bg-pink-50/50'
    },
    {
      id: 'FUEL_SPIKE',
      title: 'Fuel Price Spike',
      desc: '+38% bunker surcharge deploys automated slow steaming. +12h',
      icon: Flame,
      color: 'from-cyan-500 to-blue-600',
      activeBorder: 'border-blue-500 bg-blue-50/50'
    }
  ];

  return (
    <div className="w-full bg-white rounded-3xl border border-[#EAEFF4] shadow-card p-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-5 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF5C00] to-amber-400 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
            <Zap size={20} />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
              <span>Digital Twin Disruption Simulator</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-[#FF5C00]">
                Interactive
              </span>
            </h3>
            <p className="text-xs text-gray-500">
              Inject real-world operational anomalies to witness instantaneous vessel rerouting, ML ETA variance, and AI reasoning.
            </p>
          </div>
        </div>

        <button
          onClick={() => onSimulate('RESET')}
          disabled={isLoading || !container.disruption_active}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-[#F4F6F8] hover:bg-gray-200 text-gray-700 disabled:opacity-40 transition-colors border border-gray-200"
        >
          <RotateCcw size={14} />
          <span>Reset to Normal Baseline</span>
        </button>
      </div>

      {/* Grid of 5 Disruption Buttons matching prompt requirements */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5">
        {events.map((evt) => {
          const Icon = evt.icon;
          const isActive = container.disruption_active === evt.id;

          return (
            <button
              key={evt.id}
              onClick={() => onSimulate(evt.id)}
              disabled={isLoading}
              className={`p-4 rounded-2xl border text-left transition-all duration-200 relative group flex flex-col justify-between ${
                isActive 
                  ? `${evt.activeBorder} shadow-md scale-[1.02]` 
                  : 'border-gray-200/80 bg-[#FAFCFF] hover:border-orange-300 hover:bg-white hover:shadow-sm'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${evt.color} flex items-center justify-center text-white shadow-sm`}>
                    <Icon size={16} />
                  </div>
                  {isActive && (
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
                  )}
                </div>

                <h4 className="text-xs font-bold text-[#0F172A] group-hover:text-[#FF5C00] transition-colors">
                  {evt.title}
                </h4>
                <p className="text-[10px] text-gray-500 mt-1 leading-relaxed">
                  {evt.desc}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-[10px] font-bold">
                <span className={isActive ? 'text-red-600' : 'text-gray-400 group-hover:text-[#FF5C00]'}>
                  {isActive ? 'Simulating' : 'Deploy Event'}
                </span>
                <span className="text-gray-400 group-hover:translate-x-0.5 transition-transform">→</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Disruption Status Notice */}
      {container.disruption_active && (
        <div className="mt-5 p-4 rounded-2xl bg-gradient-to-r from-red-50 via-orange-50 to-amber-50 border border-red-200/80 flex items-start gap-3 animate-in fade-in">
          <div className="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center shrink-0 text-xs font-bold mt-0.5 shadow-sm">
            !
          </div>
          <div className="text-xs text-[#0F172A]">
            <span className="font-bold text-red-700 uppercase">Operational Disruption Live: </span>
            <span>{container.ai_summary}</span>
          </div>
        </div>
      )}
    </div>
  );
};
