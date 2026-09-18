-- CineTracker r314: ensure the F1 session writer is callable only by signed-in users.
revoke all on function public.cinetracker_f1_watch_set_v314(text,text,timestamptz,boolean,jsonb) from public;
revoke all on function public.cinetracker_f1_watch_set_v314(text,text,timestamptz,boolean,jsonb) from anon;
grant execute on function public.cinetracker_f1_watch_set_v314(text,text,timestamptz,boolean,jsonb) to authenticated;
