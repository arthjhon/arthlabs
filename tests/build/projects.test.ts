import { describe, it, expect } from 'vitest';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { loadPage } from './helpers';

const projectCount = readdirSync(join(process.cwd(), 'src/content/projects')).filter(
  (f) => f.endsWith('.mdx') && !f.startsWith('_'),
).length;

describe('/projects', () => {
  const doc = loadPage('/projects');

  it('groups by status in canonical order', () => {
    const heads = doc.querySelectorAll('main h2').map((h) => h.text.trim());
    expect(heads).toEqual(['Ativos', 'Em andamento', 'Arquivados']);
  });

  it('renders every project as a row linking to its page', () => {
    const rows = doc.querySelectorAll('li.project-row');
    expect(rows.length).toBe(projectCount);
    for (const row of rows) {
      expect(row.querySelector('h3 a')!.getAttribute('href')).toMatch(/^\/projects\/[\w-]+$/);
    }
  });

  it('shows status as symbol + text', () => {
    const badges = doc.querySelectorAll('.status').map((b) => b.text.replace(/\s+/g, ' ').trim());
    expect(badges).toContain('● ativo');
    expect(badges).toContain('◐ em andamento');
    expect(badges).toContain('○ arquivado');
  });

  it('never renders empty hrefs (TermSign has github/demo = "")', () => {
    expect(doc.querySelectorAll('a[href=""]').length).toBe(0);
    const termsign = doc.querySelectorAll('li.project-row').find((r) => r.text.includes('TermSign'))!;
    expect(termsign.querySelectorAll('a.ext').length).toBe(0);
  });

  it('has no client filter script left', () => {
    expect(doc.querySelector('[data-filter-bar]')).toBeNull();
  });
});

describe('project pages sanitization', () => {
  for (const slug of ['fecapees-cs2', 'sentinela']) {
    // Scan the article only: footer SVG path data can look like dotted quads.
    const html = loadPage(`/projects/${slug}`).querySelector('article')!.outerHTML;
    it(`/projects/${slug} leaks no network identifiers or banned terms`, () => {
      expect(html).not.toMatch(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/);
      expect(html).not.toContain('.ts.net');
      expect(html).not.toContain('SIM7000G');
      expect(html).not.toMatch(/\bRICA\b/);
    });
  }
});
