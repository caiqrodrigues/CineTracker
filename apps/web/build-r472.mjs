import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r471.mjs');

const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v471.js'),'utf8'),
 readFile(resolve(dist,'app-v471.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'runtime-r472-owner-recovery.js'),'utf8')
]);

const patchRegion=(source,startNeedle,endNeedle,patches,label)=>{
 const start=source.indexOf(startNeedle);if(start<0)throw new Error('r472 missing '+label+' start');
 const end=endNeedle?source.indexOf(endNeedle,start):source.length;if(end<0)throw new Error('r472 missing '+label+' end');
 let region=source.slice(start,end);
 for(const [needle,replacement,name,required=true] of patches){
  const count=region.split(needle).length-1;
  if(required&&count!==1)throw new Error('r472 expected one '+label+' '+name+', found '+count);
  if(!required&&count>1)throw new Error('r472 expected at most one '+label+' '+name+', found '+count);
  if(count===1)region=region.replace(needle,replacement);
 }
 return source.slice(0,start)+region+source.slice(end);
};

js=patchRegion(js,'/* CineTracker Web 1.0.251 r461','/* CineTracker Web 1.0.252 r462',[
 ["if(home&&routeNow()==='home'){const k=homeKind461(home);if(k){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();k==='movies'?enterMovies461():enterSeries461();return}}","if(false&&home&&routeNow()==='home'){const k=homeKind461(home);if(k){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();k==='movies'?enterMovies461():enterSeries461();return}}",'home tab capture'],
 ["if(t.closest('[data-ct461-movie-retry]')){e.preventDefault();e.stopImmediatePropagation();void loadMovies461(true);return}","if(false&&t.closest('[data-ct461-movie-retry]')){e.preventDefault();e.stopImmediatePropagation();void loadMovies461(true);return}",'movie retry'],
 ["if(fy&&routeNow()==='discover'){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();enterFY461();return}","if(false&&fy&&routeNow()==='discover'){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();enterFY461();return}",'foryou tab capture',false],
 ["if(t.closest('[data-ct461-fy-retry]')){e.preventDefault();e.stopImmediatePropagation();void loadFY461(true);return}","if(false&&t.closest('[data-ct461-fy-retry]')){e.preventDefault();e.stopImmediatePropagation();void loadFY461(true);return}",'foryou retry'],
 ["if(n==='home')setTimeout(enterSeries461,0);","if(false&&n==='home')setTimeout(enterSeries461,0);",'home nav'],
 ["if(n==='discover')setTimeout(()=>{if(fyActive461())enterFY461()},0);","if(false&&n==='discover')setTimeout(()=>{if(fyActive461())enterFY461()},0);",'discover nav'],
 ["if(n==='profile')setTimeout(scheduleProfile461,0);","if(false&&n==='profile')setTimeout(scheduleProfile461,0);",'profile nav']
],'r461');

js=patchRegion(js,'/* CineTracker Web 1.0.261 r471',null,[
 ["const more=t.closest('[data-ct471-more]');if(more){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();void renderAll(String(more.dataset.ct471More||''));return}","const more=t.closest('[data-ct471-more]');if(false&&more){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();void renderAll(String(more.dataset.ct471More||''));return}",'inline more'],
 ["if(dest==='profile')scheduleProfile(true);if(dest==='home')scheduleHome(true);","if(false&&dest==='profile')scheduleProfile(true);if(dest==='home')scheduleHome(true);",'profile nav schedule'],
 ["window.addEventListener('popstate',()=>{if(routeNow()==='profile')scheduleProfile(true);if(routeNow()==='home')scheduleHome(true)});","window.addEventListener('popstate',()=>{if(false&&routeNow()==='profile')scheduleProfile(true);if(routeNow()==='home')scheduleHome(true)});",'profile popstate schedule'],
 ["window.addEventListener('cinetracker:data-changed',()=>{if(routeNow()==='profile'){mediaAttempted=false;actorsAttempted=false;void loadMediaLists(true);void loadActors(true)}});","window.addEventListener('cinetracker:data-changed',()=>{if(false&&routeNow()==='profile'){mediaAttempted=false;actorsAttempted=false;void loadMediaLists(true);void loadActors(true)}});",'profile data change'],
 ["releaseHomeGate();bindDailyAuthority();scheduleHome(false);if(routeNow()==='profile')scheduleProfile(false);","releaseHomeGate();bindDailyAuthority();scheduleHome(false);if(false&&routeNow()==='profile')scheduleProfile(false);",'profile initial schedule']
],'r471');

new Function(runtime);
for(const bad of ['window.location.reload(','router.refresh(','while(true)','new MutationObserver','setInterval('])if(runtime.includes(bad))throw new Error('r472 forbidden '+bad);
js+='\n'+runtime+'\n';

html=html.replaceAll('app-v471.js','app-v472.js').replaceAll('app-v471.css','app-v472.css').replaceAll('v1.0.261','v1.0.262').replaceAll('r471-official-1.0.261','r472-official-1.0.262');
css+='\n/* CineTracker Web 1.0.262 r472 — visible owner recovery without full reload. */\n';
sw=sw.replaceAll('app-v471.js','app-v472.js').replaceAll('app-v471.css','app-v472.css').replaceAll('ct-web-1.0.261-r471','ct-web-1.0.262-r472');

const release=JSON.parse(releaseRaw);Object.assign(release,{
 version:'1.0.262',revision:'r472-official-1.0.262',base:'r471+r472-visible-owner-recovery',
 scope:'home-series+home-movies-watchlist+discover-foryou+profile-five-lists+stadium-stat',
 home_series:'r461 hide-on-nav owner retired; r388 frame/history plus in-closure r399 v452 are reasserted with bounded recovery',
 home_movies:'r399 v405 paging is reasserted on Filmes intent while r388 preserves the Home frame/history',
 discover_foryou:'r461 visible retry/nav owner retired; r464 v421 renderer is reactivated after Discover/Pra Voce navigation',
 profile_lists:'r472 is the sole summary owner: maximum 13 cards plus one 14th Ver mais; Ver mais opens the existing separate full-list flow and falls back to a separate full-screen overlay, never inline expansion',
 stadium:'Jogos no Estadio comes from cinetracker_sports_stadium_summary_v296 with watch-history fallback and never overwrites a valid value on RPC failure',
 history:'r471/v426 daily graph detail and same-row optimistic undo preserved',
 f1:'r462 preserved',android:'unchanged-1.0.20/10062'
});

await Promise.all([
 writeFile(resolve(dist,'app-v472.js'),js),
 writeFile(resolve(dist,'app-v472.css'),css),
 writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),
 writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v471.js'),{force:true}),rm(resolve(dist,'app-v471.css'),{force:true})]);

for(const need of [
 "window.__ctR472Marker='home-r388-r399+foryou-r464+profile-13-separate-more+stadium-v296'",
 'cinetracker_home_series_v452','cinetracker_home_movies_v405','cinetracker_home_history_v391',
 "window.__ctR464Marker='discover-foryou-visible-owner-v421'",'cinetracker_discover_watch_unseen_v421','cinetracker_discover_fresh_v421',
 'cinetracker_profile_media_dashboard_v0991','cinetracker_profile_actors_v465','const PROFILE_LIMIT=13','data-ct472-more',
 'cinetracker_sports_stadium_summary_v296','cinetracker_sports_watch_history_v296',
 'cinetracker_activity_items_by_day_v426','cinetracker_unmark_history_item_v426','cinetracker_unmark_sport_history_v426'
])if(!js.includes(need))throw new Error('r472 missing '+need);
if(js.includes("if(n==='home')setTimeout(enterSeries461,0);"))throw new Error('r472 retained r461 Home nav owner');
if(js.includes("if(n==='discover')setTimeout(()=>{if(fyActive461())enterFY461()},0);"))throw new Error('r472 retained r461 Discover nav owner');
if(js.includes("if(n==='profile')setTimeout(scheduleProfile461,0);"))throw new Error('r472 retained r461 Profile nav owner');
console.log('WEB_R472_READY visible owners recovered');
