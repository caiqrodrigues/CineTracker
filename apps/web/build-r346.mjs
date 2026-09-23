import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r345.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v345.js'),'utf8'),
 readFile(resolve(dist,'app-v345.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'runtime-r346-layout-rollback-discover-clean.js'),'utf8')
]);
const must=(s,x)=>{if(!s.includes(x))throw new Error('r346 missing '+x)};
const once=(s,a,b,l)=>{const n=s.split(a).length-1;if(n!==1)throw new Error('r346 expected one '+l+', found '+n);return s.replace(a,b)};
const range=(s,start,end,next,l)=>{const a=s.indexOf(start),b=s.indexOf(end,a+start.length);if(a<0||b<0||b<=a)throw new Error('r346 range '+l+' missing');return s.slice(0,a)+next+'\n'+s.slice(b)};

for(const x of[
 "window.__ctWebBuild='1.0.136';window.__ctOfficialVersion='1.0.136';",
 "const REVISION='r345-official-1.0.136';",
 "const version='1.0.136',revision='r345-official-1.0.136';",
 "window.__ctR345Marker='foryou-grid-actions+icon-back-in-search-row+filters-removed'",
 "function syncHeader345(){",
 "function ct169InjectBack(){",
 "function shell318(){",
 "function filters336(){",
 "function applyForYouFilter336(){",
 "boot();"
])must(js,x);
for(const x of[
 "window.__ctR346Marker='restore-content-layout+dedicated-search-row+filters-source-removed'",
 "ct346-search-row",
 "restoreContent346",
 "normalizeDiscover346"
])must(runtime,x);

/* r345/r169 may never treat .content as a search row again. */
js=range(js,"function syncHeader345(){","if(window.__ctR344)window.__ctR344.decorateForYou=normalizeForYou345;","function syncHeader345(){return false;}",'retire r345 header mutation');
js=range(js,"function ct169InjectBack(){","const ct169SetAppBase=setApp;","function ct169InjectBack(){return false;}",'retire r169 back injector');

/* Remove filter controls at their source renderers, not after paint. */
js=js.replace(
 '   <button type="button" class="ct288-filter-btn" data-ct318-filter aria-label="Filtrar" aria-expanded="${state.filterOpen?\'true\':\'false\'}">☷<i></i></button>\n',
 ''
);
js=js.replace(
 '  <div class="filters ct288-types ct318-types" data-ct318-types hidden></div>\n',
 ''
);
js=range(js,"function filters336(){","function paintForYou336(){","function filters336(){return\'\'}\nfunction paintForYou336(){",'remove r336 filters');
js=once(js,
 " const st=window.__ctR319Test?.state,kind=['movie','series','anime'].includes(String(st?.fyKind))?String(st.fyKind):'all';\n root.dataset.ct336Filter=kind;let visible=0;",
 " const st=window.__ctR319Test?.state;if(st)st.fyKind='all';const kind='all';\n root.dataset.ct336Filter=kind;let visible=0;",
 'force r336 all'
);

js=once(js,"window.__ctWebBuild='1.0.136';window.__ctOfficialVersion='1.0.136';","window.__ctWebBuild='1.0.137';window.__ctOfficialVersion='1.0.137';",'web version');
js=once(js,"const REVISION='r345-official-1.0.136';","const REVISION='r346-official-1.0.137';",'revision');
js=once(js,"const version='1.0.136',revision='r345-official-1.0.136';","const version='1.0.137',revision='r346-official-1.0.137';",'footer identity');
js=once(js,'boot();',runtime+'\nboot();','runtime insertion');

html=html.replaceAll('app-v345.js','app-v346.js').replaceAll('app-v345.css','app-v346.css').replaceAll('v1.0.136','v1.0.137').replaceAll('r345-official-1.0.136','r346-official-1.0.137');
sw=sw.replaceAll('ct-web-1.0.136-r345','ct-web-1.0.137-r346').replaceAll('app-v345.js','app-v346.js').replaceAll('app-v345.css','app-v346.css');
css+='\n/* CineTracker Web 1.0.137 r346 — restore content layout, dedicated search/back row, source-removed Discover filters. */\n';

const prev=JSON.parse(releaseRaw),release={
 ...prev,
 version:'1.0.137',revision:'r346-official-1.0.137',base:'r345-production',
 scope:'rollback-broken-content-grid+dedicated-search-row+source-remove-discover-filters',
 page_layout:'content-normal-flow-restored',
 navigation_back:'dedicated-search-row-icon-only',
 discover_filters:'r318+r336-source-removed',
 discover_foryou_filters:'removed-at-renderer+forced-all',
 discover_foryou_actions:'r345-poster-width-stable-grid-preserved',
 discover_top10_geometry:'desktop-ten-equal-columns-visible-in-viewport',
 home_startup:'fresh-payload+history+live-reconcile+metadata-hydrate-before-reveal',
 sports_startup:'every-open-warm+force-provider-sync+auth-retry+refresh-payload',
 android:'1.0.20/10062'
};
if(release.android!=='1.0.20/10062')throw new Error('r346 Android baseline changed');
await Promise.all([
 writeFile(resolve(dist,'app-v346.js'),js),writeFile(resolve(dist,'app-v346.css'),css),writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v345.js'),{force:true}),rm(resolve(dist,'app-v345.css'),{force:true})]);
console.log('WEB_R346_READY content layout restored; search/back isolated; Discover filters removed at source');
