(() => {
'use strict';
if (window.__ct0997Targeted131cLoaded) return;
window.__ct0997Targeted131cLoaded = true;
window.__ct0997Targeted131c = 'v131c-targeted-home-profile-calendar';

const $=(s,r=document)=>r?.querySelector?.(s)||null;
const $$=(s,r=document)=>r?.querySelectorAll?[...r.querySelectorAll(s)]:[];
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const base=()=>{try{return typeof SUPABASE_URL!=='undefined'?SUPABASE_URL:window.SUPABASE_URL||''}catch{return window.SUPABASE_URL||''}};
const auth=()=>{try{return typeof authHeaders==='function'?authHeaders():{}}catch{return{}}};
const img=(p,size='w342')=>p?`${base()}/functions/v1/tmdb-image?path=${encodeURIComponent(p)}&size=${encodeURIComponent(size)}`:'';
let movieLimit=120;
let dashboardCache=null;
let dashboardBusy=null;
let calendarActive=false;
let calendarFilter='all';
let calendarData=null;
let calendarBusy=null;
let reconcileTimers=[];

const css=document.createElement('style');
css.id='ct0997-r131c-style';
css.textContent=`
.ct131c-more{min-height:202px;min-width:132px;border:1px dashed #39708c;background:#071822;border-radius:13px;color:#dff7ff;display:grid;place-items:center;text-align:center;padding:12px;cursor:pointer}.ct131c-more small{display:block;color:#7898aa;margin-top:5px}.ct131c-overlay{position:fixed;inset:0;z-index:1002200;background:#02070cf3;display:grid;place-items:center;padding:16px}.ct131c-box{width:min(1180px,96vw);max-height:92vh;overflow:auto;border:1px solid #315d76;background:#07131b;border-radius:16px;padding:16px}.ct131c-box-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:12px}.ct131c-box-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(128px,152px));gap:10px}.ct131c-close,.ct131c-cal-tab,.ct131c-cal-filter{border:1px solid #284b61;background:#0a161f;color:#d7e7f0;border-radius:999px;padding:8px 11px;cursor:pointer;font-size:10px;white-space:nowrap}.ct131c-cal-tab.active,.ct131c-cal-filter.active{background:linear-gradient(135deg,#16405d,#23668f);border-color:#58afe0;color:#fff}.ct131c-calendar-tools{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px}.ct131c-calendar{display:grid;gap:10px}.ct131c-calday{border:1px solid #1d3c4e;background:#08151d;border-radius:15px;padding:13px}.ct131c-calday h3{font-size:12px;margin:0 0 8px}.ct131c-calrow{display:grid;grid-auto-flow:column;grid-auto-columns:142px;gap:10px;overflow-x:auto;padding-bottom:7px}.ct131c-release{color:#9fe8ff!important;font-weight:800}.ct131c-count-note{color:#84a1b3;font-size:9px;margin:5px 0 0}.ct131c-home-more{display:flex;justify-content:center;margin:12px 0}.ct131c-home-more button{border:1px solid #315b75;background:#0d2230;color:#eaf7ff;border-radius:10px;padding:9px 13px;cursor:pointer}
`;
document.getElementById(css.id)?.remove();document.head.appendChild(css);

function clearStaleHomeCacheOnce(){
  const k='ct131c-home-cache-cleared-v1';
  try{
    if(localStorage.getItem(k)==='1')return;
    localStorage.removeItem('ct0994_home_preload_v1');
    for(let i=sessionStorage.length-1;i>=0;i--){const key=sessionStorage.key(i)||'';if(key.includes('cinetracker_profile_home_payload_v0994'))sessionStorage.removeItem(key)}
    localStorage.setItem(k,'1');
  }catch{}
}
clearStaleHomeCacheOnce();

async function dashboard(force=false){
  if(dashboardCache&&!force)return dashboardCache;
  if(dashboardBusy&&!force)return dashboardBusy;
  if(typeof window.sbRpc!=='function')return [];
  dashboardBusy=Promise.resolve(window.sbRpc('cinetracker_profile_media_dashboard_v0991',{})).then(v=>dashboardCache=Array.isArray(v)?v:[]).finally(()=>dashboardBusy=null);
  return dashboardBusy;
}

function fixSeriesZeroLabels(){
  const root=$('#ct994-home-root');if(!root)return;
  for(const meta of $$('.ct992-meta',root)){
    const t=String(meta.textContent||'');
    if(/\bFaltam\s+0\b/i.test(t))meta.textContent=t.replace(/\s*·\s*Faltam\s+0\b/i,' · Em dia');
  }
}

function movieRow(x,history=false){
  const p=x.poster_path||x.raw_tmdb?.poster_path||null;
  const runtime=Number(x.runtime_minutes||x.raw_tmdb?.runtime||0)||0;
  const sub=history?(x.last_watched_at?new Date(x.last_watched_at).toLocaleString('pt-BR'):'Visto'):(x.raw_tmdb?.overview||'Na sua Watchlist');
  return `<div class="ct992-row" data-ct131c-movie-open="${Number(x.media_id||0)}" data-ct131c-tmdb="${Number(x.tmdb_id||0)}"><div class="ct992-poster"${p?` style="background-image:url('${img(p)}')"`:''}></div><div class="ct992-info"><div class="ct992-title">${esc(x.title||x.raw_tmdb?.title||'Filme')}</div><div class="ct992-meta">${history?(Number(x.plays||0)>1?`x${Number(x.plays)}`:'Visto'):[x.release_year||'',runtime?`${runtime} min`:''].filter(Boolean).join(' · ')}</div><div class="ct992-sub">${esc(sub)}</div></div>${history?'<span class="ct992-badge">✓</span>':`<button class="ct992-check" type="button" data-ct131c-mark="${Number(x.media_id||0)}" title="Marcar como visto">✓</button>`}</div>`;
}
function bindMovieRows(root){
  $$('[data-ct131c-movie-open]',root).forEach(el=>el.onclick=e=>{
    if(e.target.closest('[data-ct131c-mark]'))return;
    const tmdb=Number(el.dataset.ct131cTmdb||0),id=Number(el.dataset.ct131cMovieOpen||0);
    if(tmdb>0&&typeof window.__ct0994OpenDetail==='function')return void window.__ct0994OpenDetail('movie',tmdb);
    const open=window.ct92OpenMedia||window.ct91OpenMedia;if(tmdb>0&&typeof open==='function')return void open('movie',tmdb);
    const legacy=$(`[data-ct994-open="${id}"]`);legacy?.click();
  });
  $$('[data-ct131c-mark]',root).forEach(b=>b.onclick=async e=>{
    e.preventDefault();e.stopPropagation();if(typeof window.sbRpc!=='function')return;b.disabled=true;
    try{const id=Number(b.dataset.ct131cMark),row=dashboardCache?.find(x=>Number(x.media_id)===id);await window.sbRpc('cinetracker_mark_watch_v0994',{p_media_id:id,p_item_type:'movie',p_season_number:null,p_episode_number:null,p_title:row?.title||null,p_runtime_minutes:Number(row?.runtime_minutes||0)||null,p_released_episodes:null,p_watched_at:new Date().toISOString()});dashboardCache=null;window.dispatchEvent(new CustomEvent('cinetracker:data-changed',{detail:{source:'v131c-movie-seen'}}));scheduleReconcile()}catch(err){console.error('[r131c] mark movie',err)}finally{b.disabled=false}
  });
}
async function repairMovieHome(){
  const root=$('#ct994-home-root');if(!root)return;
  const active=$('.ct992-tab.active',root);if(!active||!norm(active.textContent).includes('filmes'))return;
  const rows=await dashboard();if(!$('#ct994-home-root')||!norm($('.ct992-tab.active','#ct994-home-root')?.textContent).includes('filmes'))return;
  const watch=rows.filter(x=>x.media_type==='movie'&&x.is_watchlist&&!x.is_seen).sort((a,b)=>(Date.parse(b.last_watched_at||'')||0)-(Date.parse(a.last_watched_at||'')||0)||Number(b.media_id)-Number(a.media_id));
  const seen=rows.filter(x=>x.media_type==='movie'&&x.is_seen).sort((a,b)=>(Date.parse(b.last_watched_at||'')||0)-(Date.parse(a.last_watched_at||'')||0)).slice(0,80);
  const sections=$$('.ct992-section',root);const watchSec=sections.find(s=>norm($('h3',s)?.textContent).includes('assistir a seguir watchlist'));
  if(watchSec){const stack=$('.ct992-stack',watchSec),count=$('.ct992-count',watchSec);if(stack&&watch.length){stack.innerHTML=watch.slice(0,movieLimit).map(x=>movieRow(x,false)).join('');if(count)count.textContent=watch.length.toLocaleString('pt-BR');const old=$('.ct131c-home-more',watchSec.parentElement||root);old?.remove();if(watch.length>movieLimit){const box=document.createElement('div');box.className='ct131c-home-more';box.innerHTML=`<button type="button">Mostrar mais (${(watch.length-movieLimit).toLocaleString('pt-BR')} restantes)</button>`;box.querySelector('button').onclick=()=>{movieLimit+=120;void repairMovieHome()};watchSec.insertAdjacentElement('afterend',box)}}}
  const hist=$('.ct992-history .ct992-stack',root);if(hist&&seen.length){hist.innerHTML=seen.map(x=>movieRow(x,true)).join('')}
  bindMovieRows(root);
}

function openMore(title,nodes,kind='media'){
  document.querySelector('.ct131c-overlay')?.remove();const ov=document.createElement('div');ov.className='ct131c-overlay';ov.innerHTML=`<div class="ct131c-box"><div class="ct131c-box-head"><h2>${esc(title)}</h2><button class="ct131c-close" type="button">Fechar</button></div><div class="ct131c-box-grid"></div></div>`;const grid=$('.ct131c-box-grid',ov);for(const n of nodes){const c=n.cloneNode(true);c.hidden=false;grid.appendChild(c)}ov.onclick=e=>{if(e.target===ov||e.target.closest('.ct131c-close'))ov.remove()};grid.onclick=e=>{const local=e.target.closest('[data-ct120-open-local]');if(local){const id=Number(local.dataset.ct120OpenLocal);$(`[data-ct120-open-local="${id}"]`)?.click();ov.remove();return}const person=e.target.closest('[data-ct120-open-person]');if(person){window.__ct0994OpenPerson?.(Number(person.dataset.ct120OpenPerson));ov.remove()}};document.body.appendChild(ov)
}
function limitProfileMedia(slot,title){
  const section=$(`#ct120-profile [data-ct120-slot="${slot}"]`);if(!section)return;const row=$('.ct120-row',section);if(!row)return;const cards=[...row.children].filter(x=>x.classList?.contains('ct120-card'));if(!cards.length)return;for(const old of $$(':scope > .ct131c-more',row))old.remove();cards.forEach((c,i)=>c.hidden=i>=10);if(cards.length>10){const more=document.createElement('button');more.type='button';more.className='ct131c-more';more.innerHTML=`<span><b>Ver mais</b><small>+${cards.length-10}</small></span>`;more.onclick=()=>openMore(title,cards);row.appendChild(more)}
}
function limitProfileActors(){
  const section=$('#ct120-profile [data-ct120-slot="actors"]');if(!section)return;const row=$('.ct120-actors',section);if(!row)return;const cards=[...row.children].filter(x=>x.classList?.contains('ct120-actor'));if(!cards.length)return;row.querySelector('.ct131c-more')?.remove();cards.forEach((c,i)=>c.hidden=i>=10);if(cards.length>10){const more=document.createElement('button');more.type='button';more.className='ct131c-more';more.innerHTML=`<span><b>Ver mais</b><small>+${cards.length-10} atores</small></span>`;more.onclick=()=>openMore('Atores Favoritos',cards,'actors');row.appendChild(more)}
}
function repairProfile(){limitProfileMedia('series-favorites','Séries Favoritas');limitProfileMedia('movie-favorites','Filmes Favoritos');limitProfileActors()}

function dayKey(d){const x=new Date(d);x.setHours(12,0,0,0);return `${x.getFullYear()}-${String(x.getMonth()+1).padStart(2,'0')}-${String(x.getDate()).padStart(2,'0')}`}
function today(){return dayKey(new Date())}
function plus(days){const d=new Date();d.setHours(12,0,0,0);d.setDate(d.getDate()+days);return dayKey(d)}
function mediaType(x){return x?.media_type==='movie'?'movie':'tv'}
function effectiveId(x){return Number(x?.tmdb_id||x?.raw_tmdb?.source_tmdb_id||x?.raw_tmdb?.id||x?.id||0)||0}
function poster(x){return x?.poster_path||x?.raw_tmdb?.poster_path||null}
function title(x){return x?.title||x?.name||x?.raw_tmdb?.title||x?.raw_tmdb?.name||'Sem título'}
async function tmdb(path,params={}){const u=new URL(`${base()}/functions/v1/tmdb-proxy`);u.searchParams.set('path',path);u.searchParams.set('language',localStorage.getItem('cinetracker_locale')==='en-US'?'en-US':'pt-BR');for(const[k,v]of Object.entries(params))if(v!=null&&v!=='')u.searchParams.set(k,String(v));const ctrl=new AbortController(),timer=setTimeout(()=>ctrl.abort(),7000);try{const r=await fetch(u,{headers:auth(),signal:ctrl.signal});if(!r.ok)throw new Error(`TMDB ${r.status}`);return r.json()}finally{clearTimeout(timer)}}
async function safeTmdb(path,params={}){try{return await tmdb(path,params)}catch{return{results:[]}}}
async function tmdbPages(path,params,type,count=2){const all=await Promise.all(Array.from({length:count},(_,i)=>safeTmdb(path,{...params,page:i+1})));const seen=new Set(),out=[];for(const d of all)for(const x of d.results||[]){const id=Number(x.id);if(!id||seen.has(`${type}:${id}`)||!poster(x))continue;seen.add(`${type}:${id}`);out.push({...x,media_type:type})}return out}
function watchCalendarRows(dash){const lo=today(),hi=plus(365),out=[];for(const x of dash||[]){if(!x?.is_watchlist||x?.is_completed)continue;const type=mediaType(x),raw=x.raw_tmdb||{},id=effectiveId(x);if(!id)continue;if(type==='movie'&&!x.is_seen){const ds=String(raw.release_date||'').slice(0,10);if(ds>=lo&&ds<=hi)out.push({...raw,id,media_type:'movie',title:x.title||raw.title,poster_path:poster(x),_ctDate:ds,_ctWatch:true})}else if(type==='tv'){const ep=raw.next_episode_to_air,ds=String(ep?.air_date||'').slice(0,10);if(ds>=lo&&ds<=hi)out.push({...raw,id,media_type:'tv',name:x.title||raw.name,poster_path:poster(x),_ctDate:ds,_ctEpisode:ep,_ctWatch:true})}}return out}
async function loadCalendar(force=false){if(calendarData&&!force)return calendarData;if(calendarBusy&&!force)return calendarBusy;calendarBusy=(async()=>{const dash=await dashboard(),lo=today(),hi=plus(75);const[m,t]=await Promise.all([tmdbPages('/discover/movie',{'primary_release_date.gte':lo,'primary_release_date.lte':hi,sort_by:'primary_release_date.asc',include_adult:false},'movie',2),tmdbPages('/discover/tv',{'first_air_date.gte':lo,'first_air_date.lte':hi,sort_by:'first_air_date.asc',include_adult:false},'tv',2)]);const map=new Map();for(const x of [...m,...t,...watchCalendarRows(dash)]){const ds=String(x._ctDate||(mediaType(x)==='movie'?x.release_date:x.first_air_date)||'').slice(0,10),id=Number(x.id);if(!ds||ds<lo||!id)continue;const key=`${mediaType(x)}:${id}:${ds}`;if(!map.has(key)||x._ctWatch)map.set(key,{...x,_ctDate:ds})}calendarData={rows:[...map.values()].sort((a,b)=>a._ctDate.localeCompare(b._ctDate)),dash};return calendarData})().finally(()=>calendarBusy=null);return calendarBusy}
function calCard(x){const type=mediaType(x),id=Number(x.id),ds=x._ctDate,label=type==='movie'?'Estreia de filme':x._ctEpisode?`S${String(x._ctEpisode.season_number||0).padStart(2,'0')}E${String(x._ctEpisode.episode_number||0).padStart(2,'0')}`:'Estreia de série';return `<article class="ct131-card" data-ct131-type="${type}" data-ct131-id="${id}"><button type="button" class="ct131-open" data-ct131-open="${type}:${id}"><div class="ct131-poster"${poster(x)?` style="background-image:url('${img(poster(x),'w500')}')"`:''}></div><div class="ct131-body"><b>${esc(title(x))}</b><small>${type==='movie'?'Filme':'Série'}</small><small class="ct131c-release">${esc(label)}</small></div></button>${x._ctWatch?'<span class="ct124-badge">Watchlist</span>':'<button type="button" class="ct131-watch" data-ct131-watch>+ Watchlist</button>'}</article>`}
function renderCalendarData(data){const host=$('[data-ct131-results]',currentDiscoverHost());if(!host)return;let rows=data.rows||[];if(calendarFilter==='movie')rows=rows.filter(x=>mediaType(x)==='movie');else if(calendarFilter==='tv')rows=rows.filter(x=>mediaType(x)==='tv');else if(calendarFilter==='watchlist')rows=rows.filter(x=>x._ctWatch);const groups={};for(const x of rows)(groups[x._ctDate]||(groups[x._ctDate]=[])).push(x);host.innerHTML=`<div class="ct131c-calendar-tools">${[['all','Todos'],['movie','Filmes'],['tv','Séries'],['watchlist','Minha Watchlist']].map(([k,l])=>`<button type="button" class="ct131c-cal-filter ${calendarFilter===k?'active':''}" data-ct131c-cal-filter="${k}">${l}</button>`).join('')}</div><div class="ct131c-calendar">${Object.entries(groups).map(([d,list])=>`<section class="ct131c-calday"><h3>${new Date(d+'T12:00:00').toLocaleDateString('pt-BR',{weekday:'long',day:'2-digit',month:'long'})}</h3><div class="ct131c-calrow">${list.map(calCard).join('')}</div></section>`).join('')||'<div class="ct131-empty">Nenhum lançamento neste filtro.</div>'}</div>`}
function currentDiscoverHost(){return $('#ct120-page[data-ct120-route="discover"] #ct120-discover')}
function ensureCalendarButton(){const host=currentDiscoverHost();if(!host)return;const tabs=$('.ct131-tabs',host);if(!tabs)return;let b=$('[data-ct131c-calendar-tab]',tabs);if(!b){b=document.createElement('button');b.type='button';b.className='ct131-tab ct131c-cal-tab';b.dataset.ct131cCalendarTab='1';b.textContent='Calendário';b.onclick=async e=>{e.preventDefault();e.stopPropagation();calendarActive=true;$$('.ct131-tab',tabs).forEach(x=>x.classList.toggle('active',x===b));const out=$('[data-ct131-results]',host);if(out)out.innerHTML='<div class="ct131-loading">Carregando calendário…</div>';try{renderCalendarData(await loadCalendar())}catch(err){if(out)out.innerHTML=`<div class="ct131-error">Falha ao carregar Calendário: ${esc(err?.message||err)}</div>`}};tabs.appendChild(b)}b.classList.toggle('active',calendarActive)}
function repairDiscover(){if(!currentDiscoverHost())return;ensureCalendarButton();if(calendarActive&&calendarData)renderCalendarData(calendarData)}

function currentRoute(){const p=$('#ct120-page');if(p?.dataset?.ct120Route)return p.dataset.ct120Route;const h=norm($('.content h1')?.textContent||'');if(h.includes('perfil'))return'profile';if(h.includes('descobrir'))return'discover';if(h.includes('config'))return'settings';return'home'}
function reconcile(){const r=currentRoute();if(r==='home'){fixSeriesZeroLabels();void repairMovieHome().catch(()=>{})}else if(r==='profile')repairProfile();else if(r==='discover')repairDiscover()}
function scheduleReconcile(){for(const t of reconcileTimers)clearTimeout(t);reconcileTimers=[60,280,850].map(ms=>setTimeout(reconcile,ms))}

document.addEventListener('click',e=>{
  if(e.target.closest?.('[data-ct131-tab]'))calendarActive=false;
  const cf=e.target.closest?.('[data-ct131c-cal-filter]');if(cf){calendarFilter=cf.dataset.ct131cCalFilter;calendarActive=true;if(calendarData)renderCalendarData(calendarData)}
  if(e.target.closest?.('.sidebar,.mobile-nav,[data-ct994-tab],[data-ct120-nav],[data-view],[data-view99],[data-view991]'))scheduleReconcile();
},true);
window.addEventListener('cinetracker:data-changed',()=>{dashboardCache=null;calendarData=null;movieLimit=120;scheduleReconcile()});
window.addEventListener('load',scheduleReconcile,{once:true});
setTimeout(scheduleReconcile,120);
})();
