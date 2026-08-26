-- Keep Bingers series-state semantics stable across future imports.
-- Library rows decide which shows are InProgress; watch-history rows alone do
-- not mean that a series is still active. On completion, historical TV shows
-- without an imported InProgress state are marked Completed.

create or replace function public.ct_guard_bingers_import_inprogress()
returns trigger
language plpgsql
set search_path to 'public'
as $function$
begin
  if new.origin = 'import'
     and new.state = 'InProgress'
     and new.watched_at is not null
     and new.source_import_id is not null
     and exists (
       select 1
       from public.imports i
       where i.id = new.source_import_id
         and i.profile_id = new.profile_id
         and i.summary->>'source' = 'Bingers'
     )
  then
    return null;
  end if;
  return new;
end;
$function$;

drop trigger if exists trg_guard_bingers_import_inprogress on public.media_overrides;
create trigger trg_guard_bingers_import_inprogress
before insert on public.media_overrides
for each row execute function public.ct_guard_bingers_import_inprogress();

create or replace function public.ct_finalize_bingers_series_states()
returns trigger
language plpgsql
set search_path to 'public'
as $function$
begin
  if new.status = 'completed'
     and new.summary->>'source' = 'Bingers'
     and old.status is distinct from new.status
  then
    insert into public.media_overrides(
      profile_id, media_id, state, origin, source_import_id,
      created_at, updated_at, watched_at
    )
    select
      new.profile_id,
      wh.media_id,
      'Completed',
      'import',
      new.id,
      now(),
      now(),
      max(wh.watched_at)
    from public.watch_history wh
    join public.media m on m.id = wh.media_id and m.media_type = 'tv'
    where wh.profile_id = new.profile_id
      and wh.source = 'bingers'
      and wh.item_type = 'episode'
      and not exists (
        select 1
        from public.media_overrides active
        where active.profile_id = new.profile_id
          and active.media_id = wh.media_id
          and active.state = 'InProgress'
          and active.origin = 'import'
          and active.source_import_id = new.id
      )
      and not exists (
        select 1
        from public.media_overrides manual
        where manual.profile_id = new.profile_id
          and manual.media_id = wh.media_id
          and manual.origin = 'manual'
          and manual.state in ('AlreadySeen','Completed','InProgress','NotInterested')
      )
    group by wh.media_id
    on conflict (profile_id, media_id, state) do nothing;
  end if;
  return new;
end;
$function$;

drop trigger if exists trg_finalize_bingers_series_states on public.imports;
create trigger trg_finalize_bingers_series_states
after update of status on public.imports
for each row execute function public.ct_finalize_bingers_series_states();
