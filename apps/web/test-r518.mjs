import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
await import('./build-r518.mjs');
const [js,css,html,releaseRaw,rootPkgRaw,webPkgRaw]=await Promise.all([
 readFile(resolve('dist/app-v518.js'),'utf8'),readFile(resolve('dist/app-v518.css'),'utf8'),readFile(resolve('dist/index.html'),'utf8'),
 readFile(resolve('dist/release.json'),'utf8'),readFile(resolve('../../package.json'),'utf8'),readFile(resolve('package.json'),'utf8')
]);
const ok=(v,m)=>{if(!v)throw new Error('r518 regression: '+m)},release=JSON.parse(releaseRaw),rootPkg=JSON.parse(rootPkgRaw),webPkg=JSON.parse(webPkgRaw);
ok(rootPkg.version==='0.3.45'&&webPkg.version==='0.3.45','versions');
ok(release.version==='0.3.45'&&release.revision==='r518-official-0.3.45','release');
ok(html.includes('app-v518.js')&&html.includes('app-v518.css'),'assets');
ok(js.includes("window.__ctR518Marker='canonical-f1-ufc-counts+daily-movie-items+related-actions-fit'"),'marker');
ok(js.includes("rpc('cinetracker_ufc_series_v518'"),'UFC v518 owner');
ok(js.includes('cinetracker_activity_items_by_day_v518'),'daily detail v518');
ok(!js.includes('cinetracker_activity_items_by_day_v426')&&!js.includes('cinetracker_activity_items_by_day_v475'),'legacy daily detail RPC retired');
ok(js.includes("core()?.rpc?.('cinetracker_special_series_progress_v518'"),'special summary v518');
ok(!js.includes("core()?.edge?.('ct-special-series-summary'"),'external denominator removed');
ok(js.includes("globalWatched.toLocaleString('pt-BR')+' '+unit+' assistidos no total"),'home global watched-only line');
ok(js.includes("'Série inteira: '+globalWatched.toLocaleString('pt-BR')+' '+unit+' assistidos"),'series-screen watched-only line');
ok(css.includes('.ct169-related-card{flex:0 0 176px!important')&&css.includes('grid-template-columns:minmax(0,1.3fr) minmax(0,.7fr)!important'),'related layout');
ok(css.includes('white-space:nowrap!important')&&css.includes('font-size:7.5px!important'),'related labels');
const tail=js.slice(js.lastIndexOf('/* CineTracker Web 0.3.45 r518'));
for(const bad of ['window.location.reload(','router.refresh(','while(true)','setInterval(','new MutationObserver'])ok(!tail.includes(bad),'forbidden '+bad);
console.log('WEB_R518_REGRESSION_OK');
