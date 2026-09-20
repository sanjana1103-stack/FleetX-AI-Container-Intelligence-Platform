# FleetX — AI Container Intelligence Platform

Enterprise-grade logistics intelligence platform inspired by modern shipping operations. The working application is the white/orange localhost dashboard in `frontend/`; deployment configuration is intentionally out of scope.

## Features

- Double-stacked freight train container visualization with live telemetry cards
- AI Agent assistant with container search, operational actions, and export workflows
- Interactive Leaflet world map with maritime routes, vessel tracking, port markers, and storm overlays
- ETA prediction with confidence and delay-risk analysis
- Digital Twin disruption simulation for tropical storms, port strikes, customs delays, propulsion derating, and fuel spikes
- Route optimization for fastest, cheapest, and eco routes
- Global Port Radar with congestion and berth telemetry
- Warehouse Twin with interactive yard zones, AGV/crane visualization, and capacity telemetry
- Analytics charts, KPI summaries, and CSV export
- Demo tour, command palette, incident center, settings, toast notifications, and PDF incident dossier export
- ErrorBoundary and local `initialData.ts` fallbacks to prevent blank screens when the API is unavailable

## Screenshots

Screenshots can be added here when available.

## Local Quick Start

### Backend

```bash
cd backend
pip install -r ../requirements.txt
uvicorn main:app --host 127.0.0.1 --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run build
npm run dev
```

The frontend uses port 3000 and the backend uses `127.0.0.1:8000`.

## Local URLs

| Service | URL |
| --- | --- |
| FleetX Dashboard | http://localhost:3000 |
| FastAPI | http://127.0.0.1:8000 |
| Swagger | http://127.0.0.1:8000/docs |
| Health | http://127.0.0.1:8000/api/health |

## Verification

- Fleet dataset: 520 containers
- Port dataset: 104 ports
- Frontend build: `npm run build`
- Frontend development server: `npm run dev`
- Local fallback data prevents a blank screen when the backend is stopped

The frontend source of truth is `frontend/src`. Keep the localhost API base URL in `frontend/src/services/api.ts` and do not replace the application with a simplified landing page.
