import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

/* r265 intentionally composes from r263, not r264. r264's post-render MutationObserver
   authority is rejected by the account/video ground truth. r265 patches the producers before boot. */
await import('./build-r263-official.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw]=await Promise.all([
  readFile(resolve(dist,'index.html'),'utf8'),
  readFile(resolve(dist,'app-v263.js'),'utf8'),
  readFile(resolve(dist,'app-v263.css'),'utf8'),
  readFile(resolve(dist,'service-worker.js'),'utf8')
]);
const must=(s,x,label=x)=>{if(!s.includes(x))throw new Error('r265 missing '+label)};
for(const x of[
  "window.__ctR263='approved-home-list-discover-intelligence-f1-watched'",
  "const REVISION='r263-official-1.0.54';",
  'function personal263(force=false)',
  'function paintSports255()',
  'function scheduleHomeRestore263()',
  'function scheduleF1Watch263(force=false)',
  'cinetracker_mark_watch_v0994'
])must(js,x,x);
if(js.includes('__ctR264'))throw new Error('r265 source unexpectedly contains r264 authority');
const observerCountBefore=(js.match(/new MutationObserver/g)||[]).length;

/* Discover personal authority: public tabs exclude the complete personal library + watchlist;
   recommendation freshness remains scoped to Pra Você. */
const personalRx=/async function personal263\(force=false\)\{[\s\S]*?\n\}\nfunction strictEligible263/;
if(!personalRx.test(js))throw new Error('r265 cannot locate personal263');
const personal265=`async function personal263(force=false){
 if(!force&&discover263.personal&&Date.now()-discover263.personalAt<120000)return discover263.personal;
 const bad=Symbol.for('ct265-personal-fail');
 let state=await timeout263(rpc('cinetracker_recommendation_state_v108',{}),4200,bad);
 if(state===bad){const old=await timeout263(rpc('cinetracker_recommendation_state_v107',{}),4200,bad);state=old===bad?{hard_excluded:[],fresh_excluded:[],watchlist:[]}:{hard_excluded:old?.fresh_excluded||[],fresh_excluded:old?.fresh_excluded||[],watchlist:[]}}
 const [dash,full]=await Promise.all([
  timeout263(rpc('cinetracker_profile_media_dashboard_v0991',{}),5000,[]),
  timeout263(rpc('cinetracker_watchlist_full_v119',{}),5000,{rows:[]})
 ]);
 const hard=rowsSet263(state?.hard_excluded),fresh=rowsSet263(state?.fresh_excluded),watch=union263(rowsSet263(state?.watchlist),rowsSet263(full?.rows));
 for(const x of Array.isArray(dash)?dash:[]){const k=key263(x);if(!k||/:0$/.test(k))continue;const st=norm263(x?.user_state||x?.state||'');if(x?.is_seen||x?.is_completed||x?.is_in_progress||x?.is_up_to_date||n263(x?.watched_episodes)>0||x?.is_not_interested||/not interested|nao interessado/.test(st))hard.add(k);if(x?.is_watchlist||x?.is_added_to_watchlist||x?.is_watch_later)watch.add(k)}
 const watchlist=[...(Array.isArray(state?.watchlist)?state.watchlist:[]),...(Array.isArray(full?.rows)?full.rows:[])];
 const p={raw:state,hard,fresh,watch,excluded:union263(hard,watch),watchlist};discover263.personal=p;discover263.personalAt=Date.now();return p;
}
function strictEligible263`;
js=js.replace(personalRx,personal265);

/* Home producer helpers. They run synchronously inside paintHome; there is no r265 observer,
   timeout reconciliation, requestAnimationFrame reconciliation, or post-paint cleanup loop. */
const homeAnchor='const paintHome263Base=typeof paintHome===\'function\'?paintHome:null;';
must(js,homeAnchor,'r263 Home producer anchor');
const producerHelpers=`/* CT265_PRODUCER_HELPERS_START */
window.__ctR265='producer-owned-home-discover-sports-detail';
window.__ctR265Home='paint-owned-tab+side-watch-actions';
window.__ctR265Discover='single-nine-tab-producer+personal-authority';
window.__ctR265Sports='producer-f1-tabs-filters-feed+direct-f1-watch';
window.__ctR265Detail='producer-markup+nowrap-local-x';
window.__ctR265Horizontal='document-fixed+component-owned-x';
const CT265_DISCOVER_LABELS=['Pra você','Top 10','Em alta','Populares','Novidades','Lançamentos','Mais Aguardados','Mais bem avaliados','Calendário'];
let ct265HomeTab='series',ct265HomeBusy=false;
function ct265N(v){const n=Number(v);return Number.isFinite(n)?n:0}
function ct265Norm(v){return String(v??'').normalize('NFD').replace(/[\\u0300-\\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()}
function ct265Esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function ct265Tmdb(x){return ct265N(x?.tmdb_id||x?.source_tmdb_id||x?.raw_tmdb?.source_tmdb_id||x?.raw_tmdb?.id||x?.id)}
function ct265CurrentHomeTab(){const r=document.querySelector('[data-home]');if(!r)return ct265HomeTab;const a=r.querySelector('[data-home-tab].active');if(a?.dataset?.homeTab==='movies'||a?.dataset?.homeTab==='series')return a.dataset.homeTab;const m=r.querySelector('[data-home-view="movies"]');return m&&!m.classList.contains('hidden')?'movies':ct265HomeTab}
function ct265ApplyHomeTab(tab=ct265HomeTab){const r=document.querySelector('[data-home]');if(!r)return false;ct265HomeTab=tab==='movies'?'movies':'series';r.dataset.ct265HomeTab=ct265HomeTab;r.querySelectorAll('[data-home-tab]').forEach(b=>{const on=b.dataset.homeTab===ct265HomeTab;b.classList.toggle('active',on);b.setAttribute('aria-selected',on?'true':'false')});r.querySelectorAll('[data-home-view]').forEach(v=>{const on=v.dataset.homeView===ct265HomeTab;v.classList.toggle('hidden',!on);v.hidden=!on});return true}
function ct265PendingEpisode(row){let ep=null;try{const pair=typeof ct176CanonicalPair==='function'?ct176CanonicalPair(row):null;ep=pair?.current||pair?.next||null}catch{}if(!ep)ep=row?._ct255NewRelease||row?.next_unwatched_episode||row?.next_episode||row?.current_episode||row?.latest_released_episode||row?.last_episode_to_air||null;const s=ct265N(ep?.season_number??ep?.season??ep?.s),e=ct265N(ep?.episode_number??ep?.episode??ep?.e);return s>0&&e>0?{...ep,season_number:s,episode_number:e}:null}
function ct265WatchButton(kind,tmdb,s=0,e=0,title=''){return '<button type="button" class="ct265-watch-btn" data-ct265-watch="'+kind+'" data-tmdb="'+tmdb+'"'+(s?' data-season="'+s+'"':'')+(e?' data-episode="'+e+'"':'')+(title?' data-title="'+ct265Esc(title)+'"':'')+'>✓ Marcar como assistido</button>'}
function ct265WrapWatch(el,kind,tmdb,s=0,e=0,title=''){if(!el||!tmdb||el.closest('.ct265-home-action-row'))return false;const box=document.createElement('div');box.className='ct265-home-action-row';box.dataset.ct265HomeAction=kind;el.parentNode?.insertBefore(box,el);box.appendChild(el);box.insertAdjacentHTML('beforeend',ct265WatchButton(kind,tmdb,s,e,title));return true}
function ct265EnhanceHome(){const root=document.querySelector('[data-home]');if(!root)return false;let changed=false;for(const sec of root.querySelectorAll('[data-home-view] .home-section')){const head=ct265Norm(sec.querySelector('.panel-head h2,.panel-head h3,h2,h3')?.textContent||'');const eligible=/assistir a seguir|juntando poeira|watchlist/.test(head)&&!/historico|vistos|concluid/.test(head);if(!eligible)continue;for(const b of [...sec.querySelectorAll('button')]){const t=ct265Norm(b.textContent);if(/marcar como assistido|marcar assistido/.test(t)&&!b.matches('[data-ct265-watch]')){b.remove();changed=true}}}
 const rows=Array.isArray(homeCache?.series)?homeCache.series:[];for(const sec of root.querySelectorAll('[data-home-view="series"] .home-section')){const head=ct265Norm(sec.querySelector('.panel-head h2,.panel-head h3,h2,h3')?.textContent||'');if(!/assistir a seguir|juntando poeira/.test(head))continue;for(const el of sec.querySelectorAll('.media-row[data-media^="tv:"]')){const id=ct265N(String(el.dataset.media||'').split(':')[1]),row=rows.find(x=>ct265Tmdb(x)===id),ep=ct265PendingEpisode(row);if(row&&ep)changed=ct265WrapWatch(el,'episode',id,ep.season_number,ep.episode_number,row?.media_title||row?.title||row?.name||'')||changed}}
 const movieSec=[...root.querySelectorAll('[data-home-view="movies"] .home-section')].find(sec=>/assistir a seguir|watchlist/.test(ct265Norm(sec.querySelector('.panel-head h2,.panel-head h3,h2,h3')?.textContent||'')));if(movieSec)for(const el of movieSec.querySelectorAll('.ct255-home-movie-card,.media-row[data-media^="movie:"]')){const m=el.matches('[data-media]')?el:el.querySelector('[data-media^="movie:"]'),id=ct265N(String(m?.dataset?.media||'').split(':')[1]);if(id)changed=ct265WrapWatch(el,'movie',id,0,0,el.querySelector('b,strong')?.textContent||'')||changed}return changed}
async function ct265MarkWatched(btn){if(!btn||ct265HomeBusy)return;const kind=btn.dataset.ct265Watch,tmdbId=ct265N(btn.dataset.tmdb),s=ct265N(btn.dataset.season),e=ct265N(btn.dataset.episode);if(!tmdbId||!['movie','episode'].includes(kind)||(kind==='episode'&&(!s||!e)))return;ct265HomeBusy=true;btn.disabled=true;const keep=ct265HomeTab,old=btn.textContent;btn.textContent='Salvando…';try{const media=await ensureMedia(kind==='episode'?'tv':'movie',tmdbId);await rpc('cinetracker_mark_watch_v0994',{p_media_id:Number(media.id),p_item_type:kind,p_season_number:kind==='episode'?s:null,p_episode_number:kind==='episode'?e:null,p_title:btn.dataset.title||media.title||null,p_runtime_minutes:Number(media.runtime_minutes||0)||null,p_released_episodes:null,p_watched_at:new Date().toISOString()});homeCache=await rpc('cinetracker_home_live_v0997_r3',{p_today:typeof localDay==='function'?localDay():new Date().toISOString().slice(0,10)});try{profileCache=null;discoverCache?.clear?.()}catch{};ct265HomeTab=keep;if(typeof paintHome==='function')paintHome();try{toast('Marcado como assistido')}catch{}}catch(err){btn.disabled=false;btn.textContent=old;try{toast(err?.message||String(err))}catch{}}finally{ct265HomeBusy=false}}
function ct265AfterF1Paint(){return Promise.resolve(typeof paintF1255==='function'?paintF1255():null).then(()=>typeof enhanceF1Watch263==='function'?enhanceF1Watch263(false):null).catch(()=>null)}
document.addEventListener('click',e=>{const w=e.target?.closest?.('[data-ct265-watch]');if(w){e.preventDefault();e.stopImmediatePropagation();void ct265MarkWatched(w);return}const ht=e.target?.closest?.('[data-home-tab]');if(ht){ct265HomeTab=ht.dataset.homeTab==='movies'?'movies':'series';ct265ApplyHomeTab(ct265HomeTab)}},false);
window.__ctR265Test={labels:CT265_DISCOVER_LABELS,currentHomeTab:ct265CurrentHomeTab,applyHomeTab:ct265ApplyHomeTab,pendingEpisode:ct265PendingEpisode,enhanceHome:ct265EnhanceHome};
/* CT265_PRODUCER_HELPERS_END */
`;
js=js.replace(homeAnchor,producerHelpers+'\n'+homeAnchor);

/* Replace r263's delayed Home authority with the synchronous producer authority. */
const oldScheduleHome="function scheduleHomeRestore263(){for(const ms of[0,60,140,420,1000])setTimeout(()=>restoreHomeList263(),ms)}";
must(js,oldScheduleHome,'r263 delayed Home schedule');
js=js.replace(oldScheduleHome,"function scheduleHomeRestore263(){return restoreHomeList263()}");
const oldHomeWrap="const paintHome263Base=typeof paintHome==='function'?paintHome:null;\nif(paintHome263Base)paintHome=function(...args){const out=paintHome263Base.apply(this,args);scheduleHomeRestore263();return out};\nconst renderHome263Base=typeof renderHome==='function'?renderHome:null;\nif(renderHome263Base)renderHome=async function(...args){const out=await renderHome263Base.apply(this,args);scheduleHomeRestore263();return out};";
must(js,oldHomeWrap,'r263 Home wrappers');
const newHomeWrap="const paintHome263Base=typeof paintHome==='function'?paintHome:null;\nif(paintHome263Base)paintHome=function(...args){const keep=ct265CurrentHomeTab();const out=paintHome263Base.apply(this,args);restoreHomeList263();ct265HomeTab=keep;ct265ApplyHomeTab(keep);ct265EnhanceHome();return out};\nconst renderHome263Base=typeof renderHome==='function'?renderHome:null;\nif(renderHome263Base)renderHome=async function(...args){const out=await renderHome263Base.apply(this,args);if(String(typeof route==='function'?route():'')==='home'){restoreHomeList263();ct265ApplyHomeTab(ct265HomeTab);ct265EnhanceHome()}return out};";
js=js.replace(oldHomeWrap,newHomeWrap);

/* Sports producer: F1 is emitted first, then tabs, filters, feed. The F1 DB watched panel is
   chained to paintF1255 itself, instead of being restored by delayed timers/DOM reconciliation. */
const sportsRx=/function paintSports255\(\)\{[\s\S]*?\nrenderSports=async function/;
if(!sportsRx.test(js))throw new Error('r265 cannot locate paintSports255');
const sports265=`function paintSports255(){const h=q255('[data-ct255-sports]');if(!h)return;cleanupLegacySports255();const p=sport255.payload||{},rows=sportRows255(p),stats=p.stats||{},sports=p.sports||[];h.innerHTML=\`<section class="ct255-f1hub" data-ct255-f1></section><div class="ct255-sports-tabs">\${SPORT_TABS255.map(([k,l])=>\`<button type="button" class="ct255-sports-tab \${sport255.tab===k?'active':''}" data-ct255-sport-tab="\${k}">\${l}</button>\`).join('')}</div><div class="ct255-sport-filters"><button type="button" class="chip \${sport255.sport==='all'?'active':''}" data-ct255-sport-filter="all">Todos</button>\${sports.map(s=>\`<button type="button" class="chip \${sport255.sport===s.slug?'active':''}" data-ct255-sport-filter="\${esc255(s.slug)}">\${esc255(s.icon||'🏆')} \${esc255(s.name||s.slug)}</button>\`).join('')}</div><section class="panel ct255-sports-feed"><div class="panel-head"><h2>\${SPORT_TABS255.find(([k])=>k===sport255.tab)?.[1]||'Esportes'}</h2><small>\${sport255.tab==='watched'?\`${'${'}n255(stats.watched_events||rows.length)} assistidos\`:rows.length}</small></div><div class="ct255-sport-grid">\${rows.map(e=>sportCard255(e,p)).join('')||'<div class="empty">Nenhum evento disponível neste filtro.</div>'}</div></section>\`;void ct265AfterF1Paint();}
renderSports=async function`;
js=js.replace(sportsRx,sports265);
const oldF1Schedule="function scheduleF1Watch263(force=false){for(const ms of[180,650,1500,2600])setTimeout(()=>{if(String(typeof route==='function'?route():'')==='sports')void enhanceF1Watch263(force&&ms===180)},ms)}";
must(js,oldF1Schedule,'r263 delayed F1 schedule');
js=js.replace(oldF1Schedule,"function scheduleF1Watch263(force=false){return false}");

/* Detail producer markup: base cast/seasons are explicitly local rails. Later episode/chart/
   related producers are covered by stable semantic component classes in CSS, with nowrap. */
js=js.replace('<div class="row">${cast.map(a=>','<div class="row ct265-detail-x ct265-card-rail" data-ct265-detail-rail="cast">${cast.map(a=>');
js=js.replace('<div class="row">${(d.seasons||[]).filter(s=>s.season_number>0).map(s=>','<div class="row ct265-detail-x ct265-card-rail" data-ct265-detail-rail="seasons">${(d.seasons||[]).filter(s=>s.season_number>0).map(s=>');

/* r265 must not introduce a new MutationObserver. */
const observerCountAfter=(js.match(/new MutationObserver/g)||[]).length;
if(observerCountAfter!==observerCountBefore)throw new Error(`r265 observer delta ${observerCountBefore} -> ${observerCountAfter}`);
if(js.includes('__ctR264')||js.includes('ct264-'))throw new Error('r265 final JS contains r264 authority');

js=js.replace("const REVISION='r263-official-1.0.54';","const REVISION='r265-official-1.0.56';")
 .replace("window.__ctWebBuild='1.0.54';window.__ctOfficialVersion='1.0.54';","window.__ctWebBuild='1.0.56';window.__ctOfficialVersion='1.0.56';")
 .replaceAll('CineTracker • v1.0.54','CineTracker • v1.0.56')
 .replaceAll("JSON.stringify({version:'1.0.54',revision:REVISION","JSON.stringify({version:'1.0.56',revision:REVISION");

css+=`\n/* CineTracker Web 1.0.56 r265 — producer-owned UI; no post-render repair observer. */
html,body,#app{box-sizing:border-box!important;width:100%!important;max-width:100%!important;overflow-x:hidden!important}
#app,.app,.content,.page,[data-home],[data-discover],[data-sports],[data-detail],[data-series-detail],[data-movie-detail]{min-width:0!important;max-width:100%!important}
.ct265-home-action-row{box-sizing:border-box!important;display:grid!important;grid-template-columns:minmax(0,1fr) auto!important;gap:9px!important;align-items:center!important;width:100%!important;max-width:100%!important;min-width:0!important}
.ct265-home-action-row>.media-row,.ct265-home-action-row>.ct255-home-movie-card{box-sizing:border-box!important;width:100%!important;max-width:100%!important;min-width:0!important}
.ct265-watch-btn{box-sizing:border-box!important;display:block!important;align-self:center!important;border:1px solid #316b8a!important;background:#0b2939!important;color:#c8ecfb!important;border-radius:10px!important;padding:8px 10px!important;font:inherit!important;font-size:11px!important;font-weight:700!important;line-height:1.2!important;white-space:nowrap!important;cursor:pointer!important}.ct265-watch-btn:disabled{opacity:.58!important;cursor:default!important}
.ct265-detail-x,.season-tabs,.season-list,.season-row,[data-seasons],.ct169-season-row,.ct169-season-chart-carousel,.ct169-chart-scroll,.ct244-seasons-scroll,.ct244-chart-scroll,.episode-list,.episodes-list,.episodes-row,.episode-row,[data-episodes],[data-season-episodes],.related-scroll,.related-row,[data-related],.similar-scroll,.similar-row,[data-similar],.cast-scroll,.cast-row,[data-cast],.actors-scroll,.actors-row,[data-actors],.people-scroll,.people-row,[data-people],.episode-graph,.graph-shell,.chart-wrap,.chart-scroll,[data-chart],[data-episode-chart]{box-sizing:border-box!important;width:100%!important;max-width:100%!important;min-width:0!important;overflow-x:auto!important;overflow-y:hidden!important;overscroll-behavior-x:contain!important;-webkit-overflow-scrolling:touch!important;touch-action:pan-x pan-y!important;scrollbar-width:thin!important;scrollbar-gutter:stable!important;flex-wrap:nowrap!important}
.ct265-card-rail,.cast-row,.actors-row,.people-row,.season-row,.episode-row,.episodes-row,.related-row,.similar-row{display:flex!important;flex-wrap:nowrap!important;gap:12px!important}.ct265-card-rail>*{flex:0 0 min(176px,46vw)!important}
.related-grid,.similar-grid,.cast-grid,.actors-grid,.people-grid{box-sizing:border-box!important;display:grid!important;grid-auto-flow:column!important;grid-auto-columns:minmax(148px,176px)!important;grid-template-columns:none!important;gap:12px!important;width:100%!important;max-width:100%!important;min-width:0!important;overflow-x:auto!important;overflow-y:hidden!important;touch-action:pan-x pan-y!important}
.ct265-detail-x::-webkit-scrollbar,.season-list::-webkit-scrollbar,.episode-list::-webkit-scrollbar,.episodes-list::-webkit-scrollbar,.chart-scroll::-webkit-scrollbar,.related-row::-webkit-scrollbar,.similar-row::-webkit-scrollbar,.cast-row::-webkit-scrollbar{height:8px!important}
@media(max-width:700px){.ct265-home-action-row{gap:6px!important}.ct265-watch-btn{padding:7px 8px!important;font-size:9px!important;max-width:132px!important;white-space:normal!important}.ct265-card-rail>*{flex-basis:154px!important}}
`;

html=html.replaceAll('r263-official-1.0.54','r265-official-1.0.56').replace(/app-v263\.js/g,'app-v265.js').replace(/app-v263\.css/g,'app-v265.css');
const swCache=/const\s+CACHE\s*=\s*['"][^'"]+['"]\s*;/;if(!swCache.test(sw))throw new Error('r265 service-worker CACHE missing');
sw=sw.replace(swCache,"const CACHE='ct-web-1.0.56-r265';").replace(/app-v263\.js/g,'app-v265.js').replace(/app-v263\.css/g,'app-v265.css');
await Promise.all([
 writeFile(resolve(dist,'index.html'),html,'utf8'),
 writeFile(resolve(dist,'app-v265.js'),js,'utf8'),
 writeFile(resolve(dist,'app-v265.css'),css,'utf8'),
 writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),
 writeFile(resolve(dist,'release.json'),JSON.stringify({version:'1.0.56',revision:'r265-official-1.0.56',base:'r263-official-1.0.54',scope:'producer-owned-home-discover-sports-detail',home:'paint-owned-tab+side-watch-actions+canonical-rpc',discover:'single-nine-tab-producer+dashboard-watchlist-exclusions+top10-providers',sports:'f1-tabs-filters-feed+direct-f1-watch-panel',detail:'producer-markup+generic-nowrap-local-x',horizontal:'document-fixed+component-owned-x',r264:'removed',android:'unchanged-1.0.20',generated_at:new Date().toISOString()},null,2),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v263.js'),{force:true}),rm(resolve(dist,'app-v263.css'),{force:true})]);
console.log('WEB_1_0_56_READY r265 producer-owned no-r264-observer');
