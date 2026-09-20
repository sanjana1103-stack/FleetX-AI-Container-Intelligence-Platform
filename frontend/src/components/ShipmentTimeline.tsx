import React from 'react';
import { CheckCircle2, Circle, Clock, AlertTriangle, MapPin } from 'lucide-react';
import type { ContainerDetail } from '../types';

interface ShipmentTimelineProps {
  container: ContainerDetail;
}

export const ShipmentTimeline: React.FC<ShipmentTimelineProps> = ({ container }) => {
  const milestones = container.milestones || [];

  if (!milestones.length) {
    // Generate a default timeline from origin/destination
    const fallback = [
      { port_name: container.origin_port, status: 'COMPLETED', actual_or_estimated_arrival: 'Departed', delay_hours: 0, congestion_level: 'Low' as const },
      { port_name: 'Singapore TSH', status: 'COMPLETED', actual_or_estimated_arrival: 'Sep 22, 14:30', delay_hours: 0, congestion_level: 'Medium' as const },
      { port_name: 'Indian Ocean (Current)', status: 'CURRENT', actual_or_estimated_arrival: 'Now — Monitoring', delay_hours: container.delay_hours, congestion_level: container.delay_hours > 20 ? 'High' as const : 'Medium' as const },
      { port_name: container.destination_port, status: 'PENDING', actual_or_estimated_arrival: container.predicted_eta, delay_hours: 0, congestion_level: 'Low' as const },
    ];
    return <TimelineRender milestones={fallback} disruption={container.disruption_active} />;
  }

  return <TimelineRender milestones={milestones} disruption={container.disruption_active} />;
};

function TimelineRender({ milestones, disruption }: { milestones: any[]; disruption?: string | null }) {
  return (
    <div className="bg-white rounded-3xl border border-[#EAEFF4] shadow-card p-6">
      <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100">
        <div className="w-9 h-9 rounded-2xl bg-orange-50 text-[#FF5C00] flex items-center justify-center">
          <MapPin size={18} />
        </div>
        <div>
          <h3 className="text-sm font-bold text-[#0F172A]">Global Logistics Timeline</h3>
          <p className="text-[10px] text-gray-400">Animated shipment milestone progression — live voyage tracking</p>
        </div>
        {disruption && disruption !== 'RESET' && (
          <span className="ml-auto text-[10px] font-bold px-2 py-1 rounded-full bg-red-100 text-red-700 border border-red-200 flex items-center gap-1">
            <AlertTriangle size={11} />
            {disruption.replace('_', ' ')} Active
          </span>
        )}
      </div>

      <div className="flex items-start gap-0 overflow-x-auto pb-2">
        {milestones.map((ms: any, idx: number) => {
          const isDone = ms.status === 'COMPLETED';
          const isCurrent = ms.status === 'CURRENT';
          const isPending = ms.status === 'PENDING';
          const isLast = idx === milestones.length - 1;
          const hasDelay = ms.delay_hours > 0;
          const congHigh = ms.congestion_level === 'High' || ms.congestion_level === 'Critical';

          return (
            <div key={idx} className="flex items-start flex-1 min-w-[100px]">
              {/* Milestone node */}
              <div className="flex flex-col items-center">
                {/* Circle icon */}
                <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 shrink-0 shadow-sm ${
                  isDone ? 'bg-emerald-500 border-emerald-500 text-white' :
                  isCurrent ? 'bg-[#FF5C00] border-[#FF5C00] text-white animate-pulse' :
                  'bg-white border-gray-300 text-gray-400'
                }`}>
                  {isDone ? <CheckCircle2 size={18} strokeWidth={2.5} /> :
                   isCurrent ? <Clock size={16} /> :
                   <Circle size={16} />}
                </div>

                {/* Port Name */}
                <div className="mt-2 text-center px-1 max-w-[90px]">
                  <p className={`text-[10px] font-bold leading-tight ${
                    isDone ? 'text-emerald-700' : isCurrent ? 'text-[#FF5C00]' : 'text-gray-400'
                  }`}>
                    {ms.port_name}
                  </p>
                  <p className="text-[9px] text-gray-400 mt-0.5 leading-tight">{ms.actual_or_estimated_arrival}</p>
                  {hasDelay && (
                    <p className="text-[9px] text-red-600 font-bold mt-0.5">+{ms.delay_hours}h delay</p>
                  )}
                  {congHigh && (
                    <p className="text-[9px] text-amber-600 font-semibold">High congestion</p>
                  )}
                </div>
              </div>

              {/* Connector line to next node */}
              {!isLast && (
                <div className="flex-1 flex items-start pt-4">
                  <div className={`w-full h-0.5 ${isDone ? 'bg-emerald-400' : isCurrent ? 'bg-gradient-to-r from-[#FF5C00] to-gray-300' : 'bg-gray-200'}`}></div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
