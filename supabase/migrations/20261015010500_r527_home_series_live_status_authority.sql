-- r527: ended-series reconstruction only for genuinely ended/cancelled shows.
-- Raw/SmackDown stay on the recent-episode authority from v452; Naruto keeps full ended-series counts.
create or replace function public.cinetracker_home_series_v527(
  p_today date default current_date,
  p_limit_per_bucket integer default 24
) returns jsonb
language sql stable security invoker set search_path=public
as $$
with cfg as (
  select least(greatest(coalesce(p_limit_per_bucket,24),1),250)::int lim,
         coalesce(p_today,current_date) today
), base as materialized (
  select e.value x,e.ordinality ord,
         nullif(e.value->>'media_id','')::bigint media_id,
         nullif(e.value->>'tmdb_id','')::bigint tmdb_id
  from jsonb_array_elements(public.cinetracker_home_series_v452((select today from cfg)))
       with ordinality e(value,ordinality)
), meta as materialized (
  select b.*,coalesce(m.raw_tmdb,'{}'::jsonb) raw,
         lower(coalesce(m.raw_tmdb->>'status','')) in ('ended','canceled','cancelled') ended,
         greatest(
           coalesce(nullif(b.x->>'total_episodes','')::int,0),
           case when coalesce(m.raw_tmdb->>'number_of_episodes','') ~ '^\d+$' then (m.raw_tmdb->>'number_of_episodes')::int else 0 end,
           coalesce((select sum(case when coalesce(s->>'episode_count','') ~ '^\d+$' then (s->>'episode_count')::int else 0 end)
                     from jsonb_array_elements(coalesce(m.raw_tmdb->'seasons','[]'::jsonb)) s
                     where coalesce(s->>'season_number','') ~ '^\d+$' and (s->>'season_number')::int>0),0)
         ) total_known
  from base b left join public.media m on m.id=b.media_id
), aliases as materialized (
  select distinct mt.ord,ma.id media_id
  from meta mt join public.media ma
    on mt.tmdb_id>0 and ma.media_type='tv'
   and public.cinetracker_effective_tmdb_id(ma.tmdb_id,ma.raw_tmdb)=mt.tmdb_id
), watched_keys as materialized (
  select distinct a.ord,ep.season_number,ep.episode_number
  from aliases a join public.episode_progress ep on ep.media_id=a.media_id
  where ep.profile_id=auth.uid() and ep.watched=true and ep.season_number>0 and ep.episode_number>0
  union
  select distinct a.ord,wh.season_number,wh.episode_number
  from aliases a join public.watch_history wh on wh.media_id=a.media_id
  where wh.profile_id=auth.uid() and wh.item_type='episode' and wh.season_number>0 and wh.episode_number>0
), season_defs as materialized (
  select mt.ord,(s->>'season_number')::int season_number,(s->>'episode_count')::int episode_count
  from meta mt cross join lateral jsonb_array_elements(coalesce(mt.raw->'seasons','[]'::jsonb)) s
  where mt.ended and mt.total_known>0
    and coalesce(s->>'season_number','') ~ '^\d+$'
    and coalesce(s->>'episode_count','') ~ '^\d+$'
    and (s->>'season_number')::int>0 and (s->>'episode_count')::int>0
), all_eps as materialized (
  select sd.ord,sd.season_number,g episode_number
  from season_defs sd cross join lateral generate_series(1,sd.episode_count) g
), ended_stats as materialized (
  select mt.ord,count(ae.*)::int total_from_seasons,count(wk.*)::int watched_episodes,
         (count(ae.*)-count(wk.*))::int remaining_episodes
  from meta mt
  left join all_eps ae on ae.ord=mt.ord
  left join watched_keys wk on wk.ord=ae.ord and wk.season_number=ae.season_number and wk.episode_number=ae.episode_number
  where mt.ended and mt.total_known>0 group by mt.ord
), next_unseen as materialized (
  select distinct on (ae.ord) ae.ord,ae.season_number,ae.episode_number
  from all_eps ae
  left join watched_keys wk on wk.ord=ae.ord and wk.season_number=ae.season_number and wk.episode_number=ae.episode_number
  where wk.ord is null
  order by ae.ord,ae.season_number,ae.episode_number
), patched as materialized (
  select mt.ord,
    case when mt.ended and mt.total_known>0 and coalesce(es.total_from_seasons,0)>0 then
      mt.x || jsonb_strip_nulls(jsonb_build_object(
        'watched_episodes',coalesce(es.watched_episodes,0),
        'released_episodes',greatest(mt.total_known,coalesce(es.total_from_seasons,0)),
        'total_episodes',greatest(mt.total_known,coalesce(es.total_from_seasons,0)),
        'available_episodes',greatest(coalesce(es.remaining_episodes,0),0),
        'remaining_episodes',greatest(coalesce(es.remaining_episodes,0),0),
        'next_season_number',nu.season_number,
        'next_episode_number',nu.episode_number,
        'next_episode_title',case when nu.episode_number is not null then 'Episódio '||nu.episode_number::text end,
        'home_bucket',case
          when coalesce(es.remaining_episodes,0)<=0 then case when mt.x->>'source_state'='Completed' then 'completed' else 'up_to_date' end
          when coalesce(es.watched_episodes,0)=0 and mt.x->>'source_state' in ('WatchLater','AddedToWatchlist') then 'not_started'
          when coalesce(es.watched_episodes,0)>0 then case when nullif(mt.x->>'last_watched_at','')::timestamptz is null or nullif(mt.x->>'last_watched_at','')::timestamptz>=now()-interval '30 days' then 'continue' else 'dust' end
          else coalesce(mt.x->>'home_bucket','not_started')
        end,
        '__ct527_ended_authority',true
      ))
    else mt.x || jsonb_build_object('__ct527_live_passthrough',true) end x
  from meta mt
  left join ended_stats es on es.ord=mt.ord
  left join next_unseen nu on nu.ord=mt.ord
), ranked as materialized (
  select x,ord,coalesce(x->>'home_bucket','other') bucket,
         row_number() over(partition by coalesce(x->>'home_bucket','other') order by ord)::int rn
  from patched
), limited as (
  select * from ranked where rn <= (select lim from cfg)
), counts as (
  select jsonb_object_agg(bucket,cnt order by bucket) j
  from (select bucket,count(*)::int cnt from ranked group by bucket) x
)
select jsonb_build_object(
  'rows',coalesce((select jsonb_agg(x order by ord) from limited),'[]'::jsonb),
  'counts',coalesce((select j from counts),'{}'::jsonb),
  'limit_per_bucket',(select lim from cfg),
  'total',(select count(*)::int from ranked),
  'generated_at',now(),
  'source','v527-ended-only-live-passthrough'
);
$$;
revoke all on function public.cinetracker_home_series_v527(date,integer) from public,anon;
grant execute on function public.cinetracker_home_series_v527(date,integer) to authenticated;
notify pgrst,'reload schema';
