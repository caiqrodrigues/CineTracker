/* CineTracker Web 1.0.122 r331 — stable Home anchor + canonical Discover rules/actions. WEB ONLY. */
(()=>{
'use strict';
if(window.__ctR331?.version==='1.0.122')return;
window.__ctR331Marker='home-history-above-viewport+foryou-owned-actions-filters+discover-v327';
window.__ctR331Home='natural-page-history+anchor-first-normal-section+no-toggle';
window.__ctR331Discover='v327-exclusions+visible-kind-filters+three-actions-one-row';
window.__ctR331Navigation='bounded-loads-no-background-sweeps';
window.__ctR331Android='preserved-1.0.20-10062';

const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const routeNow=()=>{try{return String(typeof route==='function'?route():'')}catch{return''}};
const imp=(el,p,v)=>{try{el?.style?.setProperty(p,v,'important')}catch{}};
let anchorUntil=0,anchorSeq=0;

/* HOME — history exists above the initial viewport. No button, no nested scroll. */
function homeTab331(){
 try{return typeof ct266CurrentHomeTab==='function'?(ct266CurrentHomeTab()==='movies'?'movies':'series'):'series'}catch{return'series'}
}
function homeView331(){
 const root=q('[data-home]');if(!root)return null;
 const tab=homeTab331();
 return q('[data-home-view="'+tab+'"]',root)||qa('[data-home-view]',root).find(v=>!v.classList.contains('hidden'))||null;
}
function normalizeHomeHistory331(){
 if(routeNow()!=='home')return false;
 const root=q('[data-home]');if(!root)return false;
 let found=false;
 for(const sec of qa('[data-ct274-history]',root)){
  found=true;
  sec.classList.remove('is-collapsed','is-open','ct324-history-collapsed','ct324-history-open','ct330-history-scroll');
  sec.classList.add('ct331-history-natural');
  sec.removeAttribute('data-ct324-history');
  sec.removeAttribute('data-ct326-history');
  for(const b of qa('[data-ct275-history-toggle],[data-ct324-history-toggle],[data-ct326-history-toggle],[data-ct327-history-toggle],[data-ct330-history-toggle]',sec))b.remove();
  imp(sec,'display','block');imp(sec,'height','auto');imp(sec,'max-height','none');imp(sec,'overflow','visible');
  const shell=q('.ct275-history-shell',sec);
  if(shell){
   shell.setAttribute('aria-hidden','false');
   imp(shell,'display','block');imp(shell,'grid-template-rows','none');imp(shell,'height','auto');imp(shell,'max-height','none');
   imp(shell,'overflow','visible');imp(shell,'overflow-x','visible');imp(shell,'overflow-y','visible');
   imp(shell,'opacity','1');imp(shell,'transform','none');imp(shell,'pointer-events','auto');imp(shell,'transition','none');
  }
  const stack=q('.ct274-history-stack',sec);
  if(stack){
   stack.setAttribute('aria-hidden','false');
   imp(stack,'display','block');imp(stack,'height','auto');imp(stack,'max-height','none');imp(stack,'min-height','0');
   imp(stack,'overflow','visible');imp(stack,'overflow-x','visible');imp(stack,'overflow-y','visible');
   imp(stack,'overscroll-behavior','auto');imp(stack,'scrollbar-gutter','auto');imp(stack,'padding-right','0');
   try{stack.scrollTop=0}catch{}
  }
 }
 return found;
}
function homeAnchorTarget331(){
 const view=homeView331();if(!view)return null;
 const hist=q(':scope > [data-ct274-history]',view);
 if(hist?.nextElementSibling)return hist.nextElementSibling;
 return qa(':scope > .home-section',view).find(sec=>!sec.matches('[data-ct274-history]'))||null;
}
function anchorHome331(force=false){
 if(routeNow()!=='home')return false;
 normalizeHomeHistory331();
 if(!force&&Date.now()>anchorUntil)return false;
 const target=homeAnchorTarget331();if(!target)return false;
 const top=Math.max(0,target.getBoundingClientRect().top+window.scrollY-10);
 try{window.scrollTo({top,left:0,behavior:'auto'})}catch{window.scrollTo(0,top)}
 return true;
}
function beginHomeAnchor331(ms=1250){
 anchorUntil=Date.now()+Math.max(250,Number(ms)||1250);
 const my=++anchorSeq;
 const run=()=>{if(my!==anchorSeq||Date.now()>anchorUntil)return;anchorHome331(true)};
 requestAnimationFrame(()=>requestAnimationFrame(run));
 for(const delay of [60,160,360,720])setTimeout(run,delay);
 return true;
}
try{ct274AutoBottom=function(){normalizeHomeHistory331();if(Date.now()<=anchorUntil)queueMicrotask(()=>anchorHome331(false));return false}}catch{}
try{
 const basePaint=typeof ct275PaintHome==='function'?ct275PaintHome:null;
 if(basePaint){
  ct275PaintHome=function(){const out=basePaint.apply(this,arguments);normalizeHomeHistory331();if(Date.now()<=anchorUntil)requestAnimationFrame(()=>anchorHome331(false));return out};
  paintHome=ct275PaintHome;
 }
}catch{}
try{
 const baseRender=typeof renderHome==='function'?renderHome:null;
 if(baseRender)renderHome=async function(){beginHomeAnchor331(1450);const out=await baseRender.apply(this,arguments);normalizeHomeHistory331();beginHomeAnchor331(900);return out};
}catch{}
document.addEventListener('click',e=>{
 if(!e.target?.closest?.('[data-home-tab]'))return;
 beginHomeAnchor331(700);
 setTimeout(()=>{normalizeHomeHistory331();anchorHome331(true)},0);
},false);

/* PRA VOCE — visible local filters + one compact action row owned by r331. */
function r319State331(){return window.__ctR319Test?.state||null}
function fyState331(){return window.__ctR309Test?.state||null}
function current331(pool,index){return Array.isArray(pool)&&pool.length?pool[Math.abs(Number(index||0))%pool.length]:null}
function category331(x){
 try{return window.__ctR309Test?.category?.(x)||'series'}catch{return String(x?.media_type)==='movie'?'movie':'series'}
}
function currentDaily331(){
 const fy=fyState331(),pool=Array.isArray(fy?.dailyPool)?fy.dailyPool:[];
 return current331(pool,fy?.dailyIndex)||null;
}
function filterMarkup331(kind){
 const items=[['all','Todos'],['movie','Filmes'],['series','Séries'],['anime','Animes']];
 return '<div class="ct331-fy-filterbar" role="group" aria-label="Filtrar Pra você">'+items.map(([k,l])=>'<button type="button" class="chip ct331-fy-filter '+(kind===k?'active':'')+'" data-ct331-fy-kind="'+k+'" aria-pressed="'+(kind===k?'true':'false')+'">'+l+'</button>').join('')+'</div>';
}
function exposeForYouFilters331(){
 if(routeNow()!=='discover')return false;
 let tab='';try{tab=String(discover?.tab||'')}catch{}
 if(tab!=='foryou')return false;
 const st=r319State331(),root=q('[data-ct319-discover]'),host=q('[data-ct319-content]')||q('[data-ct315-content]')||q('[data-ct263-discover-content]');
 if(!st||(!root&&!host))return false;
 let types=(root&&q('[data-ct319-types]',root))||q('[data-ct331-fy-filters]');
 const trigger=root&&q('[data-ct319-filter]',root),kind=String(st.fyKind||'all');
 st.filterOpen=true;
 if(trigger)trigger.hidden=true;
 if(!types&&host){
  types=document.createElement('div');
  types.className='filters ct331-fy-types';
  types.dataset.ct331FyFilters='1';
  host.insertAdjacentElement('beforebegin',types);
 }
 if(types){
  types.innerHTML=filterMarkup331(kind);
  types.hidden=false;types.classList.add('open','ct331-fy-types');
  types.setAttribute('aria-hidden','false');
 }
 return !!types;
}
function applyForYouFilter331(){
 const st=r319State331(),root=q('[data-ct309-foryou]');if(!st||!root)return false;
 const kind=String(st.fyKind||'all');root.dataset.ct331FyFilter=kind;root.dataset.ct319FyFilter=kind;
 for(const slot of qa('[data-ct309-slot]',root)){
  const k=String(slot.dataset.ct309Slot||'').split(':').pop(),show=kind==='all'||k===kind;
  slot.hidden=!show;
  if(show)slot.style.removeProperty('display');else imp(slot,'display','none');
 }
 const daily=q('.ct309-daily',root),item=currentDaily331();
 if(daily){
  const show=kind==='all'||(item&&category331(item)===kind);
  daily.hidden=!show;
  if(show)daily.style.removeProperty('display');else imp(daily,'display','none');
 }
 for(const b of qa('[data-ct331-fy-kind]')){
  const active=String(b.dataset.ct331FyKind)===kind;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));
 }
 return true;
}
function cardKey331(container){
 const card=q('[data-ct288-card]',container),raw=String(card?.dataset?.ct288Card||q('[data-media]',container)?.getAttribute('data-media')||'');
 return /^(movie|tv):[1-9]\d*$/.test(raw)?raw:'';
}
function actionRow331(container){
 if(!container)return false;
 const key=cardKey331(container);if(!key)return false;
 let saved=false,swap='';
 if(container.matches('.ct309-daily-card'))swap='daily';
 else if(container.matches('[data-ct309-slot]')){
  const raw=String(container.dataset.ct309Slot||''),[bucket,kind]=raw.split(':');saved=bucket==='watch';swap=bucket&&kind?bucket+':'+kind:'';
 }
 let row=q(':scope > .ct309-actions',container);
 const valid=row&&qa(':scope > .chip',row).length===3;
 if(!valid){
  row?.remove();row=document.createElement('div');row.className='ct309-actions ct331-actions';
  row.innerHTML='<button type="button" class="chip ct309-action ct309-watch'+(saved?' active':'')+'" data-ct309-action="watchlist" data-media="'+key+'" '+(saved?'disabled aria-label="Na Watchlist"':'aria-label="Adicionar à Watchlist"')+'>'+(saved?'✓ Watchlist':'+ Watchlist')+'</button>'+
   '<button type="button" class="chip ct309-action ct309-seen" data-ct309-action="seen" data-media="'+key+'" aria-label="Marcar como visto">✓ Visto</button>'+
   '<button type="button" class="chip ct309-swap" data-ct309-swap="'+swap+'">↻ Trocar</button>';
  container.appendChild(row);
 }
 row.classList.add('ct331-actions');
 imp(row,'display','flex');imp(row,'flex-flow','row nowrap');imp(row,'align-items','center');imp(row,'gap','3px');imp(row,'width','100%');imp(row,'max-width','100%');imp(row,'margin-top','5px');
 for(const b of qa(':scope > .chip',row)){
  imp(b,'position','static');imp(b,'flex','1 1 0');imp(b,'width','0');imp(b,'min-width','0');imp(b,'max-width','none');
  imp(b,'height','25px');imp(b,'min-height','25px');imp(b,'padding','2px');imp(b,'font-size','8px');imp(b,'line-height','1');
  imp(b,'white-space','nowrap');imp(b,'overflow','hidden');imp(b,'text-overflow','ellipsis');imp(b,'grid-column','auto');
 }
 return true;
}
function settleForYou331(){
 if(routeNow()!=='discover')return false;
 let tab='';try{tab=String(discover?.tab||'')}catch{}
 if(tab!=='foryou')return false;
 const host=q('[data-ct319-content]')||q('[data-ct315-content]')||q('[data-ct263-discover-content]');
 if(host)host.removeAttribute('data-ct310-owned');
 const fy=q('[data-ct309-foryou]',host||document);if(!fy)return false;
 const st=r319State331(),kind=String(st?.fyKind||'all');
 let local=q(':scope > [data-ct331-fy-local-filters]',fy);
 if(!local){
  local=document.createElement('div');local.dataset.ct331FyLocalFilters='1';local.className='ct331-fy-local-filters';
  fy.prepend(local);
 }
 local.innerHTML=filterMarkup331(kind);
 for(const c of qa('.ct309-daily-card,.ct309-slot',fy))actionRow331(c);
 exposeForYouFilters331();applyForYouFilter331();return true;
}
try{
 const baseBuildFY=window.__ctR309?.buildForYou;
 if(typeof baseBuildFY==='function')window.__ctR309.buildForYou=async function(){const out=await baseBuildFY.apply(this,arguments);requestAnimationFrame(()=>settleForYou331());return out};
}catch{}
document.addEventListener('click',e=>{
 const b=e.target?.closest?.('[data-ct331-fy-kind]');if(!b)return;
 e.preventDefault();e.stopImmediatePropagation();
 const st=r319State331();if(!st)return;
 st.fyKind=String(b.dataset.ct331FyKind||'all');st.filterOpen=true;applyForYouFilter331();settleForYou331();
},true);
document.addEventListener('click',e=>{
 if(!e.target?.closest?.('[data-ct319-tab]'))return;
 setTimeout(()=>{let tab='';try{tab=String(discover?.tab||'')}catch{}if(tab==='foryou')settleForYou331()},0);
},false);

/* Keep a single late settle only; no broad DOM observer. */
setTimeout(()=>{if(routeNow()==='home'){normalizeHomeHistory331();beginHomeAnchor331(650)}else if(routeNow()==='discover')settleForYou331()},0);

const style=document.createElement('style');style.id='ct-web-r331';style.textContent=`
/* History is natural page content above the anchor, never a nested scroller or toggle. */
[data-home] [data-ct275-history-toggle],[data-home] [data-ct324-history-toggle],[data-home] [data-ct326-history-toggle],[data-home] [data-ct327-history-toggle]{display:none!important}
[data-home] [data-ct274-history],[data-home] [data-ct274-history] .ct275-history-shell,[data-home] [data-ct274-history] .ct274-history-stack{
 max-height:none!important;height:auto!important;overflow:visible!important;overflow-x:visible!important;overflow-y:visible!important
}
/* Permanent Pra voce category filters. */
.ct331-fy-types,.ct331-fy-local-filters{display:block!important;padding:0!important;margin:0 0 10px!important}
.ct331-fy-filterbar{display:flex!important;flex-flow:row nowrap!important;align-items:center!important;gap:5px!important;overflow-x:auto!important;max-width:100%!important;padding:2px 0!important}
.ct331-fy-filter{flex:0 0 auto!important;min-height:28px!important;height:28px!important;padding:3px 9px!important;font-size:10px!important;white-space:nowrap!important}
/* Three actions always share one compact row. */
[data-ct309-foryou] .ct309-actions,[data-ct309-foryou] .ct331-actions{display:flex!important;flex-flow:row nowrap!important;align-items:center!important;gap:3px!important;width:100%!important;max-width:100%!important;margin-top:5px!important}
[data-ct309-foryou] .ct309-actions>.chip,[data-ct309-foryou] .ct331-actions>.chip{position:static!important;flex:1 1 0!important;width:0!important;min-width:0!important;max-width:none!important;height:25px!important;min-height:25px!important;padding:2px!important;font-size:8px!important;line-height:1!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;grid-column:auto!important}
[data-ct309-foryou] .ct309-actions>.ct309-swap{grid-column:auto!important;width:0!important}
`;document.head.appendChild(style);

window.__ctR331={
 normalizeHomeHistory:normalizeHomeHistory331,homeAnchorTarget:homeAnchorTarget331,anchorHome:anchorHome331,beginHomeAnchor:beginHomeAnchor331,
 exposeForYouFilters:exposeForYouFilters331,applyForYouFilter:applyForYouFilter331,settleForYou:settleForYou331,actionRow:actionRow331,
 version:'1.0.122'
};
window.__ctR331Test={normalizeHomeHistory331,homeAnchorTarget331,anchorHome331,beginHomeAnchor331,filterMarkup331,applyForYouFilter331,actionRow331,settleForYou331};
})();
