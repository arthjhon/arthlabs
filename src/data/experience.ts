// Source: CV (2026-09) and project documents. Do not invent history.

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
    period: 'abr/2026 – atual',
    role: 'Coordenador técnico',
    org: 'Projeto Sentinela (UMJ)',
    summary:
      'Arquitetura, infraestrutura, operação e frontend da plataforma IoT de monitoramento da qualidade da água no Complexo Estuarino-Lagunar Mundaú-Manguaba.',
  },
  {
    period: 'jul/2026 – set/2026',
    role: 'Prestação de serviço de infraestrutura',
    org: 'FECAPEES',
    summary: 'Servidores dedicados de CS2 para campeonatos: provisionamento, hardening, backup com restore validado e documentação.',
  },
  {
    period: 'out/2025 – set/2026',
    role: 'Estagiário de Infraestrutura de TI',
    org: 'UMJ / FAPEC',
    summary:
      'Firewall, VPNs, rede, virtualização e gestão de endpoints da instituição: ~219 computadores no Tactical RMM, 3 sites interligados por IPsec, 161 computadores inativos desativados no AD e 13 switches auditados. A 1ª etapa foi como bolsista do OxeTech Work (FAPEAL).',
  },
  {
    period: 'jul/2023 – jul/2025',
    role: 'Estagiário de TI (DTI)',
    org: 'Tribunal de Contas do Estado de Alagoas',
    summary: 'Suporte de 1º e 2º nível, inventário, contas no AD e apoio de rede.',
  },
  {
    period: 'jan/2022 – jun/2023',
    role: 'Jovem Aprendiz',
    org: 'Tribunal de Contas do Estado de Alagoas',
    summary: 'Apoio à análise de prestações de contas e relatórios.',
  },
  {
    period: 'previsão dez/2026',
    role: 'Engenharia da Computação',
    org: 'Centro Universitário Mário Pontes Jucá (UMJ)',
    summary: '10º período. Cursos Cisco Networking Academy (2025); CCNA em andamento.',
  },
];

export const stack: StackRow[] = [
  {
    area: 'Redes e firewall',
    tools: ['pfSense', 'OPNsense', 'UniFi', '802.1X/RADIUS', 'VLANs', 'NAT/DHCP', 'Cisco / CCNA', 'Site-to-Site'],
    context: ['producao', 'homelab'],
  },
  { area: 'VPN', tools: ['WireGuard', 'IPsec site-to-site', 'OpenVPN', 'Tailscale'], context: ['producao', 'homelab'] },
  { area: 'Virtualização', tools: ['Proxmox VE', 'VMs / Templates', 'Virtualização de firewall'], context: ['producao', 'homelab'] },
  { area: 'Containers e DevOps', tools: ['Docker', 'Portainer', 'MACVLAN', 'CI/CD'], context: ['producao', 'homelab'] },
  { area: 'Cloud e borda', tools: ['Cloudflare (Tunnel, Access, LB)', 'Hetzner', 'AWS', 'GCP', 'SSH', 'DNS / domínios'], context: ['producao'] },
  { area: 'Segurança e acesso', tools: ['OpenVPN + AD', 'SSH keys', 'Linux ACL', 'Segmentação de rede'], context: ['producao', 'homelab'] },
  {
    area: 'Servidores',
    tools: ['Ubuntu / Debian', 'GLPI', 'TrueNAS', 'Active Directory', 'Samba AD DC', 'Samba / SMB', 'Windows Server'],
    context: ['producao', 'homelab'],
  },
  {
    area: 'Gestão de endpoints',
    tools: ['Tactical RMM', 'PXE/Clonezilla', 'autounattend.xml', 'winget', 'Google Workspace'],
    context: ['producao'],
  },
  { area: 'Observabilidade', tools: ['Zabbix', 'Grafana', 'InfluxDB', 'Telegraf', 'Alertas customizados'], context: ['producao', 'homelab'] },
  { area: 'Automação', tools: ['Python', 'FastAPI', 'Bash', 'Bots Discord/Telegram'], context: ['producao'] },
  { area: 'Web', tools: ['TypeScript', 'React/Vite', 'Astro / Vite', 'Electron', 'Node.js', 'Deploy de frontend'], context: ['producao'] },
  { area: 'IoT', tools: ['ESP32-S3', 'MQTT/TLS', 'Supabase', 'OTA'], context: ['producao'] },
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
