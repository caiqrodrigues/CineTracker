/* CineTracker Web 1.0.249 r459 — hard video-ground-truth owner for Home, Pra Você, Perfil and F1. */
(()=>{'use strict';
if(window.__ctR459?.version==='1.0.249')return;
const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const num=v=>Number.isFinite(Number(v))?Number(v):0;
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const routeNow=()=>{try{return String(typeof route==='function'?route():'')}catch{return''}};
const authReady=()=>{try{return!!session?.access_token&&typeof rpc==='function'}catch{return false}};
const later=(fn,delays)=>{for(const ms of delays)setTimeout(fn,ms)};
const timeout=(p,ms)=>Promise.race([Promise.resolve(p),new Promise((_,reject)=>setTimeout(()=>reject(new Error('TIMEOUT')),ms))]);

let desiredHome459='series',homeSeq459=0,movieTask459=null,movieAttempt459=0;
function homeView459(kind){return q('[data-home-view="'+kind+'"]')}
function tabKind459(el){
 const raw=String(el?.dataset?.homeTab||'');if(raw==='movies'||raw==='series')return raw;
 const t=norm(el?.textContent||'');return t.includes('filme')?'movies':t.includes('serie')?'series':'';
}
function applyHome459(kind){
 if(routeNow()!=='home')return false;kind=kind==='movies'?'movies':'series';desiredHome459=kind;
 try{if(window.__ctR371&&typeof window.__ctR371==='object')window.__ctR371.activeTab=kind}catch{}
 for(const b of qa('[data-home-tab],.home-tabs button')){const k=tabKind459(b);if(!k)continue;const on=k===kind;b.classList.toggle('active',on);b.setAttribute('aria-selected',on?'true':'false')}
 for(const v of qa('[data-home-view]')){const on=String(v.dataset.homeView||'')===kind;v.hidden=!on;v.style.display=on?'':'none'}
 document.documentElement.dataset.ct459HomeKind=kind;return true;
}
function continuePanel459(){
 const root=homeView459('series')||q('[data-home-series]')||q('#app')||document;
 for(const p of qa('section,.panel,[class*="panel"]',root)){
  const t=norm(q('.panel-head h1,.panel-head h2,.panel-head h3,:scope>h1,:scope>h2,:scope>h3',p)?.textContent||'');
  if(t==='continuar assistindo'||t.startsWith('continuar assistindo ')||t==='assistir a seguir')return p;
 }
 return null;
}
function revealSeries459(){document.documentElement.removeAttribute('data-ct459-boot');document.documentElement.dataset.ct459HomeSeries='ready'}
function settleSeries459(){
 if(routeNow()!=='home'||desiredHome459!=='series')return false;applyHome459('series');
 try{window.scrollTo({top:0,left:0,behavior:'auto'})}catch{}
 const panel=continuePanel459();if(!panel)return false;
 try{panel.scrollIntoView({block:'start',inline:'nearest',behavior:'auto'})}catch{}
 revealSeries459();return true;
}
function scheduleSeries459(){
 const seq=++homeSeq459;desiredHome459='series';document.documentElement.dataset.ct459Boot='1';
 try{window.scrollTo({top:0,left:0,behavior:'auto'})}catch{}
 later(()=>{if(seq!==homeSeq459||routeNow()!=='home'||desiredHome459!=='series')return;settleSeries459()},[0,40,100,220,450,800,1400,2400,3800]);
 setTimeout(()=>{if(seq===homeSeq459&&routeNow()==='home'&&desiredHome459==='series')revealSeries459()},4200);
}
function movieStack459(){return q('[data-ct456-movie-watch] .ct456-movie-stack,[data-ct404-movie-watch] .ct456-movie-stack,[data-ct388-movie-watch] .ct456-movie-stack',homeView459('movies')||document)}
function moviesPainted459(){
 const s=movieStack459();if(!s)return false;const t=norm(s.textContent||'');
 return s.children.length>0&&!t.includes('carregando watchlist')&&!t.includes('falha ao carregar watchlist');
}
async function loadMovies459(force=false){
 if(routeNow()!=='home'||desiredHome459!=='movies')return false;if(movieTask459&&!force)return movieTask459;
 const seq=homeSeq459;movieTask459=(async()=>{try{
  for(const ms of[0,100,250,500,900,1500]){if(ms)await new Promise(r=>setTimeout(r,ms));if(seq!==homeSeq459||routeNow()!=='home'||desiredHome459!=='movies')return false;applyHome459('movies');if(authReady()&&window.__ctR456?.loadMovies)break}
  if(!authReady()||!window.__ctR456?.loadMovies)throw new Error('MOVIE_OWNER_NOT_READY');
  await timeout(window.__ctR456.loadMovies(!!force),15000);applyHome459('movies');
  if(!moviesPainted459()&&movieAttempt459<1){movieAttempt459++;await timeout(window.__ctR456.loadMovies(true),15000);applyHome459('movies')}
  const ok=moviesPainted459();document.documentElement.dataset.ct459Movies=ok?'ready':'empty';return ok;
 }catch(e){document.documentElement.dataset.ct459MoviesError=String(e?.message||e);return false}
 finally{movieTask459=null}})();return movieTask459;
}
function enterMovies459(){
 homeSeq459++;desiredHome459='movies';movieAttempt459=0;document.documentElement.removeAttribute('data-ct459-boot');applyHome459('movies');
 try{window.scrollTo({top:0,left:0,behavior:'auto'})}catch{}
 const seq=homeSeq459;later(()=>{if(seq!==homeSeq459||routeNow()!=='home'||desiredHome459!=='movies')return;applyHome459('movies')},[0,80,220,500,900,1500,2600]);
 void loadMovies459(true);return true;
}

let fyTask459=null,fySeq459=0;
function fyState459(){return window.__ctR288R263?.discover263||null}
function fyActive459(){
 if(routeNow()!=='discover')return false;const s=fyState459();if(String(s?.tab||'')==='foryou')return true;
 return!!q('[data-ct319-tab="foryou"].active,[data-ct263-tab="foryou"].active,[data-discover-tab="foryou"].active,[data-ct288-tab="foryou"].active,[aria-selected="true"][data-ct319-tab="foryou"]');
}
function fyReady459(){return!!q('[data-ct457-foryou]')&&qa('[data-ct457-action="swap"]').length>=7}
function bindForYou459(){
 const o=window.__ctR457;if(!o)return false;
 if(window.__ctR456&&typeof window.__ctR456==='object'){window.__ctR456.loadForYou=o.loadForYou;window.__ctR456.paintForYou=o.paintForYou;window.__ctR456.swap=o.swap}
 window.__ctR388LoadForYou=o.loadForYou;window.__ctR288PaintForYou=o.paintForYou;
 for(const n of ['__ctR309','__ctR309Api','__ctR449'])if(window[n]&&typeof window[n]==='object'){
  if('buildForYou' in window[n])window[n].buildForYou=o.loadForYou;if('load' in window[n])window[n].load=o.loadForYou;if('paint' in window[n])window[n].paint=o.paintForYou;if('swap' in window[n])window[n].swap=o.swap;
 }
 return true;
}
async function loadForYou459(force=false){
 if(routeNow()!=='discover')return false;if(fyTask459&&!force)return fyTask459;const run=++fySeq459;
 fyTask459=(async()=>{try{
  const s=fyState459();if(s){s.tab='foryou';s.type='all'}
  for(const ms of[0,100,250,500,900,1500]){if(ms)await new Promise(r=>setTimeout(r,ms));if(run!==fySeq459||routeNow()!=='discover')return false;if(authReady()&&bindForYou459())break}
  if(!authReady()||!window.__ctR457?.loadForYou)throw new Error('FORYOU_OWNER_NOT_READY');
  await timeout(window.__ctR457.loadForYou(!!force),18000);window.__ctR457.paintForYou?.();
  if(!fyReady459()){await new Promise(r=>setTimeout(r,900));if(run!==fySeq459)return false;await timeout(window.__ctR457.loadForYou(true),18000);window.__ctR457.paintForYou?.()}
  const ok=fyReady459();document.documentElement.dataset.ct459ForYou=ok?'ready':'incomplete';return ok;
 }catch(e){document.documentElement.dataset.ct459ForYouError=String(e?.message||e);return false}
 finally{fyTask459=null}})();return fyTask459;
}
function enterForYou459(){const s=fyState459();if(s){s.tab='foryou';s.type='all'}void loadForYou459(true)}

const PROFILE_LIMIT_459=13;let profileSeq459=0;
const wantedProfile459=t=>['series','filmes','series favoritas','filmes favoritos','atores'].includes(norm(t));
function profileTitle459(panel){return q('.panel-head h2,.panel-head h3,:scope>h2,:scope>h3,h2,h3',panel)?.textContent||''}
function looksCard459(el){return!!el&&!el.matches?.('[data-ct455-more],[data-ct457-more],[data-ct459-more]')&&(el.matches?.('.card,article,[data-media-id],[data-person-id]')||!!q('img,.poster,[class*="poster"],[class*="avatar"]',el))}
function railScore459(el){return qa(':scope>*',el).filter(looksCard459).length}
function bestRail459(panel){
 const candidates=[...qa(':scope>div,:scope>section',panel),...qa(':scope>div>div,:scope>section>div',panel)];let best=null,score=0;
 for(const el of candidates){const s=railScore459(el);if(s>score){best=el;score=s}}
 return score?best:null;
}
function nativeMore459(panel){return qa('button',panel).find(b=>!b.dataset.ct459More&&!b.dataset.ct455More&&!b.dataset.ct457More&&norm(b.textContent).includes('ver mais'))||null}
function applyProfilePanel459(panel){
 const title=profileTitle459(panel);if(!wantedProfile459(title))return false;const rail=bestRail459(panel);if(!rail)return false;
 qa('[data-ct455-more],[data-ct457-more],[data-ct459-more]',rail).forEach(x=>x.remove());
 const cards=qa(':scope>*',rail).filter(looksCard459);if(!cards.length)return false;
 cards.forEach((card,i)=>{card.hidden=i>=PROFILE_LIMIT_459;card.style.display=i>=PROFILE_LIMIT_459?'none':''});
 if(cards.length<=PROFILE_LIMIT_459){panel.dataset.ct459Profile='all';return true}
 const first=cards[0],rect=first.getBoundingClientRect?.()||{},w=Math.max(58,Math.round((rect.width||150)/2)),h=Math.max(150,Math.round(rect.height||225)),trigger=nativeMore459(panel);
 const more=document.createElement('button');more.type='button';more.dataset.ct459More='1';more.className='ct459-profile-more';more.setAttribute('aria-label','Ver mais '+title);more.style.setProperty('--ct459-more-w',w+'px');more.style.height=h+'px';more.innerHTML='<span aria-hidden="true">›</span><b>Ver mais</b>';
 more.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();if(trigger?.isConnected){trigger.click();return}cards.forEach(c=>{c.hidden=false;c.style.display=''});more.remove()});
 rail.appendChild(more);panel.dataset.ct459Profile='13+half-more';return true;
}
function applyProfile459(){
 if(routeNow()!=='profile')return false;const root=q('[data-profile]')||q('#app');if(!root)return false;let changed=false;
 for(const panel of qa('section.panel,.panel',root))if(applyProfilePanel459(panel))changed=true;
 if(changed)root.dataset.ct459ProfileLists='13+half-more';return changed;
}
function bindHistory459(){
 const o=window.__ctR426;if(!o?.openDay)return false;try{ct171OpenActivityDay=o.openDay}catch{}window.ct171OpenActivityDay=o.openDay;document.documentElement.dataset.ct459HistoryUndo='r426';return true;
}
function scheduleProfile459(){const seq=++profileSeq459;later(()=>{if(seq!==profileSeq459||routeNow()!=='profile')return;bindHistory459();applyProfile459()},[0,80,180,400,800,1400,2400,3800,5600])}

let f1Task459=null,f1Reconciled459=false;
function bindF1459(){
 const o=window.__ctR423;if(!o)return false;
 try{ct285Mark=o.markSeriesF1}catch{}try{ct284Mark=o.markSeriesF1}catch{}try{toggleF1Session311=o.toggleF1Hub}catch{}
 try{if(window.__ctR421){window.__ctR421.toggleF1=o.toggleF1Hub;window.__ctR421.syncF1=o.syncF1Hub;window.__ctR421.scheduleF1Sync=o.scheduleF1Sync}}catch{}
 return true;
}
function f1Scopes459(){
 const set=new Set();for(const el of qa('[data-media-id="865"],[data-series-id="865"],[data-ct-media-id="865"]'))set.add(el);
 for(const p of qa('[data-ct285-progress],[data-ct284-progress]')){const s=p.closest('[data-series-detail],section,article,.card,.media-row,.modal,main');if(s&&norm(s.textContent).includes('formula 1'))set.add(s)}
 for(const s of qa('[data-series-detail],section,article,.card,.media-row,.modal'))if(norm(s.textContent).includes('formula 1')&&/\d+\s*\/\s*\d+\s*assistidos/i.test(s.textContent||''))set.add(s);
 return[...set];
}
function patchF1Scope459(scope,d){
 const watched=num(d?.watched_released_episodes),released=num(d?.released_episodes),remaining=Math.max(0,num(d?.remaining_episodes));let changed=false;
 for(const el of [scope,...qa('span,small,em,p,strong,b,[data-ct285-progress],[data-ct284-progress]',scope)]){
  if(el.children?.length>3)continue;const old=String(el.textContent||'');let next=old;
  next=next.replace(/\d+\s*\/\s*\d+\s*assistidos/ig,watched+'/'+released+' assistidos');
  next=next.replace(/\d+\s+j[aá]\s+exibidos/ig,released+' já exibidos');
  next=next.replace(/\d+\s+epis[oó]dios?\s+dispon[ií]veis?\s+para\s+ver/ig,remaining+' episódios disponíveis para ver');
  if(next!==old){el.textContent=next;changed=true}
 }
 scope.dataset.ct459F1=watched+'/'+released+';remaining='+remaining;return changed;
}
async function repairF1459(force=false){
 if(f1Task459&&!force)return f1Task459;f1Task459=(async()=>{try{
  for(const ms of[0,100,260,520,900]){if(ms)await new Promise(r=>setTimeout(r,ms));if(authReady()&&bindF1459())break}
  if(!authReady())throw new Error('F1_AUTH_NOT_READY');const year=new Date().getFullYear();
  if(window.__ctR423?.reconcile&&(!f1Reconciled459||force)){await timeout(window.__ctR423.reconcile(year,true),16000);f1Reconciled459=true}
  const raw=await timeout(rpc('cinetracker_f1_progress_v426',{p_season:year}),7000),d=Array.isArray(raw)?raw[0]:raw;if(!d)throw new Error('F1_PROGRESS_EMPTY');
  for(const s of f1Scopes459())patchF1Scope459(s,d);
  document.documentElement.dataset.ct459F1=num(d.watched_released_episodes)+'/'+num(d.released_episodes)+';remaining='+num(d.remaining_episodes);return d;
 }catch(e){document.documentElement.dataset.ct459F1Error=String(e?.message||e);return false}
 finally{f1Task459=null}})();return f1Task459;
}
function scheduleF1459(force=false){later(()=>{if(['home','sports','f1hub'].includes(routeNow())||q('[data-media-id="865"],[data-series-id="865"]'))void repairF1459(force)},[0,120,350,800,1500,2800])}

window.addEventListener('click',e=>{
 const t=e.target;if(!t?.closest)return;
 const ht=t.closest('[data-home-tab],.home-tabs button');
 if(ht&&routeNow()==='home'){
  const kind=tabKind459(ht);if(kind){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();if(kind==='movies')enterMovies459();else scheduleSeries459();return}
 }
 const fy=t.closest('[data-ct319-tab="foryou"],[data-ct263-tab="foryou"],[data-discover-tab="foryou"],[data-ct288-tab="foryou"]');
 if(fy&&routeNow()==='discover'){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();enterForYou459();return}
 const undo=t.closest('[data-ct426-undo],[data-ct426-undo-sport]');if(undo&&window.__ctR426?.undoHistory){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();void window.__ctR426.undoHistory(undo);return}
 const nav=t.closest('[data-nav]');if(nav){const n=String(nav.dataset.nav||'');if(n==='home')setTimeout(scheduleSeries459,0);if(n==='discover')setTimeout(enterForYou459,0);if(n==='profile')setTimeout(scheduleProfile459,0);if(n==='home'||n==='sports')setTimeout(()=>scheduleF1459(false),0)}
 if(t.closest('[data-ct311-f1-race],[data-ct311-f1-watch],[data-ct285-episode-card],[data-ct284-episode],[data-ct255-watch]'))setTimeout(()=>scheduleF1459(true),100);
},true);
window.addEventListener('popstate',()=>setTimeout(()=>{if(routeNow()==='home')scheduleSeries459();if(routeNow()==='discover'&&fyActive459())enterForYou459();if(routeNow()==='profile')scheduleProfile459();scheduleF1459(false)},0));
window.addEventListener('cinetracker:data-changed',e=>{const src=String(e?.detail?.source||'');if(routeNow()==='profile')scheduleProfile459();if(src.includes('f1')||num(e?.detail?.media_id)===865)scheduleF1459(false)});
window.addEventListener('cinetracker:f1-watched-changed',()=>scheduleF1459(true));

const style=document.createElement('style');style.id='ct459-style';style.textContent='html[data-ct459-boot="1"] [data-home-view="series"]{visibility:hidden!important}[data-ct457-action="swap"]{display:inline-flex!important;visibility:visible!important;opacity:1!important;pointer-events:auto!important}.ct457-actions{display:grid!important}[data-profile] .ct459-profile-more{box-sizing:border-box!important;display:flex!important;flex:0 0 var(--ct459-more-w,75px)!important;width:var(--ct459-more-w,75px)!important;min-width:var(--ct459-more-w,75px)!important;max-width:var(--ct459-more-w,75px)!important;align-self:stretch!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:9px!important;padding:8px 5px!important;border:1px solid rgba(86,190,255,.42)!important;border-radius:12px!important;background:linear-gradient(180deg,rgba(16,43,58,.92),rgba(8,25,35,.96))!important;color:inherit!important;cursor:pointer!important;white-space:normal!important}[data-profile] .ct459-profile-more span{font-size:32px!important;line-height:1!important}[data-profile] .ct459-profile-more b{font-size:11px!important;line-height:1.1!important;writing-mode:vertical-rl;transform:rotate(180deg)}';
if(!q('#ct459-style'))document.head.appendChild(style);
window.__ctR459={version:'1.0.249',scope:'home-hard-tabs+watchlist+foryou+profile-13-half+daily-undo+f1-three-way',enterMovies:enterMovies459,settleSeries:settleSeries459,loadMovies:loadMovies459,loadForYou:loadForYou459,applyProfile:applyProfile459,repairF1:repairF1459};
window.__ctR459Marker='hard-home-tabs+watchlist-v405+foryou-v421+profile-13-half+daily-undo+f1-r423-r426';
queueMicrotask(()=>{bindForYou459();bindHistory459();bindF1459();if(routeNow()==='home')scheduleSeries459();if(routeNow()==='discover'&&fyActive459())enterForYou459();if(routeNow()==='profile')scheduleProfile459();scheduleF1459(false)});
})();