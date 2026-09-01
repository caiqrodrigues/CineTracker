/* r189 Web — cache-first authority + instant PRA VOCE actions */
(() => {
'use strict';
if (window.__ctR189WebLoaded) return;
window.__ctR189WebLoaded = true;
window.__ctR189Web = 'state-authority-cache-first-actions';
window.__ctWebRevision = 'r189-cache-first-actions';

const q189=(s,r=document)=>r?.querySelector?.(s)||null;
const qa189=(s,r=document)=>r?.querySelectorAll?[...r.querySelectorAll(s)]:[];
const norm189=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const esc189=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const route189=()=>{try{return String(route?.()||'').replace(/^\//,'')}catch{return String(location.pathname||'').replace(/^\//,'')||'home'}};

/* ------------------------------------------------------------------
 * Strict history authority from r187, but no forced 5k-row fetch per route.
 * The raw alias pass is cached and refreshed only after a real data change
 * or its TTL. This keeps imported/synthetic titles such as Dune/Duna safe.
 * ------------------------------------------------------------------ */
const HISTORY_TTL_189=60000;
let historyAliases189=new Set();
let historyIds189={movie:new Set(),tv:new Set()};
let historyAt189=0;
let historyTask189=null;

function type189(x){
  const t=String(x?.media_type||x?.type||x?.raw_tmdb?.media_type||'').toLowerCase();
  return t==='movie'?'movie':'tv';
}
function aliases189(x){
  const r=x?.raw_tmdb||{};
  return [x?.title,x?.name,x?.original_title,x?.original_name,r?.title,r?.name,r?.original_title,r?.original_name]
    .map(norm189).filter(Boolean);
}
function auth189(){try{return typeof authHeaders==='function'?authHeaders():{}}catch{return{}}}
function supa189(){try{return typeof SUPABASE_URL!=='undefined'?SUPABASE_URL:(window.SUPABASE_URL||'')}catch{return window.SUPABASE_URL||''}}
async function rawHistory189(force=false){
  if(!force&&historyAt189&&Date.now()-historyAt189<HISTORY_TTL_189)return true;
  if(historyTask189)return historyTask189;
  historyTask189=(async()=>{
    const base=supa189();if(!base)return false;
    const url=base+'/rest/v1/watch_history?select=item_type,title,media:media_id(tmdb_id,media_type,title,original_title,raw_tmdb)&order=watched_at.desc&limit=5000';
    const res=await fetch(url,{headers:{...auth189(),Accept:'application/json'}});
    if(!res.ok)throw new Error('history '+res.status);
    const rows=await res.json(),aliases=new Set(),ids={movie:new Set(),tv:new Set()};
    for(const row of rows||[]){
      const m=row?.media||{};
      const t=String(m?.media_type||row?.item_type||'').toLowerCase()==='movie'?'movie':'tv';
      const id=Number(m?.tmdb_id||0);if(id>0)ids[t].add(id);
      for(const value of [row?.title,m?.title,m?.original_title,m?.raw_tmdb?.title,m?.raw_tmdb?.name,m?.raw_tmdb?.original_title,m?.raw_tmdb?.original_name]){
        const n=norm189(value);if(!n)continue;
        aliases.add(t+':'+n);
        const baseName=n.replace(/\s+t\d+e\d+.*$/,'').trim();
        if(baseName)aliases.add(t+':'+baseName);
      }
    }
    historyAliases189=aliases;historyIds189=ids;historyAt189=Date.now();return true;
  })().catch(()=>false).finally(()=>{historyTask189=null});
  return historyTask189;
}
function rawHistoryHas189(x){
  const t=type189(x),id=Number(x?.id||x?.tmdb_id||x?.raw_tmdb?.source_tmdb_id||0);
  if(id>0&&historyIds189[t]?.has(id))return true;
  return aliases189(x).some(n=>historyAliases189.has(t+':'+n));
}

if(typeof ct186Context==='function'){
  const contextBase189=ct186Context;
  ct186Context=async function(force=false){
    const [c]=await Promise.all([contextBase189(force),rawHistory189(force)]);
    if(c){
      for(const id of historyIds189.movie)c.historyMovieIds?.add?.(id);
      for(const id of historyIds189.tv)c.historyTvIds?.add?.(id);
      for(const key of historyAliases189)c.historyAliases?.add?.(key);
    }
    return c;
  };
}
if(typeof ct186InHistory==='function'){
  const inHistoryBase189=ct186InHistory;
  ct186InHistory=function(x,c){return rawHistoryHas189(x)||inHistoryBase189(x,c)};
}

/* ------------------------------------------------------------------
 * PRA VOCE performance:
 * - navigation consumes a valid in-memory/hot snapshot immediately;
 * - strict authority revalidates in background, at most once per minute;
 * - first load still goes through r186 authority.
 * ------------------------------------------------------------------ */
const FORYOU_TTL_189=60000;
let forYouRefreshAt189=0;
let forYouRefreshTask189=null;

function cachedForYou189(){
  try{if(ct186ForYouData)return ct186ForYouData}catch{}
  try{
    const hot=ct185CDiscoverHot?.get?.('foryou');
    if(hot?.rows)return hot.rows;
  }catch{}
  try{
    const v=discoverCache?.get?.('r186:foryou:'+localDay());
    if(v&&typeof v.then!=='function')return v;
  }catch{}
  return null;
}
async function refreshForYou189(force=false){
  const cached=cachedForYou189();
  if(!force&&cached&&forYouRefreshAt189&&Date.now()-forYouRefreshAt189<FORYOU_TTL_189)return cached;
  if(forYouRefreshTask189)return forYouRefreshTask189;
  forYouRefreshTask189=(async()=>{
    await rawHistory189(force);
    const data=typeof ct186LoadForYou==='function'?await ct186LoadForYou(true):cached;
    if(data){
      forYouRefreshAt189=Date.now();
      try{ct186ForYouData=data}catch{}
      try{ct166ForYouData=data}catch{}
      try{ct185CDiscoverHot?.set?.('foryou',{at:Date.now(),rows:data})}catch{}
      if(route189()==='discover'&&String(discoverState?.tab||'foryou')==='foryou'){
        try{paintDiscover(data)}catch{}
      }
    }
    return data;
  })().catch(()=>cached||null).finally(()=>{forYouRefreshTask189=null});
  return forYouRefreshTask189;
}
if(typeof discoverRows==='function'){
  const rowsBase189=discoverRows;
  discoverRows=async function(tab){
    if(String(tab)==='foryou'){
      const cached=cachedForYou189();
      if(cached){
        try{ct186ForYouData=cached;ct166ForYouData=cached}catch{}
        void refreshForYou189(false);
        return cached;
      }
    }
    const rows=await rowsBase189(tab);
    if(String(tab)==='foryou'&&rows){
      forYouRefreshAt189=Date.now();
      try{ct186ForYouData=rows;ct166ForYouData=rows}catch{}
    }
    return rows;
  };
}

/* Keep current r186 data mirrored into the older r166 click/render path. */
function actualWatchKeys189(data){
  const out=new Set(),pool=data?._ct186_watchlist||{};
  for(const kind of ['movie','series','anime']){
    for(const x of pool[kind]||[]){
      try{
        const id=Number(x?.id||x?.tmdb_id||x?.raw_tmdb?.source_tmdb_id||0);
        const t=String(x?.media_type||'').toLowerCase()==='movie'?'movie':'tv';
        if(id>0)out.add(t+':'+id);
      }catch{}
    }
  }
  return out;
}
function decorateForYouActions189(data=cachedForYou189()){
  if(route189()!=='discover'||String(discoverState?.tab||'foryou')!=='foryou')return;
  const root=q189('[data-discover-content]')||q189('[data-discover]');if(!root)return;
  const watchKeys=actualWatchKeys189(data);
  qa189('[data-ct166-swap]',root).forEach(b=>{
    b.classList.add('ct189-swap');
    b.disabled=false;
  });
  qa189('section.panel',root).forEach(section=>{
    const title=norm189(q189('h2,h3',section)?.textContent||'');
    if(title!=='da sua watchlist')return;
    qa189('[data-discover-watch]',section).forEach(b=>{
      const [t,id]=String(b.dataset.discoverWatch||'').split(':');
      const key=(t==='movie'?'movie':'tv')+':'+Number(id||0);
      if(watchKeys.has(key)){
        b.textContent='✓ Na Watchlist';
        b.disabled=true;
        b.setAttribute('aria-disabled','true');
        b.classList.add('ct189-already-watchlist');
      }
    });
  });
}
if(typeof paintDiscover==='function'){
  const paintDiscoverBase189=paintDiscover;
  paintDiscover=function(data){
    if(String(discoverState?.tab||'foryou')==='foryou'&&data){
      try{ct186ForYouData=data}catch{}
      try{ct166ForYouData=data}catch{}
    }
    const out=paintDiscoverBase189(data);
    requestAnimationFrame(()=>decorateForYouActions189(data));
    return out;
  };
}

/* ------------------------------------------------------------------
 * PRA VOCE actions: entirely local first, network second.
 * Trocar never calls TMDB/Supabase. +Watchlist repaints from the already
 * loaded reserve pool immediately after r186 blocks the chosen TMDB.
 * ------------------------------------------------------------------ */
document.addEventListener('click',e=>{
  if(route189()!=='discover'||String(discoverState?.tab||'foryou')!=='foryou')return;

  const swap=e.target.closest?.('[data-ct166-swap]');
  if(swap){
    e.preventDefault();e.stopImmediatePropagation();
    const key=String(swap.dataset.ct166Swap||'');
    try{ct166SwapIndex[key]=Number(ct166SwapIndex[key]||0)+1}catch{}
    const data=cachedForYou189();
    if(data){
      try{ct186ForYouData=data;ct166ForYouData=data}catch{}
      try{paintDiscover(data)}catch{}
    }
    return;
  }

  const watch=e.target.closest?.('[data-discover-watch]');
  if(watch){
    if(watch.disabled)return;
    e.preventDefault();e.stopImmediatePropagation();
    const [type,rawId]=String(watch.dataset.discoverWatch||'').split(':');
    const id=Number(rawId||0);if(!(id>0))return;
    const data=cachedForYou189();
    watch.disabled=true;watch.textContent='✓ Salvando';
    let promise;
    try{
      promise=addWatchlist(type,id); /* r186 blocks synchronously before first await */
      if(data)requestAnimationFrame(()=>{try{paintDiscover(data)}catch{}});
    }catch(err){
      watch.disabled=false;watch.textContent='+ Watchlist';toast(err?.message||String(err));return;
    }
    void Promise.resolve(promise).catch(err=>{
      toast(err?.message||String(err));
      if(data)try{paintDiscover(data)}catch{}
    });
    return;
  }
},true);

/* ------------------------------------------------------------------
 * Home anchor from r187, without route-blocking network work.
 * ------------------------------------------------------------------ */
let anchorRun189=0;
function homeAnchor189(){
  if(route189()!=='home')return;
  const run=++anchorRun189;let cancelled=false;
  const cancel=()=>{cancelled=true};
  const opts={capture:true,passive:true,once:true};
  window.addEventListener('wheel',cancel,opts);
  window.addEventListener('touchstart',cancel,opts);
  window.addEventListener('pointerdown',cancel,opts);
  window.addEventListener('keydown',cancel,{capture:true,once:true});
  const pin=()=>{
    if(cancelled||run!==anchorRun189||route189()!=='home')return;
    const target=q189('.ct992-start,[data-ct992-start],[data-home-next],#assistir-a-seguir');
    if(!target)return;
    const top=Math.max(0,target.getBoundingClientRect().top+(window.scrollY||document.documentElement.scrollTop||0)-12);
    window.scrollTo({top,behavior:'auto'});
  };
  [0,70,180,420,800].forEach(ms=>setTimeout(pin,ms));
}

/* ------------------------------------------------------------------
 * Sports search from r187, tagged before first keystroke so old repaint
 * handlers cannot destroy the input node/focus.
 * ------------------------------------------------------------------ */
let sportsTimer189=0,sportsSeq189=0;
function tagSportsInputs189(){
  const root=q189('[data-sports]');if(!root)return;
  qa189('input[type="search"],input[type="text"],input:not([type])',root).forEach(input=>{input.dataset.sportsSearch='1'});
}
function sportsQuickInput189(el){
  if(!el||route189()!=='sports')return false;
  const text=norm189(el.closest?.('.panel,section,div')?.textContent||'');
  return Boolean(el.closest?.('[data-sports]')&&(el.dataset?.sportsSearch!=null||text.includes('filtro rapido')||String(el.placeholder||'').toLowerCase().includes('time')));
}
function flattenSports189(value,out=[],seen=new Set(),depth=0){
  if(depth>6||value==null||typeof value!=='object'||seen.has(value))return out;
  seen.add(value);
  if(Array.isArray(value)){for(const x of value)flattenSports189(x,out,seen,depth+1);return out}
  const name=value.name||value.title||value.player_name||value.team_name||value.competition_name||value.league_name||value.country_name;
  if(name){
    const kind=value.entity_type||value.type||(value.player_name?'Jogador':value.team_name?'Clube / time':value.competition_name||value.league_name?'Liga / competição':'Esporte');
    out.push({name:String(name),kind:String(kind),sport:value.sport_name||value.sport_slug||value.sport||'',country:value.country_name||value.country||'',raw:value});
  }
  for(const [k,v] of Object.entries(value))if(!['raw','metadata'].includes(k))flattenSports189(v,out,seen,depth+1);
  return out;
}
function scoreSports189(item,tokens){
  const hay=norm189([item.name,item.kind,item.sport,item.country,item.raw?.short_name,item.raw?.abbreviation,item.raw?.code,item.raw?.aliases].filter(Boolean).join(' '));
  if(!tokens.every(t=>hay.includes(t)))return-1;
  const n=norm189(item.name);let score=0;
  if(n===tokens.join(' '))score+=100;if(n.startsWith(tokens[0]))score+=40;
  for(const t of tokens)score+=n.includes(t)?20:hay.includes(t)?5:0;
  return score;
}
async function querySports189(term){
  const tokens=norm189(term).split(/\s+/).filter(Boolean);if(!tokens.length)return[];
  let all=[];try{all.push(...flattenSports189(sportsCache))}catch{}
  try{
    const u=new URL('/api/sports',location.origin);u.searchParams.set('q',term);u.searchParams.set('query',term);u.searchParams.set('limit','40');
    const r=await fetch(u,{headers:{Accept:'application/json'},credentials:'same-origin'});
    if(r.ok)all.push(...flattenSports189((await r.json())||[]));
  }catch{}
  const uniq=new Map();
  for(const x of all){const k=norm189(x.kind)+'|'+norm189(x.name)+'|'+norm189(x.sport);if(!uniq.has(k))uniq.set(k,x)}
  return [...uniq.values()].map(x=>({x,s:scoreSports189(x,tokens)})).filter(z=>z.s>=0).sort((a,b)=>b.s-a.s||a.x.name.localeCompare(b.x.name,'pt-BR')).slice(0,30).map(z=>z.x);
}
function sportsHost189(input){
  const root=input.closest('[data-sports]')||document.body;
  let host=q189('[data-ct189-sports-results]',root);
  if(!host){
    host=document.createElement('div');host.dataset.ct189SportsResults='1';host.className='ct189-sports-results';
    const panel=input.closest('.panel,section')||input.parentElement;panel?.insertAdjacentElement('afterend',host);
  }
  return host;
}
function paintSportsSearch189(input,rows,term){
  if(!input?.isConnected)return;
  const host=sportsHost189(input);if(!host)return;
  if(!term){host.innerHTML='';host.hidden=true;return}
  host.hidden=false;
  host.innerHTML=rows.length
    ?'<div class="ct189-sports-head"><b>Resultados da busca</b><small>'+rows.length+' encontrados</small></div><div class="ct189-sports-grid">'+rows.map(x=>'<div class="ct189-sports-hit"><b>'+esc189(x.name)+'</b><small>'+esc189([x.kind,x.sport,x.country].filter(Boolean).join(' · '))+'</small></div>').join('')+'</div>'
    :'<div class="ct189-sports-empty">Nenhum clube, liga, competição, jogador ou entidade encontrado para “'+esc189(term)+'”.</div>';
}
document.addEventListener('input',e=>{
  const input=e.target;if(!(input instanceof HTMLInputElement)||!sportsQuickInput189(input))return;
  e.stopImmediatePropagation();clearTimeout(sportsTimer189);
  const term=input.value.trim(),seq=++sportsSeq189;
  if(!term){paintSportsSearch189(input,[],term);return}
  sportsTimer189=setTimeout(async()=>{
    const rows=await querySports189(term);if(seq!==sportsSeq189)return;
    paintSportsSearch189(input,rows,term);
    requestAnimationFrame(()=>{try{input.focus({preventScroll:true});const n=input.value.length;input.setSelectionRange?.(n,n)}catch{}});
  },180);
},true);
if(typeof paintSports==='function'){
  const paintSportsBase189=paintSports;
  paintSports=function(p=sportsCache||{}){const out=paintSportsBase189(p);requestAnimationFrame(tagSportsInputs189);return out};
}

/* Data changes invalidate authority, not the visible route shell. */
window.addEventListener('cinetracker:data-changed',()=>{
  historyAt189=0;historyAliases189.clear();historyIds189={movie:new Set(),tv:new Set()};
  forYouRefreshAt189=0;
});

/* DOM-only decoration. No hover-triggered forced RPC/TMDB bursts. */
function decorate189(){
  if(route189()==='home')homeAnchor189();
  tagSportsInputs189();
  decorateForYouActions189();
  qa189('.panel,.ct91-setting,.ct128-setting,.setting-card').forEach(card=>{
    if(norm189(card.textContent||'').includes('manutencao e sincronizacao'))card.classList.add('ct189-maintenance-center');
  });
}
let decorateTimer189=0;
const observer189=new MutationObserver(()=>{clearTimeout(decorateTimer189);decorateTimer189=setTimeout(decorate189,25)});
observer189.observe(document.documentElement,{childList:true,subtree:true});
window.addEventListener('popstate',()=>setTimeout(decorate189,0));
window.addEventListener('hashchange',()=>setTimeout(decorate189,0));
window.addEventListener('pageshow',()=>setTimeout(decorate189,20));
setTimeout(decorate189,20);

const style=document.createElement('style');style.id='ct189-web-style';style.textContent=`
.ct189-swap{display:inline-flex!important;align-items:center!important;justify-content:center!important;width:auto!important;min-width:0!important;height:24px!important;min-height:24px!important;padding:3px 8px!important;margin:0!important;border-radius:999px!important;font-size:9px!important;line-height:1!important;white-space:nowrap!important}
.ct189-already-watchlist{opacity:.75!important;cursor:default!important}
.ct189-sports-results{border:1px solid #224b61;background:#07131b;border-radius:14px;padding:11px;margin:10px 0 14px}.ct189-sports-results[hidden]{display:none!important}.ct189-sports-head{display:flex;justify-content:space-between;gap:12px;align-items:center;margin-bottom:9px}.ct189-sports-head small{color:#7896a8}.ct189-sports-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:8px}.ct189-sports-hit{border:1px solid #24475a;background:#091a24;border-radius:10px;padding:9px}.ct189-sports-hit b{display:block;font-size:11px}.ct189-sports-hit small{display:block;margin-top:4px;color:#82a1b2;font-size:9px}.ct189-sports-empty{border:1px dashed #31576d;border-radius:10px;padding:14px;color:#89a6b6;text-align:center}
.ct189-maintenance-center{text-align:center!important}.ct189-maintenance-center .panel-head,.ct189-maintenance-center>.row,.ct189-maintenance-center .actions{justify-content:center!important}.ct189-maintenance-center .actions,.ct189-maintenance-center p,.ct189-maintenance-center small{margin-left:auto!important;margin-right:auto!important;text-align:center!important}
`;
document.getElementById(style.id)?.remove();document.head.appendChild(style);
})();
