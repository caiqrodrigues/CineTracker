/* Android 0.99.7.47 — deterministic Discover layout/filter UI + manual media fallback */
(() => {
'use strict';
if(window.__ctAndroidR219Loaded)return;
window.__ctAndroidR219Loaded=true;
window.__ctAndroidR219='discover-grid-real-minimal-filters-manual-media';
window.__ctAndroidTop10='r218-single-click-direct-r217-synchronous-shell';
window.__ctAndroidFilters='known-filter-groups-hidden-behind-tune-button';
window.__ctAndroidManualMedia='negative-id-resolve-or-local-detail';
window.__ctAndroidBundle='android-v0.99.7.47-r219-top10-filters-manual-media';

const tune219='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h10M18 7h2M4 17h2M10 17h10M14 4v6M8 14v6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
function realFilter219(g){
  if(!g||!g.querySelector)return false;
  if(g.closest('.tabs,[role="tablist"],[data-ct-r180-tabs],.ct-mini-filter-panel')&& !g.classList.contains('ct-r180-type-filters'))return false;
  return !!(g.matches('.ct-r180-type-filters')||g.querySelector('[data-discover-type],[data-sport],select,input[type="checkbox"],input[type="radio"]'));
}
function triggerFor219(g){const p=g.previousElementSibling;return p?.classList?.contains('ct-mini-filter-trigger')?p:null}
function close219(g,t){g.dataset.ctMiniOpen='0';t?.setAttribute('aria-expanded','false')}
function ensureFilter219(g){
  if(!realFilter219(g))return;
  g.dataset.ct219Filter='1';g.dataset.ctMiniFilter='1';g.classList.add('ct-mini-filter-panel');
  let t=triggerFor219(g);
  if(!t){
    t=document.createElement('button');t.type='button';t.className='ct-mini-filter-trigger ct219-filter-trigger';t.innerHTML=tune219;t.title='Filtros';t.setAttribute('aria-label','Filtros');t.setAttribute('aria-expanded','false');g.insertAdjacentElement('beforebegin',t);
    t.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();const open=g.dataset.ctMiniOpen==='1';document.querySelectorAll('[data-ct219-filter="1"]').forEach(o=>{if(o!==g)close219(o,triggerFor219(o))});g.dataset.ctMiniOpen=open?'0':'1';t.setAttribute('aria-expanded',open?'false':'true')});
  }
  if(g.dataset.ctMiniOpen!=='1')close219(g,t);
}
function scanFilters219(root=document){
  const groups=[];try{if(root.matches?.('.ct-r180-type-filters,.filters,[data-filters],[data-filter-group],.filter-bar,.filter-row,.filter-group,.filter-controls'))groups.push(root)}catch{}
  try{groups.push(...(root.querySelectorAll?.('.ct-r180-type-filters,.filters,[data-filters],[data-filter-group],.filter-bar,.filter-row,.filter-group,.filter-controls')||[]))}catch{}
  [...new Set(groups)].filter(realFilter219).forEach(ensureFilter219);
}

/* Imported/manual media: safe TMDB exact-match first; otherwise keep it usable with local detail. */
const media219=new Map();
function norm219(v){try{return String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/&/g,' e ').replace(/[^a-z0-9]+/g,' ').trim().replace(/\s+/g,' ')}catch{return String(v||'').toLowerCase().trim()}}
function year219(v){const m=String(v||'').match(/\b(18|19|20|21)\d{2}\b/);return m?Number(m[0]):0}
function data219(host){const m=String(host?.dataset?.media||'').match(/^(movie|tv):(-?\d+)$/);if(!m)return null;const id=Number(m[2]||0)||0;if(id>0)return null;const title=host.querySelector('b')?.textContent?.trim()||host.querySelector('.card-title')?.textContent?.trim()||'';if(!title)return null;return {host,type:m[1],oldId:id,title,year:year219(host.querySelector('small')?.textContent||'')}}
function exact219(rows,j){const q=norm219(j.title);let a=(Array.isArray(rows)?rows:[]).filter(x=>Number(x?.id||0)>0&&[x?.title,x?.name,x?.original_title,x?.original_name].map(norm219).includes(q));if(j.year){const same=a.filter(x=>year219(j.type==='movie'?x?.release_date:x?.first_air_date)===j.year);if(same.length)a=same}if(!a.length)return null;a.sort((x,y)=>Number(y?.popularity||0)-Number(x?.popularity||0)||Number(y?.vote_count||0)-Number(x?.vote_count||0));if(a.length>1&&!j.year){const p0=Number(a[0]?.popularity||0),p1=Number(a[1]?.popularity||0);if(!(p0>0&&p0>=Math.max(1,p1*1.35)))return null}return a[0]}
async function resolve219(j){
  const k=j.type+'|'+norm219(j.title)+'|'+j.year;if(media219.has(k))return media219.get(k);
  const p=(async()=>{try{const d=await safeTmdb('/search/'+j.type,{query:j.title,page:1,include_adult:false});const h=exact219(d?.results,j);if(h)return {kind:'tmdb',id:Number(h.id),poster_path:h.poster_path||null,backdrop_path:h.backdrop_path||null}}catch{}return {kind:'local'}})();media219.set(k,p);return p;
}
function manualCover219(host,label){const v=host?.querySelector?.('.poster,.thumb');if(!v)return;v.classList.add('ct219-manual-cover');v.dataset.ct219Label=(norm219(label)==='formula 1'?'F1':String(label||'?').slice(0,2).toUpperCase());v.dataset.ct215PosterState='done';v.dataset.ct217Recovered='local'}
function applyResolved219(j,r){if(!j.host?.isConnected)return;if(r?.kind==='tmdb'&&r.id>0){j.host.dataset.media=j.type+':'+r.id;const v=j.host.querySelector('.poster,.thumb');if(v&&r.poster_path){v.style.backgroundImage="url('"+img(r.poster_path,v.classList.contains('thumb')?'w154':'w342')+"')";v.classList.remove('ct219-manual-cover');v.dataset.ct215PosterState='done';v.dataset.ct217Recovered='1'}return}manualCover219(j.host,j.title)}
function scanMedia219(root=document){const hs=[];try{if(root.matches?.('[data-media]'))hs.push(root)}catch{}try{hs.push(...(root.querySelectorAll?.('[data-media]')||[]))}catch{}for(const h of hs){const j=data219(h);if(!j)continue;resolve219(j).then(r=>applyResolved219(j,r)).catch(()=>manualCover219(h,j.title))}}
async function localRow219(j){try{const rows=await api(`media?select=id,tmdb_id,media_type,media_kind,title,original_title,release_year,poster_path,runtime_minutes,total_seasons,total_episodes,genres,raw_tmdb&tmdb_id=eq.${j.oldId}&limit=1`);return rows?.[0]||null}catch{return null}}
function localDetail219(row,j){
  const active=(()=>{try{const r=String(route());return ['home','discover','sports','profile','configs'].includes(r)?r:'discover'}catch{return'discover'}})();
  try{const u=new URL(location.href);u.searchParams.set('ctLocalMedia',String(j.oldId));history.pushState({ctLocalMedia:j.oldId},'',u.pathname+u.search)}catch{}
  const title=row?.title||j.title,yr=row?.release_year||j.year||'',genres=Array.isArray(row?.genres)?row.genres.join(' · '):'',meta=[yr,j.type==='movie'?'Filme':'Série',genres].filter(Boolean).join(' · ');
  const extra=j.type==='tv'?[row?.total_seasons?`${row.total_seasons} temporadas`:null,row?.total_episodes?`${row.total_episodes} episódios`:null].filter(Boolean).join(' · '):row?.runtime_minutes?`${row.runtime_minutes} min`:'';
  setApp(shell('Detalhes','',active,`<div class="page" data-detail data-ct219-local-detail><section class="panel"><div class="detail-hero"><div class="detail-poster ct219-manual-cover" data-ct219-label="${norm219(title)==='formula 1'?'F1':esc(String(title).slice(0,2).toUpperCase())}"></div><div class="detail-copy"><div class="eyebrow">${j.type==='movie'?'Filme':'Série'}</div><h1>${esc(title)}</h1><div class="meta">${esc(meta)}</div>${extra?`<div class="meta">${esc(extra)}</div>`:''}<p>${esc(row?.raw_tmdb?.overview||'Item da sua biblioteca. Os metadados deste título não possuem correspondência segura no TMDB.')}</p></div></div></section></div>`));
}
/* Base click intentionally ignores negative IDs. This later listener resolves them instead of leaving a dead card. */
document.addEventListener('click',e=>{const h=e.target?.closest?.('[data-media]');const j=data219(h);if(!j)return;e.preventDefault();e.stopImmediatePropagation();void(async()=>{const r=await resolve219(j);if(r?.kind==='tmdb'&&r.id>0){applyResolved219(j,r);go(`/${j.type==='movie'?'movie':'series'}/${r.id}`);return}localDetail219(await localRow219(j),j)})()},true);

const style219=document.createElement('style');style219.id='ct-android-099747';style219.textContent=`
/* Discover rail is always a compact 3x3 grid; do not depend on a fragile page ancestor. */
.ct-r180-tab-shell{display:block!important;width:100%!important;max-width:100%!important;overflow:visible!important;margin:0 0 7px!important}.ct-r180-tab-arrow{display:none!important}[data-ct-r180-tabs]{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:5px!important;width:100%!important;max-width:100%!important;min-width:0!important;overflow:visible!important;padding:0!important;transform:none!important;scroll-snap-type:none!important}[data-ct-r180-tabs]>.chip{box-sizing:border-box!important;width:100%!important;min-width:0!important;max-width:none!important;min-height:34px!important;padding:6px 4px!important;font-size:10px!important;line-height:1.1!important;white-space:normal!important;text-align:center!important}
/* Real filter groups stay hidden until the small tune button is pressed. */
[data-ct219-filter="1"][data-ct-mini-open="0"]{display:none!important}[data-ct219-filter="1"][data-ct-mini-open="1"]{display:flex!important;flex-wrap:wrap!important;gap:6px!important;padding:7px!important;margin:0 0 8px!important;border:1px solid rgba(122,190,225,.22)!important;border-radius:12px!important;background:rgba(5,18,26,.97)!important}.ct219-filter-trigger{margin:1px 0 7px!important}
/* Non-TMDB manual items get a deliberate local cover instead of a blank rectangle. */
.ct219-manual-cover{background-image:linear-gradient(145deg,rgba(10,30,40,.98),rgba(16,82,105,.72),rgba(5,15,22,.98))!important;position:relative!important;overflow:hidden!important}.ct219-manual-cover:before{content:attr(data-ct219-label);position:absolute;inset:0;display:grid;place-items:center;font-size:clamp(24px,7vw,52px);font-weight:900;letter-spacing:-.06em;color:#e9f8ff;text-shadow:0 3px 20px rgba(0,0,0,.45)}.ct219-manual-cover:after{content:'';position:absolute;left:-20%;right:-20%;bottom:18%;height:9%;transform:skewX(-25deg);background:rgba(255,255,255,.14)}
`;
document.getElementById(style219.id)?.remove();document.head.appendChild(style219);

let frame219=0;function scan219(root=document){if(frame219)return;frame219=requestAnimationFrame(()=>{frame219=0;scanFilters219(root);scanMedia219(root)})}
try{new MutationObserver(ms=>{for(const m of ms)for(const n of m.addedNodes||[])if(n?.nodeType===1){scanFilters219(n);scanMedia219(n)}scan219(document)}).observe(document.querySelector('#app')||document.body,{childList:true,subtree:true})}catch{}
requestAnimationFrame(()=>{scanFilters219(document);scanMedia219(document)});
})();
