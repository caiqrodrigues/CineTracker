/* r194 Web — taste intelligence for Pra Voce + compact Profile */
(() => {
'use strict';
if(window.__ctR194WebLoaded)return;
window.__ctR194WebLoaded=true;
window.__ctR194Web='taste-intelligence-compact-profile';
window.__ctWebRevision='r194-taste-intelligence-compact-profile';
window.__ctR194RecommendationIntelligence='favorites-strongest-seen-history-affinity';
window.__ctR194ProfileDensity='same-layout-less-vertical-space';

const now194=()=>Date.now();
const num194=v=>Number(v||0)||0;
function type194(x){try{return mediaType(x)}catch{return String(x?.media_type||x?.type||'').toLowerCase()==='movie'?'movie':'tv'}}
function id194(x){try{return Number(mediaTmdb(x)||0)}catch{return Number(x?.id||x?.tmdb_id||x?.raw_tmdb?.source_tmdb_id||0)}}
function genres194(x){
  try{return [...new Set((genreIds158(x)||[]).map(Number).filter(n=>n>0))]}catch{}
  const r=x?.raw_tmdb||{};const out=[];
  for(const g of x?.genre_ids||r?.genre_ids||[])if(Number(g)>0)out.push(Number(g));
  for(const g of r?.genres||[])if(Number(g?.id)>0)out.push(Number(g.id));
  return [...new Set(out)];
}
function year194(x){return Number(String(x?.release_date||x?.first_air_date||x?.release_year||x?.raw_tmdb?.release_date||x?.raw_tmdb?.first_air_date||'').slice(0,4)||0)}
function seen194(x){return Boolean(x?.is_seen||x?.is_completed||x?.is_in_progress||x?.is_up_to_date||num194(x?.watched_episodes)>0||x?.last_watched_at)}
function favorite194(x){return Boolean(x?.is_favorite)}
function recency194(x){
  const t=Date.parse(x?.last_watched_at||'');if(!Number.isFinite(t))return 1;
  const days=Math.max(0,(now194()-t)/86400000);
  if(days<=30)return 1.35;if(days<=180)return 1.2;if(days<=365)return 1.1;return 1;
}
function taste194(dash){
  const genre=new Map(),decade=new Map();let samples=0,total=0;
  for(const x of dash||[]){
    const fav=favorite194(x),seen=seen194(x);if(!fav&&!seen)continue;
    let w=0;
    if(fav)w+=9;                         // favoritos são o sinal mais forte
    if(seen)w+=3.5;                      // histórico/vistos molda o gosto geral
    if(x?.is_completed)w+=1.4;
    if(x?.is_up_to_date||x?.is_in_progress)w+=0.8;
    w*=recency194(x);
    const gs=genres194(x);if(!gs.length)continue;
    samples++;total+=w;
    for(const g of gs)genre.set(g,(genre.get(g)||0)+w);
    const y=year194(x);if(y>0){const d=Math.floor(y/10)*10;decade.set(d,(decade.get(d)||0)+w*.22)}
  }
  const ranked=[...genre.entries()].sort((a,b)=>b[1]-a[1]);
  const peak=ranked[0]?.[1]||1;
  return{genre,decade,ranked,peak,samples,total};
}
function affinity194(x,t){
  if(!t||!t.samples)return 0;
  const gs=genres194(x);let overlap=0;
  for(const g of gs)overlap+=t.genre.get(g)||0;
  const genreScore=overlap/Math.max(1,t.peak);
  const y=year194(x),d=y?Math.floor(y/10)*10:0,decadeScore=d?(t.decade.get(d)||0)/Math.max(1,t.peak):0;
  const rating=Math.max(0,num194(x?.vote_average??x?.raw_tmdb?.vote_average)-7.5)*1.2;
  const votes=Math.log10(Math.max(1,num194(x?.vote_count??x?.raw_tmdb?.vote_count)))*.12;
  const popularity=Math.log10(Math.max(1,num194(x?.popularity??x?.raw_tmdb?.popularity)))*.08;
  return genreScore*10+decadeScore+rating+votes+popularity;
}
function rank194(rows,t){return [...(rows||[])].sort((a,b)=>affinity194(b,t)-affinity194(a,t)||num194(b?.vote_average)-num194(a?.vote_average)||num194(b?.popularity)-num194(a?.popularity))}

/* Personalization is additive: all r186 quality/history/watchlist rules stay authoritative. */
try{
  ct186FavoriteGenres=function(dash){return taste194(dash).ranked.slice(0,6).map(([id])=>Number(id))};
}catch{}
try{
  ct186FreshPools=async function(c){
    const t=taste194(c?.dash||[]),genres=t.ranked.slice(0,6).map(([id])=>id),wg=genres.length?genres.join('|'):undefined;
    const common={'vote_average.gte':CT186_MIN_SCORE,'without_genres':'99',include_adult:false};
    const [m,tv,a]=await Promise.all([
      pages('/discover/movie',{...common,'primary_release_date.gte':'1991-01-01','vote_count.gte':120,with_genres:wg,sort_by:'vote_average.desc'},'movie',6),
      pages('/discover/tv',{...common,'first_air_date.gte':'1991-01-01','vote_count.gte':100,with_genres:wg,sort_by:'vote_average.desc'},'tv',6),
      pages('/discover/tv',{...common,'first_air_date.gte':'1991-01-01','vote_count.gte':60,with_origin_country:'JP',with_genres:'16',sort_by:'vote_average.desc'},'tv',6)
    ]);
    const clean=rows=>rank194(ct186UniqueRows(rows).filter(x=>ct186FreshEligible(x,c)),t);
    return{movie:clean(m).filter(x=>!ct186Anime(x)),series:clean(tv).filter(x=>!ct186Anime(x)),anime:clean(a).filter(x=>ct186Anime(x))};
  };
}catch{}
try{
  ct186WatchPools=function(c){
    const t=taste194(c?.dash||[]);
    const rows=rank194(ct186UniqueRows((c?.dash||[]).filter(ct186DashWatchlist).map(x=>{try{const d=dashboardCard162(x);return d?{...d,_ct_watchlist:true}:null}catch{return null}}).filter(Boolean)).filter(x=>ct186WatchEligible(x,c)),t);
    return{movie:rows.filter(x=>ct186Type(x)==='movie'),series:rows.filter(x=>ct186Type(x)==='tv'&&!ct186Anime(x)),anime:rows.filter(x=>ct186Type(x)==='tv'&&ct186Anime(x))};
  };
}catch{}

/* Daily pick stays stable until midnight, but comes only from the strongest taste matches. */
try{
  ct186DailyPick=function(pool,used){
    const usable=(pool||[]).filter(x=>!used.has(ct186Key(x))&&!ct186LocalBlocked.has(ct186Key(x))).slice(0,14);if(!usable.length)return null;
    let saved='';try{saved=localStorage.getItem(ct186DailyStorage())||''}catch{}
    let pick=usable.find(x=>ct186Key(x)===saved)||null;
    if(!pick){const seed=localDay()+':'+String(user?.id||session?.user?.id||'anon');pick=usable[ct186Hash(seed)%usable.length]||usable[0];try{localStorage.setItem(ct186DailyStorage(),ct186Key(pick))}catch{}}
    return pick;
  };
}catch{}

/* Make the personalization explicit without changing the Pra Voce structure. */
try{
  const renderForYouBase194=ct166RenderForYou;
  ct166RenderForYou=function(data){
    let html=renderForYouBase194(data);
    html=html.replaceAll('fora da Watchlist, histórico e progresso','baseado nos seus vistos e favoritos · fora da Watchlist, histórico e progresso');
    html=html.replace('somente não assistidos · Filme · Série · Anime','priorizada pelo seu gosto · somente não assistidos · Filme · Série · Anime');
    return html;
  };
}catch{}

/* Cached Pra Voce from an older ranking must not win after this release. */
try{
  discoverCache.clear();
  for(const k of Object.keys(localStorage))if(k.includes('discover:foryou')||k.includes('r186:foryou'))localStorage.removeItem(k);
}catch{}

/* Same Profile organization, denser vertically. */
const style=document.createElement('style');style.id='ct194-profile-compact';style.textContent=`
[data-page="profile"] .page{gap:10px!important}
[data-page="profile"] section.panel{padding:12px 14px!important;margin-bottom:10px!important;border-radius:18px!important}
[data-page="profile"] .panel-head{min-height:28px!important;margin-bottom:8px!important;gap:8px!important}
[data-page="profile"] .panel-head h2{font-size:16px!important;line-height:1.15!important;margin:0!important}
[data-page="profile"] .panel-head small{font-size:10px!important;line-height:1.2!important}
[data-page="profile"] .stats{gap:8px!important}
[data-page="profile"] .stat{min-height:62px!important;padding:8px 10px!important;border-radius:13px!important;display:flex!important;flex-direction:column!important;justify-content:center!important}
[data-page="profile"] .stat small{font-size:9px!important;line-height:1.15!important;margin:0 0 4px!important}
[data-page="profile"] .stat b{font-size:21px!important;line-height:1!important}
[data-page="profile"] [data-profile-sports-panel] p{margin:7px 0 0!important;font-size:10px!important;line-height:1.25!important}
[data-page="profile"] .ct-r180-profile-stats,[data-page="profile"] .ct180-profile-stats,[data-page="profile"] .profile-stat-grid{gap:8px!important}
[data-page="profile"] .ct-r180-profile-stats .stat,[data-page="profile"] .ct180-profile-stats .stat,[data-page="profile"] .profile-stat-grid .stat{min-height:62px!important}
@media(max-width:760px){
  [data-page="profile"] section.panel{padding:10px!important}
  [data-page="profile"] .stat{min-height:58px!important;padding:7px 8px!important}
  [data-page="profile"] .stat b{font-size:19px!important}
}
`;document.getElementById(style.id)?.remove();document.head.appendChild(style);
})();
