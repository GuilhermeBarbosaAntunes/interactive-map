import L from "leaflet";

interface SimpleCrsWithExplicitZoom {
  unproject(point: L.PointExpression, zoom: number): L.LatLng;
  project(latLng: L.LatLngExpression, zoom: number): L.Point;
}

const simpleCrs = L.CRS.Simple as unknown as SimpleCrsWithExplicitZoom;

export function pixelToLatLng(
  x: number,
  y: number,
  maxZoom: number,
): L.LatLng {
  return simpleCrs.unproject(L.point(x, y), maxZoom);
}

export function latLngToPixel(
  latLng: L.LatLng,
  maxZoom: number,
): L.Point {
  return simpleCrs.project(latLng, maxZoom);
}
