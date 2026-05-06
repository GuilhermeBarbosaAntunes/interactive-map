import { useEffect, useMemo, useState } from "react";
import MapView from "../components/Map/MapView";
import type { LocationCategory, MapFilters, MapLocation } from "../types/map";
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

function getSafeGroupLabel(rawValue: string | undefined, fallbackLabel: string): string {
  const normalizedValue = rawValue?.trim();
  if (!normalizedValue) {
    return fallbackLabel;
  }
  return normalizedValue;
}

function isLocationCategory(value: string): value is LocationCategory {
  return (
    value === "primary" ||
    value === "secondary" ||
    value === "collectible" ||
    value === "service" ||
    value === "event" ||
    value === "other"
  );
}

function formatOptionLabel(value: string): string {
  return value
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

export default function MapPage() {
  const [selectedLocationId, setSelectedLocationId] = useState<string | undefined>(undefined);
  const [allLocations, setAllLocations] = useState<MapLocation[]>([]);
  const [filters, setFilters] = useState<MapFilters>(defaultFilters);
  const [isLoading, setIsLoading] = useState(true);
  const [areLocationsVisible, setAreLocationsVisible] = useState(true);

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

  const filteredLocations = useMemo(() => filterLocations(allLocations, filters), [allLocations, filters]);
  const visibleLocations = areLocationsVisible ? filteredLocations : [];

  const availableCategoryOptions = useMemo(() => {
    const options = new Set<LocationCategory>();
    for (const location of allLocations) {
      const categoryLabel = location.category?.trim();
      if (categoryLabel && isLocationCategory(categoryLabel)) {
        options.add(categoryLabel);
      }
    }
    return Array.from(options).sort((left, right) => left.localeCompare(right));
  }, [allLocations]);

  const availableTypeOptions = useMemo(() => {
    const options = new Set<string>();
    for (const location of allLocations) {
      const typeLabel = location.type?.trim();
      if (typeLabel) {
        options.add(typeLabel);
      }
    }
    return Array.from(options).sort((left, right) => left.localeCompare(right));
  }, [allLocations]);

  const locationCountByCategory = useMemo(() => {
    const countByCategory = new Map<string, number>();
    for (const location of allLocations) {
      const categoryLabel = getSafeGroupLabel(location.category, "Uncategorized");
      countByCategory.set(categoryLabel, (countByCategory.get(categoryLabel) ?? 0) + 1);
    }
    return Array.from(countByCategory.entries()).sort(([left], [right]) =>
      left.localeCompare(right),
    );
  }, [allLocations]);

  const locationCountByType = useMemo(() => {
    const countByType = new Map<string, number>();
    for (const location of allLocations) {
      const typeLabel = getSafeGroupLabel(location.type, "Unspecified type");
      countByType.set(typeLabel, (countByType.get(typeLabel) ?? 0) + 1);
    }
    return Array.from(countByType.entries()).sort(([left], [right]) => left.localeCompare(right));
  }, [allLocations]);

  const activeFilterLabels = useMemo(() => {
    const labels: string[] = [];
    const normalizedSearchText = (filters.searchText ?? "").trim();
    if (normalizedSearchText.length > 0) {
      labels.push(`Search: ${normalizedSearchText}`);
    }
    if (filters.category?.trim()) {
      labels.push(`Category: ${filters.category}`);
    }
    if (filters.type?.trim()) {
      labels.push(`Type: ${filters.type}`);
    }
    if (!areLocationsVisible) {
      labels.push("Locations hidden");
    }
    return labels;
  }, [filters.searchText, filters.category, filters.type, areLocationsVisible]);

  function resetAllFiltersAndShowLocations(): void {
    setFilters(defaultFilters);
    setAreLocationsVisible(true);
  }

  function hideAllLocations(): void {
    setAreLocationsVisible(false);
    setSelectedLocationId(undefined);
  }

  useEffect(() => {
    if (!areLocationsVisible) {
      setSelectedLocationId(undefined);
      return;
    }

    const matchingLocation = getBestLocationMatch(visibleLocations, filters.searchText ?? "");
    setSelectedLocationId(matchingLocation?.id);
  }, [areLocationsVisible, visibleLocations, filters.searchText]);

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
      <aside
        style={{
          borderRight: "1px solid #2a2a2a",
          padding: "16px",
          overflowY: "auto",
          backgroundColor: "#111827",
          color: "#e5e7eb",
        }}
      >
        <h2 style={{ marginTop: 0, marginBottom: "12px", color: "#f9fafb" }}>Interactive Filters</h2>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "12px" }}>
          <button
            type="button"
            onClick={resetAllFiltersAndShowLocations}
            style={{
              border: "1px solid #3b82f6",
              borderRadius: "6px",
              backgroundColor: "#1d4ed8",
              color: "#ffffff",
              padding: "8px 10px",
              cursor: "pointer",
            }}
          >
            Show all
          </button>
          <button
            type="button"
            onClick={hideAllLocations}
            style={{
              border: "1px solid #374151",
              borderRadius: "6px",
              backgroundColor: "#1f2937",
              color: "#e5e7eb",
              padding: "8px 10px",
              cursor: "pointer",
            }}
          >
            Hide all
          </button>
        </div>

        {activeFilterLabels.length > 0 ? (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "12px" }}>
            {activeFilterLabels.map((activeFilterLabel) => (
              <span
                key={activeFilterLabel}
                style={{
                  fontSize: "12px",
                  padding: "4px 8px",
                  borderRadius: "999px",
                  backgroundColor: "#1f2937",
                  color: "#93c5fd",
                  border: "1px solid #374151",
                }}
              >
                {activeFilterLabel}
              </span>
            ))}
          </div>
        ) : null}

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
          placeholder="Type a city name"
          value={filters.searchText}
          onChange={(event) =>
            setFilters((previousFilters: MapFilters) => ({
              ...previousFilters,
              searchText: event.target.value,
            }))
          }
        />

        <select
          style={{
            width: "100%",
            marginBottom: "12px",
            backgroundColor: "#0b1220",
            color: "#e5e7eb",
            border: "1px solid #374151",
            borderRadius: "6px",
            padding: "8px 10px",
          }}
          value={filters.category ?? ""}
          onChange={(event) =>
            setFilters((previousFilters: MapFilters) => ({
              ...previousFilters,
              category: isLocationCategory(event.target.value) ? event.target.value : undefined,
            }))
          }
        >
          <option value="">All categories</option>
          {availableCategoryOptions.map((categoryOption) => (
            <option key={categoryOption} value={categoryOption}>
              {formatOptionLabel(categoryOption)}
            </option>
          ))}
        </select>

        <select
          style={{
            width: "100%",
            marginBottom: "16px",
            backgroundColor: "#0b1220",
            color: "#e5e7eb",
            border: "1px solid #374151",
            borderRadius: "6px",
            padding: "8px 10px",
          }}
          value={filters.type ?? ""}
          onChange={(event) =>
            setFilters((previousFilters: MapFilters) => ({
              ...previousFilters,
              type: event.target.value || undefined,
            }))
          }
        >
          <option value="">All types</option>
          {availableTypeOptions.map((typeOption) => (
            <option key={typeOption} value={typeOption}>
              {formatOptionLabel(typeOption)}
            </option>
          ))}
        </select>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "16px" }}>
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
            <div style={{ fontSize: "12px", color: "#9ca3af" }}>Visible</div>
            <strong style={{ fontSize: "20px", color: "#93c5fd" }}>{visibleLocations.length}</strong>
          </div>
        </div>

        <details open style={{ marginTop: "8px" }}>
          <summary style={{ cursor: "pointer", color: "#f3f4f6", marginBottom: "8px" }}>By category</summary>
          <div style={{ display: "grid", gap: "6px" }}>
            {locationCountByCategory.map(([categoryLabel, locationCount]) => (
              <button
                type="button"
                key={categoryLabel}
                onClick={() =>
                  setFilters((previousFilters: MapFilters) => ({
                    ...previousFilters,
                    category: isLocationCategory(categoryLabel) ? categoryLabel : undefined,
                  }))
                }
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                  border: "1px solid #374151",
                  backgroundColor:
                    filters.category === categoryLabel ? "rgba(59, 130, 246, 0.2)" : "#111827",
                  color: "#e5e7eb",
                  borderRadius: "6px",
                  padding: "8px 10px",
                  cursor: "pointer",
                }}
              >
                <span>{formatOptionLabel(categoryLabel)}</span>
                <span
                  style={{
                    backgroundColor: "#1f2937",
                    borderRadius: "999px",
                    padding: "2px 8px",
                    fontSize: "12px",
                    color: "#93c5fd",
                  }}
                >
                  {locationCount}
                </span>
              </button>
            ))}
          </div>
        </details>

        <details open style={{ marginTop: "16px" }}>
          <summary style={{ cursor: "pointer", color: "#f3f4f6", marginBottom: "8px" }}>By type</summary>
          <div style={{ display: "grid", gap: "6px" }}>
            {locationCountByType.map(([typeLabel, locationCount]) => (
              <button
                type="button"
                key={typeLabel}
                onClick={() =>
                  setFilters((previousFilters: MapFilters) => ({
                    ...previousFilters,
                    type: typeLabel === "Unspecified type" ? undefined : typeLabel,
                  }))
                }
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                  border: "1px solid #374151",
                  backgroundColor: filters.type === typeLabel ? "rgba(59, 130, 246, 0.2)" : "#111827",
                  color: "#e5e7eb",
                  borderRadius: "6px",
                  padding: "8px 10px",
                  cursor: "pointer",
                }}
              >
                <span>{formatOptionLabel(typeLabel)}</span>
                <span
                  style={{
                    backgroundColor: "#1f2937",
                    borderRadius: "999px",
                    padding: "2px 8px",
                    fontSize: "12px",
                    color: "#93c5fd",
                  }}
                >
                  {locationCount}
                </span>
              </button>
            ))}
          </div>
        </details>

        {selectedLocation ? (
          <div
            style={{
              marginTop: "16px",
              border: "1px solid #374151",
              borderRadius: "8px",
              backgroundColor: "#0f172a",
              padding: "12px",
            }}
          >
            <h3 style={{ marginTop: 0, marginBottom: "8px", color: "#f9fafb" }}>{selectedLocation.city}</h3>
            <p style={{ margin: 0, color: "#cbd5e1" }}>{selectedLocation.description}</p>
          </div>
        ) : hasNoCityMatch ? (
          <p style={{ marginTop: "16px", color: "#fca5a5", fontWeight: 600 }}>
            City not found. Try another name.
          </p>
        ) : (
          <p style={{ marginTop: "16px", color: "#cbd5e1" }}>Type a city name to highlight it on the map</p>
        )}
      </aside>
      <main>
        <MapView highlightedMunicipalityCode={selectedLocation?.id} />
      </main>
    </div>
  );
}
