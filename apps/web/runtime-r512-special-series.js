/* CineTracker Web 0.3.39 r512 — stable historical UFC/F1 special-series owner. */
(()=>{
'use strict';
if(window.__ctR512Special?.version==='0.3.39')return;
const q=(s,r=document)=>r?.querySelector?.(s)||null,qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const rows=v=>Array.isArray(v)?v:[];
const core=()=>window.__ctCoreR471||null,route=()=>String(core()?.route?.()||'');
const rpc=(name,args={})=>core()?.rpc?core().rpc(name,args):Promise.reject(new Error('RPC_UNAVAILABLE'));
const tmdb=(path,args={})=>core()?.tmdb?core().tmdb(path,args):Promise.reject(new Error('TMDB_UNAVAILABLE'));
const edge=(slug,body={})=>core()?.edge?core().edge(slug,body):Promise.reject(new Error('EDGE_UNAVAILABLE'));
const currentYear=()=>new Date().getFullYear();
const localDay=()=>{try{const p=Object.fromEntries(new Intl.DateTimeFormat('en-CA',{timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date()).filter(x=>x.type!=='literal').map(x=>[x.type,x.value]));return p.year+'-'+p.month+'-'+p.day}catch{return new Date().toISOString().slice(0,10)}};
const fmtDate=v=>{const d=new Date(v||0);if(!Number.isFinite(d.getTime()))return'—';try{return new Intl.DateTimeFormat('pt-BR',{timeZone:'America/Sao_Paulo',day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'}).format(d)}catch{return d.toLocaleString('pt-BR')}};
const cacheGet=(k,max=5*60*1000)=>{try{const x=JSON.parse(sessionStorage.getItem(k)||'null');return x&&Date.now()-Number(x.at||0)<max?x.data:null}catch{return null}};
const cacheSet=(k,v)=>{try{sessionStorage.setItem(k,JSON.stringify({at:Date.now(),data:v}))}catch{}};
const cacheDrop=k=>{try{sessionStorage.removeItem(k)}catch{}};
const kindLabel=v=>({fp1:'Treino Livre 1',fp2:'Treino Livre 2',fp3:'Treino Livre 3',qualifying:'Classificação',sprint_qualifying:'Classificação Sprint',sprint:'Sprint',race:'Corrida'})[String(v||'')]||String(v||'Sessão');

let current={ufc:null,f1:null},currentTask=null,modal=null,modalTask=null;
const locks=new Set();

function panelFor(bucket){
 const view=q('[data-home-view="series"]');if(!view)return null;
 const wants=bucket==='continue'?['continuar assistindo','assistir a seguir']:['em dia'];
 return qa(':scope > [data-ct388-series-section],:scope > .home-section',view).find(s=>wants.includes(norm(q('.panel-head h3,h3',s)?.textContent||'')))||null
}
function recount(sec){
 if(!sec)return;
 const n=qa(':scope > .stack > .media-row,:scope > .stack > .card',sec).length,small=q('.panel-head small',sec);
 if(small)small.textContent=String(n);
 const stack=q(':scope > .stack',sec),empty=q(':scope > .empty',stack);if(empty&&n)empty.remove();
 if(stack&&!n&&!q(':scope > .empty',stack))stack.innerHTML='<div class="empty">Nenhum item.</div>'
}
function removeExisting(key){
 const view=q('[data-home-view="series"]');if(!view)return;
 const sel=key==='f1'?'.media-row[data-ct512-special="f1"],[data-ct511-f1-series]':'.media-row[data-ct512-special="ufc"],[data-ct510-ufc-series]';
 for(const x of qa(sel,view)){const sec=x.closest('section');x.remove();recount(sec)}
 const names=key==='f1'?new Set(['formula 1','formula one']):new Set(['ufc']);
 for(const row of qa('.media-row.ct274-media-card',view)){
  if(row.matches('[data-ct512-special]'))continue;
  const title=norm(q('.ct274-row-copy>b,b',row)?.textContent||'');if(!names.has(title))continue;
  const sec=row.closest('section');row.remove();recount(sec)
 }
}
function cardHtml(key,p){
 const s=p?.series||{},isF1=key==='f1',title=isF1?'Fórmula 1':'UFC',season=Number(s.season||currentYear());
 const watched=Number(s.watched_episodes||0),released=Number(s.released_episodes||0),pending=Number(s.available_episodes||0),poster=String(s.poster_url||'');
 const sub=pending>0?(pending+' '+(isF1?'sessão':'evento')+(pending===1?'':'s')+' recente'+(pending===1?'':'s')+' pendente'+(pending===1?'':'s')+(s.next_episode_title?' · '+s.next_episode_title:'')):('Em dia'+(s.upcoming_episode_title?' · Próximo: '+s.upcoming_episode_title:''));
 return '<div class="media-row ct274-media-card ct512-special-card" data-ct512-special="'+key+'" data-ct512-open="'+key+'" role="button" tabindex="0" aria-label="Abrir série '+esc(title)+'"><div class="ct274-row-left"><div class="thumb"'+(poster?' style="background-image:url(&quot;'+esc(poster)+'&quot;)"':'')+'></div><div class="ct274-row-copy"><b>'+esc(title)+'</b><small class="ct274-meta">T'+season+' · '+watched+'/'+released+' '+(isF1?'sessões':'eventos')+' assistidos</small><small class="ct274-sub">'+esc(sub)+'</small></div></div><span class="badge" aria-hidden="true">›</span></div>'
}
function mountOne(key){
 const p=current[key];if(route()!=='home'||!p?.series)return false;
 removeExisting(key);
 const bucket=p.series.home_bucket==='continue'?'continue':'up_to_date',target=panelFor(bucket),stack=q(':scope > .stack',target);if(!target||!stack)return false;
 q(':scope > .empty',stack)?.remove();stack.insertAdjacentHTML('afterbegin',cardHtml(key,p));recount(target);
 target.dataset.ct512SpecialPanel=(target.dataset.ct512SpecialPanel?target.dataset.ct512SpecialPanel+',':'')+key;
 return true
}
function mountAll(){const a=mountOne('ufc'),b=mountOne('f1');document.documentElement.dataset.ct512SpecialHome=(a||b)?'mounted':'pending';return a||b}
async function loadCurrent(force=false){
 if(currentTask)return currentTask;
 if(!force){
  current.ufc=current.ufc||cacheGet('ct512:ufc:current');current.f1=current.f1||cacheGet('ct512:f1:current');
  if(current.ufc||current.f1)mountAll();
  if(current.ufc&&current.f1)return current
 }
 currentTask=(async()=>{try{
  const y=currentYear(),day=localDay(),got=await Promise.allSettled([
   rpc('cinetracker_ufc_series_v512',{p_season:y,p_today:day,p_recent_days:21}),
   rpc('cinetracker_f1_series_v512',{p_season:y,p_today:day,p_recent_days:21})
  ]);
  if(got[0].status==='fulfilled'&&got[0].value?.series){current.ufc=got[0].value;cacheSet('ct512:ufc:current',current.ufc)}
  if(got[1].status==='fulfilled'&&got[1].value?.series){current.f1=got[1].value;cacheSet('ct512:f1:current',current.f1)}
  mountAll();return current
 }finally{currentTask=null}})();
 return currentTask
}
function seasonOptions(list,selected){return rows(list).map(y=>'<option value="'+Number(y)+'"'+(Number(y)===Number(selected)?' selected':'')+'>'+Number(y)+'</option>').join('')}

function f1RaceRows(raw,state){
 const watched=new Set(rows(state?.historical_watched_rounds).map(Number));
 return rows(raw?.races).map(r=>{
  const round=Number(r?.round||0),date=String(r?.date||''),time=String(r?.time||'23:59:59Z'),starts=date?new Date(date+'T'+time).toISOString():null;
  return {source:'historical',event_id:null,provider_event_id:'jolpica:'+Number(state?.series?.season||raw?.season||0)+':'+round+':race',title:String(r?.raceName||('Grand Prix '+round)),season:Number(state?.series?.season||raw?.season||0),episode_number:1000+round,round,session_kind:'race',starts_at:starts,runtime_minutes:120,released:starts?Date.parse(starts)<=Date.now():true,is_watched:watched.has(round)}
 }).sort((a,b)=>Date.parse(b.starts_at||0)-Date.parse(a.starts_at||0))
}
async function loadF1Season(season){
 const base=await rpc('cinetracker_f1_series_v512',{p_season:Number(season),p_today:localDay(),p_recent_days:21});
 if(rows(base?.events).length)return base;
 const hist=await edge('cinetracker-f1-v1',{season:Number(season),mode:'series'});
 return {...base,events:f1RaceRows(hist,base),historical:true}
}
function ufcCandidate(x,season){
 const title=String(x?.title||x?.name||x?.original_title||'').trim(),n=norm(title);
 if(!(/^ufc\s+\d+(?:\.\d+)?(?:\s|:|$)/i.test(title)||/^ufc\s+fight\s+night/i.test(title)||/^ufc\s+on\s+(espn|abc|fox)/i.test(title)))return null;
 const id=Number(x?.id||0),date=String(x?.release_date||'');
 return {source:'tmdb',event_id:null,legacy_media_id:null,tmdb_id:id,title,season:Number(season),episode_number:2000000+id,event_kind:/fight night|ufc on /i.test(title)?'Fight Night':'PPV',starts_at:date?date+'T12:00:00Z':String(season)+'-12-31T12:00:00Z',runtime_minutes:180,venue:null,image_url:x?.poster_path||null,released:!date||Date.parse(date+'T23:59:59Z')<=Date.now(),is_watched:false,__norm:n}
}
async function ufcTmdbSeason(season){
 const queries=['UFC','UFC Fight Night'],all=[];
 for(const query of queries){
  const first=await tmdb('/search/movie',{query,primary_release_year:Number(season),language:'pt-BR',include_adult:false,page:1}).catch(()=>({}));
  const pages=Math.min(5,Math.max(1,Number(first?.total_pages||1))),sets=[rows(first?.results)];
  if(pages>1){const more=await Promise.all(Array.from({length:pages-1},(_,i)=>tmdb('/search/movie',{query,primary_release_year:Number(season),language:'pt-BR',include_adult:false,page:i+2}).catch(()=>({}))));for(const d of more)sets.push(rows(d?.results))}
  for(const list of sets)for(const x of list){const c=ufcCandidate(x,season);if(c)all.push(c)}
 }
 const by=new Map();for(const x of all)if(x.tmdb_id&&!by.has(x.tmdb_id))by.set(x.tmdb_id,x);
 const ids=[...by.keys()],status=ids.length?await rpc('cinetracker_ufc_tmdb_status_v512',{p_tmdb_ids:ids}).catch(()=>[]):[],sm=new Map(rows(status).map(x=>[Number(x.tmdb_id),x]));
 for(const [id,x] of by){const st=sm.get(id);if(st){x.legacy_media_id=st.legacy_media_id||null;x.episode_number=Number(st.episode_number||x.episode_number);x.is_watched=!!st.is_watched}}
 return [...by.values()]
}
function dedupeUfc(list){
 const out=[],seen=new Set();
 const baseKey=x=>{const t=String(x?.title||'').toLowerCase();const m=t.match(/^ufc\s+(\d+(?:\.\d+)?)/i);if(m)return'ppv:'+m[1];return norm(String(x?.title||'').split(':')[0])};
 for(const x of rows(list).sort((a,b)=>Date.parse(b?.starts_at||0)-Date.parse(a?.starts_at||0))){const k=baseKey(x);if(!k||seen.has(k))continue;seen.add(k);out.push(x)}
 return out
}
async function loadUfcSeason(season){
 const [base,tm]=await Promise.all([
  rpc('cinetracker_ufc_series_v512',{p_season:Number(season),p_today:localDay(),p_recent_days:21}),
  ufcTmdbSeason(season)
 ]);
 const events=dedupeUfc([...rows(base?.events),...tm]),watched=events.filter(x=>x.is_watched).length,released=events.filter(x=>x.released!==false).length;
 return {...base,events,series:{...(base?.series||{}),season:Number(season),total_episodes:events.length,released_episodes:released,watched_episodes:watched}}
}
async function loadSeason(type,season){
 const key='ct512:'+type+':season:'+Number(season),cached=cacheGet(key,30*60*1000);if(cached)return cached;
 const data=type==='f1'?await loadF1Season(season):await loadUfcSeason(season);cacheSet(key,data);return data
}
function f1EventHtml(x){
 const watched=!!x.is_watched,released=x.released!==false&&(!x.starts_at||Date.parse(x.starts_at)<=Date.now()+60000),historical=x.source==='historical';
 const label=historical?('T'+Number(x.season)+' · GP '+String(Number(x.round||0)).padStart(2,'0')):('T'+Number(x.season)+' E'+String(Number(x.episode_number||0)).padStart(3,'0')+' · '+kindLabel(x.session_kind));
 return '<article class="ct512-event '+(watched?'watched':'')+'" data-ct512-event><div class="ct512-event-copy"><small>'+esc(label)+' · '+esc(fmtDate(x.starts_at))+'</small><b>'+esc(x.title||'Fórmula 1')+'</b><span>'+Number(x.runtime_minutes||0)+' min</span></div><button type="button" class="chip ct512-watch '+(watched?'on':'')+'" data-ct512-watch="f1" data-season="'+Number(x.season)+'" data-episode="'+Number(x.episode_number)+'" data-round="'+Number(x.round||0)+'" data-event-id="'+Number(x.event_id||0)+'" data-source="'+esc(x.source||'mapped')+'" data-watched="'+(watched?'1':'0')+'" '+(released?'':'disabled')+'>'+(watched?'↶ Desmarcar':released?'✓ Assistido':'Em breve')+'</button></article>'
}
function ufcEventHtml(x){
 const watched=!!x.is_watched,released=x.released!==false&&(!x.starts_at||Date.parse(x.starts_at)<=Date.now()+60000);
 return '<article class="ct512-event '+(watched?'watched':'')+'" data-ct512-event><div class="ct512-event-copy"><small>T'+Number(x.season)+' · '+esc(x.event_kind||'UFC')+' · '+esc(fmtDate(x.starts_at))+'</small><b>'+esc(x.title||'UFC')+'</b><span>'+Number(x.runtime_minutes||0)+' min</span></div><button type="button" class="chip ct512-watch '+(watched?'on':'')+'" data-ct512-watch="ufc" data-season="'+Number(x.season)+'" data-episode="'+Number(x.episode_number)+'" data-event-id="'+Number(x.event_id||0)+'" data-legacy-media-id="'+Number(x.legacy_media_id||0)+'" data-watched="'+(watched?'1':'0')+'" '+(released?'':'disabled')+'>'+(watched?'↶ Desmarcar':released?'✓ Assistido':'Em breve')+'</button></article>'
}
function renderModalBody(){
 if(!modal)return false;let back=q('[data-ct512-special-modal]');if(!back){back=document.createElement('div');back.className='ct512-backdrop';back.dataset.ct512SpecialModal='1';document.body.appendChild(back)}
 const type=modal.type,data=modal.data||{},s=data.series||{},title=type==='f1'?'Fórmula 1':'UFC',events=rows(data.events),seasons=rows(data.seasons);
 back.innerHTML='<section class="ct512-dialog" role="dialog" aria-modal="true" aria-label="'+esc(title)+'"><header><div><small>SÉRIE ESPECIAL</small><h2>'+esc(title)+'</h2><p>'+(type==='f1'?'Temporadas desde 1950 · sessões completas quando mapeadas':'Temporadas desde 1993 · Fight Nights e PPVs')+'</p></div><button type="button" class="btn" data-ct512-close>✕ Fechar</button></header><div class="ct512-toolbar"><label>Temporada <select data-ct512-season>'+seasonOptions(seasons,modal.season)+'</select></label><span>'+Number(s.watched_episodes||events.filter(x=>x.is_watched).length)+' / '+Number(s.released_episodes||events.filter(x=>x.released!==false).length)+' assistidos</span></div><div class="ct512-events">'+(events.length?events.map(type==='f1'?f1EventHtml:ufcEventHtml).join(''):'<div class="empty">Nenhum evento encontrado nesta temporada.</div>')+'</div></section>';
 document.documentElement.classList.add('ct512-modal-open');return true
}
function renderModalLoading(){const back=q('[data-ct512-special-modal]');if(!back||!modal)return;const box=q('.ct512-events',back);if(box)box.innerHTML='<div class="ct512-loading">Carregando temporada '+Number(modal.season)+'…</div>'}
async function selectSeason(season){
 if(!modal)return false;const token=Symbol('season');modal.token=token;modal.season=Number(season);renderModalLoading();
 try{const data=await loadSeason(modal.type,modal.season);if(!modal||modal.token!==token)return false;modal.data=data;renderModalBody();return true}
 catch(e){if(modal&&modal.token===token){const box=q('.ct512-events');if(box)box.innerHTML='<div class="error">Não foi possível carregar esta temporada.</div>';document.documentElement.dataset.ct512SeasonError=String(e?.message||e)}return false}
}
async function open(type){
 const y=currentYear(),base=current[type]||await (loadCurrent(false),current[type]);modal={type,season:y,data:base,token:null};renderModalBody();
 if(!base||Number(base?.series?.season)!==y)await selectSeason(y);return true
}
function close(){modal=null;modalTask=null;q('[data-ct512-special-modal]')?.remove();document.documentElement.classList.remove('ct512-modal-open')}

async function toggle(btn){
 const type=String(btn?.dataset?.ct512Watch||''),season=Number(btn?.dataset?.season||0),episode=Number(btn?.dataset?.episode||0),round=Number(btn?.dataset?.round||0),key=type+':'+season+':'+episode;
 if(!modal||!season||!episode||locks.has(key))return false;
 const ev=rows(modal.data?.events).find(x=>Number(x.season)===season&&Number(x.episode_number)===episode);if(!ev)return false;
 const before=!!ev.is_watched,next=!before;locks.add(key);ev.is_watched=next;renderModalBody();
 try{
  if(type==='f1'){
   if(ev.source==='historical')await rpc('cinetracker_f1_historical_watch_v512',{p_season:season,p_round:round,p_title:ev.title,p_runtime_minutes:Number(ev.runtime_minutes||120),p_watched:next,p_watched_at:new Date().toISOString()});
   else await rpc('cinetracker_f1_watch_sync_v462',{p_season:season,p_episode:episode,p_watched:next,p_watched_at:new Date().toISOString(),p_event_id:Number(ev.event_id||0)||null,p_attended_in_person:false,p_stadium_name:null,p_source:'series-r512'});
  }else{
   await rpc('cinetracker_ufc_watch_v512',{p_season:season,p_episode:episode,p_title:ev.title,p_runtime_minutes:Number(ev.runtime_minutes||180),p_event_id:Number(ev.event_id||0)||null,p_legacy_media_id:Number(ev.legacy_media_id||0)||null,p_watched:next,p_watched_at:new Date().toISOString()})
  }
  cacheDrop('ct512:'+type+':season:'+season);
  if(season===currentYear()){cacheDrop('ct512:'+type+':current');current[type]=null;void loadCurrent(true)}
  try{document.dispatchEvent(new CustomEvent('cinetracker:data-changed',{detail:{source:'special-series-r512',type,season,episode,watched:next}}))}catch{}
  return true
 }catch(e){ev.is_watched=before;renderModalBody();document.documentElement.dataset.ct512WriteError=String(e?.message||e);return false}
 finally{locks.delete(key)}
}

function remountSoon(){if(route()!=='home')return;queueMicrotask(mountAll);requestAnimationFrame(mountAll)}
document.addEventListener('click',e=>{
 const watch=e.target?.closest?.('[data-ct512-watch]');if(watch){e.preventDefault();e.stopImmediatePropagation();void toggle(watch);return}
 if(e.target?.closest?.('[data-ct512-close]')||e.target?.matches?.('[data-ct512-special-modal]')){e.preventDefault();close();return}
 const openEl=e.target?.closest?.('[data-ct512-open]');if(openEl){e.preventDefault();e.stopImmediatePropagation();void open(String(openEl.dataset.ct512Open||''));return}
 const nav=e.target?.closest?.('[data-nav="home"],[data-home-tab="series"]');if(nav){void loadCurrent(false);remountSoon()}
},true);
document.addEventListener('change',e=>{const s=e.target?.closest?.('[data-ct512-season]');if(s)void selectSeason(Number(s.value))},true);
document.addEventListener('keydown',e=>{const openEl=e.target?.closest?.('[data-ct512-open]');if(openEl&&(e.key==='Enter'||e.key===' ')){e.preventDefault();void open(String(openEl.dataset.ct512Open||''))}if(e.key==='Escape'&&modal)close()},true);
window.addEventListener('popstate',()=>{if(route()==='home'){void loadCurrent(false);remountSoon()}});
window.addEventListener('cinetracker:f1-watched-changed',e=>{if(e?.detail?.source==='special-series-r512')return;current.f1=null;cacheDrop('ct512:f1:current');if(route()==='home'||modal?.type==='f1')void loadCurrent(true)});
window.addEventListener('cinetracker:sports-watched-changed',()=>{current.ufc=null;cacheDrop('ct512:ufc:current');if(route()==='home'||modal?.type==='ufc')void loadCurrent(true)});

const style=document.createElement('style');style.id='ct512-special-style';style.textContent=[
 '.ct512-special-card{cursor:pointer!important}.ct512-special-card .thumb{background-size:contain!important;background-repeat:no-repeat!important;background-position:center!important;background-color:rgba(0,0,0,.42)!important}',
 '.ct512-backdrop{position:fixed;inset:0;z-index:10080;background:rgba(0,0,0,.74);backdrop-filter:blur(10px);display:flex;align-items:center;justify-content:center;padding:20px}',
 '.ct512-dialog{width:min(1040px,96vw);max-height:92vh;overflow:auto;border:1px solid rgba(255,255,255,.14);border-radius:20px;background:rgba(8,18,28,.98);box-shadow:0 24px 80px rgba(0,0,0,.5);padding:18px}',
 '.ct512-dialog>header{display:flex;justify-content:space-between;gap:16px;align-items:flex-start;position:sticky;top:-18px;z-index:3;background:rgba(8,18,28,.98);padding:18px 0 10px}.ct512-dialog h2{margin:2px 0 4px;font-size:28px}.ct512-dialog p{margin:0;opacity:.72}',
 '.ct512-toolbar{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;margin:2px 0 14px}.ct512-toolbar label{display:flex;align-items:center;gap:8px}.ct512-toolbar select{min-width:110px;border-radius:10px;padding:7px 10px;background:#0b1a27;color:inherit;border:1px solid rgba(255,255,255,.14)}.ct512-toolbar>span{font-size:12px;opacity:.76}',
 '.ct512-events{display:grid;gap:8px}.ct512-event{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:14px;align-items:center;padding:12px;border:1px solid rgba(255,255,255,.1);border-radius:14px;background:rgba(255,255,255,.035)}',
 '.ct512-event-copy{display:grid;gap:3px;min-width:0}.ct512-event-copy small,.ct512-event-copy span{opacity:.68}.ct512-event-copy b{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ct512-watch{min-width:110px}.ct512-watch.on{opacity:.78}',
 '.ct512-loading{padding:30px;text-align:center;opacity:.72}html.ct512-modal-open{overflow:hidden!important}',
 '@media(max-width:640px){.ct512-backdrop{padding:8px}.ct512-dialog{width:100%;max-height:95vh;border-radius:16px;padding:12px}.ct512-dialog>header{top:-12px;padding:12px 0 10px}.ct512-event{grid-template-columns:1fr}.ct512-watch{width:100%}}'
].join('');
if(!q('#ct512-special-style'))document.head.appendChild(style);
window.__ctR512Marker='historical-f1-1950+ufc-1993+single-special-owner+stable-remount+movies-standard-rows';
window.__ctR512Special={version:'0.3.39',loadCurrent,mountAll,open,close,loadSeason,get current(){return current}};
if(route()==='home'){void loadCurrent(false);remountSoon()}
})();