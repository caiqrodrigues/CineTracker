(() => {
'use strict';
if (window.__ct0994MobileNavFixLoaded) return;
window.__ct0994MobileNavFixLoaded = true;
window.__ct0994MobileNavFix = 'web-0.99.4-canonical-nav-mobile-breakpoint';

const NAV=[['home','⌂ Home','Home'],['discover','✦ Descobrir','Descobrir'],['profile','◉ Perfil','Perfil'],['settings','⚙ Configurações','Config.']];
const style=document.createElement('style');
style.id='ct0994-mobile-device-fix';
style.textContent=`
@media (max-width:850px), (pointer:coarse) and (max-device-width:900px) {
  .app{grid-template-columns:1fr!important;display:grid!important}
  .sidebar{display:none!important}
  .content{padding:20px!important;max-width:100%!important;width:100%!important;margin:0!important;min-width:0!important}
  .mobile-nav{display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:6px!important;position:sticky!important;bottom:0!important;z-index:20000!important;background:#0d0d0df2!important;border-top:1px solid #292929!important;padding:10px!important;margin:20px -20px -20px!important;pointer-events:auto!important}
  .mobile-nav button{pointer-events:auto!important;cursor:pointer!important;min-width:0!important}
}
`;
document.getElementById(style.id)?.remove();
document.head.appendChild(style);

function currentRoute(){
  let v='home';
  try{v=String(typeof view!=='undefined'?view:window.view||'home')}catch{v=String(window.view||'home')}
  return v==='history'?'profile':v;
}
function buttons(active,mobile){
  return NAV.map(([v,desk,mob])=>`<button type="button" data-view="${v}" class="${active===v?'active':''}"${active===v?' aria-current="page"':''}>${mobile?mob:desk}</button>`).join('');
}
function canonicalize(){
  const active=currentRoute();
  const desk=document.querySelector('.sidebar .nav');
  const mobile=document.querySelector('.mobile-nav');
  if(desk){
    const sig=[...desk.querySelectorAll('button')].map(b=>`${b.dataset.view}:${(b.textContent||'').trim()}`).join('|');
    const want=NAV.map(([v,d])=>`${v}:${d}`).join('|');
    if(sig!==want)desk.innerHTML=buttons(active,false);
  }
  if(mobile){
    const sig=[...mobile.querySelectorAll('button')].map(b=>`${b.dataset.view}:${(b.textContent||'').trim()}`).join('|');
    const want=NAV.map(([v,,m])=>`${v}:${m}`).join('|');
    if(sig!==want)mobile.innerHTML=buttons(active,true);
  }
  document.querySelectorAll('.sidebar .nav button,.mobile-nav button').forEach(b=>{
    const on=b.dataset.view===active;
    b.classList.toggle('active',on);
    if(on)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');
  });
}

for(const ms of [0,40,120,300,800,1300])setTimeout(canonicalize,ms);
window.addEventListener('cinetracker:data-changed',()=>setTimeout(canonicalize,0));
window.addEventListener('resize',canonicalize,{passive:true});
window.__ct0994CanonicalizeNav=canonicalize;
})();
