/* r190b Web — preserve top-search visibility on profile/settings while hiding it on sports */
(() => {
'use strict';
if (window.__ctR190BWebLoaded) return;
window.__ctR190BWebLoaded=true;
window.__ctR190BWeb='sports-only-global-search-guard';

const route190b=()=>{try{return String(route?.()||'').replace(/^\//,'')}catch{return String(location.pathname||'').replace(/^\//,'')||'home'}};
function enforceTopSearch190b(){
  const r=route190b();
  const hide=r==='sports'||r==='profile'||r==='preferences'||r==='settings';
  try{if(topSearch)topSearch.style.display=hide?'none':''}catch{}
  for(const el of document.querySelectorAll?.('[data-top-search],.top-search,#top-search,.global-search')||[]){
    if(el.closest?.('[data-sports]'))continue;
    el.style.display=hide?'none':'';
  }
}
if(typeof renderTopbar==='function'){
  const base190b=renderTopbar;
  renderTopbar=function(){const out=base190b.apply(this,arguments);enforceTopSearch190b();return out};
}
let timer190b=0;
const obs190b=new MutationObserver(()=>{clearTimeout(timer190b);timer190b=setTimeout(enforceTopSearch190b,35)});
obs190b.observe(document.documentElement,{childList:true,subtree:true});
window.addEventListener('popstate',()=>setTimeout(enforceTopSearch190b,40));
window.addEventListener('hashchange',()=>setTimeout(enforceTopSearch190b,40));
setTimeout(enforceTopSearch190b,40);
})();
