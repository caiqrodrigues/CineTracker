import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
await import('./build-r295.mjs');
const dist=resolve('dist');
const [html,js,css,release,sw]=await Promise.all(['index.html','app-v295.js','app-v295.css','release.json','service-worker.js'].map(f=>readFile(resolve(dist,f),'utf8'))),must=(s,x)=>{if(!s.includes(x))throw new Error('r295 official missing '+x)};
for(const x of["window.__ctWebBuild='1.0.86';window.__ctOfficialVersion='1.0.86';","const REVISION='r295-official-1.0.86';","window.__ctR294='discover-density-scroll-order-top10-ten-up'","window.__ctR295='discover-single-owner-fast-tabs-no-releases'","foryou-top10-trending-popular-new-anticipated-top-calendar","single-owner-stable-shell-no-mid-session-rebuild","cache-first-no-loading-reset"])must(js,x);
if(js.includes("['releases','Lançamentos']"))throw new Error('r295 legacy Lançamentos tab source survived');
if(js.includes("observer.observe(document.documentElement,{subtree:true,childList:true});"))throw new Error('r295 global r293 observer survived');
must(html,'app-v295.js');must(html,'app-v295.css');must(css,'overflow-x:hidden');const m=JSON.parse(release);if(m.version!=='1.0.86'||m.revision!=='r295-official-1.0.86'||m.discover_releases_tab!=='removed-at-source'||m.discover_renderer!=='single-owner-stable-shell'||m.discover_switching!=='cache-first-no-loading-reset'||m.android!=='1.0.20/10062')throw new Error('r295 release identity');must(sw,"const CACHE='ct-web-1.0.86-r295';");console.log('WEB_1_0_86_OFFICIAL_OK r295 stable Discover owner + instant cached tabs + no Lançamentos; Android preserved');
