import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { ContainerDetail, PortDetail } from '../types';
import { Ship, AlertTriangle, CloudRain, Clock, Anchor, ShieldCheck } from 'lucide-react';

interface InteractiveMapProps {
  container: ContainerDetail;
  ports: PortDetail[];
  onTriggerStormSimulation: () => void;
  onResetSimulation: () => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  container,
  ports,
  onTriggerStormSimulation,
  onResetSimulation
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layersGroupRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [16.0, 75.0],
        zoom: 3,
        zoomControl: false,
        attributionControl: false
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Clean, elegant maritime tile layer
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 18,
        subdomains: 'abcd',
      }).addTo(map);

      mapInstanceRef.current = map;
      layersGroupRef.current = L.layerGroup().addTo(map);
    }

    const map = mapInstanceRef.current;
    const layers = layersGroupRef.current;
    if (!map || !layers) return;

    layers.clearLayers();

    // 1. Waypoint Paths
    const waypoints = container.route_waypoints || [];
    const passedCoords: [number, number][] = [];
    const remainingCoords: [number, number][] = [];

    let currentShipPos: [number, number] = [6.8, 82.5]; // Default Indian Ocean

    waypoints.forEach((wp) => {
      if (wp.passed) {
        passedCoords.push([wp.lat, wp.lng]);
      } else {
        if (remainingCoords.length === 0 && passedCoords.length > 0) {
          remainingCoords.push(passedCoords[passedCoords.length - 1]);
          currentShipPos = [wp.lat, wp.lng];
        }
        remainingCoords.push([wp.lat, wp.lng]);
      }
    });

    // Draw Passed Route (Emerald/Cyan solid line)
    if (passedCoords.length > 1) {
      L.polyline(passedCoords, {
        color: '#10B981',
        weight: 3.5,
        opacity: 0.85,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(layers);
    }

    // Draw Remaining Route (Orange dashed line, or Red if storm active)
    if (remainingCoords.length > 1) {
      const isStorm = container.disruption_active === 'STORM';
      L.polyline(remainingCoords, {
        color: isStorm ? '#EF4444' : '#FF5C00',
        weight: 3.5,
        opacity: 0.9,
        dashArray: '7, 8',
        lineCap: 'round'
      }).addTo(layers);
    }

    // 2. Storm Polygon if active
    if (container.disruption_active === 'STORM') {
      const stormCoords: [number, number][] = [
        [10.0, 78.0],
        [15.5, 84.0],
        [12.0, 90.0],
        [5.0, 85.0]
      ];

      const stormPolygon = L.polygon(stormCoords, {
        color: '#DC2626',
        fillColor: '#EF4444',
        fillOpacity: 0.28,
        weight: 2,
        dashArray: '5, 5'
      }).addTo(layers);

      stormPolygon.bindPopup(`
        <div style="font-family: sans-serif; padding: 4px;">
          <h4 style="color: #DC2626; margin: 0; font-size: 13px; font-weight: bold;">⚠️ Tropical Cyclone 'Varun'</h4>
          <p style="margin: 4px 0 0; font-size: 11px; color: #475569;">
            Wind: 68 kts | Waves: 7.2m<br/>
            Active Southern Maritime Detour Enforced
          </p>
        </div>
      `);
    }

    // 3. Port Pins
    ports.slice(0, 15).forEach((p) => {
      const portIcon = L.divIcon({
        className: 'custom-port-icon',
        html: `
          <div style="
            background: #FFFFFF;
            border: 2px solid ${p.congestion > 75 ? '#EF4444' : p.congestion > 60 ? '#F59E0B' : '#10B981'};
            color: #0F172A;
            border-radius: 9999px;
            padding: 2px 7px;
            font-size: 9px;
            font-weight: 800;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            white-space: nowrap;
            display: flex;
            align-items: center;
            gap: 3px;
          ">
            <span>⚓ ${p.name}</span>
          </div>
        `,
        iconSize: [80, 20],
        iconAnchor: [40, 10]
      });

      const marker = L.marker([p.lat, p.lng], { icon: portIcon }).addTo(layers);
      marker.bindPopup(`
        <div style="font-family: sans-serif; min-width: 170px; padding: 4px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <strong style="color: #0F172A; font-size: 13px;">${p.name} (${p.code})</strong>
            <span style="font-size: 10px; padding: 1px 6px; border-radius: 999px; background: ${p.risk === 'High' ? '#FEE2E2' : '#FEF3C7'}; color: ${p.risk === 'High' ? '#DC2626' : '#D97706'}; font-weight: bold;">
              ${p.risk} Risk
            </span>
          </div>
          <div style="font-size: 11px; color: #475569; line-height: 1.5;">
            <div><strong>Congestion:</strong> ${p.congestion}%</div>
            <div><strong>Avg Wait:</strong> ${p.wait_hours} hours</div>
            <div><strong>Weather:</strong> ${p.weather}</div>
            <div><strong>Berth Load:</strong> ${p.berth_pct}%</div>
          </div>
        </div>
      `);
    });

    // 4. Moving Ship Icon
    const shipIcon = L.divIcon({
      className: 'custom-ship-icon',
      html: `
        <div style="position: relative; display: flex; align-items: center; justify-content: center;">
          <div style="
            position: absolute;
            width: 36px;
            height: 36px;
            border-radius: 9999px;
            background: rgba(255, 92, 0, 0.25);
            animation: pulseGlow 2s infinite ease-in-out;
          "></div>
          <div style="
            position: relative;
            background: #FF5C00;
            color: white;
            width: 28px;
            height: 28px;
            border-radius: 9999px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 0 15px rgba(255, 92, 0, 0.6);
            border: 2px solid white;
          ">
            🚢
          </div>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18]
    });

    const shipMarker = L.marker(currentShipPos, { icon: shipIcon }).addTo(layers);
    shipMarker.bindPopup(`
      <div style="font-family: sans-serif; padding: 4px;">
        <strong style="color: #FF5C00; font-size: 13px;">${container.vessel_name}</strong>
        <p style="margin: 3px 0 0; font-size: 11px; color: #334155;">
          Container: #${container.id}<br/>
          Cruising Speed: ${container.vessel_speed_knots} knots<br/>
          Status: ${container.status}<br/>
          ETA: ${container.predicted_eta}
        </p>
      </div>
    `);

  }, [container, ports]);

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Top Map Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white px-5 py-3.5 rounded-2xl border border-[#EAEFF4] shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#FF5C00] flex items-center justify-center font-bold">
            <Ship size={18} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#0F172A] leading-tight">
              Global Maritime Vessel Tracker — {container.vessel_name}
            </h3>
            <p className="text-[11px] text-gray-400">
              Corridor: {container.origin_port} → {container.destination_port} | Live Great-Circle Navigation
            </p>
          </div>
        </div>

        {/* Quick Storm Simulation Trigger */}
        <div className="flex items-center gap-2">
          {container.disruption_active === 'STORM' ? (
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 animate-pulse">
                <AlertTriangle size={13} />
                Storm 'Varun' Active (+{container.delay_hours}h)
              </span>
              <button
                onClick={onResetSimulation}
                className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
              >
                Reset Route
              </button>
            </div>
          ) : (
            <button
              onClick={onTriggerStormSimulation}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white shadow-sm transition-all transform hover:scale-105"
            >
              <CloudRain size={13} />
              <span>Simulate Storm Disruption</span>
            </button>
          )}
        </div>
      </div>

      {/* Leaflet Map Canvas */}
      <div className="relative w-full h-[420px] bg-white rounded-3xl border border-[#EAEFF4] shadow-card overflow-hidden">
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Floating Legend */}
        <div className="absolute bottom-4 left-4 z-[1000] bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-2xl border border-gray-200/80 shadow-md text-[11px] flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-emerald-500 rounded-full"></span>
            <span className="font-semibold text-gray-600">Voyage Completed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-[#FF5C00] rounded-full border-dashed"></span>
            <span className="font-semibold text-gray-600">Planned Trajectory</span>
          </div>
          {container.disruption_active === 'STORM' && (
            <div className="flex items-center gap-1.5 text-red-600 font-bold">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
              <span>Southern Storm Bypass</span>
            </div>
          )}
        </div>
      </div>

      {/* Shipment Milestone Progress Bar matching prompt */}
      <div className="bg-white rounded-3xl border border-[#EAEFF4] shadow-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Shipment Milestone Journey
          </h4>
          <span className="text-xs font-bold text-[#FF5C00]">
            Current Leg: Leg 3 of 4
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 relative">
          {container.milestones.map((m, idx) => {
            const isCompleted = m.status === 'COMPLETED';
            const isCurrent = m.status === 'CURRENT';

            return (
              <div 
                key={m.port_code}
                className={`p-3.5 rounded-2xl border transition-all ${
                  isCurrent 
                    ? 'bg-orange-50/70 border-orange-300 shadow-sm' 
                    : isCompleted 
                    ? 'bg-emerald-50/50 border-emerald-200' 
                    : 'bg-gray-50 border-gray-200/70 opacity-80'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono font-bold text-gray-400">
                    {m.port_code}
                  </span>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                    isCurrent 
                      ? 'bg-[#FF5C00] text-white animate-pulse' 
                      : isCompleted 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {m.status}
                  </span>
                </div>

                <p className="text-sm font-bold text-[#0F172A] truncate">
                  {m.port_name}
                </p>

                <p className="text-[11px] text-gray-500 mt-1">
                  Arrival: <span className="font-semibold text-gray-700">{m.actual_or_estimated_arrival}</span>
                </p>

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200/50 text-[10px]">
                  <span className="text-gray-400">Congestion</span>
                  <span className={`font-bold ${
                    m.congestion_level === 'High' ? 'text-red-600' : 'text-emerald-600'
                  }`}>
                    {m.congestion_level}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
