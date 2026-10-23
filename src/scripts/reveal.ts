const seen = new WeakSet<Element>();
let observer: IntersectionObserver | null = null;

function reveal(el: Element): void {
  el.classList.add('is-revealed');
}

function init(): void {
  observer?.disconnect();
  observer = null;
  const targets = document.querySelectorAll('[data-reveal]:not(.is-revealed)');
  if (targets.length === 0) return;

  if (
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    !('IntersectionObserver' in window)
  ) {
    targets.forEach(reveal);
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        reveal(entry.target);
        io.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
  );
  observer = io;
  targets.forEach((el) => {
    if (seen.has(el)) return;
    seen.add(el);
    io.observe(el);
  });
}

// astro:page-load fires on first load and after every soft navigation.
// A direct call covers the case where the module runs after that first event;
// init() is idempotent for elements already observed in the current document.
document.addEventListener('astro:page-load', init);
if (document.readyState !== 'loading') init();
else document.addEventListener('DOMContentLoaded', init, { once: true });
