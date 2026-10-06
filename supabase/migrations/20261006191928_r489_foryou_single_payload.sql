CREATE OR REPLACE FUNCTION public.cinetracker_foryou_payload_v489(p_watch_limit integer DEFAULT 30, p_fresh_limit integer DEFAULT 48)
 RETURNS jsonb
 LANGUAGE sql
 SET search_path TO 'public'
AS $function$
with cfg as (
  select least(greatest(coalesce(p_watch_limit,30),1),30)::int watch_lim,
         least(greatest(coalesce(p_fresh_limit,48),1),48)::int fresh_lim
),
states as materialized (
  select
    mo.media_id,
    bool_or(mo.state in ('AddedToWatchlist','WatchLater')) as is_watch,
    bool_or(mo.state in ('AlreadySeen','Completed','InProgress','UpToDate')) as is_seen_state,
    bool_or(mo.state='Liked') as is_favorite,
    max(coalesce(mo.updated_at,mo.created_at)) as state_at
  from public.media_overrides mo
  where mo.profile_id=auth.uid()
  group by mo.media_id
),
history_seen as materialized (
  select wh.media_id from public.watch_history wh
  where wh.profile_id=auth.uid() and wh.media_id is not null
  union
  select ep.media_id from public.episode_progress ep
  where ep.profile_id=auth.uid() and ep.media_id is not null and ep.watched=true
  union
  select pe.media_id from public.watch_play_events_v0994 pe
  where pe.profile_id=auth.uid() and pe.media_id is not null
),
known_ids as materialized (
  select s.media_id from states s where s.is_watch or s.is_seen_state or s.is_favorite
  union select media_id from history_seen
),
seen_ids as materialized (
  select s.media_id from states s where s.is_seen_state
  union select media_id from history_seen
),
known_alias as materialized (
  select distinct
    m.media_type,
    public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)::bigint tmdb_id,
    public.cinetracker_norm_title_v1(coalesce(nullif(m.original_title,''),nullif(m.title,''),m.raw_tmdb->>'original_title',m.raw_tmdb->>'original_name',m.raw_tmdb->>'title',m.raw_tmdb->>'name')) alias
  from known_ids k join public.media m on m.id=k.media_id
),
seen_alias as materialized (
  select distinct
    m.media_type,
    public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)::bigint tmdb_id,
    public.cinetracker_norm_title_v1(coalesce(nullif(m.original_title,''),nullif(m.title,''),m.raw_tmdb->>'original_title',m.raw_tmdb->>'original_name',m.raw_tmdb->>'title',m.raw_tmdb->>'name')) alias
  from seen_ids k join public.media m on m.id=k.media_id
),
base as materialized (
  select
    m.id media_id,
    m.media_type,
    case when m.media_type='movie' then 'movie'
         when coalesce(m.media_kind,'series')='anime' then 'anime'
         else 'series' end kind,
    m.media_kind,
    public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)::bigint tmdb_id,
    m.title,m.poster_path,m.release_year,
    coalesce(m.runtime_minutes,case when coalesce(m.raw_tmdb->>'runtime','') ~ '^[0-9]+$' then (m.raw_tmdb->>'runtime')::int end,0)::int runtime_minutes,
    coalesce(m.genres,'[]'::jsonb) genres,
    coalesce(m.raw_tmdb,'{}'::jsonb) raw_tmdb,
    coalesce(s.is_watch,false) is_watch,
    coalesce(s.is_seen_state,false) or hs.media_id is not null as is_seen,
    coalesce(s.is_favorite,false) is_favorite,
    s.state_at,
    sr.shown_at,
    case when coalesce(m.raw_tmdb->>'vote_average','') ~ '^[0-9]+([.][0-9]+)?$'
      then (m.raw_tmdb->>'vote_average')::numeric else 0::numeric end vote_average,
    public.cinetracker_norm_title_v1(coalesce(nullif(m.original_title,''),nullif(m.title,''),m.raw_tmdb->>'original_title',m.raw_tmdb->>'original_name',m.raw_tmdb->>'title',m.raw_tmdb->>'name')) alias,
    lower(concat_ws(' ',
      coalesce(m.title,''),coalesce(m.original_title,''),coalesce(m.media_kind,''),
      coalesce(m.raw_tmdb->>'title',''),coalesce(m.raw_tmdb->>'name',''),
      coalesce(m.raw_tmdb->>'original_title',''),coalesce(m.raw_tmdb->>'original_name',''),
      coalesce(m.raw_tmdb->>'overview',''),coalesce(m.raw_tmdb->>'tagline',''),
      coalesce(m.raw_tmdb->'genres','[]'::jsonb)::text,
      coalesce(m.raw_tmdb->'keywords','[]'::jsonb)::text,
      coalesce(m.raw_tmdb->'production_companies','[]'::jsonb)::text
    )) searchable
  from public.media m
  left join states s on s.media_id=m.id
  left join history_seen hs on hs.media_id=m.id
  left join public.shown_recommendations sr
    on sr.user_id=auth.uid()
   and sr.media_type=m.media_type
   and sr.tmdb_id=public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)
  where public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)>0
    and nullif(m.poster_path,'') is not null
),
eligible as materialized (
  select b.*
  from base b
  where b.searchable !~ '(^|[^[:alnum:]])(wwe|world wrestling entertainment|nxt|monday night raw|friday night smackdown|smackdown|wrestlemania|royal rumble|summerslam|survivor series|money in the bank|elimination chamber)([^[:alnum:]]|$)'
    and b.searchable !~ '(^|[^[:alnum:]])(youtube|youtube originals?|youtube premium)([^[:alnum:]]|$)'
    and b.searchable !~ '(^|[^[:alnum:]])(reality|reality show|reality tv)([^[:alnum:]]|$)'
    and b.searchable !~ '(^|[^[:alnum:]])stand[ -]?up([^[:alnum:]]|$)'
    and b.searchable not like '%comedy special%'
    and b.searchable not like '%comedy concert%'
    and b.searchable not like '%live comedy%'
    and b.searchable not like '%especial de comedia%'
    and b.searchable not like '%especial de comédia%'
    and b.searchable not like '%show de comedia%'
    and b.searchable not like '%show de comédia%'
    and (b.media_type<>'movie' or b.runtime_minutes>=40)
),
watch_ranked as materialized (
  select e.*,
         row_number() over (
           partition by e.kind
           order by case when e.shown_at is null or e.shown_at < now()-interval '7 days' then 0 else 1 end,
                    e.shown_at asc nulls first,e.vote_average desc,e.state_at desc nulls last,e.media_id desc
         ) rn
  from eligible e
  where e.is_watch and not e.is_seen
    and not exists (
      select 1 from seen_alias a
      where a.media_type=e.media_type
        and ((a.tmdb_id>0 and a.tmdb_id=e.tmdb_id) or (a.alias<>'' and a.alias=e.alias))
    )
),
fresh_ranked as materialized (
  select e.*,
         row_number() over (
           partition by e.kind
           order by case when e.shown_at is null or e.shown_at < now()-interval '7 days' then 0 else 1 end,
                    e.shown_at asc nulls first,e.vote_average desc,e.media_id desc
         ) rn
  from eligible e
  where not e.is_watch and not e.is_seen and not e.is_favorite
    and not exists (
      select 1 from known_alias a
      where a.media_type=e.media_type
        and ((a.tmdb_id>0 and a.tmdb_id=e.tmdb_id) or (a.alias<>'' and a.alias=e.alias))
    )
),
watch_limited as (
  select * from watch_ranked where rn <= (select watch_lim from cfg)
),
fresh_limited as (
  select * from fresh_ranked where rn <= (select fresh_lim from cfg)
)
select jsonb_build_object(
  'watch',jsonb_build_object(
    'movie',coalesce((select jsonb_agg(jsonb_build_object(
      'media_id',media_id,'tmdb_id',tmdb_id,'media_type',media_type,'media_kind',media_kind,'title',title,'poster_path',poster_path,
      'release_year',release_year,'runtime_minutes',runtime_minutes,'genres',genres,'raw_tmdb',raw_tmdb,'__ct489_pool','watch'
    ) order by rn) from watch_limited where kind='movie'),'[]'::jsonb),
    'series',coalesce((select jsonb_agg(jsonb_build_object(
      'media_id',media_id,'tmdb_id',tmdb_id,'media_type',media_type,'media_kind',media_kind,'title',title,'poster_path',poster_path,
      'release_year',release_year,'runtime_minutes',runtime_minutes,'genres',genres,'raw_tmdb',raw_tmdb,'__ct489_pool','watch'
    ) order by rn) from watch_limited where kind='series'),'[]'::jsonb),
    'anime',coalesce((select jsonb_agg(jsonb_build_object(
      'media_id',media_id,'tmdb_id',tmdb_id,'media_type',media_type,'media_kind',media_kind,'title',title,'poster_path',poster_path,
      'release_year',release_year,'runtime_minutes',runtime_minutes,'genres',genres,'raw_tmdb',raw_tmdb,'__ct489_pool','watch'
    ) order by rn) from watch_limited where kind='anime'),'[]'::jsonb)
  ),
  'fresh',jsonb_build_object(
    'movie',coalesce((select jsonb_agg(jsonb_build_object(
      'media_id',media_id,'tmdb_id',tmdb_id,'media_type',media_type,'media_kind',media_kind,'title',title,'poster_path',poster_path,
      'release_year',release_year,'runtime_minutes',runtime_minutes,'genres',genres,'raw_tmdb',raw_tmdb,'__ct489_pool','fresh'
    ) order by rn) from fresh_limited where kind='movie'),'[]'::jsonb),
    'series',coalesce((select jsonb_agg(jsonb_build_object(
      'media_id',media_id,'tmdb_id',tmdb_id,'media_type',media_type,'media_kind',media_kind,'title',title,'poster_path',poster_path,
      'release_year',release_year,'runtime_minutes',runtime_minutes,'genres',genres,'raw_tmdb',raw_tmdb,'__ct489_pool','fresh'
    ) order by rn) from fresh_limited where kind='series'),'[]'::jsonb),
    'anime',coalesce((select jsonb_agg(jsonb_build_object(
      'media_id',media_id,'tmdb_id',tmdb_id,'media_type',media_type,'media_kind',media_kind,'title',title,'poster_path',poster_path,
      'release_year',release_year,'runtime_minutes',runtime_minutes,'genres',genres,'raw_tmdb',raw_tmdb,'__ct489_pool','fresh'
    ) order by rn) from fresh_limited where kind='anime'),'[]'::jsonb)
  ),
  'source','v489-single-payload',
  'generated_at',now()
);
$function$

revoke all on function public.cinetracker_foryou_payload_v489(integer,integer) from public,anon;
grant execute on function public.cinetracker_foryou_payload_v489(integer,integer) to authenticated;
notify pgrst,'reload schema';
