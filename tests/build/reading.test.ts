import { describe, it, expect } from 'vitest';
import { existsSync } from 'node:fs';
import { loadPage } from './helpers';

describe('project page', () => {
  const doc = loadPage('/projects/sentinela');

  it('has a meta block with status, stack, repo and demo', () => {
    const keys = doc.querySelectorAll('dl.meta-block dt').map((d) => d.text.trim());
    expect(keys).toEqual(expect.arrayContaining(['status', 'stack', 'repo', 'demo', 'data']));
  });

  it('renders body in .prose with a back link', () => {
    expect(doc.querySelector('article .prose')).not.toBeNull();
    expect(doc.querySelector('a.back')!.getAttribute('href')).toBe('/projects');
  });

  it('omits empty repo/demo entries (termsign)', () => {
    const ts = loadPage('/projects/termsign');
    const keys = ts.querySelectorAll('dl.meta-block dt').map((d) => d.text.trim());
    expect(keys).not.toContain('repo');
    expect(keys).not.toContain('demo');
  });
});

describe('post page', () => {
  it.skipIf(!existsSync('dist/blog/fixture-test/index.html'))('renders category, date and a TOC when there are 2+ headings', () => {
    const doc = loadPage('/blog/fixture-test');
    const keys = doc.querySelectorAll('dl.meta-block dt').map((d) => d.text.trim());
    expect(keys).toEqual(expect.arrayContaining(['categoria', 'data']));
    expect(doc.querySelectorAll('nav.toc a').length).toBe(2);
  });
});
