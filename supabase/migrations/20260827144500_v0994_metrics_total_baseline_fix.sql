-- CineTracker Web 0.99.4 — preserve the independently verified imported total-minute baseline.
create or replace function public.cinetracker_profile_stats()
returns table(episodes_watched bigint,movies_watched bigint,series_watched bigint,series_minutes bigint,movie_minutes bigint,total_minutes bigint)
language sql
stable
security invoker
set search_path=public
as $$
with cfg as (select settings from public.profiles where id=auth.uid()),
wh_ep as (
  select wh.media_id,case when coalesce(wh.external_ids->>'plays','') ~ '^[0-9]+$' then greatest(1,(wh.external_ids->>'plays')::int) else 1 end::bigint as plays
  from public.watch_history wh where wh.profile_id=auth.uid() and wh.item_type='episode'
), ep_extra as (
  select ep.media_id from public.episode_progress ep where ep.profile_id=auth.uid() and ep.watched=true
    and not exists(select 1 from public.watch_history wh where wh.profile_id=ep.profile_id and wh.media_id=ep.media_id and wh.item_type='episode' and wh.season_number=ep.season_number and wh.episode_number=ep.episode_number)
), wh_mv as (
  select wh.media_id,case when coalesce(wh.external_ids->>'plays','') ~ '^[0-9]+$' then greatest(1,(wh.external_ids->>'plays')::int) else 1 end::bigint as plays
  from public.watch_history wh join public.media m on m.id=wh.media_id
  where wh.profile_id=auth.uid() and wh.item_type='movie' and m.media_type='movie'
), mv_extra as (
  select distinct mo.media_id from public.media_overrides mo join public.media m on m.id=mo.media_id
  where mo.profile_id=auth.uid() and m.media_type='movie' and mo.state in ('AlreadySeen','Completed')
    and not exists(select 1 from public.watch_history wh where wh.profile_id=mo.profile_id and wh.media_id=mo.media_id and wh.item_type='movie')
), ev as (
  select coalesce(sum(runtime_minutes) filter(where item_type='episode'),0)::bigint as ep_minutes,
         coalesce(sum(runtime_minutes) filter(where item_type='movie'),0)::bigint as mv_minutes,
         coalesce(sum(runtime_minutes),0)::bigint as total_minutes
  from public.watch_play_events_v0994 where profile_id=auth.uid()
), totals as (
  select (coalesce((select sum(plays) from wh_ep),0)+coalesce((select count(*) from ep_extra),0))::bigint as ep_plays,
         (coalesce((select sum(plays) from wh_mv),0)+coalesce((select count(*) from mv_extra),0))::bigint as mv_plays,
         (select count(*) from (select media_id from wh_ep union select media_id from ep_extra)x)::bigint as series_count
), base as (
  select coalesce(nullif(cfg.settings->'v0994_metrics_baseline'->>'series_minutes','')::bigint,nullif(cfg.settings->'bingers_import'->>'series_minutes','')::bigint,0)::bigint as series_minutes,
         coalesce(nullif(cfg.settings->'v0994_metrics_baseline'->>'movie_minutes','')::bigint,nullif(cfg.settings->'bingers_import'->>'movie_minutes','')::bigint,0)::bigint as movie_minutes,
         coalesce(nullif(cfg.settings->'v0994_metrics_baseline'->>'total_minutes','')::bigint,nullif(cfg.settings->'bingers_import'->>'total_minutes','')::bigint,0)::bigint as total_minutes
  from cfg
)
select t.ep_plays,t.mv_plays,t.series_count,
       (b.series_minutes+ev.ep_minutes)::bigint,
       (b.movie_minutes+ev.mv_minutes)::bigint,
       (b.total_minutes+ev.total_minutes)::bigint
from totals t cross join ev cross join base b;
$$;
