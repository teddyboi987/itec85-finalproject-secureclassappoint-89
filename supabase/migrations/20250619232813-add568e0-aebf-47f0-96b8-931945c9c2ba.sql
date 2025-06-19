
-- Enable real-time updates for the appointments table
ALTER TABLE public.appointments REPLICA IDENTITY FULL;

-- Add the appointments table to the realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.appointments;
