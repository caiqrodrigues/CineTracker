import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
await import('./build-r538.mjs');
const [js,html,releaseRaw,rootPkgRaw,webPkgRaw,migration,edge,build]=await Promise.all([
 readFile(resolve('dist/app-v538.js'),'utf8'),
 readFile(resolve('dist/index.html'),'utf8'),
 readFile(resolve('dist/release.json'),'utf8'),
 readFile(resolve('../../package.json'),'utf8'),
 readFile(resolve('package.json'),'utf8'),
 readFile(resolve('../../supabase/migrations/20261016154500_r538_counts_only_naruto_ufc_wwe_f1.sql'),'utf8'),
 readFile(resolve('../../supabase/functions/ct-special-series-summary/index.ts'),'utf8'),
 readFile(resolve('build-r538.mjs'),'utf8')
]);
const release=JSON.parse(releaseRaw),rootPkg=JSON.parse(rootPkgRaw),webPkg=JSON.parse(webPkgRaw),yes=(v,m)=>{if(!v)throw new Error('r538 regression: '+m)};
yes(rootPkg.version==='0.3.65'&&webPkg.version==='0.3.65','versions');
yes(release.version==='0.3.65'&&release.revision==='r538-official-0.3.65','release');
yes(html.includes('app-v538.js')&&html.includes('app-v538.css'),'assets');
yes(js.includes("window.__ctR538SummaryMarker='stable-counts-v538+public-growth'"),'active summary marker');
yes(js.includes("window.__ctR538Marker='counts-only+naruto-shippuuden-500+f1-1166+ufc-793+wwe-567'"),'release marker');
yes(!js.includes("window.__ctR521SummaryMarker='authoritative-persistent-no-partial-denominator'"),'old summary owner removed');
yes(js.includes('cinetracker_special_series_counts_v538'),'v538 fallback rpc');
yes(js.includes("sessionKey='ct538:special-summary'"),'old summary cache invalidated');
for(const [n,label] of [[1166,'F1'],[793,'UFC'],[567,'WWE']])yes(js.includes(label.toLowerCase()+':'+n)||js.includes(label==='F1'?'f1:'+n:label==='UFC'?'ufc:'+n:'wwe:'+n),label+' floor');
yes(!build.includes("css+='")&&!build.includes("css = css"),'CSS unchanged by r538');
yes(migration.includes("where id=2929 and title='Naruto Shippuuden'")&&migration.includes('total_episodes=500'),'Shippuuden 500');
yes(migration.includes('total_episodes=1166')&&migration.includes('total_episodes=793')&&migration.includes('total_episodes=567'),'special totals');
yes(edge.includes('cinetracker_special_series_counts_v538'),'edge uses v538');
const tail=js.slice(js.lastIndexOf('/* CineTracker Web 0.3.65 r538'));
for(const bad of ['window.location.reload(','router.refresh(','while(true)','setInterval('])yes(!tail.includes(bad),'forbidden '+bad);
console.log('WEB_R538_REGRESSION_OK counts-only');
