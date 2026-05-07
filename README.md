# Interactive Map

A web-based interactive map built with React, TypeScript, Vite, and Leaflet.

## Overview

This project renders a custom tile-based map and overlays interactive location markers loaded from a local dataset.  
It includes client-side filtering and a repository layer prepared for future API integration.

## Features

- Custom map rendering with local tile assets (`CRS.Simple`)
- Marker popup with location details
- Search-based filtering
- Repository pattern for location data access
- Unit test setup with Vitest

## Tech Stack

- React 19
- TypeScript
- Vite
- Leaflet + React Leaflet
- Vitest + Testing Library
- ESLint

## Requirements

- Node.js `20.19+` or `22.12+`
- `pnpm` (recommended)

## Getting Started

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```
## Available Scripts

```bash
pnpm build          # Type-check and build for production
pnpm preview        # Preview production build locally
pnpm lint           # Run ESLint
pnpm test           # Run tests once
pnpm test:watch     # Run tests in watch mode
pnpm test:coverage  # Run tests with coverage report
pnpm generate:tiles # Generate map tiles from mapa.png
```

## Project Structure

```text
src/
  app/
    MapPage.tsx
  components/
    Map/
      MapView.tsx
  data/
    markers.json
  services/
    locationRepository.ts
    staticLocationRepository.ts
  types/
    map.ts
  utils/
    mapFilters.ts

test/
  matchesFilters.test.ts

public/
  tiles/
```

## Notes

- The map uses local tiles from `public/tiles`.
- Place `mapa.png` in the project root before running `pnpm generate:tiles`.
- Markers are currently loaded from local JSON data in `src/data`.
- Leaflet marker icon setup is handled in `MapView` to avoid common bundler issues.
