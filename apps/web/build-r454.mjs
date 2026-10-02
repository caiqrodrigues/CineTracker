import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r452.mjs');

const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v452.js'),'utf8'),
 readFile(resolve(dist,'app-v452.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8')
]);

const beforeLength=js.length;
if(!js.includes('async function checkRelease161('))throw new Error('r454 missing release checker');
if(!js.includes('async function globalSearch('))throw new Error('r454 missing globalSearch baseline');

for(const hook of [
 "checkRelease161('focus')",
 "checkRelease161('visible')",
 "checkRelease161('navigation')",
 "checkRelease161('interval')",
 "checkRelease161('boot')"
]) js=js.replaceAll(hook,'Promise.resolve(false)');

js=js.replaceAll(
 'location.replace(u.toString())',
 "history.replaceState(history.state,'',u.pathname+(u.search||'')+(u.hash||''))"
);

if(Math.abs(js.length-beforeLength)>4096)throw new Error('r454 destructive patch detected');

const marker=`
/* CineTracker Web 1.0.244 r454 — non-destructive boot recovery. */
(()=>{'use strict';
if(window.__ctR454?.version==='1.0.244')return;
window.__ctR454={
 version:'1.0.244',
 scope:'boot-black-screen-recovery',
 base:'r452',
 releasePatch:'non-destructive',
 automaticReleaseChecks:false,
 pageReload:false
};
window.__ctR454Marker='boot-recovered-preserve-runtime';
})();
`;
js+='\n'+marker+'\n';

html=html.replaceAll('app-v452.js','app-v454.js').replaceAll('app-v452.css','app-v454.css');
sw=sw.replaceAll('app-v452.js','app-v454.js').replaceAll('app-v452.css','app-v454.css').replaceAll('ct-web-1.0.242-r452','ct-web-1.0.244-r454');

const release=JSON.parse(releaseRaw);
Object.assign(release,{
 version:'1.0.244',
 revision:'r454-official-1.0.244',
 base:'r452+non-destructive-release-guard',
 scope:'boot-black-screen-recovery',
 automatic_release_checks:false,
 destructive_release_block_replacement:false,
 page_reload:false,
 home:'unchanged-r452',
 discover:'unchanged-r452',
 profile:'unchanged-r452',
 sports:'unchanged-r452',
 f1:'unchanged-r452',
 android:'unchanged-1.0.20/10062'
});

await Promise.all([
 writeFile(resolve(dist,'app-v454.js'),js),
 writeFile(resolve(dist,'app-v454.css'),css),
 writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),
 writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([
 rm(resolve(dist,'app-v452.js'),{force:true}),
 rm(resolve(dist,'app-v452.css'),{force:true})
]);

for(const bad of [
 "checkRelease161('focus')",
 "checkRelease161('visible')",
 "checkRelease161('navigation')",
 "checkRelease161('interval')",
 "checkRelease161('boot')",
 'location.replace(u.toString())',
 'window.location.reload(',
 'router.refresh('
])if(js.includes(bad))throw new Error('r454 forbidden '+bad);

for(const need of [
 'async function checkRelease161(',
 'async function globalSearch(',
 "window.__ctR454Marker='boot-recovered-preserve-runtime'",
 "window.__ctR452Marker='f1-current-season-home+series-to-sports-database-sync'",
 'cinetracker_home_series_v452'
])if(!js.includes(need))throw new Error('r454 missing '+need);

console.log('WEB_R454_READY');
