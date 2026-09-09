/* CineTracker Web 1.0.29 r237 — real UI authority based on the reported production screen. */
(()=>{
'use strict';
if(window.__ctR237)return;
window.__ctR237='real-ui-single-finalizer';
window.__ctR237Home='generic-series-hydration-no-title-hardcode';
window.__ctR237Discover='base-geometry-no-runtime-card-resize';
window.__ctR237Sports='standard-card-assistido-only';
window.__ctR237F1='requested-six-tabs';
window.__ctR237Profile='exact-requested-stat-order';
const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>r?.querySelectorAll?[...r.querySelectorAll(s)]:[];
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();

/* HOME: use the generic r235 data hydration for every series, then repaint. Never special-case a title. */
let homeBusy237=false;
async function home237(){
 if(homeBusy237||!q('[data-home]'))return;homeBusy237=true;
 try{
  if(typeof window.__ctV127RefreshHome==='function')await window.__ctV127RefreshHome();
  if(q('[data-home]')&&typeof paintHome==='function')paintHome();
 }catch{}finally{homeBusy237=false}
}

/* DISCOVER: final runtime only removes legacy normalization classes. Card/Top 10 geometry belongs to the base app CSS. */
function discover237(){
 const root=q('[data-page="discover"],[data-discover]');if(!root)return;
 for(const el of qa('.ct127-discover-card,.ct127-discover-row,.ct127-discover-pending',root)){
  el.classList.remove('ct127-discover-card','ct127-discover-row','ct127-discover-pending');
  el.removeAttribute('aria-busy');
 }
 root.dataset.ct237Discover='base-geometry';
}

/* SPORTS: a normal event card has exactly one watch action; Eventos/Ver eventos never survives reconciliation. */
function isEvents237(el){const t=norm(el?.textContent||'');return t==='eventos'||t==='ver eventos'||t==='agenda'||t==='ver agenda'||el?.hasAttribute?.('data-ct165-open-favorite')}
function isWatch237(el){const t=norm(el?.textContent||'');return t.includes('assistido')||t.includes('marcar como assistido')||t.includes('desmarcar assistido')}
function sports237(){
 const root=q('[data-sports]');if(!root)return;
 for(const card of qa('.event-grid > *',root)){
  for(const el of qa('button,a,[role="button"]',card))if(isEvents237(el))el.remove();
  const watch=qa('button,a,[role="button"]',card).filter(isWatch237);
  for(const el of watch.slice(1))el.remove();
  const w=watch[0];if(!w)continue;
  const off=norm(w.textContent||'').includes('desmarcar');w.textContent=off?'↶ Desmarcar assistido':'✓ Assistido';
  w.classList.remove('ct127-sport-action','secondary');
  card.classList.remove('ct127-sports-card');
 }
 root.dataset.ct237Sports='assistido-only';
}

/* PROFILE: visual order requested from the supplied screenshot. */
const profileOrder237=[
 ['episodes',['episodios']],['movies',['filmes']],['series-watch',['series watchlist']],['movies-watch',['filmes watchlist']],
 ['series-time',['tempo em series']],['movies-time',['tempo em filmes']],['series-watch-time',['tempo de serie em watchlist','tempo em serie watchlist','tempo da serie em watchlist']],['movies-watch-time',['tempo de filmes em watchlist','tempo em filmes watchlist']],
 ['screen-total',['tempo total de tela']],['watch-total',['tempo total em watchlist']]
];
function statKey237(card){const t=norm(card.textContent||'');for(const[k,labels]of profileOrder237)if(labels.some(x=>t.includes(x)))return k;return''}
function profile237(){
 const root=q('[data-profile]');if(!root)return;
 const cards=qa('.stat,[data-stat],button.stat',root).filter(x=>statKey237(x));if(cards.length<8)return;
 const groups=new Map();for(const c of cards){const p=c.parentElement;if(p)groups.set(p,(groups.get(p)||0)+1)}
 const grid=[...groups.entries()].sort((a,b)=>b[1]-a[1])[0]?.[0];if(!grid)return;
 grid.classList.add('ct237-profile-stats');
 const order=new Map(profileOrder237.map(([k],i)=>[k,i+1]));
 for(const c of cards){const k=statKey237(c);if(!k)continue;c.dataset.ct237ProfileStat=k;c.style.order=String(order.get(k)||99);c.style.gridColumn=(k==='screen-total'||k==='watch-total')?'span 2':'span 1'}
 root.dataset.ct237Profile='requested-order';
}

/* F1: preserve r236 data source/interaction, but force its real card to be normalized after Sports paint. */
function f1237(){
 try{if(typeof window.__ctR236NormalizeF1==='function'){window.__ctR236NormalizeF1();return}}catch{}
 const marker=qa('h1,h2,h3,h4,b,strong').find(x=>norm(x.textContent||'')==='f1 hub');
 const card=marker?.closest?.('[data-ct236-f1-card],[data-r235-f1-card],[data-f1-hub],.f1Hub,.f1-hub,.panel,section,article');
 if(!card)return;
 const tabs=qa('[data-ct236-f1-tab]',card);if(tabs.length===6)card.dataset.ct237F1='requested-six-tabs';
}

let timer237=0;
function reconcile237(){discover237();sports237();profile237();f1237()}
function queue237(){clearTimeout(timer237);timer237=setTimeout(reconcile237,90)}
try{new MutationObserver(queue237).observe(q('#app')||document.documentElement,{subtree:true,childList:true,characterData:true})}catch{}
window.addEventListener('popstate',queue237);window.addEventListener('cinetracker:data-changed',()=>{queue237();if(q('[data-home]'))void home237()});
try{const p=paintHome;paintHome=function(...a){const out=p.apply(this,a);queueMicrotask(()=>void home237());return out}}catch{}
try{const p=paintDiscover;paintDiscover=function(...a){const out=p.apply(this,a);setTimeout(discover237,0);return out}}catch{}
try{const p=paintSports;paintSports=function(...a){const out=p.apply(this,a);setTimeout(()=>{sports237();f1237()},0);return out}}catch{}
try{const p=renderProfile;renderProfile=async function(...a){const out=await p.apply(this,a);profile237();return out}}catch{}

const st=document.createElement('style');st.id='ct-r237-real-ui-authority';st.textContent=`
.ct237-profile-stats{display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:8px!important}
.ct237-profile-stats>[data-ct237-profile-stat="screen-total"],.ct237-profile-stats>[data-ct237-profile-stat="watch-total"]{grid-column:span 2!important}
[data-page="discover"] .ct127-discover-card,[data-discover] .ct127-discover-card{width:unset!important;min-width:unset!important;max-width:unset!important}
@media(max-width:700px){.ct237-profile-stats{grid-template-columns:repeat(2,minmax(0,1fr))!important}.ct237-profile-stats>[data-ct237-profile-stat="screen-total"],.ct237-profile-stats>[data-ct237-profile-stat="watch-total"]{grid-column:span 2!important}}
`;document.getElementById(st.id)?.remove();document.head.appendChild(st);
window.__ctR237ProfileOrder=profile237;window.__ctR237Discover=discover237;window.__ctR237Sports=sports237;window.__ctR237Home=home237;
queue237();
})();