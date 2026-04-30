// @vitest-environment node
// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { filterLocations } from "../src/utils/mapFilters";
import type { MapLocation } from "../src/types/map";

describe("filterLocations", () => {
    const baseLocation: MapLocation = {
        id: "loc_001",
        name: "Januária",
        description: "Cidade histórica com rio importante",
        lat: -15.488,
        lng: -44.361,
        type: "city",
        category: "primary",
        iconKey: "city-pin",
    };

    it("matches search text without accent", () => {
        const result = filterLocations([baseLocation], { searchText: "januaria" });
        expect(result).toHaveLength(1);
        expect(result[0].id).toBe("loc_001");
        expect(result[0].name).toBe("Januária");
    });

    it("matches search text with accent", () => {
        const result = filterLocations([baseLocation], { searchText: "januária" });
        expect(result).toHaveLength(1);
        expect(result[0].name).toBe("Januária");
    });

    it("matches partial search in name", () => {
        const result = filterLocations([baseLocation], { searchText: "jan" });
        expect(result).toHaveLength(1);
        expect(result[0].name).toBe("Januária");
    });

    it("matches partial search in description", () => {
        const result = filterLocations([baseLocation], { searchText: "historica" });
        expect(result).toHaveLength(1);
        expect(result[0].description).toContain("histórica");
    });

    it("does not match wrong category", () => {
        const result = filterLocations([baseLocation], { category: "event" });
        expect(result).toHaveLength(0);
    });

    it("matches exact coordinates when provided", () => {
        const result = filterLocations([baseLocation], { lat: -15.488, lng: -44.361 });
        expect(result).toHaveLength(1);
        expect(result[0].lat).toBe(-15.488);
        expect(result[0].lng).toBe(-44.361);
    });

    it("does not match wrong id", () => {
        const result = filterLocations([baseLocation], { id: "loc_999" });
        expect(result).toHaveLength(0);
    });

    it("returns all when filters are empty", () => {
        const result = filterLocations([baseLocation], {});
        expect(result).toHaveLength(1);
        expect(result[0].id).toBe("loc_001");
    });
});

describe("filterLocations with multiple locations", () => {
    const locations: MapLocation[] = [
        {
            id: "loc_001",
            name: "Januária",
            description: "Cidade histórica com rio importante",
            lat: -15.488,
            lng: -44.361,
            type: "city",
            category: "primary",
            iconKey: "city-pin",
        },
        {
            id: "loc_002",
            name: "Hidden Cave",
            description: "Mysterious cave entrance",
            lat: 60,
            lng: 70,
            type: "interest_point",
            category: "secondary",
            iconKey: "cave-pin",
        },
    ];
    it("returns only Januária when searching by text", () => {
        const result = filterLocations(locations, { searchText: "januaria" });
        expect(result).toHaveLength(1);
        expect(result[0].id).toBe("loc_001");
        expect(result[0].name).toBe("Januária");
    });
    it("returns only Hidden Cave when filtering by type", () => {
        const result = filterLocations(locations, { type: "interest_point" });
        expect(result).toHaveLength(1);
        expect(result[0].id).toBe("loc_002");
        expect(result[0].name).toBe("Hidden Cave");
    });
    it("returns both locations with empty filters", () => {
        const result = filterLocations(locations, {});
        expect(result).toHaveLength(2);
        expect(result.map((location) => location.id)).toEqual(["loc_001", "loc_002"]);
    });
    it("returns no locations when filters conflict", () => {
        const result = filterLocations(locations, {
            category: "primary",
            type: "interest_point",
        });
        expect(result).toHaveLength(0);
    });
});

describe.only("filterLocations with invalid locations", () => {
    it("returns no locations when locations is undefined", () => {
        const result = filterLocations([], { searchText: "januaria" });
        expect(result).toHaveLength(0);
    });
    it("returns no locations when locations is null", () => {
        const result = filterLocations([], { searchText: "januaria" });
        expect(result).toHaveLength(0);
    });
});