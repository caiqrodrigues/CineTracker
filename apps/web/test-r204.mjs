import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';

// Official 1.0.0 release gate: this file intentionally triggers release-v1.yml on the release branch.
const root=resolve(process.cwd());
const [js,html,release]=await Promise.all([
  readFile(resolve(root,'dist/app-v204.js'),'utf8'),
  readFile(resolve(root,'dist/index.html'),'utf8'),
  readFile(resolve(root,'dist/release.json'),'utf8')
]);

for(const preserved of ['single-filter-trigger-right-of-search-no-orphan','persistent-2x-3x-4x-no-disable','view-more-opens-movie-series-person','remove-standalone-duplicate-filter-events-up'])
  if(!js.includes(preserved))throw new Error('Web 1.0.0 lost '+preserved);
for(const expected of [
  "const REVISION='r204-official-1.0.0';",
  "window.__ctWebBuild='1.0.0';window.__ctOfficialVersion='1.0.0';",
  'CineTracker • v1.0.0 • ${REVISION}',
  "JSON.stringify({version:'1.0.0',revision:REVISION"
])if(!js.includes(expected))throw new Error('Web 1.0.0 missing '+expected);
if(js.includes('CineTracker • v0.99.7 • ${REVISION}'))throw new Error('old visible Web version leaked');
if(!html.includes('app-v204.js')||!html.includes('app-v204.css')||!html.includes('r204-official-1.0.0'))throw new Error('Web 1.0.0 assets not wired');
const data=JSON.parse(release);
if(data.version!=='1.0.0'||data.revision!=='r204-official-1.0.0'||data.status!=='official')throw new Error('release.json identity mismatch');
console.log('WEB_1_0_0_TEST_OK display=1.0.0 base=r203 behavior=preserved');
