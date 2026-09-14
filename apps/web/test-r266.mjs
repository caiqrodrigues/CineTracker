import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
const [js,css,release]=await Promise.all(['app-v266.js','app-v266.css','release.json'].map(f=>readFile(resolve(dist,f),'utf8')));
const must=(s,x)=>{if(!s.includes(x))throw new Error('R266 missing '+x)};
for(const x of[
 "window.__ctR266='r263-rebuilt-home-discover-detail-sports-safe'",
 "window.__ctR266Home='approved-list+inside-right-minimal-watch'",
 "window.__ctR266Discover='watchlist-is-exclusion+complete-personal-authority'",
 "window.__ctR266Sports='r263-stable-no-cross-scope-runtime-call'",
 "window.__ctR266Detail='producer-rails+local-horizontal-only'",
 "function scheduleHomeRestore263(){return restoreHomeList263()}",
 "cinetracker_recommendation_state_v108",
 "cinetracker_profile_media_dashboard_v0991",
 "cinetracker_watchlist_full_v119",
 "cinetracker_mark_watch_v0994",
 "x?.is_in_progress||x?.in_progress||x?.is_up_to_date||x?.up_to_date",
 "x?.is_not_interested||x?.not_interested",
 "excluded:union263(hard,fresh,watch),watchlist:[]"
])must(js,x);
if(js.includes('__ctR264')||js.includes('__ctR265')||js.includes('ct264-')||js.includes('ct265-'))throw new Error('R266 contains rejected r264/r265 authority');
if(js.includes('ct265AfterF1Paint')||js.includes('ct266AfterF1Paint'))throw new Error('R266 contains cross-scope Sports callback');
if(js.includes('for(const ms of[0,60,140,420,1000])'))throw new Error('R266 retained delayed Home reconciliation');
const fy=js.match(/function paintForYou263\(\)\{[\s\S]*?\n\}/)?.[0]||'';if(!fy)throw new Error('R266 active Pra Você producer missing');if(fy.includes('Da sua Watchlist')||fy.includes('d.watch'))throw new Error('R266 active Pra Você still recommends Watchlist');must(fy,"block263('Indicação do Dia'");must(fy,"block263('100% Novos'");
const sport=js.match(/function paintSports255\(\)\{[\s\S]*?\nrenderSports=async function/)?.[0]||'';if(!sport)throw new Error('R266 approved Sports producer missing');if(/ct26[456]AfterF1Paint/.test(sport))throw new Error('R266 Sports producer calls release-local helper');
for(const x of ['.ct266-home-watch-host','position:relative!important','.ct266-watch-action','position:absolute!important','right:8px!important','.ct266-detail-x','.ct169-season-chart-carousel','.chart-scroll','.related-row','.similar-row','.cast-row','overflow-x:auto!important','flex-wrap:nowrap!important'])must(css,x);
const rel=JSON.parse(release);if(rel.version!=='1.0.57'||rel.revision!=='r266-official-1.0.57'||rel.base!=='r263-official-1.0.54'||rel.r264!=='rejected'||rel.r265!=='rejected'||rel.android!=='unchanged-1.0.20')throw new Error('R266 release identity mismatch');
console.log('R266_STATIC_OK r263 base + right watch + strict Discover + local detail + safe Sports');
