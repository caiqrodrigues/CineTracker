/* CineTracker Android r265 — scoped device parity (Web r541 remains frozen). */
(()=>{
'use strict';
if(window.__ctR265AndroidV1023)return;
window.__ctR265AndroidV1023='f1-gp-weekend+sports-fast-first-paint+phone-fit+strict-foryou';
const q=(s,r=document)=>r?.querySelector?.(s)||null,qa=(s,r=document)=>r?.querySelectorAll?[...r.querySelectorAll(s)]:[];
const E=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=x=>String(x??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const rows=x=>Array.isArray(x)?x:Array.isArray(x?.rows)?x.rows:[];
const restricted=/\b(aew|all elite wrestling|wwe|wrestlemania|smackdown|raw|nxt|wwf|njpw|new japan pro wrestling|ring of honor|roh|tna wrestling|impact wrestling|lucha libre|luta livre|pro wrestling|professional wrestling|wrestling|ufc|bellator|mma|one championship|fight night|royal rumble|survivor series|summerslam|pay.per.view|ppv|ple|stand[\s-]?up|reality show|reality tv)\b/i;
function allowed(x){
 if(!x||typeof x!=='object')return false;
 let id=0;try{id=Number(typeof mediaTmdb==='function'?mediaTmdb(x):x.tmdb_id||x.id||0)||0}catch{id=Number(x.tmdb_id||x.id||0)||0}
 const title=String(x.title||x.name||x.original_title||x.original_name||x.raw_tmdb?.title||x.raw_tmdb?.name||'').trim();
 const poster=String(x.poster_path||x.poster_url||x.raw_tmdb?.poster_path||x.raw_tmdb?.poster_url||'').trim();
 const all=norm([title,x.original_title,x.original_name,x.overview].filter(Boolean).join(' '));
 const gs=rows(x.genre_ids||x.raw_tmdb?.genre_ids||x.genres).map(z=>Number(z?.id??z)||0);
 const runtime=Number(x.runtime||x.runtime_minutes||x.raw_tmdb?.runtime||0);
 const origin=norm(rows(x.production_companies||x.networks).map(z=>z?.name||'').join(' ')+' '+String(x.homepage||'')+' '+String(x.origin||''));
 if(!id||!title||!poster||restricted.test(all)||gs.includes(10764)||gs.includes(10767))return false;
 if(runtime>0&&runtime<40||origin.includes('youtube')||origin.includes('youtu.be'))return false;
 return true;
}
function filterBag(b){if(!b||typeof b!=='object')return {movie:[],series:[],anime:[]};return {...b,movie:rows(b.movie).filter(allowed),series:rows(b.series).filter(allowed),anime:rows(b.anime).filter(allowed)}}
function sanitize(data){
 if(!data||typeof data!=='object')return data;
 for(const k of ['_ct186_fresh','_ct186_watchlist','_ct166_fresh','_ct166_watchlist','_ct186_reserve','_ct186_fallback'])if(data[k])data[k]=filterBag(data[k]);
 data._ct186_fallback={movie:[],series:[],anime:[]};
 return data;
}
try{
 const baseSelect=ct186Select;
 ct186Select=function(data){
  sanitize(data);
  const selected=baseSelect(data);
  for(const k of ['daily','wm','ws','wa','fm','fs','fa'])if(selected[k]&&!allowed(selected[k]))selected[k]=null;
  for(const k of ['wmPool','wsPool','waPool'])selected[k]=rows(selected[k]).filter(allowed);
  return selected;
 };
 const baseLoad=ct186LoadForYou;
 ct186LoadForYou=async function(...args){
  const data=await baseLoad.apply(this,args);
  sanitize(data);
  const picked=ct186Select(data);
  Object.assign(data,{daily:picked.daily,movie:picked.fm,series:picked.fs,anime:picked.fa,watchlist_movie:picked.wm,watchlist_series:picked.ws,watchlist_anime:picked.wa,wmPool:picked.wmPool,wsPool:picked.wsPool,waPool:picked.waPool});
  try{ct186ForYouData=data}catch{}
  return data;
 };
 const baseSlot=ct186Slot;
 ct186Slot=function(label,x,key,count){
  if(x&&allowed(x))return baseSlot(label,x,key,count);
  return '<div class="foryou-slot ct265-empty-slot" data-ct241-slot-key="'+E(key)+'"><small>'+E(label)+'</small><div class="ct265-empty-message">Nenhuma indicação elegível nesta categoria.</div><button type="button" class="chip" data-ct265-retry-foryou>↻ Buscar novamente</button></div>';
 };
}catch(e){document.documentElement.dataset.ct265ForYouPatchError=String(e?.message||e)}
let refreshInProgress=false;
document.addEventListener('click',e=>{
 const b=e.target?.closest?.('[data-ct265-retry-foryou]');if(!b)return;
 e.preventDefault();e.stopImmediatePropagation();if(refreshInProgress)return;
 refreshInProgress=true;b.disabled=true;
 Promise.resolve(typeof ct186RefreshVisible==='function'?ct186RefreshVisible():null).finally(()=>{refreshInProgress=false;if(b.isConnected)b.disabled=false});
},true);

/* Fast Sports first paint: use the actual sports view, never wait for a 45-day bulk sync. */
let sportsFirst=null,sportsRequest=null;
try{
 const priorSportsPayload=sportsPayload;
 sportsPayload=async function(force=false){
  if(sportsCache&&!force)return sportsCache;
  if(!force&&sportsFirst)return sportsFirst;
  if(force)return priorSportsPayload(true);
  if(sportsRequest)return sportsRequest;
  sportsRequest=(async()=>{
   const from=new Date(shiftDays(-2)+'T00:00:00'),to=new Date(shiftDays(5)+'T23:59:59');
   const load=rpc('cinetracker_sports_payload_v1',{p_from:from.toISOString(),p_to:to.toISOString()});
   const data=await Promise.race([load,new Promise((_,reject)=>setTimeout(()=>reject(new Error('Sports fast window timeout')),14000))]);
   if(data&&typeof data==='object'){
    sportsCache=data;sportsFirst=data;try{ct163Write('sports',data)}catch{}
    return data;
   }
   return priorSportsPayload(false);
  })().finally(()=>{sportsRequest=null});
  try{return await sportsRequest}catch{
   const cached=(()=>{try{return ct163Read('sports')}catch{return null}})();
   if(cached){sportsCache=cached;return cached}
   return{sports:[],events:[],favorites:[],preferences:{}};
  }
 };
 const baseRenderSports=renderSports;
 renderSports=function(...args){
  const promise=baseRenderSports.apply(this,args);
  queueMicrotask(()=>{
   if(typeof route!=='function'||route()!=='sports')return;
   const root=q('[data-sports]');if(!root)return;
   if(!q('#ct265-sports-loading',root)&&root.querySelector('.loader')){
    const pane=document.createElement('div');pane.id='ct265-sports-loading';pane.className='panel';
    pane.innerHTML='<div class="panel-head"><h2>F1 Hub e Esportes</h2><small>Agenda do período atual</small></div><p>Buscando jogos recentes. Você pode continuar navegando enquanto os dados chegam.</p>';
    root.appendChild(pane);
   }
  });
  return promise;
 };
}catch(e){document.documentElement.dataset.ct265SportsPatchError=String(e?.message||e)}

/* Modern Web-style Formula 1: clickable entire calendar, complete weekends and grid/result. */
let seasonData=null,historyCache=null,historyAt=0,selectedRace=null,writing=false;
function setData(d){
 if(!d||!rows(d.races).length)return;
 seasonData=d;queueMicrotask(enhanceCalendar);
}
function enhanceCalendar(){
 const hub=q('#ct-f1-v111'),list=qa('.ct111-f1-race',hub),races=rows(seasonData?.races);
 if(!list.length||!races.length)return;
 list.forEach((el,i)=>{
  const r=races[i];if(!r)return;
  el.dataset.ct265Race=String(i);el.setAttribute('role','button');el.setAttribute('tabindex','0');
  el.setAttribute('aria-label','Abrir fim de semana do '+String(r.raceName||'Grande Prêmio'));
  if(!q('.ct265-open-gp',el)){const hint=document.createElement('small');hint.className='ct265-open-gp';hint.textContent='Detalhes, grid de largada e resultado ›';el.appendChild(hint)}
 });
 hub.dataset.ct265F1='web-r541-calendar-weekends';
}
function start(r){const d=String(r?.date||''),t=String(r?.time||'12:00:00Z');if(!d)return null;const x=new Date(d+'T'+t);return Number.isNaN(+x)?null:x}
function sessions(r,year){
 const list=[['fp1','Treino livre 1',r.FirstPractice],['fp2','Treino livre 2',r.SecondPractice],['fp3','Treino livre 3',r.ThirdPractice],['sprint_qualifying','Classificação Sprint',r.SprintQualifying||r.SprintShootout],['sprint','Sprint',r.Sprint],['qualifying','Classificação',r.Qualifying],['race','Corrida',{date:r.date,time:r.time}]];
 return list.map(z=>{const date=start(z[2]);return date?{kind:z[0],label:z[1],date,id:'f1:'+year+':'+Number(r.round)+':'+z[0]}:null}).filter(Boolean).sort((a,b)=>a.date-b.date);
}
async function history(force=false){
 if(!force&&historyCache&&Date.now()-historyAt<20000)return historyCache;
 const r=await rpc('cinetracker_sports_watch_history_v296',{});
 historyCache=rows(r).filter(x=>String(x.sport_slug||'')==='formula_1'||/formula\s*1|\bf1\b/i.test(String(x.competition_name||x.title||'')));
 historyAt=Date.now();return historyCache;
}
function watched(s,list){
 return rows(list).some(x=>{
  if(x.is_watched===false)return false;
  if(String(x.provider_event_id||'')===s.id||s.kind==='race'&&String(x.provider_event_id||'')===String(selectedRace.year)+'-'+Number(selectedRace.round))return true;
  const dt=new Date(x.starts_at||x.sport_watched_at||0);return Number.isFinite(+dt)&&Math.abs(+dt-(+s.date))<4*3600000&&norm(x.title||'').includes(norm(s.label).split(' ')[0]);
 });
}
function sessionHtml(r,list){
 return sessions(r,selectedRace.year).map(s=>{
  const isSeen=watched(s,list),past=(+s.date)<=Date.now();
  return '<article class="ct265-session"><div><b>'+E(s.label)+'</b><small>'+E(s.date.toLocaleString('pt-BR',{dateStyle:'short',timeStyle:'short'}))+'</small></div><button type="button" class="chip" data-ct265-session="'+E(s.id)+'" data-kind="'+E(s.kind)+'" data-watched="'+(isSeen?'1':'0')+'" '+(past?'':'disabled')+'>'+(past?(isSeen?'↶ Desmarcar':'✓ Assistido'):'Ainda não realizado')+'</button></article>';
 }).join('')||'<div class="empty">Sessões indisponíveis.</div>';
}
function resultsList(data){
 const x=data?.MRData?.RaceTable?.Races?.[0]||data?.RaceTable?.Races?.[0]||data?.races?.[0]||{};
 return rows(x.Results||x.results);
}
function table(list,key){
 const sorted=[...list].sort((a,b)=>Number(a[key]||999)-Number(b[key]||999));
 return '<div class="ct265-result-table">'+(sorted.map((x,i)=>{
  const d=x.Driver||{},name=[d.givenName,d.familyName].filter(Boolean).join(' ')||d.code||'Piloto';
  return '<div class="ct265-result-row"><b>'+E(key==='grid'?(x.grid||i+1):(x.position||i+1))+'</b><span>'+E(name)+'</span><small>'+E(key==='grid'?(x.Constructor?.name||''):(x.Time?.time||x.status||'—'))+'</small></div>';
 }).join('')||'<div class="empty">Dados ainda não disponíveis.</div>')+'</div>';
}
function close(){q('[data-ct265-gp-dialog]')?.remove();selectedRace=null}
function openRace(i){
 const r=rows(seasonData?.races)[Number(i)];if(!r)return false;
 close();const year=Number(seasonData?.season||new Date().getFullYear());
 selectedRace={...r,year,round:Number(r.round||Number(i)+1)};
 const overlay=document.createElement('div');overlay.className='ct265-gp-overlay';overlay.dataset.ct265GpDialog='1';
 overlay.innerHTML='<div class="ct265-gp-page" role="dialog" aria-modal="true"><header><div><small>F1 HUB · TEMPORADA '+year+'</small><h2>'+E(r.raceName||'Grande Prêmio')+'</h2><p>'+E(r.Circuit?.circuitName||'Circuito')+' · '+E(r.Circuit?.Location?.country||'')+'</p></div><button type="button" class="btn" data-ct265-close aria-label="Fechar">✕ Fechar</button></header><section class="panel"><h3>Fim de semana</h3><div data-ct265-sessions><div class="loader">Carregando marcações...</div></div></section><section class="panel"><h3>Grid de Largada</h3><div data-ct265-grid class="loader">Carregando grid...</div></section><section class="panel"><h3>Resultado de Chegada</h3><div data-ct265-results class="loader">Carregando resultado...</div></section></div>';
 document.body.appendChild(overlay);
 void history().then(h=>{if(overlay.isConnected)q('[data-ct265-sessions]',overlay).innerHTML=sessionHtml(r,h)}).catch(()=>{if(overlay.isConnected)q('[data-ct265-sessions]',overlay).innerHTML=sessionHtml(r,[])});
 const url='https://api.jolpi.ca/ergast/f1/'+encodeURIComponent(year)+'/'+encodeURIComponent(selectedRace.round)+'/results.json?limit=100';
 void fetch(url,{headers:{Accept:'application/json'}}).then(res=>{if(!res.ok)throw new Error('HTTP '+res.status);return res.json()}).then(data=>{
  if(!overlay.isConnected)return;const result=resultsList(data);
  q('[data-ct265-grid]',overlay).innerHTML=table(result,'grid');
  q('[data-ct265-results]',overlay).innerHTML=table(result,'position');
 }).catch(()=>{if(!overlay.isConnected)return;const msg='<div class="empty">Resultados indisponíveis para esta corrida.</div>';q('[data-ct265-grid]',overlay).innerHTML=msg;q('[data-ct265-results]',overlay).innerHTML=msg});
 return true;
}
async function updateSession(button){
 if(!selectedRace||writing||button.disabled)return;
 const s=sessions(selectedRace,selectedRace.year).find(x=>x.id===button.dataset.ct265Session);if(!s)return;
 const was=button.dataset.watched==='1',next=!was;writing=true;button.dataset.watched=next?'1':'0';button.textContent=next?'↶ Desmarcar':'✓ Assistido';button.disabled=true;
 const payload={p_provider:'jolpica',p_provider_event_id:s.id,p_sport_slug:'formula_1',p_competition_name:'Fórmula 1',p_title:String(selectedRace.raceName||'Grande Prêmio')+' · '+s.label,p_starts_at:s.date.toISOString(),p_attended_in_person:false,p_stadium_name:null,p_watched:next,p_metadata:{season:selectedRace.year,round:selectedRace.round,session_kind:s.kind,source:'android-r265-f1-web-parity'}};
 try{
  await rpc('cinetracker_sports_watch_set_v296',payload);
  historyCache=null;const h=await history(true);
  const el=q('[data-ct265-sessions]');if(el)el.innerHTML=sessionHtml(selectedRace,h);
  document.dispatchEvent(new CustomEvent('cinetracker:data-changed',{detail:{source:'android-r265-f1-hub',session:s.id,watched:next}}));
 }catch(e){button.dataset.watched=was?'1':'0';button.textContent=was?'↶ Desmarcar':'✓ Assistido';button.disabled=false;try{toast(e?.message||'Não foi possível salvar')}catch{}}
 finally{writing=false}
}
document.addEventListener('click',ev=>{
 const target=ev.target;if(!target?.closest)return;
 if(target.closest('[data-ct265-close]')||target.matches?.('[data-ct265-gp-dialog]')){ev.preventDefault();ev.stopImmediatePropagation();close();return}
 const w=target.closest('[data-ct265-session]');if(w){ev.preventDefault();ev.stopImmediatePropagation();void updateSession(w);return}
 const r=target.closest('[data-ct265-race]');if(r){ev.preventDefault();ev.stopImmediatePropagation();openRace(r.dataset.ct265Race);return}
 const tab=target.closest('[data-ct111-f1="calendar"]');if(tab)requestAnimationFrame(enhanceCalendar);
},true);
document.addEventListener('keydown',ev=>{if(ev.key==='Escape')close();const t=ev.target?.closest?.('[data-ct265-race]');if(t&&(ev.key==='Enter'||ev.key===' ')){ev.preventDefault();openRace(t.dataset.ct265Race)}});

const css=document.createElement('style');css.id='ct-r265-android-phone';
css.textContent=[
 'html,body,#app,.app,.content{box-sizing:border-box!important;width:100%!important;max-width:100%!important;min-width:0!important;overflow-x:hidden!important}',
 'body{min-width:0!important}.content{padding-right:10px!important;padding-left:10px!important;padding-bottom:calc(76px + env(safe-area-inset-bottom))!important}',
 '[data-home], [data-home-view],.home-start,.home-history, [data-sports], [data-discover], [data-profile]{width:100%!important;min-width:0!important;max-width:100%!important}',
 '.home-viewport{height:calc(100dvh - 160px)!important;max-height:none!important;min-height:240px!important;overflow-y:auto!important;overflow-x:hidden!important;overscroll-behavior-y:contain!important;scroll-behavior:auto!important;-webkit-overflow-scrolling:touch!important;scroll-padding-bottom:50px!important}',
 '.home-start{padding-bottom:calc(96px + env(safe-area-inset-bottom))!important}.home-start .panel,.home-history .panel{min-width:0!important;width:100%!important}',
 '.ct263-special-screen,.ct263-sports-detail,.ct263-profile-modal{height:100dvh!important;max-height:100dvh!important;overflow-y:auto!important;overscroll-behavior:contain!important;padding:10px 10px calc(94px + env(safe-area-inset-bottom))!important}',
 '.ct263-special-page,.ct263-special-events,.ct263-special-event,.ct263-sports-dialog{min-width:0!important;width:100%!important;max-width:100%!important}',
 '.ct263-special-event{grid-template-columns:minmax(0,1fr)!important}.ct263-special-event b,.ct263-special-event small{overflow-wrap:anywhere!important}',
 '.ct265-gp-overlay{position:fixed;inset:0;z-index:14000;background:#030b12;overflow-y:auto;overscroll-behavior:contain;padding:10px 10px calc(95px + env(safe-area-inset-bottom))}',
 '.ct265-gp-page{width:min(800px,100%);margin:auto}.ct265-gp-page>header{display:flex;justify-content:space-between;align-items:start;gap:12px;padding:10px 0}.ct265-gp-page h2{margin:5px 0}.ct265-gp-page header p{opacity:.78}',
 '.ct265-gp-page .panel{margin:10px 0;padding:12px}.ct265-session{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px;border-bottom:1px solid #194252;padding:10px 0;align-items:center}.ct265-session b,.ct265-session small{display:block}.ct265-session small{color:#9ab0bf}.ct265-session .chip{white-space:normal;text-align:center}',
 '.ct265-result-row{display:grid;grid-template-columns:25px minmax(0,1fr) auto;gap:8px;padding:7px 2px;border-bottom:1px solid #214555;align-items:center}.ct265-result-row span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.ct265-result-row small{font-size:11px}',
 '.ct111-f1-race[data-ct265-race]{cursor:pointer;border-radius:10px;padding:10px;border:1px solid #214555;margin:4px 0}.ct265-open-gp{color:#56b9eb!important;font-weight:700!important}',
 '.foryou-grid .card .card-body{min-width:0!important}.foryou-grid .card b,.foryou-slot .card-body b{white-space:normal!important;overflow-wrap:anywhere!important;display:-webkit-box!important;-webkit-line-clamp:2!important;-webkit-box-orient:vertical!important;overflow:hidden!important}',
 '.ct265-empty-slot{min-width:0!important;border:1px dashed #31556a;border-radius:10px;padding:10px}.ct265-empty-message{color:#9db7c6;font-size:12px;line-height:1.4;margin:9px 0}',
 '@media(max-width:440px){.ct265-session{grid-template-columns:1fr!important}.ct265-session .chip{width:100%}.ct265-gp-page>header{flex-wrap:wrap}}'
].join('\n');document.head.appendChild(css);
window.__ctR265F1={setData,enhanceCalendar,openRace,close};
window.__ctR265Test={allowed,sanitize,filterBag,sessions,resultsList};
})();