import {readFile,writeFile,rm} from 'node:fs/promises';import {resolve,dirname} from 'node:path';import {fileURLToPath} from 'node:url';
await import('./build-r375.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v375.js'),'utf8'),readFile(resolve(dist,'app-v375.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(dist,'release.json'),'utf8'),readFile(resolve(root,'runtime-r376-home-watchlist-foryou-final.js'),'utf8')
]);
const once=(s,a,b,l)=>{const n=s.split(a).length-1;if(n!==1)throw new Error('r376 expected one '+l+', found '+n);return s.replace(a,b)};
const maybe=(s,a,b)=>s.includes(a)?s.replace(a,b):s;

/* r373 must not repaint/rebuild the Home list after r376 takes ownership. */
js=maybe(js,"function afterHomePaint(){if(routeNow()==='home')queueMicrotask(()=>void hydrate(false))}","function afterHomePaint(){return false/* r376 owner */}");
js=maybe(js,"window.addEventListener('cinetracker:data-changed',()=>{invalidate();if(routeNow()==='home')void hydrate(true)});","window.addEventListener('cinetracker:data-changed',()=>{});");
js=maybe(js,"setTimeout(()=>{if(routeNow()==='home')void hydrate(false)},0);","setTimeout(()=>void 0,0);");

/* r367/r372 delayed writers are retired; r376 repairs only the clicked/painted slot. */
js=maybe(js,"for(const ms of [0,50,200,800])setTimeout(ensureAll,ms);","/* r376 retires r367 delayed action writers */");
js=maybe(js,"for(const ms of [0,50,250,900,1800])setTimeout(()=>{layoutAll();if(ms===0)void ensureFreshValidated(true)},ms);","/* r376 retires r372 delayed layout/fresh writers */");

js=once(js,"window.__ctWebBuild='1.0.166';window.__ctOfficialVersion='1.0.166';","window.__ctWebBuild='1.0.167';window.__ctOfficialVersion='1.0.167';",'version');
js=once(js,"const REVISION='r375-official-1.0.166';","const REVISION='r376-official-1.0.167';",'revision');
js=once(js,"const version='1.0.166',revision='r375-official-1.0.166';","const version='1.0.167',revision='r376-official-1.0.167';",'footer');
js=once(js,'boot();',runtime+'\nboot();','runtime');
html=html.replaceAll('app-v375.js','app-v376.js').replaceAll('app-v375.css','app-v376.css').replaceAll('v1.0.166','v1.0.167').replaceAll('r375-official-1.0.166','r376-official-1.0.167');
sw=sw.replaceAll('ct-web-1.0.166-r375','ct-web-1.0.167-r376').replaceAll('app-v375.js','app-v376.js').replaceAll('app-v375.css','app-v376.css');
css+='\n/* CineTracker Web 1.0.167 r376 — complete media-id Watchlist + final Pra Voce owner. */\n';
const prev=JSON.parse(releaseRaw),release={...prev,version:'1.0.167',revision:'r376-official-1.0.167',base:'r375-production',scope:'home-watchlist-media-id+foryou-final-owner',home_watchlist_rpc:'cinetracker_watchlist_full_v376',home_watchlist_identity:'media_id-no-tmdb-dedupe',home_watchlist_sort:'same-dom-nodes-six-orders-no-navigation',home_watchlist_render:'progressive-all-items-no-manual-cap',discover_foryou_owner:'r376-single-final-actions',discover_fresh:'strict-seen-watch+tmdb-fallback-never-hidden',discover_foryou_legacy_writers:'r367+r372-delayed-retired',android:'1.0.20/10062'};
await Promise.all([
 writeFile(resolve(dist,'app-v376.js'),js),writeFile(resolve(dist,'app-v376.css'),css),writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v375.js'),{force:true}),rm(resolve(dist,'app-v375.css'),{force:true})]);
console.log('WEB_R376_READY media-id Watchlist + stable sort + final Pra Voce/fresh owner');