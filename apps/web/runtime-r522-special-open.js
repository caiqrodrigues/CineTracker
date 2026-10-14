/* CineTracker Web 0.3.49 r522 — final direct opener for F1/UFC/WWE special series. */
(()=>{'use strict';
if(window.__ctR522SpecialOpen?.version==='0.3.49')return;
const core=()=>window.__ctCoreR471||null,route=()=>String(core()?.route?.()||'');
let last={type:'',at:0},opening=null;
function typeOf(el){const t=String(el?.dataset?.ct513Open||el?.dataset?.ct512Special||'');return ['f1','ufc','wwe'].includes(t)?t:''}
function stop(e){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation()}
function openType(type){
 if(!type||route()!=='home')return false;
 const now=performance.now();if(last.type===type&&now-last.at<500)return true;last={type,at:now};
 const screen=window.__ctR513SeriesScreen;if(!screen?.open){document.documentElement.dataset.ct522SpecialOpenError='SCREEN_UNAVAILABLE:'+type;return false}
 document.documentElement.dataset.ct522SpecialOpening=type;
 opening=Promise.resolve(screen.open(type)).then(ok=>{if(ok!==false)document.documentElement.dataset.ct522SpecialOpened=type;else document.documentElement.dataset.ct522SpecialOpenError='OPEN_FALSE:'+type;return ok}).catch(e=>{document.documentElement.dataset.ct522SpecialOpenError=type+':'+String(e?.message||e);return false}).finally(()=>{opening=null});
 return true
}
function intercept(e){const card=e.target?.closest?.('[data-ct512-special][data-ct513-open]');if(!card||route()!=='home')return;const type=typeOf(card);if(!type)return;stop(e);openType(type)}
function onKey(e){if(e.key!=='Enter'&&e.key!==' ')return;intercept(e)}
window.addEventListener('pointerup',intercept,true);
window.addEventListener('click',intercept,true);
window.addEventListener('keydown',onKey,true);
window.__ctR522SpecialOpenMarker='pointerup-owner-f1-ufc-wwe';
window.__ctR522SpecialOpen={version:'0.3.49',open:openType,get opening(){return opening}};
})();