/* CineTracker 1.0.9 — Home composition authority.
 * History remains available as data, but is not rendered as a standalone Home section.
 * The Home starts from its canonical buckets, led by Assistir a seguir.
 */
(()=>{
'use strict';
if(window.__ctR251HomeComposition)return;
window.__ctR251HomeComposition='no-standalone-history-home';
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
  /* Defensive cleanup for old cached markup that did not carry .home-section. */
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
  const paintHomeBeforeR251=paintHome;
  paintHome=function(){
    const out=paintHomeBeforeR251.apply(this,arguments);
    cleanHomeHistory();
    return out;
  };
}catch{}

/* Some late canonical episode patches replace individual Home nodes. Cleanup is cheap and
   scoped only to the series Home view, so a mutation pass prevents legacy cached HTML from
   bringing the History section back without repainting the page. */
let scheduled=false;
const schedule=()=>{
  if(scheduled)return;scheduled=true;
  requestAnimationFrame(()=>{scheduled=false;if(location.pathname==='/home'||document.querySelector('[data-home]'))cleanHomeHistory()});
};
new MutationObserver(records=>{
  if(records.some(r=>r.addedNodes?.length))schedule();
}).observe(document.documentElement,{childList:true,subtree:true});
setTimeout(cleanHomeHistory,0);
setTimeout(cleanHomeHistory,350);
})();
