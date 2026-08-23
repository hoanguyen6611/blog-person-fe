export function countWords(html: string): number {
  if (!html || typeof window === "undefined") return 0;
  const doc = new DOMParser().parseFromString(html, "text/html");
  const text = doc.body.textContent ?? "";
  const words = text.trim().split(/\s+/).filter(Boolean);
  return words.length;
}
