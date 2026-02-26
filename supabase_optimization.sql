-- Disabling Realtime for tables that were previously being monitored by the admin dashboard
-- This reduces Supabase bandwidth usage

ALTER PUBLICATION supabase_realtime DROP TABLE orders;
ALTER PUBLICATION supabase_realtime DROP TABLE hatching_bookings;

-- Note: If you ever need to re-enable them, run:
-- ALTER PUBLICATION supabase_realtime ADD TABLE orders;
-- ALTER PUBLICATION supabase_realtime ADD TABLE hatching_bookings;
