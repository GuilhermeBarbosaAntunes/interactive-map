# Mapa Interativo

Interactive map web application built with React, Vite, and Leaflet.

## Requirements

- Node.js `20.19+` or `22.12+`
- `pnpm` (recommended package manager)

## Quick Start

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

After starting the server, open the local URL shown in the terminal (usually `http://localhost:5173`).

## Available Scripts

```bash
pnpm dev       # Run development server
pnpm build     # Type-check and build production assets
pnpm preview   # Preview production build locally
pnpm lint      # Run ESLint
```

## Project Structure

```text
src/
  components/
    Map/
      MapView.tsx
  data/
public/
  tiles/
```

## Notes

- The map uses local tiles from `public/tiles`.
- Markers are currently loaded from local JSON data in `src/data`.
- Leaflet marker icon setup is handled in `MapView` to avoid common bundler issues.
