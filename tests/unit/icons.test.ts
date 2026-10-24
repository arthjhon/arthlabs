import { describe, it, expect } from 'vitest';
import { icons } from '../../src/data/links';

describe('icons', () => {
  for (const [name, svg] of Object.entries(icons)) {
    it(`${name} is an outline glyph`, () => {
      expect(svg).toContain('stroke="currentColor"');
      expect(svg).toContain('stroke-width="1.75"');
      expect(svg).not.toContain('fill="currentColor"');
    });
  }
});
