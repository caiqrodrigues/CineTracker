/* r190 Web — stateful actions + stricter PRA VOCE + route latency */
(() => {
'use strict';
if (window.__ctR190WebLoaded) return;
window.__ctR190WebLoaded = true;
window.__ctR190Web = 'fast-state-actions-sports-profile';
window.__ctWebRevision = 'r190-fast-state-actions';

const q190=(s,r=document)=>r?.querySelector?.(s)||null;
const qa190=(s,r=document)=>r?.querySelectorAll?[...r.querySelectorAll(s)]:[];
const norm190=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const esc190=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#39;'}[c]));
const route190=()=>{try{return String(route?.()||'').replace(/^\//,'')}catch{return String(location.pathname||'').replace(/^\//,'')||'home'}};
const id190=x=>Number(x?.tmdb_id||x?.id||x?.raw_tmdb?.source_tmdb_id||0);
const type190=x=>String(x?.media_type||x?.type||x?.raw_tmdb?.media_type||'').toLowerCase()==='movie'?'movie':'tv';
const key190=x=>{const id=id190(x);return id>0?type190(x)+':'+id:''};

/* ------------------------------------------------------------------
 * 1) PRA VOCE: strict "100% novos" and correct Watchlist actions.
 * ------------------------------------------------------------------ */
let lastForYou190=null;
let localSeen190=new Set();
let localWatch190=new Set();

function watchKeys190(data=lastForYou190){
  const out=new Set(localWatch190),pool=data?._ct186_watchlist||{};
  for(const kind of ['movie','series','anime'])for(const x of pool[kind]||[]){const k=key190(x);if(k)out.add(k)}
  const c=data?._ct186_context;
  try{for(const x of c?.watchlist?.movie||[]){const k=key190(x);if(k)out.add(k)}}catch{}
  try{for(const x of c?.watchlist?.series||[]){const k=key190(x);if(k)out.add(k)}}catch{}
  try{for(const x of c?.watchlist?.anime||[]){const k=key190(x);if(k)out.add(k)}}catch{}
  return out;
}
function historyKeys190(data=lastForYou190){
  const out=new Set(localSeen190),c=data?._ct186_context||{};
  try{for(const id of c.historyMovieIds||[])out.add('movie:'+Number(id))}catch{}
  try{for(const id of c.historyTvIds||[])out.add('tv:'+Number(id))}catch{}
  return out;
}
function looksMedia190(x){return !!(x&&typeof x==='object'&&id190(x)>0&&(x.title||x.name||x.original_title||x.original_name||x.media_type))}
function filterNewValue190(value,blocked,depth=0){
  if(depth>4||value==null)return value;
  if(Array.isArray(value))return value.map(x=>filterNewValue190(x,blocked,depth+1)).filter(Boolean);
  if(typeof value!=='object')return value;
  if(looksMedia190(value)&&blocked.has(key190(value)))return null;
  const out={...value};
  for(const [k,v] of Object.entries(value)){
    if(Array.isArray(v)||(['items','pool','reserve','alternatives','candidates','current','primary'].includes(k)&&v&&typeof v==='object'))out[k]=filterNewValue190(v,blocked,depth+1);
  }
  return out;
}
function sanitizeForYou190(data){
  if(!Array.isArray(data))return data;
  const blocked=new Set([...watchKeys190(data),...historyKeys190(data)]);
  const clone=data.map(g=>{
    if(String(g?.kind||'')!=='new'&&norm190(g?.title||'')!=='100 novos')return g;
    const ng={...g};
    if(g?.items&&typeof g.items==='object')ng.items=filterNewValue190(g.items,blocked,0);
    for(const k of ['movie','series','anime','pool','reserve','alternatives','candidates'])if(k in g)ng[k]=filterNewValue190(g[k],blocked,0);
    return ng;
  });
  for(const k of Object.keys(data))if(!/^\d+$/.test(k))try{clone[k]=data[k]}catch{}
  return clone;
}
function cachedForYou190(){
  if(lastForYou190)return lastForYou190;
  try{if(ct186ForYouData)return ct186ForYouData}catch{}
  try{const h=ct185CDiscoverHot?.get?.('foryou');if(h?.rows)return h.rows}catch{}
  return null;
}
function sectionTitle190(section){return norm190(q190('h2,h3',section)?.textContent||'')}
function decorateForYou190(data=lastForYou190){
  if(route190()!=='discover'||String(discoverState?.tab||'foryou')!=='foryou')return;
  const root=q190('[data-discover-content]')||q190('[data-discover]');if(!root)return;
  const history=historyKeys190(data);
  qa190('section.panel',root).forEach(section=>{
    if(sectionTitle190(section)!=='da sua watchlist')return;
    qa190('[data-discover-watch]',section).forEach(b=>{
      const [type,rawId]=String(b.dataset.discoverWatch||'').split(':');const id=Number(rawId||0);if(!(id>0))return;
      const k=(type==='movie'?'movie':'tv')+':'+id;
      b.removeAttribute('data-discover-watch');
      b.dataset.ct190Seen=type+':'+id;
      b.disabled=false;b.removeAttribute('aria-disabled');
      b.classList.remove('ct189-already-watchlist');
      b.classList.toggle('ct190-seen-active',history.has(k));
      b.textContent=history.has(k)?'✓ Visto':'✓ Marcar visto';
    });
  });
}
if(typeof paintDiscover==='function'){
  const paintDiscoverBase190=paintDiscover;
  paintDiscover=function(data){
    if(String(discoverState?.tab||'foryou')==='foryou'&&data){lastForYou190=data;try{ct186ForYouData=data;ct166ForYouData=data}catch{};data=sanitizeForYou190(data)}
    const out=paintDiscoverBase190(data);
    requestAnimationFrame(()=>decorateForYou190(lastForYou190||data));
    return out;
  };
}
/* r186 used to rebuild the entire recommendation graph after every click. Keep
 * the visible pool local and only revalidate once the interaction burst ends. */
let refreshTimer190=0;
try{
  if(typeof ct186RefreshVisible==='function'){
    ct186RefreshVisible=async function(){
      const d=cachedForYou190();
      if(d&&route190()==='discover'&&String(discoverState?.tab||'foryou')==='foryou')try{paintDiscover(d)}catch{}
      clearTimeout(refreshTimer190);
      refreshTimer190=setTimeout(async()=>{
        try{
          const fresh=typeof ct186LoadForYou==='function'?await ct186LoadForYou(true):null;
          if(fresh){lastForYou190=fresh;if(route190()==='discover'&&String(discoverState?.tab||'foryou')==='foryou')paintDiscover(fresh)}
        }catch{}
      },2200);
      return d;
    };
  }
}catch{}
window.addEventListener('click',e=>{
  const seen=e.target.closest?.('[data-ct190-seen]');if(!seen)return;
  e.preventDefault();e.stopImmediatePropagation();
  const [type,rawId]=String(seen.dataset.ct190Seen||'').split(':');const id=Number(rawId||0);if(!(id>0))return;
  const k=(type==='movie'?'movie':'tv')+':'+id;localSeen190.add(k);
  seen.classList.add('ct190-seen-active');seen.textContent='✓ Visto';seen.disabled=true;
  const data=cachedForYou190();if(data)requestAnimationFrame(()=>{try{paintDiscover(data)}catch{}});
  try{void Promise.resolve(markSeen(type,id)).catch(err=>{localSeen190.delete(k);toast(err?.message||String(err));if(data)try{paintDiscover(data)}catch{}})}catch(err){localSeen190.delete(k);toast(err?.message||String(err))}
},true);

/* ------------------------------------------------------------------
 * 2) SPORTS: one search only, and never destroy the input while typing.
 * ------------------------------------------------------------------ */
function hideGlobalSearchOnSports190(){
  const sports=route190()==='sports';
  try{if(topSearch)topSearch.style.display=sports?'none':''}catch{}
  for(const el of qa190('[data-top-search],.top-search,#top-search,.global-search')){
    if(el.closest?.('[data-sports]'))continue;
    if(sports)el.dataset.ct190Hidden='1',el.style.display='none';
    else if(el.dataset.ct190Hidden){delete el.dataset.ct190Hidden;el.style.display=''}
  }
}
if(typeof renderTopbar==='function'){
  const renderTopbarBase190=renderTopbar;
  renderTopbar=function(){const out=renderTopbarBase190.apply(this,arguments);hideGlobalSearchOnSports190();return out};
}
function tagSports190(){
  const root=q190('[data-sports]');if(!root)return;
  qa190('input[type="search"],input[type="text"],input:not([type])',root).forEach(x=>x.dataset.ct190SportsSearch='1');
}
function sportsInput190(input){return route190()==='sports'&&input instanceof HTMLInputElement&&!!input.closest?.('[data-sports]')}
function flattenSports190(v,out=[],seen=new Set(),depth=0){
  if(depth>6||!v||typeof v!=='object'||seen.has(v))return out;seen.add(v);
  if(Array.isArray(v)){for(const x of v)flattenSports190(x,out,seen,depth+1);return out}
  const name=v.name||v.title||v.player_name||v.team_name||v.competition_name||v.league_name||v.country_name;
  if(name)out.push({name:String(name),kind:String(v.entity_type||v.type||(v.player_name?'Jogador':v.team_name?'Clube / time':v.competition_name||v.league_name?'Liga / competição':'Esporte')),sport:String(v.sport_name||v.sport_slug||v.sport||''),country:String(v.country_name||v.country||''),raw:v});
  for(const [k,x] of Object.entries(v))if(k!=='raw'&&k!=='metadata')flattenSports190(x,out,seen,depth+1);
  return out;
}
function localSports190(term){
  const tokens=norm190(term).split(/\s+/).filter(Boolean);if(!tokens.length)return[];
  let all=[];try{all=flattenSports190(sportsCache)}catch{}
  const uniq=new Map();for(const x of all){const hay=norm190([x.name,x.kind,x.sport,x.country,x.raw?.short_name,x.raw?.abbreviation,x.raw?.aliases].filter(Boolean).join(' '));if(!tokens.every(t=>hay.includes(t)))continue;const k=norm190(x.kind)+'|'+norm190(x.name);if(!uniq.has(k))uniq.set(k,x)}
  return [...uniq.values()].slice(0,30);
}
function sportsHost190(input){
  const root=input.closest('[data-sports]');let host=q190('[data-ct190-sports-results]',root);
  if(!host){host=document.createElement('div');host.dataset.ct190SportsResults='1';host.className='ct190-sports-results';(input.closest('.panel,section')||input.parentElement)?.insertAdjacentElement('afterend',host)}
  return host;
}
function paintSports190(input,rows,term){
  if(!input?.isConnected)return;const host=sportsHost190(input);if(!host)return;
  if(!term){host.hidden=true;host.innerHTML='';return}host.hidden=false;
  host.innerHTML=rows.length?'<div class="ct190-sports-head"><b>Resultados da busca</b><small>'+rows.length+' encontrados</small></div>'+rows.map(x=>'<div class="ct190-sports-hit"><b>'+esc190(x.name)+'</b><small>'+esc190([x.kind,x.sport,x.country].filter(Boolean).join(' · '))+'</small></div>').join(''):'<div class="ct190-sports-empty">Nenhum resultado para “'+esc190(term)+'”.</div>';
}
let sportsTimer190=0;
window.addEventListener('input',e=>{
  const input=e.target;if(!sportsInput190(input))return;
  e.stopImmediatePropagation();clearTimeout(sportsTimer190);
  const term=input.value.trim();paintSports190(input,localSports190(term),term);
  sportsTimer190=setTimeout(async()=>{
    if(!term||!input.isConnected)return;
    try{
      const u=new URL('/api/sports',location.origin);u.searchParams.set('q',term);u.searchParams.set('query',term);u.searchParams.set('limit','40');
      const r=await fetch(u,{headers:{Accept:'application/json'},credentials:'same-origin'});if(!r.ok)return;
      const remote=flattenSports190(await r.json());const local=localSports190(term),tokens=norm190(term).split(/\s+/).filter(Boolean),map=new Map();
      for(const x of [...local,...remote]){const hay=norm190([x.name,x.kind,x.sport,x.country].join(' '));if(tokens.every(t=>hay.includes(t)))map.set(norm190(x.kind)+'|'+norm190(x.name),x)}
      if(input.value.trim()===term)paintSports190(input,[...map.values()].slice(0,30),term);
    }catch{}
  },260);
},true);

/* ------------------------------------------------------------------
 * 3) PROFILE: cache-first paint and multi-add favorites without closing.
 * ------------------------------------------------------------------ */
let profileAt190=0,profileTask190=null;
function usableProfile190(p){return !!(p&&typeof p==='object'&&(Object.keys(p.stats||{}).length||Array.isArray(p.favorite_movies)||Array.isArray(p.favorite_series)||Array.isArray(p.favorite_people)||Array.isArray(p.favorite_actors)))}
function cachedProfile190(){try{if(usableProfile190(profileCache))return profileCache}catch{};const p=window.__ct0997PreloadedProfile;return usableProfile190(p)?p:null}
function paintProfileFast190(p){
  if(!p)return false;
  try{
    profileCache=p;
    if(typeof ct168PaintProfile==='function'){
      if(!q190('[data-profile]'))setApp(shell('Perfil','Estatísticas, biblioteca, favoritos e atividade.','profile','<div class="page" data-profile></div>'));
      ct168PaintProfile(p,'');return true;
    }
    if(typeof paintProfile==='function'){paintProfile(p);return true}
  }catch{}
  return false;
}
async function refreshProfile190(force=false,repaint=true){
  if(!force&&profileAt190&&Date.now()-profileAt190<120000)return cachedProfile190();
  if(profileTask190)return profileTask190;
  profileTask190=(async()=>{
    const p=await rpc('cinetracker_profile_payload_v0997',{p_tz:typeof tz==='function'?tz():'America/Sao_Paulo'});
    if(p&&typeof p==='object'){
      profileCache={...(profileCache||{}),...p,sports_stats:p?.sports_stats||profileCache?.sports_stats||{}};
      window.__ct0997PreloadedProfile=profileCache;profileAt190=Date.now();
      if(repaint&&route190()==='profile'&&!q190('[data-profile-pick]'))paintProfileFast190(profileCache);
    }
    return profileCache;
  })().catch(()=>cachedProfile190()).finally(()=>{profileTask190=null});
  return profileTask190;
}
if(typeof renderProfile==='function'){
  const renderProfileBase190=renderProfile;
  renderProfile=async function(seq){
    const cached=cachedProfile190();
    if(cached&&paintProfileFast190(cached)){void refreshProfile190(false,true);return}
    const out=await renderProfileBase190(seq);profileAt190=Date.now();return out;
  };
}
function addFavoriteLocal190(kind,id,name,path){
  if(!profileCache||!(id>0))return;
  const field=kind==='movies'?'favorite_movies':kind==='series'?'favorite_series':'favorite_people';
  const row={tmdb_id:id,id,name,title:name,image_path:path||null,poster_path:path||null,profile_path:path||null};
  const old=Array.isArray(profileCache[field])?profileCache[field]:[];
  if(!old.some(x=>Number(x?.tmdb_id||x?.id||0)===id))profileCache[field]=[...old,row];
  window.__ct0997PreloadedProfile=profileCache;profileAt190=0;
}
window.addEventListener('click',e=>{
  const pick=e.target.closest?.('[data-profile-pick]');if(!pick)return;
  e.preventDefault();e.stopImmediatePropagation();
  if(pick.dataset.ct190Saving==='1'||pick.dataset.ct190Added==='1')return;
  const kind=String(pick.dataset.profilePick||''),id=Number(pick.dataset.id||0),name=String(pick.dataset.name||''),path=pick.dataset.path||null;if(!(id>0))return;
  pick.dataset.ct190Saving='1';pick.disabled=true;const old=pick.textContent;pick.textContent='…';
  void rpc('cinetracker_profile_set_favorite_v0997',{p_kind:kind,p_tmdb_id:id,p_name:name,p_image_path:path,p_remove:false}).then(()=>{
    delete pick.dataset.ct190Saving;pick.dataset.ct190Added='1';pick.disabled=true;pick.textContent='✓';pick.classList.add('ct190-added');
    addFavoriteLocal190(kind,id,name,path);toast('Favorito adicionado');
    clearTimeout(refreshTimer190);refreshTimer190=setTimeout(()=>void refreshProfile190(true,false),900);
  }).catch(err=>{delete pick.dataset.ct190Saving;pick.disabled=false;pick.textContent=old;toast(err?.message||String(err))});
},true);

/* ------------------------------------------------------------------
 * 4) MEDIA DETAILS: persisted favorite/seen/watchlist state is always visible.
 * ------------------------------------------------------------------ */
let stateContext190=null,stateContextAt190=0,stateContextTask190=null;
async function context190(force=false){
  if(!force&&stateContext190&&Date.now()-stateContextAt190<60000)return stateContext190;
  if(stateContextTask190)return stateContextTask190;
  stateContextTask190=(async()=>{const c=typeof ct186Context==='function'?await ct186Context(force):null;if(c){stateContext190=c;stateContextAt190=Date.now()}return c})().catch(()=>stateContext190).finally(()=>{stateContextTask190=null});
  return stateContextTask190;
}
function ctxSeen190(c,type,id){try{return (type==='movie'?c?.historyMovieIds:c?.historyTvIds)?.has?.(Number(id))||localSeen190.has((type==='movie'?'movie':'tv')+':'+id)}catch{return false}}
function ctxWatch190(c,type,id){
  const k=(type==='movie'?'movie':'tv')+':'+Number(id);if(localWatch190.has(k))return true;
  for(const bucket of type==='movie'?['movie']:['series','anime'])for(const x of c?.watchlist?.[bucket]||[])if(key190(x)===k)return true;
  return false;
}
function profileFavorite190(type,id){
  const p=cachedProfile190();const arr=type==='movie'?p?.favorite_movies:p?.favorite_series;
  return Array.isArray(arr)&&arr.some(x=>Number(x?.tmdb_id||x?.id||0)===Number(id));
}
function setDetailButtons190(type,id,c=null){
  const root=q190('.modal-card,.modal,.dialog,[role="dialog"]')||document;
  const seen=q190('[data-mark-seen="'+type+':'+id+'"]',root),watch=q190('[data-watch="'+type+':'+id+'"]',root),fav=q190('[data-favorite="'+type+':'+id+'"]',root);
  if(seen){const active=ctxSeen190(c,type,id);seen.classList.toggle('ct190-seen-active',active);seen.textContent=active?'✓ Visto':'✓ Marcar visto';seen.disabled=active}
  if(watch){const active=ctxWatch190(c,type,id);watch.classList.toggle('ct190-watch-active',active);watch.textContent=active?'✓ Na Watchlist':'＋ Watchlist';watch.disabled=active}
  if(fav){const active=profileFavorite190(type,id)||(/^\s*★?\s*Favorito\s*$/i.test(String(fav.textContent||'').trim()));fav.classList.toggle('ct190-fav-active',active);fav.textContent=active?'★ Favorito':'☆ Favoritar';fav.setAttribute('aria-pressed',active?'true':'false')}
}
if(typeof openMedia==='function'){
  const openMediaBase190=openMedia;
  openMedia=async function(type,id){
    const out=await openMediaBase190(type,id);type=type==='movie'?'movie':'tv';id=Number(id);
    setDetailButtons190(type,id,stateContext190);void context190(false).then(c=>{if(c)setDetailButtons190(type,id,c)});return out;
  };
}
window.addEventListener('click',e=>{
  const seen=e.target.closest?.('[data-mark-seen]');
  if(seen){
    e.preventDefault();e.stopImmediatePropagation();const [type,rawId]=String(seen.dataset.markSeen||'').split(':');const id=Number(rawId||0);if(!(id>0))return;
    localSeen190.add((type==='movie'?'movie':'tv')+':'+id);seen.classList.add('ct190-seen-active');seen.textContent='✓ Visto';seen.disabled=true;
    try{void Promise.resolve(markSeen(type,id)).then(()=>{stateContextAt190=0}).catch(err=>{toast(err?.message||String(err));seen.disabled=false})}catch(err){toast(err?.message||String(err));seen.disabled=false}return;
  }
  const watch=e.target.closest?.('[data-watch]');
  if(watch){
    e.preventDefault();e.stopImmediatePropagation();const [type,rawId]=String(watch.dataset.watch||'').split(':');const id=Number(rawId||0);if(!(id>0))return;
    localWatch190.add((type==='movie'?'movie':'tv')+':'+id);watch.classList.add('ct190-watch-active');watch.textContent='✓ Na Watchlist';watch.disabled=true;
    try{void Promise.resolve(addWatchlist(type,id)).then(()=>{stateContextAt190=0}).catch(err=>{localWatch190.delete((type==='movie'?'movie':'tv')+':'+id);toast(err?.message||String(err));watch.disabled=false;watch.textContent='＋ Watchlist'})}catch(err){toast(err?.message||String(err));watch.disabled=false}return;
  }
  const fav=e.target.closest?.('[data-favorite]');
  if(fav){
    e.preventDefault();e.stopImmediatePropagation();const [type,rawId]=String(fav.dataset.favorite||'').split(':');const id=Number(rawId||0);if(!(id>0))return;
    fav.disabled=true;
    void rpc('cinetracker_favorite_toggle_v0997',{p_media_type:type,p_tmdb_id:id}).then(resp=>{
      const active=resp?.is_favorite!==false;fav.classList.toggle('ct190-fav-active',active);fav.textContent=active?'★ Favorito':'☆ Favoritar';fav.setAttribute('aria-pressed',active?'true':'false');fav.disabled=false;profileAt190=0;void refreshProfile190(true,false);
    }).catch(err=>{fav.disabled=false;toast(err?.message||String(err))});return;
  }
},true);

window.addEventListener('cinetracker:data-changed',()=>{stateContextAt190=0;profileAt190=0});
function decorate190(){hideGlobalSearchOnSports190();tagSports190();decorateForYou190(lastForYou190)}
let decoTimer190=0;const observer190=new MutationObserver(()=>{clearTimeout(decoTimer190);decoTimer190=setTimeout(decorate190,20)});observer190.observe(document.documentElement,{childList:true,subtree:true});
window.addEventListener('popstate',()=>setTimeout(decorate190,0));window.addEventListener('hashchange',()=>setTimeout(decorate190,0));setTimeout(decorate190,20);

const style=document.createElement('style');style.id='ct190-web-style';style.textContent=`
.ct190-seen-active{border-color:#22c55e!important;background:rgba(34,197,94,.16)!important;color:#86efac!important}
.ct190-watch-active{border-color:#a855f7!important;background:rgba(168,85,247,.18)!important;color:#d8b4fe!important}
.ct190-fav-active{border-color:#ef4444!important;background:rgba(239,68,68,.16)!important;color:#fca5a5!important}
.ct190-added{border-color:#22c55e!important;color:#86efac!important}
.ct190-sports-results{border:1px solid #224b61;background:#07131b;border-radius:14px;padding:10px;margin:10px 0 14px}.ct190-sports-results[hidden]{display:none!important}.ct190-sports-head{display:flex;justify-content:space-between;gap:12px;margin-bottom:8px}.ct190-sports-head small{color:#7896a8}.ct190-sports-hit{border-top:1px solid #18384a;padding:8px 4px}.ct190-sports-hit:first-of-type{border-top:0}.ct190-sports-hit b,.ct190-sports-hit small{display:block}.ct190-sports-hit small{margin-top:3px;color:#82a1b2;font-size:9px}.ct190-sports-empty{padding:12px;text-align:center;color:#89a6b6}
`;
document.getElementById(style.id)?.remove();document.head.appendChild(style);
})();
