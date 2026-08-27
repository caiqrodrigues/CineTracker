(() => {
'use strict';
if (window.__ct0994AuthorityLoaded) return;
window.__ct0994AuthorityLoaded = true;
window.__ct0994Authority = 'v104-single-renderer';

const rawNavigate = window.__ct0994Navigate;
const rawRender = window.render;
let navigating = false;
let queuedTarget = null;
let authorityTimer = null;

function currentTarget(){
  let value='home';
  try{value=String(typeof view!=='undefined'?view:(window.view||'home'))}catch{value=String(window.view||'home')}
  value=value==='history'?'profile':value;
  return ['home','discover','profile','settings'].includes(value)?value:'home';
}
function authenticated(){
  try{return Boolean(ctSession?.access_token)}catch{return false}
}
function syncVersion(){
  document.querySelectorAll('.ct993-version,.ct992-version,.ct991-version,.ct99-version,.ct98-version,.ct95-version,.ct94-version,.ct93-version,.ct92-version,.ct91-version,.ct90-version,.ct89-version,.ct-version-footer,#ct56-version').forEach(el=>{el.style.display='none'});
  const host=document.querySelector('.content');
  if(!host)return;
  let footer=host.querySelector('.ct994-version');
  if(!footer){footer=document.createElement('div');footer.className='ct994-version';host.appendChild(footer)}
  footer.textContent='CineTracker • v0.99.4';
}
function queueAuthority(target=currentTarget(),delay=0){
  queuedTarget=target;
  clearTimeout(authorityTimer);
  authorityTimer=setTimeout(()=>{
    const next=queuedTarget;queuedTarget=null;
    if(authenticated()) void navigateAuthoritative(next,{repair:true});
  },delay);
}
async function navigateAuthoritative(target,options={}){
  target=target==='history'?'profile':target;
  if(!['home','discover','profile','settings'].includes(target))return false;
  if(navigating){queueAuthority(target,30);return true}
  navigating=true;
  try{
    try{view=target}catch{}
    try{window.view=target}catch{}
    if(typeof rawNavigate!=='function')return false;
    const result=await rawNavigate(target);
    syncVersion();
    return result!==false;
  }catch(error){
    console.error('[CineTracker 0.99.4 authority] navigation',target,error);
    return false;
  }finally{
    navigating=false;
    if(queuedTarget){const next=queuedTarget;queuedTarget=null;queueAuthority(next,20)}
  }
}

window.__ct0994Navigate=navigateAuthoritative;
window.ct991Navigate=navigateAuthoritative;
window.ct0992Navigate=navigateAuthoritative;
window.ct99Navigate=navigateAuthoritative;
window.ct98Navigate=navigateAuthoritative;

if(typeof rawRender==='function'&&!rawRender.__ct0994AuthorityWrapped){
  const guardedRender=function(...args){
    if(!authenticated())return rawRender.apply(this,args);
    queueAuthority(currentTarget(),0);
    return true;
  };
  guardedRender.__ct0994AuthorityWrapped=true;
  guardedRender.__ct0994Raw=rawRender;
  window.render=guardedRender;
}

/* v0.99.1 and v0.99.2 each contain one delayed startup navigation (320 ms and 760 ms).
   Reassert the 0.99.4 owner after those finite legacy timers, without MutationObserver/polling. */
for(const delay of [90,380,820,980,1400,2200]){
  setTimeout(()=>{if(authenticated())void navigateAuthoritative(currentTarget(),{repair:true})},delay);
}
window.addEventListener('cinetracker:auth-state-change',event=>{
  if(event?.detail?.event==='SIGNED_IN')queueAuthority('home',0);
});
window.addEventListener('cinetracker:data-changed',()=>{
  if(authenticated())queueAuthority(currentTarget(),80);
});
setTimeout(syncVersion,0);
})();
