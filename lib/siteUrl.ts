// Same fallback already used by ShareButtons.tsx for building absolute
// share URLs — kept in one place so sitemap.ts/robots.ts don't duplicate it.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://blog-person-fe.vercel.app";
