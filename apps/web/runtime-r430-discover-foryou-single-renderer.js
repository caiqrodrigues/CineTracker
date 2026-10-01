/* CineTracker Web 1.0.221 r430 — Descobrir > Pra Você: single renderer, no recovery loop. */
(()=>{
'use strict';
if(window.__ctR430?.version==='1.0.221')return;
const routeNow=()=>{try{return String(typeof route==='function'?route():'')}catch{return''}};
const isForYou=()=>routeNow()==='discover'&&String(window.__ctR288R263?.discover263?.tab||'foryou')==='foryou';
const owner=()=>window.__ctR309&&typeof window.__ctR309.buildForYou==='function'?window.__ctR309:null;
const load=async(force=false)=>{
 const o=owner();if(!o||!isForYou())return false;
 try{return !!(await o.buildForYou(!!force))}catch{return false}
};
const render=()=>{if(!isForYou())return false;const o=owner();if(!o)return false;try{return !!o.buildForYou(false)}catch{return false}};
const swap=name=>{const o=owner();if(!o||typeof o.swap!=='function')return false;try{return !!o.swap(name)}catch{return false}};
const act=(action,name)=>{if(action==='swap')return swap(name);return false};
const bind=()=>{
 const o=owner();if(!o)return false;
 const alias=['__ctR388','__ctR395','__ctR396','__ctR397','__ctR398','__ctR399','__ctR400','__ctR401','__ctR402','__ctR403','__ctR404','__ctR405','__ctR406','__ctR407','__ctR408','__ctR409','__ctR410','__ctR413'];
 for(const n of alias){
  const a=window[n];if(!a||typeof a!=='object')continue;
  if('loadForYou'in a)a.loadForYou=load;
  if('renderForYou'in a)a.renderForYou=render;
  if('enterForYou'in a)a.enterForYou=load;
  if('swap'in a)a.swap=swap;
  if('act'in a)a.act=act;
 }
 window.__ctR388LoadForYou=load;
 window.__ctR288PaintForYou=render;
 if(window.__ctR319&&typeof window.__ctR319==='object'){
  window.__ctR319.loadForYou=load;
  if(typeof window.__ctR319.loadDiscover==='function'){
   const base=window.__ctR319.loadDiscover;
   const wrapped=function(tab='foryou',force=false){return String(tab||'foryou')==='foryou'?load(force):base.call(this,tab,force)};
   wrapped.__ctR430Owner=true;window.__ctR319.loadDiscover=wrapped;
  }
 }
 window.__ctR288LoadDiscover=function(tab='foryou',force=false){
  if(String(tab||'foryou')==='foryou')return load(force);
  return false;
 };
 document.documentElement.dataset.ct430ForYouOwner='r309';
 return true;
};
const click=e=>{
 const t=e.target;if(!t?.closest||!isForYou())return;
 const swapButton=t.closest('[data-ct309-swap]');
 if(swapButton){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();swap(String(swapButton.dataset.ct309Swap||''));return}
 const tab=t.closest('[data-ct319-tab="foryou"],[data-ct263-tab="foryou"],[data-discover-tab="foryou"]');
 if(tab){bind();void load(false)}
};
window.addEventListener('click',click,true);
window.addEventListener('cinetracker:data-changed',()=>{if(isForYou())void load(true)});
window.__ctR430={version:'1.0.221',scope:'discover-foryou-only',owner:'r309',load,render,swap,act,bind};
window.__ctR430Marker='r309-single-renderer-no-recovery-loop';
bind();
})();