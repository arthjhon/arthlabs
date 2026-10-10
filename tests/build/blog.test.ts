import { describe, it, expect } from 'vitest';
import { loadPage } from './helpers';

describe('/blog', () => {
  const doc = loadPage('/blog');

  it('has a page heading', () => {
    expect(doc.querySelector('main h1')!.text.trim()).toBe('Blog');
  });

  it('shows the empty state when there are no published posts', () => {
    const posts = doc.querySelectorAll('ul.post-list li');
    if (posts.length === 0) {
      expect(doc.querySelector('.empty')!.text).toContain('Nenhum post publicado');
    } else {
      expect(doc.querySelectorAll('main h2').length).toBeGreaterThan(0);
    }
  });

  it('has no leftover terminal prompt', () => {
    expect(doc.text).not.toContain('$ ls');
  });
});
