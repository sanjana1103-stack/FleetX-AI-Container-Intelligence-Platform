@echo off
title FleetX AI Container Intelligence Platform
echo ========================================================
echo   Starting FleetX AI Container Intelligence Platform
echo ========================================================
echo.

set "PATH=C:\Users\shett\AppData\Local\NodeJS;%PATH%"

echo [1/2] Launching FastAPI Backend on http://127.0.0.1:8000 ...
start "FleetX Backend" cmd /k "python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload"

timeout /t 2 /nobreak >nul

echo [2/2] Launching React Frontend on http://localhost:3000 ...
cd frontend
start "FleetX Frontend" cmd /k "npm run dev"

echo.
echo ========================================================
echo   FleetX Platform is live!
echo   Frontend: http://localhost:3000
echo   Backend:  http://127.0.0.1:8000
echo   API Docs: http://127.0.0.1:8000/docs
echo ========================================================
