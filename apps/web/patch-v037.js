(() => {
'use strict';
const VERSION='0.3.9';

// Supabase returns at most 1000 rows per REST request. The cloud state has more
// than 3000 overrides/media rows, so the old client silently saw only a slice.
try {
  const baseSbApi = typeof sbApi === 'function' ? sbApi : null;
  if (baseSbApi && !window.__ct39PagedSbApi) {
    window.__ct39PagedSbApi = true;
    sbApi = async function(path, options = {}) {
      const method = String(options?.method || 'GET').toUpperCase();
      const table = String(path).split('?')[0];
      const shouldPage = method === 'GET' && ['media_overrides','media','episode_progress'].includes(table) && !/[?&](limit|offset)=/i.test(path);
      if (!shouldPage) return baseSbApi(path, options);
      const pageSize = 1000, all = [];
      for (let start = 0; start < 10000; start += pageSize) {
        const rows = await baseSbApi(path, { ...options, headers: { ...(options.headers || {}), Range: `${start}-${start + pageSize - 1}` } });
        if (Array.isArray(rows)) all.push(...rows);
        if (!Array.isArray(rows) || rows.length < pageSize) break;
      }
      return all;
    };
  }
} catch {}

const css=document.createElement('style');css.id='ct39-style';css.textContent=`
/* Same-size recommendation cards */
.ct36-trio{align-items:stretch!important}
.ct36-trio>.card{display:flex!important;flex-direction:column!important;height:100%!important}
.ct36-trio>.card>.card-body,.ct36-trio .card-body{display:flex!important;flex-direction:column!important;flex:1 1 auto!important}
.ct36-trio .card-footer{margin-top:auto!important}
/* Favorites are deliberately denser than normal catalog cards */
.ct30-favs{grid-template-columns:repeat(8,minmax(0,1fr))!important;gap:8px!important}
.ct30-fav-poster{aspect-ratio:2/3!important}.ct30-fav-body{padding:6px!important}.ct30-fav-body strong{font-size:10px!important;line-height:1.2!important}.ct30-fav-body span{font-size:8px!important}
@media(max-width:900px){.ct30-favs{grid-template-columns:repeat(5,minmax(0,1fr))!important}}
@media(max-width:650px){.ct30-favs{grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:7px!important}.ct30-fav-body{padding:5px!important}}
`;
document.head.appendChild(css);

function go(v){ try{ view=v; render(); window.scrollTo(0,0); }catch{} }
function navButton(nav,v,label){let b=nav.querySelector(`[data-view="${v}"]`);if(!b){b=document.createElement('button');b.type='button';b.dataset.view=v;b.textContent=label;nav.appendChild(b)}b.onclick=e=>{e.preventDefault();go(v)};return b}
function fixNav(){
  for(const nav of document.querySelectorAll('.nav')){
    const hist=navButton(nav,'history','◷ Histórico');
    const prof=navButton(nav,'profile','◉ Perfil');
    const config=[...nav.querySelectorAll('button')].find(b=>/configura|conta/i.test(b.textContent||''));
    // History/Profile must be real clickable sidebar entries; Settings is always last.
    nav.appendChild(hist);nav.appendChild(prof);if(config)nav.appendChild(config);
  }
  for(const b of document.querySelectorAll('.nav [data-view="history"],.mobile-nav [data-view="history"]'))b.onclick=e=>{e.preventDefault();go('history')};
  for(const b of document.querySelectorAll('.nav [data-view="profile"],.mobile-nav [data-view="profile"]'))b.onclick=e=>{e.preventDefault();go('profile')};
}

function typeOf(item){
  const t=String(item?.type||item?.mediaKind||item?.media_kind||'').toUpperCase();
  if(t.includes('ANIME'))return 'ANIME';if(t.includes('FILME')||t.includes('MOVIE'))return 'FILME';return 'SÉRIE';
}
async function tmdbDetail(item){
  const id=Number(item?.tmdbId||item?.tmdb_id||0); if(!id)return null;
  const kind=String(item?.apiType||item?.media_type||'').includes('movie')?'movie':'tv';
  const key=`ct39detail:${kind}:${id}`;try{const c=JSON.parse(sessionStorage.getItem(key)||'null');if(c&&Date.now()-c.t<86400000)return c.d}catch{}
  const u=new URL(`${SUPABASE_URL}/functions/v1/tmdb-proxy`);u.searchParams.set('path',`/${kind}/${id}`);u.searchParams.set('language','pt-BR');
  const r=await fetch(u,{headers:authHeaders()});if(!r.ok)return null;const d=await r.json();try{sessionStorage.setItem(key,JSON.stringify({t:Date.now(),d}))}catch{}return d;
}
let animeProbeRunning=false;
async function ensureAnimeInWatchlist(){
  if(animeProbeRunning)return;let all=[];try{for(const id of watchlist||[]){const x=mediaRegistry?.get?.(id);if(x)all.push(x)}}catch{}
  if(all.some(x=>typeOf(x)==='ANIME'))return;
  const tv=all.filter(x=>typeOf(x)==='SÉRIE').slice(0,36);if(!tv.length)return;animeProbeRunning=true;
  try{
    for(let i=0;i<tv.length;i+=6){
      const group=await Promise.all(tv.slice(i,i+6).map(async x=>[x,await tmdbDetail(x)]));
      const hit=group.find(([,d])=>d&&Array.isArray(d.origin_country)&&d.origin_country.includes('JP')&&Array.isArray(d.genres)&&d.genres.some(g=>/anima/i.test(g.name||'')));
      if(hit){const [item,d]=hit;item.type='ANIME';item.mediaKind='anime';if(d.poster_path&&!item.posterUrl)item.posterUrl=`${SUPABASE_URL}/functions/v1/tmdb-image?path=${encodeURIComponent(d.poster_path)}&size=w342`;try{if(typeof view!=='undefined'&&view==='home')render()}catch{}break;}
    }
  }finally{animeProbeRunning=false}
}

function fixWatchlistPicker(){
  try{
    if(typeof currentWatchlistPicks!=='function')return;
    currentWatchlistPicks=function(){
      const wanted=['FILME','SÉRIE','ANIME'],all=[];try{for(const id of watchlist||[]){const x=mediaRegistry?.get?.(id);if(x)all.push(x)}}catch{}
      const picks=wanted.map((t,slot)=>{let x=all.find(m=>typeOf(m)===t)||null;if(x&&Array.isArray(watchlistSlots))watchlistSlots[slot]=x.id;return x}).filter(Boolean);
      if(picks.length<3)setTimeout(ensureAnimeInWatchlist,0);
      return picks;
    };
  }catch{}
}

let queued=false;function tune(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;fixNav();fixWatchlistPicker();if(typeof view!=='undefined'&&view==='home')ensureAnimeInWatchlist();})}
new MutationObserver(tune).observe(document.getElementById('app')||document.documentElement,{childList:true,subtree:true});
const priorRender=typeof render==='function'?render:null;if(priorRender)render=function(){const r=priorRender();tune();return r};
setTimeout(tune,0);
})();
