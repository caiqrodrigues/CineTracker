/* Web r199 — repeat watches + favorite drill-down + Sports cleanup */
(() => {
'use strict';
if(window.__ctR199WebLoaded)return;
window.__ctR199WebLoaded=true;
window.__ctR199Web='rewatch-favorites-sports-navigation';
window.__ctWebRevision='r199-rewatch-favorites-sports';
window.__ctR199Rewatch='persistent-2x-3x-4x-no-disable';
window.__ctR199Favorites='view-more-opens-movie-series-person';
window.__ctR199Sports='remove-status-statistics-summary-card';
window.__ctR199Discover='preserve-top10-own-renderer-horizontal-single-row';

const norm199=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const esc199=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const path199=()=>String(location.pathname||'/');
const route199=()=>{try{return String(route?.()||'')}catch{return path199().replace(/^\/+/,'').split('/')[0]||'home'}};
const pos199=v=>{const n=Number(v||0);return Number.isFinite(n)&&n>0?n:0};

function changed199(source){
  try{homeCache=null}catch{}
  try{profileCache=null}catch{}
  try{discoverCache?.clear?.()}catch{}
  try{ct171SeenMap=null}catch{}
  try{window.dispatchEvent(new CustomEvent('cinetracker:data-changed',{detail:{source,at:Date.now()}}))}catch{}
}
function playLabel199(plays){const n=Math.max(2,Number(plays||0)||2);return '↻ '+n+'x'}

try{
  ct171RewatchMovie=async function(id,btn){
    id=Number(id||0);if(!(id>0)||!btn||btn.dataset.ct199Busy==='1')return;
    const old=String(btn.textContent||'↻ Reassistir');btn.dataset.ct199Busy='1';btn.disabled=true;btn.textContent='Salvando...';
    try{
      const m=await ensureMedia('movie',id);
      const r=await rpc('cinetracker_mark_watch_v0994',{
        p_media_id:Number(m.id),p_item_type:'movie',p_season_number:null,p_episode_number:null,
        p_title:m.title||null,p_runtime_minutes:Number(m.runtime_minutes||0)||null,
        p_released_episodes:null,p_watched_at:new Date().toISOString()
      });
      const plays=Math.max(2,Number(r?.plays||0)||2);
      btn.dataset.plays=String(plays);btn.textContent=playLabel199(plays);btn.disabled=false;
      changed199('movie-rewatch-r199');
      try{toast('Filme registrado · '+plays+'x')}catch{}
    }catch(e){
      btn.textContent=old;btn.disabled=false;try{toast(e?.message||String(e))}catch{}
    }finally{delete btn.dataset.ct199Busy}
  };
}catch{}

try{
  ct171RewatchEpisode=async function(sn,en,btn){
    sn=Number(sn||0);en=Number(en||0);
    const st=ct169DrawerState;if(!st||Number(st.seasonNo)!==sn||!btn||btn.dataset.ct199Busy==='1')return;
    const ep=(st.episodes||[]).find(x=>Number(x.episode_number)===en);if(!ep)return;
    const old=String(btn.textContent||'↻ Reassistir');btn.dataset.ct199Busy='1';btn.disabled=true;btn.textContent='Salvando...';
    try{
      const m=await ensureMedia('tv',Number(st.showId));
      const r=await rpc('cinetracker_mark_episode_v0994',{
        p_media_id:Number(m.id),p_season_number:sn,p_episode_number:en,p_title:ep.name||null,
        p_runtime_minutes:Number(ep.runtime||0)||null,
        p_released_episodes:Number(ct169CurrentDetail?.detail?.number_of_episodes||0)||null,
        p_series_status:ct169CurrentDetail?.detail?.status||null,p_watched_at:new Date().toISOString()
      });
      const plays=Math.max(2,Number(r?.plays||0)||2);
      btn.dataset.plays=String(plays);btn.textContent=playLabel199(plays);btn.disabled=false;
      changed199('episode-rewatch-r199');
      try{toast('Episódio registrado · '+plays+'x')}catch{}
    }catch(e){
      btn.textContent=old;btn.disabled=false;try{toast(e?.message||String(e))}catch{}
    }finally{delete btn.dataset.ct199Busy}
  };
}catch{}

function ensureMovieRewatch199(){
  const m=path199().match(/^\/movie\/(\d+)/);if(!m)return;
  const id=Number(m[1]),hero=document.querySelector('.ct169-detail-hero,.detail-hero');if(!hero)return;
  const seen=hero.querySelector('[data-detail-seen]');if(!seen)return;
  const isSeen=seen.disabled||seen.classList.contains('on')||seen.getAttribute('aria-pressed')==='true'||/\bvisto\b|assistido/i.test(String(seen.textContent||''));
  if(!isSeen)return;
  let b=hero.querySelector(`[data-ct171-rewatch-media="movie:${id}"]`);
  if(!b){
    b=document.createElement('button');b.type='button';b.className='btn btn-secondary ct199-rewatch';
    b.dataset.ct171RewatchMedia='movie:'+id;b.textContent='↻ Reassistir';seen.insertAdjacentElement('afterend',b);
  }else b.disabled=false;
}
let detailTimer199=0;
function scheduleDetail199(){clearTimeout(detailTimer199);detailTimer199=setTimeout(ensureMovieRewatch199,45)}
try{new MutationObserver(scheduleDetail199).observe(document.querySelector('#app')||document.documentElement,{childList:true,subtree:true})}catch{}
window.addEventListener('popstate',scheduleDetail199);window.addEventListener('hashchange',scheduleDetail199);
window.addEventListener('cinetracker:data-changed',scheduleDetail199);scheduleDetail199();

function tmdb199(x){
  try{const n=Number(mediaTmdb(x));if(n>0)return n}catch{}
  return pos199(x?.tmdb_id)||pos199(x?.raw_tmdb?.source_tmdb_id)||pos199(x?.raw_tmdb?.id)||pos199(x?.id);
}
function type199(x){
  try{return mediaType(x)==='movie'?'movie':'tv'}catch{}
  return String(x?.media_type||x?.type||'').toLowerCase()==='movie'?'movie':'tv';
}
function title199(x){try{return mediaTitle(x)||x?.title||x?.name||'Sem título'}catch{return x?.title||x?.name||'Sem título'}}
function poster199(x,person=false){
  const p=person?(x?.profile_path||x?.raw_tmdb?.profile_path):(x?.poster_path||x?.raw_tmdb?.poster_path);if(!p)return '';
  try{return img(p,person?'w185':'w342')}catch{return ''}
}
function dashboardFav199(want){
  let dash=[];try{dash=Array.isArray(profileCache?.dashboard)?profileCache.dashboard:[]}catch{}
  return dash.filter(x=>Boolean(x?.is_favorite||x?.is_liked||x?.favorite)&&type199(x)===want);
}
function favoriteRows199(kind){
  let rows={};try{rows=profileRows(profileCache||{})||{}}catch{}
  if(kind==='movie')return Array.isArray(rows.movieFav)&&rows.movieFav.length?rows.movieFav:dashboardFav199('movie');
  if(kind==='tv')return Array.isArray(rows.seriesFav)&&rows.seriesFav.length?rows.seriesFav:dashboardFav199('tv');
  let a=[];try{a=profileCache?.favorite_actors||profileCache?.favorite_people||[]}catch{}return Array.isArray(a)?a:[];
}
function closeFav199(){document.querySelector('[data-ct199-favorite-overlay]')?.remove()}
function favCard199(x,kind){
  if(kind==='person'){
    const id=pos199(x?.tmdb_person_id)||pos199(x?.tmdb_id)||pos199(x?.id),p=poster199(x,true),name=x?.actor_name||x?.name||'Ator';
    if(!id)return '';
    return `<button type="button" class="ct199-fav-card" data-ct199-open-person="${id}" data-person="${id}"><span class="ct199-fav-poster"${p?` style="background-image:url('${esc199(p)}')"`:''}></span><span><b>${esc199(name)}</b><small>Ator favorito</small></span><i>›</i></button>`;
  }
  const id=tmdb199(x),t=kind==='movie'?'movie':'tv',p=poster199(x,false);if(!id)return '';
  return `<button type="button" class="ct199-fav-card" data-ct199-open-media="${t}:${id}"><span class="ct199-fav-poster"${p?` style="background-image:url('${esc199(p)}')"`:''}></span><span><b>${esc199(title199(x))}</b><small>${t==='movie'?'Filme':'Série'} favorito</small></span><i>›</i></button>`;
}
function openFavorites199(kind){
  closeFav199();const rows=favoriteRows199(kind),label=kind==='movie'?'Filmes Favoritos':kind==='tv'?'Séries Favoritas':'Atores Favoritos';
  const ov=document.createElement('div');ov.className='ct199-fav-overlay';ov.dataset.ct199FavoriteOverlay='1';
  ov.innerHTML=`<div class="ct199-fav-box"><div class="ct199-fav-head"><div><small>FAVORITOS</small><h2>${label}</h2></div><button type="button" class="btn" data-ct199-fav-close>✕ Fechar</button></div><div class="ct199-fav-list">${rows.map(x=>favCard199(x,kind)).join('')||'<div class="empty">Nenhum favorito encontrado.</div>'}</div></div>`;
  document.body.appendChild(ov);
}
function moreKind199(action){
  const a=norm199(String(action||'').replace(/^profile:/,''));
  if(a.includes('filmes favoritos'))return'movie';if(a.includes('series favoritas'))return'tv';if(a.includes('atores favoritos'))return'person';return'';
}
document.addEventListener('click',e=>{
  const close=e.target.closest?.('[data-ct199-fav-close]');if(close||e.target?.matches?.('[data-ct199-favorite-overlay]')){e.preventDefault();closeFav199();return}
  const more=e.target.closest?.('[data-ct-more]');if(more){
    const kind=moreKind199(more.dataset.ctMore);if(kind){e.preventDefault();e.stopImmediatePropagation();openFavorites199(kind);return}
  }
  const media=e.target.closest?.('[data-ct199-open-media]');if(media){
    e.preventDefault();e.stopImmediatePropagation();const[t,id0]=String(media.dataset.ct199OpenMedia||'').split(':'),id=Number(id0||0);if(!(id>0))return;
    closeFav199();go('/'+(t==='movie'?'movie':'series')+'/'+id);return;
  }
  const person=e.target.closest?.('[data-ct199-open-person]');if(person){closeFav199();return}
},true);
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeFav199()});

function cleanSports199(){
  const sports=route199()==='sports'||path199().replace(/^\/+/,'').split('/')[0]==='sports';if(!sports)return;
  const root=document.querySelector('[data-sports]');if(!root)return;
  root.querySelectorAll('[data-sports-stats],[data-sports-summary],.sports-stats,.sport-stats,.sports-summary,.sports-status-summary,.sports-kpis').forEach(x=>x.remove());
  for(const panel of root.querySelectorAll('section.panel,.panel')){
    const hasStats=!!panel.querySelector('.stats,.stat,[class*="stat-grid"],[class*="stats-grid"]');if(!hasStats)continue;
    const txt=norm199(panel.textContent||'');
    const sportsWords=/(jogos|eventos|esportes|favoritos)/.test(txt),summaryWords=/(disponiveis|disponivel|quantidade|total|status|resumo|agora)/.test(txt);
    if(sportsWords&&summaryWords)panel.remove();
  }
}
try{const base=paintSports;paintSports=function(...args){const out=base.apply(this,args);requestAnimationFrame(cleanSports199);return out}}catch{}
try{const base=renderSports;renderSports=async function(...args){const out=await base.apply(this,args);requestAnimationFrame(cleanSports199);return out}}catch{}
let sportsTimer199=0;try{new MutationObserver(()=>{if(route199()!=='sports')return;clearTimeout(sportsTimer199);sportsTimer199=setTimeout(cleanSports199,35)}).observe(document.querySelector('#app')||document.documentElement,{childList:true,subtree:true})}catch{}

const style=document.createElement('style');style.id='ct199-web-style';style.textContent=`
[data-page="discover"] .ct-r180-tabs,[data-page="discover"] .tabs,[data-discover] .ct-r180-tabs,[data-discover] .tabs{display:flex!important;flex-direction:row!important;flex-wrap:nowrap!important;overflow-x:auto!important;overflow-y:hidden!important;white-space:nowrap!important;-webkit-overflow-scrolling:touch!important}
[data-page="discover"] .ct-r180-tabs>*,[data-page="discover"] .tabs>*,[data-discover] .ct-r180-tabs>*,[data-discover] .tabs>*{flex:0 0 auto!important;width:auto!important;min-width:max-content!important}
.ct199-rewatch,[data-ct171-rewatch-episode],[data-ct171-rewatch-media]{white-space:nowrap}
.ct199-fav-overlay{position:fixed;inset:0;z-index:10050;background:rgba(0,0,0,.76);display:grid;place-items:center;padding:18px}
.ct199-fav-box{width:min(880px,96vw);max-height:88vh;overflow:hidden;background:#071017;border:1px solid #29485a;border-radius:16px;box-shadow:0 24px 70px #000b}
.ct199-fav-head{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px;border-bottom:1px solid #1d3440}.ct199-fav-head small{opacity:.7}.ct199-fav-head h2{margin:2px 0 0}
.ct199-fav-list{padding:12px;overflow:auto;max-height:calc(88vh - 72px);display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:8px}
.ct199-fav-card{appearance:none;border:1px solid #203b49;background:#0b1820;color:inherit;border-radius:12px;padding:8px;display:grid;grid-template-columns:48px 1fr auto;gap:10px;align-items:center;text-align:left;cursor:pointer}.ct199-fav-card:hover{border-color:#3f7188}.ct199-fav-card i{font-style:normal;font-size:22px}.ct199-fav-poster{width:48px;height:68px;border-radius:8px;background:#102631 center/cover no-repeat}.ct199-fav-card span:nth-child(2){min-width:0}.ct199-fav-card b,.ct199-fav-card small{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
`;document.getElementById(style.id)?.remove();document.head.appendChild(style);
})();
