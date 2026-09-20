import React from 'react'; 
import { 
  Home, 
  MapPin, 
  BarChart3, 
  Anchor, 
  Layers, 
  Zap, 
  Settings, 
  LogOut,
  SlidersHorizontal,
  Compass,
  AlertTriangle
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenDemoTour: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onOpenDemoTour }) => {
  const navItems = [
    { id: 'hub', icon: Home, label: 'Smart Logistics Hub' },
    { id: 'tracking', icon: Compass, label: 'Ocean Map & Tracking' },
    { id: 'simulation', icon: Zap, label: 'Digital Twin Simulation' },
    { id: 'route', icon: SlidersHorizontal, label: 'Route Optimization' },
    { id: 'ports', icon: Anchor, label: 'Global Port Radar' },
    { id: 'analytics', icon: BarChart3, label: 'Fleet Analytics Dashboard' },
    { id: 'warehouse', icon: Layers, label: 'Warehouse Yard Digital Twin' },
    { id: 'incidents', icon: AlertTriangle, label: 'Incident Command Center' },
  ];

  return (
    <aside className="w-16 md:w-20 bg-white border-r border-[#EAEFF4] flex flex-col items-center py-6 justify-between shrink-0 shadow-sm z-30">
      {/* Brand Icon */}
      <div className="flex flex-col items-center gap-6">
        <div 
          onClick={() => setActiveTab('hub')}
          className="w-12 h-12 rounded-2xl bg-[#FF5C00] flex items-center justify-center text-white shadow-lg shadow-orange-500/30 cursor-pointer transition-transform hover:scale-105"
          title="FleetX Logistics Hub"
        >
          <div className="w-7 h-7 rounded-full border-2 border-white/80 flex items-center justify-center">
            <div className="w-3.5 h-3.5 rounded-sm bg-white rotate-45"></div>
          </div>
        </div>

        {/* Navigation Item Pills */}
        <nav className="flex flex-col items-center gap-2.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                title={item.label}
                className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-200 ${
                  isActive
                    ? 'bg-[#FF5C00] text-white shadow-md shadow-orange-500/25 scale-105'
                    : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]'
                }`}
              >
                <Icon size={20} strokeWidth={isActive ? 2.3 : 1.8} />
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Settings / Quick Demo */}
      <div className="flex flex-col items-center gap-3">
        <button
          onClick={onOpenDemoTour}
          title="2-Minute Executive Demo Tour"
          className="w-11 h-11 rounded-2xl bg-orange-50 text-[#FF5C00] border border-orange-200 flex items-center justify-center hover:bg-orange-100 transition-colors animate-pulse"
        >
          <span className="text-xs font-bold font-mono">DEMO</span>
        </button>

        <button 
          onClick={() => setActiveTab('settings')}
          title="Platform Configuration"
          className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-colors ${
            activeTab === 'settings'
              ? 'bg-[#FF5C00] text-white shadow-md shadow-orange-500/25'
              : 'text-[#94A3B8] hover:text-[#0F172A] hover:bg-[#F1F5F9]'
          }`}
        >
          <Settings size={20} strokeWidth={activeTab === 'settings' ? 2.3 : 1.8} />
        </button>

        <button 
          title="Sign Out / Change Role"
          className="w-11 h-11 rounded-2xl text-[#94A3B8] hover:text-[#EF4444] hover:bg-red-50 flex items-center justify-center transition-colors"
        >
          <LogOut size={18} />
        </button>
      </div>
    </aside>
  );
};
