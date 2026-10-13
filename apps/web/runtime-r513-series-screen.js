/* CineTracker Web 0.3.40 r513 — canonical full-screen UFC/F1 series view. */
(()=>{
'use strict';
if(window.__ctR513SeriesScreen?.version==='0.3.40')return;
const q=(s,r=document)=>r?.querySelector?.(s)||null,rows=v=>Array.isArray(v)?v:[];
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const core=()=>window.__ctCoreR471||null;
const rpc=(name,args={})=>core()?.rpc?core().rpc(name,args):Promise.reject(new Error('RPC_UNAVAILABLE'));
const special=()=>window.__ctR512Special||null;
const currentYear=()=>new Date().getFullYear();
const locks=new Set();
let state=null,loadToken=0;
function fmtDate(v){const d=new Date(v||0);if(!Number.isFinite(d.getTime()))return'—';try{return new Intl.DateTimeFormat('pt-BR',{timeZone:'America/Sao_Paulo',day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'}).format(d)}catch{return d.toLocaleString('pt-BR')}}
function f1Kind(v){return({fp1:'Treino Livre 1',fp2:'Treino Livre 2',fp3:'Treino Livre 3',qualifying:'Classificação',sprint_qualifying:'Classificação Sprint',sprint:'Sprint',race:'Corrida'})[String(v||'')]||'Sessão'}
function close(){state=null;loadToken++;q('[data-ct513-series-screen]')?.remove();document.documentElement.classList.remove('ct513-series-open');return true}
function eventHtml(type,x){
 const watched=!!x?.is_watched,released=x?.released!==false&&(!x?.starts_at||Date.parse(x.starts_at)<=Date.now()+60000);
 const season=Number(x?.season||state?.season||currentYear()),episode=Number(x?.episode_number||0),round=Number(x?.round||0);
 const label=type==='f1'?(x?.source==='historical'?('T'+season+' · GP '+String(round).padStart(2,'0')):('T'+season+' E'+String(episode).padStart(3,'0')+' · '+f1Kind(x?.session_kind))):('T'+season+' · '+String(x?.event_kind||'UFC'));
 return '<article class="ct513-series-episode '+(watched?'watched':'')+'" data-ct513-episode><div class="ct513-series-episode-copy"><small>'+esc(label)+' · '+esc(fmtDate(x?.starts_at))+'</small><b>'+esc(x?.title||(type==='f1'?'Fórmula 1':'UFC'))+'</b><span>'+Number(x?.runtime_minutes||0)+' min</span></div><button type="button" class="chip ct513-series-watch '+(watched?'on':'')+'" data-ct513-watch="'+type+'" data-season="'+season+'" data-episode="'+episode+'" data-round="'+round+'" data-event-id="'+Number(x?.event_id||0)+'" data-legacy-media-id="'+Number(x?.legacy_media_id||0)+'" data-source="'+esc(x?.source||'mapped')+'" data-watched="'+(watched?'1':'0')+'" '+(released?'':'disabled')+'>'+(watched?'↶ Desmarcar':released?'✓ Assistido':'Em breve')+'</button></article>'
}
function render(){
 if(!state)return false;
 let root=q('[data-ct513-series-screen]');if(!root){root=document.createElement('div');root.dataset.ct513SeriesScreen='1';root.className='ct513-series-screen';document.body.appendChild(root)}
 const type=state.type,title=type==='f1'?'Fórmula 1':'UFC',data=state.data||{},s=data.series||{},events=rows(data.events),seasons=rows(data.seasons);
 const watched=Number(s.watched_episodes??events.filter(x=>x.is_watched).length),total=Number(s.total_episodes??events.length),loading=state.loading;
 const subtitle=type==='f1'?'Temporadas desde 1950 · treinos, classificação, sprint e corrida':'Temporadas desde 1993 · Fight Nights e PPVs';
 root.innerHTML='<main class="ct513-series-page"><header class="ct513-series-head"><button type="button" class="btn ct513-series-back" data-ct513-series-close>← Voltar</button><div><small>SÉRIE</small><h1>'+title+'</h1><p>'+subtitle+'</p></div></header><section class="panel ct513-series-season"><div class="ct513-series-toolbar"><label>Temporada <select data-ct513-season '+(loading?'disabled':'')+'>'+seasons.map(y=>'<option value="'+Number(y)+'"'+(Number(y)===Number(state.season)?' selected':'')+'>'+Number(y)+'</option>').join('')+'</select></label><strong>'+watched+' / '+total+' assistidos</strong></div><div class="ct513-series-events">'+(loading?'<div class="ct513-series-loading">Carregando temporada '+Number(state.season)+'…</div>':events.length?events.map(x=>eventHtml(type,x)).join(''):'<div class="empty">Nenhum episódio/evento encontrado nesta temporada.</div>')+'</div></section></main>';
 document.documentElement.classList.add('ct513-series-open');return true
}
async function open(type,season=currentYear()){
 const api=special();if(!api?.loadSeason)return false;
 const token=++loadToken;state={type:type==='ufc'?'ufc':'f1',season:Number(season)||currentYear(),data:null,loading:true};render();
 try{const data=await api.loadSeason(state.type,state.season);if(!state||token!==loadToken)return false;state.data=data||{};state.loading=false;render();return true}
 catch(e){if(state&&token===loadToken){state.loading=false;state.data={series:{season:state.season},events:[],seasons:[]};render();const box=q('.ct513-series-events');if(box)box.innerHTML='<div class="error">Não foi possível carregar esta temporada.</div>';document.documentElement.dataset.ct513SeriesError=String(e?.message||e)}return false}
}
async function changeSeason(season){if(!state)return false;return open(state.type,Number(season))}
async function toggle(btn){
 if(!state||!btn)return false;
 const type=String(btn.dataset.ct513Watch||''),season=Number(btn.dataset.season||0),episode=Number(btn.dataset.episode||0),round=Number(btn.dataset.round||0),key=type+':'+season+':'+episode;
 if(!season||!episode||locks.has(key))return false;
 const ev=rows(state.data?.events).find(x=>Number(x.season||state.season)===season&&Number(x.episode_number)===episode);if(!ev)return false;
 const before=!!ev.is_watched,next=!before;locks.add(key);ev.is_watched=next;if(state.data?.series)state.data.series.watched_episodes=Math.max(0,Number(state.data.series.watched_episodes||0)+(next?1:-1));render();
 try{
  if(type==='f1'){
   if(ev.source==='historical')await rpc('cinetracker_f1_historical_watch_v512',{p_season:season,p_round:round,p_title:ev.title,p_runtime_minutes:Number(ev.runtime_minutes||120),p_watched:next,p_watched_at:new Date().toISOString()});
   else await rpc('cinetracker_f1_watch_sync_v462',{p_season:season,p_episode:episode,p_watched:next,p_watched_at:new Date().toISOString(),p_event_id:Number(ev.event_id||0)||null,p_attended_in_person:false,p_stadium_name:null,p_source:'series-r513-screen'});
   window.dispatchEvent(new CustomEvent('cinetracker:f1-watched-changed',{detail:{source:'series-r513-screen',season,episode,watched:next}}));
  }else{
   await rpc('cinetracker_ufc_watch_v512',{p_season:season,p_episode:episode,p_title:ev.title,p_runtime_minutes:Number(ev.runtime_minutes||180),p_event_id:Number(ev.event_id||0)||null,p_legacy_media_id:Number(ev.legacy_media_id||0)||null,p_watched:next,p_watched_at:new Date().toISOString()});
   window.dispatchEvent(new CustomEvent('cinetracker:sports-watched-changed',{detail:{source:'series-r513-screen',season,episode,watched:next}}));
  }
  document.dispatchEvent(new CustomEvent('cinetracker:data-changed',{detail:{source:'series-r513-screen',type,season,episode,watched:next}}));void special()?.loadCurrent?.(true);return true
 }catch(e){ev.is_watched=before;if(state?.data?.series)state.data.series.watched_episodes=Math.max(0,Number(state.data.series.watched_episodes||0)+(next?-1:1));render();document.documentElement.dataset.ct513SeriesWriteError=String(e?.message||e);return false}
 finally{locks.delete(key)}
}
document.addEventListener('click',e=>{
 const openEl=e.target?.closest?.('[data-ct513-open]');if(openEl){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();void open(String(openEl.dataset.ct513Open||''));return}
 const watch=e.target?.closest?.('[data-ct513-watch]');if(watch){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();void toggle(watch);return}
 if(e.target?.closest?.('[data-ct513-series-close]')){e.preventDefault();close();return}
 if(e.target?.closest?.('[data-nav]'))close();
},true);
document.addEventListener('change',e=>{const sel=e.target?.closest?.('[data-ct513-season]');if(sel){e.preventDefault();void changeSeason(Number(sel.value))}},true);
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&state){e.preventDefault();close()}},true);
const style=document.createElement('style');style.id='ct513-series-style';style.textContent=[
 'html.ct513-series-open{overflow:hidden!important}',
 '.ct513-series-screen{position:fixed;inset:0;z-index:10090;overflow:auto;background:#02090f;color:inherit;padding:18px 22px 34px}',
 '.ct513-series-page{width:min(1180px,100%);margin:0 auto;display:grid;gap:14px}',
 '.ct513-series-head{display:grid;grid-template-columns:auto minmax(0,1fr);gap:16px;align-items:start;padding:8px 0 4px}.ct513-series-head h1{font-size:30px;margin:2px 0 4px}.ct513-series-head p{margin:0;opacity:.72}.ct513-series-head>div>small{opacity:.58;font-weight:800;letter-spacing:.12em}',
 '.ct513-series-back{margin-top:3px}.ct513-series-season{padding:16px!important}',
 '.ct513-series-toolbar{display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap;margin-bottom:14px}.ct513-series-toolbar label{display:flex;align-items:center;gap:8px}.ct513-series-toolbar select{min-width:112px;border-radius:10px;padding:7px 10px;background:#0b1a27;color:inherit;border:1px solid rgba(255,255,255,.14)}',
 '.ct513-series-events{display:grid;gap:8px}.ct513-series-episode{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:14px;align-items:center;padding:12px;border:1px solid rgba(255,255,255,.1);border-radius:14px;background:rgba(255,255,255,.035)}',
 '.ct513-series-episode-copy{display:grid;gap:3px;min-width:0}.ct513-series-episode-copy small,.ct513-series-episode-copy span{opacity:.68}.ct513-series-episode-copy b{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ct513-series-watch{min-width:112px}.ct513-series-watch.on{opacity:.78}.ct513-series-loading{padding:34px;text-align:center;opacity:.7}',
 '@media(max-width:640px){.ct513-series-screen{padding:10px}.ct513-series-head{grid-template-columns:1fr}.ct513-series-back{width:max-content}.ct513-series-episode{grid-template-columns:1fr}.ct513-series-watch{width:100%}}'
].join('');
if(!q('#ct513-series-style'))document.head.appendChild(style);
window.__ctR513SeriesScreenMarker='canonical-series-screen+season-episodes+optimistic-watch';
window.__ctR513SeriesScreen={version:'0.3.40',open,close,changeSeason,get state(){return state}};
})();