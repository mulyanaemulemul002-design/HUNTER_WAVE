# HUNTER WAVE — Airdrop Tracker PWA

A Progressive Web App dashboard for crypto airdrop hunters, built for the Indonesian community.

## Stack

- **Frontend**: React 18 + Vite + Tailwind CSS v4 (`artifacts/dropmylink`)
- **Backend**: Express 5 + TypeScript (`artifacts/api-server`)
- **Monorepo**: pnpm workspaces

## Running the app

The frontend dev server starts automatically via the **Start application** workflow:

```
PORT=24929 pnpm --filter @workspace/dropmylink run dev
```

Visit the preview pane to see the app at `/`.

To start the API server separately:
```
pnpm --filter @workspace/api-server run dev
```

## Project structure

```
artifacts/
  dropmylink/     # React frontend (main PWA)
  api-server/     # Express API backend
lib/
  api-client-react/  # Shared API client library
docs/             # UI/UX improvement plans (4 tasks, apply one at a time)
```

## UI/UX improvement plans

The `docs/` folder contains a 4-part plan to improve the UI/UX:

1. `01-landing-page.md` — Strengthen the Intro tab as a proper landing page
2. `02-bookmark-management.md` — Rename bookmark list + color legend
3. `03-status-badge-legend.md` — Badge status consistency
4. `04-responsive-desktop.md` — Responsive layout for non-mobile screens

Apply them one at a time as prompts to the agent.

## User preferences

- Keep existing project structure — do not restructure or migrate
- Apply UI/UX docs one file at a time (not all at once)
