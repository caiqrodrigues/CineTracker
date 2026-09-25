/* CineTracker Web 1.0.157 r366 — authoritative Pra Voce action rows; Trocar never disappears. */
(()=>{
'use strict';
if(window.__ctR366?.version==='1.0.157')return;
window.__ctR366Marker='foryou-authoritative-action-rows+daily-swap-always-present+refill-on-demand';
window.__ctR366Scope='discover-foryou-buttons-only';
window.__ctR366Android='preserved-1.0.20-10062';

const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
let clicks=0,observer=null,host=null,testBridge=null;

function routeNow(){try{return String(typeof route==='function'?route():'')}catch{return''}}
function validKey(v){return /^(movie|tv):[1-9]\d*$/.test(String(v||''))?String(v):''}
function slotName(slot){return String(slot?.dataset?.ct336Slot||'')}
function bucketOf(name){return name==='daily'?'daily':String(name||'').split(':')[0]}
function cardKey(slot){
 return validKey(q('[data-ct288-card]',slot)?.dataset?.ct288Card)
  ||validKey(q('[data-media]',slot)?.dataset?.media)
  ||validKey(q('[data-ct336-media]',slot)?.dataset?.ct336Media);
}
function mk(label,action,name,key){
 const b=document.createElement('button');b.type='button';b.className='chip ct336-action';b.textContent=label;
 if(action==='swap')b.dataset.ct336SwapOnly=name;
 else{b.dataset.ct336Action=action;b.dataset.ct336Swap=name;if(key)b.dataset.ct336Media=key}
 return b;
}
function forceRow(slot){
 if(!slot)return false;
 const name=slotName(slot),bucket=bucketOf(name),key=cardKey(slot);
 if(!['daily','watch','fresh'].includes(bucket)||!name||!key)return false;
 let row=q(':scope > .ct336-actions',slot);if(!row){row=document.createElement('div');slot.appendChild(row)}
 const spec=bucket==='watch'
  ?[['✓ Visto','seen'],['↻ Trocar','swap']]
  :[['+ Watchlist','watchlist'],['✓ Visto','seen'],['↻ Trocar','swap']];
 row.className='ct336-actions '+(bucket==='watch'?'ct336-actions-two':'ct336-actions-three');
 row.dataset.ct336Bucket=bucket;
 const wanted=spec.map(([label,action])=>mk(label,action,name,key));
 const current=qa(':scope > button.ct336-action',row);
 const ok=current.length===wanted.length&&current.every((b,i)=>{
   const w=wanted[i];
   return String(b.textContent||'').trim()===String(w.textContent||'').trim()
    &&String(b.dataset.ct336Action||'')===String(w.dataset.ct336Action||'')
    &&String(b.dataset.ct336SwapOnly||'')===String(w.dataset.ct336SwapOnly||'')
    &&String(b.dataset.ct336Media||'')===String(w.dataset.ct336Media||'')
    &&String(b.dataset.ct336Swap||'')===String(w.dataset.ct336Swap||'');
 });
 if(!ok)row.replaceChildren(...wanted);
 for(const b of qa(':scope > button.ct336-action',row)){
  b.type='button';b.disabled=false;b.hidden=false;b.removeAttribute('hidden');b.removeAttribute('inert');b.removeAttribute('aria-disabled');
  b.style.setProperty('display','flex','important');b.style.setProperty('pointer-events','auto','important');b.style.setProperty('cursor','pointer','important');
 }
 row.hidden=false;row.removeAttribute('hidden');row.removeAttribute('inert');
 row.style.setProperty('display','grid','important');row.style.setProperty('pointer-events','auto','important');
 row.style.setProperty('grid-template-columns',bucket==='watch'?'repeat(2,minmax(0,1fr))':'repeat(3,minmax(0,1fr))','important');
 try{window.__ctR348?.styleRow?.(row,q('.ct288-poster,.ct288-empty-poster',slot),spec.length)}catch{}
 const sw=q(':scope > [data-ct336-swap-only]',row);
 if(sw){sw.disabled=false;sw.hidden=false;sw.removeAttribute('hidden');sw.style.setProperty('display','flex','important')}
 slot.dataset.ct366Actions=bucket+':'+spec.length;
 return true;
}
function forceAll(){
 const root=q('[data-ct336-foryou]');if(!root)return false;
 let n=0;for(const slot of qa('[data-ct336-slot]',root))if(forceRow(slot))n++;
 root.dataset.ct366Fixed=String(n);return n>0;
}
function repairSoon(){
 forceAll();queueMicrotask(forceAll);requestAnimationFrame(forceAll);setTimeout(forceAll,0);setTimeout(forceAll,80);
}
function meta(target){
 const btn=target?.closest?.('.ct336-actions button');if(!btn||routeNow()!=='discover')return null;
 const slot=btn.closest('[data-ct336-slot]');if(!slot||!slot.closest('[data-ct336-foryou]'))return null;
 const name=slotName(slot),key=cardKey(slot),label=String(btn.textContent||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 const action=btn.matches('[data-ct336-swap-only]')||label.includes('trocar')?'swap':
              btn.dataset.ct336Action==='watchlist'||label.includes('watchlist')?'watchlist':
              btn.dataset.ct336Action==='seen'||label.includes('visto')?'seen':'';
 if(!name||!action||(!key&&action!=='swap'))return null;
 if(action==='watchlist'&&bucketOf(name)==='watch')return null;
 return{btn,slot,name,key,action};
}
async function swapWithRefill(m){
 if(testBridge?.swap)return !!(await testBridge.swap(m));
 const direct=window.__ctR363?.handle;
 if(typeof direct==='function')return !!direct(m);
 return !!window.__ctR365?.handle?.(m);
}
function handle(m){
 if(!m)return false;
 if(m.action==='swap'){
  void Promise.resolve(swapWithRefill(m)).finally(()=>repairSoon());
  clicks++;return true;
 }
 const ok=!!window.__ctR365?.handle?.(m);
 if(ok){clicks++;repairSoon()}
 return ok;
}
function early(target,event){
 const m=meta(target);if(!m)return false;
 const ok=handle(m);if(!ok)return false;
 event?.preventDefault?.();event?.stopImmediatePropagation?.();event?.stopPropagation?.();
 document.documentElement.dataset.ct366LastAction=m.action+':'+m.name+':'+(m.key||'');
 document.documentElement.dataset.ct366Clicks=String(clicks);
 return true;
}
function wrapRenderers(){
 const fy=window.__ctR336;
 if(fy&&typeof fy.paintForYou==='function'&&!fy.paintForYou.__ctR366){
  const base=fy.paintForYou;fy.paintForYou=function(){const out=base.apply(this,arguments);repairSoon();return out};fy.paintForYou.__ctR366=true;
 }
 const r359=window.__ctR359;
 if(r359&&typeof r359.renderSlot==='function'&&!r359.renderSlot.__ctR366){
  const base=r359.renderSlot;r359.renderSlot=function(name){const out=base.apply(this,arguments);queueMicrotask(()=>forceRow(q('[data-ct336-slot="'+CSS.escape(String(name||''))+'"]')));return out};r359.renderSlot.__ctR366=true;
 }
}
function bind(){
 const h=q('[data-ct319-content]')||q('[data-ct336-foryou]');if(!h||h===host)return false;
 observer?.disconnect?.();host=h;observer=new MutationObserver(ms=>{if(ms.some(x=>x.addedNodes.length||x.removedNodes.length))repairSoon()});
 observer.observe(h,{subtree:true,childList:true});return true;
}
window.__ctR358Early=early;window.__ctR359Early=early;window.__ctR336EarlyHandle=early;
if(window.__ctR360)window.__ctR360.early=early;if(window.__ctR361)window.__ctR361.early=early;if(window.__ctR362)window.__ctR362.early=early;
wrapRenderers();setTimeout(()=>{wrapRenderers();forceAll();bind()},0);setTimeout(()=>{wrapRenderers();forceAll();bind()},250);
window.__ctR366={version:'1.0.157',early,handle,meta,forceRow,forceAll,wrapRenderers,bind,setTestBridge(v){testBridge=v&&typeof v==='object'?v:null},get clicks(){return clicks}};
window.__ctR366Test={meta,forceRow,forceAll,setTestBridge(v){testBridge=v&&typeof v==='object'?v:null}};
})();