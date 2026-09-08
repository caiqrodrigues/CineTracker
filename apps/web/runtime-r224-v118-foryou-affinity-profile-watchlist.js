/* CineTracker 1.0.18 — affinity-ranked Pra Voce + direct Profile Watchlist stat-button authority. */
(()=>{
'use strict';
if(window.__ctR224V118)return;
window.__ctR224V118='foryou-affinity-profile-watchlist-render-authority';
window.__ctV118ForYou='recent-watched+watchlist-weighted-affinity-independent-kinds';
window.__ctV118ProfileWatchlist='direct-r180-stat-renderer-buttons';
window.__ctV118Fallback='no-unrelated-popularity-fill';

const n118=v=>{const n=Number(v);return Number.isFinite(n)?n:0};
const id118=x=>{try{return Number(mediaTmdb(x)||x?.tmdb_id||x?.id||x?.raw_tmdb?.source_tmdb_id||0)||0}catch{return Number(x?.tmdb_id||x?.id||x?.raw_tmdb?.source_tmdb_id||0)||0}};
const type118=x=>{try{return mediaType(x)==='movie'?'movie':'tv'}catch{return String(x?.media_type||'')==='movie'?'movie':'tv'}};
const genres118=x=>[...(x?.genre_ids||x?.raw_tmdb?.genre_ids||x?.genres?.map?.(g=>g?.id)||x?.raw_tmdb?.genres?.map?.(g=>g?.id)||[])].map(Number).filter(Boolean);
const lang118=x=>String(x?.original_language||x?.raw_tmdb?.original_language||'').toLowerCase();
const poster118=x=>{try{return Boolean(mediaPoster(x))}catch{return Boolean(x?.poster_path||x?.raw_tmdb?.poster_path)}};
function anime118(x){
 const explicit=String(x?.media_kind||x?.kind||'').toLowerCase();if(explicit==='anime')return true;
 try{if(typeof ct186Anime==='function')return Boolean(ct186Anime(x))}catch{}
 const g=genres118(x),countries=x?.origin_country||x?.raw_tmdb?.origin_country||[];return type118(x)==='tv'&&(g.includes(16)||countries.includes('JP'));
}
function kind118(x){return type118(x)==='movie'?'movie':anime118(x)?'anime':'series'}
function history118(x){try{if(typeof ct186DashHistory==='function'&&ct186DashHistory(x))return true}catch{}return Boolean(x?.is_seen||x?.is_completed||x?.is_in_progress||x?.is_up_to_date||n118(x?.watched_episodes)>0||x?.last_watched_at)}
function watch118(x){try{if(typeof ct186DashWatchlist==='function'&&ct186DashWatchlist(x))return true}catch{}return Boolean(x?.is_watchlist)}
function watchedAt118(x){const t=Date.parse(x?.last_watched_at||x?.watched_at||x?.updated_at||x?.raw_tmdb?.last_watched_at||0);return Number.isFinite(t)?t:0}
function date118(x){return String(type118(x)==='movie'?x?.release_date||x?.raw_tmdb?.release_date:x?.first_air_date||x?.raw_tmdb?.first_air_date||'').slice(0,10)}

function seedRows118(c,kind){
 const dash=Array.isArray(c?.dash)?c.dash:[];
 const recent=dash.filter(x=>kind118(x)===kind&&history118(x)&&id118(x)>0).sort((a,b)=>watchedAt118(b)-watchedAt118(a));
 const watch=dash.filter(x=>kind118(x)===kind&&watch118(x)&&id118(x)>0).sort((a,b)=>watchedAt118(b)-watchedAt118(a));
 const map=new Map();
 recent.slice(0,4).forEach((x,i)=>{const id=id118(x),weight=[14,11,8,6][i]||5;map.set(id,{row:x,weight,reason:'recent',rank:i})});
 watch.slice(0,3).forEach((x,i)=>{const id=id118(x),weight=[7,5,4][i]||3,old=map.get(id);if(old)old.weight+=Math.max(2,weight-2);else map.set(id,{row:x,weight,reason:'watchlist',rank:i})});
 return [...map.values()].sort((a,b)=>b.weight-a.weight).slice(0,5);
}
async function enrichSeed118(seed){
 const x=seed.row;if(genres118(x).length&&lang118(x))return seed;const id=id118(x),t=type118(x);if(!(id>0))return seed;
 try{const d=await safeTmdb(`/${t}/${id}`);return {...seed,row:{...x,...d,id,tmdb_id:id,media_type:t,media_kind:String(x?.media_kind||'')}}}catch{return seed}
}
function profile118(seeds){
 const genres=new Map(),langs=new Map();for(const s of seeds){for(const g of genres118(s.row))genres.set(g,(genres.get(g)||0)+s.weight);const l=lang118(s.row);if(l)langs.set(l,(langs.get(l)||0)+s.weight)}
 return {genres,langs};
}
function strictFresh118(x,c){if(!x||!poster118(x))return false;try{return typeof ct186FreshEligible==='function'?Boolean(ct186FreshEligible(x,c)):true}catch{return false}}
function addCandidate118(map,x,seed,source,p){
 if(!x||!(id118(x)>0))return;const k=`${type118(x)}:${id118(x)}`,gs=genres118(x),overlap=gs.reduce((s,g)=>s+(p.genres.get(g)||0),0);if(p.genres.size&&overlap<=0)return;
 const l=lang118(x),languageBonus=l&&p.langs.has(l)?Math.min(5,(p.langs.get(l)||0)/4):0,sourceFactor=source==='recommendations'?1.0:.62;
 const sourceScore=seed.weight*sourceFactor,genreScore=overlap*.52,multi=map.has(k)?3.5:0,score=sourceScore+genreScore+languageBonus+multi;
 const old=map.get(k);if(old){old.score+=score;old.hits++;old.sources.add(source)}else map.set(k,{row:x,score,hits:1,sources:new Set([source]),overlap});
}
async function poolForKind118(c,kind){
 let seeds=seedRows118(c,kind);if(!seeds.length)return [];
 seeds=await Promise.all(seeds.map(enrichSeed118));const p=profile118(seeds),map=new Map();
 const jobs=[];
 seeds.forEach((seed,i)=>{
  const t=type118(seed.row),id=id118(seed.row);if(!(id>0))return;
  jobs.push(safeTmdb(`/${t}/${id}/recommendations`).then(d=>({seed,source:'recommendations',rows:d?.results||[]})).catch(()=>({seed,source:'recommendations',rows:[]})));
  if(i<2)jobs.push(safeTmdb(`/${t}/${id}/similar`).then(d=>({seed,source:'similar',rows:d?.results||[]})).catch(()=>({seed,source:'similar',rows:[]})));
 });
 const batches=await Promise.all(jobs);
 for(const b of batches)for(const raw of b.rows||[]){const row={...raw,media_type:type118(b.seed.row)};if(kind118(row)!==kind||!strictFresh118(row,c))continue;addCandidate118(map,row,b.seed,b.source,p)}
 const out=[...map.values()].filter(v=>v.score>=6).sort((a,b)=>b.score-a.score||b.hits-a.hits||n118(b.row?.vote_average)-n118(a.row?.vote_average)||n118(b.row?.popularity)-n118(a.row?.popularity)).map(v=>{try{Object.defineProperty(v.row,'__ct118Affinity',{value:{score:v.score,hits:v.hits,sources:[...v.sources]},configurable:true})}catch{}return v.row});
 return out.slice(0,80);
}
let affinity118=null,affinityAt118=0,affinityTask118=null;
async function affinityPools118(c){
 if(affinity118&&Date.now()-affinityAt118<180000)return affinity118;if(affinityTask118)return affinityTask118;
 affinityTask118=Promise.all(['movie','series','anime'].map(k=>poolForKind118(c,k))).then(([movie,series,anime])=>{affinity118={movie,series,anime};affinityAt118=Date.now();window.__ctV118LastPools=affinity118;return affinity118}).finally(()=>affinityTask118=null);return affinityTask118;
}
try{ct186FreshPools=async function(c){return affinityPools118(c)}}catch{}
try{ct186PopularPool=async function(){return []}}catch{}
try{const baseAdd118=addWatchlist;addWatchlist=async function(...args){const out=await baseAdd118.apply(this,args);affinity118=null;affinityAt118=0;return out}}catch{}
try{discoverCache?.clear?.()}catch{}

/* Direct renderer authority: these are buttons before Profile HTML ever reaches the DOM. */
try{
 const baseStat118=ctR180StatCard;
 ctR180StatCard=function(label,value,wide=false){
  const exact=String(label||''),kind=exact==='Filmes Watchlist'?'movie':exact==='Séries Watchlist'?'series':'';if(!kind)return baseStat118(label,value,wide);
  const aria=kind==='movie'?'Abrir todos os filmes na Watchlist':'Abrir todas as séries na Watchlist';
  return `<button type="button" class="stat ${wide?'ct-r180-stat-wide ':''}ct117-watchlist-stat ct118-watchlist-stat" data-ct118-watchlist="${kind}" data-ct117-watchlist-stat="${kind}" aria-label="${aria}"><small>${typeof esc==='function'?esc(label):label}</small><b>${value}</b><span class="ct117-stat-chevron" aria-hidden="true">›</span></button>`;
 };
}catch{}
document.addEventListener('click',e=>{
 const b=e.target?.closest?.('[data-ct118-watchlist]');if(!b||e.defaultPrevented)return;
 const kind=b.dataset.ct118Watchlist;if(!kind)return;e.preventDefault();
 try{if(typeof window.__ctV117OpenWatchlist==='function')void window.__ctV117OpenWatchlist(kind)}catch{}
},true);

const style118=document.createElement('style');style118.id='ct-v118-ui';style118.textContent=`
button.stat.ct118-watchlist-stat{appearance:none;-webkit-appearance:none;font:inherit;color:inherit;text-align:inherit;width:100%;cursor:pointer}
button.stat.ct118-watchlist-stat:hover,button.stat.ct118-watchlist-stat:focus-visible{border-color:#4a839b!important;background:#0d202a!important;outline:none!important;transform:translateY(-1px)}
`;
document.getElementById(style118.id)?.remove();document.head.appendChild(style118);

window.__ctV118SeedRows=seedRows118;
window.__ctV118PoolForKind=poolForKind118;
window.__ctV118AffinityPools=affinityPools118;
window.__ctV118Invalidate=()=>{affinity118=null;affinityAt118=0};
})();
