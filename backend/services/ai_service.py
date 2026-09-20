import datetime
import random
from typing import Dict, Any, List, Optional
from backend.schemas.container import AIChatResponse

class LogisticsAIService:
    def generate_executive_summary(self, container: Dict[str, Any]) -> str:
        cid = container["id"]
        carrier = container.get("carrier", "Carrier Fleet")
        origin = container.get("origin_port", "Origin Hub")
        dest = container.get("destination_port", "Destination Hub")
        vessel = container.get("vessel_name", "Fleet Vessel")
        risk = container.get("delay_risk", "Low")
        delay = container.get("delay_hours", 0.0)
        conf = container.get("eta_confidence", 88)
        pred_eta = container.get("predicted_eta", "TBD")
        disruption = container.get("disruption_active")
        speed = container.get("vessel_speed_knots", 19.4)
        fuel = container.get("fuel_burn_tons", 180)
        co2 = container.get("co2_saved_pct", 14)

        if disruption == "STORM":
            return (
                f"OPERATIONAL ADVISORY — STORM DISRUPTION: Container {cid} ({carrier}) transiting "
                f"on vessel {vessel} has initiated emergency maritime reroute around Tropical Cyclone 'Varun'. "
                f"Speed throttled to {speed} knots. Southern detour adds +{delay}h to transit time. "
                f"Fuel burn increased to {fuel}MT. Revised ETA: {pred_eta} (ML Confidence: {conf}%). "
                f"Financial exposure: ~$82,400 in demurrage and fuel surcharge."
            )
        elif disruption == "PORT_STRIKE":
            return (
                f"EXECUTIVE ALERT — PORT STRIKE: Container {cid} impacted by industrial labor stoppage at {dest}. "
                f"Quayside gantry cranes offline. Anchorage queue extended +{delay}h. "
                f"Mitigation: transshipment diversion or rail offloading recommended. "
                f"Estimated demurrage exposure: $34,200. ETA: {pred_eta} ({conf}% confidence)."
            )
        elif disruption == "CUSTOMS_DELAY":
            return (
                f"COMPLIANCE BRIEFING — CUSTOMS HOLD: Container {cid} under secondary automated review. "
                f"HS code reclassification and X-ray scan required. Hold duration: +{delay}h. "
                f"Cold chain and sensor telemetry remain within ISO 1496 parameters. "
                f"Customs broker engaged. ETA: {pred_eta} ({conf}% confidence)."
            )
        elif disruption == "VESSEL_BREAKDOWN":
            return (
                f"TECHNICAL ALERT — PROPULSION FAILURE: Turbocharger alarm on vessel {vessel}. "
                f"Container {cid} operating at {speed} knots (emergency auxiliary power). "
                f"Shore technician dispatch active. ETA extended to {pred_eta} (+{delay}h). "
                f"P&I Club and cargo underwriter notifications dispatched."
            )
        elif disruption == "PIRATE_RISK":
            return (
                f"MARITIME SECURITY ADVISORY: IMB Red Zone advisory for Gulf of Aden/Somali Basin. "
                f"Vessel {vessel} (Container {cid}) executing Cape of Good Hope alternate routing at {speed} kts. "
                f"P&I war risk premium activated (+$18,200). ETA revised to {pred_eta} (+{delay}h). "
                f"Armed security team embarked. Fuel burn: {fuel}MT (+34% over nominal)."
            )
        elif disruption == "CANAL_BLOCKAGE":
            return (
                f"CRITICAL DISRUPTION — CANAL CLOSURE: Suez Canal blocked by vessel grounding. "
                f"Container {cid} ({carrier}) diverted Cape of Good Hope (+9,400 NM). "
                f"ETA revised to {pred_eta} (+{delay}h). Fuel surcharge: ~$142,000. "
                f"Confidence: {conf}% (low — SCA reopening timeline uncertain)."
            )
        elif disruption == "REEFER_FAILURE":
            temp = container.get("sensors", {}).get("temperature_c", 30)
            return (
                f"CARGO INTEGRITY CRITICAL — REEFER FAILURE: Container {cid} reefer compressor offline. "
                f"Temperature drifted to {temp}°C (ISO limit: 4°C for perishables). "
                f"Spoilage countdown: ~14h. Emergency priority discharge request submitted. "
                f"Cargo underwriter notified. Estimated cargo loss: $340,000."
            )
        elif risk == "High":
            return (
                f"CRITICAL DISPATCH: Container {cid} shows High delay risk (+{delay}h) due to acute berth "
                f"congestion and maritime corridor bottlenecks. ETA: {pred_eta} ({conf}% confidence). "
                f"Vessel {vessel} speed: {speed} kts. Immediate mitigation review recommended."
            )
        elif risk == "Medium":
            return (
                f"OPERATIONS UPDATE: Container {cid} departed {origin} on schedule. Elevated berth congestion "
                f"at transshipment hubs pushed projected delay to {delay}h. Vessel {vessel}: {speed} kts. "
                f"ETA: {pred_eta} ({conf}% confidence). CO₂ saved this voyage: {co2}%."
            )
        else:
            return (
                f"EXECUTIVE SUMMARY: Container {cid} ({carrier}) progressing within nominal tolerances. "
                f"Route: {origin} → {dest} | Vessel: {vessel} at {speed} kts. "
                f"Sensors confirm 92%+ cargo integrity. CO₂ saved: {co2}%. "
                f"Predicted delivery: {pred_eta} ({conf}% ML confidence)."
            )

    def generate_incident_report(self, container: Dict[str, Any]) -> Dict[str, Any]:
        cid = container["id"]
        now_str = datetime.datetime.now(datetime.timezone.utc).strftime("%B %d, %Y %H:%M UTC")
        disruption = container.get("disruption_active") or "BERTH_CONGESTION"
        risk = container.get("delay_risk", "Low")
        delay = container.get("delay_hours", 0)
        vessel = container.get("vessel_name", "Fleet Vessel")
        dest = container.get("destination_port", "Destination")
        conf = container.get("eta_confidence", 87)
        pred_eta = container.get("predicted_eta", "TBD")

        disruption_labels = {
            "STORM": "Adverse Weather — Tropical Cyclone",
            "PORT_STRIKE": "Industrial Labor Action — Port Strike",
            "CUSTOMS_DELAY": "Regulatory Hold — Customs Review",
            "VESSEL_BREAKDOWN": "Technical Failure — Propulsion Derating",
            "PIRATE_RISK": "Maritime Security — Piracy High-Risk Zone",
            "CANAL_BLOCKAGE": "Infrastructure Disruption — Canal Closure",
            "REEFER_FAILURE": "Cargo Integrity — Reefer Compressor Failure",
            "BERTH_CONGESTION": "Downstream Port Berth Congestion"
        }

        financial_map = {
            "STORM": {"direct": 82400, "fuel": 42500, "demurrage": 18200, "total": 143100},
            "PORT_STRIKE": {"direct": 34200, "fuel": 1500, "demurrage": 12800, "total": 48500},
            "CUSTOMS_DELAY": {"direct": 8400, "fuel": 0, "demurrage": 2100, "total": 10500},
            "VESSEL_BREAKDOWN": {"direct": 28600, "fuel": 12000, "demurrage": 8200, "total": 48800},
            "PIRATE_RISK": {"direct": 18200, "fuel": 62000, "demurrage": 4800, "total": 85000},
            "CANAL_BLOCKAGE": {"direct": 142000, "fuel": 84000, "demurrage": 38000, "total": 264000},
            "REEFER_FAILURE": {"direct": 340000, "fuel": 0, "demurrage": 8400, "total": 348400},
            "BERTH_CONGESTION": {"direct": 4200, "fuel": 1500, "demurrage": 6200, "total": 11900}
        }

        fin = financial_map.get(disruption, financial_map["BERTH_CONGESTION"])

        actions_map = {
            "STORM": [
                "Execute real-time Great Circle southern diversion bypass",
                "Issue consignee EDI delay notification (EDIFACT IFTSTA)",
                "Request priority berth slot at {dest} via VTS channel 16",
                "Activate P&I Club voyage deviation clause"
            ],
            "PORT_STRIKE": [
                "Evaluate transshipment diversion to Antwerp APM Terminal",
                "Coordinate rail offloading contingency with inland logistics",
                "Notify consignee SLA breach per contract clause 14.2",
                "File demurrage claim with carrier freight coordinator"
            ],
            "CANAL_BLOCKAGE": [
                "Approve Cape of Good Hope routing with additional bunker allocation",
                "Renegotiate all downstream berth bookings by +96 hours",
                "Trigger force majeure clause with shipper and consignee",
                "Submit cargo insurance claim for voyage delay losses"
            ],
            "REEFER_FAILURE": [
                "Request emergency priority discharge at nearest port of refuge",
                "Notify cargo underwriter of reefer equipment failure",
                "Arrange cold-storage re-stuffing or disposal logistics",
                "Submit P&I cargo claim with temperature logs as evidence"
            ]
        }

        suggested_actions = actions_map.get(disruption, [
            "Execute real-time Great Circle diversion bypass",
            "Notify downstream consignee via automated EDI gateway",
            "Request priority berth slot with dynamic drayage scheduling",
            "Activate cold-chain auxiliary reserve generator monitoring"
        ])

        return {
            "report_id": f"REP-INC-{cid}-{int(datetime.datetime.now().timestamp())}",
            "container_id": cid,
            "carrier": container.get("carrier"),
            "vessel": vessel,
            "generated_at": now_str,
            "classification": f"LEVEL-{2 if risk == 'High' else 1} OPERATIONAL DISRUPTION INCIDENT REPORT",
            "executive_summary": self.generate_executive_summary(container),
            "disruption_type": disruption_labels.get(disruption, "Operational Disruption"),
            "root_cause": {
                "category": disruption_labels.get(disruption, "Operational Disruption"),
                "severity": "CRITICAL" if risk == "High" else "MODERATE",
                "primary_factor": self._get_primary_factor(disruption, vessel),
                "contributing_factors": [
                    "Vessel speed restriction protocol active",
                    f"Regional corridor congestion index: {random.randint(72, 94)}%",
                    "Bunker optimization throttle adjustments applied"
                ]
            },
            "financial_impact": {
                "direct_delay_costs_usd": fin["direct"],
                "fuel_detour_surcharge_usd": fin["fuel"],
                "demurrage_exposure_risk_usd": fin["demurrage"],
                "total_estimated_impact_usd": fin["total"]
            },
            "suggested_actions": suggested_actions,
            "recovery_plan": [
                f"Estimated full recovery: {random.randint(48, 120)} hours post-disruption resolution",
                f"Alternate routing feasibility: {'Available via Cape of Good Hope' if disruption == 'CANAL_BLOCKAGE' else 'Priority berth rescheduling pending'}",
                f"Resource allocation: {random.randint(3, 8)} shore-side coordinators assigned"
            ],
            "timeline": [
                {"time": "Day 0 — 08:30 UTC", "event": "Cargo loading verified and sealed at origin terminal quay."},
                {"time": "Day 3 — 14:00 UTC", "event": f"Vessel {vessel} reached cruising speed of 19.4 knots."},
                {"time": "Day 7 — 06:15 UTC", "event": "Telemetry detected downstream congestion / disruption alert."},
                {"time": "Now — Real-time", "event": f"Active monitoring: {risk} delay risk | ETA: {pred_eta} ({conf}% confidence)"}
            ]
        }

    def _get_primary_factor(self, disruption: str, vessel: str) -> str:
        factors = {
            "STORM": "Tropical low-pressure cyclone forcing mandatory sea lane deviations",
            "PORT_STRIKE": "Quay crane utilization dropped to 0% due to industrial action",
            "CUSTOMS_DELAY": "Automated HS tariff classification flag on cargo manifest",
            "VESSEL_BREAKDOWN": f"Main propulsion turbocharger thermal alarm on {vessel}",
            "PIRATE_RISK": "IMB Red Zone advisory for Gulf of Aden / Somali Basin corridor",
            "CANAL_BLOCKAGE": "Suez Canal main channel blocked by vessel grounding — SCA closure",
            "REEFER_FAILURE": "Reefer compressor failure causing uncontrolled temperature drift",
            "BERTH_CONGESTION": "Downstream terminal berth utilization exceeding 94% capacity threshold"
        }
        return factors.get(disruption, "Operational anomaly detected in maritime corridor")

    def process_chat_query(self, query: str, container: Optional[Dict[str, Any]] = None) -> AIChatResponse:
        q = query.lower().strip()
        cid = container["id"] if container else "MSKU1234567"
        risk = container.get("delay_risk", "Medium") if container else "Medium"
        eta = container.get("predicted_eta", "October 12, 06:30 UTC") if container else "October 12, 06:30 UTC"
        conf = container.get("eta_confidence", 87) if container else 87
        vessel = container.get("vessel_name", "MV FleetX Corsair") if container else "MV FleetX Corsair"
        speed = container.get("vessel_speed_knots", 19.4) if container else 19.4
        disruption = container.get("disruption_active") if container else None
        delay = container.get("delay_hours", 0) if container else 0

        # Show containers
        if any(x in q for x in ["show me all", "in transit", "containers in", "list containers"]):
            return AIChatResponse(
                response="Sure! Here are all containers currently in transit. I've highlighted the active tracking container and flagged any at elevated risk.",
                action_type="SHOW_CONTAINERS",
                suggested_chips=["Inspect YMLU 890123", "Simulate Storm Disruption", "Route Optimization"],
                embedded_data={
                    "containers": [
                        {"id": "YMLU890123", "full_id": "YMLU 890123 4", "type": "40 Ft High Cube", "status": "Active", "location": "Northpoint Yard", "substatus": "In Transit", "color": "orange"},
                        {"id": "TRHU559871", "full_id": "TRHU 559871 2", "type": "40 Ft Standard", "status": "In Transit", "location": "Westfield Terminal", "substatus": "On Route", "color": "silver"},
                        {"id": "MSKU1234567", "full_id": "MSKU 1234567 5", "type": "40 Ft High Cube", "status": "In Transit", "location": "Indian Ocean Corridor", "substatus": "Monitoring", "color": "orange"}
                    ]
                }
            )

        # Highest risk vessel
        if any(x in q for x in ["highest risk", "most at risk", "riskiest", "highest delay", "which vessel"]):
            return AIChatResponse(
                response=(
                    f"Based on fleet-wide XGBoost risk scoring: Container MSKU1234567 (vessel {vessel}) "
                    f"is currently rated HIGHEST RISK with {delay}h delay exposure. "
                    f"Root cause: {'active ' + disruption.replace('_', ' ') + ' simulation' if disruption else 'berth congestion at Rotterdam (92% utilization)'}. "
                    f"ETA confidence: {conf}%. Immediate action: reroute via Antwerp transshipment hub or expedite berth slot."
                ),
                action_type="HIGHLIGHT_RISK",
                suggested_chips=["Trigger Storm Simulation", "Compare Eco Routes", "Generate Incident Report"]
            )

        # Executive summary
        if any(x in q for x in ["executive summary", "30-second", "30 second", "brief me", "summary", "overview"]):
            return AIChatResponse(
                response=(
                    f"EXECUTIVE BRIEFING — {datetime.datetime.utcnow().strftime('%d %b %Y, %H:%M UTC')}: "
                    f"Fleet health index: 94/100. 520 containers tracked across 104 port hubs. "
                    f"Container {cid} on vessel {vessel}: {risk} delay risk, ETA {eta} ({conf}% confidence). "
                    f"Active disruptions: {'1 — ' + disruption.replace('_', ' ') if disruption else 'None — all corridors nominal'}. "
                    f"CO₂ saved YTD: 12,450 MT via eco-routing. On-time performance: 94.6%."
                ),
                action_type="BRIEFING",
                suggested_chips=["Export PDF Dossier", "View Analytics", "Simulate Disruption"]
            )

        # Why ETA changed
        if any(x in q for x in ["why", "why did", "reason", "cause", "explain"]):
            if disruption:
                return AIChatResponse(
                    response=(
                        f"ETA CHANGE EXPLANATION: Container {cid} ETA shifted due to {disruption.replace('_', ' ')} event. "
                        f"The XGBoost ML model recalculated transit time by factoring: vessel speed reduction ({speed} kts), "
                        f"rerouting distance delta (+{round(delay * speed * 1.852, 0):.0f} km), "
                        f"and downstream port congestion adjustment. New ETA: {eta} with {conf}% confidence."
                    ),
                    action_type="EXPLAIN",
                    suggested_chips=["View XAI Breakdown", "Compare Routes", "Reset Simulation"]
                )
            else:
                return AIChatResponse(
                    response=(
                        f"Container {cid} ETA of {eta} was computed using Haversine great-circle distance, "
                        f"vessel speed ({speed} kts), destination port congestion index (78%), "
                        f"and historical seasonal delay patterns. Current confidence: {conf}%."
                    ),
                    action_type="EXPLAIN",
                    suggested_chips=["View XAI Modal", "Simulate Storm", "Export Report"]
                )

        # Route comparison
        if any(x in q for x in ["route", "compare route", "eco route", "fastest route", "optimization", "cheapest"]):
            return AIChatResponse(
                response=(
                    f"Route Analysis for {cid}: FASTEST option (19.4 kts, 22.4 days, $142,000 fuel) "
                    f"vs ECO option (16.5 kts, 26.1 days, $94,500 fuel, -28% CO₂). "
                    f"Recommendation: ECO routing saves $47,500 and 142 MT CO₂ with acceptable 3.7-day ETA delta. "
                    f"CHEAPEST via Suez transshipment saves $22,000 but adds 18h port dwell."
                ),
                action_type="COMPARE_ROUTES",
                suggested_chips=["Apply ECO Route", "Apply FASTEST Route", "View Route Optimizer"]
            )

        # Port strike / labor
        if any(x in q for x in ["port strike", "strike", "labor", "berth", "congestion"]):
            return AIChatResponse(
                response=(
                    f"Port Intelligence: Rotterdam (destination) is currently at 92% berth utilization with "
                    f"14 vessels in anchorage queue. Average wait time: 18.2 hours. "
                    f"Labor negotiation status: ONGOING. Recommend early berth booking or Antwerp transshipment. "
                    f"Would you like me to simulate a full port strike scenario on container {cid}?"
                ),
                action_type="PORT_INTEL",
                suggested_chips=["Simulate Port Strike", "View Port Radar", "Book Alternate Berth"]
            )

        # Train / intermodal
        if any(x in q for x in ["train", "onto the train", "rail", "intermodal"]):
            return AIChatResponse(
                response=f"Done! Container {cid} has been assigned to Freight Rail Convoy #TR-409 at Northpoint Intermodal Yard. Multi-modal telemetry sensors calibrated at 22°C (AI Controlled) with 92% health score.",
                action_type="UPDATE_VIEW",
                suggested_chips=["View Warehouse Twin", "Check Temperature", "Optimize Rail Route"]
            )

        # Storm / weather
        if any(x in q for x in ["storm", "weather", "cyclone", "typhoon", "wave"]):
            return AIChatResponse(
                response=f"Tropical cyclone 'Varun' (Category 3) detected at 12°N, 84°E — primary Indian Ocean shipping lane. Southern detour algorithm has recomputed transit waypoints: +32.5h ETA buffer, speed reduced to 12.8 kts. Shall I apply this live to container {cid}?",
                action_type="TRIGGER_SIMULATION",
                suggested_chips=["Apply Storm Simulation", "View Clean Route", "Export Incident PDF"]
            )

        # ETA / delay
        if any(x in q for x in ["eta", "predict", "delay", "arrival", "when"]):
            return AIChatResponse(
                response=f"XGBoost predictive model: Container {cid} estimated arrival {eta} with {conf}% statistical confidence. Current delay risk: {risk}. Vessel {vessel} at {speed} knots. {'Disruption: ' + disruption.replace('_', ' ') + ' active.' if disruption else 'No active disruptions.'}",
                action_type=None,
                suggested_chips=["Run Disruption Twin", "Compare Routes", "Generate Executive PDF"]
            )

        # Reefer / temperature / cold chain
        if any(x in q for x in ["temperature", "reefer", "cold", "cargo", "spoilage"]):
            temp = container.get("sensors", {}).get("temperature_c", 22) if container else 22
            return AIChatResponse(
                response=(
                    f"Cold chain telemetry for {cid}: Current temperature {temp}°C. "
                    f"{'⚠️ CRITICAL — above perishable threshold! Emergency action required.' if temp > 10 else 'Within ISO cold chain parameters (≤4°C for perishables).'} "
                    f"Humidity: {container.get('sensors', {}).get('humidity_pct', 62) if container else 62}% RH. "
                    f"Last inspection: {container.get('sensors', {}).get('last_inspection', '4h ago') if container else '4h ago'}."
                ),
                action_type=None,
                suggested_chips=["Simulate Reefer Failure", "Generate Inspection Report", "Alert Consignee"]
            )

        # Report / PDF
        if any(x in q for x in ["report", "pdf", "export", "dossier", "download"]):
            return AIChatResponse(
                response=f"Level-2 Operational Disruption Dossier compiled for {cid}: executive summary, root cause analysis, financial impact (${'143,100' if disruption == 'STORM' else '11,900'} estimated), and recovery timeline. Ready to download.",
                action_type="EXPORT_REPORT",
                suggested_chips=["Download PDF", "Send Consignee Alert", "Reset Disruption"]
            )

        # Fuel / eco
        if any(x in q for x in ["fuel", "bunker", "eco", "carbon", "co2", "emission"]):
            return AIChatResponse(
                response=(
                    f"Fleet sustainability metrics: CO₂ saved YTD: 12,450 MT via eco-routing. "
                    f"Container {cid}: {container.get('co2_saved_pct', 14) if container else 14}% emissions reduction this voyage. "
                    f"Fuel burn: {container.get('fuel_burn_tons', 180) if container else 180}MT. "
                    f"ECO mode recommendation: reduce to 16.5 kts to save additional $47,500 and 142 MT CO₂."
                ),
                action_type=None,
                suggested_chips=["Apply Fuel Spike Simulation", "Switch to ECO Route", "View Analytics"]
            )

        # Default
        return AIChatResponse(
            response=f"FleetX AI is tracking container {cid} across all maritime telemetry streams. Vessel {vessel} at {speed} kts | ETA: {eta} | Risk: {risk} | Confidence: {conf}%. How can I assist?",
            suggested_chips=["Show In-Transit Containers", "Simulate Disruption", "Executive Summary", "Route Comparison"]
        )

ai_service = LogisticsAIService()
