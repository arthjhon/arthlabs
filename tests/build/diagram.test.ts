import { describe, it, expect } from 'vitest';
import { loadPage } from './helpers';

describe('homelab diagram', () => {
  const doc = loadPage('/');
  const svgs = doc.querySelectorAll('figure.diagram svg');

  it('renders full and compact accessible SVGs', () => {
    expect(svgs.length).toBe(2);
    for (const svg of svgs) {
      expect(svg.getAttribute('role')).toBe('img');
      expect(svg.querySelector('title')!.text.trim().length).toBeGreaterThan(0);
      expect(svg.querySelector('desc')!.text.trim().length).toBeGreaterThan(0);
    }
  });

  it('is sanitized: no IPs, VLAN ids, hostnames, products or orgs', () => {
    const text = svgs.map((s) => s.toString()).join('\n');
    expect(text).not.toMatch(/\b\d{1,3}(\.\d{1,3}){3}\b/);              // IPv4
    expect(text).not.toMatch(/vlan\s*\d+/i);
    expect(text).not.toMatch(/\.(local|lan|home|internal)\b/i);
    expect(text).not.toMatch(/teranex|umj|pfsense|opnsense|proxmox|truenas|zabbix|grafana|influx|esp32/i);
  });

  it('uses theme tokens, not raw colors', () => {
    const text = svgs.map((s) => s.toString()).join('\n');
    expect(text).not.toMatch(/(fill|stroke)="#[0-9a-f]{3,6}"/i);
  });
});
