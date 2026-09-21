/* CineTracker Web 1.0.117 r326 — restore scrollable Home history + compact Discover actions. */
(()=>{
'use strict';
if(window.__ctR326?.version==='1.0.117')return;
window.__ctR326Marker='home-history-scroll-up+discover-compact-actions+strict-v326';
window.__ctR326Home='always-rendered+oldest-top+newest-bottom+auto-bottom';
window.__ctR326Discover='compact-inline-actions+strict-candidate-authority';
window.__ctR326Android='preserved-1.0.20-10062';

const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const routeNow=()=>{try{return String(typeof route==='function'?route():'')}catch{return''}};
let rafHistory=0,rafActions=0;

function restoreHomeHistory326(){
 if(routeNow()!=='home')return false;
 const root=q('[data-home]');if(!root)return false;
 let found=false;
 for(const sec of qa('[data-ct274-history]',root)){
  found=true;
  sec.dataset.ct326History='scroll';
  const shell=q('.ct275-history-shell',sec);
  if(shell)shell.setAttribute('aria-hidden','false');
  for(const stack of qa('.ct274-history-stack',sec)){
   stack.setAttribute('aria-hidden','false');
   stack.scrollTop=stack.scrollHeight;
  }
 }
 return found;
}
function scheduleHistory326(){
 cancelAnimationFrame(rafHistory);
 rafHistory=requestAnimationFrame(()=>requestAnimationFrame(restoreHomeHistory326));
}
try{ct274AutoBottom=restoreHomeHistory326}catch{}
document.addEventListener('click',e=>{
 if(e.target?.closest?.('[data-home-tab]'))setTimeout(scheduleHistory326,0);
},true);

function force(el,prop,val){try{el?.style?.setProperty(prop,val,'important')}catch{}}
function compactDiscoverActions326(root=document){
 let count=0;
 for(const row of qa('[data-ct309-foryou] .ct309-actions',root)){
  count++;
  force(row,'display','grid');force(row,'grid-template-columns','repeat(3,minmax(0,1fr))');force(row,'gap','4px');
  force(row,'width','100%');force(row,'align-items','center');force(row,'margin-top','5px');
  for(const b of qa('.chip',row)){
   force(b,'grid-column','auto');force(b,'width','100%');force(b,'min-width','0');force(b,'max-width','none');
   force(b,'height','26px');force(b,'min-height','26px');force(b,'padding','2px 3px');force(b,'font-size','8px');
   force(b,'line-height','1');force(b,'white-space','nowrap');force(b,'overflow','hidden');force(b,'text-overflow','ellipsis');
  }
 }
 for(const row of qa('.ct319-actions',root)){
  count++;
  force(row,'display','grid');force(row,'grid-template-columns','repeat(2,minmax(0,1fr))');force(row,'gap','4px');force(row,'width','100%');
  for(const b of qa('.chip',row)){
   force(b,'width','100%');force(b,'min-width','0');force(b,'height','26px');force(b,'min-height','26px');
   force(b,'padding','2px 4px');force(b,'font-size','8.5px');force(b,'line-height','1');force(b,'white-space','nowrap');
  }
 }
 return count;
}
function scheduleActions326(){
 cancelAnimationFrame(rafActions);
 rafActions=requestAnimationFrame(()=>compactDiscoverActions326(document));
}

try{
 const app=q('#app');
 if(app&&window.MutationObserver)new MutationObserver(()=>{
  if(routeNow()==='home')scheduleHistory326();
  if(routeNow()==='discover')scheduleActions326();
 }).observe(app,{subtree:true,childList:true});
}catch{}
window.addEventListener('cinetracker:data-changed',()=>{
 if(routeNow()==='home')setTimeout(scheduleHistory326,30);
 if(routeNow()==='discover')setTimeout(scheduleActions326,30);
});
setTimeout(()=>{if(routeNow()==='home')scheduleHistory326();if(routeNow()==='discover')scheduleActions326()},0);

const style=document.createElement('style');style.id='ct-web-r326';style.textContent=`
/* Restore the r274 Home history behavior: no toggle, content loaded, newest at the bottom. */
[data-home] [data-ct275-history-toggle],
[data-home] [data-ct324-history-toggle]{display:none!important}
[data-home] [data-ct274-history] .ct275-history-shell,
[data-home] [data-ct274-history].is-collapsed .ct275-history-shell,
[data-home] [data-ct274-history][data-ct324-history="collapsed"] .ct275-history-shell{
 display:block!important;grid-template-rows:none!important;opacity:1!important;transform:none!important;
 overflow:visible!important;pointer-events:auto!important;min-height:0!important
}
[data-home] [data-ct274-history] .ct274-history-stack,
[data-home] [data-ct274-history][data-ct324-history="collapsed"] .ct274-history-stack{
 display:block!important;max-height:min(55vh,520px)!important;overflow-y:auto!important;overflow-x:hidden!important;
 overscroll-behavior:contain!important;scrollbar-gutter:stable!important;padding-right:3px!important
}
[data-home] [data-ct274-history] .ct275-history-head{justify-content:flex-start!important}

/* While Pra voce is being revalidated, never flash a forbidden old draft. */
html[data-ct326-fy-filtering="1"] [data-ct309-foryou]{visibility:hidden!important}

/* Fallback CSS; JS above also applies inline !important to defeat older runtime rules. */
[data-ct309-foryou] .ct309-actions{
 display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:4px!important;width:100%!important
}
[data-ct309-foryou] .ct309-actions .ct309-swap{grid-column:auto!important;width:100%!important}
[data-ct309-foryou] .ct309-actions .chip{height:26px!important;min-height:26px!important;padding:2px 3px!important;font-size:8px!important;white-space:nowrap!important}
.ct319-actions{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:4px!important;width:100%!important}
.ct319-actions .chip{height:26px!important;min-height:26px!important;padding:2px 4px!important;font-size:8.5px!important;white-space:nowrap!important}
`;document.head.appendChild(style);

window.__ctR326={
 restoreHomeHistory:restoreHomeHistory326,compactDiscoverActions:compactDiscoverActions326,
 version:'1.0.117'
};
window.__ctR326Test={restoreHomeHistory326,compactDiscoverActions326};
})();
