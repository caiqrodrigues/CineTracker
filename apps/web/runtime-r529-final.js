/* CineTracker Web 0.3.56 r529 — non-floating Home chrome + single special-series opener. */
(()=>{
'use strict';
if(window.__ctR529?.version==='0.3.56')return;
const valid=new Set(['f1','ufc','wwe']),opening=new Map();let lastType='',lastAt=0;
function typeOf(el){const t=String(el?.dataset?.ct512Special||el?.dataset?.ct513Open||'').toLowerCase();return valid.has(t)?t:''}
function openSpecial(type){
 if(!valid.has(type))return Promise.resolve(false);
 if(opening.has(type))return opening.get(type);
 const screen=window.__ctR513SeriesScreen;
 if(typeof screen?.open!=='function'){document.documentElement.dataset.ct529SpecialError='SCREEN_UNAVAILABLE:'+type;return Promise.resolve(false)}
 const now=performance.now();if(type===lastType&&now-lastAt<650)return Promise.resolve(true);
 lastType=type;lastAt=now;document.documentElement.dataset.ct529SpecialOpening=type;
 const task=Promise.resolve(screen.open(type,new Date().getFullYear())).then(ok=>{
  if(ok===false){document.documentElement.dataset.ct529SpecialError='OPEN_FALSE:'+type;return false}
  document.documentElement.dataset.ct529SpecialOpened=type;return true
 }).catch(e=>{document.documentElement.dataset.ct529SpecialError=type+':'+String(e?.message||e);return false}).finally(()=>opening.delete(type));
 opening.set(type,task);return task
}
function intercept(e){
 const card=e.target?.closest?.('[data-ct512-special],[data-ct513-open]');if(!card)return;
 const type=typeOf(card);if(!type)return;
 e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();void openSpecial(type)
}
function key(e){if(e.key!=='Enter'&&e.key!==' ')return;intercept(e)}
window.addEventListener('pointerdown',intercept,true);
window.addEventListener('click',intercept,true);
window.addEventListener('keydown',key,true);
window.__ctR529Marker='home-normal-flow+main-anchor+single-f1-ufc-wwe-opener';
window.__ctR529={version:'0.3.56',scope:'home+special-open',openSpecial};
})();