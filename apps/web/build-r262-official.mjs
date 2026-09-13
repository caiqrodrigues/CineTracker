import {readFile,writeFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r262.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');

/* The provisional RAW/SmackDown sanitizer must never overwrite the canonical result from
   exactWeekly262/applyWeekly262. Patch the generated bundle deterministically so the official
   artifact and browser test exercise the same authority ordering used in production. */
const bundlePath=resolve(dist,'app-v262.js');
let bundle=await readFile(bundlePath,'utf8');
const sanitizeNeedle="if(!row||!weekly262(row)||n262(row?.watched_episodes)<=0)return row;";
const applyNeedle="function applyWeekly262(row,exact){\n if(!row||!exact)return false;";
if(!bundle.includes(sanitizeNeedle)||!bundle.includes(applyNeedle))throw new Error('r262 weekly authority patch target missing');
bundle=bundle.replace(sanitizeNeedle,sanitizeNeedle+"\n if(row?._ct262ExactAuthority)return row;")
             .replace(applyNeedle,applyNeedle+"\n row._ct262ExactAuthority=true;");
await writeFile(bundlePath,bundle,'utf8');

const [html,js,css,release,sw]=await Promise.all(['index.html','app-v262.js','app-v262.css','release.json','service-worker.js'].map(f=>readFile(resolve(dist,f),'utf8')));
const must=(s,x)=>{if(!s.includes(x))throw new Error('r262 official missing '+x)};
for(const x of["window.__ctWebBuild='1.0.53';window.__ctOfficialVersion='1.0.53';","const REVISION='r262-official-1.0.53';","window.__ctR262='real-video-regressions-horizontal-series-sports'","window.__ctR262Home='local-horizontal-buckets+recent-weekly-frontier'","window.__ctR262Discover='standard-2x3-local-rails+resilient-personal-state'","window.__ctR262Sports='page-x-contained+local-match-f1-rails'","window.__ctR262Detail='nonblank-series-recovery'","window.__ctR262Horizontal='page-fixed-component-local-x'","_ct262ExactAuthority"])must(js,x);
for(const x of['.ct262-home-rail','.ct262-media-rail','.ct262-sports-root','.ct262-series-detail','overflow-x:hidden!important'])must(css,x);
must(html,'app-v262.js');must(html,'app-v262.css');must(release,'"version": "1.0.53"');must(release,'"revision": "r262-official-1.0.53"');must(sw,"const CACHE='ct-web-1.0.53-r262';");
console.log('WEB_1_0_53_OFFICIAL_OK r262');
