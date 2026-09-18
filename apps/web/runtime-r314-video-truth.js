/* CineTracker Web 1.0.105 r314 — video-truth Discover/F1/Profile final owners. WEB ONLY. */
(()=>{
'use strict';
if(window.__ctR314)return;
window.__ctR314='discover-calendar-foryou-final+f1-no-watch-summary+profile-stats-collapse';
window.__ctR314Discover='public-hard-barrier+calendar-owned+foryou-owned+compact-actions+unclipped-copy';
window.__ctR314F1='never-show-watch-summary+preserve-clickable-weekends';
window.__ctR314Profile='four-identical-clickable-stats+sports-collapse+live-actors';
window.__ctR314Sports='preserve-next-previous-dynamic-filter+jwt-refresh-retry';
window.__ctR314Android='preserved-1.0.20-10062';

const R=window.__ctR288R263||{},M=window.__ctR295Test||{},R310=window.__ctR310||{},R309T=window.__ctR309Test||{};
const q=(s,r=document)=>r?.querySelector?.(s)||null,qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])],rows=v=>Array.isArray(v)?v:[];
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const routeNow=()=>{try{return String(typeof route==='function'?route():'')}catch{return''}};
const discover=R.discover263||null;
const typeOf=typeof R.type263==='function'?R.type263:(x=>String(x?.media_type||x?.type||'tv')==='movie'?'movie':'tv');
const idOf=typeof R.id263==='function'?R.id263:(x=>Number(x?.tmdb_id||x?.source_tmdb_id||x?.id||0));
const titleOf=x=>x?.title||x?.name||x?.media_title||x?.raw_tmdb?.title||x?.raw_tmdb?.name||'Sem título';
const yearOf=x=>String(x?.release_date||x?.first_air_date||x?.release_year||x?.raw_tmdb?.release_date||x?.raw_tmdb?.first_air_date||'').slice(0,4);
const keyOf=x=>`${typeOf(x)==='movie'?'movie':'tv'}:${Number(idOf(x)||0)}`;
const aliasOf=x=>`${typeOf(x)==='movie'?'movie':'tv'}|${norm(titleOf(x))}|${yearOf(x)}`;
const validKey=k=>/^(movie|tv):[1-9]\d*$/.test(String(k||''));
const PUBLIC=new Set(['trending','popular','new','anticipated','top']);
const TABS=[['foryou','Pra você'],['top10','Top 10'],['trending','Em alta'],['popular','Populares'],['new','Novidades'],['anticipated','Mais Aguardados'],['top','Mais bem avaliados'],['calendar','Calendário']];
const LABELS=Object.fromEntries(TABS);
let filterOpen=false,loadToken=0,personal={at:0,seen:new Set(),watch:new Set(),blocked:new Set(),aliases:new Set()},personalTask=null,sourceCache=new Map(),viewCache=new Map(),testBridge=null;

function expired314(e){return /jwt\s*expired|token\s*expired|invalid\s*jwt/i.test(String(e?.message||e||''))}
async function rpc314(name,args){
 if(testBridge?.rpc)return testBridge.rpc(name,args);
 try{return await rpc(name,args)}catch(e){if(!expired314(e))throw e;await restoreSession();return rpc(name,args)}
}
function discoverRoot(){return q('[data-ct314-discover]')}
function discoverHost(){return q('[data-ct314-content]')||q('[data-ct313-content]')||q('[data-ct263-discover-content]')}
function shellHtml314(){
 const tab=String(discover?.tab||'foryou'),type=String(discover?.type||'all');
 const tabs=TABS.map(([k,l])=>`<button type="button" class="chip ${tab===k?'active':''}" data-ct314-tab="${k}">${l}</button>`).join('');
 const types=[['all','Todos'],['movie','Filmes'],['tv','Séries']].map(([k,l])=>`<button type="button" class="chip ${type===k?'active':''}" data-ct314-type="${k}">${l}</button>`).join('');
 return `<div class="page ct314-discover" data-discover data-ct314-discover><div class="ct314-tab-shell"><button type="button" class="ct288-tab-arrow" data-ct314-tab-prev aria-label="Abas anteriores">‹</button><div class="tabs ct314-tabs" data-ct314-tabs>${tabs}</div><button type="button" class="ct288-tab-arrow" data-ct314-tab-next aria-label="Próximas abas">›</button><button type="button" class="ct288-filter-btn ct314-filter-btn" data-ct314-filter aria-label="Filtrar por tipo" aria-expanded="${filterOpen?'true':'false'}">☷<i></i></button></div><div class="filters ct314-types" data-ct314-types ${filterOpen&&(PUBLIC.has(tab)||tab==='calendar')?'':'hidden'}>${types}</div><div class="ct314-loadline" data-ct314-loadline hidden></div><div class="ct314-content" data-ct314-content data-ct263-discover-content><div class="ct263-loading">Carregando títulos…</div></div></div>`;
}
function syncShell314(){
 const root=discoverRoot();if(!root)return false;const tab=String(discover?.tab||'foryou'),filterable=PUBLIC.has(tab)||tab==='calendar';
 for(const b of qa('[data-ct314-tab]',root))b.classList.toggle('active',String(b.dataset.ct314Tab)===tab);
 const filter=q('[data-ct314-filter]',root),types=q('[data-ct314-types]',root);
 if(filter){filter.hidden=!filterable;filter.setAttribute('aria-expanded',String(filterable&&filterOpen))}
 if(types){types.hidden=!filterable||!filterOpen;for(const b of qa('[data-ct314-type]',types))b.classList.toggle('active',String(b.dataset.ct314Type)===String(discover?.type||'all'))}
 return true;
}
function loading314(txt){
 const line=q('[data-ct314-loadline]',discoverRoot());if(line){line.hidden=false;line.textContent=txt||'Carregando títulos…'}
}
function loaded314(){const line=q('[data-ct314-loadline]',discoverRoot());if(line){line.hidden=true;line.textContent=''}}

function addPersonal314(out,x,force=false){
 if(!x)return;const k=keyOf(x),alias=aliasOf(x),watch=force||!!x?.is_watchlist,seen=!!(x?.is_seen||x?.is_completed||x?.is_in_progress||x?.is_up_to_date||Number(x?.watched_episodes||0)>0||x?.last_watched_at);
 if(validKey(k)){if(watch)out.watch.add(k);if(seen)out.seen.add(k);if(watch||seen)out.blocked.add(k)}
 if((watch||seen)&&alias&&!alias.endsWith('|'))out.aliases.add(alias);
}
async function personal314(force=false){
 if(testBridge?.personal)return testBridge.personal(force);
 if(!force&&personal.at&&Date.now()-personal.at<30000)return personal;
 if(personalTask&&!force)return personalTask;
 personalTask=(async()=>{
  const out={at:Date.now(),seen:new Set(),watch:new Set(),blocked:new Set(),aliases:new Set()};
  const [a,w,dash,ex]=await Promise.all([
   Promise.resolve(M.authority?.(!!force)).catch(()=>null),
   Promise.resolve(R310.canonicalWatchlist?.(!!force)).catch(()=>null),
   Promise.resolve(rpc314('cinetracker_profile_media_dashboard_v0991',{})).catch(()=>null),
   Promise.resolve(rpc314('cinetracker_discovery_exclusions_v0994',{})).catch(()=>null)
  ]);
  for(const k of a?.seen||[]){out.seen.add(String(k));out.blocked.add(String(k))}
  for(const k of a?.watch||[]){out.watch.add(String(k));out.blocked.add(String(k))}
  for(const x of a?.watchRows||[])addPersonal314(out,x,true);
  for(const x of w?.rows||[])addPersonal314(out,x,true);
  for(const k of w?.keys||[]){out.watch.add(String(k));out.blocked.add(String(k))}
  for(const x of rows(dash?.rows||dash))addPersonal314(out,x,false);
  for(const x of rows(ex?.rows||ex)){const k=keyOf(x),al=aliasOf(x);if(validKey(k))out.blocked.add(k);if(al&&!al.endsWith('|'))out.aliases.add(al)}
  personal=out;return out;
 })().finally(()=>personalTask=null);
 return personalTask;
}
function filterPublic314(list,p=personal){
 const seen=new Set(),aliases=new Set(),out=[],type=String(discover?.type||'all');
 for(const x of rows(list)){
  const k=keyOf(x),a=aliasOf(x);if(!validKey(k)||seen.has(k)||aliases.has(a))continue;seen.add(k);aliases.add(a);
  if((type==='movie'||type==='tv')&&typeOf(x)!==type)continue;
  if(p?.blocked?.has?.(k)||p?.seen?.has?.(k)||p?.watch?.has?.(k)||p?.aliases?.has?.(a))continue;
  out.push(x);
 }
 return out;
}
function filterType314(list){
 const type=String(discover?.type||'all');return rows(list).filter(x=>(type==='movie'||type==='tv')?typeOf(x)===type:true);
}
async function source314(tab,force=false){
 if(testBridge?.source)return rows(await testBridge.source(tab,force));
 const k=`${tab}|${String(discover?.type||'all')}`,hit=sourceCache.get(k);
 if(!force&&hit&&Date.now()-hit.at<120000)return hit.rows;
 if(typeof window.__ctR300Test?.sourceRows300!=='function')throw new Error('Fonte do Descobrir indisponível');
 const out=rows(await window.__ctR300Test.sourceRows300(tab));sourceCache.set(k,{at:Date.now(),rows:out});return out;
}
function mediaMarkup314(x){
 try{return typeof ct288Card==='function'?ct288Card(x,{watch:false,add:false,slot:true}):''}catch{return''}
}
function actionMarkup314(x,{saved=false,seen=false,swap=''}={}){
 const k=keyOf(x);if(!validKey(k))return'';
 return `<div class="ct314-actions"><button type="button" class="chip ct314-watch ${saved?'active':''}" data-ct314-action="watchlist" data-media="${esc(k)}" ${saved?'disabled':''}>${saved?'✓ Watchlist':'+ Watchlist'}</button><button type="button" class="chip ct314-seen ${seen?'active':''}" data-ct314-action="seen" data-media="${esc(k)}" ${seen?'disabled':''}>${seen?'✓ Visto':'✓ Visto'}</button>${swap?`<button type="button" class="chip ct314-swap" data-ct314-swap="${esc(swap)}">↻ Trocar</button>`:''}</div>`;
}
function itemMarkup314(x,opt={}){
 if(!x)return'<article class="ct314-item ct314-empty"><div class="ct288-empty-poster"></div><b>Sem item elegível</b></article>';
 return `<article class="ct314-item" data-ct314-item="${esc(keyOf(x))}">${mediaMarkup314(x)}${actionMarkup314(x,opt)}</article>`;
}
function cleanLegacyActions314(root){
 for(const x of qa('.ct288-state,.ct291-card-footer,.ct295-card-footer,.ct301-watch-action,.ct308-actions,.ct309-actions,.ct310-actions,.ct311-actions,.ct312-actions,.ct313-actions',root))x.remove();
 return root;
}
function paintPublic314(list,tab,p=personal){
 const h=discoverHost();if(!h)return false;const clean=filterPublic314(list,p);
 const html=clean.map(x=>itemMarkup314(x)).join('')||'<div class="empty">Nenhum item elegível no momento.</div>';
 h.innerHTML=`<section class="panel ct314-browse"><div class="panel-head"><h2>${esc(LABELS[tab]||'Descobrir')}</h2><small>${clean.length}</small></div><div class="ct314-rail">${html}</div></section>`;
 cleanLegacyActions314(h);viewCache.set(`${tab}|${String(discover?.type||'all')}`,{at:Date.now(),rows:clean,kind:'public'});loaded314();return true;
}
function dateKey314(x){return String(x?.calendar_date||x?.release_date||x?.first_air_date||x?.raw_tmdb?.release_date||x?.raw_tmdb?.first_air_date||'').slice(0,10)||'Sem data'}
function dateLabel314(k){if(k==='Sem data')return k;try{return new Intl.DateTimeFormat('pt-BR',{weekday:'long',day:'2-digit',month:'long',year:'numeric'}).format(new Date(k+'T12:00:00'))}catch{return k}}
function paintCalendar314(list,p=personal){
 const h=discoverHost();if(!h)return false;const groups=new Map();
 for(const x of filterType314(list)){const d=dateKey314(x);if(!groups.has(d))groups.set(d,[]);groups.get(d).push(x)}
 const ordered=[...groups.entries()].sort(([a],[b])=>a==='Sem data'?1:b==='Sem data'?-1:a.localeCompare(b));
 h.innerHTML=`<div class="ct314-calendar">${ordered.map(([d,g])=>`<section class="panel ct314-calendar-day"><div class="panel-head"><h2>${esc(dateLabel314(d))}</h2><small>${g.length}</small></div><div class="ct314-calendar-rail">${g.map(x=>itemMarkup314(x,{saved:p?.watch?.has?.(keyOf(x)),seen:p?.seen?.has?.(keyOf(x))})).join('')}</div></section>`).join('')||'<div class="empty">Nenhum lançamento neste período.</div>'}</div>`;
 cleanLegacyActions314(h);viewCache.set(`calendar|${String(discover?.type||'all')}`,{at:Date.now(),rows:filterType314(list),kind:'calendar'});loaded314();return true;
}

function current314(pool,index){return pool?.length?pool[Math.abs(Number(index||0))%pool.length]:null}
function fyModel314(state){
 if(!state)return null;const watch={},fresh={};
 for(const k of ['movie','series','anime']){watch[k]=current314(state.watchPools?.[k],state.watchIndex?.[k]);fresh[k]=current314(state.freshPools?.[k],state.freshIndex?.[k])}
 const used=new Set([...Object.values(watch),...Object.values(fresh)].filter(Boolean).map(keyOf));let daily=current314(state.dailyPool,state.dailyIndex);
 if(daily&&used.has(keyOf(daily)))daily=state.dailyPool?.find?.(x=>!used.has(keyOf(x)))||daily;
 return{daily,watch,fresh};
}
function fySlot314(label,item,{saved=false,swap=''}={}){
 return `<div class="ct314-fy-slot"><h4>${esc(label)}</h4>${itemMarkup314(item,{saved,swap})}</div>`;
}
function paintForYou314(){
 const h=discoverHost(),state=R309T.state,m=fyModel314(state);if(!h||!m)return false;
 h.innerHTML=`<section class="panel ct314-foryou-panel" data-ct314-foryou><div class="ct314-fy-section ct314-fy-daily"><div class="ct314-fy-head"><h2>Indicação do Dia</h2></div><div class="ct314-fy-single">${fySlot314('Hoje',m.daily,{swap:'daily'})}</div></div><div class="ct314-fy-section"><div class="ct314-fy-head"><h2>Da sua Watchlist</h2></div><div class="ct314-fy-row">${fySlot314('Filme',m.watch.movie,{saved:true,swap:'watch:movie'})}${fySlot314('Série',m.watch.series,{saved:true,swap:'watch:series'})}${fySlot314('Anime',m.watch.anime,{saved:true,swap:'watch:anime'})}</div></div><div class="ct314-fy-section"><div class="ct314-fy-head"><h2>100% novos</h2></div><div class="ct314-fy-row">${fySlot314('Filme',m.fresh.movie,{swap:'fresh:movie'})}${fySlot314('Série',m.fresh.series,{swap:'fresh:series'})}${fySlot314('Anime',m.fresh.anime,{swap:'fresh:anime'})}</div></div></section>`;
 cleanLegacyActions314(h);discoverRoot()?.classList.remove('ct314-foryou-loading');loaded314();return true;
}
function swapForYou314(name){
 const state=R309T.state;if(!state)return false;
 if(name==='daily'){if((state.dailyPool?.length||0)<2)return false;state.dailyIndex=(Number(state.dailyIndex||0)+1)%state.dailyPool.length}
 else{const [bucket,kind]=String(name||'').split(':');if(!['watch','fresh'].includes(bucket)||!['movie','series','anime'].includes(kind))return false;const pool=state[bucket+'Pools']?.[kind]||[];if(pool.length<2)return false;state[bucket+'Index'][kind]=(Number(state[bucket+'Index']?.[kind]||0)+1)%pool.length}
 return paintForYou314();
}
async function loadForYou314(force=false){
 loading314('Montando recomendações…');discoverRoot()?.classList.add('ct314-foryou-loading');
 try{if(typeof window.__ctR309?.buildForYou!=='function')throw new Error('Recomendador indisponível');await window.__ctR309.buildForYou(!!force);if(routeNow()==='discover'&&String(discover?.tab)==='foryou')return paintForYou314()}catch(e){const h=discoverHost();if(h)h.innerHTML='<div class="empty">Não foi possível montar as recomendações agora.<br><button type="button" class="chip" data-ct314-retry>Tentar novamente</button></div>'}
 discoverRoot()?.classList.remove('ct314-foryou-loading');loaded314();return false;
}
async function loadPublic314(tab,force=false){
 const token=++loadToken,key=`${tab}|${String(discover?.type||'all')}`,hit=viewCache.get(key);if(hit&&!force&&Date.now()-hit.at<90000)paintPublic314(hit.rows,tab,personal);
 loading314('Carregando '+(LABELS[tab]||'títulos')+'…');
 try{const [p,raw]=await Promise.all([personal314(!!force),source314(tab,!!force)]);if(token!==loadToken||routeNow()!=='discover'||String(discover?.tab)!==tab)return false;return paintPublic314(raw,tab,p)}
 catch(e){if(token===loadToken){const h=discoverHost();if(h&&!hit)h.innerHTML='<div class="empty">Não foi possível carregar esta área agora.<br><button type="button" class="chip" data-ct314-retry>Tentar novamente</button></div>';loaded314()}return false}
}
async function loadCalendar314(force=false){
 const token=++loadToken,key=`calendar|${String(discover?.type||'all')}`,hit=viewCache.get(key);if(hit&&!force&&Date.now()-hit.at<90000)paintCalendar314(hit.rows,personal);
 loading314('Carregando Calendário…');
 try{const [p,raw]=await Promise.all([personal314(!!force),source314('calendar',!!force)]);if(token!==loadToken||routeNow()!=='discover'||String(discover?.tab)!=='calendar')return false;return paintCalendar314(raw,p)}
 catch(e){if(token===loadToken){const h=discoverHost();if(h&&!hit)h.innerHTML='<div class="empty">Não foi possível carregar o Calendário agora.</div>';loaded314()}return false}
}
async function loadDiscover314(tab=discover?.tab,force=false){
 if(!discover)return false;const t=String(tab||'foryou');discover.tab=t;if(t==='foryou'||t==='top10')discover.type='all';syncShell314();
 if(PUBLIC.has(t))return loadPublic314(t,force);
 if(t==='calendar')return loadCalendar314(force);
 if(t==='foryou')return loadForYou314(force);
 loading314('Carregando '+(LABELS[t]||'Descobrir')+'…');
 try{const base=window.__ctR313?.loadDiscover;if(typeof base==='function'){await base(t,force);loaded314();return true}}catch{}
 loaded314();return false;
}
function renderDiscover314(seq){
 setApp(shell('Descobrir','Recomendações, tendências, novidades e calendário.','discover',shellHtml314()));
 if(seq!==navSeq||routeNow()!=='discover')return;syncShell314();void loadDiscover314(discover?.tab||'foryou',false);
}
async function persist314(btn){
 if(!btn||btn.disabled)return;const action=String(btn.dataset.ct314Action||''),raw=String(btn.dataset.media||''),[type,idRaw]=raw.split(':'),id=Number(idRaw||0);if(!id)return;
 btn.disabled=true;const old=btn.textContent;btn.textContent='…';
 try{
  if(action==='watchlist'){if(testBridge?.addWatchlist)await testBridge.addWatchlist(type,id);else await addWatchlist(type,id)}
  else if(action==='seen'){if(testBridge?.markSeen)await testBridge.markSeen(type,id);else await markSeen(type,id)}
  personal={at:0,seen:new Set(),watch:new Set(),blocked:new Set(),aliases:new Set()};personalTask=null;sourceCache.clear();viewCache.clear();try{R310.invalidateWatch?.()}catch{};
  await loadDiscover314(String(discover?.tab||''),true);
 }catch(e){btn.disabled=false;btn.textContent=old;try{toast(e?.message||String(e))}catch{}}
}

/* PROFILE */
function statByLabel314(root,label){
 const n=norm(label);return qa('.stat,[data-stat],.stat-card,.profile-stat,button,a,[role="button"]',root).find(x=>norm(q('small,label,.stat-label,.label',x)?.textContent||x.textContent).includes(n))||null;
}
function normalizeStats314(root){
 if(!root)return false;const labels=['Eventos assistidos','Jogos no Estádio','Séries Watchlist','Filmes Watchlist'],ref=statByLabel314(root,'Eventos assistidos');if(!ref)return false;
 const base=[...ref.classList].filter(x=>!/^ct(?:117|180|238|299|300|301|306|308|309|310|311|312|313|314)-/.test(x));
 for(const label of labels){
  const card=statByLabel314(root,label);if(!card)continue;const hist=card.dataset?.ct299History,kind=card.dataset?.watchlistKind;
  card.className=[...base,'ct314-stat'].join(' ');if(hist)card.dataset.ct299History=hist;if(kind)card.dataset.watchlistKind=kind;card.setAttribute('role','button');card.setAttribute('tabindex','0');
  qa('.ct117-stat-chevron,.stat-link-icon,.stat-arrow,.open-arrow,.profile-card-arrow,[data-open-arrow],[data-profile-open-icon]',card).forEach(x=>x.remove());
 }
 root.classList.add('ct314-profile');return labels.every(x=>!!statByLabel314(root,x));
}
function sportsPanel314(root){
 return qa('section,.panel,article',root).find(p=>{const h=q(':scope > .panel-head h2,:scope > .panel-head h3,:scope > h2,:scope > h3',p);return norm(h?.textContent)==='esportes assistidos'})||null;
}
function ensureSportsCollapse314(root=q('[data-profile]')){
 if(!root)return false;const panel=sportsPanel314(root);if(!panel)return false;let head=q(':scope > .panel-head',panel);if(!head)return false;
 let btn=q('[data-ct314-sports-collapse]',head);let collapsed=false;try{collapsed=localStorage.getItem('ct:profile:sports:collapsed:r314')==='1'}catch{}
 panel.classList.add('ct314-sports-panel');panel.classList.toggle('ct314-collapsed',collapsed);
 if(!btn){btn=document.createElement('button');btn.type='button';btn.className='ct-r180-stats-toggle ct314-sports-collapse';btn.dataset.ct314SportsCollapse='1';head.appendChild(btn)}
 btn.setAttribute('aria-expanded',String(!collapsed));btn.innerHTML=`<span>${collapsed?'Expandir':'Recolher'}</span><b>${collapsed?'⌄':'⌃'}</b>`;return true;
}
function toggleSportsCollapse314(btn){
 const panel=btn?.closest?.('.ct314-sports-panel');if(!panel)return false;const next=!panel.classList.contains('ct314-collapsed');panel.classList.toggle('ct314-collapsed',next);btn.setAttribute('aria-expanded',String(!next));btn.innerHTML=`<span>${next?'Expandir':'Recolher'}</span><b>${next?'⌄':'⌃'}</b>`;try{localStorage.setItem('ct:profile:sports:collapsed:r314',next?'1':'0')}catch{};return true;
}
async function renderProfile314(seq){
 const base=window.__ctR313?.renderProfile;if(typeof base!=='function')return;const out=await base(seq);if(seq!==navSeq||routeNow()!=='profile')return out;
 const root=q('[data-profile]');normalizeStats314(root);ensureSportsCollapse314(root);try{window.__ctR312Test?.patchActors312?.(root,rows(out?.favorite_actors||profileCache?.favorite_actors))}catch{};return out;
}

/* F1 — backup sanitizer; build-r314 removes the producer itself. */
function removeF1WatchSummary314(root=document){
 const host=q('[data-ct255-f1]',root)||q('[data-ct255-f1]');if(!host)return 0;let removed=0;
 const exact=qa('h1,h2,h3,h4,b,strong,span,small',host).filter(x=>{const t=norm(x.textContent);return t==='seu registro'||t==='formula 1 assistida'});
 for(const x of exact){const box=x.closest('section,.panel,article')||x.parentElement?.parentElement;if(box&&box!==host&&box.isConnected){box.remove();removed++}}
 return removed;
}

function earlyHandle314(target,e){
 if(!target?.closest)return false;
 const tab=target.closest('[data-ct314-tab]');if(tab&&discoverRoot()){discover.tab=String(tab.dataset.ct314Tab||'foryou');filterOpen=false;void loadDiscover314(discover.tab,false);return true}
 const f=target.closest('[data-ct314-filter]');if(f){filterOpen=!filterOpen;syncShell314();return true}
 const ty=target.closest('[data-ct314-type]');if(ty){discover.type=String(ty.dataset.ct314Type||'all');filterOpen=false;syncShell314();void loadDiscover314(String(discover.tab||''),false);return true}
 const prev=target.closest('[data-ct314-tab-prev]');if(prev){q('[data-ct314-tabs]')?.scrollBy({left:-360,behavior:'smooth'});return true}
 const next=target.closest('[data-ct314-tab-next]');if(next){q('[data-ct314-tabs]')?.scrollBy({left:360,behavior:'smooth'});return true}
 const action=target.closest('[data-ct314-action]');if(action){void persist314(action);return true}
 const swap=target.closest('[data-ct314-swap]');if(swap){swapForYou314(String(swap.dataset.ct314Swap||''));return true}
 const retry=target.closest('[data-ct314-retry]');if(retry){void loadDiscover314(String(discover?.tab||''),true);return true}
 const collapse=target.closest('[data-ct314-sports-collapse]');if(collapse){toggleSportsCollapse314(collapse);return true}
 return false;
}

try{renderDiscover=renderDiscover314}catch{};try{loadDiscover263=loadDiscover314}catch{};window.__ctR288LoadDiscover=loadDiscover314;
try{renderProfile=renderProfile314}catch{}
document.addEventListener('cinetracker:data-changed',()=>{personal={at:0,seen:new Set(),watch:new Set(),blocked:new Set(),aliases:new Set()};personalTask=null;sourceCache.clear();viewCache.clear()});

const style=document.createElement('style');style.id='ct-web-r314';style.textContent=`
.ct314-tab-shell{display:grid!important;grid-template-columns:auto minmax(0,1fr) auto auto!important;gap:6px!important;align-items:center!important;margin-bottom:7px!important}.ct314-tabs{display:flex!important;gap:6px!important;overflow-x:auto!important;overflow-y:hidden!important;scrollbar-width:none!important}.ct314-tabs::-webkit-scrollbar{display:none!important}.ct314-types{margin:0 0 7px!important;padding:0 0 2px!important}.ct314-types[hidden]{display:none!important}.ct314-loadline{min-height:16px;margin:0 0 4px;font-size:11px;opacity:.7}.ct314-loadline[hidden]{visibility:hidden!important;display:block!important}
.ct314-browse,.ct314-calendar-day,.ct314-foryou-panel{overflow:visible!important}.ct314-rail,.ct314-calendar-rail,.ct314-fy-row{display:flex!important;flex-flow:row nowrap!important;align-items:stretch!important;gap:10px!important;overflow-x:auto!important;overflow-y:hidden!important;padding:2px 2px 10px!important;scrollbar-width:thin!important;scroll-snap-type:x proximity!important;overscroll-behavior-x:contain!important}
.ct314-item{box-sizing:border-box!important;display:flex!important;flex:0 0 176px!important;width:176px!important;min-width:176px!important;max-width:176px!important;flex-direction:column!important;align-self:stretch!important;overflow:visible!important;scroll-snap-align:start!important;background:transparent!important;border:0!important;padding:0!important}.ct314-item>.ct288-card{box-sizing:border-box!important;position:relative!important;display:flex!important;flex-direction:column!important;flex:1 1 auto!important;width:100%!important;min-width:0!important;height:auto!important;min-height:0!important;max-height:none!important;overflow:visible!important;background:transparent!important;border:0!important;padding:0!important}.ct314-item .ct288-state,.ct314-item .ct291-card-footer,.ct314-item .ct295-card-footer,.ct314-item .ct301-watch-action,.ct314-item .ct308-actions,.ct314-item .ct309-actions,.ct314-item .ct310-actions,.ct314-item .ct311-actions,.ct314-item .ct312-actions,.ct314-item .ct313-actions{display:none!important}
.ct314-item .ct288-copy{box-sizing:border-box!important;height:auto!important;min-height:58px!important;max-height:none!important;overflow:visible!important;padding-bottom:3px!important}.ct314-item .ct288-copy b,.ct314-item .ct288-copy strong,.ct314-item .ct288-copy small,.ct314-item .ct288-copy span,.ct314-item .ct288-meta{white-space:normal!important;overflow:visible!important;text-overflow:clip!important;-webkit-line-clamp:unset!important;line-clamp:unset!important;display:block!important;max-height:none!important;height:auto!important}
.ct314-actions{box-sizing:border-box!important;display:grid!important;grid-template-columns:minmax(0,1fr) minmax(0,1fr)!important;gap:5px!important;width:100%!important;margin-top:auto!important;padding-top:5px!important;position:static!important}.ct314-actions .chip{box-sizing:border-box!important;position:static!important;inset:auto!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;width:100%!important;min-width:0!important;height:29px!important;min-height:29px!important;max-height:29px!important;margin:0!important;padding:3px 6px!important;border-radius:8px!important;font-size:10px!important;line-height:1!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}.ct314-actions .ct314-swap{grid-column:1/-1!important;height:25px!important;min-height:25px!important;max-height:25px!important;font-size:10px!important}
.ct314-calendar{display:grid!important;gap:10px!important}.ct314-calendar-day{margin:0!important}.ct314-calendar-day .panel-head{margin-bottom:6px!important}.ct314-calendar-rail .ct314-item{flex-basis:176px!important;width:176px!important;min-width:176px!important;max-width:176px!important}
.ct314-foryou-panel{padding:10px!important}.ct314-fy-section{padding:0 0 10px!important;margin:0 0 10px!important;border-bottom:1px solid #ffffff12!important}.ct314-fy-section:last-child{border-bottom:0!important;margin-bottom:0!important;padding-bottom:0!important}.ct314-fy-head{display:flex!important;align-items:center!important;margin-bottom:6px!important}.ct314-fy-head h2{font-size:15px!important;margin:0!important}.ct314-fy-single{display:flex!important}.ct314-fy-slot{flex:0 0 176px!important;width:176px!important;min-width:176px!important}.ct314-fy-slot h4{font-size:11px!important;margin:0 0 4px!important;opacity:.8!important}.ct314-fy-slot .ct314-item{width:100%!important;min-width:0!important;max-width:none!important;flex-basis:auto!important}.ct314-foryou-loading [data-ct314-content] [data-ct309-owned]{display:none!important}
.ct314-profile .ct314-stat{box-sizing:border-box!important;position:relative!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;min-height:58px!important;padding:10px 12px!important;border:1px solid var(--border,#23465a)!important;border-radius:10px!important;background:var(--panel-2,#0e1b23)!important;color:inherit!important;text-align:center!important;cursor:pointer!important;box-shadow:none!important;transform:none!important}.ct314-profile .ct314-stat:hover,.ct314-profile .ct314-stat:focus-visible{background:var(--panel-3,#122633)!important;border-color:var(--accent,#2f83a8)!important;outline:none!important}.ct314-profile .ct314-stat::before,.ct314-profile .ct314-stat::after{content:none!important;display:none!important}.ct314-profile .ct314-stat :is(.ct117-stat-chevron,.stat-link-icon,.stat-arrow,.open-arrow,.profile-card-arrow,[data-open-arrow],[data-profile-open-icon]){display:none!important}
.ct314-sports-panel>.panel-head{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:10px!important}.ct314-sports-collapse{margin-left:auto!important}.ct314-sports-panel.ct314-collapsed>:not(.panel-head){display:none!important}
@media(max-width:760px){.ct314-item,.ct314-calendar-rail .ct314-item,.ct314-fy-slot{flex-basis:154px!important;width:154px!important;min-width:154px!important;max-width:154px!important}.ct314-actions{grid-template-columns:minmax(0,1fr) minmax(0,1fr)!important}.ct314-actions .chip{font-size:9.5px!important;padding-inline:4px!important}.ct314-tab-shell{grid-template-columns:auto minmax(0,1fr) auto auto!important}}
`;document.head.appendChild(style);

window.__ctR314={renderDiscover:renderDiscover314,loadDiscover:loadDiscover314,renderProfile:renderProfile314,normalizeStats:normalizeStats314,ensureSportsCollapse:ensureSportsCollapse314,removeF1WatchSummary:removeF1WatchSummary314,version:'1.0.105'};
window.__ctR314EarlyHandle=earlyHandle314;
window.__ctR314Test={shellHtml314,filterPublic314,filterType314,itemMarkup314,paintPublic314,paintCalendar314,dateKey314,fyModel314,paintForYou314,normalizeStats314,ensureSportsCollapse314,removeF1WatchSummary314,expired314,setPersonal(v){personal={at:Date.now(),seen:new Set(v?.seen||[]),watch:new Set(v?.watch||[]),blocked:new Set(v?.blocked||[]),aliases:new Set(v?.aliases||[])}},setDiscover(tab,type='all'){if(discover){discover.tab=tab;discover.type=type}},setTestBridge(v){testBridge=v&&typeof v==='object'?v:null}};
})();
