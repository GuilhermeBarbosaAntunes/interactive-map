import type { MapFilters, MapLocation } from "../types/map";


export function filterLocations(locations: MapLocation[], filters: MapFilters): MapLocation[] {
    
    const normalizedSearchText = filters.searchText.trim().toLowerCase();

    return locations.filter((location) => {

        const matchesCategory = filters.category === location.category;        
        const matchesSearchText = normalizedSearchText.length === 0 || location.name.toLowerCase().includes(normalizedSearchText) || (location.description?.toLowerCase().includes(normalizedSearchText));
        const matchesType = filters.type === location.type;
        const matchesId = location.id && filters.id === location.id;
        const matchesLat = filters.lat === location.lat;
        const matchesLng = filters.lng === location.lng;

        return matchesCategory && matchesSearchText && matchesType && matchesId && matchesLat && matchesLng;
    })

}