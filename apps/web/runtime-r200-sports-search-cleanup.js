/* Web r200 — Sports search/filter same row + Central/Tempo only in Profile */
(() => {
'use strict';
if(window.__ctR200WebLoaded)return;
window.__ctR200WebLoaded=true;
window.__ctR200Web='sports-search-filter-right-central-time-profile-only';
window.__ctWebRevision='r200-sports-search-cleanup';
window.__ctR200Sports='search-filter-same-row-remove-central-time-from-sports-only';

const norm200=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const path200=()=>String(location.pathname||'/');
const route200=()=>{try{return String(route?.()||'')}catch{return path200().replace(/^\/+/, '').split('/')[0]||'home'}};
const isSports200=()=>route200()==='sports'||path200().replace(/^\/+/, '').split('/')[0]==='sports';
function root200(){return isSports200()?document.querySelector('[data-sports]'):null}
function remove200(root){
  if(!root)return;
  root.querySelectorAll('[data-sports-central],[data-sports-time],[data-sports-sports-time],.sports-central,.sports-time,.sports-central-card,.sports-time-card').forEach(x=>x.remove());
  for(const h of root.querySelectorAll('h1,h2,h3,h4,.panel-head b,.panel-head strong,.panel-head span,.section-head b,.section-head strong')){
    const t=norm200(h.textContent||'');if(t!=='central esportiva'&&t!=='tempo esportivo')continue;
    const box=h.closest('section.panel,.panel,article,section,.card,[class*="panel"],[class*="card"]');if(box&&root.contains(box))box.remove();
  }
}
function search200(root){
  return [...root.querySelectorAll('input')].find(i=>i.type==='search'||/(busc|pesquis|liga|clube|jogador|esport)/.test(norm200(i.placeholder||i.getAttribute('aria-label')||'')))||null;
}
function filter200(root){
  return [...root.querySelectorAll('button,[role="button"]')].find(b=>/(^| )(filtro|filtrar|filtros)( |$)/.test(norm200(`${b.textContent||''} ${b.getAttribute('aria-label')||''} ${b.title||''}`)))||null;
}
function arrange200(){
  const root=root200();if(!root)return;remove200(root);
  const input=search200(root),filter=filter200(root);if(!input||!filter)return;
  const search=input.closest('.search,.sports-search,[class*="search"]')||input.parentElement;if(!search||search===root)return;
  let row=root.querySelector('[data-ct200-sports-search-row]');
  if(!row){row=document.createElement('div');row.className='ct200-sports-search-row';row.dataset.ct200SportsSearchRow='1';search.parentNode?.insertBefore(row,search)}
  if(search.parentNode!==row)row.appendChild(search);if(filter.parentNode!==row)row.appendChild(filter);
  search.classList.add('ct200-sports-search-box');filter.classList.add('ct200-sports-filter-button');
}
try{const base=paintSports;paintSports=function(...args){const out=base.apply(this,args);requestAnimationFrame(arrange200);return out}}catch{}
try{const base=renderSports;renderSports=async function(...args){const out=await base.apply(this,args);requestAnimationFrame(arrange200);return out}}catch{}
let timer200=0;try{new MutationObserver(()=>{if(!isSports200())return;clearTimeout(timer200);timer200=setTimeout(arrange200,30)}).observe(document.querySelector('#app')||document.documentElement,{subtree:true,childList:true})}catch{}
window.addEventListener('popstate',()=>setTimeout(arrange200,0));window.addEventListener('hashchange',()=>setTimeout(arrange200,0));
const style=document.createElement('style');style.id='ct-web-r200-sports';style.textContent=`
[data-sports] .ct200-sports-search-row{display:flex!important;align-items:center!important;gap:8px!important;width:100%!important;min-width:0!important;margin-bottom:10px!important}
[data-sports] .ct200-sports-search-box{flex:1 1 auto!important;min-width:0!important;width:auto!important;margin:0!important}
[data-sports] .ct200-sports-search-box input{width:100%!important;min-width:0!important}
[data-sports] .ct200-sports-filter-button{flex:0 0 auto!important;width:auto!important;margin:0!important;white-space:nowrap!important;align-self:stretch!important}
`;document.getElementById(style.id)?.remove();document.head.appendChild(style);
requestAnimationFrame(arrange200);
})();
