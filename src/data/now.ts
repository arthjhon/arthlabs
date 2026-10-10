export type NowKind = 'building' | 'running' | 'learning';

export interface NowItem {
  kind: NowKind;
  text: string;
}

/** Update by hand; bump nowUpdated whenever the list changes. */
export const nowUpdated = '2026-10';

export const now: NowItem[] = [
  { kind: 'building', text: 'Sentinela — telemetria celular SIM7000G + MQTT' },
  { kind: 'building', text: 'TeraNex Vault — armazenamento seguro para PMEs' },
  { kind: 'running', text: 'Homelab Proxmox + pfSense + Zabbix em produção 24/7' },
  { kind: 'learning', text: 'Engenharia de Computação · Maceió/AL' },
];
