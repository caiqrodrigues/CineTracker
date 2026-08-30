import { readFile, writeFile, rm } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const root=resolve(process.cwd());
const distIndex=resolve(root,'dist/index.html');
let distHtml=await readFile(distIndex,'utf8');
// Normalize cache-busted root JS tags for the proven R3 inliner.
distHtml=distHtml.replace(/(<script\s+src="\/[^"?#]+)(?:\?[^"#]*)?(?:#[^"]*)?("><\/script>)/g,'$1$2');
await writeFile(distIndex,distHtml,'utf8');

// Reuse only the stable 0.99.7.2 R3 packaging phase (copy, inline, Android CSS/
// bridge). Its tail contains assertions tied to an older Web UI and must not
// gate the r151 APK. Current-version assertions are below and are stricter for
// r150/r150b/r151.
const legacyPath=resolve(root,'scripts/prepare-android-v0997.mjs');
const tempPath=resolve(root,'scripts/.tmp-prepare-android-v09973-r3-core.mjs');
const legacy=await readFile(legacyPath,'utf8');
const cutMarker="await writeFile(indexPath,html,'utf8');";
const cut=legacy.indexOf(cutMarker);
if(cut<0)throw new Error('Android 0.99.7.3: R3 packaging boundary not found');
const core=legacy.slice(0,cut+cutMarker.length)+"\nconsole.log('ANDROID_09973_R3_CORE_PACKAGED');\n";
await writeFile(tempPath,core,'utf8');
try{await import(pathToFileURL(tempPath).href+`?v=${Date.now()}`)}finally{await rm(tempPath,{force:true})}

const indexPath=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(indexPath,'utf8');
html=html
  .replaceAll('android-v0.99.7.2-ui-polish-r3','android-v0.99.7.3-r151-library-sync')
  .replaceAll("window.__ctAndroidBuild='0.99.7.2'","window.__ctAndroidBuild='0.99.7.3'")
  .replaceAll('v09972-android-ui-polish-r3','v09973-r151-library-sync');
await writeFile(indexPath,html,'utf8');

for(const marker of[
  'data-ct-inline="patch-v103-v0994-session-gate.js"',
  'void preloadRoute994(target);',
  "window.__ct0997R150Loaded",
  "window.__ct0997R150bLoaded",
  "window.__ct0997R151Loaded",
  "window.__ct0997R151='r151-library-identity-reconcile'",
  "window.__ct151Scope='seen+watchlist+progress'",
  'ct-reconcile-library-user',
  'cinetracker_calendar_watchlist_v0997',
  "cinetracker:app-foreground",
  "event==='postgres_changes'",
  'Sincronizar pendentes',
  'Revalidar tudo',
  'ct-android-cast-more',
  'ct-android-actors-more',
  'ct-android-action-grid'
])if(!html.includes(marker))throw new Error(`Android 0.99.7.3: embedded runtime missing ${marker}`);

for(const forbidden of[
  "if(t==='profile')return renderProfile99()",
  "if(v==='profile'||v==='history')renderProfile99()",
  'priority=visible-posters'
])if(html.includes(forbidden))throw new Error(`Android 0.99.7.3: forbidden legacy behavior ${forbidden}`);

if(!html.includes("window.__ctAndroidBundle='android-v0.99.7.3-r151-library-sync'"))throw new Error('Android 0.99.7.3: bundle marker missing');
if(html.includes('<script src="/'))throw new Error('Android 0.99.7.3: root JS dependency remained after inlining');
console.log('ANDROID_09973_PREPARED r150=calendar r150b=realtime r151=library-identity-covers native=foreground r3=preserved');
