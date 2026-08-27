(() => {
'use strict';
if (window.__ct0994AuthorityLoaded) return;
window.__ct0994AuthorityLoaded = true;
window.__ct0994Authority = 'web-0.99.4-stable-nav-owner';
window.__ctWebBuild = '0.99.4';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];

/* Stop observers created by previous 0.99.3/0.99.4 authority attempts. Do not create another global observer. */
try { window.__ct0993Observer?.disconnect?.(); } catch {}
try { window.__ct0994AuthorityObserver?.disconnect?.(); } catch {}
try { if(window.__ct0994AuthorityInterval) clearInterval(window.__ct0994AuthorityInterval); } catch {}

const style=document.createElement('style');
style.id='ct0994-authority-style';
style.textContent=`
.sidebar .nav [data-view="history"],.sidebar .nav [data-view99="history"],.sidebar .nav [data-view991="history"],
.mobile-nav [data-view="history"],.mobile-nav [data-view99="history"],.mobile-nav [data-view991="history"]{display:none!important}
.ct993-version,.ct992-version,.ct991-version,.ct99-version,.ct98-version,.ct-version-footer{display:none!important}
`;
document.getElementById(style.id)?.remove();
document.head.appendChild(style);

const defs=[
  {view:'home',label:'Home',mobile:'Home'},
  {view:'discover',label:'Descobrir',mobile:'Descobrir'},
  {view:'profile',label:'Perfil',mobile:'Perfil'},
  {view:'settings',label:'Configurações',mobile:'Config.'}
];
function activeView(){
  let v='home';
  try { v=String(typeof view!=='undefined'?view:window.view||'home'); } catch { v=String(window.view||'home'); }
  return v==='history'?'profile':v;
}
function isHistoryNode(el){
  if(!el)return false;
  const target=String(el.dataset?.view||el.dataset?.view99||el.dataset?.view991||'').toLowerCase();
  if(target==='history')return true;
  const text=String(el.textContent||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().toLowerCase();
  return text==='historico'||text==='history'||text.endsWith(' historico')||text.endsWith(' history');
}
function reconcileNav(){
  $$('.sidebar .nav button,.sidebar .nav a,.mobile-nav button,.mobile-nav a').forEach(el=>{if(isHistoryNode(el))el.remove()});
  const active=activeView();
  $$('.sidebar .nav,.mobile-nav').forEach(nav=>{
    const mobile=nav.classList.contains('mobile-nav');
    const buttons=$$(':scope > button',nav).filter(b=>!isHistoryNode(b));
    const valid=buttons.length===4 && buttons.every((b,i)=>String(b.dataset.view||b.dataset.view99||b.dataset.view991||'')===defs[i].view);
    if(!valid){
      nav.innerHTML=defs.map(d=>`<button type="button" data-view="${d.view}" data-ct0994-nav="1" class="${active===d.view?'active':''}"${active===d.view?' aria-current="page"':''}>${mobile?d.mobile:d.label}</button>`).join('');
    } else {
      buttons.forEach((b,i)=>{
        b.dataset.view=defs[i].view;
        const on=defs[i].view===active;
        b.classList.toggle('active',on);
        if(on)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');
      });
    }
  });
}
function footer(){
  const host=$('.content');if(!host)return;
  let f=$('.ct994-version',host);
  if(!f){f=document.createElement('div');f.className='ct994-version';f.style.cssText='text-align:center;color:#6f8798;font-size:11px;margin:28px 0 8px';host.appendChild(f)}
  f.textContent='CineTracker • v0.99.4';
}
function reconcile(){reconcileNav();footer()}

/* Only bounded startup reconciliation. No MutationObserver and no interval. */
for(const d of [0,80,220,500,1000,2000])setTimeout(reconcile,d);
window.addEventListener('popstate',()=>setTimeout(reconcile,0));
window.addEventListener('cinetracker:data-changed',()=>setTimeout(reconcile,0));
})();
