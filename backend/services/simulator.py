import copy
from typing import Dict, Any, List, Optional

STORM_POLYGON = [
    [10.0, 78.0],
    [15.5, 84.0],
    [12.0, 90.0],
    [5.0, 85.0],
    [10.0, 78.0]
]

PIRATE_ZONE_POLYGON = [
    [11.0, 43.0],
    [15.0, 50.0],
    [12.0, 54.0],
    [8.0, 50.0],
    [11.0, 43.0]
]

CANAL_BLOCKAGE_POLYGON = [
    [30.0, 32.0],
    [30.5, 32.7],
    [30.0, 33.0],
    [29.5, 32.5],
    [30.0, 32.0]
]

class DisruptionSimulator:
    def simulate(self, container: Dict[str, Any], event_type: str) -> Dict[str, Any]:
        c = copy.deepcopy(container)

        if event_type == "STORM":
            c["disruption_active"] = "STORM"
            c["delay_risk"] = "High"
            c["delay_hours"] = round(c.get("delay_hours", 0) + 32.5, 1)
            c["vessel_speed_knots"] = 12.8
            c["eta_confidence"] = 74
            c["predicted_eta"] = "2026-10-13 19:45 UTC"
            c["fuel_burn_tons"] = round(c.get("fuel_burn_tons", 180) + 42.5, 1)
            c["co2_saved_pct"] = max(0, round(c.get("co2_saved_pct", 14) - 8, 1))

            rerouted = []
            for wp in c["route_waypoints"]:
                new_wp = dict(wp)
                if "Indian Ocean" in wp["name"] or "Arabian Sea" in wp["name"]:
                    new_wp["lat"] = wp["lat"] - 4.2
                    new_wp["lng"] = wp["lng"] + 1.8
                    new_wp["name"] = f"{wp['name']} [STORM DETOUR S-2]"
                rerouted.append(new_wp)
            c["route_waypoints"] = rerouted

            explanation = (
                f"Severe Tropical Cyclone 'Varun' detected along primary shipping lane (12°N, 84°E). "
                f"Vessel {c['vessel_name']} executing emergency southern maritime diversion. "
                f"Speed throttled from 19.4 → 12.8 knots (7.5m wave avoidance). "
                f"Delay +32.5h | Fuel +42.5MT | CO₂ efficiency reduced. ETA revised to 13 Oct 2026."
            )
            polygon = STORM_POLYGON

        elif event_type == "PORT_STRIKE":
            c["disruption_active"] = "PORT_STRIKE"
            c["delay_risk"] = "High"
            c["delay_hours"] = round(c.get("delay_hours", 0) + 48.0, 1)
            c["predicted_eta"] = "2026-10-14 11:00 UTC"
            c["eta_confidence"] = 68
            explanation = (
                f"Dockworkers labor dispute and crane operator walkout at destination terminal. "
                f"Berth productivity: 0 TEU/hr. Anchorage queue extended +48 hours. "
                f"Recommendation: transshipment diversion via Antwerp or secondary rail offloading."
            )
            polygon = None

        elif event_type == "CUSTOMS_DELAY":
            c["disruption_active"] = "CUSTOMS_DELAY"
            c["delay_risk"] = "Medium"
            c["delay_hours"] = round(c.get("delay_hours", 0) + 20.0, 1)
            c["predicted_eta"] = "2026-10-12 16:00 UTC"
            c["eta_confidence"] = 82
            explanation = (
                f"Automated HS code reclassification flag placed on cargo manifest. "
                f"Secondary X-ray radiological scan required upon arrival (+20h hold). "
                f"Cold chain and sensor telemetry remain within ISO 1496 parameters."
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
                f"Main propulsion turbocharger thermal alarm triggered on {c['vessel_name']}. "
                f"Operating on auxiliary emergency power at 6.2 knots (66% speed reduction). "
                f"Shore technician rendezvous requested from Colombo Maritime Services. ETA +54h."
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
                f"Global VLSFO bunker fuel at $840/MT (+38% surge). Automated 'Slow Steam' "
                f"protocol deployed at 16.5 knots. Net CO₂ reduction: 20.5%. Transit extended +12h "
                f"with projected fuel savings of $28,400 across fleet."
            )
            polygon = None

        elif event_type == "PIRATE_RISK":
            c["disruption_active"] = "PIRATE_RISK"
            c["delay_risk"] = "High"
            c["delay_hours"] = round(c.get("delay_hours", 0) + 38.0, 1)
            c["vessel_speed_knots"] = 22.4
            c["predicted_eta"] = "2026-10-14 02:00 UTC"
            c["eta_confidence"] = 71
            c["fuel_burn_tons"] = round(c.get("fuel_burn_tons", 180) + 62.0, 1)

            explanation = (
                f"HIGH-RISK MARITIME SECURITY ALERT: IMB Piracy Reporting Centre issued Red Zone advisory "
                f"for Gulf of Aden / Somali Basin corridor. Vessel {c['vessel_name']} executing armed escort "
                f"protocol at 22.4 knots via Cape of Good Hope alternate routing. "
                f"P&I Club war risk premium +$18,200 activated. Transit extended +38h."
            )
            polygon = PIRATE_ZONE_POLYGON

        elif event_type == "CANAL_BLOCKAGE":
            c["disruption_active"] = "CANAL_BLOCKAGE"
            c["delay_risk"] = "High"
            c["delay_hours"] = round(c.get("delay_hours", 0) + 96.0, 1)
            c["vessel_speed_knots"] = 14.1
            c["predicted_eta"] = "2026-10-18 14:00 UTC"
            c["eta_confidence"] = 58
            c["fuel_burn_tons"] = round(c.get("fuel_burn_tons", 180) + 140.0, 1)

            rerouted = []
            for wp in c["route_waypoints"]:
                new_wp = dict(wp)
                if "Suez" in wp["name"] or "Mediterranean" in wp["name"] or "Red Sea" in wp["name"]:
                    new_wp["lat"] = wp["lat"] - 18.0
                    new_wp["lng"] = wp["lng"] - 12.0
                    new_wp["name"] = f"Cape of Good Hope [SUEZ BYPASS]"
                rerouted.append(new_wp)
            c["route_waypoints"] = rerouted

            explanation = (
                f"CRITICAL: Container vessel grounding blocks Suez Canal main channel. "
                f"SCA authority has suspended all northbound transits indefinitely. "
                f"Vessel {c['vessel_name']} diverted via Cape of Good Hope (+9,400 NM extension). "
                f"Financial exposure: +$142,000 fuel surcharge. ETA revised to 18 Oct 2026 (+96h)."
            )
            polygon = CANAL_BLOCKAGE_POLYGON

        elif event_type == "REEFER_FAILURE":
            c["disruption_active"] = "REEFER_FAILURE"
            c["delay_risk"] = "High"
            c["delay_hours"] = round(c.get("delay_hours", 0) + 0, 1)
            c["sensors"]["temperature_c"] = round(c["sensors"].get("temperature_c", 22) + 8.4, 1)
            c["sensors"]["health_pct"] = max(40, c["sensors"].get("health_pct", 92) - 28)
            c["eta_confidence"] = 79
            explanation = (
                f"CARGO INTEGRITY CRITICAL: Reefer unit compressor failure on container {c['id']}. "
                f"Cargo temperature drifted to {c['sensors']['temperature_c']}°C (threshold: 4°C). "
                f"Cold-chain spoilage countdown: 14h before regulatory write-off. "
                f"Emergency priority discharge berth request submitted at nearest port of refuge."
            )
            polygon = None

        else:  # RESET
            c["disruption_active"] = None
            c["delay_risk"] = "Medium" if c["id"] == "MSKU1234567" else "Low"
            c["delay_hours"] = 14.0 if c["id"] == "MSKU1234567" else 2.5
            c["vessel_speed_knots"] = 19.4
            c["predicted_eta"] = "2026-10-12 06:30 UTC" if c["id"] == "MSKU1234567" else "2026-09-28 13:45 UTC"
            c["eta_confidence"] = 87 if c["id"] == "MSKU1234567" else 92
            c["fuel_burn_tons"] = 180.0
            c["co2_saved_pct"] = 14.0
            c["sensors"]["temperature_c"] = 22.0
            c["sensors"]["health_pct"] = 92
            explanation = "Standard operational state restored. All telemetry normalized across maritime waypoints."
            polygon = None

        c["ai_summary"] = explanation
        return {
            "container": c,
            "disruption_polygon": polygon,
            "explanation": explanation
        }

disruption_simulator = DisruptionSimulator()
