import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r343.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v343.js'),'utf8'),
 readFile(resolve(dist,'app-v343.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'runtime-r344-foryou-meta-top10.js'),'utf8')
]);
const must=(s,x)=>{if(!s.includes(x))throw new Error('r344 missing '+x)};
const once=(s,a,b,l)=>{const n=s.split(a).length-1;if(n!==1)throw new Error('r344 expected one '+l+', found '+n);return s.replace(a,b)};

for(const x of[
 "window.__ctWebBuild='1.0.134';window.__ctOfficialVersion='1.0.134';",
 "const REVISION='r343-official-1.0.134';",
 "const version='1.0.134',revision='r343-official-1.0.134';",
 "window.__ctR343Marker='discover-final-dom-owner+home-enriched-before-first-paint'",
 "window.__ctR228bV122='all-discover-cards-year-genres'",
 "setInterval(sync,1200);sync();window.__ctV122MetadataSync=sync;window.__ctV122MetadataRun=run;window.__ctV122MetadataDecorate=decorate;",
 "host.dataset.ct336Owned='foryou';applyForYouFilter336();return true;",
 "boot();"
])must(js,x);
for(const x of[
 "window.__ctR344Marker='foryou-primary-genre+canonical-actions+top10-ten-up'",
 "primaryGenre344",
 "canonicalActions344",
 "grid-template-columns:repeat(10,minmax(0,1fr))"
])must(runtime,x);

/* Retire the legacy 1.2s metadata mutator that moved action buttons and injected up to 3 genres. */
js=once(js,
 "try{new MutationObserver(sync).observe(q('#app')||document.documentElement,{subtree:true,childList:true})}catch{}setInterval(sync,1200);sync();window.__ctV122MetadataSync=sync;window.__ctV122MetadataRun=run;window.__ctV122MetadataDecorate=decorate;",
 "window.__ctV122MetadataSync=()=>{};window.__ctV122MetadataRun=()=>{};window.__ctV122MetadataDecorate=()=>{};",
 'retire legacy metadata observer/interval'
);

/* Every canonical r336 paint is decorated synchronously before the browser gets a chance to paint it. */
js=once(js,
 "host.dataset.ct336Owned='foryou';applyForYouFilter336();return true;",
 "host.dataset.ct336Owned='foryou';applyForYouFilter336();window.__ctR344?.decorateForYou?.();return true;",
 'decorate canonical ForYou paint'
);

js=once(js,"window.__ctWebBuild='1.0.134';window.__ctOfficialVersion='1.0.134';","window.__ctWebBuild='1.0.135';window.__ctOfficialVersion='1.0.135';",'web version');
js=once(js,"const REVISION='r343-official-1.0.134';","const REVISION='r344-official-1.0.135';",'revision');
js=once(js,"const version='1.0.134',revision='r343-official-1.0.134';","const version='1.0.135',revision='r344-official-1.0.135';",'footer identity');
js=once(js,'boot();',runtime+'\nboot();','runtime insertion');

html=html.replaceAll('app-v343.js','app-v344.js').replaceAll('app-v343.css','app-v344.css').replaceAll('v1.0.134','v1.0.135').replaceAll('r343-official-1.0.134','r344-official-1.0.135');
sw=sw.replaceAll('ct-web-1.0.134-r343','ct-web-1.0.135-r344').replaceAll('app-v343.js','app-v344.js').replaceAll('app-v343.css','app-v344.css');
css+='\n/* CineTracker Web 1.0.135 r344 — primary genre inside Pra Você + canonical buttons + ten-up desktop Top 10. */\n';

const prev=JSON.parse(releaseRaw),release={
 ...prev,
 version:'1.0.135',revision:'r344-official-1.0.135',base:'r343-production',
 scope:'foryou-primary-genre-canonical-actions+top10-ten-visible',
 discover_foryou_metadata:'title+existing-meta+one-primary-genre-before-actions',
 discover_foryou_genres:'exactly-one-primary-genre',
 discover_foryou_actions:'canonical-r336-watchlist-seen-swap+swap-always-visible',
 discover_foryou_legacy_metadata:'r228b-observer+1200ms-interval-retired',
 discover_top10_geometry:'desktop-ten-equal-columns-visible-in-viewport',
 discover_action_authority:'r342-single-owner+r344-canonical-action-membership',
 home_startup:'fresh-payload+history+live-reconcile+metadata-hydrate-before-reveal',
 sports_startup:'every-open-warm+force-provider-sync+auth-retry+refresh-payload',
 android:'1.0.20/10062'
};
if(release.android!=='1.0.20/10062')throw new Error('r344 Android baseline changed');
await Promise.all([
 writeFile(resolve(dist,'app-v344.js'),js),writeFile(resolve(dist,'app-v344.css'),css),writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v343.js'),{force:true}),rm(resolve(dist,'app-v343.css'),{force:true})]);
console.log('WEB_R344_READY Pra Você one primary genre + canonical actions + desktop Top10 ten-up');
