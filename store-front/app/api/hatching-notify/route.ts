// This route is no longer used — notifications are handled via the admin dashboard NotificationBell.
// Kept as placeholder in case Telegram is re-enabled in future.
export async function POST() {
  return Response.json({ ok: true, skipped: true })
}
