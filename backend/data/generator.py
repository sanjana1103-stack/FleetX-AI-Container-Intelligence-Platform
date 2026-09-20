import random
import datetime
from typing import List, Dict, Any
from backend.data.ports_data import GLOBAL_PORTS

CARRIERS = [
    {"prefix": "MSKU", "name": "Maersk Line"},
    {"prefix": "CMAU", "name": "CMA CGM Group"},
    {"prefix": "HLCU", "name": "Hapag-Lloyd"},
    {"prefix": "YMLU", "name": "Yang Ming Marine"},
    {"prefix": "COSU", "name": "COSCO Shipping"},
    {"prefix": "ONEY", "name": "Ocean Network Express (ONE)"},
    {"prefix": "MEDU", "name": "MSC Mediterranean"},
    {"prefix": "EGLV", "name": "Evergreen Marine"}
]

VESSELS = [
    "Emma Maersk", "Ever Given", "CMA CGM Jacques Saadé", "Hapag-Lloyd Berlin Express", 
    "MSC Irina", "Madrid Maersk", "OOCL Hong Kong", "Yang Ming Wellhead", "COSCO Universe", "ONE Apus"
]

TYPES = ["40 Ft High Cube", "20 Ft Standard", "40 Ft Reefer", "45 Ft Pallet Wide"]

CARGO_TYPES = [
    "High-Precision Semiconductor Wafers", "Automotive Lithium Batteries", "Specialty Pharmaceuticals",
    "Consumer Electronics & Displays", "Solar Photovoltaic Cells", "Aircraft Composite Parts",
    "Specialty Organic Perishables", "Industrial Robotics Modules", "Luxury Retail Apparel", "Machinery Components"
]

LOCATIONS = [
    "Northpoint Yard", "Westfield Terminal", "Singapore Anchorage", "Malacca Strait Corridor", 
    "Red Sea Maritime Lane", "Suez Transit Convoy", "Mediterranean Approach", "Rotterdam Maasvlakte II",
    "Pacific High-Seas Waypoint 4", "English Channel Gateway", "Arabian Gulf Sector 2"
]

# Primary Demo Voyage for MSKU1234567
MSKU_WAYPOINTS = [
    {"name": "Shanghai Port (CNSHA)", "lat": 31.2304, "lng": 121.4737, "passed": True, "timestamp": "2026-09-10 08:30 UTC", "delay_hours": 0.0},
    {"name": "East China Sea Corridor", "lat": 26.5000, "lng": 122.8000, "passed": True, "timestamp": "2026-09-12 14:00 UTC", "delay_hours": 0.0},
    {"name": "South China Sea Transit", "lat": 14.2000, "lng": 113.5000, "passed": True, "timestamp": "2026-09-14 20:15 UTC", "delay_hours": 1.2},
    {"name": "Singapore Port (SGSIN)", "lat": 1.2903, "lng": 103.8520, "passed": True, "timestamp": "2026-09-17 06:45 UTC", "delay_hours": 3.5},
    {"name": "Malacca Strait", "lat": 3.8000, "lng": 99.5000, "passed": True, "timestamp": "2026-09-18 18:00 UTC", "delay_hours": 3.5},
    {"name": "Indian Ocean Waypoint (Current)", "lat": 6.8000, "lng": 82.5000, "passed": False, "timestamp": "2026-09-20 12:00 UTC", "delay_hours": 6.0},
    {"name": "Arabian Sea Corridor", "lat": 14.5000, "lng": 65.2000, "passed": False, "timestamp": "2026-09-22 09:30 UTC", "delay_hours": 6.0},
    {"name": "Jebel Ali Port (AEJEA)", "lat": 25.0067, "lng": 55.0620, "passed": False, "timestamp": "2026-09-24 16:00 UTC", "delay_hours": 8.0},
    {"name": "Gulf of Aden & Bab-el-Mandeb", "lat": 12.8000, "lng": 44.5000, "passed": False, "timestamp": "2026-09-27 10:00 UTC", "delay_hours": 8.5},
    {"name": "Red Sea Transit", "lat": 20.5000, "lng": 38.2000, "passed": False, "timestamp": "2026-09-29 18:00 UTC", "delay_hours": 9.0},
    {"name": "Suez Canal / Port Said (EGPSD)", "lat": 31.2653, "lng": 32.3019, "passed": False, "timestamp": "2026-10-01 07:00 UTC", "delay_hours": 12.0},
    {"name": "Mediterranean Basin Waypoint", "lat": 36.2000, "lng": 16.5000, "passed": False, "timestamp": "2026-10-03 22:00 UTC", "delay_hours": 12.0},
    {"name": "Strait of Gibraltar", "lat": 35.9500, "lng": -5.6000, "passed": False, "timestamp": "2026-10-06 11:30 UTC", "delay_hours": 12.0},
    {"name": "Bay of Biscay Corridor", "lat": 45.8000, "lng": -6.5000, "passed": False, "timestamp": "2026-10-08 15:45 UTC", "delay_hours": 13.0},
    {"name": "English Channel", "lat": 50.1000, "lng": 0.2000, "passed": False, "timestamp": "2026-10-10 08:00 UTC", "delay_hours": 14.0},
    {"name": "Rotterdam Port (NLRTM)", "lat": 51.9244, "lng": 4.4777, "passed": False, "timestamp": "2026-10-11 16:30 UTC", "delay_hours": 14.0}
]

def generate_container_database(count: int = 520) -> Dict[str, Any]:
    containers = {}
    
    # 1. Primary Highlight Container MSKU1234567
    containers["MSKU1234567"] = {
        "id": "MSKU1234567",
        "carrier": "Maersk Line",
        "type": "40 Ft High Cube",
        "cargo": "High-Precision Semiconductor Wafers",
        "status": "In Transit",
        "location": "Indian Ocean Corridor",
        "origin_port": "Shanghai (CNSHA)",
        "destination_port": "Rotterdam (NLRTM)",
        "vessel_name": "Emma Maersk",
        "vessel_speed_knots": 19.4,
        "in_transit_days": 10,
        "eta": "2026-10-11 16:30 UTC",
        "predicted_eta": "2026-10-12 06:30 UTC",
        "eta_confidence": 87,
        "delay_risk": "Medium",
        "delay_hours": 14.0,
        "co2_saved_pct": 14.2,
        "fuel_burn_tons": 38.6,
        "sensors": {
            "health_pct": 94,
            "temperature_c": 21.5,
            "humidity_pct": 46,
            "last_inspection": "May 18, 2026",
            "reefer_status": "AI Controlled",
            "battery_level": 97,
            "shock_events": 0
        },
        "milestones": [
            {"port_code": "CNSHA", "port_name": "Shanghai", "status": "COMPLETED", "scheduled_arrival": "2026-09-10 08:30", "actual_or_estimated_arrival": "2026-09-10 08:30", "delay_hours": 0.0, "congestion_level": "High"},
            {"port_code": "SGSIN", "port_name": "Singapore", "status": "COMPLETED", "scheduled_arrival": "2026-09-17 03:00", "actual_or_estimated_arrival": "2026-09-17 06:45", "delay_hours": 3.75, "congestion_level": "High"},
            {"port_code": "AEJEA", "port_name": "Jebel Ali (Dubai)", "status": "CURRENT", "scheduled_arrival": "2026-09-24 08:00", "actual_or_estimated_arrival": "2026-09-24 16:00", "delay_hours": 8.0, "congestion_level": "Low"},
            {"port_code": "NLRTM", "port_name": "Rotterdam", "status": "PENDING", "scheduled_arrival": "2026-10-11 02:30", "actual_or_estimated_arrival": "2026-10-11 16:30", "delay_hours": 14.0, "congestion_level": "High"}
        ],
        "route_waypoints": MSKU_WAYPOINTS,
        "ai_summary": "Container MSKU1234567 departed Shanghai on schedule. Increased berth congestion at Singapore and monsoon headwinds in the northern Indian Ocean elevated delay risk to Medium (+14h impact). XGBoost predictive model indicates Rotterdam arrival on October 12 with 87% statistical confidence.",
        "disruption_active": None
    }

    # 2. Reference Image Container YMLU 890123
    containers["YMLU890123"] = {
        "id": "YMLU890123",
        "carrier": "Yang Ming Marine",
        "type": "40 Ft High Cube",
        "cargo": "Automotive Lithium Batteries",
        "status": "Active",
        "location": "Northpoint Yard",
        "origin_port": "Busan (KRPUS)",
        "destination_port": "Los Angeles (USLAX)",
        "vessel_name": "Yang Ming Wellhead",
        "vessel_speed_knots": 21.0,
        "in_transit_days": 2,
        "eta": "2026-09-28 11:00 UTC",
        "predicted_eta": "2026-09-28 13:45 UTC",
        "eta_confidence": 92,
        "delay_risk": "Low",
        "delay_hours": 2.75,
        "co2_saved_pct": 18.0,
        "fuel_burn_tons": 24.1,
        "sensors": {
            "health_pct": 92,
            "temperature_c": 22.0,
            "humidity_pct": 48,
            "last_inspection": "May 18, 2026",
            "reefer_status": "AI Controlled",
            "battery_level": 99,
            "shock_events": 0
        },
        "milestones": [
            {"port_code": "KRPUS", "port_name": "Busan", "status": "COMPLETED", "scheduled_arrival": "2026-09-18 09:00", "actual_or_estimated_arrival": "2026-09-18 09:00", "delay_hours": 0.0, "congestion_level": "Low"},
            {"port_code": "JPTYO", "port_name": "Tokyo", "status": "COMPLETED", "scheduled_arrival": "2026-09-19 14:00", "actual_or_estimated_arrival": "2026-09-19 15:30", "delay_hours": 1.5, "congestion_level": "Low"},
            {"port_code": "USLAX", "port_name": "Los Angeles", "status": "CURRENT", "scheduled_arrival": "2026-09-28 08:00", "actual_or_estimated_arrival": "2026-09-28 11:00", "delay_hours": 3.0, "congestion_level": "High"}
        ],
        "route_waypoints": [
            {"name": "Busan Hub", "lat": 35.1796, "lng": 129.0756, "passed": True, "timestamp": "2026-09-18 09:00 UTC"},
            {"name": "Tokyo Berth", "lat": 35.6762, "lng": 139.6503, "passed": True, "timestamp": "2026-09-19 15:30 UTC"},
            {"name": "Northpoint Yard (Current)", "lat": 37.5000, "lng": 160.0000, "passed": False, "timestamp": "2026-09-20 10:00 UTC"},
            {"name": "Pacific Great Circle", "lat": 40.0000, "lng": -150.0000, "passed": False, "timestamp": "2026-09-24 12:00 UTC"},
            {"name": "Los Angeles Terminal", "lat": 33.7431, "lng": -118.2673, "passed": False, "timestamp": "2026-09-28 11:00 UTC"}
        ],
        "ai_summary": "Container YMLU 890123 has been dispatched through Northpoint Intermodal Yard. Multi-modal telemetry confirms active temperature stabilization at 22°C with 92% health score. Pacific crossing trajectory is optimal with 18% fuel conservation.",
        "disruption_active": None
    }

    # 3. Reference Image Container TRHU 559871
    containers["TRHU559871"] = {
        "id": "TRHU559871",
        "carrier": "Hapag-Lloyd",
        "type": "40 Ft Standard",
        "cargo": "Consumer Electronics & Displays",
        "status": "In Transit",
        "location": "Westfield Terminal",
        "origin_port": "Hamburg (DEHAM)",
        "destination_port": "New York (USNYC)",
        "vessel_name": "Hapag-Lloyd Berlin Express",
        "vessel_speed_knots": 18.8,
        "in_transit_days": 4,
        "eta": "2026-09-25 18:00 UTC",
        "predicted_eta": "2026-09-25 20:30 UTC",
        "eta_confidence": 91,
        "delay_risk": "Low",
        "delay_hours": 2.5,
        "co2_saved_pct": 12.5,
        "fuel_burn_tons": 29.3,
        "sensors": {
            "health_pct": 96,
            "temperature_c": 19.5,
            "humidity_pct": 42,
            "last_inspection": "May 19, 2026",
            "reefer_status": "Ambient Secure",
            "battery_level": 94,
            "shock_events": 0
        },
        "milestones": [
            {"port_code": "DEHAM", "port_name": "Hamburg", "status": "COMPLETED", "scheduled_arrival": "2026-09-16 10:00", "actual_or_estimated_arrival": "2026-09-16 10:00", "delay_hours": 0.0, "congestion_level": "Medium"},
            {"port_code": "GBFXT", "port_name": "Felixstowe", "status": "COMPLETED", "scheduled_arrival": "2026-09-17 18:00", "actual_or_estimated_arrival": "2026-09-17 19:15", "delay_hours": 1.25, "congestion_level": "Low"},
            {"port_code": "USNYC", "port_name": "New York", "status": "CURRENT", "scheduled_arrival": "2026-09-25 15:30", "actual_or_estimated_arrival": "2026-09-25 18:00", "delay_hours": 2.5, "congestion_level": "Medium"}
        ],
        "route_waypoints": [
            {"name": "Hamburg Departure", "lat": 53.5511, "lng": 9.9937, "passed": True, "timestamp": "2026-09-16 10:00 UTC"},
            {"name": "English Channel", "lat": 50.5000, "lng": -1.2000, "passed": True, "timestamp": "2026-09-18 04:00 UTC"},
            {"name": "Westfield Terminal / Mid-Atlantic", "lat": 46.2000, "lng": -35.0000, "passed": False, "timestamp": "2026-09-21 14:00 UTC"},
            {"name": "New York Approach", "lat": 40.6720, "lng": -74.1200, "passed": False, "timestamp": "2026-09-25 18:00 UTC"}
        ],
        "ai_summary": "TRHU 559871 cleared Felixstowe without customs hold. Cruising North Atlantic corridor with calm swell index. Expected arrival in New York within 2.5 hour buffer of schedule.",
        "disruption_active": None
    }

    # Additional Demo ID: CMAU9876543
    containers["CMAU9876543"] = {
        "id": "CMAU9876543",
        "carrier": "CMA CGM Group",
        "type": "40 Ft Reefer",
        "cargo": "Specialty Pharmaceuticals",
        "status": "In Transit",
        "location": "Pacific Corridor",
        "origin_port": "Shenzhen (CNSZX)",
        "destination_port": "Long Beach (USLGB)",
        "vessel_name": "CMA CGM Jacques Saadé",
        "vessel_speed_knots": 20.2,
        "in_transit_days": 6,
        "eta": "2026-09-27 14:00 UTC",
        "predicted_eta": "2026-09-27 19:30 UTC",
        "eta_confidence": 85,
        "delay_risk": "Medium",
        "delay_hours": 5.5,
        "co2_saved_pct": 15.8,
        "fuel_burn_tons": 33.2,
        "sensors": {
            "health_pct": 98,
            "temperature_c": 4.2,
            "humidity_pct": 60,
            "last_inspection": "May 15, 2026",
            "reefer_status": "Cold Chain Locked (4°C)",
            "battery_level": 92,
            "shock_events": 0
        },
        "milestones": [
            {"port_code": "CNSZX", "port_name": "Shenzhen", "status": "COMPLETED", "scheduled_arrival": "2026-09-14 06:00", "actual_or_estimated_arrival": "2026-09-14 06:00", "delay_hours": 0.0, "congestion_level": "Low"},
            {"port_code": "USLGB", "port_name": "Long Beach", "status": "CURRENT", "scheduled_arrival": "2026-09-27 08:30", "actual_or_estimated_arrival": "2026-09-27 14:00", "delay_hours": 5.5, "congestion_level": "High"}
        ],
        "route_waypoints": [
            {"name": "Shenzhen Port", "lat": 22.5431, "lng": 114.0579, "passed": True, "timestamp": "2026-09-14 06:00 UTC"},
            {"name": "Luzon Strait", "lat": 20.5000, "lng": 121.5000, "passed": True, "timestamp": "2026-09-16 11:00 UTC"},
            {"name": "Mid Pacific 30N", "lat": 30.0000, "lng": 175.0000, "passed": False, "timestamp": "2026-09-21 00:00 UTC"},
            {"name": "Long Beach Port", "lat": 33.7701, "lng": -118.1937, "passed": False, "timestamp": "2026-09-27 14:00 UTC"}
        ],
        "ai_summary": "Reefer container CMAU9876543 operating under precision cryogenic control (+4.2°C tolerance ±0.5°C). Approaching Long Beach with minor 5.5-hour berth congestion penalty.",
        "disruption_active": None
    }

    # Additional Demo ID: HLCU4567890
    containers["HLCU4567890"] = {
        "id": "HLCU4567890",
        "carrier": "Hapag-Lloyd",
        "type": "20 Ft Standard",
        "cargo": "Industrial Robotics Modules",
        "status": "Customs Hold",
        "location": "Antwerp Terminal",
        "origin_port": "Antwerp (BEANR)",
        "destination_port": "Jebel Ali (AEJEA)",
        "vessel_name": "Madrid Maersk",
        "vessel_speed_knots": 0.0,
        "in_transit_days": 1,
        "eta": "2026-10-04 09:00 UTC",
        "predicted_eta": "2026-10-06 14:00 UTC",
        "eta_confidence": 76,
        "delay_risk": "High",
        "delay_hours": 53.0,
        "co2_saved_pct": 8.0,
        "fuel_burn_tons": 12.0,
        "sensors": {
            "health_pct": 88,
            "temperature_c": 16.0,
            "humidity_pct": 52,
            "last_inspection": "May 20, 2026",
            "reefer_status": "Static Inspection",
            "battery_level": 89,
            "shock_events": 1
        },
        "milestones": [
            {"port_code": "BEANR", "port_name": "Antwerp", "status": "CURRENT", "scheduled_arrival": "2026-09-19 12:00", "actual_or_estimated_arrival": "2026-09-21 17:00", "delay_hours": 53.0, "congestion_level": "High"},
            {"port_code": "AEJEA", "port_name": "Jebel Ali", "status": "PENDING", "scheduled_arrival": "2026-10-04 09:00", "actual_or_estimated_arrival": "2026-10-06 14:00", "delay_hours": 53.0, "congestion_level": "Low"}
        ],
        "route_waypoints": [
            {"name": "Antwerp Quay 1742", "lat": 51.2194, "lng": 4.4025, "passed": True, "timestamp": "2026-09-19 12:00 UTC"},
            {"name": "Gibraltar Strait", "lat": 35.9500, "lng": -5.6000, "passed": False, "timestamp": "2026-09-24 00:00 UTC"},
            {"name": "Jebel Ali Port", "lat": 25.0067, "lng": 55.0620, "passed": False, "timestamp": "2026-10-06 14:00 UTC"}
        ],
        "ai_summary": "Secondary customs compliance inspection triggered at Antwerp Terminal for industrial robotics harmonized tariff codes. Risk elevated to High with +53 hours projected dwell time impact.",
        "disruption_active": "CUSTOMS_DELAY"
    }

    # Generate the remaining 500+ realistic containers
    ports_pool = GLOBAL_PORTS[:25]
    random.seed(42) # Reproducible realistic seed
    
    current_count = len(containers)
    for i in range(current_count, count):
        carrier = random.choice(CARRIERS)
        serial = f"{1000000 + i}"
        container_id = f"{carrier['prefix']}{serial}"
        origin = random.choice(ports_pool)
        dest = random.choice([p for p in ports_pool if p['code'] != origin['code']])
        
        status_opts = ["In Transit", "In Transit", "Active", "At Port", "Delayed"]
        status = random.choice(status_opts)
        
        risk = "Low"
        delay_hrs = round(random.uniform(0.5, 6.0), 1)
        if status == "Delayed" or origin["congestion"] > 80:
            risk = random.choice(["Medium", "High"])
            delay_hrs = round(random.uniform(12.0, 48.0), 1)
        elif random.random() < 0.25:
            risk = "Medium"
            delay_hrs = round(random.uniform(6.5, 14.0), 1)
            
        health = random.randint(85, 99)
        temp = round(random.uniform(18.0, 24.5), 1)
        hum = random.randint(40, 58)
        
        # Approximate great circle intermediate coordinates
        lat1, lng1 = origin["lat"], origin["lng"]
        lat2, lng2 = dest["lat"], dest["lng"]
        mid_lat = (lat1 + lat2) / 2.0 + random.uniform(-3, 3)
        mid_lng = (lng1 + lng2) / 2.0 + random.uniform(-4, 4)

        containers[container_id] = {
            "id": container_id,
            "carrier": carrier["name"],
            "type": random.choice(TYPES),
            "cargo": random.choice(CARGO_TYPES),
            "status": status,
            "location": random.choice(LOCATIONS),
            "origin_port": f"{origin['name']} ({origin['code']})",
            "destination_port": f"{dest['name']} ({dest['code']})",
            "vessel_name": random.choice(VESSELS),
            "vessel_speed_knots": round(random.uniform(16.5, 22.0), 1) if status != "At Port" else 0.0,
            "in_transit_days": random.randint(1, 24),
            "eta": f"2026-10-{random.randint(1, 28):02d} {random.randint(0, 23):02d}:00 UTC",
            "predicted_eta": f"2026-10-{random.randint(2, 29):02d} {random.randint(0, 23):02d}:30 UTC",
            "eta_confidence": random.randint(81, 96),
            "delay_risk": risk,
            "delay_hours": delay_hrs,
            "co2_saved_pct": round(random.uniform(8.0, 22.0), 1),
            "fuel_burn_tons": round(random.uniform(18.0, 45.0), 1),
            "sensors": {
                "health_pct": health,
                "temperature_c": temp,
                "humidity_pct": hum,
                "last_inspection": f"May {random.randint(10, 28)}, 2026",
                "reefer_status": "AI Controlled" if temp < 25 else "Ambient",
                "battery_level": random.randint(86, 99),
                "shock_events": 1 if health < 88 else 0
            },
            "milestones": [
                {"port_code": origin["code"], "port_name": origin["name"], "status": "COMPLETED", "scheduled_arrival": "2026-09-12 08:00", "actual_or_estimated_arrival": "2026-09-12 08:00", "delay_hours": 0.0, "congestion_level": origin["risk"]},
                {"port_code": dest["code"], "port_name": dest["name"], "status": "CURRENT" if status != "At Port" else "COMPLETED", "scheduled_arrival": "2026-10-15 14:00", "actual_or_estimated_arrival": f"2026-10-15 {14 + int(delay_hrs % 10)}:00", "delay_hours": delay_hrs, "congestion_level": dest["risk"]}
            ],
            "route_waypoints": [
                {"name": f"{origin['name']} Terminal", "lat": lat1, "lng": lng1, "passed": True, "timestamp": "2026-09-12 08:00 UTC"},
                {"name": "Maritime Mid-Sector Waypoint", "lat": mid_lat, "lng": mid_lng, "passed": status != "At Port", "timestamp": "2026-09-20 12:00 UTC"},
                {"name": f"{dest['name']} Anchorage", "lat": lat2, "lng": lng2, "passed": False, "timestamp": "2026-10-15 14:00 UTC"}
            ],
            "ai_summary": f"Container {container_id} en route from {origin['name']} to {dest['name']}. Current delay risk evaluated as {risk} with {delay_hrs}h variance against scheduled maritime corridor.",
            "disruption_active": None
        }

    return containers
