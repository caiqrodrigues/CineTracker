import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
const root=resolve(process.cwd());
const [src,js,html,release]=await Promise.all([
  readFile(resolve(root,'runtime-r203-discover-filter-search-row.js'),'utf8'),
  readFile(resolve(root,'dist/app-v203.js'),'utf8'),
  readFile(resolve(root,'dist/index.html'),'utf8'),
  readFile(resolve(root,'dist/release.json'),'utf8')
]);
for(const x of [
  "window.__ctR203Discover='single-filter-trigger-right-of-search-no-orphan';",
  'ct203-discover-search-row','ct203-discover-filter-button','data-ct203-filter','row.appendChild(trigger)'
])if(!src.includes(x)||!js.includes(x))throw new Error('r203 marker missing '+x);
if(!js.includes("const REVISION='r203-discover-filter-search-right';"))throw new Error('r203 revision missing');
if(!html.includes('app-v203.js')||!html.includes('app-v203.css'))throw new Error('r203 assets not wired');
if(!release.includes('"revision":"r203-discover-filter-search-right"'))throw new Error('r203 release missing');
if(!js.includes('remove-standalone-duplicate-filter-events-up'))throw new Error('r202 Sports cleanup not preserved');
console.log('WEB_R203_TEST_OK discover-filter=search-right sports=r202-preserved');
