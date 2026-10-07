create or replace function public.cinetracker_home_series_v492(
  p_today date default current_date,
  p_limit_per_bucket integer default 24
)
returns jsonb
language sql
stable
security invoker
set search_path=public
as $$
with cfg as (select least(greatest(coalesce(p_limit_per_bucket,24),1),250)::int lim),
src as materialized (
  select e.value x,e.ordinality ord,coalesce(e.value->>'home_bucket','other') bucket
  from jsonb_array_elements(public.cinetracker_home_series_v452(coalesce(p_today,current_date))) with ordinality e(value,ordinality)
),
ranked as materialized (select x,ord,bucket,row_number() over(partition by bucket order by ord)::int rn from src),
limited as (select * from ranked where rn <= (select lim from cfg)),
counts as (select jsonb_object_agg(bucket,cnt order by bucket) j from (select bucket,count(*)::int cnt from src group by bucket) x)
select jsonb_build_object(
  'rows',coalesce((select jsonb_agg(x order by ord) from limited),'[]'::jsonb),
  'counts',coalesce((select j from counts),'{}'::jsonb),
  'limit_per_bucket',(select lim from cfg),
  'total',(select count(*)::int from src),
  'generated_at',now()
);
$$;
revoke all on function public.cinetracker_home_series_v492(date,integer) from public,anon;
grant execute on function public.cinetracker_home_series_v492(date,integer) to authenticated;
notify pgrst,'reload schema';
