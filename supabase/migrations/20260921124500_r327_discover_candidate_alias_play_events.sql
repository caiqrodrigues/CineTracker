CREATE OR REPLACE FUNCTION public.cinetracker_discover_filter_v327(p_items jsonb)
 RETURNS jsonb
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
with me as (
  select auth.uid() as uid
),
items_raw as materialized (
  select distinct
    case when lower(coalesce(x.media_type,''))='movie' then 'movie' else 'tv' end as media_type,
    x.tmdb_id,
    x.release_year,
    case when lower(coalesce(x.media_type,''))='movie'
      then 'movie:'||x.tmdb_id::text else 'tv:'||x.tmdb_id::text end as candidate_key,
    array_remove(array[
      nullif(regexp_replace(translate(lower(coalesce(x.title,'')),'áàãâäéèêëíìîïóòõôöúùûüçñ','aaaaaeeeeiiiiooooouuuucn'),'[^[:alnum:]]+','','g'),''),
      nullif(regexp_replace(translate(lower(coalesce(x.name,'')),'áàãâäéèêëíìîïóòõôöúùûüçñ','aaaaaeeeeiiiiooooouuuucn'),'[^[:alnum:]]+','','g'),''),
      nullif(regexp_replace(translate(lower(coalesce(x.original_title,'')),'áàãâäéèêëíìîïóòõôöúùûüçñ','aaaaaeeeeiiiiooooouuuucn'),'[^[:alnum:]]+','','g'),''),
      nullif(regexp_replace(translate(lower(coalesce(x.original_name,'')),'áàãâäéèêëíìîïóòõôöúùûüçñ','aaaaaeeeeiiiiooooouuuucn'),'[^[:alnum:]]+','','g'),'')
    ],null) as input_aliases
  from jsonb_to_recordset(coalesce(p_items,'[]'::jsonb))
    as x(media_type text,tmdb_id integer,title text,name text,original_title text,original_name text,release_year integer)
  where coalesce(x.tmdb_id,0)>0
),
candidate_catalog as materialized (
  select
    i.candidate_key,
    max(m.release_year) filter(where coalesce(m.release_year,0)>0) as catalog_year,
    coalesce(array_agg(distinct a) filter(where a is not null and a<>''),'{}'::text[]) as catalog_aliases
  from items_raw i
  left join public.media m
    on m.media_type=i.media_type
   and public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)=i.tmdb_id
  left join lateral unnest(array_remove(array[
    nullif(regexp_replace(translate(lower(coalesce(m.title,'')),'áàãâäéèêëíìîïóòõôöúùûüçñ','aaaaaeeeeiiiiooooouuuucn'),'[^[:alnum:]]+','','g'),''),
    nullif(regexp_replace(translate(lower(coalesce(m.original_title,'')),'áàãâäéèêëíìîïóòõôöúùûüçñ','aaaaaeeeeiiiiooooouuuucn'),'[^[:alnum:]]+','','g'),''),
    nullif(regexp_replace(translate(lower(coalesce(m.raw_tmdb->>'title','')),'áàãâäéèêëíìîïóòõôöúùûüçñ','aaaaaeeeeiiiiooooouuuucn'),'[^[:alnum:]]+','','g'),''),
    nullif(regexp_replace(translate(lower(coalesce(m.raw_tmdb->>'name','')),'áàãâäéèêëíìîïóòõôöúùûüçñ','aaaaaeeeeiiiiooooouuuucn'),'[^[:alnum:]]+','','g'),''),
    nullif(regexp_replace(translate(lower(coalesce(m.raw_tmdb->>'original_title','')),'áàãâäéèêëíìîïóòõôöúùûüçñ','aaaaaeeeeiiiiooooouuuucn'),'[^[:alnum:]]+','','g'),''),
    nullif(regexp_replace(translate(lower(coalesce(m.raw_tmdb->>'original_name','')),'áàãâäéèêëíìîïóòõôöúùûüçñ','aaaaaeeeeiiiiooooouuuucn'),'[^[:alnum:]]+','','g'),'')
  ],null)) a on true
  group by i.candidate_key
),
items as materialized (
  select
    i.media_type,i.tmdb_id,
    coalesce(nullif(i.release_year,0),c.catalog_year) as release_year,
    i.candidate_key,
    (
      select coalesce(array_agg(distinct z) filter(where z is not null and z<>''),'{}'::text[])
      from unnest(coalesce(i.input_aliases,'{}'::text[])||coalesce(c.catalog_aliases,'{}'::text[])) z
    ) as aliases
  from items_raw i
  left join candidate_catalog c using(candidate_key)
),
signals as materialized (
  select z.media_id,
    bool_or(z.is_watchlist) as is_watchlist,
    bool_or(z.is_seen) as is_seen,
    bool_or(z.is_not_interested) as is_not_interested
  from (
    select mo.media_id,
      (mo.state in ('AddedToWatchlist','WatchLater')) as is_watchlist,
      (mo.state in ('AlreadySeen','Completed','InProgress','UpToDate')) as is_seen,
      (mo.state='NotInterested') as is_not_interested
    from public.media_overrides mo cross join me
    where mo.profile_id=me.uid
      and mo.state in ('AddedToWatchlist','WatchLater','AlreadySeen','Completed','InProgress','UpToDate','NotInterested')
    union all
    select wh.media_id,false,true,false
    from public.watch_history wh cross join me
    where wh.profile_id=me.uid and wh.item_type in ('movie','episode') and wh.media_id is not null
    union all
    select ep.media_id,false,true,false
    from public.episode_progress ep cross join me
    where ep.profile_id=me.uid and ep.watched=true and ep.media_id is not null
    union all
    select pe.media_id,false,true,false
    from public.watch_play_events_v0994 pe cross join me
    where pe.profile_id=me.uid and pe.item_type in ('movie','episode') and pe.media_id is not null
  ) z
  group by z.media_id
),
catalog as materialized (
  select
    s.media_id,m.media_type,m.release_year,
    public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb) as effective_tmdb_id,
    array_remove(array[
      nullif(regexp_replace(translate(lower(coalesce(m.title,'')),'áàãâäéèêëíìîïóòõôöúùûüçñ','aaaaaeeeeiiiiooooouuuucn'),'[^[:alnum:]]+','','g'),''),
      nullif(regexp_replace(translate(lower(coalesce(m.original_title,'')),'áàãâäéèêëíìîïóòõôöúùûüçñ','aaaaaeeeeiiiiooooouuuucn'),'[^[:alnum:]]+','','g'),''),
      nullif(regexp_replace(translate(lower(coalesce(m.raw_tmdb->>'title','')),'áàãâäéèêëíìîïóòõôöúùûüçñ','aaaaaeeeeiiiiooooouuuucn'),'[^[:alnum:]]+','','g'),''),
      nullif(regexp_replace(translate(lower(coalesce(m.raw_tmdb->>'name','')),'áàãâäéèêëíìîïóòõôöúùûüçñ','aaaaaeeeeiiiiooooouuuucn'),'[^[:alnum:]]+','','g'),''),
      nullif(regexp_replace(translate(lower(coalesce(m.raw_tmdb->>'original_title','')),'áàãâäéèêëíìîïóòõôöúùûüçñ','aaaaaeeeeiiiiooooouuuucn'),'[^[:alnum:]]+','','g'),''),
      nullif(regexp_replace(translate(lower(coalesce(m.raw_tmdb->>'original_name','')),'áàãâäéèêëíìîïóòõôöúùûüçñ','aaaaaeeeeiiiiooooouuuucn'),'[^[:alnum:]]+','','g'),'')
    ],null) as aliases,
    s.is_watchlist,s.is_seen,s.is_not_interested
  from signals s
  join public.media m on m.id=s.media_id
),
matched as materialized (
  select
    i.candidate_key,
    bool_or(c.is_watchlist) as is_watchlist,
    bool_or(c.is_seen) as is_seen,
    bool_or(c.is_not_interested) as is_not_interested
  from items i
  left join catalog c
    on c.media_type=i.media_type
   and (
      c.effective_tmdb_id=i.tmdb_id
      or (
        i.aliases && c.aliases
        and (
          coalesce(i.release_year,0)=0
          or coalesce(c.release_year,0)=0
          or abs(c.release_year-i.release_year)<=1
        )
      )
   )
  group by i.candidate_key
),
final as (
  select candidate_key,
    coalesce(is_watchlist,false) as is_watchlist,
    coalesce(is_seen,false) as is_seen,
    coalesce(is_not_interested,false) as is_not_interested
  from matched
)
select jsonb_build_object(
  'blocked_keys',coalesce((select jsonb_agg(candidate_key order by candidate_key) from final where is_watchlist or is_seen or is_not_interested),'[]'::jsonb),
  'watch_keys',coalesce((select jsonb_agg(candidate_key order by candidate_key) from final where is_watchlist),'[]'::jsonb),
  'seen_keys',coalesce((select jsonb_agg(candidate_key order by candidate_key) from final where is_seen),'[]'::jsonb),
  'not_interested_keys',coalesce((select jsonb_agg(candidate_key order by candidate_key) from final where is_not_interested),'[]'::jsonb),
  'checked_count',(select count(*) from items),
  'blocked_count',(select count(*) from final where is_watchlist or is_seen or is_not_interested),
  'generated_at',now()
);
$function$
;
revoke execute on function public.cinetracker_discover_filter_v327(jsonb) from public,anon;
grant execute on function public.cinetracker_discover_filter_v327(jsonb) to authenticated;
notify pgrst,'reload schema';
