# HUNTER WAVE

A PWA dashboard for the Indonesian crypto/airdrop hunting community. Tracks airdrops, Web3 news, P2P sellers, calendar events, and tools — all curated for the Indonesian market.

## Stack

- **Frontend:** React + Vite + Tailwind CSS v4
- **Language:** TypeScript / JSX
- **Data:** Static JSON files in `artifacts/dropmylink/src/data/`
- **Storage:** IndexedDB (via custom `idbGet`/`idbSet` helpers in `App.jsx`) for offline caching
- **Package manager:** pnpm (workspace monorepo)

## How to Run

```
pnpm install
pnpm --filter @workspace/dropmylink run dev
```

Or use the **Start application** workflow in Replit (runs on port 24929).

## Project Structure

```
artifacts/dropmylink/      # Main frontend app
  src/
    App.jsx                # Main app component (all tabs/pages)
    data/                  # Static JSON data (airdrops, news, tools, etc.)
    lib/data.ts            # Zod-validated data loaders
    pages/                 # Additional page components
docs/                      # UI improvement plans (01–04)
lib/api-client-react/      # Shared API client library
artifacts/api-server/      # Backend API server (Express/TypeScript)
```

## UI Improvement Plans

The `docs/` folder contains 4 planned UI improvements, designed to be applied one at a time:

1. `docs/01-landing-page.md` — Strengthen the Intro tab as a proper landing page
2. `docs/02-bookmark-management.md` — Rename bookmark lists + color legend
3. `docs/03-status-badge-legend.md` — Badge status consistency
4. `docs/04-responsive-desktop.md` — Responsive layout for desktop

## User Preferences

- Keep existing project structure and stack
- Apply docs/ improvement plans one at a time, not all at once
