// Renders the social sharing card to public/og.png.
//
// The result is committed, not built on every deploy: rasterising SVG text depends on
// whichever fonts the machine happens to have, and a CI runner does not have the same
// ones as a laptop. Generating it here and checking it in keeps the card deterministic.
//
// Run with: pnpm og
import { mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { es } from '../src/i18n/es.ts';

/** SVG is XML, and the role has an ampersand in it. */
const xml = (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;');

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const out = resolve(root, 'public/og.png');

const WIDTH = 1200;
const HEIGHT = 630;

// Mirrors the dark palette in src/styles/global.css.
const BG = '#0b0e14';
const CARD = '#131826';
const TEXT = '#e8ebf2';
const MUTED = '#96a0b5';
const ACCENT = '#34d399';

const SANS = 'Segoe UI, Inter, Helvetica Neue, Arial, sans-serif';
const MONO = 'JetBrains Mono, Cascadia Code, Consolas, DejaVu Sans Mono, monospace';

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${ACCENT}" stop-opacity="0.22" />
      <stop offset="100%" stop-color="${ACCENT}" stop-opacity="0" />
    </radialGradient>
    <linearGradient id="bar" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${ACCENT}" />
      <stop offset="70%" stop-color="${ACCENT}" stop-opacity="0" />
    </linearGradient>
  </defs>

  <rect width="${WIDTH}" height="${HEIGHT}" fill="${BG}" />
  <circle cx="1050" cy="120" r="460" fill="url(#glow)" />
  <rect width="${WIDTH}" height="7" fill="url(#bar)" />

  <text x="80" y="128" font-family="${MONO}" font-size="40" font-weight="700" fill="${TEXT}">ah<tspan fill="${ACCENT}">.</tspan></text>

  <text x="80" y="300" font-family="${SANS}" font-size="96" font-weight="700" fill="${TEXT}" letter-spacing="-3">Angel Hincho</text>
  <text x="80" y="368" font-family="${MONO}" font-size="36" font-weight="600" fill="${ACCENT}">${xml(es.hero.role)}</text>

  <rect x="80" y="418" width="150" height="2" fill="${CARD}" />

  <text x="80" y="480" font-family="${SANS}" font-size="28" fill="${MUTED}">Spring Boot · NestJS · React · AWS · IA Generativa &amp; MLOps</text>
  <text x="80" y="556" xml:space="preserve" font-family="${MONO}" font-size="24" fill="${MUTED}">ahincho.github.io<tspan fill="${ACCENT}"> · </tspan>Arequipa, Perú</text>
</svg>`;

await mkdir(dirname(out), { recursive: true });
await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(out);
console.log(`Wrote ${out}`);
