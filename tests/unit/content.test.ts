import { describe, it, expect } from 'vitest';
import {
  groupByStatus, pickFeatured, groupByCategory, projectLinks, isoDate, yearOf, byDateDesc,
} from '../../src/lib/content';

const d = (s: string) => new Date(`${s}T00:00:00Z`);

describe('groupByStatus', () => {
  it('orders groups active → wip → archived, skips empty, sorts by date desc', () => {
    const items = [
      { id: 'a', data: { status: 'archived' as const, date: d('2024-01-01') } },
      { id: 'b', data: { status: 'active' as const, date: d('2025-01-01') } },
      { id: 'c', data: { status: 'active' as const, date: d('2026-01-01') } },
    ];
    const groups = groupByStatus(items);
    expect(groups.map((g) => g.status)).toEqual(['active', 'archived']);
    expect(groups[0].items.map((i) => i.id)).toEqual(['c', 'b']);
  });
  it('returns [] for no items', () => {
    expect(groupByStatus([])).toEqual([]);
  });
});

describe('pickFeatured', () => {
  it('keeps featured only, newest first, capped at the limit', () => {
    const items = [1, 2, 3, 4, 5, 6].map((n) => ({
      id: String(n),
      data: { featured: n !== 2, date: d(`202${n}-01-01`) },
    }));
    expect(pickFeatured(items).map((i) => i.id)).toEqual(['6', '5', '4', '3']);
    expect(pickFeatured(items, 2).map((i) => i.id)).toEqual(['6', '5']);
  });
  it('returns [] when nothing is featured', () => {
    expect(pickFeatured([{ data: { featured: false, date: d('2026-01-01') } }])).toEqual([]);
  });
});

describe('groupByCategory', () => {
  it('follows CATEGORIES order and skips empty categories', () => {
    const items = [
      { id: 'x', data: { category: 'iot' as const, date: d('2026-01-01') } },
      { id: 'y', data: { category: 'infra' as const, date: d('2025-01-01') } },
      { id: 'z', data: { category: 'infra' as const, date: d('2026-02-01') } },
    ];
    const groups = groupByCategory(items);
    expect(groups.map((g) => g.category)).toEqual(['infra', 'iot']);
    expect(groups[0].items.map((i) => i.id)).toEqual(['z', 'y']);
  });
});

describe('projectLinks', () => {
  it('treats empty strings and whitespace as absent', () => {
    expect(projectLinks({ data: { github: '', demo: '  ' } })).toEqual([]);
    expect(projectLinks({ data: {} })).toEqual([]);
  });
  it('returns repo then demo', () => {
    expect(projectLinks({ data: { github: 'https://g.example/r', demo: 'https://d.example' } })).toEqual([
      { kind: 'repo', href: 'https://g.example/r' },
      { kind: 'demo', href: 'https://d.example' },
    ]);
  });
});

describe('dates', () => {
  it('formats in UTC', () => {
    expect(isoDate(d('2026-01-15'))).toBe('2026-01-15');
    expect(yearOf(d('2026-01-01'))).toBe(2026);
  });
  it('byDateDesc sorts newest first', () => {
    const a = { data: { date: d('2025-01-01') } };
    const b = { data: { date: d('2026-01-01') } };
    expect([a, b].sort(byDateDesc)).toEqual([b, a]);
  });
});
