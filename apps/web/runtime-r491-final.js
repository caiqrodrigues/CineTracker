/* CineTracker Web 0.3.18 r491 — requested screens owned at the real render boundary. */
(()=>{
'use strict';
if(window.__ctR491?.version==='0.3.18')return;
const q=(s,r=document)=>r?.querySelector?.(s)||null;
window.addEventListener('click',e=>{
 const b=e.target?.closest?.('[data-ct491-foryou-retry]');if(!b)return;
 e.preventDefault();delete document.documentElement.dataset.ct491ForYouReady;try{void window.__ctR464?.load?.(false)}catch{}
},true);
const style=document.createElement('style');style.id='ct491-style';style.textContent=[
 '@keyframes ct491Pulse{0%,100%{opacity:.45}50%{opacity:1}}',
 '.ct491-home-skeleton{display:grid!important;gap:10px!important;padding:4px 0 10px!important;animation:ct491Pulse 1.1s ease-in-out infinite!important}.ct491-sk-row{display:grid!important;grid-template-columns:48px minmax(0,1fr)!important;gap:12px!important;align-items:center!important;padding:10px!important;border:1px solid rgba(255,255,255,.09)!important;border-radius:14px!important;background:rgba(255,255,255,.035)!important}.ct491-sk-row>i{width:48px!important;height:64px!important;border-radius:8px!important;background:rgba(255,255,255,.11)!important}.ct491-sk-row>span{display:grid!important;gap:8px!important}.ct491-sk-row b,.ct491-sk-row small{display:block!important;height:12px!important;border-radius:6px!important;background:rgba(255,255,255,.10)!important}.ct491-sk-row b{width:68%!important}.ct491-sk-row small{width:42%!important;height:9px!important}',
 'html body [data-home-view="series"]:not(.hidden){visibility:visible!important;opacity:1!important}',
 'html body [data-home-view="movies"] .ct388-movie-stack.ct489-movie-grid{display:grid!important;grid-template-columns:repeat(auto-fill,minmax(132px,150px))!important;grid-auto-flow:row!important;gap:14px!important;align-items:start!important;width:100%!important;overflow:visible!important}',
 'html body [data-home-view="movies"] .ct489-movie-card{display:block!important;width:150px!important;min-width:132px!important;max-width:150px!important;height:auto!important;min-height:0!important}.ct489-movie-card .poster{display:block!important;width:100%!important;height:auto!important;aspect-ratio:2/3!important;background-size:cover!important;background-position:center!important}.ct489-movie-card .card-body b{display:block!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}',
 'html body [data-profile] .ct491-profile-grid{display:grid!important;grid-template-columns:repeat(auto-fill,minmax(132px,150px))!important;grid-auto-flow:row!important;gap:12px!important;overflow:visible!important;width:100%!important;padding-bottom:0!important}.ct491-profile-grid>.card{display:block!important;width:150px!important;min-width:132px!important;max-width:150px!important}.ct491-profile-grid .poster{aspect-ratio:2/3!important;height:auto!important;background-size:cover!important;background-position:center!important}.ct491-profile-grid .card-body b{display:block!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}.ct491-profile-grid>.card:nth-child(n+13){display:none!important}',
 '[data-profile] .ct471-more-card,[data-profile] .ct472-more-card,[data-profile] .ct482-profile-more,[data-profile] [data-ct471-more],[data-profile] [data-ct472-more]{display:none!important}.ct491-profile-more{margin-left:auto!important;min-height:28px!important;height:28px!important;padding:4px 9px!important;font-size:11px!important;line-height:1!important}',
 'html body [data-ct321-top-content] .ct319-top-row{align-items:start!important;grid-auto-rows:auto!important;height:auto!important}.ct319-top-row>.ct319-item,.ct319-top-row>.ct319-item>.ct288-card,.ct319-top-row>.ct319-item .ct288-open{height:auto!important;min-height:0!important;max-height:none!important;min-width:0!important}.ct319-top-row .ct288-poster{display:block!important;width:100%!important;height:auto!important;min-height:0!important;max-height:none!important;aspect-ratio:2/3!important;object-fit:cover!important;overflow:hidden!important;background-size:cover!important;background-position:center!important}',
 'html body [data-ct464-foryou] .ct288-poster,html body [data-ct464-foryou] .poster{aspect-ratio:2/3!important;object-fit:cover!important;background-size:cover!important;background-position:center!important}',
 '@media(min-width:1000px){html body [data-ct321-top-content] .ct319-top-row{display:grid!important;grid-template-columns:repeat(10,minmax(0,1fr))!important;gap:8px!important}}',
 '@media(max-width:720px){html body [data-home-view="movies"] .ct489-movie-grid,html body [data-profile] .ct491-profile-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:10px!important}.ct489-movie-card,.ct491-profile-grid>.card{width:100%!important;min-width:0!important;max-width:none!important}}'
].join('');
q('#ct491-style')?.remove();document.head.appendChild(style);
document.documentElement.dataset.ct491Version='0.3.18';
window.__ctR491Marker='core-render-boundary+home-r388+foryou-v490+profile-screen-v491+top10-2x3';
window.__ctR491={version:'0.3.18',scope:'home+discover-foryou+top10+profile'};
})();