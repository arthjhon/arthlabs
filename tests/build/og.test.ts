import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { loadPage } from './helpers';

describe('share image', () => {
  it('og:image points to the PNG', () => {
    const content = loadPage('/').querySelector('meta[property="og:image"]')!.getAttribute('content')!;
    expect(content.endsWith('/og-default.png')).toBe(true);
  });

  it('declares 1200x630', () => {
    const doc = loadPage('/');
    expect(doc.querySelector('meta[property="og:image:width"]')!.getAttribute('content')).toBe('1200');
    expect(doc.querySelector('meta[property="og:image:height"]')!.getAttribute('content')).toBe('630');
  });

  it('public/og-default.png is a 1200x630 PNG and the SVG is gone', () => {
    const buf = readFileSync('public/og-default.png');
    expect(buf.readUInt32BE(16)).toBe(1200);
    expect(buf.readUInt32BE(20)).toBe(630);
    expect(existsSync('public/og-default.svg')).toBe(false);
  });
});
