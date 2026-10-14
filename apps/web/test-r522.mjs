import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
await import('./build-r522.mjs');
const [js,css,html,r,pr,pw,...own]=await Promise.all([
 readFile(resolve('dist/app-v522.js'),'utf8'),readFile(resolve('dist/app-v522.css'),'utf8'),readFile(resolve('dist/index.html'),'utf8'),
 readFile(resolve('dist/release.json'),'utf8'),readFile(resolve('../../package.json'),'utf8'),readFile(resolve('package.json'),'utf8'),
 ...['runtime-r522-sports-only.js','runtime-r522-special-open.js','runtime-r522-final.js'].map(x=>readFile(resolve(x),'utf8'))
]);
const ok=(v,m)=>{if(!v)throw new Error('r522 '+m)},rel=JSON.parse(r);
ok(JSON.parse(pr).version==='0.3.49'&&JSON.parse(pw).version==='0.3.49','version');
ok(rel.revision==='r522-official-0.3.49','release');
ok(html.includes('app-v522.js')&&html.includes('app-v522.css'),'assets');
for(const s of[
 "window.__ctR522SportsMarker='sports-only-no-home-interception'",
 "window.__ctR522SpecialOpenMarker='pointerup-owner-f1-ufc-wwe'",
 "window.__ctR522Marker='home-r518-restored+three-special-open+sports-preserved'",
 "window.__ctR521HomeRetired='r522-native-home-restored'"
])ok(js.includes(s),s);
ok(!js.includes("window.__ctR520HomeSportsMarker='sticky-search+tabs+deterministic-movies+team-last5+league-latest-round'"),'r520 Home owner removed');
ok(!js.includes("window.__ctR521HomeSportsMarker='same-row-search+tabs+no-click-leak+sports-r520-preserved'"),'r521 Home owner removed');
ok(css.includes('.search-global{position:relative!important')&&css.includes('.home-tabs{position:static!important'),'Home CSS restored');
for(const rpc of ['cinetracker_f1_series_v512','cinetracker_ufc_series_v518','cinetracker_wwe_ppv_series_v519'])ok(js.includes(rpc),rpc);
const x=own.join('\n');for(const bad of['window.location.reload(','router.refresh(','while(true)','setInterval(','new MutationObserver'])ok(!x.includes(bad),bad);
console.log('WEB_R522_REGRESSION_OK');
