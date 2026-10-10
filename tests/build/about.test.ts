import { describe, it, expect } from 'vitest';
import { loadPage } from './helpers';

describe('/about', () => {
  const doc = loadPage('/about');

  it('has name h1 and section headings in order', () => {
    expect(doc.querySelector('main h1')!.text).toContain('Arthur Jhonathas');
    const heads = doc.querySelectorAll('main h2').map((h) => h.text.trim());
    expect(heads).toEqual(['Experiência', 'Stack', 'Homelab']);
  });

  it('renders the stack as a table with headers', () => {
    expect(doc.querySelectorAll('table.stack-table th[scope="col"]').length).toBe(3);
    expect(doc.querySelectorAll('table.stack-table tbody tr').length).toBe(9);
  });

  it('renders the timeline as an ordered list', () => {
    expect(doc.querySelectorAll('ol.timeline > li').length).toBeGreaterThan(0);
  });

  it('has no skills grid or prompt leftovers', () => {
    expect(doc.querySelector('.skills-wrap')).toBeNull();
    expect(doc.text).not.toContain('$ whoami');
  });
});
