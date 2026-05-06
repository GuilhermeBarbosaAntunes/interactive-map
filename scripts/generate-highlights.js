import { cp, mkdir, readFile, readdir, rm, stat } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const projectRootDirectory = process.cwd();
const sourceHighlightsDirectory = path.join(
  projectRootDirectory,
  "assets",
  "municipality-highlights",
);
const outputHighlightsDirectory = path.join(projectRootDirectory, "public", "highlights");
const markersFilePath = path.join(projectRootDirectory, "src", "data", "markers.json");

function parseMunicipalityCodesFromMarkers(markers) {
  const municipalityCodes = new Set();

  for (const marker of markers) {
    if (typeof marker?.id !== "string") {
      continue;
    }

    const normalizedMunicipalityCode = marker.id.trim();
    if (/^\d{7}$/.test(normalizedMunicipalityCode)) {
      municipalityCodes.add(normalizedMunicipalityCode);
    }
  }

  return Array.from(municipalityCodes).sort();
}

async function removePreviouslyGeneratedHighlights() {
  const directoryEntries = await readdir(outputHighlightsDirectory, { withFileTypes: true });

  for (const directoryEntry of directoryEntries) {
    if (!directoryEntry.isFile()) {
      continue;
    }

    if (directoryEntry.name.endsWith(".png")) {
      const outputFilePath = path.join(outputHighlightsDirectory, directoryEntry.name);
      await rm(outputFilePath);
    }
  }
}

async function createHighlightsFromSourceFiles(municipalityCodes) {
  let generatedHighlightCount = 0;
  const missingMunicipalityCodes = [];

  for (const municipalityCode of municipalityCodes) {
    const sourceHighlightFilePath = path.join(sourceHighlightsDirectory, `${municipalityCode}.png`);
    const outputHighlightFilePath = path.join(outputHighlightsDirectory, `${municipalityCode}.png`);

    try {
      const sourceFileStats = await stat(sourceHighlightFilePath);
      if (!sourceFileStats.isFile()) {
        missingMunicipalityCodes.push(municipalityCode);
        continue;
      }

      await cp(sourceHighlightFilePath, outputHighlightFilePath);
      generatedHighlightCount += 1;
    } catch {
      missingMunicipalityCodes.push(municipalityCode);
    }
  }

  return { generatedHighlightCount, missingMunicipalityCodes };
}

async function generateHighlights() {
  await mkdir(outputHighlightsDirectory, { recursive: true });

  const markersFileContents = await readFile(markersFilePath, "utf-8");
  const markers = JSON.parse(markersFileContents);
  const municipalityCodes = parseMunicipalityCodesFromMarkers(markers);

  await removePreviouslyGeneratedHighlights();

  const { generatedHighlightCount, missingMunicipalityCodes } =
    await createHighlightsFromSourceFiles(municipalityCodes);

  console.log(`Generated ${generatedHighlightCount} highlight files in public/highlights.`);
  if (missingMunicipalityCodes.length > 0) {
    console.log(
      `Missing source highlights for ${missingMunicipalityCodes.length} municipalities in assets/municipality-highlights.`,
    );
    console.log(`Examples: ${missingMunicipalityCodes.slice(0, 10).join(", ")}`);
  }
}

generateHighlights().catch((error) => {
  console.error("Failed to generate highlights:", error);
  process.exitCode = 1;
});
