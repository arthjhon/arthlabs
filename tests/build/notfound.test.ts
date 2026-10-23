import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'node-html-parser';

const file = join(process.cwd(), 'dist', '404.html');

describe('404 page', () => {
  it('is built to dist/404.html', () => {
    expect(existsSync(file)).toBe(true);
  });

  const page = () => parse(readFileSync(file, 'utf8'));

  it('has the h1 "Link fora do ar"', () => {
    expect(page().querySelector('h1')?.text.trim()).toBe('Link fora do ar');
  });

  it('links to home, projects and blog', () => {
    const hrefs = page().querySelectorAll('main a').map((a) => a.getAttribute('href'));
    expect(hrefs).toEqual(expect.arrayContaining(['/', '/projects', '/blog']));
  });

  it('shows the rack mark in the down state', () => {
    expect(page().querySelector('svg.rack-mark[data-state="down"]')).not.toBeNull();
  });
});
