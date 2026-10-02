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
const inject=(signature,body,label)=>{const n=js.split(signature).length-1;if(n!==1)throw new Error(`r465 ${label} expected 1, found ${n}`);js=js.replace(signature,signature+body)};
const injectAfter=(marker,signature,body,label)=>{const m=js.indexOf(marker);if(m<0)throw new Error('r465 missing '+label+' marker');const i=js.indexOf(signature,m);if(i<0)throw new Error('r465 missing '+label);const p=i+signature.length;js=js.slice(0,p)+body+js.slice(p)};

// All still-live Home/Pra Você generations converge into r465.
// Several legacy capture listeners call stopImmediatePropagation before later listeners can observe the click.
inject('async function loadMovies456(force=false){',"if(window.__ctR465?.enterHome)return window.__ctR465.enterHome('movies',false);",'r456 movies');
inject('async function loadFY456(force=false){',"if(window.__ctR465?.loadForYou)return window.__ctR465.loadForYou(force);",'r456 foryou load');
inject('function paintFY456(){',"if(window.__ctR465?.paintForYou)return window.__ctR465.paintForYou();",'r456 foryou paint');

inject('function enterMovies457(){',"if(window.__ctR465?.enterHome)return window.__ctR465.enterHome('movies',false);",'r457 movies');
inject('async function fyLoad457(force=false){',"if(window.__ctR465?.loadForYou)return window.__ctR465.loadForYou(force);",'r457 foryou load');
inject('function fyPaint457(){',"if(window.__ctR465?.paintForYou)return window.__ctR465.paintForYou();",'r457 foryou paint');

inject('function scheduleSeries458(){',"if(window.__ctR465?.enterHome){void window.__ctR465.enterHome('series',false);return}",'r458 series schedule');
inject('function ensureForYou458(){',"if(window.__ctR465?.loadForYou){void window.__ctR465.loadForYou(false);return true}",'r458 foryou ensure');

inject('function enterMovies460(){',"if(window.__ctR465?.enterHome)return window.__ctR465.enterHome('movies',false);",'r460 movies');
inject('function enterSeries460(){',"if(window.__ctR465?.enterHome)return window.__ctR465.enterHome('series',false);",'r460 series');
inject('async function loadForYou460(force=false){',"if(window.__ctR465?.loadForYou)return window.__ctR465.loadForYou(force);",'r460 foryou load');

// r461 remains the low-level v405 movie pager used by r465, so only entrypoints/FY delegate.
inject('function enterSeries461(){',"if(window.__ctR465?.enterHome)return window.__ctR465.enterHome('series',false);",'r461 series entry');
inject('function enterMovies461(){',"if(window.__ctR465?.enterHome)return window.__ctR465.enterHome('movies',false);",'r461 movies entry');
inject('async function loadFY461(force=false){',"if(window.__ctR465?.loadForYou)return window.__ctR465.loadForYou(force);",'r461 foryou load');
inject('function paintFY461(){',"if(window.__ctR465?.paintForYou)return window.__ctR465.paintForYou();",'r461 foryou paint');

// r464 uses generic names, so target only the r464 runtime segment.
injectAfter("window.__ctR464Marker='discover-foryou-visible-owner-v421'",'async function load(force=false){',"if(window.__ctR465?.loadForYou)return window.__ctR465.loadForYou(force);",'r464 foryou load');
injectAfter("window.__ctR464Marker='discover-foryou-visible-owner-v421'",'function render(){',"if(window.__ctR465?.paintForYou)return window.__ctR465.paintForYou();",'r464 foryou render');

js+='\n'+runtime+'\n';
html=html.replaceAll('app-v464.js','app-v465.js').replaceAll('app-v464.css','app-v465.css').replaceAll('v1.0.254','v1.0.255').replaceAll('r464-official-1.0.254','r465-official-1.0.255');
sw=sw.replaceAll('app-v464.js','app-v465.js').replaceAll('app-v464.css','app-v465.css').replaceAll('ct-web-1.0.254-r464','ct-web-1.0.255-r465');
const release=JSON.parse(releaseRaw);Object.assign(release,{
 version:'1.0.255',revision:'r465-official-1.0.255',base:'r464+real-device-owner-convergence',
 scope:'home-series+home-movies+discover-foryou+profile-lists+daily-history-undo',
 home_series:'r465 waits for auth, calls the current r388 Home renderer whose RPC was upgraded to v452, then paints/settles Series',
 home_movies:'all live legacy entrypoints converge to r465; r465 waits for auth and invokes the r461 v405 pager directly',
 discover_foryou:'all live r456/r457/r458/r460/r461/r464 loaders converge to the r465 visible-host renderer over six v421 pools',
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
 'cinetracker_unmark_history_item_v426','cinetracker_unmark_sport_history_v426','data-ct465-fy-action="swap"','data-ct465-undo="1"',
 "async function loadFY456(force=false){if(window.__ctR465?.loadForYou)",
 "function enterMovies460(){if(window.__ctR465?.enterHome)",
 "function enterSeries461(){if(window.__ctR465?.enterHome)"
])if(!js.includes(need))throw new Error('r465 missing '+need);
for(const bad of ['window.location.reload(','router.refresh(','while(true)','new MutationObserver','setInterval('])if(runtime.includes(bad))throw new Error('r465 forbidden '+bad);
console.log('WEB_R465_READY');
