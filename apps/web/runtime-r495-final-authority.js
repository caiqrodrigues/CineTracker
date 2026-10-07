/* CineTracker Web 0.3.22 r495 — modern runtime recovery guard. */
(()=>{'use strict';if(window.__ctR495?.version==='0.3.22')return;
function clearLegacyGates(){for(const k of['ct413HomeEntering','ct415HomeEntering','ct417HomeEntering','ct418HomeEntering','ct424HomeEntering'])delete document.documentElement.dataset[k];const view=document.querySelector('[data-home-view="series"]:not(.hidden):not([hidden]),[data-home-view="movies"]:not(.hidden):not([hidden])');if(view){view.style.removeProperty('visibility');view.style.removeProperty('opacity');view.removeAttribute('aria-hidden')}}
clearLegacyGates();queueMicrotask(clearLegacyGates);requestAnimationFrame(clearLegacyGates);window.addEventListener('pageshow',clearLegacyGates);window.addEventListener('popstate',clearLegacyGates);
function applyHomeTab495(kind,resetScroll=false){
 const root=document.querySelector('[data-home]');if(!root)return false;const wanted=kind==='movies'?'movies':'series';
 root.querySelectorAll('[data-home-tab]').forEach(b=>{const on=String(b.dataset.homeTab||'series')===wanted;b.classList.toggle('active',on);b.setAttribute('aria-selected',on?'true':'false')});
 root.querySelectorAll('[data-home-view]').forEach(v=>{const on=String(v.dataset.homeView||'')===wanted;v.hidden=!on;v.classList.toggle('hidden',!on);v.setAttribute('aria-hidden',on?'false':'true')});
 document.documentElement.dataset.ct495HomeKind=wanted;
 if(resetScroll)try{window.scrollTo({top:0,left:0,behavior:'auto'})}catch{window.scrollTo?.(0,0)}
 try{if(wanted==='movies')void window.__ctR388?.loadMovies?.(false);else void window.__ctR388?.loadSeries?.(false)}catch{}
 return true;
}
window.addEventListener('click',e=>{const tab=e.target?.closest?.('[data-home-tab]');if(!tab||!document.querySelector('[data-home]'))return;const wanted=String(tab.dataset.homeTab||'series')==='movies'?'movies':'series';applyHomeTab495(wanted,true);queueMicrotask(()=>applyHomeTab495(wanted,false));requestAnimationFrame(()=>applyHomeTab495(wanted,false))},true);
window.__ctR495Marker='modern-runtime+old-owners-retired+progressive-home+fast-profile+strict-12';window.__ctR495={version:'0.3.22',scope:'home+profile+discover+entrypoint',clearLegacyGates,applyHomeTab:applyHomeTab495};
})();