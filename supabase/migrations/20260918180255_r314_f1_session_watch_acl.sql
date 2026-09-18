-- Restrict the transitional r314 F1 writer to signed-in users only.
revoke all on function public.cinetracker_f1_watch_set_v314(text,text,timestamptz,boolean,jsonb) from public;
revoke all on function public.cinetracker_f1_watch_set_v314(text,text,timestamptz,boolean,jsonb) from anon;
grant execute on function public.cinetracker_f1_watch_set_v314(text,text,timestamptz,boolean,jsonb) to authenticated;
