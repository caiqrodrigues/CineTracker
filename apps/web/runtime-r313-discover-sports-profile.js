/* CineTracker Web 1.0.104 r313 — restore approved Discover cards/hidden filter, producer-owned Sports filter, single Profile renderer. WEB ONLY. */
(()=>{
'use strict';
if(window.__ctR313)return;
window.__ctR313='discover-approved-card+hidden-filter+sports-producer-filter+profile-single-render';
window.__ctR313Discover='ct288-card+compact-hidden-type-filter+hard-seen-watchlist-barrier';
window.__ctR313Sports='next-previous-inline-dynamic-filter-at-producer';
window.__ctR313Profile='one-canonical-render-no-version-switch';
window.__ctR313Android='preserved-1.0.20-10062';

const R=window.__ctR288R263||{},M=window.__ctR295Test||{},R310=window.__ctR310||{};
const q=(s,r=document)=>r?.querySelector?.(s)||null,qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const rows=v=>Array.isArray(v)?v:[];
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const routeNow=()=>{try{return String(typeof route==='function'?route():'')}catch{return''}};
const discover=R.discover263||null;
const typeOf=typeof R.type263==='function'?R.type263:(x=>String(x?.media_type||x?.type||'tv')==='movie'?'movie':'tv');
const idOf=typeof R.id263==='function'?R.id263:(x=>Number(x?.tmdb_id||x?.source_tmdb_id||x?.id||0));
const titleOf=x=>x?.title||x?.name||x?.media_title||x?.raw_tmdb?.title||x?.raw_tmdb?.name||'Sem título';
const yearOf=x=>String(x?.release_date||x?.first_air_date||x?.release_year||x?.raw_tmdb?.release_date||x?.raw_tmdb?.first_air_date||'').slice(0,4);
const keyOf=x=>`${typeOf(x)==='movie'?'movie':'tv'}:${Number(idOf(x)||0)}`;
const validKey=k=>/^(movie|tv):[1-9]\d*$/.test(String(k||''));
const aliasOf=x=>`${typeOf(x)==='movie'?'movie':'tv'}|${norm(titleOf(x))}|${yearOf(x)}`;
const PUBLIC=new Set(['trending','popular','new','anticipated','top']);
const TABS=[['foryou','Pra você'],['top10','Top 10'],['trending','Em alta'],['popular','Populares'],['new','Novidades'],['anticipated','Mais Aguardados'],['top','Mais bem avaliados'],['calendar','Calendário']];
const LABELS=Object.fromEntries(TABS);
let filterOpen=false,loadToken=0,personal={at:0,blocked:new Set(),aliases:new Set()},personalTask=null,sourceCache=new Map(),testBridge=null;
function jwtExpired313(e){return /jwt\s*expired|token\s*expired|invalid\s*jwt/i.test(String(e?.message||e||''))}
async function rpc313(name,args){try{return await rpc(name,args)}catch(e){if(!jwtExpired313(e))throw e;await restoreSession();return rpc(name,args)}}

function discoverRoot(){return q('[data-ct313-discover]')}
function discoverHost(){return q('[data-ct313-content]')||q('[data-ct263-discover-content]')}
function shellHtml313(){
 const tab=String(discover?.tab||'foryou'),type=String(discover?.type||'all');
 const tabs=TABS.map(([k,l])=>`<button type="button" class="chip ${tab===k?'active':''}" data-ct263-discover-tab="${k}">${l}</button>`).join('');
 const types=[['all','Todos'],['movie','Filmes'],['tv','Séries']].map(([k,l])=>`<button type="button" class="chip ${type===k?'active':''}" data-ct313-type="${k}">${l}</button>`).join('');
 return `<div class="page ct313-discover" data-discover data-ct313-discover><div class="ct288-tab-shell ct313-tab-shell"><button type="button" class="ct288-tab-arrow" data-ct313-tab-prev aria-label="Abas anteriores">‹</button><div class="tabs ct288-tabs ct313-tabs" data-ct313-tabs>${tabs}</div><button type="button" class="ct288-tab-arrow" data-ct313-tab-next aria-label="Próximas abas">›</button><button type="button" class="ct288-filter-btn ct313-filter-btn" data-ct313-filter aria-label="Filtrar por tipo" aria-expanded="${filterOpen?'true':'false'}">☷<i></i></button></div><div class="filters ct288-types ct313-types" data-ct313-types ${filterOpen&&PUBLIC.has(tab)?'':'hidden'}>${types}</div><div class="ct313-loadline" data-ct313-loadline hidden></div><div data-ct313-content data-ct263-discover-content><div class="ct263-loading">Carregando títulos…</div></div></div>`;
}
function syncShell313(){
 const root=discoverRoot();if(!root)return false;const tab=String(discover?.tab||'foryou'),browse=PUBLIC.has(tab)||tab==='calendar';
 for(const b of qa('[data-ct263-discover-tab]',root))b.classList.toggle('active',String(b.dataset.ct263DiscoverTab)===tab);
 const filter=q('[data-ct313-filter]',root),types=q('[data-ct313-types]',root);if(filter){filter.hidden=!browse;filter.setAttribute('aria-expanded',String(browse&&filterOpen))}
 if(types){types.hidden=!browse||!filterOpen;for(const b of qa('[data-ct313-type]',types))b.classList.toggle('active',String(b.dataset.ct313Type)===String(discover?.type||'all'))}
 const rail=q('[data-ct313-tabs]',root),active=rail?.querySelector(`[data-ct263-discover-tab="${tab}"]`);if(active&&rail){const rr=rail.getBoundingClientRect(),ar=active.getBoundingClientRect();if(ar.left<rr.left||ar.right>rr.right)active.scrollIntoView({behavior:'smooth',block:'nearest',inline:'center'})}
 return true;
}
function loading313(text='Carregando títulos…'){
 const line=q('[data-ct313-loadline]',discoverRoot());if(!line)return;line.hidden=false;line.textContent=text;
}
function loaded313(){const line=q('[data-ct313-loadline]',discoverRoot());if(line){line.hidden=true;line.textContent=''}}
function addBlocked313(out,x,force=false){
 if(!x)return;const k=keyOf(x),blocked=force||!!(x?.is_watchlist||x?.is_seen||x?.is_completed||x?.is_in_progress||x?.is_up_to_date||Number(x?.watched_episodes||0)>0||x?.last_watched_at);
 if(blocked&&validKey(k))out.blocked.add(k);
 if(blocked){const a=aliasOf(x);if(a&&!a.endsWith('|'))out.aliases.add(a)}
}
async function personal313(force=false){
 if(testBridge?.personal)return testBridge.personal(force);
 if(!force&&personal.at&&Date.now()-personal.at<30000)return personal;
 if(personalTask&&!force)return personalTask;
 personalTask=(async()=>{
  const out={at:Date.now(),blocked:new Set(),aliases:new Set()};
  const jobs=[
   Promise.resolve(M.authority?.(!!force)).catch(()=>null),
   Promise.resolve(R310.canonicalWatchlist?.(!!force)).catch(()=>null),
   Promise.resolve(typeof rpc==='function'?rpc313('cinetracker_profile_media_dashboard_v0991',{}):null).catch(()=>null),
   Promise.resolve(typeof rpc==='function'?rpc313('cinetracker_discovery_exclusions_v0994',{}):null).catch(()=>null)
  ];
  const [a,w,dash,ex]=await Promise.all(jobs);
  for(const k of a?.seen||[])out.blocked.add(String(k));for(const k of a?.watch||[])out.blocked.add(String(k));
  for(const x of a?.watchRows||[])addBlocked313(out,x,true);for(const x of w?.rows||[])addBlocked313(out,x,true);for(const k of w?.keys||[])out.blocked.add(String(k));
  for(const x of rows(dash?.rows||dash))addBlocked313(out,x,false);
  for(const x of rows(ex?.rows||ex)){const k=keyOf(x);if(validKey(k))out.blocked.add(k);const a2=aliasOf(x);if(a2&&!a2.endsWith('|'))out.aliases.add(a2)}
  personal=out;return out;
 })().finally(()=>personalTask=null);
 return personalTask;
}
function filterPublic313(list,p=personal){
 const seen=new Set(),aliases=new Set(),out=[];const type=String(discover?.type||'all');
 for(const x of rows(list)){
  const k=keyOf(x),a=aliasOf(x);if(!validKey(k)||seen.has(k)||aliases.has(a))continue;seen.add(k);aliases.add(a);
  if((type==='movie'||type==='tv')&&typeOf(x)!==type)continue;
  if(p?.blocked?.has?.(k)||p?.aliases?.has?.(a))continue;
  out.push(x);
 }
 return out;
}
async function source313(tab,force=false){
 if(testBridge?.source)return rows(await testBridge.source(tab,force));
 const k=`${tab}|${String(discover?.type||'all')}`;const hit=sourceCache.get(k);if(!force&&hit&&Date.now()-hit.at<120000)return hit.rows;
 let out=[];if(typeof window.__ctR300Test?.sourceRows300==='function')out=rows(await window.__ctR300Test.sourceRows300(tab));else throw new Error('Fonte do Descobrir indisponível');
 sourceCache.set(k,{at:Date.now(),rows:out});return out;
}
function standardCard313(x,{saved=false}={}){
 const k=keyOf(x);let media='';
 try{media=typeof ct288Card==='function'?ct288Card(x,{watch:false,add:false}):''}catch{}
 return `<article class="ct313-item" data-ct313-item="${esc(k)}">${media}<div class="ct313-actions"><button type="button" class="chip ct313-watch ${saved?'active':''}" data-ct313-action="watchlist" data-media="${esc(k)}" ${saved?'disabled':''}>${saved?'✓ Watchlist':'+ Watchlist'}</button><button type="button" class="chip ct313-seen" data-ct313-action="seen" data-media="${esc(k)}">✓ Visto</button></div></article>`;
}
function paintPublic313(list,tab){
 const h=discoverHost();if(!h)return false;const clean=filterPublic313(list);
 h.innerHTML=`<section class="panel ct313-browse"><div class="panel-head"><h2>${esc(LABELS[tab]||'Descobrir')}</h2><small>${clean.length}</small></div><div class="ct313-rail">${clean.map(x=>standardCard313(x)).join('')||'<div class="empty">Nenhum item elegível no momento.</div>'}</div></section>`;loaded313();return true;
}
async function loadPublic313(tab,force=false){
 const token=++loadToken;loading313('Carregando '+(LABELS[tab]||'títulos')+'…');
 try{
  const [p,raw]=await Promise.all([personal313(!!force),source313(tab,!!force)]);
  if(token!==loadToken||routeNow()!=='discover'||String(discover?.tab)!==tab)return false;
  return paintPublic313(filterPublic313(raw,p),tab);
 }catch(e){if(token===loadToken){const h=discoverHost();if(h)h.innerHTML='<div class="empty">Não foi possível carregar esta área agora.<br><button type="button" class="chip" data-ct313-retry>Tentar novamente</button></div>';loaded313()}return false}
}
async function loadDiscover313(tab=discover?.tab,force=false){
 if(!discover)return false;const t=String(tab||'foryou');discover.tab=t;if(t==='foryou'||t==='top10')discover.type='all';syncShell313();
 if(PUBLIC.has(t))return loadPublic313(t,force);
 loading313(t==='foryou'?'Montando recomendações…':'Carregando '+(LABELS[t]||'Descobrir')+'…');
 try{
  if(t==='foryou'&&typeof window.__ctR309?.buildForYou==='function'){await window.__ctR309.buildForYou(!!force);loaded313();return true}
  const base=window.__ctR313BaseLoad;if(typeof base==='function'){await base(t,force);loaded313();return true}
 }catch{}
 loaded313();return false;
}
async function persist313(btn){
 if(!btn||btn.disabled)return;const action=String(btn.dataset.ct313Action||''),raw=String(btn.dataset.media||''),[type,idRaw]=raw.split(':'),id=Number(idRaw||0);if(!id)return;btn.disabled=true;const old=btn.textContent;btn.textContent='…';
 try{
  if(action==='watchlist'){if(testBridge?.addWatchlist)await testBridge.addWatchlist(type,id);else await addWatchlist(type,id)}
  else if(action==='seen'){if(testBridge?.markSeen)await testBridge.markSeen(type,id);else await markSeen(type,id)}
  personal={at:0,blocked:new Set(),aliases:new Set()};sourceCache.clear();try{R310.invalidateWatch?.()}catch{};await loadDiscover313(String(discover?.tab||''),true);
 }catch(e){btn.disabled=false;btn.textContent=old;try{toast(e?.message||String(e))}catch{}}
}
function renderDiscover313(seq){
 const body=shellHtml313();setApp(shell('Descobrir','Recomendações, tendências, novidades e calendário.','discover',body));
 if(seq!==navSeq||routeNow()!=='discover')return;syncShell313();void loadDiscover313(discover?.tab||'foryou',false);
}

/* PROFILE: replace the whole inherited render chain. One loading state -> one canonical paint. */
function statByLabel313(root,label){const n=norm(label);return qa('.stat,[data-stat],.stat-card,.profile-stat,button,a,[role="button"]',root).find(x=>norm(q('small,label,.stat-label,.label',x)?.textContent||x.textContent).includes(n))||null}
function scrub313(card){if(!card)return;qa('.ct117-stat-chevron,.stat-link-icon,.stat-arrow,.open-arrow,.profile-card-arrow,[data-open-arrow],[data-profile-open-icon]',card).forEach(x=>x.remove());card.classList.add('ct313-stat')}
function ensureStadium313(root,count){
 let card=statByLabel313(root,'Jogos no Estádio');const events=statByLabel313(root,'Eventos assistidos');if(!events)return null;
 if(!card){card=events.cloneNode(true);const label=q('small,label,.stat-label,.label',card),value=q('b,strong,.value,.stat-value',card);if(label)label.textContent='Jogos no Estádio';if(value)value.textContent=Number(count||0).toLocaleString('pt-BR');card.dataset.ct299History='stadium';events.insertAdjacentElement('afterend',card)}
 else{const value=q('b,strong,.value,.stat-value',card);if(value)value.textContent=Number(count||0).toLocaleString('pt-BR');card.dataset.ct299History='stadium'}
 return card;
}
function canonicalStats313(root,count){
 if(!root)return false;ensureStadium313(root,count);const ref=statByLabel313(root,'Eventos assistidos');if(!ref)return false;const base=[...ref.classList].filter(x=>!/^ct(?:299|300|301|306|308|309|310|311|312|313)-/.test(x));
 for(const label of ['Eventos assistidos','Jogos no Estádio','Séries Watchlist','Filmes Watchlist']){const card=statByLabel313(root,label);if(!card)continue;const keep={hist:card.dataset?.ct299History,kind:card.dataset?.watchlistKind};card.className=[...base,'ct313-stat'].join(' ');if(keep.hist)card.dataset.ct299History=keep.hist;if(keep.kind)card.dataset.watchlistKind=keep.kind;scrub313(card)}
 root.dataset.ct313Profile='single';return true;
}
async function renderProfile313(seq){
 setApp(shell('Perfil','Estatísticas, biblioteca, favoritos e atividade.','profile','<div class="page" data-profile>'+loading('Carregando Perfil...')+'</div>'));
 const cached=profileCache||ct163Read('profile')||null;
 const fullP=Promise.resolve(rpc313('cinetracker_profile_payload_v0997',{p_tz:tz()})).catch(()=>null);
 const histP=Promise.resolve(rpc313('cinetracker_sports_watch_history_v296',{})).catch(()=>[]);
 const stadiumP=Promise.resolve(rpc313('cinetracker_sports_stadium_summary_v296',{})).catch(()=>null);
 const [full,hist,stadium]=await Promise.all([fullP,histP,stadiumP]);if(seq!==navSeq||routeNow()!=='profile')return;
 const data=full||cached;if(!data){const root=q('[data-profile]');if(root)root.innerHTML=fail('Falha ao carregar Perfil.','profile');return}
 const merged={...data,sports_stats:{...(data?.sports_stats||{})}};if(Array.isArray(hist))merged.sports_stats.watched_events=hist.filter(x=>x?.is_watched!==false).length;
 profileCache=merged;try{ct163Write('profile',merged)}catch{};ct168PaintProfile(merged,'');
 const root=q('[data-profile]'),stadiumCount=Number(stadium?.stadium_events??stadium?.[0]?.stadium_events??0);canonicalStats313(root,stadiumCount);
 try{window.__ctR312Test?.patchActors312?.(root,rows(merged.favorite_actors))}catch{}
 return merged;
}

/* Exact click authority registered by build-r313 before older captures. */
function earlyHandle313(target,e){
 if(!target?.closest)return false;
 const tab=target.closest('[data-ct263-discover-tab]');if(tab&&discoverRoot()){discover.tab=String(tab.dataset.ct263DiscoverTab||'foryou');filterOpen=false;void loadDiscover313(discover.tab,false);return true}
 const f=target.closest('[data-ct313-filter]');if(f){filterOpen=!filterOpen;syncShell313();return true}
 const ty=target.closest('[data-ct313-type]');if(ty){discover.type=String(ty.dataset.ct313Type||'all');filterOpen=false;syncShell313();void loadDiscover313(String(discover.tab||''),false);return true}
 const prev=target.closest('[data-ct313-tab-prev]');if(prev){q('[data-ct313-tabs]')?.scrollBy({left:-360,behavior:'smooth'});return true}
 const next=target.closest('[data-ct313-tab-next]');if(next){q('[data-ct313-tabs]')?.scrollBy({left:360,behavior:'smooth'});return true}
 const action=target.closest('[data-ct313-action]');if(action){void persist313(action);return true}
 const retry=target.closest('[data-ct313-retry]');if(retry){void loadDiscover313(String(discover?.tab||''),true);return true}
 return false;
}

const baseLoad=window.__ctR288LoadDiscover;window.__ctR313BaseLoad=baseLoad;
try{renderDiscover=renderDiscover313}catch{};try{loadDiscover263=loadDiscover313}catch{};window.__ctR288LoadDiscover=loadDiscover313;
try{renderProfile=renderProfile313}catch{}
document.addEventListener('cinetracker:data-changed',()=>{personal={at:0,blocked:new Set(),aliases:new Set()};sourceCache.clear()});

const style=document.createElement('style');style.id='ct-web-r313';style.textContent=`
.ct313-tab-shell{margin-bottom:8px!important}.ct313-filter-btn{display:grid!important}.ct313-types{margin:0 0 8px!important;padding:0 0 3px!important}.ct313-types[hidden]{display:none!important}.ct313-loadline{min-height:18px;margin:0 0 5px;font-size:11px;opacity:.68}.ct313-loadline[hidden]{visibility:hidden!important;display:block!important}
.ct313-browse{overflow:hidden!important}.ct313-rail{display:flex!important;flex-flow:row nowrap!important;align-items:flex-start!important;gap:12px!important;overflow-x:auto!important;overflow-y:hidden!important;padding:2px 1px 9px!important;scroll-snap-type:x proximity!important;overscroll-behavior-x:contain!important;scrollbar-width:thin!important}
.ct313-item{box-sizing:border-box!important;display:flex!important;flex:0 0 176px!important;width:176px!important;min-width:176px!important;max-width:176px!important;flex-direction:column!important;align-self:flex-start!important;scroll-snap-align:start!important;overflow:visible!important;background:transparent!important;border:0!important;padding:0!important}
.ct313-item>.ct288-card{position:relative!important;width:100%!important;min-width:0!important;height:auto!important;max-height:none!important;overflow:visible!important;background:transparent!important;border:0!important;padding:0!important}.ct313-item .ct288-state{display:none!important}
.ct313-item .ct288-copy{height:auto!important;min-height:44px!important;max-height:none!important;overflow:visible!important}.ct313-item .ct288-copy b,.ct313-item .ct288-copy small{white-space:normal!important;overflow:visible!important;text-overflow:clip!important;-webkit-line-clamp:unset!important;line-clamp:unset!important;display:block!important}
.ct313-actions{display:grid!important;grid-template-columns:minmax(0,1fr) minmax(0,1fr)!important;gap:6px!important;width:100%!important;margin-top:5px!important;position:static!important}.ct313-actions .chip{position:static!important;inset:auto!important;width:100%!important;min-width:0!important;height:30px!important;min-height:30px!important;margin:0!important;padding:4px 6px!important;border-radius:9px!important;font-size:11px!important;white-space:nowrap!important}
[data-ct313-content] .ct309-fy-block,[data-ct313-content] .ct309-daily{padding:9px 10px!important;margin-bottom:9px!important}[data-ct313-content] .ct309-fy-grid{gap:9px!important}[data-ct313-content] .ct309-actions{gap:5px!important;margin-top:5px!important}[data-ct313-content] .ct309-actions .chip,[data-ct313-content] .ct309-swap{min-height:29px!important;height:29px!important;padding:3px 6px!important;font-size:10px!important}
.ct313-stat{box-sizing:border-box!important;position:relative!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;min-height:58px!important;padding:10px 12px!important;border:1px solid var(--border,#23465a)!important;border-radius:10px!important;background:var(--panel-2,#0e1b23)!important;color:inherit!important;text-align:center!important;cursor:pointer!important;box-shadow:none!important;transform:none!important}.ct313-stat::before,.ct313-stat::after{content:none!important;display:none!important}
.ct313-sport-filter{display:flex!important;align-items:center!important;gap:6px!important;overflow-x:auto!important;min-width:0!important;padding:0 2px!important;scrollbar-width:none!important}.ct313-sport-filter::-webkit-scrollbar{display:none!important}.ct313-sport-filter .chip{flex:0 0 auto!important;min-height:27px!important;height:27px!important;padding:3px 8px!important;font-size:10px!important}.ct313-feed-title{display:flex!important;align-items:center!important;gap:10px!important;min-width:0!important;flex:1 1 auto!important}.ct313-feed-title h2{flex:0 0 auto!important;margin:0!important}
.ct312-sport-filter,.ct255-sport-filters{display:none!important}
@media(max-width:760px){.ct313-item{flex-basis:142px!important;width:142px!important;min-width:142px!important;max-width:142px!important}.ct313-actions{grid-template-columns:1fr!important}.ct313-feed-title{align-items:flex-start!important;flex-direction:column!important}.ct313-sport-filter{width:100%!important}}
`;document.head.appendChild(style);

window.__ctR313={renderDiscover:renderDiscover313,loadDiscover:loadDiscover313,renderProfile:renderProfile313,canonicalStats:canonicalStats313,ensureStadium:ensureStadium313,version:'1.0.104'};
window.__ctR313EarlyHandle=earlyHandle313;
window.__ctR313Test={shellHtml313,filterPublic313,standardCard313,paintPublic313,canonicalStats313,ensureStadium313,jwtExpired313,setPersonal(v){personal={at:Date.now(),blocked:new Set(v?.blocked||[]),aliases:new Set(v?.aliases||[])}},setDiscover(tab,type='all'){if(discover){discover.tab=tab;discover.type=type}},setTestBridge(v){testBridge=v&&typeof v==='object'?v:null}};
})();