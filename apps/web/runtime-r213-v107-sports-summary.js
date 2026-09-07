/* CineTracker 1.0.7 Sports cleanup authority. Removes only the old status/summary card when the Sports root is actually present. */
(()=>{
'use strict';
window.__ctR213='v107-sports-summary-authority';
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
function isOldSummary(el){
 if(!el||el.id==='ct-f1-v107'||el.closest?.('#ct-f1-v107'))return false;
 if(el.matches?.('[data-sports-summary],[data-sports-stats],.sports-summary,.sports-stats'))return true;
 const t=norm(el.textContent);
 if(t.length>420)return false;
 const hasCounts=/\b\d+\b/.test(t);
 const hasStatus=t.includes('favorit')&&(t.includes('jogo')||t.includes('evento')||t.includes('esporte'));
 return hasCounts&&hasStatus&&!t.includes('formula 1')&&!t.includes('fórmula 1');
}
function clean(){
 const root=document.querySelector('[data-sports]');
 if(!root)return false;
 let changed=false;
 for(const el of [...root.querySelectorAll('[data-sports-summary],[data-sports-stats],.sports-summary,.sports-stats,.stats-card,.summary-card')]){
  if(isOldSummary(el)){el.remove();changed=true}
 }
 for(const el of [...root.querySelectorAll('.card,.panel')]){
  if(isOldSummary(el)){el.remove();changed=true}
 }
 return changed;
}
let raf=0;const schedule=()=>{if(raf)return;raf=requestAnimationFrame(()=>{raf=0;clean()})};
new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
document.addEventListener('DOMContentLoaded',schedule,{once:true});
window.addEventListener('cinetracker:data-changed',schedule);
setTimeout(schedule,0);setTimeout(schedule,300);setTimeout(schedule,1200);
})();