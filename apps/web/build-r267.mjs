import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r266-official.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw]=await Promise.all([
  readFile(resolve(dist,'index.html'),'utf8'),
  readFile(resolve(dist,'app-v266.js'),'utf8'),
  readFile(resolve(dist,'app-v266.css'),'utf8'),
  readFile(resolve(dist,'service-worker.js'),'utf8')
]);
const must=(s,x,label=x)=>{if(!s.includes(x))throw new Error('r267 missing '+label)};
for(const x of[
  "window.__ctWebBuild='1.0.57';window.__ctOfficialVersion='1.0.57';",
  "const REVISION='r266-official-1.0.57';",
  "window.__ctR266='r263-rebuilt-home-discover-detail-sports-safe'",
  'function loadDiscover263(tab=discover263.tab,force=false)',
  'function paintBrowse263(rows,tab)',
  'renderDetail=async function(kind,id,seq)',
  'ct169-season-row','ct169-season-chart-carousel','ct169-cast-row','ct169-related-row'
])must(js,x,x);
if(js.includes('ct265AfterF1Paint')||js.includes('ct266AfterF1Paint'))throw new Error('r267 base contains forbidden Sports callback');

/* Personal authority: normalize the real RPC envelopes and all relevant status/id aliases. */
const oldType="const type263=x=>String(x?.media_type||x?.type||x?.raw_tmdb?.media_type||'tv')==='movie'?'movie':'tv';";
const oldId="const id263=x=>n263(x?.tmdb_id||x?.source_tmdb_id||x?.raw_tmdb?.source_tmdb_id||x?.raw_tmdb?.id||x?.id);";
must(js,oldType,'type263');must(js,oldId,'id263');
js=js.replace(oldType,"const type263=x=>{const t=norm263(x?.media_type||x?.tmdb_type||x?.item_type||x?.type||x?.media_kind||x?.raw_tmdb?.media_type||'tv');return /^(movie|film|filme)$/.test(t)?'movie':'tv'};");
js=js.replace(oldId,"const id263=x=>n263(x?.tmdb_id||x?.tmdbId||x?.source_tmdb_id||x?.sourceTmdbId||x?.raw_tmdb?.source_tmdb_id||x?.raw_tmdb?.tmdb_id||x?.raw_tmdb?.id||x?.id);");

const personalRx=/async function personal263\(force=false\)\{[\s\S]*?\n\}\nfunction strictEligible263/;
if(!personalRx.test(js))throw new Error('r267 cannot locate personal263');
const personal267=`/* CT267_PERSONAL_START */
function ct267Rows(v,depth=0){
 if(Array.isArray(v))return v;if(!v||typeof v!=='object'||depth>4)return[];
 for(const k of ['rows','data','items','results','entries','media','watchlist']){const n=v[k];if(Array.isArray(n))return n;if(n&&typeof n==='object'){const r=ct267Rows(n,depth+1);if(r.length)return r}}
 return[];
}
async function personal263(force=false){
 if(!force&&discover263.personal&&Date.now()-discover263.personalAt<120000)return discover263.personal;
 const bad=Symbol.for('ct267-personal-fail');
 let state=await timeout263(rpc('cinetracker_recommendation_state_v108',{}),4200,bad);
 if(state===bad){const old=await timeout263(rpc('cinetracker_recommendation_state_v107',{}),4200,bad);state=old===bad?{hard_excluded:[],fresh_excluded:[],watchlist:[]}:{hard_excluded:old?.fresh_excluded||[],fresh_excluded:old?.fresh_excluded||[],watchlist:[]}}
 const stateRoot=state?.data&&typeof state.data==='object'&&!Array.isArray(state.data)?state.data:state;
 const [dashRaw,fullRaw]=await Promise.all([
  timeout263(rpc('cinetracker_profile_media_dashboard_v0991',{p_limit:5000,p_offset:0}),5000,[]),
  timeout263(rpc('cinetracker_watchlist_full_v119',{}),5000,[])
 ]),dash=ct267Rows(dashRaw),full=ct267Rows(fullRaw);
 const hard=union263(rowsSet263(ct267Rows(stateRoot?.hard_excluded)),rowsSet263(ct267Rows(stateRoot?.not_interested||stateRoot?.notInterested))),fresh=rowsSet263(ct267Rows(stateRoot?.fresh_excluded)),watch=union263(rowsSet263(ct267Rows(stateRoot?.watchlist)),rowsSet263(full));
 for(const x of dash){
  const k=key263(x);if(!k||/:0$/.test(k))continue;
  const st=norm263(x?.user_state||x?.state||x?.status||x?.progress_status||x?.home_bucket||x?.bucket||'');
  const progress=n263(x?.progress_percent||x?.progress||x?.watched_episodes||x?.episodes_watched);
  const blocked=!!(x?.is_seen||x?.seen||x?.watched||x?.is_watched||x?.is_completed||x?.completed||x?.is_in_progress||x?.in_progress||x?.is_watching||x?.watching||x?.is_caught_up||x?.caught_up||x?.is_up_to_date||x?.up_to_date||x?.is_not_interested||x?.not_interested||x?.notInterested||progress>0)||/not interested|nao interessado|assistindo|em andamento|continue|juntando poeira|dust|em dia|caught|up to date|concluid|completed|watched|assistid/.test(st);
  if(blocked)hard.add(k);
  if(x?.is_watchlist||x?.watchlist||x?.is_added_to_watchlist||x?.is_watch_later||/watchlist/.test(st))watch.add(k);
 }
 const p={raw:stateRoot,hard,fresh,watch,excluded:union263(hard,fresh,watch),watchlist:[]};discover263.personal=p;discover263.personalAt=Date.now();return p;
}
/* CT267_PERSONAL_END */
function strictEligible263`;
js=js.replace(personalRx,personal267);

/* Discover: never clear the current content while a sub-tab is loading. Warm the other browse tabs in two workers and atomically swap when ready. */
const loadOld="function loadDiscover263(tab=discover263.tab,force=false){discover263.tab=tab;const gen=++discover263.gen;syncDiscover263();const h=discoverHost263();if(h)h.innerHTML='<div class=\"ct263-loading\">Carregando títulos…</div>';if(tab==='foryou'){void forYou263(gen,force);return}void loadBrowse263(tab,gen,force)}";
must(js,loadOld,'loadDiscover263');
const load267=`/* CT267_DISCOVER_TRANSITION_START */
let ct267PrimeTask=null;
function ct267CacheKey(tab,type=discover263.type){return \`${'${day263()}:${type}:${tab}'}\`}
function ct267PrimeDiscover(){
 if(ct267PrimeTask||discover263.type!=='all')return ct267PrimeTask;
 const typeAtStart=discover263.type,tabs=['top10','trending','popular','new','releases','anticipated','top','calendar'];
 ct267PrimeTask=(async()=>{let p;try{p=await personal263(false)}catch{return}let cursor=0;async function worker(){while(cursor<tabs.length){if(discover263.type!==typeAtStart)return;const tab=tabs[cursor++],key=ct267CacheKey(tab,typeAtStart);if(discover263.cache.has(key))continue;try{let rows=(await source263(tab)).filter(x=>!p.excluded.has(key263(x)));rows=rows.filter(x=>typeAtStart==='all'||type263(x)===typeAtStart);discover263.cache.set(key,rows.slice(0,tab==='top10'?10:60))}catch{}}}await Promise.all([worker(),worker()])})().finally(()=>{ct267PrimeTask=null});
 return ct267PrimeTask;
}
function loadDiscover263(tab=discover263.tab,force=false){
 discover263.tab=tab;const gen=++discover263.gen;syncDiscover263();const h=discoverHost263();
 if(tab==='foryou'){if(discover263.forYou)paintForYou263();else if(h&&!h.children.length)h.innerHTML='<div class=\"ct263-loading\">Carregando títulos…</div>';void forYou263(gen,force);void ct267PrimeDiscover();return}
 const key=ct267CacheKey(tab),cached=!force?discover263.cache.get(key):null;if(cached){paintBrowse263(cached,tab);if(tab==='top10'&&cached.length)void hydrateProviders263(cached).then(()=>{if(gen===discover263.gen&&discover263.tab===tab)paintBrowse263(cached,tab)});void ct267PrimeDiscover();return}
 if(h)h.setAttribute('aria-busy','true');
 void loadBrowse263(tab,gen,force).finally(()=>{if(gen===discover263.gen){discoverHost263()?.removeAttribute('aria-busy')}});void ct267PrimeDiscover();
}
/* CT267_DISCOVER_TRANSITION_END */`;
js=js.replace(loadOld,load267);

/* Rich series detail: own the actual r169 producer used by /series/:id, not the obsolete simple renderer. */
const detailAnchor='/* ---------- render de detalhes inspirado no layout pedido ---------- */';must(js,detailAnchor,'r169 rich detail anchor');
const detailHelpers=`/* CT267_DETAIL_HELPERS_START */
function ct267ArmRail(el){if(!el||el.dataset.ct267Drag==='1')return;el.dataset.ct267Drag='1';let st=null,moved=false;el.addEventListener('pointerdown',e=>{if(e.pointerType==='touch'||(e.button!=null&&e.button!==0)||el.scrollWidth<=el.clientWidth+2)return;st={id:e.pointerId,x:e.clientX,left:el.scrollLeft};moved=false;try{el.setPointerCapture(e.pointerId)}catch{}});el.addEventListener('pointermove',e=>{if(!st||e.pointerId!==st.id)return;const dx=e.clientX-st.x;if(Math.abs(dx)>4)moved=true;if(moved){el.scrollLeft=st.left-dx;e.preventDefault()}});const end=e=>{if(!st||e.pointerId!==st.id)return;st=null;try{el.releasePointerCapture(e.pointerId)}catch{}};el.addEventListener('pointerup',end);el.addEventListener('pointercancel',end);el.addEventListener('click',e=>{if(moved){e.preventDefault();e.stopImmediatePropagation();moved=false}},true)}
function ct267ArmDetailRails(root=document){for(const el of root.querySelectorAll?.('.ct169-season-row,.ct169-season-chart-carousel,.ct169-chart-scroll,.ct169-cast-row,.ct169-related-row')||[]){el.classList.add('ct267-detail-x');ct267ArmRail(el)}return true}
/* CT267_DETAIL_HELPERS_END */
`;
js=js.replace(detailAnchor,detailHelpers+detailAnchor);
const richPage='<div class="page ct169-detail-page" data-detail>';
must(js,richPage,'r169 detail page');js=js.replace(richPage,'<div class="page ct169-detail-page ct267-detail-scope" data-detail>');
for(const [a,b] of [
 ['<section class="ct169-detail-section">','<section class="ct169-detail-section ct267-detail-section">'],
 ['<section class="ct169-detail-section ct169-rating-section">','<section class="ct169-detail-section ct169-rating-section ct267-detail-section">'],
 ['<div class="ct169-season-row">','<div class="ct169-season-row ct267-detail-x">'],
 ['<div class="ct169-season-chart-carousel" data-ct169-season-charts>','<div class="ct169-season-chart-carousel ct267-detail-x" data-ct169-season-charts>'],
 ['<div class="ct169-cast-row">','<div class="ct169-cast-row ct267-detail-x">'],
 ['<div class="ct169-related-row">','<div class="ct169-related-row ct267-detail-x">']
]){must(js,a,a);js=js.replaceAll(a,b)}
const graphCall="if(tmdbKind==='tv')void ct169LoadSeasonGraphs(Number(id),seasons,seq);";must(js,graphCall,'rich detail graph call');
js=js.replace(graphCall,"ct267ArmDetailRails(h);if(tmdbKind==='tv')void ct169LoadSeasonGraphs(Number(id),seasons,seq).finally(()=>ct267ArmDetailRails(h));");

/* Release identity. */
js=js.replace("window.__ctWebBuild='1.0.57';window.__ctOfficialVersion='1.0.57';","window.__ctWebBuild='1.0.58';window.__ctOfficialVersion='1.0.58';");
js=js.replace("const REVISION='r266-official-1.0.57';","const REVISION='r267-official-1.0.58';");
must(js,'\nboot();','boot insertion');
js=js.replace('\nboot();',"\nwindow.__ctR267='video-ground-truth-discover-detail-home';window.__ctR267Discover='atomic-tabs+recursive-personal-exclusions';window.__ctR267Detail='r169-rich-producer-local-x';window.__ctR267Home='glyph-only-right-watch';window.__ctR267Sports='r266-stable-preserved';\nboot();");

css+=`\n/* CineTracker Web 1.0.58 r267 — video ground truth */
.ct266-watch-action{border:0!important;background:transparent!important;box-shadow:none!important;border-radius:0!important;color:#bfeaff!important;width:28px!important;height:28px!important;min-width:28px!important;min-height:28px!important;padding:0!important}
.ct266-watch-action:hover,.ct266-watch-action:focus-visible{background:transparent!important;color:#fff!important;outline:1px solid #3d7795!important;outline-offset:2px!important}
[data-ct263-discover-content][aria-busy="true"]{min-height:1px!important}
.ct267-detail-scope{box-sizing:border-box!important;width:100%!important;min-width:0!important;max-width:100%!important;overflow-x:hidden!important}
.ct267-detail-section{box-sizing:border-box!important;width:100%!important;min-width:0!important;max-width:100%!important;overflow-x:hidden!important}
.ct267-detail-x{box-sizing:border-box!important;display:flex!important;flex-wrap:nowrap!important;width:100%!important;min-width:0!important;max-width:100%!important;overflow-x:auto!important;overflow-y:hidden!important;overscroll-behavior-x:contain!important;-webkit-overflow-scrolling:touch!important;touch-action:pan-x pan-y!important;scrollbar-width:thin!important;scrollbar-gutter:stable!important}
.ct267-detail-x>*{flex-shrink:0!important}.ct169-season-row.ct267-detail-x>*{flex-basis:120px!important}.ct169-cast-row.ct267-detail-x>*{flex-basis:126px!important}.ct169-related-row.ct267-detail-x>*{flex-basis:145px!important}.ct169-season-chart-carousel.ct267-detail-x>.ct169-season-chart-card{flex:0 0 min(760px,88vw)!important}
.ct169-chart-scroll.ct267-detail-x{display:block!important}.ct169-chart-scroll.ct267-detail-x>svg{min-width:690px!important}
.ct267-detail-x::-webkit-scrollbar{height:8px!important}
@media(min-width:901px){.ct267-detail-scope,.ct267-detail-section{max-width:calc(100vw - 192px)!important}}
@media(min-width:701px) and (max-width:900px){.ct267-detail-scope,.ct267-detail-section{max-width:calc(100vw - 172px)!important}}
@media(max-width:700px){.ct267-detail-scope,.ct267-detail-section{max-width:calc(100vw - 22px)!important}}
`;

html=html.replaceAll('r266-official-1.0.57','r267-official-1.0.58').replaceAll('app-v266.js','app-v267.js').replaceAll('app-v266.css','app-v267.css');
sw=sw.replaceAll('app-v266.js','app-v267.js').replaceAll('app-v266.css','app-v267.css').replaceAll("const CACHE='ct-web-1.0.57-r266';","const CACHE='ct-web-1.0.58-r267';").replaceAll('r266-official-1.0.57','r267-official-1.0.58');

await Promise.all([
 writeFile(resolve(dist,'index.html'),html,'utf8'),
 writeFile(resolve(dist,'app-v267.js'),js,'utf8'),
 writeFile(resolve(dist,'app-v267.css'),css,'utf8'),
 writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),
 writeFile(resolve(dist,'release.json'),JSON.stringify({version:'1.0.58',revision:'r267-official-1.0.58',base:'r266-production',video_ground_truth:true,r264:'rejected',r265:'rejected',android:'1.0.20/10062',generated_at:new Date().toISOString()},null,2),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v266.js'),{force:true}),rm(resolve(dist,'app-v266.css'),{force:true})]);
console.log('WEB_R267_READY video-ground-truth discover=atomic+personal detail=r169-local-scroll home=glyph-only sports=preserved');
