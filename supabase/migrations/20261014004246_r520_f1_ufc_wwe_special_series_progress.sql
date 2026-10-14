create or replace function public.cinetracker_special_series_progress_v520()
returns jsonb
language sql
stable
set search_path=public
as $$
with x as (
  select public.cinetracker_special_series_progress_v519() as w,
         public.cinetracker_special_series_progress_v518() as u
)
select jsonb_build_object(
  'f1',coalesce(w->'f1',u->'f1','{}'::jsonb),
  'ufc',coalesce(u->'ufc','{}'::jsonb),
  'wwe_ppv',coalesce(w->'wwe_ppv','{}'::jsonb),
  'generated_at',now(),
  'source','special-progress-v520'
) from x;
$$;
revoke all on function public.cinetracker_special_series_progress_v520() from public,anon;
grant execute on function public.cinetracker_special_series_progress_v520() to authenticated;
notify pgrst,'reload schema';
