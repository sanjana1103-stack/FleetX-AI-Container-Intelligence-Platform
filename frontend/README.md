# FleetX frontend

This directory is the canonical localhost React/Vite application. It contains the original white/orange enterprise FleetX dashboard.

## Features

The frontend includes the freight train and stacked containers, floating KPI cards, AI Agent, interactive Leaflet world map, ETA prediction, route optimization, disruption simulations, Port Radar, Warehouse Twin, Analytics, Digital Twin simulation, Incident Center, Demo Tour, and PDF export.

## Local quick start

```bash
npm install
npm run build
npm run dev
```

The dashboard runs at `http://localhost:3000` and uses the FastAPI backend at `http://127.0.0.1:8000`.

## Walkthrough

Open the dashboard to inspect the live container train, ask the AI Agent about shipments, open the map to follow the maritime route, run a disruption scenario, compare routes, inspect ports and warehouse zones, and review analytics.

## Verification checklist

- Build succeeds with `npm run build`.
- Development server uses port 3000.
- White/orange FleetX dashboard renders without a blank screen.
- Train visualization and stacked containers render.
- AI Agent and Leaflet map render.
- Storm, port strike, customs, and fuel simulations remain available.
- Route optimization, ETA prediction, Port Radar, Analytics, and Warehouse Twin remain available.
