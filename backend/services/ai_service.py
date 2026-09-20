import datetime
from typing import Dict, Any, List, Optional
from backend.schemas.container import AIChatResponse

class LogisticsAIService:
    def generate_executive_summary(self, container: Dict[str, Any]) -> str:
        cid = container["id"]
        carrier = container.get("carrier", "Carrier Fleet")
        origin = container.get("origin_port", "Origin Hub")
        dest = container.get("destination_port", "Destination Hub")
        status = container.get("status", "In Transit")
        vessel = container.get("vessel_name", "Fleet Vessel")
        risk = container.get("delay_risk", "Low")
        delay = container.get("delay_hours", 0.0)
        conf = container.get("eta_confidence", 88)
        pred_eta = container.get("predicted_eta", "TBD")
        disruption = container.get("disruption_active")

        if disruption == "STORM":
            return (
                f"OPERATIONAL ADVISORY: Container {cid} ({carrier}) transiting on vessel {vessel} has initiated "
                f"an emergency maritime reroute around Tropical Cyclone 'Varun'. While navigation telemetry is stable, "
                f"reduced speed (12.8 kts) and a southward detour have increased delay by +{delay} hours. "
                f"Revised arrival at {dest} is predicted for {pred_eta} (ML Confidence: {conf}%)."
            )
        elif disruption == "PORT_STRIKE":
            return (
                f"EXECUTIVE ALERT: Container {cid} cargo handling is impacted by industrial labor stoppage at {dest}. "
                f"Quayside gantry cranes remain offline. Anchorage wait time increased by +{delay} hours. "
                f"Current mitigation recommendation: request transshipment diversion or secondary rail offloading."
            )
        elif disruption == "CUSTOMS_DELAY":
            return (
                f"COMPLIANCE BRIEFING: Container {cid} is under secondary automated customs review at {container.get('location', 'Terminal')}. "
                f"Manifest tariff verification is expected to conclude within +{delay} hours. Cold chain / health parameters remain optimal."
            )
        elif disruption == "VESSEL_BREAKDOWN":
            return (
                f"TECHNICAL ALERT: Auxiliary propulsion warning logged on vessel {vessel} transporting container {cid}. "
                f"Speed throttled to 6.2 kts. Port technical response team has been dispatched; ETA revised to {pred_eta}."
            )
        elif risk == "High":
            return (
                f"CRITICAL DISPATCH: Container {cid} currently shows High delay risk (+{delay}h) due to acute berth congestion "
                f"and seasonal maritime corridor bottlenecks. Machine learning ETA points to {pred_eta} with {conf}% confidence."
            )
        elif risk == "Medium":
            return (
                f"OPERATIONS UPDATE: Container {cid} departed {origin} on schedule. Elevated berth congestion at downstream transshipment "
                f"ports has pushed projected delay to {delay} hours. Vessel {vessel} maintains 19.4 knots cruising speed. "
                f"Estimated arrival remains {pred_eta} ({conf}% confidence)."
            )
        else:
            return (
                f"EXECUTIVE SUMMARY: Container {cid} ({carrier}) is progressing within nominal voyage tolerances along the {origin} "
                f"to {dest} corridor on vessel {vessel}. Internal environmental sensors confirm 92%+ cargo integrity. "
                f"Predicted delivery is {pred_eta} with {conf}% ML statistical confidence."
            )

    def generate_incident_report(self, container: Dict[str, Any]) -> Dict[str, Any]:
        cid = container["id"]
        now_str = datetime.datetime.now(datetime.timezone.utc).strftime("%B %d, %Y %H:%M UTC")
        disruption = container.get("disruption_active") or "BERTH_CONGESTION"
        
        return {
            "report_id": f"REP-INC-{cid}-{int(datetime.datetime.now().timestamp())}",
            "container_id": cid,
            "carrier": container.get("carrier"),
            "vessel": container.get("vessel_name"),
            "generated_at": now_str,
            "classification": "LEVEL-2 OPERATIONAL DISRUPTION INCIDENT REPORT",
            "executive_summary": self.generate_executive_summary(container),
            "root_cause": {
                "category": "Adverse Weather & Maritime Bottleneck" if disruption == "STORM" else "Downstream Port Infrastructure Congestion",
                "severity": "CRITICAL" if container.get("delay_risk") == "High" else "MODERATE",
                "primary_factor": "Tropical low-pressure cyclone forcing sea lane deviations" if disruption == "STORM" else "Quay crane utilization exceeding 94% berth threshold",
                "contributing_factors": [
                    "Vessel speed restriction protocol active",
                    "Regional transshipment yard container stack dwell exceeding 4.2 days",
                    "Bunker optimization throttle adjustments"
                ]
            },
            "financial_impact": {
                "direct_delay_costs_usd": 14500.0 if container.get("delay_risk") == "High" else 4200.0,
                "fuel_detour_surcharge_usd": 8900.0 if disruption == "STORM" else 1500.0,
                "demurrage_exposure_risk_usd": 6200.0,
                "total_estimated_impact_usd": 29600.0 if container.get("delay_risk") == "High" else 5700.0
            },
            "suggested_actions": [
                "Execute real-time Great Circle southern diversion bypass",
                "Notify downstream consignee automated EDI tracking gateway",
                "Request priority offloading berth slot with dynamic drayage scheduling",
                "Activate cold-chain auxiliary reserve generator telemetry monitoring"
            ],
            "timeline": [
                {"time": "Day 0 - 08:30 UTC", "event": "Cargo loading verified at origin terminal quay."},
                {"time": "Day 3 - 14:00 UTC", "event": "Vessel reached deep sea cruising speed of 19.4 knots."},
                {"time": "Day 7 - 06:15 UTC", "event": "Telemetry detected downstream congestion alert."},
                {"time": "Current - Telemetry", "event": f"Active position monitored with {container.get('delay_risk')} delay risk rating."}
            ]
        }

    def process_chat_query(self, query: str, container: Optional[Dict[str, Any]] = None) -> AIChatResponse:
        q = query.lower()
        cid = container["id"] if container else "MSKU1234567"
        
        # Reference image matching responses:
        if "show me all containers" in q or "in transit" in q:
            return AIChatResponse(
                response="Sure! Here are all containers currently in transit, plus the container currently on route for your convenience today.",
                action_type="SHOW_CONTAINERS",
                suggested_chips=["Inspect YMLU 890123", "Simulate Storm", "Route Optimization"],
                embedded_data={
                    "containers": [
                        {
                            "id": "YMLU 890123 4",
                            "type": "40 Ft High Cube",
                            "status": "Active",
                            "location": "Northpoint Yard",
                            "substatus": "In Transit",
                            "color": "orange"
                        },
                        {
                            "id": "TRHU 559871 2",
                            "type": "40 Ft Standard",
                            "status": "In Transit",
                            "location": "Westfield Terminal",
                            "substatus": "On Route",
                            "color": "silver"
                        },
                        {
                            "id": "MSKU 1234567",
                            "type": "40 Ft High Cube",
                            "status": "In Transit",
                            "location": "Indian Ocean Corridor",
                            "substatus": "In Transit",
                            "color": "cyan"
                        }
                    ]
                }
            )
        
        if "train" in q or "onto the train" in q:
            return AIChatResponse(
                response=f"Done! Container {cid} has been assigned to Freight Rail Convoy #TR-409 at Northpoint Intermodal Yard. Multi-modal telemetry sensors are calibrated at 22°C (AI Controlled) with 92% health score.",
                action_type="UPDATE_VIEW",
                suggested_chips=["View 3D Yard", "Optimize Rail Route", "Check Temperature"]
            )
            
        if "storm" in q or "weather" in q or "cyclone" in q:
            return AIChatResponse(
                response=f"Tropical storm disruption detected near Indian Ocean sector. Southern detour algorithm has recomputed transit waypoints with +32.5 hours ETA buffer. Would you like me to apply this simulation to the live map?",
                action_type="TRIGGER_SIMULATION",
                suggested_chips=["Apply Storm Simulation", "View Clean Route", "Export Incident PDF"]
            )

        if "eta" in q or "predict" in q or "delay" in q:
            eta = container.get("predicted_eta", "October 12, 06:30 UTC") if container else "October 12, 06:30 UTC"
            risk = container.get("delay_risk", "Medium") if container else "Medium"
            conf = container.get("eta_confidence", 87) if container else 87
            return AIChatResponse(
                response=f"The XGBoost predictive model estimates container {cid} will arrive at its destination on {eta} with {conf}% statistical confidence. Current delay risk is evaluated as {risk}.",
                action_type=None,
                suggested_chips=["Run Disruption Twin", "Compare Routes", "Generate Executive PDF"]
            )

        if "report" in q or "pdf" in q or "export" in q:
            return AIChatResponse(
                response=f"I have compiled the comprehensive Level-2 Operational Disruption Dossier for {cid} including root cause analysis and financial impact breakdown. You can download the PDF right now.",
                action_type="EXPORT_REPORT",
                suggested_chips=["Download PDF", "Send Consignee Alert", "Reset Disruption"]
            )

        # Default helpful logistics AI response
        return AIChatResponse(
            response=f"FleetX AI operational monitor is tracking container {cid}. All multi-modal telemetry streams, cold chain sensors, and great-circle maritime routes are operating under predictive oversight. How can I assist with this voyage?",
            suggested_chips=["Show In-Transit Containers", "Simulate Disruption", "Optimize Route", "Generate Summary"]
        )

ai_service = LogisticsAIService()
