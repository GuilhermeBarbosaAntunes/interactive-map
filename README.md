# Interactive Map

This project uses a non-geographic map model based on a large source image (`mapa.png`)
that is split into raster tiles and rendered by Leaflet with `L.CRS.Simple`.

- No real latitude/longitude is used.
- No Web Mercator is used.
- Marker coordinates are pixel-based (`x/y`) from the original source image.

### Tile output format

- `public/tiles/{z}/{x}_{y}.webp`
- `public/tiles/metadata.json`

### Commands

```bash
pnpm generate:tiles
pnpm dev
pnpm build
```

### Generate tiles

`pnpm generate:tiles` reads `mapa.png` from the project root and generates:

- multi-zoom WebP tiles in `public/tiles`
- map metadata in `public/tiles/metadata.json`

### Add markers

1. Open `mapa.png` in an image editor.
2. Read the `x/y` pixel coordinates for your point.
3. Edit `src/data/mapLocations.ts`.
4. Add the marker with `x/y` from the original image.
5. Run `pnpm dev`.

Example:

```ts
{
  id: "example-location",
  name: "Local de Exemplo",
  category: "landmark",
  x: 2300,
  y: 3300
}
```
