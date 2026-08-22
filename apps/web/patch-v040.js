(() => {
'use strict';
const esc=v=>typeof escapeHtml==='function'?escapeHtml(String(v??'')):String(v??'');
const fmtBR=iso=>{if(!iso)return '';const [y,m,d]=String(iso).slice(0,10).split('-');return d&&m&&y?`${d}/${m}/${y}`:iso};
const css=document.createElement('style');css.id='ct40-style';css.textContent=`
#ct38-series-filters{display:none!important}.ct40-filter-panel{display:none;gap:7px;flex-wrap:wrap;margin:0 0 10px}.ct40-filter-panel.open{display:flex}.ct40-cal-screen{min-height:70vh}.ct40-cal-head{display:flex;align-items:center;gap:12px;margin-bottom:18px}.ct40-back{width:42px;height:42px;border:1px solid #273746;border-radius:12px;background:#0d1218;color:#eef6ff;font-size:24px}.ct40-cal-head h1{margin:0;font-size:25px}.ct40-day{margin:18px 0}.ct40-day-title{font-size:15px;font-weight:700;color:#7dbbff;margin-bottom:8px}.ct40-day-list{display:grid;gap:8px}.ct40-event{display:grid;grid-template-columns:62px minmax(0,1fr);gap:10px;border:1px solid #203245;border-radius:13px;background:#101820;padding:8px}.ct40-event-poster{width:62px;height:92px;border-radius:9px;background:#0b1520 center/cover no-repeat}.ct40-event-title{font-size:14px;font-weight:700}.ct40-event-sub{font-size:11px;color:#9eabb7;margin-top:5px}.ct40-loading{padding:18px;border:1px solid #203245;border-radius:12px;color:#9eabb7}.ct40-actions{display:flex;gap:8px}
`;
document.head.appendChild(css);
function activeKind(){return document.querySelector('.ct38-kind.active')?.dataset.kind||'series'}
function filterIcon(){return `<svg viewBox="0 0 24 24"><path d="M4 6h16M7 12h10M10 18h4" stroke="currentColor" fill="none" stroke-width="1.8" stroke-linecap="round"/></svg>`}
function calendarIcon(){return `<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" fill="none" stroke-width="1.8"/><path d="M16 3v4M8 3v4M3 10h18" stroke="currentColor" fill="none" stroke-width="1.8"/></svg>`}
function enhanceAssist(){
 const head=document.querySelector('.ct38-head'); if(!head)return;
 const actions=head.querySelector('.ct38-actions'); if(!actions)return;
 if(!document.getElementById('ct40-filter')){const b=document.createElement('button');b.id='ct40-filter';b.className='ct38-icon';b.title='Filtros';b.innerHTML=filterIcon();actions.insertBefore(b,actions.firstChild);b.onclick=()=>document.getElementById('ct40-filter-panel')?.classList.toggle('open')}
 let panel=document.getElementById('ct40-filter-panel');if(!panel){panel=document.createElement('div');panel.id='ct40-filter-panel';panel.className='ct40-filter-panel';const original=document.getElementById('ct38-series-filters');if(original){panel.innerHTML=original.innerHTML;original.insertAdjacentElement('afterend',panel);panel.querySelectorAll('[data-f]').forEach(btn=>btn.onclick=()=>{document.querySelectorAll('#ct40-filter-panel [data-f]').forEach(x=>x.classList.toggle('active',x===btn));const orig=[...document.querySelectorAll('#ct38-series-filters [data-f]')].find(x=>x.dataset.f===btn.dataset.f);orig?.click();panel.classList.remove('open')})}}
 const cal=document.getElementById('ct38-cal');if(cal&&!cal.dataset.ct40){cal.dataset.ct40='1';cal.innerHTML=calendarIcon();cal.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();openCalendar(activeKind())},true)}
}
async function movieWatchlist(){const overrides=await sbApi('media_overrides?select=state,media_id,updated_at,media:media(id,tmdb_id,media_type,title,poster_path,release_year,raw_tmdb)&state=in.(AddedToWatchlist,WatchLater)&order=updated_at.desc&limit=1000');const seenRows=await sbApi('media_overrides?select=media_id,state&state=in.(AlreadySeen,Completed)&limit=1000');const seen=new Set((seenRows||[]).map(x=>x.media_id));return (overrides||[]).filter(x=>x.media?.media_type==='movie'&&!seen.has(x.media_id)).map(x=>x.media)}
async function tmdb(type,id){const u=new URL(`${SUPABASE_URL}/functions/v1/tmdb-proxy`);u.searchParams.set('path',`/${type}/${id}`);u.searchParams.set('language','pt-BR');const r=await fetch(u,{headers:authHeaders()});return r.ok?await r.json():null}
function posterUrl(p){return p?`${SUPABASE_URL}/functions/v1/tmdb-image?path=${encodeURIComponent(p)}&size=w185`:''}
async function calendarEvents(kind){const today=new Date().toISOString().slice(0,10),out=[];
 if(kind==='movies'){
  const movies=await movieWatchlist();for(const m of movies.slice(0,80)){let d=m.raw_tmdb||null;if(!d?.release_date)d=await tmdb('movie',m.tmdb_id);const date=d?.release_date;if(date&&date>=today)out.push({date,title:d.title||m.title,sub:'Estreia',poster:d.poster_path||m.poster_path})}
 }else{
  const rows=await sbRpc('cinetracker_continue_items',{});for(const m of (rows||[]).filter(x=>x.status==='following'||x.status==='up_to_date'||x.status==='not_started').slice(0,60)){const d=await tmdb('tv',m.tmdb_id);const ep=d?.next_episode_to_air;if(ep?.air_date&&ep.air_date>=today)out.push({date:ep.air_date,title:d.name||m.title,sub:`${ep.name||'Próximo episódio'}${ep.season_number?` · T${ep.season_number}E${ep.episode_number}`:''}`,poster:d.poster_path||m.poster_path})}
 }
 return out.sort((a,b)=>a.date.localeCompare(b.date));
}
async function openCalendar(kind){
 const target=document.querySelector('.content')||document.getElementById('app');if(!target)return;window.__ct40CalendarKind=kind;target.innerHTML=`<div class="ct40-cal-screen"><div class="ct40-cal-head"><button class="ct40-back" id="ct40-back">←</button><h1>${kind==='movies'?'Lançamentos de filmes':'Próximos episódios'}</h1></div><div id="ct40-cal-body" class="ct40-loading">Carregando calendário…</div></div>`;document.getElementById('ct40-back').onclick=()=>{view='library';render();setTimeout(enhanceAssist,0)};
 const body=document.getElementById('ct40-cal-body');try{const ev=await calendarEvents(kind);if(!ev.length){body.className='ct40-loading';body.textContent='Nenhum lançamento futuro encontrado.';return}const groups={};ev.forEach(x=>(groups[x.date]??=[]).push(x));body.className='';body.innerHTML=Object.keys(groups).sort().map(date=>`<section class="ct40-day"><div class="ct40-day-title">${fmtBR(date)}</div><div class="ct40-day-list">${groups[date].map(x=>`<article class="ct40-event"><div class="ct40-event-poster"${x.poster?` style="background-image:url('${posterUrl(x.poster)}')"`:''}></div><div><div class="ct40-event-title">${esc(x.title)}</div><div class="ct40-event-sub">${esc(x.sub)}</div></div></article>`).join('')}</div></section>`).join('')}catch(e){body.className='ct40-loading';body.textContent='Falha ao carregar calendário.'}}
}
// Settings repair for Android/native click: create a reliable target that uses the existing account/settings view.
function ensureSettingsTarget(){if(document.getElementById('ct40-settings-target'))return;const b=document.createElement('button');b.id='ct40-settings-target';b.textContent='Configurações';b.style.display='none';b.onclick=()=>{for(const candidate of ['settings','account']){try{view=candidate;render();if(document.body.textContent.toLowerCase().includes('importar')||document.body.textContent.toLowerCase().includes('segurança'))return}catch{}}};document.body.appendChild(b)}
const obs=new MutationObserver(()=>{enhanceAssist();ensureSettingsTarget()});obs.observe(document.documentElement,{childList:true,subtree:true});setTimeout(()=>{enhanceAssist();ensureSettingsTarget()},0);
})();
