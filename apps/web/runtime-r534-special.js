/* CineTracker Web 0.3.61 r534 — single active opener for F1/UFC/WWE annual series screens. */
(()=>{
'use strict';
if(window.__ctR534Special?.version==='0.3.61')return;
const valid=new Set(['f1','ufc','wwe']),opening=new Map();
let lastPointer={el:null,type:'',at:0};
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const route=()=>{try{return String(window.__ctCoreR471?.route?.()||'')}catch{return''}};
function candidate(target){
 return target?.closest?.('[data-ct512-special],[data-ct513-open],[data-ct512-open],.ct512-special-card,.media-row.ct274-media-card')||null
}
function titleOf(el){return norm(el?.querySelector?.('.ct274-row-copy>b,.card-body>b,b')?.textContent||'')}
function typeOf(el){
 if(!el)return'';
 const raw=String(el?.dataset?.ct512Special||el?.dataset?.ct513Open||el?.dataset?.ct512Open||'').toLowerCase();
 if(valid.has(raw))return raw;
 if(route()!=='home')return'';
 const t=titleOf(el);
 if(t==='formula 1'||t==='formula one'||t==='f1')return'f1';
 if(t==='ufc')return'ufc';
 if(t==='wwe pay per view'||t==='wwe payperview'||t==='wwe ppv')return'wwe';
 return''
}
function stop(e){try{e.preventDefault()}catch{}try{e.stopImmediatePropagation()}catch{}try{e.stopPropagation()}catch{}}
async function owner(){
 for(let i=0;i<60;i++){
  const screen=window.__ctR513SeriesScreen,special=window.__ctR512Special;
  if(typeof screen?.open==='function'&&typeof special?.loadSeason==='function')return screen;
  await new Promise(r=>setTimeout(r,25))
 }
 return null
}
function openSpecial(type){
 const t=String(type||'').toLowerCase();if(!valid.has(t))return Promise.resolve(false);
 if(opening.has(t))return opening.get(t);
 const task=(async()=>{
  document.documentElement.dataset.ct534SpecialOpening=t;
  const screen=await owner();
  if(!screen){document.documentElement.dataset.ct534SpecialError='OWNER_UNAVAILABLE:'+t;return false}
  const pending=screen.open(t,new Date().getFullYear());
  for(let i=0;i<4&&!document.querySelector('[data-ct513-series-screen]');i++)await new Promise(r=>requestAnimationFrame(r));
  if(!document.querySelector('[data-ct513-series-screen]')){
   document.documentElement.dataset.ct534SpecialError='SCREEN_NOT_RENDERED:'+t;return false
  }
  document.documentElement.dataset.ct534SpecialOpened=t;
  Promise.resolve(pending).catch(e=>{document.documentElement.dataset.ct534SpecialLoadError=t+':'+String(e?.message||e)});
  return true
 })().catch(e=>{document.documentElement.dataset.ct534SpecialError=t+':'+String(e?.message||e);return false}).finally(()=>opening.delete(t));
 opening.set(t,task);return task
}
function activate(e,el=candidate(e.target)){
 if(!el)return false;const t=typeOf(el);if(!t)return false;stop(e);void openSpecial(t);return true
}
window.addEventListener('pointerdown',e=>{
 const el=candidate(e.target),t=typeOf(el);if(!el||!t)return;
 lastPointer={el,type:t,at:Date.now()};activate(e,el)
},true);
window.addEventListener('click',e=>{
 const el=candidate(e.target),t=typeOf(el);if(!el||!t)return;
 if(lastPointer.el===el&&lastPointer.type===t&&Date.now()-lastPointer.at<900){stop(e);return}
 activate(e,el)
},true);
window.addEventListener('keydown',e=>{
 if((e.key==='Enter'||e.key===' ')&&candidate(e.target))activate(e)
},true);
window.__ctR534SpecialMarker='single-special-owner+catalog-ready+title-fallback';
window.__ctR534Special={version:'0.3.61',candidate,typeOf,openSpecial};
})();