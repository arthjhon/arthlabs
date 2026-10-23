import { describe, it, expect } from 'vitest';
import { readAllCss, readDist } from './helpers';

const css = readAllCss();

function rules(selector: RegExp): string[] {
  const out: string[] = [];
  for (const m of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    if (selector.test(m[1])) out.push(m[2]);
  }
  return out;
}

function mediaBlock(query: RegExp): string {
  const out: string[] = [];
  for (const m of css.matchAll(/@media([^{]+)\{((?:[^{}]*\{[^{}]*\})*[^{}]*)\}/g)) {
    if (query.test(m[1])) out.push(m[2]);
  }
  return out.join('\n');
}

describe('atmosphere', () => {
  it('body::before is a diffuse glow of radial gradients using --color-glow', () => {
    const found = rules(/body::?before/);
    expect(found.length).toBeGreaterThan(0);
    expect(found.some((b) => b.includes('radial-gradient') && b.includes('var(--color-glow)'))).toBe(true);
  });

  it('body::after cursor light follows --mx/--my', () => {
    const found = rules(/body::?after/);
    expect(found.some((b) => b.includes('var(--mx') && b.includes('var(--my'))).toBe(true);
  });

  it('cursor light is off for coarse pointers and reduced motion', () => {
    for (const q of [/pointer:\s*coarse/, /prefers-reduced-motion:\s*reduce/]) {
      const block = mediaBlock(q);
      expect(block, `no @media ${q}`).toMatch(/body::?after[^{}]*\{[^{}]*(display:\s*none|opacity:\s*0)/);
    }
  });

  it('nav is translucent with a blur', () => {
    const found = rules(/\.site-header/);
    expect(found.some((b) => /backdrop-filter:\s*blur/.test(b))).toBe(true);
    expect(found.some((b) => /color-mix\(/.test(b))).toBe(true);
  });

  it('home inlines a passive pointermove listener, skipped under reduced motion', () => {
    const html = readDist('/');
    const script = [...html.matchAll(/<script is:inline[^>]*>|<script[^>]*>([\s\S]*?)<\/script>/g)]
      .map((m) => m[1] ?? '')
      .find((s) => s.includes('pointermove'));
    expect(script, 'no inline pointermove script').toBeTruthy();
    expect(script).toMatch(/passive:\s*true/);
    expect(script).toContain('(prefers-reduced-motion: reduce)');
    expect(script).toContain('__pointerBound');
  });

  it('project rows expose a hover light via --rx/--ry', () => {
    const found = rules(/\.project-row/);
    expect(found.some((b) => b.includes('var(--rx') && b.includes('var(--ry'))).toBe(true);
  });
});
