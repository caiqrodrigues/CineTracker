import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r334.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v334.js'),'utf8'),
 readFile(resolve(dist,'app-v334.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'runtime-r335-home-discover-final.js'),'utf8')
]);
const must=(s,x)=>{if(!s.includes(x))throw new Error('r335 missing '+x)};
const once=(s,a,b,l)=>{const n=s.split(a).length-1;if(n!==1)throw new Error('r335 expected one '+l+', found '+n);return s.replace(a,b)};
const range=(s,start,end,next,label)=>{
 const a=s.indexOf(start),b=s.indexOf(end,a+start.length);
 if(a<0||b<0||b<=a)throw new Error('r335 range '+label+' missing');
 return s.slice(0,a)+next+'\n'+s.slice(b);
};

for(const x of[
 "window.__ctWebBuild='1.0.125';window.__ctOfficialVersion='1.0.125';",
 "const REVISION='r334-official-1.0.125';",
 "const version='1.0.125',revision='r334-official-1.0.125';",
 "window.__ctR334Marker='home-fast-v334+single-anchor+discover-no-observer-loop+stable-foryou'",
 "cinetracker_home_payload_v334",
 "cinetracker_discover_filter_v333",
 "function armHome332(kind=activeHomeKind332()){",
 "function ensureDirectFilters333(){",
 "function ensureFilters334(){",
 "function scheduleHome334(kind){",
 "boot();"
])must(js,x);
for(const x of[
 "window.__ctR335Marker='home-single-anchor-tab-lock+discover-no-top-filters+foryou-final-r329'",
 "removeTopFilters335",
 "ensureSwapButton335",
 "top-filter-strip-removed"
])must(runtime,x);

/* Home: r335 owns the landing anchor. Retire the last two automatic scroll owners. */
js=range(js,
 "function armHome332(kind=activeHomeKind332()){",
 "document.addEventListener('click',e=>{",
 "function armHome332(kind=activeHomeKind332()){return false}",
 "r332 repeated anchor timers"
);
js=range(js,
 "function scheduleHome334(kind){",
 "try{\n const base=renderHome;",
 "function scheduleHome334(kind){return false}",
 "r334 anchor scheduler"
);

/* Discover: the temporary top filter strip is explicitly removed in r335.
   Neutralize closures that could recreate it after the final runtime hides it. */
const hide333=[
"function ensureDirectFilters333(){",
" const root=q('[data-ct319-discover]');if(!root)return false;",
" qa('[data-ct319-prev],[data-ct319-next],[data-ct319-filter]',root).forEach(x=>x.remove());",
" const types=q('[data-ct319-types]',root);",
" if(types){types.innerHTML='';types.hidden=true;types.classList.remove('open');types.dataset.ct335Removed='1'}",
" const st=window.__ctR319Test?.state;if(st)st.fyKind='all';",
" return true;",
"}"
].join('\n');
js=range(js,'function ensureDirectFilters333(){','function normalizeForYou333(){',hide333,'r333 top filters');

const hide334=[
"function ensureFilters334(){",
" const shell=q('[data-ct319-discover]');if(!shell)return false;",
" qa('[data-ct319-prev],[data-ct319-next],[data-ct319-filter]',shell).forEach(x=>x.remove());",
" const types=q('[data-ct319-types]',shell);",
" if(types){types.innerHTML='';types.hidden=true;types.classList.remove('open');types.dataset.ct335Removed='1'}",
" const st=window.__ctR319Test?.state;if(st)st.fyKind='all';",
" return true;",
"}"
].join('\n');
js=range(js,'function ensureFilters334(){','function normalizeActions334(){',hide334,'r334 top filters');

/* Final identity + r335 runtime. */
js=once(js,"window.__ctWebBuild='1.0.125';window.__ctOfficialVersion='1.0.125';","window.__ctWebBuild='1.0.126';window.__ctOfficialVersion='1.0.126';",'web version');
js=once(js,"const REVISION='r334-official-1.0.125';","const REVISION='r335-official-1.0.126';",'revision');
js=once(js,"const version='1.0.125',revision='r334-official-1.0.125';","const version='1.0.126',revision='r335-official-1.0.126';",'footer identity');
js=once(js,'boot();',runtime+'\nboot();','runtime insertion');

html=html.replaceAll('app-v334.js','app-v335.js').replaceAll('app-v334.css','app-v335.css').replaceAll('v1.0.125','v1.0.126').replaceAll('r334-official-1.0.125','r335-official-1.0.126');
sw=sw.replaceAll('ct-web-1.0.125-r334','ct-web-1.0.126-r335').replaceAll('app-v334.js','app-v335.js').replaceAll('app-v334.css','app-v335.css');
css+='\n/* CineTracker Web 1.0.126 r335 — one Home anchor + clean ForYou controls. */\n';

const prev=JSON.parse(releaseRaw),release={
 ...prev,
 version:'1.0.126',
 revision:'r335-official-1.0.126',
 base:'r334-unpromoted',
 scope:'home-single-anchor-tab-lock+discover-clean-foryou',
 home_payload:'cinetracker_home_payload_v334',
 home_series_logical_state:'v4-fast-indexed-dedup',
 home_history_behavior:'normal-flow-above-anchor+oldest-up+newest-near-anchor+no-button+no-inner-scroll',
 home_navigation:'r335-single-anchor+tab-lock+no-settle-loop',
 discover_filter_authority:'cinetracker_discover_filter_v333',
 discover_controls:'top-filter-strip-removed-pending-new-placement',
 discover_foryou_owner:'r329-after-v333-final-audit',
 discover_foryou_filters:'removed-from-top+all-state',
 discover_foryou_actions:'watchlist+seen+swap-three-compact-one-row',
 discover_observers:'legacy-late-observers-retired+r335-no-observer',
 discover_top10:'progressive-eight-pages-until-ten+v333-audit',
 discover_top10_seen:'v333-final-audit-blocks-history+play-events+progress',
 sports_startup:'only-when-sports-active',
 profile_watchlist_counts:'r324-preserved-exact',
 web_version_ui:'1.0.126+r335-official-1.0.126',
 f1_changes:'none-r335',
 android:'1.0.20/10062'
};
if(release.android!=='1.0.20/10062')throw new Error('r335 Android baseline changed');

await Promise.all([
 writeFile(resolve(dist,'app-v335.js'),js),
 writeFile(resolve(dist,'app-v335.css'),css),
 writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),
 writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v334.js'),{force:true}),rm(resolve(dist,'app-v334.css'),{force:true})]);
console.log('WEB_R335_READY single Home anchor + top filters removed + final r329 ForYou');
