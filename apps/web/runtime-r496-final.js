/* CineTracker Web 0.3.23 r496 — fluid final authority without legacy visual fallback. */
(()=>{'use strict';if(window.__ctR496?.version==='0.3.23')return;
const clear=()=>{for(const k of ['ct496:profile','ct496:foryou']){try{sessionStorage.removeItem(k)}catch{}try{localStorage.removeItem(k)}catch{}}};
window.addEventListener('cinetracker:data-changed',clear);
try{for(const k of ['ct493:foryou','ct491:foryou-cycle','ct490:foryou-cycle']){sessionStorage.removeItem(k);localStorage.removeItem(k)}}catch{}
window.__ctR496Marker='fluid-home-native-movies+profile-split-no-monolith+foryou-snapshot+modern-blue-only';
window.__ctR496={version:'0.3.23',scope:'home+discover+profile',clearCaches:clear};
})();