import type { ContainerDetail, PortDetail, AnalyticsData } from '../types';

export const INITIAL_CONTAINER: ContainerDetail = {
  id: 'MSKU1234567',
  carrier: 'Maersk Line',
  type: '40 Ft High Cube',
  cargo: 'High-Precision Semiconductor Wafers',
  status: 'In Transit',
  location: 'Indian Ocean Corridor',
  origin_port: 'Shanghai (CNSHA)',
  destination_port: 'Rotterdam (NLRTM)',
  vessel_name: 'Emma Maersk',
  vessel_speed_knots: 19.4,
  in_transit_days: 10,
  eta: '2026-10-11 16:30 UTC',
  predicted_eta: '2026-10-12 06:30 UTC',
  eta_confidence: 87,
  delay_risk: 'Medium',
  delay_hours: 14.0,
  co2_saved_pct: 14.2,
  fuel_burn_tons: 38.6,
  sensors: {
    health_pct: 94,
    temperature_c: 21.5,
    humidity_pct: 46,
    last_inspection: 'May 18, 2026',
    reefer_status: 'AI Controlled',
    battery_level: 97,
    shock_events: 0
  },
  milestones: [
    { port_code: 'CNSHA', port_name: 'Shanghai', status: 'COMPLETED', scheduled_arrival: '2026-09-10 08:30', actual_or_estimated_arrival: '2026-09-10 08:30', delay_hours: 0, congestion_level: 'High' },
    { port_code: 'SGSIN', port_name: 'Singapore', status: 'COMPLETED', scheduled_arrival: '2026-09-17 03:00', actual_or_estimated_arrival: '2026-09-17 06:45', delay_hours: 3.75, congestion_level: 'High' },
    { port_code: 'AEJEA', port_name: 'Jebel Ali (Dubai)', status: 'CURRENT', scheduled_arrival: '2026-09-24 08:00', actual_or_estimated_arrival: '2026-09-24 16:00', delay_hours: 8.0, congestion_level: 'Low' },
    { port_code: 'NLRTM', port_name: 'Rotterdam', status: 'PENDING', scheduled_arrival: '2026-10-11 02:30', actual_or_estimated_arrival: '2026-10-11 16:30', delay_hours: 14.0, congestion_level: 'High' }
  ],
  route_waypoints: [
    { name: 'Shanghai Port (CNSHA)', lat: 31.2304, lng: 121.4737, passed: true, timestamp: '2026-09-10 08:30 UTC', delay_hours: 0.0 },
    { name: 'East China Sea Corridor', lat: 26.5000, lng: 122.8000, passed: true, timestamp: '2026-09-12 14:00 UTC', delay_hours: 0.0 },
    { name: 'South China Sea Transit', lat: 14.2000, lng: 113.5000, passed: true, timestamp: '2026-09-14 20:15 UTC', delay_hours: 1.2 },
    { name: 'Singapore Port (SGSIN)', lat: 1.2903, lng: 103.8520, passed: true, timestamp: '2026-09-17 06:45 UTC', delay_hours: 3.5 },
    { name: 'Malacca Strait', lat: 3.8000, lng: 99.5000, passed: true, timestamp: '2026-09-18 18:00 UTC', delay_hours: 3.5 },
    { name: 'Indian Ocean Waypoint (Current)', lat: 6.8000, lng: 82.5000, passed: false, timestamp: '2026-09-20 12:00 UTC', delay_hours: 6.0 },
    { name: 'Arabian Sea Corridor', lat: 14.5000, lng: 65.2000, passed: false, timestamp: '2026-09-22 09:30 UTC', delay_hours: 6.0 },
    { name: 'Jebel Ali Port (AEJEA)', lat: 25.0067, lng: 55.0620, passed: false, timestamp: '2026-09-24 16:00 UTC', delay_hours: 8.0 },
    { name: 'Gulf of Aden & Bab-el-Mandeb', lat: 12.8000, lng: 44.5000, passed: false, timestamp: '2026-09-27 10:00 UTC', delay_hours: 8.5 },
    { name: 'Red Sea Transit', lat: 20.5000, lng: 38.2000, passed: false, timestamp: '2026-09-29 18:00 UTC', delay_hours: 9.0 },
    { name: 'Suez Canal / Port Said (EGPSD)', lat: 31.2653, lng: 32.3019, passed: false, timestamp: '2026-10-01 07:00 UTC', delay_hours: 12.0 },
    { name: 'Mediterranean Basin Waypoint', lat: 36.2000, lng: 16.5000, passed: false, timestamp: '2026-10-03 22:00 UTC', delay_hours: 12.0 },
    { name: 'Strait of Gibraltar', lat: 35.9500, lng: -5.6000, passed: false, timestamp: '2026-10-06 11:30 UTC', delay_hours: 12.0 },
    { name: 'Bay of Biscay Corridor', lat: 45.8000, lng: -6.5000, passed: false, timestamp: '2026-10-08 15:45 UTC', delay_hours: 13.0 },
    { name: 'English Channel', lat: 50.1000, lng: 0.2000, passed: false, timestamp: '2026-10-10 08:00 UTC', delay_hours: 14.0 },
    { name: 'Rotterdam Port (NLRTM)', lat: 51.9244, lng: 4.4777, passed: false, timestamp: '2026-10-11 16:30 UTC', delay_hours: 14.0 }
  ],
  ai_summary: 'Container MSKU1234567 departed Shanghai on schedule. Increased berth congestion at Singapore and monsoon headwinds in the northern Indian Ocean elevated delay risk to Medium (+14h impact). XGBoost predictive model indicates Rotterdam arrival on October 12 with 87% statistical confidence.',
  disruption_active: null
};

export const INITIAL_PORTS: PortDetail[] = [
  { code: "CNSHA", name: "Shanghai", country: "China", lat: 31.2304, lng: 121.4737, congestion: 84, wait_hours: 36.5, risk: "High", weather: "Overcast, 18°C, Wind 14 kts", queue: 62, berth_pct: 92 },
  { code: "SGSIN", name: "Singapore", country: "Singapore", lat: 1.29027, lng: 103.851959, congestion: 78, wait_hours: 28.0, risk: "Medium", weather: "Tropical Showers, 29°C, Wind 9 kts", queue: 48, berth_pct: 89 },
  { code: "NLRTM", name: "Rotterdam", country: "Netherlands", lat: 51.9244, lng: 4.4777, congestion: 81, wait_hours: 34.0, risk: "High", weather: "Rainy, 12°C, Wind 22 kts", queue: 45, berth_pct: 91 },
  { code: "AEJEA", name: "Jebel Ali (Dubai)", country: "UAE", lat: 25.0067, lng: 55.0620, congestion: 52, wait_hours: 14.5, risk: "Low", weather: "Clear, 34°C, Wind 6 kts", queue: 19, berth_pct: 69 },
  { code: "USLAX", name: "Los Angeles", country: "USA", lat: 33.7431, lng: -118.2673, congestion: 86, wait_hours: 42.0, risk: "High", weather: "Sunny, 21°C, Wind 9 kts", queue: 54, berth_pct: 94 },
  { code: "DEHAM", name: "Hamburg", country: "Germany", lat: 53.5511, lng: 9.9937, congestion: 69, wait_hours: 23.0, risk: "Medium", weather: "Light Rain, 11°C, Wind 18 kts", queue: 29, berth_pct: 82 }
];

export const INITIAL_ANALYTICS: AnalyticsData = {
  kpis: {
    active_containers: 412,
    delayed_shipments: 48,
    avg_eta_accuracy_pct: 94.6,
    co2_saved_tons: 12450.8,
    total_fleet: 520
  },
  delays_by_category: {
    "Weather Anomalies": 42,
    "Port Berth Congestion": 31,
    "Customs Clearance Holds": 15,
    "Vessel Maintenance": 12
  },
  top_congested_ports: INITIAL_PORTS,
  shipments_trend_monthly: [
    { month: "Apr", on_time: 420, delayed: 32 },
    { month: "May", on_time: 465, delayed: 28 },
    { month: "Jun", on_time: 490, delayed: 41 },
    { month: "Jul", on_time: 530, delayed: 36 },
    { month: "Aug", on_time: 580, delayed: 44 },
    { month: "Sep", on_time: 612, delayed: 39 }
  ]
};
