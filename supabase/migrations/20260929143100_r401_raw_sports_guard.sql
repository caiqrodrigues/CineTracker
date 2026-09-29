-- r401 guard: plain "Raw" must follow recurring-sports semantics, not historical backlog semantics.
do $block$
declare ddl text;
begin
  select pg_get_functiondef('public.cinetracker_home_series_v401(date)'::regprocedure) into ddl;
  ddl:=replace(
    ddl,
    '(wwe|smackdown|wwenxt|mondaynightraw|fridaynightsmackdown|formula1|formulaone|ufc)',
    '(wwe|raw|smackdown|wwenxt|mondaynightraw|fridaynightsmackdown|formula1|formulaone|ufc)'
  );
  execute ddl;
end
$block$;
notify pgrst,'reload schema';
