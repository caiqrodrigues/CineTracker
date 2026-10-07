import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r493.mjs');

const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [js,css,sw,releaseRaw]=await Promise.all([
 readFile(resolve(dist,'app-v493.js'),'utf8'),
 readFile(resolve(dist,'app-v493.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8')
]);

js=js
 .replace(/const REVISION='[^']+';/,"const REVISION='r494-official-0.3.21';")
 .replace(/window\.__ctWebBuild='[^']*';/,"window.__ctWebBuild='0.3.21';")
 .replace(/CineTracker • v[^•<]+ • \$\{REVISION\}/g,'CineTracker • v0.3.21 • ${REVISION}');
js+="\nwindow.__ctR494Marker='clean-entrypoint+no-legacy-inline+modern-blue-shell';\n";

css+=`
/* CineTracker Web 0.3.21 r494 */
:root{--bg:#02080d!important;--panel:#07131b!important;--panel2:#091821!important;--line:#1f455b!important;--line2:#315f78!important;--text:#eef8fc!important;--muted:#7f9aaa!important;--accent:#58afe0!important;--gold:#58afe0!important}
html,body{background:#02080d!important;color:#eef8fc!important}
.logo,.eyebrow{color:#76c9ff!important}.gold{color:#eef8fc!important}
`;

sw=sw.replaceAll('r493','r494').replaceAll('app-v493.js','app-v494.js').replaceAll('app-v493.css','app-v494.css');

const html='<!doctype html><html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#02080d"><meta name="color-scheme" content="dark"><meta name="ct-revision" content="r494-official-0.3.21"><title>CineTracker</title><link rel="icon" href="/favicon.svg"><link rel="stylesheet" href="/app-v494.css?ct=r494-official-0.3.21"></head><body><div id="app"></div><script defer src="/app-v494.js?ct=r494-official-0.3.21"></script></body></html>';

const release=JSON.parse(releaseRaw);
Object.assign(release,{
 version:'0.3.21',revision:'r494-official-0.3.21',base:'r493+r494-clean-entrypoint',
 scope:'remove-legacy-inline-app+modern-blue-shell+preserve-r493-functional-authorities',
 entrypoint:'minimal external-only HTML; no legacy inline CSS/JS/application',
 visual:'modern blue CineTracker shell',
 home:'r493 progressive Home preserved',
 discover:'r493 Top10/Pra Você preserved',
 profile:'r493 split fast Profile preserved',
 f1:'preserved',sports:'preserved',history:'preserved',android:'unchanged-1.0.20/10062'
});

for(const bad of ['--gold:#d6b55b','MENU DIÁRIO','auth-page','cloud-bar','void bootstrap();']){
 if(html.includes(bad))throw new Error('r494 legacy entrypoint token '+bad);
}
if(/<style[\s>]/i.test(html))throw new Error('r494 inline style forbidden');
if(/<script(?![^>]*\bsrc=)[^>]*>/i.test(html))throw new Error('r494 inline script forbidden');

await Promise.all([
 writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'app-v494.js'),js),
 writeFile(resolve(dist,'app-v494.css'),css),
 writeFile(resolve(dist,'service-worker.js'),sw),
 writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v493.js'),{force:true}),rm(resolve(dist,'app-v493.css'),{force:true})]);
console.log('WEB_R494_READY clean-entrypoint modern-blue-shell');
