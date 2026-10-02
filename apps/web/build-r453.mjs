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

const releaseCheckStart=js.indexOf("async function checkRelease161(");
const releaseCheckEnd=js.indexOf("\nasync function globalSearch(",releaseCheckStart);
if(releaseCheckStart<0||releaseCheckEnd<0)throw new Error('r453 legacy release checker block not found');

const releaseGuard=`async function checkRelease161(reason='manual'){return false}
window.__ctCheckRelease=checkRelease161;
window.__ctR453ReleaseGuard={version:'1.0.243',scope:'legacy-release-auto-reload-disabled',automatic:false};
`;
js=js.slice(0,releaseCheckStart)+releaseGuard+js.slice(releaseCheckEnd);

const marker=`
/* CineTracker Web 1.0.243 r453 — automatic release reload disabled, no other behavior changes. */
(()=>{'use strict';
if(window.__ctR453?.version==='1.0.243')return;
window.__ctR453={version:'1.0.243',scope:'automatic-refresh-only',releaseChecker:'manual-noop',pageReload:false};
window.__ctR453Marker='legacy-release-location-replace-disabled';
})();
`;
js+='\n'+marker+'\n';

html=html.replaceAll('app-v452.js','app-v453.js').replaceAll('app-v452.css','app-v453.css');
sw=sw.replaceAll('app-v452.js','app-v453.js').replaceAll('app-v452.css','app-v453.css').replaceAll('ct-web-1.0.242-r452','ct-web-1.0.243-r453');

const release=JSON.parse(releaseRaw);
Object.assign(release,{
 version:'1.0.243',
 revision:'r453-official-1.0.243',
 base:'r452+disable-legacy-release-auto-reload',
 scope:'automatic-refresh-only',
 automatic_release_reload:false,
 release_checker:'checkRelease161 retained as inert compatibility function',
 home:'unchanged-r452',
 discover:'unchanged-r452',
 profile:'unchanged-r452',
 sports:'unchanged-r452',
 f1:'unchanged-r452',
 android:'unchanged-1.0.20/10062'
});

await Promise.all([
 writeFile(resolve(dist,'app-v453.js'),js),
 writeFile(resolve(dist,'app-v453.css'),css),
 writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),
 writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([
 rm(resolve(dist,'app-v452.js'),{force:true}),
 rm(resolve(dist,'app-v452.css'),{force:true})
]);

for(const bad of [
 "u.searchParams.set('ct_refresh'",
 "location.replace(u.toString())",
 "checkRelease161('focus')",
 "checkRelease161('visible')",
 "checkRelease161('navigation')",
 "checkRelease161('interval')",
 "checkRelease161('boot')",
 'window.location.reload(',
 'router.refresh('
])if(js.includes(bad))throw new Error('r453 automatic refresh survived: '+bad);

for(const need of [
 "async function checkRelease161(reason='manual'){return false}",
 "window.__ctR453Marker='legacy-release-location-replace-disabled'",
 "window.__ctR452Marker='f1-current-season-home+series-to-sports-database-sync'",
 'cinetracker_home_series_v452'
])if(!js.includes(need))throw new Error('r453 missing '+need);

console.log('WEB_R453_READY');
