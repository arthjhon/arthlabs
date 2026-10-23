import { describe, it, expect } from 'vitest';
import { loadPage, readDist } from './helpers';

describe('home', () => {
  const doc = loadPage('/');
  const html = readDist('/');

  it('hero states who and what in the h1 + role', () => {
    expect(doc.querySelector('main h1')!.text).toContain('Arthur Jhonathas');
    expect(doc.querySelector('.hero .role')!.text).toContain('Infra & SysAdmin');
  });

  it('has one primary CTA to projects and a secondary to contact', () => {
    expect(doc.querySelector('.hero a.button')!.getAttribute('href')).toBe('/projects');
    expect(doc.querySelector('.hero a.button-ghost')!.getAttribute('href')).toBe('/contact');
  });

  it('lists up to 4 featured projects', () => {
    const rows = doc.querySelectorAll('li.project-row');
    expect(rows.length).toBeGreaterThan(0);
    expect(rows.length).toBeLessThanOrEqual(4);
  });

  it('shows the proof strip with 4 items', () => {
    const items = doc.querySelectorAll('ul.proof li');
    expect(items.length).toBe(4);
    expect(items[0].text).toContain('3+ anos');
  });

  it('shows the Now list', () => {
    expect(doc.querySelectorAll('.now li').length).toBeGreaterThan(0);
  });

  it('omits the writing section when there are no published posts', () => {
    const hasPosts = doc.querySelectorAll('ul.post-list li').length > 0;
    const heads = doc.querySelectorAll('main h2').map((h) => h.text.trim());
    expect(heads.includes('Escritos recentes')).toBe(hasPosts);
  });

  it('has none of the old terminal/neon artifacts', () => {
    expect(html).not.toContain('data-cycle');
    expect(html).not.toContain('hero-glow');
    expect(html).not.toContain('grid-bg');
    expect(html).not.toMatch(/text-shadow|box-shadow:\s*0 0 \d+px/);
  });
});
