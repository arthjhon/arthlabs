import { readFileSync, existsSync, readdirSync } from 'node:fs';
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

function walk(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)],
  );
}

/**
 * Astro inlines small stylesheets into each page's <style>, so scan both
 * dist/_astro/*.css and inline <style> blocks (of one route, or of every page).
 */
export function readAllCss(route?: string): string {
  const files = walk(DIST);
  const htmls = route === undefined ? files.filter((f) => f.endsWith('.html')) : [fileFor(route)];
  return [
    ...files.filter((f) => f.endsWith('.css')).map((f) => readFileSync(f, 'utf8')),
    ...htmls.flatMap((f) =>
      [...readFileSync(f, 'utf8').matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map((m) => m[1]),
    ),
  ].join('\n');
}
