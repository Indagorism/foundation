/**
 * Builds a link inside the site. The site may be served from a sub-path
 * (GitHub Pages serves it at /foundation/), so internal links never start
 * with a bare "/".
 */
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

export function href(path = ''): string {
  return `${BASE}/${path.replace(/^\//, '')}`;
}

/** The current page's path with the base removed, e.g. "/document". */
export function pagePath(pathname: string): string {
  const rest = pathname.startsWith(BASE) ? pathname.slice(BASE.length) : pathname;
  return rest.replace(/\/$/, '') || '/';
}
