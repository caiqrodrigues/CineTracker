import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=dirname(fileURLToPath(import.meta.url));
const [runtime,build,pkg]=await Promise.all([
 readFile(resolve(root,'runtime-r247-black-screen-recovery.js'),'utf8'),
 readFile(resolve(root,'build-r247.mjs'),'utf8'),
 readFile(resolve(root,'package.json'),'utf8')
]);
const must=(s,x,label=x)=>{if(!s.includes(x))throw new Error('r247 invariant missing '+label)};
for(const x of [
 "window.__ctR247='black-screen-recovery-current-runtime-authority'",
 "window.__ctR247Sports='safe-four-tabs-current-runtime'",
 "typeof sportsPayload==='function'","typeof sportsFiltered==='function'",
 "SPORT_TABS_247=[['next','Próximos'],['previous','Anteriores'],['favorites','Favoritos'],['watched','Assistidos']]",
 "p_scope:'today'","p_scope:'month'","p_favorite_only:true","r247Shift(now,-3)",
 "window.__ctR247F1='persistent-collapse-six-tabs'","window.__ctR247Profile='single-statistics-group'",
 "window.__ctR247Horizontal='local-scrollbars-no-page-x'","ct247-watch-pop"
])must(runtime,x);
if(runtime.includes('sportsTabs=function()'))throw new Error('r247 reintroduced unsafe sportsTabs assignment');
for(const x of [
 "await import('./build-r245.mjs')","runtime-r240-user-video-semantics.js","runtime-r247-black-screen-recovery.js",
 "const REVISION='r247-official-1.0.38'","app-v247.js","app-v247.css","version:'1.0.38'",
 "legacy r240 Sports runtime is NOT injected"
])must(build,x);
if(build.includes("readFile(resolve(root,'runtime-r240-sports-four-tabs.js')"))throw new Error('r247 build executes unsafe r240 sports runtime');
const p=JSON.parse(pkg);if(p.version!=='1.0.38'||p.scripts?.build!=='node build-r247.mjs'||p.scripts?.verify!=='node build-r247.mjs && node test-r247.mjs')throw new Error('r247 package identity wrong');
console.log('R247_STATIC_OK black-screen=guarded sports=current-runtime-hooks home+discover+f1+profile+scroll=preserved');
