// Convert SVG icons to PNG using canvas in Node.js
// This requires the 'canvas' package: npm install canvas

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sizes = [16, 32, 48, 128];
const iconsDir = path.join(__dirname, '..', 'src', 'assets', 'icons');

async function convertSVGtoPNG() {
  try {
    // Try to import canvas package
    const { createCanvas, loadImage } = await import('canvas');

    console.log('Converting SVG to PNG using node-canvas...\n');

    for (const size of sizes) {
      const svgPath = path.join(iconsDir, `icon-${size}.svg`);
      const pngPath = path.join(iconsDir, `icon-${size}.png`);

      // Read SVG file
      const svgBuffer = fs.readFileSync(svgPath);
      const svgDataUrl = `data:image/svg+xml;base64,${svgBuffer.toString('base64')}`;

      // Create canvas and load image
      const canvas = createCanvas(size, size);
      const ctx = canvas.getContext('2d');

      const img = await loadImage(svgDataUrl);
      ctx.drawImage(img, 0, 0, size, size);

      // Save as PNG
      const buffer = canvas.toBuffer('image/png');
      fs.writeFileSync(pngPath, buffer);

      console.log(`✓ Converted icon-${size}.svg → icon-${size}.png`);
    }

    console.log('\n✅ All icons converted successfully!');

  } catch (error) {
    if (error.code === 'ERR_MODULE_NOT_FOUND') {
      console.log('❌ The "canvas" package is not installed.\n');
      console.log('To convert SVG to PNG automatically, install it with:');
      console.log('  npm install canvas\n');
      console.log('Or use the browser-based method:');
      console.log('  1. Open src/assets/icons/generate-icons.html in a browser');
      console.log('  2. Click "Download All Icons"');
      console.log('  3. Save the PNG files to src/assets/icons/\n');
    } else {
      console.error('Error converting icons:', error.message);
    }
  }
}

convertSVGtoPNG();
