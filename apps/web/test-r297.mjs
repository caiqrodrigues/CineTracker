import {readFile} from 'node:fs/promises';
await import('./build-r297-official.mjs');
const [js,html,release]=await Promise.all([
  readFile('dist/app-v297.js','utf8'),
  readFile('dist/index.html','utf8'),
  readFile('dist/release.json','utf8')
]);
const must=(s,x)=>{if(!s.includes(x))throw new Error('R297_TEST missing '+x)};
const safe="if(window.__ctR295&&window.__ctR295Test&&typeof window.__ctR295Test.mediaKey==='function'&&typeof window.__ctR295Test.alreadyKnown==='function'&&typeof window.__ctR295Test.suppressBrowseCards==='function'&&typeof window.__ctR295Test.browseCard==='function'&&typeof window.__ctR295Test.decorateBrowseActions==='function')return;";
must(js,safe);
if(js.includes('if(window.__ctR295)return;'))throw new Error('R297_TEST unsafe stale-marker guard survived');
for(const x of[
  "window.__ctR295='discover-personal-authority-calendar-daily-actions';",
  "window.__ctR295BrowseSelfScopeFix='decorate-browse-host-self-and-descendants';",
  "window.__ctR296='strict-foryou-four-sports-stadium-web-polish'",
  "window.__ctR297='r295-boot-authority-hotfix-full-bundle'"
])must(js,x);
must(html,'app-v297.js');
const m=JSON.parse(release);
if(m.version!=='1.0.88'||m.revision!=='r297-official-1.0.88'||m.full_bundle_boot!=='required-before-production-smoke')throw new Error('R297_TEST release mismatch');
console.log('R297_STATIC_OK stale r295 marker cannot bypass authority initialization');
