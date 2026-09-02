/* Android 0.99.7.37 — reliable Discover taps + compact ordered Profile stats + clean Sports watched action */
(() => {
'use strict';
if(window.__ctAndroidR209Loaded)return;
window.__ctAndroidR209Loaded=true;
window.__ctAndroidR209='discover-direct-core-tabs-profile-stat-order-sports-no-duplicate-watch';
window.__ctAndroidDiscoverTabs='core-handler-direct-render-no-pan-rail';
window.__ctAndroidProfileStats='compact-components-before-wide-totals';
window.__ctAndroidSportsWatched='single-inline-action-no-duplicate-full-width';
window.__ctAndroidScope='android-only-no-web-runtime-change';

/* The .36 Sports screen already has the original r159 watched button inside .fav-actions.
   r168 later appends a second, full-width watched button to every event card. Remove only the
   duplicate append; keep the original inline action and the modal watched toggle untouched. */
function cleanSportsWatched209(){
  if(String(location.pathname||'')!=='/sports')return;
  document.querySelectorAll('[data-sports] .event .ct168-watch-action').forEach(x=>x.remove());
}
try{
  const paintSportsBase209=paintSports;
  paintSports=function(){const out=paintSportsBase209.apply(this,arguments);requestAnimationFrame(cleanSportsWatched209);return out};
}catch{}

/* Keep the same metrics, but group components first and place the two totals immediately below
   their respective components. This also makes the mobile cards shorter without shrinking text. */
try{
  ctR180ProfileStats=function(d=profileCache||{}){
    const root=document.querySelector('[data-profile]');if(!root)return;
    const s=d?.stats||{},ss=d?.series_stats||{},rem=d?.remaining||{};
    const seriesWatch=Math.max(0,Number(rem.watchlist_series_remaining_minutes??rem.series_remaining_minutes??0));
    const movieWatch=Math.max(0,Number(rem.watchlist_movie_minutes??0));
    const collapsed=ctR180StatsCollapsed();
    const panel=[...root.querySelectorAll('section.panel')].find(p=>p.querySelector('.panel-head h2')?.textContent?.trim()==='Estatísticas');if(!panel)return;
    const cards=[
      ctR180StatCard('Episódios',Number(s.episodes_watched||0).toLocaleString('pt-BR')),
      ctR180StatCard('Filmes',Number(s.movies_watched||0).toLocaleString('pt-BR')),
      ctR180StatCard('Séries Watchlist',Number(rem.watchlist_series??ss.not_started_series??0).toLocaleString('pt-BR')),
      ctR180StatCard('Filmes Watchlist',Number(rem.watchlist_movies??ss.watchlist_movies??0).toLocaleString('pt-BR')),
      ctR180StatCard('Tempo em Séries',ct166FmtMinutes(s.series_minutes)),
      ctR180StatCard('Tempo em Filmes',ct166FmtMinutes(s.movie_minutes)),
      ctR180StatCard('Tempo total de tela',ct166FmtMinutes(s.total_minutes),true),
      ctR180StatCard('Tempo de série em Watchlist',ct166FmtMinutes(seriesWatch)),
      ctR180StatCard('Tempo de filme em Watchlist',ct166FmtMinutes(movieWatch)),
      ctR180StatCard('Tempo total em Watchlist',ct166FmtMinutes(seriesWatch+movieWatch),true)
    ].join('');
    panel.classList.add('ct-r180-stats-panel');
    panel.innerHTML=`<div class="panel-head ct-r180-stats-head"><h2>Estatísticas</h2><button type="button" class="ct-r180-stats-toggle" data-ct-r180-stats-toggle aria-expanded="${collapsed?'false':'true'}"><span>${collapsed?'Expandir':'Recolher'}</span><b>${collapsed?'⌄':'⌃'}</b></button></div><div class="ct-r180-stats-body ${collapsed?'hidden':''}" data-ct-r180-stats-body><div class="stats ct-r180-stats-grid">${cards}</div></div>`;
  };
}catch{}

const style209=document.createElement('style');
style209.id='ct-android-099737';
style209.textContent=`
/* Discover tab rail: arrows may reposition it programmatically; the finger no longer pans it.
   A normal tap is therefore emitted consistently by Android WebView. */
[data-page="discover"] [data-ct-r180-tabs]{
  overflow-x:hidden!important;
  overflow-y:hidden!important;
  touch-action:manipulation!important;
  overscroll-behavior-x:none!important;
  scroll-snap-type:none!important;
  scroll-behavior:auto!important;
  -webkit-overflow-scrolling:auto!important;
  user-select:none!important;
}
[data-page="discover"] [data-ct-r180-tabs]>.chip,
[data-page="discover"] .ct-r180-tab-arrow{
  touch-action:manipulation!important;
  pointer-events:auto!important;
  -webkit-tap-highlight-color:transparent;
}

/* Profile density/order: two compact component cards, then one wide total. */
[data-page="profile"] .ct-r180-stats-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:6px!important}
[data-page="profile"] .ct-r180-stats-grid .stat{min-height:58px!important;padding:7px 8px!important;border-radius:12px!important}
[data-page="profile"] .ct-r180-stats-grid .stat small{font-size:9px!important;line-height:1.15!important}
[data-page="profile"] .ct-r180-stats-grid .stat b{font-size:20px!important;line-height:1.05!important;margin-top:3px!important}
[data-page="profile"] .ct-r180-stats-grid .ct-r180-stat-wide{grid-column:1/-1!important;min-height:66px!important}
[data-page="profile"] .ct-r180-stats-grid .ct-r180-stat-wide b{font-size:23px!important}
[data-page="profile"] .ct-r180-stats-panel{padding:10px!important}
[data-page="profile"] .ct-r180-stats-head{margin-bottom:6px!important}

/* Sports: use only the original small watched action already inside the action row. */
[data-page="sports"] .event .ct168-watch-action{display:none!important}
[data-page="sports"] .event .fav-actions .sport-watch{width:auto!important;min-width:0!important;border-radius:999px!important;padding:5px 9px!important;font-size:8px!important;line-height:1.2!important;margin:0!important}
`;
document.head.appendChild(style209);
requestAnimationFrame(cleanSportsWatched209);
})();
