/* Android 0.99.7.38 — deterministic in-place Discover tabs + exact compact Profile hierarchy */
(() => {
'use strict';
if(window.__ctAndroidR210Loaded)return;
window.__ctAndroidR210Loaded=true;
window.__ctAndroidR210='discover-in-place-pointerdown-profile-exact-hierarchy';
window.__ctAndroidDiscoverTabs='direct-button-pointerdown-in-place-stale-request-guard';
window.__ctAndroidProfileStats='series-episodes-movies-then-times-then-watchlist-total';
window.__ctAndroidScope='android-only-no-web-runtime-change';

function route210(name){try{return String(route())===name}catch{return String(location.pathname||'')==='/'+name}}

/* ----- Profile: exact hierarchy requested on-device ----- */
function stat210(label,value,cls){return `<div class="stat ${cls||''}"><small>${esc(label)}</small><b>${value}</b></div>`}
function seriesCount210(d,ss){
  try{
    const dash=Array.isArray(d?.dashboard)?d.dashboard:[];
    if(dash.length)return profileRows(d).series.length;
  }catch{}
  const explicit=Number(ss?.series_with_history??ss?.total_series??0);
  if(explicit>0)return explicit;
  return Math.max(0,Number(ss?.completed_series||0)+Number(ss?.in_progress_series||0));
}
try{
  ctR180ProfileStats=function(d=profileCache||{}){
    const root=document.querySelector('[data-profile]');if(!root)return;
    const s=d?.stats||{},ss=d?.series_stats||{},rem=d?.remaining||{};
    const collapsed=ctR180StatsCollapsed();
    const seriesWatchMinutes=Math.max(0,Number(rem.watchlist_series_remaining_minutes??rem.series_remaining_minutes??0));
    const movieWatchMinutes=Math.max(0,Number(rem.watchlist_movie_minutes??0));
    const seriesCount=seriesCount210(d,ss);
    const watchSeries=Math.max(0,Number(rem.watchlist_series??ss.not_started_series??0));
    const watchMovies=Math.max(0,Number(rem.watchlist_movies??ss.watchlist_movies??0));
    const panel=[...root.querySelectorAll('section.panel')].find(p=>p.querySelector('.panel-head h2')?.textContent?.trim()==='Estatísticas');if(!panel)return;
    const cards=[
      stat210('Séries',seriesCount.toLocaleString('pt-BR'),'ct210-third'),
      stat210('Episódios',Number(s.episodes_watched||0).toLocaleString('pt-BR'),'ct210-third'),
      stat210('Filmes',Number(s.movies_watched||0).toLocaleString('pt-BR'),'ct210-third'),
      stat210('Tempo em Séries',ct166FmtMinutes(s.series_minutes),'ct210-half'),
      stat210('Tempo em Filmes',ct166FmtMinutes(s.movie_minutes),'ct210-half'),
      stat210('Tempo total de tela',ct166FmtMinutes(s.total_minutes),'ct210-wide'),
      stat210('Séries Watchlist',watchSeries.toLocaleString('pt-BR'),'ct210-half'),
      stat210('Filmes Watchlist',watchMovies.toLocaleString('pt-BR'),'ct210-half'),
      stat210('Tempo total em Watchlist',ct166FmtMinutes(seriesWatchMinutes+movieWatchMinutes),'ct210-wide')
    ].join('');
    panel.classList.add('ct-r180-stats-panel','ct210-stats-panel');
    panel.innerHTML=`<div class="panel-head ct-r180-stats-head"><h2>Estatísticas</h2><button type="button" class="ct-r180-stats-toggle" data-ct-r180-stats-toggle aria-expanded="${collapsed?'false':'true'}"><span>${collapsed?'Expandir':'Recolher'}</span><b>${collapsed?'⌄':'⌃'}</b></button></div><div class="ct-r180-stats-body ${collapsed?'hidden':''}" data-ct-r180-stats-body><div class="stats ct-r180-stats-grid ct210-stats-grid">${cards}</div></div>`;
  };
}catch{}

/* ----- Discover: do not rebuild the whole page for normal tab switches ----- */
let switchToken210=0;
let actionStamp210=0;
const tabs210=new Set(['foryou','top10','trending','popular','new','releases','anticipated','top','calendar']);

function markActive210(){
  document.querySelectorAll('[data-page="discover"] [data-discover-tab]').forEach(b=>b.classList.toggle('active',String(b.dataset.discoverTab||'')===String(discoverState.tab||'foryou')));
  document.querySelectorAll('[data-page="discover"] [data-discover-type]').forEach(b=>b.classList.toggle('active',String(b.dataset.discoverType||'')===String(discoverState.type||'all')));
}
function ensureFilters210(){
  const root=document.querySelector('[data-page="discover"]');if(!root)return;
  let filters=root.querySelector('.ct-r180-type-filters,.filters');
  if(String(discoverState.tab||'foryou')==='foryou'){
    discoverState.type='all';filters?.remove();return;
  }
  if(!filters){
    filters=document.createElement('div');filters.className='filters ct-r180-type-filters';
    const shell=root.querySelector('.ct-r180-tab-shell');
    if(shell)shell.insertAdjacentElement('afterend',filters);else root.prepend(filters);
  }
  filters.innerHTML=ctR180FiltersHtml();
}
function failDiscover210(error){
  const box=document.querySelector('[data-discover-content]');
  if(box)box.innerHTML=fail('Falha ao carregar Descobrir: '+(error?.message||error),'discover');
}
async function selectTab210(tab){
  tab=String(tab||'foryou');if(!tabs210.has(tab)||!route210('discover'))return false;
  const previous=String(discoverState.tab||'foryou');
  discoverState.tab=tab;if(tab==='foryou')discoverState.type='all';
  const seq=++navSeq,my=++switchToken210;
  markActive210();

  /* Top 10 owns a different shell; entering/leaving it needs the normal full renderer. */
  if(tab==='top10'||previous==='top10'||!document.querySelector('[data-discover-content]')){
    try{await renderDiscover(seq)}catch(e){if(my===switchToken210)failDiscover210(e)}
    bindDiscover210();return true;
  }

  ensureFilters210();markActive210();bindDiscover210();
  const content=document.querySelector('[data-discover-content]');
  if(content)content.innerHTML=loading('Carregando títulos...');
  try{
    const rows=await discoverRows(tab);
    if(my!==switchToken210||seq!==navSeq||!route210('discover')||String(discoverState.tab)!==tab)return true;
    paintDiscover(rows);ensureFilters210();markActive210();bindDiscover210();
  }catch(e){if(my===switchToken210&&seq===navSeq)failDiscover210(e)}
  return true;
}
async function selectType210(type){
  if(!route210('discover'))return false;
  if(String(discoverState.tab||'')==='foryou'){discoverState.type='all';ensureFilters210();return true}
  type=String(type||'all');if(!['all','movie','tv'].includes(type))type='all';
  discoverState.type=type;markActive210();
  const seq=++navSeq,my=++switchToken210;
  try{
    const rows=await discoverRows(String(discoverState.tab||'foryou'));
    if(my!==switchToken210||seq!==navSeq||!route210('discover'))return true;
    paintDiscover(rows);markActive210();bindDiscover210();
  }catch(e){if(my===switchToken210&&seq===navSeq)failDiscover210(e)}
  return true;
}
window.ct210SelectDiscoverTab=selectTab210;
window.ct210SelectDiscoverType=selectType210;

function ownControl210(btn,kind){
  if(!btn||btn.dataset.ct210Bound==='1')return;
  btn.dataset.ct210Bound='1';
  const run=e=>{
    if(e?.isPrimary===false)return;
    if(e){e.preventDefault();e.stopPropagation();try{e.stopImmediatePropagation()}catch{}}
    actionStamp210=Date.now();
    if(kind==='tab')void selectTab210(btn.dataset.discoverTab);
    else void selectType210(btn.dataset.discoverType);
  };
  btn.addEventListener('pointerdown',run,{capture:true,passive:false});
  btn.addEventListener('click',e=>{
    e.preventDefault();e.stopPropagation();try{e.stopImmediatePropagation()}catch{}
    if(Date.now()-actionStamp210<700)return;
    if(kind==='tab')void selectTab210(btn.dataset.discoverTab);else void selectType210(btn.dataset.discoverType);
  },true);
}
function bindDiscover210(){
  if(!route210('discover'))return;
  document.querySelectorAll('[data-page="discover"] [data-discover-tab]').forEach(b=>ownControl210(b,'tab'));
  document.querySelectorAll('[data-page="discover"] [data-discover-type]').forEach(b=>ownControl210(b,'type'));
}
try{
  const renderDiscoverBase210=renderDiscover;
  renderDiscover=async function(seq){
    const p=renderDiscoverBase210.apply(this,arguments);requestAnimationFrame(()=>{ensureFilters210();markActive210();bindDiscover210()});
    try{const out=await p;ensureFilters210();markActive210();bindDiscover210();return out}catch(e){bindDiscover210();throw e}
  };
}catch{}

const style210=document.createElement('style');style210.id='ct-android-099738';style210.textContent=`
/* Discover controls: fixed rail, no finger pan; cards keep the approved 3-per-screen swipe. */
[data-page="discover"] [data-ct-r180-tabs]{overflow-x:hidden!important;touch-action:manipulation!important;scroll-behavior:auto!important;scroll-snap-type:none!important}
[data-page="discover"] [data-discover-tab]{touch-action:manipulation!important;pointer-events:auto!important;min-height:38px!important}

/* Profile hierarchy: 3 compact counts, 2 compact times, wide total, 2 compact Watchlist counts, wide Watchlist total. */
[data-page="profile"] .ct210-stats-grid{display:grid!important;grid-template-columns:repeat(6,minmax(0,1fr))!important;gap:6px!important}
[data-page="profile"] .ct210-stats-grid .stat{min-width:0!important;min-height:52px!important;padding:6px 5px!important;border-radius:11px!important}
[data-page="profile"] .ct210-stats-grid .stat small{font-size:8px!important;line-height:1.1!important;white-space:normal!important}
[data-page="profile"] .ct210-stats-grid .stat b{font-size:18px!important;line-height:1.05!important;margin-top:3px!important;white-space:nowrap!important}
[data-page="profile"] .ct210-stats-grid .ct210-third{grid-column:span 2!important}
[data-page="profile"] .ct210-stats-grid .ct210-half{grid-column:span 3!important;min-height:55px!important}
[data-page="profile"] .ct210-stats-grid .ct210-wide{grid-column:1/-1!important;min-height:61px!important}
[data-page="profile"] .ct210-stats-grid .ct210-wide b{font-size:22px!important}
[data-page="profile"] .ct210-stats-panel{padding:9px!important}
[data-page="profile"] .ct210-stats-panel .ct-r180-stats-head{margin-bottom:5px!important}
`;
document.head.appendChild(style210);

requestAnimationFrame(()=>{try{if(route210('profile'))ctR180ProfileStats(profileCache||{})}catch{};bindDiscover210()});
})();
