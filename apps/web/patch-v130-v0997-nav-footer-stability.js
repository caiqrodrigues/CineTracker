(() => {
'use strict';
if(window.__ct0997NavFooter130Loaded)return;
window.__ct0997NavFooter130Loaded=true;
window.__ct0997NavFooter130='v130-nav-footer-stability-only';

const $130=(s,r=document)=>r?.querySelector?.(s)||null;
const $$130=(s,r=document)=>r?.querySelectorAll?[...r.querySelectorAll(s)]:[];
const norm130=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
let queued130=false;

const css130=document.createElement('style');
css130.id='ct0997-nav-footer130-style';
css130.textContent=`
.sidebar .nav[data-ct130-locked="1"]>:is(button,a):not([data-ct130-primary="1"]){display:none!important}
html.ct130-settings-active .ct109-settings-version,
html.ct130-settings-active .ct127-settings-footer,
html.ct130-settings-active .ct128-settings-footer,
html.ct130-settings-active .ct91-version,
html.ct130-settings-active .ct120-version,
html.ct130-settings-active .ct53w-version,
html.ct130-settings-active [data-ct130-legacy-version="1"]{display:none!important}
.ct130-stable-footer{grid-column:1/-1;display:block!important;text-align:center;color:#607987;font-size:8px;line-height:1;padding:2px 4px 3px;min-height:12px;opacity:1!important;visibility:visible!important;transform:none!important;animation:none!important;transition:none!important}
.ct130-stable-footer b{color:#8ba7b6}.ct130-stable-marker{display:none!important}
`;
document.getElementById(css130.id)?.remove();document.head.appendChild(css130);

function navKey130(el){
  const d=String(el?.dataset?.ct120Nav||el?.dataset?.view||el?.dataset?.view99||el?.dataset?.view991||'').toLowerCase();
  if(['home','discover','profile','settings'].includes(d))return d;
  const t=norm130(el?.textContent||'');
  if(t==='home'||t==='inicio')return'home';
  if(t==='descobrir')return'discover';
  if(t==='perfil')return'profile';
  if(t==='configuracoes')return'settings';
  if(t.includes('histor'))return'history';
  return'';
}
function preferred130(items){return items.find(x=>x.classList?.contains('active')||x.getAttribute?.('aria-current')==='page')||items[0]||null}
function lockSidebar130(){
  for(const nav of $$130('.sidebar .nav')){
    const nodes=$$130(':scope > button,:scope > a',nav);
    const groups=new Map();
    for(const el of nodes){const k=navKey130(el);if(!k)continue;if(!groups.has(k))groups.set(k,[]);groups.get(k).push(el)}
    for(const el of nodes)delete el.dataset.ct130Primary;
    for(const k of ['home','discover','profile','settings']){
      const win=preferred130(groups.get(k)||[]);if(win)win.dataset.ct130Primary='1';
    }
    for(const el of groups.get('history')||[]){el.hidden=true;el.setAttribute('aria-hidden','true')}
    nav.dataset.ct130Locked='1';
  }
}
function isSettings130(){
  const h=norm130($130('.content h1')?.textContent||'');
  let v='';try{v=String(typeof view!=='undefined'?view:(window.view||''))}catch{v=String(window.view||'')}
  return h.includes('configuracoes')||['settings','ct91-settings','ct92-settings'].includes(v);
}
function legacyVersion130(el){
  if(!el||el.closest?.('.ct130-stable-footer,.ct128-data-card,.ct128-modal'))return false;
  if(el.children?.length)return false;
  const raw=String(el.textContent||'').trim(),t=norm130(raw);
  if(t==='configuracoes da web pwa')return true;
  return /^cine\s*tracker\s*(?:web\s*)?(?:v|versao|build)?\s*0\s*(?:99|0)\s*\d+$/i.test(t)||/^cine\s*tracker.*0\.99\.\d+$/i.test(raw)||/^cine\s*tracker.*0\.0\.\d+$/i.test(raw);
}
function stableFooter130(){
  const active=isSettings130();document.documentElement.classList.toggle('ct130-settings-active',active);if(!active)return;
  const settings=$130('.ct91-settings');if(!settings)return;
  const content=settings.closest('.content')||settings.parentElement;
  if(content)for(const el of $$130('small,span,div,p',content))if(legacyVersion130(el)){el.dataset.ct130LegacyVersion='1';el.hidden=true;el.setAttribute('aria-hidden','true')}
  let footer=$130(':scope > .ct130-stable-footer',settings);
  if(!footer){footer=document.createElement('div');footer.className='ct130-stable-footer';footer.setAttribute('aria-label','CineTracker 0.99.7');footer.innerHTML='<span>CineTracker <b>0.99.7</b><i class="ct130-stable-marker">estável</i></span>';settings.appendChild(footer)}
}
function enforce130(){queued130=false;lockSidebar130();stableFooter130()}
function schedule130(){if(queued130)return;queued130=true;queueMicrotask(enforce130)}

const host130=document.getElementById('app')||document.documentElement;
const observer130=new MutationObserver(schedule130);
observer130.observe(host130,{childList:true,subtree:true});
document.addEventListener('click',e=>{if(e.target?.closest?.('.sidebar,.nav,[data-view],[data-ct120-nav]'))schedule130()},true);
window.addEventListener('focus',schedule130);
window.addEventListener('cinetracker:data-changed',schedule130);
window.__ct0997NavFooter130Enforce=enforce130;
enforce130();
})();
