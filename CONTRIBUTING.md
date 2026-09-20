# Contributing to FleetX AI Container Intelligence Platform

Thank you for your interest in contributing to FleetX! FleetX is an open-source enterprise maritime intelligence platform designed to showcase production-grade supply chain intelligence, ML-powered ETA forecasting, and real-time digital twin simulations.

## Code of Conduct

Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md) in all community interactions.

## Development Setup

### Prerequisites
- Python 3.10+
- Node.js 18+ (or portable Node.js runtime)
- Git

### Quickstart

1. **Clone the Repository**
   ```bash
   git clone https://github.com/sanjana1103-stack/FleetX-AI-Container-Intelligence-Platform.git
   cd FleetX-AI-Container-Intelligence-Platform
   ```

2. **Backend Setup**
   ```bash
   pip install -r requirements.txt
   cd backend
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Verify Build**
   ```bash
   npm run build
   ```

## Contribution Guidelines

- **UI Integrity**: Do not alter the master enterprise white/orange aesthetic, layout, card dimensions, or typography without prior design review.
- **Type Safety**: Strictly avoid `any` in TypeScript components where interfaces are already modeled in `src/types.ts`.
- **Modularity**: Place reusable widgets in `frontend/src/components/`. Keep business logic in `backend/services/` or `frontend/src/services/`.
- **Commit Messages**: Follow standard semantic commits (e.g. `feat: ...`, `fix: ...`, `docs: ...`).
