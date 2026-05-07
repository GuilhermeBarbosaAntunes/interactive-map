import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const INPUT_IMAGE = "mapa.png";
const OUTPUT_DIR = "public/tiles";
const TILE_SIZE = 256;
const MAX_ZOOM = 6;
const BACKGROUND_COLOR = { r: 210, g: 183, b: 144, alpha: 1 };
const BACKGROUND_COLOR_HEX = "#D2B790";
const WEBP_QUALITY = 88;

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function generateTiles() {
  if (!(await fileExists(INPUT_IMAGE))) {
    console.error(
      "Input image mapa.png was not found. Put mapa.png in the project root and run pnpm generate:tiles again.",
    );
    process.exitCode = 1;
    return;
  }

  await fs.rm(OUTPUT_DIR, { recursive: true, force: true });
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  const inputImage = sharp(INPUT_IMAGE);
  const imageMetadata = await inputImage.metadata();

  if (!imageMetadata.width || !imageMetadata.height) {
    throw new Error("Unable to read mapa.png dimensions.");
  }

  const imageWidth = imageMetadata.width;
  const imageHeight = imageMetadata.height;

  console.log(`Source image: ${imageWidth}x${imageHeight}`);

  let totalGeneratedTiles = 0;

  for (let zoom = 0; zoom <= MAX_ZOOM; zoom += 1) {
    const scale = 2 ** (MAX_ZOOM - zoom);
    const sourceTileSize = TILE_SIZE * scale;
    const tilesX = Math.ceil(imageWidth / sourceTileSize);
    const tilesY = Math.ceil(imageHeight / sourceTileSize);

    const zoomOutputDirectory = path.join(OUTPUT_DIR, String(zoom));
    await fs.mkdir(zoomOutputDirectory, { recursive: true });

    const tilesAtCurrentZoom = tilesX * tilesY;
    console.log(
      `Zoom ${zoom}: tilesX=${tilesX}, tilesY=${tilesY}, total=${tilesAtCurrentZoom}`,
    );

    for (let tileY = 0; tileY < tilesY; tileY += 1) {
      for (let tileX = 0; tileX < tilesX; tileX += 1) {
        const left = tileX * sourceTileSize;
        const top = tileY * sourceTileSize;
        const extractWidth = Math.min(sourceTileSize, imageWidth - left);
        const extractHeight = Math.min(sourceTileSize, imageHeight - top);
        const scaledExtractWidth = Math.max(
          1,
          Math.round((extractWidth / sourceTileSize) * TILE_SIZE),
        );
        const scaledExtractHeight = Math.max(
          1,
          Math.round((extractHeight / sourceTileSize) * TILE_SIZE),
        );

        const croppedTileBuffer = await sharp(INPUT_IMAGE)
          .extract({ left, top, width: extractWidth, height: extractHeight })
          .resize(scaledExtractWidth, scaledExtractHeight, { fit: "fill" })
          .toBuffer();

        const outputTilePath = path.join(zoomOutputDirectory, `${tileX}_${tileY}.webp`);

        await sharp({
          create: {
            width: TILE_SIZE,
            height: TILE_SIZE,
            channels: 4,
            background: BACKGROUND_COLOR,
          },
        })
          .composite([{ input: croppedTileBuffer, top: 0, left: 0 }])
          .flatten({ background: BACKGROUND_COLOR })
          .webp({ quality: WEBP_QUALITY })
          .toFile(outputTilePath);

        totalGeneratedTiles += 1;
      }
    }
  }

  const metadata = {
    name: "Interactive Custom Map",
    tileSize: TILE_SIZE,
    minZoom: 0,
    maxZoom: MAX_ZOOM,
    width: imageWidth,
    height: imageHeight,
    backgroundColor: BACKGROUND_COLOR_HEX,
    tileUrl: "/tiles/{z}/{x}_{y}.webp",
  };

  const metadataPath = path.join(OUTPUT_DIR, "metadata.json");
  await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2), "utf-8");

  console.log(`Total tiles generated: ${totalGeneratedTiles}`);
  console.log("Tiles generated successfully.");
  console.log(`Output directory: ${OUTPUT_DIR}`);
  console.log(`Metadata file: ${metadataPath}`);
}

generateTiles().catch((error) => {
  console.error("Tile generation failed:", error);
  process.exitCode = 1;
});