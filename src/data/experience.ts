// Source: previous about.astro + Skills.astro. Do not invent history —
// fields marked TODO(arthur) must be filled before production deploy.

export type StackContext = 'producao' | 'pme' | 'homelab';

export interface TimelineEntry {
  period: string;
  role: string;
  org: string;
  summary: string;
}

export interface StackRow {
  area: string;
  tools: string[];
  context: StackContext[];
}

export const timeline: TimelineEntry[] = [
  {
    period: 'TODO(arthur): ano de início – atual',
    role: 'Fundador',
    org: 'TeraNex Tecnologia',
    summary: 'Infraestrutura e suporte gerenciado para PMEs em Maceió/AL.',
  },
  {
    period: 'em curso',
    role: 'Graduação',
    org: 'Engenharia de Computação',
    summary: 'Maceió/AL.',
  },
];

// TODO(arthur): classify each row's context (producao / pme / homelab).
export const stack: StackRow[] = [
  { area: 'Redes e firewall', tools: ['pfSense', 'VLANs', 'NAT/DHCP', 'OpenVPN', 'Cisco / CCNA', 'Site-to-Site'], context: [] },
  { area: 'Virtualização', tools: ['Proxmox VE', 'VMs / Templates', 'Virtualização de firewall'], context: [] },
  { area: 'Containers e DevOps', tools: ['Docker', 'Portainer', 'MACVLAN', 'CI/CD'], context: [] },
  { area: 'Cloud', tools: ['AWS', 'GCP', 'Cloudflare', 'SSH', 'DNS / domínios'], context: [] },
  { area: 'Segurança e acesso', tools: ['OpenVPN + AD', 'SSH keys', 'Linux ACL', 'Segmentação de rede'], context: [] },
  { area: 'Servidores', tools: ['Ubuntu / Debian', 'GLPI', 'TrueNAS', 'Active Directory', 'Samba / SMB'], context: [] },
  { area: 'Observabilidade', tools: ['Zabbix', 'Grafana', 'InfluxDB', 'Alertas customizados'], context: [] },
  { area: 'Automação', tools: ['Python', 'Bash', 'Bots Discord/Telegram', 'autounattend.xml', 'winget'], context: [] },
  { area: 'Web', tools: ['TypeScript', 'Astro / Vite', 'Node.js', 'Deploy de frontend'], context: [] },
];

export const homelab: { label: string; value: string }[] = [
  { label: 'hypervisor', value: 'Proxmox VE' },
  { label: 'firewall', value: 'pfSense (virtualizado)' },
  { label: 'monitoring', value: 'Zabbix + Grafana + InfluxDB' },
  { label: 'storage', value: 'TrueNAS' },
  { label: 'identity', value: 'Samba4 AD' },
  { label: 'containers', value: 'Docker + Portainer' },
  { label: 'helpdesk', value: 'GLPI' },
  { label: 'remote', value: 'OpenVPN + AD auth' },
];
