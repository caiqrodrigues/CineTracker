/* CineTracker Web 1.0.119 r328 — exact Home anchor + owned ForYou renderer. */
(()=>{
'use strict';
if(window.__ctR328?.version==='1.0.119')return;
window.__ctR328Marker='r276-home-anchor+owned-foryou-one-row+visible-filters+strict-discover';
window.__ctR328Home='history-above-viewport+exact-assistir-anchor+no-toggle+no-inner-scroll';
window.__ctR328Discover='owned-foryou-renderer+visible-kind-filters+single-action-row+v326-strict';
window.__ctR328Preserved='r324-watchlists+r325-episode-sync+r327-top10+f1+sports';
window.__ctR328Android='preserved-1.0.20-10062';

const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const rows=v=>Array.isArray(v)?v:[];
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const routeNow=()=>{try{return String(typeof route==='function'?route():'')}catch{return''}};
let homeInitial328=true,homeRaf328=0,domBusy328=false;

/* HOME: restore the approved r276 contract at the producer level. */
function homeKind328(){
 try{const k=typeof ct266CurrentHomeTab==='function'?ct266CurrentHomeTab():'';if(k==='movies'||k==='series')return k}catch{}
 const v=qa('[data-home-view]').find(x=>!x.classList.contains('hidden'));
 return v?.dataset?.homeView==='movies'?'movies':'series';
}
function historyNormalize328(){
 const root=q('[data-home]');if(!root)return false;
 let found=false;
 for(const sec of qa('[data-ct274-history]',root)){
  found=true;
  sec.classList.remove('is-collapsed');sec.classList.add('is-open');
  sec.removeAttribute('data-ct324-history');
  q('[data-ct275-history-toggle]',sec)?.remove();
  q('[data-ct324-history-toggle]',sec)?.remove();
  const shell=q('.ct275-history-shell',sec);if(shell){shell.removeAttribute('aria-hidden');shell.style.removeProperty('max-height');shell.style.removeProperty('height')}
  for(const stack of qa('.ct274-history-stack',sec)){stack.removeAttribute('aria-hidden');stack.style.removeProperty('max-height');stack.style.removeProperty('height');stack.style.removeProperty('overflow')}
 }
 return found;
}
function homeAnchorTarget328(kind=homeKind328()){
 const view=q('[data-home-view="'+(kind==='movies'?'movies':'series')+'"]');if(!view)return null;
 const wanted=kind==='movies'?'Assistir a seguir / Watchlist':'Assistir a seguir';
 return [...view.querySelectorAll(':scope > .home-section')].find(sec=>String(sec.querySelector('h3')?.textContent||'').trim()===wanted)
   || [...view.querySelectorAll(':scope > .home-section')].find(sec=>!sec.matches('[data-ct274-history]'))
   || null;
}
function homeAnchor328(kind=homeKind328()){
 if(routeNow()!=='home')return false;
 historyNormalize328();
 const target=homeAnchorTarget328(kind);if(!target)return false;
 const top=Math.max(0,target.getBoundingClientRect().top+window.scrollY-8);
 window.scrollTo({top,left:0,behavior:'auto'});
 target.dataset.ct328HomeAnchor='1';return true;
}
function scheduleHomeAnchor328(kind=homeKind328()){
 cancelAnimationFrame(homeRaf328);
 homeRaf328=requestAnimationFrame(()=>requestAnimationFrame(()=>homeAnchor328(kind)));
 setTimeout(()=>homeAnchor328(kind),80);
}
const basePaint328=typeof ct275PaintHome==='function'?ct275PaintHome:(typeof paintHome==='function'?paintHome:null);
if(basePaint328){
 const paint328=function(){
  const kind=homeKind328(),before=homeAnchorTarget328(kind)?.getBoundingClientRect?.().top??null;
  const out=basePaint328.apply(this,arguments);
  historyNormalize328();
  if(homeInitial328){homeInitial328=false;scheduleHomeAnchor328(kind)}
  else if(before!==null){
   const after=homeAnchorTarget328(kind)?.getBoundingClientRect?.().top;
   if(Number.isFinite(after)){const delta=after-before;if(Math.abs(delta)>1)window.scrollBy({top:delta,left:0,behavior:'auto'})}
  }
  return out;
 };
 try{ct275PaintHome=paint328}catch{}
 try{paintHome=paint328}catch{}
}
try{
 const baseRender328=renderHome;
 renderHome=async function(){
  homeInitial328=true;
  const out=await baseRender328.apply(this,arguments);
  historyNormalize328();scheduleHomeAnchor328(homeKind328());return out;
 };
}catch{}
document.addEventListener('click',e=>{
 const tab=e.target?.closest?.('[data-home-tab]');if(!tab)return;
 const kind=String(tab.dataset.homeTab||'series')==='movies'?'movies':'series';
 setTimeout(()=>scheduleHomeAnchor328(kind),0);
},false);

/* PRA VOCE: own final markup. No legacy swap row can survive. */
function key328(x){
 const type=String(x?.media_type||x?.type||'tv')==='movie'?'movie':'tv';
 const id=Number(x?.tmdb_id||x?.source_tmdb_id||x?.id||x?.raw_tmdb?.id||0);
 return id>0?type+':'+id:'';
}
function current328(pool,index){return rows(pool).length?pool[Math.abs(Number(index||0))%pool.length]:null}
function fyModel328(){
 const st=window.__ctR309Test?.state;if(!st)return null;
 const watch={},fresh={};
 for(const kind of ['movie','series','anime']){
  watch[kind]=current328(st.watchPools?.[kind],st.watchIndex?.[kind]);
  fresh[kind]=current328(st.freshPools?.[kind],st.freshIndex?.[kind]);
 }
 const used=new Set([...Object.values(watch),...Object.values(fresh)].filter(Boolean).map(key328));
 let daily=current328(st.dailyPool,st.dailyIndex);
 if(daily&&used.has(key328(daily)))daily=rows(st.dailyPool).find(x=>!used.has(key328(x)))||daily;
 return{watch,fresh,daily};
}
function card328(x){
 if(!x)return '<div class="ct328-missing"><div class="ct288-empty-poster"></div><b>Sem item elegível</b><small>Nenhum título atende às regras.</small></div>';
 try{return typeof ct288Card==='function'?ct288Card(x,{watch:false,add:false,slot:true}):''}catch{return''}
}
function actions328(x,{saved=false,swap=''}={}){
 if(!x)return'';
 const k=key328(x);
 return '<div class="ct328-actions" data-ct328-actions>'+
  '<button type="button" class="chip ct328-action watch'+(saved?' active':'')+'" data-ct328-action="watchlist" data-media="'+esc(k)+'"'+(saved?' disabled':'')+'>'+(saved?'✓ Watchlist':'+ Watchlist')+'</button>'+
  '<button type="button" class="chip ct328-action seen" data-ct328-action="seen" data-media="'+esc(k)+'">✓ Visto</button>'+
  (swap?'<button type="button" class="chip ct328-action swap" data-ct328-swap="'+esc(swap)+'">↻ Trocar</button>':'')+
 '</div>';
}
function slot328(label,kind,item,saved,bucket){
 return '<section class="ct328-slot" data-ct328-kind="'+kind+'" data-ct328-slot="'+bucket+':'+kind+'"><div class="ct328-slot-head"><h3>'+label+'</h3></div><div class="ct328-cardwrap">'+card328(item)+'</div>'+actions328(item,{saved,swap:bucket+':'+kind})+'</section>';
}
function trio328(title,items,saved,bucket){
 return '<section class="panel ct328-fy-block"><div class="panel-head"><h2>'+title+'</h2></div><div class="ct328-fy-grid">'+
  slot328('Filme','movie',items.movie,saved,bucket)+slot328('Série','series',items.series,saved,bucket)+slot328('Anime','anime',items.anime,saved,bucket)+
 '</div></section>';
}
function paintForYou328(){
 if(routeNow()!=='discover')return false;
 const discoverObj=window.__ctR288R263?.discover263;
 if(discoverObj&&String(discoverObj.tab||'')!=='foryou')return false;
 const m=fyModel328(),host=q('[data-ct319-content]')||q('[data-ct315-content]')||q('[data-ct263-discover-content]');
 if(!host||!m)return false;
 host.innerHTML='<div data-ct328-foryou>'+
  '<section class="panel ct328-daily"><div class="panel-head"><h2>Indicação do Dia</h2></div><div class="ct328-daily-card"><div class="ct328-cardwrap">'+card328(m.daily)+'</div>'+actions328(m.daily,{swap:'daily'})+'</div></section>'+
  trio328('Da sua Watchlist',m.watch,true,'watch')+trio328('100% novos',m.fresh,false,'fresh')+
 '</div>';
 host.dataset.ct328Owned='foryou';
 applyForYouFilter328();return true;
}
function fyKind328(){
 const st=window.__ctR319Test?.state;return ['movie','series','anime'].includes(String(st?.fyKind))?String(st.fyKind):'all';
}
function applyForYouFilter328(){
 const root=q('[data-ct328-foryou]');if(!root)return false;
 const kind=fyKind328();root.dataset.ct328Filter=kind;
 for(const slot of qa('[data-ct328-kind]',root)){
  const show=kind==='all'||String(slot.dataset.ct328Kind)===kind;
  slot.hidden=!show;
 }
 const daily=q('.ct328-daily',root);if(daily)daily.hidden=!(kind==='all'||kind==='movie');
 qa('[data-ct328-fy-kind]').forEach(b=>b.classList.toggle('active',String(b.dataset.ct328FyKind)===kind));
 return true;
}
function ensureForYouFilters328(){
 const root=q('[data-ct319-discover]');if(!root)return false;
 const d=window.__ctR288R263?.discover263,tab=String(d?.tab||'foryou');
 const filter=q('[data-ct319-filter]',root),types=q('[data-ct319-types]',root);
 if(tab!=='foryou'){
  if(filter)filter.hidden=false;
  return false;
 }
 if(filter)filter.hidden=true;
 if(types){
  const kind=fyKind328();
  types.innerHTML=[['all','Todos'],['movie','Filmes'],['series','Séries'],['anime','Animes']].map(([k,l])=>'<button type="button" class="chip '+(kind===k?'active':'')+'" data-ct328-fy-kind="'+k+'">'+l+'</button>').join('');
  types.hidden=false;types.classList.add('open');types.dataset.ct328Always='1';
 }
 applyForYouFilter328();return true;
}
function swap328(name){
 const st=window.__ctR309Test?.state;if(!st)return false;
 if(name==='daily'){
  const pool=rows(st.dailyPool);if(pool.length<2)return false;st.dailyIndex=(Number(st.dailyIndex||0)+1)%pool.length;
 }else{
  const [bucket,kind]=String(name||'').split(':');if(!['watch','fresh'].includes(bucket)||!['movie','series','anime'].includes(kind))return false;
  const key=bucket+'Pools',idx=bucket+'Index',pool=rows(st[key]?.[kind]);if(pool.length<2)return false;
  st[idx][kind]=(Number(st[idx][kind]||0)+1)%pool.length;
 }
 window.__ctR309Test?.setForYouState?.(st);paintForYou328();ensureForYouFilters328();return true;
}
async function persist328(btn){
 if(!btn||btn.disabled)return false;
 const action=String(btn.dataset.ct328Action||''),[type,idRaw]=String(btn.dataset.media||'').split(':'),id=Number(idRaw||0);
 if(!id||!['movie','tv'].includes(type))return false;
 btn.disabled=true;const old=btn.textContent;btn.textContent='…';
 try{
  if(action==='watchlist'){if(typeof addWatchlist!=='function')throw new Error('Watchlist indisponível');await addWatchlist(type,id)}
  else if(action==='seen'){if(typeof markSeen!=='function')throw new Error('Visto indisponível');await markSeen(type,id)}
  else return false;
  window.__ctR309Test?.setForYouState?.(null);
  await window.__ctR321?.loadForYou?.(true);
  setTimeout(()=>{paintForYou328();ensureForYouFilters328()},0);
  return true;
 }catch(e){btn.disabled=false;btn.textContent=old;try{toast(e?.message||String(e))}catch{}return false}
}
document.addEventListener('click',e=>{
 const filter=e.target?.closest?.('[data-ct328-fy-kind]');
 if(filter){
  e.preventDefault();e.stopImmediatePropagation();
  const st=window.__ctR319Test?.state;if(st)st.fyKind=String(filter.dataset.ct328FyKind||'all');
  applyForYouFilter328();ensureForYouFilters328();return;
 }
 const swap=e.target?.closest?.('[data-ct328-swap]');
 if(swap){e.preventDefault();e.stopImmediatePropagation();swap328(swap.dataset.ct328Swap);return}
 const action=e.target?.closest?.('[data-ct328-action]');
 if(action){e.preventDefault();e.stopImmediatePropagation();void persist328(action);return}
},true);

/* Keep controls/owned markup final after shell updates without repaint loops. */
try{
 const app=q('#app');
 if(app&&window.MutationObserver)new MutationObserver(muts=>{
  if(domBusy328||routeNow()!=='discover')return;
  if(!muts.some(m=>m.addedNodes.length))return;
  requestAnimationFrame(()=>{
   if(routeNow()!=='discover')return;
   ensureForYouFilters328();
   const d=window.__ctR288R263?.discover263;
   if(String(d?.tab||'')==='foryou'&&window.__ctR309Test?.state&&!q('[data-ct328-foryou]')){
    domBusy328=true;try{paintForYou328();ensureForYouFilters328()}finally{domBusy328=false}
   }
  });
 }).observe(app,{subtree:true,childList:true});
}catch{}

const style=document.createElement('style');style.id='ct-web-r328';style.textContent=`
/* HOME: r276 behavior — history exists above the initial viewport, never a toggle or inner scroller. */
[data-home] [data-ct275-history-toggle],[data-home] [data-ct324-history-toggle],[data-home] .ct324-history-toggle{display:none!important}
[data-home] [data-ct274-history],[data-home] [data-ct274-history].is-collapsed{display:block!important}
[data-home] [data-ct274-history] .ct275-history-shell,
[data-home] [data-ct274-history].is-collapsed .ct275-history-shell,
[data-home] [data-ct274-history] .ct274-history-stack{
 display:block!important;max-height:none!important;height:auto!important;overflow:visible!important;
 opacity:1!important;transform:none!important;pointer-events:auto!important;padding-right:0!important
}
[data-home-view]>.home-section:not([data-ct274-history]){scroll-margin-top:8px!important}

/* PRA VOCE: final renderer owns geometry. */
[data-ct319-types][data-ct328-always="1"]{display:flex!important;flex-flow:row nowrap!important;gap:6px!important;overflow-x:auto!important;margin:6px 0 8px!important}
[data-ct328-foryou] .ct328-fy-grid{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:10px!important;align-items:start!important}
[data-ct328-foryou] .ct328-slot{min-width:0!important;display:flex!important;flex-direction:column!important;align-items:center!important}
[data-ct328-foryou] .ct328-slot-head{width:100%!important;max-width:154px!important}
[data-ct328-foryou] .ct328-slot-head h3{margin:0 0 5px!important;font-size:12px!important}
[data-ct328-foryou] .ct328-cardwrap,[data-ct328-foryou] .ct328-actions{width:100%!important;max-width:154px!important;margin-inline:auto!important}
[data-ct328-foryou] .ct288-card{box-sizing:border-box!important;width:100%!important;min-width:0!important;max-width:154px!important;height:auto!important;overflow:visible!important}
[data-ct328-foryou] .ct288-open{width:100%!important;min-width:0!important}
[data-ct328-foryou] .ct288-poster{display:block!important;width:100%!important;height:auto!important;aspect-ratio:2/3!important;object-fit:cover!important}
[data-ct328-foryou] .ct328-actions{
 display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:3px!important;margin-top:4px!important
}
[data-ct328-foryou] .ct328-actions .chip{
 box-sizing:border-box!important;width:100%!important;min-width:0!important;height:24px!important;min-height:24px!important;
 padding:1px 2px!important;border-radius:7px!important;font-size:7px!important;line-height:1!important;
 white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important
}
[data-ct328-foryou] .ct328-daily-card{width:min(154px,100%)!important}
[data-ct328-foryou] [hidden]{display:none!important}
@media(max-width:620px){
 [data-ct328-foryou] .ct328-fy-grid{grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:6px!important}
 [data-ct328-foryou] .ct328-actions{gap:2px!important}
 [data-ct328-foryou] .ct328-actions .chip{font-size:6.5px!important;padding-inline:1px!important}
}

/* Public Discover actions remain one compact row. */
.ct319-actions{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:4px!important;width:100%!important}
.ct319-actions .chip{min-width:0!important;white-space:nowrap!important}
`;document.head.appendChild(style);

setTimeout(()=>{
 if(routeNow()==='home'){historyNormalize328();scheduleHomeAnchor328(homeKind328())}
 if(routeNow()==='discover'){ensureForYouFilters328();if(String(window.__ctR288R263?.discover263?.tab||'')==='foryou'&&window.__ctR309Test?.state)paintForYou328()}
},0);

window.__ctR328={
 homeAnchor:homeAnchor328,homeAnchorTarget:homeAnchorTarget328,normalizeHomeHistory:historyNormalize328,
 paintForYou:paintForYou328,applyForYouFilter:applyForYouFilter328,ensureFilters:ensureForYouFilters328,
 swapForYou:swap328,version:'1.0.119'
};
window.__ctR328Test={homeAnchorTarget328,historyNormalize328,paintForYou328,applyForYouFilter328,ensureForYouFilters328,fyModel328};
})();
