(() => {
'use strict';
const VERSION='0.3.8';

// Home must always try to present one movie, one series and one anime from
// the user's own Watchlist. Do not keep a stale slot when its media vanished.
try {
  if (typeof currentWatchlistPicks === 'function') {
    currentWatchlistPicks = function () {
      const wanted=['FILME','SÉRIE','ANIME'];
      const all=[];
      try {
        for (const id of watchlist || []) {
          const item=mediaRegistry?.get?.(id);
          if(item) all.push(item);
        }
      } catch {}
      return wanted.map((type,slot)=>{
        let chosen=null;
        try {
          const oldId=watchlistSlots?.[slot];
          const old=oldId?mediaRegistry?.get?.(oldId):null;
          if(old&&old.type===type&&watchlist?.has?.(old.id)) chosen=old;
        } catch {}
        if(!chosen) chosen=all.find(x=>x?.type===type)||null;
        if(chosen&&Array.isArray(watchlistSlots)) watchlistSlots[slot]=chosen.id;
        return chosen;
      }).filter(Boolean);
    };
  }
} catch {}

const css=document.createElement('style');
css.id='ct36-style';
css.textContent=`
/* Compact three-card rows on Home */
.ct36-trio{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:8px!important;align-items:start!important}
.ct36-trio>.card{min-width:0!important;height:auto!important;max-height:none!important}
.ct36-trio .poster{height:auto!important;min-height:0!important;aspect-ratio:2/3!important;padding:6px!important}
.ct36-trio .card-body{padding:7px!important;min-height:0!important;height:auto!important}
.ct36-trio .card h3{font-size:12px!important;line-height:1.2!important;margin:0 0 5px!important;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.ct36-trio .media-meta{font-size:9px!important;line-height:1.25!important;gap:3px!important}
.ct36-trio .cast,.ct36-trio .availability{display:none!important}
.ct36-trio .rating-row{font-size:10px!important;margin-top:4px!important}
.ct36-trio .card-actions{display:grid!important;grid-template-columns:1fr!important;gap:4px!important;margin-top:5px!important}
.ct36-trio .card-actions button{font-size:9px!important;min-height:31px!important;padding:5px 3px!important}
.ct36-trio .card-footer{padding-top:4px!important}
@media(max-width:430px){
 .ct36-trio{gap:6px!important}
 .ct36-trio .card-body{padding:6px!important}
 .ct36-trio .card h3{font-size:11px!important}
 .ct36-trio .media-meta{font-size:8px!important}
 .ct36-trio .card-actions button{font-size:8px!important;min-height:29px!important}
}
`;
document.head.appendChild(css);

const metaCache=new Map();
function image(path,size='w342'){return path?`${SUPABASE_URL}/functions/v1/tmdb-image?path=${encodeURIComponent(path)}&size=${encodeURIComponent(size)}`:''}
async function detail(type,id){
  const key=type+':'+id;if(metaCache.has(key))return metaCache.get(key);
  try{const raw=sessionStorage.getItem('ct36:'+key);if(raw){const v=JSON.parse(raw);if(Date.now()-v.t<86400000){metaCache.set(key,v.d);return v.d}}}catch{}
  const u=new URL(`${SUPABASE_URL}/functions/v1/tmdb-proxy`);u.searchParams.set('path',`/${type}/${id}`);u.searchParams.set('language','pt-BR');
  const r=await fetch(u,{headers:authHeaders()});const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error('TMDB '+r.status);
  metaCache.set(key,d);try{sessionStorage.setItem('ct36:'+key,JSON.stringify({t:Date.now(),d}))}catch{}return d;
}
function identify(card){
  let item=null;const mid=card.dataset.mediaId||'';try{item=mediaRegistry?.get?.(mid)||null}catch{}
  let id=Number(item?.tmdbId||card.dataset.ct29Id||card.dataset.ct30Id||0);let type=String(item?.apiType||card.dataset.apiType||card.dataset.ct29Type||'');
  const m=mid.match(/^tmdb-(movie|tv)-(\d+)$/);if(!id&&m){type=m[1];id=Number(m[2])}
  type=type.includes('movie')?'movie':'tv';return{id,type,item};
}
async function fillCard(card){
  if(card.dataset.ct36Done==='1')return;const {id,type,item}=identify(card);if(!id)return;
  card.dataset.ct36Done='1';
  try{
    const d=await detail(type,id);const title=d.title||d.name||item?.title||'';const h=card.querySelector('h3,h2,strong');const p=card.querySelector('.poster,.tmdb-poster');
    if(title&&h)h.textContent=title;
    if(d.poster_path&&p){p.classList.add('tmdb-poster');p.style.backgroundImage=`url('${image(d.poster_path,'w342')}')`;p.style.backgroundSize='cover';p.style.backgroundPosition='center 18%'}
    if(item){item.title=title||item.title;item.posterUrl=d.poster_path?image(d.poster_path,'w342'):item.posterUrl;item.tmdbId=d.id||item.tmdbId}
  }catch{card.dataset.ct36Done='0'}
}
function homeSections(){
  if(typeof view!=='undefined'&&view!=='home')return [];
  const sections=[...document.querySelectorAll('.section')];
  return sections.filter(s=>{const t=s.querySelector('.section-title h2')?.textContent||'';return /Da sua Watchlist|Fora da lista/i.test(t)});
}
let token=0;
function tuneHome(){
  if(typeof view!=='undefined'&&view!=='home')return;const my=++token;
  const sections=homeSections();
  for(const s of sections){const g=s.querySelector('.grid');if(g)g.classList.add('ct36-trio')}
  const cards=sections.flatMap(s=>[...s.querySelectorAll('.card')]).slice(0,6);let i=0;
  for(let n=0;n<3;n++)(async()=>{while(i<cards.length&&my===token){await fillCard(cards[i++])}})();
}
let queued=false;function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;tuneHome()})}
const root=document.getElementById('app')||document.documentElement;
new MutationObserver(schedule).observe(root,{childList:true,subtree:true});
const oldRender=typeof render==='function'?render:null;if(oldRender)render=function(){token++;const r=oldRender();schedule();return r};
setTimeout(schedule,0);
})();
