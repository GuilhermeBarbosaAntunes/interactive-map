import marketsData from "../data/markers.json";
import type { LocationRepository } from "./locationRepository";
import type { LocationCategory, MapFilters, MapLocation } from "../types/map";

type RawLocationRecord = Record<string, unknown>;

function normalizeRawLocation(raw: RawLocationRecord): MapLocation {
    const normalizedCityName = typeof raw.city === "string" ? raw.city : "";
    const normalizedDisplayName =
        typeof raw.name === "string" && raw.name.trim().length > 0
            ? raw.name
            : normalizedCityName;

    return {
        id: typeof raw.id === "string" ? raw.id : "",
        lat: typeof raw.lat === "number" ? raw.lat : undefined,
        lng: typeof raw.lng === "number" ? raw.lng : undefined,
        x: typeof raw.x === "number" ? raw.x : undefined,
        y: typeof raw.y === "number" ? raw.y : undefined,
        city: normalizedDisplayName,
        description: typeof raw.description === "string" ? raw.description : "",
        type: typeof raw.type === "string" ? raw.type : "",
        category: String(raw.category) as MapLocation["category"],
        iconKey: raw.iconKey == null ? undefined : String(raw.iconKey),
    };
}
function validateLocations(locations: MapLocation[]): void {
    const seenIdentifiers = new Set<string>();
    const validationErrors: string[] = [];
    locations.forEach((location, index) => {
        const locationPosition = index + 1;
        const trimmedName = location.city.trim() ?? "";
        if (!trimmedName) {
            validationErrors.push(`Location at position ${locationPosition} must have a name.`);
        }
        const trimmedIdentifier = location.id?.trim();
        if (trimmedIdentifier) {
            if (seenIdentifiers.has(trimmedIdentifier)) {
                validationErrors.push(`Identifier "${trimmedIdentifier}" is duplicated.`);
            }
            seenIdentifiers.add(trimmedIdentifier);
        }
        const hasLatitude = location.lat != null;
        const hasLongitude = location.lng != null;
        if (hasLatitude !== hasLongitude) {
            validationErrors.push(`Location "${trimmedName || `#${locationPosition}`}" must provide both lat and lng.`);
            return;
        }
        if (hasLatitude && hasLongitude) {
            if (!Number.isFinite(location.lat) || location.lat! < -90 || location.lat! > 90) {
                validationErrors.push(`Location "${trimmedName || `#${locationPosition}`}" has invalid lat.`);
            }
            if (!Number.isFinite(location.lng) || location.lng! < -180 || location.lng! > 180) {
                validationErrors.push(`Location "${trimmedName || `#${locationPosition}`}" has invalid lng.`);
            }
        }
    });
    if (validationErrors.length > 0) {
        throw new Error(validationErrors.join("\n"));
    }
}
function matchesFilters(location: RawLocationRecord, filters: MapFilters): boolean {
    const normalizedSearchText = filters.searchText?.toLowerCase() ?? "";
    const locationCity = typeof location.city === "string" ? location.city : "";
    return (
        (normalizedSearchText.length === 0 || locationCity.toLowerCase().includes(normalizedSearchText)) &&
        (!filters.category || filters.category === location.category) &&
        (!filters.type || filters.type === location.type) &&
        (!filters.id || filters.id === location.id) &&
        (filters.lat == null || filters.lat === location.lat) &&
        (filters.lng == null || filters.lng === location.lng) &&
        (!filters.city || filters.city === locationCity) &&
        (!filters.description || filters.description === location.description)
    );
}
export class StaticLocationRepository implements LocationRepository {
    private static isDatasetValidated = false;
    constructor() {
        if (!StaticLocationRepository.isDatasetValidated) {
            validateLocations((marketsData as RawLocationRecord[]).map(normalizeRawLocation));
            StaticLocationRepository.isDatasetValidated = true;
        }
    }
    async getAllLocations(): Promise<MapLocation[]> {
        return this.getLocationsByFilters({ city: "", searchText: "" });
    }
    async getLocationById(id: string): Promise<MapLocation | undefined> {
        const [location] = await this.getLocationsByFilters({ id, city: "", searchText: "" });
        return location;
    }
    async getLocationsByCategory(category: LocationCategory): Promise<MapLocation[]> {
        return this.getLocationsByFilters({ category, city: "", searchText: "" });
    }
    async getLocationsByType(type: string): Promise<MapLocation[]> {
        return this.getLocationsByFilters({ type, city: "", searchText: "" });
    }
    async getLocationsBySearchText(searchText: string): Promise<MapLocation[]> {
        return this.getLocationsByFilters({ searchText, city: "" });
    }
    async getLocationsByFilters(filters: MapFilters): Promise<MapLocation[]> {
        return (marketsData as RawLocationRecord[])
            .filter((location) => matchesFilters(location, filters))
            .map(normalizeRawLocation);
    }
}