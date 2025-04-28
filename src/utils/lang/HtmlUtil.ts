export function parseHtml(html: string): Document {
  return new DOMParser().parseFromString(html, 'text/html');
}