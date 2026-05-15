# 🌸 Orchid Agent — Agentic M2M Commerce

An autonomous AI agent that buys and sells inventory using the **x402 Open Payment Protocol** on **Stellar**, with zero human intervention.

## Architecture

```
orchid-agent/
├── backend/          # Node.js Agent Core + x402 middleware
├── contracts/        # Rust/Soroban smart contracts (Stellar)
│   └── escrow/       # EscrowContract with daily spending limits
├── frontend/         # React dashboard (agent activity monitor)
├── mobile/           # Flutter "Agent Watcher" app (FCM push notifications)
├── config/           # Shared network config (Stellar testnet/mainnet)
├── docker-compose.yml
└── .github/workflows/ci.yml
```

## Components

| Component | Stack | Purpose |
|-----------|-------|---------|
| Agent Core | Node.js / Express | Autonomous worker, x402 payment flow |
| x402 Middleware | HTTP 402 + Stellar USDC | Zero-auth buying in ~5 seconds |
| Escrow Contract | Rust / Soroban (Stellar) | Enforces daily USDC spending limits |
| Dashboard | React | Real-time agent activity view |
| Watcher App | Flutter + FCM | Push notifications on every trade |

## Quick Start

```bash
# Backend
cd backend && npm install && npm start

# Frontend
cd frontend && npm install && npm start

# Smart contracts (requires Rust + soroban-cli)
cd contracts/escrow && cargo test

# All services
docker-compose up --build
```

## Tests

```bash
npm run test:backend    # Jest — 7 tests
npm run test:frontend   # React Testing Library
npm run test:contracts  # cargo test (Soroban)
cd mobile && flutter test
```

## CI/CD

GitHub Actions runs 5 jobs on every push: `backend`, `frontend`, `contracts`, `mobile`, `docker`.

## Environment

Copy `backend/.env.example` to `backend/.env` and fill in:
- `AGENT_PUBLIC_KEY` — Stellar public key for the agent
- `FCM_SERVER_KEY` — Firebase Cloud Messaging key
- `STELLAR_HORIZON_URL` — defaults to testnet
