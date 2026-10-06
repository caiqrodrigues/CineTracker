/* CineTracker Web 0.3.11 r484 — final owner convergence and bounded first-paint wake. */
(()=>{
'use strict';
if(window.__ctR484?.version==='0.3.11')return;
const q=(s,r=document)=>r?.querySelector?.(s)||null;
const routeNow=()=>{try{return String(window.__ctCoreR471?.route?.()||'')}catch{return''}};
for(const g of ['watch','fresh'])for(const k of ['movie','series','anime'])try{localStorage.removeItem('ct481:foryou:'+g+':'+k)}catch{}
let wakeSeq=0;
function wakeHome(kind='series'){
 const k=kind==='movies'?'movies':'series',seq=++wakeSeq;
 for(const ms of [0,40,120,280,600,1200])setTimeout(()=>{
  if(seq!==wakeSeq)return;
  const p=String(location.pathname||'/').replace(/\/+$/,'')||'/';
  if(routeNow()!=='home'&&p!=='/'&&p!=='/home')return;
  try{window.__ctR481?.prime?.(k)}catch{}
  try{window.__ctR477?.bootHome?.(k)}catch{}
 },ms);
 return true
}
window.addEventListener('pointerdown',e=>{
 const nav=e.target?.closest?.('[data-nav="home"]');if(nav){wakeHome('series');return}
 const tab=e.target?.closest?.('[data-home-tab]');if(tab)wakeHome(String(tab.dataset.homeTab||'series')==='movies'?'movies':'series');
},{capture:true,passive:true});
const p=String(location.pathname||'/').replace(/\/+$/,'')||'/';
if(routeNow()==='home'||p==='/'||p==='/home')wakeHome(q('[data-home-tab].active')?.dataset?.homeTab==='movies'?'movies':'series');
window.__ctR484Marker='single-owners+home-live+discover-v484+profile-v484-12';
window.__ctR484={version:'0.3.11',scope:'home+discover+profile',wakeHome};
})();
