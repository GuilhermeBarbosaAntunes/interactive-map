// Para usar no futuro: node scripts/generate-tiles.js
// Requer instalação: npm install -D sharp

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const INPUT_IMAGE = 'mapa-completo.png';
const OUTPUT_DIR = 'public/tiles';
const TILE_SIZE = 256;

async function generateTiles() {
  if (!fs.existsSync(INPUT_IMAGE)) {
    console.error(`❌ Arquivo ${INPUT_IMAGE} não encontrado!`);
    console.log('Coloque sua imagem do mapa na raiz do projeto com este nome.');
    return;
  }

  console.log('🗺️  Gerando tiles... Isso pode levar alguns minutos.');
  
  await sharp(INPUT_IMAGE)
    .tile({
      size: TILE_SIZE,
      layout: 'google', // Pastas padrão {z}/{x}/{y}
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .toFile(OUTPUT_DIR);

  console.log('✅ Tiles geradas com sucesso em public/tiles/');
}

generateTiles().catch(console.error);