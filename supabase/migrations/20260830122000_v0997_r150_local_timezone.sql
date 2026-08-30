create or replace function public.cinetracker_local_date_v0997()
returns date
language sql
stable
set search_path to 'public'
as $function$
  select coalesce(
    (
      select (now() at time zone (p.settings->>'timezone'))::date
      from public.profiles p
      where p.id=auth.uid()
        and coalesce(p.settings->>'timezone','')<>''
        and exists(select 1 from pg_timezone_names z where z.name=(p.settings->>'timezone'))
      limit 1
    ),
    current_date
  );
$function$;

create or replace function public.cinetracker_set_timezone_v0997(p_timezone text)
returns boolean
language plpgsql
volatile
set search_path to 'public'
as $function$
declare
  v_timezone text:=trim(coalesce(p_timezone,''));
begin
  if auth.uid() is null then return false; end if;
  if v_timezone='' or not exists(select 1 from pg_timezone_names z where z.name=v_timezone) then
    return false;
  end if;
  update public.profiles
  set settings=jsonb_set(coalesce(settings,'{}'::jsonb),'{timezone}',to_jsonb(v_timezone),true),
      updated_at=now()
  where id=auth.uid();
  return found;
end
$function$;

create or replace function public.cinetracker_profile_home_payload_v0997_r2()
returns jsonb
language sql
stable
set search_path to 'public'
as $function$
  select public.cinetracker_profile_home_payload_v0997_r3(public.cinetracker_local_date_v0997());
$function$;

create or replace function public.cinetracker_home_live_v0997_r2()
returns jsonb
language sql
stable
set search_path to 'public'
as $function$
  select public.cinetracker_profile_home_payload_v0997_r3(public.cinetracker_local_date_v0997());
$function$;

create or replace function public.cinetracker_home_live_v0997()
returns jsonb
language sql
stable
set search_path to 'public'
as $function$
  select public.cinetracker_profile_home_payload_v0997_r3(public.cinetracker_local_date_v0997());
$function$;

grant execute on function public.cinetracker_local_date_v0997() to authenticated;
grant execute on function public.cinetracker_set_timezone_v0997(text) to authenticated;
