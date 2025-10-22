// Generate PNG icons using Playwright browser automation
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sizes = [16, 32, 48, 128];
const iconsDir = path.join(__dirname, '..', 'src', 'assets', 'icons');

async function generatePNGIcons() {
  try {
    const { chromium } = await import('playwright');

    console.log('Launching browser to generate PNG icons...\n');

    const browser = await chromium.launch();
    const page = await browser.newPage();

    // Create HTML page with canvas
    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body>
    <canvas id="canvas"></canvas>
    <script>
        window.drawIcon = function(size) {
            const canvas = document.getElementById('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = size;
            canvas.height = size;

            ctx.clearRect(0, 0, size, size);

            // Background gradient
            const gradient = ctx.createLinearGradient(0, 0, size, size);
            gradient.addColorStop(0, '#1a1a2e');
            gradient.addColorStop(1, '#16213e');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
            ctx.fill();

            // Moon
            const moonSize = size * 0.6;
            const moonX = size / 2;
            const moonY = size / 2;

            ctx.fillStyle = '#ffd700';
            ctx.beginPath();
            ctx.arc(moonX, moonY, moonSize / 2, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(moonX + moonSize * 0.15, moonY - moonSize * 0.05, moonSize / 2.2, 0, Math.PI * 2);
            ctx.fill();

            // Stars for larger icons
            if (size >= 48) {
                ctx.fillStyle = '#ffffff';
                const stars = [
                    { x: size * 0.2, y: size * 0.25, r: size * 0.03 },
                    { x: size * 0.8, y: size * 0.3, r: size * 0.025 },
                    { x: size * 0.75, y: size * 0.7, r: size * 0.02 },
                    { x: size * 0.25, y: size * 0.75, r: size * 0.025 }
                ];
                
                stars.forEach(star => {
                    ctx.beginPath();
                    ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
                    ctx.fill();
                });
            }

            return canvas.toDataURL('image/png');
        };
    </script>
</body>
</html>`;

    await page.setContent(html);

    // Generate each icon size
    for (const size of sizes) {
      const dataUrl = await page.evaluate((s) => window.drawIcon(s), size);

      // Convert data URL to buffer
      const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');

      // Save PNG file
      const pngPath = path.join(iconsDir, `icon-${size}.png`);
      fs.writeFileSync(pngPath, buffer);

      console.log(`✓ Generated icon-${size}.png`);
    }

    await browser.close();

    console.log('\n✅ All PNG icons generated successfully!');
    console.log(`📁 Icons saved to: ${iconsDir}\n`);

  } catch (error) {
    if (error.code === 'ERR_MODULE_NOT_FOUND') {
      console.log('❌ Playwright is not installed.\n');
      console.log('Please use the browser-based method:');
      console.log('  1. Open src/assets/icons/generate-icons.html in a browser');
      console.log('  2. Click "Download All Icons"');
      console.log('  3. Save the PNG files to src/assets/icons/\n');
    } else {
      console.error('Error generating icons:', error.message);
      console.log('\nFalling back to browser-based method:');
      console.log('  1. Open src/assets/icons/generate-icons.html in a browser');
      console.log('  2. Click "Download All Icons"');
      console.log('  3. Save the PNG files to src/assets/icons/\n');
    }
  }
}

generatePNGIcons();
