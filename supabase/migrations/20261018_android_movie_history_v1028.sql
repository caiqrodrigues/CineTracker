-- Additive, Android-only history endpoint; the Web r541 RPC is untouched.
create or replace function public.cinetracker_android_movie_history_v1028(p_limit integer default 450)
returns jsonb
language sql stable
set search_path to 'public'
as $fn$
with latest as (
 select h.id,h.media_id,h.title as history_title,h.watched_at,h.external_ids,
        m.title as canonical_title,m.tmdb_id,m.raw_tmdb,m.media_type,m.poster_path,
        m.release_year,m.runtime_minutes
 from public.watch_history h
 left join public.media m on m.id=h.media_id
 where h.profile_id=auth.uid() and h.item_type='movie'
 order by h.watched_at desc nulls last,h.id desc
 limit greatest(1,least(coalesce(p_limit,450),500))
)
select coalesce(jsonb_agg(jsonb_build_object(
 'id',h.id,'media_id',h.media_id,
 'tmdb_id',coalesce(public.cinetracker_effective_tmdb_id(h.tmdb_id,h.raw_tmdb),0),
 'media_type','movie',
 'media_title',coalesce(nullif(h.canonical_title,''),nullif(h.history_title,''),'Filme'),
 'title',coalesce(nullif(h.canonical_title,''),nullif(h.history_title,''),'Filme'),
 'poster_path',coalesce(nullif(h.poster_path,''),nullif(h.raw_tmdb->>'poster_path','')),
 'release_year',h.release_year,'runtime_minutes',h.runtime_minutes,
 'watched_at',h.watched_at,
 'plays',case when coalesce(h.external_ids->>'plays','') ~ '^[0-9]{1,8}$'
   then greatest(1,(h.external_ids->>'plays')::integer) else 1 end
 ) order by h.watched_at desc nulls last,h.id desc),'[]'::jsonb)
from latest h;
$fn$;
grant execute on function public.cinetracker_android_movie_history_v1028(integer) to authenticated;