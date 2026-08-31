import {readFile,writeFile,rm,mkdir,copyFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=dirname(fileURLToPath(import.meta.url));
const src=resolve(root,'prebuilt-r161');
const dist=resolve(root,'dist');
let [html,js,css,sw]=await Promise.all([
  readFile(resolve(src,'index.html'),'utf8'),
  readFile(resolve(src,'app-v161.js'),'utf8'),
  readFile(resolve(src,'app-v161.css'),'utf8'),
  readFile(resolve(src,'service-worker.js'),'utf8')
]);
if(!js.includes("const REVISION='r161-release-guard';"))throw new Error('r162 requires r161 single-runtime base');
if(!js.includes("window.__ctRuntimeAuthority='single-clean-runtime';"))throw new Error('single runtime authority missing');
if(!js.includes('\nasync function globalSearch'))throw new Error('r162 insertion point missing');
js=js.replace("const REVISION='r161-release-guard';","const REVISION='r162-home-discover-sports';");
const r162=String.raw`
/* r162 effective Home + complete Pra voce + discover tab scroll + richer sports */
window.__ctR162='effective-catchup-watchlist3-sports-v2';

homeSeriesRow158=function(x){
  const id=mediaTmdb(x),p=mediaPoster(x),seen=Math.max(0,Number(x.watched_episodes||0)),released=Math.max(0,Number(x.released_episodes||0)),total=Math.max(released,Number(x.total_episodes||0)),missing=Math.max(0,Number(x.history_missing_episodes??(released-seen))||0),caught=Boolean(x.is_caught_up);
  const status=caught?(missing>0?'Em dia · '+missing+' antigo'+(missing===1?'':'s')+' não visto'+(missing===1?'':'s'):'Em dia'):(missing>0?'Faltam '+missing:'Próximo episódio pendente');
  const current=x.latest_released_season_number&&x.latest_released_episode_number?' · atual S'+String(x.latest_released_season_number).padStart(2,'0')+'E'+String(x.latest_released_episode_number).padStart(2,'0'):'';
  return '<div class="home-action-row"><div class="media-row" data-media="tv:'+id+'"><div class="thumb"'+(p?' style="background-image:url(\''+img(p,'w154')+'\')"':'')+'></div><div><b>'+esc(mediaTitle(x))+'</b><small>'+seen+'/'+(total||'?')+' · '+esc(status)+esc(current)+'</small></div><span class="badge">'+(caught?'✓':'›')+'</span></div>'+(!caught?'<button class="home-check" type="button" title="Marcar próximo episódio lançado como assistido" data-home-mark-episode="'+Number(x.media_id||0)+'">✓</button>':'')+'</div>';
};

const markNextEpisode161For162=markNextEpisode158;
markNextEpisode158=async function(mediaId){
  await markNextEpisode161For162(mediaId);
  profileCache=null;discoverCache.clear();
  try{window.dispatchEvent(new CustomEvent('cinetracker:data-changed',{detail:{source:'home-watch-r162',media_id:Number(mediaId)}}))}catch{}
  void rpc('cinetracker_profile_payload_v0997',{p_tz:tz()}).then(d=>{profileCache=d||null}).catch(()=>{});
};

function dashboardCard162(x){
  const raw=x?.raw_tmdb||{},id=Number(raw?.source_tmdb_id||((Number(x?.tmdb_id||0)>0)?x.tmdb_id:0)||raw?.id||0);
  if(!(id>0))return null;
  return {...raw,...x,id,tmdb_id:id,media_type:x?.media_type==='movie'?'movie':'tv',title:x?.title||raw?.title||raw?.name,name:x?.title||raw?.name||raw?.title,poster_path:x?.poster_path||raw?.poster_path||null,genre_ids:genreIds158(x),origin_country:x?.origin_country||raw?.origin_country||[],vote_average:Number(raw?.vote_average||x?.vote_average||0),popularity:Number(raw?.popularity||0),_ct_watchlist:true};
}
function animeDashboard162(x){return x?.media_kind==='anime'||isAnime158(x)}
function watchlistPicks162(dash){
  const rows=(dash||[]).filter(x=>x?.is_watchlist&&!x?.is_seen&&!x?.is_completed).map(dashboardCard162).filter(x=>x&&mediaPoster(x));
  const rank=a=>Number(a?.vote_average||0)*100+Number(a?.popularity||0);
  rows.sort((a,b)=>rank(b)-rank(a));
  const anime=rows.find(x=>mediaType(x)==='tv'&&animeDashboard162(x))||null;
  const series=rows.find(x=>mediaType(x)==='tv'&&!animeDashboard162(x)&&(!anime||Number(x.id)!==Number(anime.id)))||null;
  const movie=rows.find(x=>mediaType(x)==='movie')||null;
  return{watchlist_movie:movie,watchlist_series:series,watchlist_anime:anime};
}
const discoverRows161For162=discoverRows;
discoverRows=async function(tab){
  const base=await discoverRows161For162(tab);
  if(tab!=='foryou')return base;
  const dash=await rpc('cinetracker_profile_media_dashboard_v0991',{}).catch(()=>[]);
  return {...(base||{}),...watchlistPicks162(dash)};
};
renderForYou158=function(data){
  const wl=[['Filme',data?.watchlist_movie],['Série',data?.watchlist_series],['Anime',data?.watchlist_anime]];
  const wlHtml='<div class="foryou-grid watchlist-picks-r162">'+wl.map(([label,x])=>'<div class="foryou-slot"><small>'+label+'</small>'+(x?discoverCard158(x):'<div class="empty compact">Sem item elegível</div>')+'</div>').join('')+'</div>';
  const freshSlots=[['Filme',data?.movie],['Série',data?.series],['Anime',data?.anime]].filter(([,x])=>x);
  const fresh=freshSlots.length?'<div class="foryou-grid">'+freshSlots.map(([label,x])=>'<div class="foryou-slot"><small>'+label+'</small>'+discoverCard158(x)+'</div>').join('')+'</div>':'<div class="empty">Nenhum título novo elegível agora.</div>';
  return '<section class="panel discover-section"><div class="panel-head"><h2>Da sua Watchlist</h2><small>1 Filme · 1 Série · 1 Anime</small></div>'+wlHtml+'</section><section class="panel discover-section"><div class="panel-head"><h2>Indicação do dia</h2><small>fora da Watchlist e histórico</small></div>'+(data?.daily?discoverCarousel158([data.daily]):'<div class="empty">Nenhuma indicação elegível agora.</div>')+'</section><section class="panel discover-section"><div class="panel-head"><h2>100% novos</h2><small>1 Filme · 1 Série · 1 Anime</small></div>'+fresh+'</section>';
};

function sportDedupeKey162(e){
  const d=new Date(e?.starts_at||0).toLocaleDateString('sv-SE'),h=norm(e?.home_name||''),a=norm(e?.away_name||'');
  return e?.sport_slug+'|'+d+'|'+(h&&a?[h,a].sort().join('|'):norm(e?.title||e?.provider_event_id||''));
}
function sportRank162(e){return e?.is_watched?5:String(e?.provider||'').startsWith('api-sports')?4:String(e?.provider||'').startsWith('espn')?3:2}
const sportsFiltered161For162=sportsFiltered;
sportsFiltered=function(p){
  const rows=sportsFiltered161For162(p),map=new Map();
  for(const e of rows||[]){const k=sportDedupeKey162(e),old=map.get(k);if(!old||sportRank162(e)>sportRank162(old))map.set(k,e)}
  return [...map.values()];
};

const paintSports161For162=paintSports;
paintSports=function(p=sportsCache||{}){
  paintSports161For162(p);
  const h=$('[data-sports]');if(!h)return;
  const badge=h.querySelector(':scope > .panel .badge');
  if(badge)badge.textContent=sportsState.provider?.api_sports_configured?'API-Sports + ESPN fallback':'ESPN + TheSportsDB';
};

syncSports=async function(force){
  if(sportsState.syncing)return;
  sportsState.syncing=true;paintSports();
  try{
    const p=sportsCache||{},all=(p.sports||[]).map(s=>s.slug).filter(Boolean);
    const sports=all.length?all:['soccer','formula_1','mma','basketball','american_football','ice_hockey','baseball'];
    await Promise.all([
      edge('ct-sports-sync',{action:'sync',date_from:shiftDays(-1),date_to:shiftDays(-1),sports,force},90000),
      edge('ct-sports-sync',{action:'sync',date_from:localDay(),date_to:localDay(),sports,force},90000)
    ]);
    sportsCache=null;await sportsPayload(true);paintSports();
    void edge('ct-sports-sync',{action:'sync',date_from:shiftDays(1),date_to:shiftDays(2),sports,force:false},90000).then(async()=>{sportsCache=null;await sportsPayload(true);if(route()==='sports')paintSports()}).catch(()=>{});
  }catch(e){toast('Esportes: '+(e?.message||e))}finally{sportsState.syncing=false;paintSports()}
};

const renderSports161For162=renderSports;
renderSports=async function(seq){
  await renderSports161For162(seq);
  if(seq!==navSeq||route()!=='sports')return;
  const yesterday=shiftDays(-1),count=(sportsCache?.events||[]).filter(x=>new Date(x.starts_at).toLocaleDateString('sv-SE')===yesterday).length;
  const key='ct:r162:sports:yesterday:'+yesterday;
  if(count<12&&!sessionStorage.getItem(key)){
    sessionStorage.setItem(key,'1');
    void syncSports(false);
  }
};
`;
js=js.replace('\nasync function globalSearch',r162+'\nasync function globalSearch');
css+=String.raw`
/* r162 */
[data-page="discover"] .tabs{display:flex!important;flex-wrap:nowrap!important;overflow-x:auto!important;overflow-y:hidden!important;max-width:100%;white-space:nowrap;scrollbar-width:thin;-webkit-overflow-scrolling:touch;overscroll-behavior-inline:contain;padding-bottom:6px}
[data-page="discover"] .tabs>.chip{flex:0 0 auto}
.watchlist-picks-r162 .discover-watch:disabled{border-color:#456f84;color:#acdff7;opacity:1}
.empty.compact{min-height:210px;display:grid;place-items:center}
`;
html=html.replaceAll('r161-release-guard','r162-home-discover-sports').replaceAll('app-v161.js','app-v162.js').replaceAll('app-v161.css','app-v162.css');
sw=sw.replaceAll('r161-release-guard','r162-home-discover-sports').replaceAll('app-v161.js','app-v162.js').replaceAll('app-v161.css','app-v162.css');
const release={version:'0.99.7',revision:'r162-home-discover-sports',runtime:'single-clean-runtime',generated_at:new Date().toISOString()};
await rm(dist,{recursive:true,force:true});await mkdir(dist,{recursive:true});
await Promise.all([
  writeFile(resolve(dist,'index.html'),html,'utf8'),
  writeFile(resolve(dist,'app-v162.js'),js,'utf8'),
  writeFile(resolve(dist,'app-v162.css'),css,'utf8'),
  writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),
  writeFile(resolve(dist,'release.json'),JSON.stringify(release),'utf8'),
  copyFile(resolve(src,'favicon.svg'),resolve(dist,'favicon.svg'))
]);
console.log('WEB_R162_READY runtime=single home=effective-catchup discover=watchlist3+tab-scroll sports=espn-v2');
