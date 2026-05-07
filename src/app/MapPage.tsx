import { useEffect, useMemo, useState } from "react";
import MapView from "../components/Map/MapView";
import { mapLocations } from "../data/mapLocations";
import type { MapFilters, MapLocation } from "../types/map";
import { StaticLocationRepository } from "../services/staticLocationRepository";
import { filterLocations } from "../utils/mapFilters";

const defaultFilters: MapFilters = {
  searchText: "",
};

function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function getBestLocationMatch(locations: MapLocation[], searchText: string): MapLocation | null {
  const normalizedSearchText = normalizeText(searchText);
  if (!normalizedSearchText) {
    return null;
  }

  const exactMatch =
    locations.find((location) => normalizeText(location.city) === normalizedSearchText) ?? null;
  if (exactMatch) {
    return exactMatch;
  }

  const startsWithMatch =
    locations.find((location) => normalizeText(location.city).startsWith(normalizedSearchText)) ??
    null;
  if (startsWithMatch) {
    return startsWithMatch;
  }

  return (
    locations.find((location) => normalizeText(location.city).includes(normalizedSearchText)) ??
    null
  );
}

export default function MapPage() {
  const [allLocations, setAllLocations] = useState<MapLocation[]>([]);
  const [filters, setFilters] = useState<MapFilters>(defaultFilters);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const repository = new StaticLocationRepository();

    async function loadLocations() {
      try {
        const locations = await repository.getAllLocations();
        setAllLocations(locations);
      } catch (error) {
        console.error("Error loading locations:", error);
      } finally {
        setIsLoading(false);
      }
    }

    void loadLocations();
  }, []);

  const visibleLocations = useMemo(() => filterLocations(allLocations, filters), [allLocations, filters]);
  const visibleLocationsWithPixelCoordinates = useMemo(
    () =>
      visibleLocations.filter(
        (location) => Number.isFinite(location.x) && Number.isFinite(location.y),
      ),
    [visibleLocations],
  );
  const fallbackMapLocations = useMemo<MapLocation[]>(
    () =>
      mapLocations.map((location) => ({
        id: location.id,
        city: location.name,
        name: location.name,
        description: location.description ?? "",
        x: location.x,
        y: location.y,
        category: location.category,
      })),
    [],
  );
  const locationsToRenderOnMap =
    visibleLocationsWithPixelCoordinates.length > 0
      ? visibleLocationsWithPixelCoordinates
      : fallbackMapLocations;
  const selectedLocation = useMemo(
    () => getBestLocationMatch(visibleLocations, filters.searchText ?? ""),
    [visibleLocations, filters.searchText],
  );
  useEffect(() => {
    if (!import.meta.env.DEV) {
      return;
    }

    const locationsWithoutPixelCoordinates = visibleLocations.filter(
      (location) => !Number.isFinite(location.x) || !Number.isFinite(location.y),
    );
    if (locationsWithoutPixelCoordinates.length === 0) {
      return;
    }

    console.warn(
      `MapView skipped ${locationsWithoutPixelCoordinates.length} locations without x/y pixel coordinates.`,
    );
  }, [visibleLocations]);
  const hasActiveSearchText = (filters.searchText ?? "").trim().length > 0;
  // const locationPreviewList = visibleLocations.slice(0, 12);

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#1a1a1a",
          color: "#ffffff",
        }}
      >
        <div>
          <h1>Loading...</h1>
          <p>Please wait while the map references are loaded.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", height: "100vh" }}>
      <aside
        style={{
          borderRight: "1px solid #2a2a2a",
          padding: "16px",
          overflowY: "auto",
          backgroundColor: "#111827",
          color: "#e5e7eb",
        }}
      >
        <h2 style={{ marginTop: 0, marginBottom: "8px", color: "#f9fafb" }}>Tile Map Controls</h2>
        <p style={{ marginTop: 0, marginBottom: "16px", color: "#cbd5e1" }}>
          Use city search to find references while positioning data over the tile map.
        </p>

        <input
          style={{
            width: "100%",
            marginBottom: "12px",
            backgroundColor: "#0b1220",
            color: "#e5e7eb",
            border: "1px solid #374151",
            borderRadius: "6px",
            padding: "8px 10px",
          }}
          type="text"
          placeholder="Search city"
          value={filters.searchText}
          onChange={(event) =>
            setFilters((previousFilters: MapFilters) => ({
              ...previousFilters,
              searchText: event.target.value,
            }))
          }
        />

        {/* <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "16px" }}>
          <div
            style={{
              backgroundColor: "#1f2937",
              border: "1px solid #374151",
              borderRadius: "8px",
              padding: "10px",
            }}
          >
            <div style={{ fontSize: "12px", color: "#9ca3af" }}>Total</div>
            <strong style={{ fontSize: "20px", color: "#f9fafb" }}>{allLocations.length}</strong>
          </div>
          <div
            style={{
              backgroundColor: "#1f2937",
              border: "1px solid #374151",
              borderRadius: "8px",
              padding: "10px",
            }}
          >
            <div style={{ fontSize: "12px", color: "#9ca3af" }}>Filtered</div>
            <strong style={{ fontSize: "20px", color: "#93c5fd" }}>{visibleLocations.length}</strong>
          </div>
        </div> */}

        {selectedLocation ? (
          <div
            style={{
              marginBottom: "16px",
              border: "1px solid #374151",
              borderRadius: "8px",
              backgroundColor: "#0f172a",
              padding: "12px",
            }}
          >
            <h3 style={{ marginTop: 0, marginBottom: "8px", color: "#f9fafb" }}>{selectedLocation.city}</h3>
            <p style={{ margin: 0, color: "#cbd5e1" }}>{selectedLocation.description}</p>
          </div>
        ) : hasActiveSearchText ? (
          <p style={{ marginTop: 0, marginBottom: "16px", color: "#fca5a5", fontWeight: 600 }}>
            No city match found.
          </p>
        ) : null}

        {/* <h3 style={{ marginTop: 0, marginBottom: "8px", color: "#f3f4f6" }}>Reference preview</h3>
        <div style={{ display: "grid", gap: "6px" }}>
          {locationPreviewList.map((location) => (
            <div
              key={location.id}
              style={{
                border: "1px solid #374151",
                borderRadius: "6px",
                padding: "8px 10px",
                backgroundColor: "#111827",
              }}
            >
              <div style={{ color: "#f9fafb", fontWeight: 600 }}>{location.city}</div>
            </div>
          ))}
        </div> */}
      </aside>
      <main>
        <MapView
          locations={locationsToRenderOnMap}
          selectedLocationId={selectedLocation?.id ?? null}
        />
      </main>
    </div>
  );
}
