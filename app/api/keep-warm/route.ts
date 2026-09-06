// Pings the backend so it doesn't fall asleep (Render free tier sleeps
// after ~15 min of no traffic, and the next real user request then pays a
// 20-30s+ cold-start). This route itself does nothing on a schedule by
// itself — something needs to call it periodically, see vercel.json's
// `crons` entry, or an external scheduler (cron-job.org, UptimeRobot, a
// GitHub Actions cron workflow, ...) hitting either this route or the
// backend directly if the deploy plan doesn't support sub-daily crons.
export async function GET() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/category?limit=1`, {
      signal: AbortSignal.timeout(20000),
      cache: "no-store",
    });
    return Response.json({ ok: res.ok, status: res.status });
  } catch (error) {
    return Response.json(
      { ok: false, error: error instanceof Error ? error.message : "unknown" },
      { status: 502 }
    );
  }
}
