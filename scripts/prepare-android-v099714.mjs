import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';

const root=resolve(process.cwd());
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v099713.mjs')],{cwd:root,stdio:'inherit'});

const indexPath=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(indexPath,'utf8');
const scriptMarker='<script data-ct-android="r179-js">';
const a=html.indexOf(scriptMarker),b=a<0?-1:html.indexOf('</script>',a+scriptMarker.length);
if(a<0||b<a)throw new Error('Android 0.99.7.14: embedded r179 JS missing');
let js=html.slice(a+scriptMarker.length,b);
if(!js.includes("const REVISION='r179-home-target-card';"))throw new Error('Android 0.99.7.14 requires frozen Web r179');
if(!js.includes("window.__ctR179='home-target-card-by-media-id';"))throw new Error('Android 0.99.7.14 missing r179 Home authority');
if(!js.includes('\nboot();'))throw new Error('Android 0.99.7.14 boot insertion missing');

const androidRuntime=String.raw`
window.__ctAndroidBundle='android-v0.99.7.14-r179-immersive-detail-nav';
window.__ctAndroidWebRevision='r179-home-target-card';
window.__ctAndroidUi='persistent-five-tab-nav-immersive-poster-compact-where';
window.__ctAndroidDetail='poster-first-no-detail-header';
window.__ctAndroidWhere='compact-provider-icons';
window.__ctAndroidNav='always-visible-five-tabs';

function ct180AndroidActiveRoute(r){
  if(r==='movie'||r==='series'||r==='person')return'discover';
  if(r==='settings')return'configs';
  return ['home','discover','sports','profile','configs'].includes(r)?r:'home';
}
function ct180AndroidBack(){
  try{if(window.ct48Back&&window.ct48Back())return}catch{}
  try{if(history.length>1){history.back();return}}catch{}
  try{go('home')}catch{}
}
function ct180EnsureBottomNav(r){
  if(!session||r==='auth')return;
  const content=document.querySelector('.content');if(!content)return;
  let nav=content.querySelector('.mobile-nav')||document.querySelector('.mobile-nav');
  const active=ct180AndroidActiveRoute(r);
  if(!nav){nav=document.createElement('nav');nav.className='mobile-nav';content.appendChild(nav)}
  nav.classList.add('ct180-mobile-nav');
  nav.setAttribute('aria-label','Navegação principal');
  nav.removeAttribute('hidden');nav.removeAttribute('aria-hidden');
  nav.innerHTML=navHtml(active);
}
function ct180EnsureDetailBack(r){
  document.querySelectorAll('.ct180-detail-back').forEach((x,i)=>{if(i)x.remove()});
  const detail=r==='movie'||r==='series';
  if(!detail){document.querySelector('.ct180-detail-back')?.remove();return}
  if(document.querySelector('.ct180-detail-back'))return;
  const content=document.querySelector('.content');if(!content)return;
  const back=document.createElement('button');back.type='button';back.className='ct180-detail-back';back.setAttribute('aria-label','Voltar');back.textContent='←';
  back.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();ct180AndroidBack()});content.appendChild(back);
}
function ct180AndroidCompose(){
  const r=route();
  document.body.classList.toggle('ct180-immersive-detail',r==='movie'||r==='series');
  document.body.classList.toggle('ct180-auth',r==='auth');
  document.body.dataset.ctAndroidRoute=r;
  ct180EnsureBottomNav(r);ct180EnsureDetailBack(r);
}
const ct180AndroidSetAppBase=setApp;
setApp=function(markup){ct180AndroidSetAppBase(markup);requestAnimationFrame(ct180AndroidCompose)};
window.addEventListener('popstate',()=>requestAnimationFrame(ct180AndroidCompose));
window.addEventListener('resize',()=>requestAnimationFrame(ct180AndroidCompose));
setTimeout(ct180AndroidCompose,0);
`;
js=js.replace('\nboot();','\n'+androidRuntime+'\nboot();');
html=html.slice(0,a+scriptMarker.length)+js+html.slice(b);

const css=String.raw`
/* Android 0.99.7.14 — persistent tabs + Bingers-inspired immersive detail. Web r179 is untouched. */
:root{--ct180-nav-h:66px;--ct180-side:14px}
html,body,#app,.app{width:100%!important;max-width:100%!important;overflow-x:hidden!important}
body:not(.ct180-auth) .content{padding-bottom:calc(var(--ct180-nav-h) + env(safe-area-inset-bottom) + 14px)!important}

/* Five navigation tabs must never disappear inside the APK. */
html body:not(.ct180-auth) .mobile-nav.ct180-mobile-nav{
  display:grid!important;visibility:visible!important;opacity:1!important;pointer-events:auto!important;
  position:fixed!important;left:0!important;right:0!important;bottom:0!important;top:auto!important;
  z-index:2147483000!important;grid-template-columns:repeat(5,minmax(0,1fr))!important;
  min-height:var(--ct180-nav-h)!important;margin:0!important;padding:6px 5px calc(6px + env(safe-area-inset-bottom))!important;
  border:0!important;border-top:1px solid #17394b!important;border-radius:0!important;
  background:rgba(3,10,15,.96)!important;box-shadow:0 -10px 30px rgba(0,0,0,.34)!important;
  backdrop-filter:blur(16px)!important;-webkit-backdrop-filter:blur(16px)!important;transform:none!important
}
html body .mobile-nav.ct180-mobile-nav a{display:flex!important;min-width:0!important;min-height:48px!important;align-items:center!important;justify-content:center!important;text-align:center!important;padding:7px 2px!important;border-radius:12px!important;font-size:9.5px!important;line-height:1.15!important;color:#8fa8b6!important;text-decoration:none!important;white-space:normal!important}
html body .mobile-nav.ct180-mobile-nav a.active{background:#0d2c3e!important;color:#eaf8ff!important;box-shadow:inset 0 0 0 1px #2d6f90!important}

/* Film/series screen: poster first, no CineTracker/Detalhes/search preamble. */
body.ct180-immersive-detail .search-global,body.ct180-immersive-detail .header,body.ct180-immersive-detail .ct169-back{display:none!important}
body.ct180-immersive-detail .content{padding-left:0!important;padding-right:0!important;padding-top:0!important;padding-bottom:calc(var(--ct180-nav-h) + env(safe-area-inset-bottom) + 18px)!important}
body.ct180-immersive-detail .page{display:block!important;width:100%!important;max-width:100%!important;margin:0!important;padding:0!important;gap:0!important}
body.ct180-immersive-detail .ct169-detail-backdrop{display:none!important}
body.ct180-immersive-detail .ct169-detail-hero.ct173-detail-window,body.ct180-immersive-detail .ct169-detail-hero{
  display:block!important;width:100%!important;max-width:100%!important;min-width:0!important;margin:0!important;padding:0 0 8px!important;
  border:0!important;border-radius:0!important;background:#03090d!important;box-shadow:none!important;overflow:visible!important
}
body.ct180-immersive-detail .ct169-poster-wrap{display:block!important;position:relative!important;width:100%!important;max-width:none!important;min-width:0!important;margin:0!important;padding:0!important;border:0!important;border-radius:0 0 22px 22px!important;overflow:hidden!important;background:#020608!important}
body.ct180-immersive-detail .ct169-detail-poster{display:block!important;width:100%!important;max-width:none!important;min-width:0!important;height:auto!important;aspect-ratio:2/3!important;margin:0!important;border:0!important;border-radius:0 0 22px 22px!important;background-size:cover!important;background-position:center top!important;box-shadow:none!important}
body.ct180-immersive-detail .ct169-poster-state{left:var(--ct180-side)!important;right:auto!important;bottom:14px!important;top:auto!important;border-radius:999px!important;padding:7px 11px!important;box-shadow:0 8px 18px rgba(0,0,0,.4)!important}
body.ct180-immersive-detail .ct169-detail-copy{width:100%!important;max-width:none!important;min-width:0!important;padding:18px var(--ct180-side) 10px!important;text-align:left!important;overflow:visible!important}
body.ct180-immersive-detail .ct169-kicker{font-size:10px!important;letter-spacing:.14em!important;margin-bottom:5px!important}
body.ct180-immersive-detail .ct169-detail-copy h1{font-size:clamp(27px,8.6vw,38px)!important;line-height:1.02!important;letter-spacing:-.035em!important;margin:2px 0 8px!important;overflow-wrap:anywhere!important}
body.ct180-immersive-detail .ct169-by{font-size:11px!important;margin:0 0 8px!important}
body.ct180-immersive-detail .ct169-meta{font-size:10px!important;line-height:1.45!important;white-space:normal!important;overflow-wrap:anywhere!important}
body.ct180-immersive-detail .ct169-detail-copy p{display:block!important;overflow:visible!important;-webkit-line-clamp:unset!important;font-size:12px!important;line-height:1.5!important;margin:14px 0 16px!important;color:#b4c6cf!important}
body.ct180-immersive-detail .ct169-main-actions{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:8px!important;width:100%!important;margin:0!important}
body.ct180-immersive-detail .ct169-main-actions button{width:100%!important;min-width:0!important;min-height:44px!important;padding:8px 5px!important;border-radius:13px!important;font-size:9.5px!important;line-height:1.2!important}
body.ct180-immersive-detail .ct169-providers{display:none!important}

/* Floating back control over the artwork, like a native detail screen. */
.ct180-detail-back{display:grid!important;place-items:center!important;position:fixed!important;left:12px!important;top:12px!important;z-index:2147482990!important;width:46px!important;height:46px!important;padding:0!important;border:1px solid rgba(255,255,255,.12)!important;border-radius:50%!important;background:rgba(1,5,8,.72)!important;color:white!important;box-shadow:0 8px 24px rgba(0,0,0,.35)!important;backdrop-filter:blur(10px)!important;-webkit-backdrop-filter:blur(10px)!important;font-size:27px!important;line-height:1!important}

/* Onde assistir becomes one compact native-like strip, not a large panel. */
body.ct180-immersive-detail .ct171-watch-section{width:auto!important;max-width:none!important;margin:8px var(--ct180-side) 12px!important;padding:13px 0!important;border-left:0!important;border-right:0!important;border-radius:0!important;background:transparent!important;box-shadow:none!important;overflow:hidden!important}
body.ct180-immersive-detail .ct171-watch-head{display:block!important;margin:0 0 9px!important;padding:0!important}
body.ct180-immersive-detail .ct171-watch-head h2{font-size:18px!important;line-height:1.2!important;margin:0!important}
body.ct180-immersive-detail .ct171-justwatch,body.ct180-immersive-detail .ct171-watch-head>a{display:none!important}
body.ct180-immersive-detail .ct171-provider-row{display:flex!important;flex-wrap:nowrap!important;gap:11px!important;width:100%!important;max-width:100%!important;margin:0!important;padding:0 0 2px!important;overflow-x:auto!important;overflow-y:hidden!important;-webkit-overflow-scrolling:touch!important;scrollbar-width:none!important}
body.ct180-immersive-detail .ct171-provider-row::-webkit-scrollbar{display:none!important}
body.ct180-immersive-detail .ct171-provider-card{display:block!important;flex:0 0 48px!important;width:48px!important;min-width:48px!important;max-width:48px!important;min-height:48px!important;height:48px!important;margin:0!important;padding:0!important;border:0!important;border-radius:11px!important;background:transparent!important;box-shadow:none!important;overflow:hidden!important}
body.ct180-immersive-detail .ct171-provider-logo{display:block!important;width:48px!important;height:48px!important;max-width:48px!important;max-height:48px!important;margin:0!important;border-radius:11px!important;background-size:cover!important;background-position:center!important}
body.ct180-immersive-detail .ct171-provider-card b,body.ct180-immersive-detail .ct171-provider-card small{display:none!important}
body.ct180-immersive-detail .ct171-watch-section .empty{padding:9px 0!important;border:0!important;text-align:left!important;font-size:10px!important;background:transparent!important}

/* Keep the remaining detail sections clean and swipeable. */
body.ct180-immersive-detail .ct169-detail-section{width:auto!important;max-width:none!important;margin:0 var(--ct180-side) 12px!important;padding:15px 0!important;border-left:0!important;border-right:0!important;border-radius:0!important;background:transparent!important;box-shadow:none!important;overflow:hidden!important}
body.ct180-immersive-detail .ct169-cast-row,body.ct180-immersive-detail .ct169-related-row,body.ct180-immersive-detail .ct169-season-row,body.ct180-immersive-detail .ct169-season-chart-carousel{overflow-x:auto!important;overflow-y:hidden!important;-webkit-overflow-scrolling:touch!important;overscroll-behavior-inline:contain!important}

@media(max-width:360px){body.ct180-immersive-detail .ct169-main-actions{grid-template-columns:1fr 1fr!important}body.ct180-immersive-detail .ct169-main-actions button:last-child{grid-column:1/-1!important}.ct180-detail-back{width:42px!important;height:42px!important}}
`;

html=html
  .replaceAll('android-v0.99.7.13-r179-home-target-card','android-v0.99.7.14-r179-immersive-detail-nav')
  .replaceAll('web-r179-home-target-card-parity','web-r179-frozen-android-ui-parity')
  .replace('</head>',()=>`<style data-ct-android-mobile="0.99.7.14">${css}</style><meta name="ct-android-v099714" content="persistent-five-tab-nav-immersive-poster-compact-where"></head>`);

for(const marker of['android-v0.99.7.14-r179-immersive-detail-nav','web-r179-frozen-android-ui-parity','persistent-five-tab-nav-immersive-poster-compact-where','always-visible-five-tabs','poster-first-no-detail-header','compact-provider-icons','ct180-immersive-detail','ct180-detail-back','home-target-card-by-media-id','history-duplicate-safe-next-episode-card'])if(!html.includes(marker))throw new Error(`Android 0.99.7.14 missing marker: ${marker}`);
await writeFile(indexPath,html,'utf8');
console.log('ANDROID_099714_READY web=r179-frozen nav=five-tabs-always detail=poster-first where=compact-icons');
