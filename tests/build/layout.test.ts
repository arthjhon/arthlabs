import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it, expect } from 'vitest';
import { loadPage, readDist } from './helpers';

describe('layout shell', () => {
  const html = readDist('/');
  const doc = loadPage('/');

  it('is dark-only: no theme toggle or theme script', () => {
    expect(doc.querySelector('button[data-theme-toggle]')).toBeNull();
    const head = doc.querySelector('head')!.innerHTML;
    expect(head).not.toContain("localStorage.getItem('theme')");
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

  it('loads Archivo and no forbidden fonts', () => {
    const dir = join(process.cwd(), 'dist/_astro');
    const css = readdirSync(dir)
      .filter((f) => f.endsWith('.css'))
      .map((f) => readFileSync(join(dir, f), 'utf8'))
      .join('\n');
    expect(css).toContain('Archivo');
    expect(css).not.toMatch(/IBM Plex Sans|Space Grotesk|\bInter\b|Poppins|Instrument Serif/);
    expect(html).toMatch(/<link rel="preload"[^>]*archivo[^>]*as="font"/);
  });

  it('declares a single theme-color', () => {
    const metas = doc.querySelectorAll('meta[name="theme-color"]');
    expect(metas.length).toBe(1);
    expect(metas[0].getAttribute('content')).toBe('#070B14');
  });

  it('bare pages render without nav/footer', () => {
    const links = loadPage('/links');
    expect(links.querySelector('nav')).toBeNull();
    expect(links.querySelector('footer.site-footer')).toBeNull();
  });
});
