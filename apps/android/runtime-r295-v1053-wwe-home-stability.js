/* Android 1.0.53/r295 — Raw and SmackDown remain in Home across async paints.
 * Capture real existing rows only; never create fictitious episodes or force a bucket.
 */
(()=>{'use strict';
if(window.__ctR295Home)return;
window.__ctR295Home='retain-raw-smackdown-during-home-async-rerenders';
const names={4656:'raw',1549:'smackdown'};
const saved=new Map();
let account='',lastCapture=0;
const uid=()=>String(session?.user?.id||user?.id||'');
const active=()=>route()==='home'&&homeActiveTab158==='series'&&!!uid();
const home=()=>document.querySelector('[data-home-view="series"]')||document.querySelector('[data-home]');
function media(row){
 const raw=String(row?.dataset?.media||row?.querySelector?.('[data-media]')?.dataset?.media||'');
 const explicit=Number(raw.match(/(?:tv|series):(\d+)/)?.[1]||0);
 if(names[explicit])return explicit;
 const title=String(row?.querySelector?.('b')?.textContent||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
 return title==='raw'||title==='wwe monday night raw'?4656:title.includes('smackdown')?1549:0;
}
function existing(view){
 const m=new Map();
 for(const row of Array.from(view?.querySelectorAll?.('.media-row')||[])){
  const id=media(row);
  if(id&&!m.has(id))m.set(id,row);
 }
 return m;
}
function capture(){
 if(!active())return;
 if(account!==uid()){saved.clear();account=uid()}
 const view=home();if(!view)return;
 for(const [id,row] of existing(view)){
  const card=row.closest('.home-action-row')||row;
  const section=row.closest('section');
  const heading=String(section?.querySelector('.panel-head h3,h3')?.textContent||'');
  saved.set(id,{node:card.cloneNode(true),heading,at:Date.now()});
  lastCapture=Date.now();
 }
}
function refreshCounts(section){
 if(!section)return;
 const stack=section.querySelector(':scope > .stack'),counter=section.querySelector('.panel-head small');
 if(!stack||!counter)return;
 const count=stack.querySelectorAll(':scope > .media-row,:scope > .home-action-row').length;
 counter.textContent=String(count);
}
function restore(){
 if(!active()||account!==uid())return 0;
 const view=home();if(!view||!saved.size)return 0;
 const present=existing(view),sections=Array.from(view.querySelectorAll('section'));
 let recovered=0;
 for(const [id,item] of saved){
  if(present.has(id))continue;
  // Preserve only an already-visible card, never reconstruct from arbitrary DB.
  if(Date.now()-item.at>180000){saved.delete(id);continue}
  const section=sections.find(x=>String(x.querySelector('.panel-head h3,h3')?.textContent||'')===item.heading);
  if(!section)continue;
  const stack=section.querySelector(':scope > .stack');
  if(!stack)continue;
  const copy=item.node.cloneNode(true);
  copy.dataset.ct295HomeRetained=String(id);
  stack.appendChild(copy);
  stack.querySelector(':scope > .empty')?.remove();
  refreshCounts(section);recovered++;
 }
 document.documentElement.dataset.ct295WweRetained=String(recovered);
 return recovered;
}
const previous=paintHome;
paintHome=function(...args){
 if(active())capture();
 const result=previous.apply(this,args);
 if(active()){
  restore();
  // Existing live rows always replace temporary copies when the server returns.
  queueMicrotask(()=>{capture();restore()});
 }
 return result;
};
// Revisit recovery after asynchronous sports sync, but never reload Home.
document.addEventListener('cinetracker:wwe-episodes-refreshed',()=>{
 if(active()){capture();restore()}
});
window.__ctR295HomeTest={capture,restore,existing,media,getSaved:()=>saved};
})();