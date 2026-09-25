import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
if(!process.env.CT_R367_SKIP_BUILD)await import('./build-r367.mjs');
const [html,js,sw,releaseRaw]=await Promise.all([
 readFile(resolve('dist/index.html'),'utf8'),readFile(resolve('dist/app-v367.js'),'utf8'),readFile(resolve('dist/service-worker.js'),'utf8'),readFile(resolve('dist/release.json'),'utf8')
]);
const release=JSON.parse(releaseRaw);
for(const x of ["window.__ctR367Marker='foryou-single-final-owner+state-derived-buttons+clicked-slot-only'","dataset.ct336SwapOnly=name","window.__ctR336EarlyHandle=early","grid-template-columns"])if(!js.includes(x))throw new Error('r367 missing '+x);
if(!html.includes('app-v367.js')||!sw.includes('ct-web-1.0.158-r367'))throw new Error('r367 asset/cache identity mismatch');
if(release.version!=='1.0.158'||release.revision!=='r367-official-1.0.158')throw new Error('r367 release mismatch');
console.log('WEB_R367_TEST_OK');