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
  "window.__ctR295BrowseSelfScopeFix='pending-post-boot-authority';",
  "if(!R||typeof R.decorateBrowseActions!=='function'||typeof paintBrowse263!=='function')return false;",
  "if(!install())queueMicrotask(retry);",
  "window.__ctR295BrowseSelfScopeFix='decorate-browse-host-self-and-descendants';",
  "window.__ctR296='strict-foryou-four-sports-stadium-web-polish'",
  "window.__ctR297='r295-scope-post-boot-hotfix-full-bundle'"
])must(js,x);
if(js.includes("throw new Error('r295 browse self-scope fix missing r295 authority')"))throw new Error('R297_TEST fatal pre-boot scope dependency survived');
must(html,'app-v297.js');
const m=JSON.parse(release);
if(m.version!=='1.0.88'||m.revision!=='r297-official-1.0.88'||m.boot_hotfix!=='r295-browse-scope-deferred-until-paint-authority-exists'||m.full_bundle_boot!=='required-before-production-smoke')throw new Error('R297_TEST release mismatch');
console.log('R297_STATIC_OK r295 browse scope no longer throws before paint authority exists');
