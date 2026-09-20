import io
import csv
from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import StreamingResponse, JSONResponse
from typing import List, Optional, Dict, Any

from backend.data.ports_data import GLOBAL_PORTS
from backend.data.generator import generate_container_database
from backend.ml.eta_model import eta_engine
from backend.services.simulator import disruption_simulator
from backend.services.optimizer import calculate_route_options
from backend.services.ai_service import ai_service
from backend.schemas.container import (
    ContainerDetail, PortDetail, SimulationRequest, 
    SimulationResponse, AIChatRequest, AIChatResponse
)

router = APIRouter(prefix="/api")

# Pre-seeded database in memory with 500+ realistic containers
CONTAINERS_DB = generate_container_database(520)

@router.get("/health")
def health():
    return {"status": "healthy", "service": "FleetX Container Intelligence Platform", "total_containers": len(CONTAINERS_DB), "total_ports": len(GLOBAL_PORTS)}

@router.get("/containers")
def list_containers(
    search: Optional[str] = None,
    status: Optional[str] = None,
    risk: Optional[str] = None,
    limit: int = 100,
    offset: int = 0
):
    results = list(CONTAINERS_DB.values())
    if search:
        s = search.lower().strip()
        results = [c for c in results if s in c["id"].lower() or s in c["cargo"].lower() or s in c["carrier"].lower() or s in c["location"].lower()]
    if status:
        results = [c for c in results if c["status"].lower() == status.lower()]
    if risk:
        results = [c for c in results if c["delay_risk"].lower() == risk.lower()]
    
    total = len(results)
    sliced = results[offset : offset + limit]
    return {
        "total": total,
        "limit": limit,
        "offset": offset,
        "containers": sliced
    }

@router.get("/container/{container_id}")
def get_container(container_id: str):
    cid = container_id.strip().upper()
    if cid in CONTAINERS_DB:
        return CONTAINERS_DB[cid]
    # Try finding matching prefix or id
    for k, v in CONTAINERS_DB.items():
        if cid in k:
            return v
    raise HTTPException(status_code=404, detail=f"Container {container_id} not found.")

@router.get("/ports")
def get_ports():
    return {"total": len(GLOBAL_PORTS), "ports": GLOBAL_PORTS}

@router.get("/analytics")
def get_analytics():
    total_containers = len(CONTAINERS_DB)
    delayed = sum(1 for c in CONTAINERS_DB.values() if c["delay_risk"] in ["Medium", "High"] or c["status"] == "Delayed")
    active = sum(1 for c in CONTAINERS_DB.values() if c["status"] in ["In Transit", "Active"])
    avg_accuracy = 94.6
    co2_saved_tons = 12450.8

    # Delay distribution breakdown
    delays_by_category = {
        "Weather Anomalies": 42,
        "Port Berth Congestion": 31,
        "Customs Clearance Holds": 15,
        "Vessel Maintenance / Fuel Management": 12
    }

    # Top congested ports from ports dataset
    sorted_ports = sorted(GLOBAL_PORTS[:15], key=lambda x: x["congestion"], reverse=True)

    return {
        "kpis": {
            "active_containers": active,
            "delayed_shipments": delayed,
            "avg_eta_accuracy_pct": avg_accuracy,
            "co2_saved_tons": co2_saved_tons,
            "total_fleet": total_containers
        },
        "delays_by_category": delays_by_category,
        "top_congested_ports": sorted_ports[:6],
        "shipments_trend_monthly": [
            {"month": "Apr", "on_time": 420, "delayed": 32},
            {"month": "May", "on_time": 465, "delayed": 28},
            {"month": "Jun", "on_time": 490, "delayed": 41},
            {"month": "Jul", "on_time": 530, "delayed": 36},
            {"month": "Aug", "on_time": 580, "delayed": 44},
            {"month": "Sep", "on_time": 612, "delayed": 39}
        ]
    }

@router.post("/predict-eta")
def predict_eta(data: Dict[str, Any]):
    current_lat = data.get("current_lat", 6.8)
    current_lng = data.get("current_lng", 82.5)
    dest_lat = data.get("dest_lat", 51.9244)
    dest_lng = data.get("dest_lng", 4.4777)
    speed = data.get("vessel_speed", 19.4)
    congestion = data.get("congestion", 78.0)
    weather = data.get("weather_severity", 40.0)
    customs = data.get("customs_risk", 2.0)

    prediction = eta_engine.predict(
        current_lat=current_lat,
        current_lng=current_lng,
        dest_lat=dest_lat,
        dest_lng=dest_lng,
        vessel_speed=speed,
        congestion_score=congestion,
        weather_severity=weather,
        customs_risk=customs
    )
    return prediction

@router.post("/simulate-event")
def simulate_event(req: SimulationRequest):
    cid = req.container_id.strip().upper()
    if cid not in CONTAINERS_DB:
        # Fallback to MSKU1234567 if not found
        cid = "MSKU1234567"
    
    current_container = CONTAINERS_DB[cid]
    result = disruption_simulator.simulate(current_container, req.event_type)
    
    # Save back to in-memory state
    CONTAINERS_DB[cid] = result["container"]
    
    return {
        "container_id": cid,
        "event_type": req.event_type,
        "container": result["container"],
        "disruption_polygon": result["disruption_polygon"],
        "ai_explanation": result["explanation"]
    }

@router.post("/generate-summary")
def generate_summary(data: Dict[str, Any]):
    cid = data.get("container_id", "MSKU1234567").strip().upper()
    container = CONTAINERS_DB.get(cid, CONTAINERS_DB["MSKU1234567"])
    summary = ai_service.generate_executive_summary(container)
    return {"container_id": cid, "executive_summary": summary}

@router.post("/generate-incident-report")
def generate_incident_report(data: Dict[str, Any]):
    cid = data.get("container_id", "MSKU1234567").strip().upper()
    container = CONTAINERS_DB.get(cid, CONTAINERS_DB["MSKU1234567"])
    report = ai_service.generate_incident_report(container)
    return report

@router.post("/chat", response_model=AIChatResponse)
def ai_chat(req: AIChatRequest):
    cid = (req.container_id or "MSKU1234567").strip().upper()
    container = CONTAINERS_DB.get(cid, CONTAINERS_DB["MSKU1234567"])
    resp = ai_service.process_chat_query(req.query, container)
    return resp

@router.get("/route-options/{container_id}")
def get_route_options(container_id: str):
    cid = container_id.strip().upper()
    return calculate_route_options(cid)

@router.get("/export/csv")
def export_csv():
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow([
        "Container ID", "Carrier", "Type", "Cargo", "Status", "Location", 
        "Origin", "Destination", "Vessel", "ETA", "Delay Risk", "Delay Hours", "Health %"
    ])
    for c in CONTAINERS_DB.values():
        writer.writerow([
            c["id"], c["carrier"], c["type"], c["cargo"], c["status"], c["location"],
            c["origin_port"], c["destination_port"], c["vessel_name"], c["eta"],
            c["delay_risk"], c["delay_hours"], c["sensors"]["health_pct"]
        ])
    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=fleetx_containers_telemetry.csv"}
    )

@router.get("/fleet-health")
def get_fleet_health():
    """AI-calculated fleet health score with breakdown."""
    total = len(CONTAINERS_DB)
    high_risk = sum(1 for c in CONTAINERS_DB.values() if c["delay_risk"] == "High")
    disrupted = sum(1 for c in CONTAINERS_DB.values() if c.get("disruption_active"))
    delayed = sum(1 for c in CONTAINERS_DB.values() if c["status"] == "Delayed")
    on_time = total - delayed - disrupted

    # Weighted health score
    score = 100
    score -= (high_risk / max(total, 1)) * 30
    score -= (disrupted / max(total, 1)) * 25
    score -= (delayed / max(total, 1)) * 15
    score = max(0, min(100, round(score, 1)))

    return {
        "fleet_health_score": score,
        "total_containers": total,
        "on_time": on_time,
        "delayed": delayed,
        "high_risk": high_risk,
        "disrupted": disrupted,
        "status": "EXCELLENT" if score >= 90 else "GOOD" if score >= 75 else "DEGRADED" if score >= 55 else "CRITICAL",
        "breakdown": {
            "weather_impact": round((high_risk / max(total, 1)) * 30, 1),
            "congestion_impact": round((disrupted / max(total, 1)) * 25, 1),
            "delay_impact": round((delayed / max(total, 1)) * 15, 1),
            "baseline_score": 100
        }
    }

@router.get("/event-feed")
def get_event_feed():
    """Live operations event feed for scrolling ticker."""
    import random, datetime
    events = [
        {"type": "ALERT", "severity": "HIGH", "message": "Tropical Cyclone Varun — Indian Ocean Lane", "time": "2m ago", "icon": "storm"},
        {"type": "INFO", "severity": "MEDIUM", "message": "Rotterdam berth utilization rising to 91%", "time": "5m ago", "icon": "port"},
        {"type": "SUCCESS", "severity": "LOW", "message": "Customs clearance completed — HLCU4567890", "time": "8m ago", "icon": "customs"},
        {"type": "ALERT", "severity": "HIGH", "message": "Reefer alert — temperature drift on CMAU9876543", "time": "12m ago", "icon": "reefer"},
        {"type": "INFO", "severity": "LOW", "message": "Vessel MV Nordic Express departed Shanghai — ETA Oct 12", "time": "15m ago", "icon": "vessel"},
        {"type": "SUCCESS", "severity": "LOW", "message": "ECO route optimization applied — $47K savings", "time": "19m ago", "icon": "eco"},
        {"type": "ALERT", "severity": "MEDIUM", "message": "Anchorage queue growing at Singapore — 8 vessels", "time": "24m ago", "icon": "port"},
        {"type": "INFO", "severity": "LOW", "message": "IMB advisory: Red Sea piracy incident reported 11°N 44°E", "time": "31m ago", "icon": "security"},
        {"type": "SUCCESS", "severity": "LOW", "message": "Vessel berthed at Jebel Ali — TRHU559871 on schedule", "time": "38m ago", "icon": "vessel"},
        {"type": "INFO", "severity": "MEDIUM", "message": "Panama Canal southbound queue: 42 vessels (18h wait)", "time": "45m ago", "icon": "canal"},
    ]
    return {"events": events, "total": len(events), "generated_at": datetime.datetime.utcnow().isoformat()}

@router.get("/warehouse")
def get_warehouse_telemetry():
    return {
        "yard_name": "Northpoint Intermodal Yard",
        "yard_code": "NPY-01",
        "capacity_utilization_pct": 74,
        "active_cranes": 14,
        "autonomous_vehicles": 26,
        "ambient_temp_c": 22.0,
        "zones": [
            {"zone": "Zone A (High Cube 40')", "stack_count": 340, "congestion": "Medium", "reefer_power": "OK"},
            {"zone": "Zone B (Hazardous / Chem)", "stack_count": 120, "congestion": "Low", "reefer_power": "Isolated"},
            {"zone": "Zone C (Reefer Cold Chain)", "stack_count": 210, "congestion": "Low", "reefer_power": "100% Active"},
            {"zone": "Zone D (Rail Transfer Railhead)", "stack_count": 480, "congestion": "High", "reefer_power": "Active"}
        ]
    }
