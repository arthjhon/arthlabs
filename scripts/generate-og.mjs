// Renders public/og-default.png (1200x630) from scripts/og/og.html.
// Reads the diagram from dist/index.html, so run `npm run build` first.
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { parse } from 'node-html-parser';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = resolve(root, 'dist/index.html');
const template = resolve(root, 'scripts/og/og.html');
const rendered = resolve(root, 'scripts/og/.rendered.html');
const out = resolve(root, 'public/og-default.png');

if (!existsSync(dist)) {
  console.error('dist/index.html not found. Run `npm run build` first, then `npm run og`.');
  process.exit(1);
}
if (spawnSync('google-chrome', ['--version'], { stdio: 'ignore' }).status !== 0) {
  console.error('google-chrome not found in PATH; it is required to render the share image.');
  process.exit(1);
}

const svg = parse(readFileSync(dist, 'utf8')).querySelector('figure.diagram svg.full');
if (!svg) {
  console.error('figure.diagram svg.full not found in dist/index.html.');
  process.exit(1);
}
const diagram = svg.outerHTML
  .replace(/\sdata-astro-cid-[a-z0-9]+(="[^"]*")?/g, '')
  .replace(/\sstyle="[^"]*"/g, '')
  .replace(/\spathLength="100"/g, '');

writeFileSync(rendered, readFileSync(template, 'utf8').replace('<!--DIAGRAM-->', diagram));
try {
  const r = spawnSync(
    'google-chrome',
    [
      '--headless=new', '--disable-gpu', '--no-sandbox', '--hide-scrollbars',
      '--force-device-scale-factor=1', '--window-size=1200,630',
      '--virtual-time-budget=4000', `--screenshot=${out}`,
      pathToFileURL(rendered).href,
    ],
    { stdio: 'inherit' },
  );
  if (r.status !== 0) process.exit(r.status ?? 1);
} finally {
  rmSync(rendered, { force: true });
}
console.log(`wrote ${out}`);
