import type { LocationCategory, MapFilters, MapLocation } from "../types/map";

export interface LocationRepository {
    getAllLocations(): Promise<MapLocation[]>;
    getLocationById?(id: string): Promise<MapLocation | undefined>;
    getLocationsByCategory(category: LocationCategory): Promise<MapLocation[]>;
    getLocationsByType(type: string): Promise<MapLocation[]>;
    getLocationsBySearchText(searchText: string): Promise<MapLocation[]>;
    getLocationsByFilters(filters: MapFilters): Promise<MapLocation[]>;
}