import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { loadPage, readDist } from './helpers';

const astroDir = join(process.cwd(), 'dist', '_astro');
const allCss = readdirSync(astroDir)
  .filter((f) => f.endsWith('.css'))
  .map((f) => readFileSync(join(astroDir, f), 'utf8'))
  .join('\n');

describe('layout shell', () => {
  const html = readDist('/');
  const doc = loadPage('/');

  it('sets theme before paint and re-applies after soft navigation', () => {
    const head = doc.querySelector('head')!.innerHTML;
    expect(head).toContain("localStorage.getItem('theme')");
    expect(head).toContain('astro:after-swap');
  });

  it('has a theme toggle with aria-pressed, hidden without JS', () => {
    const btn = doc.querySelector('button[data-theme-toggle]');
    expect(btn).not.toBeNull();
    expect(btn!.getAttribute('aria-label')).toBe('Tema escuro');
    expect(allCss).toMatch(/\.js \.theme-toggle|\.js\s+\.theme-toggle/);
  });

  it('marks the current nav item with aria-current', () => {
    const about = loadPage('/about');
    const current = about.querySelectorAll('nav a[aria-current="page"]');
    expect(current.length).toBe(1);
    expect(current[0].getAttribute('href')).toBe('/about');
  });

  it('does not load Google Fonts or Sora', () => {
    expect(html).not.toContain('fonts.googleapis.com');
    expect(html.toLowerCase()).not.toContain('sora');
  });

  it('declares theme-color for both schemes', () => {
    expect(doc.querySelectorAll('meta[name="theme-color"]').length).toBe(2);
  });

  it('bare pages render without nav/footer', () => {
    const links = loadPage('/links');
    expect(links.querySelector('nav')).toBeNull();
    expect(links.querySelector('footer.site-footer')).toBeNull();
  });
});
