/**
 * Represents the category of a location.
 * primary, secondary, collectible, service, event, other, category, map
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
  * id, lat, lng, name, description, type, category, iconKey
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
  * id, lat, lng, name, description, type, category, iconKey, searchText
  */
 export interface MapFilters {
    id?: string;
    lat?: number;
    lng?: number;
    name: string;
    description?: string;
    type?: string;
    category?: LocationCategory;
    iconKey?: string;
    searchText: string;
}

 /**
  * Represents the props for the map view.
  * center, zoom
  */
export interface MapViewProps {
    center: [number, number];
    zoom: number;
}