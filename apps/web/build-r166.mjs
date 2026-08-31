import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r165.mjs');
const root=dirname(fileURLToPath(import.meta.url));
const dist=resolve(root,'dist');
let [html,js,css,sw]=await Promise.all([
  readFile(resolve(dist,'index.html'),'utf8'),
  readFile(resolve(dist,'app-v165.js'),'utf8'),
  readFile(resolve(dist,'app-v165.css'),'utf8'),
  readFile(resolve(dist,'service-worker.js'),'utf8')
]);
if(!js.includes("const REVISION='r165-r163-restored-favorites';"))throw new Error('r166 requires r165 base');
if(!js.includes("window.__ctR165='r163-restored-plus-favorite-events';"))throw new Error('r165 favorite events missing');

const patch=String.raw`
/* r166: strict Pra voce + complete carousels + favorite sports hydration + compact profile */
window.__ctR166='discover-sports-profile-fixes';
window.__ct166ForYouOrder='daily-watchlist-new';
window.__ct166SportsFavoriteHydration='45d-chunked-by-sport';
window.__ct166ProfileTime='compact-MDH';

try{
  for(const k of Object.keys(localStorage)){
    if(k.indexOf('cinetracker:preload:r163:discover:foryou')===0)localStorage.removeItem(k);
  }
}catch{}

const ct166ReadBase=ct163Read;
ct163Read=function(k){
  if(String(k||'').indexOf('discover:foryou')===0)return null;
  return ct166ReadBase(k);
};

function ct166WatchlistEligible(x){
  return Boolean(
    x?.is_watchlist &&
    !x?.is_seen &&
    !x?.is_completed &&
    !x?.is_in_progress &&
    !x?.is_up_to_date &&
    Number(x?.watched_episodes||0)===0 &&
    !x?.last_watched_at
  );
}
function ct166Rank(x){return Number(x?.vote_average||0)*100+Number(x?.popularity||0)}
function ct166WatchlistPools(dash){
  const rows=(dash||[]).filter(ct166WatchlistEligible).map(dashboardCard162).filter(x=>x&&mediaPoster(x)).sort((a,b)=>ct166Rank(b)-ct166Rank(a));
  return {
    movie:rows.filter(x=>mediaType(x)==='movie'),
    series:rows.filter(x=>mediaType(x)==='tv'&&!animeDashboard162(x)),
    anime:rows.filter(x=>mediaType(x)==='tv'&&animeDashboard162(x))
  };
}
watchlistPicks162=function(dash){
  const p=ct166WatchlistPools(dash);
  return {watchlist_movie:p.movie[0]||null,watchlist_series:p.series[0]||null,watchlist_anime:p.anime[0]||null};
};

function ct166Known(x,c){
  const t=mediaType(x),id=Number(x?.id||x?.tmdb_id||0);
  if(id&&(t==='movie'?c.movieIds:c.tvIds).has(id))return true;
  return [x?.title,x?.name,x?.original_title,x?.original_name].map(norm).filter(Boolean).some(n=>c.aliases.has(t+':'+n));
}
function ct166Unique(rows){
  const seen=new Set(),out=[];
  for(const x of rows||[]){
    const id=Number(x?.id||0),t=mediaType(x),k=t+':'+id;
    if(!(id>0)||seen.has(k)||!mediaPoster(x))continue;
    seen.add(k);out.push(x);
  }
  return out;
}
function ct166FavoriteGenres(dash){
  const m=new Map();
  for(const x of dash||[]){
    if(!(x?.is_favorite||x?.is_seen||x?.is_in_progress||Number(x?.watched_episodes||0)>0))continue;
    for(const id of genreIds158(x))m.set(Number(id),(m.get(Number(id))||0)+(x?.is_favorite?3:1));
  }
  return [...m.entries()].sort((a,b)=>b[1]-a[1]).slice(0,4).map(([id])=>id);
}
async function ct166FreshPools(c){
  const genres=ct166FavoriteGenres(c.dash),wg=genres.length?genres.join('|'):undefined;
  const [m,t,a]=await Promise.all([
    pages('/discover/movie',{sort_by:'vote_average.desc','vote_count.gte':120,with_genres:wg,include_adult:false},'movie',5),
    pages('/discover/tv',{sort_by:'vote_average.desc','vote_count.gte':100,with_genres:wg,include_adult:false},'tv',5),
    pages('/discover/tv',{with_origin_country:'JP',with_genres:'16',sort_by:'vote_average.desc','vote_count.gte':60,include_adult:false},'tv',5)
  ]);
  const clean=rows=>ct166Unique(rows).filter(x=>!ct166Known(x,c));
  return {
    movie:clean(m).filter(x=>!isAnime158(x)),
    series:clean(t).filter(x=>!isAnime158(x)),
    anime:clean(a).filter(x=>isAnime158(x))
  };
}

const ct166DiscoverRowsBase=discoverRows;
discoverRows=async function(tab){
  if(tab!=='foryou')return ct166DiscoverRowsBase(tab);
  const key='foryou-r166:'+localDay();
  if(discoverCache.has(key))return discoverCache.get(key);
  const p=(async()=>{
    const c=await exclusionContext158();
    const [base,fresh]=await Promise.all([ct166DiscoverRowsBase(tab),ct166FreshPools(c)]);
    const wl=ct166WatchlistPools(c.dash);
    const daily=fresh.movie.find(x=>Number(x?.vote_average||0)>=8&&Number(String(x?.release_date||'').slice(0,4)||0)>=1990)||fresh.movie[0]||null;
    const movie=fresh.movie.find(x=>!daily||Number(x.id)!==Number(daily.id))||null;
    return {
      ...(base||{}),
      daily,
      movie,
      series:fresh.series[0]||null,
      anime:fresh.anime[0]||null,
      watchlist_movie:wl.movie[0]||null,
      watchlist_series:wl.series[0]||null,
      watchlist_anime:wl.anime[0]||null,
      _ct166_fresh:fresh,
      _ct166_watchlist:wl
    };
  })();
  discoverCache.set(key,p);
  try{const v=await p;discoverCache.set(key,v);ct163Write('discover:foryou:all',v);return v}
  catch(e){discoverCache.delete(key);throw e}
};

let ct166ForYouData=null;
const ct166SwapIndex={};
const ct166Expanded={};
function ct166Pool(data,section,kind){
  const src=section==='watchlist'?data?._ct166_watchlist:data?._ct166_fresh;
  return Array.isArray(src?.[kind])?src[kind]:[];
}
function ct166Pick(pool,key,excluded){
  const ex=new Set((excluded||[]).filter(Boolean).map(Number));
  const usable=(pool||[]).filter(x=>!ex.has(Number(x?.id||0)));
  if(!usable.length)return null;
  const i=Math.max(0,Number(ct166SwapIndex[key]||0))%usable.length;
  return usable[i]||usable[0]||null;
}
function ct166SwapButton(key,count){
  return count>1?'<button type="button" class="btn btn-secondary ct166-swap" data-ct166-swap="'+esc(key)+'">↻ Trocar</button>':'';
}
function ct166Slot(label,x,key,count){
  return '<div class="foryou-slot ct166-slot"><div class="ct166-slot-head"><small>'+esc(label)+'</small>'+ct166SwapButton(key,count)+'</div>'+(x?discoverCard158(x):'<div class="empty compact">Sem item elegível</div>')+'</div>';
}
function ct166RenderForYou(data){
  ct166ForYouData=data||{};
  const fresh=data?._ct166_fresh||{movie:[],series:[],anime:[]},wl=data?._ct166_watchlist||{movie:[],series:[],anime:[]};
  const daily=ct166Pick(fresh.movie,'daily:movie',[]);
  const fm=ct166Pick(fresh.movie,'fresh:movie',[daily?.id]);
  const fs=ct166Pick(fresh.series,'fresh:series',[]);
  const fa=ct166Pick(fresh.anime,'fresh:anime',[]);
  const wm=ct166Pick(wl.movie,'watchlist:movie',[]);
  const ws=ct166Pick(wl.series,'watchlist:series',[]);
  const wa=ct166Pick(wl.anime,'watchlist:anime',[]);
  const dailyHtml=daily?'<div class="foryou-grid ct166-daily-grid">'+ct166Slot('Filme',daily,'daily:movie',fresh.movie.length)+'</div>':'<div class="empty">Nenhuma indicação elegível agora.</div>';
  const watchHtml='<div class="foryou-grid watchlist-picks-r162">'+ct166Slot('Filme',wm,'watchlist:movie',wl.movie.length)+ct166Slot('Série',ws,'watchlist:series',wl.series.length)+ct166Slot('Anime',wa,'watchlist:anime',wl.anime.length)+'</div>';
  const freshHtml='<div class="foryou-grid">'+ct166Slot('Filme',fm,'fresh:movie',fresh.movie.length)+ct166Slot('Série',fs,'fresh:series',fresh.series.length)+ct166Slot('Anime',fa,'fresh:anime',fresh.anime.length)+'</div>';
  return '<section class="panel discover-section"><div class="panel-head"><h2>Indicação do dia</h2><small>fora da Watchlist, histórico e progresso</small></div>'+dailyHtml+'</section>'+
    '<section class="panel discover-section"><div class="panel-head"><h2>Da sua Watchlist</h2><small>somente não assistidos · Filme · Série · Anime</small></div>'+watchHtml+'</section>'+
    '<section class="panel discover-section"><div class="panel-head"><h2>100% novos</h2><small>fora da Watchlist, histórico e progresso</small></div>'+freshHtml+'</section>';
}
renderForYou158=ct166RenderForYou;

const ct166PaintDiscoverBase=paintDiscover;
paintDiscover=function(rows){
  const h=$('[data-discover-content]');if(!h)return;
  if(discoverState.tab==='foryou'){h.innerHTML=ct166RenderForYou(rows||{});return}
  if(discoverState.tab==='calendar'){ct166PaintDiscoverBase(rows);return}
  let a=Array.isArray(rows)?rows:[];
  if(discoverState.type==='movie')a=a.filter(x=>mediaType(x)==='movie');
  else if(discoverState.type==='tv')a=a.filter(x=>mediaType(x)==='tv');
  const labels={trending:'Em alta',popular:'Populares',new:'Novidades',releases:'Lançamentos',anticipated:'Mais Aguardados',top:'Mais bem avaliados'};
  const label=labels[discoverState.tab]||'Descobrir',expanded=Boolean(ct166Expanded[discoverState.tab]),limit=expanded?18:6,shown=a.slice(0,limit);
  const more=a.length>6?'<button type="button" class="btn btn-secondary ct166-more" data-ct166-more="'+esc(discoverState.tab)+'">'+(expanded?'Ver menos':'Ver mais')+'</button>':'';
  const nav=a.length>1?'<button type="button" class="btn btn-secondary ct166-scroll" data-ct166-scroll="-1" aria-label="Rolar para a esquerda">‹</button><button type="button" class="btn btn-secondary ct166-scroll" data-ct166-scroll="1" aria-label="Rolar para a direita">›</button>':'';
  h.innerHTML='<section class="panel discover-section ct166-discover-section"><div class="panel-head"><h2>'+esc(label)+'</h2><div class="ct166-section-actions">'+nav+more+'</div></div>'+discoverCarousel158(shown)+'</section>';
};

document.addEventListener('click',e=>{
  const sw=e.target.closest?.('[data-ct166-swap]');
  if(sw){
    e.preventDefault();e.stopImmediatePropagation();
    const key=String(sw.dataset.ct166Swap||'');
    ct166SwapIndex[key]=Number(ct166SwapIndex[key]||0)+1;
    if(ct166ForYouData)paintDiscover(ct166ForYouData);
    return;
  }
  const more=e.target.closest?.('[data-ct166-more]');
  if(more){
    e.preventDefault();e.stopImmediatePropagation();
    const tab=String(more.dataset.ct166More||discoverState.tab);
    ct166Expanded[tab]=!ct166Expanded[tab];
    const cached=discoverCache.get(tab+':'+localDay());
    if(cached&&typeof cached.then!=='function')paintDiscover(cached);else void discoverRows(tab).then(paintDiscover);
    return;
  }
  const sc=e.target.closest?.('[data-ct166-scroll]');
  if(sc){
    e.preventDefault();e.stopImmediatePropagation();
    const car=sc.closest('.discover-section')?.querySelector('.discover-carousel,.row,.foryou-grid');
    if(car)car.scrollBy({left:Number(sc.dataset.ct166Scroll||1)*Math.max(280,car.clientWidth*.82),behavior:'smooth'});
    return;
  }
  const dw=e.target.closest?.('[data-discover-watch]');
  if(dw){
    e.preventDefault();e.stopImmediatePropagation();
    const parts=String(dw.dataset.discoverWatch||'').split(':'),type=parts[0],id=Number(parts[1]);
    if(!(id>0))return;
    dw.disabled=true;dw.textContent='Adicionando...';
    void addWatchlist(type,id).then(()=>{
      discoverCache.clear();ct166ForYouData=null;
      for(const k of Object.keys(ct166SwapIndex))delete ct166SwapIndex[k];
      void render();
    }).catch(x=>{dw.disabled=false;dw.textContent='+ Watchlist';toast(x?.message||x)});
    return;
  }
},true);

const ct166PreloadAllBase=ct163PreloadAll;
ct163PreloadAll=async function(){
  const p=ct166PreloadAllBase();
  if(session)void discoverRows('releases').then(v=>ct163Write('discover:releases:all',v)).catch(()=>{});
  return p;
};

function ct166FmtMinutes(minutes){
  let h=Math.max(0,Math.floor(Number(minutes||0)/60)),months=Math.floor(h/720);
  h-=months*720;const days=Math.floor(h/24);h-=days*24;
  return months+'M '+String(days).padStart(2,'0')+'D '+String(h).padStart(2,'0')+'H';
}
function ct166SetStat(root,label,value){
  const small=[...root.querySelectorAll('.stat small')].find(x=>x.textContent?.trim()===label);
  const b=small?.parentElement?.querySelector('b');if(b)b.textContent=value;
}
function ct166FixProfileDom(d=profileCache||{}){
  const root=$('[data-profile]');if(!root)return;
  root.querySelectorAll('[data-profile-sports-minutes],[data-profile-sports-watched]').forEach(x=>x.remove());
  const s=d?.stats||{},sports=d?.sports_stats||{};
  ct166SetStat(root,'Tempo total',ct166FmtMinutes(s.total_minutes));
  ct166SetStat(root,'Tempo séries',ct166FmtMinutes(s.series_minutes));
  ct166SetStat(root,'Tempo filmes',ct166FmtMinutes(s.movie_minutes));
  const panel=root.querySelector('[data-profile-sports-panel]');
  if(panel){
    const t=[...panel.querySelectorAll('small')].find(x=>x.textContent?.trim()==='Tempo assistido');
    const b=t?.parentElement?.querySelector('b');if(b)b.textContent=ct166FmtMinutes(sports.sports_minutes);
    const p=panel.querySelector('p');if(p)p.textContent='Filmes e séries ficam nas estatísticas acima; esportes são contabilizados separadamente aqui.';
  }
}
const ct166PaintProfileBase=paintProfile163;
paintProfile163=function(d){ct166PaintProfileBase(d);ct166FixProfileDom(d)};
const ct166RenderProfileBase=renderProfile;
renderProfile=async function(seq){
  await ct166RenderProfileBase(seq);
  if(seq===navSeq&&route()==='profile')ct166FixProfileDom(profileCache||{});
};

function ct166FavoriteBody(d,note){
  const f=d?.favorite||{},ev=Array.isArray(d?.events)?d.events:[];
  const sync=note?'<div class="notice ct166-sync-note">'+esc(note)+'</div>':'';
  const list=ev.length?'<div class="ct165-event-list">'+ev.map(e=>'<div class="ct165-event"><div><b>'+esc(e.home_name||e.title||'Evento')+'</b>'+(e.away_name?'<span> × '+esc(e.away_name)+'</span>':'')+'</div><small>'+new Date(e.starts_at).toLocaleString('pt-BR')+' · '+esc(e.competition_name||e.sport_slug||'')+(e.round?' · '+esc(e.round):'')+'</small><strong>'+esc(e.status||'')+(e.home_score!=null?' · '+esc(e.home_score)+' : '+esc(e.away_score):'')+'</strong></div>').join('')+'</div>':'<div class="empty">Nenhum evento relacionado encontrado nesse período.</div>';
  return '<div class="ct165-fav-summary"><span>'+esc(f.entity_type||'Entidade')+'</span><span>'+esc(f.sport_slug||'')+'</span><span>Últimos 30 dias + próximos 14</span><span>'+ev.length+' eventos</span></div>'+sync+list;
}
function ct166FavoriteRanges(){
  const ranges=[[-2,0]],rest=[];
  for(let end=-3;end>=-30;end-=3)rest.push([Math.max(-30,end-2),end]);
  for(let start=1;start<=14;start+=3)rest.push([start,Math.min(14,start+2)]);
  rest.sort((a,b)=>Math.min(Math.abs(a[0]),Math.abs(a[1]))-Math.min(Math.abs(b[0]),Math.abs(b[1])));
  return ranges.concat(rest);
}
const ct166FavoriteSyncing=new Map();
async function ct166SyncFavoriteWindow(entityId,sportSlug,onProgress){
  const key=String(entityId)+':'+localDay();
  if(ct166FavoriteSyncing.has(key))return ct166FavoriteSyncing.get(key);
  const task=(async()=>{
    const ranges=ct166FavoriteRanges(),total=ranges.length;
    let done=0,failed=0,index=0;
    const syncOne=async r=>{
      try{await edge('ct-sports-sync',{action:'sync',date_from:shiftDays(r[0]),date_to:shiftDays(r[1]),sports:[sportSlug],force:false},90000)}
      catch{failed++}
      done++;if(onProgress)await onProgress(done,total,failed);
    };
    await syncOne(ranges[0]);
    index=1;
    const worker=async()=>{while(index<ranges.length){const i=index++;await syncOne(ranges[i])}};
    await Promise.all([worker(),worker()]);
    return {done,total,failed};
  })().finally(()=>ct166FavoriteSyncing.delete(key));
  ct166FavoriteSyncing.set(key,task);return task;
}
ct165OpenFavorite=async function(entityId){
  if(!(entityId>0))return;
  const modal=document.createElement('div');modal.className='ct165-modal';
  modal.innerHTML='<div class="ct165-modal-card"><div class="ct165-modal-head"><b>Carregando eventos...</b><button type="button" data-ct165-close>×</button></div><div class="ct165-modal-body"><div class="loader">Buscando jogos relacionados...</div></div></div>';
  document.body.appendChild(modal);
  modal.addEventListener('click',e=>{if(e.target===modal||e.target.closest('[data-ct165-close]'))modal.remove()});
  try{
    let d=await rpc('cinetracker_sport_favorite_events_v2',{p_entity_id:Number(entityId),p_from:shiftDays(-30),p_to:shiftDays(14)});
    const f=d?.favorite||{};
    modal.querySelector('.ct165-modal-head b').textContent=(f.name||'Favorito')+' · eventos';
    modal.querySelector('.ct165-modal-body').innerHTML=ct166FavoriteBody(d,f.sport_slug?'Sincronizando a rodada e completando o período...':'');
    if(f.sport_slug){
      let lastRefresh=0;
      await ct166SyncFavoriteWindow(entityId,f.sport_slug,async(done,total,failed)=>{
        if(!modal.isConnected)return;
        if(done===1||done===total||done-lastRefresh>=3){
          lastRefresh=done;
          d=await rpc('cinetracker_sport_favorite_events_v2',{p_entity_id:Number(entityId),p_from:shiftDays(-30),p_to:shiftDays(14)}).catch(()=>d);
          modal.querySelector('.ct165-modal-body').innerHTML=ct166FavoriteBody(d,done<total?'Sincronizando calendário completo: '+done+'/'+total+(failed?' · '+failed+' falha(s)':''):'Calendário sincronizado'+(failed?' · '+failed+' intervalo(s) não responderam':''));
        }
      });
      d=await rpc('cinetracker_sport_favorite_events_v2',{p_entity_id:Number(entityId),p_from:shiftDays(-30),p_to:shiftDays(14)}).catch(()=>d);
      if(modal.isConnected)modal.querySelector('.ct165-modal-body').innerHTML=ct166FavoriteBody(d,'Calendário atualizado.');
      sportsCache=null;
      void sportsPayload(true).then(()=>{if(route()==='sports')paintSports()}).catch(()=>{});
    }
  }catch(e){
    if(modal.isConnected)modal.querySelector('.ct165-modal-body').innerHTML='<div class="error">Não foi possível carregar os eventos: '+esc(e?.message||e)+'</div>';
  }
};

const ct166PaintSportsBase=paintSports;
paintSports=function(p=sportsCache||{}){
  ct166PaintSportsBase(p);
  const root=$('[data-sports]');if(!root)return;
  root.querySelectorAll('.favorite-card').forEach(card=>{
    const open=card.querySelector('[data-ct165-open-favorite]'),fav=card.querySelector('[data-sport-fav]');
    if(open){open.textContent='Ver eventos';open.setAttribute('aria-label','Ver eventos do favorito');}
    if(open&&fav&&open.nextElementSibling!==fav)card.insertBefore(open,fav);
  });
};
`;

js=js.replace("const REVISION='r165-r163-restored-favorites';","const REVISION='r166-discover-sports-profile-fixes';");
js=js.replace('\nasync function globalSearch',patch+'\nasync function globalSearch');
css+=String.raw`
/* r166 */
[data-page="discover"] .discover-carousel{
  display:flex!important;flex-wrap:nowrap!important;overflow-x:auto!important;overflow-y:hidden;
  gap:10px;padding-bottom:10px;scroll-snap-type:x proximity;-webkit-overflow-scrolling:touch;scrollbar-width:thin;
}
[data-page="discover"] .discover-carousel>.card{flex:0 0 150px;scroll-snap-align:start}
.ct166-section-actions,.ct166-slot-head{display:flex;align-items:center;gap:7px}
.ct166-slot-head{justify-content:space-between;min-height:32px;margin-bottom:5px}
.ct166-swap,.ct166-more,.ct166-scroll{white-space:nowrap!important;min-width:max-content;width:auto!important}
.ct166-scroll{padding:6px 10px;font-size:18px;line-height:1}
[data-page="discover"] .panel-head{gap:8px;flex-wrap:wrap}
[data-page="discover"] .panel-head .ct166-section-actions{margin-left:auto}
[data-page="discover"] .foryou-grid{display:flex!important;flex-wrap:nowrap!important;overflow-x:auto!important;gap:10px;padding-bottom:10px}
[data-page="discover"] .ct166-slot{flex:0 0 170px;min-width:170px}
[data-page="discover"] .ct166-daily-grid .ct166-slot{flex-basis:170px}
[data-page="sports"] .favorites-grid{grid-template-columns:repeat(auto-fill,minmax(190px,1fr))!important}
[data-page="sports"] .favorite-card{min-width:0;grid-template-columns:auto minmax(0,1fr) auto!important;align-items:center}
[data-page="sports"] .favorite-card .ct165-open-favorite{grid-column:2/4;grid-row:2;justify-self:start;white-space:nowrap!important;min-width:max-content;width:auto!important;margin-top:7px}
[data-page="sports"] .favorite-card [data-sport-fav]{grid-column:3;grid-row:1;justify-self:end}
.ct166-sync-note{margin:0 0 10px}
.ct165-event small{overflow-wrap:anywhere}
@media(max-width:720px){
  [data-page="discover"] .ct166-slot{flex-basis:150px;min-width:150px}
  .ct166-scroll{display:none}
}
`;
html=html.replaceAll('r165-r163-restored-favorites','r166-discover-sports-profile-fixes').replaceAll('app-v165.js','app-v166.js').replaceAll('app-v165.css','app-v166.css');
sw=sw.replaceAll('r165-r163-restored-favorites','r166-discover-sports-profile-fixes').replaceAll('app-v165.js','app-v166.js').replaceAll('app-v165.css','app-v166.css');
await Promise.all([
  writeFile(resolve(dist,'index.html'),html,'utf8'),
  writeFile(resolve(dist,'app-v166.js'),js,'utf8'),
  writeFile(resolve(dist,'app-v166.css'),css,'utf8'),
  writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),
  writeFile(resolve(dist,'release.json'),JSON.stringify({version:'0.99.7',revision:'r166-discover-sports-profile-fixes',runtime:'single-clean-runtime',generated_at:new Date().toISOString()}),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v165.js'),{force:true}),rm(resolve(dist,'app-v165.css'),{force:true})]);
console.log('WEB_R166_READY discover=strict-foryou+swap+carousels sports=favorite-window-hydration profile=compact-stats');
