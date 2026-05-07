export type MapLocationCategory = "city" | "park" | "landmark";

export interface MapLocation {
  id: string;
  name: string;
  category: MapLocationCategory;
  x: number;
  y: number;
  description?: string;
}

export const mapLocations: MapLocation[] = [
  {
    id: "example-location",
    name: "Local de Exemplo",
    category: "landmark",
    x: 2300,
    y: 3300,
    description: "Marcador de exemplo usando coordenadas em pixels da imagem original.",
  },
];
