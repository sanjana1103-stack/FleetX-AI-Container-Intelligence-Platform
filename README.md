# FleetX — AI Container Intelligence Platform

FleetX is a React/Vite logistics dashboard backed by a FastAPI API for container monitoring, ETA prediction, route intelligence, disruption simulation, and operational reporting.

## Production deployment

The production architecture uses two independently deployed services:

- **Frontend:** React + Vite on Vercel
- **Backend:** FastAPI on Render

The repository does not contain `frontend/` or `backend/` subdirectories in the current checkout. The Vite app is rooted at the repository root, and the FastAPI application entry point is `main:app`.

### Deploy the backend to Render

1. Create a new **Web Service** in [Render](https://render.com/) and connect this repository.
2. Use the repository root as the service root.
3. Configure:
   - Runtime: **Python 3**
   - Build command: `pip install -r requirements.txt`
   - Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - Health check path: `/api/health`
4. Add the environment variable `CORS_ORIGINS` with the Vercel URL, for example:

   ```text
   https://fleetx.vercel.app
   ```

   Multiple origins may be comma-separated. Keep `http://localhost:3000` only if local development from that origin is still required.

The included `render.yaml` can be used with Render Blueprint deployment. Render will provide a URL such as `https://fleetx-api.onrender.com`.

### Deploy the frontend to Vercel

1. Import this repository into [Vercel](https://vercel.com/new).
2. Keep the project root at the repository root.
3. Use these settings:
   - Framework preset: **Vite**
   - Install command: `npm install`
   - Build command: `npm run build`
   - Output directory: `dist`
4. Add the environment variable below in Vercel for **Production**, **Preview**, and **Development** as appropriate:

   ```text
   VITE_API_URL=https://fleetx-api.onrender.com
   ```

5. Deploy and copy the resulting Vercel URL into Render's `CORS_ORIGINS` variable, then redeploy the backend.

`vercel.json` contains the Vite framework, build, install, and output settings. Docker Compose is retained for local/container deployments and is not used by Vercel or Render.

## Environment variables

### Frontend

| Variable | Required | Description |
| --- | --- | --- |
| `VITE_API_URL` | Yes in production | Base URL of the deployed FastAPI service, without a trailing slash. |

Copy `.env.example` to `.env.local` for local development and set `VITE_API_URL=http://127.0.0.1:8000`.

### Backend

| Variable | Required | Description |
| --- | --- | --- |
| `CORS_ORIGINS` | Yes in production | Comma-separated allowed browser origins, including the Vercel production URL. |
| `PORT` | Managed by Render | Render supplies the port through `$PORT`. |

## Production URLs

After deployment, fill in the actual URLs here:

- Frontend: `https://<your-vercel-project>.vercel.app`
- Backend API: `https://<your-render-service>.onrender.com`
- API health: `https://<your-render-service>.onrender.com/api/health`
- API docs: `https://<your-render-service>.onrender.com/docs`

## Local development

Install frontend dependencies and start Vite:

```bash
npm install
npm run dev
```

Run the API in a separate terminal:

```bash
python -m venv .venv
# Windows PowerShell: .\.venv\Scripts\Activate.ps1
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

The frontend is available at `http://localhost:3000`; the API is available at `http://127.0.0.1:8000`.

## API endpoints

- `GET /api/health` — backend health check
- `GET /api/container/{container_id}` — container telemetry and details
- `POST /api/simulate-event` — apply a disruption scenario
- `POST /api/predict-eta` — generate ETA and delay-risk predictions
- `GET /api/export/csv` — download fleet telemetry as CSV
- `GET /docs` — OpenAPI documentation
