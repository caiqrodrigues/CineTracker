/* CineTracker r519 — single full-screen owner for F1 + WWE Pay-Per-View. */
(()=>{
'use strict';
if(window.__ctR513SeriesScreen?.version==='0.3.46')return;
const core=()=>window.__ctCoreR471||null,q=(s,r=document)=>r?.querySelector?.(s)||null,rows=v=>Array.isArray(v)?v:[],esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])),rpc=(name,args={})=>core()?.rpc?.(name,args),special=()=>window.__ctR512Special||null,currentYear=()=>new Date().getFullYear();
let state=null,loadToken=0;const locks=new Set();
function fmtDate(v){if(!v)return'';try{return new Intl.DateTimeFormat('pt-BR',{day:'2-digit',month:'2-digit',year:'numeric',timeZone:'America/Sao_Paulo'}).format(new Date(v))}catch{return String(v)}}
function f1Kind(v){const k=String(v||'').toLowerCase();if(k==='race')return'Corrida';if(k==='sprint')return'Sprint';if(k.includes('qual'))return'Classificação';if(k.includes('practice')||k.includes('fp'))return'Treino Livre';return String(v||'Sessão')}
function eventHtml(type,x){
 const watched=!!x?.is_watched,released=x?.released!==false&&(!x?.starts_at||Date.parse(x.starts_at)<=Date.now()+60000),season=Number(x?.season||state?.season||currentYear()),episode=Number(x?.episode_number||0),round=Number(x?.round||0);
 const label=type==='f1'?(x?.source==='historical'?('T'+season+' · GP '+String(round).padStart(2,'0')):('T'+season+' E'+String(episode).padStart(3,'0')+' · '+f1Kind(x?.session_kind))):('T'+season+' · PPV / PLE');
 return '<article class="ct513-series-episode '+(watched?'watched':'')+'" data-ct513-episode><div class="ct513-series-episode-copy"><small>'+esc(label)+' · '+esc(fmtDate(x?.starts_at))+'</small><b>'+esc(x?.title||(type==='f1'?'Fórmula 1':'WWE Pay-Per-View'))+'</b><span>'+Number(x?.runtime_minutes||0)+' min</span></div><button type="button" class="chip ct513-series-watch '+(watched?'on':'')+'" data-ct513-watch="'+type+'" data-season="'+season+'" data-episode="'+episode+'" data-round="'+round+'" data-legacy-media-id="'+Number(x?.legacy_media_id||0)+'" data-watched="'+(watched?'1':'0')+'" '+(released?'':'disabled')+'>'+(watched?'↶ Desmarcar':released?'✓ Assistido':'Em breve')+'</button></article>'
}
function render(){
 if(!state)return false;
 let root=q('[data-ct513-series-screen]');if(!root){root=document.createElement('div');root.dataset.ct513SeriesScreen='1';root.className='ct513-series-screen';document.body.appendChild(root)}
 const type=state.type,title=type==='f1'?'Fórmula 1':'WWE Pay-Per-View',data=state.data||{},s=data.series||{},events=rows(data.events),seasons=rows(data.seasons),watched=Number(s.watched_episodes??events.filter(x=>x.is_watched).length),total=Number(s.total_episodes??events.length),loading=state.loading,g=window.__ctR516SpecialSummary?.get?.(type)||null,globalWatched=Math.max(watched,Number(g?.watched||0)),unit=type==='f1'?'sessões':'eventos',participle=type==='f1'?'assistidas':'assistidos',subtitle=type==='f1'?'Temporadas desde 1950 · treinos, classificação, sprint e corrida':'Temporadas desde 1985 · PPVs / Premium Live Events',progress=g&&globalWatched>0?('Série inteira: '+globalWatched.toLocaleString('pt-BR')+' '+unit+' '+participle+' · T'+Number(state.season)+': '+watched.toLocaleString('pt-BR')+' / '+total.toLocaleString('pt-BR')+' '+unit):('T'+Number(state.season)+': '+watched.toLocaleString('pt-BR')+' / '+total.toLocaleString('pt-BR')+' '+unit);
 root.innerHTML='<button type="button" class="btn ct513-series-back ct515-series-back" data-ct513-series-close aria-label="Voltar para Home">← Voltar para Home</button><main class="ct513-series-page"><header class="ct513-series-head"><div><small>SÉRIE</small><h1>'+title+'</h1><p>'+subtitle+'</p></div></header><section class="panel ct513-series-season"><div class="ct513-series-toolbar"><label>Temporada <select data-ct513-season '+(loading?'disabled':'')+'>'+seasons.map(y=>'<option value="'+Number(y)+'"'+(Number(y)===Number(state.season)?' selected':'')+'>'+Number(y)+'</option>').join('')+'</select></label><strong class="ct517-series-progress ct519-series-progress">'+progress+'</strong></div><div class="ct513-series-events">'+(loading?'<div class="ct513-series-loading">Carregando temporada '+Number(state.season)+'…</div>':events.length?events.map(x=>eventHtml(type,x)).join(''):'<div class="empty">Nenhum episódio/evento encontrado nesta temporada.</div>')+'</div></section></main>';
 document.documentElement.classList.add('ct513-series-open');return true
}
async function open(type,season=currentYear(),returnState=null){
 const api=special();if(!api?.loadSeason)return false;
 const previous=returnState||state?.returnState||{tab:String(q('[data-home-tab].active')?.dataset?.homeTab||'series'),scrollY:Number(window.scrollY||0),focus:document.activeElement};
 const token=++loadToken;state={type:type==='wwe'?'wwe':'f1',season:Number(season)||currentYear(),data:null,loading:true,returnState:previous};render();
 try{const data=await api.loadSeason(state.type,state.season);if(!state||token!==loadToken)return false;state.data=data||{};state.loading=false;render();return true}
 catch(e){if(state&&token===loadToken){state.loading=false;state.data={series:{season:state.season},events:[],seasons:[]};render();const box=q('.ct513-series-events');if(box)box.innerHTML='<div class="error">Não foi possível carregar esta temporada.</div>';document.documentElement.dataset.ct519SeriesError=String(e?.message||e)}return false}
}
async function changeSeason(season){if(!state)return false;return open(state.type,Number(season),state.returnState)}
function close(){
 const back=state?.returnState||null;state=null;loadToken++;q('[data-ct513-series-screen]')?.remove();document.documentElement.classList.remove('ct513-series-open');
 const tab=back?.tab==='movies'?'movies':'series';
 try{window.__ctR504UserTab=tab;window.__ctR502UserTab=tab;document.documentElement.dataset.ct504HomeKind=tab;document.documentElement.dataset.ct502HomeKind=tab;document.documentElement.dataset.ct495HomeKind=tab;window.__ctR371?.applyTab?.(tab)}catch{}
 requestAnimationFrame(()=>{try{window.__ctR512Special?.mountAll?.()}catch{};try{if(Number.isFinite(back?.scrollY))window.scrollTo({top:back.scrollY,left:0,behavior:'auto'})}catch{};try{back?.focus?.focus?.({preventScroll:true})}catch{}});
 return true
}
async function toggle(btn){
 if(!state||!btn)return false;
 const type=String(btn.dataset.ct513Watch||''),season=Number(btn.dataset.season||0),episode=Number(btn.dataset.episode||0),round=Number(btn.dataset.round||0),key=type+':'+season+':'+episode;
 if(!season||!episode||locks.has(key))return false;
 const ev=rows(state.data?.events).find(x=>Number(x.season||state.season)===season&&Number(x.episode_number)===episode);if(!ev)return false;
 const before=!!ev.is_watched,next=!before;locks.add(key);ev.is_watched=next;if(state.data?.series)state.data.series.watched_episodes=Math.max(0,Number(state.data.series.watched_episodes||0)+(next?1:-1));render();
 try{
  if(type==='f1'){
   if(ev.source==='historical')await rpc('cinetracker_f1_historical_watch_v512',{p_season:season,p_round:round,p_title:ev.title,p_runtime_minutes:Number(ev.runtime_minutes||120),p_watched:next,p_watched_at:new Date().toISOString()});
   else await rpc('cinetracker_f1_watch_sync_v462',{p_season:season,p_episode:episode,p_watched:next,p_watched_at:new Date().toISOString(),p_event_id:Number(ev.event_id||0)||null,p_attended_in_person:false,p_stadium_name:null,p_source:'series-r519-screen'});
   window.dispatchEvent(new CustomEvent('cinetracker:f1-watched-changed',{detail:{source:'series-r519-screen',season,episode,watched:next}}))
  }else{
   await rpc('cinetracker_wwe_ppv_watch_v519',{p_season:season,p_episode:episode,p_title:ev.title,p_runtime_minutes:Number(ev.runtime_minutes||180),p_legacy_media_id:Number(ev.legacy_media_id||0)||null,p_watched:next,p_watched_at:new Date().toISOString()});
   window.dispatchEvent(new CustomEvent('cinetracker:wwe-ppv-watched-changed',{detail:{source:'series-r519-screen',season,episode,watched:next}}))
  }
  document.dispatchEvent(new CustomEvent('cinetracker:data-changed',{detail:{source:'series-r519-screen',type,season,episode,watched:next}}));void special()?.loadCurrent?.(true);return true
 }catch(e){ev.is_watched=before;if(state?.data?.series)state.data.series.watched_episodes=Math.max(0,Number(state.data.series.watched_episodes||0)+(next?-1:1));render();document.documentElement.dataset.ct519SeriesWriteError=String(e?.message||e);return false}
 finally{locks.delete(key)}
}
document.addEventListener('click',e=>{
 const closeEl=e.target?.closest?.('[data-ct513-series-close]');if(closeEl){e.preventDefault();e.stopImmediatePropagation();close();return}
 const watch=e.target?.closest?.('[data-ct513-watch]');if(watch){e.preventDefault();e.stopImmediatePropagation();void toggle(watch);return}
 const openEl=e.target?.closest?.('[data-ct513-open]');if(openEl){e.preventDefault();e.stopImmediatePropagation();void open(String(openEl.dataset.ct513Open||''));return}
},true);
document.addEventListener('change',e=>{const s=e.target?.closest?.('[data-ct513-season]');if(s)void changeSeason(Number(s.value))},true);
document.addEventListener('keydown',e=>{const openEl=e.target?.closest?.('[data-ct513-open]');if(openEl&&(e.key==='Enter'||e.key===' ')){e.preventDefault();void open(String(openEl.dataset.ct513Open||''))}if(e.key==='Escape'&&state)close()},true);
window.__ctR513SeriesScreenMarker='canonical-series-screen+season-episodes+optimistic-watch';
window.__ctR513SeriesScreen={version:'0.3.46',open,close,changeSeason,rerender:render,get state(){return state}};
})();