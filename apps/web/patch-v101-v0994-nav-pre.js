(() => {
'use strict';
if (window.__ct0994NavPreLoaded) return;
window.__ct0994NavPreLoaded = true;
window.__ct0994NavPre = 'web-0.99.4-desktop-navigation-pre';

const style = document.createElement('style');
style.id = 'ct0994-desktop-input-fix';
style.textContent = `
@media (min-width:851px){
  .app{position:relative!important;isolation:isolate!important;grid-template-columns:180px minmax(0,1fr)!important}
  .sidebar{position:sticky!important;top:0!important;z-index:9999!important;pointer-events:auto!important;overflow:visible!important}
  .sidebar .nav{position:relative!important;z-index:10000!important;pointer-events:auto!important}
  .sidebar .nav button,.sidebar .nav a,.sidebar-item{position:relative!important;z-index:10001!important;pointer-events:auto!important;cursor:pointer!important}
  .content{position:relative!important;z-index:1!important;min-width:0!important;isolation:isolate!important}
}
.sidebar,.sidebar .nav,.sidebar button,.sidebar a,.mobile-nav,.mobile-nav button,.mobile-nav a{pointer-events:auto!important}
.sidebar button,.sidebar a,.mobile-nav button,.mobile-nav a{cursor:pointer!important}
.sidebar [data-view="history"],.sidebar [data-view99="history"],.sidebar [data-view991="history"],
.mobile-nav [data-view="history"],.mobile-nav [data-view99="history"],.mobile-nav [data-view991="history"]{display:none!important;pointer-events:none!important}
`;
document.getElementById(style.id)?.remove();
document.head.appendChild(style);

function normalize994(value){
  const target=String(value||'').toLowerCase();
  return target==='history'?'profile':target;
}
function routeFrom994(button){
  return normalize994(button?.dataset?.view||button?.dataset?.view99||button?.dataset?.view991||'');
}

window.addEventListener('click',event=>{
  const button=event.target?.closest?.('.sidebar .nav button,.sidebar .nav a,.mobile-nav button,.mobile-nav a');
  if(!button)return;
  const target=routeFrom994(button);
  if(!['home','discover','profile','settings'].includes(target))return;
  const navigate=window.__ct0994Navigate;
  if(typeof navigate!=='function')return;
  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();
  Promise.resolve(navigate(target)).catch(error=>console.error('[CineTracker 0.99.4] navigation',error));
},true);

window.__ct0994HitTest=()=>{
  const result={};
  for(const target of ['profile','settings']){
    const button=[...document.querySelectorAll('.sidebar .nav button,.sidebar .nav a')].find(el=>routeFrom994(el)===target);
    if(!button){result[target]={found:false};continue;}
    const rect=button.getBoundingClientRect();
    const x=rect.left+rect.width/2,y=rect.top+rect.height/2;
    const stack=(document.elementsFromPoint?.(x,y)||[]).slice(0,6);
    const css=getComputedStyle(button);
    result[target]={
      found:true,x,y,
      pointerEvents:css.pointerEvents,
      zIndex:css.zIndex,
      topTag:stack[0]?.tagName||null,
      topText:String(stack[0]?.textContent||'').trim().slice(0,60),
      topIsButton:stack[0]===button||button.contains(stack[0]),
      stack:stack.map(el=>({tag:el.tagName,cls:el.className||'',text:String(el.textContent||'').trim().slice(0,40)}))
    };
  }
  return result;
};
})();
