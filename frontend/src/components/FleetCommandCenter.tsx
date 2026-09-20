import React, { useState, useEffect } from 'react';
import { Activity, CloudLightning, Anchor, ShieldCheck, RefreshCcw, AlertTriangle, CheckCircle2, Ship, Leaf, Settings } from 'lucide-react';
import { fetchFleetHealth, fetchEventFeed } from '../services/api';

interface FleetCommandCenterProps {
  disruptionActive?: string | null;
}

interface EventItem {
  type: string;
  severity: string;
  message: string;
  time: string;
  icon: string;
}

const EVENT_ICONS: Record<string, React.ReactNode> = {
  storm: <CloudLightning size={13} />,
  port: <Anchor size={13} />,
  customs: <ShieldCheck size={13} />,
  reefer: <AlertTriangle size={13} />,
  vessel: <Ship size={13} />,
  eco: <Leaf size={13} />,
  security: <AlertTriangle size={13} />,
  canal: <Settings size={13} />,
};

const EVENT_COLORS: Record<string, string> = {
  ALERT: 'text-red-600 bg-red-50 border-red-200',
  INFO: 'text-blue-600 bg-blue-50 border-blue-200',
  SUCCESS: 'text-emerald-600 bg-emerald-50 border-emerald-200',
};

const SEVERITY_DOT: Record<string, string> = {
  HIGH: 'bg-red-500',
  MEDIUM: 'bg-amber-500',
  LOW: 'bg-emerald-500',
};

// Fallback data for when backend is offline
const FALLBACK_EVENTS: EventItem[] = [
  { type: 'ALERT', severity: 'HIGH', message: 'Tropical Cyclone Varun — Indian Ocean Lane', time: '2m ago', icon: 'storm' },
  { type: 'INFO', severity: 'MEDIUM', message: 'Rotterdam berth utilization rising to 91%', time: '5m ago', icon: 'port' },
  { type: 'SUCCESS', severity: 'LOW', message: 'Customs clearance completed — HLCU4567890', time: '8m ago', icon: 'customs' },
  { type: 'ALERT', severity: 'HIGH', message: 'Reefer alert — temperature drift on CMAU9876543', time: '12m ago', icon: 'reefer' },
  { type: 'INFO', severity: 'LOW', message: 'Vessel MV Nordic Express departed Shanghai — ETA Oct 12', time: '15m ago', icon: 'vessel' },
  { type: 'SUCCESS', severity: 'LOW', message: 'ECO route optimization applied — $47K savings', time: '19m ago', icon: 'eco' },
  { type: 'ALERT', severity: 'MEDIUM', message: 'Anchorage queue growing at Singapore — 8 vessels', time: '24m ago', icon: 'port' },
  { type: 'INFO', severity: 'LOW', message: 'IMB advisory: Red Sea piracy incident reported', time: '31m ago', icon: 'security' },
];

export const FleetCommandCenter: React.FC<FleetCommandCenterProps> = ({ disruptionActive }) => {
  const [healthScore, setHealthScore] = useState(94);
  const [healthStatus, setHealthStatus] = useState('EXCELLENT');
  const [events, setEvents] = useState<EventItem[]>(FALLBACK_EVENTS);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [health, feed] = await Promise.allSettled([fetchFleetHealth(), fetchEventFeed()]);
      if (health.status === 'fulfilled') {
        setHealthScore(health.value.fleet_health_score);
        setHealthStatus(health.value.status);
      }
      if (feed.status === 'fulfilled' && feed.value?.events) {
        setEvents(feed.value.events);
      }
    } catch (e) {
      // use fallback data already set
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Cascade: disruption lowers health score visually
  const displayScore = disruptionActive && disruptionActive !== 'RESET'
    ? Math.max(58, healthScore - (disruptionActive === 'CANAL_BLOCKAGE' ? 32 : disruptionActive === 'STORM' ? 18 : 10))
    : healthScore;

  const displayStatus = displayScore >= 90 ? 'EXCELLENT' : displayScore >= 75 ? 'GOOD' : displayScore >= 55 ? 'DEGRADED' : 'CRITICAL';
  const statusColor = displayStatus === 'EXCELLENT' ? 'text-emerald-600 bg-emerald-50 border-emerald-200' :
                      displayStatus === 'GOOD' ? 'text-blue-600 bg-blue-50 border-blue-200' :
                      displayStatus === 'DEGRADED' ? 'text-amber-600 bg-amber-50 border-amber-200' :
                      'text-red-600 bg-red-50 border-red-200';

  const scoreColor = displayScore >= 90 ? 'text-emerald-600' : displayScore >= 75 ? 'text-blue-600' : displayScore >= 55 ? 'text-amber-600' : 'text-red-600';
  const arcPct = (displayScore / 100) * 180; // for half-circle gauge

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
      {/* Fleet Health Score Card */}
      <div className="lg:col-span-2 bg-white rounded-3xl border border-[#EAEFF4] shadow-card p-6 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#FF5C00] to-amber-400 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
              <Activity size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#0F172A]">Fleet Health Intelligence</h3>
              <p className="text-[10px] text-gray-400">AI-calculated operational score</p>
            </div>
          </div>
          <button onClick={loadData} disabled={loading} className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 transition-colors">
            <RefreshCcw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        {/* Score Display */}
        <div className="flex flex-col items-center py-4">
          <div className="relative flex flex-col items-center">
            {/* Circular gauge via SVG */}
            <svg width="140" height="80" viewBox="0 0 140 80">
              {/* Background arc */}
              <path d="M 14 76 A 56 56 0 0 1 126 76" fill="none" stroke="#E2E8F0" strokeWidth="10" strokeLinecap="round" />
              {/* Value arc */}
              <path
                d="M 14 76 A 56 56 0 0 1 126 76"
                fill="none"
                stroke={displayScore >= 90 ? '#10B981' : displayScore >= 75 ? '#3B82F6' : displayScore >= 55 ? '#F59E0B' : '#EF4444'}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={`${(displayScore / 100) * 175.9} 175.9`}
                className="transition-all duration-700"
              />
              <text x="70" y="68" textAnchor="middle" fontSize="22" fontWeight="900" fill={displayScore >= 90 ? '#10B981' : displayScore >= 75 ? '#3B82F6' : displayScore >= 55 ? '#F59E0B' : '#EF4444'} fontFamily="monospace">
                {displayScore}
              </text>
            </svg>
            <p className="text-[10px] text-gray-400 -mt-1 font-medium">out of 100</p>
          </div>

          <div className={`mt-3 px-3 py-1.5 rounded-full border text-xs font-bold ${statusColor}`}>
            {displayStatus}
            {disruptionActive && disruptionActive !== 'RESET' && (
              <span className="ml-2 text-[9px] font-normal opacity-80">— {disruptionActive.replace('_', ' ')} impact</span>
            )}
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="space-y-2 text-[11px]">
          {[
            { label: 'Weather & Routing', value: disruptionActive === 'STORM' || disruptionActive === 'PIRATE_RISK' ? 72 : 94, green: 90 },
            { label: 'Port Congestion', value: disruptionActive === 'PORT_STRIKE' || disruptionActive === 'CANAL_BLOCKAGE' ? 68 : 89, green: 85 },
            { label: 'Fleet Maintenance', value: disruptionActive === 'VESSEL_BREAKDOWN' || disruptionActive === 'REEFER_FAILURE' ? 65 : 96, green: 90 },
            { label: 'Customs & Compliance', value: disruptionActive === 'CUSTOMS_DELAY' ? 74 : 91, green: 87 },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-2">
              <span className="w-28 text-gray-500">{item.label}</span>
              <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${item.value >= item.green ? 'bg-emerald-500' : item.value >= 75 ? 'bg-amber-500' : 'bg-red-500'}`}
                  style={{ width: `${item.value}%` }}
                />
              </div>
              <span className={`font-bold w-7 text-right ${item.value >= item.green ? 'text-emerald-600' : item.value >= 75 ? 'text-amber-600' : 'text-red-600'}`}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Live Event Feed */}
      <div className="lg:col-span-3 bg-white rounded-3xl border border-[#EAEFF4] shadow-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-orange-50 text-[#FF5C00] flex items-center justify-center">
              <Activity size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
                Live Operations Event Feed
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping inline-block"></span>
              </h3>
              <p className="text-[10px] text-gray-400">Global maritime intelligence updates — real time</p>
            </div>
          </div>
          <button onClick={loadData} disabled={loading} className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 transition-colors">
            <RefreshCcw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        <div className="space-y-2 overflow-y-auto max-h-72 pr-1">
          {events.map((evt, i) => {
            const colorClass = EVENT_COLORS[evt.type] || EVENT_COLORS.INFO;
            const dotClass = SEVERITY_DOT[evt.severity] || SEVERITY_DOT.LOW;
            return (
              <div key={i} className={`flex items-start gap-3 p-3 rounded-2xl border text-xs ${colorClass} transition-all`}>
                <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${dotClass} ${evt.severity === 'HIGH' ? 'animate-pulse' : ''}`}></span>
                  <span className="text-current opacity-70">{EVENT_ICONS[evt.icon] || <Activity size={13} />}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold leading-tight truncate">{evt.message}</p>
                </div>
                <span className="text-[9px] opacity-60 font-mono shrink-0 mt-0.5">{evt.time}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
