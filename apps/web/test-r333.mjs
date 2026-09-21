import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';

if(process.env.CT_R333_SKIP_BUILD!=='1')await import('./build-r333.mjs');

const [js,html,rRaw]=await Promise.all([
 readFile(resolve('dist/app-v333.js'),'utf8'),
 readFile(resolve('dist/index.html'),'utf8'),
 readFile(resolve('dist/release.json'),'utf8')
]);

const r=JSON.parse(rRaw);
const ok=(v,m)=>{if(!v)throw new Error('R333_STATIC '+m)};

ok(r.version==='1.0.124'&&r.revision==='r333-official-1.0.124','identity');
ok(html.includes('app-v333.js')&&html.includes('app-v333.css'),'assets');
ok(js.includes("window.__ctR333Marker='discover-standard-cards+single-row-actions+compact-top10+clean-tabbar'"),'runtime marker');
ok(js.includes('cinetracker_discover_filter_v327'),'v327 filter authority missing');
ok(js.includes('--ct333-card-w:154px'),'standard card variable missing');
ok(js.includes('@media(min-width:1100px){[data-ct319-discover],[data-ct288-discover]{--ct333-card-w:176px}}'),'desktop 176 width missing');
ok(js.includes('[data-ct319-next],[data-ct319-filter],[data-ct288-tab-next],[data-ct288-filter]{display:none!important}'),'right controls not removed');
ok(js.includes('.ct288-top-name{display:none!important'),'duplicated provider label not hidden');
ok(js.includes('grid-column:auto!important'),'swap legacy grid override missing');
ok(js.includes('data-ct333-fy-kind'),'Pra voce inline filters missing');
ok(js.includes('flex-flow:row nowrap!important'),'single-row action contract missing');
ok(r.discover_filter_authority==='cinetracker_discover_filter_v327','release filter authority');
ok(r.discover_foryou_layout==='standard-176-desktop-154-mobile-side-by-side','release ForYou layout');
ok(r.discover_foryou_actions==='three-buttons-single-row-inside-card-width','release ForYou actions');
ok(r.discover_public_actions==='two-buttons-single-row-inside-card-width','release public actions');
ok(r.discover_tabbar==='right-next+global-filter-removed','release tabbar');
ok(r.discover_top10_provider_label==='duplicate-selected-name-removed','release Top10 label');
ok(r.home_changes==='none-r333'&&r.profile_changes==='none-r333'&&r.sports_changes==='none-r333'&&r.f1_changes==='none-r333','scope drift');
ok(r.android==='1.0.20/10062','Android changed');

console.log('R333_STATIC_OK');
