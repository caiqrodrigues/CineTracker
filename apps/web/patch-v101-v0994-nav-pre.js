(() => {
'use strict';
if (window.__ct0994NavPreLoaded) return;
window.__ct0994NavPreLoaded = true;
window.__ct0994NavPre = 'web-0.99.4-desktop-navigation-hard-fix';

const DESKTOP_MIN = 851;
const SIDEBAR_WIDTH = 180;
const style = document.createElement('style');
style.id = 'ct0994-desktop-input-fix';
style.textContent = `
@media (min-width:${DESKTOP_MIN}px){
  html,body{overflow-x:hidden!important}
  .app{display:block!important;position:relative!important;min-height:100vh!important;isolation:isolate!important}
  .sidebar{
    display:flex!important;
    position:fixed!important;
    left:0!important;top:0!important;bottom:0!important;
    width:${SIDEBAR_WIDTH}px!important;height:100vh!important;
    min-width:${SIDEBAR_WIDTH}px!important;max-width:${SIDEBAR_WIDTH}px!important;
    z-index:2147483000!important;
    pointer-events:auto!important;
    overflow:visible!important;
    transform:none!important;
    isolation:isolate!important;
  }
  .sidebar::before{
    content:'';position:absolute;inset:0;z-index:-1;background:#0d0d0d;pointer-events:none!important;
  }
  .sidebar .nav,.sidebar .profile{position:relative!important;z-index:2147483001!important;pointer-events:auto!important}
  .sidebar .nav button,.sidebar .nav a,.sidebar .profile button,.sidebar-item{
    position:relative!important;z-index:2147483002!important;
    pointer-events:auto!important;cursor:pointer!important;
    touch-action:manipulation!important;
  }
  .content{
    position:relative!important;
    left:auto!important;right:auto!important;
    margin-left:${SIDEBAR_WIDTH}px!important;
    width:calc(100% - ${SIDEBAR_WIDTH}px)!important;
    max-width:none!important;
    min-width:0!important;
    z-index:1!important;
    transform:none!important;
    isolation:isolate!important;
  }
  body>.overlay,body>[class*="overlay"],.app>[class*="overlay"]{z-index:2147482990!important}
}
.sidebar,.sidebar .nav,.sidebar .profile,.sidebar button,.sidebar a,.mobile-nav,.mobile-nav button,.mobile-nav a{pointer-events:auto!important}
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
function desktop(){return window.innerWidth>=DESKTOP_MIN}
function navButtonFromEvent(event){
  return event.target?.closest?.('.sidebar .nav button,.sidebar .nav a,.mobile-nav button,.mobile-nav a')||null;
}
function navigate994(target,event){
  if(!['home','discover','profile','settings'].includes(target))return false;
  const navigate=window.__ct0994Navigate;
  if(typeof navigate!=='function')return false;
  event?.preventDefault?.();
  event?.stopPropagation?.();
  event?.stopImmediatePropagation?.();
  Promise.resolve(navigate(target)).catch(error=>console.error('[CineTracker 0.99.4] navigation',error));
  return true;
}

/* Perfil/Configurações são resolvidos já no pointerdown em desktop. Isso acontece antes do click
   e antes dos listeners legados, eliminando interceptação por containers/overlays posteriores. */
window.addEventListener('pointerdown',event=>{
  if(!desktop())return;
  const button=navButtonFromEvent(event);if(!button)return;
  const target=routeFrom994(button);
  if(target!=='profile'&&target!=='settings')return;
  navigate994(target,event);
},true);

window.addEventListener('click',event=>{
  const button=navButtonFromEvent(event);if(!button)return;
  const target=routeFrom994(button);
  if(!['home','discover','profile','settings'].includes(target))return;
  navigate994(target,event);
},true);

window.__ct0994HitTest=()=>{
  const result={desktop:desktop(),viewport:{width:innerWidth,height:innerHeight}};
  for(const target of ['profile','settings']){
    const button=[...document.querySelectorAll('.sidebar .nav button,.sidebar .nav a')].find(el=>routeFrom994(el)===target);
    if(!button){result[target]={found:false};continue;}
    const rect=button.getBoundingClientRect();
    const x=rect.left+rect.width/2,y=rect.top+rect.height/2;
    const stack=(document.elementsFromPoint?.(x,y)||[]).slice(0,10);
    const css=getComputedStyle(button),sidebar=getComputedStyle(button.closest('.sidebar'));
    result[target]={
      found:true,x,y,rect:{left:rect.left,top:rect.top,right:rect.right,bottom:rect.bottom,width:rect.width,height:rect.height},
      pointerEvents:css.pointerEvents,zIndex:css.zIndex,sidebarPointerEvents:sidebar.pointerEvents,sidebarZIndex:sidebar.zIndex,
      topTag:stack[0]?.tagName||null,topText:String(stack[0]?.textContent||'').trim().slice(0,60),
      topIsButton:stack[0]===button||button.contains(stack[0]),
      stack:stack.map(el=>({tag:el.tagName,cls:el.className||'',text:String(el.textContent||'').trim().slice(0,40),z:getComputedStyle(el).zIndex,p:getComputedStyle(el).pointerEvents}))
    };
  }
  return result;
};
})();
