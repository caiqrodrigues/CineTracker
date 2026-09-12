import {readFile} from 'node:fs/promises';
const runtime=await readFile(new URL('./runtime-r261-video-ground-truth-series.js',import.meta.url),'utf8');
const build=await readFile(new URL('./build-r261.mjs',import.meta.url),'utf8');
const migration=await readFile(new URL('../../supabase/migrations/20260912105000_r261_imported_series_state.sql',import.meta.url),'utf8');
const pkg=JSON.parse(await readFile(new URL('./package.json',import.meta.url),'utf8'));
const need=(s,x,m=x)=>{if(!s.includes(x))throw new Error('R261 missing '+m)};
for(const x of[
 "window.__ctR261='video-ground-truth-series-discover-detail'",
 "window.__ctR261Home='raw-smackdown-exact-frontier+special-series+persistent-home-cache'",
 "window.__ctR261Series='formula1-and-superbowl-first-class-imported-series'",
 "window.__ctR261Discover='button-height-reset+poster-2x3+native-drag-rails'",
 "window.__ctR261Detail='tmdb-cache-key-includes-params+nonblank-detail'",
 "ct-home-first-page-v261","function provisionalWeekly261(row)","cinetracker_imported_series_state_v1",
 "tmdb_id:-1321137963","tmdb_id:-1895884984","x?.air_date||x?.date","function armDiscover261()"
])need(runtime,x,x);
if(/new\s+MutationObserver\s*\(/.test(runtime))throw new Error('R261 must not add persistent MutationObserver');
for(const x of[
 "const REVISION='r261-official-1.0.52';","Object.keys(params||{}).sort()",
 ".ct259-media-card>button{display:flex!important","height:264px!important","height:231px!important",
 "app-v261.js","app-v261.css","ct-web-1.0.52-r261"
])need(build,x,x);
for(const x of['cinetracker_imported_series_state_v1','p_media_id bigint','security invoker','grant execute','authenticated'])need(migration,x,x);
if(pkg.version!=='1.0.52'||pkg.scripts.build!=='node build-r261-official.mjs')throw new Error('R261 package identity mismatch');
console.log('R261_STATIC_OK');
