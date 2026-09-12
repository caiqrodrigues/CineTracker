/* CineTracker Web 1.0.51 r260 — restore Discover card scale, fast Home cache/skeleton and isolated modal rails. WEB ONLY. */
(()=>{
'use strict';
if(window.__ctR260)return;
window.__ctR260='discover-standard-cards+home-first-page-cache+isolated-modal-rails';
window.__ctR260Discover='standard-2x3-176-desktop-154-mobile';
window.__ctR260Home='persistent-first-page+background-refresh+metadata-cache+skeleton';
window.__ctR260Horizontal='isolated-modal-rails+native-touch+delegated-mouse-drag';
window.__ctR260Frozen='sports-profile-configs-f1-r259-unchanged';

const CACHE260='ct-home-first-page-v260';
const META260='ct-tmdb-meta-v260:';
const HOME_PAGE_SIZE260=18;
const now260=()=>Date.now();
const q260=(s,r=document)=>r?.querySelector?.(s)||null;
const qa260=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const clamp260=(v,n=24)=>Array.isArray(v)?v.slice(0,n):[];
const bucketOrder260=['continue','dust','up_to_date','not_started','completed'];
let homePage260=1,homePaging260=false,homeSentinelObserver260=null;

function pageSeries260(rows,page=1){
  if(!Array.isArray(rows))return [];
  const out=[],seen=new Set(),limit=Math.max(1,page)*HOME_PAGE_SIZE260;
  for(const b of bucketOrder260){
    for(const x of rows.filter(r=>r?.home_bucket===b).slice(0,limit)){
      const k=String(x?.media_id||x?.tmdb_id||`${b}:${out.length}`);if(seen.has(k))continue;seen.add(k);out.push(x);
    }
  }
  for(const x of rows){if(out.length>=limit*bucketOrder260.length)break;const k=String(x?.media_id||x?.tmdb_id||'');if(k&&!seen.has(k)){seen.add(k);out.push(x)}}
  return out;
}
function pageHome260(c,page=1){
  if(!c||!Array.isArray(c.series))return c;
  const n=Math.max(1,page)*HOME_PAGE_SIZE260;
  return {...c,series:pageSeries260(c.series,page),movie_watchlist:clamp260(c.movie_watchlist,n)};
}
function compactHome260(c){
  if(!c||!Array.isArray(c.series))return null;
  const first=pageHome260(c,1);
  return {
    at:now260(),
    data:{
      ...first,
      series:clamp260(first.series,HOME_PAGE_SIZE260*bucketOrder260.length),
      movie_watchlist:clamp260(first.movie_watchlist,HOME_PAGE_SIZE260),
      seen_movie_tmdb_ids:clamp260(c.seen_movie_tmdb_ids,160),
      history_episodes:[],
      history_movies:[]
    }
  };
}
function persistHome260(source=homeCache){
  try{const pack=compactHome260(source);if(pack)sessionStorage.setItem(CACHE260,JSON.stringify(pack))}catch{}
}
function restoreHome260(){
  try{
    const raw=sessionStorage.getItem(CACHE260);if(!raw)return null;
    const pack=JSON.parse(raw);if(!pack?.data?.series?.length)return null;
    if(now260()-Number(pack.at||0)>86400000){sessionStorage.removeItem(CACHE260);return null}
    return pack.data;
  }catch{return null}
}
function skeletonHome260(){
  return `<div class="ct260-home-skeleton" aria-busy="true" aria-label="Carregando Home">
    <section><div class="ct260-sk-title"></div><div class="ct260-sk-row">${Array.from({length:5},()=>'<i></i>').join('')}</div></section>
    <section><div class="ct260-sk-title short"></div><div class="ct260-sk-row">${Array.from({length:4},()=>'<i></i>').join('')}</div></section>
  </div>`;
}
function installHomePager260(full,shown){
  try{
    homeSentinelObserver260?.disconnect?.();homeSentinelObserver260=null;
    const root=q260('[data-home]');if(!root)return;
    const hasMore=(full?.series?.length||0)>(shown?.series?.length||0)||(full?.movie_watchlist?.length||0)>(shown?.movie_watchlist?.length||0);
    if(!hasMore)return;
    const btn=document.createElement('button');btn.type='button';btn.className='ct260-home-more';btn.dataset.ct260HomeMore='1';btn.textContent='Carregar mais';root.append(btn);
    const more=()=>{if(homePaging260)return;homePaging260=true;homePage260++;try{paintHome()}finally{homePaging260=false}};
    btn.addEventListener('click',more,{once:true});
    if('IntersectionObserver' in window){homeSentinelObserver260=new IntersectionObserver(entries=>{if(entries.some(x=>x.isIntersecting)){homeSentinelObserver260?.disconnect?.();more()}},{rootMargin:'220px 0px'});homeSentinelObserver260.observe(btn)}
  }catch{}
}

/* Restore a compact first page before r259 executes its Home renderer. The canonical r5 refresh still runs in background. */
const renderHome260Base=renderHome;
renderHome=async function(seq){
  if(!(homeCache?.series?.length)){
    const cached=restoreHome260();
    if(cached)homeCache=cached;
  }
  return renderHome260Base(seq);
};

/* Render only the first page immediately; further buckets are progressively exposed as the sentinel approaches viewport. */
const paintHome260Base=paintHome;
paintHome=function(...args){
  const full=homeCache;
  if(!full?.series?.length){const out=paintHome260Base(...args);scheduleRails260();return out}
  const shown=pageHome260(full,homePage260);
  homeCache=shown;
  let out;
  try{out=paintHome260Base(...args)}finally{homeCache=full}
  persistHome260(full);
  installHomePager260(full,shown);
  scheduleRails260();
  return out;
};

/* Lightweight skeleton replaces the blocking blank loader only when no cached first page exists. */
const setApp260Base=setApp;
setApp=function(html){
  const out=setApp260Base(html);
  try{
    if(route()==='home'&&!(homeCache?.series?.length)){
      const h=q260('[data-home]');
      if(h&&h.querySelector('.loader'))h.innerHTML=skeletonHome260();
    }
  }catch{}
  scheduleRails260();
  return out;
};

/* Cache only TMDB detail/season metadata used by Home reconciliation; public Discover lists remain under r259 cache. */
try{
  const tmdb260Base=tmdb;
  tmdb=async function(path,params={}){
    const cacheable=/^\/tv\/\d+(?:\/season\/\d+)?$/.test(String(path||''));
    if(!cacheable)return tmdb260Base(path,params);
    const key=META260+String(path);
    try{
      const hit=JSON.parse(localStorage.getItem(key)||'null');
      if(hit?.data&&now260()-Number(hit.at||0)<21600000)return hit.data;
    }catch{}
    const data=await tmdb260Base(path,params);
    try{if(data)localStorage.setItem(key,JSON.stringify({at:now260(),data}))}catch{}
    return data;
  };
}catch{}

window.addEventListener('cinetracker:data-changed',()=>{try{sessionStorage.removeItem(CACHE260)}catch{};homePage260=1;homeSentinelObserver260?.disconnect?.()});

/* Modal/detail horizontal rails. No MutationObserver: arm after actual renders/navigation with finite, scoped rescans. */
const directRails260=[
  '.season-tabs','.season-list','.season-row','[data-seasons]','.ct169-season-row',
  '.ct169-season-chart-carousel','.ct169-chart-scroll','.ct244-seasons-scroll','.ct244-chart-scroll',
  '.episode-list','.episodes-list','.episodes-row','.episode-row','[data-episodes]','[data-season-episodes]',
  '.related-scroll','.related-grid','.related-row','[data-related]',
  '.similar-scroll','.similar-grid','.similar-row','[data-similar]',
  '.recommendations-scroll','.recommendations-grid','.recommendations-row','[data-recommendations]',
  '.cast-scroll','.cast-grid','.cast-row','[data-cast]',
  '.actors-scroll','.actors-grid','.actors-row','[data-actors]',
  '.people-scroll','.people-grid','.people-row','[data-people]',
  '.credits-scroll','.credits-row','[data-credits]',
  '.episode-graph','.graph-shell','.chart-wrap','.chart-scroll','[data-chart]','[data-episode-chart]'
].join(',');

function railRoot260(){return q260('.modal,.detail-modal,[role="dialog"],[data-modal]')||q260('.app[data-page="series"] main,.app[data-page="movie"] main,.app[data-page="anime"] main')||q260('#app')||document}
function markRail260(el,force=false){
  if(!el||el===document.body||el===document.documentElement||el.id==='app')return false;
  const overflow=(Number(el.scrollWidth)||0)>(Number(el.clientWidth)||0)+2;
  if(!force&&!overflow&&el.children.length<2)return false;
  el.dataset.ct260X='1';
  for(const c of ['flex','overflow-x-auto','scrollbar-thin','whitespace-nowrap','touch-pan-x','flex-nowrap'])el.classList.add(c);
  return true;
}
function semanticRail260(section){
  const nodes=qa260('div,ul,ol',section).filter(el=>el.children.length>=2&&!el.closest('[data-ct260-x]'));
  if(!nodes.length)return null;
  nodes.sort((a,b)=>{
    const sa=(a.children.length*10)+Math.max(0,a.scrollWidth-a.clientWidth);
    const sb=(b.children.length*10)+Math.max(0,b.scrollWidth-b.clientWidth);
    return sb-sa;
  });
  return nodes[0]||null;
}
function armRails260(root=railRoot260()){
  try{
    qa260(directRails260,root).forEach(el=>markRail260(el));
    const wanted=/temporad|epis[oó]d|melhores|piores|gr[aá]fic|nota dos epis|atores|elenco|cast|relacionad|semelhant|recomend/i;
    qa260('section,.section,.panel,.card,.detail-section',root).forEach(section=>{
      const head=q260('h1,h2,h3,h4,.section-title,.card-title',section);
      if(!head||!wanted.test(head.textContent||''))return;
      const rail=semanticRail260(section);
      if(rail)markRail260(rail,true);
    });
  }catch{}
}
let railTimers260=[];
function scheduleRails260(){
  try{cancelAnimationFrame(window.__ct260Raf||0)}catch{}
  try{window.__ct260Raf=requestAnimationFrame(()=>armRails260())}catch{setTimeout(()=>armRails260(),0)}
  railTimers260.forEach(clearTimeout);
  railTimers260=[60,220,700,1500,3000,5000].map(ms=>setTimeout(()=>armRails260(),ms));
}
document.addEventListener('click',()=>scheduleRails260(),true);
window.addEventListener('popstate',scheduleRails260);
window.addEventListener('hashchange',scheduleRails260);

/* Native touch scroll; delegated pointer drag is mouse/pen only and never moves body/window. */
let drag260=null;
document.addEventListener('pointerdown',e=>{
  const rail=e.target?.closest?.('[data-ct260-x]');
  if(!rail||e.pointerType==='touch'||rail.scrollWidth<=rail.clientWidth+1)return;
  drag260={rail,id:e.pointerId,x:e.clientX,left:rail.scrollLeft,moved:false};
  rail.classList.add('ct260-dragging');
  try{rail.setPointerCapture(e.pointerId)}catch{}
},true);
document.addEventListener('pointermove',e=>{
  if(!drag260||e.pointerId!==drag260.id)return;
  const dx=e.clientX-drag260.x;
  if(Math.abs(dx)>2)drag260.moved=true;
  drag260.rail.scrollLeft=drag260.left-dx;
  if(drag260.moved)e.preventDefault();
},true);
function endDrag260(e){
  if(!drag260||e.pointerId!==drag260.id)return;
  drag260.rail.classList.remove('ct260-dragging');
  try{drag260.rail.releasePointerCapture(e.pointerId)}catch{}
  drag260=null;
}
document.addEventListener('pointerup',endDrag260,true);
document.addEventListener('pointercancel',endDrag260,true);

scheduleRails260();

window.__ctR260Test={restoreHome260,compactHome260,pageHome260,armRails260,markRail260};
})();
