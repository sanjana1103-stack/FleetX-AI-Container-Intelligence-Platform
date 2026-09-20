# FleetX — AI Container Intelligence Platform

<p align="center">
  <strong>Operational intelligence for containers, ports, vessels, and inland logistics.</strong>
</p>

<p align="center">
  <a href="#quick-start">Quick start</a> ·
  <a href="#capabilities">Capabilities</a> ·
  <a href="#architecture">Architecture</a> ·
  <a href="#api-endpoints">API</a> ·
  <a href="#verification">Verification</a>
</p>

FleetX is a full-stack enterprise logistics dashboard that combines a digital-twin interface, AI-assisted container monitoring, ETA prediction, route optimization, port intelligence, and disruption simulation in one workspace.

> **Status:** Local development build verified with a production frontend build and FastAPI backend health checks.

## Highlights

- **Digital twin container view** with stacked freight-train visualization, twistlock security, reefer power, and shock-sensor hotspots.
- **AI operations panel** for natural-language container queries, assignment actions, recent-container cards, and suggested actions.
- **Interactive maritime map** with routes, milestones, port weather, congestion indicators, ship tracking, and disruption overlays.
- **Disruption simulator** for storms, labor strikes, customs holds, propulsion derating, and fuel-price spikes.
- **ETA and delay-risk intelligence** with confidence, risk levels, variance drivers, and predicted arrival data.
- **Multi-objective routing** comparing fastest, cheapest, and eco-focused options.
- **Operational reporting** with incident dossier PDF generation and telemetry CSV export.
- **Port radar, fleet analytics, and warehouse-yard twin** for broader network visibility.

## Product walkthrough

### 1. Fleet operations workspace

The interface uses a clean white-and-orange enterprise theme:

- soft `#F4F6F8` workspace background;
- white cards with subtle elevation;
- Pantone 021 C-inspired `#FF5C00` action accents;
- rounded navigation pills and an active orange state;
- live UTC maritime status and a guided Demo Tour;
- global AI search with instant suggestions;
- operator context for **Alex Morgan — AI Supervisor**.

### 2. Container digital twin

The primary view models a double-stacked freight train:

- FleetX orange container: `YMLU 890123` / `MSKU 1234567`;
- silver container: `TRHU 559871 2`;
- health, temperature, humidity, and inspection cards;
- container details including equipment type, status, yard, and transit duration;
- an AI route strip showing corridor progress and fuel savings.

### 3. AI agent panel

The right-hand panel supports operational questions such as:

> “Show me all containers that are in transit and the container that is on route.”

It also demonstrates action-oriented workflows, including assigning a container to a freight convoy, simulating a storm, downloading an executive PDF, and comparing eco routes.

### 4. Digital-twin disruption simulation

Use the simulator to test operational resilience without changing the baseline voyage:

| Scenario | Demonstrated impact |
| --- | --- |
| Tropical cyclone | Detour, speed throttling, high delay risk, and `+32.5h` |
| Port labor strike | Destination terminal stoppage and `+48h` dwell |
| Customs hold | Secondary radiation scans and `+20h` |
| Propulsion derating | `6.2 kts` speed cap and `+54h` |
| Fuel price spike | Slow steaming and `+12h` |
| Reset baseline | Restores normal voyage status |

## Architecture

| Layer | Technology | Role |
| --- | --- | --- |
| Frontend | React, TypeScript, Vite, Tailwind CSS | Dashboard, digital twin, maps, analytics, and PDF actions |
| Backend | Python, FastAPI, Uvicorn | REST API, operational simulation, and telemetry |
| Intelligence | scikit-learn, pandas, NumPy | ETA prediction and analytics workflows |
| Visualization | Leaflet | Interactive maps, routes, ports, and disruption overlays |
| Reporting | jsPDF / ReportLab | Executive incident dossiers and operational exports |
| Delivery | Docker, Docker Compose | Reproducible frontend and backend runtime |

## Quick start

### Prerequisites

- Node.js 20 or newer
- Python 3.11 or newer
- npm
- Optional: Docker Desktop

### Run the frontend

```bash
npm install
npm run dev
```

The Vite development server is configured for **http://localhost:3000**.

### Run the backend

Create and activate a virtual environment, then install the Python dependencies:

```bash
python -m venv .venv
# Windows PowerShell
.\.venv\Scripts\Activate.ps1
# macOS/Linux
# source .venv/bin/activate

pip install -r requirements.txt
python main.py
```

The API is available at **http://127.0.0.1:8000** and interactive Swagger documentation is available at **http://127.0.0.1:8000/docs**.

### Build the frontend

```bash
npm run build
npm run preview
```

### Run with Docker

```bash
docker compose up --build
```

If you use Docker Compose, confirm that the Dockerfile paths and application context match the current checkout before deploying to a shared environment.

## API endpoints

| Endpoint | Purpose |
| --- | --- |
| `GET /api/health` | Backend health check |
| `GET /api/container/{container_id}` | Retrieve container telemetry and details |
| `POST /api/simulate-event` | Apply a disruption scenario |
| `POST /api/predict-eta` | Generate ETA and delay-risk predictions |
| `GET /api/export/csv` | Download fleet telemetry as CSV |
| `GET /docs` | OpenAPI / Swagger UI |

Example health check:

```bash
curl http://127.0.0.1:8000/api/health
```

## Verification

The current local verification recorded for FleetX includes:

- backend health endpoint: **200 OK**;
- container lookup for `MSKU1234567`: **200 OK**;
- disruption simulation endpoint: **200 OK**;
- ETA prediction endpoint: **200 OK**;
- `npm run build`: completed without errors;
- frontend development server: **http://localhost:3000**;
- backend development server: **http://127.0.0.1:8000**.

The frontend also includes a resilient initial state and error boundary so the dashboard can render immediately while live FastAPI telemetry is loaded.

## Repository hygiene

Generated and machine-local files are excluded through `.gitignore`, including Node dependencies, build output, logs, local environment files, Python caches, virtual environments, and editor metadata. Keep secrets in environment variables; do not commit credentials or production connection strings.

## License

No license has been declared yet. Add a license before distributing FleetX or accepting external contributions.
