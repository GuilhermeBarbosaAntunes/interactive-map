/**
 * Represents the categories of locations on the map.
 * primary: Primary location
 * secondary: Secondary location
 * collectible: Collectible location
 * service: Service location
 * event: Event location
 * other: Other location
 */
export type LocationCategory =
    | "primary"
    | "secondary"
    | "collectible"
    | "service"
    | "event"
    | "other";

    /**
     * Represents a location on the map.
     * id?: string;
     * name: string;
     * description?: string;
     * lat?: number; 
     * lng?: number; 
     * type?: string; 
     * category?: LocationCategory; 
     * iconKey?: string; 
     */
export interface MapLocation {
    id?: string; 
    name: string; 
    description?: string; 
    lat?: number; 
    lng?: number;
    type?: string; 
    category?: LocationCategory; 
    iconKey?: string; 
}
 /**
  * Represents the filters for the map.
  * searchText?: string; 
  * id?: string; 
  * name?: string; 
  * description?: string; 
  * lat?: number; 
  * lng?: number; 
  * type?: string; 
  * category?: LocationCategory; 
  * iconKey?: string; 
  */
export interface MapFilters {
    searchText?: string; 
    id?: string;
    name?: string; 
    description?: string;
    lat?: number;
    lng?: number;
    type?: string;
    category?: LocationCategory;
    iconKey?: string;
}
 /**
  * Represents the props for the map view.
  * center: [number, number];
  * zoom: number;
  */
export interface MapViewProps {
    center: [number, number];
    zoom: number;
}