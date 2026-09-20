# FleetX — AI Container Intelligence Platform

<p align="center">
  <strong>Operational intelligence for containers, ports, vessels, and inland logistics.</strong>
</p>

## Deploy to Vercel

This repository is configured for a Vite frontend plus a FastAPI serverless API:

- `vercel.json` builds the frontend with `npm run build` and serves `dist`.
- `api/index.py` exposes the FastAPI `app` as a Vercel Python function.
- Requests to `/api/*` are routed to the FastAPI function.

### Vercel dashboard

1. Open [Vercel](https://vercel.com/new) and import `sanjana1103-stack/FleetX-AI-Container-Intelligence-Platform`.
2. Keep the project root at the repository root.
3. Use **Other** (or let Vercel detect the Vite project).
4. Confirm:
   - Build command: `npm run build`
   - Output directory: `dist`
   - Install command: `npm install`
5. Click **Deploy**.

The frontend will be available at the generated Vercel URL. The API will be available under the same domain, for example:

- `https://<deployment>.vercel.app/api/health`
- `https://<deployment>.vercel.app/docs`

### Important backend note

Vercel runs the FastAPI backend as serverless functions; it does not run Docker Compose or a continuously running Uvicorn process. The Python dependencies in `requirements.txt` are installed during deployment. For large ML dependencies or long-running workloads, deploy the backend separately on a container platform and set the frontend API base URL to that service.

### Local development

```bash
npm install
npm run dev
```

Run the API separately when developing locally:

```bash
python -m uvicorn main:app --reload --port 8000
```

The Dockerfiles and Docker Compose setup remain available for local or container-based deployments.
