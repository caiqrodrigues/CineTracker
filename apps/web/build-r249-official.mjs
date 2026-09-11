import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r249.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
const [js,css,html,releaseRaw]=await Promise.all([
 readFile(resolve(dist,'app-v249.js'),'utf8'),readFile(resolve(dist,'app-v249.css'),'utf8'),readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'release.json'),'utf8')
]);
const release=JSON.parse(releaseRaw),must=(s,x,label=x)=>{if(!s.includes(x))throw new Error('r249 official missing '+label)};
for(const marker of [
 "window.__ctR249='single-authority-current-ui'",
 "window.__ctR249Following='watched-frontier-new-release-wins'",
 "window.__ctR249Discover='atomic-latest-request-generation'",
 "window.__ctR249Sports='canonical-four-tabs-no-legacy-rpc'",
 "window.__ctR249F1='persistent-collapse-event-driven'",
 "window.__ctR249Profile='single-statistics-owner'",
 "window.__ctR249Horizontal='local-x-only-global-x-clipped'",
 "window.__ctR249LegacyCurrentObserverDisabled=true",
 "window.__ctR249LegacyBindingObserverDisabled=true"
])must(js,marker,marker);
if(js.includes('cinetracker_sports_events_v0997'))throw new Error('r249 official contains removed sports RPC');
const tail=js.slice(js.indexOf("window.__ctR248='current-following-complete-ui-authority'"));
if(tail.includes('observer.observe(document.documentElement,{childList:true,subtree:true});'))throw new Error('r249 official still attaches r248 current-ui observer');
if(tail.includes("new MutationObserver(()=>{cancelAnimationFrame(raf);raf=requestAnimationFrame(cleanLegacy)}).observe(document.documentElement"))throw new Error('r249 official still attaches r248 state-binding observer');
must(js,"window.__ctWebBuild='1.0.40';window.__ctOfficialVersion='1.0.40';",'1.0.40 build identity');
must(js,"const REVISION='r249-official-1.0.40';",'r249 revision');
must(css,'overflow-x:clip!important','global horizontal clip');must(css,'.ct249-xrail','local horizontal rail');
must(html,'app-v249.js','r249 JS asset');must(html,'app-v249.css','r249 CSS asset');
if(release.version!=='1.0.40'||release.revision!=='r249-official-1.0.40')throw new Error('r249 release identity mismatch');
console.log('WEB_1_0_40_OFFICIAL r249 single-authority=validated');
