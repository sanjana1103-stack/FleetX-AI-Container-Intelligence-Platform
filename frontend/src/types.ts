export interface Waypoint {
  name: string;
  lat: number;
  lng: number;
  passed: boolean;
  timestamp?: string;
  delay_hours?: number;
}

export interface Milestone {
  port_code: string;
  port_name: string;
  status: 'COMPLETED' | 'CURRENT' | 'PENDING';
  scheduled_arrival: string;
  actual_or_estimated_arrival: string;
  delay_hours: number;
  congestion_level: 'Low' | 'Medium' | 'High' | 'Critical';
}

export interface SensorTelemetry {
  health_pct: number;
  temperature_c: number;
  humidity_pct: number;
  last_inspection: string;
  reefer_status: string;
  battery_level: number;
  shock_events: number;
}

export interface ContainerDetail {
  id: string;
  carrier: string;
  type: string;
  cargo: string;
  status: 'In Transit' | 'Active' | 'At Port' | 'Customs Hold' | 'Delayed';
  location: string;
  origin_port: string;
  destination_port: string;
  vessel_name: string;
  vessel_speed_knots: number;
  in_transit_days: number;
  eta: string;
  predicted_eta: string;
  eta_confidence: number;
  delay_risk: 'Low' | 'Medium' | 'High';
  delay_hours: number;
  co2_saved_pct: number;
  fuel_burn_tons: number;
  sensors: SensorTelemetry;
  milestones: Milestone[];
  route_waypoints: Waypoint[];
  ai_summary: string;
  disruption_active?: string | null;
}

export interface PortDetail {
  code: string;
  name: string;
  country: string;
  lat: number;
  lng: number;
  congestion: number;
  wait_hours: number;
  risk: 'Low' | 'Medium' | 'High';
  weather: string;
  queue: number;
  berth_pct: number;
}

export interface AnalyticsData {
  kpis: {
    active_containers: number;
    delayed_shipments: number;
    avg_eta_accuracy_pct: number;
    co2_saved_tons: number;
    total_fleet: number;
  };
  delays_by_category: Record<string, number>;
  top_congested_ports: PortDetail[];
  shipments_trend_monthly: Array<{
    month: string;
    on_time: number;
    delayed: number;
  }>;
}

export interface RouteOption {
  mode: 'FASTEST' | 'CHEAPEST' | 'ECO';
  title: string;
  distance_nm: number;
  transit_days: number;
  fuel_cost_usd: number;
  co2_tons: number;
  vessel_speed_knots: number;
  savings_text: string;
  description: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  action_type?: string;
  suggested_chips?: string[];
  embedded_data?: any;
}

// Runtime fallback exports to prevent any bundler or browser import mismatches
export const FLEET_TYPES_LOADED = true;
