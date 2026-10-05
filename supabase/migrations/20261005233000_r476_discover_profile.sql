-- CineTracker Web r476 — strict fresh exclusions, smart Watchlist recommendations and complete Profile lists.

create or replace function public.cinetracker_norm_text_v476(p_text text)
returns text
language sql
immutable
security invoker
set search_path=public
as $$
  select regexp_replace(
    translate(
      lower(coalesce(p_text,'')),
      'áàâãäéèêëíìîïóòôõöúùûüçñ',
      'aaaaaeeeeiiiiooooouuuucn'
    ),
    '[^a-z0-9]+','','g'
  );
$$;

create or replace function public.cinetracker_is_wwe_v476(p_title text,p_raw_tmdb jsonb)
returns boolean
language sql
immutable
security invoker
set search_path=public
as $$
with x as (
  select lower(concat_ws(' ',
    coalesce(p_title,''),
    coalesce(p_raw_tmdb->>'title',''),
    coalesce(p_raw_tmdb->>'name',''),
    coalesce(p_raw_tmdb->>'original_title',''),
    coalesce(p_raw_tmdb->>'original_name',''),
    coalesce(p_raw_tmdb->>'overview',''),
    coalesce(p_raw_tmdb->'production_companies','[]'::jsonb)::text
  )) as t
)
select t ~ '(^|[^[:alnum:]])(wwe|world wrestling entertainment|nxt|monday night raw|friday night smackdown|smackdown|wrestlemania|royal rumble|summerslam|survivor series|money in the bank|elimination chamber|clash at the castle|wwe backlash)([^[:alnum:]]|$)'
from x;
$$;

create or replace function public.cinetracker_discover_fresh_v476(p_kind text,p_limit integer default 48)
returns jsonb
language sql
stable
security invoker
set search_path=public
as $$
with cfg as (
  select lower(coalesce(p_kind,'movie')) as kind,
         least(greatest(coalesce(p_limit,48),1),48)::int as lim
), known_ids as materialized (
  select mo.media_id
  from public.media_overrides mo
  where mo.profile_id=auth.uid()
    and mo.state in ('AddedToWatchlist','WatchLater','AlreadySeen','Completed','InProgress','UpToDate','Liked')
  union
  select wh.media_id
  from public.watch_history wh
  where wh.profile_id=auth.uid() and wh.media_id is not null
  union
  select ep.media_id
  from public.episode_progress ep
  where ep.profile_id=auth.uid() and ep.watched=true
  union
  select pe.media_id
  from public.watch_play_events_v0994 pe
  where pe.profile_id=auth.uid() and pe.media_id is not null
), known as materialized (
  select distinct
    m.media_type,
    public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)::integer as tmdb_id,
    public.cinetracker_norm_text_v476(v.alias) as alias
  from known_ids k
  join public.media m on m.id=k.media_id
  cross join lateral (values
    (m.title),
    (m.raw_tmdb->>'title'),
    (m.raw_tmdb->>'name'),
    (m.raw_tmdb->>'original_title'),
    (m.raw_tmdb->>'original_name')
  ) v(alias)
  where public.cinetracker_norm_text_v476(v.alias)<>''
), source as materialized (
  select
    x.item,x.ord,m.media_type,m.media_kind,m.title,m.raw_tmdb,m.runtime_minutes,m.genres,
    public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)::integer as tmdb_id,
    array_remove(array[
      public.cinetracker_norm_text_v476(m.title),
      public.cinetracker_norm_text_v476(m.raw_tmdb->>'title'),
      public.cinetracker_norm_text_v476(m.raw_tmdb->>'name'),
      public.cinetracker_norm_text_v476(m.raw_tmdb->>'original_title'),
      public.cinetracker_norm_text_v476(m.raw_tmdb->>'original_name')
    ],'') as aliases
  from cfg
  cross join lateral jsonb_array_elements(public.cinetracker_discover_fresh_v421(cfg.kind,48)) with ordinality x(item,ord)
  join public.media m on m.id=(x.item->>'media_id')::bigint
  where public.cinetracker_recommendation_eligible_v421(
    m.media_type,m.media_kind,m.title,
    greatest(coalesce(m.runtime_minutes,0),case when coalesce(m.raw_tmdb->>'runtime','') ~ '^[0-9]+$' then (m.raw_tmdb->>'runtime')::int else 0 end),
    coalesce(nullif(m.genres,'[]'::jsonb),m.raw_tmdb->'genres','[]'::jsonb),
    m.raw_tmdb,true,(cfg.kind='movie')
  )
  and not public.cinetracker_is_wwe_v476(m.title,m.raw_tmdb)
), eligible as (
  select s.*
  from source s
  where not exists (
    select 1
    from known k
    where k.media_type=s.media_type
      and (
        (s.tmdb_id>0 and k.tmdb_id=s.tmdb_id)
        or (k.alias<>'' and k.alias=any(s.aliases))
      )
  )
)
select coalesce(
  jsonb_agg(item || jsonb_build_object('__ct476_strict_fresh',true) order by ord),
  '[]'::jsonb
)
from (
  select item,ord
  from eligible
  order by ord
  limit (select lim from cfg)
) q;
$$;

create or replace function public.cinetracker_discover_watch_smart_v476(p_kind text,p_limit integer default 30)
returns jsonb
language sql
stable
security invoker
set search_path=public
as $$
with cfg as (
  select lower(coalesce(p_kind,'movie')) as kind,
         least(greatest(coalesce(p_limit,30),1),30)::int as lim
), seen_ids as materialized (
  select mo.media_id
  from public.media_overrides mo
  where mo.profile_id=auth.uid()
    and mo.state in ('AlreadySeen','Completed','InProgress','UpToDate')
  union
  select wh.media_id from public.watch_history wh where wh.profile_id=auth.uid() and wh.media_id is not null
  union
  select ep.media_id from public.episode_progress ep where ep.profile_id=auth.uid() and ep.watched=true
  union
  select pe.media_id from public.watch_play_events_v0994 pe where pe.profile_id=auth.uid() and pe.media_id is not null
), seen as materialized (
  select distinct
    m.media_type,
    public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)::integer as tmdb_id,
    public.cinetracker_norm_text_v476(v.alias) as alias
  from seen_ids k
  join public.media m on m.id=k.media_id
  cross join lateral (values
    (m.title),(m.raw_tmdb->>'title'),(m.raw_tmdb->>'name'),
    (m.raw_tmdb->>'original_title'),(m.raw_tmdb->>'original_name')
  ) v(alias)
  where public.cinetracker_norm_text_v476(v.alias)<>''
), recent_events as materialized (
  select wh.media_id,wh.watched_at as watched_at
  from public.watch_history wh
  where wh.profile_id=auth.uid() and wh.media_id is not null and wh.watched_at>=now()-interval '180 days'
  union all
  select pe.media_id,pe.played_at
  from public.watch_play_events_v0994 pe
  where pe.profile_id=auth.uid() and pe.media_id is not null and pe.played_at>=now()-interval '180 days'
  union all
  select ep.media_id,coalesce(ep.watched_at,ep.updated_at)
  from public.episode_progress ep
  where ep.profile_id=auth.uid() and ep.watched=true and coalesce(ep.watched_at,ep.updated_at)>=now()-interval '180 days'
), recent_ranked as materialized (
  select media_id,max(watched_at) as watched_at,
         row_number() over(order by max(watched_at) desc,media_id desc) as rn
  from recent_events
  group by media_id
  order by max(watched_at) desc,media_id desc
  limit 80
), affinity as materialized (
  select
    public.cinetracker_norm_text_v476(coalesce(g.value->>'name',g.value#>>'{}')) as genre,
    sum(greatest(1,81-r.rn))::numeric as weight
  from recent_ranked r
  join public.media m on m.id=r.media_id
  cross join lateral jsonb_array_elements(
    case
      when jsonb_typeof(m.genres)='array' and m.genres<>'[]'::jsonb then m.genres
      when jsonb_typeof(m.raw_tmdb->'genres')='array' then m.raw_tmdb->'genres'
      else '[]'::jsonb
    end
  ) g(value)
  where public.cinetracker_norm_text_v476(coalesce(g.value->>'name',g.value#>>'{}'))<>''
  group by 1
), source as materialized (
  select
    x.item,x.ord,m.id as media_id,m.media_type,m.title,m.raw_tmdb,
    public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)::integer as tmdb_id,
    array_remove(array[
      public.cinetracker_norm_text_v476(m.title),
      public.cinetracker_norm_text_v476(m.raw_tmdb->>'title'),
      public.cinetracker_norm_text_v476(m.raw_tmdb->>'name'),
      public.cinetracker_norm_text_v476(m.raw_tmdb->>'original_title'),
      public.cinetracker_norm_text_v476(m.raw_tmdb->>'original_name')
    ],'') as aliases,
    coalesce((
      select sum(a.weight)
      from jsonb_array_elements(
        case
          when jsonb_typeof(m.genres)='array' and m.genres<>'[]'::jsonb then m.genres
          when jsonb_typeof(m.raw_tmdb->'genres')='array' then m.raw_tmdb->'genres'
          else '[]'::jsonb
        end
      ) cg(value)
      join affinity a
        on a.genre=public.cinetracker_norm_text_v476(coalesce(cg.value->>'name',cg.value#>>'{}'))
    ),0)::numeric as affinity_score,
    case when coalesce(m.raw_tmdb->>'vote_average','') ~ '^[0-9]+([.][0-9]+)?$'
      then (m.raw_tmdb->>'vote_average')::numeric else 0::numeric end as vote_average
  from cfg
  cross join lateral jsonb_array_elements(public.cinetracker_discover_watch_unseen_v421(cfg.kind,30)) with ordinality x(item,ord)
  join public.media m on m.id=(x.item->>'media_id')::bigint
  where not public.cinetracker_is_wwe_v476(m.title,m.raw_tmdb)
), eligible as materialized (
  select s.*
  from source s
  where not exists (
    select 1 from seen k
    where k.media_type=s.media_type
      and (
        (s.tmdb_id>0 and k.tmdb_id=s.tmdb_id)
        or (k.alias<>'' and k.alias=any(s.aliases))
      )
  )
), scored as (
  select *,
    (affinity_score*100 + vote_average*10
      + (mod(abs(hashtextextended(media_id::text||current_date::text,0)),1000)::numeric/1000)
    ) as score
  from eligible
)
select coalesce(
  jsonb_agg(
    item || jsonb_build_object(
      '__ct476_smart_watch',true,
      '__ct476_affinity',affinity_score,
      '__ct476_score',score
    )
    order by score desc,ord
  ),
  '[]'::jsonb
)
from (
  select * from scored
  order by score desc,ord
  limit (select lim from cfg)
) q;
$$;

create or replace function public.cinetracker_profile_lists_v476()
returns jsonb
language sql
stable
security invoker
set search_path=public
as $$
with states as materialized (
  select
    mo.media_id,
    bool_or(mo.state='Liked') as is_favorite,
    bool_or(mo.state in ('AddedToWatchlist','WatchLater')) as is_watchlist,
    bool_or(mo.state='Completed') as is_completed,
    bool_or(mo.state='InProgress') as is_in_progress,
    bool_or(mo.state='UpToDate') as is_up_to_date,
    bool_or(mo.state='AlreadySeen') as is_already_seen,
    max(mo.watched_at) as last_override_watch,
    max(coalesce(mo.updated_at,mo.created_at)) as state_updated_at
  from public.media_overrides mo
  where mo.profile_id=auth.uid()
  group by mo.media_id
), episode_keys as materialized (
  select wh.media_id,wh.season_number,wh.episode_number,wh.watched_at
  from public.watch_history wh
  where wh.profile_id=auth.uid() and wh.item_type='episode' and wh.media_id is not null
    and coalesce(wh.season_number,0)>0 and coalesce(wh.episode_number,0)>0
  union
  select ep.media_id,ep.season_number,ep.episode_number,coalesce(ep.watched_at,ep.updated_at)
  from public.episode_progress ep
  where ep.profile_id=auth.uid() and ep.watched=true
    and coalesce(ep.season_number,0)>0 and coalesce(ep.episode_number,0)>0
  union
  select pe.media_id,pe.season_number,pe.episode_number,pe.played_at
  from public.watch_play_events_v0994 pe
  where pe.profile_id=auth.uid() and pe.item_type='episode' and pe.media_id is not null
    and coalesce(pe.season_number,0)>0 and coalesce(pe.episode_number,0)>0
), episodes as materialized (
  select media_id,count(distinct (season_number,episode_number))::bigint as watched_episodes,max(watched_at) as last_episode_watch
  from episode_keys
  group by media_id
), movie_events as materialized (
  select wh.media_id,wh.watched_at
  from public.watch_history wh
  where wh.profile_id=auth.uid() and wh.item_type='movie' and wh.media_id is not null
  union all
  select pe.media_id,pe.played_at
  from public.watch_play_events_v0994 pe
  where pe.profile_id=auth.uid() and pe.item_type='movie' and pe.media_id is not null
), movie_history as materialized (
  select media_id,max(watched_at) as last_movie_watch
  from movie_events
  group by media_id
), ids as materialized (
  select media_id from states
  union select media_id from episodes
  union select media_id from movie_history
), base as materialized (
  select
    m.id as media_id,m.media_type,m.media_kind,
    public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)::integer as tmdb_id,
    m.title,m.poster_path,m.release_year,
    coalesce(m.runtime_minutes,0)::integer as runtime_minutes,
    coalesce(m.total_episodes,0)::integer as total_episodes,
    coalesce(e.watched_episodes,0)::bigint as watched_episodes,
    greatest(e.last_episode_watch,mh.last_movie_watch,s.last_override_watch) as last_watched_at,
    coalesce(s.is_favorite,false) as is_favorite,
    coalesce(s.is_watchlist,false) as is_watchlist,
    coalesce(s.is_in_progress,false) as is_in_progress,
    coalesce(s.is_up_to_date,false) as is_up_to_date,
    coalesce(s.is_completed,false) as is_completed,
    case when m.media_type='movie'
      then (mh.media_id is not null or coalesce(s.is_already_seen,false))
      else coalesce(e.watched_episodes,0)>0
    end as is_seen,
    s.state_updated_at,
    case when coalesce(m.raw_tmdb->>'vote_average','') ~ '^[0-9]+([.][0-9]+)?$'
      then (m.raw_tmdb->>'vote_average')::numeric else 0::numeric end as vote_average,
    nullif(m.raw_tmdb->>'release_date','') as release_date,
    nullif(m.raw_tmdb->>'first_air_date','') as first_air_date,
    m.raw_tmdb
  from ids i
  join public.media m on m.id=i.media_id
  left join states s on s.media_id=m.id
  left join episodes e on e.media_id=m.id
  left join movie_history mh on mh.media_id=m.id
), series_rows as materialized (
  select * from base
  where media_type='tv' and (is_completed or is_in_progress or is_up_to_date or watched_episodes>0)
), movie_rows as materialized (
  select * from base where media_type='movie' and is_seen
), series_favorite_rows as materialized (
  select * from base where media_type='tv' and is_favorite
), movie_favorite_rows as materialized (
  select * from base where media_type='movie' and is_favorite
), actors as materialized (
  select fa.id,fa.tmdb_person_id,fa.actor_name,fa.profile_path,fa.created_at
  from public.favorite_actors fa
  where fa.user_id=auth.uid()
)
select jsonb_build_object(
  'series',coalesce((select jsonb_agg(to_jsonb(x) order by x.last_watched_at desc nulls last,x.media_id desc) from series_rows x),'[]'::jsonb),
  'movies',coalesce((select jsonb_agg(to_jsonb(x) order by x.last_watched_at desc nulls last,x.media_id desc) from movie_rows x),'[]'::jsonb),
  'series_favorites',coalesce((select jsonb_agg(to_jsonb(x) order by x.state_updated_at desc nulls last,x.media_id desc) from series_favorite_rows x),'[]'::jsonb),
  'movie_favorites',coalesce((select jsonb_agg(to_jsonb(x) order by x.state_updated_at desc nulls last,x.media_id desc) from movie_favorite_rows x),'[]'::jsonb),
  'actors',coalesce((select jsonb_agg(to_jsonb(a) order by a.created_at desc,a.id desc) from actors a),'[]'::jsonb),
  'counts',jsonb_build_object(
    'series',(select count(*) from series_rows),
    'movies',(select count(*) from movie_rows),
    'series_favorites',(select count(*) from series_favorite_rows),
    'movie_favorites',(select count(*) from movie_favorite_rows),
    'actors',(select count(*) from actors)
  )
);
$$;

revoke all on function public.cinetracker_norm_text_v476(text) from public,anon;
grant execute on function public.cinetracker_norm_text_v476(text) to authenticated;
revoke all on function public.cinetracker_is_wwe_v476(text,jsonb) from public,anon;
grant execute on function public.cinetracker_is_wwe_v476(text,jsonb) to authenticated;
revoke all on function public.cinetracker_discover_fresh_v476(text,integer) from public,anon;
grant execute on function public.cinetracker_discover_fresh_v476(text,integer) to authenticated;
revoke all on function public.cinetracker_discover_watch_smart_v476(text,integer) from public,anon;
grant execute on function public.cinetracker_discover_watch_smart_v476(text,integer) to authenticated;
revoke all on function public.cinetracker_profile_lists_v476() from public,anon;
grant execute on function public.cinetracker_profile_lists_v476() to authenticated;

notify pgrst,'reload schema';
