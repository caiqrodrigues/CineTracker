/* CineTracker Web 0.3.54 r527 — scoped final authority for Home/Discover/special-series/F1. */
(()=>{
'use strict';
if(window.__ctR527?.version==='0.3.54')return;
try{sessionStorage.removeItem('ct392:series');sessionStorage.removeItem('ct520:f1:current');sessionStorage.removeItem('ct520:ufc:current');sessionStorage.removeItem('ct520:wwe:current')}catch{}
const valid=new Set(['f1','ufc','wwe']);let lastType='',lastAt=0;
window.addEventListener('pointerdown',e=>{
 const card=e.target?.closest?.('[data-ct512-special]');if(!card)return;
 const type=String(card.dataset.ct512Special||card.dataset.ct513Open||'').toLowerCase();if(!valid.has(type))return;
 e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
 const now=performance.now();if(type===lastType&&now-lastAt<450)return;lastType=type;lastAt=now;
 try{const owner=window.__ctR524SpecialOpen;if(typeof owner?.open==='function')owner.open(type);else window.__ctR513SeriesScreen?.open?.(type,new Date().getFullYear())}
 catch(err){document.documentElement.dataset.ct527SpecialOpenError=type+':'+String(err?.message||err)}
},true);
window.__ctR527Marker='home-v527-live-status+movies-real-renderer+discover-10x10-audited+special-pointerdown+f1-gp-detail';
window.__ctR527={version:'0.3.54',scope:'home+discover+special-series+f1-hub'};
})();