/* CineTracker Web 0.3.51 r524 — final direct opener for F1/UFC/WWE special series. */
(()=>{'use strict';
if(window.__ctR524SpecialOpen?.version==='0.3.51')return;
let last={type:'',at:0},opening=null;
function typeOf(el){const t=String(el?.dataset?.ct513Open||el?.dataset?.ct512Open||el?.dataset?.ct512Special||'');return ['f1','ufc','wwe'].includes(t)?t:''}
function stop(e){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation()}
function openType(type){
 if(!type)return false;
 const now=performance.now();if(last.type===type&&now-last.at<600)return true;last={type,at:now};
 const screen=window.__ctR513SeriesScreen;
 if(typeof screen?.open!=='function'){document.documentElement.dataset.ct524SpecialOpenError='SCREEN_UNAVAILABLE:'+type;return false}
 document.documentElement.dataset.ct524SpecialOpening=type;
 opening=Promise.resolve(screen.open(type,new Date().getFullYear()))
  .then(ok=>{if(ok!==false)document.documentElement.dataset.ct524SpecialOpened=type;else document.documentElement.dataset.ct524SpecialOpenError='OPEN_FALSE:'+type;return ok})
  .catch(e=>{document.documentElement.dataset.ct524SpecialOpenError=type+':'+String(e?.message||e);return false})
  .finally(()=>{opening=null});
 return true
}
function intercept(e){
 const card=e.target?.closest?.('[data-ct512-special]');if(!card)return;
 const type=typeOf(card);if(!type)return;stop(e);openType(type)
}
function onKey(e){if(e.key!=='Enter'&&e.key!==' ')return;intercept(e)}
window.addEventListener('pointerup',intercept,true);
window.addEventListener('click',intercept,true);
window.addEventListener('keydown',onKey,true);
window.__ctR524SpecialOpenMarker='direct-special-card-owner-no-route-gate';
window.__ctR524SpecialOpen={version:'0.3.51',open:openType,get opening(){return opening}};
})();