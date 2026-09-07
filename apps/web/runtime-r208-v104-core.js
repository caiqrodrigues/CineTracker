/* CineTracker 1.0.4 authoritative runtime. Inject inside the main runtime scope before boot(). */
(()=>{
'use strict';
const CT104_ANDROID=false;
window.__ctR208='v104-authoritative-internal-runtime';
window.__ctR208Scope='rewatch-history-episode-counts-nav-recommendation-memory-f1-card-standard';
window.__ctOfficialVersion='1.0.4';
window.__ctOfficialRevision=CT104_ANDROID?'r246-android-official-1.0.4':'r208-official-1.0.4';
if(CT104_ANDROID){window.__ctAndroidOfficialVersion='1.0.4';window.__ctAndroidOfficialCode=10046;document.documentElement.classList.add('ct104-android')}
const ct104Q=(s,r=document)=>r?.querySelector?.(s)||null;
const ct104QA=(s,r=document)=>r?.querySelectorAll?[...r.querySelectorAll(s)]:[];
const ct104Esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ct104Norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const ct104Num=v=>{const n=Number(v);return Number.isFinite(n)?n:0};
const ct104Route=()=>{try{return String(route())}catch{return String(location.pathname||'/').replace(/^\/+/, '').split('/')[0]||'home'}};
const ct104PlayLabel=n=>`↻ Reassistir ${Math.max(2,ct104Num(n)||2)}x`;
function ct104Changed(source){
 try{homeCache=null}catch{};try{profileCache=null}catch{};try{discoverCache?.clear?.()}catch{};try{ct171SeenMap=null}catch{};
 window.dispatchEvent(new CustomEvent('cinetracker:data-changed',{detail:{source,at:Date.now()}}));
}
/* Visible identity is produced by the same shell that paints every route. */
try{
 const ct104ShellBase=shell;
 shell=function(...args){return String(ct104ShellBase.apply(this,args)).replace(/CineTracker • v[^<]+/g,`CineTracker • v1.0.4 • ${CT104_ANDROID?'r246-android-official-1.0.4':'r208-official-1.0.4'}`)};
}catch{}
function ct104FixVisibleVersion(){ct104QA('.version').forEach(n=>{n.textContent=`CineTracker • v1.0.4 • ${CT104_ANDROID?'r246-android-official-1.0.4':'r208-official-1.0.4'}`})}

/* One persistent source of truth for replay counts. */
let ct104Counts=new Map(),ct104CountsAt=0,ct104CountsTask=null;
function ct104CountKey(x){const t=String(x?.item_type||'');const tm=ct104Num(x?.tmdb_id);if(t==='episode')return `episode:${tm}:${ct104Num(x?.season_number)}:${ct104Num(x?.episode_number)}`;return `movie:${tm}`}
async function ct104LoadCounts(force=false){
 if(!force&&ct104CountsAt&&Date.now()-ct104CountsAt<15000)return ct104Counts;
 if(ct104CountsTask)return ct104CountsTask;
 ct104CountsTask=Promise.resolve(rpc('cinetracker_rewatch_counts_v104',{})).then(rows=>{const m=new Map();for(const x of Array.isArray(rows)?rows:[]){const k=ct104CountKey(x);if(k)m.set(k,Math.max(1,ct104Num(x?.plays)||1))}ct104Counts=m;ct104CountsAt=Date.now();return m}).catch(()=>ct104Counts).finally(()=>{ct104CountsTask=null});
 return ct104CountsTask;
}
function ct104SetCount(k,n){if(k)ct104Counts.set(k,Math.max(1,ct104Num(n)||1));ct104CountsAt=Date.now()}
async function ct104MovieRewatch(tmdb,btn){
 tmdb=ct104Num(tmdb);if(!(tmdb>0)||!btn||btn.dataset.ct104Busy==='1')return;
 const old=btn.textContent;btn.dataset.ct104Busy='1';btn.disabled=true;btn.textContent='Salvando...';
 try{
  const m=await ensureMedia('movie',tmdb);
  const r=await rpc('cinetracker_mark_watch_v0994',{p_media_id:Number(m.id),p_item_type:'movie',p_season_number:null,p_episode_number:null,p_title:m.title||null,p_runtime_minutes:Number(m.runtime_minutes||0)||null,p_released_episodes:null,p_watched_at:new Date().toISOString()});
  const plays=Math.max(2,ct104Num(r?.plays)||2);ct104SetCount(`movie:${tmdb}`,plays);btn.dataset.plays=String(plays);btn.textContent=ct104PlayLabel(plays);btn.disabled=false;ct104Changed('movie-rewatch-v104');
  try{toast('Filme registrado · '+plays+'x')}catch{};return r;
 }catch(e){btn.textContent=old;btn.disabled=false;try{toast(e?.message||String(e))}catch{};throw e}finally{delete btn.dataset.ct104Busy}
}
async function ct104EpisodeRewatch(tmdb,sn,en,btn,ep=null){
 tmdb=ct104Num(tmdb);sn=ct104Num(sn);en=ct104Num(en);if(!(tmdb>0&&sn>0&&en>0)||!btn||btn.dataset.ct104Busy==='1')return;
 const old=btn.textContent;btn.dataset.ct104Busy='1';btn.disabled=true;btn.textContent='Salvando...';
 try{
  const m=await ensureMedia('tv',tmdb);
  const r=await rpc('cinetracker_mark_episode_v0994',{p_media_id:Number(m.id),p_season_number:sn,p_episode_number:en,p_title:ep?.name||btn.dataset.title||null,p_runtime_minutes:Number(ep?.runtime||btn.dataset.runtime||0)||null,p_released_episodes:Number(ct169CurrentDetail?.detail?.number_of_episodes||0)||null,p_series_status:ct169CurrentDetail?.detail?.status||null,p_watched_at:new Date().toISOString()});
  const plays=Math.max(2,ct104Num(r?.plays)||2);ct104SetCount(`episode:${tmdb}:${sn}:${en}`,plays);btn.dataset.plays=String(plays);btn.textContent=ct104PlayLabel(plays);btn.disabled=false;ct104Changed('episode-rewatch-v104');
  try{toast('Episódio registrado · '+plays+'x')}catch{};return r;
 }catch(e){btn.textContent=old;btn.disabled=false;try{toast(e?.message||String(e))}catch{};throw e}finally{delete btn.dataset.ct104Busy}
}
try{ct171RewatchMovie=async function(id,btn){return ct104MovieRewatch(id,btn)}}catch{}
try{ct171RewatchEpisode=async function(sn,en,btn){const st=ct169DrawerState;if(!st)return;const ep=(st.episodes||[]).find(x=>Number(x.episode_number)===Number(en));return ct104EpisodeRewatch(st.showId,sn,en,btn,ep)}}catch{}
function ct104DecorateHistory(){
 const root=ct104Q('[data-home]');if(!root)return;void ct104LoadCounts(false).then(()=>{
  for(const sec of ct104QA('section',root)){
   const head=ct104Norm(ct104Q('h2,h3',sec)?.textContent||'');
   const episodes=head.includes('historico recente'),movies=head.includes('filmes vistos');if(!episodes&&!movies)continue;
   for(const row of ct104QA('.media-row[data-media]',sec)){
    if(ct104Q('[data-ct104-rewatch]',row))continue;const raw=String(row.dataset.media||''),[type,id0]=raw.split(':'),tmdb=ct104Num(id0);if(!(tmdb>0))continue;
    const b=document.createElement('button');b.type='button';b.className='btn btn-secondary ct104-history-rewatch';b.dataset.ct104Rewatch='1';
    if(movies&&type==='movie'){const k=`movie:${tmdb}`,plays=ct104Counts.get(k)||1;b.dataset.ct104Kind='movie';b.dataset.ct104Tmdb=String(tmdb);b.textContent=plays>1?ct104PlayLabel(plays):'↻ Reassistir'}
    else if(episodes&&type==='tv'){const meta=ct104Q('small',row)?.textContent||'',m=meta.match(/S\s*0*(\d+)\s*E\s*0*(\d+)/i);if(!m)continue;const sn=ct104Num(m[1]),en=ct104Num(m[2]),k=`episode:${tmdb}:${sn}:${en}`,plays=ct104Counts.get(k)||1;b.dataset.ct104Kind='episode';b.dataset.ct104Tmdb=String(tmdb);b.dataset.ct104Season=String(sn);b.dataset.ct104Episode=String(en);b.dataset.title=ct104Q('b',row)?.textContent||'';b.textContent=plays>1?ct104PlayLabel(plays):'↻ Reassistir'}else continue;
    row.appendChild(b);
   }
  }
 });
}
function ct104DecorateEpisodeCounts(){void ct104LoadCounts(false).then(()=>{
 const st=(()=>{try{return ct169DrawerState}catch{return null}})();if(!st)return;const tmdb=ct104Num(st.showId),sn=ct104Num(st.seasonNo);if(!(tmdb>0&&sn>0))return;
 for(const b of ct104QA('[data-ct171-rewatch-episode],[data-rewatch-episode]')){const raw=String(b.getAttribute('data-ct171-rewatch-episode')||b.getAttribute('data-rewatch-episode')||''),nums=raw.split(':').map(Number).filter(Number.isFinite);let en=ct104Num(b.dataset.episode||b.dataset.episodeNumber);if(!en)en=nums.at(-1)||0;const plays=ct104Counts.get(`episode:${tmdb}:${sn}:${en}`)||1;if(plays>1){b.dataset.plays=String(plays);b.textContent=ct104PlayLabel(plays)}}
 })}
try{const base=paintHome;paintHome=function(...args){const out=base.apply(this,args);requestAnimationFrame(()=>{ct104DecorateHistory();ct104FixVisibleVersion()});return out}}catch{}
document.addEventListener('click',e=>{const b=e.target.closest?.('[data-ct104-rewatch]');if(!b)return;e.preventDefault();e.stopImmediatePropagation();const t=b.dataset.ct104Kind,tm=ct104Num(b.dataset.ct104Tmdb);if(t==='movie')void ct104MovieRewatch(tm,b);else void ct104EpisodeRewatch(tm,b.dataset.ct104Season,b.dataset.ct104Episode,b,{name:b.dataset.title||null})},true);

/* Global navigation owns the first click: detail screens close and the destination paints immediately. */
document.addEventListener('click',e=>{const n=e.target.closest?.('[data-nav],.mobile-nav a,.nav a');if(!n)return;const key=String(n.dataset.nav||'');if(!['home','discover','sports','profile','configs'].includes(key))return;e.preventDefault();e.stopImmediatePropagation();try{go(pathFor(key))}catch{try{go(key)}catch{}}},true);

/* Recommendation memory: outside never repeats; watchlist has a strict 30-day cooldown. */
let ct104MemRows=[],ct104MemAt=0,ct104MemTask=null,ct104ShownSession=new Set();
const ct104SlotKinds=['fresh:movie','fresh:series','fresh:anime','watchlist:movie','watchlist:series','watchlist:anime'];
async function ct104LoadMemory(force=false){
 if(!force&&ct104MemAt&&Date.now()-ct104MemAt<30000)return ct104MemRows;if(ct104MemTask)return ct104MemTask;
 ct104MemTask=Promise.resolve(rpc('cinetracker_recommendation_memory_v101',{})).then(rows=>{ct104MemRows=Array.isArray(rows)?rows:[];ct104MemAt=Date.now();return ct104MemRows}).catch(()=>ct104MemRows).finally(()=>{ct104MemTask=null});return ct104MemTask;
}
function ct104Blocked(slot,tmdb){const now=Date.now(),cut=now-30*86400000;return ct104MemRows.some(x=>String(x.slot)===slot&&ct104Num(x.tmdb_id)===ct104Num(tmdb)&&(slot.startsWith('fresh:')||Date.parse(x.shown_at||0)>=cut))}
function ct104FilterRows(rows,slot){return (Array.isArray(rows)?rows:[]).filter(x=>{let id=0;try{id=Number(mediaTmdb(x)||x?.id||x?.tmdb_id||0)}catch{id=Number(x?.id||x?.tmdb_id||0)}return id>0&&!ct104Blocked(slot,id)})}
function ct104FilterBag(bag,prefix){if(!bag||typeof bag!=='object')return bag;return {...bag,movie:ct104FilterRows(bag.movie,`${prefix}:movie`),series:ct104FilterRows(bag.series,`${prefix}:series`),anime:ct104FilterRows(bag.anime,`${prefix}:anime`)}}
try{const base=discoverRows;discoverRows=async function(tab){if(String(tab)==='foryou')await ct104LoadMemory(true);const d=await base(tab);if(String(tab)!=='foryou'||!d||Array.isArray(d))return d;const out={...d};for(const k of ['_ct166_fresh','_ct186_fresh','_ct186_reserve'])if(out[k])out[k]=ct104FilterBag(out[k],'fresh');for(const k of ['_ct166_watchlist','_ct186_watchlist'])if(out[k])out[k]=ct104FilterBag(out[k],'watchlist');return out}}catch{}
try{const base=ct186Select;ct186Select=function(data){if(data&&typeof data==='object'){data={...data};for(const k of ['_ct166_fresh','_ct186_fresh','_ct186_reserve'])if(data[k])data[k]=ct104FilterBag(data[k],'fresh');for(const k of ['_ct166_watchlist','_ct186_watchlist'])if(data[k])data[k]=ct104FilterBag(data[k],'watchlist')}return base(data)}}catch{}
async function ct104RecordSlot(slot,tmdb,action){if(!ct104SlotKinds.includes(slot)||!(ct104Num(tmdb)>0))return;const sessionKey=`${slot}:${tmdb}:${action}`;if(action==='shown'&&ct104ShownSession.has(sessionKey))return;if(action==='shown')ct104ShownSession.add(sessionKey);const type=slot.endsWith('movie')?'movie':'tv';try{const m=await ensureMedia(type,tmdb);await rpc('cinetracker_recommendation_record_v101',{p_media_id:Number(m.id),p_context:slot.startsWith('watchlist:')?'watchlist':'outside',p_slot:slot,p_action:action});if(action==='swapped'){ct104MemRows.unshift({tmdb_id:tmdb,slot,context:slot.startsWith('watchlist:')?'watchlist':'outside',action:'swapped',shown_at:new Date().toISOString()});ct104MemAt=Date.now()}}catch{}}
function ct104ScanShown(){for(const slot of ct104QA('[data-ct241-slot-key]')){const key=String(slot.dataset.ct241SlotKey||'');if(!ct104SlotKinds.includes(key))continue;const raw=String(ct104Q('[data-media]',slot)?.dataset.media||''),tmdb=ct104Num(raw.split(':')[1]);if(!(tmdb>0))continue;if(ct104Blocked(key,tmdb)){slot.remove();continue}void ct104RecordSlot(key,tmdb,'shown')}}
try{const base=paintDiscover;paintDiscover=function(...args){const out=base.apply(this,args);requestAnimationFrame(ct104ScanShown);return out}}catch{}
try{const base=swapNow237;swapNow237=function(button){const slot=button?.closest?.('[data-ct241-slot-key],.ct166-slot,.foryou-slot'),key=String(slot?.dataset?.ct241SlotKey||button?.dataset?.ct237Swap||''),raw=String(ct104Q('[data-media]',slot)?.dataset.media||''),tmdb=ct104Num(raw.split(':')[1]);if(key&&tmdb)void ct104RecordSlot(key,tmdb,'swapped');const ok=base(button);if(ok)requestAnimationFrame(ct104ScanShown);return ok};try{window.__ctR237SwapNow=swapNow237}catch{}}catch{}
(function ct104Midnight(){const now=new Date(),next=new Date(now);next.setHours(24,0,2,0);setTimeout(()=>{ct104MemAt=0;ct104ShownSession.clear();try{discoverCache?.clear?.()}catch{};ct104Midnight()},Math.max(1000,+next-Date.now()))})();

/* Sports: remove only the old Sports status summary. Profile statistics are never touched. */
function ct104CleanSports(){if(ct104Route()!=='sports')return;const root=ct104Q('[data-sports]');if(!root)return;ct104QA('[data-sports-stats],[data-sports-summary],.sports-stats,.sport-stats,.sports-summary,.sports-status-summary,.sports-kpis',root).forEach(n=>n.remove());for(const p of ct104QA('section.panel,.panel',root)){if(p.id==='ct-f1-v104'||p.closest?.('#ct-f1-v104'))continue;const txt=ct104Norm(p.textContent||'');if(txt.length<500&&/(jogos|eventos|esportes)/.test(txt)&&/favorit/.test(txt)&&/(disponiveis|quantidade|total|status|resumo|agora)/.test(txt))p.remove()}}
const ct104Races=d=>d?.MRData?.RaceTable?.Races||[],ct104Drivers=d=>d?.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings||[],ct104Constructors=d=>d?.MRData?.StandingsTable?.StandingsLists?.[0]?.ConstructorStandings||[];
const ct104Driver=d=>`${d?.givenName||''} ${d?.familyName||''}`.trim(),ct104Date=s=>s?new Date(`${s}T12:00:00`).toLocaleDateString('pt-BR',{day:'2-digit',month:'short'}):'—';
async function ct104F1(path){const k='ct:v104:f1:'+path;let old=null;try{old=JSON.parse(localStorage.getItem(k)||'null');if(old&&Date.now()-old.t<600000)return old.v}catch{}try{const v=await edge('cinetracker-f1-v1',{path},16000);try{localStorage.setItem(k,JSON.stringify({t:Date.now(),v}))}catch{}return v}catch(e){if(old?.v)return old.v;throw e}}
function ct104Rows(items,kind='driver'){return (items||[]).slice(0,20).map(x=>kind==='constructor'?`<div class="ct104-f1-row"><b>${ct104Esc(x.position)}</b><span>${ct104Esc(x.Constructor?.name||'—')}</span><strong>${ct104Esc(x.points||0)} pts</strong></div>`:`<div class="ct104-f1-row"><b>${ct104Esc(x.position)}</b><span>${ct104Esc(ct104Driver(x.Driver))}<small>${ct104Esc(x.Constructor?.name||x.Constructors?.[0]?.name||'')}</small></span><strong>${ct104Esc(x.points||0)} pts</strong></div>`).join('')}
function ct104Sessions(r){return [['Treino 1',r?.FirstPractice],['Treino 2',r?.SecondPractice],['Treino 3',r?.ThirdPractice],['Sprint Shootout',r?.SprintShootout],['Sprint',r?.Sprint],['Classificação',r?.Qualifying],['Corrida',{date:r?.date,time:r?.time}]].filter(([,x])=>x?.date).map(([n,x])=>`<div class="ct104-f1-row"><b>•</b><span>${ct104Esc(n)}</span><strong>${ct104Date(x.date)} ${ct104Esc((x.time||'').slice(0,5))}</strong></div>`).join('')}
async function ct104PaintF1(tab='overview'){
 const body=ct104Q('#ct-f1-v104-body');if(!body)return;body.innerHTML='<div class="loader">Carregando Fórmula 1...</div>';
 try{
  if(tab==='overview'){const [cal,ds,cs,res]=await Promise.all([ct104F1('current'),ct104F1('current/driverstandings'),ct104F1('current/constructorstandings'),ct104F1('current/last/results')]);const rs=ct104Races(cal),next=rs.find(r=>new Date(r.date+'T23:59:59')>=new Date())||rs.at(-1),last=ct104Races(res)[0],winner=last?.Results?.[0];body.innerHTML=`<div class="ct104-f1-grid"><div class="ct104-f1-card"><h3>Próximo GP</h3><h2>${ct104Esc(next?.raceName||'—')}</h2><small>${ct104Esc(next?.Circuit?.circuitName||'')} · ${ct104Date(next?.date)}</small>${ct104Sessions(next)}</div><div class="ct104-f1-card"><h3>Líderes</h3>${ct104Rows(ct104Drivers(ds).slice(0,5))}</div><div class="ct104-f1-card"><h3>Construtores</h3>${ct104Rows(ct104Constructors(cs).slice(0,5),'constructor')}</div><div class="ct104-f1-card"><h3>Último vencedor</h3><h2>${ct104Esc(ct104Driver(winner?.Driver)||'—')}</h2><small>${ct104Esc(last?.raceName||'')} · ${ct104Esc(winner?.Constructor?.name||'')}</small></div></div>`}
  if(tab==='calendar'){const d=await ct104F1('current');body.innerHTML=`<div class="ct104-f1-card">${ct104Races(d).map(r=>`<div class="ct104-f1-race"><b>${ct104Esc(r.round)}. ${ct104Esc(r.raceName)}</b><small>${ct104Esc(r.Circuit?.circuitName||'')} · ${ct104Date(r.date)}</small></div>`).join('')}</div>`}
  if(tab==='drivers')body.innerHTML=`<div class="ct104-f1-card">${ct104Rows(ct104Drivers(await ct104F1('current/driverstandings')))}</div>`;
  if(tab==='constructors')body.innerHTML=`<div class="ct104-f1-card">${ct104Rows(ct104Constructors(await ct104F1('current/constructorstandings')),'constructor')}</div>`;
  if(tab==='last'){const [res,q,s]=await Promise.all([ct104F1('current/last/results'),ct104F1('current/last/qualifying'),ct104F1('current/last/sprint').catch(()=>null)]),r=ct104Races(res)[0],qr=ct104Races(q)[0],sr=ct104Races(s||{})[0];body.innerHTML=`<div class="ct104-f1-grid"><div class="ct104-f1-card"><h3>Corrida — ${ct104Esc(r?.raceName||'')}</h3>${ct104Rows(r?.Results||[])}</div><div class="ct104-f1-card"><h3>Grid / Qualificação</h3>${(qr?.QualifyingResults||[]).map(x=>`<div class="ct104-f1-row"><b>${ct104Esc(x.position)}</b><span>${ct104Esc(ct104Driver(x.Driver))}</span><strong>${ct104Esc(x.Q3||x.Q2||x.Q1||'')}</strong></div>`).join('')}</div><div class="ct104-f1-card"><h3>Sprint</h3>${sr?.SprintResults?ct104Rows(sr.SprintResults):'<div class="empty">Sem Sprint no último GP.</div>'}</div></div>`}
  if(tab==='pitstops'){const r=ct104Races(await ct104F1('current/last/pitstops'))[0];body.innerHTML=`<div class="ct104-f1-card"><h3>Pit stops — ${ct104Esc(r?.raceName||'')}</h3>${(r?.PitStops||[]).slice(-50).map(x=>`<div class="ct104-f1-row"><b>V${ct104Esc(x.lap)}</b><span>${ct104Esc(x.driverId)}</span><strong>${ct104Esc(x.duration)}</strong></div>`).join('')||'<div class="empty">Dados indisponíveis.</div>'}</div>`}
  if(tab==='laps'){const r=ct104Races(await ct104F1('current/last/laps'))[0],laps=r?.Laps||[];body.innerHTML=`<div class="ct104-f1-card"><h3>Voltas — ${ct104Esc(r?.raceName||'')}</h3>${laps.slice(-20).map(l=>`<div class="ct104-f1-race"><b>Volta ${ct104Esc(l.number)}</b><small>${(l.Timings||[]).slice(0,6).map(t=>`${ct104Esc(t.driverId)} ${ct104Esc(t.time)}`).join(' · ')}</small></div>`).join('')||'<div class="empty">Dados indisponíveis.</div>'}</div>`}
 }catch(e){body.innerHTML='<div class="error">Não foi possível carregar os dados da Fórmula 1 agora.</div>'}
}
function ct104EnsureF1(){if(ct104Route()!=='sports')return;ct104CleanSports();const root=ct104Q('[data-sports]');if(!root||ct104Q('#ct-f1-v104',root))return;const hub=document.createElement('section');hub.id='ct-f1-v104';hub.className='panel ct104-f1-hub';hub.innerHTML='<div class="panel-head"><div><div class="eyebrow">FÓRMULA 1</div><h2>F1 Hub</h2><small>Próximo GP, calendário, campeonatos, resultados, sessões, pit stops e voltas</small></div></div><div class="ct104-f1-tabs"><button class="active" data-ct104-f1="overview">Visão geral</button><button data-ct104-f1="calendar">Calendário</button><button data-ct104-f1="drivers">Pilotos</button><button data-ct104-f1="constructors">Construtores</button><button data-ct104-f1="last">Último GP</button><button data-ct104-f1="pitstops">Pit stops</button><button data-ct104-f1="laps">Voltas</button></div><div id="ct-f1-v104-body"></div>';root.prepend(hub);hub.addEventListener('click',e=>{const b=e.target.closest?.('[data-ct104-f1]');if(!b)return;ct104QA('[data-ct104-f1]',hub).forEach(x=>x.classList.toggle('active',x===b));void ct104PaintF1(b.dataset.ct104F1)});void ct104PaintF1('overview')}
try{const base=paintSports;paintSports=function(...args){const out=base.apply(this,args);requestAnimationFrame(ct104EnsureF1);return out}}catch{}
try{const base=renderSports;renderSports=async function(...args){const out=await base.apply(this,args);requestAnimationFrame(ct104EnsureF1);return out}}catch{}

/* Android card geometry: Discover is the source of truth, three visible cards at normal phone width. */
const ct104Style=document.createElement('style');ct104Style.id='ct-v104-style';ct104Style.textContent=`
.ct104-history-rewatch{margin-left:auto!important;white-space:nowrap!important;padding:7px 9px!important;font-size:11px!important}.media-row{gap:8px!important}.media-row>.ct104-history-rewatch{align-self:center!important}
.ct104-f1-hub{margin:12px 0 18px!important}.ct104-f1-tabs{display:flex;gap:7px;overflow-x:auto;padding:8px 0 12px;scrollbar-width:none}.ct104-f1-tabs button{flex:0 0 auto;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.05);color:inherit;border-radius:999px;padding:8px 11px;font:inherit;font-size:12px}.ct104-f1-tabs button.active{background:rgba(255,255,255,.17)}.ct104-f1-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:10px}.ct104-f1-card{border:1px solid rgba(255,255,255,.1);border-radius:15px;padding:12px;background:rgba(255,255,255,.035);min-width:0}.ct104-f1-card h2{margin:4px 0 2px}.ct104-f1-card h3{margin:0 0 8px}.ct104-f1-row{display:grid;grid-template-columns:30px minmax(0,1fr) auto;gap:8px;align-items:center;padding:7px 0;border-top:1px solid rgba(255,255,255,.07)}.ct104-f1-row:first-child{border-top:0}.ct104-f1-row span{min-width:0}.ct104-f1-row span small{display:block;opacity:.6;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ct104-f1-row strong{text-align:right}.ct104-f1-race{padding:9px 0;border-top:1px solid rgba(255,255,255,.07)}.ct104-f1-race:first-child{border-top:0}.ct104-f1-race b,.ct104-f1-race small{display:block}.ct104-f1-race small{opacity:.65;margin-top:2px}
html.ct104-android{--ct104-card-w:calc((100vw - 36px)/3)}html.ct104-android .page .row,html.ct104-android [data-profile] .row,html.ct104-android .ct169-related-row,html.ct104-android .ct169-cast-row{display:flex!important;flex-flow:row nowrap!important;gap:6px!important;overflow-x:auto!important;overflow-y:hidden!important;-webkit-overflow-scrolling:touch!important;scrollbar-width:none!important}html.ct104-android .page .row>.card,html.ct104-android [data-profile] .row>.card,html.ct104-android .ct169-related-card,html.ct104-android .ct169-cast-card{box-sizing:border-box!important;flex:0 0 var(--ct104-card-w)!important;width:var(--ct104-card-w)!important;min-width:var(--ct104-card-w)!important;max-width:var(--ct104-card-w)!important}html.ct104-android .card .poster,html.ct104-android .ct169-related-card .poster,html.ct104-android .ct169-cast-card .poster{width:100%!important;aspect-ratio:2/3!important;height:auto!important;object-fit:cover!important}html.ct104-android .card .card-body,html.ct104-android .ct169-related-card .card-body,html.ct104-android .ct169-cast-card .card-body{box-sizing:border-box!important;height:42px!important;min-height:42px!important;max-height:42px!important;overflow:hidden!important;padding:5px!important}html.ct104-android .card .card-body b,html.ct104-android .card .card-body small,html.ct104-android .ct169-related-card b,html.ct104-android .ct169-cast-card b{display:block!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;max-width:100%!important}html.ct104-android .ct199-fav-list,html.ct104-android .ct221-fav-list{grid-template-columns:repeat(3,minmax(0,1fr))!important}html.ct104-android .ct199-fav-card,html.ct104-android .ct221-fav-card{min-width:0!important;grid-template-columns:36px minmax(0,1fr) auto!important;padding:6px!important}html.ct104-android .ct199-fav-poster,html.ct104-android .ct221-fav-poster{width:36px!important;height:54px!important}
@media(max-width:640px){.ct104-f1-grid{grid-template-columns:1fr}}
`;document.getElementById(ct104Style.id)?.remove();document.head.appendChild(ct104Style);

let ct104Frame=0;function ct104Refresh(){if(ct104Frame)return;ct104Frame=requestAnimationFrame(()=>{ct104Frame=0;ct104FixVisibleVersion();ct104DecorateHistory();ct104DecorateEpisodeCounts();if(ct104Route()==='sports')ct104EnsureF1()})}
new MutationObserver(ct104Refresh).observe(document.querySelector('#app')||document.documentElement,{subtree:true,childList:true});window.addEventListener('popstate',ct104Refresh);window.addEventListener('hashchange',ct104Refresh);requestAnimationFrame(ct104Refresh);
})();
