import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { contrastRatio, parseTokenBlock } from '../../src/lib/contrast';

const css = readFileSync('src/styles/tokens.css', 'utf8');
const light = parseTokenBlock(css, ':root[data-theme="light"]');
const dark = parseTokenBlock(css, ':root[data-theme="dark"]');
const darkMedia = parseTokenBlock(css, '@media (prefers-color-scheme: dark)');

const TEXT_TOKENS = ['--color-text', '--color-muted', '--color-accent', '--color-status-wip'];
const SURFACES = ['--color-bg', '--color-surface'];

describe('contrastRatio', () => {
  it('matches WCAG reference values', () => {
    expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 1);
    expect(contrastRatio('#FFFFFF', '#FFFFFF')).toBeCloseTo(1, 5);
  });
});

describe.each([
  ['light', light],
  ['dark', dark],
])('%s theme', (_name, theme) => {
  for (const fg of TEXT_TOKENS) {
    for (const bg of SURFACES) {
      it(`${fg} on ${bg} >= 4.5`, () => {
        expect(theme[fg], `${fg} missing`).toMatch(/^#[0-9A-Fa-f]{6}$/);
        expect(contrastRatio(theme[fg], theme[bg])).toBeGreaterThanOrEqual(4.5);
      });
    }
  }
  it('on-accent text on accent >= 4.5', () => {
    expect(contrastRatio(theme['--color-on-accent'], theme['--color-accent'])).toBeGreaterThanOrEqual(4.5);
  });
});

describe('no-JS dark fallback', () => {
  it('media-query dark block equals explicit dark block', () => {
    expect(darkMedia).toEqual(dark);
  });
});
