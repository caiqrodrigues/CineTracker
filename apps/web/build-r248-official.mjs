import {readFile,writeFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r248.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let js=await readFile(resolve(dist,'app-v248.js'),'utf8');
const [binding,following]=await Promise.all([
 readFile(resolve(root,'runtime-r248-state-binding.js'),'utf8'),
 readFile(resolve(root,'runtime-r248-following-sports-series.js'),'utf8')
]);
if(!js.includes("window.__ctR248='current-following-complete-ui-authority'"))throw new Error('r248 authority missing before final binding');
if(!following.includes("window.__ctR248Following='mixed-backlog-new-release-and-sports-series'"))throw new Error('r248 following hardening missing');
if(!js.includes('\nboot();'))throw new Error('r248 final boot insertion point missing');
js=js.replace('\nboot();','\n'+binding+'\n'+following+'\nboot();');
await writeFile(resolve(dist,'app-v248.js'),js,'utf8');
console.log('WEB_1_0_39_OFFICIAL r248 state-binding+following=ready');
