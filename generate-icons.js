const fs = require('fs');
const sharp = require('sharp');
const path = require('path');

const svgCode = `
<svg width="180" height="180" viewBox="0 0 180 180" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#10b981" />
      <stop offset="50%" stop-color="#34d399" />
      <stop offset="100%" stop-color="#2dd4bf" />
    </linearGradient>
  </defs>
  <rect width="180" height="180" rx="67.5" fill="url(#grad)" />
  <g transform="translate(45, 45) scale(3.75)" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
    <path d="M2 22 12 12"/>
  </g>
</svg>
`;

async function generate() {
  const publicDir = path.join(__dirname, 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const svgBuffer = Buffer.from(svgCode);

  // 180x180 Apple Touch Icon
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('Created apple-touch-icon.png');

  // 32x32 Favicon PNG
  await sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toFile(path.join(publicDir, 'favicon-32x32.png'));
  console.log('Created favicon-32x32.png');

  // 16x16 Favicon PNG
  await sharp(svgBuffer)
    .resize(16, 16)
    .png()
    .toFile(path.join(publicDir, 'favicon-16x16.png'));
  console.log('Created favicon-16x16.png');

  // favicon.ico (can be a 32x32 file renamed or actual ico structure, sharp doesn't output true .ico natively, but browsers accept png renamed or we can just use 32x32 png logic or just use next.js metadata)
  // Sharp can't natively do ICO, but Next.js prefers favicon.ico in app dir.
  // We can just copy the 32x32 as favicon.ico, most modern browsers support PNG-based ICO, or we can use next.js app/icon.png instead.
  // Actually, wait, sharp CAN output raw pixel data and there are small packages to do ICO, but wait, modern browsers perfectly support a 32x32 PNG renamed to .ico!
  fs.copyFileSync(path.join(publicDir, 'favicon-32x32.png'), path.join(publicDir, 'favicon.ico'));
  console.log('Created favicon.ico (png renamed)');
  
  // Wait, Next.js 'app' directory allows favicon.ico. I'll place it in public but next.js might want it in app/.
  // The requirement says: "Place favicon files in the correct public/app directory structure."
  // I will just put them in public/ and reference them in layout.tsx!
}

generate().catch(console.error);
