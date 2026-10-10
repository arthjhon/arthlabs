import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { parse, type HTMLElement } from 'node-html-parser';

const DIST = join(process.cwd(), 'dist');

function fileFor(route: string): string {
  const clean = route.replace(/^\/+|\/+$/g, '');
  return clean === '' ? join(DIST, 'index.html') : join(DIST, clean, 'index.html');
}

export function readDist(route: string): string {
  const file = fileFor(route);
  if (!existsSync(file)) throw new Error(`not built: ${file} (run npm run build)`);
  return readFileSync(file, 'utf8');
}

export function loadPage(route: string): HTMLElement {
  return parse(readDist(route));
}
