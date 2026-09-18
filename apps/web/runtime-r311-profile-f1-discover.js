/* CineTracker Web 1.0.102 r311 — single-owner Profile stats, clickable F1 weekends, stable public Discover. WEB ONLY. */
(()=>{
'use strict';
if(window.__ctR311)return;
window.__ctR311='profile-stat-single-version+f1-clickable-weekend+discover-public-single-renderer';
window.__ctR311Profile='events-reference-style+stadium+series-watchlist+movies-watchlist-identical';
window.__ctR311F1='calendar-races-clickable+weekend-sessions-watch+grid+result';
window.__ctR311Discover='five-public-tabs-filter-seen-watchlist+stable-external-actions';
window.__ctR311Android='preserved-1.0.20-10062';

const R=window.__ctR288R263||{},M=window.__ctR295Test||{},R310=window.__ctR310||{};
const q=(s,r=document)=>r?.querySelector?.(s)||null,qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const rows=v=>Array.isArray(v)?v:[];
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const routeNow=()=>{try{return String(typeof route==='function'?route():'')}catch{return''}};
const typeOf=typeof R.type263==='function'?R.type263:(x=>String(x?.media_type||x?.type||'tv')==='movie'?'movie':'tv');
const idOf=typeof R.id263==='function'?R.id263:(x=>Number(x?.tmdb_id||x?.source_tmdb_id||x?.id||0));
const keyOf=x=>`${typeOf(x)==='movie'?'movie':'tv'}:${Number(idOf(x)||0)}`;
const validKey=k=>/^(movie|tv):[1-9]\d*$/.test(String(k||''));
const discover=R.discover263||null;
const discoverHost=()=>{try{return R.discoverHost263?.()||q('[data-ct263-discover-content]')}catch{return q('[data-ct263-discover-content]')}};
const PUBLIC_TABS=new Set(['trending','popular','new','anticipated','top']);
const TITLES={trending:'Em alta',popular:'Populares',new:'Novidades',anticipated:'Mais Aguardados',top:'Mais bem avaliados'};
let testBridge=null;

/* ------------------------------------------------------------------
   PROFILE — one visual contract. Eventos assistidos is the reference.
   Old delayed stylers are retired by build-r311; this function is the
   only final visual normalizer for the four clickable statistics.
------------------------------------------------------------------- */
function statCard311(root,label){
 const want=norm(label);
 for(const x of qa('small,label,[data-stat-label],.stat-label',root)){
  if(norm(x.textContent).includes(want)){const c=x.closest?.('.stat,[data-stat],.stat-card,.profile-stat,button,a,[role="button"]');if(c)return c}
 }
 return qa('.stat,[data-stat],.stat-card,.profile-stat,button,a,[role="button"]',root).find(x=>norm(x.textContent).includes(want))||null;
}
function scrubStat311(card){
 if(!card)return;
 qa('.ct117-stat-chevron,.stat-link-icon,.stat-arrow,.open-arrow,.profile-card-arrow,[data-open-arrow],[data-profile-open-icon],svg[data-icon]',card).forEach(x=>x.remove());
 for(const x of qa('span,em,i',card)){const t=String(x.textContent||'').trim(),n=norm(t);if(['>','›','→','↗'].includes(t)||n==='abrir'||n==='open')x.remove()}
 card.style.removeProperty('transform');card.style.removeProperty('box-shadow');
}
function unifyProfileStats311(root=q('[data-profile]')){
 if(!root)return false;
 const ref=statCard311(root,'Eventos assistidos');if(!ref)return false;
 const labels=['Eventos assistidos','Jogos no Estádio','Séries Watchlist','Filmes Watchlist'];
 const base=[...ref.classList].filter(x=>!/^ct(?:300|301|306|308|309|310|311)-/.test(x));
 for(const label of labels){
  const card=statCard311(root,label);if(!card)continue;
  card.className=[...base,'ct311-stat-unified'].join(' ');card.dataset.ct311Stat=norm(label).replace(/ /g,'-');
  scrubStat311(card);
  if(card.tagName!=='BUTTON'&&card.tagName!=='A'){card.setAttribute('role','button');if(!card.hasAttribute('tabindex'))card.setAttribute('tabindex','0')}
 }
 root.dataset.ct311ProfileStats='single-version';
 return labels.every(label=>!!statCard311(root,label));
}
try{if(typeof renderProfile==='function'){const base=renderProfile;renderProfile=async function(){const out=await base.apply(this,arguments);unifyProfileStats311();return out}}}catch{}

/* ------------------------------------------------------------------
   DISCOVER — the five public tabs have one renderer. No overlay plus
   button, no legacy footer, and exclusion is applied before markup.
------------------------------------------------------------------- */
let personal311={at:0,seen:new Set(),watch:new Set()},personalTask=null,publicToken=0,publicCache=new Map();
async function loadPersonal311(force=false){
 if(testBridge?.loadPersonal)return testBridge.loadPersonal(force);
 if(!force&&personal311.at&&Date.now()-personal311.at<30000)return personal311;
 if(personalTask&&!force)return personalTask;
 personalTask=(async()=>{
  const [a,w]=await Promise.all([
   Promise.resolve(M.authority?.(true)).catch(()=>null),
   Promise.resolve(R310.canonicalWatchlist?.(true)).catch(()=>null)
  ]);
  const seen=new Set(a?.seen||[]),watch=new Set(a?.watch||[]);
  for(const k of w?.keys||[])watch.add(String(k));
  personal311={at:Date.now(),seen,watch};return personal311;
 })().finally(()=>personalTask=null);
 return personalTask;
}
function filterPublic311(list,p=personal311){
 const seenKeys=new Set(),out=[];
 for(const x of rows(list)){
  const k=keyOf(x);if(!validKey(k)||seenKeys.has(k))continue;seenKeys.add(k);
  if(p?.seen?.has?.(k)||p?.watch?.has?.(k))continue;
  out.push(x);
 }
 return out;
}
function mediaCard311(x){
 try{return typeof ct288Card==='function'?ct288Card(x,{add:false,watch:false}):''}catch{return''}
}
function browseItem311(x){
 const k=keyOf(x);
 return `<article class="ct311-browse-item" data-ct311-item="${esc(k)}">${mediaCard311(x)}<div class="ct311-actions"><button type="button" class="chip ct311-watch" data-ct311-action="watchlist" data-media="${esc(k)}">+ Watchlist</button><button type="button" class="chip ct311-seen" data-ct311-action="seen" data-media="${esc(k)}">✓ Visto</button></div></article>`;
}
function paintPublic311(list,tab){
 const h=discoverHost();if(!h)return false;
 const title=TITLES[String(tab)]||'Descobrir',clean=filterPublic311(list);
 h.innerHTML=`<section class="panel ct311-public" data-ct311-public="${esc(tab)}"><div class="panel-head"><h2>${esc(title)}</h2><small>${clean.length}</small></div><div class="ct311-rail">${clean.map(browseItem311).join('')||'<div class="empty">Nenhum item elegível no momento.</div>'}</div></section>`;
 h.dataset.ct311Owned='public';return true;
}
async function sourcePublic311(tab,force=false){
 if(testBridge?.sourceRows)return rows(await testBridge.sourceRows(tab,force));
 const k=`${tab}|${String(discover?.type||'all')}`;
 if(!force&&publicCache.has(k)&&Date.now()-publicCache.get(k).at<90000)return publicCache.get(k).rows;
 let out=null;
 if(typeof window.__ctR300Test?.sourceRows300==='function')out=await window.__ctR300Test.sourceRows300(tab);
 if(!Array.isArray(out))throw new Error('Fonte do Descobrir indisponível');
 publicCache.set(k,{at:Date.now(),rows:out});return out;
}
async function buildPublic311(tab,force=false){
 if(!discover||!PUBLIC_TABS.has(String(tab))||routeNow()!=='discover')return false;
 const token=++publicToken,h=discoverHost();if(h)h.innerHTML='<div class="ct263-loading ct311-loading">Carregando títulos…</div>';
 try{
  const [p,raw]=await Promise.all([loadPersonal311(!!force),sourcePublic311(tab,!!force)]);
  if(token!==publicToken||routeNow()!=='discover'||String(discover.tab)!==String(tab))return false;
  return paintPublic311(filterPublic311(raw,p),tab);
 }catch(e){
  if(token===publicToken&&h)h.innerHTML='<div class="empty">Não foi possível carregar esta área agora.<br><button type="button" class="chip" data-ct311-retry>Tentar novamente</button></div>';
  return false;
 }
}
const previousLoad=window.__ctR288LoadDiscover;
async function loadDiscover311(tab=discover?.tab,force=false){
 const t=String(tab||discover?.tab||'foryou');
 if(!discover)return previousLoad?.apply(this,arguments);
 discover.tab=t;
 if(PUBLIC_TABS.has(t)){discover.gen=Number(discover.gen||0)+1;void buildPublic311(t,!!force);return}
 return previousLoad?.apply(this,arguments);
}
try{loadDiscover263=loadDiscover311}catch{}window.__ctR288LoadDiscover=loadDiscover311;

async function persistDiscover311(btn){
 if(!btn||btn.disabled)return;const action=String(btn.dataset.ct311Action||''),raw=String(btn.dataset.media||''),[type,idRaw]=raw.split(':'),id=Number(idRaw||0);if(!id)return;
 btn.disabled=true;const old=btn.textContent;btn.textContent='…';
 try{
  if(action==='watchlist'){
   if(testBridge?.addWatchlist)await testBridge.addWatchlist(type,id);else await addWatchlist(type,id);
  }else if(action==='seen'){
   if(testBridge?.markSeen)await testBridge.markSeen(type,id);else await markSeen(type,id);
  }else return;
  personal311={at:0,seen:new Set(),watch:new Set()};try{R310.invalidateWatch?.()}catch{}publicCache.clear();
  if(testBridge?.afterDiscoverAction)await testBridge.afterDiscoverAction(action,type,id);
  await buildPublic311(String(discover?.tab||''),true);
 }catch(e){btn.disabled=false;btn.textContent=old;try{toast(e?.message||String(e))}catch{}}
}

/* ------------------------------------------------------------------
   F1 — Calendar itself owns clickable races. Each GP opens a complete
   weekend view and every started session has an independent watch action.
------------------------------------------------------------------- */
const raceCache311=new Map();let f1HistoryCache311={at:0,rows:[]};
const f1Season311=()=>Number((typeof f1255!=='undefined'&&f1255?.data?.season)||new Date().getFullYear());
const f1Date311=(obj,fallbackDate='',fallbackTime='00:00:00Z')=>{
 const date=String(obj?.date||fallbackDate||''),time=String(obj?.time||fallbackTime||'00:00:00Z');if(!date)return null;
 const d=new Date(`${date}T${time}`);return Number.isNaN(d.getTime())?null:d;
};
const iso311=d=>d instanceof Date&&!Number.isNaN(d.getTime())?d.toISOString():null;
function f1Key311(season,round){return `${Number(season)}-${Number(round)}`}
function f1RaceTitle311(r){return String(r?.raceName||r?.name||r?.title||`GP ${r?.round||''}`).trim()}
function f1Calendar311(d){
 const schedule=rows(d?.schedule),season=Number(d?.season||f1Season311());raceCache311.clear();
 return `<div class="ct311-f1-calendar">${schedule.map((r,i)=>{const round=Number(r?.round||i+1),key=f1Key311(season,round),start=f1Date311(r),title=f1RaceTitle311(r);raceCache311.set(key,{...r,season,round,title});return `<button type="button" class="ct311-f1-race" data-ct311-f1-race="${esc(key)}" data-season="${season}" data-round="${round}"><b>${round}. ${esc(title)}</b><span>${esc(r?.Circuit?.circuitName||'Circuito')} · ${esc(r?.Circuit?.Location?.country||'')}</span><small>${start?esc(start.toLocaleString('pt-BR')):'Data indisponível'}</small><em>Abrir corrida</em></button>`}).join('')||'<div class="empty">Calendário da Fórmula 1 indisponível.</div>'}</div>`;
}
try{
 if(typeof f1content255==='function'){
  const base=f1content255;f1content255=function(d){if(typeof f1255!=='undefined'&&String(f1255?.tab)==='calendar')return f1Calendar311(d);return base.apply(this,arguments)};
 }
}catch{}

function sessionDef311(race){
 const baseDate=String(race?.date||''),defs=[
  ['fp1','Treino Livre 1',race?.FirstPractice],
  ['fp2','Treino Livre 2',race?.SecondPractice],
  ['fp3','Treino Livre 3',race?.ThirdPractice],
  ['sprint_qualifying','Classificação Sprint',race?.SprintQualifying||race?.SprintShootout],
  ['sprint','Sprint',race?.Sprint],
  ['qualifying','Classificação',race?.Qualifying],
  ['race','Corrida',{date:race?.date,time:race?.time}]
 ];
 return defs.map(([kind,label,obj])=>{const d=f1Date311(obj,kind==='race'?baseDate:'');if(!d)return null;return{kind,label,date:d,id:`f1:${race.season}:${race.round}:${kind}`}}).filter(Boolean).sort((a,b)=>a.date-b.date);
}
async function loadF1History311(force=false){
 if(testBridge?.loadF1History)return rows(await testBridge.loadF1History(force));
 if(!force&&f1HistoryCache311.at&&Date.now()-f1HistoryCache311.at<15000)return f1HistoryCache311.rows;
 let h=[];try{h=rows(await rpc('cinetracker_sports_watch_history_v296',{})).filter(x=>String(x?.sport_slug||'')==='formula_1'||/formula\s*1|\bf1\b/i.test(String(x?.competition_name||x?.title||'')))}catch{}
 f1HistoryCache311={at:Date.now(),rows:h};return h;
}
function sessionWatched311(session,race,hist){
 const oldRaceId=f1Key311(race.season,race.round),target=session.date.getTime(),label=norm(session.label);
 return rows(hist).some(x=>{
  if(x?.is_watched===false)return false;const id=String(x?.provider_event_id||'');
  if(id===session.id||(session.kind==='race'&&id===oldRaceId))return true;
  const t=new Date(x?.starts_at||x?.sport_watched_at||0).getTime();if(!Number.isFinite(t)||Math.abs(t-target)>4*3600000)return false;
  const title=norm(x?.title||'');return !title||title.includes(label.split(' ')[0])||label.includes(title.split(' ')[0]);
 });
}
function fmtF1311(d){try{return new Intl.DateTimeFormat('pt-BR',{timeZone:'America/Sao_Paulo',weekday:'short',day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'}).format(d)}catch{return d.toLocaleString('pt-BR')}}
function sessionRows311(race,hist){
 const now=Date.now();
 return sessionDef311(race).map(s=>{const watched=sessionWatched311(s,race,hist),started=s.date.getTime()<=now;return`<article class="ct311-f1-session" data-session="${esc(s.kind)}"><div><b>${esc(s.label)}</b><small>${esc(fmtF1311(s.date))}</small></div><button type="button" class="chip ${watched?'active':''}" data-ct311-f1-watch="${esc(s.id)}" data-kind="${esc(s.kind)}" data-watched="${watched?'1':'0'}" ${started?'':'disabled'}>${started?(watched?'↶ Desmarcar assistido':'✓ Marcar como assistido'):'Ainda não realizado'}</button></article>`}).join('');
}
function resultRows311(data){const race=data?.MRData?.RaceTable?.Races?.[0]||data?.RaceTable?.Races?.[0]||data?.races?.[0]||null;return rows(race?.Results||race?.results)}
async function loadResults311(race){
 if(testBridge?.loadF1Results)return rows(await testBridge.loadF1Results(race));
 const local=rows(race?.Results||race?.results||race?.classification);if(local.length)return local;
 const u=`https://api.jolpi.ca/ergast/f1/${encodeURIComponent(race.season)}/${encodeURIComponent(race.round)}/results.json?limit=100`;
 const res=await fetch(u,{headers:{Accept:'application/json'}});if(!res.ok)throw new Error(`F1 ${res.status}`);return resultRows311(await res.json());
}
function driver311(r){const d=r?.Driver||r?.driver||{};return [d.givenName||d.given_name,d.familyName||d.family_name].filter(Boolean).join(' ')||d.code||d.driverId||'Piloto'}
function team311(r){return r?.Constructor?.name||r?.constructor?.name||r?.team||'—'}
function resultTable311(list,mode){
 const copy=[...rows(list)].sort((a,b)=>Number(mode==='grid'?a.grid:a.position)-Number(mode==='grid'?b.grid:b.position));
 return `<div class="ct311-f1-table">${copy.map((r,i)=>{const pos=Number(mode==='grid'?(r.grid||i+1):(r.position||i+1)),extra=mode==='grid'?team311(r):(r.Time?.time||r.time||r.status||'—');return`<div class="ct311-f1-result-row"><b>${pos>0?pos:'—'}</b><span>${esc(driver311(r))}</span><small>${esc(extra)}</small></div>`}).join('')||'<div class="empty">Dados ainda não disponíveis.</div>'}</div>`;
}
function closeRace311(){q('[data-ct311-f1-modal]')?.remove()}
async function openRace311(race){
 if(!race)return false;closeRace311();
 const hist=await loadF1History311(false);
 const back=document.createElement('div');back.className='ct311-f1-backdrop';back.dataset.ct311F1Modal='1';
 const circuit=race?.Circuit?.circuitName||race?.venue||'—',place=[race?.Circuit?.Location?.locality,race?.Circuit?.Location?.country].filter(Boolean).join(' · ')||'—',start=f1Date311(race);
 back.innerHTML=`<section class="ct311-f1-dialog" role="dialog" aria-modal="true" aria-label="Detalhes completos da corrida"><header><div><small>F1 Hub · Temporada ${esc(race.season)}</small><h2>${esc(race.title||f1RaceTitle311(race))}</h2><p>${esc(circuit)} · ${esc(place)}${start?` · ${esc(fmtF1311(start))}`:''}</p></div><button type="button" class="ct311-f1-close" data-ct311-f1-close aria-label="Fechar">×</button></header><section class="ct311-f1-weekend"><h3>Fim de semana</h3><div data-ct311-f1-sessions>${sessionRows311(race,hist)}</div></section><div class="ct311-f1-columns"><section><h3>Grid de Largada</h3><div data-ct311-grid class="loader">Carregando grid…</div></section><section><h3>Resultado de Chegada</h3><div data-ct311-result class="loader">Carregando resultado…</div></section></div></section>`;
 back.__ct311Race=race;document.body.appendChild(back);
 void loadResults311(race).then(list=>{if(!back.isConnected)return;const g=q('[data-ct311-grid]',back),r=q('[data-ct311-result]',back);if(g)g.innerHTML=resultTable311(list,'grid');if(r)r.innerHTML=resultTable311(list,'result')}).catch(e=>{const msg=`<div class="empty">${esc(e?.message||'Dados ainda não disponíveis.')}</div>`;const g=q('[data-ct311-grid]',back),r=q('[data-ct311-result]',back);if(g)g.innerHTML=msg;if(r)r.innerHTML=msg});
 return true;
}
async function toggleF1Session311(btn){
 const back=btn?.closest?.('[data-ct311-f1-modal]'),race=back?.__ct311Race;if(!race||btn.disabled)return false;
 const kind=String(btn.dataset.kind||''),session=sessionDef311(race).find(x=>x.kind===kind);if(!session)return false;
 const watched=btn.dataset.watched==='1';btn.disabled=true;
 try{
  const payload={p_provider:'jolpica',p_provider_event_id:session.id,p_sport_slug:'formula_1',p_competition_name:'Fórmula 1',p_title:`${race.title||f1RaceTitle311(race)} · ${session.label}`,p_starts_at:iso311(session.date),p_attended_in_person:false,p_stadium_name:null,p_watched:!watched,p_metadata:{season:race.season,round:race.round,session_kind:kind,venue:race?.Circuit?.circuitName||null,country:race?.Circuit?.Location?.country||null,source:'r311-f1-weekend'}};
  if(testBridge?.setSportWatch)await testBridge.setSportWatch(payload);else await rpc('cinetracker_sports_watch_set_v296',payload);
  f1HistoryCache311={at:0,rows:[]};try{profileCache=null}catch{};const hist=await loadF1History311(true);const host=q('[data-ct311-f1-sessions]',back);if(host)host.innerHTML=sessionRows311(race,hist);
  document.dispatchEvent(new CustomEvent('cinetracker:data-changed',{detail:{source:'r311-f1-weekend',session:session.id,watched:!watched}}));
  return true;
 }catch(e){btn.disabled=false;try{toast(e?.message||String(e))}catch{};return false}
}
try{if(typeof paintF1255==='function'){const base=paintF1255;paintF1255=async function(){const out=await base.apply(this,arguments);return out}}}catch{}

/* Window capture runs before legacy document capture handlers. */
window.addEventListener('click',e=>{
 const action=e.target?.closest?.('[data-ct311-action]');if(action){e.preventDefault();e.stopImmediatePropagation();void persistDiscover311(action);return}
 const retry=e.target?.closest?.('[data-ct311-retry]');if(retry){e.preventDefault();e.stopImmediatePropagation();void buildPublic311(String(discover?.tab||''),true);return}
 const raceBtn=e.target?.closest?.('[data-ct311-f1-race]');if(raceBtn){e.preventDefault();e.stopImmediatePropagation();const race=raceCache311.get(String(raceBtn.dataset.ct311F1Race||''));void openRace311(race);return}
 const watch=e.target?.closest?.('[data-ct311-f1-watch]');if(watch){e.preventDefault();e.stopImmediatePropagation();void toggleF1Session311(watch);return}
 if(e.target?.closest?.('[data-ct311-f1-close]')||e.target?.matches?.('[data-ct311-f1-modal]')){e.preventDefault();e.stopImmediatePropagation();closeRace311()}
},true);
window.addEventListener('keydown',e=>{if(e.key==='Escape')closeRace311()},true);
document.addEventListener('cinetracker:data-changed',()=>{personal311={at:0,seen:new Set(),watch:new Set()};publicCache.clear();f1HistoryCache311={at:0,rows:[]}});

const style=document.createElement('style');style.id='ct-web-r311-stability';style.textContent=`
.ct311-stat-unified{box-sizing:border-box!important;position:relative!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;min-height:58px!important;padding:10px 12px!important;border:1px solid var(--border,#23465a)!important;border-radius:10px!important;background:var(--panel-2,#0e1b23)!important;color:inherit!important;text-align:center!important;cursor:pointer!important;box-shadow:none!important;transform:none!important;transition:border-color .15s ease,background .15s ease!important}
.ct311-stat-unified:hover,.ct311-stat-unified:focus-visible{background:var(--panel-3,#122633)!important;border-color:var(--accent,#2f83a8)!important;outline:none!important}
.ct311-stat-unified::before,.ct311-stat-unified::after{content:none!important;display:none!important}.ct311-stat-unified :is(.ct117-stat-chevron,.stat-link-icon,.stat-arrow,.open-arrow,.profile-card-arrow,[data-open-arrow],[data-profile-open-icon]){display:none!important}

.ct311-public{overflow:hidden!important}.ct311-rail{display:flex!important;flex-flow:row nowrap!important;align-items:flex-start!important;gap:10px!important;overflow-x:auto!important;overflow-y:hidden!important;padding:2px 2px 10px!important;scrollbar-gutter:auto!important}
.ct311-browse-item{box-sizing:border-box!important;display:flex!important;flex:0 0 176px!important;width:176px!important;min-width:176px!important;max-width:176px!important;flex-direction:column!important;align-items:stretch!important;overflow:visible!important}
.ct311-browse-item>.ct288-card{box-sizing:border-box!important;width:100%!important;min-width:0!important;max-width:none!important;height:auto!important;min-height:0!important;max-height:none!important;overflow:visible!important}
.ct311-browse-item .ct288-state,.ct311-browse-item .ct291-card-footer,.ct311-browse-item .ct295-card-footer,.ct311-browse-item .ct308-actions,.ct311-browse-item .ct309-actions,.ct311-browse-item .ct310-actions{display:none!important}
.ct311-actions{box-sizing:border-box!important;display:grid!important;grid-template-columns:minmax(0,1fr) minmax(0,1fr)!important;gap:6px!important;width:100%!important;margin-top:6px!important;position:static!important}
.ct311-actions .chip{box-sizing:border-box!important;position:static!important;inset:auto!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;width:100%!important;min-width:0!important;height:32px!important;min-height:32px!important;padding:5px 7px!important;margin:0!important;border-radius:9px!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;line-height:1!important}

.ct311-f1-calendar{display:flex!important;flex-flow:row nowrap!important;gap:10px!important;overflow-x:auto!important;padding:2px 2px 10px!important}
.ct311-f1-race{box-sizing:border-box!important;flex:0 0 230px!important;display:flex!important;flex-direction:column!important;align-items:flex-start!important;gap:5px!important;min-height:126px!important;padding:12px!important;border:1px solid var(--border,#23465a)!important;border-radius:12px!important;background:var(--panel-2,#0e1b23)!important;color:inherit!important;text-align:left!important;cursor:pointer!important}
.ct311-f1-race:hover,.ct311-f1-race:focus-visible{border-color:var(--accent,#2f83a8)!important;background:var(--panel-3,#122633)!important;outline:none!important}.ct311-f1-race span,.ct311-f1-race small{opacity:.78}.ct311-f1-race em{margin-top:auto;font-style:normal;color:var(--accent,#69c7ef);font-weight:700}
.ct311-f1-backdrop{position:fixed;inset:0;z-index:10150;background:#000c;display:flex;align-items:center;justify-content:center;padding:18px;overflow:auto}.ct311-f1-dialog{box-sizing:border-box;position:relative;width:min(1050px,100%);max-height:92vh;overflow:auto;background:#0b1016;border:1px solid #ffffff24;border-radius:16px;padding:20px;box-shadow:0 24px 80px #000b}.ct311-f1-dialog header{display:flex;justify-content:space-between;align-items:flex-start;gap:16px}.ct311-f1-dialog header p{opacity:.75;margin:4px 0 0}.ct311-f1-close{border:0;background:transparent;color:inherit;font-size:28px;cursor:pointer}.ct311-f1-weekend{margin-top:16px}.ct311-f1-weekend h3,.ct311-f1-columns h3{margin:0 0 8px}.ct311-f1-session{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:12px;padding:9px 10px;border:1px solid #ffffff14;border-radius:10px;margin-bottom:7px}.ct311-f1-session div{display:flex;flex-direction:column;gap:2px}.ct311-f1-session small{opacity:.72}.ct311-f1-session .chip{min-width:190px}.ct311-f1-columns{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;margin-top:18px}.ct311-f1-result-row{display:grid;grid-template-columns:38px minmax(0,1fr) auto;gap:8px;align-items:center;padding:8px 10px;border:1px solid #ffffff14;border-radius:10px;margin-bottom:6px}.ct311-f1-result-row small{opacity:.72;text-align:right}
@media(max-width:720px){.ct311-browse-item{flex-basis:154px!important;width:154px!important;min-width:154px!important;max-width:154px!important}.ct311-actions{grid-template-columns:1fr!important}.ct311-f1-columns{grid-template-columns:1fr!important}.ct311-f1-session{grid-template-columns:1fr!important}.ct311-f1-session .chip{width:100%!important;min-width:0!important}}
`;document.head.appendChild(style);

unifyProfileStats311();
window.__ctR311={unifyProfileStats:unifyProfileStats311,buildPublic:buildPublic311,loadDiscover:loadDiscover311,openRace:openRace311,setTestBridge(v){testBridge=v&&typeof v==='object'?v:null},version:'1.0.102'};
window.__ctR311Test={statCard311,unifyProfileStats311,filterPublic311,paintPublic311,browseItem311,f1Calendar311,sessionDef311,sessionWatched311,sessionRows311,openRace311,toggleF1Session311,resultTable311,setPersonal(v){personal311={at:Date.now(),seen:new Set(v?.seen||[]),watch:new Set(v?.watch||[])}},setTestBridge(v){testBridge=v&&typeof v==='object'?v:null},get raceCache(){return raceCache311}};
})();