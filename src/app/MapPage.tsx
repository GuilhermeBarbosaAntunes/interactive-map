import { useEffect, useMemo, useState } from "react";
import MapView from "../components/Map/MapView";
import type { MapFilters, MapLocation } from "../types/map";
import { StaticLocationRepository } from "../services/staticLocationRepository";
import { filterLocations } from "../utils/mapFilters";

const defaultFilters: MapFilters = {
  searchText: "",
  category: undefined,
  type: undefined,
  id: undefined,
  lat: undefined,
  lng: undefined,
  city: "",
  description: "",
  iconKey: undefined,
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
  const [selectedLocationId, setSelectedLocationId] = useState<string | undefined>(undefined);
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

  useEffect(() => {
    const matchingLocation = getBestLocationMatch(allLocations, filters.searchText ?? "");
    setSelectedLocationId(matchingLocation?.id);
  }, [allLocations, filters.searchText]);

  const selectedLocation = useMemo(() => {
    if (!selectedLocationId) {
      return null;
    }
    return allLocations.find((location) => location.id === selectedLocationId) ?? null;
  }, [selectedLocationId, allLocations]);

  const hasActiveSearchText = (filters.searchText ?? "").trim().length > 0;
  const hasNoCityMatch = hasActiveSearchText && !selectedLocation;

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
          <p>Please wait while we load the map...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", height: "100vh" }}>
      <aside style={{ borderRight: "1px solid #2a2a2a", padding: "16px", overflowY: "auto" }}>
        <h2>Interactive Filters</h2>

        <input
          style={{ width: "100%", marginBottom: "16px" }}
          type="text"
          placeholder="Type a city name"
          value={filters.searchText}
          onChange={(event) =>
            setFilters((previousFilters: MapFilters) => ({
              ...previousFilters,
              searchText: event.target.value,
            }))
          }
        />
        <p>Total locations: {allLocations.length}</p>
        <p>Visible locations: {visibleLocations.length}</p>

        {selectedLocation ? (
          <div style={{ marginTop: "16px" }}>
            <h3>{selectedLocation.city}</h3>
            <p>{selectedLocation.description}</p>
          </div>
        ) : hasNoCityMatch ? (
          <p style={{ marginTop: "16px", color: "#ff6b6b", fontWeight: 600 }}>
            City not found. Try another name.
          </p>
        ) : (
          <p style={{ marginTop: "16px" }}>Type a city name to highlight it on the map</p>
        )}
      </aside>
      <main>
        <MapView highlightedMunicipalityCode={selectedLocation?.id} />
      </main>
    </div>
  );
}
