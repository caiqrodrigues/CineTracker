/* CineTracker Web 0.3.22 r495 — modern runtime recovery guard. */
(()=>{'use strict';if(window.__ctR495?.version==='0.3.22')return;
function clearLegacyGates(){for(const k of['ct413HomeEntering','ct415HomeEntering','ct417HomeEntering','ct418HomeEntering','ct424HomeEntering'])delete document.documentElement.dataset[k];const view=document.querySelector('[data-home-view="series"]:not(.hidden):not([hidden]),[data-home-view="movies"]:not(.hidden):not([hidden])');if(view){view.style.removeProperty('visibility');view.style.removeProperty('opacity');view.removeAttribute('aria-hidden')}}
clearLegacyGates();queueMicrotask(clearLegacyGates);requestAnimationFrame(clearLegacyGates);window.addEventListener('pageshow',clearLegacyGates);window.addEventListener('popstate',clearLegacyGates);
window.__ctR495Marker='modern-runtime+old-owners-retired+progressive-home+fast-profile+strict-12';window.__ctR495={version:'0.3.22',scope:'home+profile+discover+entrypoint',clearLegacyGates};
})();