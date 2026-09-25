/* CineTracker Web 1.0.163 r372 — stable For You controls + strict fresh seen/watch exclusion. */
(()=>{
'use strict';
if(window.__ctR372?.version==='1.0.163')return;
window.__ctR372Marker='foryou-flex-controls+poster-overlay-z10+fresh-strict-seen-watch-authority';

const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const rows=v=>Array.isArray(v)?v:[];
const kinds=['movie','series','anime'];
const routeNow=()=>{try{return String(typeof route==='function'?route():'')}catch{return''}};
const typeOf=x=>String(x?.media_type||x?.type||x?.raw_tmdb?.media_type||'tv')==='movie'?'movie':'tv';
const idOf=x=>Number(x?.tmdb_id||x?.source_tmdb_id||x?.id||x?.raw_tmdb?.id||0);
const keyOf=x=>{const id=idOf(x);return id>0?typeOf(x)+':'+id:''};
let authority={ready:false,seen:new Set(),watch:new Set(),blocked:new Set(),at:0};
let authorityTask=null,freshLock=false,freshController=null,baseRenderSlot=null;

function imp(el,k,v){el?.style?.setProperty?.(k,v,'important')}
function layoutSlot(slot){
 if(!slot)return false;
 const row=q(':scope > .ct336-actions',slot);
 if(row){
  row.classList.add('ct372-actions');
  for(const [k,v] of Object.entries({
   display:'flex','flex-direction':'row','flex-wrap':'nowrap','align-items':'center','justify-content':'space-between',
   gap:'8px',width:'100%','min-width':'0','max-width':'100%','min-height':'32px',height:'32px',
   position:'relative','z-index':'5',overflow:'visible',margin:'6px 0 0',padding:'0'
  }))imp(row,k,v);
  for(const b of qa(':scope > button',row)){
   b.type='button';b.hidden=false;b.removeAttribute('hidden');b.removeAttribute('inert');
   for(const [k,v] of Object.entries({
    display:'flex','align-items':'center','justify-content':'center','flex':'1 1 0','flex-shrink':'0',
    width:'auto','min-width':'0','max-width':'none',height:'32px','min-height':'32px','max-height':'32px',
    margin:'0',padding:'4px 5px',position:'relative','z-index':'6','white-space':'nowrap',
    overflow:'hidden','text-overflow':'ellipsis','line-height':'1','box-sizing':'border-box'
   }))imp(b,k,v);
  }
 }
 const card=q('.ct288-card,.ct291-card',slot);
 if(card){imp(card,'position','relative');imp(card,'overflow','visible')}
 for(const b of qa('.ct291-favorite,.ct288-state,[data-ct291-favorite]',slot)){
  b.type='button';b.hidden=false;b.removeAttribute('hidden');
  for(const [k,v] of Object.entries({
   position:'absolute',top:'8px',right:'8px',left:'auto',bottom:'auto','z-index':'10',
   width:'36px','min-width':'36px','max-width':'36px',height:'36px','min-height':'36px','max-height':'36px',
   padding:'8px',margin:'0','flex':'0 0 36px','flex-shrink':'0','border-radius':'999px',
   background:'rgba(10,10,10,.48)','backdrop-filter':'blur(12px)','-webkit-backdrop-filter':'blur(12px)',
   display:'flex','align-items':'center','justify-content':'center','box-sizing':'border-box'
  }))imp(b,k,v);
 }
 slot.dataset.ct372Layout='1';return true;
}
function layoutAll(){
 const root=q('[data-ct336-foryou]');if(!root)return false;
 qa('[data-ct336-slot]',root).forEach(layoutSlot);
 root.dataset.ct372Layout='stable-flex-nowrap';return true;
}
function cloneState(st){
 if(!st)return null;
 return {...st,
  freshPools:{movie:[...rows(st.freshPools?.movie)],series:[...rows(st.freshPools?.series)],anime:[...rows(st.freshPools?.anime)]},
  freshIndex:{...(st.freshIndex||{})}
 };
}
function isBlockedKey(k,a=authority){return !!k&&(a.seen.has(k)||a.watch.has(k)||a.blocked.has(k))}
function strictFreshPool(list,a=authority){
 const used=new Set();
 return rows(list).filter(x=>{const k=keyOf(x);if(!k||used.has(k)||isBlockedKey(k,a))return false;used.add(k);return true});
}
function installFreshState(st){window.__ctR309Test?.setForYouState?.(st);return st}
function sanitizeFreshState(a=authority){
 const current=window.__ctR309Test?.state;if(!current||!a?.ready)return false;
 const st=cloneState(current);let changed=false;
 for(const kind of kinds){
  const old=rows(st.freshPools?.[kind]),clean=strictFreshPool(old,a);
  if(clean.length!==old.length||clean.some((x,i)=>keyOf(x)!==keyOf(old[i]))){st.freshPools[kind]=clean;st.freshIndex[kind]=0;changed=true}
  else if(clean.length){const i=Number(st.freshIndex?.[kind]||0);if(i<0||i>=clean.length){st.freshIndex[kind]=0;changed=true}}
 }
 if(changed)installFreshState(st);
 return changed;
}
async function refreshAuthority(force=true){
 if(authorityTask&&!force)return authorityTask;
 authorityTask=(async()=>{
  let p=null;
  try{p=await window.__ctR319?.personal?.(!!force)}catch{}
  if(!p?.ready)try{p=await window.__ctR295Test?.authority?.(!!force)}catch{}
  const seen=new Set(p?.seen||[]),watch=new Set(p?.watch||[]),blocked=new Set(p?.blocked||[]);
  for(const k of seen)blocked.add(k);for(const k of watch)blocked.add(k);
  authority={ready:true,seen,watch,blocked,at:Date.now()};
  window.__ctR372Authority=authority;
  sanitizeFreshState(authority);
  return authority;
 })().finally(()=>{authorityTask=null});
 return authorityTask;
}
function renderFreshSlot(name){
 const slot=q('[data-ct336-foryou] [data-ct336-slot="'+CSS.escape(name)+'"]');
 const out=baseRenderSlot?baseRenderSlot(name,{animate:true}):window.__ctR359?.renderSlot?.(name,{animate:true});
 if(slot){slot.dataset.ct372FreshOk='1';layoutSlot(slot)}
 return out;
}
async function ensureFreshValidated(force=true){
 if(routeNow()!=='discover')return false;
 const a=await refreshAuthority(force);
 sanitizeFreshState(a);
 for(const kind of kinds){
  const name='fresh:'+kind;
  let st=window.__ctR309Test?.state;
  if(!strictFreshPool(st?.freshPools?.[kind],a).length&&window.__ctR370?.fetchOnceIfNeeded){
   const c=new AbortController();
   try{await window.__ctR370.fetchOnceIfNeeded(name,c)}catch{}
   sanitizeFreshState(a);
   st=window.__ctR309Test?.state;
  }
  renderFreshSlot(name);
 }
 layoutAll();return true;
}
function currentFresh(name){
 const st=window.__ctR309Test?.state,kind=String(name).split(':')[1],pool=rows(st?.freshPools?.[kind]);
 if(!pool.length)return null;
 const i=((Number(st?.freshIndex?.[kind]||0)%pool.length)+pool.length)%pool.length;
 return pool[i]||null;
}
function selectFresh(name,item){
 const st=cloneState(window.__ctR309Test?.state),kind=String(name).split(':')[1],pool=rows(st?.freshPools?.[kind]),k=keyOf(item),i=pool.findIndex(x=>keyOf(x)===k);
 if(!st||i<0)return false;st.freshIndex[kind]=i;installFreshState(st);return true;
}
async function swapFresh(meta){
 if(!meta||freshLock)return false;
 freshLock=true;freshController?.abort();const c=new AbortController();freshController=c;
 if(meta.btn){meta.btn.disabled=true;meta.btn.setAttribute('aria-busy','true')}
 try{
  const a=authority.ready?authority:await refreshAuthority(true);
  sanitizeFreshState(a);
  let st=window.__ctR309Test?.state,kind=String(meta.name).split(':')[1],cur=keyOf(currentFresh(meta.name));
  const excluded=window.__ctR370?.excluded||new Set();
  let eligible=strictFreshPool(st?.freshPools?.[kind],a).filter(x=>{const k=keyOf(x);return k&&k!==cur&&!excluded.has(k)});
  if(!eligible.length&&window.__ctR370?.fetchOnceIfNeeded){
   await window.__ctR370.fetchOnceIfNeeded(meta.name,c);
   if(c.signal.aborted)return false;
   sanitizeFreshState(a);st=window.__ctR309Test?.state;
   eligible=strictFreshPool(st?.freshPools?.[kind],a).filter(x=>{const k=keyOf(x);return k&&k!==cur&&!excluded.has(k)});
  }
  if(!eligible.length)return false;
  const item=eligible[Math.floor(Math.random()*eligible.length)];
  if(!selectFresh(meta.name,item))return false;
  renderFreshSlot(meta.name);layoutAll();return true;
 }finally{
  if(freshController===c)freshController=null;freshLock=false;
  if(meta.btn?.isConnected){meta.btn.disabled=false;meta.btn.removeAttribute('disabled');meta.btn.setAttribute('aria-busy','false')}
 }
}
function installRenderGuard(){
 if(!window.__ctR359?.renderSlot||baseRenderSlot)return;
 baseRenderSlot=window.__ctR359.renderSlot.bind(window.__ctR359);
 window.__ctR359.renderSlot=function(name,opts){
  if(String(name).startsWith('fresh:')&&authority.ready)sanitizeFreshState(authority);
  const out=baseRenderSlot(name,opts);queueMicrotask(layoutAll);return out;
 };
}
function meta(target){try{return window.__ctR367?.meta?.(target)||null}catch{return null}}
function early(target,event){
 if(routeNow()!=='discover'||!target?.closest?.('[data-ct336-foryou]'))return false;
 const m=meta(target);if(!m)return false;
 event?.preventDefault?.();event?.stopImmediatePropagation?.();event?.stopPropagation?.();
 if(m.name.startsWith('fresh:')&&m.action==='swap'){void swapFresh(m);return true}
 if(m.name.startsWith('fresh:')&&(m.action==='seen'||m.action==='watchlist')){
  const set=m.action==='seen'?authority.seen:authority.watch;set.add(m.key);authority.blocked.add(m.key);window.__ctR372Authority=authority;
  const ok=window.__ctR367?.handle?.(m);sanitizeFreshState(authority);layoutAll();
  setTimeout(()=>void ensureFreshValidated(true),0);return !!ok;
 }
 const ok=m.action==='swap'?window.__ctR370?.handleSwap?.(m):window.__ctR367?.handle?.(m);
 queueMicrotask(layoutAll);return ok!==false;
}

installRenderGuard();
window.__ctR336EarlyHandle=early;window.__ctR358Early=early;window.__ctR359Early=early;
if(window.__ctR360)window.__ctR360.early=early;if(window.__ctR361)window.__ctR361.early=early;if(window.__ctR362)window.__ctR362.early=early;

const style=document.createElement('style');style.id='ct-web-r372';style.textContent=`
[data-ct336-foryou] .ct336-actions{display:flex!important;flex-flow:row nowrap!important;align-items:center!important;justify-content:space-between!important;gap:8px!important;width:100%!important;min-width:0!important;max-width:100%!important;height:32px!important;min-height:32px!important;overflow:visible!important;position:relative!important;z-index:5!important}
[data-ct336-foryou] .ct336-actions>button{display:flex!important;align-items:center!important;justify-content:center!important;flex:1 1 0!important;flex-shrink:0!important;min-width:0!important;height:32px!important;min-height:32px!important;max-height:32px!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;position:relative!important;z-index:6!important}
[data-ct336-foryou] .ct288-card,[data-ct336-foryou] .ct291-card{position:relative!important;overflow:visible!important}
[data-ct336-foryou] .ct291-favorite,[data-ct336-foryou] .ct288-state,[data-ct336-foryou] [data-ct291-favorite]{position:absolute!important;top:8px!important;right:8px!important;left:auto!important;bottom:auto!important;z-index:10!important;width:36px!important;min-width:36px!important;max-width:36px!important;height:36px!important;min-height:36px!important;max-height:36px!important;padding:8px!important;flex:0 0 36px!important;flex-shrink:0!important;border-radius:999px!important;background:rgba(10,10,10,.48)!important;-webkit-backdrop-filter:blur(12px)!important;backdrop-filter:blur(12px)!important;display:flex!important;align-items:center!important;justify-content:center!important;box-sizing:border-box!important}
[data-ct336-foryou] [data-ct336-slot^="fresh:"]:not([data-ct372-fresh-ok="1"]){visibility:hidden!important}
`;document.head.appendChild(style);

for(const ms of [0,50,250,900,1800])setTimeout(()=>{layoutAll();if(ms===0)void ensureFreshValidated(true)},ms);
window.__ctR372={version:'1.0.163',layoutSlot,layoutAll,refreshAuthority,sanitizeFreshState,strictFreshPool,ensureFreshValidated,swapFresh,early,get authority(){return authority}};
window.__ctR372Test={layoutSlot,layoutAll,sanitizeFreshState,strictFreshPool,ensureFreshValidated,swapFresh,setAuthority(v){authority={ready:true,seen:new Set(v?.seen||[]),watch:new Set(v?.watch||[]),blocked:new Set(v?.blocked||[]),at:Date.now()};for(const k of authority.seen)authority.blocked.add(k);for(const k of authority.watch)authority.blocked.add(k);window.__ctR372Authority=authority},get authority(){return authority}};
})();