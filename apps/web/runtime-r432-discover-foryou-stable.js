/* CineTracker Web 1.0.223 r432 — Descobrir > Pra Você: single owner, no legacy refresh. */
(()=>{
'use strict';
if(window.__ctR432?.version==='1.0.223')return;
const routeNow=()=>{try{return String(typeof route==='function'?route():'')}catch{return String(location.pathname||'').replace(/^\//,'')||'home'}};
const state=()=>window.__ctR288R263?.discover263||null;
const isForYou=()=>routeNow()==='discover'&&String(state()?.tab||'')==='foryou';
const owner=()=>window.__ctR309&&typeof window.__ctR309.buildForYou==='function'?window.__ctR309:null;
const load=async(force=false)=>{if(!isForYou())return false;const o=owner();if(!o)return false;try{return !!(await o.buildForYou(!!force))}catch{return false}};
const swap=name=>{const o=owner();if(!o||typeof o.swap!=='function')return false;try{return !!o.swap(name)}catch{return false}};
document.addEventListener('cinetracker:data-changed',e=>{if(isForYou()){e.preventDefault();e.stopImmediatePropagation();}},true);
window.addEventListener('online',e=>{if(isForYou()){e.preventDefault();e.stopImmediatePropagation();}},true);
window.addEventListener('click',e=>{const t=e.target;if(!t?.closest||!isForYou())return;const b=t.closest('[data-ct309-swap]');if(b){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();swap(String(b.dataset.ct309Swap||''));return}const tab=t.closest('[data-ct319-tab="foryou"],[data-ct263-tab="foryou"],[data-discover-tab="foryou"]');if(tab){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();void load(false);}},true);
window.__ctR432={version:'1.0.223',scope:'discover-foryou-only',owner:'r309',load,swap};
queueMicrotask(()=>{if(isForYou())void load(false)});
})();