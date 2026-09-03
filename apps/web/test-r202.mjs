import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
const root=resolve(process.cwd());
const [src,js,html,release]=await Promise.all([
  readFile(resolve(root,'runtime-r202-sports-single-filter.js'),'utf8'),
  readFile(resolve(root,'dist/app-v202.js'),'utf8'),
  readFile(resolve(root,'dist/index.html'),'utf8'),
  readFile(resolve(root,'dist/release.json'),'utf8')
]);
for(const x of [
  "window.__ctR202Sports='remove-standalone-duplicate-filter-events-up';",
  'ct200-sports-filter-button','ct202-events-up','panel.remove();','btn.remove();'
])if(!src.includes(x)||!js.includes(x))throw new Error('r202 missing '+x);
if(!js.includes("const REVISION='r202-sports-single-filter';"))throw new Error('r202 revision missing');
if(!html.includes('app-v202.js')||!html.includes('app-v202.css'))throw new Error('r202 assets not wired');
if(!release.includes('"revision":"r202-sports-single-filter"'))throw new Error('r202 release missing');
console.log('WEB_R202_TEST_OK sports=single-filter events=up');
