import { describe, it, expect } from 'vitest';
import { loadPage, readAllCss, readDist } from './helpers';

function rules(css: string): { selector: string; body: string }[] {
  // Flatten nested @media blocks well enough for simple assertions.
  const flat = css.replace(/@media[^{]*\{/g, '').replace(/\}\s*\}/g, '}');
  return [...flat.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map((m) => ({
    selector: m[1].trim(),
    body: m[2].replace(/\s+/g, ''),
  }));
}

describe('motion', () => {
  const css = readAllCss();

  it('hides [data-reveal] only under .js', () => {
    const hiding = rules(css).filter((r) => r.selector.includes('data-reveal') && /opacity:0(;|$)/.test(r.body));
    expect(hiding.length).toBeGreaterThan(0);
    for (const r of hiding) {
      for (const sel of r.selector.split(',')) expect(sel.trim()).toMatch(/^\.js[\s\[.]/);
    }
  });

  it('neutralises reveal under prefers-reduced-motion', () => {
    const m = css.match(/@media\s*\(prefers-reduced-motion:\s*\s*reduce\)\s*\{[\s\S]*?\}\s*\}/g) ?? [];
    const block = m.join('').replace(/\s+/g, '');
    expect(block).toMatch(/data-reveal[^{]*\{[^}]*opacity:1/);
    expect(block).toMatch(/data-reveal[^{]*\{[^}]*transform:none/);
  });

  it('inlines the reveal module in the page', () => {
    const html = readDist('/');
    expect(html).toContain('is-revealed');
    expect(html).toContain('[data-reveal]:not(.is-revealed)');
  });

  it('keeps reveal visible when printing', () => {
    expect(css.replace(/\s+/g, '')).toMatch(/@mediaprint\{[^@]*data-reveal[^}]*opacity:1/);
  });

  it('marks home content for reveal with stagger index', () => {
    const home = loadPage('/');
    expect(home.querySelectorAll('[data-reveal]').length).toBeGreaterThanOrEqual(3);
    const staggered = home.querySelectorAll('[data-reveal-stagger] > [data-reveal]');
    expect(staggered.length).toBeGreaterThan(0);
    for (const el of staggered) expect(el.getAttribute('style')).toMatch(/--i:\d+/);
  });

  it('gates the hero intro under .js', () => {
    const intro = rules(css).filter((r) => /hero/.test(r.selector) && /animation/.test(r.body));
    expect(intro.length).toBeGreaterThan(0);
    for (const r of intro) for (const sel of r.selector.split(',')) expect(sel.trim()).toMatch(/^\.js[\s.]/);
  });
});
