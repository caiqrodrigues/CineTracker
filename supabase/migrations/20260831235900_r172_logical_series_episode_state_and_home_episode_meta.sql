-- r172: make whole-series seen state work across duplicate logical media rows
-- and expose latest episode metadata for the Home without removing existing payload fields.

create or replace function public.cinetracker_home_live_v0997_r4(p_today date)
returns jsonb
language sql
stable
security invoker
set search_path=public
as $$
with p as (
  select public.cinetracker_profile_home_payload_v0997_r3(p_today) as payload
), enriched as (
  select s.ord,
         s.item || jsonb_build_object(
           'latest_episode_name', nullif(m.raw_tmdb->'last_episode_to_air'->>'name',''),
           'latest_episode_vote_average', nullif(m.raw_tmdb->'last_episode_to_air'->>'vote_average',''),
           'latest_episode_air_date', nullif(m.raw_tmdb->'last_episode_to_air'->>'air_date',''),
           'latest_episode_runtime', nullif(m.raw_tmdb->'last_episode_to_air'->>'runtime',''),
           'latest_episode_meta_season_number', nullif(m.raw_tmdb->'last_episode_to_air'->>'season_number',''),
           'latest_episode_meta_episode_number', nullif(m.raw_tmdb->'last_episode_to_air'->>'episode_number','')
         ) as item
  from p
  cross join lateral jsonb_array_elements(coalesce(p.payload->'series','[]'::jsonb)) with ordinality as s(item,ord)
  left join public.media m on m.id=nullif(s.item->>'media_id','')::bigint
), a as (
  select coalesce(jsonb_agg(item order by ord),'[]'::jsonb) as series from enriched
)
select jsonb_set(p.payload,'{series}',a.series,true)
from p cross join a;
$$;

grant execute on function public.cinetracker_home_live_v0997_r4(date) to authenticated;

create or replace function public.cinetracker_series_episode_state_v1(
  p_tmdb_id integer,
  p_today date default current_date
) returns jsonb
language plpgsql
security invoker
set search_path=public
as $$
declare
  v_profile uuid:=auth.uid();
  v_media_id bigint;
  v_raw jsonb:='{}'::jsonb;
  v_seen boolean:=false;
  v_completed boolean:=false;
  v_seen_at timestamptz:=null;
  v_last_s integer:=0;
  v_last_e integer:=0;
  v_state text:='AlreadySeen';
  v_episodes jsonb='[]'::jsonb;
begin
  if v_profile is null then raise exception 'AUTH_REQUIRED'; end if;
  if coalesce(p_tmdb_id,0)<=0 then raise exception 'TMDB_ID_REQUIRED'; end if;

  select m.id,coalesce(m.raw_tmdb,'{}'::jsonb)
    into v_media_id,v_raw
  from public.media m
  where m.media_type='tv'
    and public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)=p_tmdb_id
  order by (m.tmdb_id=p_tmdb_id) desc,
           case when jsonb_typeof(m.raw_tmdb->'seasons')='array' then jsonb_array_length(m.raw_tmdb->'seasons') else 0 end desc,
           m.id desc
  limit 1;

  if v_media_id is null then
    return jsonb_build_object('series_seen',false,'media_id',null,'episodes','[]'::jsonb);
  end if;

  select
    coalesce(bool_or(mo.state in ('AlreadySeen','Completed')),false),
    coalesce(bool_or(mo.state='Completed'),false),
    max(coalesce(mo.watched_at,mo.updated_at)) filter(where mo.state in ('AlreadySeen','Completed'))
  into v_seen,v_completed,v_seen_at
  from public.media_overrides mo
  join public.media m on m.id=mo.media_id
  where mo.profile_id=v_profile
    and m.media_type='tv'
    and public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)=p_tmdb_id;

  if v_seen then
    v_state:=case when v_completed then 'Completed' else 'AlreadySeen' end;
    v_seen_at:=coalesce(v_seen_at,now());
    v_last_s:=coalesce(nullif(v_raw->'last_episode_to_air'->>'season_number','')::int,0);
    v_last_e:=coalesce(nullif(v_raw->'last_episode_to_air'->>'episode_number','')::int,0);

    delete from public.media_overrides
    where profile_id=v_profile and media_id=v_media_id
      and state in ('InProgress','UpToDate') and origin in ('system','import');

    insert into public.media_overrides(profile_id,media_id,state,origin,watched_at,updated_at)
    values(v_profile,v_media_id,v_state,'manual',v_seen_at,now())
    on conflict(profile_id,media_id,state) do update
      set origin='manual',watched_at=coalesce(public.media_overrides.watched_at,excluded.watched_at),updated_at=now();

    with seasons as (
      select coalesce(nullif(s->>'season_number','')::int,0) as season_number,
             greatest(coalesce(nullif(s->>'episode_count','')::int,0),0) as episode_count
      from jsonb_array_elements(
        case when jsonb_typeof(v_raw->'seasons')='array' then v_raw->'seasons' else '[]'::jsonb end
      ) s
      where coalesce(nullif(s->>'season_number','')::int,0)>0
    ), released as (
      select season_number,
             case
               when v_last_s>0 and season_number<v_last_s then episode_count
               when v_last_s>0 and season_number=v_last_s then least(episode_count,greatest(v_last_e,0))
               when v_last_s>0 then 0
               else episode_count
             end as max_episode
      from seasons
    ), eps as (
      select r.season_number,g.episode_number
      from released r
      cross join lateral generate_series(1,greatest(r.max_episode,0)) g(episode_number)
    )
    insert into public.episode_progress(profile_id,media_id,season_number,episode_number,watched,watched_at,origin,updated_at)
    select v_profile,v_media_id,e.season_number,e.episode_number,true,v_seen_at,'manual',now()
    from eps e
    on conflict(profile_id,media_id,season_number,episode_number) do update
      set watched=true,
          watched_at=coalesce(public.episode_progress.watched_at,excluded.watched_at),
          origin=case when public.episode_progress.origin='manual' then public.episode_progress.origin else 'manual' end,
          updated_at=now();
  end if;

  select coalesce(jsonb_agg(jsonb_build_object('season_number',q.season_number,'episode_number',q.episode_number)
                            order by q.season_number,q.episode_number),'[]'::jsonb)
  into v_episodes
  from (
    select distinct ep.season_number,ep.episode_number
    from public.episode_progress ep
    join public.media m on m.id=ep.media_id
    where ep.profile_id=v_profile and ep.watched=true
      and m.media_type='tv'
      and public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)=p_tmdb_id
      and coalesce(ep.season_number,0)>0 and coalesce(ep.episode_number,0)>0
    union
    select distinct wh.season_number,wh.episode_number
    from public.watch_history wh
    join public.media m on m.id=wh.media_id
    where wh.profile_id=v_profile and wh.item_type='episode'
      and m.media_type='tv'
      and public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)=p_tmdb_id
      and coalesce(wh.season_number,0)>0 and coalesce(wh.episode_number,0)>0
  ) q;

  return jsonb_build_object(
    'series_seen',v_seen,
    'state',case when v_seen then v_state else null end,
    'media_id',v_media_id,
    'episodes',coalesce(v_episodes,'[]'::jsonb),
    'as_of',p_today
  );
end;
$$;

grant execute on function public.cinetracker_series_episode_state_v1(integer,date) to authenticated;
