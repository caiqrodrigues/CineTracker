-- CineTracker Sports Hub v1 — canonical sports domain, independent from movie/tv media.

create table if not exists public.sports_catalog (
  slug text primary key,
  name_pt text not null,
  provider_sport_name text not null,
  icon text not null default '🏆',
  sort_order integer not null default 100,
  enabled boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.sport_entities (
  id bigint generated always as identity primary key,
  sport_slug text not null references public.sports_catalog(slug) on delete cascade,
  entity_type text not null check (entity_type in ('competition','team','athlete','driver','fighter')),
  provider text not null,
  provider_id text not null,
  name text not null,
  short_name text,
  country text,
  logo_url text,
  image_url text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(provider,entity_type,provider_id)
);
create index if not exists idx_sport_entities_sport_type on public.sport_entities(sport_slug,entity_type);
create index if not exists idx_sport_entities_name on public.sport_entities(lower(name));

create table if not exists public.sport_events (
  id bigint generated always as identity primary key,
  sport_slug text not null references public.sports_catalog(slug) on delete cascade,
  provider text not null,
  provider_event_id text not null,
  competition_entity_id bigint references public.sport_entities(id) on delete set null,
  home_entity_id bigint references public.sport_entities(id) on delete set null,
  away_entity_id bigint references public.sport_entities(id) on delete set null,
  title text not null,
  starts_at timestamptz not null,
  ends_at timestamptz,
  status text not null default 'scheduled' check (status in ('scheduled','live','finished','postponed','cancelled','unknown')),
  season text,
  round text,
  venue text,
  home_score text,
  away_score text,
  image_url text,
  participants jsonb not null default '[]'::jsonb,
  raw jsonb not null default '{}'::jsonb,
  last_synced_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(provider,provider_event_id)
);
create index if not exists idx_sport_events_start on public.sport_events(starts_at);
create index if not exists idx_sport_events_sport_start on public.sport_events(sport_slug,starts_at);
create index if not exists idx_sport_events_status_start on public.sport_events(status,starts_at);

create table if not exists public.user_sport_favorites (
  id bigint generated always as identity primary key,
  profile_id uuid not null references public.profiles(id) on delete cascade default auth.uid(),
  entity_id bigint not null references public.sport_entities(id) on delete cascade,
  notifications_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(profile_id,entity_id)
);
create index if not exists idx_user_sport_favorites_profile on public.user_sport_favorites(profile_id);

create table if not exists public.user_sport_preferences (
  profile_id uuid primary key references public.profiles(id) on delete cascade default auth.uid(),
  favorite_sports text[] not null default array['soccer','formula_1','mma','basketball','american_football','ice_hockey']::text[],
  timezone text not null default 'America/Sao_Paulo',
  live_notifications boolean not null default true,
  pre_event_minutes integer not null default 30 check (pre_event_minutes between 0 and 1440),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.sport_sync_state (
  provider text not null,
  sport_slug text not null references public.sports_catalog(slug) on delete cascade,
  sync_date date not null,
  status text not null default 'ok',
  event_count integer not null default 0,
  last_error text,
  metadata jsonb not null default '{}'::jsonb,
  last_synced_at timestamptz not null default now(),
  primary key(provider,sport_slug,sync_date)
);

alter table public.sports_catalog enable row level security;
alter table public.sport_entities enable row level security;
alter table public.sport_events enable row level security;
alter table public.user_sport_favorites enable row level security;
alter table public.user_sport_preferences enable row level security;
alter table public.sport_sync_state enable row level security;

drop policy if exists sports_catalog_read on public.sports_catalog;
create policy sports_catalog_read on public.sports_catalog for select to authenticated using (true);
drop policy if exists sport_entities_read on public.sport_entities;
create policy sport_entities_read on public.sport_entities for select to authenticated using (true);
drop policy if exists sport_events_read on public.sport_events;
create policy sport_events_read on public.sport_events for select to authenticated using (true);
drop policy if exists sport_sync_state_read on public.sport_sync_state;
create policy sport_sync_state_read on public.sport_sync_state for select to authenticated using (true);

drop policy if exists user_sport_favorites_select on public.user_sport_favorites;
create policy user_sport_favorites_select on public.user_sport_favorites for select to authenticated using (profile_id=auth.uid());
drop policy if exists user_sport_favorites_insert on public.user_sport_favorites;
create policy user_sport_favorites_insert on public.user_sport_favorites for insert to authenticated with check (profile_id=auth.uid());
drop policy if exists user_sport_favorites_update on public.user_sport_favorites;
create policy user_sport_favorites_update on public.user_sport_favorites for update to authenticated using (profile_id=auth.uid()) with check (profile_id=auth.uid());
drop policy if exists user_sport_favorites_delete on public.user_sport_favorites;
create policy user_sport_favorites_delete on public.user_sport_favorites for delete to authenticated using (profile_id=auth.uid());

drop policy if exists user_sport_preferences_select on public.user_sport_preferences;
create policy user_sport_preferences_select on public.user_sport_preferences for select to authenticated using (profile_id=auth.uid());
drop policy if exists user_sport_preferences_insert on public.user_sport_preferences;
create policy user_sport_preferences_insert on public.user_sport_preferences for insert to authenticated with check (profile_id=auth.uid());
drop policy if exists user_sport_preferences_update on public.user_sport_preferences;
create policy user_sport_preferences_update on public.user_sport_preferences for update to authenticated using (profile_id=auth.uid()) with check (profile_id=auth.uid());

insert into public.sports_catalog(slug,name_pt,provider_sport_name,icon,sort_order,metadata) values
('soccer','Futebol','Soccer','⚽',10,'{"api_sports":"football"}'::jsonb),
('formula_1','Fórmula 1','Motorsport','🏎️',20,'{"api_sports":"formula-1","league_filters":["Formula 1","F1"]}'::jsonb),
('mma','UFC / MMA','Fighting','🥊',30,'{"api_sports":"mma","league_filters":["UFC","ONE","Professional Fighters League","PFL","Cage Warriors","KSW","Invicta FC"]}'::jsonb),
('basketball','NBA / Basquete','Basketball','🏀',40,'{"api_sports":"basketball","featured_leagues":["NBA"]}'::jsonb),
('american_football','NFL / Futebol Americano','American Football','🏈',50,'{"api_sports":"nfl","featured_leagues":["NFL"]}'::jsonb),
('ice_hockey','NHL / Hóquei','Ice Hockey','🏒',60,'{"api_sports":"hockey","featured_leagues":["NHL"]}'::jsonb),
('baseball','Baseball','Baseball','⚾',70,'{"api_sports":"baseball","featured_leagues":["MLB"]}'::jsonb),
('tennis','Tênis','Tennis','🎾',80,'{"api_sports":"tennis"}'::jsonb),
('volleyball','Vôlei','Volleyball','🏐',90,'{"api_sports":"volleyball"}'::jsonb),
('handball','Handebol','Handball','🤾',100,'{"api_sports":"handball"}'::jsonb),
('rugby','Rugby','Rugby','🏉',110,'{"api_sports":"rugby"}'::jsonb),
('motogp','MotoGP','Motorsport','🏍️',120,'{"api_sports":"motorsport","league_filters":["MotoGP","Moto2","Moto3"]}'::jsonb)
on conflict(slug) do update set name_pt=excluded.name_pt,provider_sport_name=excluded.provider_sport_name,icon=excluded.icon,sort_order=excluded.sort_order,metadata=excluded.metadata,updated_at=now();

create or replace function public.cinetracker_sports_payload_v1(
  p_from timestamptz default date_trunc('day',now()),
  p_to timestamptz default date_trunc('day',now())+interval '8 days'
) returns jsonb
language plpgsql stable security invoker set search_path=public
as $$
declare v_result jsonb;
begin
  select jsonb_build_object(
    'sports',coalesce((select jsonb_agg(to_jsonb(x) order by x.sort_order) from (select slug,name_pt as name,provider_sport_name,icon,sort_order,metadata from public.sports_catalog where enabled)x),'[]'::jsonb),
    'favorites',coalesce((select jsonb_agg(to_jsonb(x) order by x.name) from (select f.id as favorite_id,e.id as entity_id,e.sport_slug,e.entity_type,e.name,e.short_name,e.country,e.logo_url,e.image_url,e.metadata,f.notifications_enabled from public.user_sport_favorites f join public.sport_entities e on e.id=f.entity_id where f.profile_id=auth.uid())x),'[]'::jsonb),
    'events',coalesce((select jsonb_agg(to_jsonb(x) order by x.starts_at) from (
      select ev.id,ev.sport_slug,ev.provider,ev.provider_event_id,ev.title,ev.starts_at,ev.ends_at,ev.status,ev.season,ev.round,ev.venue,ev.home_score,ev.away_score,ev.image_url,ev.participants,
        c.id as competition_id,c.name as competition_name,c.logo_url as competition_logo,
        h.id as home_id,h.name as home_name,h.logo_url as home_logo,
        a.id as away_id,a.name as away_name,a.logo_url as away_logo,
        exists(select 1 from public.user_sport_favorites f where f.profile_id=auth.uid() and f.entity_id=any(array[ev.competition_entity_id,ev.home_entity_id,ev.away_entity_id])) as has_favorite
      from public.sport_events ev
      left join public.sport_entities c on c.id=ev.competition_entity_id
      left join public.sport_entities h on h.id=ev.home_entity_id
      left join public.sport_entities a on a.id=ev.away_entity_id
      where ev.starts_at>=p_from and ev.starts_at<p_to
    )x),'[]'::jsonb),
    'preferences',coalesce((select to_jsonb(p) from public.user_sport_preferences p where p.profile_id=auth.uid()),jsonb_build_object('favorite_sports',to_jsonb(array['soccer','formula_1','mma','basketball','american_football','ice_hockey']::text[]),'timezone','America/Sao_Paulo','live_notifications',true,'pre_event_minutes',30)),
    'generated_at',now()
  ) into v_result;
  return v_result;
end;
$$;
grant execute on function public.cinetracker_sports_payload_v1(timestamptz,timestamptz) to authenticated;

create or replace function public.cinetracker_sport_toggle_favorite_v1(p_entity_id bigint,p_enabled boolean default true)
returns boolean language plpgsql security invoker set search_path=public
as $$
begin
  if p_enabled then
    insert into public.user_sport_favorites(profile_id,entity_id) values(auth.uid(),p_entity_id)
    on conflict(profile_id,entity_id) do update set updated_at=now();
  else
    delete from public.user_sport_favorites where profile_id=auth.uid() and entity_id=p_entity_id;
  end if;
  update public.profiles set updated_at=now() where id=auth.uid();
  return p_enabled;
end;
$$;
grant execute on function public.cinetracker_sport_toggle_favorite_v1(bigint,boolean) to authenticated;

create or replace function public.cinetracker_sport_preferences_v1(p_favorite_sports text[] default null,p_timezone text default null,p_live_notifications boolean default null,p_pre_event_minutes integer default null)
returns public.user_sport_preferences language plpgsql security invoker set search_path=public
as $$
declare v_row public.user_sport_preferences;
begin
  insert into public.user_sport_preferences(profile_id) values(auth.uid()) on conflict(profile_id) do nothing;
  update public.user_sport_preferences set favorite_sports=coalesce(p_favorite_sports,favorite_sports),timezone=coalesce(nullif(p_timezone,''),timezone),live_notifications=coalesce(p_live_notifications,live_notifications),pre_event_minutes=coalesce(p_pre_event_minutes,pre_event_minutes),updated_at=now() where profile_id=auth.uid() returning * into v_row;
  update public.profiles set updated_at=now() where id=auth.uid();
  return v_row;
end;
$$;
grant execute on function public.cinetracker_sport_preferences_v1(text[],text,boolean,integer) to authenticated;

do $$ begin
  if not exists(select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='sport_events') then alter publication supabase_realtime add table public.sport_events; end if;
  if not exists(select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='user_sport_favorites') then alter publication supabase_realtime add table public.user_sport_favorites; end if;
  if not exists(select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='user_sport_preferences') then alter publication supabase_realtime add table public.user_sport_preferences; end if;
end $$;
