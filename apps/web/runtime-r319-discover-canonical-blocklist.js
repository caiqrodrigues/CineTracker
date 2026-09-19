/* CineTracker Web 1.0.110 r319 — canonical personal exclusion authority, fail-closed. */
(()=>{
'use strict';
if(window.__ctR319)return;
window.__ctR319='discover-canonical-blocklist+fail-closed+fresh-every-tab';
window.__ctR319Discover='canonical-rpc+strict-six+strict-top10+calendar-exception';
window.__ctR319Android='preserved-1.0.20-10062';

const R=window.__ctR288R263||{},M=window.__ctR295Test||{};
const discover=R.discover263||null;
const q=(s,r=document)=>r?.querySelector?.(s)||null,qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const rows=v=>Array.isArray(v)?v:[];
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const typeOf=typeof R.type263==='function'?R.type263:(x=>String(x?.media_type||x?.type||'tv')==='movie'?'movie':'tv');
const idOf=typeof R.id263==='function'?R.id263:(x=>Number(x?.tmdb_id||x?.source_tmdb_id||x?.id||0));
const titleOf=typeof R.title263==='function'?R.title263:(x=>x?.title||x?.name||x?.media_title||'Sem título');
const yearOf=typeof R.year263==='function'?R.year263:(x=>String(x?.release_date||x?.first_air_date||x?.release_year||'').slice(0,4));
const posterOf=typeof R.poster263==='function'?R.poster263:(x=>x?.poster_path||x?.raw_tmdb?.poster_path||null);
const keyOf=x=>`${typeOf(x)==='movie'?'movie':'tv'}:${Number(idOf(x)||0)}`;
const validKey=k=>/^(movie|tv):[1-9]\d*$/.test(String(k||''));
const aliasOf=x=>`${typeOf(x)==='movie'?'movie':'tv'}|${norm(titleOf(x))}|${yearOf(x)}`;
const routeNow=()=>{try{return String(typeof route==='function'?route():'')}catch{return''}};
const TABS=[['foryou','Pra você'],['top10','Top 10'],['trending','Em alta'],['popular','Populares'],['new','Novidades'],['releases','Lançamentos'],['anticipated','Mais Aguardados'],['top','Mais bem avaliados'],['calendar','Calendário']];
const LABELS=Object.fromEntries(TABS),STRICT=new Set(['trending','popular','new','releases','anticipated','top']);
const STALE=5*60*1000;
const state={filterOpen:false,fyKind:'all',topProvider:0,topToken:0,loadToken:0};
let personal={at:0,ready:false,blocked:new Set(),seen:new Set(),watch:new Set(),aliases:new Set(),seenAliases:new Set(),watchAliases:new Set()},personalTask=null,sourceCache=new Map(),sourceTask=new Map(),topCache=new Map(),testBridge=null;

function host(){return q('[data-ct319-content]')||q('[data-ct315-content]')||q('[data-ct263-discover-content]')}
function today319(){try{return new Intl.DateTimeFormat('en-CA',{timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date())}catch{return new Date().toISOString().slice(0,10)}}
function shift319(days){const d=new Date(today319()+'T12:00:00');d.setDate(d.getDate()+days);return d.toISOString().slice(0,10)}
function anime319(x){
 if(typeOf(x)==='movie')return false;
 const ids=[...rows(x?.genre_ids),...rows(x?.raw_tmdb?.genre_ids),...rows(x?.genres).map(g=>Number(g?.id||0))].map(Number);
 const lang=String(x?.original_language||x?.raw_tmdb?.original_language||'').toLowerCase();
 const countries=[...rows(x?.origin_country),...rows(x?.raw_tmdb?.origin_country)].map(v=>String(v).toUpperCase());
 return ids.includes(16)&&(lang==='ja'||countries.includes('JP'));
}
function category319(x){return typeOf(x)==='movie'?'movie':anime319(x)?'anime':'series'}
function shell319(){
 const tab=String(discover?.tab||'foryou');
 const tabs=TABS.map(([k,l])=>`<button type="button" class="chip ${tab===k?'active':''}" data-ct319-tab="${k}">${l}</button>`).join('');
 return `<div class="page ct319-discover" data-discover data-ct319-discover data-ct288-discover>
  <div class="ct288-tab-shell ct319-tab-shell">
   <button type="button" class="ct288-tab-arrow" data-ct319-prev aria-label="Abas anteriores">‹</button>
   <div class="tabs ct288-tabs" data-ct319-tabs>${tabs}</div>
   <button type="button" class="ct288-tab-arrow" data-ct319-next aria-label="Próximas abas">›</button>
   <button type="button" class="ct288-filter-btn" data-ct319-filter aria-label="Filtrar" aria-expanded="${state.filterOpen?'true':'false'}">☷<i></i></button>
  </div>
  <div class="filters ct288-types ct319-types" data-ct319-types hidden></div>
  <div class="ct319-loadline" data-ct319-loadline hidden></div>
  <div data-ct319-content data-ct315-content data-ct263-discover-content><div class="ct263-loading">Carregando títulos…</div></div>
 </div>`;
}
function filterMarkup319(){
 const tab=String(discover?.tab||'foryou');
 if(tab==='foryou'){
  return [['all','Todos'],['movie','Filmes'],['series','Séries'],['anime','Animes']].map(([k,l])=>`<button type="button" class="chip ${state.fyKind===k?'active':''}" data-ct319-fy-kind="${k}">${l}</button>`).join('');
 }
 if(STRICT.has(tab)){
  const t=String(discover?.type||'all');
  return [['all','Todos'],['movie','Filmes'],['tv','Séries']].map(([k,l])=>`<button type="button" class="chip ${t===k?'active':''}" data-ct319-type="${k}">${l}</button>`).join('');
 }
 return '';
}
function syncShell319(){
 const root=q('[data-ct319-discover]');if(!root||!discover)return;
 const tab=String(discover.tab||'foryou'),canFilter=tab==='foryou'||STRICT.has(tab);
 qa('[data-ct319-tab]',root).forEach(b=>b.classList.toggle('active',b.dataset.ct319Tab===tab));
 const filter=q('[data-ct319-filter]',root),types=q('[data-ct319-types]',root);
 if(filter){filter.hidden=!canFilter;filter.setAttribute('aria-expanded',String(canFilter&&state.filterOpen))}
 if(types){types.innerHTML=filterMarkup319();types.hidden=!canFilter||!state.filterOpen;types.classList.toggle('open',canFilter&&state.filterOpen)}
 const rail=q('[data-ct319-tabs]',root),active=rail&&rail.querySelector(`[data-ct319-tab="${tab}"]`);
 if(rail&&active){const rr=rail.getBoundingClientRect(),ar=active.getBoundingClientRect();if(ar.left<rr.left||ar.right>rr.right)active.scrollIntoView({behavior:'smooth',block:'nearest',inline:'center'})}
}
function loading319(s){const el=q('[data-ct319-loadline]');if(el){el.hidden=false;el.textContent=s||'Carregando…'}}
function loaded319(){const el=q('[data-ct319-loadline]');if(el){el.hidden=true;el.textContent=''}}

function aliasKey319(type,title,year){
 const t=norm(title);if(!t)return'';return `${type==='movie'?'movie':'tv'}|${t}|${String(year||'').slice(0,4)}`;
}
function addAlias319(set,type,title,year){const a=aliasKey319(type,title,year);if(a&&!a.endsWith('|'))set.add(a)}
function addBlocked319(out,x,force=false){
 if(!x)return;
 const k=keyOf(x),seen=!!(x.is_seen||x.is_completed||x.is_in_progress||x.is_up_to_date||Number(x.watched_episodes||0)>0||x.last_watched_at||x.watched_at),watch=!!(x.is_watchlist||x.is_added_to_watchlist||x.is_watch_later),blocked=force||seen||watch;
 if(validKey(k)){
  if(blocked)out.blocked.add(k);
  if(seen){out.seen.add(k);out.blocked.add(k)}
  if(watch){out.watch.add(k);out.blocked.add(k)}
 }
 const a=aliasOf(x);if(blocked&&a&&!a.endsWith('|'))out.aliases.add(a);
 if(seen&&a&&!a.endsWith('|'))out.seenAliases.add(a);
 if(watch&&a&&!a.endsWith('|'))out.watchAliases.add(a);
}
function parseCanonical319(payload,out){
 if(!payload||typeof payload!=='object'||!Array.isArray(payload.blocked_keys))throw new Error('Bloqueio pessoal indisponível');
 for(const k of rows(payload.blocked_keys))if(validKey(k))out.blocked.add(String(k));
 for(const k of rows(payload.seen_keys)){if(validKey(k)){out.seen.add(String(k));out.blocked.add(String(k))}}
 for(const k of rows(payload.watch_keys)){if(validKey(k)){out.watch.add(String(k));out.blocked.add(String(k))}}
 for(const id of rows(payload.movie_ids)){const k='movie:'+Number(id||0);if(validKey(k))out.blocked.add(k)}
 for(const id of rows(payload.tv_ids)){const k='tv:'+Number(id||0);if(validKey(k))out.blocked.add(k)}
 for(const a of rows(payload.aliases)){
  const type=String(a?.media_type||'tv')==='movie'?'movie':'tv',year=a?.release_year||'';
  const titles=[a?.title,a?.localized_title,a?.localized_name,a?.original_title,a?.original_name];
  for(const title of titles){
   addAlias319(out.aliases,type,title,year);
   if(a?.is_seen)addAlias319(out.seenAliases,type,title,year);
   if(a?.is_watchlist)addAlias319(out.watchAliases,type,title,year);
  }
 }
 out.ready=true;return out;
}
const wait319=ms=>new Promise(r=>setTimeout(r,ms));
async function requiredCanonical319(){
 let last=null;
 for(let attempt=0;attempt<3;attempt++){
  try{
   if(typeof rpc!=='function')throw new Error('RPC indisponível');
   const v=await rpc('cinetracker_discover_blocked_v319',{});
   if(v&&typeof v==='object'&&Array.isArray(v.blocked_keys))return v;
   throw new Error('Resposta de bloqueio inválida');
  }catch(e){last=e}
  await wait319(120*(attempt+1));
 }
 throw last||new Error('Não foi possível carregar a biblioteca pessoal');
}
async function personal319(force=false){
 if(testBridge?.personal)return testBridge.personal(force);
 if(!force&&personal.ready&&personal.at&&Date.now()-personal.at<5000)return personal;
 if(personalTask&&!force)return personalTask;
 personalTask=(async()=>{
  const out={at:Date.now(),ready:false,blocked:new Set(),seen:new Set(),watch:new Set(),aliases:new Set(),seenAliases:new Set(),watchAliases:new Set()};
  const canonical=await requiredCanonical319();
  parseCanonical319(canonical,out);
  const safe=(name,args={})=>Promise.resolve(typeof rpc==='function'?rpc(name,args):null).catch(()=>null);
  const [authority,dash,watch]=await Promise.all([
    Promise.resolve(M.authority?.(!!force)).catch(()=>null),
    safe('cinetracker_profile_media_dashboard_v0991',{}),
    safe('cinetracker_watchlist_full_v119',{})
  ]);
  for(const k of authority?.seen||[]){if(validKey(k)){out.seen.add(String(k));out.blocked.add(String(k))}}
  for(const k of authority?.watch||[]){if(validKey(k)){out.watch.add(String(k));out.blocked.add(String(k))}}
  for(const x of rows(authority?.watchRows))addBlocked319(out,x,true);
  for(const x of rows(dash?.rows||dash))addBlocked319(out,x,false);
  for(const x of rows(watch?.rows||watch)){addBlocked319(out,x,true);const k=keyOf(x);if(validKey(k)){out.watch.add(k);out.blocked.add(k)}}
  out.at=Date.now();out.ready=true;personal=out;return out;
 })().finally(()=>{personalTask=null});
 return personalTask;
}
function strict319(list,p=personal,typeFilter=true){
 if(!p?.ready)return[];
 const out=[],seen=new Set(),aliases=new Set(),want=String(discover?.type||'all');
 for(const x of rows(list)){
  const k=keyOf(x),a=aliasOf(x);
  if(!validKey(k)||seen.has(k)||aliases.has(a))continue;seen.add(k);aliases.add(a);
  if(typeFilter&&(want==='movie'||want==='tv')&&typeOf(x)!==want)continue;
  if(p?.blocked?.has(k)||p?.aliases?.has(a))continue;
  out.push(x);
 }
 return out;
}
async function tmdbPage319(path,params,type){
 if(typeof tmdb!=='function')return[];
 try{const p=await tmdb(path,{language:'pt-BR',include_adult:false,...params});return rows(p?.results).map(x=>({...x,media_type:x.media_type||type||'tv',tmdb_id:Number(x.id||x.tmdb_id||0)})).filter(x=>['movie','tv'].includes(x.media_type)&&idOf(x)>0&&posterOf(x))}catch{return[]}
}
async function sourceNetwork319(tab){
 const jobs=[];
 if(tab==='trending')jobs.push(tmdbPage319('/trending/all/week',{page:1}),tmdbPage319('/trending/all/week',{page:2}));
 if(tab==='popular')jobs.push(tmdbPage319('/movie/popular',{page:1},'movie'),tmdbPage319('/tv/popular',{page:1},'tv'),tmdbPage319('/movie/popular',{page:2},'movie'),tmdbPage319('/tv/popular',{page:2},'tv'));
 if(tab==='new')jobs.push(
  tmdbPage319('/discover/movie',{'primary_release_date.gte':shift319(-30),'primary_release_date.lte':today319(),sort_by:'primary_release_date.desc',page:1},'movie'),
  tmdbPage319('/discover/tv',{'first_air_date.gte':shift319(-30),'first_air_date.lte':today319(),sort_by:'first_air_date.desc',page:1},'tv'),
  tmdbPage319('/discover/movie',{'primary_release_date.gte':shift319(-30),'primary_release_date.lte':today319(),sort_by:'primary_release_date.desc',page:2},'movie'),
  tmdbPage319('/discover/tv',{'first_air_date.gte':shift319(-30),'first_air_date.lte':today319(),sort_by:'first_air_date.desc',page:2},'tv')
 );
 if(tab==='releases')jobs.push(
  tmdbPage319('/discover/movie',{'primary_release_date.gte':shift319(-7),'primary_release_date.lte':shift319(30),sort_by:'primary_release_date.asc',page:1},'movie'),
  tmdbPage319('/discover/tv',{'first_air_date.gte':shift319(-7),'first_air_date.lte':shift319(30),sort_by:'first_air_date.asc',page:1},'tv'),
  tmdbPage319('/discover/movie',{'primary_release_date.gte':shift319(-7),'primary_release_date.lte':shift319(30),sort_by:'primary_release_date.asc',page:2},'movie'),
  tmdbPage319('/discover/tv',{'first_air_date.gte':shift319(-7),'first_air_date.lte':shift319(30),sort_by:'first_air_date.asc',page:2},'tv')
 );
 if(tab==='anticipated')jobs.push(
  tmdbPage319('/discover/movie',{'primary_release_date.gte':shift319(1),'primary_release_date.lte':shift319(365),sort_by:'popularity.desc',page:1},'movie'),
  tmdbPage319('/discover/tv',{'first_air_date.gte':shift319(1),'first_air_date.lte':shift319(365),sort_by:'popularity.desc',page:1},'tv'),
  tmdbPage319('/discover/movie',{'primary_release_date.gte':shift319(1),'primary_release_date.lte':shift319(365),sort_by:'popularity.desc',page:2},'movie'),
  tmdbPage319('/discover/tv',{'first_air_date.gte':shift319(1),'first_air_date.lte':shift319(365),sort_by:'popularity.desc',page:2},'tv')
 );
 if(tab==='top')jobs.push(tmdbPage319('/movie/top_rated',{page:1},'movie'),tmdbPage319('/tv/top_rated',{page:1},'tv'),tmdbPage319('/movie/top_rated',{page:2},'movie'),tmdbPage319('/tv/top_rated',{page:2},'tv'));
 return (await Promise.all(jobs)).flat();
}
async function source319(tab,force=false){
 if(testBridge?.source)return rows(await testBridge.source(tab,force));
 const hit=sourceCache.get(tab);if(!force&&hit&&Date.now()-hit.at<STALE)return hit.rows;
 if(!force&&sourceTask.has(tab))return sourceTask.get(tab);
 const task=sourceNetwork319(tab).then(v=>{sourceCache.set(tab,{at:Date.now(),rows:v});return v}).finally(()=>sourceTask.delete(tab));
 sourceTask.set(tab,task);return task;
}
function mediaCard319(x,rank=0){
 let media='';try{media=typeof ct288Card==='function'?ct288Card(x,{rank,watch:false,add:false,slot:true}):''}catch{}
 return media;
}
function actions319(x){
 const k=keyOf(x);return `<div class="ct319-actions"><button type="button" class="chip" data-ct319-action="watchlist" data-media="${esc(k)}">+ Watchlist</button><button type="button" class="chip" data-ct319-action="seen" data-media="${esc(k)}">✓ Visto</button></div>`;
}
function publicCard319(x,rank=0){return `<div class="ct319-item" data-ct319-item="${esc(keyOf(x))}">${mediaCard319(x,rank)}${actions319(x)}</div>`}
function paintPublic319(list,tab,p=personal){
 const h=host();if(!h)return false;const clean=strict319(list,p,true);
 h.innerHTML=`<section class="panel ct319-public"><div class="panel-head"><h2>${esc(LABELS[tab]||'Descobrir')}</h2><small>${clean.length}</small></div><div class="ct319-rail">${clean.map(x=>publicCard319(x)).join('')||'<div class="empty">Nenhum item elegível no momento.</div>'}</div></section>`;loaded319();return true;
}
async function loadPublic319(tab,force=false){
 const token=++state.loadToken;loading319('Carregando '+(LABELS[tab]||'títulos')+'…');
 try{
  const [p,raw]=await Promise.all([personal319(true),source319(tab,force)]);
  if(token!==state.loadToken||routeNow()!=='discover'||String(discover?.tab)!==tab)return false;
  return paintPublic319(raw,tab,p);
 }catch(e){if(token===state.loadToken){const h=host();if(h)h.innerHTML='<div class="empty">Não foi possível carregar esta área agora.<br><button class="chip" type="button" data-ct319-retry>Tentar novamente</button></div>';loaded319()}return false}
}

function applyForYouFilter319(){
 const root=q('[data-ct309-foryou]')||q('[data-ct288-foryou]');if(!root)return false;
 root.dataset.ct319FyFilter=state.fyKind;
 qa('[data-ct319-fy-kind]').forEach(b=>b.classList.toggle('active',b.dataset.ct319FyKind===state.fyKind));
 return true;
}
async function loadForYou319(force=false){
 loading319('Montando recomendações…');
 try{
  if(window.__ctR309?.buildForYou)await window.__ctR309.buildForYou(!!force);
  applyForYouFilter319();loaded319();return true;
 }catch{loaded319();return false}
}

function providerButtons319(list){
 return rows(list).map(p=>`<button type="button" class="ct288-provider ${Number(p.provider_id)===Number(state.topProvider)?'active':''}" data-ct319-provider="${Number(p.provider_id)}">${p.logo_path?`<span style="background-image:url('${img(p.logo_path,'w92')}')"></span>`:''}<b>${esc(p.provider_name||'Streaming')}</b></button>`).join('')||'<div class="empty">Nenhum streaming disponível.</div>';
}
async function topRaw319(provider,force=false){
 const key=String(provider),hit=topCache.get(key);if(!force&&hit&&Date.now()-hit.at<STALE)return hit.rows;
 const common={watch_region:'BR',with_watch_providers:Number(provider),with_watch_monetization_types:'flatrate',sort_by:'popularity.desc',include_adult:false};
 const [m1,m2,t1,t2]=await Promise.all([
  tmdbPage319('/discover/movie',{...common,page:1},'movie'),tmdbPage319('/discover/movie',{...common,page:2},'movie'),
  tmdbPage319('/discover/tv',{...common,page:1},'tv'),tmdbPage319('/discover/tv',{...common,page:2},'tv')
 ]);
 const data={movies:[...m1,...m2],series:[...t1,...t2]};topCache.set(key,{at:Date.now(),rows:data});return data;
}
async function paintTop319(provider,token,force=false){
 const content=q('[data-ct319-top-content]');if(!content||token!==state.topToken||String(discover?.tab)!=='top10')return false;
 content.innerHTML='<div class="ct263-loading">Montando Top 10…</div>';
 try{
  const [p,raw]=await Promise.all([personal319(true),topRaw319(provider,force)]);
  if(token!==state.topToken||String(discover?.tab)!=='top10')return false;
  const movies=strict319(raw.movies,p,false).slice(0,10),series=strict319(raw.series,p,false).slice(0,10);
  let providerName='Streaming';try{providerName=(ct171ProviderList||[]).find(x=>Number(x.provider_id)===Number(provider))?.provider_name||providerName}catch{}
  content.innerHTML=`<div class="ct288-top-name"><b>${esc(providerName)}</b></div>
   <section class="panel ct288-top-section"><div class="panel-head"><h2>Top 10 Séries</h2><small>${series.length}</small></div><div class="ct319-top-row">${series.map((x,i)=>publicCard319(x,i+1)).join('')||'<div class="empty">Sem séries elegíveis neste streaming.</div>'}</div></section>
   <section class="panel ct288-top-section"><div class="panel-head"><h2>Top 10 Filmes</h2><small>${movies.length}</small></div><div class="ct319-top-row">${movies.map((x,i)=>publicCard319(x,i+1)).join('')||'<div class="empty">Sem filmes elegíveis neste streaming.</div>'}</div></section>`;
  loaded319();return true;
 }catch(e){content.innerHTML='<div class="empty">Não foi possível carregar o Top 10 agora.</div>';loaded319();return false}
}
async function loadTop319(force=false){
 const h=host();if(!h)return false;const token=++state.topToken;loading319('Carregando Top 10…');
 h.innerHTML='<section class="ct288-top-shell"><div class="ct288-top-title"><h2>Top 10</h2></div><div class="ct288-provider-row" data-ct319-providers><div class="ct263-loading">Carregando streamings…</div></div><div data-ct319-top-content><div class="ct263-loading">Carregando Top 10…</div></div></section>';
 try{
  const providers=typeof ct171Providers==='function'?await ct171Providers():[];
  if(token!==state.topToken||String(discover?.tab)!=='top10')return false;
  if(!state.topProvider||!providers.some(p=>Number(p.provider_id)===Number(state.topProvider)))state.topProvider=Number((typeof ct171TopProvider!=='undefined'&&ct171TopProvider)||providers[0]?.provider_id||0);
  try{ct171TopProvider=state.topProvider}catch{}
  const box=q('[data-ct319-providers]');if(box)box.innerHTML=providerButtons319(providers);
  if(state.topProvider)return paintTop319(state.topProvider,token,force);
  loaded319();return false;
 }catch(e){const c=q('[data-ct319-top-content]');if(c)c.innerHTML='<div class="empty">Não foi possível carregar os streamings agora.</div>';loaded319();return false}
}
async function persist319(btn){
 if(!btn||btn.disabled)return false;
 const [type,idRaw]=String(btn.dataset.media||'').split(':'),id=Number(idRaw||0),action=String(btn.dataset.ct319Action||'');if(!id)return false;
 const old=btn.textContent;btn.disabled=true;btn.textContent='…';
 try{
  if(action==='watchlist')await addWatchlist(type,id);else if(action==='seen')await markSeen(type,id);else return false;
  personal={at:0,ready:false,blocked:new Set(),seen:new Set(),watch:new Set(),aliases:new Set(),seenAliases:new Set(),watchAliases:new Set()};personalTask=null;
  try{window.__ctR310?.invalidateWatch?.()}catch{}
  btn.closest('[data-ct319-item]')?.remove();
  void personal319(true);
  return true;
 }catch(e){btn.disabled=false;btn.textContent=old;try{toast(e?.message||String(e))}catch{}return false}
}
function prefetch319(){if(routeNow()!=='discover')return;for(const t of STRICT)void source319(t,false)}
async function loadDiscover319(tab=discover?.tab,force=false){
 if(!discover)return false;const t=String(tab||'foryou');discover.tab=t;
 if(t==='top10')discover.type='all';syncShell319();
 if(t==='foryou')return loadForYou319(force);
 if(t==='top10')return loadTop319(force);
 if(STRICT.has(t))return loadPublic319(t,force);
 if(t==='calendar'){
  loaded319();
  try{return await window.__ctR315?.loadDiscover?.('calendar',force)}catch{return false}
 }
 return false;
}
function renderDiscover319(seq){
 setApp(shell('Descobrir','Recomendações, Top 10, tendências, novidades, lançamentos e calendário.','discover',shell319()));
 if(seq!==navSeq||routeNow()!=='discover')return;syncShell319();void loadDiscover319(discover?.tab||'foryou',false);setTimeout(prefetch319,0);
}
try{renderDiscover=renderDiscover319}catch{}
window.__ctR288LoadDiscover=loadDiscover319;

function early319(target){
 if(!target?.closest)return false;
 const tab=target.closest('[data-ct319-tab]');if(tab){state.filterOpen=false;discover.tab=tab.dataset.ct319Tab;if(discover.tab==='top10')discover.type='all';void loadDiscover319(discover.tab,false);return true}
 const filter=target.closest('[data-ct319-filter]');if(filter){state.filterOpen=!state.filterOpen;syncShell319();return true}
 const fy=target.closest('[data-ct319-fy-kind]');if(fy){state.fyKind=fy.dataset.ct319FyKind||'all';state.filterOpen=false;syncShell319();applyForYouFilter319();return true}
 const ty=target.closest('[data-ct319-type]');if(ty){discover.type=ty.dataset.ct319Type||'all';state.filterOpen=false;syncShell319();void loadPublic319(String(discover.tab),false);return true}
 const provider=target.closest('[data-ct319-provider]');if(provider){state.topProvider=Number(provider.dataset.ct319Provider||0);try{ct171TopProvider=state.topProvider}catch{};qa('[data-ct319-provider]').forEach(b=>b.classList.toggle('active',Number(b.dataset.ct319Provider)===state.topProvider));void paintTop319(state.topProvider,state.topToken,false);return true}
 const action=target.closest('[data-ct319-action]');if(action){void persist319(action);return true}
 const retry=target.closest('[data-ct319-retry]');if(retry){void loadDiscover319(String(discover?.tab||'foryou'),true);return true}
 if(target.closest('[data-ct319-prev]')){q('[data-ct319-tabs]')?.scrollBy({left:-360,behavior:'smooth'});return true}
 if(target.closest('[data-ct319-next]')){q('[data-ct319-tabs]')?.scrollBy({left:360,behavior:'smooth'});return true}
 if(target.closest('[data-ct309-swap],[data-ct309-action]'))setTimeout(applyForYouFilter319,0);
 return false;
}
window.__ctR319EarlyHandle=early319;

window.addEventListener('cinetracker:data-changed',()=>{
 personal={at:0,ready:false,blocked:new Set(),seen:new Set(),watch:new Set(),aliases:new Set(),seenAliases:new Set(),watchAliases:new Set()};personalTask=null;sourceCache.clear();topCache.clear();
 if(routeNow()==='discover'){
  const t=String(discover?.tab||'foryou');
  if(STRICT.has(t))void loadPublic319(t,true);
  else if(t==='top10')void loadTop319(true);
  else if(t==='foryou')void loadForYou319(true);
 }
});
try{
 const app=q('#app');if(app&&window.MutationObserver)new MutationObserver(()=>{if(routeNow()==='discover'&&String(discover?.tab)==='foryou')requestAnimationFrame(applyForYouFilter319)}).observe(app,{subtree:true,childList:true});
}catch{}

const style=document.createElement('style');style.id='ct-web-r319';style.textContent=`
.ct319-loadline{min-height:18px;margin:0 0 5px;font-size:11px;opacity:.68}.ct319-loadline[hidden]{display:block!important;visibility:hidden!important}
.ct319-public{overflow:hidden!important}.ct319-rail,.ct319-top-row{display:flex!important;flex-flow:row nowrap!important;align-items:flex-start!important;gap:10px!important;overflow-x:auto!important;overflow-y:hidden!important;padding:2px 1px 10px!important;scrollbar-width:thin!important;scroll-snap-type:x proximity!important}
.ct319-item{box-sizing:border-box!important;display:flex!important;flex:0 0 176px!important;width:176px!important;min-width:176px!important;max-width:176px!important;flex-direction:column!important;align-self:flex-start!important;scroll-snap-align:start!important}
.ct319-item>.ct288-card{width:100%!important;min-width:0!important}.ct319-actions{display:grid!important;grid-template-columns:1fr 1fr!important;gap:6px!important;width:100%!important;margin-top:5px!important}
.ct319-actions .chip{width:100%!important;min-width:0!important;height:30px!important;min-height:30px!important;padding:4px 6px!important;border-radius:9px!important;font-size:11px!important;white-space:nowrap!important}
[data-ct309-foryou][data-ct319-fy-filter="movie"] .ct309-slot:not([data-ct309-slot$=":movie"]),
[data-ct309-foryou][data-ct319-fy-filter="series"] .ct309-slot:not([data-ct309-slot$=":series"]),
[data-ct309-foryou][data-ct319-fy-filter="anime"] .ct309-slot:not([data-ct309-slot$=":anime"]){display:none!important}
[data-ct309-foryou][data-ct319-fy-filter="series"] .ct309-daily,
[data-ct309-foryou][data-ct319-fy-filter="anime"] .ct309-daily{display:none!important}
[data-ct309-foryou]:not([data-ct319-fy-filter="all"]) .ct309-fy-grid{grid-template-columns:minmax(0,176px)!important}
.ct319-types{display:flex!important;gap:7px!important;overflow-x:auto!important;margin:0 0 10px!important;padding:0 0 4px!important}.ct319-types[hidden]{display:none!important}
@media(max-width:760px){.ct319-item{flex-basis:142px!important;width:142px!important;min-width:142px!important;max-width:142px!important}.ct319-actions{grid-template-columns:1fr!important}[data-ct309-foryou]:not([data-ct319-fy-filter="all"]) .ct309-fy-grid{grid-template-columns:minmax(0,154px)!important}}
`;
document.head.appendChild(style);

window.__ctR319={renderDiscover:renderDiscover319,loadDiscover:loadDiscover319,strict:strict319,personal:personal319,applyForYouFilter:applyForYouFilter319,loadTop:loadTop319,version:'1.0.110'};
window.__ctR319Test={TABS,STRICT,state,shell319,strict319,filterMarkup319,applyForYouFilter319,sourceNetwork319,paintPublic319,parseCanonical319,setPersonal(v){personal={at:Date.now(),ready:true,blocked:new Set(v?.blocked||[]),seen:new Set(v?.seen||[]),watch:new Set(v?.watch||[]),aliases:new Set(v?.aliases||[]),seenAliases:new Set(v?.seenAliases||[]),watchAliases:new Set(v?.watchAliases||[])}},setTestBridge(v){testBridge=v&&typeof v==='object'?v:null},setDiscover(tab,type='all'){if(discover){discover.tab=tab;discover.type=type}}};
})();
