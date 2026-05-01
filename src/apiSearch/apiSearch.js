import axios from "axios";
import { pathToFileURL } from "node:url";

if (typeof process !== "undefined" && typeof process.loadEnvFile === "function") {
  process.loadEnvFile();
}

/**
 * @typedef {Object} MapLocation
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {number} [lat]
 * @property {number} [lng]
 * @property {string} [type]
 * @property {"primary"|"secondary"} [category]
 * @property {string} [iconKey]
 */

/**
 * @typedef {Object} GeocodeApiItem
 * @property {number} place_id
 * @property {string} lat
 * @property {string} lon
 * @property {string} [name]
 * @property {string} display_name
 * @property {string} [type]
 */

const apiSearch = axios.create({
  baseURL: "https://geocode.maps.co",
  params: {
    api_key: process.env.API_KEY || import.meta.env?.VITE_API_KEY,
  },
});

/**
 * @param {string} searchText
 * @returns {Promise<MapLocation[]>}
 */
export const searchLocations = async (searchText) => {
  try {
    /** @type {import("axios").AxiosResponse<GeocodeApiItem[]>} */
    const response = await apiSearch.get("/search", {
      params: { q: searchText },
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

const isRunningAsDirectScript =
  process.argv[1] !== undefined &&
  import.meta.url === pathToFileURL(process.argv[1]).href;

if (isRunningAsDirectScript) {
  const defaultSearchTerm = process.argv[2] ?? "city";

  searchLocations(defaultSearchTerm)
    .then((locations) => {
      console.log(`Locations found for "${defaultSearchTerm}":`, locations);
    })
    .catch((error) => {
      console.error("Unexpected error while running debug search:", error);
      process.exitCode = 1;
    });
}