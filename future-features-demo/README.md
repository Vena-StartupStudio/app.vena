# Future Features Prototype

A local-only Vena experience prototype that simulates how upcoming community and coaching tools might look inside the product. Built as a self-contained Vite + React + Tailwind workspace—no servers, analytics, or external CDNs.

## Getting started

1. `cd future-features-demo`
2. `npm install`
3. `npm run dev`

Open the printed localhost URL (defaults to `http://127.0.0.1:5173`). Everything runs client-side; there are no network requests once the dependencies are installed.

## Stack & structure

- **Vite + React + TypeScript** for fast iteration.
- **Tailwind CSS** with a custom theme mirroring the marketing palette (gradients, glass panels, generous spacing).
- **Framer Motion** for scroll reveals that respect `prefers-reduced-motion`.
- Hard-coded mock data lives in `src/data/content.ts` so the demo stays deterministic and offline.
- UI shell & sections sit in `src/components` and `src/sections`, organised by feature area (Members’ Lounge, Weekly Picks, Challenges, Milestones, AMA, Spotlight Stories, Recognition, Task Inbox, Template Gallery).

Fonts rely on system-safe stacks (`Inter`, `Segoe UI`, `system-ui`); no webfont downloads occur.

## What you can demo

- Toggle between **Coach workspace** and **Client experience** using the persona switch in the header.
- Scroll through live-styled mock screens: lounge feed, weekly picks, inclusive challenges, milestone planner, AMA queue, spotlight stories, recognition badges, coach task inbox, and template gallery.
- Hover micro-interactions and glass surface treatments echo the existing marketing visuals while presenting an in-product feel.

## Accessibility & motion

- Scroll reveals short-circuit when `prefers-reduced-motion` is set.
- Interactive elements include aria labels, focusable buttons, and clear contrast against the dark surface theme.

## No external dependencies

- All assets sit inside this folder (see `assets/glow.svg`).
- There are **no** runtime API calls, telemetry, analytics, or third-party fonts.
- Delete the directory to remove the demo—no shared state with the main codebase.
