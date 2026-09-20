# FleetX — AI Container Intelligence Platform

<p align="center">
  <img src="https://images.openai.com/static-rsc-4/YF9y9zq6tHSMk29EXFOL-etpSpIjpUhDpmZVbJEZDAiqlPtXVyt3hesvaXe5vC8K-Ks20VrMiyxAdtmWctCZXLt756nVeXwO5oOE5fiOdEOy5wCPqe_HtgkCwudtQc56kOFB01F-yQMhgkK8dm-zpi6vU-ovwJ8FzQi-xAMt_aU?purpose=inline" alt="Maersk logo" width="420" />
</p>

FleetX is a localhost-first logistics intelligence platform for monitoring container movements, analyzing routes, simulating disruptions, and operating intermodal facilities from a single dashboard.

It combines a React and TypeScript operations console with a FastAPI backend, interactive geospatial views, predictive ETA and delay-risk workflows, and digital-twin simulations for disruption planning.

<p align="center">
  <img src="https://images.openai.com/static-rsc-4/iSEkwB41S9ifSMu_tc655KmPw7wDwUtRE1b_FQNfVJT0x5FGDNnq2SVmBIDC7k4ak7Bq1_dULUhGyDeaj5dRTamq28ctI3MMGfT8LwqdJzPmMb1H4wbOVhGRrMXs5j33mtke5XczR8hure1yRBoNZGe9LX-RlkfC0WrEJevo0c5VdrGTruBziyNdH-MWo13G?purpose=fullsize" alt="Container port and intermodal logistics operations" width="100%" />
</p>

## What FleetX provides

- **Shipment visibility:** monitor containers, routes, ports, vessel movements, and operational status.
- **Predictive intelligence:** review ETA predictions, confidence levels, delay risk, and AI-generated operational context.
- **Scenario planning:** simulate storms, port strikes, customs holds, vessel breakdowns, and fuel-price spikes.
- **Intermodal operations:** inspect Port Radar data and Warehouse Twin yard telemetry.
- **Decision support:** compare routes, optimize routing, and export analytics or incident reports.
- **Operator experience:** use the AI Agent, command palette, demo tour, settings, notifications, and recovery states.

## Architecture

```text
┌─────────────────────────────┐      HTTP / JSON      ┌─────────────────────────────┐
│ React + TypeScript + Vite   │ ────────────────────▶ │ FastAPI + Python            │
│ frontend/                   │ ◀──────────────────── │ backend/                    │
│                             │                       │                             │
│ Leaflet map, dashboard,     │                       │ Operational APIs, analytics,│
│ simulations, charts, export│                       │ predictions, and scenarios  │
└─────────────────────────────┘                       └─────────────────────────────┘
```

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Leaflet, Lucide, and jsPDF.
- **Backend:** FastAPI with Uvicorn, Pydantic, pandas, NumPy, scikit-learn, and ReportLab.
- **API client:** `frontend/src/services/api.ts` targets `http://127.0.0.1:8000/api` by default.
- **Local fallback:** `frontend/src/data/initialData.ts` keeps the dashboard usable when the API is unavailable.

## End-to-end logistics workflow

The platform supports the complete movement of goods from production through port and intermodal facilities to warehouses, distribution centers, and consumers.

<p align="center">
  <img src="https://images.openai.com/static-rsc-4/GjZDXZVPalFvH7yTYnvhnWFsbrChnk3SWL2-N1klrJq7UPXrmUl7nd1Ix4zDqZxyg7bQZlRTHWVI4-RwbQoojrXsobJ_8ziqm0MxPZ3f4jZVEzs2Dx2dHR-px94fL3RDXvnhfjmj1tYfMv_UUf9Di0SXQqaBZU5WTb1thoCIUF8?purpose=inline" alt="Example pathway for goods moving from production to consumers" width="780" />
</p>

## Prerequisites

- Node.js 18+ and npm
- Python 3.10+
- Git

## Quick start

Clone the repository and install the backend and frontend dependencies:

```bash
git clone https://github.com/sanjana1103-stack/FleetX-AI-Container-Intelligence-Platform.git
cd FleetX-AI-Container-Intelligence-Platform

python -m venv .venv
# macOS/Linux
source .venv/bin/activate
# Windows PowerShell
# .venv\\Scripts\\Activate.ps1

pip install -r requirements.txt
cd frontend
npm install
cd ..
```

### Start the backend

From the repository root:

```bash
uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```

### Start the frontend

In a second terminal, from the repository root:

```bash
cd frontend
npm run dev
```

Open **http://localhost:3000** to use the FleetX dashboard.

## Service URLs

| Service | URL |
| --- | --- |
| FleetX dashboard | [http://localhost:3000](http://localhost:3000) |
| FastAPI root | [http://127.0.0.1:8000](http://127.0.0.1:8000) |
| Swagger UI | [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs) |
| ReDoc | [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc) |
| Health check | [http://127.0.0.1:8000/api/health](http://127.0.0.1:8000/api/health) |

## Using the dashboard

1. Open the dashboard and review the live train visualization, stacked containers, KPIs, and sensor telemetry.
2. Ask the **AI Agent** to search shipments, compare routes, trigger actions, or prepare a report.
3. Open the **world map** to inspect routes, port congestion, weather overlays, and vessel telemetry.
4. Use the **Digital Twin** to run a disruption scenario such as a storm, port strike, customs delay, or fuel spike.
5. Review the resulting ETA, confidence score, risk explanation, and operational narrative.
6. Explore **Route Optimization**, **Port Radar**, **Warehouse Twin**, **Analytics**, and **Incident Center** from the sidebar.
7. Run the **2-Min Demo Tour** for a guided end-to-end workflow.

## Development commands

### Frontend

```bash
cd frontend
npm run dev      # Start the Vite development server on port 3000
npm run build    # Create a production build
npm run preview  # Preview the production build locally
```

### Backend

```bash
uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```

## Project structure

```text
.
├── backend/
│   ├── api/                 # FastAPI routes
│   ├── data/                # Backend datasets and operational data
│   └── main.py              # FastAPI application entry point
├── frontend/
│   ├── src/
│   │   ├── components/      # Dashboard and reusable UI components
│   │   ├── data/            # Local fallback and demo data
│   │   ├── services/        # API client and frontend services
│   │   └── ...
│   ├── package.json
│   └── vite.config.*
├── requirements.txt
└── README.md
```

## Verification checklist

- Install frontend dependencies with `cd frontend && npm install`.
- Build the frontend with `cd frontend && npm run build`.
- Start both services and confirm the dashboard loads on port 3000.
- Confirm the API responds at `/api/health` and the interactive Leaflet map renders.
- Exercise at least one disruption simulation and verify ETA and risk results update.
- Confirm Route Optimization, Port Radar, Warehouse Twin, Analytics, and Incident Center are accessible.

## Notes

- The application is configured for local development and uses permissive CORS settings in the FastAPI app. Review these settings before deploying to a shared or production environment.
- The frontend includes local fallback data so core screens can render when the backend is temporarily unavailable.
- Do not commit secrets, credentials, generated reports, or local environment files.

## License

No license has been declared for this repository yet. Add a `LICENSE` file before distributing or reusing FleetX outside the repository.
