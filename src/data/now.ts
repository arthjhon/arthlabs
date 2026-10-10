export type NowKind = 'building' | 'running' | 'learning';

export interface NowItem {
  kind: NowKind;
  text: string;
}

/** Update by hand; bump nowUpdated whenever the list changes. */
export const now: NowItem[] = [
  { kind: 'building', text: 'Sentinela — calibração dos sensores, caixa estanque e piloto na Lagoa Mundaú (out–nov/2026)' },
  { kind: 'building', text: 'Artigo científico sobre o Sentinela — reta final para publicação' },
  { kind: 'running', text: 'Homelab Proxmox + pfSense + Zabbix em produção 24/7' },
  { kind: 'learning', text: 'Engenharia da Computação — 10º período, conclusão em dez/2026 · CCNA em andamento' },
];
