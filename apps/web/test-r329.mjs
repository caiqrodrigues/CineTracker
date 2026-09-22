import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
if(process.env.CT_R329_SKIP_BUILD!=='1')await import('./build-r329.mjs');
const [js,html,rRaw]=await Promise.all([
 readFile(resolve('dist/app-v329.js'),'utf8'),
 readFile(resolve('dist/index.html'),'utf8'),
 readFile(resolve('dist/release.json'),'utf8')
]);
const r=JSON.parse(rRaw),ok=(v,m)=>{if(!v)throw new Error('R329_STATIC '+m)};
ok(r.version==='1.0.120'&&r.revision==='r329-official-1.0.120','identity');
ok(html.includes('app-v329.js')&&html.includes('app-v329.css'),'assets');
ok(js.includes("window.__ctR329Marker='discover-fixed-card-rail+one-line-actions+no-page-overflow'"),'r329 marker');
ok(js.includes("window.__ctR328.paintForYou=paintForYou329"),'r328 loader hook not replaced');
ok(js.includes("data-ct328-foryou data-ct329-foryou"),'r328 observer compatibility marker missing');
ok(js.includes("--ct329-card-w:154px"),'mobile standard card width missing');
ok(js.includes("@media(min-width:1100px){[data-ct329-foryou]{--ct329-card-w:176px}"),'desktop standard card width missing');
ok(js.includes("flex-flow:row nowrap!important"),'nowrap rail/action contract missing');
ok(js.includes("ct329-swapbtn")&&!js.includes('class="chip ct329-action swap"'),'generic swap class leaked');
ok(js.includes("position:static!important;inset:auto!important"),'button position reset missing');
ok(js.includes("discover_foryou_overflow")===false,'release metadata should not be in runtime source assertion');
ok(js.includes("rpc('cinetracker_discover_filter_v326'"),'strict v326 authority lost');
ok(js.includes("window.__ctR325Marker='home-history-authority+watch-state-v2+live-tv-refresh+new-episode'"),'episode sync lost');
ok(r.scope==='discover-visual-geometry-only+strict-rules-preserved','scope');
ok(r.discover_foryou_renderer==='r329-fixed-card-horizontal-rails','ForYou renderer release');
ok(r.discover_foryou_actions==='unique-classes-single-row-no-wrap','action release');
ok(r.discover_foryou_cards==='154-mobile+176-desktop+2x3','card size release');
ok(r.discover_foryou_overflow==='rail-only-no-document-horizontal-scroll','overflow release');
ok(r.discover_public_cards==='154-mobile+176-desktop+rail-only','public card release');
ok(r.discover_filter_authority==='cinetracker_discover_filter_v326','rules authority changed');
ok(r.home_changes==='none-r329'&&r.profile_changes==='none-r329','non-Discover scope changed');
ok(r.episode_sync==='r325-preserved','episode sync changed');
ok(r.android==='1.0.20/10062','Android changed');
console.log('R329_STATIC_OK');
