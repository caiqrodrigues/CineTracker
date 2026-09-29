/* CineTracker Web 1.0.186 r395 — Discover Pra Voce single route owner. */
(()=>{
'use strict';
if(window.__ctR395?.version==='1.0.186')return;
window.__ctR395Marker='discover-foryou-r388-single-route-owner+legacy-v333-bypass';
window.__ctR395Scope='discover-foryou-only';
const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const routeNow=()=>{try{return String(typeof route==='function'?route():'')}catch{return''}};
const discoverState=()=>window.__ctR288R263?.discover263||null;
const isForYou=()=>routeNow()==='discover'&&String(discoverState()?.tab||'foryou')==='foryou';
const modern=()=>window.__ctR388&&typeof window.__ctR388.loadForYou==='function'?window.__ctR388:null;
const baseSwitch=typeof window.__ctR336?.switchDiscover==='function'?window.__ctR336.switchDiscover.bind(window.__ctR336):null;
const baseLoadDiscover=typeof window.__ctR321?.loadDiscover==='function'?window.__ctR321.loadDiscover.bind(window.__ctR321):null;
const baseEarly321=typeof window.__ctR321EarlyHandle==='function'?window.__ctR321EarlyHandle:null;
const baseEarly337=typeof window.__ctR337?.earlyHandle==='function'?window.__ctR337.earlyHandle.bind(window.__ctR337):null;
const baseRenderDiscover=typeof renderDiscover==='function'?renderDiscover:null;
let loadTask=null,loadRun=0,navTimer=0;

function syncForYouTab395(){
 const d=discoverState();if(!d)return false;d.tab='foryou';
 qa('[data-ct319-tab]').forEach(b=>b.classList.toggle('active',String(b.dataset.ct319Tab||'')==='foryou'));
 return true;
}
function hasRealCard395(){
 const root=q('[data-ct388-foryou]');
 return !!root&&qa('[data-ct388-slot]',root).some(slot=>!q('.ct388-placeholder',slot));
}
function settleEmptySlots395(){
 const root=q('[data-ct388-foryou]');if(!root)return false;
 for(const slot of qa('[data-ct388-slot]',root)){
  const p=q('.ct388-placeholder',slot);if(!p)continue;
  const name=String(slot.dataset.ct388Slot||'');
  p.classList.add('ct395-empty');
  p.innerHTML='<div class="ct388-skeleton"></div><b>'+(name.startsWith('watch:')?'Nada elegível na Watchlist.':'Sem indicação elegível agora.')+'</b>';
 }
 return true;
}
function bindLoaders395(){
 const api=modern();if(!api)return false;
 for(const name of ['__ctR378LoadForYou','__ctR379LoadForYou','__ctR380LoadForYou','__ctR382LoadForYou','__ctR383LoadForYou','__ctR384LoadForYou','__ctR385LoadForYou','__ctR388LoadForYou'])window[name]=loadForYou395;
 for(const name of ['__ctR321','__ctR382','__ctR383','__ctR384','__ctR385','__ctR393','__ctR394'])if(window[name]&&typeof window[name]==='object')window[name].loadForYou=loadForYou395;
 if(window.__ctR321&&typeof window.__ctR321==='object')window.__ctR321.loadDiscover=loadDiscover395;
 window.__ctR288LoadDiscover=loadDiscover395;
 if(window.__ctR336&&typeof window.__ctR336==='object'){
  window.__ctR336.switchDiscover=switchDiscover395;
  if(typeof api.renderForYou==='function')window.__ctR336.paintForYou=api.renderForYou;
 }
 window.__ctR321EarlyHandle=early321395;
 window.__ctR336EarlyHandle=early336395;
 document.documentElement.dataset.ct395ForYouOwner='r388';
 return true;
}
async function loadForYou395(force=false){
 if(!isForYou())return false;
 const api=modern();if(!api)return false;
 if(loadTask)return loadTask;
 const run=++loadRun;
 loadTask=(async()=>{
  document.documentElement.dataset.ct395ForYou='loading';
  let ok=false;
  try{ok=!!(await api.loadForYou(!!force))}catch{ok=false}
  if(run!==loadRun||!isForYou())return false;
  try{api.renderForYou?.()}catch{}
  if(!hasRealCard395()&&!force){
   try{ok=!!(await api.loadForYou(true))||ok}catch{}
   if(run!==loadRun||!isForYou())return false;
   try{api.renderForYou?.()}catch{}
  }
  if(!hasRealCard395())settleEmptySlots395();
  document.documentElement.dataset.ct395ForYou=hasRealCard395()?'ready':(ok?'ready-empty':'empty');
  return ok||hasRealCard395();
 })().finally(()=>{if(run===loadRun)loadTask=null});
 return loadTask;
}
async function loadDiscover395(tab=discoverState()?.tab,force=false){
 const wanted=String(tab||'foryou');
 if(wanted==='foryou'){
  syncForYouTab395();
  return loadForYou395(!!force);
 }
 return baseLoadDiscover?baseLoadDiscover(wanted,!!force):false;
}
async function switchDiscover395(tab,force=false){
 const wanted=String(tab||'foryou');
 if(wanted==='foryou'){
  syncForYouTab395();
  return loadForYou395(!!force);
 }
 return baseSwitch?baseSwitch(wanted,!!force):(baseLoadDiscover?baseLoadDiscover(wanted,!!force):false);
}
function early321395(target){
 const tab=target?.closest?.('[data-ct319-tab]');
 if(tab&&routeNow()==='discover'&&String(tab.dataset.ct319Tab||'')==='foryou'){
  syncForYouTab395();void loadForYou395(false);return true;
 }
 return typeof baseEarly321==='function'?!!baseEarly321(target):false;
}
function early336395(target,event){
 if(!target?.closest)return false;
 const action=target.closest('[data-ct388-action]');
 if(action&&routeNow()==='discover')return !!modern()?.early?.(target,event);
 const tab=target.closest('[data-ct319-tab]');
 if(tab&&routeNow()==='discover'){
  event?.preventDefault?.();event?.stopImmediatePropagation?.();event?.stopPropagation?.();
  void switchDiscover395(String(tab.dataset.ct319Tab||'foryou'),false);return true;
 }
 return typeof baseEarly337==='function'?!!baseEarly337(target,event):false;
}
function scheduleAfterRoute395(){
 clearTimeout(navTimer);navTimer=setTimeout(()=>{
  bindLoaders395();
  if(isForYou())void loadForYou395(false);
 },0);
}

bindLoaders395();
try{
 renderDiscover=function(){
  bindLoaders395();
  const out=baseRenderDiscover?baseRenderDiscover.apply(this,arguments):undefined;
  queueMicrotask(()=>{bindLoaders395();if(isForYou()&&!q('[data-ct388-foryou]'))void loadForYou395(false)});
  return out;
 };
 if(window.__ctR321&&typeof window.__ctR321==='object')window.__ctR321.renderDiscover=renderDiscover;
}catch{}

document.addEventListener('click',e=>{
 const t=e.target;if(!t?.closest)return;
 const fy=t.closest('[data-ct319-tab="foryou"]');
 if(fy&&routeNow()==='discover'){
  e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();
  syncForYouTab395();void loadForYou395(false);return;
 }
 if(t.closest('[data-nav="discover"]'))scheduleAfterRoute395();
},true);
window.addEventListener('popstate',scheduleAfterRoute395);
window.addEventListener('cinetracker:data-changed',()=>{if(isForYou())setTimeout(()=>void loadForYou395(true),80)});
setTimeout(()=>{bindLoaders395();if(isForYou())void loadForYou395(false)},0);

window.__ctR395={
 version:'1.0.186',scope:'discover-foryou-only',bind:bindLoaders395,loadForYou:loadForYou395,loadDiscover:loadDiscover395,
 switchDiscover:switchDiscover395,early321:early321395,early336:early336395,hasRealCard:hasRealCard395,settleEmpty:settleEmptySlots395
};
})();
