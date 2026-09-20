import os

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.api.routes import router

app = FastAPI(
    title="FleetX - AI Container Intelligence Platform API",
    description="Enterprise Logistics Intelligence & Digital Twin Simulation Backend",
    version="2.0.0",
)

# Keep local development working while allowing the deployed Vercel origin to be
# configured safely in Render with a comma-separated CORS_ORIGINS value.
_default_origins = "http://localhost:3000,http://127.0.0.1:3000"
_allowed_origins = [
    origin.strip()
    for origin in os.getenv("CORS_ORIGINS", _default_origins).split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=_allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)


@app.get("/")
def root():
    return {
        "platform": "FleetX AI Container Intelligence Platform",
        "status": "Operational",
        "api_docs": "/docs",
        "version": "2.0.0",
    }


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
