import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

/* r266 is rebuilt from the last approved r263. r264/r265 are intentionally not imported. */
await import('./build-r263-official.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw]=await Promise.all([
  readFile(resolve(dist,'index.html'),'utf8'),
  readFile(resolve(dist,'app-v263.js'),'utf8'),
  readFile(resolve(dist,'app-v263.css'),'utf8'),
  readFile(resolve(dist,'service-worker.js'),'utf8')
]);
const must=(s,x,label=x)=>{if(!s.includes(x))throw new Error('r266 missing '+label)};
for(const x of[
  "window.__ctR263='approved-home-list-discover-intelligence-f1-watched'",
  "const REVISION='r263-official-1.0.54';",
  'function personal263(force=false)',
  'async function forYou263(gen,force=false)',
  'function paintForYou263()',
  'function scheduleHomeRestore263()',
  'function scheduleF1Watch263(force=false)',
  'function paintSports255()',
  'cinetracker_mark_watch_v0994'
])must(js,x,x);
if(js.includes('__ctR264')||js.includes('__ctR265')||js.includes('ct264-')||js.includes('ct265-'))throw new Error('r266 base contains rejected r264/r265 authority');
const observerCountBefore=(js.match(/new MutationObserver/g)||[]).length;

/* Discover: personal library is authoritative across every tab. Watchlist is exclusion only;
   there is no Watchlist recommendation block in r266. */
const personalRx=/async function personal263\(force=false\)\{[\s\S]*?\n\}\nfunction strictEligible263/;
if(!personalRx.test(js))throw new Error('r266 cannot locate personal263');
const personal266=`async function personal263(force=false){
 if(!force&&discover263.personal&&Date.now()-discover263.personalAt<120000)return discover263.personal;
 const bad=Symbol.for('ct266-personal-fail'),list=v=>Array.isArray(v)?v:(Array.isArray(v?.rows)?v.rows:[]);
 let state=await timeout263(rpc('cinetracker_recommendation_state_v108',{}),4200,bad);
 if(state===bad){const old=await timeout263(rpc('cinetracker_recommendation_state_v107',{}),4200,bad);state=old===bad?{hard_excluded:[],fresh_excluded:[],watchlist:[]}:{hard_excluded:old?.fresh_excluded||[],fresh_excluded:old?.fresh_excluded||[],watchlist:[]}}
 const [dashRaw,fullRaw]=await Promise.all([
  timeout263(rpc('cinetracker_profile_media_dashboard_v0991',{}),5000,[]),
  timeout263(rpc('cinetracker_watchlist_full_v119',{}),5000,{rows:[]})
 ]),dash=list(dashRaw),full=list(fullRaw);
 const hard=rowsSet263(state?.hard_excluded),fresh=rowsSet263(state?.fresh_excluded),watch=union263(rowsSet263(state?.watchlist),rowsSet263(full));
 for(const x of dash){const k=key263(x);if(!k||/:0$/.test(k))continue;const st=norm263(x?.user_state||x?.state||x?.status||'');if(x?.is_seen||x?.is_completed||x?.is_in_progress||x?.in_progress||x?.is_up_to_date||x?.up_to_date||n263(x?.watched_episodes)>0||x?.is_not_interested||x?.not_interested||/not interested|nao interessado|assistindo|em andamento|em dia|concluid|assistid/.test(st))hard.add(k);if(x?.is_watchlist||x?.is_added_to_watchlist||x?.is_watch_later||/watchlist/.test(st))watch.add(k)}
 const p={raw:state,hard,fresh,watch,excluded:union263(hard,fresh,watch),watchlist:[]};discover263.personal=p;discover263.personalAt=Date.now();return p;
}
function strictEligible263`;
js=js.replace(personalRx,personal266);

const forYouRx=/async function forYou263\(gen,force=false\)\{[\s\S]*?\n\}\nfunction paintForYou263\(\)\{[\s\S]*?\}\nasync function loadBrowse263/;
if(!forYouRx.test(js))throw new Error('r266 cannot locate active Pra Você producer');
const forYou266=`async function forYou263(gen,force=false){
 try{
  const p=await personal263(force),[trend,mov,tv]=await Promise.all([tmdbPages263('/trending/all/day',{},null,2),tmdbPages263('/discover/movie',{'primary_release_date.gte':shift263(-30),'primary_release_date.lte':day263(),sort_by:'vote_average.desc','vote_count.gte':25},'movie',2),tmdbPages263('/discover/tv',{'first_air_date.gte':shift263(-30),'first_air_date.lte':day263(),sort_by:'vote_average.desc','vote_count.gte':20},'tv',2)]);
  if(gen!==discover263.gen||String(typeof route==='function'?route():'')!=='discover'||discover263.tab!=='foryou')return;
  const picks=dedupe263(trend).filter(x=>strictEligible263(x,p)).slice(0,12),fresh=dedupe263([...mov,...tv]).filter(x=>strictEligible263(x,p,{fresh:true})).slice(0,30);
  discover263.forYou={picks,fresh};paintForYou263();
 }catch(_){const h=discoverHost263();if(h&&gen===discover263.gen)h.innerHTML='<div class="empty">Não foi possível validar sua biblioteca agora. Tente novamente.</div>'}
}
function paintForYou263(){const h=discoverHost263(),d=discover263.forYou;if(!h||!d)return;const pick=d.picks?.length?d.picks[discover263.swap%d.picks.length]:null;h.innerHTML=\`<div data-ct263-foryou>\${block263('Indicação do Dia',pick?[pick]:[],d.picks?.length>1?'<button type="button" class="chip" data-ct263-swap>Trocar</button>':'')}\${block263('100% Novos',d.fresh||[])}</div>\`;armDiscoverRails263(h)}
async function loadBrowse263`;
js=js.replace(forYouRx,forYou266);

/* Home: keep the approved list DOM. The discreet watched action is injected inside the real item,
   absolutely anchored on its right edge, never as a second grid/flex column and never below it. */
const homeAnchor="const paintHome263Base=typeof paintHome==='function'?paintHome:null;";
must(js,homeAnchor,'r263 Home anchor');
const homeHelpers=`/* CT266_HOME_HELPERS_START */
window.__ctR266='r263-rebuilt-home-discover-detail-sports-safe';
window.__ctR266Home='approved-list+inside-right-minimal-watch';
window.__ctR266Discover='watchlist-is-exclusion+complete-personal-authority';
window.__ctR266Sports='r263-stable-no-cross-scope-runtime-call';
window.__ctR266Detail='producer-rails+local-horizontal-only';
window.__ctR266Horizontal='document-fixed+component-owned-x';
let ct266HomeTab='series',ct266HomeBusy=false;
function ct266CurrentHomeTab(){const r=document.querySelector('[data-home]');if(!r)return ct266HomeTab;const a=r.querySelector('[data-home-tab].active');if(a?.dataset?.homeTab==='movies'||a?.dataset?.homeTab==='series')return a.dataset.homeTab;const m=r.querySelector('[data-home-view="movies"]');return m&&!m.classList.contains('hidden')?'movies':ct266HomeTab}
function ct266ApplyHomeTab(tab=ct266HomeTab){const r=document.querySelector('[data-home]');if(!r)return false;ct266HomeTab=tab==='movies'?'movies':'series';r.dataset.ct266HomeTab=ct266HomeTab;r.querySelectorAll('[data-home-tab]').forEach(b=>{const on=b.dataset.homeTab===ct266HomeTab;b.classList.toggle('active',on);b.setAttribute('aria-selected',on?'true':'false')});r.querySelectorAll('[data-home-view]').forEach(v=>{const on=v.dataset.homeView===ct266HomeTab;v.classList.toggle('hidden',!on);v.hidden=!on});return true}
function ct266PendingEpisode(row){let ep=null;try{const pair=typeof ct176CanonicalPair==='function'?ct176CanonicalPair(row):null;ep=pair?.current||pair?.next||null}catch{}if(!ep)ep=row?._ct255NewRelease||row?.next_unwatched_episode||row?.next_episode||row?.current_episode||row?.latest_released_episode||row?.last_episode_to_air||null;const s=n263(ep?.season_number??ep?.season??ep?.s),e=n263(ep?.episode_number??ep?.episode??ep?.e);return s>0&&e>0?{...ep,season_number:s,episode_number:e}:null}
function ct266WatchAction(kind,tmdb,s=0,e=0,title=''){return '<span class="ct266-watch-action" role="button" tabindex="0" aria-label="Marcar como assistido" title="Marcar como assistido" data-ct266-watch="'+kind+'" data-tmdb="'+tmdb+'"'+(s?' data-season="'+s+'"':'')+(e?' data-episode="'+e+'"':'')+(title?' data-title="'+esc263(title)+'"':'')+'>✓</span>'}
function ct266AttachWatch(el,kind,tmdb,s=0,e=0,title=''){if(!el||!tmdb||el.querySelector(':scope > [data-ct266-watch]'))return false;el.classList.add('ct266-home-watch-host');el.insertAdjacentHTML('beforeend',ct266WatchAction(kind,tmdb,s,e,title));return true}
function ct266EnhanceHome(){const root=document.querySelector('[data-home]');if(!root)return false;let changed=false;for(const sec of root.querySelectorAll('[data-home-view] .home-section')){const head=norm263(sec.querySelector('.panel-head h2,.panel-head h3,h2,h3')?.textContent||'');const eligible=/assistir a seguir|juntando poeira|watchlist/.test(head)&&!/historico|vistos|concluid/.test(head);if(!eligible)continue;for(const b of [...sec.querySelectorAll('button')]){const t=norm263(b.textContent);if(/marcar como assistido|marcar assistido/.test(t)&&!b.matches('[data-media]')){b.remove();changed=true}}}
 const rows=Array.isArray(homeCache?.series)?homeCache.series:[];for(const sec of root.querySelectorAll('[data-home-view="series"] .home-section')){const head=norm263(sec.querySelector('.panel-head h2,.panel-head h3,h2,h3')?.textContent||'');if(!/assistir a seguir|juntando poeira/.test(head))continue;for(const el of sec.querySelectorAll('.media-row[data-media^="tv:"]')){const id=n263(String(el.dataset.media||'').split(':')[1]),row=rows.find(x=>id263(x)===id),ep=ct266PendingEpisode(row);if(row&&ep)changed=ct266AttachWatch(el,'episode',id,ep.season_number,ep.episode_number,row?.media_title||row?.title||row?.name||'')||changed}}
 const movieSec=[...root.querySelectorAll('[data-home-view="movies"] .home-section')].find(sec=>/assistir a seguir|watchlist/.test(norm263(sec.querySelector('.panel-head h2,.panel-head h3,h2,h3')?.textContent||'')));if(movieSec)for(const el of movieSec.querySelectorAll('.ct255-home-movie-card,.media-row[data-media^="movie:"]')){const m=el.matches('[data-media]')?el:el.querySelector('[data-media^="movie:"]'),id=n263(String(m?.dataset?.media||'').split(':')[1]);if(id)changed=ct266AttachWatch(el,'movie',id,0,0,el.querySelector('b,strong')?.textContent||'')||changed}return changed}
async function ct266MarkWatched(action){if(!action||ct266HomeBusy)return;const kind=action.dataset.ct266Watch,tmdbId=n263(action.dataset.tmdb),s=n263(action.dataset.season),e=n263(action.dataset.episode);if(!tmdbId||!['movie','episode'].includes(kind)||(kind==='episode'&&(!s||!e)))return;ct266HomeBusy=true;action.setAttribute('aria-disabled','true');const keep=ct266HomeTab;try{const media=await ensureMedia(kind==='episode'?'tv':'movie',tmdbId);await rpc('cinetracker_mark_watch_v0994',{p_media_id:Number(media.id),p_item_type:kind,p_season_number:kind==='episode'?s:null,p_episode_number:kind==='episode'?e:null,p_title:action.dataset.title||media.title||null,p_runtime_minutes:Number(media.runtime_minutes||0)||null,p_released_episodes:null,p_watched_at:new Date().toISOString()});homeCache=await rpc('cinetracker_home_live_v0997_r3',{p_today:typeof localDay==='function'?localDay():new Date().toISOString().slice(0,10)});try{profileCache=null;discoverCache?.clear?.()}catch{};ct266HomeTab=keep;if(typeof paintHome==='function')paintHome();try{toast('Marcado como assistido')}catch{}}catch(err){action.removeAttribute('aria-disabled');try{toast(err?.message||String(err))}catch{}}finally{ct266HomeBusy=false}}
function ct266HomeActionTarget(e){return e.target?.closest?.('[data-ct266-watch]')||null}
document.addEventListener('click',e=>{const w=ct266HomeActionTarget(e);if(w){e.preventDefault();e.stopImmediatePropagation();void ct266MarkWatched(w);return}const ht=e.target?.closest?.('[data-home-tab]');if(ht){ct266HomeTab=ht.dataset.homeTab==='movies'?'movies':'series';ct266ApplyHomeTab(ct266HomeTab)}},true);
document.addEventListener('keydown',e=>{const w=ct266HomeActionTarget(e);if(w&&(e.key==='Enter'||e.key===' ')){e.preventDefault();e.stopImmediatePropagation();void ct266MarkWatched(w)}},true);
window.__ctR266Test={currentHomeTab:ct266CurrentHomeTab,applyHomeTab:ct266ApplyHomeTab,pendingEpisode:ct266PendingEpisode,enhanceHome:ct266EnhanceHome};
/* CT266_HOME_HELPERS_END */
`;
js=js.replace(homeAnchor,homeHelpers+'\n'+homeAnchor);

const oldScheduleHome="function scheduleHomeRestore263(){for(const ms of[0,60,140,420,1000])setTimeout(()=>restoreHomeList263(),ms)}";
must(js,oldScheduleHome,'r263 delayed Home schedule');
js=js.replace(oldScheduleHome,"function scheduleHomeRestore263(){return restoreHomeList263()}");
const oldHomeWrap="const paintHome263Base=typeof paintHome==='function'?paintHome:null;\nif(paintHome263Base)paintHome=function(...args){const out=paintHome263Base.apply(this,args);scheduleHomeRestore263();return out};\nconst renderHome263Base=typeof renderHome==='function'?renderHome:null;\nif(renderHome263Base)renderHome=async function(...args){const out=await renderHome263Base.apply(this,args);scheduleHomeRestore263();return out};";
must(js,oldHomeWrap,'r263 Home wrappers');
const newHomeWrap="const paintHome263Base=typeof paintHome==='function'?paintHome:null;\nif(paintHome263Base)paintHome=function(...args){const keep=ct266CurrentHomeTab();const out=paintHome263Base.apply(this,args);restoreHomeList263();ct266HomeTab=keep;ct266ApplyHomeTab(keep);ct266EnhanceHome();return out};\nconst renderHome263Base=typeof renderHome==='function'?renderHome:null;\nif(renderHome263Base)renderHome=async function(...args){const out=await renderHome263Base.apply(this,args);if(String(typeof route==='function'?route():'')==='home'){restoreHomeList263();ct266ApplyHomeTab(ct266HomeTab);ct266EnhanceHome()}return out};";
js=js.replace(oldHomeWrap,newHomeWrap);

/* Detail rails are owned by the existing detail producer markup/classes. No observer or page-level horizontal scrolling is introduced. */
const castAnchor='<div class="row">${cast.map(a=>',seasonAnchor='<div class="row">${(d.seasons||[]).filter(s=>s.season_number>0).map(s=>';
must(js,castAnchor,'detail cast producer');must(js,seasonAnchor,'detail season producer');
js=js.replace(castAnchor,'<div class="row ct266-detail-x ct266-card-rail" data-ct266-detail-rail="cast">${cast.map(a=>');
js=js.replace(seasonAnchor,'<div class="row ct266-detail-x ct266-card-rail" data-ct266-detail-rail="seasons">${(d.seasons||[]).filter(s=>s.season_number>0).map(s=>');

/* Sports intentionally stays on the approved r263 producer/schedule. This is the r265 crash fix: no release-local callback is emitted into paintSports255. */
if(js.includes('ct265AfterF1Paint')||js.includes('ct266AfterF1Paint'))throw new Error('r266 contains forbidden cross-scope Sports callback');

const observerCountAfter=(js.match(/new MutationObserver/g)||[]).length;
if(observerCountAfter!==observerCountBefore)throw new Error(`r266 observer delta ${observerCountBefore} -> ${observerCountAfter}`);
if(js.includes('__ctR264')||js.includes('__ctR265')||js.includes('ct264-')||js.includes('ct265-'))throw new Error('r266 final JS contains rejected r264/r265 authority');

js=js.replace("const REVISION='r263-official-1.0.54';","const REVISION='r266-official-1.0.57';")
 .replace("window.__ctWebBuild='1.0.54';window.__ctOfficialVersion='1.0.54';","window.__ctWebBuild='1.0.57';window.__ctOfficialVersion='1.0.57';")
 .replaceAll('CineTracker • v1.0.54','CineTracker • v1.0.57')
 .replaceAll("JSON.stringify({version:'1.0.54',revision:REVISION","JSON.stringify({version:'1.0.57',revision:REVISION");

css+=`\n/* CineTracker Web 1.0.57 r266 — rebuilt from approved r263. */
html,body,#app{box-sizing:border-box!important;width:100%!important;max-width:100%!important;overflow-x:hidden!important}
#app,.app,.content,.page,[data-home],[data-discover],[data-sports],[data-detail],[data-series-detail],[data-movie-detail]{min-width:0!important;max-width:100%!important}
.ct266-home-watch-host{box-sizing:border-box!important;position:relative!important;padding-right:44px!important;min-width:0!important;max-width:100%!important}
.ct266-watch-action{position:absolute!important;right:8px!important;top:50%!important;transform:translateY(-50%)!important;z-index:4!important;display:grid!important;place-items:center!important;width:28px!important;height:28px!important;min-width:28px!important;min-height:28px!important;padding:0!important;margin:0!important;border:1px solid #316b8a!important;border-radius:9px!important;background:#0b2939!important;color:#c8ecfb!important;font:inherit!important;font-size:13px!important;font-weight:800!important;line-height:1!important;cursor:pointer!important;user-select:none!important}.ct266-watch-action[aria-disabled="true"]{opacity:.55!important;pointer-events:none!important}
.ct266-detail-x,.season-tabs,.season-list,.season-row,[data-seasons],.ct169-season-row,.ct169-season-chart-carousel,.ct169-chart-scroll,.ct244-seasons-scroll,.ct244-chart-scroll,.episode-list,.episodes-list,.episodes-row,.episode-row,[data-episodes],[data-season-episodes],.related-scroll,.related-row,[data-related],.similar-scroll,.similar-row,[data-similar],.cast-scroll,.cast-row,[data-cast],.actors-scroll,.actors-row,[data-actors],.people-scroll,.people-row,[data-people],.episode-graph,.graph-shell,.chart-wrap,.chart-scroll,[data-chart],[data-episode-chart]{box-sizing:border-box!important;width:100%!important;max-width:100%!important;min-width:0!important;overflow-x:auto!important;overflow-y:hidden!important;overscroll-behavior-x:contain!important;-webkit-overflow-scrolling:touch!important;touch-action:pan-x pan-y!important;scrollbar-width:thin!important;scrollbar-gutter:stable!important;flex-wrap:nowrap!important}
.ct266-card-rail,.cast-row,.actors-row,.people-row,.season-row,.episode-row,.episodes-row,.related-row,.similar-row{display:flex!important;flex-wrap:nowrap!important;gap:12px!important}.ct266-card-rail>*{flex:0 0 min(176px,46vw)!important}
.related-grid,.similar-grid,.cast-grid,.actors-grid,.people-grid{box-sizing:border-box!important;display:grid!important;grid-auto-flow:column!important;grid-auto-columns:minmax(148px,176px)!important;grid-template-columns:none!important;gap:12px!important;width:100%!important;max-width:100%!important;min-width:0!important;overflow-x:auto!important;overflow-y:hidden!important;overscroll-behavior-x:contain!important;touch-action:pan-x pan-y!important}
.ct266-detail-x::-webkit-scrollbar,.season-list::-webkit-scrollbar,.episode-list::-webkit-scrollbar,.episodes-list::-webkit-scrollbar,.chart-scroll::-webkit-scrollbar,.related-row::-webkit-scrollbar,.similar-row::-webkit-scrollbar,.cast-row::-webkit-scrollbar{height:8px!important}
@media(max-width:700px){.ct266-home-watch-host{padding-right:39px!important}.ct266-watch-action{right:6px!important;width:26px!important;height:26px!important;min-width:26px!important;min-height:26px!important;font-size:12px!important}.ct266-card-rail>*{flex-basis:154px!important}}
`;

html=html.replaceAll('r263-official-1.0.54','r266-official-1.0.57').replace(/app-v263\.js/g,'app-v266.js').replace(/app-v263\.css/g,'app-v266.css');
const swCache=/const\s+CACHE\s*=\s*['"][^'"]+['"]\s*;/;if(!swCache.test(sw))throw new Error('r266 service-worker CACHE missing');
sw=sw.replace(swCache,"const CACHE='ct-web-1.0.57-r266';").replace(/app-v263\.js/g,'app-v266.js').replace(/app-v263\.css/g,'app-v266.css');
await Promise.all([
 writeFile(resolve(dist,'index.html'),html,'utf8'),
 writeFile(resolve(dist,'app-v266.js'),js,'utf8'),
 writeFile(resolve(dist,'app-v266.css'),css,'utf8'),
 writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),
 writeFile(resolve(dist,'release.json'),JSON.stringify({version:'1.0.57',revision:'r266-official-1.0.57',base:'r263-official-1.0.54',scope:'r263-rebuilt-home-discover-detail-sports-safe',home:'approved-list+inside-right-minimal-watch+canonical-rpc',discover:'watchlist-excluded+watched-progress-caught-up-notinterested-excluded',sports:'approved-r263-no-cross-scope-callback',detail:'producer-rails+generic-semantic-local-x',horizontal:'document-fixed+component-owned-x',r264:'rejected',r265:'rejected',android:'unchanged-1.0.20',generated_at:new Date().toISOString()},null,2),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v263.js'),{force:true}),rm(resolve(dist,'app-v263.css'),{force:true})]);
console.log('WEB_1_0_57_READY r266 rebuilt-from-r263');
