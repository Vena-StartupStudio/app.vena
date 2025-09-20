# Future Features Prototype

A local-only Vena experience prototype that simulates how upcoming community and coaching tools might look inside the product. Built as a self-contained Vite + React + Tailwind workspace—no servers, analytics, or external CDNs.

## Getting started

1. `cd future-features-demo`
2. `npm install`
3. `npm run dev`

Open the printed localhost URL (defaults to `http://127.0.0.1:5173`). Everything runs client-side; there are no network requests once the dependencies are installed.

## Stack & structure

- **Vite + React + TypeScript** for fast iteration.
- **Tailwind CSS** with a light marketing palette (white canvas, purple/indigo accents) so the demo mirrors vena.software.
- **Framer Motion** for gentle tab reveals that respect `prefers-reduced-motion`.
- Mock data lives in `src/data/content.ts`, keeping the experience deterministic and offline.
- UI shell & feature views sit in `src/components` and `src/sections`; each feature is rendered on its own tab for easy demo pacing.

Fonts rely on system-safe stacks (`Inter`, `Segoe UI`, `system-ui`); no webfont downloads occur.

## What you can demo

- Toggle between **Coach workspace** and **Client experience** using the persona switch in the header.
- Step through feature tabs (Members' Lounge, Weekly Picks, Challenges, Milestones, AMA, Spotlight Stories, Recognition, Task Inbox, Template Gallery) to show focused screens without scrolling.
- Share the calm, expo-ready layout: bright cards, bold section headings, and concise copy tuned for large displays.

## Accessibility & motion

- Reveal animations short-circuit when `prefers-reduced-motion` is set.
- Components use high-contrast text on a light background, keyboard-focusable controls, and aria labels where needed.

## No external dependencies

- All assets sit inside this folder (see `assets/glow.svg`).
- There are **no** runtime API calls, telemetry, analytics, or third-party fonts.
- Delete the directory to remove the demo—no shared state with the main codebase.
