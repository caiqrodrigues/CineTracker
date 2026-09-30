/* CineTracker Web 1.0.204 r413 — no-history-flash Home entry + complete Pra Voce owner + Reality exclusion. */
(()=>{
'use strict';
if(window.__ctR413?.version==='1.0.204')return;
const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const rows=v=>Array.isArray(v)?v:[];
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const routeNow=()=>{try{return String(typeof route==='function'?route():'')}catch{return''}};
const discoverState=()=>window.__ctR288R263?.discover263||null;
const baseEligibility=window.__ctR412Eligibility||null;
const REALITY_GENRE_ID=10764;
const REALITY_TERMS=['reality','reality show','reality tv','unscripted'];
const idsOf=v=>rows(v).map(x=>Number(typeof x==='number'?x:(x?.id??x))).filter(Number.isFinite);
const namesOf=v=>rows(v).map(x=>norm(typeof x==='string'?x:(x?.name||x?.title||''))).filter(Boolean);
function rawOf(x){return x?.raw_tmdb&&typeof x.raw_tmdb==='object'?x.raw_tmdb:{}}
function isReality(x){
 if(!x||typeof x!=='object')return false;
 const r=rawOf(x);
 const ids=[...idsOf(x.genre_ids),...idsOf(x.genres),...idsOf(r.genre_ids),...idsOf(r.genres)];
 if(ids.includes(REALITY_GENRE_ID))return true;
 const names=[...namesOf(x.genres),...namesOf(r.genres)];
 const kind=norm(x.media_kind||x.kind||r.media_kind||r.kind||r.type||'');
 return names.some(v=>REALITY_TERMS.some(t=>v.includes(t)))||REALITY_TERMS.some(t=>kind.includes(t));
}
function reasonSync(x,opts={}){if(isReality(x))return'reality';return typeof baseEligibility?.reasonSync==='function'?baseEligibility.reasonSync(x,opts):''}
async function eligible(x,opts={}){if(isReality(x))return false;return typeof baseEligibility?.eligible==='function'?baseEligibility.eligible(x,opts):true}
async function filterRows(input,opts={}){
 const limit=Math.max(0,Number(opts.limit)||24),maxScan=Math.max(limit,Number(opts.maxScan)||72);
 const source=rows(input).slice(0,maxScan).filter(x=>!isReality(x));
 if(typeof baseEligibility?.filterRows!=='function')return source.slice(0,limit);
 const base=await baseEligibility.filterRows(source,{...opts,limit:maxScan,maxScan});
 return rows(base).filter(x=>!isReality(x)).slice(0,limit);
}
window.__ctR413Eligibility={version:'1.0.204',realityGenreId:REALITY_GENRE_ID,isReality,reasonSync,eligible,filterRows,detail:(...a)=>baseEligibility?.detail?.(...a),clearCache:()=>baseEligibility?.clearCache?.()};

/* Home: hide only the Home canvas while entering, align before the browser can paint History, then reveal. */
let homeToken=0;
function activeHome(){
 const m=q('[data-home-view="movies"]'),s=q('[data-home-view="series"]');
 if(m&&m.offsetParent!==null&&(!s||s.offsetParent===null))return'movies';
 const tab=q('[data-home-tab].active,[data-home-tab][aria-selected="true"]');
 return /filme/i.test(String(tab?.textContent||''))?'movies':'series';
}
function mainSection(kind){
 const view=q('[data-home-view="'+(kind==='movies'?'movies':'series')+'"]');if(!view)return null;
 if(kind==='movies')return q('[data-ct406-movie-watch],[data-ct405-movie-watch],[data-ct404-movie-watch],[data-ct388-movie-watch]',view)||qa('section,.home-section,.panel',view).find(x=>/assistir\s*a\s*seguir\s*\/\s*watchlist/i.test(q('h2,h3',x)?.textContent||''))||null;
 return q('[data-ct406-bucket="continue"],[data-ct404-bucket="continue"],[data-ct397-bucket="continue"],[data-ct388-bucket="continue"]',view)||qa('section,.home-section,.panel',view).find(x=>/assistir\s*a\s*seguir/i.test(q('h2,h3',x)?.textContent||''))||null;
}
function revealHome(){delete document.documentElement.dataset.ct413HomeEntering}
function beginHomeEntry(kind){
 const token=++homeToken;document.documentElement.dataset.ct413HomeEntering='1';
 document.documentElement.dataset.ct413HomeTarget=kind==='movies'?'movies':'series';
 try{window.scrollTo({top:0,left:0,behavior:'auto'})}catch{try{window.scrollTo(0,0)}catch{}}
 setTimeout(()=>{if(token===homeToken&&routeNow()!=='home')revealHome()},1200);
 setTimeout(()=>{if(token===homeToken&&document.documentElement.dataset.ct413HomeEntering==='1')revealHome()},5000);
 return token;
}
function alignHomeNow(kind=activeHome()){
 if(routeNow()!=='home')return false;
 const k=kind==='movies'?'movies':'series',target=mainSection(k);if(!target?.isConnected)return false;
 const tabs=q('[data-home] .home-tabs'),tabBottom=tabs?.getBoundingClientRect?.().bottom||0;
 const y=window.scrollY||document.documentElement.scrollTop||0,rect=target.getBoundingClientRect();
 const top=Math.max(0,Math.round(y+rect.top-Math.max(8,Math.ceil(tabBottom)+8)));
 try{window.scrollTo({top,left:0,behavior:'auto'})}catch{window.scrollTo(0,top)}
 document.documentElement.dataset.ct413HomeAligned=k;target.dataset.ct413HomeStart='1';revealHome();return true;
}
const oldHomePaint=window.__ctR409?.onHomePaint;
if(window.__ctR409&&typeof window.__ctR409==='object')window.__ctR409.onHomePaint=function(kind){
 let out=true;try{if(typeof oldHomePaint==='function')out=oldHomePaint.call(this,kind)}catch{}
 if(!alignHomeNow(kind))requestAnimationFrame(()=>alignHomeNow(kind));return out;
};

/* Pra Voce: r411 is the only owner. Rebind legacy aliases and repair complete actions in bounded passes. */
function isForYou(){return routeNow()==='discover'&&(String(discoverState()?.tab||'foryou')==='foryou'||!!q('[data-ct411-foryou]'))}
function setForYouState(){try{if(discoverState())discoverState().tab='foryou'}catch{}}
function bindForYouOwner(){
 const o=window.__ctR411;if(!o||typeof o!=='object')return false;
 for(const n of ['__ctR388','__ctR395','__ctR396','__ctR397','__ctR398','__ctR399','__ctR400','__ctR401','__ctR402','__ctR403','__ctR404','__ctR405','__ctR406','__ctR407','__ctR408','__ctR409','__ctR410']){
  const a=window[n];if(!a||typeof a!=='object')continue;
  if('loadForYou'in a)a.loadForYou=o.loadForYou;
  if('renderForYou'in a)a.renderForYou=o.renderForYou;
  if('swap'in a)a.swap=o.swap;
  if('act'in a)a.act=o.act;
 }
 window.__ctR288PaintForYou=o.renderForYou;
 if(window.__ctR319&&typeof window.__ctR319==='object'){
  window.__ctR319.loadForYou=o.loadForYou;
  const current=window.__ctR319.loadDiscover;
  if(typeof current==='function'&&!current.__ctR413Owned){
   const wrapped=function(tab='foryou',force=false){return String(tab||'foryou')==='foryou'?o.loadForYou(force):current.call(this,tab,force)};
   wrapped.__ctR413Owned=true;window.__ctR319.loadDiscover=wrapped;
  }
 }
 if(typeof window.__ctR288LoadDiscover==='function'&&!window.__ctR288LoadDiscover.__ctR413Owned){
  const current=window.__ctR288LoadDiscover;
  const wrapped=function(tab='foryou',force=false){return String(tab||'foryou')==='foryou'?o.loadForYou(force):current.call(this,tab,force)};
  wrapped.__ctR413Owned=true;window.__ctR288LoadDiscover=wrapped;
 }
 document.documentElement.dataset.ct413ForYouOwner='r411';return true;
}
function ensureSwapButtons(){
 const root=q('[data-ct411-foryou]');if(!root)return 0;
 for(const slot of qa('.ct388-slot[data-ct411-slot]',root)){
  const name=String(slot.dataset.ct411Slot||'');if(!name||!q('[data-media]',slot)||q('[data-ct411-action="swap"]',slot))continue;
  let actions=q('.ct411-actions',slot);if(!actions){actions=document.createElement('div');actions.className='ct411-actions '+(name.startsWith('watch:')?'two':'three');slot.appendChild(actions)}
  const b=document.createElement('button');b.type='button';b.className='chip ct411-action';b.dataset.ct411Action='swap';b.dataset.ct411Slot=name;b.setAttribute('aria-disabled','false');b.textContent='↻ Trocar';actions.appendChild(b);
 }
 for(const b of qa('[data-ct411-action]',root)){b.hidden=false;b.removeAttribute('disabled');b.removeAttribute('inert');b.setAttribute('aria-disabled','false')}
 const swaps=qa('[data-ct411-action="swap"]',root).length;document.documentElement.dataset.ct413SwapCount=String(swaps);return swaps;
}
function forceForYou(force=false){
 if(!isForYou())return false;setForYouState();bindForYouOwner();const o=window.__ctR411;if(!o)return false;
 try{o.renderForYou(false)}catch{}
 ensureSwapButtons();
 const snapshot=typeof o.getForYou==='function'?o.getForYou():null;
 const hasData=!!snapshot&&[...(snapshot.daily||[]),...rows(snapshot.watch?.movie),...rows(snapshot.watch?.series),...rows(snapshot.watch?.anime),...rows(snapshot.fresh?.movie),...rows(snapshot.fresh?.series),...rows(snapshot.fresh?.anime)].length>0;
 if(force||!hasData)void o.loadForYou(!!force);return true;
}
let repairToken=0;
function scheduleForYou(force=false){const token=++repairToken;for(const ms of [0,60,180,420,900,1800,3200,5200,8200])setTimeout(()=>{if(token!==repairToken||!isForYou())return;forceForYou(force&&ms===0);ensureSwapButtons()},ms)}
window.addEventListener('click',e=>{
 const t=e.target;if(!t?.closest)return;
 const nav=t.closest('[data-nav="home"]');const tab=t.closest('[data-home-tab]');
 if(nav||tab)beginHomeEntry(tab&&/filme/i.test(String(tab.textContent||''))?'movies':'series');
 if(t.closest('[data-nav="discover"],[data-ct319-tab="foryou"],[data-ct263-tab="foryou"],[data-discover-tab="foryou"]')){setForYouState();scheduleForYou(false)}
},true);
window.addEventListener('popstate',()=>{if(routeNow()==='home')beginHomeEntry(activeHome());else if(isForYou())scheduleForYou(false)});
window.addEventListener('cinetracker:data-changed',()=>{if(isForYou())scheduleForYou(true)});
function probe(n=0){
 bindForYouOwner();
 if(routeNow()==='home'){if(document.documentElement.dataset.ct413HomeEntering!=='1')beginHomeEntry(activeHome());if(alignHomeNow(activeHome()))return}
 if(isForYou()){scheduleForYou(false);return}
 if(n<30)setTimeout(()=>probe(n+1),150);
}
document.documentElement.dataset.ct413HomeEntering='1';
window.__ctR413={version:'1.0.204',scope:'home-entry+foryou-actions+reality-exclusion',beginHomeEntry,alignHomeNow,bindForYouOwner,ensureSwapButtons,forceForYou,isReality,filterRows};
window.__ctR413Marker='no-history-flash+7-swap-owner+reality-10764+strict-r412-preserved';
queueMicrotask(()=>probe(0));
})();