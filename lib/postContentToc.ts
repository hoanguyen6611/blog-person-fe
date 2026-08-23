export interface TocHeading {
  id: string;
  text: string;
  level: 2 | 3;
}

function slugify(text: string, seen: Map<string, number>): string {
  const base =
    text
      .toLowerCase()
      .normalize("NFD")
      .replace(new RegExp("[\\u0300-\\u036f]", "g"), "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "section";
  const count = seen.get(base) ?? 0;
  seen.set(base, count + 1);
  return count === 0 ? base : `${base}-${count}`;
}

export function addHeadingIds(html: string): {
  html: string;
  headings: TocHeading[];
} {
  if (typeof window === "undefined" || !html) return { html, headings: [] };
  const doc = new DOMParser().parseFromString(html, "text/html");
  const seen = new Map<string, number>();
  const headings: TocHeading[] = [];
  doc.querySelectorAll("h2, h3").forEach((el) => {
    const text = el.textContent?.trim() ?? "";
    if (!text) return;
    const id = slugify(text, seen);
    el.id = id;
    headings.push({ id, text, level: el.tagName === "H2" ? 2 : 3 });
  });
  return { html: doc.body.innerHTML, headings };
}
