-- Remove the transitional SECURITY DEFINER writer. Session watch state is owned by the RLS table/RPCs above.
drop function if exists public.cinetracker_f1_watch_set_v314(text,text,timestamptz,boolean,jsonb);
notify pgrst,'reload schema';
