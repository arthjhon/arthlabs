let observer: IntersectionObserver | null = null;
let safety: number | undefined;

function reveal(el: Element): void {
  el.classList.add('is-revealed');
}

function init(): void {
  observer?.disconnect();
  observer = null;
  window.clearTimeout(safety);
  const targets = document.querySelectorAll('[data-reveal]:not(.is-revealed)');
  if (targets.length === 0) return;

  if (
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    !('IntersectionObserver' in window)
  ) {
    targets.forEach(reveal);
    return;
  }

  let delivered = false;
  const io = new IntersectionObserver(
    (entries) => {
      delivered = true;
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        reveal(entry.target);
        io.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -2% 0px', threshold: 0.01 },
  );
  observer = io;
  targets.forEach((el) => io.observe(el));

  // Safety net: an observer always delivers an initial callback. If none arrives
  // (blocked/failed observer), show everything rather than leave content hidden.
  safety = window.setTimeout(() => {
    if (delivered) return;
    io.disconnect();
    document.querySelectorAll('[data-reveal]:not(.is-revealed)').forEach(reveal);
  }, 2500);
}

// astro:page-load fires on first load and after every soft navigation. The direct
// call covers a module that runs after that event. init() is idempotent: it always
// drops the previous observer and re-observes every element not yet revealed.
document.addEventListener('astro:page-load', init);
if (document.readyState !== 'loading') init();
else document.addEventListener('DOMContentLoaded', init, { once: true });
