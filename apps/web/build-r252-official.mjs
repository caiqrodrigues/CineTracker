import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r252.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
const [js,css,html,release]=await Promise.all([
 readFile(resolve(dist,'app-v252.js'),'utf8'),readFile(resolve(dist,'app-v252.css'),'utf8'),readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'release.json'),'utf8')
]);
for(const x of ["window.__ctR252='source-ui-recovery-logic-only'","window.__ctR252UI='r248-native-structure-preserved'","window.__ctR248F1='jolpica-six-tabs-persistent-collapse'","window.__ctR248Profile='one-stable-statistics-group'","window.__ctR252Configs='immediate-shell-background-profile'"])if(!js.includes(x))throw new Error('r252 official missing '+x);
if(js.includes("window.__ctR251='video-ground-truth-direct-renderers'"))throw new Error('r251 direct renderer authority leaked into r252');
if(js.includes('cinetracker_sports_events_v0997'))throw new Error('retired sports events RPC leaked into r252');
if(!css.includes('r252 — source UI preserved'))throw new Error('r252 CSS identity missing');
if(!html.includes('app-v252.js')||!html.includes('app-v252.css'))throw new Error('r252 HTML assets missing');
if(!release.includes('r252-official-1.0.43'))throw new Error('r252 release identity missing');
console.log('WEB_1_0_43_OFFICIAL r252 source-ui-recovery=verified');
