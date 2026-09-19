/* CineTracker Web 1.0.109 r318 — Discover-only final authority. */
(()=>{
'use strict';
if(window.__ctR318)return;
window.__ctR318='discover-foryou-filters+strict-all-public+strict-top10';
window.__ctR318Discover='foryou-all-movie-series-anime+top10-filtered+six-strict+calendar-exception';
window.__ctR318Android='preserved-1.0.20-10062';

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
let personal={at:0,blocked:new Set(),aliases:new Set()},personalTask=null,sourceCache=new Map(),sourceTask=new Map(),topCache=new Map(),testBridge=null;

function host(){return q('[data-ct318-content]')||q('[data-ct315-content]')||q('[data-ct263-discover-content]')}
function today318(){try{return new Intl.DateTimeFormat('en-CA',{timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date())}catch{return new Date().toISOString().slice(0,10)}}
function shift318(days){const d=new Date(today318()+'T12:00:00');d.setDate(d.getDate()+days);return d.toISOString().slice(0,10)}
function anime318(x){
 if(typeOf(x)==='movie')return false;
 const ids=[...rows(x?.genre_ids),...rows(x?.raw_tmdb?.genre_ids),...rows(x?.genres).map(g=>Number(g?.id||0))].map(Number);
 const lang=String(x?.original_language||x?.raw_tmdb?.original_language||'').toLowerCase();
 const countries=[...rows(x?.origin_country),...rows(x?.raw_tmdb?.origin_country)].map(v=>String(v).toUpperCase());
 return ids.includes(16)&&(lang==='ja'||countries.includes('JP'));
}
function category318(x){return typeOf(x)==='movie'?'movie':anime318(x)?'anime':'series'}
function shell318(){
 const tab=String(discover?.tab||'foryou');
 const tabs=TABS.map(([k,l])=>`<button type="button" class="chip ${tab===k?'active':''}" data-ct318-tab="${k}">${l}</button>`).join('');
 return `<div class="page ct318-discover" data-discover data-ct318-discover data-ct288-discover>
  <div class="ct288-tab-shell ct318-tab-shell">
   <button type="button" class="ct288-tab-arrow" data-ct318-prev aria-label="Abas anteriores">‹</button>
   <div class="tabs ct288-tabs" data-ct318-tabs>${tabs}</div>
   <button type="button" class="ct288-tab-arrow" data-ct318-next aria-label="Próximas abas">›</button>
   <button type="button" class="ct288-filter-btn" data-ct318-filter aria-label="Filtrar" aria-expanded="${state.filterOpen?'true':'false'}">☷<i></i></button>
  </div>
  <div class="filters ct288-types ct318-types" data-ct318-types hidden></div>
  <div class="ct318-loadline" data-ct318-loadline hidden></div>
  <div data-ct318-content data-ct315-content data-ct263-discover-content><div class="ct263-loading">Carregando títulos…</div></div>
 </div>`;
}
function filterMarkup318(){
 const tab=String(discover?.tab||'foryou');
 if(tab==='foryou'){
  return [['all','Todos'],['movie','Filmes'],['series','Séries'],['anime','Animes']].map(([k,l])=>`<button type="button" class="chip ${state.fyKind===k?'active':''}" data-ct318-fy-kind="${k}">${l}</button>`).join('');
 }
 if(STRICT.has(tab)){
  const t=String(discover?.type||'all');
  return [['all','Todos'],['movie','Filmes'],['tv','Séries']].map(([k,l])=>`<button type="button" class="chip ${t===k?'active':''}" data-ct318-type="${k}">${l}</button>`).join('');
 }
 return '';
}
function syncShell318(){
 const root=q('[data-ct318-discover]');if(!root||!discover)return;
 const tab=String(discover.tab||'foryou'),canFilter=tab==='foryou'||STRICT.has(tab);
 qa('[data-ct318-tab]',root).forEach(b=>b.classList.toggle('active',b.dataset.ct318Tab===tab));
 const filter=q('[data-ct318-filter]',root),types=q('[data-ct318-types]',root);
 if(filter){filter.hidden=!canFilter;filter.setAttribute('aria-expanded',String(canFilter&&state.filterOpen))}
 if(types){types.innerHTML=filterMarkup318();types.hidden=!canFilter||!state.filterOpen;types.classList.toggle('open',canFilter&&state.filterOpen)}
 const rail=q('[data-ct318-tabs]',root),active=rail&&rail.querySelector(`[data-ct318-tab="${tab}"]`);
 if(rail&&active){const rr=rail.getBoundingClientRect(),ar=active.getBoundingClientRect();if(ar.left<rr.left||ar.right>rr.right)active.scrollIntoView({behavior:'smooth',block:'nearest',inline:'center'})}
}
function loading318(s){const el=q('[data-ct318-loadline]');if(el){el.hidden=false;el.textContent=s||'Carregando…'}}
function loaded318(){const el=q('[data-ct318-loadline]');if(el){el.hidden=true;el.textContent=''}}

function addBlocked318(out,x,force=false){
 if(!x)return;
 const k=keyOf(x),blocked=force||!!(x.is_watchlist||x.is_seen||x.is_completed||x.is_in_progress||x.is_up_to_date||Number(x.watched_episodes||0)>0||x.last_watched_at||x.watched_at);
 if(blocked&&validKey(k))out.blocked.add(k);
 if(blocked){const a=aliasOf(x);if(a&&!a.endsWith('|'))out.aliases.add(a)}
}
async function personal318(force=false){
 if(testBridge?.personal)return testBridge.personal(force);
 if(!force&&personal.at&&Date.now()-personal.at<60000)return personal;
 if(personalTask&&!force)return personalTask;
 personalTask=(async()=>{
  const out={at:Date.now(),blocked:new Set(),aliases:new Set()};
  const safe=(name,args={})=>Promise.resolve(typeof rpc==='function'?rpc(name,args):null).catch(()=>null);
  const [authority,dash,ex,watch]=await Promise.all([
    Promise.resolve(M.authority?.(!!force)).catch(()=>null),
    safe('cinetracker_profile_media_dashboard_v0991',{}),
    safe('cinetracker_discovery_exclusions_v0994',{}),
    safe('cinetracker_watchlist_full_v119',{})
  ]);
  for(const k of authority?.seen||[])out.blocked.add(String(k));
  for(const k of authority?.watch||[])out.blocked.add(String(k));
  for(const x of rows(authority?.watchRows))addBlocked318(out,x,true);
  for(const x of rows(dash?.rows||dash))addBlocked318(out,x,false);
  for(const x of rows(ex?.rows||ex))addBlocked318(out,x,true);
  for(const x of rows(watch?.rows||watch))addBlocked318(out,x,true);
  personal=out;return out;
 })().finally(()=>{personalTask=null});
 return personalTask;
}
function strict318(list,p=personal,typeFilter=true){
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
async function tmdbPage318(path,params,type){
 if(typeof tmdb!=='function')return[];
 try{const p=await tmdb(path,{language:'pt-BR',include_adult:false,...params});return rows(p?.results).map(x=>({...x,media_type:x.media_type||type||'tv',tmdb_id:Number(x.id||x.tmdb_id||0)})).filter(x=>['movie','tv'].includes(x.media_type)&&idOf(x)>0&&posterOf(x))}catch{return[]}
}
async function sourceNetwork318(tab){
 const jobs=[];
 if(tab==='trending')jobs.push(tmdbPage318('/trending/all/week',{page:1}),tmdbPage318('/trending/all/week',{page:2}));
 if(tab==='popular')jobs.push(tmdbPage318('/movie/popular',{page:1},'movie'),tmdbPage318('/tv/popular',{page:1},'tv'),tmdbPage318('/movie/popular',{page:2},'movie'),tmdbPage318('/tv/popular',{page:2},'tv'));
 if(tab==='new')jobs.push(
  tmdbPage318('/discover/movie',{'primary_release_date.gte':shift318(-30),'primary_release_date.lte':today318(),sort_by:'primary_release_date.desc',page:1},'movie'),
  tmdbPage318('/discover/tv',{'first_air_date.gte':shift318(-30),'first_air_date.lte':today318(),sort_by:'first_air_date.desc',page:1},'tv'),
  tmdbPage318('/discover/movie',{'primary_release_date.gte':shift318(-30),'primary_release_date.lte':today318(),sort_by:'primary_release_date.desc',page:2},'movie'),
  tmdbPage318('/discover/tv',{'first_air_date.gte':shift318(-30),'first_air_date.lte':today318(),sort_by:'first_air_date.desc',page:2},'tv')
 );
 if(tab==='releases')jobs.push(
  tmdbPage318('/discover/movie',{'primary_release_date.gte':shift318(-7),'primary_release_date.lte':shift318(30),sort_by:'primary_release_date.asc',page:1},'movie'),
  tmdbPage318('/discover/tv',{'first_air_date.gte':shift318(-7),'first_air_date.lte':shift318(30),sort_by:'first_air_date.asc',page:1},'tv'),
  tmdbPage318('/discover/movie',{'primary_release_date.gte':shift318(-7),'primary_release_date.lte':shift318(30),sort_by:'primary_release_date.asc',page:2},'movie'),
  tmdbPage318('/discover/tv',{'first_air_date.gte':shift318(-7),'first_air_date.lte':shift318(30),sort_by:'first_air_date.asc',page:2},'tv')
 );
 if(tab==='anticipated')jobs.push(
  tmdbPage318('/discover/movie',{'primary_release_date.gte':shift318(1),'primary_release_date.lte':shift318(365),sort_by:'popularity.desc',page:1},'movie'),
  tmdbPage318('/discover/tv',{'first_air_date.gte':shift318(1),'first_air_date.lte':shift318(365),sort_by:'popularity.desc',page:1},'tv'),
  tmdbPage318('/discover/movie',{'primary_release_date.gte':shift318(1),'primary_release_date.lte':shift318(365),sort_by:'popularity.desc',page:2},'movie'),
  tmdbPage318('/discover/tv',{'first_air_date.gte':shift318(1),'first_air_date.lte':shift318(365),sort_by:'popularity.desc',page:2},'tv')
 );
 if(tab==='top')jobs.push(tmdbPage318('/movie/top_rated',{page:1},'movie'),tmdbPage318('/tv/top_rated',{page:1},'tv'),tmdbPage318('/movie/top_rated',{page:2},'movie'),tmdbPage318('/tv/top_rated',{page:2},'tv'));
 return (await Promise.all(jobs)).flat();
}
async function source318(tab,force=false){
 if(testBridge?.source)return rows(await testBridge.source(tab,force));
 const hit=sourceCache.get(tab);if(!force&&hit&&Date.now()-hit.at<STALE)return hit.rows;
 if(!force&&sourceTask.has(tab))return sourceTask.get(tab);
 const task=sourceNetwork318(tab).then(v=>{sourceCache.set(tab,{at:Date.now(),rows:v});return v}).finally(()=>sourceTask.delete(tab));
 sourceTask.set(tab,task);return task;
}
function mediaCard318(x,rank=0){
 let media='';try{media=typeof ct288Card==='function'?ct288Card(x,{rank,watch:false,add:false,slot:true}):''}catch{}
 return media;
}
function actions318(x){
 const k=keyOf(x);return `<div class="ct318-actions"><button type="button" class="chip" data-ct318-action="watchlist" data-media="${esc(k)}">+ Watchlist</button><button type="button" class="chip" data-ct318-action="seen" data-media="${esc(k)}">✓ Visto</button></div>`;
}
function publicCard318(x,rank=0){return `<div class="ct318-item" data-ct318-item="${esc(keyOf(x))}">${mediaCard318(x,rank)}${actions318(x)}</div>`}
function paintPublic318(list,tab,p=personal){
 const h=host();if(!h)return false;const clean=strict318(list,p,true);
 h.innerHTML=`<section class="panel ct318-public"><div class="panel-head"><h2>${esc(LABELS[tab]||'Descobrir')}</h2><small>${clean.length}</small></div><div class="ct318-rail">${clean.map(x=>publicCard318(x)).join('')||'<div class="empty">Nenhum item elegível no momento.</div>'}</div></section>`;loaded318();return true;
}
async function loadPublic318(tab,force=false){
 const token=++state.loadToken;loading318('Carregando '+(LABELS[tab]||'títulos')+'…');
 try{
  const [p,raw]=await Promise.all([personal318(force),source318(tab,force)]);
  if(token!==state.loadToken||routeNow()!=='discover'||String(discover?.tab)!==tab)return false;
  return paintPublic318(raw,tab,p);
 }catch(e){if(token===state.loadToken){const h=host();if(h)h.innerHTML='<div class="empty">Não foi possível carregar esta área agora.<br><button class="chip" type="button" data-ct318-retry>Tentar novamente</button></div>';loaded318()}return false}
}

function applyForYouFilter318(){
 const root=q('[data-ct309-foryou]')||q('[data-ct288-foryou]');if(!root)return false;
 root.dataset.ct318FyFilter=state.fyKind;
 qa('[data-ct318-fy-kind]').forEach(b=>b.classList.toggle('active',b.dataset.ct318FyKind===state.fyKind));
 return true;
}
async function loadForYou318(force=false){
 loading318('Montando recomendações…');
 try{
  if(window.__ctR309?.buildForYou)await window.__ctR309.buildForYou(!!force);
  applyForYouFilter318();loaded318();return true;
 }catch{loaded318();return false}
}

function providerButtons318(list){
 return rows(list).map(p=>`<button type="button" class="ct288-provider ${Number(p.provider_id)===Number(state.topProvider)?'active':''}" data-ct318-provider="${Number(p.provider_id)}">${p.logo_path?`<span style="background-image:url('${img(p.logo_path,'w92')}')"></span>`:''}<b>${esc(p.provider_name||'Streaming')}</b></button>`).join('')||'<div class="empty">Nenhum streaming disponível.</div>';
}
async function topRaw318(provider,force=false){
 const key=String(provider),hit=topCache.get(key);if(!force&&hit&&Date.now()-hit.at<STALE)return hit.rows;
 const common={watch_region:'BR',with_watch_providers:Number(provider),with_watch_monetization_types:'flatrate',sort_by:'popularity.desc',include_adult:false};
 const [m1,m2,t1,t2]=await Promise.all([
  tmdbPage318('/discover/movie',{...common,page:1},'movie'),tmdbPage318('/discover/movie',{...common,page:2},'movie'),
  tmdbPage318('/discover/tv',{...common,page:1},'tv'),tmdbPage318('/discover/tv',{...common,page:2},'tv')
 ]);
 const data={movies:[...m1,...m2],series:[...t1,...t2]};topCache.set(key,{at:Date.now(),rows:data});return data;
}
async function paintTop318(provider,token,force=false){
 const content=q('[data-ct318-top-content]');if(!content||token!==state.topToken||String(discover?.tab)!=='top10')return false;
 content.innerHTML='<div class="ct263-loading">Montando Top 10…</div>';
 try{
  const [p,raw]=await Promise.all([personal318(force),topRaw318(provider,force)]);
  if(token!==state.topToken||String(discover?.tab)!=='top10')return false;
  const movies=strict318(raw.movies,p,false).slice(0,10),series=strict318(raw.series,p,false).slice(0,10);
  let providerName='Streaming';try{providerName=(ct171ProviderList||[]).find(x=>Number(x.provider_id)===Number(provider))?.provider_name||providerName}catch{}
  content.innerHTML=`<div class="ct288-top-name"><b>${esc(providerName)}</b></div>
   <section class="panel ct288-top-section"><div class="panel-head"><h2>Top 10 Séries</h2><small>${series.length}</small></div><div class="ct318-top-row">${series.map((x,i)=>publicCard318(x,i+1)).join('')||'<div class="empty">Sem séries elegíveis neste streaming.</div>'}</div></section>
   <section class="panel ct288-top-section"><div class="panel-head"><h2>Top 10 Filmes</h2><small>${movies.length}</small></div><div class="ct318-top-row">${movies.map((x,i)=>publicCard318(x,i+1)).join('')||'<div class="empty">Sem filmes elegíveis neste streaming.</div>'}</div></section>`;
  loaded318();return true;
 }catch(e){content.innerHTML='<div class="empty">Não foi possível carregar o Top 10 agora.</div>';loaded318();return false}
}
async function loadTop318(force=false){
 const h=host();if(!h)return false;const token=++state.topToken;loading318('Carregando Top 10…');
 h.innerHTML='<section class="ct288-top-shell"><div class="ct288-top-title"><h2>Top 10</h2></div><div class="ct288-provider-row" data-ct318-providers><div class="ct263-loading">Carregando streamings…</div></div><div data-ct318-top-content><div class="ct263-loading">Carregando Top 10…</div></div></section>';
 try{
  const providers=typeof ct171Providers==='function'?await ct171Providers():[];
  if(token!==state.topToken||String(discover?.tab)!=='top10')return false;
  if(!state.topProvider||!providers.some(p=>Number(p.provider_id)===Number(state.topProvider)))state.topProvider=Number((typeof ct171TopProvider!=='undefined'&&ct171TopProvider)||providers[0]?.provider_id||0);
  try{ct171TopProvider=state.topProvider}catch{}
  const box=q('[data-ct318-providers]');if(box)box.innerHTML=providerButtons318(providers);
  if(state.topProvider)return paintTop318(state.topProvider,token,force);
  loaded318();return false;
 }catch(e){const c=q('[data-ct318-top-content]');if(c)c.innerHTML='<div class="empty">Não foi possível carregar os streamings agora.</div>';loaded318();return false}
}
async function persist318(btn){
 if(!btn||btn.disabled)return false;
 const [type,idRaw]=String(btn.dataset.media||'').split(':'),id=Number(idRaw||0),action=String(btn.dataset.ct318Action||'');if(!id)return false;
 const old=btn.textContent;btn.disabled=true;btn.textContent='…';
 try{
  if(action==='watchlist')await addWatchlist(type,id);else if(action==='seen')await markSeen(type,id);else return false;
  personal={at:0,blocked:new Set(),aliases:new Set()};personalTask=null;
  try{window.__ctR310?.invalidateWatch?.()}catch{}
  btn.closest('[data-ct318-item]')?.remove();
  void personal318(true);
  return true;
 }catch(e){btn.disabled=false;btn.textContent=old;try{toast(e?.message||String(e))}catch{}return false}
}
function prefetch318(){if(routeNow()!=='discover')return;for(const t of STRICT)void source318(t,false)}
async function loadDiscover318(tab=discover?.tab,force=false){
 if(!discover)return false;const t=String(tab||'foryou');discover.tab=t;
 if(t==='top10')discover.type='all';syncShell318();
 if(t==='foryou')return loadForYou318(force);
 if(t==='top10')return loadTop318(force);
 if(STRICT.has(t))return loadPublic318(t,force);
 if(t==='calendar'){
  loaded318();
  try{return await window.__ctR315?.loadDiscover?.('calendar',force)}catch{return false}
 }
 return false;
}
function renderDiscover318(seq){
 setApp(shell('Descobrir','Recomendações, Top 10, tendências, novidades, lançamentos e calendário.','discover',shell318()));
 if(seq!==navSeq||routeNow()!=='discover')return;syncShell318();void loadDiscover318(discover?.tab||'foryou',false);setTimeout(prefetch318,0);
}
try{renderDiscover=renderDiscover318}catch{}
window.__ctR288LoadDiscover=loadDiscover318;

function early318(target){
 if(!target?.closest)return false;
 const tab=target.closest('[data-ct318-tab]');if(tab){state.filterOpen=false;discover.tab=tab.dataset.ct318Tab;if(discover.tab==='top10')discover.type='all';void loadDiscover318(discover.tab,false);return true}
 const filter=target.closest('[data-ct318-filter]');if(filter){state.filterOpen=!state.filterOpen;syncShell318();return true}
 const fy=target.closest('[data-ct318-fy-kind]');if(fy){state.fyKind=fy.dataset.ct318FyKind||'all';state.filterOpen=false;syncShell318();applyForYouFilter318();return true}
 const ty=target.closest('[data-ct318-type]');if(ty){discover.type=ty.dataset.ct318Type||'all';state.filterOpen=false;syncShell318();void loadPublic318(String(discover.tab),false);return true}
 const provider=target.closest('[data-ct318-provider]');if(provider){state.topProvider=Number(provider.dataset.ct318Provider||0);try{ct171TopProvider=state.topProvider}catch{};qa('[data-ct318-provider]').forEach(b=>b.classList.toggle('active',Number(b.dataset.ct318Provider)===state.topProvider));void paintTop318(state.topProvider,state.topToken,false);return true}
 const action=target.closest('[data-ct318-action]');if(action){void persist318(action);return true}
 const retry=target.closest('[data-ct318-retry]');if(retry){void loadDiscover318(String(discover?.tab||'foryou'),true);return true}
 if(target.closest('[data-ct318-prev]')){q('[data-ct318-tabs]')?.scrollBy({left:-360,behavior:'smooth'});return true}
 if(target.closest('[data-ct318-next]')){q('[data-ct318-tabs]')?.scrollBy({left:360,behavior:'smooth'});return true}
 if(target.closest('[data-ct309-swap],[data-ct309-action]'))setTimeout(applyForYouFilter318,0);
 return false;
}
window.__ctR318EarlyHandle=early318;

window.addEventListener('cinetracker:data-changed',()=>{
 personal={at:0,blocked:new Set(),aliases:new Set()};personalTask=null;sourceCache.clear();topCache.clear();
 if(routeNow()==='discover'&&STRICT.has(String(discover?.tab)))void loadPublic318(String(discover.tab),true);
});
try{
 const app=q('#app');if(app&&window.MutationObserver)new MutationObserver(()=>{if(routeNow()==='discover'&&String(discover?.tab)==='foryou')requestAnimationFrame(applyForYouFilter318)}).observe(app,{subtree:true,childList:true});
}catch{}

const style=document.createElement('style');style.id='ct-web-r318';style.textContent=`
.ct318-loadline{min-height:18px;margin:0 0 5px;font-size:11px;opacity:.68}.ct318-loadline[hidden]{display:block!important;visibility:hidden!important}
.ct318-public{overflow:hidden!important}.ct318-rail,.ct318-top-row{display:flex!important;flex-flow:row nowrap!important;align-items:flex-start!important;gap:10px!important;overflow-x:auto!important;overflow-y:hidden!important;padding:2px 1px 10px!important;scrollbar-width:thin!important;scroll-snap-type:x proximity!important}
.ct318-item{box-sizing:border-box!important;display:flex!important;flex:0 0 176px!important;width:176px!important;min-width:176px!important;max-width:176px!important;flex-direction:column!important;align-self:flex-start!important;scroll-snap-align:start!important}
.ct318-item>.ct288-card{width:100%!important;min-width:0!important}.ct318-actions{display:grid!important;grid-template-columns:1fr 1fr!important;gap:6px!important;width:100%!important;margin-top:5px!important}
.ct318-actions .chip{width:100%!important;min-width:0!important;height:30px!important;min-height:30px!important;padding:4px 6px!important;border-radius:9px!important;font-size:11px!important;white-space:nowrap!important}
[data-ct309-foryou][data-ct318-fy-filter="movie"] .ct309-slot:not([data-ct309-slot$=":movie"]),
[data-ct309-foryou][data-ct318-fy-filter="series"] .ct309-slot:not([data-ct309-slot$=":series"]),
[data-ct309-foryou][data-ct318-fy-filter="anime"] .ct309-slot:not([data-ct309-slot$=":anime"]){display:none!important}
[data-ct309-foryou][data-ct318-fy-filter="series"] .ct309-daily,
[data-ct309-foryou][data-ct318-fy-filter="anime"] .ct309-daily{display:none!important}
[data-ct309-foryou]:not([data-ct318-fy-filter="all"]) .ct309-fy-grid{grid-template-columns:minmax(0,176px)!important}
.ct318-types{display:flex!important;gap:7px!important;overflow-x:auto!important;margin:0 0 10px!important;padding:0 0 4px!important}.ct318-types[hidden]{display:none!important}
@media(max-width:760px){.ct318-item{flex-basis:142px!important;width:142px!important;min-width:142px!important;max-width:142px!important}.ct318-actions{grid-template-columns:1fr!important}[data-ct309-foryou]:not([data-ct318-fy-filter="all"]) .ct309-fy-grid{grid-template-columns:minmax(0,154px)!important}}
`;
document.head.appendChild(style);

window.__ctR318={renderDiscover:renderDiscover318,loadDiscover:loadDiscover318,strict:strict318,personal:personal318,applyForYouFilter:applyForYouFilter318,loadTop:loadTop318,version:'1.0.109'};
window.__ctR318Test={TABS,STRICT,state,shell318,strict318,filterMarkup318,applyForYouFilter318,sourceNetwork318,paintPublic318,setPersonal(v){personal={at:Date.now(),blocked:new Set(v?.blocked||[]),aliases:new Set(v?.aliases||[])}},setTestBridge(v){testBridge=v&&typeof v==='object'?v:null},setDiscover(tab,type='all'){if(discover){discover.tab=tab;discover.type=type}}};
})();
