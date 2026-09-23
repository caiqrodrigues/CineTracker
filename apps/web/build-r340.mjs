import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r339.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v339.js'),'utf8'),
 readFile(resolve(dist,'app-v339.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'runtime-r340-sports-discover-actions.js'),'utf8')
]);
const must=(s,x)=>{if(!s.includes(x))throw new Error('r340 missing '+x)};
const once=(s,a,b,l)=>{const n=s.split(a).length-1;if(n!==1)throw new Error('r340 expected one '+l+', found '+n);return s.replace(a,b)};
for(const x of[
 "window.__ctWebBuild='1.0.130';window.__ctOfficialVersion='1.0.130';",
 "const REVISION='r339-official-1.0.130';",
 "const version='1.0.130',revision='r339-official-1.0.130';",
 "window.__ctR339Marker='discover-actions-exact-card-width-mobile-no-overlap'",
 "setTimeout(()=>{if(routeNow()==='sports')void warmSports333()},300);",
 "boot();"
])must(js,x);
for(const x of[
 "window.__ctR340Marker='sports-every-open-auth-retry+discover-all-tabs-exact-card-width'",
 "force:true",
 "const ACTION_ROWS_340='.ct336-actions,.ct329-actions,.ct328-actions,.ct309-actions,.ct319-actions'",
 "MutationObserver",
 "flex','1 1 0px'"
])must(runtime,x);

/* Retire r334's route-only sports kickoff; r340 owns every-open background synchronization. */
js=once(js,"setTimeout(()=>{if(routeNow()==='sports')void warmSports333()},300);","setTimeout(()=>{},300);",'retire route-only sports startup');
js=once(js,"window.__ctWebBuild='1.0.130';window.__ctOfficialVersion='1.0.130';","window.__ctWebBuild='1.0.131';window.__ctOfficialVersion='1.0.131';",'web version');
js=once(js,"const REVISION='r339-official-1.0.130';","const REVISION='r340-official-1.0.131';",'revision');
js=once(js,"const version='1.0.130',revision='r339-official-1.0.130';","const version='1.0.131',revision='r340-official-1.0.131';",'footer identity');
js=once(js,'boot();',runtime+'\nboot();','runtime insertion');

html=html.replaceAll('app-v339.js','app-v340.js').replaceAll('app-v339.css','app-v340.css').replaceAll('v1.0.130','v1.0.131').replaceAll('r339-official-1.0.130','r340-official-1.0.131');
sw=sw.replaceAll('ct-web-1.0.130-r339','ct-web-1.0.131-r340').replaceAll('app-v339.js','app-v340.js').replaceAll('app-v339.css','app-v340.css');
css+='\n/* CineTracker Web 1.0.131 r340 — Sports every-open sync + exact action width across all Discover tabs. */\n';

const prev=JSON.parse(releaseRaw),release={
 ...prev,
 version:'1.0.131',revision:'r340-official-1.0.131',base:'r339-production',
 scope:'sports-every-open-background-refresh+discover-all-tabs-card-width-actions',
 sports_startup:'every-open-warm+force-provider-sync+auth-retry+refresh-payload',
 sports_sync_window:'previous-3-days+today-next-2-days',
 discover_all_tabs_actions:'measured-card-width+equal-flex+nowrap+no-overflow+no-slack',
 discover_foryou_layout:'r340-all-discover-actions-exact-card-width',
 discover_foryou_action_geometry:'measured-card-width+equal-flex-buttons+no-wrap+no-overlap+no-slack',
 android:'1.0.20/10062'
};
if(release.android!=='1.0.20/10062')throw new Error('r340 Android baseline changed');
await Promise.all([
 writeFile(resolve(dist,'app-v340.js'),js),writeFile(resolve(dist,'app-v340.css'),css),writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v339.js'),{force:true}),rm(resolve(dist,'app-v339.css'),{force:true})]);
console.log('WEB_R340_READY Sports syncs every open in background; all Discover action rows exactly match card width');
