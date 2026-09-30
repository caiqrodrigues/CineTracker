/* CineTracker Web 1.0.201 r410 — Descobrir > Pra Você authoritative owner only. */
(()=>{
'use strict';
if(window.__ctR410?.version==='1.0.201')return;
const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const routeNow=()=>{try{return String(typeof route==='function'?route():'')}catch{return''}};
const state=()=>window.__ctR288R263?.discover263||null;
const isForYou=()=>routeNow()==='discover'&&(String(state()?.tab||'foryou')==='foryou'||!!q('[data-ct319-tab="foryou"].active'));
const owner=()=>window.__ctR409&&typeof window.__ctR409.loadForYou==='function'?window.__ctR409:null;

function activateActions(){
 const root=q('[data-ct409-foryou]');if(!root)return false;
 root.setAttribute('data-ct410-foryou','1');
 for(const b of qa('[data-ct409-action]',root)){
  b.type='button';
  b.classList.add('chip','ct410-action');
  b.hidden=false;
  b.removeAttribute('hidden');
  b.removeAttribute('disabled');
  b.removeAttribute('inert');
  b.setAttribute('aria-disabled','false');
  b.style.setProperty('pointer-events','auto','important');
  b.style.setProperty('opacity','1','important');
  b.style.setProperty('cursor','pointer','important');
 }
 const swaps=qa('[data-ct409-action="swap"]',root);
 document.documentElement.dataset.ct410SwapCount=String(swaps.length);
 document.documentElement.dataset.ct410ActionCount=String(qa('[data-ct409-action]',root).length);
 return swaps.length===7;
}
function renderForYou(){
 const o=owner();if(!o)return false;
 const out=o.renderForYou?.()??false;
 activateActions();
 return out;
}
async function loadForYou(force=false){
 const o=owner();if(!o)return false;
 const ok=await o.loadForYou(!!force);
 if(isForYou())renderForYou();
 return !!ok;
}
function enterForYou(force=false){
 const o=owner();if(!o)return false;
 const out=o.enterForYou?.(!!force);
 queueMicrotask(activateActions);
 return out??false;
}
function swap(name){const o=owner();const out=o?.swap?.(name)??false;activateActions();return out}
function act(action,name){const o=owner();const out=o?.act?.(action,name)??false;queueMicrotask(activateActions);return out}

function bind(){
 if(window.__ctR309&&typeof window.__ctR309==='object')window.__ctR309.buildForYou=loadForYou;
 if(window.__ctR319&&typeof window.__ctR319==='object'){
  window.__ctR319.loadForYou=loadForYou;
  if(typeof window.__ctR319.loadDiscover==='function'&&!window.__ctR319.loadDiscover.__ctR410Owned){
   const base=window.__ctR319.loadDiscover.bind(window.__ctR319);
   const wrapped=function(tab='foryou',force=false){return String(tab||'foryou')==='foryou'?loadForYou(force):base(tab,force)};
   wrapped.__ctR410Owned=true;window.__ctR319.loadDiscover=wrapped;
  }
 }
 for(const n of ['__ctR404','__ctR405','__ctR406','__ctR408','__ctR388','__ctR395','__ctR396']){
  const a=window[n];if(!a||typeof a!=='object')continue;
  a.loadForYou=loadForYou;
  if('renderForYou'in a)a.renderForYou=renderForYou;
  if('swap'in a)a.swap=swap;
 }
 if(typeof window.__ctR288LoadDiscover==='function'&&!window.__ctR288LoadDiscover.__ctR410Owned){
  const base=window.__ctR288LoadDiscover;
  const wrapped=function(tab='foryou',force=false){return String(tab||'foryou')==='foryou'?loadForYou(force):base.call(this,tab,force)};
  wrapped.__ctR410Owned=true;window.__ctR288LoadDiscover=wrapped;
 }
 window.__ctR288PaintForYou=renderForYou;
 document.documentElement.dataset.ct410Owner='discover-foryou-only';
 return true;
}
function ready(n=0){
 bind();
 if(isForYou()&&owner()){void loadForYou(false);return}
 if(n<20)setTimeout(()=>ready(n+1),200);
}
window.__ctR410={version:'1.0.201',scope:'discover-foryou-only',loadForYou,renderForYou,enterForYou,activateActions,swap,act,bind};
window.__ctR410Marker='r319-local-closure+legacy-painter-block+active-complete-actions';
bind();queueMicrotask(bind);for(const ms of [0,80,220,600])setTimeout(()=>{bind();activateActions()},ms);
setTimeout(()=>ready(0),0);
})();