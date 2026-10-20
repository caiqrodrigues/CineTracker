/* CineTracker Android 1.0.54/r296 — Raw/SmackDown stable Home DOM owner.
 * Reuse actual visible rows across asynchronous Home paints, never invent data,
 * never perform a page reload, and discard cached rows on watched actions.
 */
(()=>{'use strict';
if(window.__ctR296WweHome)return;
const IDS=new Set([4656,1549]);
const snapshots=new Map();
let account='',observer=null,observed=null,frame=0,restoring=false,recovered=0;
const uid=()=>String(session?.user?.id||user?.id||'');
const active=()=>route()==='home'&&homeActiveTab158==='series'&&!!uid();
const view=()=>document.querySelector('[data-home-view="series"]')||document.querySelector('[data-home]');
const normalized=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().toLowerCase();
function idOf(row){
 const raw=String(row?.dataset?.media||row?.querySelector?.('[data-media]')?.dataset?.media||'');
 const parsed=Number(raw.match(/(?:tv|series):(\d+)/)?.[1]||0);
 if(IDS.has(parsed))return parsed;
 const label=normalized(row?.querySelector?.('b')?.textContent);
 return label==='raw'||label==='wwe monday night raw'?4656:
  label==='smackdown'||label.includes('wwe friday night smackdown')?1549:0;
}
function rows(root){
 const found=new Map();
 for(const row of root?.querySelectorAll?.('.media-row')||[]){
  const id=idOf(row);if(id&&!found.has(id))found.set(id,row);
 }
 return found;
}
function heading(section){
 return normalized(section?.querySelector?.('.panel-head h3,h3')?.textContent);
}
function capture(){
 if(!active())return;
 if(uid()!==account){account=uid();snapshots.clear()}
 const root=view();if(!root)return;
 for(const [id,row] of rows(root)){
  const node=row.closest('.home-action-row')||row;
  if(node.dataset.ct296Retained)continue;
  const parent=row.closest('section'),name=heading(parent);
  if(!name)continue;
  snapshots.set(id,{node,heading:name,verifiedAt:Date.now()});
 }
}
function recount(panel){
 const stack=panel?.querySelector(':scope > .stack');
 const small=panel?.querySelector('.panel-head small');
 if(!stack||!small)return;
 const count=stack.querySelectorAll(':scope > .media-row,:scope > .home-action-row,:scope > .ct286-special-holder,:scope > [data-ct286-special-holder]').length;
 small.textContent=String(count);
}
function repair(){
 if(restoring||!active()||uid()!==account)return 0;
 const root=view();if(!root)return 0;
 const visible=rows(root),sections=Array.from(root.querySelectorAll('section'));
 let changed=0;
 restoring=true;
 try{
  capture();
  for(const [id,saved] of snapshots){
   if(visible.has(id))continue;
   if(Date.now()-saved.verifiedAt>600000){snapshots.delete(id);continue}
   const panel=sections.find(el=>heading(el)===saved.heading);
   const stack=panel?.querySelector(':scope > .stack');
   if(!stack||!saved.node)continue;
   if(saved.node.isConnected&&root.contains(saved.node))continue;
   saved.node.dataset.ct296Retained=String(id);
   stack.appendChild(saved.node);
   stack.querySelector(':scope > .empty')?.remove();
   visible.set(id,saved.node.querySelector('.media-row')||saved.node);
   recount(panel);changed++;
  }
  if(changed){
   recovered+=changed;
   document.documentElement.dataset.ct296WweRecovered=String(recovered);
  }
 }finally{restoring=false}
 return changed;
}
function schedule(){
 if(!active()||frame)return;
 frame=requestAnimationFrame(()=>{frame=0;repair();attach()});
}
function attach(){
 const root=active()?view():null;
 if(observed===root)return;
 observer?.disconnect();observer=null;observed=root;
 if(!root||typeof MutationObserver!=='function')return;
 observer=new MutationObserver(()=>{if(!restoring)schedule()});
 observer.observe(root,{subtree:true,childList:true});
}
const oldPaint=paintHome;
paintHome=function(...args){
 if(active())capture();
 const result=oldPaint.apply(this,args);
 if(active()){repair();attach();queueMicrotask(schedule)}
 else if(observer){observer.disconnect();observer=null;observed=null}
 return result;
};
document.addEventListener('click',event=>{
 if(!active())return;
 const button=event.target?.closest?.('button');
 if(!button)return;
 const row=button.closest('.home-action-row,.media-row');
 const id=idOf(row?.matches?.('.media-row')?row:row?.querySelector?.('.media-row'));
 if(id){
  // A legitimate watched/unwatched mutation must never resurrect its old row.
  snapshots.delete(id);
 }
},true);
document.addEventListener('cinetracker:wwe-episodes-refreshed',schedule,false);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)schedule()},false);
window.addEventListener('popstate',schedule,false);
window.__ctR296WweHome={
 capture,repair,rows,idOf,snapshots,
 stats:()=>({recovered,cached:snapshots.size,observed:!!observed})
};
})();