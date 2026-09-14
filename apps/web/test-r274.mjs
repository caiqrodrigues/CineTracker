import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
await import('./build-r274-official.mjs');
const dist=resolve('dist');
const [js,css,release,migHome,migRewatch]=await Promise.all([
 readFile(resolve(dist,'app-v274.js'),'utf8'),
 readFile(resolve(dist,'app-v274.css'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve('../../supabase/migrations/20260914172954_r274_home_payload_timeout_history_metadata.sql'),'utf8'),
 readFile(resolve('../../supabase/migrations/20260914173231_r274_history_rewatch_rpc.sql'),'utf8')
]);
const must=(s,x)=>{if(!s.includes(x))throw new Error('R274_STATIC missing '+x)};
for(const x of[
 "window.__ctR274='home-r6-fast+ascending-history+rich-meta+rewatch'",
 "window.__ctR274Home='r6-limit20+series120+movies120'",
 "window.__ctR274History='oldest-top+newest-bottom+auto-bottom'",
 "rpc('cinetracker_profile_home_payload_v0997_r6'",
 'p_history_limit:20,p_series_limit:120,p_movie_limit:120',
 "rpc('cinetracker_rewatch_history_v1'",
 "return 'S'+String(s||0).padStart(2,'0')+'E'+String(e||0).padStart(2,'0')+' • Ep: '+name+' • ⭐ '+ct274Rating(rating)+' • '+ct274Date(date)",
 "return year+' • '+(runtime>0?runtime+' min':'Duração não informada')+' • '+genres+' • ⭐ '+ct274Rating(rating)",
 "return n===1?'1 episódio disponível para ver':n+' episódios disponíveis para ver'",
 'function ct274AscHistory(rows)',
 'return da-db||Number(a?.id||0)-Number(b?.id||0)',
 's.scrollTop=s.scrollHeight',
 'data-ct274-rewatch="',
 'ct273ReloadHome=ct274ReloadHome',
 'paintHome=ct274PaintHome;renderHome=ct274RenderHome;'
])must(js,x);
for(const x of['display:flex!important','flex-direction:row!important','flex-wrap:nowrap!important','width:40px!important','height:40px!important','ct274-history-actions','overflow-y:auto!important'])must(css,x);
for(const x of[
 'idx_watch_history_profile_episode_recent_r274',
 'idx_watch_history_profile_movie_recent_r274',
 'idx_media_overrides_profile_state_updated_r274',
 'cinetracker_profile_home_payload_v0997_r6',
 'p_history_limit integer default 20',
 'p_series_limit integer default 120',
 'p_movie_limit integer default 120',
 "limit (select history_limit from params)",
 "jsonb_agg(to_jsonb(h) order by h.watched_at asc,h.id asc)",
 'security invoker',
 'set search_path=public'
])must(migHome.toLowerCase(),x.toLowerCase());
for(const x of['cinetracker_rewatch_history_v1','security invoker','cinetracker_mark_watch_v0994','revoke all on function','grant execute on function'])must(migRewatch.toLowerCase(),x.toLowerCase());
const meta=JSON.parse(release);if(meta.version!=='1.0.65'||meta.revision!=='r274-official-1.0.65'||meta.home_payload_source!=='cinetracker_profile_home_payload_v0997_r6'||meta.home_history_limit!==20||meta.home_history_order!=='oldest-top-newest-bottom'||meta.home_rewatch!==true||meta.home_episode_metadata!==true||meta.home_movie_metadata!==true)throw new Error('R274_STATIC release flags');
console.log('R274_STATIC_OK r6-bounded ascending-history rich-meta rewatch');
