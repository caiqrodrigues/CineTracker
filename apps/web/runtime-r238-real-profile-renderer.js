/* CineTracker Web 1.0.30 r238 — fix the real Profile producer, not a post-render fixture. */
(()=>{
'use strict';
window.__ctR238='real-r180-profile-renderer';
window.__ctR238Profile='physical-source-order-from-ctR180ProfileStats';

function ctR238ProfileStats(d=profileCache||{}){
  const root=$('[data-profile]');if(!root)return;
  const s=d?.stats||{},ss=d?.series_stats||{},rem=d?.remaining||{};
  const seriesWatch=Math.max(0,Number(rem.watchlist_series_remaining_minutes??rem.series_remaining_minutes??0));
  const movieWatch=Math.max(0,Number(rem.watchlist_movie_minutes??0));
  const collapsed=ctR180StatsCollapsed();
  const panel=[...root.querySelectorAll('section.panel')].find(p=>p.querySelector('.panel-head h2')?.textContent?.trim()==='Estatísticas');
  if(!panel)return;
  const cards=[
    ctR180StatCard('Episódios',Number(s.episodes_watched||0).toLocaleString('pt-BR')),
    ctR180StatCard('Filmes',Number(s.movies_watched||0).toLocaleString('pt-BR')),
    ctR180StatCard('Séries Watchlist',Number(rem.watchlist_series??ss.not_started_series??0).toLocaleString('pt-BR')),
    ctR180StatCard('Filmes Watchlist',Number(rem.watchlist_movies??ss.watchlist_movies??0).toLocaleString('pt-BR')),
    ctR180StatCard('Tempo em Séries',ct166FmtMinutes(s.series_minutes)),
    ctR180StatCard('Tempo em Filmes',ct166FmtMinutes(s.movie_minutes)),
    ctR180StatCard('Tempo de série em Watchlist',ct166FmtMinutes(seriesWatch)),
    ctR180StatCard('Tempo de filme em Watchlist',ct166FmtMinutes(movieWatch)),
    ctR180StatCard('Tempo total de tela',ct166FmtMinutes(s.total_minutes),true),
    ctR180StatCard('Tempo total em Watchlist',ct166FmtMinutes(seriesWatch+movieWatch),true)
  ].join('');
  panel.classList.add('ct-r180-stats-panel','ct-r238-profile-source');
  panel.innerHTML=`<div class="panel-head ct-r180-stats-head"><h2>Estatísticas</h2><button type="button" class="ct-r180-stats-toggle" data-ct-r180-stats-toggle aria-expanded="${collapsed?'false':'true'}"><span>${collapsed?'Expandir':'Recolher'}</span><b>${collapsed?'⌄':'⌃'}</b></button></div><div class="ct-r180-stats-body ${collapsed?'hidden':''}" data-ct-r180-stats-body><div class="stats ct-r180-stats-grid ct-r238-profile-grid">${cards}</div></div>`;
  for(const card of panel.querySelectorAll('.stat')){
    card.style.removeProperty('order');
    card.style.removeProperty('grid-column');
    card.removeAttribute('data-ct237-profile-stat');
  }
  panel.dataset.ct238ProfileOrder='episodes,movies,series-watchlist,movies-watchlist,series-time,movies-time,series-watch-time,movies-watch-time,screen-total,watch-total';
}

/* r180 is the producer used by Profile paints. Replace that producer itself. */
try{ctR180ProfileStats=ctR238ProfileStats}catch{}
/* r237 was only a post-render reorder and must no longer fight the real producer. */
try{profile237=function(){}}catch{}

const priorEnhance=typeof ctR180EnhanceProfile==='function'?ctR180EnhanceProfile:null;
if(priorEnhance){
  ctR180EnhanceProfile=function(d=profileCache||{}){ctR238ProfileStats(d);ctR180ProfileButtons()};
}

const priorRender=renderProfile;
renderProfile=async function(seq){const out=await priorRender(seq);if(seq===navSeq&&route()==='profile')ctR238ProfileStats(profileCache||{});return out};

window.__ctR238ProfileStats=ctR238ProfileStats;
})();