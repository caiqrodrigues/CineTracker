import {readFile} from 'node:fs/promises';
await import('./build-r297-official.mjs');
const [js,html,release]=await Promise.all([
  readFile('dist/app-v297.js','utf8'),
  readFile('dist/index.html','utf8'),
  readFile('dist/release.json','utf8')
]);
const must=(s,x)=>{if(!s.includes(x))throw new Error('R297_TEST missing '+x)};
for(const x of[
  "window.__ctR295='discover-personal-authority-calendar-daily-actions';",
  "window.__ctR295BrowseSelfScopeFix='decorate-browse-host-self-and-descendants';",
  "if(typeof window.__ctR288PaintBrowse==='function')window.__ctR288PaintBrowse=wrap(window.__ctR288PaintBrowse);",
  'loadCalendarRows,crispDaily,decorateBrowseActions',
  "window.__ctR296='strict-foryou-four-sports-stadium-web-polish'",
  "window.__ctR297DiscoverBridge='r288-live-owners+r295-personal+r296-strict';",
  'liveBrowse.__ctR297R295Browse=true;',
  'liveForYou.__ctR297R295R296ForYou=true;',
  'liveLoad.__ctR297R295Load=true;',
  "window.__ctR297='r288-live-owner-hotfix-full-bundle'"
])must(js,x);
if(js.includes("throw new Error('r295 browse self-scope fix missing r295 authority')"))throw new Error('R297_TEST fatal pre-boot scope dependency survived');
must(html,'app-v297.js');
const m=JSON.parse(release);
if(m.version!=='1.0.88'||m.revision!=='r297-official-1.0.88'||m.boot_hotfix!=='r295-scope-no-fatal-preboot+r288-live-owner-bridge'||m.discover_live_owner_bridge!=='r295-personal+r296-strict-on-r288-live-owners'||m.full_bundle_boot!=='required-before-production-smoke')throw new Error('R297_TEST release mismatch');
console.log('R297_STATIC_OK no fatal pre-boot scope throw and r295/r296 are connected to r288 live Discover owners');
