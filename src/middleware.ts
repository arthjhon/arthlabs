import { defineMiddleware } from 'astro:middleware';

// astro dev sends no Cache-Control on rendered pages, so the browser's
// heuristic caching can serve a stale page to the ClientRouter's soft-nav
// fetch() right after an edit — only a hard reload (which forces
// revalidation) shows the latest content. Force no-store in dev so
// navigation always matches what's on disk. No-op in the production build.
export const onRequest = defineMiddleware(async (context, next) => {
  const response = await next();
  if (import.meta.env.DEV) {
    response.headers.set('Cache-Control', 'no-store');
  }
  return response;
});
