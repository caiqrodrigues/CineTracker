import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
const [js,css,release]=await Promise.all(['app-v265.js','app-v265.css','release.json'].map(f=>readFile(resolve(dist,f),'utf8')));
const must=(s,x)=>{if(!s.includes(x))throw new Error('R265 missing '+x)};
for(const x of[
 "window.__ctR265='producer-owned-home-discover-sports-detail'",
 "window.__ctR265Home='paint-owned-tab+side-watch-actions'",
 "window.__ctR265Discover='single-nine-tab-producer+personal-authority'",
 "window.__ctR265Sports='producer-f1-tabs-filters-feed+direct-f1-watch'",
 "window.__ctR265Detail='producer-markup+nowrap-local-x'",
 "function scheduleHomeRestore263(){return restoreHomeList263()}",
 "function scheduleF1Watch263(force=false){return false}",
 "cinetracker_recommendation_state_v108",
 "cinetracker_profile_media_dashboard_v0991",
 "cinetracker_watchlist_full_v119",
 "cinetracker_mark_watch_v0994",
 "CT265_DISCOVER_LABELS=['Pra você','Top 10','Em alta','Populares','Novidades','Lançamentos','Mais Aguardados','Mais bem avaliados','Calendário']"
])must(js,x);
if(js.includes('__ctR264')||js.includes('ct264-'))throw new Error('R265 contains rejected r264 post-render authority');
if(js.includes('for(const ms of[0,60,140,420,1000])'))throw new Error('R265 retained delayed Home repaint reconciliation');
if(js.includes('for(const ms of[180,650,1500,2600])'))throw new Error('R265 retained delayed F1 reconciliation');
const sport=js.match(/function paintSports255\(\)\{[\s\S]*?\nrenderSports=async function/)?.[0]||'';
for(const x of ['ct255-f1hub','ct255-sports-tabs','ct255-sport-filters','ct255-sports-feed'])must(sport,x);
const order=['ct255-f1hub','ct255-sports-tabs','ct255-sport-filters','ct255-sports-feed'].map(x=>sport.indexOf(x));if(order.some(x=>x<0)||!order.every((x,i)=>i===0||x>order[i-1]))throw new Error('R265 Sports producer order is not F1 -> tabs -> filters -> feed');
must(sport,'void ct265AfterF1Paint()');
for(const x of ['.ct265-home-action-row','.ct265-watch-btn','.ct265-detail-x','flex-wrap:nowrap!important','overflow-x:auto!important'])must(css,x);
const rel=JSON.parse(release);if(rel.version!=='1.0.56'||rel.revision!=='r265-official-1.0.56'||rel.r264!=='removed'||rel.android!=='unchanged-1.0.20')throw new Error('R265 release identity mismatch');
console.log('R265_STATIC_OK producer-owned Home Discover Sports Detail; r264 removed');
