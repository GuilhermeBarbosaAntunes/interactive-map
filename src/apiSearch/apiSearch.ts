import axios, { type AxiosResponse } from "axios";
import type { MapLocation } from "../types/map";

type NodeProcess = {
  argv?: string[];
  env?: Record<string, string | undefined>;
  exitCode?: number;
  loadEnvFile?: () => void;
};

const nodeProcess = (globalThis as { process?: NodeProcess }).process;

if (typeof nodeProcess?.loadEnvFile === "function") {
  nodeProcess.loadEnvFile();
}

interface GeocodeApiItem {
  place_id: number;
  lat: string;
  lon: string;
  name?: string;
  display_name: string;
  type?: string;
}

const apiSearch = axios.create({
  baseURL: "https://geocode.maps.co",
});

export const searchLocations = async (searchText: string): Promise<MapLocation[]> => {
  const apiKey = nodeProcess?.env?.API_KEY || import.meta.env?.VITE_API_KEY;

  try {
    const response: AxiosResponse<GeocodeApiItem[]> = await apiSearch.get("/search", {
      params: {
        q: searchText,
        api_key: apiKey,
      },
    });

    return response.data.map((item) => ({
      id: String(item.place_id),
      name: item.name ?? item.display_name,
      description: item.display_name ?? "",
      lat: Number(item.lat),
      lng: Number(item.lon),
      type: item.type ?? "city",
      category: "primary",
      iconKey: "city-pin",
    }));
  } catch (error) {
    console.error("Error searching locations:", error);
    return [];
  }
};

export default apiSearch;
