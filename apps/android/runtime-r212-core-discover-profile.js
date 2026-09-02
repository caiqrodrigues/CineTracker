/* Android 0.99.7.40 — direct r180 Discover renderer + explicit Profile rows */
(() => {
'use strict';
if(window.__ctAndroidR212Loaded)return;
window.__ctAndroidR212Loaded=true;
window.__ctAndroidR212='direct-r180-discover-explicit-profile-rows';
window.__ctAndroidDiscoverTabs='actual-content-switch-not-visual-only';
window.__ctAndroidProfileStats='explicit-rows-no-css-grid-dependency';
window.__ctAndroidBase='0.99.7.36-sports-approved';
window.__ctAndroidScope='android-only-no-web-change';

function route212(name){try{return String(route())===name}catch{return String(location.pathname||'')==='/'+name}}

/* ---------------- Profile: exact hierarchy, rendered as explicit rows ---------------- */
function fmt212(v){return Number(v||0).toLocaleString('pt-BR')}
function seriesCount212(d,ss){
  try{const rows=typeof profileRows==='function'?profileRows(d):null;if(rows&&Array.isArray(rows.series))return rows.series.length}catch{}
  const explicit=Number(ss?.series_with_history??ss?.total_series??0);if(explicit>0)return explicit;
  return Math.max(0,Number(ss?.completed_series||0)+Number(ss?.in_progress_series||0));
}
function card212(label,value,wide=false){
  const min=wide?'62px':'52px',font=wide?'22px':'18px';
  return `<div class="stat ct212-stat" style="min-width:0!important;min-height:${min}!important;padding:6px 5px!important;border-radius:11px!important;display:flex!important;flex-direction:column!important;justify-content:center!important;align-items:center!important;text-align:center!important;width:auto!important;max-width:none!important"><small style="font-size:8.5px!important;line-height:1.1!important;white-space:normal!important">${esc(label)}</small><b style="font-size:${font}!important;line-height:1.05!important;margin-top:3px!important;white-space:nowrap!important">${value}</b></div>`
}
function row212(cols,cards){return `<div class="ct212-stat-row" style="display:grid!important;grid-template-columns:repeat(${cols},minmax(0,1fr))!important;gap:6px!important;width:100%!important;max-width:100%!important;min-width:0!important">${cards.join('')}</div>`}
function profileStats212(d=profileCache||{}){
  const root=document.querySelector('[data-profile]');if(!root)return;
  const s=d?.stats||{},ss=d?.series_stats||{},rem=d?.remaining||{};
  const collapsed=typeof ctR180StatsCollapsed==='function'?ctR180StatsCollapsed():false;
  const seriesCount=seriesCount212(d,ss);
  const watchSeries=Math.max(0,Number(rem.watchlist_series??ss.not_started_series??0));
  const watchMovies=Math.max(0,Number(rem.watchlist_movies??ss.watchlist_movies??0));
  const seriesWatchMinutes=Math.max(0,Number(rem.watchlist_series_remaining_minutes??rem.series_remaining_minutes??0));
  const movieWatchMinutes=Math.max(0,Number(rem.watchlist_movie_minutes??0));
  const panel=[...root.querySelectorAll('section.panel')].find(p=>p.querySelector('.panel-head h2')?.textContent?.trim()==='Estatísticas');if(!panel)return;
  panel.classList.add('ct-r180-stats-panel','ct212-stats-panel');
  panel.style.setProperty('padding','9px','important');
  const body=[
    row212(3,[card212('Séries',fmt212(seriesCount)),card212('Episódios',fmt212(s.episodes_watched)),card212('Filmes',fmt212(s.movies_watched))]),
    row212(2,[card212('Tempo em Séries',ct166FmtMinutes(s.series_minutes)),card212('Tempo em Filmes',ct166FmtMinutes(s.movie_minutes))]),
    row212(1,[card212('Tempo total de tela',ct166FmtMinutes(s.total_minutes),true)]),
    row212(2,[card212('Séries Watchlist',fmt212(watchSeries)),card212('Filmes Watchlist',fmt212(watchMovies))]),
    row212(1,[card212('Tempo total em Watchlist',ct166FmtMinutes(seriesWatchMinutes+movieWatchMinutes),true)])
  ].join('');
  panel.innerHTML=`<div class="panel-head ct-r180-stats-head" style="margin-bottom:5px!important"><h2>Estatísticas</h2><button type="button" class="ct-r180-stats-toggle" data-ct-r180-stats-toggle aria-expanded="${collapsed?'false':'true'}"><span>${collapsed?'Expandir':'Recolher'}</span><b>${collapsed?'⌄':'⌃'}</b></button></div><div class="ct-r180-stats-body ${collapsed?'hidden':''}" data-ct-r180-stats-body><div class="ct212-stats-layout" style="display:flex!important;flex-direction:column!important;gap:6px!important;width:100%!important;max-width:100%!important;min-width:0!important">${body}</div></div>`;
}
try{ctR180ProfileStats=profileStats212}catch{}
try{
  const paintProfileBase212=ct168PaintProfile;
  ct168PaintProfile=function(d,note){const out=paintProfileBase212.apply(this,arguments);requestAnimationFrame(()=>profileStats212(d||profileCache||{}));return out};
}catch{}

/* ---------------- Discover: one authoritative final renderer ---------------- */
let discoverTicket212=0;
const validTabs212=new Set(['foryou','top10','trending','popular','new','releases','anticipated','top','calendar']);
function railLeft212(){try{return Number(document.querySelector('[data-ct-r180-tabs]')?.scrollLeft||0)}catch{return 0}}
function restoreRail212(left){requestAnimationFrame(()=>{try{const r=document.querySelector('[data-ct-r180-tabs]');if(r)r.scrollLeft=Number(left||0)}catch{}})}
function discoverShell212(tab,left){
  const filters=tab==='foryou'?'':`<div class="filters ct-r180-type-filters">${ctR180FiltersHtml()}</div>`;
  setApp(shell('Descobrir','Recomendações, Top 10, tendências, novidades, lançamentos e calendário.','discover',`<div class="page" data-discover>${ctR180TabRail()}${filters}<div data-discover-content>${loading('Carregando títulos...')}</div></div>`));
  restoreRail212(left);
}
async function rows212(tab){
  if(tab==='foryou')return discoverRows('foryou');
  if(typeof ctR180StrictRows==='function')return ctR180StrictRows(tab);
  return discoverRows(tab);
}
async function renderDiscover212(seq){
  const tab=String(discoverState?.tab||'foryou');
  if(!validTabs212.has(tab))discoverState.tab='foryou';
  const selected=String(discoverState.tab||'foryou'),left=railLeft212(),ticket=++discoverTicket212;
  if(selected==='foryou')discoverState.type='all';
  if(selected==='top10'){
    const p=ctR180RenderTop10(seq);restoreRail212(left);
    try{await p}catch(e){if(ticket===discoverTicket212)throw e}
    restoreRail212(left);return;
  }
  discoverShell212(selected,left);
  try{
    const rows=await rows212(selected);
    if(ticket!==discoverTicket212||seq!==navSeq||!route212('discover')||String(discoverState.tab)!==selected)return;
    if(selected==='foryou')paintDiscover(rows||{});else ctR180RenderArray(rows||[]);
    restoreRail212(left);
  }catch(e){
    if(ticket!==discoverTicket212||seq!==navSeq)return;
    const h=document.querySelector('[data-discover-content]');if(h)h.innerHTML=fail('Falha ao carregar Descobrir: '+(e?.message||e),'discover');
  }
}
try{renderDiscover=renderDiscover212}catch{}

function switchTab212(tab){
  tab=String(tab||'foryou');if(!validTabs212.has(tab)||!route212('discover'))return;
  discoverState.tab=tab;if(tab==='foryou')discoverState.type='all';
  const seq=++navSeq;void renderDiscover212(seq);
}
function switchType212(type){
  if(!route212('discover')||String(discoverState.tab||'')==='foryou')return;
  type=String(type||'all');if(!['all','movie','tv'].includes(type))type='all';
  discoverState.type=type;const seq=++navSeq;void renderDiscover212(seq);
}
window.ct212SelectDiscoverTab=switchTab212;
window.ct212SelectDiscoverType=switchType212;

/* pointerdown is the event the device already proves it delivers: use it only as a trigger,
   then replace the whole Discover content through the final renderer above. */
document.addEventListener('pointerdown',e=>{
  if(!route212('discover')||e?.isPrimary===false)return;
  const tab=e.target?.closest?.('[data-discover-tab]');
  if(tab){e.preventDefault();e.stopPropagation();try{e.stopImmediatePropagation()}catch{};switchTab212(tab.dataset.discoverTab);return}
  const type=e.target?.closest?.('[data-discover-type]');
  if(type){e.preventDefault();e.stopPropagation();try{e.stopImmediatePropagation()}catch{};switchType212(type.dataset.discoverType)}
},true);
document.addEventListener('click',e=>{
  if(!route212('discover'))return;
  const b=e.target?.closest?.('[data-discover-tab],[data-discover-type]');if(!b)return;
  e.preventDefault();e.stopPropagation();try{e.stopImmediatePropagation()}catch{}
},true);

/* Keep the .36 Sports layout and only remove the extra full-width watched action. */
function cleanSports212(){if(!route212('sports'))return;document.querySelectorAll('[data-sports] .event .ct168-watch-action').forEach(x=>x.remove())}
try{const base=paintSports;paintSports=function(){const out=base.apply(this,arguments);requestAnimationFrame(cleanSports212);return out}}catch{}
requestAnimationFrame(()=>{if(route212('profile'))profileStats212(profileCache||{});cleanSports212()});
})();
