/* Android 0.99.7.23 — mobile equivalents of Web r190-r195 */
(() => {
'use strict';
if(window.__ctAndroidR195Loaded)return;
window.__ctAndroidR195Loaded=true;
window.__ctAndroidR195='r190-r195-mobile-equivalents';
window.__ctAndroidStateAuthority='canonical-known-media-fast-detail-state';
window.__ctAndroidRecommendationIntelligence='favorites-strongest-seen-history-affinity';
window.__ctAndroidDoramaFilter='asian-scripted-tv-excluded-from-foryou';
window.__ctAndroidProfileDensity='statistics-less-vertical-space';
window.__ctAndroidSportsBackend='ct-sports-sync-v4+ct-sports-search-v2';
window.__ctAndroidSearch='bilingual-media-search';
window.__ctAndroidFastRoutes='home-r5+profile-fast-dashboard';

const normA23=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const numA23=v=>Number(v||0)||0;
const posA23=v=>{const n=Number(v||0);return Number.isFinite(n)&&n>0?n:0};
const typeA23=x=>{try{return ct186Type(x)}catch{return String(x?.media_type||x?.type||x?.raw_tmdb?.media_type||'').toLowerCase()==='movie'?'movie':'tv'}};
const idA23=x=>{try{return ct186Id(x)}catch{return posA23(x?.raw_tmdb?.source_tmdb_id)||posA23(x?.tmdb_id)||posA23(x?.id)||posA23(x?.raw_tmdb?.id)}};
function aliasesA23(x){const r=x?.raw_tmdb||{};return [...new Set([x?.title,x?.name,x?.original_title,x?.original_name,r?.title,r?.name,r?.original_title,r?.original_name].map(normA23).filter(Boolean))]}
function genresA23(x){
  try{return [...new Set((ct186GenresOf(x)||[]).map(Number).filter(n=>n>0))]}catch{}
  try{return [...new Set((genreIds158(x)||[]).map(Number).filter(n=>n>0))]}catch{}
  const r=x?.raw_tmdb||{},out=[];
  for(const g of x?.genre_ids||r?.genre_ids||[])if(Number(g)>0)out.push(Number(g));
  for(const g of r?.genres||[])if(Number(g?.id)>0)out.push(Number(g.id));
  return [...new Set(out)];
}
function yearA23(x){return Number(String(x?.release_date||x?.first_air_date||x?.release_year||x?.raw_tmdb?.release_date||x?.raw_tmdb?.first_air_date||'').slice(0,4)||0)}
function countriesA23(x){const r=x?.raw_tmdb||{},vals=[...(Array.isArray(x?.origin_country)?x.origin_country:[]),...(Array.isArray(r?.origin_country)?r.origin_country:[])];return [...new Set(vals.map(v=>String(v||'').toUpperCase()).filter(Boolean))]}
function isDoramaA23(x){
  if(typeA23(x)!=='tv')return false;
  try{if(ct186Anime(x))return false}catch{}
  const gs=genresA23(x);if(gs.includes(10764)||gs.includes(10763)||gs.includes(10767))return false;
  const lang=String(x?.original_language||x?.raw_tmdb?.original_language||'').toLowerCase();
  return countriesA23(x).some(c=>['KR','JP','CN','TW','HK','TH'].includes(c))||['ko','ja','zh','th'].includes(lang);
}
window.__ctIsDorama=isDoramaA23;

/* r191/r194: fast canonical context; an expired snapshot paints immediately and refreshes behind it. */
try{
  let ctxTaskA23=null;
  const refreshContextA23=async()=>{
    const dash=await rpc('cinetracker_profile_media_dashboard_v0997_fast',{});
    const historyMovieIds=new Set(),historyTvIds=new Set(),watchMovieIds=new Set(),watchTvIds=new Set(),historyAliases=new Set(),watchAliases=new Set();
    for(const x of dash||[]){
      const t=typeA23(x),id=Number(x?.tmdb_id||x?.raw_tmdb?.source_tmdb_id||0);
      if(ct186DashHistory(x)){if(id>0)(t==='movie'?historyMovieIds:historyTvIds).add(id);ct186AddAliases(historyAliases,t,x)}
      if(ct186DashWatchlist(x)){if(id>0)(t==='movie'?watchMovieIds:watchTvIds).add(id);ct186AddAliases(watchAliases,t,x)}
    }
    ct186ContextValue={dash:dash||[],historyMovieIds,historyTvIds,watchMovieIds,watchTvIds,historyAliases,watchAliases};ct186ContextAt=Date.now();return ct186ContextValue;
  };
  ct186Context=async function(force=false){
    if(!force&&ct186ContextValue){
      if(Date.now()-Number(ct186ContextAt||0)>60000&&!ctxTaskA23)ctxTaskA23=refreshContextA23().catch(()=>ct186ContextValue).finally(()=>{ctxTaskA23=null});
      return ct186ContextValue;
    }
    if(ctxTaskA23)return ctxTaskA23;
    ctxTaskA23=refreshContextA23().finally(()=>{ctxTaskA23=null});return ctxTaskA23;
  };
}catch{}

/* r195: dorama is a hard exclusion on top of every r186 rule. */
try{const base=ct186FreshEligible;ct186FreshEligible=function(x,c){return base(x,c)&&!isDoramaA23(x)}}catch{}
try{const base=ct186WatchEligible;ct186WatchEligible=function(x,c){return base(x,c)&&!isDoramaA23(x)}}catch{}

/* r194: favorites are the strongest taste signal; watched history adds affinity and recency. */
function seenA23(x){return Boolean(x?.is_seen||x?.is_completed||x?.is_in_progress||x?.is_up_to_date||numA23(x?.watched_episodes)>0||x?.last_watched_at)}
function recencyA23(x){const t=Date.parse(x?.last_watched_at||'');if(!Number.isFinite(t))return 1;const d=Math.max(0,(Date.now()-t)/86400000);return d<=30?1.35:d<=180?1.2:d<=365?1.1:1}
function tasteA23(dash){
  const genre=new Map(),decade=new Map();let samples=0;
  for(const x of dash||[]){
    const fav=Boolean(x?.is_favorite),seen=seenA23(x);if(!fav&&!seen)continue;
    let w=(fav?9:0)+(seen?3.5:0)+(x?.is_completed?1.4:0)+((x?.is_up_to_date||x?.is_in_progress)?0.8:0);w*=recencyA23(x);
    const gs=genresA23(x);if(!gs.length)continue;samples++;
    for(const g of gs)genre.set(g,(genre.get(g)||0)+w);
    const y=yearA23(x);if(y>0){const d=Math.floor(y/10)*10;decade.set(d,(decade.get(d)||0)+w*.22)}
  }
  const ranked=[...genre.entries()].sort((a,b)=>b[1]-a[1]),peak=ranked[0]?.[1]||1;return{genre,decade,ranked,peak,samples};
}
function affinityA23(x,t){if(!t?.samples)return 0;let overlap=0;for(const g of genresA23(x))overlap+=t.genre.get(g)||0;const y=yearA23(x),d=y?Math.floor(y/10)*10:0;return overlap/Math.max(1,t.peak)*10+(d?(t.decade.get(d)||0)/Math.max(1,t.peak):0)+Math.max(0,numA23(x?.vote_average??x?.raw_tmdb?.vote_average)-7.5)*1.2+Math.log10(Math.max(1,numA23(x?.vote_count??x?.raw_tmdb?.vote_count)))*.12+Math.log10(Math.max(1,numA23(x?.popularity??x?.raw_tmdb?.popularity)))*.08}
function rankA23(rows,t){return [...(rows||[])].sort((a,b)=>affinityA23(b,t)-affinityA23(a,t)||numA23(b?.vote_average)-numA23(a?.vote_average)||numA23(b?.popularity)-numA23(a?.popularity))}
try{ct186FavoriteGenres=function(dash){return tasteA23(dash).ranked.slice(0,6).map(([id])=>Number(id))}}catch{}
try{
  ct186FreshPools=async function(c){
    const t=tasteA23(c?.dash||[]),genres=t.ranked.slice(0,6).map(([id])=>id),wg=genres.length?genres.join('|'):undefined,common={'vote_average.gte':CT186_MIN_SCORE,'without_genres':'99',include_adult:false};
    const [m,tv,a]=await Promise.all([
      pages('/discover/movie',{...common,'primary_release_date.gte':'1991-01-01','vote_count.gte':120,with_genres:wg,sort_by:'vote_average.desc'},'movie',6),
      pages('/discover/tv',{...common,'first_air_date.gte':'1991-01-01','vote_count.gte':100,with_genres:wg,sort_by:'vote_average.desc'},'tv',6),
      pages('/discover/tv',{...common,'first_air_date.gte':'1991-01-01','vote_count.gte':60,with_origin_country:'JP',with_genres:'16',sort_by:'vote_average.desc'},'tv',6)
    ]);
    const clean=rows=>rankA23(ct186UniqueRows(rows).filter(x=>ct186FreshEligible(x,c)),t);
    return{movie:clean(m).filter(x=>!ct186Anime(x)),series:clean(tv).filter(x=>!ct186Anime(x)),anime:clean(a).filter(x=>ct186Anime(x))};
  };
}catch{}
try{
  ct186WatchPools=function(c){
    const t=tasteA23(c?.dash||[]),rows=rankA23(ct186UniqueRows((c?.dash||[]).filter(ct186DashWatchlist).map(x=>{try{const d=dashboardCard162(x);return d?{...d,_ct_watchlist:true}:null}catch{return null}}).filter(Boolean)).filter(x=>ct186WatchEligible(x,c)),t);
    return{movie:rows.filter(x=>typeA23(x)==='movie'),series:rows.filter(x=>typeA23(x)==='tv'&&!ct186Anime(x)),anime:rows.filter(x=>typeA23(x)==='tv'&&ct186Anime(x))};
  };
}catch{}
try{
  ct186DailyPick=function(pool,used){const usable=(pool||[]).filter(x=>!used.has(ct186Key(x))&&!ct186LocalBlocked.has(ct186Key(x))).slice(0,14);if(!usable.length)return null;let saved='';try{saved=localStorage.getItem(ct186DailyStorage())||''}catch{};let pick=usable.find(x=>ct186Key(x)===saved)||null;if(!pick){const seed=localDay()+':'+String(user?.id||session?.user?.id||'anon');pick=usable[ct186Hash(seed)%usable.length]||usable[0];try{localStorage.setItem(ct186DailyStorage(),ct186Key(pick))}catch{}}return pick};
}catch{}

/* r193: DB-known media closes imported aliases/manual-state gaps before cards are painted. */
let knownA23=null,knownAtA23=0,knownTaskA23=null;
async function loadKnownA23(force=false){if(!force&&knownA23&&Date.now()-knownAtA23<60000)return knownA23;if(knownTaskA23)return knownTaskA23;knownTaskA23=rpc('cinetracker_known_media_v1',{}).then(v=>{knownA23=Array.isArray(v)?v:[];knownAtA23=Date.now();return knownA23}).catch(()=>knownA23||[]).finally(()=>{knownTaskA23=null});return knownTaskA23}
function knownSetsA23(rows){const ids=new Set(),names=new Set();for(const x of rows||[]){const t=typeA23(x),id=idA23(x);if(id)ids.add(t+':'+id);for(const a of aliasesA23(x))names.add(t+':'+a)}return{ids,names}}
function blockedA23(x,c){const t=typeA23(x),id=idA23(x);return Boolean((id&&c.ids.has(t+':'+id))||aliasesA23(x).some(a=>c.names.has(t+':'+a)))}
function uniqA23(rows){const seen=new Set(),out=[];for(const x of rows||[]){const id=idA23(x),name=aliasesA23(x)[0]||'',k=typeA23(x)+':'+(id||name);if(!k||seen.has(k))continue;seen.add(k);out.push(x)}return out}
function sanitizeForYouA23(data,knownRows=knownA23||[]){
  if(!data||Array.isArray(data)||typeof data!=='object')return data;
  const c=knownSetsA23(knownRows),fresh=data._ct186_fresh||data._ct166_fresh||{},reserve=data._ct186_reserve||{};
  const clean=k=>uniqA23([...(fresh?.[k]||[]),...(reserve?.[k]||[])]).filter(x=>!blockedA23(x,c)&&!isDoramaA23(x));
  const nf={movie:clean('movie'),series:clean('series'),anime:clean('anime')},out={...data,_ct186_fresh:nf,_ct166_fresh:nf};
  const pick=(k,v,used=[])=>v&&!blockedA23(v,c)&&!isDoramaA23(v)&&!used.includes(idA23(v))?v:(nf[k]||[]).find(x=>!used.includes(idA23(x)))||null;
  out.daily=pick('movie',data.daily,[]);out.movie=pick('movie',data.movie,[idA23(out.daily)]);out.series=pick('series',data.series,[]);out.anime=pick('anime',data.anime,[]);return out;
}
try{const base=discoverRows;discoverRows=async function(tab){if(String(tab)!=='foryou')return base(tab);const [d,k]=await Promise.all([base(tab),loadKnownA23(false)]);const clean=sanitizeForYouA23(d,k);try{ct186ForYouData=clean}catch{};return clean}}catch{}
try{const base=paintDiscover;paintDiscover=function(data){if(String(discoverState?.tab||'foryou')==='foryou'&&knownA23)data=sanitizeForYouA23(data,knownA23);return base(data)}}catch{}

/* r190/r191: Watchlist recommendations become local-first 'mark seen' actions. */
function decorateForYouA23(){
  try{
    if(String(discoverState?.tab||'')!=='foryou')return;
    const root=document.querySelector('[data-discover-content]')||document.querySelector('[data-discover]');if(!root)return;
    for(const sec of root.querySelectorAll('section.panel,section.discover-section')){
      if(normA23(sec.querySelector('h2,h3')?.textContent||'')!=='da sua watchlist')continue;
      for(const b of sec.querySelectorAll('[data-discover-watch]')){const ref=String(b.dataset.discoverWatch||'');b.removeAttribute('data-discover-watch');b.dataset.ctA23Seen=ref;b.disabled=false;b.textContent='✓ Marcar visto'}
    }
  }catch{}
}
try{const base=paintDiscover;paintDiscover=function(data){const out=base(data);requestAnimationFrame(decorateForYouA23);return out}}catch{}
window.addEventListener('click',e=>{
  const b=e.target.closest?.('[data-ct-a23-seen]');if(!b)return;
  const raw=String(b.dataset.ctA23Seen||'');if(!raw)return;e.preventDefault();e.stopImmediatePropagation();
  const[type,id0]=raw.split(':'),id=Number(id0||0);if(!(id>0)||b.disabled)return;
  b.disabled=true;b.textContent='✓ Visto';try{ct186Block(type,id)}catch{};
  try{if(ct186ForYouData)requestAnimationFrame(()=>paintDiscover(ct186ForYouData))}catch{}
  try{void Promise.resolve(markSeen(type,id)).then(()=>{ct186ContextValue=null;knownAtA23=0}).catch(err=>{try{toast(err?.message||String(err))}catch{}})}catch{}
},true);

/* r193 detail: reconcile exact persisted state once per detail render. */
let detailTicketA23=0;
function detailRefA23(){const hero=document.querySelector('.ct169-detail-hero,.detail-hero');if(!hero)return null;for(const el of hero.querySelectorAll('[data-detail-seen],[data-detail-watchlist],[data-favorite],[data-detail-favorite]')){const raw=el.dataset.detailSeen||el.dataset.detailWatchlist||el.dataset.favorite||el.dataset.detailFavorite||'',m=String(raw).match(/^(movie|tv):(\d+)$/);if(m)return{hero,type:m[1],id:Number(m[2])}}return null}
async function reconcileDetailA23(){const ref=detailRefA23();if(!ref)return;const ticket=++detailTicketA23;let d=null;try{if(ct169CurrentDetail&&Number(ct169CurrentDetail.id)===ref.id)d=ct169CurrentDetail.detail||null}catch{};const title=d?.title||d?.name||ref.hero.querySelector('h1')?.textContent||'',original=d?.original_title||d?.original_name||'',year=Number(String(d?.release_date||d?.first_air_date||'').slice(0,4))||null;try{const st=await rpc('cinetracker_media_state_v1',{p_media_type:ref.type,p_tmdb_id:ref.id,p_title:title||null,p_original_title:original||null,p_release_year:year});if(ticket!==detailTicketA23||!st)return;const seen=ref.hero.querySelector('[data-detail-seen]'),watch=ref.hero.querySelector('[data-detail-watchlist]');if(seen){seen.classList.toggle('on',!!st.is_seen);seen.setAttribute('aria-pressed',st.is_seen?'true':'false');seen.textContent=st.is_seen?'✓ Visto':'✓ Marcar como visto';seen.disabled=!!st.is_seen}if(watch){watch.classList.toggle('on',!!st.is_watchlist);watch.setAttribute('aria-pressed',st.is_watchlist?'true':'false');watch.textContent=st.is_watchlist?'✓ Na Watchlist':'+ Watchlist'}}catch{}}
try{const base=renderDetail;renderDetail=async function(){const out=await base.apply(this,arguments);void reconcileDetailA23();return out}}catch{}

/* r193 Home: current fast canonical payload with visual-cache fallback. */
try{
  const base=renderHome;
  renderHome=async function(seq){
    let cached=null;try{cached=homeCache||ct163Read('home')}catch{cached=homeCache||null}
    try{const d=await rpc('cinetracker_home_live_v0997_r5',{p_today:localDay()});if(seq!==navSeq)return;homeCache=d||{};try{ct163Write('home',homeCache)}catch{};paintHome();return}catch{}
    if(cached){homeCache=cached;try{paintHome();return}catch{}}
    return base(seq);
  };
}catch{}

/* r193 Profile: fast stats/dashboard paints first; full canonical payload revalidates behind it. */
try{
  const base=renderProfile;
  const paintFastA23=p=>{if(!p||typeof p!=='object'||typeof ct168PaintProfile!=='function')return false;profileCache=p;if(!document.querySelector('[data-profile]'))setApp(shell('Perfil','Estatísticas, biblioteca, favoritos e atividade.','profile','<div class="page" data-profile></div>'));ct168PaintProfile(p,'');try{ctR180EnhanceProfile(p)}catch{};return true};
  renderProfile=async function(seq){
    try{
      let cached=null;try{cached=profileCache||ct163Read('profile')}catch{cached=profileCache||null}
      if(cached&&paintFastA23(cached)){
        void rpc('cinetracker_profile_payload_v0997_r2',{p_tz:typeof tz==='function'?tz():'America/Sao_Paulo'}).then(p=>{if(p&&seq===navSeq){profileCache=p;try{ct163Write('profile',p)}catch{};if(!document.querySelector('.favorite-overlay'))paintFastA23(p)}}).catch(()=>{});return;
      }
      const [quick,dash]=await Promise.all([rpc('cinetracker_profile_quick_stats_v1',{}),rpc('cinetracker_profile_media_dashboard_v0997_fast',{})]);
      if(seq!==navSeq)return;
      const p={...(quick||{}),dashboard:Array.isArray(dash)?dash:[],favorite_movies:Array.isArray(quick?.favorite_movies)?quick.favorite_movies:[],favorite_series:Array.isArray(quick?.favorite_series)?quick.favorite_series:[],favorite_actors:Array.isArray(quick?.favorite_actors)?quick.favorite_actors:[],activity:Array.isArray(quick?.activity)?quick.activity:[]};
      if(!paintFastA23(p))return base(seq);try{ct163Write('profile',p)}catch{}
      void rpc('cinetracker_profile_payload_v0997_r2',{p_tz:typeof tz==='function'?tz():'America/Sao_Paulo'}).then(full=>{if(full&&seq===navSeq&&!document.querySelector('.favorite-overlay')){profileCache=full;try{ct163Write('profile',full)}catch{};paintFastA23(full)}}).catch(()=>{});return;
    }catch{return base(seq)}
  };
}catch{}

/* r192: bilingual global media search. */
try{
  const cacheA23=new Map(),escA23=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  globalSearch=async function(q){
    const out=document.querySelector('[data-global-results]');if(!out)return;q=String(q||'').trim();if(q.length<2){out.innerHTML='';return}
    const ck=normA23(q);if(cacheA23.has(ck)){out.innerHTML=cacheA23.get(ck);return}
    try{
      const preferEn=localStorage.getItem('cinetracker_locale')==='en-US';
      const [mPt,mEn,tPt,tEn,p]=await Promise.all([safeTmdb('/search/movie',{query:q,page:1,language:'pt-BR'}),safeTmdb('/search/movie',{query:q,page:1,language:'en-US'}),safeTmdb('/search/tv',{query:q,page:1,language:'pt-BR'}),safeTmdb('/search/tv',{query:q,page:1,language:'en-US'}),safeTmdb('/search/person',{query:q,page:1,language:preferEn?'en-US':'pt-BR'})]);
      const merge=(a,b,type)=>{const seen=new Set(),rows=[];for(const x of [...(a||[]),...(b||[])]){const id=posA23(x?.id);if(!id||seen.has(id))continue;seen.add(id);rows.push({...x,media_type:type})}return rows};
      const rows=[...merge(preferEn?mEn.results:mPt.results,preferEn?mPt.results:mEn.results,'movie').slice(0,7),...merge(preferEn?tEn.results:tPt.results,preferEn?tPt.results:tEn.results,'tv').slice(0,7),...merge(p.results,[],'person').slice(0,5)];
      const html='<div class="global-results">'+(rows.map(x=>x.media_type==='person'?'<div class="global-result person" data-person="'+Number(x.id)+'"><div class="thumb"'+(x.profile_path?' style="background-image:url(\''+img(x.profile_path,'w185')+'\')"':'')+'></div><div><b>'+escA23(x.name)+'</b><small class="muted">Pessoa</small></div></div>':'<div class="global-result" data-media="'+x.media_type+':'+Number(x.id)+'"><div class="thumb"'+(x.poster_path?' style="background-image:url(\''+img(x.poster_path,'w154')+'\')"':'')+'></div><div><b>'+escA23(x.title||x.name)+'</b><small class="muted">'+(x.media_type==='movie'?'Filme':'Série')+'</small></div></div>').join('')||'<div class="empty">Nenhum resultado.</div>')+'</div>';
      cacheA23.set(ck,html);out.innerHTML=html;
    }catch(e){out.innerHTML='<div class="global-results"><div class="error">'+escA23(e?.message||e)+'</div></div>'}
  };
}catch{}

/* Sports v4/v2 is server-side shared. Drop only disposable caches so live Copa do Brasil and normalized club search arrive on first open. */
try{sportsCache=null;for(const k of Object.keys(localStorage))if(/sports/i.test(k)&&(/cache|payload|preload/i.test(k)))localStorage.removeItem(k)}catch{}

/* Updated Pra Voce copy + release cache invalidation. */
try{const base=ct166RenderForYou;ct166RenderForYou=function(data){let h=base(data);h=h.replaceAll('fora da Watchlist, histórico e progresso','baseado nos seus vistos e favoritos · fora da Watchlist, histórico e progresso');h=h.replace('somente não assistidos · Filme · Série · Anime','priorizada pelo seu gosto · sem doramas · somente não assistidos · Filme · Série · Anime');return h};renderForYou158=ct166RenderForYou}catch{}
try{ct186ContextValue=null;ct186ContextAt=0;ct186ForYouData=null;discoverCache.clear();for(const k of Object.keys(localStorage))if(k.includes('discover:foryou')||k.includes('r186:foryou'))localStorage.removeItem(k)}catch{}

/* r195 Statistics density, adjusted for Android readability/touch geometry. */
const styleA23=document.createElement('style');styleA23.id='ct-android-099723-density';styleA23.textContent=`
[data-page="profile"] .page{gap:6px!important}
[data-page="profile"] section.panel{padding:8px 9px!important;margin-bottom:6px!important;border-radius:15px!important}
[data-page="profile"] .panel-head{min-height:23px!important;margin:0 0 4px!important;gap:6px!important}
[data-page="profile"] .panel-head h2{font-size:15px!important;line-height:1.1!important;margin:0!important}
[data-page="profile"] .panel-head small{font-size:9px!important;line-height:1.15!important;margin:0!important}
[data-page="profile"] .stats,[data-page="profile"] .ct-r180-profile-stats,[data-page="profile"] .ct180-profile-stats,[data-page="profile"] .profile-stat-grid{gap:5px!important;margin:3px 0!important}
[data-page="profile"] .stat,[data-page="profile"] .ct-r180-profile-stats .stat,[data-page="profile"] .ct180-profile-stats .stat,[data-page="profile"] .profile-stat-grid .stat{min-height:47px!important;padding:5px 7px!important;border-radius:11px!important;display:flex!important;flex-direction:column!important;justify-content:center!important}
[data-page="profile"] .stat small{font-size:8.5px!important;line-height:1.1!important;margin:0 0 3px!important}
[data-page="profile"] .stat b{font-size:18px!important;line-height:1!important;margin:0!important}
[data-page="profile"] [data-profile-sports-panel] p{margin:5px 0 0!important;font-size:9px!important;line-height:1.2!important}
[data-page="profile"] h3{margin:6px 0 4px!important;line-height:1.15!important}
`;document.getElementById(styleA23.id)?.remove();document.head.appendChild(styleA23);

const idleA23=window.requestIdleCallback||((fn)=>setTimeout(fn,1400));idleA23(()=>{try{if(session){void loadKnownA23(false);void ct186Context(false)}}catch{}},{timeout:2600});
})();
