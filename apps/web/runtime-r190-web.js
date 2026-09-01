/* r190 Web — non-blocking state authority + correct actions + stable search */
(() => {
'use strict';
if (window.__ctR190WebLoaded) return;
window.__ctR190WebLoaded = true;
window.__ctR190Web = 'state-actions-performance';
window.__ctWebRevision = 'r190-state-actions-performance';

const q190=(s,r=document)=>r?.querySelector?.(s)||null;
const qa190=(s,r=document)=>r?.querySelectorAll?[...r.querySelectorAll(s)]:[];
const norm190=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const esc190=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const route190=()=>{try{return String(route?.()||'').replace(/^\//,'')}catch{return String(location.pathname||'').replace(/^\//,'')||'home'}};
const type190=x=>String(x?.media_type||x?.type||x?.raw_tmdb?.media_type||'').toLowerCase()==='movie'?'movie':'tv';
const id190=x=>Number(x?.id||x?.tmdb_id||x?.raw_tmdb?.source_tmdb_id||0);
const aliases190=x=>{const r=x?.raw_tmdb||{};return[x?.title,x?.name,x?.original_title,x?.original_name,r?.title,r?.name,r?.original_title,r?.original_name].map(norm190).filter(Boolean)};

/* 1. Authority stays strict, but a valid snapshot never blocks navigation. */
const AUTH_TTL_190=120000;
let authorityRefresh190=null;
if(typeof ct186Context==='function'){
  const contextBase190=ct186Context;
  ct186Context=async function(force=false){
    try{
      if(!force&&ct186ContextValue){
        if(Date.now()-Number(ct186ContextAt||0)>AUTH_TTL_190&&!authorityRefresh190){
          authorityRefresh190=Promise.resolve(contextBase190(true)).catch(()=>null).finally(()=>{authorityRefresh190=null});
        }
        return ct186ContextValue;
      }
    }catch{}
    return contextBase190(force);
  };
}

const FORYOU_TTL_190=120000;
let forYouRefreshAt190=0,forYouRefresh190=null;
function cachedForYou190(){
  try{if(ct186ForYouData)return ct186ForYouData}catch{}
  try{const x=ct185CDiscoverHot?.get?.('foryou');if(x?.rows)return x.rows}catch{}
  try{const x=discoverCache?.get?.('r186:foryou:'+localDay());if(x&&typeof x.then!=='function')return x}catch{}
  return null;
}
async function refreshForYou190(force=false){
  if(forYouRefresh190)return forYouRefresh190;
  const cached=cachedForYou190();
  if(!force&&cached&&forYouRefreshAt190&&Date.now()-forYouRefreshAt190<FORYOU_TTL_190)return cached;
  forYouRefresh190=(async()=>{
    const data=typeof ct186LoadForYou==='function'?await ct186LoadForYou(true):cached;
    if(data){
      forYouRefreshAt190=Date.now();
      try{ct186ForYouData=data;ct166ForYouData=data}catch{}
      try{ct185CDiscoverHot?.set?.('foryou',{at:Date.now(),rows:data})}catch{}
      if(route190()==='discover'&&String(discoverState?.tab||'foryou')==='foryou')try{paintDiscover(data)}catch{}
    }
    return data;
  })().catch(()=>cached||null).finally(()=>{forYouRefresh190=null});
  return forYouRefresh190;
}
if(typeof discoverRows==='function'){
  const rowsBase190=discoverRows;
  discoverRows=async function(tab){
    if(String(tab)==='foryou'){
      const cached=cachedForYou190();
      if(cached){
        try{ct186ForYouData=cached;ct166ForYouData=cached}catch{}
        if(!forYouRefreshAt190||Date.now()-forYouRefreshAt190>FORYOU_TTL_190)void refreshForYou190(false);
        return cached;
      }
    }
    const rows=await rowsBase190(tab);
    if(String(tab)==='foryou'&&rows){forYouRefreshAt190=Date.now();try{ct186ForYouData=rows;ct166ForYouData=rows}catch{}}
    return rows;
  };
}

/* 2. Build a title+ID Watchlist authority. This closes imported/translated-title leaks. */
let watchIds190={movie:new Set(),tv:new Set()},watchAliases190=new Set(),watchAt190=0,watchTask190=null;
function addWatchRow190(x){
  if(!x)return;const t=type190(x),id=id190(x);if(id>0)watchIds190[t].add(id);
  for(const a of aliases190(x))watchAliases190.add(t+':'+a);
}
function seedWatchFromForYou190(data=cachedForYou190()){
  const pool=data?._ct186_watchlist||{};
  for(const k of ['movie','series','anime'])for(const x of pool[k]||[])addWatchRow190(x);
  try{
    const c=ct186ContextValue;
    if(c){for(const id of c.watchMovieIds||[])watchIds190.movie.add(Number(id));for(const id of c.watchTvIds||[])watchIds190.tv.add(Number(id));for(const a of c.watchAliases||[])watchAliases190.add(String(a));}
  }catch{}
}
async function refreshWatchAuthority190(force=false){
  if(!force&&watchAt190&&Date.now()-watchAt190<AUTH_TTL_190)return true;
  if(watchTask190)return watchTask190;
  watchTask190=(async()=>{
    const ids={movie:new Set(),tv:new Set()},als=new Set();watchIds190=ids;watchAliases190=als;seedWatchFromForYou190();
    try{
      if(typeof getWatchlist==='function'){
        const rows=await getWatchlist();for(const x of rows||[])addWatchRow190(x);
      }
    }catch{}
    try{
      const c=await ct186Context(false);
      for(const id of c?.watchMovieIds||[])watchIds190.movie.add(Number(id));for(const id of c?.watchTvIds||[])watchIds190.tv.add(Number(id));for(const a of c?.watchAliases||[])watchAliases190.add(String(a));
    }catch{}
    watchAt190=Date.now();return true;
  })().finally(()=>{watchTask190=null});
  return watchTask190;
}
function inWatch190(x){
  const t=type190(x),id=id190(x);if(id>0&&watchIds190[t].has(id))return true;
  return aliases190(x).some(a=>watchAliases190.has(t+':'+a));
}
function mediaFromCard190(card){
  const act=q190('[data-discover-watch]',card),raw=String(act?.dataset?.discoverWatch||'');const [t,id]=raw.split(':');
  const title=q190('.title,.card-title,h3,h4,b,strong',card)?.textContent||'';
  return{media_type:t==='movie'?'movie':'tv',id:Number(id||0),title};
}

/* 3. PRA VOCE action model: Watchlist = Visto + Trocar. Fresh = Watchlist + Trocar. */
let decoratingForYou190=false;
function swapCard190(card){
  const b=q190('[data-ct166-swap]',card);if(!b)return false;
  const key=String(b.dataset.ct166Swap||'');if(!key)return false;
  try{ct166SwapIndex[key]=Number(ct166SwapIndex[key]||0)+1;return true}catch{return false}
}
function decorateForYou190(data=cachedForYou190()){
  if(decoratingForYou190||route190()!=='discover'||String(discoverState?.tab||'foryou')!=='foryou')return;
  const root=q190('[data-discover-content]')||q190('[data-discover]');if(!root)return;
  seedWatchFromForYou190(data);let needsRepaint=false;decoratingForYou190=true;
  try{
    qa190('section.panel,section.discover-section',root).forEach(section=>{
      const heading=norm190(q190('h2,h3',section)?.textContent||'');
      if(heading==='da sua watchlist'){
        qa190('[data-discover-watch]',section).forEach(btn=>{
          const ref=String(btn.dataset.discoverWatch||'');
          btn.removeAttribute('data-discover-watch');btn.dataset.ct190Seen=ref;btn.disabled=false;btn.removeAttribute('aria-disabled');btn.textContent='✓ Visto';btn.classList.add('ct190-seen-action');
        });
      }
      if(heading==='100 novos'||heading==='100 novos '||heading.includes('100 novos')){
        qa190('.discover-card,.media-card,.card,.foryou-slot',section).forEach(card=>{
          const m=mediaFromCard190(card);if(!(m.id>0))return;
          if(inWatch190(m)&&swapCard190(card))needsRepaint=true;
        });
      }
    });
  }finally{decoratingForYou190=false}
  if(needsRepaint&&data)requestAnimationFrame(()=>{try{paintDiscover(data)}catch{}});
}
if(typeof paintDiscover==='function'){
  const paintDiscoverBase190=paintDiscover;
  paintDiscover=function(data){
    if(String(discoverState?.tab||'foryou')==='foryou'&&data)try{ct186ForYouData=data;ct166ForYouData=data}catch{}
    const out=paintDiscoverBase190(data);requestAnimationFrame(()=>decorateForYou190(data));return out;
  };
}
window.addEventListener('click',e=>{
  if(route190()!=='discover'||String(discoverState?.tab||'foryou')!=='foryou')return;
  const seen=e.target.closest?.('[data-ct190-seen]');
  if(seen){
    e.preventDefault();e.stopImmediatePropagation();const [type,rawId]=String(seen.dataset.ct190Seen||'').split(':');const id=Number(rawId||0);if(!(id>0)||seen.disabled)return;
    seen.disabled=true;seen.textContent='✓ Marcando…';const card=seen.closest('.discover-card,.media-card,.card,.foryou-slot');swapCard190(card);
    const data=cachedForYou190();if(data)requestAnimationFrame(()=>{try{paintDiscover(data)}catch{}});
    let p;try{p=markSeen(type,id)}catch(err){seen.disabled=false;seen.textContent='✓ Visto';try{toast(err?.message||String(err))}catch{};return}
    void Promise.resolve(p).then(()=>{watchAt190=0;forYouRefreshAt190=0}).catch(err=>{try{toast(err?.message||String(err))}catch{}});return;
  }
  const swap=e.target.closest?.('[data-ct166-swap]');
  if(swap){
    e.preventDefault();e.stopImmediatePropagation();const key=String(swap.dataset.ct166Swap||'');try{ct166SwapIndex[key]=Number(ct166SwapIndex[key]||0)+1}catch{}
    const data=cachedForYou190();if(data)try{paintDiscover(data)}catch{};return;
  }
  const watch=e.target.closest?.('[data-discover-watch]');
  if(watch){
    if(watch.disabled)return;e.preventDefault();e.stopImmediatePropagation();const [type,rawId]=String(watch.dataset.discoverWatch||'').split(':');const id=Number(rawId||0);if(!(id>0))return;
    watch.disabled=true;watch.textContent='✓ Salvando…';watchIds190[type==='movie'?'movie':'tv'].add(id);
    const card=watch.closest('.discover-card,.media-card,.card,.foryou-slot');swapCard190(card);const data=cachedForYou190();if(data)requestAnimationFrame(()=>{try{paintDiscover(data)}catch{}});
    let p;try{p=addWatchlist(type,id)}catch(err){watch.disabled=false;watch.textContent='+ Watchlist';try{toast(err?.message||String(err))}catch{};return}
    void Promise.resolve(p).then(()=>{watchAt190=0;void refreshWatchAuthority190(true)}).catch(err=>{watchIds190[type==='movie'?'movie':'tv'].delete(id);try{toast(err?.message||String(err))}catch{}});return;
  }
},true);

/* 4. SPORTS: isolate its input and hide the global movie/series/actor search. */
let sportsTimer190=0,sportsSeq190=0;
function globalMediaSearch190(input){const p=norm190(input?.placeholder||input?.getAttribute?.('aria-label')||'');return p.includes('filme')&&(p.includes('serie')||p.includes('ator'))}
function sportsInputCandidate190(input){
  if(!input||globalMediaSearch190(input))return false;
  const p=norm190(input.placeholder||input.getAttribute('aria-label')||'');const box=norm190(input.closest?.('.panel,section,form,div')?.textContent||'');
  return p.includes('time')||p.includes('clube')||p.includes('jogador')||p.includes('esport')||box.includes('filtro rapido');
}
function flattenSports190(v,out=[],seen=new Set(),d=0){
  if(d>6||v==null||typeof v!=='object'||seen.has(v))return out;seen.add(v);
  if(Array.isArray(v)){for(const x of v)flattenSports190(x,out,seen,d+1);return out}
  const name=v.name||v.title||v.player_name||v.team_name||v.competition_name||v.league_name||v.country_name;
  if(name)out.push({name:String(name),kind:String(v.entity_type||v.type||(v.player_name?'Jogador':v.team_name?'Clube / time':v.competition_name||v.league_name?'Liga / competição':'Esporte')),sport:v.sport_name||v.sport_slug||v.sport||'',country:v.country_name||v.country||'',raw:v});
  for(const [k,x] of Object.entries(v))if(!['raw','metadata'].includes(k))flattenSports190(x,out,seen,d+1);return out;
}
function scoreSports190(x,tokens){const hay=norm190([x.name,x.kind,x.sport,x.country,x.raw?.short_name,x.raw?.abbreviation,x.raw?.code,x.raw?.aliases].filter(Boolean).join(' '));if(!tokens.every(t=>hay.includes(t)))return-1;const n=norm190(x.name);let s=n===tokens.join(' ')?100:0;if(n.startsWith(tokens[0]))s+=40;for(const t of tokens)s+=n.includes(t)?20:5;return s}
async function querySports190(term){
  const tokens=norm190(term).split(/\s+/).filter(Boolean);if(!tokens.length)return[];let all=[];try{all.push(...flattenSports190(sportsCache))}catch{}
  try{const u=new URL('/api/sports',location.origin);u.searchParams.set('q',term);u.searchParams.set('query',term);u.searchParams.set('limit','40');const r=await fetch(u,{headers:{Accept:'application/json'},credentials:'same-origin'});if(r.ok)all.push(...flattenSports190(await r.json()))}catch{}
  const uniq=new Map();for(const x of all){const k=norm190(x.kind)+'|'+norm190(x.name)+'|'+norm190(x.sport);if(!uniq.has(k))uniq.set(k,x)}
  return[...uniq.values()].map(x=>({x,s:scoreSports190(x,tokens)})).filter(z=>z.s>=0).sort((a,b)=>b.s-a.s||a.x.name.localeCompare(b.x.name,'pt-BR')).slice(0,40).map(z=>z.x);
}
function sportsHost190(input){let host=q190('[data-ct190-sports-results]');if(!host){host=document.createElement('div');host.dataset.ct190SportsResults='1';host.className='ct190-sports-results';(input.closest('.panel,section,form')||input.parentElement)?.insertAdjacentElement('afterend',host)}return host}
function paintSports190(input,rows,term){const host=sportsHost190(input);if(!host)return;if(!term){host.hidden=true;host.innerHTML='';return}host.hidden=false;host.innerHTML=rows.length?'<div class="ct190-sports-head"><b>Resultados da busca</b><small>'+rows.length+' encontrados</small></div><div class="ct190-sports-grid">'+rows.map(x=>'<div class="ct190-sports-hit"><b>'+esc190(x.name)+'</b><small>'+esc190([x.kind,x.sport,x.country].filter(Boolean).join(' · '))+'</small></div>').join('')+'</div>':'<div class="ct190-sports-empty">Nenhum resultado para “'+esc190(term)+'”.</div>'}
function bindSportsInput190(){
  if(route190()!=='sports')return;const root=q190('[data-sports]')||document;let input=qa190('input[type="search"],input[type="text"],input:not([type])',root).find(sportsInputCandidate190);if(!input)return;
  if(input.dataset.ct190SportsSearch==='1')return;
  const clone=input.cloneNode(true);clone.dataset.ct190SportsSearch='1';input.replaceWith(clone);input=clone;
  input.addEventListener('input',()=>{clearTimeout(sportsTimer190);const term=input.value.trim(),seq=++sportsSeq190;if(!term){paintSports190(input,[],term);return} sportsTimer190=setTimeout(async()=>{const rows=await querySports190(term);if(seq!==sportsSeq190||!input.isConnected)return;paintSports190(input,rows,term);requestAnimationFrame(()=>{try{input.focus({preventScroll:true});const n=input.value.length;input.setSelectionRange(n,n)}catch{}})},100)});
}
function routeSearchVisibility190(){
  qa190('input').forEach(input=>{if(!globalMediaSearch190(input))return;const wrap=input.closest('.global-search,.search-wrap,.search-box,form,header>div')||input.parentElement;if(!wrap)return;if(route190()==='sports')wrap.classList.add('ct190-hide-global-search');else wrap.classList.remove('ct190-hide-global-search')});
  bindSportsInput190();
}

/* 5. Profile: warm once while idle; plus buttons add favorites without opening detail. */
let profileWarm190=null;
function warmProfile190(){
  if(profileWarm190)return profileWarm190;
  profileWarm190=Promise.resolve().then(async()=>{
    try{if(typeof window.__ct0997PersistentPreloadWarm==='function')return await window.__ct0997PersistentPreloadWarm()}catch{}
    try{if(typeof rpc==='function'){const zone=Intl.DateTimeFormat().resolvedOptions().timeZone||'America/Sao_Paulo';return await rpc('cinetracker_profile_payload_v0997',{p_tz:zone})}}catch{}
    return null;
  }).catch(()=>null);return profileWarm190;
}
const idle190=window.requestIdleCallback||((fn)=>setTimeout(fn,600));idle190(()=>void warmProfile190(),{timeout:1800});
document.addEventListener('pointerdown',e=>{const t=e.target.closest?.('a,button,[data-view],[data-route]');const path=norm190([t?.dataset?.view,t?.dataset?.route,t?.getAttribute?.('href'),t?.textContent].filter(Boolean).join(' '));if(path.includes('perfil')||path.includes('profile'))void warmProfile190()},{passive:true,capture:true});

function pickerRoot190(el){
  let r=el?.closest?.('[role="dialog"],dialog,.modal,.overlay,.picker,.profile-picker,.panel');if(!r)return null;const text=norm190(r.textContent||'');
  return (text.includes('adicionar mais')||text.includes('favorit')||q190('input[type="search"],input[type="text"]',r))?r:null;
}
function refFromNode190(el,root){
  const nodes=[];let n=el;for(let i=0;n&&i<6;i++,n=n.parentElement)nodes.push(n);if(root)nodes.push(...qa190('[data-open],[data-detail],[data-media],[data-tmdb-id],[data-discover-watch]',root));
  for(const x of nodes){
    const vals=[x?.dataset?.open,x?.dataset?.detail,x?.dataset?.media,x?.dataset?.discoverWatch,x?.getAttribute?.('data-ref')].filter(Boolean);
    for(const v of vals){const m=String(v).match(/(movie|tv|series|anime)\s*[:|/]\s*(\d+)/i);if(m)return{type:m[1].toLowerCase()==='movie'?'movie':'tv',id:Number(m[2])}}
    const id=Number(x?.dataset?.tmdbId||x?.getAttribute?.('data-tmdb-id')||0);if(id>0){const txt=norm190(root?.textContent||'');return{type:txt.includes('serie')?'tv':'movie',id}}
  }
  return null;
}
window.addEventListener('click',e=>{
  if(route190()!=='profile')return;const btn=e.target.closest?.('button,[role="button"]');if(!btn)return;const root=pickerRoot190(btn);if(!root)return;
  const label=norm190([btn.textContent,btn.getAttribute('aria-label'),btn.title].filter(Boolean).join(' '));if(!(label==='+'||label.includes('adicionar')||label.includes('favorit')))return;
  const ref=refFromNode190(btn,btn.closest('.card,.media-card,.result,.search-result,[data-open],[data-detail]')||root);if(!ref?.id)return;
  e.preventDefault();e.stopImmediatePropagation();if(btn.dataset.ct190Busy==='1')return;btn.dataset.ct190Busy='1';const old=btn.textContent;btn.textContent='✓';btn.classList.add('ct190-picker-added');
  let p;try{p=toggleFavorite(ref.type,ref.id)}catch(err){btn.dataset.ct190Busy='';btn.textContent=old;try{toast(err?.message||String(err))}catch{};return}
  void Promise.resolve(p).then(()=>{btn.dataset.ct190Busy='';btn.dataset.ct190Added='1';detailStateCache190.delete(ref.type+':'+ref.id)}).catch(err=>{btn.dataset.ct190Busy='';btn.textContent=old;btn.classList.remove('ct190-picker-added');try{toast(err?.message||String(err))}catch{}});
},true);

/* 6. Detail state is always visible: favorite red, seen green, Watchlist purple. */
const detailStateCache190=new Map();
function actionKind190(btn){const s=norm190([btn?.textContent,btn?.title,btn?.getAttribute?.('aria-label'),btn?.dataset?.action,btn?.dataset?.favorite,btn?.dataset?.watchlist].filter(Boolean).join(' '));if(s.includes('favorit')||s.includes('coracao'))return'favorite';if(s.includes('watchlist')||s.includes('assistir depois'))return'watchlist';if(s.includes('visto')||s.includes('assistido')||s.includes('marcar visto'))return'seen';return''}
function detailRef190(root){
  for(const x of [root,...qa190('[data-open],[data-detail],[data-media],[data-tmdb-id]',root)]){const vals=[x?.dataset?.open,x?.dataset?.detail,x?.dataset?.media].filter(Boolean);for(const v of vals){const m=String(v).match(/(movie|tv|series|anime)\s*[:|/]\s*(\d+)/i);if(m)return{type:m[1].toLowerCase()==='movie'?'movie':'tv',id:Number(m[2])}}const id=Number(x?.dataset?.tmdbId||0);if(id>0)return{type:norm190(root.textContent).includes('temporada')?'tv':'movie',id}}
  return null;
}
async function detailState190(type,id){
  const key=type+':'+id,cached=detailStateCache190.get(key);if(cached&&Date.now()-cached.at<30000)return cached;
  let media=null,c=null;try{media=typeof openMedia==='function'?await openMedia(type,id):null}catch{}try{c=await ct186Context(false)}catch{}
  let favorite=Boolean(media?.is_favorite),seen=false,watch=false;
  const probe=media||{media_type:type,id,tmdb_id:id};
  try{seen=typeof ct186InHistory==='function'?ct186InHistory(probe,c):false}catch{}
  try{watch=typeof ct186InWatchlist==='function'?ct186InWatchlist(probe,c):inWatch190(probe)}catch{watch=inWatch190(probe)}
  const out={at:Date.now(),favorite,seen,watch};detailStateCache190.set(key,out);return out;
}
let detailDecorateSeq190=0;
async function decorateDetail190(){
  const root=q190('[data-detail-view],.detail-view,.media-detail,.detail-page')||qa190('main section,main .panel').find(x=>qa190('button',x).some(actionKind190));if(!root)return;
  const ref=detailRef190(root);if(!ref?.id)return;const seq=++detailDecorateSeq190,state=await detailState190(ref.type,ref.id);if(seq!==detailDecorateSeq190||!root.isConnected)return;
  qa190('button,[role="button"]',root).forEach(btn=>{const kind=actionKind190(btn);if(!kind)return;btn.classList.remove('ct190-favorite-active','ct190-seen-active','ct190-watch-active');const active=Boolean(state[kind]);btn.setAttribute('aria-pressed',active?'true':'false');if(!active)return;if(kind==='favorite')btn.classList.add('ct190-favorite-active');if(kind==='seen'){btn.classList.add('ct190-seen-active');if(norm190(btn.textContent).includes('visto'))btn.textContent='✓ Visto'}if(kind==='watchlist'){btn.classList.add('ct190-watch-active');btn.disabled=true;if(norm190(btn.textContent).includes('watchlist'))btn.textContent='✓ Na Watchlist'}});
}
if(typeof toggleFavorite==='function'){
  const toggleFavoriteBase190=toggleFavorite;toggleFavorite=async function(type,id){const out=await toggleFavoriteBase190(type,id);detailStateCache190.delete((type==='movie'?'movie':'tv')+':'+Number(id));setTimeout(()=>void decorateDetail190(),0);return out};
}

window.addEventListener('cinetracker:data-changed',()=>{watchAt190=0;forYouRefreshAt190=0;detailStateCache190.clear();void refreshWatchAuthority190(true);setTimeout(()=>void decorateDetail190(),20)});

/* DOM-only work is intentionally cheap and debounced. */
let domTimer190=0;
function decorate190(){routeSearchVisibility190();decorateForYou190();void decorateDetail190()}
const observer190=new MutationObserver(()=>{clearTimeout(domTimer190);domTimer190=setTimeout(decorate190,45)});observer190.observe(document.documentElement,{childList:true,subtree:true});
window.addEventListener('popstate',()=>setTimeout(decorate190,0));window.addEventListener('hashchange',()=>setTimeout(decorate190,0));window.addEventListener('pageshow',()=>setTimeout(decorate190,20));
setTimeout(()=>{seedWatchFromForYou190();void refreshWatchAuthority190(false);decorate190()},30);

const style=document.createElement('style');style.id='ct190-style';style.textContent=`
.ct190-hide-global-search{display:none!important}.ct190-seen-action{white-space:nowrap}.ct190-picker-added{border-color:#2da66f!important;color:#76e3aa!important}.ct190-favorite-active{background:#6e1621!important;border-color:#e74b5b!important;color:#fff!important}.ct190-seen-active{background:#123f2d!important;border-color:#3ac47d!important;color:#baf5d5!important}.ct190-watch-active{background:#382057!important;border-color:#9a68d8!important;color:#eadcff!important;opacity:1!important}
.ct190-sports-results{border:1px solid #224b61;background:#07131b;border-radius:14px;padding:11px;margin:10px 0 14px}.ct190-sports-results[hidden]{display:none!important}.ct190-sports-head{display:flex;justify-content:space-between;gap:12px;align-items:center;margin-bottom:9px}.ct190-sports-head small{color:#7896a8}.ct190-sports-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:8px}.ct190-sports-hit{border:1px solid #24475a;background:#091a24;border-radius:10px;padding:9px}.ct190-sports-hit b{display:block;font-size:11px}.ct190-sports-hit small{display:block;margin-top:4px;color:#82a1b2;font-size:9px}.ct190-sports-empty{padding:12px;color:#89a6b6;text-align:center}
`;
document.getElementById(style.id)?.remove();document.head.appendChild(style);
})();
