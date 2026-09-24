/* CineTracker Web 1.0.153 r362 — harden real Pra Você click owner against stale route/state metadata. */
(()=>{
'use strict';
if(window.__ctR362?.version==='1.0.153')return;
window.__ctR362Marker='foryou-real-click-owner+dom-key-fallback+clicked-slot-only';
window.__ctR362Scope='discover-foryou-actions-only';
window.__ctR362Android='preserved-1.0.20-10062';

const q=(s,r=document)=>r?.querySelector?.(s)||null;
const validKey=v=>/^(movie|tv):\d+$/.test(String(v||''))?String(v):'';

function itemKeyFromState(name){
 const st=window.__ctR309Test?.state;if(!st)return'';
 let x=null;
 if(name==='daily'){
  const p=Array.isArray(st.dailyPool)?st.dailyPool:[],i=Math.max(0,Math.min(Number(st.dailyIndex||0),Math.max(0,p.length-1)));x=p[i]||null;
 }else{
  const [b,k]=String(name||'').split(':');const p=Array.isArray(st?.[b+'Pools']?.[k])?st[b+'Pools'][k]:[];
  const i=Math.max(0,Math.min(Number(st?.[b+'Index']?.[k]||0),Math.max(0,p.length-1)));x=p[i]||null;
 }
 if(!x)return'';
 const t=String(x?.media_type||x?.type||x?.raw_tmdb?.media_type||'tv')==='movie'?'movie':'tv';
 const id=Number(x?.tmdb_id||x?.source_tmdb_id||x?.id||x?.raw_tmdb?.id||0);
 return id>0?t+':'+id:'';
}
function visibleKey(slot,btn){
 return validKey(q('[data-ct288-card]',slot)?.dataset?.ct288Card)
  ||validKey(q('[data-media]',slot)?.dataset?.media)
  ||validKey(btn?.dataset?.ct336Media)
  ||itemKeyFromState(String(slot?.dataset?.ct336Slot||''));
}
function actionOf(btn){
 const label=String(btn?.textContent||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 if(btn?.matches?.('[data-ct336-swap-only]')||label.includes('trocar'))return'swap';
 if(btn?.dataset?.ct336Action==='watchlist'||label.includes('watchlist'))return'watchlist';
 if(btn?.dataset?.ct336Action==='seen'||label.includes('visto'))return'seen';
 return'';
}
function arm(btn,slot,name,key,action){
 btn?.removeAttribute?.('inert');slot?.removeAttribute?.('inert');
 if(btn){btn.disabled=false;btn.removeAttribute('disabled');btn.removeAttribute('aria-disabled');btn.style.setProperty('pointer-events','auto','important');btn.style.setProperty('cursor','pointer','important')}
 if(action==='swap')btn.dataset.ct336SwapOnly=name;
 else if(btn){btn.dataset.ct336Action=action;btn.dataset.ct336Swap=name;if(key)btn.dataset.ct336Media=key}
 const row=btn?.closest?.('.ct336-actions');if(row){row.removeAttribute('inert');row.style.setProperty('pointer-events','auto','important');row.style.setProperty('z-index','80','important')}
}
function meta(target){
 if(!target?.closest)return null;
 const root=target.closest('[data-ct336-foryou]');if(!root)return null;
 const btn=target.closest('button.ct336-action,.ct336-actions button');if(!btn)return null;
 const slot=btn.closest('[data-ct336-slot]');if(!slot)return null;
 const name=String(slot.dataset.ct336Slot||'');if(!name)return null;
 const action=actionOf(btn);if(!action)return null;
 const key=visibleKey(slot,btn);
 if(action!=='swap'&&!key)return null;
 arm(btn,slot,name,key,action);
 try{if(key)window.__ctR360?.syncVisible?.(name,key)}catch{}
 return{btn,slot,name,key,action};
}
function handle(m){
 if(!m)return false;
 let ok=false;
 try{ok=!!window.__ctR360?.handle?.(m)}catch{}
 if(!ok)try{ok=!!window.__ctR359?.handleAction?.(m)}catch{}
 if(!ok&&m.action==='swap')try{ok=!!window.__ctR336?.swapForYou?.(m.name)}catch{}
 if(!ok&&m.action!=='swap'&&m.key){
  try{
   m.btn.dataset.ct336Action=m.action;m.btn.dataset.ct336Media=m.key;m.btn.dataset.ct336Swap=m.name;
   const out=window.__ctR336?.persistForYou?.(m.btn);
   ok=!!out||out instanceof Promise;
  }catch{}
 }
 if(ok){
  queueMicrotask(()=>{
   try{window.__ctR361?.armSlot?.(q('[data-ct336-foryou] [data-ct336-slot="'+CSS.escape(m.name)+'"]'))}catch{}
   try{window.__ctR349?.compact?.()}catch{}
  });
 }
 return ok;
}
function early(target,event){
 const m=meta(target);if(!m)return false;
 const ok=handle(m);
 if(ok){
  event?.preventDefault?.();event?.stopImmediatePropagation?.();event?.stopPropagation?.();
  document.documentElement.dataset.ct362LastAction=m.action+':'+m.name+':'+(m.key||'');
 }
 return ok;
}

/* The physically-first listener in the bundle resolves these pointers. Keep every historical alias on one owner. */
window.__ctR358Early=early;
window.__ctR359Early=early;
window.__ctR336EarlyHandle=early;
if(window.__ctR360)window.__ctR360.early=early;
if(window.__ctR361)window.__ctR361.early=early;

function armAll(){
 const root=q('[data-ct336-foryou]');if(!root)return false;
 let n=0;for(const btn of root.querySelectorAll('.ct336-actions button')){
  const slot=btn.closest('[data-ct336-slot]'),name=String(slot?.dataset?.ct336Slot||''),action=actionOf(btn),key=visibleKey(slot,btn);
  if(slot&&name&&action){arm(btn,slot,name,key,action);n++}
 }
 root.dataset.ct362Armed=String(n);return n>0;
}
let mo=null,host=null;
function bind(){
 const h=q('[data-ct319-content]');if(!h||h===host)return false;
 mo?.disconnect?.();host=h;
 mo=new MutationObserver(ms=>{if(ms.some(x=>x.addedNodes.length||x.removedNodes.length))queueMicrotask(armAll)});
 mo.observe(h,{subtree:true,childList:true});return true;
}
setTimeout(()=>{armAll();bind()},0);

const style=document.createElement('style');style.id='ct-web-r362';style.textContent=`
[data-ct336-foryou] .ct336-actions,[data-ct336-foryou] .ct336-actions>button{pointer-events:auto!important}
[data-ct336-foryou] .ct336-actions{z-index:80!important}
[data-ct336-foryou] .ct336-actions>button{cursor:pointer!important}
`;document.head.appendChild(style);

window.__ctR362={version:'1.0.153',early,handle,meta,armAll,bind,visibleKey};
window.__ctR362Test={early,handle,meta,armAll,visibleKey,itemKeyFromState};
})();