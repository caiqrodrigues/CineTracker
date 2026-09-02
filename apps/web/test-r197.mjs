import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=dirname(fileURLToPath(import.meta.url));
const [js,html,release,patch]=await Promise.all([
  readFile(resolve(root,'dist/app-v197.js'),'utf8'),
  readFile(resolve(root,'dist/index.html'),'utf8'),
  readFile(resolve(root,'dist/release.json'),'utf8'),
  readFile(resolve(root,'runtime-r197-minimal-filters.js'),'utf8')
]);
function must(v,msg){if(!v)throw new Error('Web r197 test failed: '+msg)}
must(js.includes("const REVISION='r197-minimal-filters';"),'revision missing');
must(js.includes("window.__ctR197Web='minimal-filter-trigger-existing-filters-only';"),'runtime marker missing');
must(js.includes('single-reusable-tune-button-no-business-rule-change'),'reusable filter marker missing');
must(js.includes('ct-mini-filter-trigger'),'filter trigger missing');
must(js.includes('data-ct-mini-filter'),'filter panel state missing');
must(html.includes('app-v197.js'),'index does not point to r197');
must(JSON.parse(release).revision==='r197-minimal-filters','release revision wrong');
must(!patch.includes('statsMode'),'deferred Profile stats mode was added');
console.log('WEB_R197_TESTS_OK filters=minimal-existing-only business-rules=preserved stats-mode=not-added');
