import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import sharp from "sharp";

// The app, favicon, install icons and social card share one vector master.
const logo = readFileSync(new URL("../public/logo.svg", import.meta.url), "utf8");
const publicDir = new URL("../public/", import.meta.url);
mkdirSync(new URL("icons/", publicDir), { recursive: true });
writeFileSync(new URL("favicon.svg", publicDir), logo);

for (const [file, size, maskable] of [
  ["icons/icon-192.png", 192, false],
  ["icons/icon-512.png", 512, false],
  ["icons/icon-maskable-512.png", 512, true],
  ["apple-touch-icon.png", 180, false],
]) {
  const symbolSize = maskable ? Math.round(size * 0.75) : size;
  const symbol = await sharp(Buffer.from(logo)).resize(symbolSize).png().toBuffer();
  await sharp({ create: { width: size, height: size, channels: 4, background: "#f5f7f6" } })
    .composite([{ input: symbol, gravity: "centre" }])
    .png()
    .toFile(new URL(file, publicDir).pathname);
  process.stdout.write(`Created public/${file}\n`);
}

const symbol = logo.replace(/<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "");
const socialCard = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#f5f7f6"/>
  <rect x="800" width="400" height="630" fill="#e8f3ed"/>
  <g transform="translate(804 110) scale(2.7)">${symbol}</g>
  <text x="90" y="215" fill="#172d2a" font-family="sans-serif" font-size="90" font-weight="700" letter-spacing="-5">Kinlo</text>
  <text x="94" y="326" fill="#172d2a" font-family="sans-serif" font-size="62" font-weight="600" letter-spacing="-2">School, together.</text>
  <text x="96" y="394" fill="#526660" font-family="sans-serif" font-size="27">A little closer to every school day.</text>
  <text x="96" y="536" fill="#526660" font-family="sans-serif" font-size="20">Made for school communities in South Africa.</text>
</svg>`;
writeFileSync(new URL("og.svg", publicDir), socialCard);
await sharp(Buffer.from(socialCard)).png().toFile(new URL("og.png", publicDir).pathname);
process.stdout.write("Created public/og.svg and public/og.png\n");
