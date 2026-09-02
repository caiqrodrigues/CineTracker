/* Android 0.99.7.41 — core Discover switch + denser Profile + clean Sports profile */
(() => {
'use strict';
if(window.__ctAndroidR213Loaded)return;
window.__ctAndroidR213Loaded=true;
window.__ctAndroidR213='core-click-direct-discover-compact-profile-clean-sports-caption';
window.__ctAndroidDiscoverTabs='original-click-branch-direct-low-level-render';
window.__ctAndroidProfileStats='exact-order-extra-compact';
window.__ctAndroidProfileSports='no-explanatory-caption';
window.__ctAndroidBase='0.99.7.36-sports-approved';
window.__ctAndroidScope='android-only-no-web-change';

function route213(name){try{return String(route())===name}catch{return String(location.pathname||'')==='/'+name}}

/* ---------------- Perfil: ordem aprovada, menos altura vertical ---------------- */
function fmt213(v){return Number(v||0).toLocaleString('pt-BR')}
function seriesCount213(d,ss){
  try{const rows=typeof profileRows==='function'?profileRows(d):null;if(rows&&Array.isArray(rows.series))return rows.series.length}catch{}
  const explicit=Number(ss?.series_with_history??ss?.total_series??0);if(explicit>0)return explicit;
  return Math.max(0,Number(ss?.completed_series||0)+Number(ss?.in_progress_series||0));
}
function card213(label,value,wide=false){
  const h=wide?'44px':'38px',font=wide?'19px':'16px';
  return `<div class="stat ct213-stat ${wide?'ct213-wide':''}" style="min-width:0!important;min-height:${h}!important;height:auto!important;padding:3px 4px!important;border-radius:9px!important;display:flex!important;flex-direction:column!important;justify-content:center!important;align-items:center!important;text-align:center!important;width:auto!important;max-width:none!important"><small style="font-size:7.2px!important;line-height:1.05!important;white-space:normal!important;margin:0!important">${esc(label)}</small><b style="font-size:${font}!important;line-height:1!important;margin-top:2px!important;white-space:nowrap!important">${value}</b></div>`
}
function row213(cols,cards){return `<div class="ct213-stat-row" style="display:grid!important;grid-template-columns:repeat(${cols},minmax(0,1fr))!important;gap:4px!important;width:100%!important;max-width:100%!important;min-width:0!important">${cards.join('')}</div>`}
function profileStats213(d=profileCache||{}){
  const root=document.querySelector('[data-profile]');if(!root)return;
  const s=d?.stats||{},ss=d?.series_stats||{},rem=d?.remaining||{};
  const collapsed=typeof ctR180StatsCollapsed==='function'?ctR180StatsCollapsed():false;
  const seriesCount=seriesCount213(d,ss);
  const watchSeries=Math.max(0,Number(rem.watchlist_series??ss.not_started_series??0));
  const watchMovies=Math.max(0,Number(rem.watchlist_movies??ss.watchlist_movies??0));
  const seriesWatchMinutes=Math.max(0,Number(rem.watchlist_series_remaining_minutes??rem.series_remaining_minutes??0));
  const movieWatchMinutes=Math.max(0,Number(rem.watchlist_movie_minutes??0));
  const panel=[...root.querySelectorAll('section.panel')].find(p=>p.querySelector('.panel-head h2')?.textContent?.trim()==='Estatísticas');if(!panel)return;
  const body=[
    row213(3,[card213('Séries',fmt213(seriesCount)),card213('Episódios',fmt213(s.episodes_watched)),card213('Filmes',fmt213(s.movies_watched))]),
    row213(2,[card213('Tempo em Séries',ct166FmtMinutes(s.series_minutes)),card213('Tempo em Filmes',ct166FmtMinutes(s.movie_minutes))]),
    row213(1,[card213('Tempo total de tela',ct166FmtMinutes(s.total_minutes),true)]),
    row213(2,[card213('Séries Watchlist',fmt213(watchSeries)),card213('Filmes Watchlist',fmt213(watchMovies))]),
    row213(1,[card213('Tempo total em Watchlist',ct166FmtMinutes(seriesWatchMinutes+movieWatchMinutes),true)])
  ].join('');
  panel.classList.add('ct-r180-stats-panel','ct213-stats-panel');
  panel.style.setProperty('padding','7px','important');
  panel.innerHTML=`<div class="panel-head ct-r180-stats-head" style="margin-bottom:3px!important;min-height:28px!important"><h2>Estatísticas</h2><button type="button" class="ct-r180-stats-toggle" data-ct-r180-stats-toggle aria-expanded="${collapsed?'false':'true'}"><span>${collapsed?'Expandir':'Recolher'}</span><b>${collapsed?'⌄':'⌃'}</b></button></div><div class="ct-r180-stats-body ${collapsed?'hidden':''}" data-ct-r180-stats-body><div class="ct213-stats-layout" style="display:flex!important;flex-direction:column!important;gap:4px!important;width:100%!important;max-width:100%!important;min-width:0!important">${body}</div></div>`;
}
try{ctR180ProfileStats=profileStats213}catch{}
try{
  const paintBase213=ct168PaintProfile;
  ct168PaintProfile=function(d,note){const out=paintBase213.apply(this,arguments);requestAnimationFrame(()=>{profileStats213(d||profileCache||{});cleanProfileSports213()});return out};
}catch{}

function cleanProfileSports213(){
  if(!route213('profile'))return;
  const panel=document.querySelector('[data-profile] [data-profile-sports-panel]');if(!panel)return;
  panel.querySelector('.panel-head small')?.remove();
  panel.querySelectorAll('p').forEach(p=>p.remove());
  panel.classList.add('ct213-sports-profile');
}
try{
  const ensureSportsBase213=ct168EnsureSportsPanel;
  ct168EnsureSportsPanel=function(){const out=ensureSportsBase213.apply(this,arguments);cleanProfileSports213();return out};
}catch{}

/* ---------------- Descobrir: o clique original chama diretamente esta função ---------------- */
let ticket213=0;
const tabs213=new Set(['foryou','top10','trending','popular','new','releases','anticipated','top','calendar']);
function railLeft213(){try{return Number(document.querySelector('[data-ct-r180-tabs]')?.scrollLeft||0)}catch{return 0}}
function restoreRail213(left){requestAnimationFrame(()=>{try{const r=document.querySelector('[data-ct-r180-tabs]');if(r)r.scrollLeft=Number(left||0)}catch{}})}
function shell213(tab,left){
  const filters=tab==='foryou'?'':`<div class="filters ct-r180-type-filters">${ctR180FiltersHtml()}</div>`;
  setApp(shell('Descobrir','Recomendações, Top 10, tendências, novidades, lançamentos e calendário.','discover',`<div class="page" data-discover>${ctR180TabRail()}${filters}<div data-discover-content>${loading('Carregando títulos...')}</div></div>`));
  restoreRail213(left);
}
async function rows213(tab){
  if(tab==='foryou')return discoverRows('foryou');
  if(typeof ctR180StrictRows==='function')return ctR180StrictRows(tab);
  return discoverRows(tab);
}
async function switchTab213(tab){
  tab=String(tab||'foryou');if(!tabs213.has(tab)||!route213('discover'))return false;
  const left=railLeft213(),my=++ticket213;
  discoverState.tab=tab;if(tab==='foryou')discoverState.type='all';
  ++navSeq;
  if(tab==='top10'){
    const seq=navSeq;
    try{await ctR180RenderTop10(seq)}catch(e){if(my===ticket213){const h=document.querySelector('[data-ct171-top-content]');if(h)h.innerHTML=fail('Falha ao carregar Top 10: '+(e?.message||e),'discover')}}
    restoreRail213(left);return true;
  }
  shell213(tab,left);
  try{
    const rows=await rows213(tab);
    if(my!==ticket213||!route213('discover')||String(discoverState.tab)!==tab)return true;
    if(tab==='foryou')paintDiscover(rows||{});else ctR180RenderArray(rows||[]);
    restoreRail213(left);
  }catch(e){
    if(my!==ticket213||!route213('discover'))return true;
    const h=document.querySelector('[data-discover-content]');if(h)h.innerHTML=fail('Falha ao carregar Descobrir: '+(e?.message||e),'discover');
  }
  return true;
}
async function switchType213(type){
  if(!route213('discover')||String(discoverState.tab||'')==='foryou')return false;
  type=String(type||'all');if(!['all','movie','tv'].includes(type))type='all';
  discoverState.type=type;
  const tab=String(discoverState.tab||'popular'),my=++ticket213,left=railLeft213();++navSeq;
  shell213(tab,left);
  try{
    const rows=await rows213(tab);
    if(my!==ticket213||!route213('discover')||String(discoverState.tab)!==tab)return true;
    ctR180RenderArray(rows||[]);restoreRail213(left);
  }catch(e){if(my===ticket213){const h=document.querySelector('[data-discover-content]');if(h)h.innerHTML=fail('Falha ao carregar Descobrir: '+(e?.message||e),'discover')}}
  return true;
}
window.ct213SelectDiscoverTab=switchTab213;
window.ct213SelectDiscoverType=switchType213;

/* Keep only the original small Sports watched action; never append the later full-width duplicate. */
function cleanSports213(){if(!route213('sports'))return;document.querySelectorAll('[data-sports] .event .ct168-watch-action').forEach(x=>x.remove())}
try{const base=paintSports;paintSports=function(){const out=base.apply(this,arguments);requestAnimationFrame(cleanSports213);return out}}catch{}

const style213=document.createElement('style');style213.id='ct-android-099741';style213.textContent=`
[data-profile] .ct213-stats-panel{padding:7px!important}
[data-profile] .ct213-stat-row{gap:4px!important}
[data-profile] [data-profile-sports-panel].ct213-sports-profile{padding:7px!important}
[data-profile] [data-profile-sports-panel] .panel-head{margin-bottom:4px!important}
[data-profile] [data-profile-sports-panel] .panel-head small,
[data-profile] [data-profile-sports-panel] p{display:none!important}
[data-profile] [data-profile-sports-panel] .stats{gap:4px!important}
[data-profile] [data-profile-sports-panel] .stat{min-height:40px!important;padding:4px!important}
[data-profile] [data-profile-sports-panel] .stat small{font-size:7.5px!important;line-height:1.05!important}
[data-profile] [data-profile-sports-panel] .stat b{font-size:17px!important;line-height:1!important;margin-top:2px!important}
`;
document.head.appendChild(style213);
requestAnimationFrame(()=>{if(route213('profile')){profileStats213(profileCache||{});cleanProfileSports213()}cleanSports213()});
})();
