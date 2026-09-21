/* CineTracker Web 1.0.121 r330 — navigation recovery + ForYou action ownership + r274 Home history contract. */
(()=>{
'use strict';
if(window.__ctR330?.version==='1.0.121')return;
window.__ctR330Marker='home-r274-scroll+discover-demand-only+foryou-actions-owned';
window.__ctR330Home='preloaded-internal-scroll+oldest-top+newest-bottom+no-toggle';
window.__ctR330Discover='demand-only-tabs+rebuild-actions+visible-local-filters';
window.__ctR330Android='preserved-1.0.20-10062';

const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const routeNow=()=>{try{return String(typeof route==='function'?route():'')}catch{return''}};
const validKey=k=>/^(movie|tv):[1-9]\d*$/.test(String(k||''));
let homeObserver=null,discoverObserver=null,settleTimer=0;

function imp(el,p,v){try{el?.style?.setProperty(p,v,'important')}catch{}}

/* HOME: exact r274/r326 interaction — loaded in DOM, nested scroll, newest at bottom. */
function normalizeHomeHistory330(){
 if(routeNow()!=='home')return false;
 const root=q('[data-home]');if(!root)return false;
 let found=false;
 for(const sec of qa('[data-ct274-history]',root)){
  found=true;
  sec.classList.remove('is-collapsed','is-open','ct324-history-collapsed','ct324-history-open');
  sec.classList.add('ct330-history-scroll');
  sec.removeAttribute('data-ct324-history');
  for(const b of qa('[data-ct275-history-toggle],[data-ct324-history-toggle],[data-ct326-history-toggle],[data-ct327-history-toggle]',sec))b.remove();
  imp(sec,'display','block');imp(sec,'max-height','none');imp(sec,'height','auto');imp(sec,'overflow','visible');
  const shell=q('.ct275-history-shell',sec);
  if(shell){
   shell.setAttribute('aria-hidden','false');
   imp(shell,'display','block');imp(shell,'grid-template-rows','none');imp(shell,'max-height','none');
   imp(shell,'height','auto');imp(shell,'min-height','0');imp(shell,'overflow','visible');
   imp(shell,'opacity','1');imp(shell,'transform','none');imp(shell,'pointer-events','auto');imp(shell,'transition','none');
  }
  const stack=q('.ct274-history-stack',sec);
  if(stack){
   stack.setAttribute('aria-hidden','false');
   imp(stack,'display','block');imp(stack,'height','auto');imp(stack,'min-height','0');
   imp(stack,'max-height','min(55vh,520px)');imp(stack,'overflow-x','hidden');imp(stack,'overflow-y','auto');
   imp(stack,'overscroll-behavior','contain');imp(stack,'scrollbar-gutter','stable');imp(stack,'padding-right','3px');
   if(stack.dataset.ct330Bottom!=='1'){
    stack.dataset.ct330Bottom='1';
    requestAnimationFrame(()=>{try{stack.scrollTop=stack.scrollHeight}catch{}});
   }
  }
 }
 return found;
}
window.__ctR330NormalizeHomeHistory=normalizeHomeHistory330;

function observeHome330(){
 try{homeObserver?.disconnect?.()}catch{}
 const app=q('#app');if(!app||!window.MutationObserver)return false;
 homeObserver=new MutationObserver(muts=>{
  if(routeNow()!=='home')return;
  const relevant=muts.some(m=>[...m.addedNodes].some(n=>n.nodeType===1&&(n.matches?.('[data-home],[data-ct274-history],.ct274-history-stack')||n.querySelector?.('[data-home],[data-ct274-history],.ct274-history-stack'))));
  if(relevant)queueMicrotask(normalizeHomeHistory330);
 });
 homeObserver.observe(app,{subtree:true,childList:true});return true;
}
document.addEventListener('click',e=>{if(e.target?.closest?.('[data-home-tab]'))setTimeout(normalizeHomeHistory330,0)},true);

/* PRA VOCE: one owner guarantees actions exist after every render/cache restore. */
function mediaKey330(container){
 const card=q('[data-ct288-card]',container);
 const raw=String(card?.dataset?.ct288Card||q('[data-media]',container)?.getAttribute('data-media')||'');
 return validKey(raw)?raw:'';
}
function actionMarkup330(key,{saved=false,swap=''}={}){
 if(!validKey(key))return'';
 return '<button type="button" class="chip ct309-action ct309-watch'+(saved?' active':'')+'" data-ct309-action="watchlist" data-media="'+key+'" '+(saved?'disabled aria-label="Na Watchlist"':'aria-label="Adicionar à Watchlist"')+'>'+(saved?'✓ Watchlist':'+ Watchlist')+'</button>'+
  '<button type="button" class="chip ct309-action ct309-seen" data-ct309-action="seen" data-media="'+key+'" aria-label="Marcar como visto">✓ Visto</button>'+
  (swap?'<button type="button" class="chip ct309-swap ct330-swap" data-ct309-swap="'+swap+'">↻ Trocar</button>':'');
}
function ensureActionContainer330(container,{saved=false,swap=''}={}){
 if(!container)return false;
 const key=mediaKey330(container);if(!key)return false;
 let row=q(':scope > .ct309-actions',container);
 const need=swap?3:2;
 if(!row){row=document.createElement('div');row.className='ct309-actions ct330-actions';container.appendChild(row)}
 const actions=qa(':scope > [data-ct309-action],:scope > [data-ct309-swap]',row);
 const bad=actions.length!==need||!q('[data-ct309-action="watchlist"][data-media="'+key+'"]',row)||!q('[data-ct309-action="seen"][data-media="'+key+'"]',row)||(swap&&!q('[data-ct309-swap="'+swap+'"]',row));
 if(bad)row.innerHTML=actionMarkup330(key,{saved,swap});
 row.classList.add('ct330-actions');
 imp(row,'display','grid');imp(row,'grid-template-columns','repeat('+need+',minmax(0,1fr))');imp(row,'gap','3px');
 imp(row,'width','100%');imp(row,'min-width','0');imp(row,'max-width','100%');imp(row,'margin-top','5px');imp(row,'align-items','center');
 for(const b of qa('.chip',row)){
  imp(b,'position','static');imp(b,'grid-column','auto');imp(b,'width','100%');imp(b,'min-width','0');imp(b,'max-width','none');
  imp(b,'height','25px');imp(b,'min-height','25px');imp(b,'padding','2px 3px');imp(b,'font-size','8px');
  imp(b,'line-height','1');imp(b,'white-space','nowrap');imp(b,'overflow','hidden');imp(b,'text-overflow','ellipsis');
 }
 return true;
}
function ensureForYouActions330(root=document){
 const fy=q('[data-ct309-foryou]',root)||q('[data-ct309-foryou]');if(!fy)return false;
 const host=fy.closest('[data-ct319-content],[data-ct315-content],[data-ct263-discover-content]');
 for(const attr of ['data-ct310-owned','data-ct311-owned','data-ct315-owned','data-ct318-owned'])host?.removeAttribute(attr);
 for(const daily of qa('.ct309-daily-card',fy))ensureActionContainer330(daily,{saved:false,swap:'daily'});
 for(const slot of qa('[data-ct309-slot]',fy)){
  const spec=String(slot.dataset.ct309Slot||''),saved=spec.startsWith('watch:');
  ensureActionContainer330(slot,{saved,swap:spec});
 }
 return true;
}
window.__ctR330EnsureForYouActions=ensureForYouActions330;

function ensureForYouFilters330(){
 const test=window.__ctR319Test,st=test?.state,root=q('[data-ct319-discover]');if(!test||!st||!root)return false;
 let tab='';try{tab=String(discover?.tab||'')}catch{}
 if(tab!=='foryou')return false;
 const btn=q('[data-ct319-filter]',root),types=q('[data-ct319-types]',root);
 if(btn){btn.hidden=false;btn.setAttribute('aria-expanded','true')}
 if(types){
  types.innerHTML=test.filterMarkup319?.()||'';
  types.hidden=false;types.classList.add('open');
  imp(types,'display','flex');imp(types,'flex-flow','row nowrap');imp(types,'gap','5px');imp(types,'overflow-x','auto');
 }
 st.filterOpen=true;
 try{window.__ctR329?.applyForYouFilter?.()}catch{}
 return true;
}
function settleDiscover330(){
 if(routeNow()!=='discover')return false;
 ensureForYouActions330(document);
 ensureForYouFilters330();
 try{window.__ctR329?.compactForYou?.(document)}catch{}
 return true;
}
function scheduleSettle330(){
 clearTimeout(settleTimer);settleTimer=setTimeout(()=>requestAnimationFrame(settleDiscover330),0);
}
function observeDiscover330(){
 try{discoverObserver?.disconnect?.()}catch{}
 const h=q('[data-ct319-content]')||q('[data-ct315-content]')||q('[data-ct263-discover-content]');
 if(!h||!window.MutationObserver)return false;
 discoverObserver=new MutationObserver(muts=>{
  if(routeNow()!=='discover')return;
  const relevant=muts.some(m=>
    [...m.addedNodes].some(n=>n.nodeType===1&&(n.matches?.('[data-ct309-foryou],.ct309-slot,.ct309-daily-card,.ct309-actions')||n.querySelector?.('[data-ct309-foryou],.ct309-slot,.ct309-daily-card,.ct309-actions')))||
    [...m.removedNodes].some(n=>n.nodeType===1&&(n.matches?.('.ct309-actions')||n.querySelector?.('.ct309-actions')))
  );
  if(relevant)scheduleSettle330();
 });
 discoverObserver.observe(h,{subtree:true,childList:true});return true;
}

/* Drop stale r329 DOM snapshots captured before the action-owner fix. */
try{window.__ctR329?.clearCache?.()}catch{}
window.addEventListener('cinetracker:data-changed',()=>{if(routeNow()==='discover')scheduleSettle330();if(routeNow()==='home')setTimeout(normalizeHomeHistory330,0)});
setTimeout(()=>{
 if(routeNow()==='home'){normalizeHomeHistory330();observeHome330()}
 if(routeNow()==='discover'){settleDiscover330();observeDiscover330()}
},0);

const style=document.createElement('style');style.id='ct-web-r330';style.textContent=`
/* r274 Home contract: nested history scroll, no button, newest initially at bottom. */
[data-home] [data-ct275-history-toggle],[data-home] [data-ct324-history-toggle],[data-home] [data-ct326-history-toggle],[data-home] [data-ct327-history-toggle]{display:none!important}
[data-home] [data-ct274-history],[data-home] [data-ct274-history].is-collapsed,[data-home] [data-ct274-history].is-open{display:block!important;max-height:none!important;height:auto!important;overflow:visible!important}
[data-home] [data-ct274-history] .ct275-history-shell{display:block!important;grid-template-rows:none!important;max-height:none!important;height:auto!important;overflow:visible!important;opacity:1!important;transform:none!important;pointer-events:auto!important}
[data-home] [data-ct274-history] .ct274-history-stack{display:block!important;height:auto!important;min-height:0!important;max-height:min(55vh,520px)!important;overflow-x:hidden!important;overflow-y:auto!important;overscroll-behavior:contain!important;scrollbar-gutter:stable!important;padding-right:3px!important}

/* Pra voce is always action-complete and never wraps action buttons. */
[data-ct309-foryou] .ct309-actions{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:3px!important;width:100%!important;min-width:0!important;max-width:100%!important}
[data-ct309-foryou] .ct309-actions>.chip{position:static!important;grid-column:auto!important;width:100%!important;min-width:0!important;height:25px!important;min-height:25px!important;padding:2px 3px!important;font-size:8px!important;line-height:1!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
[data-ct309-foryou] .ct309-actions>[data-ct309-swap]{grid-column:auto!important;width:100%!important}
[data-ct319-discover] .ct319-types{flex-flow:row nowrap!important;overflow-x:auto!important}
`;document.head.appendChild(style);

window.__ctR330={
 normalizeHomeHistory:normalizeHomeHistory330,ensureForYouActions:ensureForYouActions330,
 ensureForYouFilters:ensureForYouFilters330,settleDiscover:settleDiscover330,
 version:'1.0.121'
};
window.__ctR330Test={normalizeHomeHistory330,ensureForYouActions330,ensureForYouFilters330,settleDiscover330,mediaKey330,actionMarkup330};
})();
