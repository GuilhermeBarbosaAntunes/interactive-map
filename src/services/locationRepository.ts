import type { LocationCategory, MapFilters, MapLocation } from "../types/map";

/**
 * Represents the repository for the locations.
 */
export interface LocationRepository {
  
    getAllLocations(): Promise<MapLocation[]>;
    getLocationById?(id: string): Promise<MapLocation | undefined>;
    getLocationsByCategory?(category: LocationCategory): Promise<MapLocation[]>;
    getLocationsByType?(type: string): Promise<MapLocation[]>;
    getLocationsBySearchText?(searchText: string): Promise<MapLocation[]>;
    getLocationsByFilters?(filters: MapFilters): Promise<MapLocation[]>;
}