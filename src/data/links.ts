// Links shown on links.arthlabs.dev. Deliberately independent from the
// contact page's list, so each page can evolve on its own.

export type LinkIcon = 'site' | 'blog' | 'github' | 'linkedin' | 'instagram' | 'globe' | 'mail';

export interface Link {
  label: string;
  handle: string;
  href: string;
  icon: LinkIcon;
}

export const links: Link[] = [
  { label: 'Site', handle: 'arthlabs.dev', href: 'https://arthlabs.dev', icon: 'site' },
  { label: 'Blog', handle: 'arthlabs.dev/blog', href: 'https://arthlabs.dev/blog', icon: 'blog' },
  { label: 'GitHub', handle: '@arthjhon', href: 'https://github.com/arthjhon', icon: 'github' },
  { label: 'LinkedIn', handle: 'arthurjhonathas', href: 'https://www.linkedin.com/in/arthurjhonathas', icon: 'linkedin' },
  { label: 'Instagram', handle: '@arth.dev_', href: 'https://instagram.com/arth.dev_', icon: 'instagram' },
  { label: 'TeraNex', handle: 'teranex.inf.br', href: 'https://teranex.inf.br', icon: 'globe' },
  { label: 'Email', handle: 'contato@arthlabs.dev', href: 'mailto:contato@arthlabs.dev', icon: 'mail' },
];

const svg = (body: string, filled = false) =>
  `<svg viewBox="0 0 24 24" width="20" height="20" ${
    filled ? 'fill="currentColor"' : 'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"'
  } aria-hidden="true">${body}</svg>`;

export const icons: Record<LinkIcon, string> = {
  site: svg('<polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>'),
  blog: svg('<path d="M4 4h16v16H4z"/><line x1="8" y1="9" x2="16" y2="9"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="12" y2="17"/>'),
  github: `<svg viewBox="0 0 16 16" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.6 7.6 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>`,
  linkedin: svg('<path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z"/>', true),
  instagram: svg('<rect x="2" y="2" width="20" height="20" rx="5.5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none"/>'),
  globe: svg('<circle cx="12" cy="12" r="9"/><line x1="3" y1="12" x2="21" y2="12"/><path d="M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18z"/>'),
  mail: svg('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 6.8 8.5 5.9 8.5-5.9"/>'),
};
