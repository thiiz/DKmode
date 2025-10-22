// Script to generate extension icons
// Run with: node scripts/generate-icons.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a simple SVG icon and convert to different sizes
const sizes = [16, 32, 48, 128];
const iconsDir = path.join(__dirname, '..', 'src', 'assets', 'icons');

// Ensure icons directory exists
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

function generateSVG(size) {
  const moonSize = size * 0.6;
  const moonX = size / 2;
  const moonY = size / 2;
  const moonRadius = moonSize / 2;
  const cutoutRadius = moonSize / 2.2;
  const cutoutX = moonX + moonSize * 0.15;
  const cutoutY = moonY - moonSize * 0.05;

  let stars = '';
  if (size >= 48) {
    const starData = [
      { x: size * 0.2, y: size * 0.25, r: size * 0.03 },
      { x: size * 0.8, y: size * 0.3, r: size * 0.025 },
      { x: size * 0.75, y: size * 0.7, r: size * 0.02 },
      { x: size * 0.25, y: size * 0.75, r: size * 0.025 }
    ];
    stars = starData.map(s =>
      `<circle cx="${s.x}" cy="${s.y}" r="${s.r}" fill="#ffffff"/>`
    ).join('\n    ');
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGradient${size}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1a1a2e;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#16213e;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background circle -->
  <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="url(#bgGradient${size})"/>
  
  <!-- Stars (for larger icons) -->
  ${stars ? '  ' + stars : ''}
  
  <!-- Moon (full circle) -->
  <circle cx="${moonX}" cy="${moonY}" r="${moonRadius}" fill="#ffd700"/>
  
  <!-- Cutout to create crescent -->
  <circle cx="${cutoutX}" cy="${cutoutY}" r="${cutoutRadius}" fill="url(#bgGradient${size})"/>
</svg>`;
}

// Generate SVG files
sizes.forEach(size => {
  const svg = generateSVG(size);
  const filename = path.join(iconsDir, `icon-${size}.svg`);
  fs.writeFileSync(filename, svg);
  console.log(`✓ Generated ${filename}`);
});

console.log('\n📝 SVG icons generated successfully!');
console.log('\nTo convert to PNG, you can:');
console.log('1. Open generate-icons.html in a browser and download PNG files');
console.log('2. Use an online SVG to PNG converter');
console.log('3. Use ImageMagick: convert icon-16.svg icon-16.png');
console.log('4. Use Inkscape CLI or other tools\n');
