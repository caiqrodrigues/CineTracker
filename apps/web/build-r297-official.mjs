import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
await import('./build-r297.mjs');
const dist=resolve('dist');
const [html,js,css,release,sw]=await Promise.all(['index.html','app-v297.js','app-v297.css','release.json','service-worker.js'].map(f=>readFile(resolve(dist,f),'utf8')));
const must=(s,x)=>{if(!s.includes(x))throw new Error('r297 official missing '+x)};
for(const x of[
  "window.__ctWebBuild='1.0.88';window.__ctOfficialVersion='1.0.88';",
  "const REVISION='r297-official-1.0.88';",
  "window.__ctR295BrowseSelfScopeFix='decorate-browse-host-self-and-descendants';",
  'loadCalendarRows,crispDaily,decorateBrowseActions',
  "window.__ctR296='strict-foryou-four-sports-stadium-web-polish'",
  "window.__ctR297DiscoverBridge='r288-live-owners+r295-personal+r296-strict';",
  'liveBrowse.__ctR297R295Browse=true;',
  'liveForYou.__ctR297R295R296ForYou=true;',
  'liveLoad.__ctR297R295Load=true;',
  "window.__ctR297='r288-live-owner-hotfix-full-bundle'"
])must(js,x);
if(js.includes("throw new Error('r295 browse self-scope fix missing r295 authority')"))throw new Error('r297 official still contains fatal pre-boot r295 scope throw');
must(html,'app-v297.js');must(html,'app-v297.css');must(css,'r297 — reconnect r295/r296 Discover logic to the real r288 live owners');
const m=JSON.parse(release);
if(m.version!=='1.0.88'||m.revision!=='r297-official-1.0.88'||m.boot_hotfix!=='r295-scope-no-fatal-preboot+r288-live-owner-bridge'||m.discover_live_owner_bridge!=='r295-personal+r296-strict-on-r288-live-owners'||m.android!=='1.0.20/10062')throw new Error('r297 release identity');
must(sw,"const CACHE='ct-web-1.0.88-r297';");
console.log('WEB_1_0_88_OFFICIAL_OK r297 full live-owner Discover bridge + boot hotfix; Android preserved');
