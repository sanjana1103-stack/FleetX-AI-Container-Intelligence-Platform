from typing import Dict, Any, List

def calculate_route_options(container_id: str) -> Dict[str, Any]:
    # Route profiles for container
    return {
        "FASTEST": {
            "mode": "FASTEST",
            "title": "Fastest Route (Direct Suez Corridor)",
            "distance_nm": 8450.0,
            "transit_days": 21.5,
            "fuel_cost_usd": 142500.0,
            "co2_tons": 312.4,
            "vessel_speed_knots": 21.5,
            "savings_text": "Saves 4.2 days vs Eco; +28% fuel burn",
            "description": "Maximum cruising velocity (21.5 kts) via primary shipping canals with priority lock access."
        },
        "CHEAPEST": {
            "mode": "CHEAPEST",
            "title": "Cheapest Route (Toll Avoidance)",
            "distance_nm": 9820.0,
            "transit_days": 26.0,
            "fuel_cost_usd": 98400.0,
            "co2_tons": 245.0,
            "vessel_speed_knots": 17.8,
            "savings_text": "Saves $44,100 in canal transit tariffs",
            "description": "Bypasses high-congestion canal tariffs; cruises at economic speed threshold (17.8 kts)."
        },
        "ECO": {
            "mode": "ECO",
            "title": "Eco Green Route (Slow Steaming)",
            "distance_nm": 8600.0,
            "transit_days": 24.8,
            "fuel_cost_usd": 86200.0,
            "co2_tons": 184.2,
            "vessel_speed_knots": 15.2,
            "savings_text": "Saves 41% CO2 (-128.2 MT) & $56,300 fuel",
            "description": "Optimized slow-steaming trajectory matching tidal currents with lowest carbon index per TEU-km."
        }
    }
