/* CineTracker 1.0.9 — shared Home composition authority.
 * History remains persisted and available to statistics/details, but is not a standalone Home section.
 */
(()=>{
'use strict';
if(window.__ctR215HomeComposition)return;
window.__ctR215HomeComposition='no-standalone-history-home';
window.__ctHomeHistoryPolicy='history-hidden-from-home-canonical-buckets-only';

const fold=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
function cleanHomeHistory(){
  const root=document.querySelector('[data-home]');
  if(!root)return 0;
  let removed=0;
  for(const section of [...root.querySelectorAll('[data-home-view="series"] .home-section')]){
    const title=fold(section.querySelector('.panel-head h3,h3,h2')?.textContent);
    if(title==='historico recente'||title==='historico'){
      section.remove();removed++;
    }
  }
  for(const head of [...root.querySelectorAll('[data-home-view="series"] .panel-head')]){
    const title=fold(head.querySelector('h3,h2')?.textContent);
    if(title!=='historico recente'&&title!=='historico')continue;
    const section=head.closest('section,.panel,.home-section');
    if(section){section.remove();removed++}
  }
  root.dataset.ctHomeHistoryHidden='1';
  return removed;
}
window.__ctCleanHomeHistory=cleanHomeHistory;

try{
  const paintHomeBeforeR215=paintHome;
  paintHome=function(){
    const out=paintHomeBeforeR215.apply(this,arguments);
    cleanHomeHistory();
    return out;
  };
}catch{}

/* Remove any late reinserted History in the same mutation turn. Removals do not add nodes,
   so this does not create an observer loop. */
new MutationObserver(records=>{
  if(records.some(r=>r.addedNodes?.length)&&document.querySelector('[data-home]'))cleanHomeHistory();
}).observe(document.documentElement,{childList:true,subtree:true});
setTimeout(cleanHomeHistory,0);
setTimeout(cleanHomeHistory,350);
})();
