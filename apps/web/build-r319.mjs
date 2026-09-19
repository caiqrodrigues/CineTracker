import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r318.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v318.js'),'utf8'),
 readFile(resolve(dist,'app-v318.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'runtime-r319-discover-canonical-blocklist.js'),'utf8')
]);
const must=(s,x)=>{if(!s.includes(x))throw new Error('r319 missing '+x)};
const once=(s,a,b,l)=>{const n=s.split(a).length-1;if(n!==1)throw new Error('r319 expected one '+l+', found '+n);return s.replace(a,b)};
for(const x of[
 "window.__ctWebBuild='1.0.109';window.__ctOfficialVersion='1.0.109';",
 "const REVISION='r318-official-1.0.109';",
 "const version='1.0.109',revision='r318-official-1.0.109';",
 "window.__ctR318='discover-foryou-filters+strict-all-public+strict-top10'",
 "\nboot();"
])must(js,x);
for(const x of[
 "window.__ctR319='discover-canonical-blocklist+fail-closed+fresh-every-tab'",
 "cinetracker_discover_blocked_v319",
 "if(!p?.ready)return[]",
 "personal319(true)",
 "STRICT=new Set(['trending','popular','new','releases','anticipated','top'])"
])must(runtime,x);

const early=`(()=>{if(window.__ctR319EarlyCapture)return;window.__ctR319EarlyCapture=true;window.addEventListener('click',e=>{try{const fn=window.__ctR319EarlyHandle;if(typeof fn!=='function')return;if(fn(e.target,e)){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation()}}catch{}},true)})();`;
js=once(js,"window.__ctWebBuild='1.0.109';window.__ctOfficialVersion='1.0.109';","window.__ctWebBuild='1.0.110';window.__ctOfficialVersion='1.0.110';",'web version');
js=once(js,"const REVISION='r318-official-1.0.109';","const REVISION='r319-official-1.0.110';",'revision');
js=once(js,"const version='1.0.109',revision='r318-official-1.0.109';","const version='1.0.110',revision='r319-official-1.0.110';",'footer identity');
js=once(js,'\nboot();','\n'+runtime+'\nboot();','runtime insertion');
js=early+'\n'+js;

html=html.replaceAll('app-v318.js','app-v319.js').replaceAll('app-v318.css','app-v319.css').replaceAll('v1.0.109','v1.0.110').replaceAll('r318-official-1.0.109','r319-official-1.0.110');
sw=sw.replaceAll('ct-web-1.0.109-r318','ct-web-1.0.110-r319').replaceAll('app-v318.js','app-v319.js').replaceAll('app-v318.css','app-v319.css');
css+='\n/* CineTracker Web 1.0.110 r319 — canonical Discover exclusions, fail-closed. */\n';

const prev=JSON.parse(releaseRaw),release={
 ...prev,
 version:'1.0.110',
 revision:'r319-official-1.0.110',
 base:'r318-production',
 scope:'discover-only-canonical-personal-blocklist',
 discover_personal_authority:'cinetracker_discover_blocked_v319',
 discover_public_exclusion:'canonical-tmdb-seen+watchlist+progress+up-to-date+not-interested-before-html',
 discover_public_fail_mode:'fail-closed-no-personal-list-no-results',
 discover_personal_refresh:'every-public-tab-load+top10',
 discover_top10:'providers+series+movies+canonical-personal-exclusion',
 discover_calendar:'watchlist-exception-preserved',
 android:'1.0.20/10062'
};
if(release.android!=='1.0.20/10062')throw new Error('r319 Android baseline changed');

await Promise.all([
 writeFile(resolve(dist,'app-v319.js'),js),
 writeFile(resolve(dist,'app-v319.css'),css),
 writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),
 writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v318.js'),{force:true}),rm(resolve(dist,'app-v318.css'),{force:true})]);
console.log('WEB_R319_READY canonical Discover blocklist + fail-closed');
