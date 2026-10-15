/* CineTracker Web 0.3.59 r532 — single canonical opener for F1/UFC/WWE. */
(()=>{
'use strict';
if(window.__ctR532Special?.version==='0.3.59')return;
const valid=new Set(['f1','ufc','wwe']),opening=new Map();
function typeOf(el){
 const t=String(el?.dataset?.ct512Special||el?.dataset?.ct513Open||el?.dataset?.ct512Open||'').toLowerCase();
 return valid.has(t)?t:''
}
function stop(e){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation()}
async function owner(){
 for(let i=0;i<32;i++){
  const screen=window.__ctR513SeriesScreen;
  if(typeof screen?.open==='function')return screen;
  await new Promise(r=>setTimeout(r,25))
 }
 return null
}
function openSpecial(type){
 const t=String(type||'').toLowerCase();if(!valid.has(t))return Promise.resolve(false);
 if(opening.has(t))return opening.get(t);
 const task=(async()=>{
  document.documentElement.dataset.ct532SpecialOpening=t;
  const screen=await owner();
  if(!screen){document.documentElement.dataset.ct532SpecialError='SCREEN_UNAVAILABLE:'+t;return false}
  const ok=await screen.open(t,new Date().getFullYear());
  await new Promise(r=>requestAnimationFrame(r));
  const visible=!!document.querySelector('[data-ct513-series-screen]');
  if(!visible){document.documentElement.dataset.ct532SpecialError='SCREEN_NOT_RENDERED:'+t;return false}
  document.documentElement.dataset.ct532SpecialOpened=t;
  if(ok===false)document.documentElement.dataset.ct532SpecialLoad='screen-visible-with-load-error:'+t;
  return true
 })().catch(e=>{document.documentElement.dataset.ct532SpecialError=t+':'+String(e?.message||e);return false}).finally(()=>opening.delete(t));
 opening.set(t,task);return task
}
function activate(e){
 const card=e.target?.closest?.('[data-ct512-special],[data-ct513-open],[data-ct512-open]');
 if(!card)return false;const t=typeOf(card);if(!t)return false;
 stop(e);void openSpecial(t);return true
}
function key(e){if((e.key==='Enter'||e.key===' ')&&activate(e))return}
window.addEventListener('click',activate,true);
window.addEventListener('keydown',key,true);
window.__ctR532SpecialMarker='single-special-opener-real-screen';
window.__ctR532Special={version:'0.3.59',openSpecial,typeOf};
})();
