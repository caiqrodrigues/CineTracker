import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
await import('./build-r508.mjs');
const [js,css,html,releaseRaw,rootPkgRaw,webPkgRaw]=await Promise.all([
 readFile(resolve('dist/app-v508.js'),'utf8'),readFile(resolve('dist/app-v508.css'),'utf8'),readFile(resolve('dist/index.html'),'utf8'),
 readFile(resolve('dist/release.json'),'utf8'),readFile(resolve('../../package.json'),'utf8'),readFile(resolve('package.json'),'utf8')
]);
const ok=(v,m)=>{if(!v)throw new Error('r508 regression: '+m)},release=JSON.parse(releaseRaw),rootPkg=JSON.parse(rootPkgRaw),webPkg=JSON.parse(webPkgRaw);
ok(rootPkg.version==='0.3.35'&&webPkg.version==='0.3.35','versions');
ok(release.version==='0.3.35'&&release.revision==='r508-official-0.3.35','release');
ok(html.includes('app-v508.js?ct=r508-official-0.3.35')&&html.includes('app-v508.css?ct=r508-official-0.3.35'),'assets');
ok(js.includes("window.__ctR508Marker='home-movies-history-actually-offscreen+watchlist-one-row-176x264+scope-home-movies-only'"),'marker');
ok(js.includes('__ctR508MovieAnchorFrames=18')&&js.includes("Math.max(12,Number(window.__ctR508MovieAnchorFrames||0))"),'bounded movie anchor lock');
ok(css.includes('flex-flow:row nowrap!important')&&css.includes('overflow-x:auto!important'),'one-row rail');
ok(css.includes('width:176px!important')&&css.includes('height:264px!important'),'desktop 176x264');
ok(css.includes('width:154px!important')&&css.includes('height:231px!important'),'mobile 154x231');
ok(js.includes('cinetracker_home_movies_v405'),'v405 preserved');
ok(js.includes('topEligible500')&&js.includes('cinetracker_foryou_payload_v498')&&js.includes('cinetracker_profile_screen_v495'),'other owners preserved');
const at=js.lastIndexOf("window.__ctR508Marker="),tail=js.slice(at);
for(const bad of ['window.location.reload(','router.refresh(','while(true)','setInterval(','new MutationObserver'])ok(!tail.includes(bad),'forbidden '+bad);
console.log('WEB_R508_REGRESSION_OK');
