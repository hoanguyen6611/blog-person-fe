export function countWords(html: string): number {
  if (!html || typeof window === "undefined") return 0;
  const doc = new DOMParser().parseFromString(html, "text/html");
  const text = doc.body.textContent ?? "";
  const words = text.trim().split(/\s+/).filter(Boolean);
  return words.length;
}

const WORDS_PER_MINUTE = 200;

export function readingTimeMinutes(html: string): number {
  const words = countWords(html);
  if (!words) return 0;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}
