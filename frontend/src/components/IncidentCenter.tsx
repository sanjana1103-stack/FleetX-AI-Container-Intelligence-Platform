import React, { useState } from 'react';
import { AlertTriangle, CloudLightning, Anchor, ShieldAlert, Wrench, FileText, Bell, CheckCircle2, ChevronRight } from 'lucide-react';
import type { ContainerDetail } from '../types';

interface IncidentCenterProps {
  container: ContainerDetail;
  onExportPdf: () => void;
}

export const IncidentCenter: React.FC<IncidentCenterProps> = ({ container, onExportPdf }) => {
  const [selectedIncident, setSelectedIncident] = useState<string | null>(null);

  const incidents = [
    {
      id: 'INC-001',
      type: 'STORM',
      title: 'Tropical Cyclone Varun — Indian Ocean',
      severity: 'CRITICAL',
      timestamp: '2026-09-20 08:15 UTC',
      affectedContainers: 34,
      icon: CloudLightning,
      color: 'red',
      status: container.disruption_active === 'STORM' ? 'ACTIVE' : 'RESOLVED',
      description: 'Category 3 tropical cyclone detected along primary shipping lane (12°N, 84°E). All vessels transiting the northern Indian Ocean rerouted via southern bypass corridor.',
      financialImpact: '$82,400 estimated demurrage and fuel surcharge exposure.',
      actions: ['Southern maritime detour enforced', 'Consignee EDI notification dispatched', 'Berth reservation request submitted at Jebel Ali']
    },
    {
      id: 'INC-002',
      type: 'PORT_STRIKE',
      title: 'Rotterdam Terminal Labor Walkout',
      severity: 'HIGH',
      timestamp: '2026-09-19 14:00 UTC',
      affectedContainers: 18,
      icon: Anchor,
      color: 'orange',
      status: 'MONITORING',
      description: 'Dock worker union initiated work stoppage at Euromax Terminal. Crane productivity at 0 TEU/hr. Anticipated resolution within 48-72 hours pending negotiations.',
      financialImpact: '$34,200 estimated demurrage exposure across 18 containers.',
      actions: ['Alternative berth allocation requested at APM Terminal', 'Feeder vessel reroute to Antwerp evaluated', 'Consignee SLA breach notification triggered']
    },
    {
      id: 'INC-003',
      type: 'CUSTOMS_DELAY',
      title: 'Antwerp Customs Hold — HLCU4567890',
      severity: 'MEDIUM',
      timestamp: '2026-09-19 09:30 UTC',
      affectedContainers: 1,
      icon: ShieldAlert,
      color: 'purple',
      status: 'ACTIVE',
      description: 'Secondary automated customs inspection triggered for industrial robotics components. Radiological X-ray scan and tariff reclassification review underway.',
      financialImpact: '$8,400 customs hold penalty exposure.',
      actions: ['Customs broker contacted for expedited clearance', 'Updated HS code documentation submitted', 'Insurance claim pre-notification filed']
    },
    {
      id: 'INC-004',
      type: 'VESSEL_BREAKDOWN',
      title: 'Propulsion Derating — MSC Irina',
      severity: 'HIGH',
      timestamp: '2026-09-18 22:45 UTC',
      affectedContainers: 9,
      icon: Wrench,
      color: 'pink',
      status: 'RESOLVED',
      description: 'Turbocharger thermal warning on auxiliary propulsion unit. Vessel speed reduced to 8.5 knots. Shore-side technician rendezvous completed at Colombo anchorage.',
      financialImpact: '$12,800 mechanical delay exposure (resolved).',
      actions: ['Technician dispatched from Colombo Maritime Services', 'Cargo re-manifested to next available slot', 'P&I Club notification filed']
    }
  ];

  const severityStyles: Record<string, string> = {
    CRITICAL: 'bg-red-100 text-red-700 border-red-200',
    HIGH: 'bg-orange-100 text-[#FF5C00] border-orange-200',
    MEDIUM: 'bg-purple-100 text-purple-700 border-purple-200',
    LOW: 'bg-gray-100 text-gray-600 border-gray-200'
  };

  const statusStyles: Record<string, string> = {
    ACTIVE: 'bg-red-500',
    MONITORING: 'bg-amber-500',
    RESOLVED: 'bg-emerald-500'
  };

  const colorMap: Record<string, string> = {
    red: 'bg-red-500',
    orange: 'bg-[#FF5C00]',
    purple: 'bg-purple-500',
    pink: 'bg-pink-500'
  };

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-[#EAEFF4] shadow-card p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
              <Bell size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
                Supply Chain Incident Command Center
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700 animate-pulse">4 Active Alerts</span>
              </h3>
              <p className="text-xs text-gray-500">Real-time global shipping disruption monitoring and response coordination.</p>
            </div>
          </div>
          <button onClick={onExportPdf} className="flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold bg-[#0F172A] hover:bg-black text-white transition-colors">
            <FileText size={13} />
            <span>Generate Incident Report PDF</span>
          </button>
        </div>
      </div>

      {/* Incident List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {incidents.map((inc) => {
          const Icon = inc.icon;
          const isSelected = selectedIncident === inc.id;
          return (
            <div
              key={inc.id}
              onClick={() => setSelectedIncident(isSelected ? null : inc.id)}
              className={`bg-white rounded-3xl border p-5 cursor-pointer transition-all hover:shadow-md ${
                isSelected ? 'border-[#FF5C00] shadow-md ring-1 ring-[#FF5C00]/20' : 'border-[#EAEFF4] hover:border-orange-200'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-2xl flex items-center justify-center text-white ${colorMap[inc.color] || 'bg-gray-500'}`}>
                    <Icon size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-black text-[#0F172A]">{inc.title}</p>
                    <p className="text-[10px] text-gray-400">{inc.id} • {inc.timestamp}</p>
                  </div>
                </div>
                <ChevronRight size={16} className={`text-gray-400 transition-transform shrink-0 mt-1 ${isSelected ? 'rotate-90 text-[#FF5C00]' : ''}`} />
              </div>

              <div className="flex items-center justify-between text-[11px] mb-3">
                <span className={`px-2 py-0.5 rounded-full border font-bold ${severityStyles[inc.severity] || ''}`}>{inc.severity}</span>
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${statusStyles[inc.status] || 'bg-gray-400'} ${inc.status === 'ACTIVE' ? 'animate-ping' : ''}`}></span>
                  <span className="font-semibold text-gray-600">{inc.status}</span>
                </div>
              </div>

              <p className="text-[11px] text-gray-600 leading-relaxed">{inc.description.slice(0, 120)}...</p>

              <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px]">
                <span className="text-gray-400">{inc.affectedContainers} container{inc.affectedContainers > 1 ? 's' : ''} affected</span>
                <span className="font-bold text-[#FF5C00]">{isSelected ? 'Collapse ↑' : 'Expand Details →'}</span>
              </div>

              {/* Expanded Detail */}
              {isSelected && (
                <div className="mt-4 pt-4 border-t border-orange-100 space-y-3">
                  <div>
                    <p className="text-[11px] font-bold text-gray-500 uppercase mb-1">Financial Impact</p>
                    <p className="text-xs text-red-700 font-semibold">{inc.financialImpact}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-gray-500 uppercase mb-1">Mitigation Actions</p>
                    <ul className="space-y-1">
                      {inc.actions.map((a, i) => (
                        <li key={i} className="flex items-start gap-2 text-[11px] text-gray-700">
                          <CheckCircle2 size={12} className="text-emerald-500 shrink-0 mt-0.5" />
                          <span>{a}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
