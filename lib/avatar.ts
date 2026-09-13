// Clerk hands back a Gravatar "mystery person" placeholder
// (https://www.gravatar.com/avatar?d=mp — no hash segment) for any user who
// never uploaded a profile photo and has no email registered on Gravatar.
// The webhook that syncs Clerk users into our DB stores that URL verbatim,
// so it isn't a broken/missing image — it just isn't a real photo either,
// and showing Gravatar's own gray silhouette reads as "avatar didn't load."
export function isPlaceholderAvatar(src?: string | null): boolean {
  if (!src) return true;
  try {
    const url = new URL(src);
    return url.hostname.includes("gravatar.com") && url.pathname === "/avatar";
  } catch {
    return false;
  }
}
