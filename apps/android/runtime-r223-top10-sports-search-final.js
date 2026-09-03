/* Android 0.99.7.51 r223 — final Top 10 authority + Sports search/filter cleanup */
(() => {
'use strict';
if(window.__ctAndroidR223Loaded)return;
window.__ctAndroidR223Loaded=true;
window.__ctAndroidR223='top10-direct-r217-sports-search-filter-final';
window.__ctAndroidBundle='android-v0.99.7.51-r223-top10-sports-search-final';
window.__ctR223Top10='direct-r217-final-authority-other-eight-delegate';
window.__ctR223Sports='compact-search-filter-right-remove-central-time';

const norm223=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const route223=()=>{try{return String(route?.()||'')}catch{return String(location.pathname||'/').replace(/^\/+/, '').split('/')[0]||'home'}};
const isDiscover223=()=>route223()==='discover'||String(location.pathname||'').replace(/^\/+/, '').split('/')[0]==='discover';
const isSports223=()=>route223()==='sports'||String(location.pathname||'').replace(/^\/+/, '').split('/')[0]==='sports';

/* Final authority: Top 10 goes straight to the r217 renderer. The other eight tabs keep the existing r214 chain. */
const previousSelect223=typeof window.ct214SelectDiscoverTab==='function'?window.ct214SelectDiscoverTab:null;
async function select223(value,opt={}){
  const key=String(value||'').trim().toLowerCase();
  if(key!=='top10')return previousSelect223?previousSelect223.apply(this,arguments):false;
  if(!isDiscover223())return false;
  try{discoverState.tab='top10';discoverState.type='all'}catch{}
  try{if(opt.advanceNav!==false&&typeof navSeq!=='undefined')++navSeq}catch{}
  if(typeof window.ctR217RenderTop10!=='function')return previousSelect223?previousSelect223.call(this,'top10',opt):false;
  const out=await window.ctR217RenderTop10();
  try{discoverState.tab='top10';discoverState.type='all'}catch{}
  try{document.querySelectorAll('[data-discover-tab]').forEach(b=>{const on=String(b.dataset.discoverTab||'')==='top10';b.classList.toggle('active',on);b.classList.toggle('selected',on);b.setAttribute('aria-selected',on?'true':'false');if(on)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current')})}catch{}
  return out===undefined?true:out;
}
window.ct214SelectDiscoverTab=select223;
window.ctR223SelectDiscover=select223;

/* Capture only Top 10 taps so no older click handler can repaint the previous Discover tab afterwards. */
document.addEventListener('click',e=>{
  const b=e.target.closest?.('[data-discover-tab="top10"]');
  if(!b||!isDiscover223())return;
  e.preventDefault();e.stopImmediatePropagation();
  void select223('top10',{advanceNav:true});
},true);

function sportsRoot223(){return isSports223()?document.querySelector('[data-sports]'):null}
function removeSportsBlocks223(root){
  if(!root)return;
  root.querySelectorAll('[data-sports-central],[data-sports-time],[data-sports-sports-time],.sports-central,.sports-time,.sports-central-card,.sports-time-card').forEach(x=>x.remove());
  for(const h of root.querySelectorAll('h1,h2,h3,h4,.panel-head b,.panel-head strong,.panel-head span,.section-head b,.section-head strong')){
    const t=norm223(h.textContent||'');
    if(t!=='central esportiva'&&t!=='tempo esportivo')continue;
    const box=h.closest('section.panel,.panel,article,section,.card,[class*="panel"],[class*="card"]');
    if(box&&root.contains(box))box.remove();
  }
}
function findSportsSearch223(root){
  const inputs=[...root.querySelectorAll('input')];
  return inputs.find(i=>i.type==='search'||/(busc|pesquis|liga|clube|jogador|esport)/.test(norm223(i.placeholder||i.getAttribute('aria-label')||'')))||null;
}
function findSportsFilter223(root){
  return [...root.querySelectorAll('button,[role="button"]')].find(b=>/(^| )(filtro|filtrar|filtros)( |$)/.test(norm223(`${b.textContent||''} ${b.getAttribute('aria-label')||''} ${b.title||''}`)))||null;
}
function arrangeSports223(){
  const root=sportsRoot223();if(!root)return;
  removeSportsBlocks223(root);
  const input=findSportsSearch223(root),filter=findSportsFilter223(root);if(!input||!filter)return;
  let search=input.closest('.search,.sports-search,[class*="search"]')||input.parentElement;if(!search||search===root)return;
  let row=root.querySelector('[data-ct223-sports-search-row]');
  if(!row){row=document.createElement('div');row.className='ct223-sports-search-row';row.dataset.ct223SportsSearchRow='1';search.parentNode?.insertBefore(row,search)}
  if(search.parentNode!==row)row.appendChild(search);
  if(filter.parentNode!==row)row.appendChild(filter);
  search.classList.add('ct223-sports-search-box');filter.classList.add('ct223-sports-filter-button');
}
try{
  const basePaint223=paintSports;
  paintSports=function(...args){const out=basePaint223.apply(this,args);requestAnimationFrame(arrangeSports223);return out};
}catch{}
try{
  const baseRender223=renderSports;
  renderSports=async function(...args){const out=await baseRender223.apply(this,args);requestAnimationFrame(arrangeSports223);return out};
}catch{}
let timer223=0;
try{new MutationObserver(()=>{if(!isSports223())return;clearTimeout(timer223);timer223=setTimeout(arrangeSports223,30)}).observe(document.querySelector('#app')||document.documentElement,{subtree:true,childList:true})}catch{}
window.addEventListener('popstate',()=>setTimeout(arrangeSports223,0));window.addEventListener('hashchange',()=>setTimeout(arrangeSports223,0));

const style223=document.createElement('style');style223.id='ct-android-099751';style223.textContent=`
[data-sports] .ct223-sports-search-row{display:flex!important;align-items:center!important;gap:6px!important;width:100%!important;min-width:0!important;margin-bottom:8px!important}
[data-sports] .ct223-sports-search-box{flex:1 1 auto!important;min-width:0!important;width:auto!important;margin:0!important}
[data-sports] .ct223-sports-search-box input{width:100%!important;min-width:0!important;height:34px!important;min-height:34px!important;padding-top:5px!important;padding-bottom:5px!important}
[data-sports] .ct223-sports-filter-button{flex:0 0 auto!important;width:auto!important;min-width:38px!important;height:34px!important;min-height:34px!important;margin:0!important;white-space:nowrap!important}
`;
document.getElementById(style223.id)?.remove();document.head.appendChild(style223);
requestAnimationFrame(arrangeSports223);
})();
