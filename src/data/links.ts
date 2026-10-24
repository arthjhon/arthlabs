// Links shown on links.arthlabs.dev. Deliberately independent from the
// contact page's list, so each page can evolve on its own.

export type LinkIcon = 'site' | 'blog' | 'github' | 'linkedin' | 'instagram' | 'globe' | 'mail';

export interface Link {
  label: string;
  handle: string;
  href: string;
  icon: LinkIcon;
  /** Suffix of the --brand-* token that colours the tile. */
  brand: 'site' | 'github' | 'linkedin' | 'instagram' | 'email';
}

export const links: Link[] = [
  { label: 'Site', handle: 'arthlabs.dev', href: 'https://arthlabs.dev', icon: 'site', brand: 'site' },
  { label: 'GitHub', handle: '@arthjhon', href: 'https://github.com/arthjhon', icon: 'github', brand: 'github' },
  { label: 'LinkedIn', handle: 'arthurjhonathas', href: 'https://www.linkedin.com/in/arthurjhonathas', icon: 'linkedin', brand: 'linkedin' },
  { label: 'Instagram', handle: '@arth.dev_', href: 'https://instagram.com/arth.dev_', icon: 'instagram', brand: 'instagram' },
  { label: 'Email', handle: 'contato@arthlabs.dev', href: 'mailto:contato@arthlabs.dev', icon: 'mail', brand: 'email' },
];

const svg = (inner: string) =>
  `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;

export const icons: Record<LinkIcon, string> = {
  site: `<svg viewBox="0 0 32 32" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2.5" y="9.5" width="27" height="13" rx="2.5"/><path d="M7 13.5V18.5M10.5 13.5V18.5M14 13.5V18.5"/><circle cx="24" cy="16" r="2.6" style="fill:var(--color-accent)" stroke="none"/></svg>`,
  blog: svg('<path d="M4 4h16v16H4z"/><line x1="8" y1="9" x2="16" y2="9"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="12" y2="17"/>'),
  github: svg('<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/>'),
  linkedin: svg('<rect x="3" y="3" width="18" height="18" rx="3"/><line x1="8" y1="11" x2="8" y2="16.5"/><line x1="8" y1="7.8" x2="8.01" y2="7.8"/><path d="M12 16.5V11m0 2.6c0-1.5 1-2.6 2.5-2.6s2.5 1 2.5 2.7v2.8"/>'),
  instagram: svg('<rect x="2.5" y="2.5" width="19" height="19" rx="5.5"/><circle cx="12" cy="12" r="4.2"/><line x1="17.4" y1="6.6" x2="17.41" y2="6.6"/>'),
  globe: svg('<circle cx="12" cy="12" r="9"/><line x1="3" y1="12" x2="21" y2="12"/><path d="M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18z"/>'),
  mail: svg('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 6.8 8.5 5.9 8.5-5.9"/>'),
};
