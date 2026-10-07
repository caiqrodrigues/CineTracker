import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';

await import('./build-r493.mjs');

const [js,html,releaseRaw,rootPkgRaw,webPkgRaw]=await Promise.all([
 readFile(resolve('dist/app-v493.js'),'utf8'),
 readFile(resolve('dist/index.html'),'utf8'),
 readFile(resolve('dist/release.json'),'utf8'),
 readFile(resolve('../../package.json'),'utf8'),
 readFile(resolve('package.json'),'utf8')
]);

const release=JSON.parse(releaseRaw),rootPkg=JSON.parse(rootPkgRaw),webPkg=JSON.parse(webPkgRaw);
const ok=(v,m)=>{if(!v)throw new Error(m)};

ok(rootPkg.version==='0.3.20','root version');
ok(webPkg.version==='0.3.20','web version');
ok(release.version==='0.3.20'&&release.revision==='r493-official-0.3.20','release');
ok(html.includes('app-v493.js')&&html.includes('app-v493.css'),'assets');
ok(js.includes("window.__ctR493Marker='direct-home-progressive+profile-split-fast+top10-progressive+foryou-snapshot+strict-12'"),'marker');
ok(js.includes("if(r==='home')return renderHome493(seq);"),'Home dispatch');
ok(js.includes("if(r==='profile')return renderProfile493(seq);"),'Profile dispatch');

const cs=js.indexOf('/* CT_R493_CORE_START */'),ce=js.indexOf('/* CT_R493_CORE_END */');
ok(cs>=0&&ce>cs,'r493 core');
const core=js.slice(cs,ce);
for(const rpc of [
 'cinetracker_home_series_v492','cinetracker_home_history_v391','cinetracker_home_movies_v405',
 'cinetracker_profile_summary_v489','cinetracker_profile_quick_stats_v1','cinetracker_profile_stats',
 'cinetracker_sports_stadium_summary_v296','cinetracker_activity_by_day_v320'
])ok(core.includes(rpc),'core '+rpc);

ok(!core.includes('cinetracker_profile_screen_v491'),'heavy profile RPC removed from r493');
ok(core.includes("ct493HomeKind='series'"),'Home starts series');
ok(core.includes("window.scrollTo({top:0,left:0,behavior:'auto'})"),'tab scroll reset');
ok(js.includes("function cancelPreviousHomeWork(){return{generation:0,signal:null}}"),'legacy home cancellation neutralized');
ok(js.includes("function preserveAfterPaint(){return true}"),'legacy home repaint neutralized');
ok(js.includes("const paint=paintTop321(state.topProvider,token,force)"),'Top10 provider list nonblocking');
ok(js.includes("page:1")&&js.includes("page:2"),'Top10 progressive pages');
ok(js.includes("ct493:foryou")&&js.includes("cinetracker_foryou_payload_v490")&&js.includes("fetchPool(g,k)"),'ForYou snapshot+fallback');
ok(js.includes('aspect-ratio:2/3!important')&&js.includes('object-fit:cover!important'),'2:3 geometry');
ok(js.includes('.ct491-profile-grid>.card:nth-child(n+13){display:none!important}'),'profile strict 12 guard');

const tail=js.slice(js.lastIndexOf('/* CineTracker Web 0.3.20 r493'));
for(const bad of ['window.location.reload(','router.refresh(','while(true)','setInterval(']){
 ok(!core.includes(bad)&&!tail.includes(bad),'forbidden '+bad);
}

console.log('WEB_R493_REGRESSION_OK');
