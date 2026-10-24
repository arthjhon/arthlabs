import { describe, it, expect } from 'vitest';
import { loadPage } from './helpers';
import { readdirSync, readFileSync } from 'node:fs';
import { links } from '../../src/data/links';
import { highlights } from '../../src/data/highlights';
import { t } from '../../src/i18n/pt';
import { readAllCss } from './helpers';

describe('/contact', () => {
  const doc = loadPage('/contact');

  it('keeps the form contract with the worker', () => {
    const form = doc.querySelector('form#contact-form')!;
    expect(form.getAttribute('action')).toBe('/api/contact');
    expect(form.getAttribute('method')).toBe('POST');
    for (const name of ['name', 'email', 'message', 'company']) {
      expect(form.querySelector(`[name="${name}"]`), name).not.toBeNull();
    }
    expect(form.querySelector('[name="message"]')!.getAttribute('maxlength')).toBe('5000');
  });

  it('every visible field has a real label', () => {
    for (const id of ['name', 'email', 'message']) {
      expect(doc.querySelector(`label[for="${id}"]`)!.text.trim()).not.toMatch(/^\/\//);
    }
  });

  it('status region is announced', () => {
    expect(doc.querySelector('#form-status')!.getAttribute('aria-live')).toBe('polite');
  });
});

describe('/links', () => {
  const doc = loadPage('/links');
  const featuredSlugs = readdirSync('src/content/projects')
    .filter((f) => f.endsWith('.mdx') && /^featured:\s*true\s*$/m.test(readFileSync(`src/content/projects/${f}`, 'utf8')))
    .map((f) => f.replace(/\.mdx$/, ''));
  const expectedCards = highlights.length + Math.min(featuredSlugs.length, 4);

  it('renders every link as a tile, without gradient frame or prompt', () => {
    expect(doc.querySelectorAll('a.link-tile').length).toBe(links.length);
    expect(doc.text).not.toContain('$ whoami');
  });

  it('renders exactly 5 tiles, without Blog', () => {
    const tiles = doc.querySelectorAll('a.link-tile');
    expect(tiles.length).toBe(5);
    for (const a of tiles) {
      expect(a.text).not.toContain('Blog');
      expect(a.getAttribute('href')).not.toMatch(/\/blog/);
    }
  });

  it('first tile is the rack mark (svg with LED circle)', () => {
    expect(doc.querySelector('a.link-tile svg circle')).not.toBeNull();
    const first = doc.querySelectorAll('a.link-tile')[0];
    expect(first.querySelector('svg circle')).not.toBeNull();
  });

  it('each tile maps to a brand token', () => {
    for (const a of doc.querySelectorAll('a.link-tile')) {
      expect(a.getAttribute('style') ?? '').toMatch(/--c:\s*var\(--brand-/);
    }
  });

  it('renders the bio under the role', () => {
    expect(doc.querySelector('p.bio')!.text.trim()).toBe(t.links.bio);
  });

  it('dots are 44px tap targets and arrows are labelled', () => {
    const css = readAllCss('/links').replace(/\s+/g, '');
    expect(css).toMatch(/\.dot[^{]*\{[^}]*width:44px/);
    expect(css).toMatch(/\.dot[^{]*\{[^}]*height:44px/);
    expect(doc.querySelector(`button[aria-label="${t.links.prev}"]`)).not.toBeNull();
    expect(doc.querySelector(`button[aria-label="${t.links.next}"]`)).not.toBeNull();
  });

  it('has no theme toggle and carries the rack mark', () => {
    expect(doc.querySelector('button[data-theme-toggle]')).toBeNull();
    expect(doc.querySelector('svg.rack-mark')).not.toBeNull();
  });

  it('name uses the display style', () => {
    expect(doc.querySelector('h1')!.classList.contains('display')).toBe(true);
  });

  it('tiles are named by their label', () => {
    for (const l of links) {
      expect(doc.querySelector(`a.link-tile[href="${l.href}"]`)!.text).toContain(l.label);
    }
  });

  it('carousel holds manual highlights first, then featured projects', () => {
    const cards = doc.querySelectorAll('.carousel .card');
    expect(cards.length).toBe(expectedCards);
    const projectHrefs = cards
      .slice(highlights.length)
      .map((c) => c.querySelector('a.button')!.getAttribute('href'));
    for (const href of projectHrefs) {
      expect(href).toMatch(/^https:\/\/arthlabs\.dev\/projects\/[a-z0-9-]+$/);
      expect(featuredSlugs).toContain(href!.split('/').pop());
    }
  });

  it('carousel is a keyboard-reachable labelled region', () => {
    const track = doc.querySelector('.carousel-track')!;
    expect(track.getAttribute('tabindex')).toBe('0');
    expect(track.getAttribute('role')).toBe('region');
    const labelledBy = track.getAttribute('aria-labelledby');
    const name = track.getAttribute('aria-label') ?? (labelledBy && doc.querySelector(`#${labelledBy}`)?.text);
    expect(name).toBeTruthy();
  });

  it('shows the referral notice only when a highlight is an affiliate link', () => {
    const hasAffiliate = highlights.some((h) => h.affiliate);
    expect(doc.querySelector('.affiliate-note') !== null).toBe(hasAffiliate);
    for (const a of doc.querySelectorAll('.carousel a[rel~="sponsored"]')) {
      expect(a.getAttribute('rel')).toContain('noopener');
    }
  });
});
