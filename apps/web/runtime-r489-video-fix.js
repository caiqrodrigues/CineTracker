/* CineTracker Web 0.3.16 r489 — video-ground-truth final UI authority. */
(()=>{
'use strict';
if(window.__ctR489?.version==='0.3.16')return;
const q=(s,r=document)=>r?.querySelector?.(s)||null,qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
function trimProfile(){
 const root=q('[data-profile]');if(!root)return false;
 const labels=new Set(['series','filmes','series favoritas','filmes favoritos','atores favoritos']);
 for(const panel of qa('section.panel,.panel',root)){
  const title=norm(q('.panel-head h2,.panel-head h3,:scope>h2,:scope>h3,h2,h3',panel)?.textContent||'');if(!labels.has(title))continue;
  const row=q('[data-ct476-profile-row]',panel);if(!row)continue;qa(':scope>.card',row).slice(12).forEach(x=>x.remove());
 }
 return true;
}
window.addEventListener('cinetracker:data-changed',()=>{if(String(window.__ctCoreR471?.route?.()||'')==='profile')requestAnimationFrame(trimProfile)});
window.addEventListener('popstate',()=>setTimeout(()=>{if(String(window.__ctCoreR471?.route?.()||'')==='profile')trimProfile()},0));
const style=document.createElement('style');style.id='ct489-style';style.textContent=[
 '@keyframes ct489Pulse{0%,100%{opacity:.42}50%{opacity:1}}',
 '.ct489-home-skeleton{display:grid!important;gap:10px!important;padding:4px 0 10px!important;animation:ct489Pulse 1.15s ease-in-out infinite!important}',
 '.ct489-sk-row{display:grid!important;grid-template-columns:48px minmax(0,1fr)!important;gap:12px!important;align-items:center!important;padding:10px!important;border:1px solid rgba(255,255,255,.09)!important;border-radius:14px!important;background:rgba(255,255,255,.035)!important}',
 '.ct489-sk-poster{width:48px!important;height:64px!important;border-radius:8px!important;background:rgba(255,255,255,.10)!important}.ct489-sk-copy{display:grid!important;gap:8px!important}.ct489-sk-copy span{display:block!important;height:13px!important;border-radius:6px!important;background:rgba(255,255,255,.10)!important}.ct489-sk-copy span:first-child{width:68%!important}.ct489-sk-copy span:last-child{width:42%!important;height:10px!important}',
 'html body [data-home-view="movies"] .ct388-movie-stack.ct489-movie-grid{display:grid!important;grid-template-columns:repeat(auto-fill,minmax(132px,150px))!important;grid-auto-flow:row!important;gap:14px!important;align-items:start!important;width:100%!important;overflow:visible!important}',
 'html body [data-home-view="movies"] .ct489-movie-card{position:relative!important;display:block!important;width:150px!important;min-width:132px!important;max-width:150px!important;height:auto!important;min-height:0!important;padding:0!important;overflow:hidden!important}',
 'html body [data-home-view="movies"] .ct489-movie-open{display:block!important;width:100%!important;margin:0!important;padding:0!important;border:0!important;background:transparent!important;color:inherit!important;text-align:left!important}',
 'html body [data-home-view="movies"] .ct489-movie-card .poster{display:block!important;width:100%!important;height:auto!important;aspect-ratio:2/3!important;border-radius:11px!important;background-size:cover!important;background-position:center!important;object-fit:cover!important}',
 'html body [data-home-view="movies"] .ct489-movie-card .card-body{display:block!important;width:100%!important;padding:8px 6px 9px!important;box-sizing:border-box!important}.ct489-movie-card .card-body b{display:block!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}.ct489-movie-card .card-body small{display:block!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;opacity:.72!important}',
 'html body [data-home-view="movies"] .ct489-movie-card>.ct279-watch-button,html body [data-home-view="movies"] .ct489-movie-card>[data-ct279-watch]{position:absolute!important;top:7px!important;right:7px!important;z-index:8!important;width:32px!important;min-width:32px!important;height:32px!important;min-height:32px!important;padding:0!important;border-radius:10px!important;background:rgba(5,14,22,.9)!important}.ct489-movie-card>.ct279-watch-button .ct279-watch-label{display:none!important}',
 'html body [data-ct321-top-content] .ct319-top-row{align-items:start!important;grid-auto-rows:auto!important;height:auto!important}',
 'html body [data-ct321-top-content] .ct319-top-row>.ct319-item,html body [data-ct321-top-content] .ct319-top-row>.ct319-item>.ct288-card,html body [data-ct321-top-content] .ct319-top-row>.ct319-item .ct288-open{height:auto!important;min-height:0!important;max-height:none!important;min-width:0!important}',
 'html body [data-ct321-top-content] .ct319-top-row>.ct319-item .ct288-poster,html body [data-ct321-top-content] .ct319-top-row>.ct319-item .poster{display:block!important;position:relative!important;width:100%!important;height:auto!important;min-height:0!important;max-height:none!important;aspect-ratio:2/3!important;overflow:hidden!important;background-size:cover!important;background-position:center!important}',
 'html body [data-ct321-top-content] .ct319-top-row>.ct319-item .ct288-poster img,html body [data-ct321-top-content] .ct319-top-row>.ct319-item .poster img{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;object-fit:cover!important}',
 'html body [data-profile] [data-ct476-profile-row]{display:grid!important;grid-template-columns:repeat(auto-fill,minmax(132px,150px))!important;grid-auto-flow:row!important;grid-auto-columns:unset!important;gap:12px!important;overflow:visible!important;width:100%!important;padding-bottom:0!important}',
 'html body [data-profile] [data-ct476-profile-row]>.card{width:150px!important;min-width:132px!important;max-width:150px!important}.ct476-profile-card .poster{aspect-ratio:2/3!important;height:auto!important;background-size:cover!important;background-position:center!important}',
 'html body [data-profile] [data-ct476-profile-row]>.card:nth-child(n+13){display:none!important}',
 'html body [data-profile] [data-ct477-sports="loading"]{visibility:hidden!important}',
 '@media(min-width:1000px){html body [data-ct321-top-content] .ct319-top-row{display:grid!important;grid-template-columns:repeat(10,minmax(0,1fr))!important;gap:8px!important}}',
 '@media(max-width:720px){html body [data-home-view="movies"] .ct388-movie-stack.ct489-movie-grid,html body [data-profile] [data-ct476-profile-row]{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:10px!important}html body [data-home-view="movies"] .ct489-movie-card,html body [data-profile] [data-ct476-profile-row]>.card{width:100%!important;min-width:0!important;max-width:none!important}}'
].join('');
if(!q('#ct489-style'))document.head.appendChild(style);
if(String(window.__ctCoreR471?.route?.()||'')==='profile')requestAnimationFrame(trimProfile);
window.__ctR489Marker='video-truth+single-home-owner+movies-real-2x3+foryou-one-rpc+profile-fast-12+sports-no-flicker';
window.__ctR489={version:'0.3.16',scope:'home+discover+profile',trimProfile};
})();