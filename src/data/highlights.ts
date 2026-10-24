// Manual highlights for links.arthlabs.dev. They open the carousel, before the
// featured projects (which come from the `projects` collection automatically).
// Leave empty when there is nothing time-bound to promote.

export interface Highlight {
  /** Short label above the title, e.g. "novo post", "evento". */
  badge: string;
  title: string;
  text: string;
  cta: string;
  href: string;
  /** Referral link: adds rel="sponsored" and shows the referral notice. */
  affiliate?: boolean;
}

export const highlights: Highlight[] = [];
