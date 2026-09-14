import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
await import('./build-r275-official.mjs');
const dist=resolve('dist');
const [js,css,release,migration]=await Promise.all([
 readFile(resolve(dist,'app-v275.js'),'utf8'),
 readFile(resolve(dist,'app-v275.css'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve('../../supabase/migrations/20260914181206_r275_series_watch_state_for_home.sql'),'utf8')
]);
const must=(s,x)=>{if(!s.includes(x))throw new Error('R275_STATIC missing '+x)};
for(const x of[
 "window.__ctR275='collapsible-history+rewatch-multiplier+fresh-next+strict-dedupe'",
 "window.__ctR275History='collapsed-above-continue'",
 "window.__ctR275Series='fresh-tmdb-first-unseen+effective-tmdb-dedupe'",
 "rpc('cinetracker_home_series_watch_state_v1'",
 "return t>0?'tmdb:'+t:'media:'+Number(x?.media_id||0)",
 'function ct275DedupSeries(rows)',
 'async function ct275FirstReleasedUnseen(row,show)',
 "if(!watched.has(sn+':'+en))return{season_number:sn,episode_number:en",
 "if(row.home_bucket==='up_to_date'||row.home_bucket==='continue')row.home_bucket='continue'",
 "return 'Próximo: S'+String(Number(ep.season_number||0)).padStart(2,'0')+'E'+String(Number(ep.episode_number||0)).padStart(2,'0')+' - '",
 'Ver Histórico ˅',
 'Ocultar Histórico ^',
 'data-ct275-history-toggle',
 'ct275-plays-badge',
 "ct274Rewatch=ct275Rewatch",
 'paintHome=ct275PaintHome;renderHome=ct275RenderHome;'
])must(js,x);
for(const x of['grid-template-rows:0fr!important','grid-template-rows:1fr!important','transition:grid-template-rows .28s ease','ct275MultiplierPop','order:-100!important'])must(css,x);
for(const x of['cinetracker_home_series_watch_state_v1','limit 200','cinetracker_effective_tmdb_id','episode_progress','watch_history','canonical_media_id','watched_keys','revoke all on function','grant execute on function'])must(migration.toLowerCase(),x.toLowerCase());
const meta=JSON.parse(release);if(meta.version!=='1.0.66'||meta.revision!=='r275-official-1.0.66'||meta.home_history_collapsible!==true||meta.home_history_default_collapsed!==true||meta.home_rewatch_multiplier!==true||meta.home_strict_dedupe!=='effective-tmdb'||meta.home_fresh_episode_reconciliation!==true||meta.home_up_to_date_next_episode!==true)throw new Error('R275_STATIC release flags');
console.log('R275_STATIC_OK collapsible-history multiplier fresh-first-unseen strict-dedupe');
