import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
await import('./build-r294.mjs');
const dist=resolve('dist');
const [html,js,css,release,sw]=await Promise.all(['index.html','app-v294.js','app-v294.css','release.json','service-worker.js'].map(f=>readFile(resolve(dist,f),'utf8'))),must=(s,x)=>{if(!s.includes(x))throw new Error('r294 official missing '+x)};
for(const x of["window.__ctWebBuild='1.0.85';window.__ctOfficialVersion='1.0.85';","const REVISION='r294-official-1.0.85';","window.__ctR293='discover-navigation-foryou-actions-authority'","window.__ctR294='discover-density-scroll-order-top10-ten-up'","158x237-desktop-154x231-mobile","ten-up-at-1920-reference","content-then-actions-then-scrollbar"])must(js,x);
must(html,'app-v294.js');must(html,'app-v294.css');must(css,'overflow-x:hidden');const m=JSON.parse(release);if(m.version!=='1.0.85'||m.revision!=='r294-official-1.0.85'||m.discover_card_geometry!=='158x237-desktop-154x231-mobile'||m.discover_top10!=='ten-up-at-1920-reference'||m.discover_vertical_density!=='compact-copy-footer-scrollbar'||m.discover_action_order!=='content-actions-scrollbar'||m.android!=='1.0.20/10062')throw new Error('r294 release identity');must(sw,"const CACHE='ct-web-1.0.85-r294';");console.log('WEB_1_0_85_OFFICIAL_OK r294 compact density + ten-up Top 10 + actions above scrollbar; Android preserved');
