import { describe, it, expect } from 'vitest';
import { readAllCss } from './helpers';

const css = readAllCss();
const ROUTES = ['/', '/about', '/links'];

// Scoped selectors carry [data-astro-cid-*] attributes, so match by pattern.
function bodies(selector: RegExp, source: string = css): string[] {
  const out: string[] = [];
  for (const m of source.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    if (selector.test(m[1])) out.push(m[2]);
  }
  return out;
}

describe('color roles', () => {
  it.each([[/nav[^,]*a[^,]*\[aria-current/]])('%s uses --color-accent-2', (sel) => {
    const found = bodies(sel);
    expect(found.length, `no rule for ${sel}`).toBeGreaterThan(0);
    expect(found.some((b) => b.includes('var(--color-accent-2)'))).toBe(true);
  });

  it.each([[/\.role(\[|\{|$|\s|,)/], [/\.kind(\[|\{|$|\s|,)/]])('every %s color rule uses --color-accent-2', (sel) => {
    const colored = ROUTES.flatMap((r) => bodies(sel, readAllCss(r))).filter((b) => /(^|;)\s*color\s*:/.test(b));
    expect(colored.length, `no color rule for ${sel}`).toBeGreaterThan(0);
    for (const b of colored) expect(b).toMatch(/(^|;)\s*color\s*:\s*var\(--color-accent-2\)/);
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
