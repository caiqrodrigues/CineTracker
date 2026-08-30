(() => {
'use strict';
if(window.__ct0997MobileShell144Loaded)return;
window.__ct0997MobileShell144Loaded=true;
window.__ct0997MobileShell144='r144-mobile-pwa-shell';

const ua=String(navigator.userAgent||'');
const touch=Number(navigator.maxTouchPoints||0)>0||matchMedia('(pointer: coarse)').matches;
function physicalShortSide(){
  const vals=[screen?.width,screen?.height,screen?.availWidth,screen?.availHeight].map(Number).filter(v=>Number.isFinite(v)&&v>0);
  return vals.length?Math.min(...vals):Math.min(Number(innerWidth||0),Number(innerHeight||0));
}
function isPhoneSurface(){
  const short=physicalShortSide();
  const mobileUA=/Android|iPhone|iPod|Mobile/i.test(ua);
  return touch&&(mobileUA||short>0&&short<=900);
}
function enforceViewport(){
  let meta=document.querySelector('meta[name="viewport"]');
  if(!meta){meta=document.createElement('meta');meta.name='viewport';document.head.appendChild(meta)}
  meta.setAttribute('content','width=device-width, initial-scale=1, viewport-fit=cover');
}
function applyShell(){
  enforceViewport();
  document.documentElement.classList.toggle('ct144-phone',isPhoneSurface());
  document.documentElement.dataset.ct144Surface=isPhoneSurface()?'phone':'desktop';
}

const style=document.createElement('style');
style.id='ct0997-mobile-shell-144-style';
style.textContent=`
html.ct144-phone,html.ct144-phone body,html.ct144-phone #app{width:100%!important;max-width:100%!important;min-width:0!important;overflow-x:hidden!important}
html.ct144-phone body{margin:0!important}
html.ct144-phone #app>.app,html.ct144-phone .app{display:block!important;grid-template-columns:minmax(0,1fr)!important;width:100%!important;max-width:100%!important;min-width:0!important;margin:0!important}
html.ct144-phone .sidebar{display:none!important;width:0!important;max-width:0!important;min-width:0!important;height:0!important;overflow:hidden!important}
html.ct144-phone .content{box-sizing:border-box!important;width:100%!important;max-width:100%!important;min-width:0!important;margin:0!important;padding:12px 12px calc(78px + env(safe-area-inset-bottom))!important;overflow-x:hidden!important}
html.ct144-phone .header,html.ct144-phone .section,html.ct144-phone .panel,html.ct144-phone .ct992-shell,html.ct144-phone #ct136-home,html.ct144-phone #ct136-profile,html.ct144-phone #ct120-discover,html.ct144-phone .ct91-settings{max-width:100%!important;min-width:0!important}
html.ct144-phone .mobile-nav{display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:4px!important;position:fixed!important;left:0!important;right:0!important;bottom:0!important;z-index:2147481000!important;width:100%!important;max-width:100%!important;margin:0!important;padding:8px 6px max(8px,env(safe-area-inset-bottom))!important;background:#071018f5!important;border-top:1px solid #24485c!important;box-shadow:0 -8px 24px #0009!important}
html.ct144-phone .mobile-nav a,html.ct144-phone .mobile-nav button{display:flex!important;align-items:center!important;justify-content:center!important;min-width:0!important;max-width:100%!important;min-height:44px!important;margin:0!important;padding:8px 3px!important;border-radius:10px!important;text-align:center!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;font-size:11px!important;touch-action:manipulation!important}
html.ct144-phone .mobile-nav a.active,html.ct144-phone .mobile-nav button.active{background:#0d2a3a!important;border-color:#2e769d!important;color:#72c9ff!important}
@media(max-width:900px){html:not(.ct144-phone) .app{grid-template-columns:1fr!important}}
`;
document.getElementById(style.id)?.remove();
document.head.appendChild(style);
applyShell();
addEventListener('resize',applyShell,{passive:true});
addEventListener('orientationchange',()=>setTimeout(applyShell,60),{passive:true});
window.__ct144ApplyMobileShell=applyShell;
})();
