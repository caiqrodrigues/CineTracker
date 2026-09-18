import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
if(process.env.CT_R315_SKIP_BUILD!=='1')await import('./build-r315.mjs');
const [js,html,releaseRaw]=await Promise.all([
 readFile(resolve('dist/app-v315.js'),'utf8'),
 readFile(resolve('dist/index.html'),'utf8'),
 readFile(resolve('dist/release.json'),'utf8')
]);
const r=JSON.parse(releaseRaw),ok=(v,m)=>{if(!v)throw new Error('R315_STATIC '+m)};
ok(r.version==='1.0.106'&&r.revision==='r315-official-1.0.106','release identity');
ok(html.includes('app-v315.js')&&html.includes('app-v315.css'),'assets');
ok(js.includes("window.__ctWebBuild='1.0.106';window.__ctOfficialVersion='1.0.106';"),'runtime version');
ok(js.includes("const REVISION='r315-official-1.0.106';"),'revision');
ok(js.indexOf('window.__ctR315EarlyCapture=true')<js.indexOf('window.__ctR314EarlyCapture=true'),'r315 capture is not first');
ok(js.includes("window.__ctR315='restore-approved-discover+remove-legacy-f1+restore-profile-stat-contract'"),'r315 marker');
ok(js.includes("window.__ctR309.buildForYou"),'Pra Voce r309 owner not restored');
ok(js.includes("window.__ctR288Test.loadTop10"),'Top10 r288 owner not restored');
ok(js.includes('Top 10 Séries')&&js.includes('Top 10 Filmes'),'Top10 two rails missing from bundle');
ok(js.includes("const TABS=[['foryou','Pra você'],['top10','Top 10'],['trending','Em alta'],['popular','Populares'],['new','Novidades'],['releases','Lançamentos'],['anticipated','Mais Aguardados'],['top','Mais bem avaliados'],['calendar','Calendário']]"),'nine tabs missing');
ok(js.includes("STRICT=new Set(['trending','popular','new','releases','anticipated','top'])"),'strict six mismatch');
ok(js.includes('data-ct315-action="watchlist"')&&js.includes('data-ct315-action="seen"'),'approved public dual actions missing');
ok(js.includes("rpc315('cinetracker_sport_stats_v1',{})"),'live sports stats RPC missing');
ok(js.includes('window.__ctR238ProfileStats'),'r238 profile order missing');
ok(js.includes('window.__ctV114SyncStats'),'unified stats collapse missing');
ok(js.includes('window.__ctR299Test.decorateProfile299'),'sports history buttons missing');
ok(js.includes('[data-ct263-f1-watch-panel],.ct263-f1-watch-panel{display:none!important}'),'legacy F1 panel CSS barrier missing');
ok(r.discover_top10==='all-providers+series+movies','release Top10 contract');
ok(r.discover_foryou_owner==='r309-approved-actions'&&r.discover_foryou_actions==='watchlist+seen+swap','release Pra Voce contract');
ok(r.discover_public_exclusion==='seen+watchlist+alias-before-markup'&&r.discover_public_actions==='watchlist+seen','release public contract');
ok(r.f1_legacy_watch_panel===false,'legacy F1 panel release flag');
ok(r.profile_stats_order==='r238-approved'&&r.profile_sports_stats_source==='cinetracker_sport_stats_v1'&&r.profile_stats_collapse==='main+sports-unified','profile release contract');
ok(r.profile_watchlist_stats==='static-no-chevron-no-modal','Watchlist stats contract');
ok(r.android==='1.0.20/10062','Android changed');
console.log('R315_STATIC_OK approved Discover + Top10 two rails + F1 cleanup + Profile restored');
