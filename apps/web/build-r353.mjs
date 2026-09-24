import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r352.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v352.js'),'utf8'),
 readFile(resolve(dist,'app-v352.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'runtime-r353-smart-watchlist.js'),'utf8')
]);
const once=(s,a,b,l)=>{const n=s.split(a).length-1;if(n!==1)throw new Error('r353 expected one '+l+', found '+n);return s.replace(a,b)};
for(const x of[
 "window.__ctWebBuild='1.0.143';window.__ctOfficialVersion='1.0.143';",
 "const REVISION='r352-official-1.0.143';",
 "const version='1.0.143',revision='r352-official-1.0.143';",
 "let draft=composeForYou(hydratedWatch,freshRows,a);",
 "next.watchIndex[kind]=0;",
 "next[bucket+'Index'][kind]=(normalizeIndex352(next[bucket+'Index'][kind],pool.length)+1)%pool.length;",
 "next[bucket+'Index'][kind]=(normalizeIndex350(next[bucket+'Index'][kind],pool.length)+1)%pool.length;",
 "boot();"
])if(!js.includes(x))throw new Error('r353 missing '+x);

js=once(js,
 "let draft=composeForYou(hydratedWatch,freshRows,a);",
 "let draft=composeForYou(hydratedWatch,freshRows,a);draft=window.__ctR353PrepareWatchState?.(draft,a)||draft;",
 'initial smart prepare'
);
js=once(js,
 "freshRows=dedupeVisual([...freshRows,...extra]).filter(x=>strictFresh(x,a));draft=composeForYou(hydratedWatch,freshRows,a);",
 "freshRows=dedupeVisual([...freshRows,...extra]).filter(x=>strictFresh(x,a));draft=composeForYou(hydratedWatch,freshRows,a);draft=window.__ctR353PrepareWatchState?.(draft,a)||draft;",
 'extended smart prepare'
);
js=once(js,
 "next.watchIndex[kind]=0;",
 "next.watchIndex[kind]=window.__ctR353SmartWatchIndex?.(next.watchPools[kind],kind,-1,{record:true})??0;",
 'restored watchlist initial smart index'
);
js=once(js,
 "next[bucket+'Index'][kind]=(normalizeIndex352(next[bucket+'Index'][kind],pool.length)+1)%pool.length;",
 "next[bucket+'Index'][kind]=bucket==='watch'&&window.__ctR353SmartWatchIndex?window.__ctR353SmartWatchIndex(pool,kind,next[bucket+'Index'][kind],{record:true}):(normalizeIndex352(next[bucket+'Index'][kind],pool.length)+1)%pool.length;",
 'r352 smart watch swap'
);
js=once(js,
 "next[bucket+'Index'][kind]=(normalizeIndex350(next[bucket+'Index'][kind],pool.length)+1)%pool.length;",
 "next[bucket+'Index'][kind]=bucket==='watch'&&window.__ctR353SmartWatchIndex?window.__ctR353SmartWatchIndex(pool,kind,next[bucket+'Index'][kind],{record:true}):(normalizeIndex350(next[bucket+'Index'][kind],pool.length)+1)%pool.length;",
 'r350 fallback smart watch swap'
);

js=once(js,"window.__ctWebBuild='1.0.143';window.__ctOfficialVersion='1.0.143';","window.__ctWebBuild='1.0.144';window.__ctOfficialVersion='1.0.144';",'version');
js=once(js,"const REVISION='r352-official-1.0.143';","const REVISION='r353-official-1.0.144';",'revision');
js=once(js,"const version='1.0.143',revision='r352-official-1.0.143';","const version='1.0.144',revision='r353-official-1.0.144';",'footer');
js=once(js,'boot();',runtime+'\nboot();','runtime');

html=html.replaceAll('app-v352.js','app-v353.js').replaceAll('app-v352.css','app-v353.css').replaceAll('v1.0.143','v1.0.144').replaceAll('r352-official-1.0.143','r353-official-1.0.144');
sw=sw.replaceAll('ct-web-1.0.143-r352','ct-web-1.0.144-r353').replaceAll('app-v352.js','app-v353.js').replaceAll('app-v352.css','app-v353.css');
css+='\n/* CineTracker Web 1.0.144 r353 — smart weighted-random Watchlist recommendations. */\n';

const prev=JSON.parse(releaseRaw),release={
 ...prev,
 version:'1.0.144',revision:'r353-official-1.0.144',base:'r352-production',
 scope:'discover-foryou-watchlist-smart-random',
 discover_watchlist_selection:'weighted-random+history-affinity+watchlist-affinity+quality',
 discover_watchlist_order:'not-list-order+not-index-plus-one',
 discover_watchlist_repeat_memory:'session-recent-per-kind',
 discover_watchlist_initial:'smart-weighted-random',
 discover_watchlist_swap:'smart-weighted-random-same-kind',
 android:'1.0.20/10062'
};
if(release.android!=='1.0.20/10062')throw new Error('r353 Android baseline changed');
await Promise.all([
 writeFile(resolve(dist,'app-v353.js'),js),
 writeFile(resolve(dist,'app-v353.css'),css),
 writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),
 writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v352.js'),{force:true}),rm(resolve(dist,'app-v352.css'),{force:true})]);
console.log('WEB_R353_READY smart weighted-random Watchlist recommendations');
