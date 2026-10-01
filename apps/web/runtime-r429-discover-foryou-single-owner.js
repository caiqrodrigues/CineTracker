/* CineTracker Web 1.0.220 r429 — Descobrir > Pra Você single-owner stabilization. */
(()=>{'use strict';
if(window.__ctR429?.version==='1.0.220')return;
const isDiscover=()=>{try{return typeof route==='function'&&route()==='discover'}catch{return location.pathname==='/discover'}};
const isForYou=()=>{if(!isDiscover())return false;try{return String(window.__ctR288R263?.discover263?.tab||'')==='foryou'||!!document.querySelector('[data-ct411-foryou],[data-ct319-tab="foryou"].active,[data-ct263-tab="foryou"].active,[data-discover-tab="foryou"].active')}catch{return false}};
const owner=()=>window.__ctR411&&typeof window.__ctR411==='object'?window.__ctR411:null;
const activate=()=>{const o=owner();if(!o||!isForYou())return false;try{if(typeof o.bind==='function')o.bind();if(typeof o.enterForYou==='function')return !!o.enterForYou(false)}catch{}return false};
const rebind=()=>{const o=owner();if(!o)return false;
try{if(window.__ctR319&&typeof window.__ctR319==='object'&&typeof o.loadForYou==='function'){window.__ctR319.loadForYou=o.loadForYou;if(typeof window.__ctR319.loadDiscover==='function'){const fn=o.loadForYou;const w=function(tab='foryou',force=false){return String(tab||'foryou')==='foryou'?fn(force):window.__ctR319.__ctR429Base?.(tab,force)};w.__ctR429Owner=true;if(!window.__ctR319.__ctR429Base)window.__ctR319.__ctR429Base=window.__ctR319.loadDiscover;window.__ctR319.loadDiscover=w}}}catch{}
try{if(typeof window.__ctR288LoadDiscover==='function'&&!window.__ctR288LoadDiscover.__ctR429Owner){const base=window.__ctR288LoadDiscover,fn=o.loadForYou;const w=function(tab='foryou',force=false){return String(tab||'foryou')==='foryou'?fn(force):base.call(this,tab,force)};w.__ctR429Owner=true;window.__ctR288LoadDiscover=w}}catch{}
return true};
window.addEventListener('click',e=>{const t=e.target;if(!t?.closest)return;
if(t.closest('[data-ct319-tab="foryou"],[data-ct263-tab="foryou"],[data-discover-tab="foryou"]')){queueMicrotask(()=>{rebind();activate()});return}
if(t.closest('[data-nav="discover"]'))queueMicrotask(()=>{rebind();if(isForYou())activate()});
},true);
window.addEventListener('popstate',()=>{if(isForYou()){rebind();activate()}});
window.addEventListener('online',()=>{if(isForYou()){rebind();activate()}});
window.addEventListener('cinetracker:data-changed',()=>{if(isForYou())rebind()});
rebind();
queueMicrotask(()=>{if(isForYou())activate()});
window.__ctR429={version:'1.0.220',scope:'discover-foryou-only',owner:'r411',activate,rebind};
})();