/* CineTracker Web 1.0.158 r367 — single final owner for Descobrir > Pra voce actions. */
(()=>{
'use strict';
if(window.__ctR367?.version==='1.0.158')return;
window.__ctR367Marker='foryou-single-final-owner+state-derived-buttons+clicked-slot-only';
window.__ctR367Scope='discover-foryou-actions-only';

const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const rows=v=>Array.isArray(v)?v:[];
const routeNow=()=>{try{return String(typeof route==='function'?route():'')}catch{return''}};
const normIndex=(i,n)=>n?((Number(i||0)%n)+n)%n:0;
const keyOf=x=>{const t=String(x?.media_type||x?.type||'tv')==='movie'?'movie':'tv';const id=Number(x?.tmdb_id||x?.source_tmdb_id||x?.id||x?.raw_tmdb?.id||0);return id>0?t+':'+id:''};

function itemFor(name){
 const st=window.__ctR309Test?.state;if(!st)return null;
 if(name==='daily'){const p=rows(st.dailyPool);return p.length?p[normIndex(st.dailyIndex,p.length)]:null}
 const [bucket,kind]=String(name||'').split(':');
 if(!['watch','fresh'].includes(bucket)||!['movie','series','anime'].includes(kind))return null;
 const p=rows(st?.[bucket+'Pools']?.[kind]),i=st?.[bucket+'Index']?.[kind];
 return p.length?p[normIndex(i,p.length)]:null;
}
function slotByName(name){try{return q('[data-ct336-foryou] [data-ct336-slot="'+CSS.escape(String(name||''))+'"]')}catch{return null}}
function specFor(name){
 const bucket=name==='daily'?'daily':String(name||'').split(':')[0];
 return bucket==='watch'?[['✓ Visto','seen'],['↻ Trocar','swap']]:[['+ Watchlist','watchlist'],['✓ Visto','seen'],['↻ Trocar','swap']];
}
function button(label,action,name,key){
 const b=document.createElement('button');b.type='button';b.className='chip ct336-action';b.textContent=label;
 if(action==='swap')b.dataset.ct336SwapOnly=name;
 else{b.dataset.ct336Action=action;b.dataset.ct336Swap=name;b.dataset.ct336Media=key}
 return b;
}
function ensureSlot(slot){
 if(!slot)return false;
 const name=String(slot.dataset.ct336Slot||''),item=itemFor(name),key=keyOf(item);
 if(!name||!item||!key)return false;
 const spec=specFor(name),bucket=name==='daily'?'daily':name.split(':')[0];
 let row=q(':scope > .ct336-actions',slot);if(!row){row=document.createElement('div');slot.appendChild(row)}
 const valid=qa(':scope > button.ct336-action',row);
 const ok=valid.length===spec.length&&valid.every((b,i)=>{
  const [label,action]=spec[i];
  if(String(b.textContent||'').trim()!==label)return false;
  if(action==='swap')return String(b.dataset.ct336SwapOnly||'')===name;
  return b.dataset.ct336Action===action&&b.dataset.ct336Swap===name&&b.dataset.ct336Media===key;
 });
 if(!ok)row.replaceChildren(...spec.map(([l,a])=>button(l,a,name,key)));
 row.className='ct336-actions '+(bucket==='watch'?'ct336-actions-two':'ct336-actions-three');
 row.dataset.ct336Bucket=bucket;
 row.hidden=false;row.removeAttribute('hidden');row.removeAttribute('inert');
 row.style.setProperty('display','grid','important');
 row.style.setProperty('grid-template-columns',bucket==='watch'?'repeat(2,minmax(0,1fr))':'repeat(3,minmax(0,1fr))','important');
 for(const b of qa(':scope > button.ct336-action',row)){
  b.type='button';b.disabled=false;b.hidden=false;b.removeAttribute('disabled');b.removeAttribute('hidden');b.removeAttribute('inert');b.removeAttribute('aria-disabled');
  b.style.setProperty('display','flex','important');b.style.setProperty('pointer-events','auto','important');b.style.setProperty('cursor','pointer','important');
 }
 try{window.__ctR348?.styleRow?.(row,q('.ct288-poster,.ct288-empty-poster',slot),spec.length)}catch{}
 for(const b of qa(':scope > button.ct336-action',row)){b.disabled=false;b.removeAttribute('disabled');b.hidden=false;b.style.setProperty('display','flex','important')}
 slot.dataset.ct367Owned='1';return true;
}
function ensureAll(){
 const root=q('[data-ct336-foryou]');if(!root)return false;
 let n=0;for(const slot of qa('[data-ct336-slot]',root))if(ensureSlot(slot))n++;
 root.dataset.ct367Actions=String(n);return n>0;
}
function renderSlot(name){
 let ok=false;try{ok=!!window.__ctR359?.renderSlot?.(name,{animate:true})}catch{}
 const slot=slotByName(name);ensureSlot(slot);queueMicrotask(()=>ensureSlot(slot));requestAnimationFrame(()=>ensureSlot(slot));
 return ok;
}
function persist(action,key,name){
 const p=window.__ctR365?.persistDirect;
 if(typeof p!=='function')return Promise.reject(new Error('Persistencia indisponivel'));
 return Promise.resolve(p(action,key)).then(()=>{
  try{void window.__ctR319?.personal?.(true)}catch{}
  try{void window.__ctR363?.refill?.(name,{force:true})}catch{}
 }).finally(()=>{ensureSlot(slotByName(name))});
}
function handle(meta){
 if(meta.action==='swap'){
  let tx=null;try{tx=window.__ctR359Test?.mutate359?.('swap',meta.key,meta.name)}catch{}
  if(tx){renderSlot(meta.name);try{void window.__ctR359?.rememberSwap?.(meta.name,meta.key)}catch{}return true}
  void Promise.resolve(window.__ctR363?.refill?.(meta.name,{force:true})).then(()=>{
   let next=null;try{next=window.__ctR359Test?.mutate359?.('swap',meta.key,meta.name)}catch{}
   if(next)renderSlot(meta.name);else ensureSlot(slotByName(meta.name));
  }).catch(()=>ensureSlot(slotByName(meta.name)));
  return true;
 }
 let tx=null;try{tx=window.__ctR359Test?.mutate359?.(meta.action,meta.key,meta.name)}catch{}
 if(!tx)return false;
 renderSlot(meta.name);
 void persist(meta.action,meta.key,meta.name).catch(e=>{
  try{window.__ctR309Test?.setForYouState?.(tx.before);renderSlot(meta.name);toast('Nao foi possivel sincronizar. '+(e?.message||String(e)))}catch{}
 });
 return true;
}
function meta(target){
 const btn=target?.closest?.('.ct336-actions button');if(!btn||routeNow()!=='discover')return null;
 const slot=btn.closest('[data-ct336-slot]');if(!slot||!slot.closest('[data-ct336-foryou]'))return null;
 const name=String(slot.dataset.ct336Slot||''),item=itemFor(name),key=keyOf(item),label=String(btn.textContent||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 const action=btn.matches('[data-ct336-swap-only]')||label.includes('trocar')?'swap':btn.dataset.ct336Action==='watchlist'||label.includes('watchlist')?'watchlist':btn.dataset.ct336Action==='seen'||label.includes('visto')?'seen':'';
 if(!name||!key||!action)return null;
 if(action==='watchlist'&&name.startsWith('watch:'))return null;
 return{btn,slot,name,key,action};
}
function early(target,event){
 const m=meta(target);if(!m)return false;
 const ok=handle(m);if(!ok)return false;
 event?.preventDefault?.();event?.stopImmediatePropagation?.();event?.stopPropagation?.();
 document.documentElement.dataset.ct367LastAction=m.action+':'+m.name+':'+m.key;
 queueMicrotask(ensureAll);requestAnimationFrame(ensureAll);setTimeout(ensureAll,80);
 return true;
}
window.__ctR336EarlyHandle=early;window.__ctR358Early=early;window.__ctR359Early=early;
if(window.__ctR360)window.__ctR360.early=early;if(window.__ctR361)window.__ctR361.early=early;if(window.__ctR362)window.__ctR362.early=early;

const mo=new MutationObserver(()=>queueMicrotask(ensureAll));
mo.observe(document.documentElement,{subtree:true,childList:true});
for(const ms of [0,50,200,800,1600])setTimeout(ensureAll,ms);

window.__ctR367={version:'1.0.158',ensureSlot,ensureAll,renderSlot,meta,handle,early};
})();