import copy
from typing import Dict, Any, List
from backend.schemas.container import Waypoint, SimulationResponse

STORM_POLYGON = [
    [10.0, 78.0],
    [15.5, 84.0],
    [12.0, 90.0],
    [5.0, 85.0],
    [10.0, 78.0]
]

class DisruptionSimulator:
    def simulate(self, container: Dict[str, Any], event_type: str) -> Dict[str, Any]:
        c = copy.deepcopy(container)
        cid = c["id"]
        
        if event_type == "STORM":
            c["disruption_active"] = "STORM"
            c["delay_risk"] = "High"
            c["delay_hours"] = round(c.get("delay_hours", 0) + 32.5, 1)
            c["vessel_speed_knots"] = 12.8
            c["eta_confidence"] = 74
            c["predicted_eta"] = "2026-10-13 19:45 UTC"
            
            # Dynamic reroute waypoints deviating south of the cyclone
            rerouted = []
            for wp in c["route_waypoints"]:
                new_wp = dict(wp)
                if "Indian Ocean" in wp["name"] or "Arabian Sea" in wp["name"]:
                    new_wp["lat"] = wp["lat"] - 4.2 # Divert southward
                    new_wp["lng"] = wp["lng"] + 1.8
                    new_wp["name"] = f"{wp['name']} [STORM DETOUR S-2]"
                rerouted.append(new_wp)
            c["route_waypoints"] = rerouted
            
            explanation = (
                f"Severe Tropical Cyclone 'Varun' detected along primary shipping lane (Coordinates 12°N, 84°E). "
                f"Vessel {c['vessel_name']} executing emergency southern maritime diversion. "
                f"Cruising speed throttled from 19.4 to 12.8 knots to avoid 7.5m wave crests. "
                f"Transit time increased by +32.5 hours; delay risk elevated to High."
            )
            polygon = STORM_POLYGON

        elif event_type == "PORT_STRIKE":
            c["disruption_active"] = "PORT_STRIKE"
            c["delay_risk"] = "High"
            c["delay_hours"] = round(c.get("delay_hours", 0) + 48.0, 1)
            c["predicted_eta"] = "2026-10-14 11:00 UTC"
            c["eta_confidence"] = 68
            explanation = (
                f"Sudden dockworkers labor dispute and crane operator walkout reported at downstream destination. "
                f"Berth productivity dropped to 0 TEU/hr. Expected anchorage queue extended by +48 hours. "
                f"Recommend immediate slot reallocation or transshipment diversion via Antwerp."
            )
            polygon = None

        elif event_type == "CUSTOMS_DELAY":
            c["disruption_active"] = "CUSTOMS_DELAY"
            c["delay_risk"] = "Medium"
            c["delay_hours"] = round(c.get("delay_hours", 0) + 20.0, 1)
            c["predicted_eta"] = "2026-10-12 16:00 UTC"
            c["eta_confidence"] = 82
            explanation = (
                f"Comprehensive automated tariff re-classification flag placed on container cargo manifest. "
                f"Customs authority requires physical X-ray secondary container scanning upon arrival (+20 hours)."
            )
            polygon = None

        elif event_type == "VESSEL_BREAKDOWN":
            c["disruption_active"] = "VESSEL_BREAKDOWN"
            c["delay_risk"] = "High"
            c["delay_hours"] = round(c.get("delay_hours", 0) + 54.0, 1)
            c["vessel_speed_knots"] = 6.2
            c["predicted_eta"] = "2026-10-15 08:30 UTC"
            c["eta_confidence"] = 65
            explanation = (
                f"Main propulsion cylinder turbocharger thermal alarm triggered on vessel {c['vessel_name']}. "
                f"Operating on auxiliary emergency power derated to 6.2 knots. Offshore technician rendezvous requested."
            )
            polygon = None

        elif event_type == "FUEL_SPIKE":
            c["disruption_active"] = "FUEL_SPIKE"
            c["delay_risk"] = "Medium"
            c["delay_hours"] = round(c.get("delay_hours", 0) + 12.0, 1)
            c["vessel_speed_knots"] = 16.5
            c["co2_saved_pct"] = round(c.get("co2_saved_pct", 14.0) + 6.5, 1)
            c["predicted_eta"] = "2026-10-12 04:30 UTC"
            c["eta_confidence"] = 89
            explanation = (
                f"Global VLSFO bunker fuel prices surged +38% ($840/MT). Fleet management deployed automated "
                f"'Slow Steaming' protocol (16.5 knots speed cap), yielding 20.5% net emissions reduction while adding 12 hours."
            )
            polygon = None

        else: # RESET
            c["disruption_active"] = None
            c["delay_risk"] = "Medium" if c["id"] == "MSKU1234567" else "Low"
            c["delay_hours"] = 14.0 if c["id"] == "MSKU1234567" else 2.5
            c["vessel_speed_knots"] = 19.4
            c["predicted_eta"] = "2026-10-12 06:30 UTC" if c["id"] == "MSKU1234567" else "2026-09-28 13:45 UTC"
            c["eta_confidence"] = 87 if c["id"] == "MSKU1234567" else 92
            explanation = (
                f"Standard operational state restored. Telemetry normalized across all regional waypoints."
            )
            polygon = None

        c["ai_summary"] = explanation
        return {
            "container": c,
            "disruption_polygon": polygon,
            "explanation": explanation
        }

disruption_simulator = DisruptionSimulator()
