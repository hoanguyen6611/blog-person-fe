"use client";
import { register, format } from "timeago.js";
import { useLocale } from "next-intl";
import vi from "timeago.js/lib/lang/vi";

// timeago.js defaults to English regardless of the app's own locale unless
// a locale is explicitly registered and passed to format() — this is why
// relative dates ("2 weeks ago") stayed in English even on the vi locale.
register("vi", vi);

export function useTimeAgo() {
  const locale = useLocale();
  return (date: string | number | Date) => format(date, locale);
}
