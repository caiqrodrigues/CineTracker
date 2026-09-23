/* CineTracker Web 1.0.140 r349 — Pra Você actions work + compact cards + heart inside poster. */
(()=>{
'use strict';
if(window.__ctR349?.version==='1.0.140')return;
window.__ctR349Marker='foryou-actions-live+compact-cards+heart-inside-poster';
window.__ctR349Scope='discover-foryou-only';
window.__ctR349Android='preserved-1.0.20-10062';

const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const imp=(el,k,v)=>el?.style?.setProperty?.(k,v,'important');
let mo=null,host=null;

function slotByName349(name){
 return q('[data-ct336-foryou] [data-ct336-slot="'+CSS.escape(String(name||''))+'"]');
}
function animateIn349(name){
 queueMicrotask(()=>{
  try{window.__ctR348?.fixAll?.()}catch{}
  compact349();
  const slot=slotByName349(name);if(!slot)return;
  slot.classList.remove('ct349-enter');void slot.offsetWidth;slot.classList.add('ct349-enter');
  setTimeout(()=>slot.classList.remove('ct349-enter'),180);
 });
}
function compact349(){
 const root=q('[data-ct336-foryou]');if(!root)return false;
 for(const rail of qa('.ct336-rail,.ct336-daily-inner',root)){
  imp(rail,'gap','6px');imp(rail,'column-gap','6px');imp(rail,'row-gap','0');
 }
 for(const slot of qa('.ct336-slot',root)){
  const poster=q('.ct288-poster,.ct288-empty-poster',slot),pr=poster?.getBoundingClientRect?.();
  if(pr&&pr.width>40){
   const w=Math.round(pr.width*1000)/1000+'px';
   imp(slot,'flex','0 0 '+w);imp(slot,'flex-basis',w);imp(slot,'width',w);imp(slot,'min-width',w);imp(slot,'max-width',w);
   const wrap=q('.ct336-cardwrap',slot);if(wrap){imp(wrap,'width',w);imp(wrap,'min-width',w);imp(wrap,'max-width',w)}
  }
  const state=q('.ct288-state',slot);
  if(state){
   imp(state,'position','absolute');imp(state,'top','8px');imp(state,'right','8px');imp(state,'bottom','auto');imp(state,'left','auto');
   imp(state,'z-index','6');imp(state,'margin','0');
  }
 }
 return true;
}

/* The earliest global click capture calls this variable. Own only Pra Você actions; delegate everything else. */
const previousEarly349=window.__ctR336EarlyHandle;
function earlyHandle349(target,event){
 if(!target?.closest)return typeof previousEarly349==='function'?previousEarly349(target,event):false;
 const root=target.closest('[data-ct336-foryou]');
 if(root){
  const swap=target.closest('[data-ct336-swap-only]');
  if(swap){
   if(swap.disabled)return true;
   const name=String(swap.dataset.ct336SwapOnly||'');
   const ok=window.__ctR336?.swapForYou?.(name);
   if(ok)animateIn349(name);
   return true;
  }
  const action=target.closest('[data-ct336-action]');
  if(action){
   if(action.disabled)return true;
   const name=String(action.dataset.ct336Swap||action.closest('[data-ct336-slot]')?.dataset?.ct336Slot||'');
   /* persistForYou rotates the recommendation synchronously before awaiting backend persistence. */
   let result=false;
   try{result=window.__ctR336?.persistForYou?.(action)}catch(e){try{toast(e?.message||String(e))}catch{}}
   animateIn349(name);
   Promise.resolve(result).then(ok=>{
    if(ok===false)return;
    try{window.__ctR348?.fixAll?.()}catch{}
    compact349();
   }).catch(()=>{});
   return true;
  }
 }
 return typeof previousEarly349==='function'?previousEarly349(target,event):false;
}
window.__ctR336EarlyHandle=earlyHandle349;

function settle349(){
 try{window.__ctR348?.fixAll?.()}catch{}
 compact349();
}
function bind349(){
 const h=q('[data-ct319-content]');if(!h||h===host)return false;
 mo?.disconnect?.();host=h;
 mo=new MutationObserver(ms=>{if(ms.some(m=>m.addedNodes.length||m.removedNodes.length))queueMicrotask(settle349)});
 mo.observe(h,{subtree:true,childList:true});return true;
}
const basePaint349=window.__ctR336?.paintForYou;
if(typeof basePaint349==='function'&&!basePaint349.__ctR349Wrapped){
 const wrapped=function(){const out=basePaint349.apply(this,arguments);queueMicrotask(()=>{settle349();bind349()});return out};
 wrapped.__ctR349Wrapped=true;wrapped.__ctR349Base=basePaint349;window.__ctR336.paintForYou=wrapped;
}

const style=document.createElement('style');style.id='ct-web-r349';style.textContent=`
[data-ct336-foryou] .ct336-rail,[data-ct336-foryou] .ct336-daily-inner{gap:6px!important;column-gap:6px!important}
[data-ct336-foryou] .ct288-card{position:relative!important}
[data-ct336-foryou] .ct288-state{
 position:absolute!important;top:8px!important;right:8px!important;bottom:auto!important;left:auto!important;z-index:6!important;margin:0!important
}
[data-ct336-foryou] .ct336-slot.ct349-enter{animation:ct349-enter .14s ease-out both!important}
@keyframes ct349-enter{from{opacity:.58;transform:translateY(2px)}to{opacity:1;transform:none}}
`;document.head.appendChild(style);

setTimeout(()=>{settle349();bind349()},0);
window.__ctR349={version:'1.0.140',compact:compact349,earlyHandle:earlyHandle349,animateIn:animateIn349,bind:bind349};
window.__ctR349Test={compact349,earlyHandle349,animateIn349};
})();