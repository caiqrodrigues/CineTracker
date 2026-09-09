import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
const [js,html,sw,release]=await Promise.all([
 readFile(resolve(dist,'app-v233.js'),'utf8'),readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(dist,'release.json'),'utf8')
]);
const must=[
 "const REVISION='r233-official-1.0.25';",
 "window.__ctWebBuild='1.0.25';window.__ctOfficialVersion='1.0.25';",
 "window.__ctR233V125='system-stability-event-driven-no-competing-observers'",
 "window.__ctV125Home='live-episode-revalidation'",
 "window.__ctV125Discover='event-driven-single-normalizer'",
 "window.__ctV125Sports='event-driven-single-action-authority'",
 "window.__ctV125Watchlist='full-rows-no-tmdb-drop'",
 'function revalidateHome233()',
 'function watchRows233(d,kind)',
 'function normalizeDiscover233()',
 'function normalizeSports233()'
];
for(const x of must)if(!js.includes(x))throw new Error('missing '+x);
const banned=[
 'setInterval(sync,700)',
 'new MutationObserver(sync117)',
 'new MutationObserver(sync119)',
 'new MutationObserver(sync121)',
 "new MutationObserver(sync).observe(q('#app')||document.documentElement,{subtree:true,childList:true})",
 "new MutationObserver(sync).observe(q('#app')||document.documentElement,{subtree:true,childList:true,characterData:true})",
 "new MutationObserver(queue).observe(q('#app')||document.documentElement,{subtree:true,childList:true,characterData:true})",
 "new MutationObserver(queue).observe(document.querySelector('#app')||document.documentElement,{subtree:true,childList:true})",
 'setInterval(sync,350)','setInterval(sync,1200)','setInterval(queue,1200)','setInterval(guard,500)',"setInterval(()=>void sync(false).catch(()=>{}),1500)"
];
for(const x of banned)if(js.includes(x))throw new Error('legacy polling/observer survived: '+x);
if(!html.includes('app-v233.js')||!html.includes('r233-official-1.0.25'))throw new Error('HTML identity mismatch');
if(!sw.includes("const CACHE='ct-web-1.0.25-r233';"))throw new Error('SW cache identity mismatch');
const r=JSON.parse(release);if(r.version!=='1.0.25'||r.revision!=='r233-official-1.0.25')throw new Error('release identity mismatch');
console.log('TEST_R233_OK no-conflicting-observers no-700ms full-watchlist live-home');
