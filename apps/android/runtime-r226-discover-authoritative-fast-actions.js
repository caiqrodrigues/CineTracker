/* Android 0.99.7.54 r226 — authoritative Discover + instant actions + reversible seen */
(() => {
'use strict';
if(window.__ctAndroidR226Loaded)return;
window.__ctAndroidR226Loaded=true;
window.__ctAndroidR226='discover-authoritative-top10-swap-watchlist-unseen-filter';
window.__ctAndroidBundle='android-v0.99.7.54-r226-discover-authoritative-fast-actions';
window.__ctR226Discover='all-nine-tabs-one-authority-top10-inline-no-r217-shell';
window.__ctR226Swap='raw-swap-buttons-owned-and-replaced-immediately';
window.__ctR226Watchlist='optimistic-immediate-remove-next-card-background-sync';
window.__ctR226Seen='detail-seen-toggle-reversible-via-unmark-rpc';
window.__ctR226Filter='discover-filter-right-of-search';

const tabs226=new Set(['foryou','top10','trending','popular','new','releases','anticipated','top','calendar']);
let ticket226=0,topTicket226=0,decorateFrame226=0;
const route226=()=>{try{return String(route?.()||'')}catch{return String(location.pathname||'/').replace(/^\/+/, '').split('/')[0]||'home'}};
const isDiscover226=()=>route226()==='discover'||String(location.pathname||'').replace(/^\/+/, '').split('/')[0]==='discover';
const tab226=v=>{v=String(v||'foryou');return tabs226.has(v)?v:'foryou'};
const railLeft226=()=>Number(document.querySelector('[data-ct-r180-tabs]')?.scrollLeft||0);
function restoreRail226(left){requestAnimationFrame(()=>{const r=document.querySelector('[data-ct-r180-tabs]');if(r)r.scrollLeft=Number(left||0)})}
function mark226(selected){document.querySelectorAll('[data-discover-tab]').forEach(b=>{const on=String(b.dataset.discoverTab||'')===selected;b.classList.toggle('active',on);b.classList.toggle('selected',on);b.setAttribute('aria-selected',on?'true':'false');if(on)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current')})}
function ensureShell226(selected,left){
  let root=document.querySelector('[data-discover]'),content=root?.querySelector('[data-discover-content]');
  if(root&&content)return {root,content};
  let rail='';try{rail=String(ctR180TabRail())}catch{}
  setApp(shell('Descobrir','','discover',`<div class="page" data-discover>${rail}<div data-discover-content>${loading('Carregando títulos...')}</div></div>`));
  root=document.querySelector('[data-discover]');content=root?.querySelector('[data-discover-content]');mark226(selected);restoreRail226(left);return{root,content};
}
function syncTypeFilters226(selected){
  const root=document.querySelector('[data-discover]');if(!root)return;
  let filters=root.querySelector('.ct-r180-type-filters');
  if(selected==='foryou'||selected==='top10'){
    if(filters)filters.remove();
    if(selected==='foryou')try{discoverState.type='all'}catch{}
    return;
  }
  if(!filters){filters=document.createElement('div');filters.className='filters ct-r180-type-filters';const rail=root.querySelector('[data-ct-r180-tabs]');rail?.insertAdjacentElement('afterend',filters)}
  try{filters.innerHTML=ctR180FiltersHtml()}catch{}
}
async function rows226(selected){if(selected==='foryou')return discoverRows('foryou');if(typeof ctR180StrictRows==='function')return ctR180StrictRows(selected);return discoverRows(selected)}
function paintNormal226(selected,rows){if(selected==='foryou')paintDiscover(rows||{});else ctR180RenderArray(rows||[]);mark226(selected);syncTypeFilters226(selected);decorate226()}

function providerHtml226(rows){return (rows||[]).map(p=>`<button type="button" class="ct171-provider-tab ${Number(p.provider_id)===Number(ct171TopProvider)?'active':''}" data-ct226-provider="${Number(p.provider_id)}">${p.logo_path?`<span style="background-image:url('${img(p.logo_path,'w92')}')"></span>`:''}<b>${esc(p.provider_name)}</b></button>`).join('')||'<div class="empty">Nenhum streaming configurado.</div>'}
async function paintTop226(provider,token){
  const host=document.querySelector('[data-ct226-top-content]');if(!host||token!==topTicket226||!isDiscover226()||tab226(discoverState?.tab)!=='top10')return true;
  host.innerHTML=loading('Montando Top 10...');
  try{
    const data=await ct171TopRows(Number(provider));
    if(token!==topTicket226||!host.isConnected||tab226(discoverState?.tab)!=='top10')return true;
    ct171TopProvider=Number(provider)||ct171TopProvider;
    const p=(ct171ProviderList||[]).find(x=>Number(x.provider_id)===Number(provider));
    host.innerHTML=`<div class="ct217-top-provider"><b>${esc(p?.provider_name||'Streaming')}</b></div><section class="panel ct171-top-section"><div class="panel-head"><h2>Top 10 Séries</h2><small>${data.series.length}</small></div><div class="ct171-top-row">${data.series.map(ct171TopCard).join('')||'<div class="empty">Sem séries disponíveis neste streaming.</div>'}</div></section><section class="panel ct171-top-section"><div class="panel-head"><h2>Top 10 Filmes</h2><small>${data.movies.length}</small></div><div class="ct171-top-row">${data.movies.map(ct171TopCard).join('')||'<div class="empty">Sem filmes disponíveis neste streaming.</div>'}</div></section>`;
    document.querySelectorAll('[data-ct226-provider]').forEach(b=>b.classList.toggle('active',Number(b.dataset.ct226Provider)===Number(provider)));
    try{void ct171DecorateSeen(false)}catch{};decorate226();return true;
  }catch(e){if(token===topTicket226&&host.isConnected)host.innerHTML=fail('Falha ao carregar Top 10: '+(e?.message||e),'discover');return true}
}
async function top226(left){
  const token=++topTicket226,{content}=ensureShell226('top10',left);if(!content)return false;
  try{discoverState.tab='top10';discoverState.type='all'}catch{}
  mark226('top10');syncTypeFilters226('top10');
  content.innerHTML=`<section class="ct171-top10-shell ct226-top10"><div class="ct171-top10-title"><h2>Top 10</h2></div><div class="ct171-provider-tabs" data-ct226-provider-tabs>${loading('Carregando streamings...')}</div><div data-ct226-top-content>${loading('Carregando Top 10...')}</div></section>`;
  dockFilter226();restoreRail226(left);
  try{
    ct171ProviderList=null;const providers=await ct171Providers();if(token!==topTicket226||tab226(discoverState?.tab)!=='top10')return true;
    if(!ct171TopProvider||!providers.some(x=>Number(x.provider_id)===Number(ct171TopProvider)))ct171TopProvider=Number(providers[0]?.provider_id||0);
    const box=document.querySelector('[data-ct226-provider-tabs]');if(box)box.innerHTML=providerHtml226(providers);
    if(ct171TopProvider)await paintTop226(ct171TopProvider,token);mark226('top10');dockFilter226();return true;
  }catch(e){const h=document.querySelector('[data-ct226-top-content]');if(h)h.innerHTML=fail('Falha ao carregar streamings: '+(e?.message||e),'discover');return true}
}
async function select226(value,opt={}){
  if(!isDiscover226())return false;
  const selected=tab226(value),left=Number.isFinite(opt.left)?opt.left:railLeft226(),my=++ticket226;
  try{discoverState.tab=selected;if(selected==='foryou')discoverState.type='all';if(opt.advanceNav!==false)++navSeq}catch{}
  mark226(selected);restoreRail226(left);
  if(selected==='top10')return top226(left);
  ++topTicket226;
  const {content}=ensureShell226(selected,left);if(!content)return false;syncTypeFilters226(selected);dockFilter226();
  let cached=null;try{const c=discoverCache.get(selected+':'+localDay());if(c&&typeof c.then!=='function')cached=c}catch{}
  if(cached)paintNormal226(selected,cached);else content.innerHTML=loading('Carregando títulos...');
  try{const rows=await rows226(selected);if(my!==ticket226||!isDiscover226()||tab226(discoverState?.tab)!==selected)return true;paintNormal226(selected,rows);restoreRail226(left);return true}
  catch(e){if(my===ticket226&&content.isConnected)content.innerHTML=fail('Falha ao carregar Descobrir: '+(e?.message||e),'discover');return true}
}
async function selectType226(value){let type=String(value||'all');if(!['all','movie','tv'].includes(type))type='all';try{discoverState.type=type}catch{};return select226(tab226(discoverState?.tab||'foryou'),{advanceNav:true,left:railLeft226()})}
window.ct214SelectDiscoverTab=select226;window.ct214SelectDiscoverType=selectType226;window.ctR226SelectDiscover=select226;
const renderBase226=renderDiscover;try{renderDiscover=async function(...args){if(!isDiscover226())return renderBase226.apply(this,args);ensureShell226(tab226(discoverState?.tab||'foryou'),0);return select226(tab226(discoverState?.tab||'foryou'),{advanceNav:false,left:0})}}catch{}

function pool226(key){const d=ct166ForYouData||{},f=d._ct166_fresh||d._ct186_fresh||{movie:[],series:[],anime:[]},w=d._ct166_watchlist||d._ct186_watchlist||{movie:[],series:[],anime:[]};if(key==='daily:movie')return f.movie||[];if(key==='fresh:movie')return f.movie||[];if(key==='fresh:series')return f.series||[];if(key==='fresh:anime')return f.anime||[];if(key==='watchlist:movie')return w.movie||[];if(key==='watchlist:series')return w.series||[];if(key==='watchlist:anime')return w.anime||[];return[]}
function swap226(btn){
  const key=String(btn.dataset.ct226Swap||''),slot=btn.closest('.ct166-slot,.foryou-slot');if(!key||!slot)return;
  const pool=pool226(key);if(pool.length<2)return;
  const current=String(slot.querySelector('[data-media]')?.dataset.media||'').split(':'),currentId=Number(current[1]||0);
  let next=null;for(let i=0;i<pool.length+1;i++){ct166SwapIndex[key]=Number(ct166SwapIndex[key]||0)+1;const excluded=key==='fresh:movie'?[Number(ct166Pick(pool226('daily:movie'),'daily:movie',[])?.id||0)]:[];next=ct166Pick(pool,key,excluded);if(Number(next?.id||0)!==currentId)break}
  if(!next||Number(next.id||0)===currentId)return;
  const label=slot.querySelector('.ct166-slot-head small,small')?.textContent?.trim()||'';const box=document.createElement('div');box.innerHTML=ct166Slot(label,next,key,pool.length);const fresh=box.firstElementChild;if(!fresh)return;
  slot.replaceWith(fresh);fresh.classList.add('ct226-swap-pulse');decorate226(fresh);
}
function watchlistSection226(btn){const sec=btn.closest('section');return String(sec?.querySelector('h2,h3')?.textContent||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim()==='da sua watchlist'}
function removeFresh226(type,id){
  const d=ct166ForYouData;if(!d)return null;const sources=[];for(const name of ['_ct166_fresh','_ct186_fresh'])if(d[name]&&typeof d[name]==='object')sources.push(d[name]);
  const backup=sources.map(s=>({s,movie:[...(s.movie||[])],series:[...(s.series||[])],anime:[...(s.anime||[])]}));
  for(const s of sources)for(const k of ['movie','series','anime'])s[k]=(s[k]||[]).filter(x=>Number(x?.id||0)!==Number(id));return backup;
}
function rollbackFresh226(backup){for(const b of backup||[]){b.s.movie=b.movie;b.s.series=b.series;b.s.anime=b.anime}}
function addWatch226(btn){
  if(btn.dataset.ct226Busy==='1')return;const raw=String(btn.dataset.ct226Watchlist||''),[type,id0]=raw.split(':'),id=Number(id0||0);if(!(id>0))return;
  btn.dataset.ct226Busy='1';btn.disabled=true;btn.textContent='✓ Na Watchlist';btn.classList.add('ct226-watch-ok');const card=btn.closest('.discover-card,.card,.ct166-slot');card?.classList.add('ct226-card-added');
  const foryou=tab226(discoverState?.tab)==='foryou',backup=foryou?removeFresh226(type,id):null;
  setTimeout(()=>{if(!isDiscover226())return;if(foryou&&ct166ForYouData){paintDiscover(ct166ForYouData);decorate226()}else{card?.remove()}},90);
  Promise.resolve(addWatchlist(type,id)).then(()=>{try{discoverCache.clear()}catch{};if(!foryou)setTimeout(()=>void select226(tab226(discoverState?.tab),{advanceNav:false,left:railLeft226()}),0)}).catch(err=>{rollbackFresh226(backup);if(foryou&&ct166ForYouData)paintDiscover(ct166ForYouData);else void select226(tab226(discoverState?.tab),{advanceNav:false,left:railLeft226()});try{toast(err?.message||String(err))}catch{}});
}

async function unsee226(btn){
  const raw=String(btn.dataset.ct226Unseen||''),[type,id0]=raw.split(':'),id=Number(id0||0);if(!(id>0)||btn.dataset.ct226Busy==='1')return;
  btn.dataset.ct226Busy='1';btn.disabled=true;btn.textContent='Desmarcando…';
  try{
    const m=await ensureMedia(type,id);await rpc('cinetracker_unmark_media_seen_v1',{p_media_id:Number(m.id),p_media_type:type,p_changed_at:new Date().toISOString()});
    homeCache=null;profileCache=null;discoverCache.clear();try{ct171SeenMap=null}catch{};try{ct186Unblock(type,id)}catch{};
    delete btn.dataset.ct226Unseen;btn.dataset.detailSeen=type+':'+id;btn.disabled=false;btn.classList.remove('on');btn.textContent='✓ Marcar como visto';
    const hero=btn.closest('.ct169-detail-hero,.detail-hero');hero?.querySelectorAll('.ct169-poster-state:not(.watch),.ct171-seen-badge').forEach(x=>x.remove());
    try{window.dispatchEvent(new CustomEvent('cinetracker:data-changed',{detail:{source:'r226-unseen',media_type:type,tmdb_id:id}}))}catch{};toast('Marcado como não assistido.');
  }catch(e){btn.disabled=false;btn.textContent='✓ Visto — desmarcar';toast(e?.message||String(e))}finally{delete btn.dataset.ct226Busy}
}
function decorateSeen226(root=document){
  for(const b of root.querySelectorAll?.('[data-detail-seen]')||[]){const raw=String(b.dataset.detailSeen||'');if(!/^(movie|tv):\d+$/.test(raw))continue;const seen=b.classList.contains('on')||b.disabled&&/visto/i.test(b.textContent||'');if(!seen)continue;delete b.dataset.detailSeen;b.dataset.ct226Unseen=raw;b.disabled=false;b.textContent='✓ Visto — desmarcar';b.classList.add('ct226-unseen')}
}
function dockFilter226(){
  if(!isDiscover226())return;const app=document.querySelector('#app')||document,root=document.querySelector('[data-discover]');if(!root)return;
  const input=app.querySelector('[data-global-search]');if(!input)return;const search=input.closest('.search-global,.top-search,.global-search')||input.parentElement;if(!search)return;
  const triggers=[...root.querySelectorAll('.ct-mini-filter-trigger,.ct198-filter-trigger')];if(!triggers.length)return;let trigger=triggers.find(x=>x.dataset.ct226Filter==='1')||triggers[0];
  for(const other of triggers)if(other!==trigger){const p=other.nextElementSibling;if(p?.matches?.('[data-ct-mini-filter="1"],[data-ct198-filter="1"],.ct-mini-filter-panel'))p.remove();other.remove()}
  let panel=trigger.nextElementSibling?.matches?.('[data-ct-mini-filter="1"],[data-ct198-filter="1"],.ct-mini-filter-panel')?trigger.nextElementSibling:null;
  let row=app.querySelector('[data-ct226-search-filter-row]');if(!row){row=document.createElement('div');row.className='ct226-search-filter-row';row.dataset.ct226SearchFilterRow='1';search.parentNode?.insertBefore(row,search);row.appendChild(search)}else if(search.parentElement!==row)row.prepend(search);
  trigger.dataset.ct226Filter='1';trigger.classList.add('ct226-filter-button');row.appendChild(trigger);if(panel){panel.classList.add('ct226-filter-panel');row.appendChild(panel)}
}
function decorate226(root=document){
  if(isDiscover226()){
    for(const b of root.querySelectorAll?.('[data-ct166-swap],[data-ct224-swap],[data-ct225-swap]')||[]){const key=b.dataset.ct225Swap||b.dataset.ct224Swap||b.dataset.ct166Swap;if(!key)continue;b.removeAttribute('data-ct166-swap');b.removeAttribute('data-ct224-swap');b.removeAttribute('data-ct225-swap');b.dataset.ct226Swap=key}
    for(const b of root.querySelectorAll?.('[data-discover-watch],[data-ct224-watchlist]')||[]){if(watchlistSection226(b))continue;const ref=b.dataset.ct224Watchlist||b.dataset.discoverWatch;if(!ref)continue;b.removeAttribute('data-discover-watch');b.removeAttribute('data-ct224-watchlist');b.dataset.ct226Watchlist=ref}
    dockFilter226();
  }
  decorateSeen226(root);
}

document.addEventListener('click',e=>{
  const p=e.target.closest?.('[data-ct226-provider]');if(p){e.preventDefault();e.stopImmediatePropagation();ct171TopProvider=Number(p.dataset.ct226Provider);void paintTop226(ct171TopProvider,topTicket226);return}
  const s=e.target.closest?.('[data-ct226-swap]');if(s){e.preventDefault();e.stopImmediatePropagation();swap226(s);return}
  const w=e.target.closest?.('[data-ct226-watchlist]');if(w){e.preventDefault();e.stopImmediatePropagation();addWatch226(w);return}
  const u=e.target.closest?.('[data-ct226-unseen]');if(u){e.preventDefault();e.stopImmediatePropagation();void unsee226(u);return}
},true);

const paintBase226=paintDiscover;try{paintDiscover=function(...args){const out=paintBase226.apply(this,args);decorate226();return out}}catch{}
const detailBase226=renderDetail;try{renderDetail=async function(...args){const out=await detailBase226.apply(this,args);decorate226();requestAnimationFrame(()=>decorate226());return out}}catch{}
try{new MutationObserver(ms=>{if(decorateFrame226)return;decorateFrame226=requestAnimationFrame(()=>{decorateFrame226=0;decorate226()})}).observe(document.querySelector('#app')||document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['class','disabled','data-detail-seen']})}catch{}

const style226=document.createElement('style');style226.id='ct-android-099754';style226.textContent=`
[data-page="discover"] .ct226-search-filter-row{display:grid!important;grid-template-columns:minmax(0,1fr) 36px!important;align-items:center!important;gap:7px!important;width:100%!important;margin-bottom:8px!important}
[data-page="discover"] .ct226-search-filter-row>.search-global,[data-page="discover"] .ct226-search-filter-row>.top-search,[data-page="discover"] .ct226-search-filter-row>.global-search{grid-column:1!important;grid-row:1!important;width:100%!important;min-width:0!important;margin:0!important}
[data-page="discover"] .ct226-search-filter-row>.ct226-filter-button{grid-column:2!important;grid-row:1!important;position:relative!important;display:inline-grid!important;place-items:center!important;width:36px!important;min-width:36px!important;height:36px!important;min-height:36px!important;margin:0!important;inset:auto!important}
[data-page="discover"] .ct226-search-filter-row>.ct226-filter-panel{grid-column:1/-1!important;grid-row:2!important;width:100%!important;margin:0!important}
[data-page="discover"] .ct226-swap-pulse{animation:ct226Swap .16s ease-out}
[data-page="discover"] .ct226-card-added{animation:ct226Added .1s ease-out}
.ct226-unseen{pointer-events:auto!important;opacity:1!important}
@keyframes ct226Swap{0%{opacity:.35;transform:translateX(9px) scale(.98)}100%{opacity:1;transform:none}}
@keyframes ct226Added{0%{transform:scale(.98);filter:brightness(1)}100%{transform:scale(1);filter:brightness(1.18)}}
`;
document.getElementById(style226.id)?.remove();document.head.appendChild(style226);requestAnimationFrame(()=>decorate226());
})();
