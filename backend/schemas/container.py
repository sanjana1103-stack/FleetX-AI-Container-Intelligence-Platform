from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class Waypoint(BaseModel):
    name: str
    lat: float
    lng: float
    passed: bool = False
    timestamp: Optional[str] = None
    delay_hours: float = 0.0

class Milestone(BaseModel):
    port_code: str
    port_name: str
    status: str # "COMPLETED", "CURRENT", "PENDING"
    scheduled_arrival: str
    actual_or_estimated_arrival: str
    delay_hours: float = 0.0
    congestion_level: str = "Low" # "Low", "Medium", "High", "Critical"

class SensorTelemetry(BaseModel):
    health_pct: int = 92
    temperature_c: float = 22.0
    humidity_pct: int = 48
    last_inspection: str = "May 18, 2026"
    reefer_status: str = "AI Controlled"
    battery_level: int = 98
    shock_events: int = 0

class ContainerDetail(BaseModel):
    id: str # e.g. "MSKU1234567" or "YMLU890123"
    carrier: str # "Maersk", "CMA CGM", "Hapag-Lloyd", "Yang Ming", "COSCO", "ONE"
    type: str # "40 Ft High Cube", "20 Ft Standard", "40 Ft Reefer", "45 Ft Pallet Wide"
    cargo: str
    status: str # "In Transit", "Active", "At Port", "Customs Hold", "Delayed"
    location: str # e.g. "Northpoint Yard", "Singapore Anchorage", "Red Sea Corridor"
    origin_port: str
    destination_port: str
    vessel_name: str
    vessel_speed_knots: float
    in_transit_days: int
    eta: str
    predicted_eta: str
    eta_confidence: int # e.g. 87%
    delay_risk: str # "Low", "Medium", "High"
    delay_hours: float
    co2_saved_pct: float
    fuel_burn_tons: float
    sensors: SensorTelemetry
    milestones: List[Milestone]
    route_waypoints: List[Waypoint]
    ai_summary: str
    disruption_active: Optional[str] = None

class PortDetail(BaseModel):
    code: str
    name: str
    country: str
    lat: float
    lng: float
    congestion_score: int # 0-100
    avg_wait_hours: float
    risk_level: str # "Low", "Medium", "High"
    weather_summary: str
    vessels_in_queue: int
    berth_capacity_pct: int

class SimulationRequest(BaseModel):
    container_id: str
    event_type: str # "STORM", "PORT_STRIKE", "CUSTOMS_DELAY", "VESSEL_BREAKDOWN", "FUEL_SPIKE", "RESET"

class SimulationResponse(BaseModel):
    container_id: str
    event_type: str
    event_title: str
    impact_summary: str
    previous_eta: str
    updated_eta: str
    added_delay_hours: float
    new_risk_level: str
    updated_waypoints: List[Waypoint]
    ai_explanation: str
    disruption_polygon: Optional[List[List[float]]] = None

class RouteOption(BaseModel):
    mode: str # "FASTEST", "CHEAPEST", "ECO"
    title: str
    distance_nm: float
    transit_days: float
    fuel_cost_usd: float
    co2_tons: float
    savings_text: str
    waypoints: List[Waypoint]

class RouteComparisonResponse(BaseModel):
    container_id: str
    current_mode: str
    options: Dict[str, RouteOption]

class AIChatRequest(BaseModel):
    query: str
    container_id: Optional[str] = "MSKU1234567"
    conversation_history: Optional[List[Dict[str, str]]] = None

class AIChatResponse(BaseModel):
    response: str
    action_type: Optional[str] = None # "SHOW_CONTAINERS", "TRIGGER_SIMULATION", "UPDATE_VIEW", "EXPORT_REPORT"
    suggested_chips: List[str] = []
    embedded_data: Optional[Dict[str, Any]] = None
