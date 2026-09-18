/* CineTracker Web 1.0.103 r312 — auth refresh + Discover truth + Profile freshness + Sports filters. WEB ONLY. */
(()=>{
'use strict';
if(window.__ctR312)return;
window.__ctR312='jwt-refresh+discover-own-card+foryou-compact+profile-fresh+sport-heading-filters';
window.__ctR312Auth='proactive-refresh+single-401-retry';
window.__ctR312Discover='five-public-tabs-fail-closed+seen-watchlist-excluded+cached-tabs';
window.__ctR312ForYou='compact-176px-slots+full-copy+compact-actions';
window.__ctR312Profile='fresh-before-paint+stadium-button+favorite-actors-current';
window.__ctR312Sports='next-previous-heading-filter-all-payload-sports';
window.__ctR312Android='preserved-1.0.20-10062';

const R=window.__ctR288R263||{},M=window.__ctR295Test||{},R310=window.__ctR310||{};
const q=(s,r=document)=>r?.querySelector?.(s)||null,qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const rows=v=>Array.isArray(v)?v:[];
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const routeNow=()=>{try{return String(typeof route==='function'?route():'')}catch{return''}};
const typeOf=typeof R.type263==='function'?R.type263:(x=>String(x?.media_type||x?.type||'tv')==='movie'?'movie':'tv');
const idOf=typeof R.id263==='function'?R.id263:(x=>Number(x?.tmdb_id||x?.source_tmdb_id||x?.raw_tmdb?.source_tmdb_id||x?.id||0));
const titleOf=x=>String(x?.media_title||x?.title||x?.name||x?.raw_tmdb?.title||x?.raw_tmdb?.name||'Sem título');
const posterOf=x=>x?.poster_path||x?.raw_tmdb?.poster_path||null;
const yearOf=x=>String(x?.release_year||x?.release_date||x?.first_air_date||x?.raw_tmdb?.release_date||x?.raw_tmdb?.first_air_date||'').slice(0,4);
const scoreOf=x=>Number(x?.vote_average??x?.raw_tmdb?.vote_average??0);
const keyOf=x=>`${typeOf(x)==='movie'?'movie':'tv'}:${Number(idOf(x)||0)}`;
const validKey=k=>/^(movie|tv):[1-9]\d*$/.test(String(k||''));
const discover=R.discover263||null;
const host=()=>{try{return R.discoverHost263?.()||q('[data-ct263-discover-content]')}catch{return q('[data-ct263-discover-content]')}};
const PUBLIC=new Set(['trending','popular','new','anticipated','top']);
const TITLES={trending:'Em alta',popular:'Populares',new:'Novidades',anticipated:'Mais Aguardados',top:'Mais bem avaliados'};
let bridge=null;

function anime312(x){
 if(typeOf(x)==='movie')return false;
 const ids=[...(x?.genre_ids||[]),...(x?.raw_tmdb?.genre_ids||[]),...(Array.isArray(x?.genres)?x.genres.map(g=>Number(g?.id||0)):[])].map(Number);
 const lang=String(x?.original_language||x?.raw_tmdb?.original_language||'').toLowerCase();
 const countries=[...(x?.origin_country||[]),...(x?.raw_tmdb?.origin_country||[])].map(v=>String(v).toUpperCase());
 return ids.includes(16)&&(lang==='ja'||countries.includes('JP'));
}
const kindLabel312=x=>typeOf(x)==='movie'?'Filme':anime312(x)?'Anime':'Série';
function image312(p){if(!p)return'';try{if(typeof img==='function')return img(p,'w342')}catch{}return `https://image.tmdb.org/t/p/w342${p}`}

let personal312={at:0,seen:new Set(),watch:new Set()},personalTask312=null;
function addKeys312(set,list){for(const x of rows(list)){const k=keyOf(x);if(validKey(k))set.add(k)}}
async function personalAuthority312(force=false){
 if(bridge?.personal)return bridge.personal(force);
 if(!force&&personal312.at&&Date.now()-personal312.at<30000)return personal312;
 if(personalTask312&&!force)return personalTask312;
 personalTask312=(async()=>{
  /* Direct RPC is intentionally not swallowed: if personal state cannot be proven,
     public recommendations do not paint unfiltered content. */
  const proofP=rpc('cinetracker_recommendation_state_v108',{});
  const authorityP=Promise.resolve(M.authority?.(true));
  const watchP=Promise.resolve(R310.canonicalWatchlist?.(true));
  const [raw,a,w]=await Promise.all([proofP,authorityP,watchP]);
  if(!raw||!a)throw new Error('Não foi possível validar vistos e Watchlist.');
  const seen=new Set(a?.seen||[]),watch=new Set(a?.watch||[]);
  addKeys312(seen,raw?.hard_excluded);addKeys312(seen,raw?.seen);addKeys312(seen,raw?.watched);addKeys312(seen,raw?.history);
  addKeys312(watch,raw?.watchlist);for(const k of w?.keys||[])watch.add(String(k));
  personal312={at:Date.now(),seen,watch};return personal312;
 })().finally(()=>personalTask312=null);
 return personalTask312;
}
function filterPublic312(list,p=personal312){
 const dup=new Set(),out=[];
 for(const x of rows(list)){
  const k=keyOf(x);if(!validKey(k)||dup.has(k))continue;dup.add(k);
  if(p?.seen?.has?.(k)||p?.watch?.has?.(k))continue;
  out.push(x);
 }
 return out;
}
function card312(x){
 const k=keyOf(x),poster=posterOf(x),year=yearOf(x),score=scoreOf(x),meta=[year,kindLabel312(x),score>0?`★ ${score.toFixed(1)}`:''].filter(Boolean).join(' · ');
 return `<article class="ct312-discover-item" data-ct312-item="${esc(k)}"><button type="button" class="ct312-media" data-media="${esc(k)}" aria-label="Abrir ${esc(titleOf(x))}"><span class="ct312-poster">${poster?`<img src="${esc(image312(poster))}" alt="" loading="lazy" decoding="async">`:'<span class="ct312-poster-empty"></span>'}</span><span class="ct312-copy"><b title="${esc(titleOf(x))}">${esc(titleOf(x))}</b><small title="${esc(meta)}">${esc(meta)}</small></span></button><div class="ct312-actions"><button type="button" class="chip" data-ct312-action="watchlist" data-media="${esc(k)}">+ Watchlist</button><button type="button" class="chip" data-ct312-action="seen" data-media="${esc(k)}">✓ Visto</button></div></article>`;
}
function paintPublic312(list,tab){
 const h=host();if(!h)return false;const clean=filterPublic312(list);
 h.innerHTML=`<section class="panel ct312-public" data-ct312-public="${esc(tab)}"><div class="panel-head"><h2>${esc(TITLES[tab]||'Descobrir')}</h2><small>${clean.length}</small></div><div class="ct312-scroll"><div class="ct312-rail">${clean.map(card312).join('')||'<div class="empty">Nenhum item elegível no momento.</div>'}</div></div></section>`;
 h.dataset.ct312Owned='public';return true;
}

const sourceCache312=new Map(),viewCache312=new Map();let publicGen312=0,prefetchScheduled312=false;
const cacheKey312=tab=>`${String(discover?.type||'all')}|${tab}`;
async function sourcePublic312(tab,force=false){
 const k=cacheKey312(tab),old=sourceCache312.get(k);if(!force&&old&&Date.now()-old.at<120000)return old.rows;
 let v;
 if(bridge?.source)v=rows(await bridge.source(tab,force));
 else{const fn=window.__ctR300Test?.sourceRows300;if(typeof fn!=='function')throw new Error('Fonte pública indisponível.');v=rows(await fn(tab))}
 sourceCache312.set(k,{at:Date.now(),rows:v});return v;
}
function prefetch312(current){
 if(prefetchScheduled312)return;prefetchScheduled312=true;
 const run=async()=>{for(const tab of [...PUBLIC].filter(x=>x!==current)){try{await sourcePublic312(tab,false)}catch{}}prefetchScheduled312=false};
 try{if('requestIdleCallback'in window)requestIdleCallback(()=>void run(),{timeout:1600});else setTimeout(()=>void run(),180)}catch{void run()}
}
async function buildPublic312(tab,force=false,{quiet=false}={}){
 if(!discover||!PUBLIC.has(String(tab))||routeNow()!=='discover')return false;
 const gen=++publicGen312,h=host(),k=cacheKey312(tab),cached=viewCache312.get(k);
 if(cached&&!force){paintPublic312(cached.rows,tab);if(Date.now()-cached.at<45000){prefetch312(tab);return true}quiet=true}
 if(!quiet&&!cached&&h)h.innerHTML='<div class="ct263-loading ct312-loading">Carregando títulos…</div>';
 try{
  const [p,raw]=await Promise.all([personalAuthority312(!!force),sourcePublic312(tab,!!force)]);
  if(gen!==publicGen312||routeNow()!=='discover'||String(discover.tab)!==String(tab))return false;
  const clean=filterPublic312(raw,p);viewCache312.set(k,{at:Date.now(),rows:clean});paintPublic312(clean,tab);prefetch312(tab);return true;
 }catch(e){
  if(gen===publicGen312&&!cached&&h)h.innerHTML=`<div class="empty ct312-personal-error">Não foi possível validar sua biblioteca agora.<br><small>${esc(e?.message||e)}</small><br><button type="button" class="chip" data-ct312-retry>Tentar novamente</button></div>`;
  return false;
 }
}
const prevLoad312=window.__ctR288LoadDiscover;
async function loadDiscover312(tab=discover?.tab,force=false){
 const t=String(tab||discover?.tab||'foryou');if(!discover)return prevLoad312?.apply(this,arguments);
 discover.tab=t;try{ct288SyncShell?.()}catch{}
 if(PUBLIC.has(t)){discover.gen=Number(discover.gen||0)+1;void buildPublic312(t,!!force);return}
 return prevLoad312?.apply(this,arguments);
}
try{loadDiscover263=loadDiscover312}catch{}window.__ctR288LoadDiscover=loadDiscover312;

async function action312(btn){
 if(!btn||btn.disabled)return false;const action=String(btn.dataset.ct312Action||''),raw=String(btn.dataset.media||''),[type,idRaw]=raw.split(':'),id=Number(idRaw||0);if(!id)return false;
 const item=btn.closest?.('[data-ct312-item]');btn.disabled=true;const old=btn.textContent;btn.textContent='…';
 try{
  if(action==='watchlist'){if(bridge?.addWatchlist)await bridge.addWatchlist(type,id);else await addWatchlist(type,id)}
  else if(action==='seen'){if(bridge?.markSeen)await bridge.markSeen(type,id);else await markSeen(type,id)}
  else return false;
  item?.remove();personal312={at:0,seen:new Set(),watch:new Set()};personalTask312=null;sourceCache312.clear();viewCache312.clear();try{R310.invalidateWatch?.()}catch{}
  document.dispatchEvent(new CustomEvent('cinetracker:data-changed',{detail:{source:'r312-discover',action,type,id}}));
  void buildPublic312(String(discover?.tab||''),true,{quiet:true});return true;
 }catch(e){btn.disabled=false;btn.textContent=old;try{toast(e?.message||String(e))}catch{};return false}
}
function decorateSportsFilters312(){
 const root=q('[data-ct255-sports]');if(!root)return false;
 const active=q('[data-ct255-sport-tab].active',root),tab=String(active?.dataset?.ct255SportTab||'');
 const head=q('.ct255-sports-feed .panel-head',root);if(!head)return false;
 q('.ct312-sport-filter-rail',head)?.remove();
 if(tab!=='next'&&tab!=='previous')return true;
 const catalog=rows(window.__ctR312SportsCatalog),seen=new Set(),all=[];
 for(const s of catalog){const slug=String(s?.slug||'');if(!slug||seen.has(slug))continue;seen.add(slug);all.push({slug,name:String(s?.name||slug).replace(/_/g,' '),icon:String(s?.icon||'🏆')})}
 if(!all.length){for(const card of qa('[data-ct312-sport]',root)){const slug=String(card.dataset.ct312Sport||'');if(!slug||seen.has(slug))continue;seen.add(slug);all.push({slug,name:card.dataset.ct312SportName||slug,icon:card.dataset.ct312SportIcon||'🏆'})}}
 const current=String(window.__ctR312SportSelected||'all'),rail=document.createElement('div');rail.className='ct312-sport-filter-rail';rail.setAttribute('role','group');rail.setAttribute('aria-label','Filtrar por esporte');
 rail.innerHTML='<button type="button" class="chip '+(current==='all'?'active':'')+'" data-ct255-sport-filter="all">Todos</button>'+all.map(s=>'<button type="button" class="chip '+(current===s.slug?'active':'')+'" data-ct255-sport-filter="'+esc(s.slug)+'">'+esc(s.icon)+' '+esc(s.name)+'</button>').join('');
 const title=q('h2',head);if(title)title.insertAdjacentElement('afterend',rail);else head.prepend(rail);
 head.classList.add('ct312-sports-head');return true;
}

function invalidate312(){
 personal312={at:0,seen:new Set(),watch:new Set()};personalTask312=null;viewCache312.clear();
 try{profileCache=null;localStorage.removeItem('cinetracker:preload:r163:profile')}catch{}
}
document.addEventListener('cinetracker:data-changed',invalidate312);

/* Force every Profile navigation to fetch its canonical payload. Cached Profile may
   remain a fallback inside the canonical renderer but is never painted before it. */
try{if(typeof renderProfile==='function'){const base=renderProfile;renderProfile=async function(){try{profileCache=null}catch{};const out=await base.apply(this,arguments);return out}}}catch{}

function early312(target){
 const action=target?.closest?.('[data-ct312-action]');if(action){void action312(action);return true}
 const retry=target?.closest?.('[data-ct312-retry]');if(retry){void buildPublic312(String(discover?.tab||''),true);return true}
 const tab=target?.closest?.('[data-ct263-discover-tab]');if(tab){const t=String(tab.dataset.ct263DiscoverTab||'');if(PUBLIC.has(t)){if(discover)discover.tab=t;try{ct288SyncShell?.()}catch{}void buildPublic312(t,false);return true}}
 return false;
}
window.__ctR312EarlyHandle=early312;

const style=document.createElement('style');style.id='ct-web-r312-video-truth';style.textContent=`
/* Public Discover owns complete card geometry; nothing is clipped below the poster. */
.ct312-public{box-sizing:border-box!important;overflow:visible!important;height:auto!important;max-height:none!important}
.ct312-scroll{box-sizing:border-box!important;display:block!important;width:100%!important;max-width:100%!important;overflow-x:auto!important;overflow-y:hidden!important;padding:2px 2px 12px!important;scrollbar-width:thin!important;overscroll-behavior-x:contain!important}
.ct312-rail{display:flex!important;flex-flow:row nowrap!important;align-items:flex-start!important;gap:12px!important;width:max-content!important;min-width:100%!important;height:auto!important;min-height:0!important}
.ct312-discover-item{box-sizing:border-box!important;display:flex!important;flex:0 0 172px!important;width:172px!important;min-width:172px!important;max-width:172px!important;flex-direction:column!important;align-items:stretch!important;height:auto!important;min-height:0!important;overflow:visible!important}
.ct312-media{box-sizing:border-box!important;display:block!important;width:100%!important;padding:0!important;margin:0!important;border:0!important;background:transparent!important;color:inherit!important;text-align:left!important;cursor:pointer!important}
.ct312-poster{display:block!important;width:100%!important;aspect-ratio:2/3!important;border-radius:12px!important;overflow:hidden!important;background:#232a36!important}
.ct312-poster img,.ct312-poster-empty{display:block!important;width:100%!important;height:100%!important;object-fit:cover!important}
.ct312-copy{display:block!important;box-sizing:border-box!important;width:100%!important;min-height:53px!important;padding:7px 1px 0!important;overflow:visible!important}
.ct312-copy b{display:-webkit-box!important;-webkit-box-orient:vertical!important;-webkit-line-clamp:2!important;white-space:normal!important;overflow:hidden!important;text-overflow:ellipsis!important;line-height:1.18!important;min-height:2.36em!important;overflow-wrap:anywhere!important}
.ct312-copy small{display:block!important;margin-top:4px!important;white-space:normal!important;overflow:visible!important;text-overflow:clip!important;line-height:1.2!important;opacity:.76!important;font-size:11px!important;min-height:1.2em!important}
.ct312-actions{box-sizing:border-box!important;display:grid!important;grid-template-columns:1fr 1fr!important;gap:5px!important;width:100%!important;margin-top:7px!important;position:static!important}
.ct312-actions .chip{box-sizing:border-box!important;position:static!important;inset:auto!important;width:100%!important;min-width:0!important;height:31px!important;min-height:31px!important;padding:4px 5px!important;margin:0!important;border-radius:9px!important;font-size:11px!important;line-height:1!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}

/* Pra Você: three compact slots, not three giant page columns. */
[data-ct309-foryou] .ct309-fy-block,[data-ct308-foryou] .ct308-fy-block{overflow:visible!important}
[data-ct309-foryou] .ct309-fy-grid,[data-ct308-foryou] .ct308-fy-grid{box-sizing:border-box!important;display:flex!important;flex-flow:row nowrap!important;justify-content:flex-start!important;align-items:flex-start!important;gap:12px!important;width:100%!important;max-width:100%!important;overflow-x:auto!important;overflow-y:hidden!important;padding:2px 2px 10px!important}
[data-ct309-foryou] .ct309-fy-grid>.ct309-slot,[data-ct308-foryou] .ct308-fy-grid>.ct308-slot{box-sizing:border-box!important;flex:0 0 176px!important;width:176px!important;min-width:176px!important;max-width:176px!important}
[data-ct309-foryou] .ct309-daily-card{width:176px!important;max-width:176px!important}
[data-ct309-foryou] .ct288-card,[data-ct308-foryou] .ct288-card{height:auto!important;max-height:none!important;overflow:visible!important}
[data-ct309-foryou] .ct288-copy b,[data-ct308-foryou] .ct288-copy b{display:-webkit-box!important;-webkit-box-orient:vertical!important;-webkit-line-clamp:2!important;white-space:normal!important;min-height:2.3em!important;line-height:1.15!important}
[data-ct309-foryou] .ct288-copy small,[data-ct308-foryou] .ct288-copy small{white-space:normal!important;overflow:visible!important;text-overflow:clip!important;min-height:2.2em!important}
[data-ct309-foryou] .ct309-actions{grid-template-columns:1fr 1fr!important;gap:5px!important;width:100%!important}
[data-ct309-foryou] .ct309-actions .chip{height:30px!important;min-height:30px!important;width:100%!important;min-width:0!important;padding:4px 5px!important;font-size:11px!important}
[data-ct309-foryou] .ct309-actions .ct309-swap{grid-column:1/-1!important;height:28px!important;min-height:28px!important}

/* All requested clickable Profile stats share one immutable visual contract. */
.ct312-stat-button,[data-profile] [data-ct117-watchlist-stat],[data-profile] [data-ct299-history]{box-sizing:border-box!important;position:relative!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;min-height:58px!important;padding:10px 12px!important;border:1px solid var(--border,#23465a)!important;border-radius:10px!important;background:var(--panel-2,#0e1b23)!important;color:inherit!important;text-align:center!important;cursor:pointer!important;box-shadow:none!important;transform:none!important;transition:border-color .15s ease,background .15s ease!important}
.ct312-stat-button:hover,.ct312-stat-button:focus-visible,[data-profile] [data-ct117-watchlist-stat]:hover,[data-profile] [data-ct117-watchlist-stat]:focus-visible,[data-profile] [data-ct299-history]:hover,[data-profile] [data-ct299-history]:focus-visible{background:var(--panel-3,#122633)!important;border-color:var(--accent,#2f83a8)!important;outline:none!important;transform:none!important}
.ct312-stat-button::before,.ct312-stat-button::after,[data-profile] [data-ct117-watchlist-stat]::before,[data-profile] [data-ct117-watchlist-stat]::after,[data-profile] [data-ct299-history]::before,[data-profile] [data-ct299-history]::after{content:none!important;display:none!important}.ct312-stat-button :is(.ct117-stat-chevron,.stat-link-icon,.stat-arrow,.open-arrow,.profile-card-arrow,[data-open-arrow],[data-profile-open-icon]),[data-profile] [data-ct117-watchlist-stat] :is(.ct117-stat-chevron,.stat-link-icon,.stat-arrow,.open-arrow,.profile-card-arrow),[data-profile] [data-ct299-history] :is(.stat-arrow,.open-arrow,.profile-card-arrow){display:none!important}

.ct255-sport-filters{display:none!important}
/* Sports filter lives with Próximos/Anteriores title, using every sport from payload. */
.ct312-sports-head{align-items:flex-start!important;gap:10px!important}.ct312-sports-head-main{display:flex!important;align-items:center!important;gap:10px!important;min-width:0!important;flex:1 1 auto!important}
.ct312-sport-filter-rail{display:flex!important;flex-flow:row nowrap!important;gap:6px!important;min-width:0!important;max-width:min(76vw,920px)!important;overflow-x:auto!important;overflow-y:hidden!important;padding:2px 2px 5px!important;scrollbar-width:thin!important}
.ct312-sport-filter-rail .chip{flex:0 0 auto!important;min-height:30px!important;padding:5px 9px!important;white-space:nowrap!important}
@media(max-width:760px){.ct312-discover-item{flex-basis:154px!important;width:154px!important;min-width:154px!important;max-width:154px!important}.ct312-sports-head-main{align-items:flex-start!important;flex-direction:column!important}.ct312-sport-filter-rail{max-width:100%!important;width:100%!important}}
`;document.head.appendChild(style);

window.__ctR312={personalAuthority:personalAuthority312,filterPublic:filterPublic312,paintPublic:paintPublic312,buildPublic:buildPublic312,loadDiscover:loadDiscover312,card:card312,invalidate:invalidate312,decorateSportsFilters:decorateSportsFilters312,setTestBridge(v){bridge=v&&typeof v==='object'?v:null},version:'1.0.103'};
window.__ctR312Test={filterPublic312,card312,paintPublic312,kindLabel312,early312,decorateSportsFilters312,setPersonal(v){personal312={at:Date.now(),seen:new Set(v?.seen||[]),watch:new Set(v?.watch||[])}},clearCaches(){sourceCache312.clear();viewCache312.clear();personal312={at:0,seen:new Set(),watch:new Set()}},setTestBridge(v){bridge=v&&typeof v==='object'?v:null}};
})();