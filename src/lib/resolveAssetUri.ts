export function resolveAssetUri(uri?: string): string | undefined {
  if (!uri) return undefined;
  if (uri.startsWith('http')) return uri;
  if (uri.startsWith('/')) return `https://dumanless.com${uri}`;
  return `https://dumanless.com/${uri}`;
}
