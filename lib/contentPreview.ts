export function getContentPreview(html: string, minChars = 320) {
  if (!html || typeof window === "undefined") {
    return { html, truncated: false };
  }

  const doc = new DOMParser().parseFromString(html, "text/html");
  const nodes = Array.from(doc.body.children);
  if (nodes.length === 0) return { html, truncated: false };

  let acc = "";
  let textLen = 0;
  let usedNodes = 0;

  for (const node of nodes) {
    acc += node.outerHTML;
    textLen += (node.textContent || "").length;
    usedNodes += 1;
    if (textLen >= minChars) break;
  }

  return { html: acc, truncated: usedNodes < nodes.length };
}
