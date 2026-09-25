/* CineTracker Web 1.0.162 r371 — user-owned Home tab; async repaints cannot reset movies to series. */
(()=>{
'use strict';
if(window.__ctR371?.version==='1.0.162')return;
window.__ctR371Marker='home-tab-user-only+repaint-preserved+async-generation-cancel';
const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const routeNow=()=>{try{return String(typeof route==='function'?route():'')}catch{return''}};
const tabRef={current:'series'};
let tabGeneration=0,tabController=new AbortController(),userSelected=false,applyCount=0,cancelCount=0;

function visibleTab(){
 const root=q('[data-home]');
 const active=q('[data-home-tab].active',root)||qa('[data-home-view]',root).find(v=>!v.hidden&&!v.classList.contains('hidden'));
 const raw=active?.dataset?.homeTab||active?.dataset?.homeView;
 return raw==='movies'?'movies':'series';
}
function desiredTab(){return userSelected?tabRef.current:visibleTab()}
function applyTab(kind=desiredTab(),generation=tabGeneration){
 if(routeNow()!=='home'||generation!==tabGeneration)return false;
 const root=q('[data-home]');if(!root)return false;
 const wanted=kind==='movies'?'movies':'series';
 root.dataset.ct371HomeTab=wanted;
 try{ct266HomeTab=wanted}catch{}
 qa('[data-home-tab]',root).forEach(b=>{
  const on=String(b.dataset.homeTab||'series')===wanted;
  b.classList.toggle('active',on);b.setAttribute('aria-selected',on?'true':'false');b.type='button';
 });
 qa('[data-home-view]',root).forEach(v=>{
  const on=String(v.dataset.homeView||'series')===wanted;
  v.hidden=!on;v.classList.toggle('hidden',!on);
 });
 applyCount++;return true;
}
function cancelPreviousHomeWork(){
 try{tabController.abort()}catch{}
 tabController=new AbortController();tabGeneration++;cancelCount++;
 try{window.__ctR332CancelHomeAsync?.()}catch{}
 return{generation:tabGeneration,signal:tabController.signal};
}
function selectByUser(kind){
 const wanted=kind==='movies'?'movies':'series';
 userSelected=true;tabRef.current=wanted;
 const ticket=cancelPreviousHomeWork();
 applyTab(wanted,ticket.generation);
 requestAnimationFrame(()=>applyTab(wanted,ticket.generation));
 return ticket;
}
function preserveAfterPaint(){
 const wanted=desiredTab(),generation=tabGeneration;
 applyTab(wanted,generation);
 queueMicrotask(()=>applyTab(wanted,generation));
 requestAnimationFrame(()=>applyTab(wanted,generation));
}
function wrapSyncPaint(){
 try{
  const base=paintHome;
  paintHome=function(){const out=base.apply(this,arguments);preserveAfterPaint();return out};
 }catch{}
 try{
  const base=ct275PaintHome;
  ct275PaintHome=function(){const out=base.apply(this,arguments);preserveAfterPaint();return out};
 }catch{}
 try{
  const base=ct274PaintHome;
  ct274PaintHome=function(){const out=base.apply(this,arguments);preserveAfterPaint();return out};
 }catch{}
}
function wrapRender(){
 try{
  const base=renderHome;
  renderHome=async function(){
   const generation=tabGeneration,wanted=desiredTab();
   const out=await base.apply(this,arguments);
   if(generation===tabGeneration)applyTab(wanted,generation);
   else applyTab(desiredTab(),tabGeneration);
   return out;
  };
 }catch{}
}
window.addEventListener('click',e=>{
 const tab=e.target?.closest?.('[data-home-tab]');
 if(!tab||routeNow()!=='home')return;
 selectByUser(String(tab.dataset.homeTab||'series'));
},true);

wrapSyncPaint();wrapRender();
setTimeout(()=>{if(routeNow()==='home'){if(!userSelected)tabRef.current=visibleTab();preserveAfterPaint()}},0);

window.__ctR371={
 version:'1.0.162',selectByUser,applyTab,preserveAfterPaint,cancelPreviousHomeWork,
 get activeTab(){return desiredTab()},get userSelected(){return userSelected},get generation(){return tabGeneration},
 get signal(){return tabController.signal},get applyCount(){return applyCount},get cancelCount(){return cancelCount}
};
window.__ctR371Test={
 selectByUser,applyTab,preserveAfterPaint,cancelPreviousHomeWork,
 reset(){try{tabController.abort()}catch{};tabController=new AbortController();tabGeneration=0;tabRef.current='series';userSelected=false;applyCount=0;cancelCount=0},
 get activeTab(){return desiredTab()},get generation(){return tabGeneration},get signal(){return tabController.signal},get applyCount(){return applyCount},get cancelCount(){return cancelCount}
};
})();