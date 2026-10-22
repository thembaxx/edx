import { mkdirSync, writeFileSync } from "node:fs";
import { deflateSync } from "node:zlib";

const table = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  table[i] = c >>> 0;
}
const checksum = (input) => {
  let c = 0xffffffff;
  for (const value of input) c = table[(c ^ value) & 255] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};
const chunk = (name, data) => {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const nameBytes = Buffer.from(name, "ascii");
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(checksum(Buffer.concat([nameBytes, data])));
  return Buffer.concat([len, nameBytes, data, crc]);
};
const mix = (a, b, t) => a * (1 - t) + b * t;
function icon(size, maskable = false) {
  const raw = Buffer.alloc(size * (1 + size * 4));
  const radius = size * (maskable ? 0.285 : 0.37);
  const corner = size * 0.235;
  for (let y = 0; y < size; y++) {
    const offset = y * (size * 4 + 1);
    raw[offset] = 0;
    for (let x = 0; x < size; x++) {
      const nx = x / size,
        ny = y / size;
      const dx = x - size / 2,
        dy = y - size / 2;
      const dist = Math.hypot(dx, dy);
      const rounded = (() => {
        const qx = Math.max(Math.abs(dx) - size / 2 + corner, 0);
        const qy = Math.max(Math.abs(dy) - size / 2 + corner, 0);
        return Math.hypot(qx, qy) <= corner;
      })();
      const bg = [248, 250, 255];
      let [r, g, b] = bg;
      if (dist < radius) {
        const t = Math.max(0, Math.min(1, (nx + ny * 0.45 - 0.28) / 0.73));
        r = mix(67, 161, t);
        g = mix(180, 63, t);
        b = mix(255, 247, t);
        const cyan = Math.max(0, 1 - Math.hypot(nx - 0.3, ny - 0.75) * 2.8);
        r = mix(r, 75, cyan * 0.56);
        g = mix(g, 217, cyan * 0.56);
        b = mix(b, 255, cyan * 0.56);
        const light = Math.max(0, 1 - Math.hypot(nx - 0.35, ny - 0.29) * 3.3);
        r = mix(r, 255, light * 0.42);
        g = mix(g, 255, light * 0.42);
        b = mix(b, 255, light * 0.42);
        const sweep = Math.abs(ny - (0.69 - (nx - 0.5) * 0.44));
        const shine = Math.max(0, 1 - sweep * 15) * 0.25;
        r = mix(r, 255, shine);
        g = mix(g, 255, shine);
        b = mix(b, 255, shine);
      } else {
        const blur = Math.max(0, 1 - (dist - radius) / (size * 0.11)) * 0.16;
        r = mix(r, 120, blur);
        g = mix(g, 132, blur);
        b = mix(b, 230, blur);
      }
      const i = offset + 1 + x * 4;
      raw[i] = Math.round(r);
      raw[i + 1] = Math.round(g);
      raw[i + 2] = Math.round(b);
      raw[i + 3] = rounded ? 255 : 0;
    }
  }
  const header = Buffer.alloc(13);
  header.writeUInt32BE(size, 0);
  header.writeUInt32BE(size, 4);
  header[8] = 8;
  header[9] = 6;
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", header),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}
mkdirSync("public/icons", { recursive: true });
for (const [path, size, maskable] of [
  ["public/icons/icon-192.png", 192, false],
  ["public/icons/icon-512.png", 512, false],
  ["public/icons/icon-maskable-512.png", 512, true],
  ["public/apple-touch-icon.png", 180, false],
]) {
  writeFileSync(path, icon(size, maskable));
  process.stdout.write(`Created ${path}\n`);
}
