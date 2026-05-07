/**
 * Represents the category of a location.
 */
export type LocationCategory =
  | "primary"
  | "secondary"
  | "collectible"
  | "service"
  | "event"
  | "other"
  | "city"
  | "park"
  | "landmark";
/**
 * Represents a location on the map.
 * id, city, name, description, x, y, type, category, iconKey
 */
export interface MapLocation {
  id: string;
  city: string;
  name?: string;
  description: string;
  lat?: number;
  lng?: number;
  x?: number;
  y?: number;
  type?: string;
  category?: LocationCategory;
  iconKey?: string;
}

/**
 * Represents the filters for the map.
 * searchText, id, city, description, lat, lng, type, category, iconKey
 */
export interface MapFilters {
  searchText?: string;
  id?: string;
  city?: string;
  description?: string;
  lat?: number;
  lng?: number;
  type?: string;
  category?: LocationCategory;
  iconKey?: string;
}