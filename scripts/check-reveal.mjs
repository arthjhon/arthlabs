// Behavioral check: hard-load pages in headless Chrome and assert that every
// [data-reveal] element inside the first viewport ends up with .is-revealed.
// Usage: npm run build && npm run check:reveal
import { spawn, execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const PORT = 4399;
const ROUTES = ['/', '/projects', '/about'];
// Spawn the binary directly and detached so the whole process group can be killed
// (going through npx leaves the astro preview child alive after server.kill()).
const server = spawn('node_modules/.bin/astro', ['preview', '--port', String(PORT)], {
  stdio: 'ignore',
  detached: true,
});
// Astro 7 hands the preview off to a background daemon in its own session, which a
// group kill cannot reach, so also ask astro to stop it (idempotent, safe to repeat).
const stop = () => {
  try { process.kill(-server.pid); } catch {}
  try { execFileSync('node_modules/.bin/astro', ['preview', 'stop'], { stdio: 'ignore' }); } catch {}
};
process.on('exit', stop);

async function ready() {
  for (let i = 0; i < 50; i++) {
    try { if ((await fetch(`http://localhost:${PORT}/`)).ok) return; } catch {}
    await new Promise((r) => setTimeout(r, 200));
  }
  throw new Error('preview did not start');
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Open a page in headless Chrome driven over CDP. Returns { send, ws, close }.
async function openPage(width, height, route, extra = []) {
  const dir = mkdtempSync(join(tmpdir(), 'reveal-chrome-'));
  const chrome = spawn('google-chrome', [
    '--headless=new', '--disable-gpu', '--no-sandbox', '--hide-scrollbars',
    '--remote-debugging-port=0', `--user-data-dir=${dir}`, ...extra, 'about:blank',
  ], { stdio: 'ignore', detached: true });
  const close = async () => {
    try { process.kill(-chrome.pid); } catch {}
    await sleep(500);
    rmSync(dir, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
  };
  try {
    let port;
    for (let i = 0; i < 50 && !port; i++) {
      await sleep(200);
      try { port = readFileSync(join(dir, 'DevToolsActivePort'), 'utf8').split('\n')[0]; } catch {}
    }
    if (!port) throw new Error('chrome did not expose a debugging port');
    const targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
    const ws = new WebSocket(targets.find((t) => t.type === 'page').webSocketDebuggerUrl);
    await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
    let id = 0;
    const pending = new Map();
    ws.onmessage = (m) => {
      const d = JSON.parse(m.data);
      if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); }
    };
    const send = (method, params = {}) => new Promise((res) => {
      pending.set(++id, res);
      ws.send(JSON.stringify({ id, method, params }));
    });
    await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false });
    await send('Page.navigate', { url: `http://localhost:${PORT}${route}` });
    await sleep(3000);
    return { send, ws, close };
  } catch (e) {
    await close();
    throw e;
  }
}

// Anchor case: hard-load a deep link in a small window and read layout via CDP
// (--dump-dom has no geometry). Everything above or inside the viewport must be revealed.
async function checkAnchor(route) {
  const page = await openPage(375, 700, route);
  try {
    const { result } = await page.send('Runtime.evaluate', {
      returnByValue: true,
      expression: `JSON.stringify({
        scrollY: Math.round(scrollY),
        els: [...document.querySelectorAll('[data-reveal]')].map((e) => ({
          top: Math.round(e.getBoundingClientRect().top),
          revealed: e.classList.contains('is-revealed'),
        })),
      })`,
    });
    page.ws.close();
    const { scrollY, els } = JSON.parse(result.result.value);
    const due = els.filter((e) => e.top < 700);
    const hidden = due.filter((e) => !e.revealed);
    console.log(`${route}: scrollY=${scrollY}, ${due.length - hidden.length}/${due.length} above-or-in-viewport revealed (${els.length} total)`);
    return scrollY > 0 && due.length > 0 && hidden.length === 0;
  } finally {
    await page.close();
  }
}

// Cursor-light case: a pointer move must move the light that body::after paints.
// Reads the computed background of the painting pseudo-element, so a custom property
// set on an element the pseudo does not inherit from (the 294ab22 regression) fails.
async function checkPointerLight() {
  const page = await openPage(1280, 800, '/');
  try {
    const read = async () => {
      const { result } = await page.send('Runtime.evaluate', {
        returnByValue: true,
        expression: `getComputedStyle(document.body, '::after').backgroundImage`,
      });
      return String(result.result.value);
    };
    const before = await read();
    await page.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 200, y: 600, pointerType: 'mouse' });
    await sleep(300);
    const after = await read();
    page.ws.close();
    const ok = after !== before && after.includes('200px') && after.includes('600px');
    console.log(`pointer light: ${ok ? 'follows' : 'DOES NOT follow'} pointer (after: ${after.slice(0, 80)})`);
    return ok;
  } finally {
    await page.close();
  }
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
  if (!(await checkAnchor('/about#homelab-title'))) failed = true;
  if (!(await checkPointerLight())) failed = true;
} finally {
  stop();
}
process.exit(failed ? 1 : 0);
