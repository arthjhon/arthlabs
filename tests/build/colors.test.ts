import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const dist = join(process.cwd(), 'dist');

function walk(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)],
  );
}

// Astro inlines small stylesheets into each page's <style>, so scan both
// dist/_astro/*.css and the inline <style> blocks of every built page.
const files = walk(dist);
const css = [
  ...files.filter((f) => f.endsWith('.css')).map((f) => readFileSync(f, 'utf8')),
  ...files
    .filter((f) => f.endsWith('.html'))
    .flatMap((f) => [...readFileSync(f, 'utf8').matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map((m) => m[1])),
].join('\n');

// Scoped selectors carry [data-astro-cid-*] attributes, so match by pattern.
function bodies(selector: RegExp): string[] {
  const out: string[] = [];
  for (const m of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    if (selector.test(m[1])) out.push(m[2]);
  }
  return out;
}

describe('color roles', () => {
  it.each([[/\.role(\[|\{|$|\s|,)/], [/\.kind(\[|\{|$|\s|,)/], [/nav[^,]*a[^,]*\[aria-current/]])('%s uses --color-accent-2', (sel) => {
    const found = bodies(sel);
    expect(found.length, `no rule for ${sel}`).toBeGreaterThan(0);
    expect(found.some((b) => b.includes('var(--color-accent-2)'))).toBe(true);
  });

  it('form error status uses --color-danger', () => {
    const found = bodies(/\.form-status[^,]*\[data-kind=err\]/);
    expect(found.length).toBeGreaterThan(0);
    expect(found.some((b) => b.includes('var(--color-danger)'))).toBe(true);
  });

  it('has no violet, text-shadow or repeating gradients', () => {
    expect(css).not.toMatch(/#(8b5cf6|a78bfa|7c3aed|c4b5fd)/i);
    expect(css).not.toMatch(/text-shadow/);
    expect(css).not.toMatch(/repeating-linear-gradient/);
  });
});
