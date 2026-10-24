import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const astroDir = join(process.cwd(), 'dist', '_astro');
const css = readdirSync(astroDir)
  .filter((f) => f.endsWith('.css'))
  .map((f) => readFileSync(join(astroDir, f), 'utf8'))
  .join('\n');

describe('section-head before lists', () => {
  it('drops its border when followed by project-list or post-list', () => {
    const m = css.match(/\.section-head:has\(([^)]*)\)\{([^}]*)\}/);
    expect(m, 'rule .section-head:has(...) missing in built CSS').not.toBeNull();
    expect(m![1]).toContain('.project-list');
    expect(m![1]).toContain('.post-list');
    expect(m![2]).toMatch(/border-bottom:\s*0/);
  });
});
