/* CineTracker Web 1.0.106 r315 — restore approved Discover, remove legacy F1 rail, restore Profile stats contract. WEB ONLY. */
(()=>{
'use strict';
if(window.__ctR315)return;
window.__ctR315='restore-approved-discover+remove-legacy-f1+restore-profile-stat-contract';
window.__ctR315Discover='r309-foryou-actions+r288-top10-two-rails+strict-six-dual-actions';
window.__ctR315F1='legacy-watch-panel-removed+race-detail-preserved';
window.__ctR315Profile='r238-order+live-sports-stats+history-actions+unified-collapse';
window.__ctR315Android='preserved-1.0.20-10062';

const R=window.__ctR288R263||{},M=window.__ctR295Test||{},R310=window.__ctR310||{};
const q=(s,r=document)=>r&&r.querySelector?r.querySelector(s):null,qa=(s,r=document)=>[...((r&&r.querySelectorAll?r.querySelectorAll(s):[])||[])];
const rows=v=>Array.isArray(v)?v:[];
const esc=v=>String(v==null?'':v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v==null?'':v).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const routeNow=()=>{try{return String(typeof route==='function'?route():'')}catch{return''}};
const discover=R.discover263||null;
const typeOf=typeof R.type263==='function'?R.type263:(x=>String(x&&((x.media_type||x.type)||'tv'))==='movie'?'movie':'tv');
const idOf=typeof R.id263==='function'?R.id263:(x=>Number((x&&(x.tmdb_id||x.source_tmdb_id||x.id))||0));
const titleOf=typeof R.title263==='function'?R.title263:(x=>(x&&(x.title||x.name||x.media_title||(x.raw_tmdb&&(x.raw_tmdb.title||x.raw_tmdb.name))))||'Sem título');
const yearOf=typeof R.year263==='function'?R.year263:(x=>String((x&&(x.release_date||x.first_air_date||x.release_year||(x.raw_tmdb&&(x.raw_tmdb.release_date||x.raw_tmdb.first_air_date))))||'').slice(0,4));
const keyOf=x=>(typeOf(x)==='movie'?'movie':'tv')+':'+Number(idOf(x)||0);
const validKey=k=>/^(movie|tv):[1-9]\d*$/.test(String(k||''));
const aliasOf=x=>(typeOf(x)==='movie'?'movie':'tv')+'|'+norm(titleOf(x))+'|'+yearOf(x);
const TABS=[['foryou','Pra você'],['top10','Top 10'],['trending','Em alta'],['popular','Populares'],['new','Novidades'],['releases','Lançamentos'],['anticipated','Mais Aguardados'],['top','Mais bem avaliados'],['calendar','Calendário']];
const LABELS=Object.fromEntries(TABS),STRICT=new Set(['trending','popular','new','releases','anticipated','top']);
const STALE_MS=5*60*1000;
let filterOpen=false,loadToken=0,personal={at:0,blocked:new Set(),aliases:new Set()},personalTask=null,sourceCache=new Map(),sourceTasks=new Map(),testBridge=null;
const baseLoad315=window.__ctR288LoadDiscover;

function jwtExpired315(e){return /jwt\s*expired|token\s*expired|invalid\s*jwt/i.test(String((e&&e.message)||e||''))}
async function rpc315(name,args){try{return await rpc(name,args)}catch(e){if(!jwtExpired315(e))throw e;await restoreSession();return rpc(name,args)}}
function discoverRoot(){return q('[data-ct315-discover]')}
function discoverHost(){return q('[data-ct315-content]')||q('[data-ct263-discover-content]')}
function shellHtml315(){
 if(!discover)return '<div class="page"><div class="empty">Descobrir indisponível.</div></div>';
 const tab=String(discover.tab||'foryou'),type=String(discover.type||'all');
 const tabs=TABS.map(x=>'<button type="button" class="chip '+(tab===x[0]?'active':'')+'" data-ct315-tab="'+x[0]+'">'+x[1]+'</button>').join('');
 const types=[['all','Todos'],['movie','Filmes'],['tv','Séries']].map(x=>'<button type="button" class="chip '+(type===x[0]?'active':'')+'" data-ct315-type="'+x[0]+'">'+x[1]+'</button>').join('');
 const browse=STRICT.has(tab)||tab==='calendar';
 return '<div class="page ct315-discover" data-discover data-ct315-discover data-ct288-discover>'+
  '<div class="ct288-tab-shell ct315-tab-shell"><button type="button" class="ct288-tab-arrow" data-ct315-prev aria-label="Abas anteriores">‹</button>'+
  '<div class="tabs ct288-tabs ct315-tabs" data-ct315-tabs>'+tabs+'</div>'+
  '<button type="button" class="ct288-tab-arrow" data-ct315-next aria-label="Próximas abas">›</button>'+
  '<button type="button" class="ct288-filter-btn ct315-filter" data-ct315-filter data-ct288-filter aria-label="Filtrar por tipo" '+(browse?'':'hidden')+' aria-expanded="'+(filterOpen?'true':'false')+'">☷<i></i></button></div>'+
  '<div class="filters ct288-types ct315-types" data-ct315-types data-ct288-types '+(browse&&filterOpen?'':'hidden')+'>'+types+'</div>'+
  '<div class="ct315-loadline" data-ct315-loadline hidden></div>'+
  '<div data-ct315-content data-ct314-content data-ct313-content data-ct263-discover-content><div class="ct263-loading">Carregando títulos…</div></div></div>';
}
function syncShell315(){
 const root=discoverRoot();if(!root||!discover)return;
 const tab=String(discover.tab||'foryou'),browse=STRICT.has(tab)||tab==='calendar';
 qa('[data-ct315-tab]',root).forEach(b=>b.classList.toggle('active',b.dataset.ct315Tab===tab));
 const f=q('[data-ct315-filter]',root),types=q('[data-ct315-types]',root);
 if(f){f.hidden=!browse;f.setAttribute('aria-expanded',String(browse&&filterOpen))}
 if(types){types.hidden=!browse||!filterOpen;qa('[data-ct315-type]',types).forEach(b=>b.classList.toggle('active',b.dataset.ct315Type===String(discover.type||'all')))}
 const rail=q('[data-ct315-tabs]',root),active=rail&&rail.querySelector('[data-ct315-tab="'+tab+'"]');
 if(rail&&active){const rr=rail.getBoundingClientRect(),ar=active.getBoundingClientRect();if(ar.left<rr.left||ar.right>rr.right)active.scrollIntoView({behavior:'smooth',block:'nearest',inline:'center'})}
}
function loading315(t){const el=q('[data-ct315-loadline]',discoverRoot());if(el){el.hidden=false;el.textContent=t||'Carregando…'}}
function loaded315(){const el=q('[data-ct315-loadline]',discoverRoot());if(el){el.hidden=true;el.textContent=''}}
function addBlocked315(out,x,force=false){
 if(!x)return;const k=keyOf(x),blocked=force||!!(x.is_watchlist||x.is_seen||x.is_completed||x.is_in_progress||x.is_up_to_date||Number(x.watched_episodes||0)>0||x.last_watched_at);
 if(blocked&&validKey(k))out.blocked.add(k);
 if(blocked){const a=aliasOf(x);if(a&&!a.endsWith('|'))out.aliases.add(a)}
}
async function personal315(force=false){
 if(testBridge&&testBridge.personal)return testBridge.personal(force);
 if(!force&&personal.at&&Date.now()-personal.at<60000)return personal;
 if(personalTask&&!force)return personalTask;
 personalTask=(async()=>{
  const out={at:Date.now(),blocked:new Set(),aliases:new Set()};
  const jobs=[
   Promise.resolve(M.authority?M.authority(!!force):null).catch(()=>null),
   Promise.resolve(R310.canonicalWatchlist?R310.canonicalWatchlist(!!force):null).catch(()=>null),
   Promise.resolve(typeof rpc==='function'?rpc315('cinetracker_profile_media_dashboard_v0991',{}):null).catch(()=>null),
   Promise.resolve(typeof rpc==='function'?rpc315('cinetracker_discovery_exclusions_v0994',{}):null).catch(()=>null)
  ];
  const all=await Promise.all(jobs),a=all[0],w=all[1],dash=all[2],ex=all[3];
  for(const k of (a&&a.seen)||[])out.blocked.add(String(k));
  for(const k of (a&&a.watch)||[])out.blocked.add(String(k));
  for(const x of (a&&a.watchRows)||[])addBlocked315(out,x,true);
  for(const x of (w&&w.rows)||[])addBlocked315(out,x,true);
  for(const k of (w&&w.keys)||[])out.blocked.add(String(k));
  for(const x of rows((dash&&dash.rows)||dash))addBlocked315(out,x,false);
  for(const x of rows((ex&&ex.rows)||ex)){const k=keyOf(x);if(validKey(k))out.blocked.add(k);const al=aliasOf(x);if(al&&!al.endsWith('|'))out.aliases.add(al)}
  personal=out;return out;
 })().finally(()=>{personalTask=null});
 return personalTask;
}
function filterStrict315(list,p=personal){
 const out=[],keys=new Set(),aliases=new Set(),want=String((discover&&discover.type)||'all');
 for(const x of rows(list)){
  const k=keyOf(x),a=aliasOf(x);if(!validKey(k)||keys.has(k)||aliases.has(a))continue;keys.add(k);aliases.add(a);
  if((want==='movie'||want==='tv')&&typeOf(x)!==want)continue;
  if(p&&p.blocked&&p.blocked.has(k))continue;
  if(p&&p.aliases&&p.aliases.has(a))continue;
  out.push(x);
 }
 return out;
}
function day315(delta=0){const d=new Date();d.setUTCHours(12,0,0,0);d.setUTCDate(d.getUTCDate()+delta);return d.toISOString().slice(0,10)}
async function tmdbPage315(path,params,type){
 if(typeof tmdb!=='function')return[];
 try{const p=await tmdb(path,{language:'pt-BR',include_adult:false,...params});return rows(p&&p.results).map(x=>({...x,media_type:x.media_type||type||'tv',tmdb_id:Number(x.id||x.tmdb_id||0)})).filter(x=>['movie','tv'].includes(x.media_type))}catch{return[]}
}
async function sourceNetwork315(tab){
 const jobs=[],today=day315(0),past=day315(-120),future=day315(365),releaseFrom=day315(-7),releaseTo=day315(30);
 if(tab==='trending')jobs.push(tmdbPage315('/trending/all/week',{page:1}),tmdbPage315('/trending/all/week',{page:2}));
 else if(tab==='popular')jobs.push(tmdbPage315('/movie/popular',{page:1},'movie'),tmdbPage315('/tv/popular',{page:1},'tv'),tmdbPage315('/movie/popular',{page:2},'movie'),tmdbPage315('/tv/popular',{page:2},'tv'));
 else if(tab==='new')jobs.push(tmdbPage315('/discover/movie',{'primary_release_date.gte':past,'primary_release_date.lte':today,sort_by:'primary_release_date.desc',page:1},'movie'),tmdbPage315('/discover/tv',{'first_air_date.gte':past,'first_air_date.lte':today,sort_by:'first_air_date.desc',page:1},'tv'));
 else if(tab==='releases')jobs.push(tmdbPage315('/discover/movie',{'primary_release_date.gte':releaseFrom,'primary_release_date.lte':releaseTo,sort_by:'primary_release_date.asc',page:1},'movie'),tmdbPage315('/discover/tv',{'first_air_date.gte':releaseFrom,'first_air_date.lte':releaseTo,sort_by:'first_air_date.asc',page:1},'tv'),tmdbPage315('/discover/movie',{'primary_release_date.gte':releaseFrom,'primary_release_date.lte':releaseTo,sort_by:'primary_release_date.asc',page:2},'movie'),tmdbPage315('/discover/tv',{'first_air_date.gte':releaseFrom,'first_air_date.lte':releaseTo,sort_by:'first_air_date.asc',page:2},'tv'));
 else if(tab==='anticipated')jobs.push(tmdbPage315('/discover/movie',{'primary_release_date.gte':today,'primary_release_date.lte':future,sort_by:'popularity.desc',page:1},'movie'),tmdbPage315('/discover/tv',{'first_air_date.gte':today,'first_air_date.lte':future,sort_by:'popularity.desc',page:1},'tv'));
 else if(tab==='top')jobs.push(tmdbPage315('/movie/top_rated',{page:1},'movie'),tmdbPage315('/tv/top_rated',{page:1},'tv'),tmdbPage315('/movie/top_rated',{page:2},'movie'),tmdbPage315('/tv/top_rated',{page:2},'tv'));
 return (await Promise.all(jobs)).flat();
}
async function source315(tab,force=false){
 if(testBridge&&testBridge.source)return rows(await testBridge.source(tab,force));
 const hit=sourceCache.get(tab);if(!force&&hit&&Date.now()-hit.at<STALE_MS)return hit.rows;
 if(!force&&sourceTasks.has(tab))return sourceTasks.get(tab);
 const task=sourceNetwork315(tab).then(v=>{sourceCache.set(tab,{at:Date.now(),rows:rows(v)});return rows(v)}).finally(()=>sourceTasks.delete(tab));
 sourceTasks.set(tab,task);return task;
}
function publicCard315(x){
 const k=keyOf(x);let media='';
 try{media=typeof ct288Card==='function'?ct288Card(x,{watch:false,add:false,slot:true}):''}catch{}
 return '<div class="ct315-item" data-ct315-item="'+esc(k)+'">'+media+
  '<div class="ct315-actions"><button type="button" class="chip ct315-watch" data-ct315-action="watchlist" data-media="'+esc(k)+'">+ Watchlist</button>'+
  '<button type="button" class="chip ct315-seen" data-ct315-action="seen" data-media="'+esc(k)+'">✓ Visto</button></div></div>';
}
function paintPublic315(list,tab){
 const h=discoverHost();if(!h)return false;const clean=filterStrict315(list);
 h.innerHTML='<section class="panel ct315-public"><div class="panel-head"><h2>'+esc(LABELS[tab]||'Descobrir')+'</h2><small>'+clean.length+'</small></div>'+
  '<div class="ct315-rail">'+(clean.map(publicCard315).join('')||'<div class="empty">Nenhum item elegível no momento.</div>')+'</div></section>';
 loaded315();return true;
}
async function loadPublic315(tab,force=false){
 const token=++loadToken;loading315('Carregando '+(LABELS[tab]||'títulos')+'…');
 try{
  const pair=await Promise.all([personal315(!!force),source315(tab,!!force)]),p=pair[0],raw=pair[1];
  if(token!==loadToken||routeNow()!=='discover'||!discover||String(discover.tab)!==tab)return false;
  return paintPublic315(filterStrict315(raw,p),tab);
 }catch(e){
  if(token===loadToken){const h=discoverHost();if(h)h.innerHTML='<div class="empty">Não foi possível carregar esta área agora.<br><button type="button" class="chip" data-ct315-retry>Tentar novamente</button></div>';loaded315()}
  return false;
 }
}
async function persist315(btn){
 if(!btn||btn.disabled)return false;const raw=String(btn.dataset.media||''),parts=raw.split(':'),type=parts[0],id=Number(parts[1]||0),action=String(btn.dataset.ct315Action||'');if(!id)return false;
 const old=btn.textContent;btn.disabled=true;btn.textContent='…';
 try{
  if(action==='watchlist'){if(testBridge&&testBridge.addWatchlist)await testBridge.addWatchlist(type,id);else await addWatchlist(type,id)}
  else if(action==='seen'){if(testBridge&&testBridge.markSeen)await testBridge.markSeen(type,id);else await markSeen(type,id)}
  else return false;
  personal={at:0,blocked:new Set(),aliases:new Set()};personalTask=null;try{R310.invalidateWatch&&R310.invalidateWatch()}catch{}
  const item=btn.closest('[data-ct315-item]');if(item)item.remove();
  void personal315(true);return true;
 }catch(e){btn.disabled=false;btn.textContent=old;try{toast(e&&e.message?e.message:String(e))}catch{}return false}
}
function prefetch315(){if(routeNow()!=='discover')return;for(const tab of STRICT)void source315(tab,false)}
async function loadDiscover315(tab=discover&&discover.tab,force=false){
 if(!discover)return false;const t=String(tab||'foryou');discover.tab=t;if(t==='foryou'||t==='top10')discover.type='all';syncShell315();
 if(t==='foryou'){
  loading315('Montando recomendações…');
  try{if(window.__ctR309&&typeof window.__ctR309.buildForYou==='function'){await window.__ctR309.buildForYou(!!force);loaded315();return true}}catch{}
 }
 if(t==='top10'){
  loaded315();try{discover.gen=Number(discover.gen||0)+1;if(window.__ctR288Test&&typeof window.__ctR288Test.loadTop10==='function'){await window.__ctR288Test.loadTop10(discover.gen);return true}}catch{}
 }
 if(STRICT.has(t))return loadPublic315(t,force);
 if(t==='calendar'&&typeof baseLoad315==='function'){try{return await baseLoad315.call(this,t,force)}catch{}}
 loaded315();return false;
}
function renderDiscover315(seq){
 setApp(shell('Descobrir','Recomendações, Top 10, tendências, novidades, lançamentos e calendário.','discover',shellHtml315()));
 if(seq!==navSeq||routeNow()!=='discover')return;syncShell315();void loadDiscover315(discover&&discover.tab||'foryou',false);setTimeout(prefetch315,0);
}

function statByLabel315(panel,label){const want=norm(label);return qa('.stat,[data-stat],.stat-card,.profile-stat,button,a,[role="button"]',panel).find(x=>norm((q('small,label,.stat-label,.label',x)||x).textContent).includes(want))||null}
function ensureStadium315(root,count){
 const panel=qa('section.panel,.panel',root).find(p=>norm((q('.panel-head h2,.panel-head h3,h2,h3',p)||{}).textContent).includes('esportes assistidos'));if(!panel)return null;
 const stats=q('.stats',panel)||panel,events=statByLabel315(panel,'Eventos assistidos');if(!events)return null;let stadium=statByLabel315(panel,'Jogos no Estádio');
 if(!stadium){stadium=events.cloneNode(true);stats.appendChild(stadium)}
 const label=q('small,label,.stat-label,.label',stadium),value=q('b,strong,.value,.stat-value',stadium);if(label)label.textContent='Jogos no Estádio';if(value)value.textContent=Number(count||0).toLocaleString('pt-BR');
 stadium.dataset.ct299History='stadium';stadium.classList.add('ct315-sport-history');return stadium;
}
function staticizeWatchlist315(root){
 for(const card of qa('.stat,[data-stat],.stat-card,.profile-stat,button,a,[role="button"]',root)){
  const label=norm((q('small,label,.stat-label,.label',card)||{}).textContent||'');if(label!=='series watchlist'&&label!=='filmes watchlist')continue;
  card.classList.add('ct315-watchlist-static');delete card.dataset.ct117WatchlistStat;delete card.dataset.watchlistKind;card.removeAttribute('role');card.removeAttribute('tabindex');card.removeAttribute('aria-label');card.removeAttribute('title');
  qa('.ct117-stat-chevron,.stat-link-icon,.stat-arrow,.open-arrow,.profile-card-arrow,[data-open-arrow]',card).forEach(x=>x.remove());
 }
}
function actorRail315(root){
 try{if(window.__ctR309&&typeof window.__ctR309.actorRail==='function')window.__ctR309.actorRail()}catch{}
 const heading=qa('h1,h2,h3,h4,.panel-title,.section-title',root).find(x=>norm(x.textContent).includes('atores favoritos')),section=heading&&heading.closest('section,.panel,article');if(!section)return false;
 const controls=qa('[data-person],[data-person-id]',section),cards=[...new Set(controls.map(x=>x.closest('article,li,.card,.person-card,.actor-card')||x))];if(!cards.length)return false;
 const rail=cards[0].parentElement;if(!rail)return false;section.classList.add('ct315-actor-section');rail.classList.add('ct315-actor-rail');
 cards.forEach(card=>{card.classList.add('ct315-actor-card');const image=q('img,.poster,.avatar,[style*="background-image"]',card);if(image)image.classList.add('ct315-actor-image')});return true;
}
function restoreProfile315(data,stadium){
 const root=q('[data-profile]');if(!root)return false;
 try{if(window.__ctR238ProfileStats)window.__ctR238ProfileStats(data)}catch{}
 try{if(typeof ct168EnsureSportsPanel==='function')ct168EnsureSportsPanel(data)}catch{}
 const main=qa('section.panel',root).find(p=>norm((q('.panel-head h2',p)||{}).textContent)==='estatisticas');
 const sports=qa('section.panel',root).find(p=>norm((q('.panel-head h2',p)||{}).textContent).includes('esportes assistidos'));
 if(main&&sports&&main.nextElementSibling!==sports)main.insertAdjacentElement('afterend',sports);
 ensureStadium315(root,Number((stadium&&stadium.stadium_events)||0));
 try{if(window.__ctR299Test&&window.__ctR299Test.decorateProfile299)window.__ctR299Test.decorateProfile299()}catch{}
 staticizeWatchlist315(root);actorRail315(root);
 try{if(typeof ct163Decorate==='function')ct163Decorate()}catch{}
 try{if(typeof ctR180ProfileButtons==='function')ctR180ProfileButtons()}catch{}
 try{if(window.__ctV114SyncStats)window.__ctV114SyncStats()}catch{}
 root.dataset.ct315Profile='approved-order-live-sports';return true;
}
async function renderProfile315(seq){
 setApp(shell('Perfil','Estatísticas, biblioteca, favoritos e atividade.','profile','<div class="page" data-profile>'+loading('Carregando Perfil...')+'</div>'));
 try{
  const all=await Promise.all([
   rpc315('cinetracker_profile_payload_v0997',{p_tz:tz()}),
   rpc315('cinetracker_sport_stats_v1',{}),
   rpc315('cinetracker_sports_stadium_summary_v296',{})
  ]);
  if(seq!==navSeq||routeNow()!=='profile')return;
  const full=all[0]||{},sports=all[1]||{},stadium=all[2]||{},merged={...full,sports_stats:sports};
  profileCache=merged;
  if(typeof ct168PaintProfile==='function')ct168PaintProfile(merged,'');else if(typeof paintProfile163==='function')paintProfile163(merged);
  restoreProfile315(merged,stadium);return merged;
 }catch(e){
  if(seq!==navSeq||routeNow()!=='profile')return;const root=q('[data-profile]');if(root)root.innerHTML=fail('Falha ao carregar Perfil: '+((e&&e.message)||e),'profile');
 }
}

function removeLegacyF1315(){
 qa('[data-ct263-f1-watch-panel],.ct263-f1-watch-panel').forEach(x=>x.remove());return true;
}
function isWatchlistStat315(target){
 const card=target&&target.closest?target.closest('.stat,[data-stat],.stat-card,.profile-stat,[role="button"]'):null;if(!card)return false;
 const label=norm((q('small,label,.stat-label,.label',card)||{}).textContent||'');return label==='series watchlist'||label==='filmes watchlist';
}
function earlyHandle315(target){
 if(!target||!target.closest)return false;
 if(isWatchlistStat315(target))return true;
 const tab=target.closest('[data-ct315-tab]');if(tab&&discover){discover.tab=String(tab.dataset.ct315Tab||'foryou');filterOpen=false;void loadDiscover315(discover.tab,false);return true}
 const f=target.closest('[data-ct315-filter]');if(f){filterOpen=!filterOpen;syncShell315();return true}
 const ty=target.closest('[data-ct315-type]');if(ty&&discover){discover.type=String(ty.dataset.ct315Type||'all');filterOpen=false;syncShell315();void loadDiscover315(String(discover.tab||''),false);return true}
 const a=target.closest('[data-ct315-action]');if(a){void persist315(a);return true}
 const retry=target.closest('[data-ct315-retry]');if(retry){void loadDiscover315(String(discover&&discover.tab||''),true);return true}
 const prev=target.closest('[data-ct315-prev]');if(prev){q('[data-ct315-tabs]')?.scrollBy({left:-360,behavior:'smooth'});return true}
 const next=target.closest('[data-ct315-next]');if(next){q('[data-ct315-tabs]')?.scrollBy({left:360,behavior:'smooth'});return true}
 return false;
}

try{renderDiscover=renderDiscover315}catch{}
try{renderProfile=renderProfile315}catch{}
window.__ctR288LoadDiscover=loadDiscover315;
document.addEventListener('cinetracker:data-changed',()=>{personal={at:0,blocked:new Set(),aliases:new Set()};personalTask=null;sourceCache.clear();removeLegacyF1315()});
const rootObserver=q('#app');if(rootObserver&&window.MutationObserver){new MutationObserver(()=>{removeLegacyF1315();const p=q('[data-profile]');if(p)staticizeWatchlist315(p)}).observe(rootObserver,{subtree:true,childList:true})}
removeLegacyF1315();

const style=document.createElement('style');style.id='ct-web-r315';style.textContent=
'[data-ct263-f1-watch-panel],.ct263-f1-watch-panel{display:none!important}'+
'.ct315-loadline{min-height:18px;margin:0 0 5px;font-size:11px;opacity:.68}.ct315-loadline[hidden]{visibility:hidden!important;display:block!important}'+
'.ct315-public{overflow:hidden!important}.ct315-rail{display:flex!important;flex-flow:row nowrap!important;align-items:flex-start!important;gap:10px!important;overflow-x:auto!important;overflow-y:hidden!important;padding:2px 1px 9px!important;scrollbar-width:thin!important;scroll-snap-type:x proximity!important}'+
'.ct315-item{box-sizing:border-box!important;display:flex!important;flex:0 0 176px!important;width:176px!important;min-width:176px!important;max-width:176px!important;flex-direction:column!important;align-self:flex-start!important;scroll-snap-align:start!important}'+
'.ct315-item>.ct288-card{width:100%!important;min-width:0!important}.ct315-actions{display:grid!important;grid-template-columns:minmax(0,1fr) minmax(0,1fr)!important;gap:6px!important;width:100%!important;margin-top:5px!important}'+
'.ct315-actions .chip{width:100%!important;min-width:0!important;height:30px!important;min-height:30px!important;padding:4px 6px!important;border-radius:9px!important;font-size:11px!important;white-space:nowrap!important}'+
'.ct315-watchlist-static{cursor:default!important;pointer-events:none!important;transform:none!important}.ct315-watchlist-static .ct117-stat-chevron,.ct315-watchlist-static .stat-arrow,.ct315-watchlist-static .open-arrow{display:none!important}'+
'.ct315-actor-section{overflow-x:hidden!important}.ct315-actor-rail{display:flex!important;flex-flow:row nowrap!important;align-items:stretch!important;gap:12px!important;overflow-x:auto!important;overflow-y:hidden!important;padding:2px 2px 12px!important;scrollbar-width:thin!important}.ct315-actor-card{flex:0 0 132px!important;width:132px!important;min-width:132px!important;max-width:132px!important}.ct315-actor-image{width:132px!important;height:176px!important;min-width:132px!important;min-height:176px!important;max-width:132px!important;max-height:176px!important;object-fit:cover!important}'+
'@media(max-width:760px){.ct315-item{flex-basis:142px!important;width:142px!important;min-width:142px!important;max-width:142px!important}.ct315-actions{grid-template-columns:1fr!important}}';
document.head.appendChild(style);

window.__ctR315EarlyHandle=earlyHandle315;
window.__ctR315={renderDiscover:renderDiscover315,loadDiscover:loadDiscover315,renderProfile:renderProfile315,restoreProfile:restoreProfile315,removeLegacyF1:removeLegacyF1315,version:'1.0.106'};
window.__ctR315Test={TABS,STRICT,shellHtml315,filterStrict315,publicCard315,ensureStadium315,staticizeWatchlist315,restoreProfile315,removeLegacyF1315,setPersonal(v){personal={at:Date.now(),blocked:new Set(v&&v.blocked||[]),aliases:new Set(v&&v.aliases||[])}},setDiscover(tab,type='all'){if(discover){discover.tab=tab;discover.type=type}},setTestBridge(v){testBridge=v&&typeof v==='object'?v:null}};
})();
