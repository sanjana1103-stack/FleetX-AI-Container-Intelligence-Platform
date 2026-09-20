# FleetX — AI Container Intelligence Platform

FleetX is a localhost-first enterprise logistics intelligence platform for monitoring containers, analyzing routes, simulating disruptions, and operating intermodal facilities.

## Architecture overview

- **Frontend:** React, TypeScript, Vite, Tailwind CSS, Leaflet, and the original white/orange FleetX dashboard in `frontend/`
- **Backend:** FastAPI service in `backend/`
- **Local data safety:** `frontend/src/data/initialData.ts` keeps the interface usable while backend data is unavailable
- **API client:** `frontend/src/services/api.ts` uses `http://127.0.0.1:8000/api`

## Features

- White enterprise dashboard with FleetX orange branding
- Left rounded sidebar and top navigation
- Alex Morgan operator profile and AI search
- 2-Min Demo Tour
- Double-stacked freight containers on a train
- Floating KPI and sensor telemetry cards
- AI Agent operational assistant
- Interactive Leaflet world map with route and port telemetry
- ETA prediction, confidence, and delay-risk analysis
- Route optimization
- Storm, port strike, customs delay, vessel breakdown, and fuel spike simulations
- Port Radar
- Warehouse Twin with yard telemetry
- Digital Twin disruption console
- Analytics charts and CSV export
- Incident Center
- PDF incident dossier export
- Command palette, settings, toast notifications, and ErrorBoundary recovery

## Walkthrough

1. Start the FastAPI backend and open the FleetX dashboard.
2. Review the train-mounted stacked container and floating telemetry cards.
3. Use the AI Agent to search containers, trigger actions, compare routes, or export a report.
4. Open the world map to inspect the vessel route, port congestion, and weather overlays.
5. Use the Digital Twin controls to simulate a storm, port strike, customs hold, or fuel spike.
6. Review the ETA card, risk explanation, and AI operational narrative.
7. Open Route Optimization, Port Radar, Warehouse Twin, and Analytics from the sidebar.
8. Run the Demo Tour to exercise the primary workflow end to end.

## Local quick start

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

## Local URLs

| Service | URL |
| --- | --- |
| FleetX Dashboard | http://localhost:3000 |
| FastAPI Backend | http://127.0.0.1:8000 |
| Swagger Docs | http://127.0.0.1:8000/docs |
| Health Check | http://127.0.0.1:8000/api/health |

## Verification

- Dataset includes 520 containers and 104 ports.
- `cd frontend && npm install` completes successfully.
- `cd frontend && npm run build` completes successfully.
- `cd frontend && npm run dev` serves the dashboard on port 3000.
- The train visualization, stacked containers, KPI cards, and AI Agent render.
- The Leaflet map loads with the local Leaflet CSS import.
- All disruption simulations remain interactive.
- ETA prediction, route optimization, Port Radar, Analytics, and Warehouse Twin render.
- `Promise.allSettled`, `initialData.ts`, `import type`, `isolatedModules`, `verbatimModuleSyntax: false`, and ErrorBoundary blank-screen protections remain enabled.
