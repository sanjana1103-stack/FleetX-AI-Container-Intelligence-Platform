import React, { useState } from 'react';
import { 
  Search, 
  Mic, 
  Sparkles, 
  Moon, 
  Sun, 
  Bell, 
  HelpCircle, 
  ChevronDown,
  Play
} from 'lucide-react';

interface HeaderProps {
  currentContainerId: string;
  onSelectContainer: (id: string) => void;
  activeTabTitle: string;
  onStartDemoTour: () => void;
  userRole: string;
  setUserRole: (role: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentContainerId,
  onSelectContainer,
  activeTabTitle,
  onStartDemoTour,
  userRole,
  setUserRole
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const quickContainers = [
    { id: 'MSKU1234567', carrier: 'Maersk Line', desc: 'Indian Ocean Corridor - Semi-conductors' },
    { id: 'YMLU890123', carrier: 'Yang Ming', desc: 'Northpoint Yard - Automotive Batteries' },
    { id: 'TRHU559871', carrier: 'Hapag-Lloyd', desc: 'Westfield Terminal - Electronics' },
    { id: 'CMAU9876543', carrier: 'CMA CGM', desc: 'Pacific Route - Cold-Chain Reefer' },
    { id: 'HLCU4567890', carrier: 'Hapag-Lloyd', desc: 'Antwerp Port - Customs Inspection' }
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSelectContainer(searchQuery.trim().toUpperCase());
      setIsSearchOpen(false);
    }
  };

  return (
    <header className="h-16 md:h-20 bg-white/90 backdrop-blur-md border-b border-[#EAEFF4] px-6 flex items-center justify-between z-20 shrink-0">
      {/* Left: Brand & Page Title matching reference */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#FF5C00] flex items-center justify-center text-white font-bold shadow-md shadow-orange-500/20">
            <span className="text-sm tracking-tighter">FX</span>
          </div>
          <span className="text-xl font-bold text-[#0F172A] tracking-tight">FleetX</span>
        </div>

        <div className="hidden sm:flex items-center gap-2.5 text-sm font-semibold pl-4 border-l border-gray-200">
          <span className="px-2 py-0.5 rounded-md bg-[#FF5C00] text-white text-xs font-bold tracking-wider">
            AI
          </span>
          <span className="text-[#FF5C00] font-bold">→</span>
          <span className="text-[#1E293B] text-base font-bold tracking-tight">
            {activeTabTitle}
          </span>
        </div>
      </div>

      {/* Center: AI Search Bar matching reference image */}
      <div className="relative flex-1 max-w-md mx-4">
        <form onSubmit={handleSearchSubmit} className="relative flex items-center">
          {/* Sparkle badge */}
          <div className="absolute left-2.5 flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-tr from-[#FF5C00] to-[#FFA07A] text-white shadow-sm">
            <Sparkles size={14} />
          </div>

          <input
            type="text"
            placeholder="AI Search (e.g. MSKU1234567, YMLU890123)..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(true);
            }}
            onFocus={() => setIsSearchOpen(true)}
            className="w-full bg-[#F4F6F8] hover:bg-[#EEF2F6] focus:bg-white text-sm text-[#0F172A] placeholder-[#94A3B8] font-medium pl-12 pr-10 py-2.5 rounded-full border border-transparent focus:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all shadow-inner"
          />

          <button
            type="button"
            title="Voice Search"
            className="absolute right-3 text-[#94A3B8] hover:text-[#FF5C00] transition-colors"
          >
            <Mic size={16} />
          </button>
        </form>

        {/* Quick Search Dropdown */}
        {isSearchOpen && (
          <div 
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-50 text-xs"
            onMouseLeave={() => setIsSearchOpen(false)}
          >
            <div className="px-3 py-1.5 text-[11px] font-semibold uppercase text-gray-400">
              Demo Shipments & Containers
            </div>
            {quickContainers.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  onSelectContainer(c.id);
                  setSearchQuery(c.id);
                  setIsSearchOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-xl hover:bg-orange-50 transition-colors flex items-center justify-between group"
              >
                <div>
                  <span className="font-bold text-[#0F172A] group-hover:text-[#FF5C00]">#{c.id}</span>
                  <span className="text-gray-400 ml-2">({c.carrier})</span>
                  <p className="text-[11px] text-gray-500">{c.desc}</p>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-gray-100 group-hover:bg-orange-100 group-hover:text-[#FF5C00] font-medium">
                  Track
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right Controls matching reference image */}
      <div className="flex items-center gap-3">
        {/* 2-Min Demo Tour Pill */}
        <button
          onClick={onStartDemoTour}
          className="hidden lg:flex items-center gap-2 bg-gradient-to-r from-[#FF5C00] to-[#FF8038] hover:from-[#E04F00] hover:to-[#FF5C00] text-white text-xs font-bold px-3.5 py-2 rounded-full shadow-md shadow-orange-500/20 transition-all transform hover:scale-105"
        >
          <Play size={12} fill="white" />
          <span>2-Min Demo Tour</span>
        </button>

        {/* Action icons */}
        <div className="flex items-center gap-1 text-[#64748B] border-r border-gray-200 pr-2">
          <button 
            title="Toggle View Mode"
            className="w-9 h-9 rounded-full hover:bg-[#F1F5F9] flex items-center justify-center transition-colors"
          >
            <Sun size={17} />
          </button>
          <button 
            title="Operational System Alerts"
            className="relative w-9 h-9 rounded-full hover:bg-[#F1F5F9] flex items-center justify-center transition-colors"
          >
            <Bell size={17} />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#FF5C00]"></span>
          </button>
          <button 
            title="Documentation & Logistics Specs"
            className="w-9 h-9 rounded-full hover:bg-[#F1F5F9] flex items-center justify-center transition-colors"
          >
            <HelpCircle size={17} />
          </button>
        </div>

        {/* Profile Capsule matching reference */}
        <div className="relative">
          <div 
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-3 cursor-pointer pl-1 hover:opacity-90 transition-opacity"
          >
            <div className="w-9 h-9 rounded-full overflow-hidden border border-gray-200 shadow-sm">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" 
                alt="Alex Morgan" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="hidden xl:block text-left">
              <p className="text-xs font-bold text-[#0F172A] leading-tight">Alex Morgan</p>
              <p className="text-[11px] font-medium text-[#64748B] leading-tight">{userRole}</p>
            </div>
            <ChevronDown size={14} className="text-[#94A3B8]" />
          </div>

          {/* Role Switcher Menu */}
          {showRoleMenu && (
            <div 
              className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-50 text-xs"
              onMouseLeave={() => setShowRoleMenu(false)}
            >
              <div className="px-3 py-1.5 text-[11px] font-bold text-gray-400 uppercase">
                Select Enterprise Role
              </div>
              {['AI Supervisor', 'Operations Manager', 'Port Terminal Director', 'Executive Viewer'].map((role) => (
                <button
                  key={role}
                  onClick={() => {
                    setUserRole(role);
                    setShowRoleMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl transition-colors font-medium flex items-center justify-between ${
                    userRole === role ? 'bg-orange-50 text-[#FF5C00] font-bold' : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <span>{role}</span>
                  {userRole === role && <span className="w-1.5 h-1.5 rounded-full bg-[#FF5C00]"></span>}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
