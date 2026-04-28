import type { MapLocation } from "../types/map";



function normalizeText(value: string | undefined): string {
    return value?.trim() ?? "";
}
function createNameComparisonKey(value: string): string {
    return value.trim().toLocaleLowerCase();
}
function isDefinedNumber(value: number | null | undefined): value is number {
    return value !== null && value !== undefined;
}
export function validateLocationsDataset(locations: MapLocation[] | undefined): void {

    if (!locations) {
        return;
    }

    const validationErrors: string[] = [];
    const firstPositionByIdentifier = new Map<string, number>();
    const firstPositionByName = new Map<string, number>();

    locations.forEach((location, index) => {

        const currentPosition = index + 1;
        const name = normalizeText(location.name);

        if (!name) {
            validationErrors.push(`Location at position ${currentPosition} must have a name.`);
        } else {

            const nameComparisonKey = createNameComparisonKey(name);
            const firstNamePosition = firstPositionByName.get(nameComparisonKey);

            if (firstNamePosition !== undefined) {
                validationErrors.push(
                    `Name "${name}" is duplicated at positions ${firstNamePosition + 1} and ${currentPosition}.`
                );
            } else {
                firstPositionByName.set(nameComparisonKey, index);
            }
        }

        const identifier = normalizeText(location.id);

        if (identifier) {
            const firstIdentifierPosition = firstPositionByIdentifier.get(identifier);
            if (firstIdentifierPosition !== undefined) {
                validationErrors.push(
                    `Identifier "${identifier}" is duplicated at positions ${firstIdentifierPosition + 1} and ${currentPosition}.`
                );
            } else {
                firstPositionByIdentifier.set(identifier, index);
            }
        }

        const hasLatitude = isDefinedNumber(location.lat);
        const hasLongitude = isDefinedNumber(location.lng);

        if (hasLatitude !== hasLongitude) {

            validationErrors.push(
                `Location "${name || `#${currentPosition}`}" must provide both lat and lng together.`
            );
            return;
        }

        if (hasLatitude && hasLongitude) {

            if (!Number.isFinite(location.lat)) {
                validationErrors.push(`Location "${name || `#${currentPosition}`}" has an invalid lat value.`);
                //TODO: Hardcoded value for now, but should be configurable.
            } else if (location.lat && (location.lat < -90 || location.lat > 90)) {
                validationErrors.push(`Location "${name || `#${currentPosition}`}" lat must be between -90 and 90.`);
            }
            if (!Number.isFinite(location.lng)) {
                validationErrors.push(`Location "${name || `#${currentPosition}`}" has an invalid lng value.`);
                //TODO: Hardcoded value for now, but should be configurable.
            } else if (location.lng && (location.lng < -180 || location.lng > 180)) {
                validationErrors.push(`Location "${name || `#${currentPosition}`}" lng must be between -180 and 180.`);
            }
        }
    });
    
    if (validationErrors.length > 0) {
        throw new Error(validationErrors.join("\n"));
    }
}