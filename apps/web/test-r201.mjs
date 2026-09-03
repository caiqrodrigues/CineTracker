import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
const root=resolve(process.cwd());
const [src,js,html,release]=await Promise.all([
  readFile(resolve(root,'runtime-r201-sports-discover-filter.js'),'utf8'),
  readFile(resolve(root,'dist/app-v201.js'),'utf8'),
  readFile(resolve(root,'dist/index.html'),'utf8'),
  readFile(resolve(root,'dist/release.json'),'utf8')
]);
for(const x of [
  "window.__ctR201Sports='remove-summary-time-empty-bars-profile-stats-only';",
  "window.__ctR201Discover='filter-trigger-right-of-global-search';",
  '.sports-summary-r159','[data-sports-time-banner]','ct201-discover-filter-button',
  'data-ct201-discover-search-row','row.appendChild(trigger);row.appendChild(panel)',
  "panel.previousElementSibling?.classList?.contains('ct-mini-filter-trigger')"
])if(!src.includes(x)||!js.includes(x))throw new Error('r201 marker/logic missing '+x);
if(!js.includes("const REVISION='r201-sports-discover-filter';"))throw new Error('r201 revision missing');
if(!html.includes('app-v201.js')||!html.includes('app-v201.css'))throw new Error('r201 assets not wired');
if(!release.includes('"revision":"r201-sports-discover-filter"'))throw new Error('r201 release missing');
if(js.includes('app-v200.js'))throw new Error('stale r200 asset reference in assembled JS');
console.log('WEB_R201_TEST_OK sports=profile-only discover-filter=search-right duplicate-safe=true');
