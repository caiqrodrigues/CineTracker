import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r464.mjs');

const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v464.js'),'utf8'),
 readFile(resolve(dist,'app-v464.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'runtime-r470-stable-recovery.js'),'utf8')
]);

new Function(runtime);
for(const bad of ['window.location.reload(','router.refresh(','while(true)','new MutationObserver','setInterval(']){
 if(runtime.includes(bad))throw new Error('r470 forbidden '+bad);
}

const once=(source,needle,replacement,label)=>{
 const count=source.split(needle).length-1;
 if(count!==1)throw new Error('r470 expected one '+label+', found '+count);
 return source.replace(needle,replacement);
};

const unstableProfile=`const stats=Array.isArray(statsRaw)?statsRaw[0]:statsRaw,sports=Array.isArray(sportsRaw)?sportsRaw[0]:sportsRaw;patchProfileStats461(stats||{},sports||{});unclipProfile461();return true`;
const stableProfile=`const stats=Array.isArray(statsRaw)?statsRaw[0]:statsRaw,sports=Array.isArray(sportsRaw)?sportsRaw[0]:sportsRaw;if(stats&&typeof stats==='object')patchProfileStats461(stats,sports&&typeof sports==='object'?sports:null);unclipProfile461();return true`;
js=once(js,unstableProfile,stableProfile,'r461 profile nonzero guard');

js+='\n'+runtime+'\n';

html=html.replaceAll('app-v464.js','app-v470.js').replaceAll('app-v464.css','app-v470.css').replaceAll('v1.0.254','v1.0.260').replaceAll('r464-official-1.0.254','r470-official-1.0.260');
sw=sw.replaceAll('app-v464.js','app-v470.js').replaceAll('app-v464.css','app-v470.css').replaceAll('ct-web-1.0.254-r464','ct-web-1.0.260-r470');

const release=JSON.parse(releaseRaw);
Object.assign(release,{
 version:'1.0.260',
 revision:'r470-official-1.0.260',
 base:'r464-stable-data-owners+r470-profile-history',
 scope:'home-series+home-movies-watchlist+discover-foryou+profile-stats+profile-13-more+daily-history-undo',
 runtime_authority:'returns to the r464 session/rpc/route aliases; r468/r469 ctSession/sbRpc bridges are not shipped',
 home_series:'r399 authenticated v452 owner restored without r469 global alias replacement',
 home_movies:'r399 v405 paged Watchlist restored without r469 global alias replacement',
 discover_foryou:'r464 is again the sole visible Pra Voce owner over six v421 pools',
 profile_stats:'r461 never paints zero values when profile RPCs fail; canonical r424 values remain visible until a valid replacement arrives',
 profile_lists:'13 cards plus one compact Ver mais; actors hydrate through cinetracker_profile_actors_v465 and expose the real total',
 history:'daily details use v426 directly; compact same-row undo is optimistic with rollback',
 f1:'r462 preserved',
 android:'unchanged-1.0.20/10062'
});

await Promise.all([
 writeFile(resolve(dist,'app-v470.js'),js),
 writeFile(resolve(dist,'app-v470.css'),css),
 writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),
 writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([
 rm(resolve(dist,'app-v464.js'),{force:true}),
 rm(resolve(dist,'app-v464.css'),{force:true})
]);

for(const need of [
 "window.__ctR470Marker='stable-r464-aliases+profile-stats-nonzero+13-more+actors-v465+history-v426'",
 "window.__ctR464Marker='discover-foryou-visible-owner-v421'",
 'cinetracker_home_series_v452',
 'cinetracker_home_movies_v405',
 'cinetracker_discover_watch_unseen_v421',
 'cinetracker_discover_fresh_v421',
 'cinetracker_profile_actors_v465',
 'cinetracker_activity_items_by_day_v426',
 'cinetracker_unmark_history_item_v426',
 'cinetracker_unmark_sport_history_v426',
 "if(stats&&typeof stats==='object')patchProfileStats461"
])if(!js.includes(need))throw new Error('r470 missing '+need);

for(const retired of [
 "window.__ctR468Marker='canonical-ctSession-sbRpc-route-bridge'",
 "window.__ctR469Marker='direct-ctSession-sbRpc-owner-hooks+profile-dedupe'",
 'window.rpc=rpc468',
 'window.rpc=rpc469'
])if(js.includes(retired))throw new Error('r470 retained broken runtime '+retired);

console.log('WEB_R470_READY stable r464 data owners + guarded Profile + actors/history authority');
