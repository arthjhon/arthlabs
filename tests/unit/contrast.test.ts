import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { contrastRatio, parseTokenBlock } from '../../src/lib/contrast';

const css = readFileSync('src/styles/tokens.css', 'utf8');
const tokens = parseTokenBlock(css, ':root');

const TEXT_TOKENS = ['--color-text', '--color-muted', '--color-accent', '--color-accent-2', '--color-danger'];
const SURFACES = ['--color-bg', '--color-surface'];

describe('contrastRatio', () => {
  it('matches WCAG reference values', () => {
    expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 1);
    expect(contrastRatio('#FFFFFF', '#FFFFFF')).toBeCloseTo(1, 5);
  });
});

describe('dark token set', () => {
  for (const fg of TEXT_TOKENS) {
    for (const bg of SURFACES) {
      it(`${fg} on ${bg} >= 4.5`, () => {
        expect(tokens[fg], `${fg} missing`).toMatch(/^#[0-9A-Fa-f]{6}$/);
        expect(contrastRatio(tokens[fg], tokens[bg])).toBeGreaterThanOrEqual(4.5);
      });
    }
  }
  it('on-accent text on accent >= 4.5', () => {
    expect(contrastRatio(tokens['--color-on-accent'], tokens['--color-accent'])).toBeGreaterThanOrEqual(4.5);
  });
  it('has no theme variants', () => {
    expect(css).not.toContain('data-theme');
    expect(css).not.toContain('prefers-color-scheme');
  });
});
