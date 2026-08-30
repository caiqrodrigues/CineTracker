import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root=resolve(process.cwd());
const distIndex=resolve(root,'dist/index.html');
let distHtml=await readFile(distIndex,'utf8');
// The legacy Android packager only matches root JS tags without cache-busting
// query strings. Normalize the ephemeral build output before delegating to it.
distHtml=distHtml.replace(/(<script\s+src="\/[^"?#]+)(?:\?[^"#]*)?(?:#[^"]*)?("><\/script>)/g,'$1$2');
await writeFile(distIndex,distHtml,'utf8');

await import('./prepare-android-v0997.mjs');

const indexPath=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(indexPath,'utf8');
html=html
  .replaceAll('android-v0.99.7.2-ui-polish-r3','android-v0.99.7.3-r151-library-sync')
  .replaceAll("window.__ctAndroidBuild='0.99.7.2'","window.__ctAndroidBuild='0.99.7.3'")
  .replaceAll('v09972-android-ui-polish-r3','v09973-r151-library-sync');
await writeFile(indexPath,html,'utf8');

for(const marker of[
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
  'Revalidar tudo'
])if(!html.includes(marker))throw new Error(`Android 0.99.7.3: embedded runtime missing ${marker}`);

if(!html.includes("window.__ctAndroidBundle='android-v0.99.7.3-r151-library-sync'"))throw new Error('Android 0.99.7.3: bundle marker missing');
if(html.includes('<script src="/'))throw new Error('Android 0.99.7.3: root JS dependency remained after inlining');
console.log('ANDROID_09973_PREPARED r150=calendar r150b=realtime r151=library-identity-covers native=foreground');
