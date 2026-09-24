/* CineTracker Web 1.0.152 r361 — re-arm Pra Você actions after every same-slot repaint. */
(()=>{
'use strict';
if(window.__ctR361?.version==='1.0.152')return;
window.__ctR361Marker='foryou-rearm-after-every-repaint+repeat-click-live';
window.__ctR361Scope='discover-foryou-actions-only';
window.__ctR361Android='preserved-1.0.20-10062';

const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const rows=v=>Array.isArray(v)?v:[];
const validKey=v=>/^(movie|tv):\d+$/.test(String(v||''))?String(v):'';
let mo=null,host=null;

function routeNow(){try{return String(typeof route==='function'?route():'')}catch{return''}}
function slotByName(name){try{return q('[data-ct336-foryou] [data-ct336-slot="'+CSS.escape(String(name||''))+'"]')}catch{return null}}
function visibleKey(slot){return validKey(q('[data-ct288-card]',slot)?.dataset?.ct288Card)||validKey(q('[data-media]',slot)?.dataset?.media)}
function poolSize(name){
 const st=window.__ctR309Test?.state;if(!st)return 0;
 if(name==='daily')return rows(st.dailyPool).length;
 const [bucket,kind]=String(name||'').split(':');
 if(!['watch','fresh'].includes(bucket)||!['movie','series','anime'].includes(kind))return 0;
 return rows(st?.[bucket+'Pools']?.[kind]).length;
}
function armSlot(slot){
 if(!slot)return false;
 const name=String(slot.dataset.ct336Slot||'');if(!name)return false;
 const key=visibleKey(slot);
 try{if(key)window.__ctR360?.syncVisible?.(name,key)}catch{}
 slot.removeAttribute('inert');
 const row=q(':scope > .ct336-actions',slot);if(!row)return false;
 row.removeAttribute('inert');
 row.style.setProperty('position','relative','important');
 row.style.setProperty('z-index','50','important');
 row.style.setProperty('pointer-events','auto','important');
 const canSwap=poolSize(name)>1;
 for(const btn of qa(':scope > button',row)){
  btn.removeAttribute('inert');
  btn.style.setProperty('pointer-events','auto','important');
  btn.style.setProperty('cursor','pointer','important');
  const label=String(btn.textContent||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  const swap=btn.matches('[data-ct336-swap-only]')||label.includes('trocar');
  const watch=btn.dataset.ct336Action==='watchlist'||label.includes('watchlist');
  const seen=btn.dataset.ct336Action==='seen'||label.includes('visto');
  if(swap){
   btn.dataset.ct336SwapOnly=name;
   btn.disabled=!canSwap;
  }else if(watch||seen){
   btn.dataset.ct336Action=watch?'watchlist':'seen';
   btn.dataset.ct336Swap=name;
   if(key)btn.dataset.ct336Media=key;
   btn.disabled=false;
  }
  if(btn.disabled)btn.setAttribute('aria-disabled','true');else btn.removeAttribute('aria-disabled');
 }
 slot.dataset.ct361Armed=String(Date.now());
 return true;
}
function armAll(){
 const root=q('[data-ct336-foryou]');if(!root)return false;
 let n=0;for(const slot of qa('[data-ct336-slot]',root))if(armSlot(slot))n++;
 root.dataset.ct361Armed=String(n);return n>0;
}
function meta(target){
 if(!target?.closest||routeNow()!=='discover'||!target.closest('[data-ct336-foryou]'))return null;
 const btn=target.closest('button.ct336-action,.ct336-actions button');if(!btn)return null;
 const slot=btn.closest('[data-ct336-slot]');if(!slot)return null;
 armSlot(slot);
 const name=String(slot.dataset.ct336Slot||''),key=visibleKey(slot);
 const label=String(btn.textContent||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 const action=(btn.matches('[data-ct336-swap-only]')||label.includes('trocar'))?'swap':
              (btn.dataset.ct336Action==='watchlist'||label.includes('watchlist'))?'watchlist':
              (btn.dataset.ct336Action==='seen'||label.includes('visto'))?'seen':'';
 if(!action)return null;
 if(action==='swap'){
  if(poolSize(name)<2)return null;
  btn.disabled=false;btn.removeAttribute('aria-disabled');btn.dataset.ct336SwapOnly=name;
 }else{
  if(!key)return null;
  btn.disabled=false;btn.removeAttribute('aria-disabled');btn.dataset.ct336Action=action;btn.dataset.ct336Media=key;btn.dataset.ct336Swap=name;
 }
 return{btn,slot,name,key,action};
}
function rearmAfter(name){
 queueMicrotask(()=>armSlot(slotByName(name)));
 requestAnimationFrame(()=>armSlot(slotByName(name)));
 setTimeout(()=>armSlot(slotByName(name)),90);
}
function handle(m){
 if(!m)return false;
 let ok=false;
 try{ok=!!window.__ctR360?.handle?.(m)}catch{}
 if(!ok&&m.key){
  try{window.__ctR360?.syncVisible?.(m.name,m.key)}catch{}
  try{ok=!!window.__ctR360?.handle?.(m)}catch{}
 }
 if(ok)rearmAfter(m.name);
 return ok;
}
function early(target,event){
 const m=meta(target);if(!m)return false;
 const ok=handle(m);
 if(ok){event?.preventDefault?.();event?.stopImmediatePropagation?.();event?.stopPropagation?.()}
 return ok;
}

/* r358's physical-first capture resolves window.__ctR359Early on every click. */
window.__ctR359Early=early;
if(window.__ctR360)window.__ctR360.early=early;

if(window.__ctR359?.renderSlot&&!window.__ctR359.renderSlot.__ctR361Wrapped){
 const base=window.__ctR359.renderSlot;
 const wrapped=function(name){
  const out=base.apply(this,arguments);
  armSlot(slotByName(name));
  rearmAfter(name);
  return out;
 };
 wrapped.__ctR361Wrapped=true;wrapped.__ctR361Base=base;window.__ctR359.renderSlot=wrapped;
}
function bind(){
 const h=q('[data-ct319-content]');if(!h||h===host)return false;
 mo?.disconnect?.();host=h;
 mo=new MutationObserver(ms=>{if(ms.some(x=>x.addedNodes.length||x.removedNodes.length))queueMicrotask(armAll)});
 mo.observe(h,{subtree:true,childList:true});return true;
}

const style=document.createElement('style');style.id='ct-web-r361';style.textContent=`
[data-ct336-foryou] .ct336-actions{position:relative!important;z-index:50!important;pointer-events:auto!important}
[data-ct336-foryou] .ct336-actions>button{pointer-events:auto!important;cursor:pointer!important}
`;document.head.appendChild(style);

setTimeout(()=>{armAll();bind()},0);
window.__ctR361={version:'1.0.152',early,handle,meta,armSlot,armAll,poolSize,bind};
window.__ctR361Test={early,handle,meta,armSlot,armAll,poolSize};
})();