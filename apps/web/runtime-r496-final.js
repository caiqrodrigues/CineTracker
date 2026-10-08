/* CineTracker Web 0.3.23 r496 — daily-use stability on the modern blue UI. */
(()=>{'use strict';if(window.__ctR496?.version==='0.3.23')return;
const ct496Fetch=window.fetch.bind(window);
window.fetch=function ct496LegacyReadFence(input,init){
 const u=String(input?.url||input||'');
 if(String(window.__ctCoreR471?.route?.()||'')==='profile'&&/\/rest\/v1\/rpc\/cinetracker_profile_media_dashboard_v0991(?:\?|$)/.test(u)){
  return Promise.resolve(new Response('[]',{status:200,headers:{'content-type':'application/json'}}));
 }
 return ct496Fetch(input,init);
};
window.addEventListener('click',e=>{const b=e.target?.closest?.('[data-ct490-foryou-retry]');if(!b||String(window.__ctCoreR471?.route?.()||'')!=='discover')return;e.preventDefault();void window.__ctR464?.load?.(true)},true);
window.addEventListener('cinetracker:data-changed',()=>{try{sessionStorage.removeItem('ct496:profile');sessionStorage.removeItem('ct496:foryou');localStorage.removeItem('ct496:foryou')}catch{}});
window.__ctR496Marker='modern-blue+movie-real-2x3+home-cache+single-foryou+split-profile+top10-cache';
window.__ctR496={version:'0.3.23',scope:'home+discover+profile',theme:'modern-blue'};
})();