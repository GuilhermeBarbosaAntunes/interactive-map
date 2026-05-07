import fs from "node:fs";
import sharp from "sharp";

const INPUT_IMAGE = "mapa.png";
const OUTPUT_DIR = "public/tiles";
const TILE_SIZE = 256;

async function generateTiles() {
  if (!fs.existsSync(INPUT_IMAGE)) {
    console.error(`Input image "${INPUT_IMAGE}" was not found.`);
    console.log("Place the map image in the project root and run the command again.");
    return;
  }

  console.log("Generating tiles. This can take a few minutes...");

  await sharp(INPUT_IMAGE)
    .tile({
      size: TILE_SIZE,
      layout: "google",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .toFile(OUTPUT_DIR);

  console.log(`Tiles generated successfully in "${OUTPUT_DIR}".`);
}

generateTiles().catch(console.error);