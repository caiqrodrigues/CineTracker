(() => {
'use strict';
if(window.__ct0997NavGate143Loaded)return;
window.__ct0997NavGate143Loaded=true;
window.__ct0997NavGate143='r143-early-nav-capture';

// Uma única Web em todas as telas: normaliza o viewport para o CSS responsivo já
// existente, sem UA, detecção de telefone, classe mobile ou shell alternativo.
(function normalizeSharedViewport(){
  let meta=document.querySelector('meta[name="viewport"]');
  if(!meta){meta=document.createElement('meta');meta.name='viewport';document.head.appendChild(meta)}
  meta.setAttribute('content','width=device-width,initial-scale=1,viewport-fit=cover');
  const style=document.createElement('style');
  style.id='ct0997-shared-responsive-143-style';
  style.textContent=`@media(max-width:850px){
    #app>.app,.app{grid-template-columns:minmax(0,1fr)!important;width:100%!important;max-width:100%!important;min-width:0!important}
    .sidebar{display:none!important}
    .content{box-sizing:border-box!important;width:100%!important;max-width:100%!important;min-width:0!important;overflow-x:hidden!important}
    .mobile-nav{display:grid!important}
  }`;
  document.getElementById(style.id)?.remove();
  document.head.appendChild(style);
})();

// Descarta somente caches temporários conhecidos como respostas legadas vazias.
for(const key of ['ct138:home','ct138:profile']){
  try{const x=JSON.parse(sessionStorage.getItem(key)||'null');if(x?.value?._ct138LegacySuppressed)sessionStorage.removeItem(key)}catch{}
}

const norm=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
function keyPath(k){return k==='discover'?'/discover':k==='profile'?'/profile':k==='settings'?'/configs':'/home'}
function keyFrom(el){
  const d=String(el?.dataset?.ct136Nav||el?.dataset?.ct120Nav||el?.dataset?.view||el?.dataset?.view99||el?.dataset?.view991||'').toLowerCase();
  if(['home','discover','profile','settings'].includes(d))return d;
  const href=String(el?.getAttribute?.('href')||'');
  if(/\/discover(?:$|[?#])/.test(href))return'discover';
  if(/\/profile(?:$|[?#])/.test(href))return'profile';
  if(/\/(?:configs|settings)(?:$|[?#])/.test(href))return'settings';
  if(/\/(?:home)?(?:$|[?#])/.test(href))return'home';
  const t=norm(el?.textContent||'');
  if(t.includes('descobrir'))return'discover';
  if(t==='perfil'||t.includes(' perfil'))return'profile';
  if(t.includes('config'))return'settings';
  if(t==='home'||t==='inicio'||t.includes(' home'))return'home';
  return'';
}
function onNav(e){
  const el=e.target?.closest?.('.sidebar .nav a,.sidebar .nav button,.mobile-nav a,.mobile-nav button,[data-ct136-nav],[data-ct120-nav]');
  if(!el)return;
  const key=keyFrom(el);if(!key)return;
  e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
  const path=keyPath(key);
  if((location.pathname||'/').replace(/\/+$/,'')!==path)history.pushState({ct143:true,path},'',path);
  try{window.view=key}catch{}
  window.dispatchEvent(new CustomEvent('cinetracker:primary-nav',{detail:{key,path,source:'r143'}}));
}
// Registrado no boot: executa antes dos listeners legados.
document.addEventListener('click',onNav,true);
window.__ct143KeyFromNav=keyFrom;
})();