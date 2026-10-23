import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { loadPage } from './helpers';

const pub = (f: string) => join(process.cwd(), 'public', f);

describe('brand', () => {
  it('nav logo renders the rack mark', () => {
    const logo = loadPage('/').querySelector('.site-header .logo');
    expect(logo).not.toBeNull();
    const svg = logo!.querySelector('svg.rack-mark');
    expect(svg, 'svg.rack-mark missing').not.toBeNull();
    expect(svg!.querySelectorAll('circle')).toHaveLength(1);
    expect(svg!.querySelectorAll('rect')).toHaveLength(1);
    expect(logo!.getAttribute('aria-label')).toBeTruthy();
  });

  it('favicon.svg uses the v2 palette only', () => {
    const svg = readFileSync(pub('favicon.svg'), 'utf8');
    expect(svg).toContain('#F5A524');
    expect(svg).toContain('#7CC4FF');
    expect(svg).not.toContain('#00ff88');
    expect(svg).not.toContain('#00d4ff');
  });

  it('favicon.ico exists and is small', () => {
    expect(existsSync(pub('favicon.ico'))).toBe(true);
    expect(statSync(pub('favicon.ico')).size).toBeLessThan(16 * 1024);
  });
});
