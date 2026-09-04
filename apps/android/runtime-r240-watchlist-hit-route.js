/* Android 0.99.7.68 r240 — route a physical Watchlist Trocar tap before r237 can treat it as a fresh swap.
   Top10 native scrolling and the existing 100% novos swap remain owned by r237. */
(() => {
'use strict';
if(window.__ctAndroidR240Loaded)return;
window.__ctAndroidR240Loaded=true;
window.__ctAndroidBundle='android-v0.99.7.68-r240-watchlist-hit-route';
window.__ctR240Scope='watchlist-visual-hit-before-r237-fresh-only';
window.__ctR240Fix='first-handler-routes-watchlist-slot-by-section-and-column';
window.__ctR240Source='profile-dashboard-direct';

const INDEX240=Object.create(null);
let dashboardCache240=null,dashboardAt240=0,dashboardTask240=null;
let lastTap240=0,lastKind240='';

function norm240(v){return String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim()}
function isForYou240(){
  let r='';try{r=String(route?.()||'')}catch{r=String(location.pathname||'')}
  r=r.replace(/^\/+/, '').split(/[?#/]/)[0];if(r!=='discover')return false;
  try{return String(discoverState?.tab||'foryou')==='foryou'}catch{return true}
}
function title240(sec){return norm240(sec?.querySelector?.('h1,h2,h3,.panel-head h2,.panel-head h3')?.textContent||'')}
function watchSections240(){
  const out=[];for(const sec of document.querySelectorAll?.('section,.panel')||[])if(title240(sec)==='da sua watchlist')out.push(sec);return out;
}
function inside240(rect,x,y){return !!rect&&x>=rect.left&&x<=rect.right&&y>=rect.top&&y<=rect.bottom&&rect.width>0&&rect.height>0}
function visible240(el){const r=el?.getBoundingClientRect?.();return !!r&&r.width>1&&r.height>1&&r.bottom>0&&r.right>0&&r.top<(window.innerHeight||99999)}
function trocaButtons240(sec){
  return [...(sec?.querySelectorAll?.('button,[role="button"]')||[])].filter(b=>visible240(b)&&(norm240(b.textContent).includes('trocar')||String(b.dataset?.ct237Swap||b.dataset?.ct226Swap||b.dataset?.ct166Swap||'').includes(':')));
}
function watchHit240(e){
  if(!isForYou240())return null;
  const x=Number(e?.clientX),y=Number(e?.clientY);if(!Number.isFinite(x)||!Number.isFinite(y))return null;
  let sec=null;
  for(const s of watchSections240()){const r=s.getBoundingClientRect?.();if(inside240(r,x,y)){sec=s;break}}
  if(!sec)return null;
  let hitButton=null;
  for(const b of trocaButtons240(sec)){if(inside240(b.getBoundingClientRect?.(),x,y)){hitButton=b;break}}
  if(!hitButton){
    const target=e?.target?.closest?.('button,[role="button"]');
    if(target&&sec.contains?.(target)&&norm240(target.textContent).includes('trocar'))hitButton=target;
  }
  if(!hitButton)return null;
  const slots=[...(sec.querySelectorAll?.('.ct166-slot,.foryou-slot')||[])].filter(visible240);
  if(!slots.length)return null;
  let slot=hitButton.closest?.('.ct166-slot,.foryou-slot');
  if(!slot||!sec.contains?.(slot)){
    slot=slots.find(s=>inside240(s.getBoundingClientRect?.(),x,y))||slots.reduce((best,s)=>{
      const r=s.getBoundingClientRect?.(),br=best?.getBoundingClientRect?.();
      const d=Math.abs(x-(r.left+r.right)/2),bd=best?Math.abs(x-(br.left+br.right)/2):Infinity;return d<bd?s:best;
    },null);
  }
  if(!slot)return null;
  const rawKey=String(hitButton.dataset?.ct237Swap||hitButton.dataset?.ct226Swap||hitButton.dataset?.ct166Swap||'');
  let kind='';
  if(rawKey.endsWith(':movie'))kind='movie';else if(rawKey.endsWith(':series'))kind='series';else if(rawKey.endsWith(':anime'))kind='anime';
  const label=norm240(slot.querySelector?.('.ct166-slot-head small,.ct166-slot-head b,.ct166-slot-head')?.textContent||'');
  if(label.includes('anime'))kind='anime';else if(label.includes('serie'))kind='series';else if(label.includes('filme'))kind='movie';
  if(!kind){const i=Math.max(0,slots.indexOf(slot));kind=i===1?'series':i===2?'anime':'movie'}
  return {sec,slot,button:hitButton,kind,key:'watchlist:'+kind};
}
function id240(x){return Number(x?.id||x?.tmdb_id||x?.raw_tmdb?.id||x?.raw_tmdb?.source_tmdb_id||0)}
function genreIds240(raw){const out=[];for(const v of Array.isArray(raw?.genre_ids)?raw.genre_ids:[])out.push(Number(v));for(const g of Array.isArray(raw?.genres)?raw.genres:[])out.push(Number(g?.id||g));return out.filter(Number.isFinite)}
function anime240(row,card){
  try{if(typeof animeDashboard162==='function'&&(animeDashboard162(row)||animeDashboard162(card)))return true}catch{}
  const raw=row?.raw_tmdb&&typeof row.raw_tmdb==='object'?row.raw_tmdb:{};
  const ids=genreIds240(raw),names=(Array.isArray(raw?.genres)?raw.genres:[]).map(g=>norm240(g?.name||g));
  const animation=ids.includes(16)||names.includes('animation')||names.includes('animacao')||names.includes('anime');
  const lang=String(raw?.original_language||card?.original_language||'').toLowerCase();
  const origins=[...(Array.isArray(raw?.origin_country)?raw.origin_country:[]),...(Array.isArray(raw?.production_countries)?raw.production_countries.map(x=>x?.iso_3166_1||x):[])].map(x=>String(x||'').toUpperCase());
  return card?.media_type==='tv'&&animation&&(lang==='ja'||origins.includes('JP'));
}
function card240(row){
  const raw=row?.raw_tmdb&&typeof row.raw_tmdb==='object'?row.raw_tmdb:{};
  const id=Number(row?.tmdb_id||raw?.id||raw?.source_tmdb_id||0);if(!(id>0))return null;
  const mk=String(row?.media_kind||raw?.media_type||'').toLowerCase(),mediaType=mk==='movie'?'movie':'tv';
  const title=String(row?.title||raw?.title||raw?.name||'').trim(),poster=String(row?.poster_path||raw?.poster_path||'').trim();if(!title||!poster)return null;
  const out={...raw,id,tmdb_id:id,media_type:mediaType,poster_path:poster};
  if(mediaType==='movie'){out.title=title;out.name=raw?.name||title;if(!out.release_date&&row?.release_year)out.release_date=String(row.release_year)+'-01-01'}
  else{out.name=title;out.title=raw?.title||title;if(!out.first_air_date&&row?.release_year)out.first_air_date=String(row.release_year)+'-01-01'}
  if(!Number(out.vote_average)&&Number(row?.rating))out.vote_average=Number(row.rating);return out;
}
async function dashboard240(){
  if(dashboardCache240&&Date.now()-dashboardAt240<20000)return dashboardCache240;if(dashboardTask240)return dashboardTask240;
  dashboardTask240=Promise.resolve(rpc('cinetracker_profile_media_dashboard_v0991',{})).then(rows=>{dashboardCache240=Array.isArray(rows)?rows:[];dashboardAt240=Date.now();return dashboardCache240}).finally(()=>{dashboardTask240=null});return dashboardTask240;
}
async function pool240(kind){
  const rows=[];for(const row of await dashboard240()){
    if(!row?.is_watchlist||row?.is_seen||row?.is_completed)continue;const card=card240(row);if(!card)continue;const isAnime=anime240(row,card);
    if(kind==='movie'&&card.media_type!=='movie')continue;if(kind==='series'&&(card.media_type!=='tv'||isAnime))continue;if(kind==='anime'&&(card.media_type!=='tv'||!isAnime))continue;rows.push(card);
  }
  try{const fallback=window.__ctR237Pool?.('watchlist:'+kind)||[];rows.push(...fallback)}catch{}
  const seen=new Set(),out=[];for(const x of rows){const k=String(x?.media_type||'')+':'+id240(x);if(!(id240(x)>0)||seen.has(k))continue;seen.add(k);out.push(x)}return out;
}
function currentId240(slot){return Number(String(slot?.querySelector?.('[data-media]')?.dataset?.media||'').split(':')[1]||0)}
async function swapHit240(hit){
  const {slot,kind,key}=hit||{};if(!slot||!kind||typeof ct166Slot!=='function')return false;
  const rows=await pool240(kind),current=currentId240(slot);if(rows.length<2){try{toast('Não há outro item disponível nesta categoria da Watchlist.')}catch{};return false}
  let pos=Number(INDEX240[key]??-1),next=null;for(let n=0;n<rows.length;n++){pos=(pos+1)%rows.length;const c=rows[pos];if(id240(c)>0&&id240(c)!==current){next=c;break}}
  if(!next)return false;INDEX240[key]=pos;
  const label=slot.querySelector?.('.ct166-slot-head small,small')?.textContent?.trim()||'';
  const box=document.createElement('div');box.innerHTML=ct166Slot(label,next,key,rows.length);const fresh=box.firstElementChild;if(!fresh)return false;
  slot.replaceWith(fresh);fresh.classList?.add?.('ct237-swap-pulse');
  try{decorate226(fresh)}catch{};requestAnimationFrame(()=>{try{ct169TuneForYou?.()}catch{};try{window.__ctR237NormalizeRail&&0}catch{}});return true;
}
window.__ctR240Pool=pool240;window.__ctR240WatchHit=watchHit240;window.__ctR240SwapHit=swapHit240;
window.__ctR240HandleWatchTap=function(e){
  const hit=watchHit240(e);if(!hit)return false;
  const now=Date.now();if(e?.cancelable)e.preventDefault();e?.stopImmediatePropagation?.();
  if(now-lastTap240<650&&hit.kind===lastKind240)return true;lastTap240=now;lastKind240=hit.kind;
  void swapHit240(hit);return true;
};
})();
