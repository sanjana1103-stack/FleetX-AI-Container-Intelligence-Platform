import React from 'react';
import { Settings, User, Bell, Monitor, Database } from 'lucide-react';

interface SettingsPageProps {
  userRole: string;
  setUserRole: (role: string) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ userRole, setUserRole }) => {
  const roles = ['AI Supervisor', 'Operations Manager', 'Port Terminal Director', 'Executive Viewer'];

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-[#EAEFF4] shadow-card p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-orange-50 text-[#FF5C00] flex items-center justify-center">
            <Settings size={20} />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#0F172A]">Platform Configuration</h3>
            <p className="text-xs text-gray-500">Manage roles, notifications, data feeds, and enterprise preferences.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Role Management */}
        <div className="bg-white rounded-3xl border border-[#EAEFF4] shadow-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <User size={16} className="text-[#FF5C00]" />
            <h4 className="text-sm font-bold text-[#0F172A]">Active Role & Permissions</h4>
          </div>
          <div className="space-y-2">
            {roles.map((role) => (
              <button
                key={role}
                onClick={() => setUserRole(role)}
                className={`w-full text-left px-4 py-3 rounded-2xl border text-xs font-semibold transition-all ${
                  userRole === role
                    ? 'bg-orange-50 border-orange-300 text-[#FF5C00] font-bold'
                    : 'border-gray-200 text-gray-600 hover:border-orange-200 hover:bg-orange-50/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{role}</span>
                  {userRole === role && <span className="w-2 h-2 rounded-full bg-[#FF5C00]"></span>}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* API & Data Sources */}
        <div className="bg-white rounded-3xl border border-[#EAEFF4] shadow-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Database size={16} className="text-[#FF5C00]" />
            <h4 className="text-sm font-bold text-[#0F172A]">API & Data Configuration</h4>
          </div>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-500">Backend API</span>
              <span className="font-bold text-emerald-600 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                http://127.0.0.1:8000
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-500">ML Model Engine</span>
              <span className="font-bold text-[#0F172A]">XGBoost-Logistics-v3.8</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-500">Container Database</span>
              <span className="font-bold text-[#0F172A]">520 Pre-seeded Records</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-500">Port Telemetry Hubs</span>
              <span className="font-bold text-[#0F172A]">104 Global Locations</span>
            </div>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="bg-white rounded-3xl border border-[#EAEFF4] shadow-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Bell size={16} className="text-[#FF5C00]" />
            <h4 className="text-sm font-bold text-[#0F172A]">Alert & Notification Thresholds</h4>
          </div>
          <div className="space-y-3">
            {[
              { label: 'Storm Weather Alerts', enabled: true },
              { label: 'Port Congestion >80%', enabled: true },
              { label: 'Customs Hold Notifications', enabled: true },
              { label: 'ETA Variance >12h', enabled: false },
              { label: 'Vessel Breakdown Events', enabled: true }
            ].map((setting) => (
              <div key={setting.label} className="flex items-center justify-between">
                <span className="text-xs text-gray-700 font-medium">{setting.label}</span>
                <div className={`w-10 h-5 rounded-full flex items-center px-0.5 transition-colors cursor-pointer ${
                  setting.enabled ? 'bg-[#FF5C00]' : 'bg-gray-200'
                }`}>
                  <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${
                    setting.enabled ? 'translate-x-5' : 'translate-x-0'
                  }`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Info */}
        <div className="bg-white rounded-3xl border border-[#EAEFF4] shadow-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Monitor size={16} className="text-[#FF5C00]" />
            <h4 className="text-sm font-bold text-[#0F172A]">System & Version Information</h4>
          </div>
          <div className="space-y-2 text-xs">
            {[
              ['Platform', 'FleetX AI Container Intelligence OS'],
              ['Version', 'v2.0.0 (September 2026)'],
              ['Frontend', 'React 18 + TypeScript + Tailwind CSS'],
              ['Backend', 'FastAPI + Python 3.14 + Uvicorn'],
              ['ML Engine', 'Scikit-learn + XGBoost Regression'],
              ['Mapping', 'Leaflet.js (Open Street Map)'],
              ['License', 'MIT License (Open Source)']
            ].map(([key, val]) => (
              <div key={key} className="flex justify-between items-center py-1.5 border-b border-gray-50">
                <span className="text-gray-400 font-medium">{key}</span>
                <span className="font-semibold text-[#0F172A] text-right max-w-[60%]">{val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
