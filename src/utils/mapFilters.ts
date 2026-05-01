import type { MapFilters, MapLocation } from "../types/map";

function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function filterLocations(locations: MapLocation[], filters: MapFilters): MapLocation[] {
  const normalizedSearchText = normalizeText(filters.searchText ?? "");

  return locations.filter((location) => {
    const matchesCategory = !filters.category || filters.category === location.category;
    const matchesType = !filters.type || filters.type === location.type;
    const matchesId = !filters.id || filters.id === location.id;
    const matchesLat = filters.lat == null || filters.lat === location.lat;
    const matchesLng = filters.lng == null || filters.lng === location.lng;

    const normalizedCity = normalizeText(location.city);
    const normalizedDescription = normalizeText(location.description ?? "");

    const matchesSearchText =
      normalizedSearchText.length === 0 ||
      normalizedCity.includes(normalizedSearchText) ||
      normalizedDescription.includes(normalizedSearchText);

    return (
      matchesCategory &&
      matchesType &&
      matchesId &&
      matchesLat &&
      matchesLng &&
      matchesSearchText
    );
  });
}