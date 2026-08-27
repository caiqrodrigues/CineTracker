(() => {
'use strict';
if (window.__ct0994AuthorityLoaded) return;
window.__ct0994AuthorityLoaded = true;
window.__ct0994Authority = 'web-0.99.4-single-runtime-owner';
window.__ctWebBuild = '0.99.4';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];

function killLegacyObservers(){
  try { window.__ct0993Observer?.disconnect?.(); } catch {}
  try { window.__ct0994AuthorityObserver?.disconnect?.(); } catch {}
}

const style=document.createElement('style');
style.id='ct0994-authority-style';
style.textContent=`
.sidebar .nav [data-view="history"],.sidebar .nav [data-view99="history"],.sidebar .nav [data-view991="history"],
.mobile-nav [data-view="history"],.mobile-nav [data-view99="history"],.mobile-nav [data-view991="history"]{display:none!important}
.ct993-version,.ct992-version,.ct991-version,.ct99-version,.ct98-version,.ct-version-footer{display:none!important}
`;
document.head.appendChild(style);

const defs=[
  {view:'home',label:'Home',mobile:'Home',icon:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10.5V20h13v-9.5"/><path d="M9.5 20v-6h5v6"/></svg>'},
  {view:'discover',label:'Descobrir',mobile:'Descobrir',icon:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="m15.5 8.5-2.2 4.8-4.8 2.2 2.2-4.8 4.8-2.2Z"/></svg>'},
  {view:'profile',label:'Perfil',mobile:'Perfil',icon:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.25"/><path d="M5.5 20c.7-4 3-6 6.5-6s5.8 2 6.5 6"/></svg>'},
  {view:'settings',label:'Configurações',mobile:'Config.',icon:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h8M16 7h4M4 17h4M12 17h8"/><circle cx="14" cy="7" r="2"/><circle cx="10" cy="17" r="2"/></svg>'}
];

function activeView(){
  let v='home';
  try { v=String(typeof view!=='undefined'?view:window.view||'home'); } catch { v=String(window.view||'home'); }
  return v==='history'?'profile':v;
}
function isHistoryNode(el){
  if(!el) return false;
  const target=String(el.dataset?.view||el.dataset?.view99||el.dataset?.view991||'').toLowerCase();
  if(target==='history') return true;
  const text=String(el.textContent||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().toLowerCase();
  return text==='historico'||text==='history'||text.endsWith(' historico')||text.endsWith(' history');
}
function purgeHistoryEverywhere(){
  $$('.sidebar .nav button,.sidebar .nav a,.mobile-nav button,.mobile-nav a').forEach(el=>{if(isHistoryNode(el))el.remove()});
}
function canonicalNav(){
  purgeHistoryEverywhere();
  const active=activeView();
  $$('.sidebar .nav,.mobile-nav').forEach(nav=>{
    const mobile=nav.classList.contains('mobile-nav');
    const current=$$(':scope > button',nav);
    const valid=current.length===4 && current.every((b,i)=>b.dataset.view===defs[i].view && b.dataset.ct0994Nav==='1');
    if(!valid){
      nav.innerHTML=defs.map(d=>`<button type="button" data-view="${d.view}" data-ct0994-nav="1" class="${active===d.view?'active':''}"${active===d.view?' aria-current="page"':''}><span class="ct993-nav-icon">${d.icon}</span><span class="ct993-nav-label">${mobile?d.mobile:d.label}</span></button>`).join('');
    } else {
      current.forEach(b=>{const on=b.dataset.view===active;b.classList.toggle('active',on);if(on)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current')});
    }
  });
}
function force994Home(){
  const home=$('.ct992-shell');
  if(!home) return;
  if($('#ct994-viewport',home)) return;
  if(home.dataset.ct994==='loading') return;
  delete home.dataset.ct994;
  try { window.dispatchEvent(new CustomEvent('cinetracker:data-changed',{detail:{source:'web-0.99.4-authority'}})); } catch {}
}
function footer(){
  const host=$('.content'); if(!host)return;
  let f=$('.ct994-version',host);if(!f){f=document.createElement('div');f.className='ct994-version';f.style.cssText='text-align:center;color:#6f8798;font-size:11px;margin:28px 0 8px';host.appendChild(f)}
  f.textContent='CineTracker • v0.99.4';
}
function reconcileNow(){
  killLegacyObservers();
  canonicalNav();
  force994Home();
  footer();
}

let scheduled=false;
function schedule(){
  if(scheduled)return;
  scheduled=true;
  queueMicrotask(()=>{scheduled=false;reconcileNow()});
}

/* Capture navigation before every legacy document/window handler. */
window.addEventListener('click',event=>{
  const button=event.target?.closest?.('.sidebar .nav button,.mobile-nav button');
  if(!button)return;
  const target=String(button.dataset.view||'');
  if(!['home','discover','profile','settings'].includes(target))return;
  event.preventDefault();event.stopPropagation();event.stopImmediatePropagation();
  const router=window.__ct0993Navigate||window.ct0992Navigate||window.ct991Navigate||window.ct98Navigate;
  if(typeof router==='function') router(target);
  schedule();
},true);

reconcileNow();
for(const d of [20,60,120,250,500,900,1500,2500,5000])setTimeout(reconcileNow,d);
window.addEventListener('cinetracker:data-changed',schedule);
window.addEventListener('popstate',schedule);

/* Observe the whole document and never debounce by resetting a timer: legacy mutation storms can no longer starve 0.99.4. */
const observer=new MutationObserver(schedule);
observer.observe(document.documentElement,{childList:true,subtree:true});
window.__ct0994AuthorityObserver=observer;

/* Low-frequency safety net for legacy renderers that mutate attributes/text without child-list changes. */
window.__ct0994AuthorityInterval=setInterval(reconcileNow,750);
})();
