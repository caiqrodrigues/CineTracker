do $$
declare
  fn text;
  old_block text := $old$
    case
      when b.is_completed then 'completed'
      when b.watched_episodes=0 and b.is_watchlist then 'not_started'
      when b.watched_episodes>0 and b.released_episodes<=b.watched_episodes then 'up_to_date'
      when b.watched_episodes>0 and b.released_episodes>b.watched_episodes and b.last_watched_at>=now()-interval '30 days' then 'continue'
      when b.watched_episodes>0 and b.released_episodes>b.watched_episodes then 'dust'
      else null
    end as home_bucket
$old$;
  new_block text := $new$
    case
      when b.is_completed then 'completed'
      when b.watched_episodes=0 and b.is_watchlist then 'not_started'
      when b.is_in_progress and b.watched_episodes>0 and b.last_watched_at>=now()-interval '30 days' then 'continue'
      when b.is_in_progress and b.watched_episodes>0 then 'dust'
      when b.is_up_to_date and not b.is_in_progress then 'up_to_date'
      when b.watched_episodes>0 and b.released_episodes<=b.watched_episodes then 'up_to_date'
      when b.watched_episodes>0 and b.released_episodes>b.watched_episodes and b.last_watched_at>=now()-interval '30 days' then 'continue'
      when b.watched_episodes>0 and b.released_episodes>b.watched_episodes then 'dust'
      else null
    end as home_bucket
$new$;
begin
  select pg_get_functiondef(p.oid) into fn
  from pg_proc p
  join pg_namespace n on n.oid=p.pronamespace
  where n.nspname='public' and p.proname='cinetracker_profile_home_payload_v0994'
  limit 1;

  if fn is null then
    raise exception 'cinetracker_profile_home_payload_v0994 not found';
  end if;
  if position(old_block in fn)=0 then
    raise exception 'expected v0994 home bucket block not found';
  end if;

  fn := replace(fn, old_block, new_block);
  execute fn;
end $$;
