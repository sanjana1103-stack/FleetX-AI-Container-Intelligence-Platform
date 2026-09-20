import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Zap, 
  Box, 
  Compass, 
  Anchor, 
  BarChart3, 
  Layers, 
  FileText, 
  RotateCcw,
  Sparkles,
  Command
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectContainer: (id: string) => void;
  onNavigateTab: (tab: string) => void;
  onTriggerSimulation: (eventType: string) => void;
  onExportPdf: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectContainer,
  onNavigateTab,
  onTriggerSimulation,
  onExportPdf
}) => {
  const [query, setQuery] = useState('');

  // Keyboard shortcut listener for Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const actions = [
    { id: 'track_msku', title: 'Track Container #MSKU1234567 (Maersk)', group: 'Shipments', icon: Box, action: () => { onSelectContainer('MSKU1234567'); onNavigateTab('hub'); onClose(); } },
    { id: 'track_ymlu', title: 'Track Container #YMLU890123 (Yang Ming)', group: 'Shipments', icon: Box, action: () => { onSelectContainer('YMLU890123'); onNavigateTab('hub'); onClose(); } },
    { id: 'track_trhu', title: 'Track Container #TRHU559871 (Hapag-Lloyd)', group: 'Shipments', icon: Box, action: () => { onSelectContainer('TRHU559871'); onNavigateTab('hub'); onClose(); } },
    { id: 'track_cmau', title: 'Track Container #CMAU9876543 (CMA CGM)', group: 'Shipments', icon: Box, action: () => { onSelectContainer('CMAU9876543'); onNavigateTab('hub'); onClose(); } },
    { id: 'sim_storm', title: 'Simulate Tropical Cyclone Storm (Indian Ocean Detour)', group: 'Simulations', icon: Zap, action: () => { onTriggerSimulation('STORM'); onNavigateTab('tracking'); onClose(); } },
    { id: 'sim_strike', title: 'Simulate Port Labor Strike (+48h Berth Halt)', group: 'Simulations', icon: Zap, action: () => { onTriggerSimulation('PORT_STRIKE'); onClose(); } },
    { id: 'sim_reset', title: 'Reset Simulation to Baseline', group: 'Simulations', icon: RotateCcw, action: () => { onTriggerSimulation('RESET'); onClose(); } },
    { id: 'nav_map', title: 'View Ocean Navigation Map & Sea Lanes', group: 'Navigation', icon: Compass, action: () => { onNavigateTab('tracking'); onClose(); } },
    { id: 'nav_ports', title: 'View Global Port Radar (104 Hubs)', group: 'Navigation', icon: Anchor, action: () => { onNavigateTab('ports'); onClose(); } },
    { id: 'nav_analytics', title: 'Open Fleet Analytics Dashboard', group: 'Navigation', icon: BarChart3, action: () => { onNavigateTab('analytics'); onClose(); } },
    { id: 'nav_warehouse', title: 'Open Intermodal Yard 2D Digital Twin', group: 'Navigation', icon: Layers, action: () => { onNavigateTab('warehouse'); onClose(); } },
    { id: 'nav_routes', title: 'Compare Route Optimization (Fastest/Cheapest/Eco)', group: 'Navigation', icon: Sparkles, action: () => { onNavigateTab('route'); onClose(); } },
    { id: 'nav_incidents', title: 'Open Supply Chain Incident Center', group: 'Navigation', icon: Zap, action: () => { onNavigateTab('incidents'); onClose(); } },
    { id: 'export_pdf', title: 'Download Executive Incident Report (PDF)', group: 'Actions', icon: FileText, action: () => { onExportPdf(); onClose(); } }
  ];

  const filtered = actions.filter((a) =>
    a.title.toLowerCase().includes(query.toLowerCase()) ||
    a.group.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden relative">
        {/* Search Input */}
        <div className="p-4 border-b border-gray-100 flex items-center gap-3">
          <Search size={18} className="text-[#FF5C00]" />
          <input
            type="text"
            placeholder="Type a command, shipment ID, or simulation..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full text-sm font-medium text-[#0F172A] placeholder-gray-400 focus:outline-none"
          />
          <span className="text-[10px] font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-500">ESC</span>
        </div>

        {/* List of Results */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="p-6 text-center text-xs text-gray-400">
              No matching commands or shipments found.
            </div>
          ) : (
            filtered.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  className="w-full text-left p-3 rounded-2xl hover:bg-orange-50/80 transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-xl bg-gray-100 group-hover:bg-[#FF5C00] group-hover:text-white text-gray-600 flex items-center justify-center transition-colors">
                      <Icon size={14} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#0F172A] group-hover:text-[#FF5C00] transition-colors">
                        {item.title}
                      </p>
                      <span className="text-[10px] text-gray-400">{item.group}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-gray-400 group-hover:text-gray-700">↵</span>
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400 px-4">
          <span>FleetX Quick Command Console</span>
          <span>Press <strong className="text-gray-600 font-mono">Ctrl + K</strong> anytime</span>
        </div>
      </div>
    </div>
  );
};
