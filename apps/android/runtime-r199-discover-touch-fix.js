/* Android 0.99.7.27 — restore navigation + Discover horizontal touch */
(() => {
'use strict';
if(window.__ctAndroidR199Loaded)return;
window.__ctAndroidR199Loaded=true;
window.__ctAndroidR199='restore-route-render-and-discover-pan-x';
window.__ctAndroidDiscoverTouch='subtabs-clickable-horizontal-native-pan';

/* r198 wrapped render() to suppress a foreground repaint. That wrapper can also swallow
   a legitimate navigation/filter render. Rebuild the canonical dispatcher: navigation
   must always win over performance throttling. */
render=async function(){
  const seq=++navSeq,r=route();
  if(r==='auth'){await renderAuth();return}
  if(!session){history.replaceState({},'','/');await renderAuth();return}
  if(r==='home')return renderHome(seq);
  if(r==='discover')return renderDiscover(seq);
  if(r==='sports')return renderSports(seq);
  if(r==='profile')return renderProfile(seq);
  if(r==='configs')return renderConfigs(seq);
  const id=Number(location.pathname.match(/\d+/)?.[0]||0);
  if(r==='movie'||r==='series')return renderDetail(r,id,seq);
  if(r==='person')return renderPerson(id,seq);
  go('/home',true);
};
window.__ctAndroidRenderPolicy='navigation-never-throttled';

/* The r180 Discover rail already owns horizontal scrolling. r198 added a generic button
   touch rule; on Android WebView that can steal the initial gesture when it begins over a
   chip. Give the rail and every child chip one explicit horizontal gesture contract and
   remove snap/animated scrolling during finger interaction. */
const style=document.createElement('style');
style.id='ct-android-099727-discover-touch';
style.textContent=`
[data-page="discover"] .ct-r180-tab-shell{min-width:0!important;max-width:100%!important;overflow:visible!important}
[data-page="discover"] .ct-r180-tabs,
[data-page="discover"] [data-ct-r180-tabs],
[data-page="discover"]>.tabs,
[data-page="discover"] [data-discover]>.tabs{
  display:flex!important;flex-wrap:nowrap!important;min-width:0!important;max-width:100%!important;
  overflow-x:scroll!important;overflow-y:hidden!important;-webkit-overflow-scrolling:touch!important;
  touch-action:pan-x!important;scroll-snap-type:none!important;scroll-behavior:auto!important;
  overscroll-behavior-x:auto!important;pointer-events:auto!important;
}
[data-page="discover"] .ct-r180-tabs>.chip,
[data-page="discover"] [data-ct-r180-tabs]>.chip,
[data-page="discover"] .tabs>[data-discover-tab]{
  flex:0 0 auto!important;touch-action:pan-x!important;pointer-events:auto!important;user-select:none!important;
  -webkit-user-select:none!important;-webkit-tap-highlight-color:transparent!important;
}
[data-page="discover"] .ct-r180-type-filters,
[data-page="discover"] .filters{
  overflow-x:auto!important;overflow-y:hidden!important;-webkit-overflow-scrolling:touch!important;
  touch-action:pan-x!important;scroll-snap-type:none!important;scroll-behavior:auto!important;
}
[data-page="discover"] .ct-r180-type-filters>.chip,
[data-page="discover"] .filters>.chip{touch-action:pan-x!important;flex:0 0 auto!important}
`;
document.head.appendChild(style);

/* Keep the active chip visible after an actual tab change, but do it instantly so the
   browser never fights a smooth scroll animation started while the user is touching. */
function exposeActive(){
  const rail=document.querySelector('[data-ct-r180-tabs],[data-page="discover"] .tabs');
  const active=rail?.querySelector('[data-discover-tab].active');
  if(!rail||!active)return;
  const left=active.offsetLeft-Math.max(0,(rail.clientWidth-active.offsetWidth)/2);
  rail.scrollTo({left:Math.max(0,left),behavior:'auto'});
}
try{
  const baseRenderDiscover=renderDiscover;
  renderDiscover=async function(seq){const out=await baseRenderDiscover(seq);if(seq===navSeq&&route()==='discover')requestAnimationFrame(exposeActive);return out};
}catch{}

/* Visual feedback must be immediate even before cached/network content paints. */
document.addEventListener('pointerdown',e=>{
  const b=e.target.closest?.('[data-discover-tab],[data-discover-type]');
  if(!b)return;
  const group=b.hasAttribute('data-discover-tab')?'[data-discover-tab]':'[data-discover-type]';
  b.parentElement?.querySelectorAll(group).forEach(x=>x.classList.toggle('active',x===b));
},{passive:true,capture:true});
})();
