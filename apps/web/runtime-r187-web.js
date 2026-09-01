/* r187 web — authoritative state on route entry + stable navigation/search */
(() => {
'use strict';
if (window.__ctR187WebLoaded) return;
window.__ctR187WebLoaded = true;
window.__ctR187Web = 'state-authority-home-anchor-sports-search-profile-warm';
window.__ctWebRevision = 'r187-state-authority';

const q = (s,r=document) => r?.querySelector?.(s) || null;
const qa = (s,r=document) => r?.querySelectorAll ? [...r.querySelectorAll(s)] : [];
const norm187 = v => String(v ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const esc187 = v => String(v ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const sleep187 = ms => new Promise(r=>setTimeout(r,ms));
const currentRoute187 = () => { try { return String(route?.() || '').replace(/^\//,''); } catch { return String(location.pathname||'').replace(/^\//,'') || 'home'; } };

/* ------------------------------------------------------------------
 * 1) PRA VOCE: never trust the old hot snapshot before fresh authority.
 * Raw watch_history aliases are also merged because old Showly imports can
 * still have synthetic media ids (for example an imported movie title).
 * ------------------------------------------------------------------ */
let historyAliases187 = new Set();
let historyIds187 = { movie:new Set(), tv:new Set() };
let historyAt187 = 0;
let historyTask187 = null;

function type187(x){
  const t=String(x?.media_type||x?.type||x?.raw_tmdb?.media_type||'').toLowerCase();
  return t==='movie'?'movie':'tv';
}
function aliases187(x){
  const r=x?.raw_tmdb||{};
  return [x?.title,x?.name,x?.original_title,x?.original_name,r?.title,r?.name,r?.original_title,r?.original_name]
    .map(norm187).filter(Boolean);
}
function addHistoryAlias187(type,value){
  const n=norm187(value); if(!n) return;
  historyAliases187.add(type+':'+n);
  /* history episode labels are sometimes "Name — T1E2" */
  const base=n.replace(/\s+t\d+e\d+.*$/,'').trim();
  if(base) historyAliases187.add(type+':'+base);
}
function auth187(){ try { return typeof authHeaders==='function' ? authHeaders() : {}; } catch { return {}; } }
function supa187(){ try { return typeof SUPABASE_URL!=='undefined' ? SUPABASE_URL : (window.SUPABASE_URL||''); } catch { return window.SUPABASE_URL||''; } }
async function rawHistory187(force=false){
  if(!force && Date.now()-historyAt187<15000 && historyAliases187.size) return true;
  if(historyTask187) return historyTask187;
  historyTask187=(async()=>{
    const base=supa187(); if(!base) return false;
    const url=base+'/rest/v1/watch_history?select=item_type,title,media:media_id(tmdb_id,media_type,title,original_title,raw_tmdb)&order=watched_at.desc&limit=5000';
    const res=await fetch(url,{headers:{...auth187(),Accept:'application/json'}});
    if(!res.ok) throw new Error('history '+res.status);
    const rows=await res.json();
    const a=new Set(), ids={movie:new Set(),tv:new Set()};
    for(const row of rows||[]){
      const m=row?.media||{};
      const t=String(m?.media_type||row?.item_type||'').toLowerCase()==='movie'?'movie':'tv';
      const id=Number(m?.tmdb_id||0); if(id>0) ids[t].add(id);
      for(const value of [row?.title,m?.title,m?.original_title,m?.raw_tmdb?.title,m?.raw_tmdb?.name,m?.raw_tmdb?.original_title,m?.raw_tmdb?.original_name]){
        const n=norm187(value); if(!n) continue; a.add(t+':'+n);
        const baseName=n.replace(/\s+t\d+e\d+.*$/,'').trim(); if(baseName) a.add(t+':'+baseName);
      }
    }
    historyAliases187=a; historyIds187=ids; historyAt187=Date.now(); return true;
  })().catch(()=>false).finally(()=>{historyTask187=null});
  return historyTask187;
}
function rawHistoryHas187(x){
  const t=type187(x), id=Number(x?.id||x?.tmdb_id||x?.raw_tmdb?.source_tmdb_id||0);
  if(id>0 && historyIds187[t]?.has(id)) return true;
  return aliases187(x).some(n=>historyAliases187.has(t+':'+n));
}

if(typeof ct186Context==='function'){
  const contextBase187=ct186Context;
  ct186Context=async function(force=false){
    const [c]=await Promise.all([contextBase187(force),rawHistory187(force)]);
    if(c){
      for(const id of historyIds187.movie)c.historyMovieIds?.add?.(id);
      for(const id of historyIds187.tv)c.historyTvIds?.add?.(id);
      for(const key of historyAliases187)c.historyAliases?.add?.(key);
    }
    return c;
  };
}
if(typeof ct186InHistory==='function'){
  const inHistoryBase187=ct186InHistory;
  ct186InHistory=function(x,c){ return rawHistoryHas187(x) || inHistoryBase187(x,c); };
}

async function freshForYou187(){
  try { ct186ContextValue=null; ct186ContextAt=0; } catch {}
  try { ct185CDirty?.add?.('discover'); ct185CDiscoverHot?.delete?.('foryou'); } catch {}
  try { discoverCache?.delete?.('r186:foryou:'+localDay()); discoverCache?.delete?.('foryou'); } catch {}
  await rawHistory187(true);
  if(typeof ct186LoadForYou==='function') return ct186LoadForYou(true);
  return null;
}

if(typeof discoverRows==='function'){
  const rowsBase187=discoverRows;
  discoverRows=async function(tab){
    if(String(tab)==='foryou'){
      const fresh=await freshForYou187();
      if(fresh) return fresh;
    }
    return rowsBase187(tab);
  };
}

/* Route entry invalidates only the For You hot snapshot; other Discover tabs keep
 * stale-while-revalidate behavior so navigation does not regress into loaders. */
if(typeof renderDiscover==='function'){
  const renderDiscoverBase187=renderDiscover;
  renderDiscover=async function(seq){
    if(String(discoverState?.tab||'foryou')==='foryou'){
      try { await freshForYou187(); } catch {}
    }
    return renderDiscoverBase187(seq);
  };
}

window.addEventListener('cinetracker:data-changed',()=>{
  historyAt187=0; historyAliases187.clear(); historyIds187={movie:new Set(),tv:new Set()};
  try { ct186ContextValue=null; ct186ContextAt=0; ct186ForYouData=null; } catch {}
  try { ct185CDirty?.add?.('discover'); ct185CDiscoverHot?.delete?.('foryou'); } catch {}
});

/* ------------------------------------------------------------------
 * 2) HOME: pin the initial viewport at Assistir a seguir after layout/posters
 * settle. Any real user scrolling cancels the pin immediately.
 * ------------------------------------------------------------------ */
let anchorRun187=0;
function homeAnchor187(){
  if(currentRoute187()!=='home') return;
  const run=++anchorRun187;
  let cancelled=false;
  const cancel=()=>{cancelled=true;};
  const opts={capture:true,passive:true,once:true};
  window.addEventListener('wheel',cancel,opts); window.addEventListener('touchstart',cancel,opts);
  window.addEventListener('pointerdown',cancel,opts); window.addEventListener('keydown',cancel,{capture:true,once:true});
  const pin=()=>{
    if(cancelled||run!==anchorRun187||currentRoute187()!=='home') return;
    const target=q('.ct992-start,[data-ct992-start],[data-home-next],#assistir-a-seguir');
    if(!target) return;
    const top=Math.max(0,target.getBoundingClientRect().top+(window.scrollY||document.documentElement.scrollTop||0)-12);
    window.scrollTo({top,behavior:'auto'});
  };
  [0,60,140,280,520,900,1400].forEach(ms=>setTimeout(pin,ms));
}

/* ------------------------------------------------------------------
 * 3) PROFILE: bypass the 24h persistent snapshot on route entry. Keep the
 * previous screen visible while the authoritative payload arrives.
 * ------------------------------------------------------------------ */
let profileFreshTask187=null, profileFreshAt187=0;
function rawRpc187(){
  try{return window.__ct0997PersistentPreloadRpc?.__ct0997Raw || window.sbRpc?.__ct0997Raw || null}catch{return null}
}
async function profileFresh187(force=false){
  if(!force && Date.now()-profileFreshAt187<15000 && profileCache) return profileCache;
  if(profileFreshTask187) return profileFreshTask187;
  const direct=rawRpc187();
  profileFreshTask187=(async()=>{
    const fn=direct || (typeof rpc==='function'?rpc:null); if(!fn) return profileCache||null;
    const zone=(()=>{try{return typeof tz==='function'?tz():Intl.DateTimeFormat().resolvedOptions().timeZone}catch{return'America/Sao_Paulo'}})();
    const full=await fn('cinetracker_profile_payload_v0997',{p_tz:zone});
    if(full&&typeof full==='object'){
      profileCache={...(profileCache||{}),...full,sports_stats:full?.sports_stats||profileCache?.sports_stats||{}};
      profileFreshAt187=Date.now();
    }
    return profileCache;
  })().catch(()=>profileCache||null).finally(()=>{profileFreshTask187=null});
  return profileFreshTask187;
}
if(typeof renderProfile==='function'){
  const renderProfileBase187=renderProfile;
  renderProfile=async function(seq){
    await profileFresh187(true);
    return renderProfileBase187(seq);
  };
}

/* ------------------------------------------------------------------
 * 4) SPORTS: keep the quick-search input node alive. The previous handler
 * repainted the whole sports page on each character and destroyed focus.
 * Search is accent/case/token tolerant and accepts API results when present,
 * with the loaded sports payload as an immediate fallback.
 * ------------------------------------------------------------------ */
let sportsTimer187=0, sportsSeq187=0;
function sportsQuickInput187(el){
  if(!el||currentRoute187()!=='sports')return false;
  const text=norm187(el.closest?.('.panel,section,div')?.textContent||'');
  return Boolean(el.closest?.('[data-sports]') && (text.includes('filtro rapido')||String(el.placeholder||'').toLowerCase().includes('time')||el.dataset?.sportsSearch!=null));
}
function flattenSports187(value,out=[],seen=new Set(),depth=0){
  if(depth>6||value==null)return out;
  if(typeof value!=='object')return out;
  if(seen.has(value))return out; seen.add(value);
  if(Array.isArray(value)){for(const x of value)flattenSports187(x,out,seen,depth+1);return out;}
  const name=value.name||value.title||value.player_name||value.team_name||value.competition_name||value.league_name||value.country_name;
  if(name){
    const kind=value.entity_type||value.type||(value.player_name?'Jogador':value.team_name?'Clube / time':value.competition_name||value.league_name?'Liga / competição':'Esporte');
    out.push({name:String(name),kind:String(kind),sport:value.sport_name||value.sport_slug||value.sport||'',country:value.country_name||value.country||'',id:value.entity_id||value.id||null,raw:value});
  }
  for(const [k,v] of Object.entries(value)) if(!['raw','metadata'].includes(k)) flattenSports187(v,out,seen,depth+1);
  return out;
}
function scoreSports187(item,tokens){
  const hay=norm187([item.name,item.kind,item.sport,item.country,item.raw?.short_name,item.raw?.abbreviation,item.raw?.code,item.raw?.aliases].filter(Boolean).join(' '));
  if(!tokens.every(t=>hay.includes(t)))return -1;
  const n=norm187(item.name); let score=0;
  if(n===tokens.join(' '))score+=100; if(n.startsWith(tokens[0]))score+=40;
  for(const t of tokens){if(n.includes(t))score+=20;else if(hay.includes(t))score+=5;}
  return score;
}
function normalizeSportsApi187(data){
  const source=data?.results||data?.entities||data?.items||data?.data||data||[];
  return flattenSports187(source);
}
async function querySports187(term){
  const tokens=norm187(term).split(/\s+/).filter(Boolean); if(!tokens.length)return[];
  let all=[];
  try{all.push(...flattenSports187(typeof sportsCache!=='undefined'?sportsCache:null));}catch{}
  try{
    const u=new URL('/api/sports',location.origin);u.searchParams.set('q',term);u.searchParams.set('query',term);u.searchParams.set('limit','40');
    const r=await fetch(u,{headers:{Accept:'application/json'},credentials:'same-origin'});if(r.ok)all.push(...normalizeSportsApi187(await r.json()));
  }catch{}
  const uniq=new Map();
  for(const x of all){const k=norm187(x.kind)+'|'+norm187(x.name)+'|'+norm187(x.sport);if(!uniq.has(k))uniq.set(k,x)}
  return [...uniq.values()].map(x=>({x,s:scoreSports187(x,tokens)})).filter(z=>z.s>=0).sort((a,b)=>b.s-a.s||a.x.name.localeCompare(b.x.name,'pt-BR')).slice(0,30).map(z=>z.x);
}
function sportsResultHost187(input){
  const root=input.closest('[data-sports]')||document.body;
  let host=q('[data-ct187-sports-results]',root);
  if(!host){host=document.createElement('div');host.dataset.ct187SportsResults='1';host.className='ct187-sports-results';const panel=input.closest('.panel,section')||input.parentElement;panel?.insertAdjacentElement('afterend',host);}
  return host;
}
function paintSportsSearch187(input,rows,term){
  if(!input?.isConnected)return;
  const host=sportsResultHost187(input); if(!host)return;
  if(!term){host.innerHTML='';host.hidden=true;return;}
  host.hidden=false;
  host.innerHTML=rows.length?'<div class="ct187-sports-head"><b>Resultados da busca</b><small>'+rows.length+' encontrados</small></div><div class="ct187-sports-grid">'+rows.map(x=>'<div class="ct187-sports-hit"><b>'+esc187(x.name)+'</b><small>'+esc187([x.kind,x.sport,x.country].filter(Boolean).join(' · '))+'</small></div>').join('')+'</div>':'<div class="ct187-sports-empty">Nenhum clube, liga, competição, jogador ou entidade encontrado para “'+esc187(term)+'”.</div>';
}
async function runSportsSearch187(input,term){
  const seq=++sportsSeq187;const rows=await querySports187(term);if(seq!==sportsSeq187)return;
  paintSportsSearch187(input,rows,term);requestAnimationFrame(()=>{try{input.focus({preventScroll:true});const n=input.value.length;input.setSelectionRange?.(n,n)}catch{}});
}
document.addEventListener('input',e=>{
  const input=e.target;if(!(input instanceof HTMLInputElement)||!sportsQuickInput187(input))return;
  e.stopImmediatePropagation();
  clearTimeout(sportsTimer187);const term=input.value.trim();
  if(!term){paintSportsSearch187(input,[],term);return;}
  sportsTimer187=setTimeout(()=>void runSportsSearch187(input,term),180);
},true);

/* ------------------------------------------------------------------
 * 5) Navigation warm-up: start the expensive request on intent so the click
 * normally lands on already available data instead of a blocking loader.
 * ------------------------------------------------------------------ */
function warmIntent187(target){
  const path=String(target?.dataset?.view||target?.dataset?.view991||target?.dataset?.route||target?.getAttribute?.('href')||'').toLowerCase();
  if(path.includes('profile'))void profileFresh187(false);
  else if(path.includes('discover'))void freshForYou187().catch(()=>{});
  else if(path.includes('sports')){try{if(typeof sportsPayload==='function')void sportsPayload(false)}catch{}}
  else if(path.includes('home')){try{void window.__ct0997PersistentPreloadWarm?.()}catch{}}
  const tab=target?.dataset?.discoverTab;
  if(tab){try{if(String(tab)==='foryou')void freshForYou187();else if(typeof ct185CWarmDiscoverTab==='function')void ct185CWarmDiscoverTab(tab)}catch{}}
}
document.addEventListener('pointerover',e=>warmIntent187(e.target.closest?.('button,a,[data-discover-tab]')),{passive:true});
document.addEventListener('touchstart',e=>warmIntent187(e.target.closest?.('button,a,[data-discover-tab]')),{passive:true,capture:true});

/* Observe route DOM changes for home anchoring and settings-only alignment. */
function decorate187(){
  if(currentRoute187()==='home')homeAnchor187();
  qa('.panel,.ct91-setting,.ct128-setting,.setting-card').forEach(card=>{
    const text=norm187(card.textContent||'');
    if(text.includes('manutencao e sincronizacao'))card.classList.add('ct187-maintenance-center');
  });
}
let decorateTimer187=0;
const observer187=new MutationObserver(()=>{clearTimeout(decorateTimer187);decorateTimer187=setTimeout(decorate187,30)});
observer187.observe(document.documentElement,{childList:true,subtree:true});
window.addEventListener('popstate',()=>setTimeout(decorate187,0));
window.addEventListener('hashchange',()=>setTimeout(decorate187,0));
window.addEventListener('pageshow',()=>{setTimeout(decorate187,20); if(currentRoute187()==='profile')void profileFresh187(true)});
setTimeout(decorate187,20);

const style=document.createElement('style');style.id='ct187-web-style';style.textContent=`
.ct187-sports-results{border:1px solid #224b61;background:#07131b;border-radius:14px;padding:11px;margin:10px 0 14px}.ct187-sports-results[hidden]{display:none!important}.ct187-sports-head{display:flex;justify-content:space-between;gap:12px;align-items:center;margin-bottom:9px}.ct187-sports-head small{color:#7896a8}.ct187-sports-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:8px}.ct187-sports-hit{border:1px solid #24475a;background:#091a24;border-radius:10px;padding:9px}.ct187-sports-hit b{display:block;font-size:11px}.ct187-sports-hit small{display:block;margin-top:4px;color:#82a1b2;font-size:9px}.ct187-sports-empty{border:1px dashed #31576d;border-radius:10px;padding:14px;color:#89a6b6;text-align:center}.ct187-maintenance-center{text-align:center!important}.ct187-maintenance-center .panel-head,.ct187-maintenance-center>.row,.ct187-maintenance-center .actions{justify-content:center!important}.ct187-maintenance-center .actions,.ct187-maintenance-center p,.ct187-maintenance-center small{margin-left:auto!important;margin-right:auto!important;text-align:center!important}
`;
document.getElementById(style.id)?.remove();document.head.appendChild(style);
})();
