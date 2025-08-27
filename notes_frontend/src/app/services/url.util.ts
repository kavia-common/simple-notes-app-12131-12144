export function getURL(): string {
  // Prefer build-time injected env
  let url =
    (import.meta as any).env?.NG_APP_SITE_URL ||
    (typeof (globalThis as any).location?.origin === 'string' ? (globalThis as any).location.origin : 'http://localhost:3000');

  if (!/^https?:\/\//i.test(url)) {
    url = `https://${url}`;
  }
  if (!url.endsWith('/')) {
    url = `${url}/`;
  }
  return url;
}
