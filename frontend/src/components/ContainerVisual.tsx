import React, { useState } from 'react';
import { 
  ArrowUpRight, 
  Thermometer, 
  Droplets, 
  Calendar, 
  Box, 
  Layers, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  ChevronLeft, 
  ChevronRight,
  MoreVertical,
  Sliders,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import type { ContainerDetail } from '../types';

interface ContainerVisualProps {
  container: ContainerDetail;
  onOpenRouteModal?: () => void;
  onSelectContainerId?: (id: string) => void;
}

export const ContainerVisual: React.FC<ContainerVisualProps> = ({ 
  container,
  onOpenRouteModal
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [viewAngle, setViewAngle] = useState<'side' | 'isometric'>('isometric');
  const [showHotspotModal, setShowHotspotModal] = useState(false);

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.15, 1.6));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.15, 0.75));
  const handleResetZoom = () => {
    setZoomLevel(1);
    setViewAngle('isometric');
  };

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Main Visual Stage Card matching reference */}
      <div className="relative w-full bg-white rounded-3xl border border-[#EAEFF4] shadow-card overflow-hidden p-6">
        {/* Top bar inside the container visual */}
        <div className="flex items-center justify-between z-10 relative mb-4">
          <div className="flex items-center gap-2 text-sm font-bold text-[#0F172A]">
            <Box size={18} className="text-[#FF5C00]" />
            <span>Container Visual</span>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setViewAngle(viewAngle === 'isometric' ? 'side' : 'isometric')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#F4F6F8] text-[#334155] hover:bg-orange-50 hover:text-[#FF5C00] transition-colors border border-gray-100"
            >
              <Layers size={14} />
              <span>3D View</span>
            </button>
          </div>
        </div>

        {/* 4 Floating Sensor Telemetry Cards (Left side overlay) matching reference */}
        <div className="grid grid-cols-2 gap-3 max-w-xs absolute top-16 left-6 z-20 pointer-events-auto">
          {/* Card 1: Container Health */}
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-3.5 border border-[#EAEFF4] shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between text-gray-400 mb-2">
              <Box size={15} />
              <ArrowUpRight size={15} className="text-gray-400" />
            </div>
            <p className="text-[11px] font-medium text-[#64748B]">Container Health</p>
            <p className="text-xl font-bold text-[#0F172A]">{container.sensors.health_pct}%</p>
            <p className="text-[10px] font-semibold text-emerald-600 mt-0.5">AI Monitored</p>
          </div>

          {/* Card 2: Temperature */}
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-3.5 border border-[#EAEFF4] shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between text-gray-400 mb-2">
              <Thermometer size={15} className="text-orange-500" />
              <ArrowUpRight size={15} className="text-gray-400" />
            </div>
            <p className="text-[11px] font-medium text-[#64748B]">Temperature</p>
            <p className="text-xl font-bold text-[#0F172A]">{container.sensors.temperature_c}°C</p>
            <p className="text-[10px] font-semibold text-[#FF5C00] mt-0.5">{container.sensors.reefer_status}</p>
          </div>

          {/* Card 3: Humidity */}
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-3.5 border border-[#EAEFF4] shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between text-gray-400 mb-2">
              <Droplets size={15} className="text-cyan-500" />
              <ArrowUpRight size={15} className="text-gray-400" />
            </div>
            <p className="text-[11px] font-medium text-[#64748B]">Humidity</p>
            <p className="text-xl font-bold text-[#0F172A]">{container.sensors.humidity_pct}%</p>
            <p className="text-[10px] font-semibold text-cyan-600 mt-0.5">AI Optimized</p>
          </div>

          {/* Card 4: Last Inspection */}
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-3.5 border border-[#EAEFF4] shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between text-gray-400 mb-2">
              <Calendar size={15} className="text-purple-500" />
              <ArrowUpRight size={15} className="text-gray-400" />
            </div>
            <p className="text-[11px] font-medium text-[#64748B]">Last Inspection</p>
            <p className="text-xs font-bold text-[#0F172A] truncate mt-1">{container.sensors.last_inspection}</p>
            <p className="text-[10px] font-semibold text-purple-600 mt-0.5">AI Scheduled</p>
          </div>
        </div>

        {/* Center Container Freight Visual */}
        <div 
          className="w-full h-80 sm:h-96 flex items-center justify-center relative overflow-hidden transition-transform duration-300"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          {/* Subtle Freight Terminal Floor Grid / Track Background */}
          <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 via-white to-gray-100/70 flex items-center justify-center">
            <div className="w-full h-px bg-gray-200 absolute bottom-16"></div>
            <div className="w-full h-px bg-gray-300 absolute bottom-14"></div>
          </div>

          {/* Isometric Double-Stacked Train / Chassis Visual */}
          <div className="relative flex flex-col items-center z-10 translate-x-12 sm:translate-x-20 transition-all">
            
            {/* Top Silver Container */}
            <div className="w-64 sm:w-80 h-24 sm:h-28 rounded-lg bg-gradient-to-b from-gray-200 via-gray-100 to-gray-300 border border-gray-400/80 shadow-md relative overflow-hidden flex flex-col justify-between p-2">
              {/* Corrugated Vertical Lines */}
              <div className="absolute inset-0 flex justify-between px-2 opacity-25 pointer-events-none">
                {Array.from({ length: 28 }).map((_, i) => (
                  <div key={i} className="w-0.5 h-full bg-gray-600"></div>
                ))}
              </div>

              <div className="flex justify-between items-start z-10">
                <span className="text-[9px] font-mono font-bold tracking-wider text-gray-600 bg-white/70 px-1 rounded">
                  #TRHU 559871 2
                </span>
                <span className="text-[8px] font-bold text-gray-500 uppercase">40 FT STD</span>
              </div>

              {/* Inspection Hotspot Button matching reference '+' */}
              <div className="self-center z-20">
                <button 
                  onClick={() => setShowHotspotModal(!showHotspotModal)}
                  className="w-7 h-7 rounded-lg bg-black/85 text-white flex items-center justify-center text-xs font-bold hover:bg-[#FF5C00] transition-colors shadow-lg animate-bounce"
                  title="Inspect Container Telemetry"
                >
                  +
                </button>
              </div>

              <div className="flex justify-between items-end z-10 text-[8px] font-mono text-gray-500">
                <span>TARE: 3820 KG</span>
                <span>MAX GROSS: 30480 KG</span>
              </div>
            </div>

            {/* Bottom Orange Shipping Container (FleetX branded matching reference) */}
            <div className="w-64 sm:w-80 h-28 sm:h-32 rounded-lg bg-gradient-to-b from-[#FF6B1A] via-[#FF5C00] to-[#E04F00] border-2 border-[#D44200] shadow-xl relative overflow-hidden flex flex-col justify-between p-2.5 mt-0.5">
              {/* Corrugated Grooves */}
              <div className="absolute inset-0 flex justify-between px-2 opacity-20 pointer-events-none">
                {Array.from({ length: 28 }).map((_, i) => (
                  <div key={i} className="w-0.5 h-full bg-black"></div>
                ))}
              </div>

              {/* Stencil & Brand Logo */}
              <div className="flex justify-between items-start z-10">
                <div className="flex items-center gap-1.5 bg-black/30 px-2 py-0.5 rounded text-white text-[10px] font-mono font-black tracking-wider">
                  <span>#{container.id}</span>
                </div>
                <div className="flex items-center gap-1 text-white/90 font-black text-xs tracking-tighter">
                  <span className="w-2.5 h-2.5 rounded-full bg-white flex items-center justify-center text-[7px] text-[#FF5C00]">FX</span>
                  <span>FleetX</span>
                </div>
              </div>

              {/* Center Stencil Number */}
              <div className="text-center z-10">
                <p className="text-xl sm:text-2xl font-black font-mono tracking-widest text-white/20 select-none">
                  {container.id.slice(0, 4)} 423198
                </p>
              </div>

              {/* Bottom markings */}
              <div className="flex justify-between items-end z-10 text-[8px] font-mono text-white/90">
                <span>TYPE: {container.type.toUpperCase()}</span>
                <span className="bg-emerald-500/80 px-1 rounded text-[7px] font-bold">REEFER 22°C</span>
              </div>
            </div>

            {/* Rail Flatbed Bogey Chassis & Steel Wheels */}
            <div className="w-72 sm:w-88 h-7 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-900 rounded-sm relative flex items-center justify-between px-4 mt-0.5 shadow-md">
              <div className="w-6 h-6 rounded-full bg-gray-400 border-2 border-gray-900 shadow-inner -mb-5"></div>
              <div className="w-6 h-6 rounded-full bg-gray-400 border-2 border-gray-900 shadow-inner -mb-5"></div>
              <div className="w-16 h-1 bg-yellow-500/80"></div>
              <div className="w-6 h-6 rounded-full bg-gray-400 border-2 border-gray-900 shadow-inner -mb-5"></div>
              <div className="w-6 h-6 rounded-full bg-gray-400 border-2 border-gray-900 shadow-inner -mb-5"></div>
            </div>
            {/* Railroad Tracks */}
            <div className="w-80 sm:w-96 h-2 bg-gray-400/80 mt-2 rounded-full flex justify-between px-2">
              {Array.from({ length: 16 }).map((_, i) => (
                <div key={i} className="w-1.5 h-3.5 bg-amber-900/60 -mt-1 rounded-xs"></div>
              ))}
            </div>
          </div>

          {/* Hotspot Telemetry Popover */}
          {showHotspotModal && (
            <div className="absolute top-20 right-12 z-30 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-orange-200 w-64 text-xs animate-in fade-in zoom-in duration-200">
              <div className="flex justify-between items-center mb-2 pb-1 border-b border-gray-100">
                <span className="font-bold text-[#0F172A] flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-emerald-500" />
                  Structural Telemetry
                </span>
                <button 
                  onClick={() => setShowHotspotModal(false)}
                  className="text-gray-400 hover:text-gray-600 font-bold"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-1.5 text-gray-600">
                <div className="flex justify-between">
                  <span>Twistlock Castings:</span>
                  <span className="font-bold text-emerald-600">Secure (4/4)</span>
                </div>
                <div className="flex justify-between">
                  <span>Reefer Power Grid:</span>
                  <span className="font-bold text-[#FF5C00]">Active (440V)</span>
                </div>
                <div className="flex justify-between">
                  <span>Shock Sensors:</span>
                  <span className="font-bold text-gray-800">0 Events (&lt; 0.2G)</span>
                </div>
                <div className="flex justify-between">
                  <span>Cargo Manifest:</span>
                  <span className="font-bold text-gray-800 truncate max-w-[110px]">{container.cargo}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* View Controls Toolbar matching reference [-] [+] [Reset View] [<] [>] */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 z-10 relative">
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleZoomOut}
              className="w-8 h-8 rounded-xl bg-[#F4F6F8] hover:bg-gray-200 text-[#0F172A] flex items-center justify-center transition-colors text-sm font-bold"
              title="Zoom Out"
            >
              -
            </button>
            <button
              onClick={handleZoomIn}
              className="w-8 h-8 rounded-xl bg-[#F4F6F8] hover:bg-gray-200 text-[#0F172A] flex items-center justify-center transition-colors text-sm font-bold"
              title="Zoom In"
            >
              +
            </button>
            <button
              onClick={handleResetZoom}
              className="flex items-center gap-1.5 px-3 h-8 rounded-xl bg-[#F4F6F8] hover:bg-gray-200 text-xs font-semibold text-[#0F172A] transition-colors"
            >
              <RotateCcw size={13} />
              <span>Reset View</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setViewAngle('side')}
              className="w-8 h-8 rounded-xl bg-[#F4F6F8] hover:bg-gray-200 text-[#0F172A] flex items-center justify-center transition-colors"
              title="Previous Angle"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setViewAngle('isometric')}
              className="w-8 h-8 rounded-xl bg-[#F4F6F8] hover:bg-gray-200 text-[#0F172A] flex items-center justify-center transition-colors"
              title="Next Angle"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Row: Container Details (Left) + AI Route Optimization (Right) matching reference */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        
        {/* Left Card: Container Details */}
        <div className="md:col-span-5 bg-white rounded-3xl border border-[#EAEFF4] shadow-card p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                <Box size={14} className="text-[#FF5C00]" />
                <span>Container Details</span>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreVertical size={16} />
              </button>
            </div>

            <p className="text-xs text-gray-400 font-medium">Container ID</p>
            <p className="text-2xl font-black text-[#0F172A] tracking-tight font-mono">
              #{container.id}
            </p>

            {/* Container Flatbed Thumbnail Visual */}
            <div className="my-4 py-3 px-4 bg-gray-50 rounded-2xl flex items-center justify-center relative border border-gray-100">
              <div className="flex flex-col items-center">
                <div className="w-44 h-12 rounded-sm bg-gradient-to-r from-[#FF5C00] to-[#FF7A29] flex items-center justify-center text-white text-[10px] font-bold font-mono tracking-wider shadow-sm">
                  #{container.id}
                </div>
                <div className="w-48 h-2 bg-gray-800 rounded-xs mt-0.5 flex justify-between px-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-500 -mb-1"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-500 -mb-1"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-500 -mb-1"></div>
                </div>
              </div>
            </div>

            {/* Spec Key-Value List matching reference */}
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-gray-50">
                <span className="text-gray-400 font-medium">Type</span>
                <span className="font-bold text-[#0F172A]">{container.type}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-gray-50">
                <span className="text-gray-400 font-medium">Status</span>
                <span className="flex items-center gap-1.5 font-bold text-emerald-600">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  <span>{container.status}</span>
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-gray-50">
                <span className="text-gray-400 font-medium">Location</span>
                <span className="font-bold text-[#0F172A]">{container.location}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-gray-400 font-medium">In Transit</span>
                <span className="font-bold text-[#0F172A]">{container.in_transit_days} Days</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Card: AI Route Optimization matching reference image */}
        <div className="md:col-span-7 bg-white rounded-3xl border border-[#EAEFF4] shadow-card p-5 flex flex-col justify-between overflow-hidden relative">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                <Sliders size={14} className="text-[#FF5C00]" />
                <span>AI Route Optimization</span>
              </div>
              {onOpenRouteModal && (
                <button 
                  onClick={onOpenRouteModal}
                  className="text-xs font-bold text-[#FF5C00] hover:underline"
                >
                  Compare All Routes →
                </button>
              )}
            </div>

            {/* Mini Terrain / Satellite Visual Strip */}
            <div className="w-full h-36 rounded-2xl bg-gradient-to-tr from-slate-200 via-stone-100 to-slate-300 border border-gray-200 relative overflow-hidden flex items-center justify-center p-3 shadow-inner">
              {/* Badges in top left corner matching reference */}
              <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/90 backdrop-blur-sm text-[#0F172A] shadow-xs">
                  <Sparkles size={11} className="text-[#FF5C00]" />
                  AI Optimized
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#FF5C00] text-white shadow-xs">
                  18% Fuel Saved
                </span>
              </div>

              {/* Destination Marker on Mountain Pin */}
              <div className="absolute top-4 right-10 flex flex-col items-center">
                <div className="w-5 h-5 rounded-full bg-[#FF5C00] text-white flex items-center justify-center text-[9px] shadow-lg animate-bounce">
                  📍
                </div>
              </div>

              {/* Moving Miniature Multi-Car Train along mountain curve */}
              <div className="flex items-center gap-1 rotate-[-4deg] translate-y-3">
                <div className="w-9 h-6 bg-gray-800 rounded-sm shadow-md"></div>
                <div className="w-8 h-5 bg-gray-400 rounded-xs"></div>
                <div className="w-8 h-5 bg-gray-300 rounded-xs"></div>
                <div className="w-8 h-5 bg-[#FF5C00] rounded-xs shadow-sm"></div>
                <div className="w-8 h-5 bg-gray-500 rounded-xs"></div>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-gray-100 text-center">
              <div>
                <p className="text-[11px] text-gray-400 font-medium">Trajectory</p>
                <p className="text-xs font-bold text-[#0F172A]">Great Circle</p>
              </div>
              <div>
                <p className="text-[11px] text-gray-400 font-medium">CO₂ Reduction</p>
                <p className="text-xs font-bold text-emerald-600">-{container.co2_saved_pct}% MT</p>
              </div>
              <div>
                <p className="text-[11px] text-gray-400 font-medium">ETA Variance</p>
                <p className="text-xs font-bold text-[#0F172A]">+{container.delay_hours}h Buffer</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
