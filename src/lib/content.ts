// Pure content helpers. No `astro:*` imports, so they stay unit-testable.

export const CATEGORIES = ['infra', 'redes', 'monitoramento', 'iot', 'automacao'] as const;
export type Category = (typeof CATEGORIES)[number];

export const STATUS_ORDER = ['active', 'wip', 'archived'] as const;
export type Status = (typeof STATUS_ORDER)[number];

export function byDateDesc<T extends { data: { date: Date } }>(a: T, b: T): number {
  return b.data.date.getTime() - a.data.date.getTime();
}

function groupBy<K extends string, T extends { data: { date: Date } }>(
  order: readonly K[],
  items: T[],
  key: (item: T) => K,
): { key: K; items: T[] }[] {
  return order
    .map((k) => ({ key: k, items: items.filter((i) => key(i) === k).sort(byDateDesc) }))
    .filter((g) => g.items.length > 0);
}

export function groupByStatus<T extends { data: { status: Status; date: Date } }>(items: T[]) {
  return groupBy(STATUS_ORDER, items, (i) => i.data.status).map((g) => ({ status: g.key, items: g.items }));
}

export function groupByCategory<T extends { data: { category: Category; date: Date } }>(items: T[]) {
  return groupBy(CATEGORIES, items, (i) => i.data.category).map((g) => ({ category: g.key, items: g.items }));
}

export function pickFeatured<T extends { data: { featured: boolean; date: Date } }>(items: T[], limit = 4): T[] {
  return items.filter((i) => i.data.featured).sort(byDateDesc).slice(0, limit);
}

export interface ProjectLink {
  kind: 'repo' | 'demo';
  href: string;
}

export function projectLinks(p: { data: { github?: string; demo?: string } }): ProjectLink[] {
  const out: ProjectLink[] = [];
  const repo = p.data.github?.trim();
  const demo = p.data.demo?.trim();
  if (repo) out.push({ kind: 'repo', href: repo });
  if (demo) out.push({ kind: 'demo', href: demo });
  return out;
}

export function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function yearOf(d: Date): number {
  return d.getUTCFullYear();
}
