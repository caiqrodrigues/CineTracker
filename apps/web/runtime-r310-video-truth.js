/* CineTracker Web 1.0.101 r310 — delayed-authority and canonical-state truth. WEB ONLY. */
(()=>{
'use strict';
if(window.__ctR310)return;
window.__ctR310='delayed-authorities-retired+canonical-watchlist+profile-sports-truth+actor-bottom-scroll';
window.__ctR310Discover='r252+r300+r293-delayed-retired+full-watchlist-exclusion+state-aware-actions';
window.__ctR310Profile='canonical-sports-history-count+actor-bottom-scroll-only';
window.__ctR310Sports='past-live-normalized';
window.__ctR310Android='preserved-1.0.20-10062';

const R=window.__ctR288R263||{},M=window.__ctR295Test||{},q=(s,r=document)=>r?.querySelector?.(s)||null,qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const discover=R.discover263||null;
const routeNow=()=>{try{return String(typeof route==='function'?route():'')}catch{return''}};
const typeOf=typeof R.type263==='function'?R.type263:(x=>String(x?.media_type||x?.type||'tv')==='movie'?'movie':'tv');
const idOf=typeof R.id263==='function'?R.id263:(x=>Number(x?.tmdb_id||x?.source_tmdb_id||x?.id||0));
const keyOf=x=>`${typeOf(x)==='movie'?'movie':'tv'}:${Number(idOf(x)||0)}`;
const validKey=k=>/^(movie|tv):[1-9]\d*$/.test(String(k||''));
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const asRows=v=>Array.isArray(v)?v:[];
const host=()=>{try{return R.discoverHost263?.()||q('[data-ct263-discover-content]')}catch{return q('[data-ct263-discover-content]')}};
const FILTERED=new Set(['trending','popular','new','anticipated','top']);
const BROWSE=new Set(['trending','popular','new','anticipated','top','calendar']);

let canonicalWatch={at:0,keys:new Set(),rows:[]},watchTask=null;
function watchRows(v){return asRows(v?.rows||v)}
async function canonicalWatchlist(force=false){
 if(!force&&canonicalWatch.at&&Date.now()-canonicalWatch.at<90000)return canonicalWatch;
 if(watchTask&&!force)return watchTask;
 watchTask=(async()=>{
  let rows=[];try{rows=watchRows(await rpc('cinetracker_watchlist_full_v119',{}))}catch{}
  const keys=new Set(rows.map(keyOf).filter(validKey));
  canonicalWatch={at:Date.now(),keys,rows};
  return canonicalWatch;
 })().finally(()=>watchTask=null);
 return watchTask;
}
function invalidateWatch(){canonicalWatch={at:0,keys:new Set(),rows:[]};watchTask=null}
function blocked310(x,a,watch=canonicalWatch){
 const k=keyOf(x);if(watch?.keys?.has?.(k))return true;
 try{if(a?.seen?.has?.(k)||a?.watch?.has?.(k))return true}catch{}
 try{if(typeof M.blocked==='function'&&M.blocked(x,a))return true}catch{}
 return false;
}
function filterBrowse310(rows,tab,a,watch=canonicalWatch){
 const seen=new Set(),out=[];
 for(const x of asRows(rows)){const k=keyOf(x);if(!validKey(k)||seen.has(k))continue;seen.add(k);if(FILTERED.has(String(tab))&&blocked310(x,a,watch))continue;out.push(x)}
 return out;
}
function actionState310(k,watch=canonicalWatch){return !!watch?.keys?.has?.(k)}
function clearLegacy(root){
 qa('.ct291-card-footer,.ct295-card-footer,.ct288-state,.ct301-watch-action,.ct308-actions,.ct309-actions',root).forEach(x=>x.remove());
}
function decorateBrowse310(root,watch=canonicalWatch){
 if(!root)return false;root.dataset.ct310Owned='browse';clearLegacy(root);
 for(const card of qa('[data-ct288-card]',root)){
  const k=String(card.dataset.ct288Card||card.querySelector?.('[data-media]')?.getAttribute?.('data-media')||'');if(!validKey(k))continue;
  card.classList.remove('ct291-has-footer');card.classList.add('ct310-card');
  const saved=actionState310(k,watch),row=document.createElement('div');row.className='ct310-actions';
  row.innerHTML=`<button type="button" class="chip ct310-action ct310-watch${saved?' active':''}" data-ct310-action="watchlist" data-media="${k}" aria-label="${saved?'Remover da Watchlist':'Adicionar à Watchlist'}">${saved?'✓ Watchlist':'+ Watchlist'}</button><button type="button" class="chip ct310-action ct310-seen" data-ct310-action="seen" data-media="${k}" aria-label="Marcar como visto">✓ Visto</button>`;
  card.appendChild(row);
 }
 return true;
}
let browseToken=0,browseCache=new Map();
async function source310(tab,force=false){
 const base=window.__ctR309?.buildBrowse;
 if(typeof window.__ctR300Test?.sourceRows300==='function'){
  const k=`${tab}|${String(discover?.type||'all')}`;
  if(!force&&browseCache.has(k)&&Date.now()-browseCache.get(k).at<90000)return browseCache.get(k).rows;
  const rows=await window.__ctR300Test.sourceRows300(tab);browseCache.set(k,{at:Date.now(),rows});return rows;
 }
 return null;
}
async function buildBrowse310(tab,force=false){
 if(!discover||!BROWSE.has(String(tab))||routeNow()!=='discover')return false;
 const token=++browseToken,h=host();if(h)h.innerHTML='<div class="ct263-loading ct310-loading">Carregando títulos…</div>';
 try{
  const [a,watch,raw]=await Promise.all([Promise.resolve(M.authority?.(!!force)),canonicalWatchlist(!!force),source310(tab,!!force)]);
  if(token!==browseToken||routeNow()!=='discover'||String(discover.tab)!==String(tab))return false;
  if(!Array.isArray(raw)){if(typeof window.__ctR309?.buildBrowse==='function')return window.__ctR309.buildBrowse(tab,force);throw new Error('Fonte indisponível')}
  const clean=filterBrowse310(raw,tab,a,watch);
  if(typeof window.__ctR288PaintBrowse!=='function')throw new Error('Renderer indisponível');
  window.__ctR288PaintBrowse(clean,tab);decorateBrowse310(host(),watch);return true;
 }catch(e){
  if(token===browseToken&&h)h.innerHTML='<div class="empty">Não foi possível carregar esta área agora.<br><button type="button" class="chip" data-ct310-retry>Tentar novamente</button></div>';
  return false;
 }
}
const previousLoad=window.__ctR288LoadDiscover;
async function load310(tab=discover?.tab,force=false){
 const t=String(tab||discover?.tab||'foryou');
 if(!discover)return previousLoad?.apply(this,arguments);
 discover.tab=t;
 if(BROWSE.has(t)){discover.gen=Number(discover.gen||0)+1;void buildBrowse310(t,!!force);return}
 return previousLoad?.apply(this,arguments);
}
try{loadDiscover263=load310}catch{}window.__ctR288LoadDiscover=load310;

function sanitizeTabs310(){
 const root=q('[data-ct288-discover],[data-ct263-discover],[data-discover]');if(!root)return false;
 const canonical=q('[data-ct288-tabs],.ct263-discover-tabs',root);
 for(const group of qa('.ct251-tabs,.ct255-discover-tabs,.ct257-discover-tabs,[data-discover-tabs]',root)){if(group!==canonical&&!canonical?.contains(group))group.remove()}
 if(canonical){
  const allowed=['foryou','top10','trending','popular','new','anticipated','top','calendar'],seen=new Set();
  for(const b of qa('button,[role="tab"]',canonical)){
   const k=String(b.dataset?.ct263DiscoverTab||b.dataset?.ct288DiscoverTab||b.dataset?.discoverTab||'');
   if(k==='releases'||(k&&(!allowed.includes(k)||seen.has(k)))){b.remove();continue}if(k)seen.add(k);
  }
 }
 return true;
}

async function persist310(btn){
 if(!btn||btn.disabled)return;const action=String(btn.dataset.ct310Action||''),raw=String(btn.dataset.media||btn.closest?.('[data-ct288-card]')?.dataset.ct288Card||''),[type,idRaw]=raw.split(':'),id=Number(idRaw||0);if(!id)return;
 btn.disabled=true;const old=btn.textContent;btn.textContent='…';
 try{
  if(action==='watchlist'){await addWatchlist(type,id);invalidateWatch()}
  else if(action==='seen'){await markSeen(type,id);invalidateWatch()}
  else return;
  try{await M.authority?.(true)}catch{}browseCache.clear();
  if(BROWSE.has(String(discover?.tab)))void buildBrowse310(String(discover.tab),true);
  else try{await window.__ctR309?.loadDiscover?.(discover?.tab,true)}catch{}
 }catch(e){btn.disabled=false;btn.textContent=old;try{toast(e?.message||String(e))}catch{}}
}
window.addEventListener('click',e=>{
 const b=e.target?.closest?.('[data-ct310-action]');if(b){e.preventDefault();e.stopImmediatePropagation();void persist310(b);return}
 const r=e.target?.closest?.('[data-ct310-retry]');if(r){e.preventDefault();void buildBrowse310(String(discover?.tab||''),true)}
},true);
document.addEventListener('cinetracker:data-changed',()=>{invalidateWatch();browseCache.clear()});

function sportsHistoryCount(rows){return asRows(rows).filter(x=>x?.is_watched!==false).length}
async function canonicalSportsCount(){
 try{return sportsHistoryCount(await rpc('cinetracker_sports_watch_history_v296',{}))}catch{return null}
}
function patchProfileSportsCount(count){
 if(count==null||!['profile','perfil'].includes(routeNow()))return false;const root=q('[data-profile]');if(!root)return false;
 let changed=false;for(const card of qa('.stat,[data-stat],.stat-card,.profile-stat',root)){const label=norm(q('small,label,.label,.stat-label',card)?.textContent||card.textContent),v=q('b,strong,.value,.stat-value',card);if(v&&(label.includes('eventos assistidos')||label==='esportes assistidos')){v.textContent=Number(count).toLocaleString('pt-BR');changed=true}}
 return changed;
}

let actorSyncCleanup=null;
function actorBottomScroll310(){
 if(!['profile','perfil'].includes(routeNow()))return false;const root=q('[data-profile]');if(!root)return false;
 const heading=qa('h1,h2,h3,h4,.panel-title,.section-title',root).find(x=>norm(x.textContent).includes('atores favoritos'));const section=heading?.closest('section,.panel,article');if(!section)return false;
 const controls=qa('[data-person],[data-person-id]',section),cards=[...new Set(controls.map(x=>x.closest('article,li,.card,.person-card,.actor-card')||x))];if(!cards.length)return false;
 const rail=cards[0].parentElement;if(!rail||!cards.every(x=>x.parentElement===rail))return false;
 try{actorSyncCleanup?.()}catch{}actorSyncCleanup=null;
 section.classList.add('ct310-actor-section');
 for(const x of [section,...qa('*',section)])if(!x.classList.contains('ct310-actor-scroll'))x.classList.remove('ct306-actor-rail','ct305-actor-rail','ct304-actor-rail','ct257-local-x','actors-scroll','row-scroll');
 rail.classList.add('ct310-actor-rail');
 let proxy=q(':scope > .ct310-actor-scroll',section);if(!proxy){proxy=document.createElement('div');proxy.className='ct310-actor-scroll';proxy.innerHTML='<div class="ct310-actor-scroll-inner"></div>';rail.after(proxy)}
 const inner=q('.ct310-actor-scroll-inner',proxy);
 const syncSize=()=>{const w=Math.max(rail.scrollWidth,rail.clientWidth);inner.style.width=w+'px';proxy.hidden=w<=rail.clientWidth+2;proxy.scrollLeft=rail.scrollLeft};
 syncSize();requestAnimationFrame(syncSize);
 let lock=false;const a=()=>{if(lock)return;lock=true;proxy.scrollLeft=rail.scrollLeft;lock=false},b=()=>{if(lock)return;lock=true;rail.scrollLeft=proxy.scrollLeft;lock=false};
 rail.addEventListener('scroll',a,{passive:true});proxy.addEventListener('scroll',b,{passive:true});
 const resize=()=>requestAnimationFrame(syncSize);window.addEventListener('resize',resize);
 actorSyncCleanup=()=>{rail.removeEventListener('scroll',a);proxy.removeEventListener('scroll',b);window.removeEventListener('resize',resize)};
 return true;
}
async function profileTruth310(){
 if(!['profile','perfil'].includes(routeNow()))return false;
 const count=await canonicalSportsCount();if(!['profile','perfil'].includes(routeNow()))return false;patchProfileSportsCount(count);actorBottomScroll310();return true;
}
try{if(typeof renderProfile==='function'){const base=renderProfile;renderProfile=async function(){const out=await base.apply(this,arguments);await profileTruth310();return out}}}catch{}

function footer310(){
 const version='1.0.101',revision='r310-official-1.0.101';
 for(const el of qa('footer,.footer,[data-footer],body *')){if(el.children?.length&&el.matches?.('body *')&&!el.matches?.('footer,.footer,[data-footer]'))continue;const t=String(el.textContent||'');if(/CineTracker\s*[•·]\s*v\d+\.\d+\.\d+/i.test(t)&&/r\d+/i.test(t)){el.textContent=t.replace(/v\d+\.\d+\.\d+/i,'v'+version).replace(/r\d+(?:-official)?-\d+\.\d+\.\d+/i,revision)}}
}
try{if(typeof setApp==='function'){const base=setApp;setApp=function(){const out=base.apply(this,arguments);queueMicrotask(footer310);return out}}}catch{}

const style=document.createElement('style');style.id='ct-web-r310-video-truth';style.textContent=`
[data-ct263-discover-tab="releases"],[data-discover-tab="releases"],[data-ct251-discover-tab="releases"],[data-ct252-discover-tab="releases"]{display:none!important}
[data-ct310-owned] .ct291-card-footer,[data-ct310-owned] .ct295-card-footer,[data-ct310-owned] .ct288-state,[data-ct310-owned] .ct301-watch-action,[data-ct310-owned] .ct308-actions,[data-ct310-owned] .ct309-actions{display:none!important}
.ct310-actions{display:grid!important;grid-template-columns:minmax(0,1fr) minmax(0,1fr)!important;gap:5px!important;width:100%!important;margin-top:5px!important}
.ct310-actions .chip{position:static!important;inset:auto!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;min-width:0!important;min-height:30px!important;height:30px!important;padding:4px 7px!important;border-radius:9px!important;white-space:nowrap!important}
.ct310-actor-section{overflow-x:hidden!important}
.ct310-actor-section>*:not(.ct310-actor-scroll){scrollbar-width:none!important}
.ct310-actor-section>*:not(.ct310-actor-scroll)::-webkit-scrollbar{display:none!important;width:0!important;height:0!important}
.ct310-actor-rail{display:flex!important;flex-flow:row nowrap!important;gap:12px!important;overflow-x:auto!important;overflow-y:hidden!important;padding-bottom:2px!important;scrollbar-width:none!important;max-width:100%!important}
.ct310-actor-rail::-webkit-scrollbar{display:none!important}
.ct310-actor-scroll{display:block;box-sizing:border-box;width:100%;max-width:100%;height:16px;overflow-x:auto;overflow-y:hidden;margin-top:7px}
.ct310-actor-scroll[hidden]{display:none!important}.ct310-actor-scroll-inner{height:1px;min-height:1px}
`;document.head.appendChild(style);

sanitizeTabs310();footer310();
window.__ctR310={buildBrowse:buildBrowse310,loadDiscover:load310,canonicalWatchlist,filterBrowse:filterBrowse310,decorateBrowse:decorateBrowse310,sanitizeTabs:sanitizeTabs310,profileTruth:profileTruth310,actorBottomScroll:actorBottomScroll310,footer:footer310,invalidateWatch,version:'1.0.101'};
window.__ctR310Test={blocked310,filterBrowse310,decorateBrowse310,actionState310,sportsHistoryCount,patchProfileSportsCount,actorBottomScroll310,sanitizeTabs310,footer310,setWatch(keys){canonicalWatch={at:Date.now(),keys:new Set(keys||[]),rows:[]}},get watch(){return canonicalWatch}};
})();