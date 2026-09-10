/* CineTracker Web 1.0.32 r240 — semantic authority based on the user's production video. */
(()=>{
'use strict';
if(window.__ctR240)return;
window.__ctR240='user-video-semantic-authority';
window.__ctR240Home='follow-first-history-hidden';
window.__ctR240Discover='canonical-exclusions-atomic-switch';
window.__ctR240Sports='search-focus-caret-stable';
const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>r?.querySelectorAll?[...r.querySelectorAll(s)]:[];
const n=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();

/* HOME: no history/instruction may sit before the first visible "Assistir a seguir" section. */
function topChild(root,node){let x=node;while(x?.parentElement&&x.parentElement!==root)x=x.parentElement;return x?.parentElement===root?x:null}
function home240(){
 const root=q('[data-home]');if(!root)return;
 for(const el of qa('*',root)){
  const t=n(el.textContent||'');
  if((t==='historico acima'||t==='historico acima ↑'||t==='↑ historico acima')&&el.children.length===0){const box=el.closest('section,.panel,[data-history],.history')||el;box.hidden=true;box.dataset.ct240HistoryHidden='1'}
 }
 const head=qa('h1,h2,h3,h4,.panel-head',root).find(x=>n(x.textContent||'').startsWith('assistir a seguir'));
 if(head){
  const section=head.closest('section,.panel,.home-section')||head;
  const parent=section.parentElement;
  if(parent){
   for(const sib of [...parent.children]){if(sib===section)break;const t=n(sib.textContent||'');if(t.includes('historico')||t.includes('recentes')||t.includes('ultimo assistido')){sib.hidden=true;sib.dataset.ct240HistoryHidden='1'}}
  }
  root.dataset.ct240Home='follow-first';
 }
}
try{const prior=paintHome;paintHome=function(...a){const out=prior.apply(this,a);home240();return out}}catch{}

/* DISCOVER: one canonical exclusion context for every public recommendation/ranking band. */
function blockedState240(x){return Boolean(x?.is_seen||x?.is_completed||x?.is_in_progress||x?.is_up_to_date||x?.is_watchlist||x?.watch_later||x?.added_to_watchlist||Number(x?.watched_episodes||0)>0||x?.last_watched_at)}
function key240(x){const type=typeof mediaType==='function'?mediaType(x):(x?.media_type==='movie'?'movie':'tv');const id=Number(x?.tmdb_id||x?.id||x?.raw_tmdb?.source_tmdb_id||0);return {type,id,title:n(x?.title||x?.name||x?.media_title||x?.original_title||x?.original_name||'')}}
function exclusions240(ctx){
 const ids={movie:new Set(),tv:new Set()},aliases={movie:new Set(),tv:new Set()};
 for(const x of ctx?.dash||ctx?.dashboard||[]){if(!blockedState240(x))continue;const k=key240(x);if(k.id>0)ids[k.type]?.add(k.id);if(k.title)aliases[k.type]?.add(k.title)}
 for(const id of ctx?.movieIds||[])ids.movie.add(Number(id));for(const id of ctx?.tvIds||[])ids.tv.add(Number(id));
 for(const a of ctx?.aliases||[]){const s=String(a||''),i=s.indexOf(':');if(i>0){const type=s.slice(0,i)==='movie'?'movie':'tv';aliases[type].add(n(s.slice(i+1)))}}
 return {ids,aliases};
}
function allowed240(x,ex){const k=key240(x);if(!(k.id>0)&&!k.title)return true;return !(k.id>0&&ex.ids[k.type]?.has(k.id))&&!(k.title&&ex.aliases[k.type]?.has(k.title));}
function mediaish240(x){return x&&typeof x==='object'&&(Number(x.id||x.tmdb_id||0)>0)&&Boolean(x.title||x.name||x.media_title||x.original_title||x.original_name)}
function cleanse240(v,ex){
 if(Array.isArray(v))return v.filter(x=>!mediaish240(x)||allowed240(x,ex)).map(x=>mediaish240(x)?x:cleanse240(x,ex));
 if(!v||typeof v!=='object')return v;
 const out={...v};for(const [k,x] of Object.entries(out))if(Array.isArray(x)||x&&typeof x==='object')out[k]=cleanse240(x,ex);return out;
}
let stableDiscover240='';
function discoverRoot240(){return q('[data-page="discover"],[data-discover]')}
function discoverContent240(){const r=discoverRoot240();return r&&(q('[data-discover-content]',r)||r)}
function loadingOnly240(el){if(!el)return false;const t=n(el.textContent||'');return !qa('article,.card,.media-row,[data-media],[data-top10],section.panel',el).length&&(t.includes('carregando titulos')||t.includes('carregando top 10')||t.includes('carregando streamings')||t==='carregando')}
function rememberDiscover240(){const h=discoverContent240();if(h&&!loadingOnly240(h)&&h.innerHTML.trim())stableDiscover240=h.innerHTML}
function restoreDiscover240(){const h=discoverContent240();if(h&&loadingOnly240(h)&&stableDiscover240)h.innerHTML=stableDiscover240}
try{
 const baseRows=discoverRows;
 discoverRows=async function(tab,...rest){
  const raw=await baseRows.call(this,tab,...rest);
  if(tab==='foryou')return raw;
  try{const ctx=await exclusionContext158();return cleanse240(raw,exclusions240(ctx))}catch{return raw}
 };
}catch{}
try{
 const prior=paintDiscover;
 paintDiscover=function(...a){const out=prior.apply(this,a);queueMicrotask(rememberDiscover240);return out};
}catch{}
try{
 const prior=renderDiscover;
 renderDiscover=async function(...a){
  rememberDiscover240();const pending=prior.apply(this,a);restoreDiscover240();
  const out=await pending;rememberDiscover240();return out;
 };
}catch{}
let discoverGuard240=false;
function guardDiscover240(){if(discoverGuard240)return;discoverGuard240=true;try{restoreDiscover240();rememberDiscover240()}finally{discoverGuard240=false}}

/* SPORTS: renderer replacement must not steal focus or truncate multi-letter input. */
let sportsFocus240=null;
function sportsInput240(){const root=q('[data-sports]');return root&&q('[data-sports-search],input[type="search"],input[placeholder*="Buscar" i]',root)}
function captureSports240(){const el=sportsInput240();if(!el||document.activeElement!==el)return null;return {value:el.value,start:el.selectionStart??el.value.length,end:el.selectionEnd??el.value.length}}
function restoreSports240(s){if(!s)return;const el=sportsInput240();if(!el)return;if(el.value!==s.value){el.value=s.value;el.dispatchEvent(new Event('input',{bubbles:false}))}el.focus({preventScroll:true});try{el.setSelectionRange(s.start,s.end)}catch{}sportsFocus240=s}
document.addEventListener('beforeinput',()=>{sportsFocus240=captureSports240()||sportsFocus240},true);
document.addEventListener('input',e=>{if(e.target===sportsInput240())sportsFocus240=captureSports240()||{value:e.target.value,start:e.target.selectionStart??e.target.value.length,end:e.target.selectionEnd??e.target.value.length}},true);
try{const prior=paintSports;paintSports=function(...a){const s=captureSports240()||sportsFocus240;const out=prior.apply(this,a);restoreSports240(s);return out}}catch{}
try{const prior=renderSports;renderSports=async function(...a){const s=captureSports240()||sportsFocus240;const p=prior.apply(this,a);restoreSports240(s);const out=await p;restoreSports240(sportsFocus240||s);return out}}catch{}

let timer240=0;
function reconcile240(){home240();guardDiscover240();if(sportsFocus240&&q('[data-sports]')&&document.activeElement!==sportsInput240())restoreSports240(sportsFocus240)}
function queue240(){clearTimeout(timer240);timer240=setTimeout(reconcile240,0)}
try{new MutationObserver(queue240).observe(q('#app')||document.documentElement,{subtree:true,childList:true})}catch{}
window.addEventListener('popstate',queue240);window.addEventListener('cinetracker:data-changed',queue240);
const st=document.createElement('style');st.id='ct-r240-semantics';st.textContent=`[data-ct240-history-hidden="1"]{display:none!important}[data-page="discover"] .loader,[data-discover] .loader{animation:none}`;document.getElementById(st.id)?.remove();document.head.appendChild(st);
window.__ctR240HomeApply=home240;window.__ctR240Cleanse=cleanse240;window.__ctR240Exclusions=exclusions240;window.__ctR240RestoreDiscover=restoreDiscover240;window.__ctR240CaptureSports=captureSports240;window.__ctR240RestoreSports=restoreSports240;
queue240();
})();