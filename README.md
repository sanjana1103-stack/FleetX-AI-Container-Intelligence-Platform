# FleetX | AI Container Intelligence Platform

> **Enterprise Multi-modal Logistics Intelligence, Digital Twin Disruption Simulator, & Predictive ETA Platform.**

Designed to match the high-end **FleetX White & Orange Enterprise UI**, this platform gives global shipping carriers, intermodal rail freight operators, and supply chain executives comprehensive real-time situational awareness.

---

## Key Capabilities

### 1. Multi-Modal Container Visual & Digital Twin
- **Double-Stacked Freight Train Visualization**: Isometric freight rail chassis with stacked containers (bottom vivid orange `#YMLU 890123` / `#MSKU 1234567` container + top silver corrugated container).
- **Floating Telemetry Sensors**: Live streams for **Container Health (92%)**, **Temperature (22°C AI Controlled)**, **Humidity (48%)**, and **Last Inspection (May 18, 2026)**.
- **Interactive Hotspots**: Structural twistlock status, reefer power circuit (440V), shock event sensors (&lt;0.2G), and cargo manifest verification.
- **Dynamic Angle & Zoom**: 3D view toggle, isometric view rotation, and zoom controls.

### 2. Interactive Ocean Navigation Map (Leaflet)
- Great-circle maritime routes with solid emerald voyage completed trails and dashed orange future trajectories.
- Moving vessel icon (`Emma Maersk`) with animated radar glow and live speed telemetry.
- 100+ clickable international container ports displaying live berth congestion %, average waiting hours, weather, and berth utilization.
- Interactive milestone progress timeline: Shanghai → Singapore → Jebel Ali → Rotterdam.

### 3. Digital Twin Disruption Simulator ("The WOW Feature")
One-click disruption buttons triggering instant real-time mutations:
- **Tropical Cyclone (Storm)**: Injects rotating cyclone polygon into the Indian Ocean; recalculates a southern detour around high waves (7.2m); throttles vessel speed to 12.8 knots; raises delay risk to **High (Red)**; adds +32.5 hours.
- **Port Labor Strike**: Simulates terminal crane walkouts (+48h dwell time).
- **Customs Hold**: Triggers secondary radiation scans and tariff audits (+20h).
- **Propulsion Derating**: Simulates turbocharger failure; drops speed to 6.2 kts (+54h).
- **Fuel Price Spike**: +38% bunker surcharge deploys automated slow steaming (+12h).
- **Reset to Baseline**: Restores normal operating state in 1 click.

### 4. Machine Learning ETA Prediction Engine
- **XGBoost / Regression Pipeline**: Takes nautical distance, berth congestion %, sea swell severity, and vessel speed.
- **Confidence Gauge**: Radial gauge displaying statistical confidence (87%).
- **Feature Attribution Breakdown**: Displays exact hours added or saved by each operational factor.

### 5. Multi-Objective Route Optimization
- **Fastest Route**: Direct Suez Canal transit (21.5 kts, saves 4.2 days).
- **Cheapest Route**: Toll avoidance profile (17.8 kts, saves $44,100 in tariffs).
- **Eco Route**: Slow steaming trajectory (15.2 kts, saves 41% CO₂ / -128.2 MT and $56,300 in fuel).

### 6. Embedded AI Conversational Agent
- Interactive right-hand panel matching the reference image.
- Embedded `AI Recent Containers` widget showing multi-modal container cards.
- Supports commands: *"Show me all containers in transit"*, *"Put one container onto the train for me"*, *"Simulate storm"*, and *"Export PDF"*.

### 7. Global Port Radar & Analytics Dashboard
- 100+ international ports ranked by berth congestion and queue dwell times.
- Monthly dispatch volumes and root cause delay breakdown charts.
- 1-Click CSV telemetry export.

### 8. Intermodal Yard 2D Digital Twin
- Interactive container storage blocks (High Cube, Hazmat, Cold-Chain Reefer, Railhead).
- Moving AGVs (Autonomous Guided Vehicles) and overhead crane gantries.

### 9. Executive PDF Incident Dossier Export
- Generates professional Level-2 Operational Disruption Incident Reports via `jsPDF` for executive leadership.

---

## 2-Minute Interview Demo Flow

1. **Authentication**: Verify `Alex Morgan - AI Supervisor` role in top right.
2. **Container Search**: Search `MSKU1234567` (or `YMLU890123`).
3. **Inspect Visual**: Examine the 3D double-stacked freight train, container details, and 4 floating sensor cards.
4. **Ocean Map**: Click the **Ocean Map & Tracking** icon on the left sidebar to view the ship navigating between Singapore and Dubai.
5. **Observe ETA**: View predicted ETA (October 12) with 87% ML confidence and Medium delay risk.
6. **Trigger Storm**: Click **Simulate Storm** in the Disruption bar -> watch the map immediately draw a red cyclone polygon, recalculate a southern detour, switch risk gauge to **High (Red)**, and increase ETA by +32.5h.
7. **AI Reasoning**: Review the regenerated AI operational narrative explaining the diversion.
8. **Export Dossier**: Click **Export PDF** to generate the executive incident report.

---

## Quickstart (Run Locally)

### Prerequisites
- Python 3.10+
- Node.js 18+

### 1. Start the FastAPI Backend
```bash
# In project root
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```
API runs on: **http://127.0.0.1:8000**  
Interactive Swagger Docs: **http://127.0.0.1:8000/docs**

### 2. Start the React Frontend
```bash
cd frontend
npm run dev
```
Frontend runs on: **http://localhost:3000**

---

## Docker Deployment
```bash
docker-compose up --build
```
- Frontend: http://localhost:3000
- Backend: http://localhost:8000
