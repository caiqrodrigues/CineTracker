/* CineTracker Web 1.0.120 r329 — fluid Discover tabs + compact ForYou cards/actions. WEB ONLY. */
(()=>{
'use strict';
if(window.__ctR329?.version==='1.0.120')return;
window.__ctR329Marker='discover-cache-first-tabs+idle-prefetch+compact-foryou-cards';
window.__ctR329Discover='instant-return-cache+source-prefetch+hard-foryou-layout';
window.__ctR329Android='preserved-1.0.20-10062';

const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const routeNow=()=>{try{return String(typeof route==='function'?route():'')}catch{return''}};
const R319=()=>window.__ctR319Test||null;
const R321=()=>window.__ctR321||null;
const R309=()=>window.__ctR309Test||null;
const TTL=5*60*1000;
const domCache=new Map();
let loadSeq=0,hostObserver=null,prefetching=false,prefetchTimer=0,testBridge=null;
const PUBLIC=['trending','popular','new','releases','anticipated','top'];

function state329(){return R319()?.state||null}
function tab329(){try{return String(discover?.tab||'foryou')}catch{return'foryou'}}
function type329(){try{return String(discover?.type||'all')}catch{return'all'}}
function host329(){return q('[data-ct319-content]')||q('[data-ct315-content]')||q('[data-ct263-discover-content]')}
function cacheKey329(tab=tab329()){
 const t=String(tab||'foryou');
 return PUBLIC.includes(t)?t+'|'+type329():t;
}
function fresh329(hit){return !!(hit&&Date.now()-Number(hit.at||0)<TTL)}
function usable329(h){
 if(!h||!h.innerHTML?.trim())return false;
 if(q('.ct263-loading,.ct309-loading,.ct321-loading,.ct320-loading',h))return false;
 if(q('.ct309-fy-error,.ct320-block-error',h))return false;
 return true;
}
function cacheCurrent329(){
 if(routeNow()!=='discover')return false;
 const h=host329();if(!usable329(h))return false;
 domCache.set(cacheKey329(),{at:Date.now(),html:h.innerHTML});
 return true;
}
function syncShell329(){
 const root=q('[data-ct319-discover]'),test=R319(),st=state329();if(!root||!test||!st)return false;
 const tab=tab329(),can=tab==='foryou'||test.STRICT?.has?.(tab);
 for(const b of qa('[data-ct319-tab]',root))b.classList.toggle('active',String(b.dataset.ct319Tab)===tab);
 const filter=q('[data-ct319-filter]',root),types=q('[data-ct319-types]',root);
 if(filter){filter.hidden=!can;filter.setAttribute('aria-expanded',String(can&&st.filterOpen))}
 if(types){
  types.innerHTML=can?test.filterMarkup319():'';
  types.hidden=!can||!st.filterOpen;
  types.classList.toggle('open',can&&st.filterOpen);
 }
 return true;
}
function fyCategory329(x){
 try{return R309()?.category?.(x)||'series'}catch{return String(x?.media_type)==='movie'?'movie':'series'}
}
function currentDaily329(){
 const fy=R309()?.state,pool=Array.isArray(fy?.dailyPool)?fy.dailyPool:[];
 if(!pool.length)return null;
 return pool[Math.abs(Number(fy?.dailyIndex||0))%pool.length]||null;
}
function applyForYouFilter329(){
 const st=state329(),root=q('[data-ct309-foryou]');if(!st||!root)return false;
 const kind=String(st.fyKind||'all');root.dataset.ct329FyFilter=kind;root.dataset.ct319FyFilter=kind;
 for(const slot of qa('[data-ct309-slot]',root)){
  const k=String(slot.dataset.ct309Slot||'').split(':').pop();
  slot.hidden=!(kind==='all'||k===kind);
  slot.style.setProperty('display',slot.hidden?'none':'flex','important');
 }
 const daily=q('.ct309-daily',root),item=currentDaily329();
 if(daily){
  const show=kind==='all'||(item&&fyCategory329(item)===kind);
  daily.hidden=!show;daily.style.setProperty('display',show?'block':'none','important');
 }
 qa('[data-ct319-fy-kind]').forEach(b=>b.classList.toggle('active',String(b.dataset.ct319FyKind)===kind));
 return true;
}
function imp(el,p,v){try{el?.style?.setProperty(p,v,'important')}catch{}}
function compactOne329(container){
 if(!container)return 0;
 const card=q('.ct288-card',container);
 if(card){imp(card,'width','158px');imp(card,'min-width','158px');imp(card,'max-width','158px');imp(card,'margin','0')}
 let row=q('.ct309-actions',container);
 const buttons=qa('[data-ct309-action],[data-ct309-swap]',container);
 if(!row&&buttons.length){row=document.createElement('div');row.className='ct309-actions ct329-actions';container.appendChild(row)}
 if(!row)return 0;
 for(const b of buttons)if(b.parentElement!==row)row.appendChild(b);
 const count=Math.max(1,qa('.chip',row).length);
 row.classList.add('ct329-actions');
 imp(row,'display','grid');imp(row,'grid-template-columns','repeat('+count+',minmax(0,1fr))');
 imp(row,'gap','3px');imp(row,'width','158px');imp(row,'min-width','158px');imp(row,'max-width','158px');
 imp(row,'margin-top','5px');imp(row,'align-items','center');
 for(const b of qa('.chip',row)){
  imp(b,'position','static');imp(b,'grid-column','auto');imp(b,'flex','none');imp(b,'width','100%');
  imp(b,'min-width','0');imp(b,'max-width','none');imp(b,'height','24px');imp(b,'min-height','24px');
  imp(b,'padding','2px 2px');imp(b,'font-size','7.5px');imp(b,'line-height','1');
  imp(b,'white-space','nowrap');imp(b,'overflow','hidden');imp(b,'text-overflow','ellipsis');
 }
 return count;
}
function compactForYou329(root=document){
 const fy=q('[data-ct309-foryou]',root)||q('[data-ct309-foryou]');if(!fy)return false;
 for(const grid of qa('.ct309-fy-grid',fy)){
  imp(grid,'display','grid');imp(grid,'grid-template-columns','repeat(3,158px)');imp(grid,'gap','12px');
  imp(grid,'justify-content','start');imp(grid,'align-items','start');imp(grid,'width','max-content');imp(grid,'max-width','100%');
 }
 for(const slot of qa('.ct309-slot',fy)){
  imp(slot,'display',slot.hidden?'none':'flex');imp(slot,'flex-direction','column');imp(slot,'align-items','flex-start');
  imp(slot,'width','158px');imp(slot,'min-width','158px');imp(slot,'max-width','158px');
  compactOne329(slot);
 }
 for(const daily of qa('.ct309-daily-card',fy)){
  imp(daily,'display','flex');imp(daily,'flex-direction','column');imp(daily,'align-items','flex-start');
  imp(daily,'width','158px');imp(daily,'min-width','158px');imp(daily,'max-width','158px');
  compactOne329(daily);
 }
 applyForYouFilter329();
 return true;
}
function compactPublic329(root=document){
 for(const row of qa('.ct319-actions',root)){
  const n=Math.max(1,qa('.chip',row).length);
  imp(row,'display','grid');imp(row,'grid-template-columns','repeat('+n+',minmax(0,1fr))');imp(row,'gap','4px');imp(row,'width','100%');
  for(const b of qa('.chip',row)){
   imp(b,'width','100%');imp(b,'min-width','0');imp(b,'height','25px');imp(b,'min-height','25px');
   imp(b,'padding','2px 4px');imp(b,'font-size','8.5px');imp(b,'white-space','nowrap');
  }
 }
}
function settle329(){
 if(routeNow()!=='discover')return false;
 syncShell329();compactForYou329(document);compactPublic329(document);cacheCurrent329();return true;
}
function observeHost329(){
 try{hostObserver?.disconnect?.()}catch{}
 const h=host329();if(!h||!window.MutationObserver)return false;
 hostObserver=new MutationObserver(muts=>{
  if(routeNow()!=='discover')return;
  const relevant=muts.some(m=>[...m.addedNodes].some(n=>n.nodeType===1&&(
   n.matches?.('[data-ct309-foryou],.ct319-public,.ct288-top-shell')||
   n.querySelector?.('[data-ct309-foryou],.ct319-public,.ct288-top-shell')
  )));
  if(relevant)requestAnimationFrame(()=>requestAnimationFrame(settle329));
 });
 hostObserver.observe(h,{childList:true,subtree:true});return true;
}
function restore329(tab){
 const hit=domCache.get(cacheKey329(tab)),h=host329();if(!fresh329(hit)||!h)return false;
 h.innerHTML=hit.html;
 requestAnimationFrame(()=>requestAnimationFrame(settle329));
 return true;
}
function loading329(tab){
 const h=host329();if(!h)return;
 const label=tab==='foryou'?'Montando recomendações…':tab==='top10'?'Carregando Top 10…':'Carregando títulos…';
 h.innerHTML='<div class="ct263-loading ct329-loading">'+label+'</div>';
}
async function loadTab329(tab,{force=false}={}){
 const t=String(tab||'foryou'),my=++loadSeq;
 try{discover.tab=t;if(t==='foryou'||t==='top10')discover.type='all'}catch{}
 syncShell329();
 if(!force&&restore329(t)){schedulePrefetch329();return true}
 loading329(t);
 try{
  const fn=testBridge?.loadDiscover||R321()?.loadDiscover;
  if(typeof fn!=='function')throw new Error('Carregador do Descobrir indisponível.');
  const ok=await fn(t,!!force);
  if(my!==loadSeq||routeNow()!=='discover'||tab329()!==t)return false;
  await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
  settle329();observeHost329();schedulePrefetch329();return ok!==false;
 }catch(e){
  if(my===loadSeq){const h=host329();if(h)h.innerHTML='<div class="empty">Não foi possível carregar esta aba agora.</div>'}
  return false;
 }
}
async function prefetchSources329(){
 if(prefetching||routeNow()!=='discover'||type329()!=='all')return false;
 const src=testBridge?.source||R321()?.source;if(typeof src!=='function')return false;
 prefetching=true;
 try{
  for(const t of PUBLIC){
   if(routeNow()!=='discover')break;
   try{await src(t,false)}catch{}
   await new Promise(r=>setTimeout(r,45));
  }
  return true;
 }finally{prefetching=false}
}
function schedulePrefetch329(){
 clearTimeout(prefetchTimer);
 prefetchTimer=setTimeout(()=>{
  const run=()=>void prefetchSources329();
  if(typeof requestIdleCallback==='function')requestIdleCallback(run,{timeout:1200});else run();
 },180);
}
function renderCachedDiscover329(seq){
 const tab=tab329(),hit=domCache.get(cacheKey329(tab)),test=R319();
 if(!fresh329(hit)||!test?.shell319||typeof setApp!=='function'||typeof shell!=='function')return false;
 setApp(shell('Descobrir','Recomendações, Top 10, tendências, novidades, lançamentos e calendário.','discover',test.shell319()));
 if(seq!==navSeq||routeNow()!=='discover')return true;
 const h=host329();if(h)h.innerHTML=hit.html;
 syncShell329();observeHost329();requestAnimationFrame(()=>requestAnimationFrame(settle329));schedulePrefetch329();
 return true;
}
const baseRenderDiscover329=typeof renderDiscover==='function'?renderDiscover:null;
if(baseRenderDiscover329)renderDiscover=async function(seq){
 if(renderCachedDiscover329(seq))return true;
 const out=await baseRenderDiscover329.apply(this,arguments);
 setTimeout(()=>{if(routeNow()==='discover'){observeHost329();settle329();schedulePrefetch329()}},0);
 return out;
};

function early329(target){
 if(!target?.closest||routeNow()!=='discover')return false;
 const st=state329(),test=R319();if(!st||!test)return false;
 const tab=target.closest('[data-ct319-tab]');
 if(tab){st.filterOpen=false;void loadTab329(String(tab.dataset.ct319Tab||'foryou'));return true}
 const filter=target.closest('[data-ct319-filter]');
 if(filter){st.filterOpen=!st.filterOpen;syncShell329();return true}
 const fy=target.closest('[data-ct319-fy-kind]');
 if(fy){st.fyKind=String(fy.dataset.ct319FyKind||'all');st.filterOpen=true;syncShell329();applyForYouFilter329();compactForYou329(document);cacheCurrent329();return true}
 const ty=target.closest('[data-ct319-type]');
 if(ty){try{discover.type=String(ty.dataset.ct319Type||'all')}catch{}st.filterOpen=true;syncShell329();void loadTab329(tab329());return true}
 if(target.closest('[data-ct319-prev]')){q('[data-ct319-tabs]')?.scrollBy({left:-360,behavior:'smooth'});return true}
 if(target.closest('[data-ct319-next]')){q('[data-ct319-tabs]')?.scrollBy({left:360,behavior:'smooth'});return true}
 return false;
}
window.__ctR329EarlyHandle=early329;

window.addEventListener('cinetracker:data-changed',()=>{
 domCache.clear();if(routeNow()==='discover')setTimeout(()=>void loadTab329(tab329(),{force:true}),60);
});
setTimeout(()=>{if(routeNow()==='discover'){observeHost329();settle329();schedulePrefetch329()}},0);

const style=document.createElement('style');style.id='ct-web-r329';style.textContent=`
/* Pra voce: three compact cards grouped to the left instead of three stretched columns. */
[data-ct309-foryou] .ct309-fy-grid{display:grid!important;grid-template-columns:repeat(3,158px)!important;gap:12px!important;justify-content:start!important;align-items:start!important;width:max-content!important;max-width:100%!important}
[data-ct309-foryou] .ct309-slot{width:158px!important;min-width:158px!important;max-width:158px!important}
[data-ct309-foryou] .ct309-slot .ct288-card,[data-ct309-foryou] .ct309-daily-card,[data-ct309-foryou] .ct309-daily-card .ct288-card{width:158px!important;min-width:158px!important;max-width:158px!important}
[data-ct309-foryou] .ct309-actions{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:3px!important;width:158px!important;min-width:158px!important;max-width:158px!important;margin-top:5px!important}
[data-ct309-foryou] .ct309-actions>.chip{position:static!important;grid-column:auto!important;flex:none!important;width:100%!important;min-width:0!important;max-width:none!important;height:24px!important;min-height:24px!important;padding:2px!important;font-size:7.5px!important;line-height:1!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
[data-ct309-foryou] .ct309-actions>[data-ct309-swap]{grid-column:auto!important;width:100%!important}
.ct319-actions{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:4px!important;width:100%!important}
.ct319-actions>.chip{width:100%!important;min-width:0!important;white-space:nowrap!important}
@media(max-width:720px){
 [data-ct309-foryou] .ct309-fy-grid{display:flex!important;flex-flow:row nowrap!important;gap:10px!important;width:100%!important;overflow-x:auto!important}
 [data-ct309-foryou] .ct309-slot{flex:0 0 150px!important;width:150px!important;min-width:150px!important;max-width:150px!important}
 [data-ct309-foryou] .ct309-slot .ct288-card,[data-ct309-foryou] .ct309-daily-card,[data-ct309-foryou] .ct309-daily-card .ct288-card,[data-ct309-foryou] .ct309-actions{width:150px!important;min-width:150px!important;max-width:150px!important}
 [data-ct309-foryou] .ct309-actions>.chip{font-size:7px!important;padding:1px!important}
}
`;document.head.appendChild(style);

window.__ctR329={
 loadTab:loadTab329,cacheCurrent:cacheCurrent329,restore:restore329,prefetch:prefetchSources329,
 compactForYou:compactForYou329,applyForYouFilter:applyForYouFilter329,syncShell:syncShell329,
 version:'1.0.120',setTestBridge(v){testBridge=v&&typeof v==='object'?v:null},
 clearCache(){domCache.clear()},cacheSize(){return domCache.size}
};
window.__ctR329Test={loadTab329,cacheCurrent329,restore329,prefetchSources329,compactForYou329,applyForYouFilter329,syncShell329,renderCachedDiscover329,setTestBridge(v){testBridge=v&&typeof v==='object'?v:null},clearCache(){domCache.clear()},cacheSize(){return domCache.size}};
})();
