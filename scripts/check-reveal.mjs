// Behavioral check: hard-load pages in headless Chrome and assert that every
// [data-reveal] element inside the first viewport ends up with .is-revealed.
// Usage: npm run build && npm run check:reveal
import { spawn, execFileSync } from 'node:child_process';

const PORT = 4399;
const ROUTES = ['/', '/projects', '/about'];
// Spawn the binary directly and detached so the whole process group can be killed
// (going through npx leaves the astro preview child alive after server.kill()).
const server = spawn('node_modules/.bin/astro', ['preview', '--port', String(PORT)], {
  stdio: 'ignore',
  detached: true,
});
const stop = () => {
  try { process.kill(-server.pid); } catch {}
};
process.on('exit', stop);

async function ready() {
  for (let i = 0; i < 50; i++) {
    try { if ((await fetch(`http://localhost:${PORT}/`)).ok) return; } catch {}
    await new Promise((r) => setTimeout(r, 200));
  }
  throw new Error('preview did not start');
}

let failed = false;
try {
  await ready();
  for (const route of ROUTES) {
    const dom = execFileSync('google-chrome', [
      '--headless=new', '--disable-gpu', '--no-sandbox', '--hide-scrollbars',
      '--window-size=1280,2400', '--virtual-time-budget=3000', '--dump-dom',
      `http://localhost:${PORT}${route}`,
    ], { encoding: 'utf8', maxBuffer: 1 << 26 });
    const tags = [...dom.matchAll(/<[a-z0-9]+[^>]*\sdata-reveal(?:[\s=>][^>]*)?>/g)].map((m) => m[0]);
    const hidden = tags.filter((t) => !/class="[^"]*\bis-revealed\b/.test(t));
    console.log(`${route}: ${tags.length - hidden.length}/${tags.length} revealed`);
    if (tags.length === 0 || hidden.length > 0) failed = true;
  }
} finally {
  stop();
}
process.exit(failed ? 1 : 0);
