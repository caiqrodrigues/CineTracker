import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r474.mjs');

const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw]=await Promise.all([
  readFile(resolve(dist,'index.html'),'utf8'),
  readFile(resolve(dist,'app-v474.js'),'utf8'),
  readFile(resolve(dist,'app-v474.css'),'utf8'),
  readFile(resolve(dist,'service-worker.js'),'utf8'),
  readFile(resolve(dist,'release.json'),'utf8')
]);

function patchRuntime(source,anchor,patches,label){
  const at=source.indexOf(anchor);
  if(at<0)throw new Error('r475 missing '+label+' anchor');
  const start=source.lastIndexOf('(()=>{',at);
  const close=source.indexOf('\n})();',at);
  if(start<0||close<0)throw new Error('r475 invalid '+label+' runtime bounds');
  const end=close+6;
  let region=source.slice(start,end);
  for(const [needle,replacement,name] of patches){
    const count=region.split(needle).length-1;
    if(count!==1)throw new Error('r475 expected one '+label+' '+name+', found '+count);
    region=region.replace(needle,replacement);
  }
  return source.slice(0,start)+region+source.slice(end);
}
function patchGlobal(source,needle,replacement,label){
  const count=source.split(needle).length-1;
  if(count!==1)throw new Error('r475 expected one '+label+', found '+count);
  return source.replace(needle,replacement);
}

/* Expose only presentation helpers that already live inside the original application
   closure. External Home owners no longer fall back to text-only rows. */
js=patchGlobal(
  js,
  'mediaCard:item=>mediaCard(item),',
  `mediaCard:item=>mediaCard(item),
 homeMovieRow:item=>{const y={...item,media_type:'movie',release_date:item?.release_date||item?.raw_tmdb?.release_date||null,runtime_minutes:Number(item?.runtime_minutes||item?.raw_tmdb?.runtime||0)||0,genres:Array.isArray(item?.genres)&&item.genres.length?item.genres:(Array.isArray(item?.raw_tmdb?.genres)?item.raw_tmdb.genres:[]),vote_average:Number(item?.vote_average??item?.raw_tmdb?.vote_average??0)||0};return ct274Row(y,{meta:ct274MovieMeta(y),action:ct274MovieWatchAction(y),attrs:ct274MovieAttrs(y)})},
 homeSeriesRow:(item,episode=false)=>{if(episode){const y={...item,season_number:Number(item?.next_season_number||item?.season_number||0),episode_number:Number(item?.next_episode_number||item?.episode_number||0),episode_title:item?.next_episode_title||item?.episode_title||('Episódio '+Number(item?.next_episode_number||item?.episode_number||0)),episode_rating:item?.next_episode_rating??item?.episode_rating,episode_air_date:item?.next_episode_air_date||item?.episode_air_date};return ct274Row(y,{meta:ct274EpisodeMeta(y),sub:ct274AvailableText(item),action:ct274EpisodeWatchAction(item),attrs:ct274EpisodeAttrs(y,item?.home_bucket||'continue')})}return ct274Row(item,{meta:String(Number(item?.watched_episodes||0))+'/'+String(Math.max(Number(item?.total_episodes||0),Number(item?.released_episodes||0))||'?'),sub:item?.home_bucket==='up_to_date'?'Em dia':ct274AvailableText(item)})},
 homeHistoryRows:(items,kind,payload)=>ct274HistoryRows(items,kind,payload),
 ensureHomeShell:()=>{setApp(shell('Home','Sua biblioteca sincronizada e organizada pelo seu progresso.','home','<div class="page" data-home></div>'));return true},`,
  'core Home presentation bridge'
);

/* r424 can still run legacy entry hooks, but r475 never allows an active Series view
   to stay visually hidden. Frame/data ownership stays with r388/r399. */

/* r425 still reveals the Home during legacy entry, but it must not overwrite the
   semantic Series/Watchlist anchor with a delayed absolute scroll-to-top. */
js=patchRuntime(js,"window.__ctR425Marker='home-no-blank+f1-1280+foryou-single-slot-optimistic+profile-sports-canonical';",[
  [
    "function homeEntry425(){if(routeNow()!=='home')return;try{window.scrollTo({top:0,left:0,behavior:'auto'})}catch{};for(const ms of[0,40,120,250,600,1200])setTimeout(revealHome425,ms)}",
    "function homeEntry425(){if(routeNow()!=='home')return;for(const ms of[0,40,120,250,600,1200])setTimeout(revealHome425,ms)}",
    'remove delayed absolute Home scroll'
  ]
],'r425');

/* r388 owns the stable Home frame/history. Route all rich row generation back
   through the lexical closure bridge and re-anchor after async History repaint. */
js=patchRuntime(js,"window.__ctR388Marker='r393-hidden-history-anchor+lightweight-movies+foryou-db-first-bounded';",[
  [
    "try{return ct274Row(y,{meta:ct274EpisodeMeta(y),sub:ct274AvailableText(x),action:ct274EpisodeWatchAction(x),attrs:ct274EpisodeAttrs(y,x.home_bucket)})}catch{}",
    "try{const html=window.__ctCoreR471?.homeSeriesRow?.(x,true);if(typeof html==='string'&&html.trim())return html}catch{}",
    'rich episode row'
  ],
  [
    "try{return ct274Row(x,{meta:String(Number(x?.watched_episodes||0))+'/'+String(Math.max(Number(x?.total_episodes||0),Number(x?.released_episodes||0))||'?'),sub:x?.home_bucket==='up_to_date'?'Em dia':ct274AvailableText(x)})}catch{}",
    "try{const html=window.__ctCoreR471?.homeSeriesRow?.(x,false);if(typeof html==='string'&&html.trim())return html}catch{}",
    'rich Series row'
  ],
  [
    "let body='<div class=\"empty\">Carregando histórico…</div>';if(hHistory)try{body=ct274HistoryRows(data,ep?'episode':'movie',{series:hSeries,movie_watchlist:hMovies,history_episodes:rows(hHistory?.history_episodes),history_movies:rows(hHistory?.history_movies)})||'<div class=\"empty\">Nenhum item.</div>'}catch{}",
    "let body='<div class=\"empty\">Carregando histórico…</div>';if(hHistory)try{body=window.__ctCoreR471?.homeHistoryRows?.(data,ep?'episode':'movie',{series:hSeries,movie_watchlist:hMovies,history_episodes:rows(hHistory?.history_episodes),history_movies:rows(hHistory?.history_movies)})||'<div class=\"empty\">Nenhum item.</div>'}catch{}",
    'rich History rows'
  ],
  [
    "try{return ct274Row(y,{meta:ct274MovieMeta(y),action:ct274MovieWatchAction(y),attrs:ct274MovieAttrs(y)})}catch{return '<div class=\"media-row\"><b>'+esc(titleOf(y))+'</b></div>'}",
    "try{const html=window.__ctCoreR471?.homeMovieRow?.(y);if(typeof html==='string'&&html.trim())return html}catch{}return '<div class=\"media-row\"><b>'+esc(titleOf(y))+'</b></div>'",
    'rich Movie row'
  ],
  [
    "renderHistory('episodes');renderHistory('movies');scheduleHome393(activeKind(),false)",
    "renderHistory('episodes');renderHistory('movies');scheduleHome393(activeKind(),false);setTimeout(()=>{try{window.__ctR399?.enterHome?.(activeKind())}catch{}},0)",
    'History repaint primary re-anchor'
  ]
],'r388');

/* r399 owns v452/v405. Rebuild an incomplete Home frame, use rich lexical rows,
   and keep the selected primary section as the final scroll authority. */
js=patchRuntime(js,"window.__ctR399Marker='startup-auth-current-rpc+home+direct-foryou';",[
  [
    "if(r==='home'&&!q('[data-home]')){lastRouteSig='home:frame';try{void window.__ctR388?.renderHome?.()}catch{}return true}",
    "if(r==='home'&&(!q('[data-home]')||!q('[data-home-view=\"series\"]')||!q('[data-home-view=\"movies\"]'))){lastRouteSig='home:frame';try{if(!q('[data-home]'))window.__ctCoreR471?.ensureHomeShell?.();void window.__ctR388?.renderHome?.()}catch{}setTimeout(()=>settleRoute399(true),0);return true}",
    'complete Home frame recovery'
  ],
  [
    "try{if(typeof ct274Row==='function'){const html=ct274Row(y,{meta:typeof ct274MovieMeta==='function'?ct274MovieMeta(y):'',action:typeof ct274MovieWatchAction==='function'?ct274MovieWatchAction(y):'',attrs:typeof ct274MovieAttrs==='function'?ct274MovieAttrs(y):''});if(typeof html==='string'&&html.trim())return html}}catch{}",
    "try{const html=window.__ctCoreR471?.homeMovieRow?.(y);if(typeof html==='string'&&html.trim())return html}catch{}",
    'rich Movie row'
  ],
  [
    "if(hasEpisode){const y={...x,season_number:Number(x.next_season_number||0),episode_number:Number(x.next_episode_number||0),episode_title:x.next_episode_title||('Episódio '+Number(x.next_episode_number||0)),episode_rating:x.next_episode_rating,episode_air_date:x.next_episode_air_date};try{if(typeof ct274Row==='function')return ct274Row(y,{meta:typeof ct274EpisodeMeta==='function'?ct274EpisodeMeta(y):'',sub:typeof ct274AvailableText==='function'?ct274AvailableText(x):'',action:typeof ct274EpisodeWatchAction==='function'?ct274EpisodeWatchAction(x):'',attrs:typeof ct274EpisodeAttrs==='function'?ct274EpisodeAttrs(y,x.home_bucket):''})}catch{}}",
    "if(hasEpisode){try{const html=window.__ctCoreR471?.homeSeriesRow?.(x,true);if(typeof html==='string'&&html.trim())return html}catch{}}",
    'rich next episode row'
  ],
  [
    "try{if(typeof ct274Row==='function')return ct274Row(x,{meta:String(Number(x?.watched_episodes||0))+'/'+String(Math.max(Number(x?.total_episodes||0),Number(x?.released_episodes||0))||'?'),sub:x?.home_bucket==='up_to_date'?'Em dia':(typeof ct274AvailableText==='function'?ct274AvailableText(x):'')})}catch{}",
    "try{const html=window.__ctCoreR471?.homeSeriesRow?.(x,false);if(typeof html==='string'&&html.trim())return html}catch{}",
    'rich Series row'
  ]
],'r399');

/* Pra Você keeps the working r464 owner. Only 100% Novos / daily move to v475,
   whose DB filter excludes known media by real TMDB identity and title aliases.
   Da sua Watchlist deliberately stays on v421. */
js=patchRuntime(js,"window.__ctR464Marker='discover-foryou-visible-owner-v421';",[
  [
    "const name=group==='watch'?'cinetracker_discover_watch_unseen_v421':'cinetracker_discover_fresh_v421';",
    "const name=group==='watch'?'cinetracker_discover_watch_unseen_v421':'cinetracker_discover_fresh_v475';",
    'strict fresh pool'
  ]
],'r464');

/* r472 is the sole Profile summary owner. Use the dedicated lightweight list RPC,
   hide every legacy header control, and always open the independent full-list screen. */
js=patchRuntime(js,"window.__ctR472Marker='home-r388-r399+foryou-r464+profile-12-separate-more+stadium-v296';",[
  [
`async function loadMedia(force=false){
 if(mediaTask)return mediaTask;
 mediaTask=(async()=>{try{const dash=arrayFrom(await timeout(core.rpc('cinetracker_profile_media_dashboard_v0991',{}),8000));if(dash.length||force)mediaLists=makeMediaLists(dash);return mediaLists}catch{return mediaLists||fallbackMediaLists()}finally{mediaTask=null}})();return mediaTask;
}`,
`async function loadMedia(force=false){
 if(mediaTask)return mediaTask;
 mediaTask=(async()=>{try{
  const raw=unwrap(await timeout(core.rpc('cinetracker_profile_lists_v475',{}),8000))||{},next={
   series:rows(raw?.series),movies:rows(raw?.movies),seriesFav:rows(raw?.series_favorites),movieFav:rows(raw?.movie_favorites)
  };
  if(force||next.series.length||next.movies.length||next.seriesFav.length||next.movieFav.length)mediaLists=next;
  return mediaLists||next;
 }catch{return mediaLists||fallbackMediaLists()}finally{mediaTask=null}})();return mediaTask;
}`,
    'lightweight Profile lists'
  ],
  [
    "function hideNativeMore(panel){const b=nativeMore(panel);if(!b)return null;b.dataset.ct472NativeMore='1';b.hidden=true;b.style.display='none';b.setAttribute('aria-hidden','true');b.tabIndex=-1;panel.__ct472NativeMore=b;return b}",
    "function hideNativeMore(panel){const all=qa('button,a,[role=\"button\"]',panel).filter(b=>!b.dataset.ct472More&&norm(b.textContent).includes('ver mais'));for(const b of all){b.dataset.ct472NativeMore='1';b.hidden=true;b.style.display='none';b.setAttribute('aria-hidden','true');b.tabIndex=-1}panel.__ct472NativeMore=null;return all[0]||null}",
    'hide all legacy More controls'
  ],
  [
`function openFullList(key){
 const panel=panelByLabel(labels[key]),trigger=panel?.__ct472NativeMore;
 if(trigger?.isConnected&&!trigger.disabled){try{trigger.click();return true}catch{}}
 return openFallbackScreen(key);
}`,
`function openFullList(key){
 return openFallbackScreen(key);
}`,
    'independent full-list screen'
  ]
],'r472');

{
 const anchor="window.__ctR472Marker='home-r388-r399+foryou-r464+profile-12-separate-more+stadium-v296';",at=js.indexOf(anchor),start=js.lastIndexOf('(()=>{',at),close=js.indexOf('\n})();',at);
 if(at<0||start<0||close<0)throw new Error('r475 r472 scroll bounds');
 let region=js.slice(start,close+6);
 const pattern=/try\s*\{\s*window\.scrollTo\(\{\s*top\s*:\s*0\s*,\s*left\s*:\s*0\s*,\s*behavior\s*:\s*['"]auto['"]\s*\}\)\s*\}\s*catch\s*\{\s*\}/;
 if(pattern.test(region))region=region.replace(pattern,"/* r475: r399 owns the Home primary-section anchor; bounded recovery never resets it. */");
 else if(region.includes('window.scrollTo'))throw new Error('r475 could not neutralize r472 Home scroll reset');
 else if(!region.includes('r399 owns the Home primary-section anchor'))region=region.replace('function setHomeKind(kind){',"function setHomeKind(kind){\n /* r475: r399 owns the Home primary-section anchor; bounded recovery never resets it. */");
 js=js.slice(0,start)+region+js.slice(close+6);
}

js+="\nwindow.__ctR475Marker='home-complete-rich-anchor+discover-strict-fresh-v475+profile-fast-lists-fullscreen';\n";

html=html.replaceAll('app-v474.js','app-v475.js').replaceAll('app-v474.css','app-v475.css').replaceAll('v1.0.264','v1.0.265').replaceAll('r474-official-1.0.264','r475-official-1.0.265');
css+="\n/* CineTracker Web 1.0.265 r475 — complete rich Home, strict fresh discovery and reliable Profile full lists. */\n[data-home-view=\"series\"]:not(.hidden):not([hidden]){visibility:visible!important;opacity:1!important}\n";
sw=sw.replaceAll('app-v474.js','app-v475.js').replaceAll('app-v474.css','app-v475.css').replaceAll('ct-web-1.0.264-r474','ct-web-1.0.265-r475');

const release=JSON.parse(releaseRaw);
Object.assign(release,{
 version:'1.0.265',
 revision:'r475-official-1.0.265',
 base:'r474+r475-home-discovery-profile',
 scope:'home-series-frame+movie-watchlist-rich-anchor+discover-strict-fresh+profile-full-list',
 home_series:'active Series view cannot remain hidden; incomplete Home frame is rebuilt; r399 v452 renders rich rows through the lexical presentation bridge',
 home_movies:'v405 full Watchlist remains complete, rich ct274 visual restored and Filmes intent finishes anchored at Assistir a seguir / Watchlist after History repaint',
 discover_foryou:'working r464 owner preserved; Watchlist slots remain v421 while daily/100% Novos use strict alias-aware v475 fresh pools',
 profile_lists:'cinetracker_profile_lists_v475 supplies complete lightweight media lists; 12 cards plus 13th Ver mais; all legacy header More controls hidden; own More always opens a separate full-list screen',
 history:'Home history v391 and daily history/undo preserved',
 sports:'preserved',
 f1:'preserved',
 android:'unchanged-1.0.20/10062'
});

await Promise.all([
 writeFile(resolve(dist,'app-v475.js'),js),
 writeFile(resolve(dist,'app-v475.css'),css),
 writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),
 writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v474.js'),{force:true}),rm(resolve(dist,'app-v474.css'),{force:true})]);

const region=anchor=>{const at=js.indexOf(anchor),start=js.lastIndexOf('(()=>{',at),close=js.indexOf('\n})();',at);if(at<0||start<0||close<0)throw new Error('r475 missing runtime '+anchor);return js.slice(start,close+6)};
const r388=region("window.__ctR388Marker='r393-hidden-history-anchor+lightweight-movies+foryou-db-first-bounded';");
const r425=region("window.__ctR425Marker='home-no-blank+f1-1280+foryou-single-slot-optimistic+profile-sports-canonical';");
const r399=region("window.__ctR399Marker='startup-auth-current-rpc+home+direct-foryou';");
const r464=region("window.__ctR464Marker='discover-foryou-visible-owner-v421';");
const r472=region("window.__ctR472Marker='home-r388-r399+foryou-r464+profile-12-separate-more+stadium-v296';");
if(!js.includes('homeMovieRow:item=>')||!js.includes('homeSeriesRow:(item,episode=false)=>')||!js.includes('ensureHomeShell:()=>'))throw new Error('r475 lexical Home presentation bridge missing');
if(!css.includes('[data-home-view="series"]:not(.hidden):not([hidden]){visibility:visible!important;opacity:1!important}'))throw new Error('r475 active Series visibility guard missing');
if(r425.includes('window.scrollTo({top:0,left:0,behavior:\'auto\'})'))throw new Error('r475 r425 still resets Home to absolute top');
if(!r388.includes('homeHistoryRows?.')||!r388.includes('homeMovieRow?.')||!r388.includes('homeSeriesRow?.'))throw new Error('r475 r388 rich rows missing');
if(!r399.includes('!q(\'[data-home-view="series"]\')')||!r399.includes('homeMovieRow?.')||!r399.includes('homeSeriesRow?.'))throw new Error('r475 r399 frame/rich recovery missing');
if(!r464.includes("cinetracker_discover_fresh_v475")||!r464.includes("cinetracker_discover_watch_unseen_v421"))throw new Error('r475 Discover pools invalid');
for(const need of ["cinetracker_profile_lists_v475","return openFallbackScreen(key)","panel.__ct472NativeMore=null","r399 owns the Home primary-section anchor"])if(!r472.includes(need))throw new Error('r475 Profile/Home final owner missing '+need);
for(const need of ['cinetracker_home_series_v452','cinetracker_home_movies_v405','cinetracker_home_history_v391','data-ct472-all-screen'])if(!js.includes(need))throw new Error('r475 missing '+need);
for(const bad of ['window.location.reload(','router.refresh(','new MutationObserver','setInterval(','while(true)'])if(r399.includes(bad)||r464.includes(bad)||r472.includes(bad))throw new Error('r475 forbidden '+bad);
console.log('WEB_R475_READY complete rich Home + strict fresh + Profile full-list');
