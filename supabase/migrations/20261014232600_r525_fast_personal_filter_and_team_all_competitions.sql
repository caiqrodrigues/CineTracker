-- r525: fast personal filtering + team history across competitions.
CREATE OR REPLACE FUNCTION public.cinetracker_recommendation_filter_v525(p_items jsonb)
 RETURNS jsonb
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
with me as (select auth.uid() uid),
items as materialized (
  select e.ord::int ord,
         case when lower(coalesce(x.media_type,''))='movie' then 'movie' else 'tv' end media_type,
         x.tmdb_id::bigint tmdb_id,
         x.release_year::int release_year,
         case when lower(coalesce(x.media_type,''))='movie' then 'movie:'||x.tmdb_id::text else 'tv:'||x.tmdb_id::text end candidate_key,
         public.cinetracker_norm_title_v1(coalesce(x.title,'')) norm_title,
         public.cinetracker_norm_title_v1(coalesce(x.original_title,x.original_name,'')) norm_original
  from jsonb_array_elements(coalesce(p_items,'[]'::jsonb)) with ordinality e(item,ord)
  cross join lateral jsonb_to_record(e.item)
       as x(media_type text,tmdb_id bigint,title text,original_title text,original_name text,release_year int)
  where coalesce(x.tmdb_id,0)>0
),
override_state as materialized (
  select mo.media_id,
         bool_or(mo.state in ('AddedToWatchlist','WatchLater')) is_watchlist,
         bool_or(mo.state in ('AlreadySeen','Completed','InProgress','UpToDate')) is_seen_state,
         bool_or(mo.state='NotInterested') is_not_interested
  from public.media_overrides mo
  where mo.profile_id=(select uid from me)
  group by mo.media_id
),
seen_ids as materialized (
  select pe.media_id
  from public.watch_play_events_v0994 pe
  where pe.profile_id=(select uid from me) and pe.media_id is not null and pe.item_type in ('movie','episode')
  union
  select wh.media_id
  from public.watch_history wh
  where wh.profile_id=(select uid from me) and wh.media_id is not null and wh.item_type in ('movie','episode')
  union
  select ep.media_id
  from public.episode_progress ep
  where ep.profile_id=(select uid from me) and ep.media_id is not null and ep.watched=true
),
known_ids as materialized (
  select media_id from override_state
  union
  select media_id from seen_ids
),
known_media as materialized (
  select m.id media_id,
         m.media_type,
         public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)::bigint tmdb_id,
         coalesce(m.release_year,case when coalesce(m.raw_tmdb->>'release_date','') ~ '^[0-9]{4}' then left(m.raw_tmdb->>'release_date',4)::int
                                      when coalesce(m.raw_tmdb->>'first_air_date','') ~ '^[0-9]{4}' then left(m.raw_tmdb->>'first_air_date',4)::int end,0)::int release_year,
         array_remove(array[
           public.cinetracker_norm_title_v1(coalesce(m.title,'')),
           public.cinetracker_norm_title_v1(coalesce(m.original_title,'')),
           public.cinetracker_norm_title_v1(coalesce(m.raw_tmdb->>'title','')),
           public.cinetracker_norm_title_v1(coalesce(m.raw_tmdb->>'name','')),
           public.cinetracker_norm_title_v1(coalesce(m.raw_tmdb->>'original_title','')),
           public.cinetracker_norm_title_v1(coalesce(m.raw_tmdb->>'original_name',''))
         ],'') aliases,
         coalesce(os.is_watchlist,false) is_watchlist,
         (coalesce(os.is_seen_state,false) or si.media_id is not null) is_seen,
         coalesce(os.is_not_interested,false) is_not_interested
  from known_ids k
  join public.media m on m.id=k.media_id
  left join override_state os on os.media_id=m.id
  left join seen_ids si on si.media_id=m.id
),
matched as materialized (
  select i.ord,i.candidate_key,
         bool_or(k.is_watchlist) is_watchlist,
         bool_or(k.is_seen) is_seen,
         bool_or(k.is_not_interested) is_not_interested
  from items i
  join known_media k
    on k.media_type=i.media_type
   and (
     (k.tmdb_id>0 and k.tmdb_id=i.tmdb_id)
     or (
       (coalesce(i.release_year,0)=0 or k.release_year=0 or k.release_year=i.release_year)
       and k.aliases && array_remove(array[i.norm_title,i.norm_original],'')
     )
   )
  group by i.ord,i.candidate_key
),
final as (
  select i.ord,i.candidate_key,
         coalesce(m.is_watchlist,false) is_watchlist,
         coalesce(m.is_seen,false) is_seen,
         coalesce(m.is_not_interested,false) is_not_interested
  from items i left join matched m using(ord,candidate_key)
)
select jsonb_build_object(
 'blocked_keys',coalesce((select jsonb_agg(candidate_key order by ord) from final where is_watchlist or is_seen or is_not_interested),'[]'::jsonb),
 'watch_keys',coalesce((select jsonb_agg(candidate_key order by ord) from final where is_watchlist),'[]'::jsonb),
 'seen_keys',coalesce((select jsonb_agg(candidate_key order by ord) from final where is_seen),'[]'::jsonb),
 'not_interested_keys',coalesce((select jsonb_agg(candidate_key order by ord) from final where is_not_interested),'[]'::jsonb),
 'checked_count',(select count(*) from final),
 'blocked_count',(select count(*) from final where is_watchlist or is_seen or is_not_interested),
 'source','v525-user-known-first',
 'generated_at',now()
);
$function$

revoke all on function public.cinetracker_recommendation_filter_v525(jsonb) from public,anon;
grant execute on function public.cinetracker_recommendation_filter_v525(jsonb) to authenticated,service_role;

CREATE OR REPLACE FUNCTION public.cinetracker_sports_team_recent_v525(p_team_id bigint, p_limit integer DEFAULT 5)
 RETURNS jsonb
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
with cfg as (
  select greatest(1,least(coalesce(p_limit,5),10)) lim,(select auth.uid()) uid
), seed as materialized (
  select id,sport_slug,name,short_name,logo_url,country,provider,provider_id,
         public.cinetracker_norm_title_v1(coalesce(name,'')) norm_name,
         public.cinetracker_norm_title_v1(coalesce(short_name,'')) norm_short,
         regexp_replace(coalesce(provider_id,''),'^.*:','') provider_team_code
  from public.sport_entities
  where id=p_team_id and entity_type='team'
  limit 1
), aliases as materialized (
  select e.id
  from public.sport_entities e cross join seed s
  where e.entity_type='team' and e.sport_slug=s.sport_slug
    and (
      (
        s.provider like 'espn:%' and e.provider like 'espn:%'
        and s.provider_team_code<>''
        and regexp_replace(coalesce(e.provider_id,''),'^.*:','')=s.provider_team_code
      )
      or (
        s.norm_name<>'' and public.cinetracker_norm_title_v1(coalesce(e.name,''))=s.norm_name
      )
      or (
        s.norm_short<>'' and public.cinetracker_norm_title_v1(coalesce(e.short_name,''))=s.norm_short
      )
    )
), chosen as materialized (
  select ev.*
  from public.sport_events ev
  where (ev.home_entity_id in(select id from aliases) or ev.away_entity_id in(select id from aliases))
    and ev.starts_at<=now()+interval '5 minutes'
  order by ev.starts_at desc,ev.id desc
  limit (select lim from cfg)
), shaped as (
  select ev.id,ev.sport_slug,ev.provider,ev.provider_event_id,ev.title,ev.starts_at,ev.ends_at,ev.status,
         ev.season,ev.round,ev.venue,ev.home_score,ev.away_score,ev.image_url,ev.participants,
         c.id competition_id,c.name competition_name,c.logo_url competition_logo,
         h.id home_id,h.name home_name,h.logo_url home_logo,
         a.id away_id,a.name away_name,a.logo_url away_logo,
         (wh.id is not null) is_watched,wh.watched_at sport_watched_at,wh.duration_minutes watched_duration_minutes
  from chosen ev
  left join public.sport_entities c on c.id=ev.competition_entity_id
  left join public.sport_entities h on h.id=ev.home_entity_id
  left join public.sport_entities a on a.id=ev.away_entity_id
  left join public.user_sport_watch_history wh on wh.event_id=ev.id and wh.profile_id=(select uid from cfg)
  order by ev.starts_at desc,ev.id desc
)
select jsonb_build_object(
 'entity',coalesce((select jsonb_build_object('id',id,'sport_slug',sport_slug,'name',name,'short_name',short_name,'logo_url',logo_url,'country',country) from seed),'{}'::jsonb),
 'events',coalesce((select jsonb_agg(to_jsonb(shaped) order by starts_at desc,id desc) from shaped),'[]'::jsonb),
 'source','sports-team-recent-v525-all-competitions'
);
$function$

revoke all on function public.cinetracker_sports_team_recent_v525(bigint,integer) from public,anon;
grant execute on function public.cinetracker_sports_team_recent_v525(bigint,integer) to authenticated,service_role;

notify pgrst,'reload schema';
