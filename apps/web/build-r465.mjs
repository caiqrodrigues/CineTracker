import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r464.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,...runtimeParts]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v464.js'),'utf8'),readFile(resolve(dist,'app-v464.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(dist,'release.json'),'utf8'),
 ...Array.from({length:7},(_,i)=>readFile(resolve(root,`runtime-r465-part${i+1}.inc`),'utf8'))
]);
const runtime=runtimeParts.join('');
const patch=(from,to,label)=>{if(!js.includes(from))throw new Error('r465 missing '+label);js=js.replace(from,to)};
const patchAll=(from,to,label)=>{if(!js.includes(from))throw new Error('r465 missing '+label);js=js.replaceAll(from,to)};

// Home: old capture owners can run before a later listener and abort while auth is still warming up.
patch(
 "const hb=t.closest('[data-home-tab]');if(hb&&routeNow()==='home'){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();const kind=String(hb.dataset.homeTab||'series')==='movies'?'movies':'series';try{window.__ctR371?.applyTab?.(kind)}catch{}lastRouteSig='';setTimeout(()=>settleRoute399(true),0);return}",
 "const hb=t.closest('[data-home-tab]');if(false&&hb&&routeNow()==='home'){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();const kind=String(hb.dataset.homeTab||'series')==='movies'?'movies':'series';try{window.__ctR371?.applyTab?.(kind)}catch{}lastRouteSig='';setTimeout(()=>settleRoute399(true),0);return}",
 'r399 home click owner'
);
patch(
 "const home=t.closest('[data-home-tab],.home-tabs button');if(home&&routeNow()==='home'){const k=homeKind461(home);if(k){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();k==='movies'?enterMovies461():enterSeries461();return}}",
 "const home=t.closest('[data-home-tab],.home-tabs button');if(false&&home&&routeNow()==='home'){const k=homeKind461(home);if(k){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();k==='movies'?enterMovies461():enterSeries461();return}}",
 'r461 home click owner'
);

// Pra Você: disable all known lexical re-entry points. r465 owns the visible host and rebinding alone is not enough for closures.
patch(
 "const fy=t.closest('[data-ct319-tab=\"foryou\"]');if(fy&&routeNow()==='discover'){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();lastRouteSig='';enterForYou399();return}",
 "const fy=t.closest('[data-ct319-tab=\"foryou\"]');if(false&&fy&&routeNow()==='discover'){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();lastRouteSig='';enterForYou399();return}",
 'r399 foryou click owner'
);
patch(
 "if(isForYou()&&(q('[data-ct319-content]')||q('[data-ct315-content]')||q('[data-ct263-discover-content]'))){const sig='discover:foryou';if(!force&&sig===lastRouteSig&&q('[data-ct399-foryou]'))return true;lastRouteSig=sig;return enterForYou399()}",
 "if(false&&isForYou()&&(q('[data-ct319-content]')||q('[data-ct315-content]')||q('[data-ct263-discover-content]'))){const sig='discover:foryou';if(!force&&sig===lastRouteSig&&q('[data-ct399-foryou]'))return true;lastRouteSig=sig;return enterForYou399()}",
 'r399 foryou route settle'
);
patch(
 "if(isForYou()){fyRun++;fyTask=null;setTimeout(()=>void loadForYou399(true),80)}",
 "if(false&&isForYou()){fyRun++;fyTask=null;setTimeout(()=>void loadForYou399(true),80)}",
 'r399 foryou data changed'
);
patch(
 "if(routeNow()==='discover'&&isForYouControl(t)){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();activate()}",
 "if(false&&routeNow()==='discover'&&isForYouControl(t)){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();activate()}",
 'r464 foryou click owner'
);
patch(
 "for(const ev of ['pointerdown','touchstart'])window.addEventListener(ev,e=>{if(routeNow()==='discover'&&isForYouControl(e.target))setTimeout(()=>activate(),0)},{capture:true,passive:true});",
 "for(const ev of ['pointerdown','touchstart'])window.addEventListener(ev,e=>{if(false&&routeNow()==='discover'&&isForYouControl(e.target))setTimeout(()=>activate(),0)},{capture:true,passive:true});",
 'r464 foryou pointer owner'
);
patch(
 "window.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&routeNow()==='discover'&&isForYouControl(e.target))setTimeout(()=>activate(),0)},true);",
 "window.addEventListener('keydown',e=>{if(false&&(e.key==='Enter'||e.key===' ')&&routeNow()==='discover'&&isForYouControl(e.target))setTimeout(()=>activate(),0)},true);",
 'r464 foryou key owner'
);
patch(
 "window.addEventListener('popstate',()=>setTimeout(()=>{if(isForYou())activate()},0));",
 "window.addEventListener('popstate',()=>setTimeout(()=>{if(false&&isForYou())activate()},0));",
 'r464 foryou popstate owner'
);
patch(
 "window.addEventListener('cinetracker:data-changed',()=>setTimeout(()=>{if(isForYou())void load(true)},0));",
 "window.addEventListener('cinetracker:data-changed',()=>setTimeout(()=>{if(false&&isForYou())void load(true)},0));",
 'r464 foryou data owner'
);
patch(
 "for(const ms of [0,250,800,1800])setTimeout(()=>{if(isForYou())activate()},ms);",
 "for(const ms of [0,250,800,1800])setTimeout(()=>{if(false&&isForYou())activate()},ms);",
 'r464 foryou auto owner'
);

js+='\n'+runtime+'\n';
html=html.replaceAll('app-v464.js','app-v465.js').replaceAll('app-v464.css','app-v465.css').replaceAll('v1.0.254','v1.0.255').replaceAll('r464-official-1.0.254','r465-official-1.0.255');
sw=sw.replaceAll('app-v464.js','app-v465.js').replaceAll('app-v464.css','app-v465.css').replaceAll('ct-web-1.0.254-r464','ct-web-1.0.255-r465');
const release=JSON.parse(releaseRaw);Object.assign(release,{
 version:'1.0.255',revision:'r465-official-1.0.255',base:'r464+real-device-recovery',
 scope:'home-series+home-movies+discover-foryou+profile-lists+daily-history-undo',
 home_series:'r465 waits for an authenticated session before delegating to the current v452 renderer',
 home_movies:'r465 waits for auth before invoking the v405 paged Watchlist owner',
 discover_foryou:'r465 owns the visible discover host; six v421 pools render seven slots with active Watchlist/Visto/Trocar actions',
 profile:'13-card summary plus 14th Ver mais; favorite actors use cinetracker_profile_actors_v465 to escape the legacy 10-row cap',
 history:'per-row minimal undo uses the correct media or sport v426 RPC with optimistic removal and rollback',
 f1:'r464 unchanged',android:'unchanged-1.0.20/10062'
});
await Promise.all([
 writeFile(resolve(dist,'app-v465.js'),js),writeFile(resolve(dist,'app-v465.css'),css),writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v464.js'),{force:true}),rm(resolve(dist,'app-v464.css'),{force:true})]);
for(const need of [
 "window.__ctR465Marker='real-device-home-discover-profile-history'",'cinetracker_home_movies_v405','cinetracker_home_series_v452',
 'cinetracker_discover_watch_unseen_v421','cinetracker_discover_fresh_v421','cinetracker_profile_actors_v465',
 'cinetracker_unmark_history_item_v426','cinetracker_unmark_sport_history_v426','data-ct465-fy-action="swap"','data-ct465-undo="1"'
])if(!js.includes(need))throw new Error('r465 missing '+need);
for(const bad of ['window.location.reload(','router.refresh(','while(true)','new MutationObserver','setInterval('])if(runtime.includes(bad))throw new Error('r465 forbidden '+bad);
console.log('WEB_R465_READY');
