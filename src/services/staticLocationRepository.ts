import marketsData from '../data/markers.json';
import type { LocationRepository } from './locationRepository';
import type { LocationCategory, MapFilters, MapLocation } from '../types/map';
import { validateUniqueLocationIdentifier } from '../utils/mapValidation';

function normalizeRawLocation(raw: any): MapLocation {
    return {
        id: raw.id,
        lat: raw.lat,
        lng: raw.lng,
        name: raw.name,
        description: raw.description,
        type: raw.type,
        category: String(raw.category) as MapLocation['category'],
        iconKey: String(raw.iconKey),
    };
}

export class StaticLocationRepository implements LocationRepository {
    async getAllLocations(): Promise<MapLocation[]> {
        return marketsData.map(normalizeRawLocation);
    }

    async getLocationById(id: string): Promise<MapLocation | undefined> {
        
        if(id) {
            validateUniqueLocationIdentifier(marketsData.map(normalizeRawLocation));
        }

        const rawLocation = marketsData.find((location) => location.id === id);
        return rawLocation ? normalizeRawLocation(rawLocation) : undefined;
    }

    async getLocationsByCategory(category: LocationCategory): Promise<MapLocation[]> {
        return marketsData.filter((location) => location.category === category).map(normalizeRawLocation);
    }

    async getLocationsByType(type: string): Promise<MapLocation[]> {
        return marketsData.filter((location) => location.type === type).map(normalizeRawLocation);
    }

    async getLocationsBySearchText(searchText: string): Promise<MapLocation[]> {
        return marketsData.filter((location) => location.name.toLowerCase().includes(searchText.toLowerCase())).map(normalizeRawLocation);
    }

    async getLocationsByFilters(filters: MapFilters): Promise<MapLocation[]> {
        return marketsData.filter((location) => {
            return (
                (!filters.searchText || location.name.toLowerCase().includes(filters.searchText.toLowerCase())) &&
                (!filters.activeCategories.size || filters.activeCategories.has(location.category as LocationCategory)) &&
                (!filters.activeTypes.size || filters.activeTypes.has(location.type))
            );
        }).map(normalizeRawLocation);
    }
}