/* CineTracker Web 0.3.23 r496 — daily-use stability on the modern blue UI. */
(()=>{'use strict';if(window.__ctR496?.version==='0.3.23')return;
window.addEventListener('click',e=>{const b=e.target?.closest?.('[data-ct490-foryou-retry]');if(!b||String(window.__ctCoreR471?.route?.()||'')!=='discover')return;e.preventDefault();void window.__ctR464?.load?.(true)},true);
window.addEventListener('cinetracker:data-changed',()=>{try{sessionStorage.removeItem('ct496:profile');sessionStorage.removeItem('ct496:foryou');localStorage.removeItem('ct496:foryou')}catch{}});
window.__ctR496Marker='modern-blue+movie-real-2x3+home-cache+single-foryou+split-profile+top10-cache';
window.__ctR496={version:'0.3.23',scope:'home+discover+profile',theme:'modern-blue'};
})();