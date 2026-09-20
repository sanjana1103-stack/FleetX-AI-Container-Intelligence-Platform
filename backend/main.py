import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.api.routes import router

app = FastAPI(
    title="FleetX - AI Container Intelligence Platform API",
    description="Enterprise Logistics Intelligence & Digital Twin Simulation Backend",
    version="2.0.0"
)

# Enable CORS for all origins in development and production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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
        "version": "2.0.0"
    }

if __name__ == "__main__":
    uvicorn.run("backend.main:app", host="127.0.0.1", port=8000, reload=True)
