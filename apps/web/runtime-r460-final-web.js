/* CineTracker Web 1.0.250 r460 — final Web stabilization for Home Movies, Pra Você, Profile lists/history and F1 current-season truth. */
(()=>{'use strict';
if(window.__ctR460?.version==='1.0.250')return;
const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const rows=v=>Array.isArray(v)?v:[];
const num=v=>Number.isFinite(Number(v))?Number(v):0;
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const routeNow=()=>{try{return String(typeof route==='function'?route():'')}catch{return''}};
const isHome=()=>routeNow()==='home'||!!q('[data-home-view="series"],[data-home-view="movies"]');
const isDiscover=()=>routeNow()==='discover'||!!q('[data-ct319-content],[data-ct315-content],[data-ct263-discover-content],[data-discover-content]');
const isProfile=()=>routeNow()==='profile'||!!q('[data-profile]');
const authReady=()=>{try{return!!session?.access_token&&typeof rpc==='function'}catch{return false}};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const timeout=(p,ms)=>Promise.race([Promise.resolve(p),new Promise((_,reject)=>setTimeout(()=>reject(new Error('TIMEOUT')),ms))]);
const unwrap=v=>Array.isArray(v)&&v.length===1&&v[0]&&typeof v[0]==='object'?unwrap(v[0]):v&&typeof v==='object'&&v.data!=null?unwrap(v.data):v;
const later=(fn,delays)=>{for(const ms of delays)setTimeout(fn,ms)};

let desiredHome460='series',homeEpoch460=0,movieTask460=null,movieRetry460=0;
function homeTabKind460(el){
 const raw=String(el?.dataset?.homeTab||'');if(raw==='movies'||raw==='series')return raw;
 const t=norm(el?.textContent||'');return t.includes('filme')?'movies':t.includes('serie')?'series':'';
}
function applyHome460(kind){
 if(!isHome())return false;kind=kind==='movies'?'movies':'series';desiredHome460=kind;
 try{if(window.__ctR371&&typeof window.__ctR371==='object')window.__ctR371.activeTab=kind}catch{}
 for(const b of qa('[data-home-tab],.home-tabs button')){const k=homeTabKind460(b);if(!k)continue;const on=k===kind;b.classList.toggle('active',on);b.setAttribute('aria-selected',on?'true':'false')}
 for(const v of qa('[data-home-view]')){const on=String(v.dataset.homeView||'')===kind;v.hidden=!on;v.style.display=on?'':'none'}
 document.documentElement.dataset.ct460Home=kind;return true;
}
function movieStack460(){const view=q('[data-home-view="movies"]')||document;return q('.ct456-movie-stack,.ct404-movie-stack,.ct388-movie-stack',view)}
function movieReady460(){const s=movieStack460();if(!s)return false;const t=norm(s.textContent||'');return s.children.length>0&&!t.includes('carregando watchlist')&&!t.includes('falha ao carregar watchlist')&&!t.includes('nenhum item')}
async function waitMovieOwner460(epoch){
 for(const ms of[0,80,180,320,520,800,1200,1800,2600,3600]){if(ms)await sleep(ms);if(epoch!==homeEpoch460||desiredHome460!=='movies'||!isHome())return false;if(authReady()&&typeof window.__ctR456?.loadMovies==='function')return true}
 return false;
}
async function loadMovies460(force=false){
 if(!isHome()||desiredHome460!=='movies')return false;if(movieTask460&&!force)return movieTask460;const epoch=homeEpoch460;
 movieTask460=(async()=>{try{
  if(!await waitMovieOwner460(epoch))throw new Error('MOVIE_OWNER_NOT_READY');
  const attempts=force?3:2;
  for(let i=0;i<attempts;i++){
   if(epoch!==homeEpoch460||desiredHome460!=='movies'||!isHome())return false;
   applyHome460('movies');await timeout(window.__ctR456.loadMovies(true),18000).catch(()=>false);applyHome460('movies');
   await sleep(120);if(movieReady460()){document.documentElement.dataset.ct460Movies='ready';return true}
   await sleep(280+i*320);
  }
  document.documentElement.dataset.ct460Movies='empty';return false;
 }catch(e){document.documentElement.dataset.ct460MoviesError=String(e?.message||e);return false}
 finally{movieTask460=null}})();return movieTask460;
}
function enterMovies460(){
 const epoch=++homeEpoch460;desiredHome460='movies';movieRetry460=0;applyHome460('movies');try{window.scrollTo({top:0,left:0,behavior:'auto'})}catch{}
 later(()=>{if(epoch!==homeEpoch460||desiredHome460!=='movies'||!isHome())return;applyHome460('movies');if(!movieReady460()&&movieRetry460<2){movieRetry460++;void loadMovies460(movieRetry460>1)}},[0,60,160,320,650,1100,1800,3000,4800]);
 void loadMovies460(true);return true;
}
function enterSeries460(){const epoch=++homeEpoch460;desiredHome460='series';applyHome460('series');try{window.scrollTo({top:0,left:0,behavior:'auto'})}catch{}
 later(()=>{if(epoch!==homeEpoch460||desiredHome460!=='series'||!isHome())return;applyHome460('series');window.__ctR458?.settleSeries?.()},[0,80,180,420,900,1600,2800]);return true}

let fyTask460=null,fyEpoch460=0;
function fyState460(){return window.__ctR288R263?.discover263||null}
function fySelected460(){const s=fyState460();if(String(s?.tab||'')==='foryou')return true;return!!q('[data-ct319-tab="foryou"].active,[data-ct263-tab="foryou"].active,[data-discover-tab="foryou"].active,[data-ct288-tab="foryou"].active,[aria-selected="true"][data-ct319-tab="foryou"]')}
function fyReady460(){return!!q('[data-ct457-foryou]')&&qa('[data-ct457-action="swap"]').length>=7}
function bindFY460(){const o=window.__ctR457;if(!o)return false;if(window.__ctR456&&typeof window.__ctR456==='object'){window.__ctR456.loadForYou=o.loadForYou;window.__ctR456.paintForYou=o.paintForYou;window.__ctR456.swap=o.swap}window.__ctR388LoadForYou=o.loadForYou;window.__ctR288PaintForYou=o.paintForYou;return true}
async function waitFYOwner460(epoch){for(const ms of[0,80,180,320,520,850,1300,2000,3000,4200]){if(ms)await sleep(ms);if(epoch!==fyEpoch460||!isDiscover())return false;if(authReady()&&bindFY460()&&window.__ctR457?.loadForYou)return true}return false}
async function loadForYou460(force=false){
 if(!isDiscover())return false;const s=fyState460();if(s){s.tab='foryou';s.type='all'}if(fyTask460&&!force)return fyTask460;const epoch=++fyEpoch460;
 fyTask460=(async()=>{try{
  if(!await waitFYOwner460(epoch))throw new Error('FORYOU_OWNER_NOT_READY');
  for(let attempt=0;attempt<3;attempt++){
   if(epoch!==fyEpoch460||!isDiscover())return false;const st=fyState460();if(st){st.tab='foryou';st.type='all'}
   await timeout(window.__ctR457.loadForYou(attempt>0||force),18000).catch(()=>false);window.__ctR457.paintForYou?.();
   if(fyReady460()){document.documentElement.dataset.ct460ForYou='ready';return true}
   await sleep(350+attempt*450);
  }
  document.documentElement.dataset.ct460ForYou='incomplete';return false;
 }catch(e){document.documentElement.dataset.ct460ForYouError=String(e?.message||e);return false}
 finally{fyTask460=null}})();return fyTask460;
}
function enterForYou460(){const s=fyState460();if(s){s.tab='foryou';s.type='all'}void loadForYou460(true);const epoch=fyEpoch460;later(()=>{if(!isDiscover()||!fySelected460())return;if(fyReady460())return;window.__ctR457?.paintForYou?.();if(!fyReady460()&&epoch===fyEpoch460)void loadForYou460(false)},[500,1200,2400,4200]);return true}

const PROFILE_LIMIT_460=13;let profileEpoch460=0;
function profileTitle460(panel){return norm(q('.panel-head h2,.panel-head h3,:scope>h2,:scope>h3,h2,h3',panel)?.textContent||'')}
function wantedProfile460(t){return t==='series'||t==='filmes'||t.includes('series favoritas')||t.includes('filmes favoritos')||t==='atores'||t.includes('atores favoritos')}
function profileRail460(panel){
 const preferred=q(':scope>.ct424-profile-list,:scope>.row,:scope>[class*="rail"],:scope>[class*="row"]',panel);if(preferred)return preferred;
 const all=qa('div,section',panel);let best=null,score=0;for(const el of all){const n=qa(':scope>.card,:scope>article,:scope>[data-media-id],:scope>[data-person-id]',el).length;if(n>score){score=n;best=el}}return score?best:null;
}
function profileCards460(rail){return qa(':scope>*',rail).filter(el=>!el.matches?.('[data-ct424-more],[data-ct455-more],[data-ct457-more],[data-ct459-more],[data-ct460-more]')&&(el.matches?.('.card,article,[data-media-id],[data-person-id]')||!!q('img,.poster,[class*="poster"],[class*="avatar"]',el)))}
function applyProfile460(){
 if(!isProfile())return false;const root=q('[data-profile]')||q('#app');if(!root)return false;let changed=false;
 for(const panel of qa('section.panel,.panel',root)){
  const title=profileTitle460(panel);if(!wantedProfile460(title))continue;const rail=profileRail460(panel);if(!rail)continue;
  qa('[data-ct424-more],[data-ct455-more],[data-ct457-more],[data-ct459-more],[data-ct460-more]',panel).forEach(x=>x.remove());
  const cards=profileCards460(rail);if(!cards.length)continue;cards.forEach((c,i)=>{c.hidden=i>=PROFILE_LIMIT_460;c.style.display=i>=PROFILE_LIMIT_460?'none':''});
  if(cards.length>PROFILE_LIMIT_460){
   const first=cards[0],rect=first.getBoundingClientRect?.()||{},w=Math.max(58,Math.round((rect.width||150)/2)),h=Math.max(160,Math.round(rect.height||225));
   const more=document.createElement('button');more.type='button';more.dataset.ct460More='1';more.className='ct460-profile-more';more.setAttribute('aria-label','Ver mais '+title);more.style.setProperty('--ct460-more-w',w+'px');more.style.height=h+'px';more.innerHTML='<span aria-hidden="true">›</span><b>Ver mais</b>';
   more.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();cards.forEach(c=>{c.hidden=false;c.style.display=''});more.remove()});rail.appendChild(more);
  }
  panel.dataset.ct460Profile='13+half-more';changed=true;
 }
 if(changed)root.dataset.ct460ProfileLists='13+half-more';return changed;
}
function scheduleProfile460(){const epoch=++profileEpoch460;later(()=>{if(epoch!==profileEpoch460||!isProfile())return;applyProfile460()},[0,80,180,380,700,1200,2000,3200,5000])}

function openDay460(day){if(!day)return false;const o=window.__ctR426;if(typeof o?.openDay!=='function')return false;void o.openDay(day);return true}
function bindHistory460(){if(typeof window.__ctR426?.openDay!=='function')return false;try{ct171OpenActivityDay=window.__ctR426.openDay}catch{}window.ct171OpenActivityDay=window.__ctR426.openDay;document.documentElement.dataset.ct460HistoryUndo='r426';return true}

let f1Task460=null;
function f1Scopes460(){
 const set=new Set();for(const el of qa('[data-media-id="865"],[data-series-id="865"],[data-ct-media-id="865"]'))set.add(el);
 for(const el of qa('section,article,.card,.media-row,.modal,[data-series-detail],main')){const t=norm(el.textContent||'');if(t.includes('formula 1')&&(/\d+\s*\/\s*\d+\s*assistidos/i.test(el.textContent||'')||q('[data-ct285-progress],[data-ct284-progress]',el)))set.add(el)}
 return[...set];
}
function patchF1Scope460(scope,d){
 const released=num(d?.released_episodes),watched=Math.min(released,num(d?.watched_released_episodes)),remaining=Math.max(0,released-watched);let changed=false;
 for(const el of [scope,...qa('span,small,em,p,strong,b,[data-ct285-progress],[data-ct284-progress]',scope)]){
  if(el.children?.length>4)continue;const old=String(el.textContent||'');let next=old;
  next=next.replace(/\d+\s*\/\s*\d+\s*assistidos/ig,watched+'/'+released+' assistidos');
  next=next.replace(/\d+\s+j[aá]\s+exibidos/ig,released+' já exibidos');
  next=next.replace(/\d+\s+epis[oó]dios?\s+dispon[ií]veis?\s+para\s+ver/ig,remaining+' episódios disponíveis para ver');
  if(next!==old){el.textContent=next;changed=true}
 }
 scope.dataset.ct460F1=watched+'/'+released+';remaining='+remaining;return changed;
}
function bindF1460(){const o=window.__ctR423;if(!o)return false;try{ct285Mark=o.markSeriesF1}catch{}try{ct284Mark=o.markSeriesF1}catch{}try{toggleF1Session311=o.toggleF1Hub}catch{}try{if(window.__ctR421){window.__ctR421.toggleF1=o.toggleF1Hub;window.__ctR421.syncF1=o.syncF1Hub;window.__ctR421.scheduleF1Sync=o.scheduleF1Sync}}catch{}return true}
async function refreshF1460(){
 if(f1Task460)return f1Task460;f1Task460=(async()=>{try{
  for(const ms of[0,80,180,320,520,850,1300]){if(ms)await sleep(ms);if(authReady()){bindF1460();break}}
  if(!authReady())throw new Error('F1_AUTH_NOT_READY');const season=new Date().getFullYear();const raw=unwrap(await timeout(rpc('cinetracker_f1_progress_v426',{p_season:season}),7000)),d=raw||{};
  if(!num(d.released_episodes))throw new Error('F1_PROGRESS_EMPTY');for(const scope of f1Scopes460())patchF1Scope460(scope,d);
  document.documentElement.dataset.ct460F1=num(d.watched_released_episodes)+'/'+num(d.released_episodes)+';remaining='+Math.max(0,num(d.released_episodes)-num(d.watched_released_episodes));return d;
 }catch(e){document.documentElement.dataset.ct460F1Error=String(e?.message||e);return false}
 finally{f1Task460=null}})();return f1Task460;
}
function scheduleF1460(){later(()=>void refreshF1460(),[0,100,260,600,1200,2200,3800])}

window.addEventListener('click',e=>{
 const t=e.target;if(!t?.closest)return;
 const day=t.closest('[data-ct171-activity-day]');if(day&&isProfile()&&window.__ctR426?.openDay){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();openDay460(String(day.dataset.ct171ActivityDay||''));return}
 const ht=t.closest('[data-home-tab],.home-tabs button');if(ht&&isHome()){const k=homeTabKind460(ht);if(k){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();if(k==='movies')enterMovies460();else enterSeries460();return}}
 const fy=t.closest('[data-ct319-tab="foryou"],[data-ct263-tab="foryou"],[data-discover-tab="foryou"],[data-ct288-tab="foryou"]');if(fy&&isDiscover()){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();enterForYou460();return}
 const nav=t.closest('[data-nav]');if(nav){const n=String(nav.dataset.nav||'');if(n==='home'){desiredHome460='series';setTimeout(enterSeries460,0)}if(n==='discover')setTimeout(()=>{if(fySelected460())enterForYou460()},0);if(n==='profile')setTimeout(()=>{bindHistory460();scheduleProfile460()},0);if(n==='home'||n==='sports'||n==='f1hub')setTimeout(scheduleF1460,0)}
 if(t.closest('[data-ct311-f1-race],[data-ct311-f1-watch],[data-ct285-episode-card],[data-ct284-episode],[data-ct255-watch]'))setTimeout(scheduleF1460,120);
},true);
window.addEventListener('popstate',()=>setTimeout(()=>{if(isHome()){if(desiredHome460==='movies')enterMovies460();else enterSeries460()}if(isDiscover()&&fySelected460())enterForYou460();if(isProfile()){bindHistory460();scheduleProfile460()}scheduleF1460()},0));
window.addEventListener('cinetracker:data-changed',e=>{if(isProfile())scheduleProfile460();if(isDiscover()&&fySelected460()&&!fyReady460())enterForYou460();const src=String(e?.detail?.source||'');if(src.includes('f1')||num(e?.detail?.media_id)===865)scheduleF1460()});
window.addEventListener('cinetracker:f1-watched-changed',scheduleF1460);

const style=document.createElement('style');style.id='ct460-style';style.textContent='[data-ct457-action="swap"]{display:inline-flex!important;visibility:visible!important;opacity:1!important;pointer-events:auto!important}.ct457-actions{display:grid!important}[data-profile] .ct460-profile-more{box-sizing:border-box!important;display:flex!important;flex:0 0 var(--ct460-more-w,75px)!important;width:var(--ct460-more-w,75px)!important;min-width:var(--ct460-more-w,75px)!important;max-width:var(--ct460-more-w,75px)!important;align-self:stretch!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:9px!important;padding:8px 5px!important;border:1px solid rgba(86,190,255,.42)!important;border-radius:12px!important;background:linear-gradient(180deg,rgba(16,43,58,.92),rgba(8,25,35,.96))!important;color:inherit!important;cursor:pointer!important;white-space:normal!important}[data-profile] .ct460-profile-more span{font-size:32px!important;line-height:1!important}[data-profile] .ct460-profile-more b{font-size:11px!important;line-height:1.1!important;writing-mode:vertical-rl;transform:rotate(180deg)}.ct426-history-actions{display:flex!important;gap:6px!important;margin-top:7px!important}.ct426-undo{display:inline-flex!important;visibility:visible!important;opacity:1!important;pointer-events:auto!important}';if(!q('#ct460-style'))document.head.appendChild(style);
window.__ctR460={version:'1.0.250',scope:'home-movies-sticky+watchlist-v405+foryou-v421+profile-13-half+daily-undo+f1-current-truth',enterMovies:enterMovies460,enterSeries:enterSeries460,loadMovies:loadMovies460,loadForYou:loadForYou460,applyProfile:applyProfile460,openDay:openDay460,refreshF1:refreshF1460};
window.__ctR460Marker='movies-sticky+watchlist-v405+foryou-7-swap+profile-13-half+daily-undo+f1-75-of-77-no-reconcile';
queueMicrotask(()=>{bindFY460();bindHistory460();bindF1460();if(isHome())enterSeries460();if(isDiscover()&&fySelected460())enterForYou460();if(isProfile())scheduleProfile460();scheduleF1460()});
})();