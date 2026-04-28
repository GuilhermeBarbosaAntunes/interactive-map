/**
 * Represents the category of a location.
 */
export type LocationCategory =
 | 'primary'
 | 'secondary'
 | 'collectible'
 | 'service'
 | 'event'
 | 'other'
 | 'category'
 | 'map'

 /**
  * Represents a location on the map.
  */
 export interface MapLocation {
    id?: string;
    lat?: number;
    lng?: number;
    name: string;
    description?: string;
    type?: string;
    category?: LocationCategory;
    iconKey?: string;
 }

 /**
  * Represents the filters for the map.
  */
 export interface MapFilters {
    searchText: string;
    activeCategories: Set<LocationCategory>;
    activeTypes: Set<string>;
}

 /**
  * Represents the props for the map view.
  */
export interface MapViewProps {
    center: [number, number];
    zoom: number;
}