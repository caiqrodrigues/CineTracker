/* CineTracker Web 1.0.103 r312 — latest video truth: Discover, auth, Sports filters, Profile refresh. WEB ONLY. */
(()=>{
'use strict';
if(window.__ctR312)return;
window.__ctR312='discover-owned-cards+auth-refresh+sports-inline-filter+profile-live-favorites';
window.__ctR312Discover='five-public-hard-exclusion+no-clipping+cached-tabs+compact-foryou';
window.__ctR312Auth='jwt-refresh-once+retry-same-request';
window.__ctR312Sports='next-previous-inline-all-system-sports-filter';
window.__ctR312Profile='stadium-click-contract+favorite-actor-cache-invalidated';
window.__ctR312Android='preserved-1.0.20-10062';

const R=window.__ctR288R263||{},M=window.__ctR295Test||{},R309=window.__ctR309||{},R310=window.__ctR310||{};
const q=(s,r=document)=>r?.querySelector?.(s)||null,qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const rows=v=>Array.isArray(v)?v:[];
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const routeNow=()=>{try{return String(typeof route==='function'?route():'')}catch{return''}};
const discover=R.discover263||null;
const discoverHost=()=>{try{return R.discoverHost263?.()||q('[data-ct263-discover-content]')}catch{return q('[data-ct263-discover-content]')}};
const PUBLIC=new Set(['trending','popular','new','anticipated','top']);
const LABEL={trending:'Em alta',popular:'Populares',new:'Novidades',anticipated:'Mais Aguardados',top:'Mais bem avaliados'};
let bridge=null;

/* ---------------- AUTH: refresh expired JWT once, retry the exact request. ---------------- */
let authRefreshTask312=null;
function jwtExpired312(e){
 const s=String(e?.message||e||'').toLowerCase();
 return s.includes('jwt expired')||s.includes('token has expired')||s.includes('expired jwt')||s.includes('invalid jwt')||s.includes('pgrst301')||s.includes('401');
}
async function refreshAuth312(){
 if(bridge?.refreshAuth)return !!(await bridge.refreshAuth());
 if(authRefreshTask312)return authRefreshTask312;
 authRefreshTask312=(async()=>{
  if(!ctSession?.refresh_token)throw new Error('Sessão expirada');
  const next=await authRequest('token?grant_type=refresh_token',{refresh_token:ctSession.refresh_token});
  saveSession(next);return true;
 })().finally(()=>{authRefreshTask312=null});
 return authRefreshTask312;
}
async function authRetry312(run){
 try{
  if(!bridge?.skipProactive&&typeof ctSession!=='undefined'&&ctSession?.refresh_token&&Number(ctSession.expires_at||0)<Date.now()+60000)await refreshAuth312();
  return await run();
 }catch(e){
  if(!jwtExpired312(e))throw e;
  await refreshAuth312();
  return run();
 }
}
try{if(typeof api==='function'){const base=api;api=async function(){const args=arguments;return authRetry312(()=>base.apply(this,args))}}}catch{}
try{if(typeof rpc==='function'){const base=rpc;rpc=async function(){const args=arguments;return authRetry312(()=>base.apply(this,args))}}}catch{}
try{if(typeof tmdb==='function'){const base=tmdb;tmdb=async function(){const args=arguments;return authRetry312(()=>base.apply(this,args))}}}catch{}
try{if(typeof edge==='function'){const base=edge;edge=async function(){const args=arguments;return authRetry312(()=>base.apply(this,args))}}}catch{}

/* ---------------- DISCOVER identity / personal exclusion authority. ---------------- */
function canonicalType312(v){
 const s=String(v??'').toLowerCase();
 return s==='movie'||s==='filme'?'movie':'tv';
}
function parseKey312(v,hint=''){
 if(v==null)return'';
 if(typeof v==='string'||typeof v==='number'){
  const s=String(v);
  let m=s.match(/^(movie|tv):(\d+)$/i);if(m)return`${canonicalType312(m[1])}:${Number(m[2])}`;
  m=s.match(/^tmdb-(movie|tv)-(\d+)$/i);if(m)return`${canonicalType312(m[1])}:${Number(m[2])}`;
  if(/^\d+$/.test(s)&&hint)return`${canonicalType312(hint)}:${Number(s)}`;
  return'';
 }
 const raw=v?.raw_tmdb||{};
 const direct=[v?.media_key,v?.key,v?.canonical_key].map(x=>parseKey312(x)).find(Boolean);if(direct)return direct;
 const type=canonicalType312(v?.media_type||v?.apiType||v?.media_kind||v?.kind||v?.type||raw?.media_type||hint);
 let id=Number(v?.tmdb_id||v?.source_tmdb_id||raw?.tmdb_id||raw?.source_tmdb_id||raw?.id||0);
 if(!id){
  const sid=String(v?.id||'');const p=parseKey312(sid,type);if(p)return p;
  if(/^\d+$/.test(sid))id=Number(sid);
 }
 return id>0?`${type}:${id}`:'';
}
function addKeys312(set,value,hint=''){
 if(value==null)return set;
 if(value instanceof Set){for(const x of value){const k=parseKey312(x,hint);if(k)set.add(k)}return set}
 for(const x of rows(value)){const k=parseKey312(x,hint);if(k)set.add(k)}
 return set;
}
let personal312={at:0,seen:new Set(),watch:new Set()},personalTask312=null;
function canonicalPersonal312(v={}){
 const seen=new Set(),watch=new Set();
 addKeys312(seen,v?.seen);addKeys312(watch,v?.watch);
 for(const k of seen)watch.delete(k);
 return {at:Date.now(),seen,watch};
}
function addLocalSets312(seen,watch){
 try{if(typeof seenMedia!=='undefined')addKeys312(seen,seenMedia)}catch{}
 try{if(typeof watchlist!=='undefined')addKeys312(watch,watchlist)}catch{}
}
async function personalAuthority312(force=false){
 if(bridge?.personal)return bridge.personal(force);
 if(!force&&personal312.at&&Date.now()-personal312.at<45000)return personal312;
 if(personalTask312&&!force)return personalTask312;
 personalTask312=(async()=>{
  const [a,w]=await Promise.all([
   Promise.resolve(M.authority?.(!!force)).catch(()=>null),
   Promise.resolve(R310.canonicalWatchlist?.(!!force)).catch(()=>null)
  ]);
  const seen=new Set(),watch=new Set();
  addKeys312(seen,a?.seen);addKeys312(watch,a?.watch);addKeys312(watch,a?.watchRows);
  for(const k of ['hard_excluded','seen','watched','history'])addKeys312(seen,a?.raw?.[k]);
  addKeys312(watch,a?.raw?.watchlist);addKeys312(watch,w?.keys);addKeys312(watch,w?.rows);
  addLocalSets312(seen,watch);
  for(const k of seen)watch.delete(k);
  personal312=canonicalPersonal312({seen,watch});return personal312;
 })().finally(()=>{personalTask312=null});
 return personalTask312;
}
function filterPublic312(list,p=personal312){
 const out=[],dedupe=new Set();
 for(const x of rows(list)){
  const k=parseKey312(x);if(!k||dedupe.has(k))continue;dedupe.add(k);
  if(p?.seen?.has?.(k)||p?.watch?.has?.(k))continue;
  out.push(x);
 }
 return out;
}
function title312(x){return String(x?.title||x?.name||x?.media_title||x?.raw_tmdb?.title||x?.raw_tmdb?.name||'Sem título')}
function poster312(x){return x?.poster_path||x?.raw_tmdb?.poster_path||null}
function year312(x){return String(x?.release_date||x?.first_air_date||x?.release_year||x?.raw_tmdb?.release_date||x?.raw_tmdb?.first_air_date||'').slice(0,4)}
function score312(x){return Number(x?.vote_average??x?.raw_tmdb?.vote_average??0)}
function overview312(x){return String(x?.overview||x?.raw_tmdb?.overview||'').trim()}
function image312(path){if(!path)return'';try{if(typeof R.image263==='function')return R.image263(path,'w342')}catch{};try{if(typeof image263==='function')return image263(path,'w342')}catch{};return /^https?:/.test(path)?path:`https://image.tmdb.org/t/p/w342${path}`}
function kind312(x){return canonicalType312(x?.media_type||x?.type||x?.apiType)==='movie'?'Filme':'Série'}
function rememberFavorite312(k,x){try{window.__ctR291Test?.media?.set?.(k,x)}catch{}}
function heart312(k){
 let on=false;try{on=window.__ctR291Test?.favorites?.has?.(k)||false}catch{}
 return `<button type="button" class="ct312-heart${on?' is-favorite':''}" data-ct291-favorite="${esc(k)}" aria-label="${on?'Remover dos favoritos':'Adicionar aos favoritos'}" aria-pressed="${on?'true':'false'}">${on?'♥':'♡'}</button>`;
}
function card312(x,{watch=false,compact=false}={}){
 const k=parseKey312(x);if(!k)return'<div class="ct312-empty">Sem item elegível.</div>';rememberFavorite312(k,x);
 const p=poster312(x),meta=[year312(x),kind312(x),score312(x)?`★ ${score312(x).toFixed(1)}`:''].filter(Boolean).join(' · '),ov=overview312(x);
 return `<article class="ct312-media-card${compact?' ct312-compact-card':''}" data-ct312-card="${esc(k)}">
   <div class="ct312-poster-wrap"><button type="button" class="ct312-open" data-media="${esc(k)}" aria-label="Abrir ${esc(title312(x))}">${p?`<img class="ct312-poster" src="${esc(image312(p))}" alt="" loading="lazy">`:'<div class="ct312-poster ct312-poster-empty">Sem capa</div>'}</button>${heart312(k)}</div>
   <div class="ct312-copy"><b class="ct312-title">${esc(title312(x))}</b><small class="ct312-meta">${esc(meta||'—')}</small>${!compact&&ov?`<details class="ct312-overview"><summary>Sinopse</summary><p>${esc(ov)}</p></details>`:''}</div>
   <div class="ct312-actions"><button type="button" class="chip" data-ct312-action="watchlist" data-key="${esc(k)}" ${watch?'disabled':''}>${watch?'✓ Watchlist':'+ Watchlist'}</button><button type="button" class="chip" data-ct312-action="seen" data-key="${esc(k)}">✓ Visto</button></div>
 </article>`;
}

/* Cached public tabs: instant paint on return, refresh quietly when stale. */
const publicRows312=new Map();let publicToken312=0;
async function sourcePublic312(tab,force=false){
 const hit=publicRows312.get(tab);if(!force&&hit&&Date.now()-hit.at<180000)return hit.rows;
 if(bridge?.sourceRows){const out=rows(await bridge.sourceRows(tab,force));publicRows312.set(tab,{at:Date.now(),rows:out});return out;}
 let out=null;
 if(typeof window.__ctR300Test?.sourceRows300==='function')out=await window.__ctR300Test.sourceRows300(tab);
 if(!Array.isArray(out))throw new Error('Fonte do Descobrir indisponível');
 publicRows312.set(tab,{at:Date.now(),rows:out});return out;
}
function paintPublic312(raw,tab,p=personal312){
 const h=discoverHost();if(!h)return false;const clean=filterPublic312(raw,p);
 h.innerHTML=`<section class="panel ct312-public" data-ct312-public="${esc(tab)}"><div class="panel-head"><h2>${esc(LABEL[tab]||'Descobrir')}</h2><small>${clean.length}</small></div><div class="ct312-public-rail">${clean.map(x=>card312(x)).join('')||'<div class="empty">Nenhum item elegível no momento.</div>'}</div></section>`;
 h.dataset.ct312Owned='public';return true;
}
async function buildPublic312(tab,force=false,{quiet=false}={}){
 if(!discover||!PUBLIC.has(tab)||routeNow()!=='discover')return false;
 const token=++publicToken312,h=discoverHost(),hit=publicRows312.get(tab);
 if(hit&&!force){const p=await personalAuthority312(false);if(token!==publicToken312)return false;paintPublic312(hit.rows,tab,p);if(Date.now()-hit.at<180000)return true;quiet=true}
 if(!quiet&&!hit&&h)h.innerHTML='<div class="ct312-loading">Carregando títulos…</div>';
 try{
  const [p,raw]=await Promise.all([personalAuthority312(false),sourcePublic312(tab,!!force)]);
  if(token!==publicToken312||routeNow()!=='discover'||String(discover.tab)!==tab)return false;
  return paintPublic312(raw,tab,p);
 }catch(e){if(token===publicToken312&&h&&!hit)h.innerHTML=`<div class="empty">Não foi possível carregar esta área agora.<br><small>${esc(e?.message||e)}</small><br><button class="chip" data-ct312-retry>Tentar novamente</button></div>`;return false}
}
function prewarmPublic312(except=''){
 for(const tab of PUBLIC)if(tab!==except&&!publicRows312.has(tab))void sourcePublic312(tab,false).catch(()=>{});
}

/* Compact, single-container Pra Você, reusing r309's exact data pools without its layout. */
function currentPool312(pool,index=0){return rows(pool).length?rows(pool)[Math.abs(Number(index||0))%rows(pool).length]:null}
function forYouModel312(){
 const s=window.__ctR309Test?.state;if(!s)return null;const watch={},fresh={};
 for(const k of ['movie','series','anime']){watch[k]=currentPool312(s.watchPools?.[k],s.watchIndex?.[k]);fresh[k]=currentPool312(s.freshPools?.[k],s.freshIndex?.[k])}
 return{state:s,daily:currentPool312(s.dailyPool,s.dailyIndex),watch,fresh};
}
function fySlot312(label,item,bucket,kind,watch){
 return `<section class="ct312-fy-slot" data-ct312-fy-slot="${bucket}:${kind}"><h4>${label}</h4>${card312(item,{watch,compact:true})}<button type="button" class="ct312-mini-swap" data-ct312-fy-swap="${bucket}:${kind}">↻ Trocar</button></section>`;
}
function paintForYou312(){
 const h=discoverHost(),m=forYouModel312();if(!h||!m)return false;
 h.innerHTML=`<section class="panel ct312-foryou" data-ct312-foryou><div class="panel-head"><h2>Pra Você</h2></div>
 <div class="ct312-fy-group ct312-daily"><h3>Indicação do Dia</h3><div class="ct312-daily-inner">${card312(m.daily,{compact:true})}<button type="button" class="ct312-mini-swap" data-ct312-fy-swap="daily">↻ Trocar</button></div></div>
 <div class="ct312-fy-group"><h3>Da sua Watchlist</h3><div class="ct312-fy-grid">${fySlot312('Filme',m.watch.movie,'watch','movie',true)}${fySlot312('Série',m.watch.series,'watch','series',true)}${fySlot312('Anime',m.watch.anime,'watch','anime',true)}</div></div>
 <div class="ct312-fy-group"><h3>100% novos</h3><div class="ct312-fy-grid">${fySlot312('Filme',m.fresh.movie,'fresh','movie',false)}${fySlot312('Série',m.fresh.series,'fresh','series',false)}${fySlot312('Anime',m.fresh.anime,'fresh','anime',false)}</div></div></section>`;
 h.dataset.ct312Owned='foryou';return true;
}
async function buildForYou312(force=false){
 if(routeNow()!=='discover'||String(discover?.tab)!=='foryou')return false;
 const h=discoverHost(),existing=forYouModel312();if(existing&&!force)paintForYou312();else if(h)h.innerHTML='<div class="ct312-loading">Montando recomendações…</div>';
 try{await R309.buildForYou?.(!!force);if(routeNow()==='discover'&&String(discover?.tab)==='foryou')return paintForYou312()}catch(e){if(h)h.innerHTML=`<div class="empty">Não foi possível montar o Pra Você agora.<br><small>${esc(e?.message||e)}</small></div>`}return false;
}
function swapForYou312(raw){
 const m=forYouModel312();if(!m)return false;const s=m.state;
 if(raw==='daily'){if(rows(s.dailyPool).length>1)s.dailyIndex=(Number(s.dailyIndex||0)+1)%s.dailyPool.length}
 else{const [bucket,kind]=String(raw).split(':');const pools=s[bucket+'Pools'],idx=s[bucket+'Index'];if(!pools||!idx)return false;const pool=rows(pools[kind]);if(pool.length>1)idx[kind]=(Number(idx[kind]||0)+1)%pool.length}
 return paintForYou312();
}

const previousLoad312=window.__ctR288LoadDiscover;
async function loadDiscover312(tab=discover?.tab,force=false){
 const t=String(tab||discover?.tab||'foryou');if(!discover)return previousLoad312?.apply(this,arguments);discover.tab=t;
 try{if(typeof ct288SyncShell==='function')ct288SyncShell()}catch{}
 if(PUBLIC.has(t)){void buildPublic312(t,!!force);prewarmPublic312(t);return}
 if(t==='foryou'){void buildForYou312(!!force);return}
 return previousLoad312?.apply(this,arguments);
}
try{loadDiscover263=loadDiscover312}catch{}window.__ctR288LoadDiscover=loadDiscover312;
try{if(typeof renderDiscover==='function'){const base=renderDiscover;renderDiscover=async function(){const out=await base.apply(this,arguments);if(routeNow()==='discover'){const t=String(discover?.tab||'');if(PUBLIC.has(t))prewarmPublic312(t)}return out}}}catch{}

async function persistDiscover312(btn){
 if(!btn||btn.disabled)return false;const [type,idRaw]=String(btn.dataset.key||'').split(':'),id=Number(idRaw||0),action=String(btn.dataset.ct312Action||'');if(!id)return false;
 btn.disabled=true;const old=btn.textContent;btn.textContent='…';
 try{
  if(action==='watchlist'){if(bridge?.addWatchlist)await bridge.addWatchlist(type,id);else await addWatchlist(type,id);personal312.watch.add(`${type}:${id}`)}
  else if(action==='seen'){if(bridge?.markSeen)await bridge.markSeen(type,id);else await markSeen(type,id);personal312.seen.add(`${type}:${id}`);personal312.watch.delete(`${type}:${id}`)}
  else return false;
  personal312.at=Date.now();try{R310.invalidateWatch?.()}catch{}
  btn.closest('.ct312-media-card')?.remove();
  document.dispatchEvent(new CustomEvent('cinetracker:data-changed',{detail:{source:'r312-discover',action,type,id}}));
  return true;
 }catch(e){btn.disabled=false;btn.textContent=old;try{toast(e?.message||String(e))}catch{};return false}
}

/* ---------------- PROFILE: exact click contracts + no stale favorite cache. ---------------- */
function statByLabel312(root,label){
 const w=norm(label);for(const x of qa('small,label,.stat-label,[data-stat-label]',root)){if(norm(x.textContent).includes(w)){const c=x.closest('.stat,[data-stat],.stat-card,.profile-stat,button,a,[role="button"]');if(c)return c}}
 return null;
}
function profileContracts312(root=q('[data-profile]')){
 if(!root)return false;try{window.__ctR311?.unifyProfileStats?.(root)}catch{}
 const events=statByLabel312(root,'Eventos assistidos'),stadium=statByLabel312(root,'Jogos no Estádio'),series=statByLabel312(root,'Séries Watchlist'),movies=statByLabel312(root,'Filmes Watchlist');
 if(events){events.dataset.ct299History='all';events.setAttribute('role','button');events.tabIndex=0}
 if(stadium){stadium.dataset.ct299History='stadium';stadium.setAttribute('role','button');stadium.tabIndex=0;stadium.setAttribute('aria-label','Ver jogos no estádio');stadium.setAttribute('title','Ver jogos no estádio')}
 for(const card of [events,stadium,series,movies].filter(Boolean))card.classList.add('ct312-profile-stat');
 root.dataset.ct312ProfileContracts='1';return !!(events&&stadium&&series&&movies);
}
function invalidateProfile312(){
 try{profileCache=null}catch{};try{localStorage.removeItem(CT163_CACHE+'profile')}catch{};try{ct163PreloadStarted=false}catch{}
}
try{if(typeof renderProfile==='function'){const base=renderProfile;renderProfile=async function(){const out=await base.apply(this,arguments);profileContracts312();return out}}}catch{}

/* ---------------- SPORTS: all system sports, inline only in Próximos/Anteriores. ---------------- */
function sportsCatalog312(p){
 const map=new Map();for(const s of rows(p?.sports)){const slug=String(s?.slug||'');if(slug)map.set(slug,{slug,name:s?.name||slug,icon:s?.icon||'🏆'})}
 for(const e of rows(p?.events)){const slug=String(e?.sport_slug||'');if(slug&&!map.has(slug))map.set(slug,{slug,name:e?.sport_name||e?.sport_label||slug,icon:'🏆'})}
 return [...map.values()];
}
function sportsFilterMarkup312(p){
 const list=sportsCatalog312(p),active=String(sport255?.sport||'all');
 return `<div class="ct312-sport-filter" data-ct312-sport-filter-rail><button type="button" class="ct312-sport-chip ${active==='all'?'active':''}" data-ct312-sport-filter="all"><span>◉</span><b>Todos</b></button>${list.map(s=>`<button type="button" class="ct312-sport-chip ${active===s.slug?'active':''}" data-ct312-sport-filter="${esc(s.slug)}"><span>${esc(s.icon||'🏆')}</span><b>${esc(s.name||s.slug)}</b></button>`).join('')}</div>`;
}
function decorateSportsFilters312(){
 if(routeNow()!=='sports'||typeof sport255==='undefined')return false;const root=q('[data-ct255-sports]');if(!root)return false;
 qa('.ct255-sport-filters',root).forEach(x=>x.remove());qa('[data-ct312-sport-filter-rail]',root).forEach(x=>x.remove());
 if(!['next','previous'].includes(String(sport255.tab)))return true;
 const head=q('.ct255-sports-feed .panel-head',root);if(!head)return false;
 const h=q('h2',head);if(!h)return false;h.insertAdjacentHTML('afterend',sportsFilterMarkup312(sport255.payload||{}));return true;
}
function selectSport312(slug,repaint=true){
 if(typeof sport255==='undefined')return'';sport255.sport=String(slug||'all');if(repaint&&typeof paintSports255==='function')paintSports255();return String(sport255.sport);
}
try{if(typeof paintSports255==='function'){const base=paintSports255;paintSports255=function(){const out=base.apply(this,arguments);decorateSportsFilters312();return out}}}catch{}

/* r311's pre-legacy early capture remains the first listener. Point it at r312. */
const early311Base=window.__ctR311EarlyHandle;
function exactClick312(target,e){
 if(!target?.closest)return false;
 const action=target.closest('[data-ct312-action]');if(action){void persistDiscover312(action);return true}
 const retry=target.closest('[data-ct312-retry]');if(retry){void buildPublic312(String(discover?.tab||''),true);return true}
 const swap=target.closest('[data-ct312-fy-swap]');if(swap){swapForYou312(String(swap.dataset.ct312FySwap||''));return true}
 const sf=target.closest('[data-ct312-sport-filter]');if(sf&&typeof sport255!=='undefined'){selectSport312(String(sf.dataset.ct312SportFilter||'all'),true);return true}
 return typeof early311Base==='function'?!!early311Base(target,e):false;
}
window.__ctR311EarlyHandle=exactClick312;
window.addEventListener('click',e=>{if(exactClick312(e.target,e)){e.preventDefault();e.stopImmediatePropagation()}},true);
document.addEventListener('cinetracker:data-changed',e=>{
 personal312={at:0,seen:new Set(),watch:new Set()};personalTask312=null;
 if(String(e?.detail?.source||'').includes('favorite'))invalidateProfile312();
});

const style=document.createElement('style');style.id='ct-web-r312-video-truth';style.textContent=`
.ct312-public{overflow:visible!important;min-width:0!important}.ct312-public-rail{box-sizing:border-box!important;display:flex!important;flex-flow:row nowrap!important;align-items:stretch!important;gap:12px!important;width:100%!important;max-width:100%!important;overflow-x:auto!important;padding:2px 2px 14px!important;scrollbar-gutter:auto!important;overscroll-behavior-x:contain!important}
.ct312-media-card{box-sizing:border-box!important;position:relative!important;display:flex!important;flex:0 0 196px!important;width:196px!important;min-width:196px!important;max-width:196px!important;flex-direction:column!important;align-self:stretch!important;background:transparent!important;overflow:visible!important;height:auto!important;min-height:0!important;max-height:none!important}
.ct312-poster-wrap{position:relative}.ct312-open{display:block!important;width:100%!important;padding:0!important;border:0!important;background:transparent!important;color:inherit!important;cursor:pointer!important}.ct312-poster{display:block;width:100%;aspect-ratio:2/3;object-fit:cover;border-radius:12px;background:#232a36}.ct312-poster-empty{display:grid;place-items:center}
.ct312-heart{position:absolute!important;right:7px!important;top:7px!important;width:32px!important;height:32px!important;border-radius:999px!important;border:1px solid #ffffff35!important;background:#090d12d9!important;color:#fff!important;font-size:20px!important;line-height:1!important;display:grid!important;place-items:center!important;cursor:pointer!important;z-index:3}.ct312-heart.is-favorite{color:#ff6b7a!important}
.ct312-copy{display:flex!important;flex-direction:column!important;gap:3px!important;padding:7px 1px 0!important;white-space:normal!important;overflow:visible!important;min-height:0!important}.ct312-title{display:block!important;white-space:normal!important;overflow:visible!important;text-overflow:clip!important;line-height:1.25!important;overflow-wrap:anywhere!important}.ct312-meta{display:block!important;white-space:normal!important;overflow:visible!important;text-overflow:clip!important;line-height:1.3!important;opacity:.78!important}.ct312-overview{margin-top:4px!important;font-size:11px!important}.ct312-overview summary{cursor:pointer;opacity:.8}.ct312-overview p{margin:5px 0 0!important;white-space:normal!important;overflow:visible!important;line-height:1.35!important}
.ct312-actions{display:grid!important;grid-template-columns:minmax(0,1fr) minmax(0,1fr)!important;gap:6px!important;width:100%!important;margin-top:auto!important;padding-top:7px!important;position:static!important}.ct312-actions .chip{box-sizing:border-box!important;position:static!important;inset:auto!important;width:100%!important;min-width:0!important;max-width:none!important;height:30px!important;min-height:30px!important;padding:4px 6px!important;margin:0!important;border-radius:8px!important;font-size:10px!important;line-height:1!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
.ct312-loading{padding:18px 2px;opacity:.72}

.ct312-foryou{overflow:visible!important}.ct312-fy-group{padding:10px 0 12px;border-top:1px solid #ffffff12}.ct312-fy-group:first-of-type{border-top:0}.ct312-fy-group h3{margin:0 0 8px;font-size:14px}.ct312-fy-grid{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:10px!important}.ct312-fy-slot{min-width:0}.ct312-fy-slot h4{margin:0 0 5px;font-size:12px}.ct312-fy-slot .ct312-media-card,.ct312-daily-inner .ct312-media-card{width:100%!important;min-width:0!important;max-width:178px!important;flex-basis:auto!important}.ct312-compact-card .ct312-overview{display:none!important}.ct312-compact-card .ct312-actions{grid-template-columns:repeat(2,minmax(0,1fr))!important}.ct312-mini-swap{box-sizing:border-box!important;width:auto!important;min-width:0!important;height:28px!important;min-height:28px!important;padding:4px 8px!important;margin-top:5px!important;border:1px solid var(--line,#2d3748)!important;border-radius:8px!important;background:transparent!important;color:inherit!important;font-size:10px!important;cursor:pointer!important}.ct312-daily-inner{display:flex!important;align-items:flex-end!important;gap:8px!important}

.ct312-profile-stat{cursor:pointer!important}.ct312-profile-stat::before,.ct312-profile-stat::after{content:none!important;display:none!important}

.ct255-sports-feed .panel-head{flex-wrap:wrap!important;align-items:center!important}.ct312-sport-filter{display:flex!important;flex:1 1 420px!important;min-width:0!important;gap:6px!important;overflow-x:auto!important;overflow-y:hidden!important;padding:2px 0 5px!important;scrollbar-width:thin!important;overscroll-behavior-x:contain!important}.ct312-sport-chip{box-sizing:border-box!important;display:inline-flex!important;flex:0 0 auto!important;align-items:center!important;gap:5px!important;height:32px!important;padding:4px 9px!important;border:1px solid var(--line,#2d3748)!important;border-radius:999px!important;background:transparent!important;color:inherit!important;white-space:nowrap!important;cursor:pointer!important}.ct312-sport-chip.active{border-color:var(--accent,#4da3ff)!important;background:rgba(77,163,255,.14)!important}.ct312-sport-chip b{font-size:11px}.ct312-sport-chip span{font-size:14px}

@media(max-width:720px){.ct312-media-card{flex-basis:164px!important;width:164px!important;min-width:164px!important;max-width:164px!important}.ct312-fy-grid{display:flex!important;flex-flow:row nowrap!important;overflow-x:auto!important}.ct312-fy-slot{flex:0 0 154px!important}.ct312-actions{grid-template-columns:1fr!important}.ct312-daily-inner{align-items:stretch!important;flex-direction:column!important}.ct312-sport-filter{flex-basis:100%!important}}
`;document.head.appendChild(style);

window.__ctR312={
 authRetry:authRetry312,refreshAuth:refreshAuth312,personal:personalAuthority312,filterPublic:filterPublic312,buildPublic:buildPublic312,buildForYou:buildForYou312,
 profileContracts:profileContracts312,invalidateProfile:invalidateProfile312,decorateSportsFilters:decorateSportsFilters312,sportsCatalog:sportsCatalog312,selectSport:selectSport312,
 setBridge(v){bridge=v&&typeof v==='object'?v:null},version:'1.0.103'
};
window.__ctR312Test={
 parseKey312,canonicalPersonal312,filterPublic312,card312,paintPublic312,forYouModel312,paintForYou312,sportsCatalog312,sportsFilterMarkup312,profileContracts312,jwtExpired312,authRetry312,
 setPersonal(v){personal312=canonicalPersonal312(v)},selectSport312,
 setBridge(v){bridge=v&&typeof v==='object'?v:null},
 get personal(){return personal312}
};
})();