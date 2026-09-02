import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=dirname(fileURLToPath(import.meta.url));
const [js,html,release,patch]=await Promise.all([
  readFile(resolve(root,'dist/app-v198.js'),'utf8'),readFile(resolve(root,'dist/index.html'),'utf8'),readFile(resolve(root,'dist/release.json'),'utf8'),readFile(resolve(root,'runtime-r198-minimal-filters-real.js'),'utf8')
]);
function must(v,msg){if(!v)throw new Error('Web r198 test failed: '+msg)}
must(js.includes("const REVISION='r198-real-minimal-filters';"),'revision missing');
must(js.includes("window.__ctR198Web='deterministic-real-filter-groups';"),'r198 marker missing');
for(const m of ['.ct-r180-type-filters','[data-discover-type]','[data-sport]','data-ct198-filter','data-ct-mini-open','ct198-filter-trigger'])must(patch.includes(m),'real filter contract missing '+m);
must(patch.includes('[data-ct198-filter="1"][data-ct-mini-open="0"]{display:none!important}'),'closed filters are not forced hidden');
must(patch.includes("g.querySelector('[data-discover-tab],[data-sports-tab],[data-home-tab]')"),'navigation exclusion missing');
must(html.includes('app-v198.js'),'index does not point to r198');
must(JSON.parse(release).revision==='r198-real-minimal-filters','release revision wrong');
must(!patch.includes('statsMode'),'deferred stats category mode was added');
console.log('WEB_R198_TESTS_OK filters=deterministic-real-groups stats-mode=not-added');
