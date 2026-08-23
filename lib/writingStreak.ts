function startOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay(); // 0 = Sun
  const diff = (day + 6) % 7; // days since Monday
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - diff);
  return d;
}

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Given post creation dates, returns:
 * - streak: number of consecutive weeks up to and including the current
 *   week that have at least one post
 * - weeks: boolean activity for the last `windowWeeks` weeks (oldest first)
 */
export function computeWritingStreak(
  createdAtDates: string[],
  windowWeeks = 7
): { streak: number; weeks: boolean[] } {
  const now = new Date();
  const currentWeekStart = startOfWeek(now).getTime();

  const weekIndexes = new Set(
    createdAtDates.map((d) => {
      const t = startOfWeek(new Date(d)).getTime();
      return Math.round((currentWeekStart - t) / WEEK_MS);
    })
  );

  let streak = 0;
  while (weekIndexes.has(streak)) streak++;

  const weeks: boolean[] = [];
  for (let i = windowWeeks - 1; i >= 0; i--) {
    weeks.push(weekIndexes.has(i));
  }

  return { streak, weeks };
}
